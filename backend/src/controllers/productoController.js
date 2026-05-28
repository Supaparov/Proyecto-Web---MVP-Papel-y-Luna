const { Producto, Auditoria, sequelize } = require('../models');

const productoController = {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const nuevo = await Producto.create(req.body, { transaction: t });
            
            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'CREAR_PRODUCTO',
                tabla: 'Productos',
                registroId: nuevo.id,
                detalles: `Producto creado: ${nuevo.nombre}`
            }, { transaction: t });

            await t.commit();
            res.status(201).json(nuevo);
        } catch (error) {
            await t.rollback();
            next(error);
        }
    },

    async list(req, res, next) {
        try {
            // Usar raw: true para evitar bug de Sequelize con SQLite y fechas
            const lista = await Producto.findAll({ raw: true });
            res.json(lista);
        } catch (error) { next(error); }
    },

    async getById(req, res, next) {
        try {
            const item = await Producto.findByPk(req.params.id);
            if (!item) return res.status(404).json({ error: 'No encontrado' });
            res.json(item);
        } catch (error) { next(error); }
    },

    async update(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const producto = await Producto.findByPk(req.params.id, { transaction: t });
            if (!producto) {
                await t.rollback();
                return res.status(404).json({ error: 'No encontrado' });
            }

            await producto.update(req.body, { transaction: t });

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ACTUALIZAR_PRODUCTO',
                tabla: 'Productos',
                registroId: req.params.id,
                detalles: `Producto actualizado: ${producto.nombre}. Cambios: ${JSON.stringify(req.body)}`
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
            const producto = await Producto.findByPk(req.params.id, { transaction: t });
            if (!producto) {
                await t.rollback();
                return res.status(404).json({ error: 'No encontrado' });
            }

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ELIMINAR_PRODUCTO',
                tabla: 'Productos',
                registroId: req.params.id,
                detalles: `Producto eliminado: ${producto.nombre}`
            }, { transaction: t });

            await producto.destroy({ transaction: t });

            await t.commit();
            res.json({ message: 'Eliminado exitosamente' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    }
};

module.exports = productoController;