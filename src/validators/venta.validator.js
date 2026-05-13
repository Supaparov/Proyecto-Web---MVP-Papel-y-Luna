const { body, validationResult } = require('express-validator');

exports.ventaRules = [
    body('metodo_pago').isIn(['Efectivo', 'Transferencia', 'Debe'])
        .withMessage('Método de pago no válido'),
    body('recibido').isFloat({ min: 0 }).withMessage('Monto recibido inválido'),
    body('items').isArray({ min: 1 }).withMessage('La venta debe tener al menos un producto'),
    body('items.*.productoId').isInt().withMessage('ID de producto inválido'),
    body('items.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad mínima es 1')
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};