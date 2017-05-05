var http = require('http'),
    sockjs = require('sockjs'),
    sockserver = sockjs.createServer(),
    connections = [];
var mysql      = require('mysql');
var app = require('express')();
var http1 =require('http').Server(app);
var io = require('socket.io')(http1);
var msg_total;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
var io = require('socket.io')(http1);
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg_total);
    });
});
app.listen(8080, function(){
   console.log('listening on *:8080');
});


var db_connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'mysql',
  database : 'stateDB'
});
db_connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");   
} else {
    console.log("Error connecting database ... nn");    
}
});

    

sockserver.on('connection', function(conn) {
  console.log('Connected');
  msg_total+='Connected';
  db_connection.query('INSERT INTO stateTable (message) VALUES ("Connected")', function(err, rows, fields) {

    });
  connections.push(conn);
  conn.on('data', function(msg) {
    console.log('Message: ' + msg);
    msg_total+=msg;
    io.sockets.emit('chat message', msg);
    // send the message to all clients
    for (var i=0; i < connections.length; ++i) {
      connections[i].write(msg);
    }
    db_connection.query('INSERT INTO stateTable (message) VALUES (?)', msg, function(err, rows, fields) {

    });
    
  });
  conn.on('close', function() {
    connections.splice(connections.indexOf(conn), 1); // remove the connection
    console.log('Disconnected');
    msg_total+='Disconnected';
    db_connection.query('INSERT INTO stateTable (message) VALUES ("Disconnected")', function(err, rows, fields) {
      db_connection.end();
    });
  });
});

var server = http.createServer();
sockserver.installHandlers(server, {prefix:'/sockserver'});
server.listen(3000, '0.0.0.0');