const urlParams = new URLSearchParams(window.location.search);
const sessionID = urlParams.get('session');

const socket = io('http://10.17.71.230:3000');

const inputSession = document.getElementById('input-code-session');
inputSession.value = sessionID;
const inputPseudo = document.getElementById('input-pseudo');

// CONTROLLER -> SERVER
document.getElementById('session-form').addEventListener('submit', function(event){
    event.preventDefault();

    if (!inputPseudo.value){
        inputPseudo.value = 'Anonymous';
    }

    const data = {
        session: inputSession.value,
        pseudo: inputPseudo.value
    };

    socket.emit('join-session', data, (response) => {
        inputPseudo.value = response.pseudo;
        document.getElementById('session-form').style.display = 'none';
        document.getElementById('session-form').reset();
        document.getElementById('quit-session').style.display = 'block';
    });
});

document.getElementById('quit-session').addEventListener('click', () => {
    const data = {
        session: inputSession.value,
        pseudo: inputPseudo.value
    };

    socket.emit('quit-session', data, (response) => {
        document.getElementById('quit-session').style.display = 'none';
        document.getElementById('session-form').style.display = 'block';
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SERVER -> CONTROLLER
socket.on('session-deleted', (response) => {
    document.getElementById('main-container').innerHTML += `<p>${response.message}</p>`;
    socket.emit('quit-session', null, null);
    // reviens à la page principale
})
