const { body, validationResult } = require('express-validator');

exports.faltanteRules = [
    // 1. Reglas de validación para los campos del modelo informativo
    body('nombre_producto')
        .trim()
        .notEmpty().withMessage('El nombre del producto es obligatorio'),
        
    body('tipo')
        .trim()
        .notEmpty().withMessage('El tipo de faltante es obligatorio'),

    body('estado')
        .optional()
        .isIn(['Pendiente', 'Comprado']).withMessage('El estado debe ser Pendiente o Comprado')
    
];

exports.validate = (req, res, next) => {
    // 2. Middleware que frena la petición si express-validator encuentra errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next(); // Si todo está bien, pasa al controlador
};
