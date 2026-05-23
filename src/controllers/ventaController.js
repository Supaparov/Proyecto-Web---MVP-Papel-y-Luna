const { Venta, DetalleVenta, Producto, Cliente, Descuento, Auditoria, sequelize } = require('../models');

const ventaController = {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            // Recibimos descuentoId desde el body, igual que los productos seleccionados
            const { clienteId, metodo_pago, items, recibido, descuentoId } = req.body;
            let totalVentaBruto = 0;
            const detalles = [];

            // 1. VALIDAR STOCK Y CALCULAR BRUTO (RNF-03)
            for (const item of items) {
                const producto = await Producto.findByPk(item.productoId, { transaction: t });
                if (!producto || producto.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para: ${producto?.nombre || item.productoId}`);
                }

                totalVentaBruto += producto.precio * item.cantidad;
                detalles.push({ item, producto });
            }

            let totalFinal = totalVentaBruto;
            let infoDescuento = 'Ninguno';

            // 2. APLICAR DESCUENTO SELECCIONADO (RN-08)
            if (descuentoId) {
                const descuento = await Descuento.findByPk(descuentoId, { transaction: t });
                if (!descuento) throw new Error('El descuento seleccionado no existe');

                // CORRECCIÓN: Frenar si el descuento está desactivado
                if (!descuento.activo) throw new Error('El descuento seleccionado no está activo o ya caducó');

                const montoDescuento = (totalVentaBruto * descuento.porcentaje) / 100;
                totalFinal = totalVentaBruto - montoDescuento;
                infoDescuento = `${descuento.codigo} (${descuento.porcentaje}%)`; // Ajustado a 'codigo'
            }

            // 3. CREAR VENTA (Guardamos totalFinal y la FK del descuento)
            const nuevaVenta = await Venta.create({
                clienteId,
                metodo_pago,
                estado: 'cerrada',
                recibido,
                usuarioId: req.user.id,
                total: totalFinal,
                descuentoId: descuentoId || null
            }, { transaction: t });

            // 4. PROCESAR DETALLES Y STOCK OPERATIVO
            for (const { item, producto } of detalles) {
                await DetalleVenta.create({
                    ventaId: nuevaVenta.id,
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    precio_unitario: producto.precio,
                    subtotal: producto.precio * item.cantidad
                }, { transaction: t });

                await producto.decrement('stock', { by: item.cantidad, transaction: t });
            }

            // 5. ACTUALIZAR SALDO (RN-07) - El cliente debe el totalFinal, no el bruto
            if (metodo_pago === 'Debe' && clienteId) {
                const cliente = await Cliente.findByPk(clienteId, { transaction: t });
                if (cliente) await cliente.increment('saldo_pendiente', { by: totalFinal, transaction: t });
            }

            // 6. AUDITORÍA (RNF-06)
            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'CREAR_VENTA',
                tabla: 'Ventas',
                registroId: nuevaVenta.id,
                detalles: `Venta. Bruto: ${totalVentaBruto}. Descuento: ${infoDescuento}. Final: ${totalFinal}`
            }, { transaction: t });

            await t.commit();
            res.status(201).json({ message: 'Venta exitosa', total: totalFinal });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    async list(req, res, next) {
        try {
            // Incluimos Descuento para que el frontend pueda mostrar qué se aplicó
            const lista = await Venta.findAll({ include: [Producto, Cliente, Descuento] });
            res.json(lista);
        } catch (error) { next(error); }
    },

    async getById(req, res, next) {
        try {
            const venta = await Venta.findByPk(req.params.id, {
                include: [DetalleVenta, Producto, Descuento]
            });
            if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
            res.json(venta);
        } catch (error) { next(error); }
    },

    async update(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { estado, notas } = req.body;

            const venta = await Venta.findByPk(id, { transaction: t });
            if (!venta) {
                await t.rollback();
                return res.status(404).json({ error: 'Venta no encontrada' });
            }

            const [updated] = await Venta.update(
                { estado, notas },
                { where: { id }, transaction: t }
            );

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ACTUALIZAR_VENTA',
                tabla: 'Ventas',
                registroId: id,
                detalles: `Cambio de estado: ${venta.estado} -> ${estado}. Notas: ${notas}`
            }, { transaction: t });

            await t.commit();
            res.json({ message: 'Venta actualizada correctamente' });

        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    async delete(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const ventaId = req.params.id;

            const venta = await Venta.findByPk(ventaId, {
                include: [DetalleVenta],
                transaction: t
            });

            if (!venta) {
                await t.rollback();
                return res.status(404).json({ error: 'Venta no encontrada' });
            }

            // 1. Revertimos el inventario (RNF-05)
            for (const detalle of venta.DetalleVentas) {
                const producto = await Producto.findByPk(detalle.productoId, { transaction: t });
                if (producto) {
                    await producto.increment('stock', { by: detalle.cantidad, transaction: t });
                }
            }

            // 2. Revertimos el saldo del cliente (RN-07)
            if (venta.metodo_pago === 'Debe' && venta.clienteId) {
                const cliente = await Cliente.findByPk(venta.clienteId, { transaction: t });
                if (cliente) {
                    await cliente.decrement('saldo_pendiente', { by: venta.total, transaction: t });
                }
            }

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ELIMINAR_VENTA',
                tabla: 'Ventas',
                registroId: ventaId,
                detalles: `Anulación de venta. Total revertido: ${venta.total}`
            }, { transaction: t });

            await venta.destroy({ transaction: t });

            await t.commit();
            res.json({ message: 'Venta anulada y registros revertidos correctamente' });

        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    }
};

module.exports = ventaController;