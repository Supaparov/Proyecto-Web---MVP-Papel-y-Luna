const router = require('express').Router();
const ctrl = require('../controllers/compraController');
const { compraRules, validate } = require('../validators/compra.validator');

// Solo permitimos POST y GET para auditoría
router.post('/', compraRules, validate, ctrl.crear);

module.exports = router;