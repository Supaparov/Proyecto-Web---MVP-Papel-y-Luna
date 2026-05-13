const { Compra, Producto, sequelize } = require('../models');

const compraController = {
    async crear(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { proveedorId, productoId, cantidad, costo_unitario, metodo_pago } = req.body;
            const totalCompra = cantidad * costo_unitario;

            // 1. Registrar el movimiento de caja
            await Compra.create({
                proveedorId,
                total: totalCompra,
                metodo_pago,
                fecha: new Date()
            }, { transaction: t });

            // 2. Aumentar el activo (Stock)
            const producto = await Producto.findByPk(productoId);
            if (!producto) {
                const err = new Error('El producto no existe');
                err.status = 404;
                throw err;
            }

            await producto.update({
                stock: producto.stock + parseInt(cantidad),
                costo: costo_unitario // Actualizamos costo promedio/último
            }, { transaction: t });

            await t.commit();
            res.status(201).json({ message: 'Compra procesada y stock actualizado', total: totalCompra });

        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error); // El errorHandler centralizado responde al cliente
        }
    }
};

module.exports = compraController;