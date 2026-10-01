(function () {
  "use strict";

  var modal = document.getElementById("dnWeatherPopup");
  var closeBtn = document.getElementById("dnWeatherPopupClose");

  if (!modal) return;

  function openWeather() {
    modal.style.display = "flex";

    document.body.style.overflow = "hidden";
  }

  function closeWeather() {
    modal.style.display = "none";

    document.body.style.overflow = "";
  }

  /* Open */
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest(".dn-weather-open-trigger");

    if (!trigger) return;

    e.preventDefault();

    openWeather();
  });

  /* Close button */
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closeWeather();
    });
  }

  /* Click outside */
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeWeather();
    }
  });

  /* ESC */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "flex") {
      closeWeather();
    }
  });
})();
