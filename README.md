# Papel y Luna - Sistema de Punto de Venta (POS)

Sistema completo de gestión para papelería con backend en Node.js/Express y frontend en React.

## 📁 Estructura del Proyecto

```
Proyecto Web - MVP Papel y Luna/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── app.js          # Aplicación principal
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middlewares/    # Middlewares
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Rutas API
│   │   ├── validators/     # Validaciones
│   │   ├── migrations/     # Migraciones BD
│   │   └── seeders/        # Datos iniciales
│   ├── package.json
│   ├── .env
│   ├── .sequelizerc
│   └── README.md
│
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas/Vistas
│   │   ├── services/       # Llamadas a API
│   │   ├── store/          # Zustand stores
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilidades
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env
│   └── README.md
│
├── render.yaml             # Configuración de despliegue
├── package-lock.json       # (Heredado del anterior monorepo)
└── README.md               # Este archivo
```

## 🚀 Inicio Rápido

### Requisitos
- Node.js 20.x
- npm o yarn

### Backend

```bash
cd backend
npm install
npm run dev
```

La API estará disponible en `http://localhost:3000`

**Credenciales de prueba:**
- Admin: `admin` / `admin123`
- Cajero: `cashier` / `cashier123`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Módulos Implementados

### ✅ Autenticación y Sesión
- [x] Pantalla de login
- [x] Manejo de JWT
- [x] Protección de rutas por rol
- [x] Sistema de alertas global

### 🔄 Módulo de Ventas (POS)
- [x] Búsqueda de productos con autocompletado
- [x] Carrito de compras
- [x] Aplicación de descuentos
- [x] Selector de método de pago (Efectivo, Nequi, Debe)
- [x] Validación de clientes para ventas a Debe
- [x] Cálculo de cambio
- [ ] Recibo imprimible
- [ ] Historial de ventas

### ⏳ Módulo de Inventario
- [ ] CRUD de productos
- [ ] CRUD de categorías
- [ ] Alertas de bajo stock
- [ ] Historial de movimientos

### ⏳ Módulo de Compras
- [ ] Registro de compras
- [ ] Selector de proveedores
- [ ] Actualización de stock

### ⏳ Módulo de Faltantes
- [ ] Registro rápido de productos faltantes
- [ ] Reporte consolidado
- [ ] Filtros por estado

### ⏳ Gestión Administrativa
- [ ] CRUD de clientes
- [ ] CRUD de proveedores
- [ ] CRUD de descuentos
- [ ] Control de usuarios

## 🛠️ Variables de Entorno

### Backend (`.env`)
```
PORT=3000
NODE_ENV=development
JWT_SECRET=Papel_Y_Luna_Secret_Key_2026_##
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://user:password@localhost/papelyluna
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:3000/api
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login

### Productos
- `GET /api/productos` - Listar
- `GET /api/productos/:id` - Obtener
- `POST /api/productos` - Crear (ADMIN)
- `PUT /api/productos/:id` - Actualizar (ADMIN)
- `DELETE /api/productos/:id` - Eliminar (ADMIN)

### Ventas
- `GET /api/ventas` - Listar
- `GET /api/ventas/:id` - Obtener
- `POST /api/ventas` - Crear
- `PUT /api/ventas/:id` - Actualizar (ADMIN)
- `DELETE /api/ventas/:id` - Eliminar (ADMIN)

### Clientes
- `GET /api/clientes` - Listar
- `GET /api/clientes/:id` - Obtener
- `POST /api/clientes` - Crear
- `PUT /api/clientes/:id` - Actualizar
- `DELETE /api/clientes/:id` - Eliminar (ADMIN)

### Descuentos
- `GET /api/descuentos` - Listar
- `POST /api/descuentos` - Crear (ADMIN)
- `PUT /api/descuentos/:id` - Actualizar (ADMIN)
- `DELETE /api/descuentos/:id` - Eliminar (ADMIN)

[Ver más endpoints en documentación API]

## 🎨 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **Sequelize** - ORM
- **PostgreSQL / SQLite** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Zustand** - State management
- **React Router** - Navegación
- **Axios** - HTTP client
- **Lucide React** - Iconos

## 🔐 Seguridad

- ✅ Autenticación JWT
- ✅ Validación de roles
- ✅ Validación de entrada (express-validator)
- ✅ CORS configurado
- ✅ Transacciones en operaciones críticas
- ✅ Auditoría de cambios

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Interfaz optimizada para cajeros
- ✅ Navegación rápida por teclado
- ✅ Sem animaciones lentas

## 🚀 Despliegue en Render

El proyecto está configurado para desplegar en Render.com:

```bash
git push origin main
```

El `render.yaml` manejará la instalación de dependencias y el inicio automático.

## 📝 Licencia

ISC

## 👥 Autores

- Juan Sebastian Gonzalez (342821)
- Julian Villamil (359905)
- Santiago Avila (331729)

---

**Última actualización:** Mayo 23, 2026
