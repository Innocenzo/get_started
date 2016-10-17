module.exports = function(sequelize, DataTypes) {
      var Message = sequelize.define('Message', {
      usernameFrom : DataTypes.STRING,
      idFrom : DataTypes.STRING,
      idTo : DataTypes.STRING,
      usernameTo: DataTypes.STRING,
      msg: DataTypes.STRING
      });

      return Message;
};
