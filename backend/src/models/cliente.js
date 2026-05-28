'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cliente extends Model {
    static associate(models) {
      Cliente.hasMany(models.Venta, { foreignKey: 'clienteId' });
    }
  }
  Cliente.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    saldo_pendiente: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }
  }, { sequelize, modelName: 'Cliente' });
  return Cliente;
};