const router = require('express').Router();
const ctrl = require('../controllers/productoController');
const { productoRules, validate } = require('../validators/producto.validator');

router.post('/', productoRules, validate, ctrl.crear);
router.get('/', ctrl.list);

module.exports = router;