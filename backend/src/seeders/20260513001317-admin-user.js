'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero eliminar si ya existe (idempotencia)
    await queryInterface.bulkDelete('Usuarios', { username: 'admin' }, {});
    
    const hashedPassword = await bcrypt.hash('admin123', 10); // Esta será tu clave inicial

    await queryInterface.bulkInsert('Usuarios', [{
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', { username: 'admin' }, {});
  }
};