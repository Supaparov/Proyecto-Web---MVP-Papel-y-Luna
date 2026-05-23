// Middleware para sanitizar y validar IDs en parámetros
module.exports = (req, res, next) => {
    // Validar que los IDs en los parámetros sean números válidos
    if (req.params.id && isNaN(req.params.id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    next();
};