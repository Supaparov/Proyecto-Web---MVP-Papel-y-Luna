'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class DetalleVenta extends Model {
        static associate(models) {
            DetalleVenta.belongsTo(models.Venta, { foreignKey: 'ventaId' });
            DetalleVenta.belongsTo(models.Producto, { foreignKey: 'productoId' });
        }
    }
    DetalleVenta.init({
        cantidad: { type: DataTypes.INTEGER, allowNull: false },
        precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        ventaId: DataTypes.INTEGER,
        productoId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'DetalleVenta',
        timestamps: false // No solemos necesitar createdAt en cada línea de detalle
    });
    return DetalleVenta;
};