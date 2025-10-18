document.addEventListener("DOMContentLoaded", () => {
  const sections = {  // ВСЕ АНКЕРЫ ВМЕСТЕ. Прокрутка и докрутка
    about: 5, // 5% от верхней части секции "Кто мы"
    services: 5, // 5% от верхней части секции "Наши услуги"
    works: -5, // -5% от верхней части секции "Наши работы"
    partners: 5, // 5% от верхней части секции "Партнеры"
    contact: -5, // -5% от верхней части секции "Контакты"
  };

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // Instagram-like slider
  const igSlider = document.querySelector(".ig-slider");
  const igStrip = document.querySelector(".ig-strip");

  function withNoSnap(fn, durationMs = 450) {
    if (!igStrip) return fn();
    igStrip.classList.add('no-snap');
    try { fn(); } finally {
      // restore after animation
      setTimeout(() => igStrip.classList.remove('no-snap'), durationMs);
    }
  }

  function getScrollStep() {
    if (!igStrip) return 320;
    const first = igStrip.querySelector(".ig-item");
    const cs = getComputedStyle(igStrip);
    const gap = parseFloat(cs.gap || cs.columnGap || '0') || 0;
    const w = first ? first.getBoundingClientRect().width : 240;
    return Math.max(160, w + gap);
  }

  function scrollStrip(dir = 1) {
    if (!igStrip) return;
    withNoSnap(() => {
      igStrip.scrollBy({ left: dir * getScrollStep(), behavior: "smooth" });
    });
  }

  // Continuous scroll logic
  let hoverRafId = null;
  let pressRafId = null;
  let isHovering = false;
  let pressActive = false;

  function stopHover() { if (hoverRafId) { cancelAnimationFrame(hoverRafId); hoverRafId = null; setTimeout(() => igStrip?.classList.remove('no-snap'), 120); } }
  function stopPress() { if (pressRafId) { cancelAnimationFrame(pressRafId); pressRafId = null; setTimeout(() => igStrip?.classList.remove('no-snap'), 120); } }

  function startRafScroll(dir, speedPxPerSec, assignId) {
    if (!igStrip) return;
    igStrip.classList.add('no-snap');
    let last = performance.now();
    let rem = 0;
    function frame(now) {
      const dt = (now - last) / 1000;
      last = now;
      rem += dir * speedPxPerSec * dt;
      const step = rem > 0 ? Math.floor(rem) : Math.ceil(rem);
      if (step) { igStrip.scrollLeft += step; rem -= step; }
      assignId(requestAnimationFrame(frame));
    }
    assignId(requestAnimationFrame(frame));
  }

  function startHover(dir) { stopHover(); startRafScroll(dir, 16, (id) => (hoverRafId = id)); }
  function startPress(dir) { stopPress(); stopHover(); startRafScroll(dir, 180, (id) => (pressRafId = id)); }

  // Update IG slider arrow functionality for continuous scrolling
  function startContinuousScroll(dir, speed) {
    if (!igStrip) return;
    igStrip.classList.add("no-snap");
    let lastTime = performance.now();

    function scrollFrame(now) {
      const deltaTime = (now - lastTime) / 1000; // seconds
      lastTime = now;
      igStrip.scrollLeft += dir * speed * deltaTime;
      hoverRafId = requestAnimationFrame(scrollFrame);
    }

    hoverRafId = requestAnimationFrame(scrollFrame);
  }

  function stopContinuousScroll() {
    if (hoverRafId) {
      cancelAnimationFrame(hoverRafId);
      hoverRafId = null;
      igStrip.classList.remove("no-snap");
    }
  }

  // Increase the speed of continuous scrolling on press
  function startPressScroll(dir, speed) {
    if (!igStrip) return;
    igStrip.classList.add("no-snap");
    let lastTime = performance.now();

    function scrollFrame(now) {
      const deltaTime = (now - lastTime) / 1000; // seconds
      lastTime = now;
      igStrip.scrollLeft += dir * speed * deltaTime * 2; // Doubled the speed multiplier
      pressRafId = requestAnimationFrame(scrollFrame);
    }

    pressRafId = requestAnimationFrame(scrollFrame);
  }

  function stopPressScroll() {
    if (pressRafId) {
      cancelAnimationFrame(pressRafId);
      pressRafId = null;
      igStrip.classList.remove("no-snap");
    }
  }

  // Add hover-based scrolling at half the speed
  function startHoverScroll(dir, speed) {
    if (!igStrip) return;
    igStrip.classList.add("no-snap");
    let lastTime = performance.now();

    function scrollFrame(now) {
      const deltaTime = (now - lastTime) / 1000; // seconds
      lastTime = now;
      igStrip.scrollLeft += dir * speed * deltaTime * 0.5; // Half the speed multiplier
      hoverRafId = requestAnimationFrame(scrollFrame);
    }

    hoverRafId = requestAnimationFrame(scrollFrame);
  }

  function stopHoverScroll() {
    if (hoverRafId) {
      cancelAnimationFrame(hoverRafId);
      hoverRafId = null;
      igStrip.classList.remove("no-snap");
    }
  }

  // Update arrow event listeners for hover-based scrolling
  function rewireArrow(el, dir) {
    if (!el) return null;
    const btn = el.cloneNode(true);
    el.replaceWith(btn);
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      btn.setPointerCapture?.(e.pointerId);
      startPressScroll(dir, 300); // Continuous scroll on press
    });
    btn.addEventListener("pointerup", (e) => {
      btn.releasePointerCapture?.(e.pointerId);
      stopPressScroll();
    });
    btn.addEventListener("pointerleave", () => {
      stopPressScroll();
      stopHoverScroll();
    });
    btn.addEventListener("lostpointercapture", () => {
      stopPressScroll();
      stopHoverScroll();
    });
    btn.addEventListener("pointerenter", () => startHoverScroll(dir, 300)); // Slower scroll on hover
    return btn;
  }

  // Apply updated behavior to both arrows
  rewireArrow(document.querySelector(".ig-arrow.prev"), -1);
  rewireArrow(document.querySelector(".ig-arrow.next"), 1);

  // Add functionality for Instagram slider arrows
  if (igSlider && igStrip) {
    const prevArrow = igSlider.querySelector(".ig-arrow.prev");
    const nextArrow = igSlider.querySelector(".ig-arrow.next");

    function scrollStrip(direction) {
      const scrollAmount = igStrip.offsetWidth / 2; // Scroll half the width of the strip
      igStrip.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    }

    if (prevArrow) {
      prevArrow.addEventListener("click", () => scrollStrip(-1));
    }

    if (nextArrow) {
      nextArrow.addEventListener("click", () => scrollStrip(1));
    }
  }

  // Enable click-and-drag scrolling on the Instagram strip
  if (igStrip) {
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const stopDrag = (evt) => {
      if (!isDragging) return;
      isDragging = false;
      igStrip.classList.remove("no-snap");
      delete igStrip.dataset.dragging;
      if (evt?.pointerId !== undefined) {
        igStrip.releasePointerCapture?.(evt.pointerId);
      }
    };

    igStrip.addEventListener("pointerdown", (evt) => {
      isDragging = true;
      dragStartX = evt.clientX;
      dragStartScroll = igStrip.scrollLeft;
      igStrip.classList.add("no-snap");
      igStrip.dataset.dragging = "true";
      igStrip.setPointerCapture?.(evt.pointerId);
    });

    igStrip.addEventListener("pointermove", (evt) => {
      if (!isDragging) return;
      const delta = evt.clientX - dragStartX;
      igStrip.scrollLeft = dragStartScroll - delta;
    });

    igStrip.addEventListener("pointerup", stopDrag);
    igStrip.addEventListener("pointerleave", stopDrag);
    igStrip.addEventListener("lostpointercapture", stopDrag);

    // Disable scroll with mouse wheel when hovering over the IG strip
    igStrip.addEventListener(
      "wheel",
      (evt) => {
        evt.preventDefault();
        if (evt.deltaY) {
          window.scrollBy({ top: evt.deltaY, behavior: "auto" });
        }
      },
      { passive: false }
    );
  }

  // Ensure all videos in the Instagram slider are lazy-loaded
  const igVideos = igStrip ? igStrip.querySelectorAll("video") : [];
  igVideos.forEach((video) => {
    video.addEventListener("mouseenter", () => video.play());
    video.addEventListener("mouseleave", () => video.pause());
  });

  // Form handler (demo)
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const selectedPackage = formData.get("package") || "Не выбран";

      const emailBody = `
        Имя: ${data.name}
        Email: ${data.email}
        Компания: ${data.company || "Не указана"}
        Пакет: ${selectedPackage}
        Сообщение: ${data.message || "Не указано"}
      `;

      try {
        await fetch("https://example.com/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "omego3100@gmail.com",
            subject: "Новый запрос с сайта ADViral Agency",
            body: emailBody,
          }),
        });

        alert("Ваш запрос успешно отправлен!");
        form.reset();
      } catch (error) {
        console.error("Ошибка отправки формы:", error);
        alert("Произошла ошибка при отправке. Попробуйте позже.");
      }
    });
  }

  // Optional: snap to nearest section on wheel end (minimal, relies mainly on CSS snap)

  // Fix malformed first IG video <source> if src lacks extension
  (function fixBrokenIgSource() {
    const bad = document.querySelector('.ig-strip .ig-item video source[src*="BigBuckBunny"]');
    if (bad && !/\.mp4(\?|$)/i.test(bad.getAttribute('src') || '')) {
      bad.setAttribute('src', 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      const v = bad.closest('video');
      if (v && typeof v.load === 'function') v.load();
    }
  })();

  const cardsContainer = document.querySelector('.cards');
  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
      card.style.setProperty('--opacity', 1);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--opacity', 0);
    });
  });

  // Remove global spotlight effect from the container
  cardsContainer.removeEventListener('mousemove', () => {});
  cardsContainer.removeEventListener('mouseleave', () => {});

  // Spotlight hover effect for "Контакты и пакеты"
  document.querySelectorAll('.pkg-body').forEach(pkg => {
    pkg.addEventListener('mousemove', (e) => {
      const rect = pkg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pkg.style.setProperty('--x', `${x}px`);
      pkg.style.setProperty('--y', `${y}px`);
      pkg.style.setProperty('--opacity', '1');
    });

    pkg.addEventListener('mouseleave', () => {
      pkg.style.setProperty('--opacity', '0');
    });
  });

  document.querySelector('.btn.full').addEventListener('mouseleave', (e) => {
    e.target.style.setProperty('--opacity', '0');
  });

  // Handle all in-page anchors (header + hero buttons, etc.) uniformly
  const anchorLinks = document.querySelectorAll("a[href^='#']");
  let isAnchorNav = false; // Flag to suppress auto-scroll during anchor navigation

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      const id = href.startsWith("#") ? href.substring(1) : null;
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      isAnchorNav = true;

      const offset = sections[id] !== undefined ? window.innerHeight * (sections[id] / 100) : 0;
      const top = target.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });

      // Allow time for smooth scroll to complete before re-enabling auto behavior
      setTimeout(() => (isAnchorNav = false), 1000);
    });
  });

  // Auto-scroll to sections when scrolling down
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const sectionIds = Object.keys(sections);

  window.addEventListener("scroll", () => {
    if (isAnchorNav) return; // Skip auto-scroll if triggered by an anchor navigation

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollingDown = currentScrollTop > lastScrollTop;
    lastScrollTop = currentScrollTop;

    if (!scrollingDown) return; // Disable auto-scroll when scrolling up

    const visibleSection = sectionIds.find((id) => {
      const section = document.getElementById(id);
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight * 0.5;
    });

    if (visibleSection) {
      const section = document.getElementById(visibleSection);
      const offset = window.innerHeight * (sections[visibleSection] / 100);
      const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });

  // Highlight "Кто мы" button when the section is visible
  const aboutSection = document.querySelector("#about");
  const aboutLink = document.querySelector(".header-nav a[href='#about']");

  if (aboutSection && aboutLink) {
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutLink.classList.add("active");
          } else {
            aboutLink.classList.remove("active");
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    aboutObserver.observe(aboutSection);
  }

  // Highlight header buttons based on visible sections
  const sectionsMap = {
    about: document.querySelector(".header-nav a[href='#about']"),
    services: document.querySelector(".header-nav a[href='#services']"),
    works: document.querySelector(".header-nav a[href='#works']"),
    partners: document.querySelector(".header-nav a[href='#partners']"),
    contact: document.querySelector(".header-nav a[href='#contact']"),
  };

  Object.entries(sectionsMap).forEach(([sectionId, link]) => {
    const section = document.querySelector(`#${sectionId}`);
    if (section && link) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        },
        { threshold: 0.5 } // Trigger when 50% of the section is visible
      );

      observer.observe(section);
    }
  });

  // Spotlight effect for "Наши партнеры" section
  const partnersSection = document.querySelector("#partners");

  if (partnersSection) {
    partnersSection.addEventListener("mousemove", (e) => {
      const rect = partnersSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      partnersSection.style.setProperty("--x", `${x}px`);
      partnersSection.style.setProperty("--y", `${y}px`);
      partnersSection.style.setProperty("--opacity", "1");
    });

    partnersSection.addEventListener("mouseleave", () => {
      partnersSection.style.setProperty("--opacity", "0");
    });
  }

  // Spotlight effect for hero title only
  const hero = document.querySelector("#hero");
  const heroTitle = hero ? hero.querySelector(".hero-content h1") : null;

  if (hero && heroTitle) {
    hero.addEventListener("mousemove", (e) => {
      const rect = heroTitle.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update vars only on the title node so effect applies just to it
      heroTitle.style.setProperty("--x", `${x}px`);
      heroTitle.style.setProperty("--y", `${y}px`);
      heroTitle.style.setProperty("--spot-o", "1");
    });

    hero.addEventListener("mouseleave", () => {
      heroTitle.style.setProperty("--spot-o", "0");
    });
  }
});