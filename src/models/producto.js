'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Producto extends Model {
        static associate(models) {
            // Relación N:M con Venta a través de DetalleVenta
            Producto.belongsToMany(models.Venta, {
                through: models.DetalleVenta,
                foreignKey: 'productoId'
            });
            Producto.belongsTo(models.Categoria, { foreignKey: 'categoriaId', as: 'Categoria' });
        }
    }
    Producto.init({
        nombre: { type: DataTypes.STRING, allowNull: false },
        sku: { type: DataTypes.STRING, unique: true },
        precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        costo: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        stock: { type: DataTypes.INTEGER, defaultValue: 0 },
        categoria: { type: DataTypes.STRING }
    }, {
        sequelize,
        modelName: 'Producto',
    });
    return Producto;
};