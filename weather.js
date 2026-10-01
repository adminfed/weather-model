(function () {
  const latitude = 16.0544;
  const longitude = 108.2022;

  const api =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" +
    latitude +
    "&longitude=" +
    longitude +
    "&current=" +
    "temperature_2m," +
    "relative_humidity_2m," +
    "apparent_temperature," +
    "weather_code," +
    "wind_speed_10m" +
    "&hourly=precipitation_probability" +
    "&daily=" +
    "weather_code," +
    "temperature_2m_max," +
    "temperature_2m_min," +
    "precipitation_probability_max," +
    "wind_speed_10m_max" +
    "&timezone=Asia%2FHo_Chi_Minh" +
    "&forecast_days=7";

  /* ============================
     WEATHER TEXT (Hỗ trợ đa ngôn ngữ)
     ============================ */

  const weatherTextEn = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    56: "Freezing drizzle",
    57: "Heavy freezing drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Light showers",
    81: "Showers",
    82: "Heavy showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };

  const weatherIcon = {
    0: String.fromCodePoint(0x2600, 0xfe0f),
    1: String.fromCodePoint(0x1f324, 0xfe0f),
    2: String.fromCodePoint(0x26c5),
    3: String.fromCodePoint(0x2601, 0xfe0f),
    45: String.fromCodePoint(0x1f32b, 0xfe0f),
    48: String.fromCodePoint(0x1f32b, 0xfe0f),
    51: String.fromCodePoint(0x1f326, 0xfe0f),
    53: String.fromCodePoint(0x1f326, 0xfe0f),
    55: String.fromCodePoint(0x1f327, 0xfe0f),
    56: String.fromCodePoint(0x1f327, 0xfe0f),
    57: String.fromCodePoint(0x1f327, 0xfe0f),
    61: String.fromCodePoint(0x1f327, 0xfe0f),
    63: String.fromCodePoint(0x1f327, 0xfe0f),
    65: String.fromCodePoint(0x1f327, 0xfe0f),
    66: String.fromCodePoint(0x1f327, 0xfe0f),
    67: String.fromCodePoint(0x1f327, 0xfe0f),
    71: String.fromCodePoint(0x1f328, 0xfe0f),
    73: String.fromCodePoint(0x2744, 0xfe0f),
    75: String.fromCodePoint(0x2744, 0xfe0f),
    77: String.fromCodePoint(0x2744, 0xfe0f),
    80: String.fromCodePoint(0x1f326, 0xfe0f),
    81: String.fromCodePoint(0x1f327, 0xfe0f),
    82: String.fromCodePoint(0x1f327, 0xfe0f),
    85: String.fromCodePoint(0x1f328, 0xfe0f),
    86: String.fromCodePoint(0x1f328, 0xfe0f),
    95: String.fromCodePoint(0x26c8, 0xfe0f),
    96: String.fromCodePoint(0x26c8, 0xfe0f),
    99: String.fromCodePoint(0x26c8, 0xfe0f),
  };

  function get(id) {
    return document.getElementById(id);
  }

  /* Lấy ngôn ngữ hiện tại của trang */
  function getAppLanguage() {
    var match = document.cookie.match(/(?:^|; )googtrans=\/([^/]+)\/([^;]+)/);
    if (match && match[2]) {
      return match[2].toLowerCase();
    }
    return document.documentElement.lang || navigator.language || "en";
  }

  /* ============================
     DATE / WEEKDAY (Đã tối ưu hóa)
     ============================ */

  function formatWeatherDate(dateString) {
    const date = new Date(dateString + "T12:00:00+07:00");
    const currentLang = getAppLanguage();

    const weekday = new Intl.DateTimeFormat(currentLang, {
      weekday: "short",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(date);

    const day = new Intl.DateTimeFormat(currentLang, {
      day: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(date);

    const month = new Intl.DateTimeFormat(currentLang, {
      month: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(date);

    return {
      weekday: weekday,
      date: day + "/" + month,
    };
  }

  /* ============================
     CURRENT WEATHER
     ============================ */

  function updateCurrent(data) {
    const current = data.current;
    const temp = Math.round(current.temperature_2m);
    const feels = Math.round(current.apparent_temperature);
    const humidity = Math.round(current.relative_humidity_2m);
    const wind = Math.round(current.wind_speed_10m);
    const code = current.weather_code;

    get("dnWeatherTemp").textContent = temp;
    get("dnWeatherFeels").textContent = feels;
    get("dnWeatherHumidity").textContent = humidity;
    get("dnWeatherWind").textContent = wind;

    // Để nguyên văn bản tiếng Anh trong thẻ để công cụ dịch tự động dịch chuẩn
    get("dnWeatherStatus").textContent = weatherTextEn[code] || "Weather";
    get("dnWeatherIcon").textContent =
      weatherIcon[code] || String.fromCodePoint(0x1f324, 0xfe0f);

    const now = new Date();
    const currentHour = now.getHours();
    let rain = "--";

    if (data.hourly && data.hourly.precipitation_probability) {
      rain = data.hourly.precipitation_probability[currentHour];
    }

    get("dnWeatherRain").textContent = rain != null ? rain : "--";

    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    get("dnWeatherUpdated").textContent = hh + ":" + mm;
  }

  /* ============================
     7 DAY FORECAST
     ============================ */

  function updateForecast(data) {
    const daily = data.daily;
    const container = get("dnWeatherForecast");
    container.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {
      const date = formatWeatherDate(daily.time[i]);
      const code = daily.weather_code[i];
      const max = Math.round(daily.temperature_2m_max[i]);
      const min = Math.round(daily.temperature_2m_min[i]);
      const rain = daily.precipitation_probability_max[i];

      const item = document.createElement("div");
      item.className = "dn-weather-day" + (i === 0 ? " today" : "");

      // Để từ 'Today' chuẩn tiếng Anh để Google Translate nhận biết và dịch chính xác
      const dayName = i === 0 ? "Today" : date.weekday;

      const icon = weatherIcon[code] || String.fromCodePoint(0x1f324, 0xfe0f);
      const rainIcon = String.fromCodePoint(0x1f327, 0xfe0f);

      item.innerHTML =
        '<div class="dn-weather-day-name">' +
        dayName +
        "</div>" +
        '<div class="dn-weather-day-date">' +
        date.date +
        "</div>" +
        '<div class="dn-weather-day-icon">' +
        icon +
        "</div>" +
        '<div class="dn-weather-day-temp">' +
        "<strong>" +
        max +
        "°</strong> " +
        "<span>" +
        min +
        "°</span>" +
        "</div>" +
        '<div class="dn-weather-day-rain">' +
        rainIcon +
        " " +
        (rain != null ? rain : "--") +
        "%" +
        "</div>";

      container.appendChild(item);
    }
  }

  /* ============================
     LOAD WEATHER & AUTO REFRESH
     ============================ */

  let weatherDataCache = null;

  function loadWeather() {
    fetch(api, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("Weather API error");
        return response.json();
      })
      .then(function (data) {
        weatherDataCache = data;
        updateCurrent(data);
        updateForecast(data);
      })
      .catch(function (error) {
        console.log("Da Nang Weather:", error);
        get("dnWeatherStatus").textContent = "Weather unavailable";
      });
  }

  loadWeather();

  // Tự động render lại thứ/ngày khi khách đổi ngôn ngữ trên trang
  let lastLang = getAppLanguage();
  setInterval(function () {
    const currentLang = getAppLanguage();
    if (currentLang !== lastLang) {
      lastLang = currentLang;
      if (weatherDataCache) {
        updateForecast(weatherDataCache);
      }
    }
  }, 1000);

  // Tự động làm mới dữ liệu thời tiết mỗi 15 phút
  setInterval(loadWeather, 15 * 60 * 1000);
})();
