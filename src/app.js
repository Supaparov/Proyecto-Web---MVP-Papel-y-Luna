require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models'); // Importa el index.js de modelos

const requestLogger = require('./middlewares/requestLogger'); // Middleware para logging de solicitudes
const sanitizeIds = require('./middlewares/sanitizeIds');// Middleware para limpiar campos con 'Id' en la respuesta

const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación

const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const clienteRoutes = require('./routes/clienteRoutes'); // Importa rutas de clientes
const proveedorRoutes = require('./routes/proveedorRoutes'); // Importa rutas de proveedores
const compraRoutes = require('./routes/compraRoutes'); // Importa rutas de compras
const faltanteRoutes = require('./routes/faltanteRoutes'); // Importa rutas de faltantes
const errorHandler = require('./middlewares/errorHandler'); // Middleware para manejo de errores

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

app.use(requestLogger); // Middleware para registrar cada solicitud
app.use(sanitizeIds); // Middleware para limpiar campos con 'Id' en la respuesta


app.use(express.static('public')); // Para servir el frontend después

app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/categorias', categoriaRoutes); // Rutas de categorías
app.use('/api/productos', productoRoutes); // Rutas de productos
app.use('/api/ventas', ventaRoutes); // Rutas de ventas
app.use('/api/clientes', clienteRoutes); // Rutas de clientes
app.use('/api/proveedores', proveedorRoutes); // Rutas de proveedores
app.use('/api/compras', compraRoutes); // Rutas de compras
app.use('/api/faltantes', faltanteRoutes); // Rutas de faltantes

app.use(errorHandler); // Middleware para manejo centralizado de errores

// Ruta de prueba técnica
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong', status: 'online' });
});

const PORT = process.env.PORT || 3000;

// Función de arranque del servidor
async function bootstrap() {
    try {
        // Conexión y sincronización de base de datos
        await db.sequelize.authenticate();
        console.log('--- CONEXIÓN DB: EXITOSA ---');

        // sync({ alter: true }) actualiza las tablas si agregas campos después sin borrar datos
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