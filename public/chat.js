// make connection
// const port = process.env.PORT || 4000;
// heroku port: https://chit-chat-box.herokuapp.com/
var socket = io.connect('http://localhost:4000/');

const debounce = (func, delay) => {
  let debounceTimer
  return function () {
    const context = this
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

// query dom
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');
    chatWindow = document.getElementById('chat-window');
    info = document.getElementById('info');

function showInfo(message) {
  info.style.display = 'block';
  p = document.querySelector('#info p');
  p.innerHTML = message
  setTimeout(() => {
    info.style.display = 'none'
  }, 4500)
}

// emit events
btn.addEventListener('click', function() {
  if (message.value && handle.value) {
    socket.emit('chat', { 
      message: message.value,
      handle: handle.value
     });
  } else {
    if (message.value && !handle.value) {
      showInfo('please type your name before sending messsage');
    } else if (!message.value && handle.value) {
      showInfo('please type your message before sending');
    } else {
      showInfo('please check your name & msg before sending');
    }
  }
});

message.addEventListener('keyup', function() {
  if (event.keyCode === 13) {
    if (message.value && handle.value) {
      socket.emit('chat', { 
        message: message.value,
        handle: handle.value
       });
    } else {
      if (message.value && !handle.value) {
        showInfo('please type your name before sending messsage');
      } else if (!message.value && handle.value) {
        showInfo('please type your message before sending');
      } else {
        showInfo('please check your name & msg before sending');
      }
    }
  }
});

message.addEventListener('keypress', function() {
  socket.emit('typing', handle.value);
});

// listen for events
// when pressed enter
socket.on('chat', function(data) {
  feedback.innerHTML = "";
  output.innerHTML += '<p class="none"><strong>'+ data.handle +': </strong>'+ data.message +'</p>';
  message.value = "";
  chatWindow.scrollTop = chatWindow.scrollHeight
});

socket.on('typing', function(data) {
  chatWindow.scrollTop = chatWindow.scrollHeight
  feedback.innerHTML = '<p><em>'+ data +' is typing...</em></p>';
});

socket.on('typing', debounce(function() {
  feedback.innerHTML = '<p><em></em></p>';
}, 1500))

function removeTyping() {
  feedback.innerHTML = '<p><em></em></p>';
}