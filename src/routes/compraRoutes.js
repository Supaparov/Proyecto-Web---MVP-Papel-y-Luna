const router = require('express').Router();
const ctrl = require('../controllers/compraController');
const { compraRules, validate } = require('../validators/compra.validator');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación
const roleMiddleware = require('../middlewares/roleMiddleware'); // Middleware de autorización por roles

// Todo protegido para ADMIN
router.use(authMiddleware, roleMiddleware('ADMIN'));

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', compraRules, validate, ctrl.create);
router.put('/:id', compraRules, validate, ctrl.update);
router.delete('/:id', ctrl.delete);
module.exports = router;