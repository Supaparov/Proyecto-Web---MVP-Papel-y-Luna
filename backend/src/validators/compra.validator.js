const { body, validationResult } = require('express-validator');

exports.compraRules = [
    body('proveedorId').isInt().withMessage('ID de proveedor inválido'),
    body('productoId').isInt().withMessage('ID de producto inválido'),
    body('cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),
    body('costo_unitario').isFloat({ min: 0 }).withMessage('El costo no puede ser negativo'),
    body('metodo_pago')
        .isString()
        .isIn(['Efectivo', 'Nequi', 'En Consignación'])
        .withMessage('El método de pago debe ser Efectivo, Nequi o En Consignación'),
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};