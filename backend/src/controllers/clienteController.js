const { Cliente, Auditoria, sequelize } = require('../models');

const clienteController = {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const nuevo = await Cliente.create(req.body, { transaction: t });
            
            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'CREAR_CLIENTE',
                tabla: 'Clientes',
                registroId: nuevo.id,
                detalles: `Cliente creado: ${nuevo.nombre}`
            }, { transaction: t });

            await t.commit();
            res.status(201).json(nuevo);
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    async list(req, res, next) {
        try {
            const lista = await Cliente.findAll({ raw: true });
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
        const t = await sequelize.transaction();
        try {
            const cliente = await Cliente.findByPk(req.params.id, { transaction: t });
            if (!cliente) {
                await t.rollback();
                return res.status(404).json({ error: 'No encontrado' });
            }

            await cliente.update(req.body, { transaction: t });

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ACTUALIZAR_CLIENTE',
                tabla: 'Clientes',
                registroId: req.params.id,
                detalles: `Cliente actualizado: ${cliente.nombre}. Datos nuevos: ${JSON.stringify(req.body)}`
            }, { transaction: t });

            await t.commit();
            res.json({ message: 'Actualizado exitosamente' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    async delete(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const cliente = await Cliente.findByPk(req.params.id, { transaction: t });
            if (!cliente) {
                await t.rollback();
                return res.status(404).json({ error: 'No encontrado' });
            }

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ELIMINAR_CLIENTE',
                tabla: 'Clientes',
                registroId: req.params.id,
                detalles: `Cliente eliminado: ${cliente.nombre}`
            }, { transaction: t });

            await cliente.destroy({ transaction: t });

            await t.commit();
            res.json({ message: 'Eliminado exitosamente' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    }
};

module.exports = clienteController;