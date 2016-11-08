'use strict';

module.exports =  function(sequelize, DataTypes) {
  var Thing = sequelize.define('Thing', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: DataTypes.INTEGER,
    name: DataTypes.STRING,
    info: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
  return Thing
}
