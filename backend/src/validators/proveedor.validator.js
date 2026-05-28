const { body, validationResult } = require('express-validator');

exports.proveedorRules = [
    body('nombre').isString().trim().notEmpty().withMessage('Nombre de proveedor obligatorio'),
    body('nit').isString().trim().notEmpty().withMessage('El NIT es obligatorio para contabilidad'),
    body('contacto').optional().isString().withMessage('El contacto debe ser texto')
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};