var express = require('express');
var http = require('http');
var app = express();

// open server
var server = http.createServer(app);

app.use(express.static("../app"))

server.listen(30080, function () {
  console.log('Simple Deploy Server on port 30080!');
});
