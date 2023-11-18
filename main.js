import condition from "./condition.js";

const apiKey = 'a039ece8da7647ef84b52610231409';

const header = document.querySelector('.header');
const form = document.querySelector('.form');
const input = document.querySelector('.input');

function removeCard() {
    const prevCard = document.querySelector('.card');
    if (prevCard)
        prevCard.remove();
}

function showError(errorMessage) {
    const html = `<div class = "card">${errorMessage}</div>`
    header.insertAdjacentHTML('afterend', html);
}

function showCard(name, country, temp_c, text, img) {
    const html = `<div class="card">
    <h2 class="card-sity">${name}<span>${country}</span></h2>
    <div class="card-weather">
        <div class="card-value card-c">${temp_c}°<sub>с</sub></div>
        <img class="card-img" src="${img}" alt="16pnges">
    </div>
    <div class="card-description">${text}</div>
    </div>`

    header.insertAdjacentHTML('afterend', html);
}

async function getWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;

}

form.onsubmit = async function (e) {
    // отмена отправки формы
    e.preventDefault();
    // значение из импута
    let city = input.value.trim();
    // получаем данные с сервера
    const data = await getWeather(city);

    if (data.error) {
        removeCard();
        showError("Такого города не существует!");
    } else {
        removeCard();

        const info = condition.find(function (obj) {
            if (obj.code === data.current.condition.code) {
                return true;
            }
        });

        const filePath = './img/' + (data.current.is_day ? 'sun' : 'cloud') + '/';
        const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const PathName = filePath + fileName;

        showCard(
            data.location.name, data.location.country,
            data.current.temp_c,
            data.current.is_day ? info.languages[23].day_text : info.languages[23].night_text,
            PathName)
    }
} 
