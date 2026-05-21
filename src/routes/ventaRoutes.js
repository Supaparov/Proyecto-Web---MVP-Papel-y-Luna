const router = require('express').Router();
const ctrl = require('../controllers/ventaController');
const { ventaRules, validate } = require('../validators/venta.validator');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación
const roleMiddleware = require('../middlewares/roleMiddleware'); // Middleware de autorización por roles

// Operación diaria (RF-10 al RF-24)
router.get('/', authMiddleware,roleMiddleware(['ADMIN', 'CAJERO']), ctrl.list);
router.get('/:id', authMiddleware, roleMiddleware(['ADMIN', 'CAJERO']), ctrl.getById);
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'CAJERO']), ventaRules, validate, ctrl.create); 

// Correcciones y Reembolsos (RF-50, RF-60, RF-70)
// Según el requerimiento, estas son acciones administrativas o de corrección avanzada
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), ventaRules, validate, ctrl.update); 
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), ctrl.delete);

module.exports = router;