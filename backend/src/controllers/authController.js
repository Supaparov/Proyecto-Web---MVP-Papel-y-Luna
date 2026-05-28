const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const authController = {
    async login(req, res, next) {
        try {
            const { username, password } = req.body;

            // 1. Buscar usuario
            const user = await Usuario.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // 2. Verificar contraseña hasheada
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // 3. Generar el Token (Carnet digital)
            const token = jwt.sign(
                { 
                    id: user.id, 
                    username: user.username, 
                    role: user.role 
                },
                process.env.JWT_SECRET || 'default_secret_key',
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            // 4. Responder al cliente
            res.json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;