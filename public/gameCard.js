const slidesData = [
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

const catalog = document.getElementById("catalog");

function createGameCard({img, text}){
    const card = document.createElement("div");
    card.classList.add("game-card");

    const image = document.createElement("img");
    image.src = img;
    image.alt = text;

    const name = document.createElement("p");
    name.classList.add("game-name");
    name.textContent = text;

    const btnPlay = document.createElement("button");
    btnPlay.classList.add("btn-game-card");
    btnPlay.textContent = "PLAY";

    const btnDescription = document.createElement("button");
    btnDescription.classList.add("btn-game-card-description");
    btnDescription.textContent = "DESCRIPTION";
    const arrow = document.createElement("span");
    arrow.textContent = "▼";
    arrow.classList.add("btn-game-description-arrow");
    btnDescription.appendChild(arrow);

    const description = document.createElement("div");
    description.classList.add("description-game");
    const titleDescription = document.createElement("h3");
    titleDescription.textContent = "Titre description";
    const textDescription = document.createElement("p");
    textDescription.textContent = "Description text";
    textDescription.classList.add("p-description-text");
    description.appendChild(titleDescription);
    description.appendChild(textDescription);

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(btnPlay);
    card.appendChild(btnDescription);
    card.appendChild(description);

    return card;
}

slidesData.forEach((gameCard) => {
    catalog.appendChild(createGameCard(gameCard));
});

const button = document.querySelectorAll(".btn-game-card-description");

button.forEach(btn => {
    const arrow = btn.querySelector(".btn-game-description-arrow");
    const description = btn.nextElementSibling;

    btn.addEventListener('click', () => {
        button.forEach(b => {
            if (b !== btn){
                const arr = b.querySelector(".btn-game-description-arrow");
                arr.classList.remove("rotated");

                const desc = b.nextElementSibling;
                desc.style.height = null;
            }
        });

        if (description.style.height) {
            description.style.height = null;
        } else {
            description.style.height = "200px";
        }

        arrow.classList.toggle("rotated");
    });
});
