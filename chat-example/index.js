var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var id=[];
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(socket.id);
    id.push(socket.id);
    // io.emit('chat message', msg);
    // io.emit('chat message',socket.id);
    console.log(id);
    if (id[0] == socket.id) {
      io.to(id[1]).emit('chat message', msg);
    }

  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
