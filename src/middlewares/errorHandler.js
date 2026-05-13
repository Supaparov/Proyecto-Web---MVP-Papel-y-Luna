module.exports = (err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`);
    
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