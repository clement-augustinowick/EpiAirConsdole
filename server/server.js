require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const {customAlphabet} = require('nanoid');

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});


const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const nanoidCustom = customAlphabet(alphabet, 6);

app.use(express.static(path.join(__dirname, '../public')));

const session = {};

io.on('connection', (socket) => {
    console.log('Client connected with id:', socket.id);

    socket.on('create-session', (_, callback) => {
        const sessionID = nanoidCustom();

        session = {
            host: socket.id,
            players: [socket.id],
            state: {}
        };

        socket.join(sessionID);

        callback({sessionID});
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
