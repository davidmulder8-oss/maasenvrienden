/**
 * Maas en Vrienden - pop-up met de vaste speciale dagen
 *
 * Toont op de homepage beide wekelijkse specials (Pizzadag op donderdag en
 * Satédag op zaterdag) met hun poster. Is het vandaag een van die dagen,
 * dan krijgt die kaart een "Vandaag!"-label. Verschijnt één keer per sessie.
 * Hergebruikt de opmaak van css/event-popup.css + css/specials-popup.css.
 *
 * Specials aanpassen: wijzig de lijst SPECIALS hieronder en de teksten
 * "specials.*" in js/i18n.js.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "mev_specials_popup_dismissed_v1";
  var OPEN_DELAY = 900;

  // day: 0 = zondag ... 6 = zaterdag (JS Date#getDay)
  var SPECIALS = [
    { key: "thu", day: 4, image: "images/pizzadag.jpg" },
    { key: "sat", day: 6, image: "images/satedag.jpg" }
  ];

  var overlay = null;
  var dialog = null;
  var lastFocused = null;

  function t(key, fallback) {
    return window.MEV_I18N ? window.MEV_I18N.t(key) : fallback || key;
  }
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }
  function alreadyDismissed() {
    try { return sessionStorage.getItem(STORAGE_KEY) === "1"; } catch (e) { return false; }
  }
  function markDismissed() {
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) { /* noop */ }
  }

  function cardsHtml() {
    var today = new Date().getDay();
    return SPECIALS.map(function (s) {
      var isToday = s.day === today;
      var title = t("specials." + s.key + ".title");
      return (
        '<article class="special-card' + (isToday ? " is-today" : "") + '">' +
        (isToday ? '<span class="special-card-today" data-sp="today">' + escapeHtml(t("specials.today")) + "</span>" : "") +
        '<a class="special-card-media" href="' + s.image + '" target="_blank" rel="noopener" aria-label="' + escapeHtml(title) + ', poster">' +
        '<img src="' + s.image + '" alt="' + escapeHtml(title) + '" loading="eager">' +
        "</a>" +
        '<div class="special-card-body">' +
        '<p class="special-card-day" data-sp="' + s.key + '.day">' + escapeHtml(t("specials." + s.key + ".day")) + "</p>" +
        '<h3 class="special-card-title" data-sp="' + s.key + '.title">' + escapeHtml(title) + "</h3>" +
        '<p class="special-card-desc" data-sp="' + s.key + '.desc">' + escapeHtml(t("specials." + s.key + ".desc")) + "</p>" +
        "</div>" +
        "</article>"
      );
    }).join("");
  }

  function refreshText() {
    if (!dialog) return;
    dialog.querySelectorAll("[data-sp]").forEach(function (el) {
      el.textContent = t("specials." + el.getAttribute("data-sp"));
    });
    dialog.querySelector(".event-popup-close").setAttribute("aria-label", t("eventPopup.close", "Sluiten"));
  }

  function build() {
    overlay = document.createElement("div");
    overlay.className = "event-popup-overlay";
    overlay.setAttribute("aria-hidden", "true");

    dialog = document.createElement("div");
    dialog.className = "event-popup specials-popup";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "specialsPopupTitle");
    dialog.tabIndex = -1;

    dialog.innerHTML =
      '<button type="button" class="event-popup-close" aria-label="' + escapeHtml(t("eventPopup.close", "Sluiten")) + '">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      "</button>" +
      '<div class="event-popup-body">' +
      '<p class="event-popup-eyebrow" data-sp="eyebrow">' + escapeHtml(t("specials.eyebrow")) + "</p>" +
      '<h2 id="specialsPopupTitle" class="event-popup-title" data-sp="title">' + escapeHtml(t("specials.title")) + "</h2>" +
      '<div class="specials-grid">' + cardsHtml() + "</div>" +
      '<div class="event-popup-actions">' +
      '<a class="event-popup-btn event-popup-btn-primary" href="menu.html" data-sp="cta">' + escapeHtml(t("specials.cta")) + "</a>" +
      '<a class="event-popup-btn event-popup-btn-social" href="reserveren.html" data-sp="reserve">' + escapeHtml(t("specials.reserve")) + "</a>" +
      "</div>" +
      "</div>";

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    dialog.querySelector(".event-popup-close").addEventListener("click", closePopup);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closePopup();
    });
    document.addEventListener("keydown", handleKeydown);
  }

  function handleKeydown(e) {
    if (!overlay) return;
    if (e.key === "Escape") { closePopup(); return; }
    if (e.key === "Tab") {
      var focusable = Array.prototype.slice.call(dialog.querySelectorAll("a[href], button"));
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function openPopup() {
    if (!overlay) return;
    lastFocused = document.activeElement;
    document.documentElement.classList.add("event-popup-lock");
    overlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () { overlay.classList.add("is-open"); });
    window.setTimeout(function () {
      var btn = dialog && dialog.querySelector(".event-popup-close");
      if (btn) btn.focus();
    }, 380);
  }

  function closePopup() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("event-popup-lock");
    markDismissed();
    var toRemove = overlay;
    window.setTimeout(function () {
      if (toRemove.parentNode) toRemove.parentNode.removeChild(toRemove);
    }, 450);
    document.removeEventListener("keydown", handleKeydown);
    overlay = null;
    dialog = null;
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function init() {
    document.addEventListener("mev:langchange", refreshText);
    if (alreadyDismissed()) return;
    // Staat er al een evenementen-pop-up klaar, dan niet twee tegelijk tonen
    if (document.querySelector(".event-popup-overlay")) return;
    build();
    window.setTimeout(openPopup, OPEN_DELAY);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
