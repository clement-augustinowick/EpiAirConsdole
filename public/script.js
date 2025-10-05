const socket = io('http://localhost:3000');


const slidesData = [
    {img: "images/comming-soon.jpg", text: "Comming soon"},
    {img: "images/comming-soon.jpg", text: "Comming soon"},
    {img: "images/comming-soon.jpg", text: "Comming soon"},
    {img: "images/comming-soon.jpg", text: "Comming soon"},
    {img: "images/comming-soon.jpg", text: "Comming soon"},
    {img: "images/comming-soon.jpg", text: "Comming soon"},
    {img: "images/comming-soon.jpg", text: "Comming soon"},
    {img: "images/comming-soon.jpg", text: "Comming soon"},
    {img: "images/comming-soon.jpg", text: "Comming soon"},
    {img: "images/comming-soon.jpg", text: "Comming soon"}
]

const slider = document.querySelector(".slider-1 .slider");

function createSlide({img, text}){
    const slide = document.createElement("div");
    slide.classList.add("slide");

    const image = document.createElement("img");
    image.src = img;
    image.alt = text;

    const description = document.createElement("p");
    description.classList.add("description");
    description.textContent = text;

    slide.appendChild(image);
    slide.appendChild(description);

    return slide;
}

[...slidesData, ...slidesData].forEach((slideData) => {
    slider.appendChild(createSlide(slideData));
});

// MAIN SCREEN -> SERVER
document.getElementById('menu-btn-start-session').addEventListener('click', () => {
    socket.emit('create-session', null, (response) => {
        document.getElementById('session-code').textContent = `Session code : ${response.sessionID}`;
        document.getElementById('QRCode-container').innerHTML = `<img src="${response.qrDataUrl}" alt="QR code to connect players to session">`;
        document.getElementById('main-container').innerHTML += `<p>Lien de la page pour smartphone : ${response.link}</p>`;
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SERVER -> MAIN SCREEN
socket.on('playerJoined', (response) => {
    document.getElementById('main-container').innerHTML += `<p>Player ${response.player} has joined the session</p>`
})

socket.on('playerLeave', (response) => {
    document.getElementById('main-container').innerHTML += `<p>Player ${response.player} has left the session</p>`
})

socket.on('session-deleted', (response) => {
    document.getElementById('main-container').innerHTML += `<p>${response.message}</p>`
})
