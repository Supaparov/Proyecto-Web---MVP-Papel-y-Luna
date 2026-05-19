const { Proveedor } = require('../models');

const proveedorController = {
    async create(req, res, next) {
        try {
            const nuevo = await Proveedor.create(req.body);
            res.status(201).json(nuevo);
        } catch (error) { next(error); }
    },

    async list(req, res, next) {
        try {
            const lista = await Proveedor.findAll();
            res.json(lista);
        } catch (error) { next(error); }
    },

    async getById(req, res, next) {
        try {
            const item = await Proveedor.findByPk(req.params.id);
            if (!item) return res.status(404).json({ error: 'Proveedor no encontrado' });
            res.json(item);
        } catch (error) { next(error); }
    },

    async update(req, res, next) {
        try {
            const [updated] = await Proveedor.update(req.body, { where: { id: req.params.id } });
            if (!updated) return res.status(404).json({ error: 'Proveedor no encontrado' });
            res.json({ message: 'Proveedor actualizado' });
        } catch (error) { next(error); }
    },

    async delete(req, res, next) {
        try {
            const deleted = await Proveedor.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: 'Proveedor no encontrado' });
            res.json({ message: 'Proveedor eliminado' });
        } catch (error) { next(error); }
    }
};

module.exports = proveedorController;