const { Compra, Producto, Auditoria, sequelize } = require('../models');

const compraController = {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { proveedorId, productoId, cantidad, costo_unitario, metodo_pago } = req.body;
            const totalCompra = cantidad * costo_unitario;

            // 1. Crear la compra
            const nuevaCompra = await Compra.create({ 
                proveedorId, 
                total: totalCompra, 
                metodo_pago, 
                usuarioId: req.user.id 
            }, { transaction: t });

            // 2. Buscar producto DENTRO de la transacción para evitar condiciones de carrera
            const producto = await Producto.findByPk(productoId, { transaction: t });
            if (!producto) throw new Error('Producto no existe');

            // 3. Actualizar stock y costo
            await producto.update({ 
                stock: producto.stock + parseInt(cantidad), 
                costo: costo_unitario 
            }, { transaction: t });

            // 4. Auditoría (RNF-06)
            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'CREAR_COMPRA',
                tabla: 'Compras',
                registroId: nuevaCompra.id,
                detalles: `Compra registrada. Producto: ${producto.nombre}, Cantidad: ${cantidad}, Total: ${totalCompra}`
            }, { transaction: t });

            await t.commit();
            res.status(201).json({ message: 'Compra procesada' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    async list(req, res, next) {
        try {
            const lista = await Compra.findAll({ include: ['Proveedor'] });
            res.json(lista);
        } catch (error) { next(error); }
    },

    async getById(req, res, next) {
        try {
            const compra = await Compra.findByPk(req.params.id, { include: ['Proveedor'] });
            if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
            res.json(compra);
        } catch (error) { next(error); }
    },

    async update(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const compra = await Compra.findByPk(req.params.id, { transaction: t });
            if (!compra) {
                await t.rollback();
                return res.status(404).json({ error: 'Compra no encontrada' });
            }

            await compra.update(req.body, { transaction: t });

            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ACTUALIZAR_COMPRA',
                tabla: 'Compras',
                registroId: req.params.id,
                detalles: `Compra ${req.params.id} actualizada. Cambios: ${JSON.stringify(req.body)}`
            }, { transaction: t });

            await t.commit();
            res.json({ message: 'Compra actualizada' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    },

    async delete(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const compra = await Compra.findByPk(req.params.id, { transaction: t });
            if (!compra) {
                await t.rollback();
                return res.status(404).json({ error: 'Compra no encontrada' });
            }

            // Nota: Si necesitas revertir el stock al eliminar, deberías hacerlo aquí similar a como hiciste en ventas.
            
            await Auditoria.create({
                usuarioId: req.user.id,
                accion: 'ELIMINAR_COMPRA',
                tabla: 'Compras',
                registroId: req.params.id,
                detalles: `Compra eliminada. Total: ${compra.total}`
            }, { transaction: t });

            await compra.destroy({ transaction: t });

            await t.commit();
            res.json({ message: 'Compra eliminada' });
        } catch (error) {
            if (!t.finished) await t.rollback();
            next(error);
        }
    }
};

module.exports = compraController;