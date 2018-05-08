function divEscapedContentElement (message) {
  return $('<div></div>').text(message);
}
function divSystemContentElement (message) {
  return $('<div></div>').html('<i>' + message + '</i>');
}
function processUserInput (chatApp, socket) {
  let message = $('#send-message').val();
  let systemMessage;
  if (message.charAt(0) === '/') {
    systemMessage = chatApp.processCommand(message);
    if(systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('#room').text(), message);
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }
  $('#send-message').val('');
}

// 客户端程序初始化逻辑
let socket = io.connect();
$(document).ready(function() {
  let chatApp = new Chat(socket);
  socket.on('nameResult', function (result) { // 显示更名尝试的结果
    let message;
    if (result.success) {
      message = 'You are now known as ' + result.name + '.';
    } else {
      message = result.message;
    }
    $('#message').append(divSystemContentElement(message));
  });
  socket.on('joinResult', function (result) { // 显示房间变更结果
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });
  socket.on('message', function (message) { // 显示接收到的消息
    let newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });
  socket.on('rooms', function (rooms) { // 显示可用房间列表
    $('#room-list').empty();
    for(let room in rooms) {
      room = room.substring(1, room.length);
      if(room != '') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }
  });
  $('#room-list div').click(function () { // 点击房间名可以换到那个房间中
    chatApp.processCommand('/join ' + $(this).text());
    $('#send-message').focus();
  });
  setInterval(function () { // 定期请求可用房间列表
    socket.emit('rooms');
  },1000);
  $('#send-message').focus()
  $('#send-form').submit(function () {
    processUserInput(chatApp, socket);
    return false;
  });
});