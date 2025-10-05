const socket = io('http://localhost:3000');


// MAIN SCREEN -> SERVER
document.getElementById('btn-generate-session').addEventListener('click', () => {
    socket.emit('create-session', null, (response) => {
        document.getElementById('session-code').textContent = `Session code : ${response.sessionID}`;
        document.getElementById('QRCode-container').innerHTML = `<img src="${response.qrDataUrl}" alt="QR code to connect players to session">`;
        // document.getElementById('session-link').textContent = `Lien de la page pour smartphone : ${response.link}`;
        document.querySelectorAll('.qrcode-help').forEach(btn => {btn.style.display = 'block'});
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SERVER -> MAIN SCREEN
socket.on('playerJoined', (response) => {
    document.getElementById('session-container').innerHTML += `<p>Player ${response.player} has joined the session</p>`
})

socket.on('playerLeave', (response) => {
    document.getElementById('session-container').innerHTML += `<p>Player ${response.player} has left the session</p>`
})

socket.on('session-deleted', (response) => {
    document.getElementById('session-container').innerHTML += `<p>${response.message}</p>`
})
