const router = require('express').Router();
const ctrl = require('../controllers/faltanteController');
const { faltanteRules, validate } = require('../validators/faltante.validator');

// Registrar faltante (Cajero y Admin)
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'CAJERO']), ctrl.create);

// Ver historial de faltantes y marcar como resuelto (Admin)
router.get('/', authMiddleware, roleMiddleware('ADMIN'), ctrl.list);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), ctrl.update);

module.exports = router;