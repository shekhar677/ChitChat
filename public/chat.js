// make connection
const port = process.env.PORT || 4000;
var socket = io.connect(port);

// query dom
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

// emit events
btn.addEventListener('click', function() {
  socket.emit('chat', { 
    message: message.value,
    handle: handle.value
   });
});

message.addEventListener('keypress', function() {
  socket.emit('typing', handle.value);
});

// listen for events
// when pressed enter
socket.on('chat', function(data) {
  feedback.innerHTML = "";
  output.innerHTML += '<p class="none"><strong>'+ data.handle +': </strong>'+ data.message +'</p>';
});

socket.on('typing', function(data) {
  feedback.innerHTML = '<p><em>'+ data +' is typing...</em></p>';
});