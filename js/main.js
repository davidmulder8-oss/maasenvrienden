/**
 * Maas en Vrienden - shared site behaviour
 * Header scroll state, language switcher, scroll reveal,
 * photo placeholder fallback, back-to-top, footer year.
 * (Navigation is always fully visible - no mobile hamburger/overlay.)
 */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");

  /* ---------- Header scroll state ---------- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* Exacte header-hoogte bijhouden in --header-h, zodat elementen die
       er sticky vlak onder moeten blijven staan (zoals de menu-toolbar)
       altijd goed uitlijnen - ook al verandert de header-hoogte per
       schermbreedte (bv. de mobiele nav-carrousel neemt een eigen rij in). */
    var setHeaderHeightVar = function () {
      document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    };
    setHeaderHeightVar();
    window.addEventListener("resize", setHeaderHeightVar);
    window.setTimeout(setHeaderHeightVar, 300);
  }

  /* ---------- Active nav link ---------- */
  var currentPage = document.body.getAttribute("data-page");
  if (currentPage) {
    document.querySelectorAll(".nav-link[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === currentPage) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Mobiele nav-carrousel (swipe) ---------- */
  /* Op mobiel (zie css/components.css @media max-width:640px) wordt de
     navigatiebalk een horizontale swipe-carrousel i.p.v. alles onder
     elkaar - compacter, en alle 6 pagina's blijven direct bereikbaar
     (niets verstopt achter een menu-knop). Deze code bouwt de
     bolletjes-indicator en zorgt dat de huidige pagina bij het laden al
     gecentreerd staat. Op desktop/tablet doet dit niets zichtbaars. */
  var navShell = document.querySelector(".nav-shell");
  if (navShell) {
    var navLinks = Array.prototype.slice.call(navShell.querySelectorAll(".nav-link"));
    if (navLinks.length) {
      var navDots = document.createElement("div");
      navDots.className = "nav-dots";
      navDots.setAttribute("role", "tablist");
      navDots.setAttribute("aria-label", "Navigatie - huidige pagina in beeld");

      navLinks.forEach(function (link, index) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "nav-dot";
        dot.setAttribute("aria-label", link.textContent.trim());
        dot.addEventListener("click", function () {
          link.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        });
        navDots.appendChild(dot);
      });
      navShell.insertAdjacentElement("afterend", navDots);
      var dotEls = Array.prototype.slice.call(navDots.querySelectorAll(".nav-dot"));

      var updateActiveDot = function () {
        var shellRect = navShell.getBoundingClientRect();
        var centerX = shellRect.left + shellRect.width / 2;
        var closestIndex = 0;
        var closestDist = Infinity;
        navLinks.forEach(function (link, index) {
          var r = link.getBoundingClientRect();
          var dist = Math.abs(r.left + r.width / 2 - centerX);
          if (dist < closestDist) { closestDist = dist; closestIndex = index; }
        });
        dotEls.forEach(function (dot, index) {
          dot.classList.toggle("is-active", index === closestIndex);
        });
      };

      var scrollTimer;
      navShell.addEventListener(
        "scroll",
        function () {
          window.clearTimeout(scrollTimer);
          scrollTimer = window.setTimeout(updateActiveDot, 60);
        },
        { passive: true }
      );
      window.addEventListener("resize", updateActiveDot);

      window.setTimeout(function () {
        var activeLink = navShell.querySelector(".nav-link.is-active");
        if (activeLink && window.matchMedia("(max-width: 640px)").matches) {
          activeLink.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
        }
        updateActiveDot();
      }, 50);

      /* Sleep-om-te-scrollen (muis + touch/pen via Pointer Events), naast
         de normale native touch-swipe die al werkt - zo blijft de balk ook
         scrollbaar wanneer met een muis getest/gebruikt wordt.

         Belangrijk: setPointerCapture() wordt pas aangeroepen zodra er
         écht beweging is (voorbij de drempel) - NIET meteen bij
         pointerdown. Deed het dat wel, dan werd op een echte telefoon elke
         gewone tik (tap) op een knop meteen "gekaapt" door de balk zelf,
         waardoor de klik nooit bij de link terechtkwam en de hele
         navigatie onklikbaar leek. Zo blijft tikken = navigeren, en
         slepen = scrollen. */
      var isDragging = false;
      var dragMoved = false;
      var dragStartX = 0;
      var dragScrollStart = 0;
      var activePointerId = null;

      navShell.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        isDragging = true;
        dragMoved = false;
        dragStartX = e.clientX;
        dragScrollStart = navShell.scrollLeft;
        activePointerId = e.pointerId;
      });
      navShell.addEventListener("pointermove", function (e) {
        if (!isDragging) return;
        var delta = e.clientX - dragStartX;
        if (!dragMoved && Math.abs(delta) > 4) {
          dragMoved = true;
          navShell.classList.add("is-dragging");
          if (navShell.setPointerCapture && activePointerId !== null) {
            try { navShell.setPointerCapture(activePointerId); } catch (err) { /* noop */ }
          }
        }
        if (dragMoved) {
          navShell.scrollLeft = dragScrollStart - delta;
        }
      });
      var endDrag = function () {
        if (!isDragging) return;
        isDragging = false;
        activePointerId = null;
        navShell.classList.remove("is-dragging");
        updateActiveDot();
      };
      navShell.addEventListener("pointerup", endDrag);
      navShell.addEventListener("pointercancel", endDrag);
      navShell.addEventListener("pointerleave", function () { if (isDragging) endDrag(); });

      /* Voorkom dat een sleepbeweging per ongeluk als klik/navigatie telt */
      navLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
          if (dragMoved) {
            e.preventDefault();
            dragMoved = false;
          }
        });
      });
    }
  }

  /* ---------- Language switcher ---------- */
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

  /* ---------- Scroll reveal ---------- */
  /* Items in een rij (voorzieningen, waarden, checklist) verschijnen na
     elkaar i.p.v. allemaal tegelijk. */
  document.querySelectorAll(".amenities-grid, .value-row, ul.checklist").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, index) {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "");
      child.style.transitionDelay = (index * 0.06) + "s";
      // Vertraging na het verschijnen weer weghalen, anders reageert hover traag
      child.addEventListener("transitionend", function clearDelay() {
        child.style.transitionDelay = "";
        child.removeEventListener("transitionend", clearDelay);
      });
    });
  });

  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Photo placeholder fallback ---------- */
  document.querySelectorAll(".photo-frame img").forEach(function (img) {
    var frame = img.closest(".photo-frame");
    if (!frame) return;
    frame.classList.add("is-loading");
    if (img.complete) {
      if (img.naturalWidth === 0) {
        frame.classList.add("is-placeholder");
      }
      frame.classList.remove("is-loading");
    }
    img.addEventListener("error", function () {
      frame.classList.add("is-placeholder");
      frame.classList.remove("is-loading");
    });
    img.addEventListener("load", function () {
      if (img.naturalWidth > 0) {
        frame.classList.remove("is-loading");
      }
    });
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        backToTop.classList.toggle("is-visible", window.scrollY > 700);
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Extra beweging (uit bij "minder beweging") ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  /* Scrollvoortgang */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
  var ticking = false;
  var onScrollFx = function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    ticking = false;
  };
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScrollFx); }
  }, { passive: true });
  onScrollFx();

  /* Kaarten kantelen licht mee met de muis (alleen met muis, niet op touch) */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var bindTilt = function (card) {
      if (card.classList.contains("tilt")) return;
      card.classList.add("tilt");
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(800px) rotateX(" + (-y * 6) + "deg) rotateY(" + (x * 6) + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    };
    document.querySelectorAll(".suggestion-card, .event-card").forEach(bindTilt);
    document.addEventListener("mev:langchange", function () {
      document.querySelectorAll(".event-card").forEach(bindTilt);
    });
  }

  /* Zacht uitfaden bij klikken op een interne link */
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href]");
    if (!link || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var href = link.getAttribute("href");
    if (link.target === "_blank" || !/^[\w-]+\.html(#.*)?$/.test(href)) return;
    e.preventDefault();
    document.body.classList.add("is-leaving");
    window.setTimeout(function () { window.location.href = href; }, 220);
  });

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    /* Lichtvlek die de muis volgt in donkere banners */
    document.querySelectorAll(".cta-banner, .reviews-panel").forEach(function (panel) {
      panel.addEventListener("mousemove", function (e) {
        var r = panel.getBoundingClientRect();
        panel.style.setProperty("--mx", (e.clientX - r.left) + "px");
        panel.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });

    /* Magnetische knoppen: bewegen een paar pixels mee met de muis */
    document.querySelectorAll(".btn-primary, .btn-on-dark").forEach(function (btn) {
      btn.classList.add("is-magnetic");
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18;
        var y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = "translate(" + x + "px, " + (y - 3) + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }
  /* Bij terug-knop (bfcache) de pagina weer zichtbaar maken */
  window.addEventListener("pageshow", function () { document.body.classList.remove("is-leaving"); });
})();
