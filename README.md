# 🎮 2048 Game

A modern, web-based implementation of the classic 2048 game, built with Next.js, React, and SQLite. 🚀

## 🌟 Play Now!

**[Play 2048 Game](https://2048.danilosprovieri.com)**

Visit [https://2048.danilosprovieri.com](https://2048.danilosprovieri.com) to play the game live!

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Technologies Used](#️-technologies-used)
- [🚀 Getting Started](#-getting-started)
    - [📋 Prerequisites](#-prerequisites)
    - [⚙️ Installation](#️-installation)
- [🕹️ How to Play](#️-how-to-play)
- [🏗️ Project Structure](#️-project-structure)
- [🌐 API Endpoints](#-api-endpoints)
- [💾 Database](#-database)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

- 🧩 Classic 2048 gameplay with smooth animations
- 📱 Responsive design for desktop and mobile devices
- 🏆 Leaderboard to track high scores
- 🔒 Session-based score tracking to prevent duplicates
- ⚡ Server-side rendering with Next.js for optimal performance
- 🌍 Accessible online at [2048.danilosprovieri.com](https://2048.danilosprovieri.com)

## 🛠️ Technologies Used

- ⚛️ Next.js
- ⚛️ React
- 🗄️ SQLite
- 🎨 Tailwind CSS
- 🌟 Framer Motion (for animations)
- 🆔 UUID (for generating unique session IDs)

## 🚀 Getting Started

### 📋 Prerequisites

- 📦 Node.js (v14 or later)
- 📦 npm (v6 or later)

### ⚙️ Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/2048-game.git
   cd 2048-game
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game locally. 🎉

Remember, you can always play the live version at [https://2048.danilosprovieri.com](https://2048.danilosprovieri.com)!

## 🕹️ How to Play

- 🔼🔽◀️▶️ Use arrow keys or swipe gestures on mobile to move tiles.
- 🔢 Tiles with the same number merge when they touch.
- 🏆 Create a tile with the number 2048 to win!
- 📝 When the game ends, enter your name to save your score to the leaderboard.

## 🏗️ Project Structure

```
2048-game/
├── components/
│   └── (React components)
├── lib/
│   └── db.js
├── pages/
│   ├── api/
│   │   └── scores.js
│   ├── _app.js
│   ├── index.js
│   └── leaderboard.js
├── public/
│   └── (static assets)
├── styles/
│   └── globals.css
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

## 🌐 API Endpoints

- 📊 `GET /api/scores`: Retrieve the top scores
- ✏️ `POST /api/scores`: Add a new score

## 💾 Database

The project uses SQLite to store game scores. The database file (`leaderboard.sqlite`) is created automatically when the application runs for the first time.

Database schema:
```sql
CREATE TABLE scores (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        player_name TEXT NOT NULL,
                        score INTEGER NOT NULL,
                        session_id TEXT UNIQUE,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 👥

## 📄 License

This project is open source and available under the [MIT License](LICENSE). 📜