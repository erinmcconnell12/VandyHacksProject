

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
    io.sockets.emit('state', players, dots);
}, 1000 / 60);

let players = {};
let dots = [];
io.on('connection', function(socket) {
    socket.on('new player', function() {
        players[socket.id] = new Player();
        dots.push({x: Math.floor(Math.random() * 300), y: Math.floor(Math.random() * 300)})
    });
    socket.on('movement', function(data) {
        var player;
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
       player.move(xMovement, yMovement);
        for(let player in players){
            let dotsToDelete = [];
            for(let i = 0; i < dots.length; i++){
                try {
                    if( dots[i].x + 20 > players[player].x && dots[i].x < players[player].x  && dots[i].y + 20 > players[player].y&& dots[i].y < players[player].y){
                        dots.splice(i, i+1)
                    }    
                }
                catch (e) {
                    
                }
                
            }
            for(let i = 0; i < dotsToDelete.length; i++){
                delete dots[dotsToDelete[i]];
            }
        }


    });


});

io.on('connection', function(socket) {
  // other handlers ...
  socket.on('disconnect', function() {
    // remove disconnected player
  });
});

class Player{
    constructor(x =-1, y =-1) {
        if(x === -1){
            x = Math.floor(Math.random() * 500);
        }
        if(y === -1){
            y = Math.floor(Math.random() * 500);
        }
        this.x = x;
        this.y = y;
        this.counter = 0;
    }
    move(xMovement, yMovement){
        this.x += xMovement;
        this.x = this.x > 790 ? 790 : this.x < 10 ? 10 : this.x;
        this.y += yMovement;
        this.y = this.y > 590 ? 590 : this.y < 10 ? 10 : this.y;
    }
    addtoCounter(){
        this.counter+= 1;
    }
}
