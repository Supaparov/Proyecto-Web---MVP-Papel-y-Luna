const { Faltante } = require('../models');

const faltanteController = {
    async crear(req, res, next) {
        try {
            const nuevo = await Faltante.create(req.body);
            res.status(201).json(nuevo.toJSON());
        } catch (error) {
            next(error);
        }
    },

    async listar(req, res, next) {
        try {
            const lista = await Faltante.findAll({ order: [['createdAt', 'DESC']] });
            res.json(lista.map(faltante => faltante.toJSON()));
        } catch (error) {
            next(error);
        }
    },

    async actualizar(req, res, next) {
        try {
            const { id } = req.params;
            const [updated] = await Faltante.update(req.body, { where: { id } });
            if (!updated) {
                const err = new Error('Faltante no encontrado');
                err.status = 404;
                return next(err);
            }
            res.json({ message: 'Estado actualizado' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = faltanteController;