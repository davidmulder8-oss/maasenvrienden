/**
 * Maas en Vrienden - menukaart rendering, categorie-filter, dieetfilters en zoekfunctie
 * Meertalig: rendert opnieuw bij taalwissel (behoudt filter/zoekopdracht).
 */
(function () {
  "use strict";

  var data = window.MENU_DATA || [];
  var content = document.getElementById("menuContent");
  var filtersEl = document.getElementById("menuFilters");
  var dietFiltersEl = document.getElementById("menuDietFilters");
  var searchInput = document.getElementById("menuSearchInput");
  var emptyState = document.getElementById("menuEmptyState");

  if (!content || !data.length) return;

  var activeFilter = "all";
  var activeDiets = []; // bv. ["vegan", "glutenfree"]
  var DIET_LABEL_KEYS = {
    vegan: "menu.diet.vegan",
    glutenfree: "menu.diet.glutenfree",
    lactosefree: "menu.diet.lactosefree"
  };

  function lang() {
    return window.MEV_I18N ? window.MEV_I18N.getLang() : "nl";
  }
  function t(key) {
    return window.MEV_I18N ? window.MEV_I18N.t(key) : key;
  }
  function localize(field) {
    return field[lang()] || field.nl || "";
  }

  function formatPrice(price) {
    return "€ " + price.toFixed(2).replace(".", ",");
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }

  /* ---------- Render categories + items ---------- */
  function renderContent() {
    content.innerHTML = "";

    data.forEach(function (category) {
      var section = document.createElement("section");
      section.className = "menu-category";
      section.id = category.id;
      section.setAttribute("data-category", category.id);

      var head = document.createElement("div");
      head.className = "menu-category-head";
      head.innerHTML = "<h2>" + escapeHtml(localize(category.name)) + "</h2>";
      section.appendChild(head);

      var noteText = localize(category.note);
      if (noteText) {
        var note = document.createElement("p");
        note.className = "menu-category-note";
        note.textContent = noteText;
        section.appendChild(note);
      }

      var grid = document.createElement("div");
      grid.className = "menu-grid";

      category.items.forEach(function (item) {
        var itemName = localize(item.name);
        var itemDesc = localize(item.description);
        var diet = item.diet || {};

        var el = document.createElement("div");
        el.className = "menu-item";
        el.setAttribute("data-name", itemName.toLowerCase());
        el.setAttribute("data-desc", itemDesc.toLowerCase());
        el.setAttribute("data-vegan", diet.vegan ? "1" : "0");
        el.setAttribute("data-glutenfree", diet.glutenfree ? "1" : "0");
        el.setAttribute("data-lactosefree", diet.lactosefree ? "1" : "0");

        /* Vegan krijgt een klein logootje direct achter de naam i.p.v. een
           badge onder de omschrijving; glutenvrij/lactosevrij blijven als
           tekst-badge staan. */
        var badgesHtml = "";
        var activeTags = Object.keys(DIET_LABEL_KEYS).filter(function (key) { return key !== "vegan" && diet[key]; });
        if (activeTags.length) {
          badgesHtml =
            '<div class="menu-item-diet-tags">' +
            activeTags.map(function (key) {
              return '<span class="menu-item-diet-tag">' + escapeHtml(t(DIET_LABEL_KEYS[key])) + "</span>";
            }).join("") +
            "</div>";
        }

        var veganIconHtml = diet.vegan
          ? ' <span class="menu-item-vegan-icon" title="' + escapeHtml(t("menu.diet.vegan")) + '" aria-label="' + escapeHtml(t("menu.diet.vegan")) + '">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3C7 3 4 7 4 12c0 3 1.5 5 3 6M12 3c5 0 8 4 8 9 0 5-4 8-8 8-2 0-3.5-.7-4.5-1.5"/><path d="M8 21c2-4 3-9 3-14"/></svg>' +
            "</span>"
          : "";
        /* Vegetarisch krijgt een eigen, andersgekleurd "V"-icoontje - bewust
           visueel onderscheiden van het vegan-blaadje, want vegetarisch mag
           nog wel zuivel/ei bevatten (bv. kaas, roomijs, slagroom). Alleen
           getoond als het gerecht niet al vegan is (dat badge dekt dit al). */
        var vegetarianIconHtml = diet.vegetarian && !diet.vegan
          ? ' <span class="menu-item-vegetarian-icon" title="' + escapeHtml(t("menu.diet.vegetarian")) + '" aria-label="' + escapeHtml(t("menu.diet.vegetarian")) + '">V</span>'
          : "";

        /* Pizzadag: donderdagprijs alleen tonen als die echt lager is, en
           altijd met de vermelding dat het alleen op donderdag geldt. */
        var thursdayHtml = "";
        if (item.thursdayOnly) {
          thursdayHtml = '<div class="menu-item-thursday">' + escapeHtml(t("menu.thursdayOnly")) + "</div>";
        } else if (item.thursdayPrice && item.thursdayPrice < item.price) {
          thursdayHtml = '<div class="menu-item-thursday">' + escapeHtml(t("menu.thursdayPrice").replace("{price}", formatPrice(item.thursdayPrice))) + "</div>";
        }

        el.innerHTML =
          '<div class="menu-item-info"><h3>' + escapeHtml(itemName) + veganIconHtml + vegetarianIconHtml + "</h3>" +
          (itemDesc ? "<p>" + escapeHtml(itemDesc) + "</p>" : "") +
          badgesHtml + thursdayHtml +
          '</div><div class="menu-item-price">' + formatPrice(item.price) + "</div>";
        grid.appendChild(el);
      });

      section.appendChild(grid);
      content.appendChild(section);
    });
  }

  /* ---------- Categorie-filters ---------- */
  function renderFilters() {
    filtersEl.innerHTML = "";
    var allBtn = document.createElement("button");
    allBtn.className = "menu-filter-btn" + (activeFilter === "all" ? " is-active" : "");
    allBtn.type = "button";
    allBtn.setAttribute("data-filter", "all");
    allBtn.textContent = t("menu.filters.all");
    filtersEl.appendChild(allBtn);

    data.forEach(function (category) {
      var btn = document.createElement("button");
      btn.className = "menu-filter-btn" + (activeFilter === category.id ? " is-active" : "");
      btn.type = "button";
      btn.setAttribute("data-filter", category.id);
      btn.textContent = localize(category.name);
      filtersEl.appendChild(btn);
    });
  }

  filtersEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".menu-filter-btn");
    if (!btn) return;
    activeFilter = btn.getAttribute("data-filter");
    filtersEl.querySelectorAll(".menu-filter-btn").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-filter") === activeFilter);
    });
    applyFilters();
    if (activeFilter !== "all") {
      document.getElementById(activeFilter).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  /* ---------- Dieetfilters (vegan / glutenvrij / lactosevrij) ---------- */
  if (dietFiltersEl) {
    dietFiltersEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".menu-diet-btn");
      if (!btn) return;
      var key = btn.getAttribute("data-diet");
      var index = activeDiets.indexOf(key);
      if (index === -1) {
        activeDiets.push(key);
        btn.classList.add("is-active");
      } else {
        activeDiets.splice(index, 1);
        btn.classList.remove("is-active");
      }
      applyFilters();
    });
  }

  /* ---------- Zoeken + alle filters combineren ---------- */
  function applyFilters() {
    var query = (searchInput.value || "").trim().toLowerCase();
    var totalVisible = 0;

    content.querySelectorAll(".menu-category").forEach(function (section) {
      var categoryId = section.getAttribute("data-category");
      var categoryMatches = activeFilter === "all" || activeFilter === categoryId;
      var visibleInCategory = 0;

      section.querySelectorAll(".menu-item").forEach(function (item) {
        var matchesQuery = !query || item.getAttribute("data-name").indexOf(query) !== -1 || item.getAttribute("data-desc").indexOf(query) !== -1;
        var matchesDiet = activeDiets.every(function (key) {
          return item.getAttribute("data-" + key) === "1";
        });
        var show = categoryMatches && matchesQuery && matchesDiet;
        item.style.display = show ? "" : "none";
        if (show) visibleInCategory++;
      });

      var showSection = categoryMatches && visibleInCategory > 0;
      section.style.display = showSection ? "" : "none";
      totalVisible += visibleInCategory;
    });

    emptyState.classList.toggle("is-visible", totalVisible === 0);
  }

  searchInput.addEventListener("input", applyFilters);

  function renderAll() {
    var searchValue = searchInput.value;
    renderContent();
    renderFilters();
    searchInput.value = searchValue;
    applyFilters();
  }

  renderAll();
  document.addEventListener("mev:langchange", renderAll);
})();
