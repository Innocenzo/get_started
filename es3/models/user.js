module.exports = function(sequelize, DataTypes) {
      var User = sequelize.define('User', {
      uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV1,
          primaryKey: true
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING

      },
        {
        associate: function (db) {
          User.hasMany(db.contact);}
      });

      return User;
};
