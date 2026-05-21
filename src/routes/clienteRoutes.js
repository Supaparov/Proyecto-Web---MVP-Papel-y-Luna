const router = require('express').Router();
const ctrl = require('../controllers/clienteController');
const { clienteRules, validate } = require('../validators/cliente.validator');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación
const roleMiddleware = require('../middlewares/roleMiddleware'); // Middleware de autorización por roles


// Ambos pueden gestionar clientes para no trabar la venta
router.get('/', authMiddleware, ctrl.list);
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'CAJERO']), clienteRules, validate, ctrl.create);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'CAJERO']), clienteRules, validate, ctrl.update);

// Solo admin borra clientes
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), ctrl.delete);

module.exports = router;