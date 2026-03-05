# 🎮 Rock Paper Scissors – Multiplayer Real-Time Game

Welcome to **RGB Arena** – a full‑stack, real‑time multiplayer Rock Paper Scissors game!  
Two players can connect, enter usernames, and play rounds instantly. Scores are persisted in a database, and the vibrant red‑green‑blue gradient theme makes the experience pop.

![Game Screenshot](/game%20screenshot/screenshot.png) 

---

## ✨ Features

- **Real‑time multiplayer** – thanks to Socket.IO, moves and results appear instantly.
- **User registration** – enter any username; new players are automatically created.
- **Persistent scores** – wins and losses are stored in MongoDB and update live.
- **Matchmaking** – automatically pairs the first two players waiting.
- **Infinite rounds** – after each round, you can play again immediately.
- **Disconnect handling** – if an opponent leaves, you’re notified and can refresh to start over.
- **Beautiful responsive UI** – a gradient background with red, green, and blue, smooth animations, and mobile‑friendly design.

---


# 🛠 Tech Stack

| Layer | Technology |
|------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6) |
| **Backend** | Node.js, Express |
| **Real-Time Communication** | Socket.IO |
| **Database** | MongoDB with Mongoose |
| **Development Tools** | nodemon (optional), Live Server |

---


## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation) **or** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud account
- A modern web browser (Chrome, Firefox, Edge)
- (Optional) [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension for frontend development

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/boipelo-codes/rock-paper-scissors.git
cd rock-paper-scissors
```

### Backend Setup
```bash
cd backend
npm install
```

### Configuration
#### Configure MongoDB
#### Option A
* Local MongoDB
Make sure MongoDB is running on your machine (default port 27017).

The default connection string in server.js is mongodb://127.0.0.1:27017/rps.
You can change it if needed.

#### Option B 
* MongoDB Atlas (cloud)
Create a free cluster at MongoDB Atlas.

##### Obtain your connection string (e.g., mongodb+srv://<user>:<password>@cluster.mongodb.net/rpsDB).

In backend/server.js, replace the mongoose.connect line with your Atlas URI.

### Start backend server
```bash
node server.js
```

##### You should see:
```bash
🚀 Backend server running at http://localhost:3000
✅ MongoDB connected
```

### Frontend Setup
* Open the frontend folder. You can serve the frontend using Live Server (recommended) or any static server.

* If using VS Code Live Server, right‑click index.html and choose Open with Live Server.
The app will open at http://127.0.0.1:5500 (or http://localhost:3000).

* Alternatively, you can open index.html directly, but some browsers may block WebSocket connections due to CORS. Live Server is strongly recommended.

### Play the Game 
* Open two different browsers (or two incognito windows) at the frontend URL.

* Enter a username in each (e.g., "Player1" and "Player2").

* Once both are ready, they will be matched automatically.

Click Rock, Paper, or Scissors to make a move. After both choose, the result appears and scores update.

## 🎯 How to Play
1. Enter a username on the login screen.

2. Wait for an opponent – the status will show “Waiting for opponent…”.

3. When a second player joins, the game starts and you’ll see their name.

4. Click one of the three buttons to make your choice.

5. After both players choose, the round result is displayed, and scores are updated.

6. Play as many rounds as you like – the game automatically resets after each round.

If an opponent disconnects, you’ll be notified; refresh the page to start a new game.
