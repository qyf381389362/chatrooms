let http = require('http');
let fs = require('fs');
let path = require('path'); // 内置的path模块提供了与文件系统路径相关的功能
let mime = require('mime'); // 附加的mime模块有根据文件扩展名得出mime类型的能力
let cache = {};

function send404 (response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found');
  response.end();
}

function sendFile (response, filePath, fileContents) {
  response.writeHead(
    200,
    {'Content-type': mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
}

function serveStatic (response, cache, absPath) {
  if (cache[absPath]) { // 检查文件是否缓存在内存里
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function (exists) { // 检查文件是否存在
      if(exists) {

      }
    })
  }
}
