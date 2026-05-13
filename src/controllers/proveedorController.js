const { Proveedor } = require('../models');

const proveedorController = {
    async crear(req, res, next) {
        try {
            const nuevo = await Proveedor.create(req.body);
            res.status(201).json(nuevo);
        } catch (error) {
            next(error);
        }
    },

    async listar(req, res, next) {
        try {
            const proveedores = await Proveedor.findAll();
            res.json(proveedores);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = proveedorController;