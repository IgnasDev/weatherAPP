"use strict";


if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
} // UI CONTROLLER


var UI = function ui() {
  var DOM = {
    input_search: document.getElementById('input-search'),
    card_placeholder: document.getElementById('card-placeholder'),
    days_nav: document.getElementById('daysNav')
  };
  return {
    clearInput: function clearInput() {
      return DOM.input_search.value = '';
    },
    getDom: function getDom() {
      return DOM;
    },
    showCurrentWeather: function showCurrentWeather(data) {
      var htmlString = "\n    <div class=\"section-forecast__card\">\n      <div class=\"section-forecast__card-top\">\n        <h1 class=\"heading-city\">".concat(data.list[0].name, "</h1>\n        <h2 class=\"heading-region\">").concat(data.list[0].sys.country, "</h2>\n      </div>\n      <div class=\"section-forecast__card-middle\">\n        <img src=\"http://openweathermap.org/img/w/").concat(data.list[0].weather[0].icon, ".png\" alt=\"weather-icon\">\n        <p class=\"section-temp\">").concat(parseFloat(data.list[0].main.temp).toFixed(0), " &deg;</p>\n        <p class=\"section-weather-desc\">").concat(data.list[0].weather[0].description, "</p>\n      </div>\n      <div class=\"section-forecast__card-bottom\">\n        <div class=\"section__small-box\">\n          <span class=\"section-forecast__span\">").concat(data.list[0].main.humidity, " %</span>\n          <span class=\"section-forecast__span\">humidity</span>\n        </div>\n        <div class=\"section-forecast__small-box\">\n          <span class=\"section-forecast__span\">").concat(data.list[0].main.pressure, "</span>\n          <span class=\"section-forecast__span\">mmHg</span>\n        </div>\n        <div class=\"section-forecast__small-box\">\n          <span class=\"section-forecast__span\">").concat(data.list[0].wind.speed, "</span>\n          <span class=\"section-forecast__span\">m/s</span>\n        </div>\n      </div>\n    </div>");
      DOM.card_placeholder.innerHTML = htmlString;
    },
    showForecast: function showForecast(data) {
      data.list.forEach(function (item) {
        var dayAndHour = item.dt_txt.split('2019-').join('');
        var itemsHTMLstring = "\n      <li class=\"section__forecast-li\">\n        <span class=\"section__forecast-span\">".concat(dayAndHour, "</span>\n        <span class=\"section__forecast-span\">").concat(item.weather[0].description, "</span>\n        <span class=\"section__forecast-span\">").concat(item.main.temp, " &deg;</span>\n        <span class=\"section__forecast-span\">").concat(item.main.humidity, " %</span>\n        <span class=\"section__forecast-span\">").concat(item.main.pressure, "</span>\n        <span class=\"section__forecast-span\">").concat(item.wind.speed, " m/s</span>\n      </li>");
        document.getElementById('for-ul').insertAdjacentHTML('beforeend', itemsHTMLstring);
      });
    }
  };
}(); // APP CONTROLLER


var APP = function app(ui) {
  var dom = ui.getDom();
  var apiWeatherKey = 'faae0f2bf032282ad383ab792ef5c6d4';
  var apiIpKey = 'f7793703-26db-4183-803d-c0d85bd71850';

  var getDay = function getDay(y, m, day) {
    var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(y, --m, day);
    return d && weekDays[d.getDay()];
  };

  var callApi = function callApi(cityName, apiWeatherKey) {
    // fetch 5days forecast
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=".concat(cityName, "&units=metric&APPID=").concat(apiWeatherKey)).then(function (response) {
      return response.json();
    }).then(function (data) {
      ui.showForecast(data);
    }).catch(function (err) {
      return console.log(err);
    }); // fetch current weather

    fetch("https://api.openweathermap.org/data/2.5/find?q=".concat(cityName, "&units=metric&APPID=").concat(apiWeatherKey)).then(function (response) {
      return response.json();
    }).then(function (data) {
      return ui.showCurrentWeather(data);
    }).catch(function (err) {
      return console.log(err);
    });
  };

  var getCityNameAndCallApi = function getCityNameAndCallApi(event) {
    if (event.keyCode === 13) {
      var cityName;
      cityName = event.target.value;
      callApi(cityName, apiWeatherKey);
      ui.clearInput();
    }
  }; // show weather based on user IP location


  var weatherBasedOnUserIp = function weatherBasedOnUserIp() {
    // get user IP
    fetch("https://api.ipfind.com/me?auth=".concat(apiIpKey)).then(function (response) {
      return response.json();
    }).then(function (data) {
      // then fetch current weather based on IP location
      fetch("https://api.openweathermap.org/data/2.5/find?q=".concat(data.city, "&units=metric&APPID=").concat(apiWeatherKey)).then(function (response) {
        return response.json();
      }).then(function (data) {
        return ui.showCurrentWeather(data);
      }).catch(function (err) {
        return console.log(err);
      }); // then fetch 40h forecast based on IP location

      fetch("https://api.openweathermap.org/data/2.5/forecast?q=".concat(data.city, "&units=metric&APPID=").concat(apiWeatherKey)).then(function (response) {
        return response.json();
      }).then(function (data) {
        ui.showForecast(data);
      }).catch(function (err) {
        return console.log(err);
      });
    }).catch(function (err) {
      return console.log(err);
    });
  };

  var eventHandler = function eventHandler() {
    dom.input_search.addEventListener('keyup', getCityNameAndCallApi);
  };

  return {
    init: function init() {
      console.log('Application starting...');
      eventHandler();
      weatherBasedOnUserIp();
    }
  };
}(UI);

APP.init();
