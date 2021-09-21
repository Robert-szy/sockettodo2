const express = require('express');
const path = require('path');
const socket = require('socket.io');

const tasks = [];


const app = express();


app.use(express.static(path.join(__dirname, '/client')));

app.use((req, res) => {
  res.status(404).send('404 not found...');
})

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  console.log('Sending initial data to ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', (taskData) => {
    console.log('Oh, I\'ve got Add action from ' + socket.id);

    console.log('taskData ', taskData);
    tasks.push(taskData);
    console.log('tasks ', tasks);

    socket.broadcast.emit('addTask', taskData);

  });

  socket.on('removeTask', (taskId) => {
    console.log('Oh, I\'ve got Remove action from ' + socket.id);

    console.log('taskId ', taskId);
    tasks.splice(taskId,1);
    console.log('tasks ', tasks);
    
    socket.broadcast.emit('removeTask', taskId);

  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left') 
    userDicsonnectedID = socket.id
  });

  console.log('I\'ve added a listener on message event \n');
});