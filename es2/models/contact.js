module.exports = function(sequelize, DataTypes) {
    var Contact = sequelize.define("Contact", {
        name : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        surname : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        tel : {
            type : DataTypes.STRING,
            allowNull : false,
        }
    });

    return Contact;
};
