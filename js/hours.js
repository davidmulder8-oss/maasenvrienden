/**
 * Maas en Vrienden - openingstijden
 * Eén centrale bron voor alle openingstijden-weergaves op de site
 * (statusindicator "Vandaag geopend/gesloten", openingstijden-overzicht en
 * footer). Meertalig via js/i18n.js - pas tijden hieronder op één plek aan.
 */
(function () {
  "use strict";

  // index: 0 = zondag ... 6 = zaterdag (JS Date#getDay convention).
  // Een sluitingstijd van "00:00" betekent middernacht (einde van de dag).
  var OPENING_HOURS = {
    0: { open: "11:00", close: "22:00" }, // zondag
    1: null,                              // maandag - gesloten
    2: null,                              // dinsdag - gesloten
    3: null,                              // woensdag - gesloten
    4: { open: "11:30", close: "00:00" }, // donderdag
    5: { open: "11:30", close: "00:00" }, // vrijdag
    6: { open: "11:00", close: "00:00" }  // zaterdag
  };

  var DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  function toMinutes(hhmm) {
    var parts = hhmm.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  // A close time of "00:00" means midnight = end of the current day (1440),
  // not the very start of it - needed so "closes at midnight" compares correctly.
  function closeMinutes(hhmm) {
    return hhmm === "00:00" ? 1440 : toMinutes(hhmm);
  }

  function t(key, fallback) {
    if (window.MEV_I18N) return window.MEV_I18N.t(key);
    return fallback;
  }

  function getStatus(now) {
    now = now || new Date();
    var day = now.getDay();
    var today = OPENING_HOURS[day];
    var nowMin = now.getHours() * 60 + now.getMinutes();

    if (today && nowMin >= toMinutes(today.open) && nowMin < closeMinutes(today.close)) {
      return { isOpen: true, today: today };
    }
    return { isOpen: false, today: today };
  }

  function renderStatusBadges() {
    var status = getStatus();
    document.querySelectorAll("[data-status-badge]").forEach(function (el) {
      var dot = el.querySelector(".status-dot");
      var label = el.querySelector("[data-status-label]");
      var hours = el.querySelector("[data-status-hours]");
      if (dot) {
        dot.classList.remove("is-open", "is-closed");
        dot.classList.add(status.isOpen ? "is-open" : "is-closed");
      }
      if (label) {
        label.textContent = status.today ? t("common.todayOpen", "Vandaag geopend") : t("common.todayClosed", "Vandaag gesloten");
      }
      if (hours) {
        hours.textContent = status.today ? status.today.open + " – " + status.today.close + " uur" : t("common.closed", "Gesloten");
      }
    });
  }

  function renderHoursTables() {
    var todayIndex = new Date().getDay();
    document.querySelectorAll("[data-hours-table]").forEach(function (list) {
      list.innerHTML = "";
      for (var i = 1; i <= 7; i++) {
        var dayIndex = i % 7; // 1..6,0 -> ma..zo
        var entry = OPENING_HOURS[dayIndex];
        var row = document.createElement("li");
        row.className = "hours-row" + (dayIndex === todayIndex ? " is-today" : "");
        var nameSpan = document.createElement("span");
        nameSpan.className = "hours-day";
        var dayKeyPrefix = list.hasAttribute("data-short") ? "common.days_short." : "common.days.";
        nameSpan.textContent = t(dayKeyPrefix + DAY_KEYS[dayIndex], DAY_KEYS[dayIndex]);
        var timeSpan = document.createElement("span");
        timeSpan.className = "hours-time";
        timeSpan.textContent = entry ? entry.open + " – " + entry.close : t("common.closed", "Gesloten");
        row.appendChild(nameSpan);
        row.appendChild(timeSpan);
        list.appendChild(row);
      }
    });
  }

  function renderAll() {
    renderStatusBadges();
    renderHoursTables();
  }

  window.MaasEnVrienden = window.MaasEnVrienden || {};
  window.MaasEnVrienden.openingHours = OPENING_HOURS;
  window.MaasEnVrienden.getOpeningStatus = getStatus;
  window.MaasEnVrienden.closeMinutes = closeMinutes;
  window.MaasEnVrienden.renderHours = renderAll;

  document.addEventListener("DOMContentLoaded", renderAll);
  document.addEventListener("mev:langchange", renderAll);
})();
