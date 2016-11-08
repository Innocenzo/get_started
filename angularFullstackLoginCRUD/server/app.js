/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var sqldb = require ('./sqldb');
var config = require('./config/environment');


// // Connect to database
// mongoose.connect(config.mongo.uri, config.mongo.options);
// mongoose.connection.on('error', function(err) {
// 	console.error('MongoDB connection error: ' + err);
// 	process.exit(-1);
// 	}
// );
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
}
sqldb.sequelize.sync()
  .then(startServer)
  .catch(function(err) {
    console.log('Server failed to start due to error: %s', err);
  });
sqldb.sequelize
	.authenticate()
	.then(function(err) {
	  console.log('Connection has been established successfully.');
	}, function (err) {
	  console.log('Unable to connect to the database:', err);
	});

// Expose app
exports = module.exports = app;
