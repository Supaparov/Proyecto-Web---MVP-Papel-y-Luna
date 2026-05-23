const router = require('express').Router();
const ctrl = require('../controllers/faltanteController');
const { faltanteRules, validate } = require('../validators/faltante.validator');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación
const roleMiddleware = require('../middlewares/roleMiddleware'); // Middleware de autorización por roles

router.use(authMiddleware);

// CRUD alineado a los 3 campos del modelo e inyectando express-validator
router.post('/', faltanteRules, validate, ctrl.create);
router.get('/reporte', roleMiddleware(['ADMIN']), ctrl.listConsolidated);
router.get('/', ctrl.listAll);
router.put('/:id', roleMiddleware(['ADMIN']), faltanteRules, validate, ctrl.update);
router.delete('/:id', roleMiddleware(['ADMIN']), ctrl.delete);

module.exports = router;