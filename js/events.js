/**
 * Maas en Vrienden - evenementen renderen + filteren
 * Meertalig: rendert opnieuw bij taalwissel.
 */
(function () {
  "use strict";

  var events = (window.EVENTS_DATA || []).slice().sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  var grid = document.getElementById("eventsGrid");
  var emptyState = document.getElementById("eventsEmptyState");
  var filterRow = document.getElementById("eventFilterRow");
  if (!grid) return;

  var activeCategory = "all";

  function lang() {
    return window.MEV_I18N ? window.MEV_I18N.getLang() : "nl";
  }
  function t(key) {
    return window.MEV_I18N ? window.MEV_I18N.t(key) : key;
  }
  function localeForLang() {
    return { nl: "nl-NL", en: "en-GB", de: "de-DE" }[lang()] || "nl-NL";
  }
  function localize(field) {
    return field[lang()] || field.nl || "";
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }

  if (!events.length) {
    if (emptyState) emptyState.hidden = false;
    if (filterRow) filterRow.hidden = true;
    return;
  }

  function categoryKeyOf(ev) {
    return ev.category.nl; // stable key across languages
  }

  function renderFilters() {
    if (!filterRow) return;
    var categories = [];
    events.forEach(function (ev) {
      var key = categoryKeyOf(ev);
      if (!categories.some(function (c) { return c.key === key; })) {
        categories.push({ key: key, label: localize(ev.category) });
      }
    });

    filterRow.innerHTML = "";
    if (categories.length <= 1) return;

    var allBtn = document.createElement("button");
    allBtn.className = "menu-filter-btn" + (activeCategory === "all" ? " is-active" : "");
    allBtn.type = "button";
    allBtn.setAttribute("data-cat", "all");
    allBtn.textContent = t("evenementen.filters.all");
    filterRow.appendChild(allBtn);

    categories.forEach(function (cat) {
      var btn = document.createElement("button");
      btn.className = "menu-filter-btn" + (activeCategory === cat.key ? " is-active" : "");
      btn.type = "button";
      btn.setAttribute("data-cat", cat.key);
      btn.textContent = cat.label;
      filterRow.appendChild(btn);
    });
  }

  if (filterRow) {
    filterRow.addEventListener("click", function (e) {
      var btn = e.target.closest(".menu-filter-btn");
      if (!btn) return;
      activeCategory = btn.getAttribute("data-cat");
      filterRow.querySelectorAll(".menu-filter-btn").forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-cat") === activeCategory);
      });
      grid.querySelectorAll(".event-card").forEach(function (card) {
        card.style.display = activeCategory === "all" || card.getAttribute("data-category-key") === activeCategory ? "" : "none";
      });
    });
  }

  function renderCards() {
    grid.innerHTML = "";
    var locale = localeForLang();

    events.forEach(function (ev, index) {
      var dateObj = new Date(ev.date + "T00:00:00");
      var card = document.createElement("article");
      card.className = "card event-card";
      card.setAttribute("data-category-key", categoryKeyOf(ev));
      card.setAttribute("data-reveal", "");
      if (index % 3) card.setAttribute("data-reveal-delay", String(index % 4));
      if (activeCategory !== "all" && categoryKeyOf(ev) !== activeCategory) card.style.display = "none";

      var month = dateObj.toLocaleDateString(locale, { month: "short" }).replace(".", "");
      var categorySlug = ev.category.nl.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      var imgSrc = ev.image || (ev.images && ev.images[0]) || ("images/event-" + categorySlug + ".jpg");

      card.innerHTML =
        '<div class="event-card-media">' +
          '<div class="event-date-badge"><span class="day">' + dateObj.getDate() + '</span><span class="month">' + escapeHtml(month) + "</span></div>" +
          '<div class="photo-frame" style="--ar:16/10;">' +
            '<img src="' + escapeHtml(imgSrc) + '" alt="' + escapeHtml(localize(ev.title)) + '" loading="lazy">' +
            '<div class="placeholder-content"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="32" height="32"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 15l-5-5-9 9"/></svg><span class="caption">' + escapeHtml(t("common.photoGeneric")) + "</span></div>" +
          "</div>" +
        "</div>" +
        '<div class="event-card-body">' +
          '<div class="flex-between">' +
            '<span class="tag">' + escapeHtml(localize(ev.category)) + "</span>" +
            (ev.example ? '<span class="tag" style="background:var(--color-beige); color:var(--color-wood);">' + escapeHtml(t("evenementen.example")) + "</span>" : "") +
          "</div>" +
          "<h3>" + escapeHtml(localize(ev.title)) + "</h3>" +
          '<div class="event-meta">' +
            '<span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>' + escapeHtml(dateObj.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })) + "</span>" +
            '<span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>' + escapeHtml(localize(ev.time)) + "</span>" +
          "</div>" +
          "<p>" + escapeHtml(localize(ev.description)) + "</p>" +
        "</div>";

      grid.appendChild(card);
    });
  }

  function renderAll() {
    renderFilters();
    renderCards();
  }

  renderAll();
  document.addEventListener("mev:langchange", renderAll);
})();
