require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models'); 

const requestLogger = require('./middlewares/requestLogger'); 
const sanitizeIds = require('./middlewares/sanitizeIds');

const descuentoRoutes = require('./routes/descuentoRoutes');
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

// PASO 5: Ruta pública de verificación de autoría obligatoria para el despliegue
app.get('/authors', (req, res) => {
    res.status(200).json([
        { 
            nombre: 'Juan Sebastian Gonzalez', 
            codigo: '342821'
        },
        { 
            nombre: 'Julian Villamil', 
            codigo: '359905'
        },
        { 
            nombre: 'Santiago Avila', 
            codigo: '331729'
        }
    ]);
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
app.use('/api/descuentos', descuentoRoutes);

// Manejo centralizado de errores (SIEMPRE AL FINAL)
app.use(errorHandler); 

const PORT = process.env.PORT || 3000;

async function bootstrap() {
    try {
        await db.sequelize.authenticate();
        console.log('--- CONEXIÓN DB: EXITOSA ---');

        // Forzamos la sincronización en cualquier entorno para que Postgres cree las tablas del MVP
        await db.sequelize.sync({ alter: true });
        console.log('--- BASE DE DATOS SINCRONIZADA GLOBALMENTE ---');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('--- ERROR CRÍTICO AL INICIAR ---', error);
        process.exit(1);
    }
}

bootstrap();