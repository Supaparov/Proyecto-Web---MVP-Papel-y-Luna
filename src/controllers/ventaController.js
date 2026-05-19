const { Venta, DetalleVenta, Producto, Cliente, sequelize } = require('../models');

const ventaController = {
    async create(req, res, next) { // Cambiado de 'crear' a 'create' para coincidir con rutas
        const t = await sequelize.transaction();
        try {
            const { clienteId, metodo_pago, items, recibido } = req.body;
            let totalVenta = 0;

            const nuevaVenta = await Venta.create({
                clienteId, metodo_pago, estado: 'cerrada', recibido, usuarioId: req.user.id
            }, { transaction: t });

            for (const item of items) {
                const producto = await Producto.findByPk(item.productoId);
                if (!producto || producto.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para: ${producto?.nombre || item.productoId}`);
                }
                const subtotal = producto.precio * item.cantidad;
                totalVenta += subtotal;

                await DetalleVenta.create({
                    ventaId: nuevaVenta.id,
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    precio_unitario: producto.precio,
                    subtotal
                }, { transaction: t });

                await producto.update({ stock: producto.stock - item.cantidad }, { transaction: t });
            }

            const cambio = recibido - totalVenta;
            if (metodo_pago === 'Debe' && clienteId) {
                const cliente = await Cliente.findByPk(clienteId);
                if (cliente) await cliente.update({ saldo_pendiente: parseFloat(cliente.saldo_pendiente) + totalVenta }, { transaction: t });
            }

            await nuevaVenta.update({ total: totalVenta, cambio }, { transaction: t });
            await t.commit();
            res.status(201).json({ message: 'Venta exitosa', total: totalVenta, cambio });
        } catch (error) {
            if (!t.finished) await t.rollback();
            error.status = 400;
            next(error); 
        }
    },

    async list(req, res, next) {
        try {
            const lista = await Venta.findAll({ include: [Producto, Cliente] });
            res.json(lista);
        } catch (error) { next(error); }
    },

    async getById(req, res, next) {
        try {
            const venta = await Venta.findByPk(req.params.id, { include: [DetalleVenta, Producto] });
            if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
            res.json(venta);
        } catch (error) { next(error); }
    },
    
    async update(req, res, next) {
        try {
            const { id } = req.params;
            // Definimos qué campos se permiten actualizar (seguridad básica)
            const { estado, notas } = req.body; 

            const [updated] = await Venta.update(
                { estado, notas }, 
                { where: { id } }
            );

            if (!updated) {
                return res.status(404).json({ error: 'Venta no encontrada' });
            }

            res.json({ message: 'Venta actualizada correctamente' });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const deleted = await Venta.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: 'Venta no encontrada' });
            res.json({ message: 'Venta anulada correctamente' });
        } catch (error) { next(error); }
    }
};

module.exports = ventaController;