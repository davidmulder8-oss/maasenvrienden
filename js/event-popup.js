/**
 * Maas en Vrienden - evenementen-aankondiging popup
 *
 * Losstaand component, alleen geladen op de homepage. Toont automatisch het
 * eerstvolgende evenement uit js/events-data.js (dezelfde bron als de
 * evenementenpagina) in een premium popup. Raakt geen bestaande elementen
 * of stijlen aan - bouwt zijn eigen DOM en gebruikt alleen css/event-popup.css.
 *
 * Uitbreidbaar naar een foto-slider: geef het evenement in events-data.js
 * een "images: [...]" array i.p.v. "image" - de popup toont dan automatisch
 * pijltjes en dots, zonder dat deze code aangepast hoeft te worden.
 *
 * Verschijnt één keer per sessie (sessionStorage) zodat het niet als
 * opdringerig aanvoelt bij elke paginaweergave.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "mev_event_popup_dismissed_v1";
  var OPEN_DELAY = 700;

  var overlay = null;
  var dialog = null;
  var closeBtn = null;
  var lastFocused = null;
  var isOpenState = false;
  var currentEvent = null;

  function t(key, fallback) {
    return window.MEV_I18N ? window.MEV_I18N.t(key) : fallback;
  }
  function lang() {
    return window.MEV_I18N ? window.MEV_I18N.getLang() : "nl";
  }
  function localize(field) {
    return (field && (field[lang()] || field.nl)) || "";
  }
  function localeForLang() {
    return { nl: "nl-NL", en: "en-GB", de: "de-DE" }[lang()] || "nl-NL";
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

  /* Alleen evenementen die in het beheer als pop-up zijn aangevinkt
     ("featured": true) en nog niet voorbij zijn. */
  function getFeaturedEvent() {
    var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    var todayIso = d.toISOString().slice(0, 10);
    var featured = (window.EVENTS_DATA || []).filter(function (ev) {
      return ev.featured && (ev.endDate || ev.date) >= todayIso;
    }).sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    return featured[0] || null;
  }

  function refreshText() {
    if (!dialog || !currentEvent) return;
    var ev = currentEvent;
    var dateObj = new Date(ev.date + "T00:00:00");
    var dateLabel = dateObj.toLocaleDateString(localeForLang(), { weekday: "long", day: "numeric", month: "long" });
    dialog.querySelector(".event-popup-close").setAttribute("aria-label", t("eventPopup.close", "Sluiten"));
    dialog.querySelector(".event-popup-eyebrow").textContent = t("eventPopup.eyebrow", "Binnenkort bij ons");
    dialog.querySelector(".event-popup-title").textContent = localize(ev.title);
    var metaItems = dialog.querySelectorAll(".event-popup-meta-item");
    if (metaItems[0]) metaItems[0].lastChild.textContent = dateLabel;
    if (metaItems[1]) metaItems[1].lastChild.textContent = localize(ev.time);
    dialog.querySelector(".event-popup-desc").textContent = localize(ev.description);
    dialog.querySelector(".event-popup-btn-primary").textContent = t("eventPopup.cta", "Bekijk alle evenementen");
  }

  function build(ev) {
    currentEvent = ev;
    var images = ev.images || (ev.image ? [ev.image] : []);
    var dateObj = new Date(ev.date + "T00:00:00");
    var dateLabel = dateObj.toLocaleDateString(localeForLang(), { weekday: "long", day: "numeric", month: "long" });

    overlay = document.createElement("div");
    overlay.className = "event-popup-overlay";
    overlay.setAttribute("aria-hidden", "true");

    var slidesHtml = images
      .map(function (src, i) {
        return (
          '<div class="event-popup-slide' + (i === 0 ? " is-active" : "") + '" data-slide="' + i + '">' +
          '<img src="' + escapeHtml(src) + '" alt="" loading="eager">' +
          "</div>"
        );
      })
      .join("");

    var dotsHtml = "";
    var arrowsHtml = "";
    if (images.length > 1) {
      dotsHtml =
        '<div class="event-popup-dots">' +
        images
          .map(function (_, i) {
            return '<button type="button" class="event-popup-dot' + (i === 0 ? " is-active" : "") + '" data-goto="' + i + '" aria-label="Foto ' + (i + 1) + '"></button>';
          })
          .join("") +
        "</div>";
      arrowsHtml =
        '<button type="button" class="event-popup-arrow event-popup-arrow-prev" data-dir="-1" aria-label="Vorige foto">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg></button>' +
        '<button type="button" class="event-popup-arrow event-popup-arrow-next" data-dir="1" aria-label="Volgende foto">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18l6-6-6-6"/></svg></button>';
    }

    dialog = document.createElement("div");
    dialog.className = "event-popup";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "eventPopupTitle");
    dialog.setAttribute("aria-describedby", "eventPopupDesc");
    dialog.tabIndex = -1;

    dialog.innerHTML =
      '<button type="button" class="event-popup-close" aria-label="' + escapeHtml(t("eventPopup.close", "Sluiten")) + '">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      "</button>" +
      (images.length ? '<div class="event-popup-media">' + slidesHtml + arrowsHtml + dotsHtml + "</div>" : "") +
      '<div class="event-popup-body">' +
      '<p class="event-popup-eyebrow">' + escapeHtml(t("eventPopup.eyebrow", "Binnenkort bij ons")) + "</p>" +
      '<h2 id="eventPopupTitle" class="event-popup-title">' + escapeHtml(localize(ev.title)) + "</h2>" +
      '<div class="event-popup-meta">' +
      '<span class="event-popup-meta-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>' + escapeHtml(dateLabel) + "</span>" +
      '<span class="event-popup-meta-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>' + escapeHtml(localize(ev.time)) + "</span>" +
      "</div>" +
      '<p id="eventPopupDesc" class="event-popup-desc">' + escapeHtml(localize(ev.description)) + "</p>" +
      '<div class="event-popup-location">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.5-7-11.5A7 7 0 0 1 19 9.5C19 14.5 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/></svg>' +
      "<span><strong>Maas en Vrienden</strong><br>Andel</span>" +
      "</div>" +
      '<div class="event-popup-actions">' +
      '<a class="event-popup-btn event-popup-btn-primary" href="evenementen.html">' + escapeHtml(t("eventPopup.cta", "Bekijk alle evenementen")) + "</a>" +
      '<div class="event-popup-social">' +
      '<a class="event-popup-btn event-popup-btn-social" href="https://www.instagram.com/maasenvrienden" target="_blank" rel="noopener">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/></svg> Instagram' +
      "</a>" +
      '<a class="event-popup-btn event-popup-btn-social" href="https://www.facebook.com/people/Maas-en-Vrienden/61581188993141/#" target="_blank" rel="noopener">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 4h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z"/></svg> Facebook' +
      "</a>" +
      "</div>" +
      "</div>" +
      "</div>";

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    closeBtn = dialog.querySelector(".event-popup-close");
    closeBtn.addEventListener("click", closePopup);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closePopup();
    });
    dialog.querySelector(".event-popup-btn-primary").addEventListener("click", closePopup);

    if (images.length > 1) {
      var slideEls = Array.prototype.slice.call(dialog.querySelectorAll(".event-popup-slide"));
      var dotEls = Array.prototype.slice.call(dialog.querySelectorAll(".event-popup-dot"));
      var current = 0;
      var goTo = function (index) {
        current = (index + images.length) % images.length;
        slideEls.forEach(function (s, i) { s.classList.toggle("is-active", i === current); });
        dotEls.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });
      };
      Array.prototype.forEach.call(dialog.querySelectorAll(".event-popup-arrow"), function (btn) {
        btn.addEventListener("click", function () {
          goTo(current + parseInt(btn.getAttribute("data-dir"), 10));
        });
      });
      dotEls.forEach(function (dot) {
        dot.addEventListener("click", function () {
          goTo(parseInt(dot.getAttribute("data-goto"), 10));
        });
      });
    }

    document.addEventListener("keydown", handleKeydown);
  }

  function getFocusable() {
    if (!dialog) return [];
    return Array.prototype.slice.call(
      dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  function handleKeydown(e) {
    if (!overlay || !isOpenState) return;
    if (e.key === "Escape") {
      closePopup();
      return;
    }
    if (e.key === "Tab") {
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openPopup() {
    if (!overlay) return;
    isOpenState = true;
    lastFocused = document.activeElement;
    document.documentElement.classList.add("event-popup-lock");
    overlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () {
      overlay.classList.add("is-open");
    });
    window.setTimeout(function () {
      if (closeBtn) closeBtn.focus();
    }, 380);
  }

  function closePopup() {
    if (!overlay) return;
    isOpenState = false;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("event-popup-lock");
    markDismissed();
    var toRemove = overlay;
    window.setTimeout(function () {
      if (toRemove && toRemove.parentNode) toRemove.parentNode.removeChild(toRemove);
    }, 450);
    document.removeEventListener("keydown", handleKeydown);
    overlay = null;
    dialog = null;
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function init() {
    document.addEventListener("mev:langchange", refreshText);
    if (alreadyDismissed()) return;
    var ev = getFeaturedEvent();
    if (!ev) return;
    build(ev);
    window.setTimeout(openPopup, OPEN_DELAY);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
