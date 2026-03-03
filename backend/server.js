const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();

// Middleware – allow both 127.0.0.1 and localhost
app.use(cors({ origin: ['http://127.0.0.1:5500', 'http://localhost:5500'] }));
app.use(express.json());

// Connect to MongoDB (local)
mongoose.connect('mongodb://127.0.0.1:27017/rps')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 }
});
const User = mongoose.model('User', userSchema);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST']
  }
});

// Game state
let waitingPlayers = [];
const games = {};

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('ready', (username) => {
    console.log(`🎮 ${username} is ready`);

    waitingPlayers.push({ username, socketId: socket.id });

    if (waitingPlayers.length >= 2) {
      const player1 = waitingPlayers.shift();
      const player2 = waitingPlayers.shift();

      const room = `game_${player1.socketId}_${player2.socketId}`;

      io.sockets.sockets.get(player1.socketId)?.join(room);
      io.sockets.sockets.get(player2.socketId)?.join(room);

      games[room] = {
        player1: { username: player1.username, socketId: player1.socketId, choice: null },
        player2: { username: player2.username, socketId: player2.socketId, choice: null }
      };

      io.to(player1.socketId).emit('gameStart', { opponent: player2.username, room, myRole: 'player1' });
      io.to(player2.socketId).emit('gameStart', { opponent: player1.username, room, myRole: 'player2' });

      console.log(`✅ Game started in room ${room}: ${player1.username} (p1) vs ${player2.username} (p2)`);
    }
  });

  socket.on('move', async ({ choice, room }) => {
    const game = games[room];
    if (!game) return;

    let player, opponent;
    if (game.player1.socketId === socket.id) {
      player = game.player1;
      opponent = game.player2;
    } else if (game.player2.socketId === socket.id) {
      player = game.player2;
      opponent = game.player1;
    } else {
      return;
    }

    player.choice = choice;
    console.log(`${player.username} chose ${choice} in room ${room}`);

    if (game.player1.choice && game.player2.choice) {
      const p1Choice = game.player1.choice;
      const p2Choice = game.player2.choice;
      let winner;

      if (p1Choice === p2Choice) {
        winner = 'tie';
      } else if (
        (p1Choice === 'rock' && p2Choice === 'scissors') ||
        (p1Choice === 'paper' && p2Choice === 'rock') ||
        (p1Choice === 'scissors' && p2Choice === 'paper')
      ) {
        winner = 'player1';
      } else {
        winner = 'player2';
      }

      try {
        if (winner === 'player1') {
          await User.findOneAndUpdate({ username: game.player1.username }, { $inc: { wins: 1 } });
          await User.findOneAndUpdate({ username: game.player2.username }, { $inc: { losses: 1 } });
        } else if (winner === 'player2') {
          await User.findOneAndUpdate({ username: game.player2.username }, { $inc: { wins: 1 } });
          await User.findOneAndUpdate({ username: game.player1.username }, { $inc: { losses: 1 } });
        }
      } catch (err) {
        console.error('❌ Error updating scores:', err);
      }

      io.to(room).emit('roundResult', {
        p1Choice: game.player1.choice,
        p2Choice: game.player2.choice,
        winner
      });

      game.player1.choice = null;
      game.player2.choice = null;
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);

    waitingPlayers = waitingPlayers.filter(p => p.socketId !== socket.id);

    for (const [room, game] of Object.entries(games)) {
      if (game.player1.socketId === socket.id || game.player2.socketId === socket.id) {
        const otherSocketId = game.player1.socketId === socket.id
          ? game.player2.socketId
          : game.player1.socketId;
        io.to(otherSocketId).emit('opponentDisconnected');
        delete games[room];
        break;
      }
    }
  });
});

// API Routes
app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });

    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

server.listen(3000, () => {
  console.log('🚀 Backend server running at http://localhost:3000');
});