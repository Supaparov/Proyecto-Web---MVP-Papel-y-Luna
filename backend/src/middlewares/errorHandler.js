module.exports = (err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`);
    console.error('[STACK]:', err.stack);
    
    // Manejo específico de errores de Sequelize
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: true,
            message: 'Error de validación',
            details: err.errors.map(e => e.message)
        });
    }
    
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            error: true,
            message: 'Registro duplicado',
            details: err.errors.map(e => `${e.path}: ${e.message}`)
        });
    }
    
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            error: true,
            message: 'Error de relación: la referencia no existe'
        });
    }
    
    // Si el error tiene un status específico lo usa, si no, manda 500 (Server Error)
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(status).json({
        error: true,
        message: message,
        // Solo mostramos el stack en desarrollo
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};