
var socket = io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(socket.id,msg);
    // id.push(socket.id);
    io.emit('chat message', msg);
    io.emit('chat message',socket.id);
    console.log(id);
    // if (id[0] == socket.id) {
    //   io.to(id[1]).emit('chat message', msg);
    // }
  });
});



module.exports = socket;
