

// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/static/index.html'));
  });



  // Starts the server.
server.listen(5000, function() {
    console.log('Starting server on port 5000');
  });
  
// Add the WebSocket handlers
io.on('connection', function(socket) {
});

setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / 60);

var players = {};
io.on('connection', function(socket) {
    socket.on('new player', function() {
        players[socket.id] = {
            x: 300,
            y: 300
        };
    });
    socket.on('movement', function(data) {
        var player;
        if(!(socket.id in players)) {
            players[socket.id] = new Player();
        }
        player = players[socket.id]
        var xMovement = 0;
        var yMovement = 0;
        if (data.left) {
            xMovement -= 5
        }
        if (data.up) {
            yMovement -= 5;
        }
        if (data.right) {
            xMovement += 5
        }
        if (data.down) {
            yMovement += 5;
        }
        players[socket.id].x += xMovement;
        players[socket.id].x = players[socket.id].x > 790 ? 790 : players[socket.id].x < 10 ? 10 : players[socket.id].x;
        players[socket.id].y += yMovement;
        players[socket.id].y = players[socket.id].y > 590 ? 590 : players[socket.id].y < 10 ? 10 : players[socket.id].y;
    });
});

io.on('connection', function(socket) {
  // other handlers ...
  socket.on('disconnect', function() {
    // remove disconnected player
  });
});

class Player{
    constructor(x = 300, y = 300) {
        this.x = x;
        this.y = y;
    }
}
