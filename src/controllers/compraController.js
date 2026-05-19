const { Compra, Producto, Proveedor, sequelize } = require('../models');

const compraController = {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { proveedorId, productoId, cantidad, costo_unitario, metodo_pago } = req.body;
            const totalCompra = cantidad * costo_unitario;

            await Compra.create({ proveedorId, total: totalCompra, metodo_pago, usuarioId: req.user.id }, { transaction: t });

            const producto = await Producto.findByPk(productoId);
            if (!producto) throw new Error('Producto no existe');

            await producto.update({ stock: producto.stock + parseInt(cantidad), costo: costo_unitario }, { transaction: t });

            await t.commit();
            res.status(201).json({ message: 'Compra procesada' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    async list(req, res, next) {
        try {
            const lista = await Compra.findAll({ include: [Proveedor] });
            res.json(lista);
        } catch (error) { next(error); }
    },

    async getById(req, res, next) {
        try {
            const compra = await Compra.findByPk(req.params.id, { include: [Proveedor] });
            if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
            res.json(compra);
        } catch (error) { next(error); }
    },

    async update(req, res, next) {
        try {
            const [updated] = await Compra.update(req.body, { where: { id: req.params.id } });
            if (!updated) return res.status(404).json({ error: 'Compra no encontrada' });
            res.json({ message: 'Compra actualizada' });
        } catch (error) { next(error); }
    },
    async delete(req, res, next) {
        try {
            const deleted = await Compra.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: 'Compra no encontrada' });
            res.json({ message: 'Compra eliminada' });
        } catch (error) { next(error); }

    }

    
};

module.exports = compraController;