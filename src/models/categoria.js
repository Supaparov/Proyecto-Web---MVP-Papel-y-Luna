'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Categoria extends Model {
    static associate(models) {
      // Una categoría tiene muchos productos
      Categoria.hasMany(models.Producto, { foreignKey: 'categoriaId' });
    }
  }
  Categoria.init({
    nombre: { 
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true 
    },
    descripcion: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Categoria',
  });
  return Categoria;
};