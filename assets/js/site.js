/* bloodraven.in — progressive enhancement only.
   Every page is fully usable with this file blocked. */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------------------------------------------------------------- theme */
  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    var sync = function () {
      var isLight = root.getAttribute("data-theme") === "light";
      themeBtn.setAttribute("aria-pressed", isLight ? "true" : "false");
      themeBtn.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
    };
    sync();
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage blocked — the choice just won't persist */
      }
      sync();
    });
  }

  /* ------------------------------------------------------------- mobile nav */
  var navBtn = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");
  if (navBtn && nav) {
    var isMobile = function () {
      return window.matchMedia("(max-width: 62rem)").matches;
    };
    var setNav = function (open) {
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        nav.removeAttribute("hidden");
      } else {
        nav.setAttribute("hidden", "");
      }
    };
    if (isMobile()) setNav(false);

    navBtn.addEventListener("click", function () {
      setNav(navBtn.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && isMobile()) setNav(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navBtn.getAttribute("aria-expanded") === "true") {
        setNav(false);
        navBtn.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (!isMobile()) {
        nav.removeAttribute("hidden");
        navBtn.setAttribute("aria-expanded", "false");
      } else if (navBtn.getAttribute("aria-expanded") !== "true") {
        nav.setAttribute("hidden", "");
      }
    });
  }

  /* ---------------------------------------------------------- header state */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------ copy code */
  var COPY_ICON =
    '<svg class="icon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
    '<svg class="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>';

  Array.prototype.forEach.call(
    document.querySelectorAll(".prose .highlight, .prose > pre"),
    function (block) {
      var pre = block.matches("pre") ? block : block.querySelector("pre");
      if (!pre) return;

      var wrap = document.createElement("div");
      wrap.className = "code-block";
      block.parentNode.insertBefore(wrap, block);
      wrap.appendChild(block);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.innerHTML = COPY_ICON + '<span class="copy-btn__label">Copy</span>';
      btn.setAttribute("aria-label", "Copy code to clipboard");
      wrap.appendChild(btn);

      btn.addEventListener("click", function () {
        // Drop line numbers if the block uses the line-table layout.
        var codeEl = pre.querySelector(".lntd:last-child") || pre;
        var text = codeEl.innerText.replace(/\n$/, "");
        var done = function (ok) {
          btn.setAttribute("data-copied", ok ? "true" : "false");
          btn.querySelector(".copy-btn__label").textContent = ok
            ? "Copied"
            : "Failed";
          setTimeout(function () {
            btn.removeAttribute("data-copied");
            btn.querySelector(".copy-btn__label").textContent = "Copy";
          }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            function () {
              done(true);
            },
            function () {
              done(false);
            }
          );
        } else {
          done(false);
        }
      });
    }
  );

  /* ------------------------------------------------------------------- toc */
  /* A long TOC eats the whole first screen on a phone — start it collapsed
     there, expanded on wider screens. */
  var toc = document.querySelector(".toc");
  if (toc && window.matchMedia("(max-width: 48rem)").matches) {
    toc.removeAttribute("open");
  }

  /* ---------------------------------------------------------------- tables */
  Array.prototype.forEach.call(
    document.querySelectorAll(".prose > table"),
    function (table) {
      var wrap = document.createElement("div");
      wrap.className = "table-wrap";
      wrap.setAttribute("tabindex", "0");
      wrap.setAttribute("role", "region");
      wrap.setAttribute("aria-label", "Table, scrollable");
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    }
  );

  /* --------------------------------------------------------- scroll reveal */
  /* Content below the hero fades up as it comes into view. The hidden class
     is added *here* rather than in the stylesheet, so if this file never
     runs — blocked, failed, no IntersectionObserver — nothing is ever
     hidden and the page just renders. See 07-motion.css. */
  var REVEAL_SELECTOR = [
    ".section-header",
    ".capability",
    ".featured-grid > *",
    ".article-list > *",
    ".timeline__item",
    ".social-grid > *",
    ".grid--2 > *",
    ".empty-state",
    ".article-body",
    ".article-footer",
    ".pager"
  ].join(",");

  var revealNow = function (el) {
    el.classList.remove("reveal");
    el.classList.add("reveal-in");
  };

  var prefersStill = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  if ("IntersectionObserver" in window && !prefersStill) {
    var io = new IntersectionObserver(
      function (entries) {
        // Everything that crossed in the same frame cascades together, top
        // to bottom. An element scrolled to on its own is entry 0, so it
        // gets no delay — the stagger never turns into lag.
        entries
          .filter(function (e) {
            return e.isIntersecting;
          })
          .sort(function (a, b) {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          })
          .forEach(function (e, i) {
            e.target.style.animationDelay = Math.min(i, 5) * 120 + "ms";
            revealNow(e.target);
            io.unobserve(e.target);
          });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );

    var watched = [];
    Array.prototype.forEach.call(
      document.querySelectorAll(REVEAL_SELECTOR),
      function (el) {
        // The hero runs its own load choreography in CSS; don't double up.
        if (el.closest(".hero")) return;
        el.classList.add("reveal");
        io.observe(el);
        watched.push(el);
      }
    );

    // Failsafe. If the observer never delivers — a tab restored from bfcache,
    // an extension interfering, a bug in this file — anything the reader can
    // actually see would sit at opacity 0. After a few seconds, force through
    // whatever is at or above the fold. Content still below it keeps its
    // reveal, so this costs nothing in the normal case.
    setTimeout(function () {
      watched.forEach(function (el) {
        if (!el.classList.contains("reveal")) return;
        if (el.getBoundingClientRect().top < window.innerHeight) revealNow(el);
      });
    }, 4000);
  }

  /* --------------------------------------------------------------- filters */
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-filter-group]"),
    function (group) {
      var targetSel = group.getAttribute("data-filter-target");
      var items = document.querySelectorAll(targetSel);
      var buttons = group.querySelectorAll("[data-filter]");
      var countEl = document.querySelector(
        group.getAttribute("data-filter-count") || " "
      );

      var apply = function (term) {
        var shown = 0;
        Array.prototype.forEach.call(items, function (item) {
          var terms = (item.getAttribute("data-terms") || "").split(" ");
          var match = term === "all" || terms.indexOf(term) !== -1;
          if (match) {
            item.removeAttribute("hidden");
            // A card filtered back into view may never have been observed
            // intersecting, which would leave it at opacity 0.
            if (item.classList.contains("reveal")) revealNow(item);
            shown++;
          } else {
            item.setAttribute("hidden", "");
          }
        });
        Array.prototype.forEach.call(buttons, function (b) {
          b.setAttribute(
            "aria-pressed",
            b.getAttribute("data-filter") === term ? "true" : "false"
          );
        });
        if (countEl) {
          countEl.textContent =
            shown + (shown === 1 ? " result" : " results");
        }
      };

      group.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filter]");
        if (btn) apply(btn.getAttribute("data-filter"));
      });
    }
  );
})();
