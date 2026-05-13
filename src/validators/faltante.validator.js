const { body, validationResult } = require('express-validator');

exports.faltanteRules = [
    body('nombre_producto')
        .isString().trim().notEmpty().withMessage('Debe indicar qué producto falta'),
    body('tipo')
        .isIn(['agotado', 'pedido_cliente'])
        .withMessage('El tipo debe ser: agotado o pedido_cliente'),
    body('estado')
        .optional()
        .isIn(['pendiente', 'comprado', 'descartado'])
        .withMessage('Estado no válido')
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};