var express = require('express');
var app = express();

var http = require('http').Server(app);

app.use(express.static(__dirname));

var lineCounter = require(__dirname + '/countLines.js');

app.get('/countLines', lineCounter);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});