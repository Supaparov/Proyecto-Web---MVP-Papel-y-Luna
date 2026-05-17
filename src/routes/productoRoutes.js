const router = require('express').Router();
const ctrl = require('../controllers/productoController');
const { productoRules, validate } = require('../validators/producto.validator');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación
const roleMiddleware = require('../middlewares/roleMiddleware'); // Middleware de autorización por roles

// productoRoutes.js y categoriaRoutes.js (misma estructura de seguridad)
router.get('/', authMiddleware, ctrl.list);
router.get('/:id', authMiddleware, ctrl.getById);

// Acciones críticas (RF-81, RF-82, RF-83)
router.post('/', authMiddleware, roleMiddleware('ADMIN'), ctrl.create);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), ctrl.update);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), ctrl.delete);

module.exports = router;