const router = require('express').Router();
const ctrl = require('../controllers/faltanteController');
const { faltanteRules, validate } = require('../validators/faltante.validator');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación
const roleMiddleware = require('../middlewares/roleMiddleware'); // Middleware de autorización por roles

// Registrar faltante (Cajero y Admin)
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'CAJERO']), ctrl.create);

// Ver historial de faltantes y marcar como resuelto (Admin)
router.get('/', authMiddleware, roleMiddleware('ADMIN'), ctrl.list);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), ctrl.update);

module.exports = router;