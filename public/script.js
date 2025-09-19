const socket = io('http://localhost:3000');

let sessionID = null;

document.getElementById('start-session').addEventListener('click', () => {
    socket.emit('create-session', null, (response) => {
        document.getElementById('sessionCode').textContent = response.sessionID;
        sessionID = response;
        console.log('Session ID :', sessionID);
    });
});
