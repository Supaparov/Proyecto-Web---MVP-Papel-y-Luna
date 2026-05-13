const router = require('express').Router();
const ctrl = require('../controllers/proveedorController');
const { proveedorRules, validate } = require('../validators/proveedor.validator');

router.post('/', proveedorRules, validate, ctrl.crear);
router.get('/', ctrl.listar);

module.exports = router;