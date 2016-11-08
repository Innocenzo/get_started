/**
 * Sequelize initialization module
 */

'use strict';

var path = require("path");
var config = require('../config/environment');
var Sequelize = require("sequelize");

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri)
};

// Insert models below
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.User = db.sequelize.import('../api/user/user.model');

module.exports = db;
