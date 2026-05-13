const { Venta, DetalleVenta, Producto, Cliente, sequelize } = require('../models');

const ventaController = {
    async crear(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { clienteId, metodo_pago, items, recibido } = req.body;
            let totalVenta = 0;

            const nuevaVenta = await Venta.create({
                clienteId, metodo_pago, estado: 'cerrada', recibido
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
                if (cliente) {
                    await cliente.update({
                        saldo_pendiente: parseFloat(cliente.saldo_pendiente) + totalVenta
                    }, { transaction: t });
                }
            }

            await nuevaVenta.update({ total: totalVenta, cambio }, { transaction: t });
            await t.commit();
            res.status(201).json({ message: 'Venta exitosa', total: totalVenta, cambio });

        } catch (error) {
            if (!t.finished) await t.rollback();
            error.status = 400; // Marcamos como error de solicitud
            next(error); 
        }
    }
};

module.exports = ventaController;