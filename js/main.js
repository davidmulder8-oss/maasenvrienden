/**
 * Maas en Vrienden - gedeeld sitegedrag
 * Header (scroll + mobiel menu), taalkeuze, rustige scroll-animaties,
 * foto-placeholder, terug-naar-boven, jaartal in de footer en de agenda
 * op de homepage (uit js/events-data.js).
 */
(function () {
  "use strict";

  /* ---------- Laadscherm weg zodra de pagina geladen is ---------- */
  var markLoaded = function () { document.documentElement.classList.add("is-loaded"); };
  if (document.readyState === "complete") markLoaded();
  else window.addEventListener("load", markLoaded);
  window.addEventListener("pageshow", markLoaded);

  var header = document.querySelector(".site-header");
  var body = document.body;

  function t(key, fallback) {
    if (!window.MEV_I18N) return fallback || key;
    var v = window.MEV_I18N.t(key);
    return v === key && fallback ? fallback : v;
  }

  /* ---------- Header: schaduw bij scrollen + exacte hoogte ---------- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var setHeaderHeightVar = function () {
      document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    };
    setHeaderHeightVar();
    window.addEventListener("resize", setHeaderHeightVar);
    window.setTimeout(setHeaderHeightVar, 300);
  }

  /* ---------- Actieve pagina in de navigatie ---------- */
  var currentPage = body.getAttribute("data-page");
  if (currentPage) {
    document.querySelectorAll(".nav-link[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === currentPage) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Mobiel menu ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navShell = document.getElementById("hoofdnavigatie");
  if (navToggle && navShell) {
    var setOpen = function (open) {
      body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? t("common.nav.close", "Menu sluiten") : t("common.nav.toggle", "Menu openen"));
    };
    navToggle.addEventListener("click", function () {
      setOpen(!body.classList.contains("nav-open"));
    });
    navShell.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("nav-open")) {
        setOpen(false);
        navToggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024 && body.classList.contains("nav-open")) setOpen(false);
    });
  }

  /* ---------- Taalkeuze ---------- */
  var langSwitch = document.querySelector(".lang-switch");
  if (langSwitch) {
    var langCurrent = langSwitch.querySelector(".lang-current");
    langCurrent.addEventListener("click", function () {
      var isOpen = langSwitch.classList.toggle("is-open");
      langCurrent.setAttribute("aria-expanded", String(isOpen));
    });
    document.addEventListener("click", function (e) {
      if (!langSwitch.contains(e.target)) {
        langSwitch.classList.remove("is-open");
        langCurrent.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && langSwitch.classList.contains("is-open")) {
        langSwitch.classList.remove("is-open");
        langCurrent.setAttribute("aria-expanded", "false");
      }
    });
    langSwitch.querySelectorAll(".lang-option[data-lang]").forEach(function (opt) {
      opt.addEventListener("click", function () {
        if (window.MEV_I18N) window.MEV_I18N.setLang(opt.getAttribute("data-lang"));
        langSwitch.classList.remove("is-open");
        langCurrent.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Rustige fade-in bij scrollen ---------- */
  function observeReveal(scope) {
    var els = (scope || document).querySelectorAll("[data-reveal]:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }
  observeReveal();

  /* ---------- Foto-placeholder als een foto ontbreekt ---------- */
  document.querySelectorAll(".photo-frame img").forEach(function (img) {
    var frame = img.closest(".photo-frame");
    if (!frame) return;
    if (img.complete && img.naturalWidth === 0) frame.classList.add("is-placeholder");
    img.addEventListener("error", function () { frame.classList.add("is-placeholder"); });
  });

  /* ---------- Terug naar boven ---------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("is-visible", window.scrollY > 900);
    }, { passive: true });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Vaste reserveerknop onderin op mobiel ---------- */
  if (currentPage !== "reserveren") {
    var mobileReserve = document.createElement("a");
    mobileReserve.className = "btn btn-primary mobile-reserve";
    mobileReserve.href = "reserveren.html";
    mobileReserve.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg><span data-i18n="common.cta.reserveer">' + t("common.cta.reserveer", "Reserveer een tafel") + "</span>";
    body.appendChild(mobileReserve);
    var footerEl = document.querySelector(".site-footer");
    var toggleMobileReserve = function () {
      var nearFooter = footerEl && footerEl.getBoundingClientRect().top < window.innerHeight;
      mobileReserve.classList.toggle("is-visible", window.scrollY > 480 && !nearFooter);
    };
    toggleMobileReserve();
    window.addEventListener("scroll", toggleMobileReserve, { passive: true });
    document.addEventListener("mev:langchange", function () {
      mobileReserve.querySelector("span").textContent = t("common.cta.reserveer", "Reserveer een tafel");
    });
  }

  /* ---------- Weekspecials: label "Vandaag" op de juiste dag ---------- */
  var weeklyCards = document.querySelectorAll(".weekly-card[data-weekday]");
  if (weeklyCards.length) {
    var markWeeklyToday = function () {
      var today = new Date().getDay();
      weeklyCards.forEach(function (card) {
        var isToday = parseInt(card.getAttribute("data-weekday"), 10) === today;
        var badge = card.querySelector(".weekly-today");
        card.classList.toggle("is-today", isToday);
        if (badge) {
          badge.hidden = !isToday;
          badge.textContent = t("specials.today", "Vandaag").replace(/!+$/, "");
        }
      });
    };
    markWeeklyToday();
    document.addEventListener("mev:langchange", markWeeklyToday);
  }

  /* ---------- Jaartal in de footer ---------- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Agenda op de homepage ---------- */
  var agenda = document.querySelector("[data-upcoming-events]");
  if (agenda) {
    var emptyEl = document.querySelector("[data-upcoming-empty]");
    var limit = parseInt(agenda.getAttribute("data-limit"), 10) || 3;
    var esc = function (str) { var d = document.createElement("div"); d.textContent = String(str == null ? "" : str); return d.innerHTML; };
    var lang = function () { return window.MEV_I18N ? window.MEV_I18N.getLang() : "nl"; };
    var loc = function (o) { return o && typeof o === "object" ? (o[lang()] || o.nl || "") : (o || ""); };
    var renderAgenda = function () {
      var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      var today = d.toISOString().slice(0, 10);
      var items = (window.EVENTS_DATA || []).filter(function (ev) {
        return (ev.endDate || ev.date) >= today;
      }).sort(function (a, b) { return a.date < b.date ? -1 : 1; }).slice(0, limit);
      var locale = { nl: "nl-NL", en: "en-GB", de: "de-DE" }[lang()] || "nl-NL";
      agenda.innerHTML = items.map(function (ev) {
        var date = new Date(ev.date + "T00:00:00");
        var img = ev.image || (ev.images && ev.images[0]) || "";
        return '<a class="agenda-card" href="evenementen.html">' +
          (img ? '<span class="agenda-media"><img src="' + esc(img) + '" alt="" loading="lazy"></span>' : "") +
          '<span class="agenda-date"><span class="d">' + date.getDate() + '</span><span class="m">' + esc(date.toLocaleDateString(locale, { month: "short" }).replace(".", "")) + "</span></span>" +
          '<span class="agenda-body">' +
            (ev.category ? '<span class="agenda-cat">' + esc(loc(ev.category)) + "</span>" : "") +
            '<span class="agenda-title">' + esc(loc(ev.title)) + "</span>" +
            '<span class="agenda-meta">' + esc(date.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })) + (ev.time ? " · " + esc(loc(ev.time)) : "") + "</span>" +
          "</span></a>";
      }).join("");
      if (emptyEl) emptyEl.hidden = items.length > 0;
      // Geen evenementen gepland: de hele agenda-sectie verbergen
      var section = agenda.closest("section");
      if (section) section.hidden = items.length === 0;
    };
    renderAgenda();
    document.addEventListener("mev:langchange", renderAgenda);
  }
})();
