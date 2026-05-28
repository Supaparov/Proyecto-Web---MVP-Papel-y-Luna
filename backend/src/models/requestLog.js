'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RequestLog extends Model {}
  RequestLog.init({
    method: DataTypes.STRING,
    path: DataTypes.STRING,
    ip: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RequestLog',
  });
  return RequestLog;
};