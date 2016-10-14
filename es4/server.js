var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var http = require('http');
var logger = require('morgan');

var models = require("./models");
var routes = require("./routes");

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

// configure app
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

app.use(bodyParser());

app.use(routes);

models.sequelize.sync().then(function() {
    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
models.sequelize
    .authenticate()
    .then(function(err) {
      console.log('Connection has been established successfully.');
    }, function (err) {
       console.log('Unable to connect to the database:', err);
    });
});
