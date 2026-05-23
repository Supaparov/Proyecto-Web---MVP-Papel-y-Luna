const { Descuento, Auditoria, sequelize } = require('../models');

const descuentoController = {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const nuevo = await Descuento.create(req.body, { transaction: t });

            await Auditoria.create({
                  usuarioId: req.user.id,
                accion: 'CREAR_DESCUENTO',
                tabla: 'Descuentos',
                registroId: nuevo.id,
                detalles: `Descuento creado: ${nuevo.nombre} (${nuevo.porcentaje}%)`
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
            // Esto le permite al frontend listar los descuentos para el "sistema de selección"
            const lista = await Descuento.findAll({ where: { activo: true } });
            res.json(lista);
        } catch (error) { next(error); }
    },

    async getById(req, res, next) {
        try {
            const item = await Descuento.findByPk(req.params.id);
            if (!item) return res.status(404).json({ error: 'No encontrado' });
            res.json(item);
        } catch (error) { next(error); }
    },

    async update(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const descuento = await Descuento.findByPk(req.params.id, { transaction: t });
            if (!descuento) {
                await t.rollback();
                return res.status(404).json({ error: 'No encontrado' });
            }

            await descuento.update(req.body, { transaction: t });

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ACTUALIZAR_DESCUENTO',
                tabla: 'Descuentos',
                registroId: req.params.id,
                detalles: `Descuento modificado. Nuevos datos: ${JSON.stringify(req.body)}`
            }, { transaction: t });

            await t.commit();
            res.json({ message: 'Descuento actualizado exitosamente' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    async delete(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const descuento = await Descuento.findByPk(req.params.id, { transaction: t });
            if (!descuento) {
                await t.rollback();
                return res.status(404).json({ error: 'No encontrado' });
            }

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ELIMINAR_DESCUENTO',
                tabla: 'Descuentos',
                registroId: req.params.id,
                detalles: `Descuento eliminado: ${descuento.nombre}`
            }, { transaction: t });

            await descuento.destroy({ transaction: t });

            await t.commit();
            res.json({ message: 'Descuento eliminado' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    }
};

module.exports = descuentoController;