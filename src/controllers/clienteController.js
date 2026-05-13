const { Cliente } = require('../models');

const clienteController = {
    async crear(req, res, next) {
        try {
            const nuevo = await Cliente.create(req.body);
            res.status(201).json(nuevo.toJSON());
        } catch (error) {
            next(error); 
        }
    },

    async listar(req, res, next) {
        try {
            const clientes = await Cliente.findAll();
            res.json(clientes.map(cliente => cliente.toJSON()));
        } catch (error) {
            next(error);
        }
    }
};

module.exports = clienteController;