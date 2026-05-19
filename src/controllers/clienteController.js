const { Cliente } = require('../models');

const clienteController = {
    async create(req, res, next) {
        try {
            const nuevo = await Cliente.create(req.body);
            res.status(201).json(nuevo);
        } catch (error) { next(error); }
    },

    async list(req, res, next) {
        try {
            const lista = await Cliente.findAll();
            res.json(lista);
        } catch (error) { next(error); }
    },

    async getById(req, res, next) {
        try {
            const item = await Cliente.findByPk(req.params.id);
            if (!item) return res.status(404).json({ error: 'No encontrado' });
            res.json(item);
        } catch (error) { next(error); }
    },

    async update(req, res, next) {
        try {
            const [updated] = await Cliente.update(req.body, { where: { id: req.params.id } });
            if (!updated) return res.status(404).json({ error: 'No encontrado' });
            res.json({ message: 'Actualizado exitosamente' });
        } catch (error) { next(error); }
    },

    async delete(req, res, next) {
        try {
            const deleted = await Cliente.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: 'No encontrado' });
            res.json({ message: 'Eliminado exitosamente' });
        } catch (error) { next(error); }
    }
};

module.exports = clienteController;