const { body, validationResult } = require('express-validator');

exports.categoriaRules = [
    body('nombre')
        .isString().withMessage('El nombre debe ser texto')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser texto')
];

// Función para capturar los errores y frenar la petición
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};