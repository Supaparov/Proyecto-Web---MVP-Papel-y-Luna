'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Faltante extends Model {
    static associate(models) {}
  }
  Faltante.init({
    nombre_producto: { type: DataTypes.STRING, allowNull: false },
    tipo: { 
      type: DataTypes.ENUM('agotado', 'no registrado'), 
      allowNull: false 
    },
    estado: { 
      type: DataTypes.ENUM('pendiente', 'resuelto', 'descartado'), 
      defaultValue: 'pendiente' 
    }
  }, { sequelize, modelName: 'Faltante' });
  return Faltante;
};