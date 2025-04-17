# MessageBoard

一个基于 Node.js + Express + SQLite 实现的简易实时免登录留言板，可用于在对方无法登录社交平台时与对方取得联系

## Feature

- **实时更新**：使用 Socket.io 实现即时通讯
- **安全防护**：前端显示时进行 HTML 转义
- **响应式设计**：适配各种设备屏幕
- **数据持久化**：使用 SQLite 数据库存储
- **无需登录**：直接输入昵称即可留言
- **自动滚动**：新留言自动显示在顶部
- **输入限制**：昵称20字，内容200字限制
- **对话式布局**：可明显区分主客

## Installation and usage

```sh
git clone https://github.com/7eph-yr/MessageBoard
sudo apt install npm
cd MessageBoard
npm init -y
npm install express sqlite3 socket.io
tmux  // 可选
node server.js
```

默认开放端口为3000，在浏览器输入 `http://你的服务器IP:3000` 即可访问，所有设备浏览器共享同一数据源，若无法访问可检查防火墙端口是否开放

推荐使用Nginx配置反向代理

## Framework

```
MessageBoard/
├── public/
│   ├── index.html   // 前端代码
│   ├── style.css    // 前端样式
│   └── app.js       // 前段逻辑
├── database/
│   └── messages.db
├── server.js        // 后端代码
└── package.json
```
