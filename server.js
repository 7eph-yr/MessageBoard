const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const sqlite3 = require('sqlite3').verbose();

// 初始化数据库
const db = new sqlite3.Database('./database/messages.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database');
  
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.use(express.static('public'));
app.use(express.json());

// API 路由
app.get('/messages', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Socket.io 实时通信
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('new-message', (msg) => {
    const stmt = db.prepare('INSERT INTO messages (name, content) VALUES (?, ?)');
    stmt.run(msg.name, msg.content, (err) => {
      if (err) return console.error(err.message);
      db.all('SELECT * FROM messages ORDER BY created_at DESC', (err, rows) => {
        io.emit('update-messages', rows);
      });
    });
    stmt.finalize();
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
