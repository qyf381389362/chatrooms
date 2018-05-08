let http = require('http')
let fs = require('fs')
let path = require('path') // 内置的path模块提供了与文件系统路径相关的功能
let mime = require('mime') // 附加的mime模块有根据文件扩展名得出mime类型的能力
let cache = {}
