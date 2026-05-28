'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Auditoria extends Model {
    static associate(models) {
      Auditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    }
  }
  Auditoria.init({
    usuarioId: DataTypes.INTEGER,
    accion: DataTypes.STRING,
    tabla: DataTypes.STRING,
    registroId: DataTypes.INTEGER,
    detalles: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Auditoria',
  });
  return Auditoria;
};