const { body, validationResult } = require('express-validator');

exports.descuentoRules = [
    body('codigo')
        .isString().withMessage('El código debe ser una cadena de texto')
        .trim()
        .notEmpty().withMessage('El código del descuento es obligatorio'),
        
    body('porcentaje')
        .isFloat({ min: 1, max: 100 }).withMessage('El porcentaje debe ser un número entre 1 y 100'),

    body('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser un valor booleano (true/false)')
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};