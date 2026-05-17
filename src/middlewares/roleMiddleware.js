module.exports = (rolesPermitidos) => {
    return (req, res, next) => {
        // 1. Verificar que el usuario exista (inyectado por authMiddleware)
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no identificado.' });
        }

        // 2. Verificar si el rol del usuario está en la lista de permitidos
        // rolesPermitidos puede ser un string 'ADMIN' o un array ['ADMIN', 'CAJERO']
        const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Acceso prohibido. Se requiere uno de estos roles: ${roles.join(', ')}` 
            });
        }

        next(); // Tiene el rol, puede pasar
    };
};