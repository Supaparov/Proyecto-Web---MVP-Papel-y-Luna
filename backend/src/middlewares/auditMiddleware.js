const { Auditoria } = require('../models');

const registrarAuditoria = (accion, tabla) => {
    return async (req, res, next) => {
        // Ejecutamos después de que la ruta termine exitosamente
        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    await Auditoria.create({
                        usuarioId: req.user ? req.user.id : null, // Aquí está el 'quién'
                        accion: accion,
                        tabla: tabla,
                        registroId: req.params.id || null,
                        detalles: JSON.stringify(req.body) // El 'qué'
                    });
                } catch (err) {
                    console.error("Error guardando auditoría:", err);
                }
            }
        });
        next();
    };
};

module.exports = registrarAuditoria;