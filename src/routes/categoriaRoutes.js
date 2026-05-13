const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoriaController');
const { categoriaRules, validate } = require('../validators/categoria.validator');

// CADENA: REGLAS -> VALIDAR -> CONTROLADOR
router.post('/', categoriaRules, validate, ctrl.crear);
router.get('/', ctrl.listar);

module.exports = router;