require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const {customAlphabet} = require('nanoid');
const QRCode = require('qrcode');
const os = require('os');

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});


app.use(express.static(path.join(__dirname, '../public')));

app.get('/controller', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/controller.html'));
});


const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const nanoidCustom = customAlphabet(alphabet, 6);

let session = {};

const sessionTimeout = 10 * 60000;

io.on('connection', (socket) => {
    socket.on('create-session', async (_, callback) => {
        const sessionID = nanoidCustom();
        console.log('Session : ', sessionID, ' just start')

        session = {
            sessionID: sessionID,
            host: socket,
            players: {
                socketID: [socket.id],
                id: [0]
            },
            lastActivity : Date.now()
        };

        socket.join(sessionID);

        const localIP = getLocalIP();
        const controllerURL = `http://${localIP}:${port}/controller?session=${sessionID}`;

        try {
            const qrDataUrl = await QRCode.toDataURL(controllerURL);
            callback({sessionID, qrDataUrl, link: `http://${localIP}:${port}/controller`});
        } catch (error) {
            console.error('Failed to generate QR code: ', error);
            callback({sessionID, qrDataUrl: `http://${localIP}:${port}/controller?session=${sessionID}`});
        }
    });

    socket.on('join-session', (sessionID, callback) => {
        updateActivity();
        const playerID = findPlayerId();

        if (!session || !session.players){
            callback({success: 'Session not found'});
            return;
        }

        if (session.players.socketID.find((element) => element == socket.id)){
            callback({success: 'player has already joined the session'});
            return;
        }

        if (playerID == -1){
            callback({success: 'There are already 4 players connected'});
            return;
        }

        session.players.socketID.push(socket.id);
        session.players.id.push(playerID);
        socket.join(sessionID);
        session.host.emit('playerJoined', {player: playerID});
        callback({success: `Controllers joined the session successfully, you are the player ${playerID}`});
        console.log('Controllers id : ', socket.id, ' joined the session : ', sessionID, ', id : ', playerID);
    });

    socket.on('quit-session', (sessionID, callback) => {
        updateActivity();

        if (session && session.players.socketID.find((element) => element == socket.id)){
            const index = session.players.socketID.indexOf(socket.id);

            console.log(`Player ${session.players.id[index]} has left the session`);
            socket.leave(session.sessionID);
            session.players.socketID.pop(socket.id);
            session.host.emit('playerLeave', {player: session.players.id[index]});
            session.players.id.splice(index, 1);
            callback({message: 'You have successfuly left the session'});
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})

function getLocalIP(){
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)){
        for (const net of interfaces[name]){
            if (net.family === 'IPv4' && !net.internal){
                return net.address;
            }
        }
    }
    return 'localhost';
}

function updateActivity(){
    if (session)
        session.lastActivity = Date.now();
}

const activity = setInterval(() => {
    const now = Date.now();
    
    if (!session)
        return;
    
    if (now - session.lastActivity > sessionTimeout){
        console.log('Session has been deleted due to inactivity');
        io.to(session.sessionID).emit('session-deleted', {message: 'Session has been deleted due to inactivity'});
        session = {};
    }
}, 60000);

function findPlayerId(){
    if (!session || !session.players)
        return -1;

    for (let i = 1; i < 5; i++){
        if (session.players.id.find((element) => element == i))
            continue;
        return i;
    }

    return -1;
}
