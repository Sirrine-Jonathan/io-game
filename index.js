const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Player = require('./Player')
const Game = require('./Game')
const FPS = 60

const game = new Game()
app.use(express.static('public'))

io.on('connection', (socket) => {
  const player = new Player(socket.id) // intialize playern
  game.addPlayer(player) // add player to game
  console.log(`$new player connected`);
  console.log(`Number of players in game: ${game.players.length}`)

  socket.on('join', (username) => {
    game.getPlayer(socket.id).setUsername(username)
    io.emit('serverMsg', `SERVER: ${game.getPlayer(socket.id).username} joined`)
    console.log(`SERVER: ${username} joined`)
  })

  socket.on('keys', (keys) => {
    const player = game.getPlayer(socket.id)
    if (keys.ArrowRight){
      player.rotateRight()
    }
    if (keys.ArrowLeft){
      player.rotateLeft()
    }
    if (keys.ArrowUp){
      player.moveForward()
    }
    if (keys.ArrowDown){
      player.moveBackward()
    }
  })

  socket.on('disconnect', () => {
    const username = game.getPlayer(socket.id).username
    game.removePlayer(socket.id)
    console.log(`${username} disconnected`);
  });

  socket.on('message', (msg) => {
    io.emit('message', `${game.getPlayer(socket.id).username}: ${msg}`)
  })

  setInterval(() => {
    game.players.forEach(player => {
      player.update()
    })
    io.emit('update', game)
  }, 1000 / FPS)
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});