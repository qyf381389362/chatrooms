let http = require('http');
let fs = require('fs');
let path = require('path'); // 内置的path模块提供了与文件系统路径相关的功能
let mime = require('mime'); // 附加的mime模块有根据文件扩展名得出mime类型的能力
let chatServer = require('./lib/chat_server'); // 引入socket服务器
let cache = {}; // 用来缓存文件内容的对象

// 请求的文件不存在时发送404
function send404 (response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found');
  response.end();
}

// 提供文件数据服务
function sendFile (response, filePath, fileContents) {
  response.writeHead(
    200,
    {'Content-type': mime.getType(path.basename(filePath))}
  );
  response.end(fileContents);
}

// 确定文件是否已经缓存了,根据是否已缓存进行不同的操作
function serveStatic (response, cache, absPath) {
  if (cache[absPath]) { // 检查文件是否缓存在内存里
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function (exists) { // 检查文件是否存在
      if(exists) {
        fs.readFile(absPath, function(err, data) {
          if(err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}

// 创建HTTP服务器
let server = http.createServer(function (request, response) {
  let filePath = false;
  if(request.url === '/') { // 确定返回的默认HTML文件
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url; // 将URL路径转换为文件的相对路径
  }
  let absPath = './' + filePath;
  serveStatic(response, cache, absPath); // 返回静态文件
});

// 启动HTTP服务器
server.listen(3000, function () {
  console.log('Server listening on port 3000.');
});

// 设置Socket.IO服务器
chatServer.listen(server);