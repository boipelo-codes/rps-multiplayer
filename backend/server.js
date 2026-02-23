const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // your frontend's address later
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

server.listen(3000, () => {
  console.log('Backend server running at http://localhost:3000');
});