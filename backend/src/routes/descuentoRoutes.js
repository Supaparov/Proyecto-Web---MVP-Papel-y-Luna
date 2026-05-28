const express = require('express');
const router = express.Router();
const descuentoController = require('../controllers/descuentoController');
const { descuentoRules, validate } = require('../validators/descuento.validator');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Endpoints administrativos protegidos por rol
router.post('/', roleMiddleware(['ADMIN']), descuentoRules, validate, descuentoController.create);
router.put('/:id', roleMiddleware(['ADMIN']), descuentoRules, validate, descuentoController.update);
router.delete('/:id', roleMiddleware(['ADMIN']), descuentoController.delete);

// Lectura accesible para ambos roles (Cajero lo necesita para buscarlo en la venta)
router.get('/', roleMiddleware(['ADMIN', 'CAJERO']), descuentoController.list); 
router.get('/:id', roleMiddleware(['ADMIN', 'CAJERO']), descuentoController.getById);

module.exports = router;