// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());

const users = [];

app.post('/login', (req, res) => {
  const { name } = req.body;
  if (name) {
    users.push(name);
    return res.json({ message: `Welcome ${name}!` });
  } else {
    return res.status(400).json({ message: 'Name is required.' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (data) => {
    console.log(`Message from ${data.name}: ${data.message}`);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));

