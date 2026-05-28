# 📋 Setup del Proyecto - Papel y Luna MVP

Estructura monorepo con backend (Node.js + Express) y frontend (React + Vite).

## 📁 Estructura del Proyecto

```
Proyecto Web - MVP Papel y Luna/
├── backend/              # API REST (Node.js + Express + Sequelize)
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── seeders/
│   ├── package.json
│   ├── .env
│   └── .sequelizerc
│
├── frontend/             # UI (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── .env
│
├── render.yaml          # Configuración de despliegue
└── README.md
```

## 🚀 Instalación Local

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Crear archivo .env con variables
npm run migrate       # Ejecutar migraciones
npm run seed          # Cargar datos iniciales
npm run dev           # Desarrollo: http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env  # Crear archivo .env
npm run dev           # Desarrollo: http://localhost:5173
```

## 🔐 Variables de Entorno

### Backend (`backend/.env`)
```
PORT=3000
NODE_ENV=development
DATABASE_URL=sqlite://database.sqlite  # Local development
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=24h
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:3000/api
```

## 🌐 Despliegue en Render

El archivo `render.yaml` configura automáticamente:
- **Backend**: Node.js en `https://papelyluna-backend.onrender.com`
- **Frontend**: Node.js + Vite en `https://papelyluna-frontend.onrender.com`
- **Database**: PostgreSQL gratuita

### Pasos en Render

1. Conecta el repositorio Git a Render
2. Render leerá automáticamente `render.yaml`
3. Backend se desplegará primero (ejecuta migraciones + seeders)
4. Frontend se desplegará segundo

## 📚 API Endpoints

```
POST   /api/auth/login              # Login
GET    /api/productos               # Listar productos
POST   /api/ventas                  # Registrar venta
GET    /api/faltantes/reporte       # Reporte de faltantes
... (ver documentación detallada)
```

## 🛠 Desarrollo

### Backend
- Framework: Express.js
- ORM: Sequelize
- Auth: JWT
- Base de datos: PostgreSQL (Render) / SQLite (Local)

### Frontend
- Biblioteca: React 18
- Build tool: Vite
- Estilos: Tailwind CSS
- Estado: Zustand
- HTTP: Axios

## 📝 Notas Importantes

- **JWT**: Se genera automáticamente en Render (`generateValue: true`)
- **Migraciones**: Se ejecutan automáticamente al desplegar (`buildCommand`)
- **Base de datos**: Sincronización automática en desarrollo (`alter: true`)
- **CORS**: Habilitado en backend para permitir requests del frontend

## 🐛 Troubleshooting

### Error de conexión a BD en Render
- Verificar que `DATABASE_URL` esté configurada como variable de entorno
- Verificar que `NODE_ENV=production`

### Frontend no encuentra backend
- Verificar `VITE_API_URL` en `frontend/.env`
- Debe apuntar a `https://papelyluna-backend.onrender.com/api`

### Login falla
- Verificar que JWT_SECRET sea igual en backend
- Revisar logs en Render dashboard
