var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var http = require('http');
var logger = require('morgan');


var models = require("./models");
var routes = require("./routes");

var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

// configure app
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

app.use(bodyParser());


var id={};
io.on('connection', function(socket){
   socket.on('disconnect', function(){
      console.log(socket.id,'disconnected');
      delete id[socket.id];
      io.emit('users', id);
   });

  // console.log(socket,"connessione");
  // console.log(socket.adapter,"connessione");
  id[socket.id]=1;
  // for (var variable in id) {
  //   if (id.hasOwnProperty(variable)) {
  //     console.log(variable);
  //   }
  // }
  console.log(id);
  io.emit('users', id);
  socket.on('chat message', function(msg){
    // if (msg.to) {
    //   io.to(msg.to).emit('chat priva', msg);
    //
    // }
    if (msg.multipleSelect !== '0') {
      console.log('true');
      io.to(msg.multipleSelect).emit('chat message', msg,socket.id);
      io.to(socket.id).emit('chat message', msg,socket.id);
      console.log('from',socket.id,msg);
    } else {
      console.log('false');
      io.emit('chat message', msg,socket.id);
      console.log(socket.id,msg);
    }


    // io.emit('chat message',socket.id);
    // console.log(id);
    // if (id[0] == socket.id) {
    //   io.to(id[1]).emit('chat message', msg);
    // }
  });
});

app.use(routes);


models.sequelize.sync().then(function() {
    server.listen(app.get('port'), function() {
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
