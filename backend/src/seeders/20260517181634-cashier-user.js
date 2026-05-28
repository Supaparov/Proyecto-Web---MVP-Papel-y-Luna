'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero eliminar si ya existe (idempotencia)
    await queryInterface.bulkDelete('Usuarios', { username: 'cashier' }, {});
    
    const hashedPassword = await bcrypt.hash('cashier123', 10);

    await queryInterface.bulkInsert('Usuarios', [{
      username: 'cashier',
      password: hashedPassword,
      role: 'CAJERO',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', { username: 'cashier' }, {});
  }
};