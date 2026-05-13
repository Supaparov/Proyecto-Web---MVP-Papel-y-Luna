const { Producto, Categoria } = require('../models');

const productoController = {
    async crear(req, res, next) {
        try {
            const nuevo = await Producto.create(req.body);
            res.status(201).json(nuevo.toJSON());
        } catch (error) {
            next(error); // Al errorHandler
        }
    },

    async list(req, res, next) {
        try {
            const productos = await Producto.findAll({ include: 'Categoria' });
            res.json(productos.map(producto => producto.toJSON()));
        } catch (error) {
            next(error);
        }
    }
};

module.exports = productoController;