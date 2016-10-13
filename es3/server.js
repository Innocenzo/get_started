var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
var flash = require("connect-flash");
var passport = require("passport");
var path = require("path");
var session = require("express-session");
var http = require('http');
var logger = require('morgan');

var setUpPassport = require("./setuppassport");

var models = require("./models");
var routes = require("./routes");

var app = express();
// mongoose.connect("mongodb://localhost:27017/test");
setUpPassport();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

// configure app
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

app.use(bodyParser());
app.use(cookieParser());

app.use(session({
  secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

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
