import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

export async function openDb() {
    if (!db) {
        db = await open({
            filename: './leaderboard.sqlite',
            driver: sqlite3.Database
        });

        // Create the table if it doesn't exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS scores (
                                                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  player_name TEXT NOT NULL,
                                                  score INTEGER NOT NULL,
                                                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if session_id column exists, if not, add it
        const tableInfo = await db.all("PRAGMA table_info(scores)");
        const sessionIdExists = tableInfo.some(column => column.name === 'session_id');

        if (!sessionIdExists) {
            await db.exec(`
                ALTER TABLE scores ADD COLUMN session_id TEXT
            `);
            console.log("Added session_id column to scores table");
        }
    }
    return db;
}

export async function getTopScores(limit = 10000) {
    const db = await openDb();
    return db.all('SELECT * FROM scores ORDER BY score DESC LIMIT ?', limit);
}

export async function addScore(playerName, score, sessionId) {
    const db = await openDb();
    return db.run('INSERT INTO scores (player_name, score, session_id) VALUES (?, ?, ?)', playerName, score, sessionId);
}

export async function getScoreBySessionId(sessionId) {
    const db = await openDb();
    return db.get('SELECT * FROM scores WHERE session_id = ?', sessionId);
}