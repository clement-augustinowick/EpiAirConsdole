require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const {customAlphabet} = require('nanoid');
const QRCode = require('qrcode');
const os = require('os');

const port = process.env.PORT || 5000;
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

let mainScreenSocket = null;

const session = {};
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const nanoidCustom = customAlphabet(alphabet, 6);

io.on('connection', (socket) => {
    socket.on('create-session', async (_, callback) => {
        if (!mainScreenSocket){
            mainScreenSocket = socket;
        }

        const sessionID = nanoidCustom();
        console.log('Session : ', sessionID, ' just start')

        session[sessionID] = {
            host: socket.id,
            players: [socket.id],
            state: {}
        };

        socket.join(sessionID);

        const localIP = getLocalIP();
        const controllerURL = `http://${localIP}:${port}/controller?session=${sessionID}`;

        try {
            const qrDataUrl = await QRCode.toDataURL(controllerURL);
            callback({sessionID, qrDataUrl});
        } catch (error) {
            console.error('Failed to generate QR code: ', error);
            callback({sessionID, qrDataUrl: null});
        }
    });

    socket.on('joined-session', (sessionID, callback) => {
        if (!session){
            callback({success: 'Session not found'});
            return;
        }

        if (session[sessionID].players.find((playerID) => playerID == socket.id)){
            callback({success: 'player has already joined the session'});
            return;
        }

        session[sessionID].players.push(socket.id);
        socket.join(sessionID);
        mainScreenSocket.emit('playerJoined', {player: session[sessionID].players.length - 1});
        callback({success: 'Controllers joined the session successfully'});
        console.log('Controllers id : ', socket.id, ' joined the session : ', sessionID);
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
