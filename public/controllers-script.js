const urlParams = new URLSearchParams(window.location.search);
const sessionID = urlParams.get('session');

const socket = io('http://10.17.71.230:3000');

document.getElementById('input-code-session').textContent = sessionID;

// CONTROLLER -> SERVER
document.getElementById('join-session').addEventListener('click', () => {
    socket.emit('join-session', sessionID, (response) => {
        document.getElementById('success-title').textContent = response.success;
    });
});

document.getElementById('quit-session').addEventListener('click', () => {
    socket.emit('quit-session', sessionID, (response) => {
        document.getElementById('success-title').textContent = response.message;
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SERVER -> CONTROLLER
socket.on('session-deleted', (response) => {
    document.getElementById('main-container').innerHTML += `<p>${response.message}</p>`;
    socket.emit('quit-session', null, null);
    // reviens à la page principale
})
