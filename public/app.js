const socket = io();
const messagesContainer = document.getElementById('messages');

// 北京时间的格式化函数
function formatBeijingTime(isoString) {
    const date = new Date(isoString + 'Z');
    // 手动添加8小时
    date.setHours(date.getHours() + 8);
    
    // 格式化为 YYYY-MM-DD HH:mm:ss
    return date.toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '')
        .slice(0, 19);
}

// 页面加载时获取历史消息
function loadHistoryMessages() {
    fetch('/messages')
        .then(response => response.json())
        .then(messages => {
            messages.forEach(msg => {
                messagesContainer.appendChild(createMessageElement(msg));
            });
        })
        .catch(error => console.error('加载留言失败:', error));
}

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadHistoryMessages();
});

function createMessageElement(msg) {
    const div = document.createElement('div');
    const isHuang = msg.name === 'HOST';

    div.className = `message-card p-4 rounded-lg ${
        isHuang ? 'message-left sender-huang' : 'message-right'
    }`;

    div.innerHTML = `
        <div class="message-header">
            <div class="message-name font-medium">${escapeHTML(msg.name)}</div>
            <span class="message-time text-sm text-gray-500">${formatBeijingTime(msg.created_at)}</span>
        </div>
        <p class="message-content text-gray-700 whitespace-pre-wrap">${escapeHTML(msg.content)}</p>
    `;

    return div;
}

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;');
}

// 实时更新留言
socket.on('update-messages', (messages) => {
    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
        messagesContainer.appendChild(createMessageElement(msg));
    });
});

// 提交表单
document.getElementById('messageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const message = {
        name: document.getElementById('name').value.trim(),
        content: document.getElementById('content').value.trim()
    };

    if (message.name && message.content) {
        socket.emit('new-message', message);
        document.getElementById('content').value = '';
    }
});


const contentInput = document.getElementById('content');

contentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('messageForm').dispatchEvent(new Event('submit'));
    }
});
