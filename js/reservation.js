/**
 * Maas en Vrienden - reserveringsformulier
 * Validatie (datum/tijd/openingstijden/aantal personen) + verzending via FormSubmit.
 * Meertalig via js/i18n.js.
 *
 * SETUP: er is GEEN account nodig. Formulieren gaan naar
 * https://formsubmit.co/ajax/info@maasenvrienden.nl - bij de EERSTE
 * binnenkomende reservering stuurt FormSubmit automatisch een activatiemail
 * naar info@maasenvrienden.nl met een bevestigingslink. Zodra iemand met
 * toegang tot die inbox op die link klikt, werken alle volgende
 * reserveringen direct. Zie README.md.
 */
(function () {
  "use strict";

  var FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/info@maasenvrienden.nl";
  var DAYS_AHEAD = 60; // hoeveel dagen vooruit er in de datumkeuze staan

  var RESERVATION_MIN_TIME = "11:00";
  var RESERVATION_MAX_TIME = "22:00";
  var SLOT_MINUTES = 15;
  var MAX_GUESTS = 20;
  var MIN_GUESTS = 1;

  var form = document.getElementById("reservationForm");
  if (!form) return;

  var dateInput = document.getElementById("resDate");
  var timeSelect = document.getElementById("resTime");
  var timeHint = document.getElementById("timeHint");
  var guestsInput = document.getElementById("resGuests");
  var guestsMinus = document.getElementById("guestsMinus");
  var guestsPlus = document.getElementById("guestsPlus");
  var errorSummary = document.getElementById("formErrorSummary");
  var submitBtn = document.getElementById("resSubmitBtn");
  var successPanel = document.getElementById("reservationSuccess");
  var reservationSummary = document.getElementById("reservationSummary");

  function t(key) {
    return window.MEV_I18N ? window.MEV_I18N.t(key) : key;
  }
  function localeForLang() {
    var lang = window.MEV_I18N ? window.MEV_I18N.getLang() : "nl";
    return { nl: "nl-NL", en: "en-GB", de: "de-DE" }[lang] || "nl-NL";
  }

  /* ---------- Helpers ---------- */
  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function toHHMM(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }
  function toLocalISO(d) {
    var copy = new Date(d);
    copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
    return copy.toISOString().slice(0, 10);
  }
  function todayISO() {
    return toLocalISO(new Date());
  }
  function getOpeningHours() {
    return (window.MaasEnVrienden && window.MaasEnVrienden.openingHours) || null;
  }

  /* ---------- Datumkeuze: eenvoudige lijst i.p.v. maand/jaar-kalender ---------- */
  function populateDateOptions() {
    var hours = getOpeningHours();
    var previousValue = dateInput.value;
    dateInput.innerHTML = "";

    var placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = t("reserveren.form.datePlaceholder");
    dateInput.appendChild(placeholder);

    var locale = localeForLang();
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var hasPrevious = false;

    for (var i = 0; i < DAYS_AHEAD; i++) {
      var d = new Date(today);
      d.setDate(d.getDate() + i);
      var dayHours = hours ? hours[d.getDay()] : null;
      if (!dayHours) continue; // gesloten dagen komen niet in de lijst

      var iso = toLocalISO(d);
      var label = d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
      if (i === 0) label = t("reserveren.form.dateToday") + ", " + label;
      else if (i === 1) label = t("reserveren.form.dateTomorrow") + ", " + label;

      var opt = document.createElement("option");
      opt.value = iso;
      opt.textContent = label;
      dateInput.appendChild(opt);
      if (iso === previousValue) hasPrevious = true;
    }

    if (hasPrevious) dateInput.value = previousValue;
  }

  /* ---------- Time slot generation based on selected date ---------- */
  function populateTimeSlots() {
    var hours = getOpeningHours();
    var previousValue = timeSelect.value;
    timeSelect.innerHTML = "";

    if (!dateInput.value) {
      timeSelect.disabled = true;
      var optPick = document.createElement("option");
      optPick.value = "";
      optPick.textContent = t("reserveren.form.timePickDate");
      timeSelect.appendChild(optPick);
      return;
    }

    var selectedDate = new Date(dateInput.value + "T00:00:00");
    var dayIndex = selectedDate.getDay();
    var dayHours = hours ? hours[dayIndex] : null;

    if (!dayHours) {
      timeSelect.disabled = true;
      var optClosed = document.createElement("option");
      optClosed.value = "";
      optClosed.textContent = t("reserveren.form.timeClosedDay");
      timeSelect.appendChild(optClosed);
      timeHint.textContent = t("reserveren.form.timeHintClosed");
      timeHint.style.color = "var(--color-error)";
      return;
    }

    var dayCloseMinutes = window.MaasEnVrienden && window.MaasEnVrienden.closeMinutes
      ? window.MaasEnVrienden.closeMinutes(dayHours.close)
      : toMinutes(dayHours.close);
    var windowStart = Math.max(toMinutes(RESERVATION_MIN_TIME), toMinutes(dayHours.open));
    var windowEnd = Math.min(toMinutes(RESERVATION_MAX_TIME), dayCloseMinutes);
    var lastSlot = windowEnd - SLOT_MINUTES;

    if (lastSlot < windowStart) {
      timeSelect.disabled = true;
      var optNone = document.createElement("option");
      optNone.value = "";
      optNone.textContent = t("reserveren.form.timeNoSlots");
      timeSelect.appendChild(optNone);
      timeHint.textContent = t("reserveren.form.timeHintNone");
      timeHint.style.color = "var(--color-error)";
      return;
    }

    timeSelect.disabled = false;
    timeHint.style.color = "";
    timeHint.textContent = t("reserveren.form.timeHintWindow")
      .replace("{start}", toHHMM(windowStart))
      .replace("{end}", toHHMM(windowEnd));

    var optDefault = document.createElement("option");
    optDefault.value = "";
    optDefault.textContent = t("reserveren.form.timePickTime");
    timeSelect.appendChild(optDefault);

    var hasPrevious = false;
    for (var t2 = windowStart; t2 <= lastSlot; t2 += SLOT_MINUTES) {
      var opt = document.createElement("option");
      opt.value = toHHMM(t2);
      opt.textContent = toHHMM(t2) + " uur";
      timeSelect.appendChild(opt);
      if (opt.value === previousValue) hasPrevious = true;
    }
    if (hasPrevious) timeSelect.value = previousValue;
  }

  dateInput.addEventListener("change", function () {
    clearFieldError(dateField(dateInput));
    populateTimeSlots();
  });

  function populateAll() {
    populateDateOptions();
    populateTimeSlots();
  }

  document.addEventListener("DOMContentLoaded", populateAll);
  document.addEventListener("mev:langchange", populateAll);
  // In case hours.js + this script both defer-load after DOMContentLoaded already fired:
  if (document.readyState !== "loading") populateAll();

  /* ---------- Guest stepper ---------- */
  function clampGuests() {
    var v = parseInt(guestsInput.value, 10);
    if (isNaN(v)) v = MIN_GUESTS;
    v = Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, v));
    guestsInput.value = v;
    guestsMinus.disabled = v <= MIN_GUESTS;
    guestsPlus.disabled = v >= MAX_GUESTS;
  }
  guestsMinus.addEventListener("click", function () {
    guestsInput.value = (parseInt(guestsInput.value, 10) || MIN_GUESTS) - 1;
    clampGuests();
  });
  guestsPlus.addEventListener("click", function () {
    guestsInput.value = (parseInt(guestsInput.value, 10) || MIN_GUESTS) + 1;
    clampGuests();
  });
  guestsInput.addEventListener("change", clampGuests);
  clampGuests();

  /* ---------- Field-level validation ---------- */
  function dateField(input) { return input.closest(".field"); }

  function setFieldError(fieldEl, message) {
    fieldEl.classList.add("has-error");
    var errEl = fieldEl.querySelector(".field-error");
    if (errEl && message) errEl.lastChild.textContent = " " + message;
    var input = fieldEl.querySelector(".input, select, textarea");
    if (input) input.classList.add("is-invalid");
  }
  function clearFieldError(fieldEl) {
    if (!fieldEl) return;
    fieldEl.classList.remove("has-error");
    var input = fieldEl.querySelector(".input, select, textarea");
    if (input) input.classList.remove("is-invalid");
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[0-9+()\s-]{8,20}$/;

  function validateForm() {
    var isValid = true;
    var firstInvalid = null;

    function fail(input, message) {
      var f = dateField(input);
      setFieldError(f, message);
      isValid = false;
      if (!firstInvalid) firstInvalid = input;
    }

    var nameInput = form.elements["name"];
    clearFieldError(dateField(nameInput));
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      fail(nameInput, t("reserveren.form.nameError"));
    }

    var emailInput = form.elements["email"];
    clearFieldError(dateField(emailInput));
    if (!EMAIL_RE.test(emailInput.value.trim())) {
      fail(emailInput, t("reserveren.form.emailError"));
    }

    var phoneInput = form.elements["phone"];
    clearFieldError(dateField(phoneInput));
    if (!PHONE_RE.test(phoneInput.value.trim())) {
      fail(phoneInput, t("reserveren.form.phoneError"));
    }

    clearFieldError(dateField(guestsInput));
    var guests = parseInt(guestsInput.value, 10);
    if (isNaN(guests) || guests < MIN_GUESTS || guests > MAX_GUESTS) {
      fail(guestsInput, t("reserveren.form.guestsError"));
    }

    clearFieldError(dateField(dateInput));
    if (!dateInput.value) {
      fail(dateInput, t("reserveren.form.dateError"));
    } else if (dateInput.value < todayISO()) {
      fail(dateInput, t("reserveren.form.dateError"));
    } else {
      var hours = getOpeningHours();
      var selectedDate = new Date(dateInput.value + "T00:00:00");
      var dayHours = hours ? hours[selectedDate.getDay()] : null;
      if (!dayHours) {
        fail(dateInput, t("reserveren.form.timeHintClosed"));
      }
    }

    clearFieldError(dateField(timeSelect));
    if (!timeSelect.value) {
      fail(timeSelect, t("reserveren.form.timeError"));
    } else {
      var mins = toMinutes(timeSelect.value);
      if (mins < toMinutes(RESERVATION_MIN_TIME) || mins > toMinutes(RESERVATION_MAX_TIME)) {
        fail(timeSelect, t("reserveren.form.timeError"));
      }
    }

    errorSummary.hidden = isValid;
    if (!isValid && firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return isValid;
  }

  /* ---------- Submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (form.elements["_honey"] && form.elements["_honey"].value) {
      return; // honeypot triggered, silently ignore
    }

    if (!validateForm()) return;

    var locationValue = form.elements["location"].value;
    var locationLabel = locationValue === "Terras" ? t("reserveren.form.locationOutside") : t("reserveren.form.locationInside");
    var dateObj = new Date(dateInput.value + "T00:00:00");
    var dateLabel = dateObj.toLocaleDateString(localeForLang(), { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    var payload = {
      _subject: "Nieuwe reservering Maas en Vrienden (" + dateInput.value + " " + timeSelect.value + ")",
      _template: "table",
      _captcha: "false",
      Naam: form.elements["name"].value.trim(),
      email: form.elements["email"].value.trim(),
      Telefoonnummer: form.elements["phone"].value.trim(),
      "Aantal personen": guestsInput.value,
      Datum: dateLabel,
      Tijd: timeSelect.value + " uur",
      Locatie: locationLabel,
      Opmerkingen: form.elements["notes"].value.trim() || "-",
      _autoresponse: "Bedankt voor je reservering bij Maas en Vrienden! We hebben je aanvraag ontvangen voor " + dateLabel + " om " + timeSelect.value + " uur (" + guestsInput.value + " personen, " + locationLabel.toLowerCase() + "). We bevestigen deze zo snel mogelijk. Vragen of wijzigingen? Bel 06 - 53 20 04 21 of mail info@maasenvrienden.nl. Tot snel!"
    };

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
        if (data && (data.success === "true" || data.success === true)) {
          showSuccess({ name: payload.Naam, dateLabel: dateLabel, time: timeSelect.value, guests: guestsInput.value, locationLabel: locationLabel });
        } else {
          throw new Error((data && data.message) || "Onbekende fout");
        }
      })
      .catch(function () {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
        errorSummary.hidden = false;
        errorSummary.querySelector("span").textContent = t("reserveren.form.sendError");
        errorSummary.scrollIntoView({ behavior: "smooth", block: "center" });
      });
  });

  function showSuccess(info) {
    var personsLabel = info.guests === "1" ? t("reserveren.form.summaryPerson") : t("reserveren.form.summaryPersons");

    reservationSummary.innerHTML =
      "<strong>" + escapeHtml(info.name) + "</strong><br>" +
      escapeHtml(info.dateLabel) + " " + escapeHtml(info.time) + "<br>" +
      escapeHtml(info.guests) + " " + escapeHtml(personsLabel) + " · " + escapeHtml(info.locationLabel);

    form.hidden = true;
    successPanel.hidden = false;
    successPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }
})();
