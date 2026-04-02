const io = require('socket.io-client');
const socket = io('http://localhost:5001');

socket.on('connect', () => {
    console.log('Script connected:', socket.id);
});

socket.on('trigger_extension_context', (data) => {
    console.log('Received broadcast from Backend!', data);
    process.exit(0);
});

console.log('Waiting for Activate click on dashboard...');
