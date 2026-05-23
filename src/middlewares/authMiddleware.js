const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Obtener el header de autorización
    const authHeader = req.headers['authorization'];
    
    // El formato suele ser "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // 2. Verificar el token (usando el mismo secret que en authController)
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
        
        // 3. Guardar los datos del usuario en el request para uso posterior
        req.user = verified;
        
        next(); // Continuar al siguiente paso (controlador u otro middleware)
    } catch (error) {
        res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};