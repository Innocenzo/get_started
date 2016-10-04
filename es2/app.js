var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var http = require('http');
//var methodOverride = require('method-override');

var models = require("./models");
var routes = require("./routes");

var app = express();
// mongoose.connect("mongodb://localhost:27017/test");
// setUpPassport();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));


app.use(routes);
// app.get('/', routes.index);
// app.get('/contacts', routes.getcontacts);


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
