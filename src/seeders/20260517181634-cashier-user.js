'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('cajero123', 10);

    await queryInterface.bulkInsert('Usuarios', [{
      username: 'cajero',
      password: hashedPassword,
      role: 'CAJERO',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', { username: 'cajero' }, {});
  }
};