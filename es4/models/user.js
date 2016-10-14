module.exports = function(sequelize, DataTypes) {
      var User = sequelize.define('User', {
      uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV1,
          primaryKey: true
      },
      idSource: DataTypes.STRING,
      idDestination: DataTypes.STRING,
      username: DataTypes.STRING,
      msg: DataTypes.STRING
      });

      return User;
};
