const { body, validationResult } = require('express-validator');

exports.clienteRules = [
    body('nombre')
        .isString().trim().notEmpty().withMessage('El nombre del cliente es obligatorio')
        .isLength({ max: 100 }).withMessage('Nombre demasiado largo'),
    body('saldo_pendiente')
        .optional()
        .isFloat({ min: 0 }).withMessage('El saldo no puede ser negativo')
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};