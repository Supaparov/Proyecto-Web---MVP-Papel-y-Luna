'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Venta extends Model {
        static associate(models) {
            Venta.belongsToMany(models.Producto, {
                through: models.DetalleVenta,
                foreignKey: 'ventaId'
            });
            Venta.hasMany(models.DetalleVenta, { foreignKey: 'ventaId' });
            Venta.belongsTo(models.Cliente, { foreignKey: 'clienteId' });
            Venta.belongsTo(models.Descuento, { foreignKey: 'descuentoId' });
            Venta.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
        }
    }
    Venta.init({
        total: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        metodo_pago: {
            type: DataTypes.ENUM('Efectivo', 'Nequi', 'Debe'),
            allowNull: true
        },
        estado: {
            type: DataTypes.ENUM('abierta', 'guardada', 'cerrada', 'anulada'),
            defaultValue: 'abierta'
        },
        recibido: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        cambio: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        notas: { type: DataTypes.TEXT, defaultValue: null }
    }, {
        sequelize,
        modelName: 'Venta',
    });
    return Venta;
};