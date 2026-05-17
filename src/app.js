require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models'); 

const requestLogger = require('./middlewares/requestLogger'); 
const sanitizeIds = require('./middlewares/sanitizeIds');

const authRoutes = require('./routes/authRoutes'); 
const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const clienteRoutes = require('./routes/clienteRoutes'); 
const proveedorRoutes = require('./routes/proveedorRoutes'); 
const compraRoutes = require('./routes/compraRoutes'); 
const faltanteRoutes = require('./routes/faltanteRoutes'); 
const errorHandler = require('./middlewares/errorHandler'); 

const app = express();

// Middlewares básicos y globales
app.use(cors());
app.use(express.json());
app.use(requestLogger); 
app.use(sanitizeIds); 

app.use(express.static('public')); 

// Ruta de prueba técnica (Health Check arriba)
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong', status: 'online' });
});

// Inyección de módulos de rutas
app.use('/api/auth', authRoutes); 
app.use('/api/categorias', categoriaRoutes); 
app.use('/api/productos', productoRoutes); 
app.use('/api/ventas', ventaRoutes); 
app.use('/api/clientes', clienteRoutes); 
app.use('/api/proveedores', proveedorRoutes); 
app.use('/api/compras', compraRoutes); 
app.use('/api/faltantes', faltanteRoutes); 

// Manejo centralizado de errores (SIEMPRE AL FINAL)
app.use(errorHandler); 

const PORT = process.env.PORT || 3000;

async function bootstrap() {
    try {
        await db.sequelize.authenticate();
        console.log('--- CONEXIÓN DB: EXITOSA ---');

        await db.sequelize.sync({ alter: true });
        console.log('--- TABLAS SINCRONIZADAS ---');

        app.listen(PORT, () => {
            console.log(`--- SERVIDOR CORRIENDO: http://localhost:${PORT} ---`);
        });
    } catch (error) {
        console.error('--- ERROR CRÍTICO AL INICIAR ---', error);
        process.exit(1);
    }
}

bootstrap();