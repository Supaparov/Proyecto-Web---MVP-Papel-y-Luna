const router = require('express').Router();
const ctrl = require('../controllers/clienteController');
const { clienteRules, validate } = require('../validators/cliente.validator');

router.post('/', clienteRules, validate, ctrl.crear);
router.get('/', ctrl.listar);

module.exports = router;