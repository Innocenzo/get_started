module.exports = function(sequelize, DataTypes) {
    var Contact = sequelize.define("Todo", {
        text : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        done : {
            type : DataTypes.BOOLEAN,
        }
    });

    return Contact;
};
