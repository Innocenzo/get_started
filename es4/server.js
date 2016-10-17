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
  // console.log(socket);
   socket.on('disconnect', function(){
      console.log(socket.id,'disconnected');
      delete id[socket.id];
      io.emit('users', id,socket.id);
   });
   //riceve il nome
   socket.on('users', function(name){
      id[socket.id]=name;
      io.emit('users', id,socket.id);
      console.log(id,"inserimento nome");
   });
   if (!Object.keys(id)[socket.id]) {
     id[socket.id]="";
     console.log('nome null');
   }
   console.log(Object.keys(id)[socket.id],"key");
  console.log(id);
  io.emit('users', id,socket.id);

  socket.on('chat message', function(msg){
    var user={id:socket.id, name:id[socket.id]};
      console.log(user,"user name");
    if (msg.multipleSelect !== '0') {
      console.log('true');
      io.to(msg.multipleSelect).emit('chat message', msg,user);
      io.to(socket.id).emit('chat message', msg,user);
      console.log('from',socket.id,msg);
    } else {
      console.log('false');
      io.emit('chat message', msg,user);
      console.log(socket.id,msg);
    }
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
