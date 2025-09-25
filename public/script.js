const socket = io('http://localhost:3000');

let sessionID = null;

document.getElementById('start-session').addEventListener('click', () => {
    socket.emit('create-session', null, (response) => {
        document.getElementById('sessionCode').textContent = response.sessionID;
        document.getElementById('QRCode-container').innerHTML = `<img src="${response.qrDataUrl}" alt="QR code to connect players to session">`;
    });
});

socket.on('playerJoined', (response) => {
    document.getElementById('main-container').innerHTML += `<p>Player ${response.player} has joined the session</p>`
})

socket.on('playerLeave', (response) => {
    document.getElementById('main-container').innerHTML += `<p>Player ${response.player} has left the session</p>`
})

socket.on('session-deleted', (response) => {
    document.getElementById('main-container').innerHTML += `<p>${response.message}</p>`
})
