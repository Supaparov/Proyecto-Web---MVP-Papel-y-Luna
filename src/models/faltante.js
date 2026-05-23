module.exports = (sequelize, DataTypes) => {
    const Faltante = sequelize.define('Faltante', {
        nombre_producto: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING, // Ejemplo: 'Agotado' o 'No existe'
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            defaultValue: 'Pendiente' // 'Pendiente', 'Comprado'
        }
    });
    return Faltante;
};