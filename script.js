/* =========================================================
   Rembrand marketing site — small interactivity
   ========================================================= */

(function () {
  // --- mobile menu toggle ----------------------------------
  // Just toggle a class. CSS handles all the layout — no inline styles.
  const toggle = document.querySelector(".mobile-toggle");
  const headerInner = document.querySelector(".header-inner");

  if (toggle && headerInner) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      headerInner.classList.toggle("menu-open", !open);
      // Opt the panel into transitions only after the user has actually
      // toggled it once. Stops the panel from flashing on viewport
      // resize across the mobile breakpoint.
      headerInner.classList.add("has-toggled");
    });

    // Close the menu when any link inside is clicked.
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      headerInner.classList.remove("menu-open");
    };
    headerInner.querySelectorAll(".header-collapse a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    // Esc dismisses the menu (keyboard accessibility).
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && headerInner.classList.contains("menu-open")) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // --- contact page form ------------------------------------
  // Builds a mailto: URL from the form fields and triggers it.
  // Swap the `to` address (and/or replace this with a real backend)
  // when you have one — Formspree/Getform/etc. only need a different
  // form action, no JS change required.
  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const formCard = contactForm.closest(".contact-form-card");
    const successCard = document.querySelector("[data-contact-success]");
    const resetBtn = document.querySelector("[data-contact-reset]");
    const SALES_EMAIL = "sales@rembrand.com";

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Native HTML5 validation
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      const data = new FormData(contactForm);
      const company = (data.get("company") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const country = (data.get("country") || "").toString().trim();

      const subject = `Sales inquiry from ${company}`;
      const body =
        `Hi Rembrand team,\n\n` +
        `I'd like to learn more about In-Content Advertising.\n\n` +
        `Company: ${company}\n` +
        `Email: ${email}\n` +
        `Country: ${country}\n\n` +
        `Thanks!`;

      const href =
        `mailto:${SALES_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      // Open the user's mail client
      window.location.href = href;

      // Swap to success state regardless (the mailto either opens or
      // the user can copy the address from the success message).
      if (formCard && successCard) {
        formCard.hidden = true;
        successCard.hidden = false;
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        contactForm.reset();
        if (formCard && successCard) {
          successCard.hidden = true;
          formCard.hidden = false;
        }
        contactForm.querySelector("input")?.focus();
      });
    }
  }

  // --- partner logo marquee --------------------------------
  // Duplicate the logo set so the marquee animation can loop seamlessly.
  // Clones are tagged with data-clone so CSS can hide them on desktop
  // (where the row sits centered, no scrolling needed).
  const partnersTrack = document.querySelector(".partners-track");
  if (partnersTrack) {
    Array.from(partnersTrack.children).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("data-clone", "");
      partnersTrack.appendChild(clone);
    });
  }

  // --- letter stagger button animation ---------------------
  // Wraps each character of any element with [data-stagger-text]
  // into the clipping/duplicate structure required by the CSS.
  // The hover effect is driven entirely by CSS transitions.
  function applyLetterStagger(el) {
    const original = el.textContent.trim();
    if (!original) return;
    if (!el.getAttribute("aria-label")) {
      el.setAttribute("aria-label", original);
    }
    const inner = document.createElement("span");
    inner.className = "stagger-inner";
    inner.setAttribute("aria-hidden", "true");
    const chars = Array.from(original);
    const total = chars.length;
    chars.forEach((ch, i) => {
      if (ch === " ") {
        // Wrap spaces in their own span so inline-flex .stagger-inner
        // doesn't collapse the whitespace.
        const space = document.createElement("span");
        space.className = "char-space";
        space.appendChild(document.createTextNode(" "));
        inner.appendChild(space);
        return;
      }
      const clip = document.createElement("span");
      clip.className = "char-clip";
      const shift = document.createElement("span");
      shift.className = "char-shift";
      // Reverse stagger: rightmost letter starts first (--i = 0),
      // leftmost letter starts last (--i = total - 1).
      shift.style.setProperty("--i", total - 1 - i);
      shift.textContent = ch;
      const dup = document.createElement("span");
      dup.className = "char-dup";
      dup.textContent = ch;
      shift.appendChild(dup);
      clip.appendChild(shift);
      inner.appendChild(clip);
    });
    el.textContent = "";
    el.appendChild(inner);
  }
  document.querySelectorAll("[data-stagger-text]").forEach(applyLetterStagger);

  // --- nav dropdown ----------------------------------------
  // Single shared dropdown card. Each top-level trigger has a data-menu
  // attribute that maps to a hidden panel inside the card. On hover/focus
  // we measure the target panel's natural size, then animate the card's
  // width, height, and horizontal position so it morphs smoothly between
  // menus and re-centers under the active trigger.
  function initNavDropdown() {
    const navEl = document.querySelector(".primary-nav");
    const dropdown = document.querySelector("[data-nav-dropdown]");
    if (!navEl || !dropdown) return;

    // Don't run dropdown logic on mobile — CSS hides the card there anyway.
    const desktopMQ = window.matchMedia("(min-width: 1025px)");
    if (!desktopMQ.matches) return;

    const triggers = Array.from(navEl.querySelectorAll("[data-menu]"));
    const panels = Array.from(dropdown.querySelectorAll("[data-panel]"));
    const sizes = new Map();

    // Measure each panel's natural width/height by cloning it into an
    // off-screen sandbox that mirrors the dropdown card's padding/box-sizing.
    function measurePanels() {
      const cs = getComputedStyle(dropdown);
      const measurer = document.createElement("div");
      measurer.style.cssText =
        "position:absolute; visibility:hidden; pointer-events:none;" +
        "left:-9999px; top:-9999px;" +
        "padding:" + cs.padding + ";" +
        "box-sizing:" + cs.boxSizing + ";" +
        "border-radius:" + cs.borderRadius + ";" +
        "font-family:" + cs.fontFamily + ";";
      document.body.appendChild(measurer);

      const padX =
        parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const padY =
        parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

      panels.forEach((panel) => {
        const clone = panel.cloneNode(true);
        // Clone is in static flow inside measurer so it sizes to content
        clone.style.position = "static";
        clone.style.opacity = "1";
        clone.style.pointerEvents = "auto";
        clone.style.inset = "auto";
        measurer.appendChild(clone);
        const rect = measurer.getBoundingClientRect();
        // Subtract padding because dropdown CSS uses box-sizing:content-box
        // — width/height set inline are interpreted as content size.
        // A small buffer is added to width and height so the dropdown's
        // overflow:hidden never clips the last item by a subpixel — the
        // Advertisers menu in particular was losing its 2nd row otherwise.
        // Generous height buffer because the mega-menu items render with
        // sub-pixel typography (title + description on two lines) and the
        // dropdown's overflow:hidden can otherwise clip the last row by a
        // pixel or two on certain DPIs. The +20px overshoot is invisible
        // (matches the panel's own bottom padding) and prevents cutoff.
        sizes.set(panel.dataset.panel, {
          width: Math.ceil(rect.width - padX) + 2,
          height: Math.ceil(rect.height - padY) + 20,
        });
        measurer.removeChild(clone);
      });

      document.body.removeChild(measurer);
    }

    let activeMenu = null;
    let hideTimer = null;

    function show(menu) {
      clearTimeout(hideTimer);
      if (activeMenu === menu) return;

      const trigger = triggers.find((t) => t.dataset.menu === menu);
      const size = sizes.get(menu);
      if (!trigger || !size) return;

      const wasOpen = dropdown.classList.contains("is-open");
      activeMenu = menu;

      panels.forEach((p) =>
        p.classList.toggle("is-active", p.dataset.panel === menu)
      );
      triggers.forEach((t) => {
        const isActive = t === trigger;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-expanded", String(isActive));
      });

      // Left-align the card to the active trigger (relative to .primary-nav)
      // so the menu's left edge sits flush with the trigger label. We still
      // clamp on the right so the card can't overflow the nav bounds — when
      // a wider menu would push past the right edge, slide it back inward.
      const cs = getComputedStyle(dropdown);
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const navRect = navEl.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const triggerLeft = triggerRect.left - navRect.left;
      const outerWidth = size.width + padX;
      // Right edge of the card relative to the nav box; clamp into bounds.
      const maxLeft = Math.max(0, navRect.width - outerWidth);
      const left = Math.min(Math.max(0, triggerLeft), maxLeft);

      // First open: snap to size without animating from the CSS default
      // (220×120). Subsequent menu switches keep the smooth morph.
      if (!wasOpen) {
        dropdown.style.transition = "none";
        dropdown.style.width = size.width + "px";
        dropdown.style.height = size.height + "px";
        dropdown.style.left = left + "px";
        // Force reflow, then restore the stylesheet transition rules.
        void dropdown.offsetWidth;
        dropdown.style.transition = "";
      }

      dropdown.style.width = size.width + "px";
      dropdown.style.height = size.height + "px";
      dropdown.style.left = left + "px";

      dropdown.classList.add("is-open");
      dropdown.setAttribute("aria-hidden", "false");
    }

    function hide(immediate) {
      clearTimeout(hideTimer);
      const doHide = () => {
        activeMenu = null;
        dropdown.classList.remove("is-open");
        dropdown.setAttribute("aria-hidden", "true");
        triggers.forEach((t) => {
          t.classList.remove("is-active");
          t.setAttribute("aria-expanded", "false");
        });
      };
      if (immediate) doHide();
      // 140ms wasn't enough grace for the mouse to bridge the gap from
      // a trigger button to the dropdown card. 320ms is generous enough
      // for a slow drift but still feels responsive on close.
      else hideTimer = setTimeout(doHide, 320);
    }

    // Open on hover/focus of trigger
    triggers.forEach((trigger) => {
      trigger.addEventListener("mouseenter", () =>
        show(trigger.dataset.menu)
      );
      trigger.addEventListener("focus", () => show(trigger.dataset.menu));
    });

    // Hovering a non-trigger nav item (e.g. Publishers, Platform) closes
    // the dropdown so the menu doesn't stay open while pointing at an
    // unrelated link. Filter is critical: "li > a" otherwise matches the
    // dropdown's own items, which would slam the menu shut the instant
    // the mouse touched any of them.
    Array.from(navEl.querySelectorAll("li > a"))
      .filter((a) => !a.closest(".nav-dropdown"))
      .forEach((plainLink) => {
        plainLink.addEventListener("mouseenter", () => hide());
      });

    // Bridge nav and dropdown so the gap between them doesn't snap shut
    navEl.addEventListener("mouseleave", () => hide());
    dropdown.addEventListener("mouseenter", () => clearTimeout(hideTimer));
    dropdown.addEventListener("mouseleave", () => hide());

    // Esc closes immediately
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && activeMenu) hide(true);
    });

    // Initial measurement once styles + stagger structure are in place
    measurePanels();

    // Re-measure once webfonts settle (Halyard / Hanken can shift glyph widths)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measurePanels);
    }

    // Re-measure on resize so font-size changes take effect
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measurePanels, 120);
    });
  }
  initNavDropdown();

  // --- v2 hero: scroll-driven header background ------------
  // On the v2 page the header floats transparently over the hero. After
  // the user scrolls past a small threshold, we add .is-scrolled so CSS
  // can fade in a frosted-white background (and flip text to dark).
  function initHeaderScroll() {
    if (!document.body.classList.contains("hero-variant-2")) return;
    const header = document.querySelector(".site-header");
    if (!header) return;

    const threshold = 16;
    let lastState = null;
    let raf = null;

    function update() {
      raf = null;
      const scrolled = window.scrollY > threshold;
      if (scrolled !== lastState) {
        lastState = scrolled;
        header.classList.toggle("is-scrolled", scrolled);
      }
    }
    function onScroll() {
      if (raf == null) raf = requestAnimationFrame(update);
    }

    update(); // set initial state in case the page loads scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  initHeaderScroll();

  // --- dev-only font switcher ------------------------------
  // A small segmented control (bottom-left) flips the body font between
  // Halyard (default), Montserrat, and Helvetica so we can compare type
  // on the live page. The choice is persisted in localStorage so it
  // survives reloads and follows the user from page to page. Delete the
  // .font-switcher markup + this block before launch.
  function initFontSwitcher() {
    const switcher = document.querySelector("[data-font-switcher]");
    if (!switcher) return;

    const FONTS = {
      default: null, // null = clear the override and use the stylesheet default
      // Montserrat is loaded via Google Fonts in each page's <head>. The
      // stack falls back through similar geometric sans options if the
      // network is slow.
      montserrat:
        '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
      helvetica:
        '"Helvetica Neue", Helvetica, Arial, sans-serif',
    };
    const STORAGE_KEY = "preferred-font";
    const root = document.documentElement;

    function setFont(key) {
      if (!(key in FONTS)) return;
      const value = FONTS[key];
      if (value == null) {
        root.style.removeProperty("--font-sans");
      } else {
        root.style.setProperty("--font-sans", value);
      }
      switcher.querySelectorAll(".font-switcher-btn").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.font === key);
      });
      try { localStorage.setItem(STORAGE_KEY, key); } catch (e) {}
    }

    // Restore previous selection (if any) before showing anything.
    let saved = "default";
    try { saved = localStorage.getItem(STORAGE_KEY) || "default"; } catch (e) {}
    setFont(saved);

    switcher.querySelectorAll(".font-switcher-btn").forEach((btn) => {
      btn.addEventListener("click", () => setFont(btn.dataset.font));
    });
  }
  initFontSwitcher();

  // --- subtle scroll reveal --------------------------------
  if ("IntersectionObserver" in window) {
    const reveal = document.querySelectorAll(
      ".mission-text, .cap-card, .latest-row, .research-inner, .latest-title"
    );
    reveal.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(12px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveal.forEach((el) => io.observe(el));
  }
})();
