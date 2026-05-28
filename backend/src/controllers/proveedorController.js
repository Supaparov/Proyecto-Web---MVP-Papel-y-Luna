const { Proveedor, Auditoria, sequelize } = require('../models');

const proveedorController = {
    async create(req, res, next) {
        try {
            const nuevo = await Proveedor.create(req.body);
            res.status(201).json(nuevo);
        } catch (error) { next(error); }
    },

    async list(req, res, next) {
        try {
            const lista = await Proveedor.findAll({ raw: true });
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
        const t = await sequelize.transaction();
        try {
            const proveedor = await Proveedor.findByPk(req.params.id, { transaction: t });
            if (!proveedor) {
                await t.rollback();
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }

            await proveedor.update(req.body, { transaction: t });

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ACTUALIZAR_PROVEEDOR',
                tabla: 'Proveedores',
                registroId: req.params.id,
                detalles: `Proveedor actualizado: ${proveedor.nombre}.`
            }, { transaction: t });

            await t.commit();
            res.json({ message: 'Proveedor actualizado' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    async delete(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const proveedor = await Proveedor.findByPk(req.params.id, { transaction: t });
            if (!proveedor) {
                await t.rollback();
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ELIMINAR_PROVEEDOR',
                tabla: 'Proveedores',
                registroId: req.params.id,
                detalles: `Proveedor eliminado: ${proveedor.nombre}`
            }, { transaction: t });

            await proveedor.destroy({ transaction: t });

            await t.commit();
            res.json({ message: 'Proveedor eliminado' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    }
};

module.exports = proveedorController;