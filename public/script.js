document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
  
    let username;
    let room;
  
    // Prompt for username and room
    username = prompt('Enter your name:');
    room = prompt('Enter a room name:');
  
    // Emit join event
    socket.emit('join', room, username);
  
    // Listen for messages
    socket.on('message', (message) => {
      displayMessage(message);
    });
  
    // Send message
    sendButton.addEventListener('click', () => {
      const message = messageInput.value;
      if (message.trim() !== '') {
        socket.emit('sendMessage', message);
        messageInput.value = '';
      }
    });

    //To get previous message when user join
    socket.on('previousMessages', (messages) => {
        console.log(messages);
        messages.forEach((message) => {
          displayMessage(message);
        });
      });
  
    // Display message in chat  and also update the name of Chat room.
    function displayMessage(message) {
      const heading=document.getElementById('room-name');
      let roomName=message.room;
      heading.innerText=roomName;
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.innerHTML = `<strong>${message.username}:</strong> ${message.text}`;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });


  
  