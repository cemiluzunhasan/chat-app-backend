const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express()
const server = http.createServer(app);

const io = socketIO(server);
const fs = require('fs');

var clients = [];

io.on('connection', socket => {
  console.log("New user connection");

  socket.on('send-message', response => {
    
    var user = clients.find(client => client.username == response.username);
    
    if (user) {
      io.to(user.socketId).emit('take-message', response.message);
    }
  });

  socket.on('new-user', user => {
    fs.writeFileSync(`./users/${user.username}.txt`, JSON.stringify(user));
  });

  socket.on('user-login', user => {
    // fs.writeFileSync(`./users/${user.username}.txt`, JSON.stringify(user));
    const userFromDatabase = fs.readFileSync(`./users/${user.username}.txt`);
    const userObject = JSON.parse(userFromDatabase);

    if (userObject.password === user.password) {
      io.to(socket.id).emit('login-successful', { username: userObject.username, publicKey: userObject.publicKey });
      clients.push({ username: userObject.username, socketId: socket.id });
    }
  });

  socket.on('check-user', username => {
    var user = clients.find(client => client.username == username);
    if (user) {
      io.to(socket.id).emit('you-can-chat', user);
    }
  })

});

server.listen(3000, () => {
  console.log("Server is running on PORT:3000");
});
