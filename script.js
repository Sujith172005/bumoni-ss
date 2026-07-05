const WA_NUMBER = "917904336537";
const CAROUSEL_INTERVAL_MS = 5000;
const CAROUSEL_ANIM_MS = 720;
const HERO_FADE_MS = 1000;
const HERO_TEXT_OUT_MS = 380;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function carouselAutoplayMs() {
  return CAROUSEL_INTERVAL_MS;
}

function canPauseCarouselOnHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function getCarouselDirection(currentIndex, nextIndex, total) {
  if (nextIndex === currentIndex) return 0;
  const forward = (nextIndex - currentIndex + total) % total;
  const backward = (currentIndex - nextIndex + total) % total;
  return forward <= backward ? 1 : -1;
}

function runSlideTransition(slides, fromIndex, toIndex, direction, animate = true) {
  const carouselClasses = [
    "carousel-enter-right",
    "carousel-enter-left",
    "carousel-exit-left",
    "carousel-exit-right",
    "carousel-is-entering"
  ];

  if (!animate || fromIndex === toIndex) {
    slides.forEach((slide, index) => {
      slide.classList.remove(...carouselClasses);
      slide.classList.toggle("active", index === toIndex);
    });
    return;
  }

  const from = slides[fromIndex];
  const to = slides[toIndex];
  const forward = direction > 0;

  slides.forEach((slide) => slide.classList.remove(...carouselClasses));

  to.classList.add(forward ? "carousel-enter-right" : "carousel-enter-left", "carousel-is-entering");
  from.classList.add("active");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      from.classList.add(forward ? "carousel-exit-left" : "carousel-exit-right");
      to.classList.add("active");
      to.classList.remove("carousel-enter-right", "carousel-enter-left");
    });
  });

  window.setTimeout(() => {
    slides.forEach((slide, index) => {
      slide.classList.remove(...carouselClasses);
      slide.classList.toggle("active", index === toIndex);
    });
  }, CAROUSEL_ANIM_MS);
}

function startHeroKenBurns(slide, holdOnly = false) {
  if (!slide) return;
  slide.classList.remove("is-ken-burns", "ken-burns-hold");
  void slide.offsetWidth;
  slide.classList.add("is-ken-burns");
  if (holdOnly) slide.classList.add("ken-burns-hold");
}

function runHeroFadeTransition(slides, fromIndex, toIndex, animate = true) {
  const to = slides[toIndex];
  const hero = $("#hero");

  if (!animate || fromIndex === toIndex) {
    slides.forEach((slide, index) => {
      slide.classList.remove("active", "is-leaving", "is-ken-burns", "ken-burns-hold");
      slide.classList.toggle("active", index === toIndex);
    });
    startHeroKenBurns(to, !animate);
    return;
  }

  const from = slides[fromIndex];

  slides.forEach((slide) => {
    slide.classList.remove("is-leaving");
    if (slide !== to) slide.classList.remove("is-ken-burns", "ken-burns-hold");
  });

  if (to) {
    to.classList.add("active");
    startHeroKenBurns(to, false);
  }

  if (hero) {
    hero.classList.remove("is-light-sweep");
    void hero.offsetWidth;
    hero.classList.add("is-light-sweep");
    window.setTimeout(() => hero.classList.remove("is-light-sweep"), HERO_FADE_MS);
  }

  if (from && from !== to) {
    requestAnimationFrame(() => {
      from.classList.add("is-leaving");
    });
  }

  window.setTimeout(() => {
    slides.forEach((slide, index) => {
      slide.classList.remove("is-leaving");
      if (index !== toIndex) {
        slide.classList.remove("active", "is-ken-burns", "ken-burns-hold");
      }
    });
  }, HERO_FADE_MS);
}

function whatsappUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function updateScrollProgress() {
  const bar = $("#scroll-progress");
  if (!bar) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  bar.style.width = `${progress}%`;
}

function updateNavbarState() {
  $("#navbar")?.classList.add("navbar-always-visible");
}

window.addEventListener(
  "scroll",
  () => {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateNavbarState();
    });
  },
  { passive: true }
);

updateScrollProgress();
updateNavbarState();

const hamburger = $("#hamburger");
const drawer = $("#mobile-drawer");
const backdrop = $("#mobile-backdrop");
const drawerClose = $("#drawer-close");

function openMenu() {
  if (!drawer || !backdrop) return;
  drawer.classList.add("open");
  backdrop.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  hamburger?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  if (!drawer || !backdrop) return;
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  hamburger?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

hamburger?.addEventListener("click", openMenu);
drawerClose?.addEventListener("click", closeMenu);
backdrop?.addEventListener("click", closeMenu);

$$(".drawer-links a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");

    if (href === "#") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = href ? $(href) : null;
    if (!target) return;

    event.preventDefault();
    const navHeight = $("#navbar")?.offsetHeight || 92;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 18;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

$$(".nav-dropdown").forEach((dropdown) => {
  const trigger = dropdown.querySelector("a");
  trigger?.addEventListener("click", (event) => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch && !dropdown.classList.contains("open")) {
      event.preventDefault();
      $$(".nav-dropdown.open").forEach((item) => item.classList.remove("open"));
      dropdown.classList.add("open");
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    $$(".nav-dropdown.open").forEach((dropdown) => dropdown.classList.remove("open"));
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    $$(".nav-dropdown.open").forEach((dropdown) => dropdown.classList.remove("open"));
  }
});

const year = $("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const contactButton = $("#contact-wa");
const contactStatus = $("#contact-status");
const contactForm = $("#contact-form");

contactButton?.addEventListener("click", () => {
  const name = $("#contact-name")?.value.trim();
  const phone = $("#contact-phone")?.value.trim();
  const email = $("#contact-email")?.value.trim();
  const message = $("#contact-message")?.value.trim();

  if (!name || !phone || !email || !message) {
    contactStatus.textContent = "Please complete all fields before sending on WhatsApp.";
    contactForm?.reportValidity?.();
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    contactStatus.textContent = "Please enter a valid email address.";
    return;
  }

  const text = `Hello Bumoniis,\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\n${message}`;
  contactStatus.textContent = "Opening WhatsApp...";

  const win = window.open(whatsappUrl(text), "_blank");
  if (!win) {
    window.location.href = whatsappUrl(text);
  }
});

const HERO_PRODUCTS = [
  { title: "Handcrafted<br /><em>Truffles &amp; Pralines</em>", desc: "Elegant cocoa-rich truffles and filled pralines with smooth centres, glossy finishes and premium gifting appeal.", cta: "View Collection", link: "truffles-pralines.html" },
  { title: "Handcrafted<br /><em>Fudge, Caramels &amp; Toffees</em>", desc: "Soft fudge, buttery caramels and chewy toffees made for celebrations, hampers and sweet table treats.", cta: "View Collection", link: "fudge-caramels-toffees.html" },
  { title: "Handcrafted<br /><em>Macaroons</em>", desc: "Colourful, delicate macaroons with crisp shells, soft centres and elegant flavours for premium occasions.", cta: "View Collection", link: "macaroons.html" },
  { title: "Fresh Baked<br /><em>Brownies</em>", desc: "Rich chocolate brownies with fudgy centres, glossy tops and premium handmade finish.", cta: "View Brownies", link: "brownies.html" },
  { title: "Fresh Baked<br /><em>Cookies</em>", desc: "Crunchy and buttery cookies baked fresh for gifting, tea-time, hampers and premium snacking.", cta: "View Cookies", link: "cookies.html" },
  { title: "Classic<br /><em>Desserts</em>", desc: "Classic desserts with smooth textures, rich flavours and artisan presentation for every occasion.", cta: "View Desserts", link: "desserts.html" }
];

(function setupHeroSlider() {
  const hero = $("#hero");
  const slides = $$(".hero-slide");
  const dots = $$("[data-hero-dot]");
  const prevBtn = $(".hero-arrow-prev");
  const nextBtn = $(".hero-arrow-next");
  const heroContent = $("#hero-content");
  const heroTitle = $("#hero-title");
  const heroDesc = $("#hero-desc");
  const heroCta = $("#hero-cta");

  if (!hero || !slides.length) return;

  let activeIndex = 0;
  let timerId = null;
  let isTransitioning = false;

  function updateHeroContent(index, animate = true) {
    const product = HERO_PRODUCTS[index];
    if (!product || !heroContent) return;

    const applyContent = () => {
      if (heroTitle) heroTitle.innerHTML = product.title;
      if (heroDesc) heroDesc.textContent = product.desc;
      if (heroCta) {
        heroCta.textContent = product.cta;
        heroCta.setAttribute("href", product.link);
      }
    };

    if (!animate) {
      heroContent.classList.remove("is-changing", "is-entering");
      applyContent();
      return;
    }

    heroContent.classList.remove("is-entering");
    heroContent.classList.add("is-changing");

    window.setTimeout(() => {
      applyContent();
      heroContent.classList.remove("is-changing");
      void heroContent.offsetWidth;
      heroContent.classList.add("is-entering");
      window.setTimeout(() => {
        heroContent.classList.remove("is-entering");
      }, HERO_FADE_MS + 280);
    }, HERO_TEXT_OUT_MS);
  }

  function showSlide(index, animate = true) {
    const nextIndex = (index + slides.length) % slides.length;
    if (isTransitioning && animate) return;
    if (nextIndex === activeIndex && animate) return;

    const previousIndex = activeIndex;
    activeIndex = nextIndex;

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (animate) isTransitioning = true;
    runHeroFadeTransition(slides, previousIndex, nextIndex, animate);
    updateHeroContent(activeIndex, animate);
    if (animate) {
      window.setTimeout(() => {
        isTransitioning = false;
      }, HERO_FADE_MS);
    }
  }

  function nextSlide() {
    showSlide(activeIndex + 1);
  }

  function prevSlide() {
    showSlide(activeIndex - 1);
  }

  function startAutoPlay() {
    if (timerId) window.clearInterval(timerId);
    timerId = window.setInterval(nextSlide, carouselAutoplayMs());
  }

  function restartAutoPlay() {
    startAutoPlay();
  }

  function pauseAutoPlay() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    restartAutoPlay();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    restartAutoPlay();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.getAttribute("data-hero-dot"));
      if (!Number.isNaN(index)) {
        showSlide(index);
        restartAutoPlay();
      }
    });
  });

  if (canPauseCarouselOnHover()) {
    hero.addEventListener("mouseenter", pauseAutoPlay);
    hero.addEventListener("mouseleave", startAutoPlay);
  }

  let touchStartX = 0;
  hero.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0]?.clientX || 0;
  }, { passive: true });

  hero.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0]?.clientX || 0;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) prevSlide();
    else nextSlide();
    restartAutoPlay();
  }, { passive: true });

  showSlide(0, false);
  startAutoPlay();
})();

(function lockFixedNavbarAndWhatsApp() {
  function lock() {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      navbar.classList.add("navbar-always-visible");
      navbar.style.position = "fixed";
      navbar.style.top = "0";
      navbar.style.left = "0";
      navbar.style.right = "0";
      navbar.style.width = "100%";
      navbar.style.zIndex = "2147483640";
      navbar.style.transform = "none";
      navbar.style.opacity = "1";
      navbar.style.visibility = "visible";
    }

    document.querySelectorAll(".floating-wa").forEach((button) => {
      button.style.position = "fixed";
      button.style.right = window.innerWidth <= 900 ? "16px" : "22px";
      button.style.bottom = window.innerWidth <= 900 ? "16px" : "22px";
      button.style.zIndex = "2147483641";
      button.style.opacity = "1";
      button.style.visibility = "visible";
      button.style.display = "inline-flex";
    });
  }
  lock();
  window.addEventListener("scroll", lock, { passive: true });
  window.addEventListener("resize", lock);
})();

/* Mobile drawer dropdown open/close */
$$('.drawer-dropdown-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const parent = button.closest('.drawer-dropdown');
    if (!parent) return;

    const isOpen = parent.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

/* =========================================================
   FINAL FIX: Robust mobile drawer controls
   Works on GitHub Pages and all product pages.
   ========================================================= */
(function finalMobileMenuFix() {
  const menuButton = document.getElementById("hamburger");
  const drawerEl = document.getElementById("mobile-drawer");
  const backdropEl = document.getElementById("mobile-backdrop");
  const closeButton = document.getElementById("drawer-close");

  if (!menuButton || !drawerEl || !backdropEl) return;

  function showDrawer(event) {
    if (event) event.preventDefault();
    drawerEl.classList.add("open");
    backdropEl.classList.add("open");
    document.body.classList.add("menu-open");
    drawerEl.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
  }

  function hideDrawer() {
    drawerEl.classList.remove("open");
    backdropEl.classList.remove("open");
    document.body.classList.remove("menu-open");
    drawerEl.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
  }

  menuButton.onclick = showDrawer;
  closeButton?.addEventListener("click", hideDrawer);
  backdropEl.addEventListener("click", hideDrawer);

  drawerEl.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", hideDrawer);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) hideDrawer();
  });
})();
