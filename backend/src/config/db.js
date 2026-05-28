const { Sequelize } = require('sequelize');
const process = require('process');
const config = require('./config.js')[process.env.NODE_ENV || 'development'];

let db;
if (config.use_env_variable) {
    db = new Sequelize(process.env[config.use_env_variable], config);
} else {
    db = new Sequelize({
        dialect: config.dialect,
        storage: config.storage,
        logging: false
    });
}

module.exports = db;