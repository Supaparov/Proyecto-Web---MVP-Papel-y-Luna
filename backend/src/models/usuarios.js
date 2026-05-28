'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {}
  Usuario.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // No puede haber dos usuarios iguales
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'CAJERO'), // Los roles que pide el POS
      defaultValue: 'CAJERO',
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuarios',
  });
  return Usuario;
};