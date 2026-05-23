'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Compra extends Model {
    static associate(models) {
      Compra.belongsTo(models.Proveedor, { foreignKey: 'proveedorId' });
      Compra.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    }
  }
  Compra.init({
    total: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    metodo_pago: { type: DataTypes.STRING }, // Efectivo, Transferencia, etc.
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    usuarioId: DataTypes.INTEGER
  }, { sequelize, modelName: 'Compra' });
  return Compra;
};