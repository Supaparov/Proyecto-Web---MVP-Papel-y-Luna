const router = require('express').Router();
const ctrl = require('../controllers/faltanteController');
const { faltanteRules, validate } = require('../validators/faltante.validator');

router.post('/', faltanteRules, validate, ctrl.crear);
router.get('/', ctrl.listar);
router.put('/:id', faltanteRules, validate, ctrl.actualizar);

module.exports = router;