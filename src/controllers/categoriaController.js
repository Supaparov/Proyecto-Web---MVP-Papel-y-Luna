const { Categoria } = require('../models');

const categoriaController = {
    // Cambiamos "crear" a "create"
    async create(req, res, next) {
        try {
            const nueva = await Categoria.create(req.body);
            res.status(201).json(nueva.toJSON());
        } catch (error) {
            next(error);
        }
    },

    async list(req, res, next) {
        try {
            const lista = await Categoria.findAll();
            res.json(lista.map(categoria => categoria.toJSON()));
        } catch (error) {
            next(error);
        }
    },

    // Agrega este que te falta para que no rompa el router
    async getById(req, res, next) {
        try {
            const categoria = await Categoria.findByPk(req.params.id);
            if (!categoria) return res.status(404).json({ error: 'No encontrada' });
            res.json(categoria.toJSON());
        } catch (error) {
            next(error);
        }
    },

    // Agrega los que te faltan para update y delete también
    async update(req, res, next) {
        try {
            const categoria = await Categoria.findByPk(req.params.id);
            if (!categoria) return res.status(404).json({ error: 'No encontrada' });
            await categoria.update(req.body);
            res.json(categoria.toJSON());
        } catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const categoria = await Categoria.findByPk(req.params.id);
            if (!categoria) return res.status(404).json({ error: 'No encontrada' });
            await categoria.destroy();
            res.json({ message: 'Eliminada correctamente' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = categoriaController;