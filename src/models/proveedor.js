'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Proveedor extends Model {
    static associate(models) {
      Proveedor.hasMany(models.Compra, { foreignKey: 'proveedorId' });
    }
  }
  Proveedor.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    nit: { type: DataTypes.STRING, unique: true },
    contacto: { type: DataTypes.STRING }
  }, { sequelize, modelName: 'Proveedor' });
  return Proveedor;
};