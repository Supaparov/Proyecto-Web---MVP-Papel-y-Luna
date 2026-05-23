module.exports = (sequelize, DataTypes) => {
    const Descuento = sequelize.define('Descuento', {
        nombre: DataTypes.STRING,
        codigo: DataTypes.STRING,
        porcentaje: DataTypes.DECIMAL(5, 2), // Ejemplo: 10.00 para 10%
        activo: { type: DataTypes.BOOLEAN, defaultValue: true }
    });
    return Descuento;
};