require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false, // Desabilitar logs para producción
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { 
        require: true, 
        rejectUnauthorized: false // Requerido para conexiones cifradas en Render
      },
    },
  },
};