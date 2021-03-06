var socket = io();
socket.on('message', function(data) {
    console.log(data);
});



var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

// tells program how to respond when keys are pressed
document.addEventListener('keydown', function(event){
    switch (event.keyCode) {
    case 65: // if user presses 'A'
        movement.left = true;
        break;
    case 87: // W
        movement.up = true;
        break;
    case 68: // D
        movement.right = true;
        break;
    case 83: // S
        movement.down = true;
        break;
    }
});

// tells program how to respond when keys are released
document.addEventListener('keyup', function(event) {
    switch(event.keyCode) {
        case 65: // if user presses 'A'
                movement.left = false;
                break;
            case 87: // W
                movement.up = false;
                break;
            case 68: // D
                movement.right = false;
                break;
            case 83: // S
                movement.down = false;
                break;
    }
});

// alerts server that new player has been added, creates loop to update keyboard input of new player
// to the server 60 times per second
socket.emit('new player');
setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60);

const randomColor = Math.floor(Math.random()*16777215).toString(16);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players, dots) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = '#' + randomColor;
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
  }
    context.fillStyle = 'red';
    for(var id in dots) {
        var dot =dots[id];
        context.beginPath();
        context.arc(dot.x, dot.y, 20, 0, 2 * Math.PI);
        context.fill();
    }
});

socket.on('message', function (score) {
    console.log(score);
    document.getElementById("score").innerHTML = "Score " + score;
});
