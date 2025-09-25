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
let playerID = 0;

const sessionTimeout = 10 * 60000;

io.on('connection', (socket) => {
    socket.on('create-session', async (_, callback) => {
        mainScreenSocket = socket;
        playerID = 0;

        const sessionID = nanoidCustom();
        console.log('Session : ', sessionID, ' just start')

        session = {
            sessionID: sessionID,
            host: socket,
            players: {
                socketID: [socket.id],
                id: [playerID]
            },
            state: {},
            lastActivity : Date.now()
        };

        playerID += 1;
        socket.join(sessionID);

        const localIP = getLocalIP();
        const controllerURL = `http://${localIP}:${port}/controller?session=${sessionID}`;

        try {
            const qrDataUrl = await QRCode.toDataURL(controllerURL);
            callback({sessionID, qrDataUrl});
        } catch (error) {
            console.error('Failed to generate QR code: ', error);
            callback({sessionID, qrDataUrl: `http://${localIP}:${port}/controller?session=${sessionID}`});
        }
    });

    socket.on('join-session', (sessionID, callback) => {
        updateActivity();

        if (!session){
            callback({success: 'Session not found'});
            return;
        }

        if (session.players.socketID.find((element) => element == socket.id)){
            callback({success: 'player has already joined the session'});
            return;
        }

        session.players.socketID.push(socket.id);
        session.players.id.push(playerID);
        socket.join(sessionID);
        session.host.emit('playerJoined', {player: playerID});
        callback({success: `Controllers joined the session successfully, you are the player ${playerID}`});
        console.log('Controllers id : ', socket.id, ' joined the session : ', sessionID, ', id : ', playerID);
        playerID += 1;
    });

    socket.on('quit-session', (sessionID, callback) => {
        updateActivity();

        if (session && session.players.socketID.find((element) => element == socket.id)){
            const index = session.players.socketID.indexOf(socket.id);

            session.players.socketID.pop(socket.id);
            session.host.emit('playerLeave', {player: session.players.id[index]});
            session.players.id.splice(index, 1);
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
