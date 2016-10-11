module.exports = function(sequelize, DataTypes) {
    var Contact = sequelize.define("Contact", {
      uuid: {
          type: DataTypes.UUID
        },
        name : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        surname : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        tel : {
            type : DataTypes.STRING,
            allowNull : true,
        }
    });

    return Contact;
};
