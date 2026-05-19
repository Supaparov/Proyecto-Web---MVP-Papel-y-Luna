require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: { 
        require: true, 
        rejectUnauthorized: false // Requerido para conexiones cifradas en Render
      },
    },
  },
};