if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// UI CONTROLLER
const UI = (function ui() {
const DOM = {
  input_search: document.getElementById('input-search'),
  card_placeholder: document.getElementById('card-placeholder'),
  days_nav: document.getElementById('daysNav')
}


return {
  clearInput: () => DOM.input_search.value = '',
  getDom: () => DOM,
  showCurrentWeather: (data) => {
    let htmlString = `
    <div class="section-forecast__card">
      <div class="section-forecast__card-top">
        <h1 class="heading-city">${data.list[0].name}</h1>
        <h2 class="heading-region">${data.list[0].sys.country}</h2>
      </div>
      <div class="section-forecast__card-middle">
        <img src="http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png" alt="weather-icon">
        <p class="section-temp">${parseFloat(data.list[0].main.temp).toFixed(0)} &deg;</p>
        <p class="section-weather-desc">${data.list[0].weather[0].description}</p>
      </div>
      <div class="section-forecast__card-bottom">
        <div class="section__small-box">
          <span class="section-forecast__span">${data.list[0].main.humidity} %</span>
          <span class="section-forecast__span">humidity</span>
        </div>
        <div class="section-forecast__small-box">
          <span class="section-forecast__span">${data.list[0].main.pressure}</span>
          <span class="section-forecast__span">mmHg</span>
        </div>
        <div class="section-forecast__small-box">
          <span class="section-forecast__span">${data.list[0].wind.speed}</span>
          <span class="section-forecast__span">m/s</span>
        </div>
      </div>
    </div>`;
    DOM.card_placeholder.innerHTML = htmlString;
  },
  showForecast: (data) => {
    data.list.forEach( item => {
      let dayAndHour = item.dt_txt.split('2019-').join('');
      let itemsHTMLstring = `
      <li class="section__forecast-li">
        <span class="section__forecast-span">${dayAndHour}</span>
        <span class="section__forecast-span">${item.weather[0].description}</span>
        <span class="section__forecast-span">${item.main.temp} &deg;</span>
        <span class="section__forecast-span">${item.main.humidity} %</span>
        <span class="section__forecast-span">${item.main.pressure}</span>
        <span class="section__forecast-span">${item.wind.speed} m/s</span>
      </li>`;
      document.getElementById('for-ul').insertAdjacentHTML('beforeend', itemsHTMLstring);
    })

  }
}
})();


// APP CONTROLLER
const APP = (function app(ui) {
const dom = ui.getDom();
const apiWeatherKey = 'faae0f2bf032282ad383ab792ef5c6d4';
const apiIpKey = 'f7793703-26db-4183-803d-c0d85bd71850';

const getDay = (y,m,day) => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date(y, --m, day);
  return d && weekDays[d.getDay()]
}


const callApi = (cityName, apiWeatherKey) => {
  // fetch 5days forecast
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=${apiWeatherKey}`)
  .then(response => response.json())
  .then(data => {
      ui.showForecast(data);
  })
  .catch(err => console.log(err))


  // fetch current weather
  fetch(`https://api.openweathermap.org/data/2.5/find?q=${cityName}&units=metric&APPID=${apiWeatherKey}`)
  .then(response => response.json())
  .then(data => ui.showCurrentWeather(data))
  .catch(err => console.log(err))
}

const getCityNameAndCallApi = (event) => {

  if(event.keyCode === 13) {
    let cityName;
    cityName = event.target.value;
    callApi(cityName, apiWeatherKey)
    ui.clearInput();
  }
}

// show weather based on user IP location
const weatherBasedOnUserIp = () => {
  // get user IP
    fetch(`https://api.ipfind.com/me?auth=${apiIpKey}`)
    .then(response => response.json())
    .then(data => {
      // then fetch current weather based on IP location
      fetch(`https://api.openweathermap.org/data/2.5/find?q=${data.city}&units=metric&APPID=${apiWeatherKey}`)
      .then(response => response.json())
      .then(data => ui.showCurrentWeather(data))
      .catch(err => console.log(err))

      // then fetch 40h forecast based on IP location
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${data.city}&units=metric&APPID=${apiWeatherKey}`)
      .then(response => response.json())
      .then(data => {
         ui.showForecast(data);
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
 }

const eventHandler = () => {
  dom.input_search.addEventListener('keyup', getCityNameAndCallApi);
}

  return {
    init: () => {
       console.log('Application starting...');
       eventHandler();
       weatherBasedOnUserIp();
    }
  }
})(UI)

APP.init();
