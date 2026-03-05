// Connect to server
const socket = io('http://localhost:3000');

// DOM elements
const loginDiv = document.getElementById('login');
const gameDiv = document.getElementById('game');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('loginBtn');
const resultDiv = document.getElementById('result');
const scoreDiv = document.getElementById('score');

let currentUser = null;
let currentRoom = null;
let opponentName = '';
let myRole = null; // 'player1' or 'player2'

// Login button click
loginBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert('Please enter a name');

  try {
<<<<<<< HEAD
    // Register/login with backend
=======
>>>>>>> 2cfe7e8 (Convert frontend submodule to regular folder)
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    currentUser = await response.json();

<<<<<<< HEAD
    // Hide login, show game
    loginDiv.style.display = 'none';
    gameDiv.style.display = 'block';

    // Display initial score
    scoreDiv.innerHTML = `Wins: ${currentUser.wins} | Losses: ${currentUser.losses}`;

    // Tell server we're ready to play
=======
    loginDiv.style.display = 'none';
    gameDiv.style.display = 'block';
    scoreDiv.innerHTML = `Wins: ${currentUser.wins} | Losses: ${currentUser.losses}`;

>>>>>>> 2cfe7e8 (Convert frontend submodule to regular folder)
    socket.emit('ready', currentUser.username);
  } catch (err) {
    console.error('Login failed:', err);
    alert('Failed to login. Check console.');
  }
});

// Listen for game start
socket.on('gameStart', (data) => {
  opponentName = data.opponent;
  currentRoom = data.room;
<<<<<<< HEAD
  myRole = data.myRole; // store our role
  resultDiv.innerHTML = `Game started! You are playing against ${opponentName}`;
});

// Handle move buttons
=======
  myRole = data.myRole;
  resultDiv.innerHTML = `Game started! You are playing against ${opponentName}`;
});

// Move buttons
>>>>>>> 2cfe7e8 (Convert frontend submodule to regular folder)
document.getElementById('rock').addEventListener('click', () => makeMove('rock'));
document.getElementById('paper').addEventListener('click', () => makeMove('paper'));
document.getElementById('scissors').addEventListener('click', () => makeMove('scissors'));

function makeMove(choice) {
  if (!currentRoom) {
    alert('Waiting for an opponent...');
    return;
  }
  socket.emit('move', { choice, room: currentRoom });
}

<<<<<<< HEAD
// Listen for round result and update display + scores
socket.on('roundResult', async (data) => {
  const { p1Choice, p2Choice, winner } = data;

  // Determine winner message based on our role
=======
// Round result
socket.on('roundResult', async (data) => {
  const { p1Choice, p2Choice, winner } = data;

>>>>>>> 2cfe7e8 (Convert frontend submodule to regular folder)
  let winnerMessage = '';
  if (winner === 'tie') {
    winnerMessage = "It's a tie!";
  } else if (winner === 'player1') {
    winnerMessage = (myRole === 'player1') ? 'You win!' : 'Opponent wins!';
  } else if (winner === 'player2') {
    winnerMessage = (myRole === 'player2') ? 'You win!' : 'Opponent wins!';
  }

  resultDiv.innerHTML = `
    You chose: ${p1Choice}<br>
    Opponent chose: ${p2Choice}<br>
    <strong>${winnerMessage}</strong>
  `;

<<<<<<< HEAD
  // Fetch updated user stats
=======
>>>>>>> 2cfe7e8 (Convert frontend submodule to regular folder)
  try {
    const response = await fetch(`http://localhost:3000/api/users/${currentUser.username}`);
    const updatedUser = await response.json();
    currentUser = updatedUser;
    scoreDiv.innerHTML = `Wins: ${updatedUser.wins} | Losses: ${updatedUser.losses}`;
  } catch (err) {
    console.error('Failed to fetch updated stats:', err);
  }
});

<<<<<<< HEAD
// Handle opponent disconnect
socket.on('opponentDisconnected', () => {
  resultDiv.innerHTML = 'Opponent left the game. Please refresh to play again.';
  currentRoom = null; // prevent further moves
});

// Handle connection errors
=======
// Opponent disconnect
socket.on('opponentDisconnected', () => {
  resultDiv.innerHTML = 'Opponent left the game. Please refresh to play again.';
  currentRoom = null;
});

// Connection error
>>>>>>> 2cfe7e8 (Convert frontend submodule to regular folder)
socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
  alert('Cannot connect to server. Make sure the backend is running.');
});