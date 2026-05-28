const { RequestLog } = require('../models');

module.exports = async (req, res, next) => {
    try {
        await RequestLog.create({
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
        });
    } catch (err) {
        console.error('Error guardando log de auditoría:', err);
    }
    next(); // Pasa al siguiente middleware o controlador
};