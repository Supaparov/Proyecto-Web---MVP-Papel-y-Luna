const router = require('express').Router();
const ctrl = require('../controllers/ventaController');
const { ventaRules, validate } = require('../validators/venta.validator');

router.post('/', ventaRules, validate, ctrl.crear);

module.exports = router;