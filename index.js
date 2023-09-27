const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.resolve('./public')));

const roomMessages = {};

io.on('connection', (socket) => {


  // Listen for user joining a room
  socket.on('join', (room, username) => {
    socket.join(room);
    socket.room = room;
    socket.username = username;
    console.log('A user connected',socket.username,'in room',room);
    // Emit previous messages for the room if they exist
    if (roomMessages[room]) {
      socket.emit('previousMessages', roomMessages[room]);
    }

    // Emit a message to the room when a user joins
    io.to(room).emit('message', {
      username: 'Chat App',
      text: `${username} has joined the room.`,
      room
    });
  });

  // Listen for user sending a message
  socket.on('sendMessage', (message) => {
    const room = socket.room;
    const username = socket.username;

    // Create a message object
    const newMessage = {
      username,
      text: message,
    };

    console.log(newMessage);

    // Add the message to the room's messages
    if (!roomMessages[room]) {
      roomMessages[room] = [];
    }
    roomMessages[room].push(newMessage);

    console.log(roomMessages);

    // Emit the message to the room
    io.to(room).emit('message', newMessage);
  });

  // Listen for user disconnecting
  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);
    io.to(socket.room).emit('message', {
      username: 'Chat App',
      text: `${socket.username} has left the room.`,
    });
  });
});
app.get('/',(req,res)=>{
    return res.sendFile('/public/index.html');
})

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
