const { Sequelize } = require('sequelize');
const config = require('./config.json').development;

const db = new Sequelize({
    dialect: config.dialect,
    storage: config.storage,
    logging: false
});

module.exports = db;