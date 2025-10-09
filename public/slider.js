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