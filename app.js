const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express()
const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', socket => {
  console.log("New user connection");

  socket.on('send-message', message => {
    console.log("Send message", message);
    io.emit('new_message', message);
  });
})

server.listen(3000, () => {
  console.log("Server is running on PORT:3000");
});
