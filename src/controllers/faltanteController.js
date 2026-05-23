const { Faltante, Auditoria, sequelize } = require('../models');

const faltanteController = {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { nombre_producto, tipo } = req.body;

            if (!nombre_producto) throw new Error('El nombre del producto es obligatorio');

            // RN-09: Registro puramente informativo. Cero afectación a stock.
            const nuevo = await Faltante.create({
                nombre_producto: nombre_producto.trim(),
                tipo,
                estado: 'Pendiente'
            }, { transaction: t });

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'CREAR_FALTANTE',
                tabla: 'Faltantes',
                registroId: nuevo.id,
                detalles: `Faltante registrado: "${nombre_producto.trim()}" (Tipo: ${tipo})`
            }, { transaction: t });

            await t.commit();
            res.status(201).json(nuevo);
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    // RN-10: Consolida repetidos normalizando a minúsculas para el reporte de compras
    async listConsolidated(req, res, next) {
        try {
            const reporte = await Faltante.findAll({
                attributes: [
                    [sequelize.fn('LOWER', sequelize.col('nombre_producto')), 'producto_normalizado'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'veces_solicitado'],
                    [sequelize.fn('MAX', sequelize.col('createdAt')), 'ultima_solicitud']
                ],
                where: { estado: 'Pendiente' },
                group: [sequelize.fn('LOWER', sequelize.col('nombre_producto'))],
                order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
            });
            res.json(reporte);
        } catch (error) { next(error); }
    },

    async listAll(req, res, next) {
        try {
            const lista = await Faltante.findAll({ order: [['createdAt', 'DESC']] });
            res.json(lista);
        } catch (error) { next(error); }
    },

    async update(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const faltante = await Faltante.findByPk(req.params.id, { transaction: t });
            if (!faltante) {
                await t.rollback();
                return res.status(404).json({ error: 'Registro no encontrado' });
            }

            await faltante.update(req.body, { transaction: t });

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ACTUALIZAR_FALTANTE',
                tabla: 'Faltantes',
                registroId: req.params.id,
                detalles: `Faltante modificado. Estado actual: ${req.body.estado || faltante.estado}`
            }, { transaction: t });

            await t.commit();
            res.json({ message: 'Faltante actualizado' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    async delete(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const faltante = await Faltante.findByPk(req.params.id, { transaction: t });
            if (!faltante) {
                await t.rollback();
                return res.status(404).json({ error: 'Registro no encontrado' });
            }

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ELIMINAR_FALTANTE',
                tabla: 'Faltantes',
                registroId: req.params.id,
                detalles: `Faltante eliminado: ${faltante.nombre_producto}`
            }, { transaction: t });

            // RN-09: Al eliminar tampoco se toca el stock, solo se borra el registro de la lista
            await faltante.destroy({ transaction: t });

            await t.commit();
            res.json({ message: 'Faltante eliminado correctamente' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    }
};

module.exports = faltanteController;