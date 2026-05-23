const { body, validationResult } = require('express-validator');

exports.productoRules = [
    body('nombre').isString().trim().notEmpty().withMessage('Nombre ombligatorio'),
    body('sku').isString().notEmpty().withMessage('El SKU es necesario para inventario'),
    body('precio').isFloat({ min: 100 }).withMessage('El precio debe ser mayor a 100'),
    body('costo').isFloat({ min: 50 }).withMessage('El costo debe ser mayor a 50'),
    body('stock').isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),
    body('categoriaId').isInt().withMessage('Debe vincular una categoría válida')
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};