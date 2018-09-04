const express = require('express');
const socket = require('socket.io');

const app = express();

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log('listening on port ', port);
});

// static files
app.use(express.static('public'));

// socket setup
// pass to which server to work
var io = socket(server);

io.on('connection', (socket) => {
  console.log('conneted: ', socket.id);

  // receive the data sent from client and broadcast to others
  socket.on('chat', function(data) {
    io.sockets.emit('chat', data);
  });

  socket.on('typing', function(data) {
    socket.broadcast.emit('typing', data);
  });
})