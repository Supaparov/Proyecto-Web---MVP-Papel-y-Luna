const { Faltante } = require('../models');

const faltanteController = {
    async create(req, res, next) {
        try {
            const nuevo = await Faltante.create({ ...req.body, usuarioId: req.user.id });
            res.status(201).json(nuevo);
        } catch (error) { next(error); }
    },

    async list(req, res, next) {
        try {
            const lista = await Faltante.findAll({ order: [['createdAt', 'DESC']] });
            res.json(lista);
        } catch (error) { next(error); }
    },

    async getById(req, res, next) {
        try {
            const faltante = await Faltante.findByPk(req.params.id);
            if (!faltante) return res.status(404).json({ error: 'No encontrado' });
            res.json(faltante);
        } catch (error) { next(error); }
    },

    async update(req, res, next) {
        try {
            const [updated] = await Faltante.update(req.body, { where: { id: req.params.id } });
            if (!updated) return res.status(404).json({ error: 'No encontrado' });
            res.json({ message: 'Estado actualizado' });
        } catch (error) { next(error); }
    },

    async delete(req, res, next) {
        try {
            await Faltante.destroy({ where: { id: req.params.id } });
            res.json({ message: 'Registro eliminado' });
        } catch (error) { next(error); }
    }
};

module.exports = faltanteController;