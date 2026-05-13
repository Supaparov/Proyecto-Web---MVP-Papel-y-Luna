const { Categoria } = require('../models');

const categoriaController = {
    async crear(req, res, next) {
        try {
            const nueva = await Categoria.create(req.body);
            res.status(201).json(nueva.toJSON());
        } catch (error) {
            next(error); // Enviamos el error al errorHandler.js
        }
    },

    async listar(req, res, next) {
        try {
            const lista = await Categoria.findAll();
            res.json(lista.map(categoria => categoria.toJSON()));
        } catch (error) {
            next(error);
        }
    }
};

module.exports = categoriaController;