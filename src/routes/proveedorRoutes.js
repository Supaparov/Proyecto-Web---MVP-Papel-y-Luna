const router = require('express').Router();
const ctrl = require('../controllers/proveedorController');
const { proveedorRules, validate } = require('../validators/proveedor.validator');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación
const roleMiddleware = require('../middlewares/roleMiddleware'); // Middleware de autorización por roles

// Todo protegido para ADMIN
router.use(authMiddleware, roleMiddleware('ADMIN'));

router.get('/', ctrl.list);
router.post('/', proveedorRules, validate, ctrl.create);
router.put('/:id', proveedorRules, validate, ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;