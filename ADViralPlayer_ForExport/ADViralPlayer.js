/**
 * ADViralPlayer — плеер на базе Plyr с единым дизайном (ADViralAgency).
 * Подключите Plyr (JS + CSS) перед этим скриптом.
 * @see README.md
 */
(function (global) {
  "use strict";

  if (typeof global.Plyr === "undefined") {
    console.warn("ADViralPlayer: Plyr не найден. Подключите plyr.polyfilled.js перед ADViralPlayer.js");
    return;
  }

  var doc = global.document;

  function init(videoElement, options) {
    options = options || {};
    var seekIndicatorId = options.seekIndicatorId || "video-seek-indicator";
    var content = videoElement.closest(".video-modal-content") || videoElement.closest(".AdviralPlayer");
    if (!content) content = videoElement.closest(".plyr") && videoElement.closest(".plyr").parentElement;
    if (!content) content = videoElement.parentElement;

    var controlsList = [
      "play-large",
      "play",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "settings",
      "airplay",
      "fullscreen"
    ];
    var isMobile = global.innerWidth <= 768;
    var isTouchOrTablet = global.innerWidth <= 1024 || (typeof doc !== "undefined" && "ontouchstart" in doc.documentElement);
    var fullscreenConfig = isMobile ? { iosNative: true } : {};

    var player = new global.Plyr(videoElement, {
      controls: controlsList,
      settings: ["quality", "speed"],
      fullscreen: fullscreenConfig,
      quality: {
        default: 720,
        options: [1080, 720, 480, 360],
        forced: true,
        onChange: function () {}
      },
      speed: {
        selected: 1,
        options: [0.5, 1, 1.25, 1.5, 2]
      },
      keyboard: { focused: true, global: false },
      autoplay: false,
      clickToPlay: !isTouchOrTablet,
      hideControls: false,
      resetOnEnd: true,
      ratio: null,
      volume: isTouchOrTablet ? 1 : 0.5
    });

    player.on("error", function (e) {
      console.error("Plyr error:", e.detail);
    });

    var menuContainer = content && content.querySelector(".plyr__menu__container");
    if (menuContainer) {
      var ensureShowHome = function () {
        if (menuContainer.hidden) {
          menuContainer.classList.remove("adviral-menu-show-home");
          return;
        }
        menuContainer.classList.add("adviral-menu-show-home");
        var h = menuContainer.querySelector("[id$=\"-home\"]");
        var q = menuContainer.querySelector("[id$=\"-quality\"]");
        var s = menuContainer.querySelector("[id$=\"-speed\"]");
        [q, s].filter(Boolean).forEach(function (p) { p.hidden = true; });
        if (h) h.hidden = false;
      };
      var menuObserver = new MutationObserver(ensureShowHome);
      menuObserver.observe(menuContainer, { attributes: true, attributeFilter: ["hidden"] });
      var settingsBtn = content && content.querySelector("[data-plyr=\"settings\"]");
      if (settingsBtn) {
        settingsBtn.addEventListener("click", function () {
          requestAnimationFrame(function () {
            requestAnimationFrame(ensureShowHome);
          });
        });
      }
      content.addEventListener("click", function (e) {
        if (e.target.closest(".plyr__control--forward") && menuContainer.contains(e.target)) {
          menuContainer.classList.remove("adviral-menu-show-home");
        }
      }, true);
      content.addEventListener("click", function (e) {
        var radio = e.target.closest(".plyr__control[role=\"menuitemradio\"]");
        if (!radio || !menuContainer.contains(radio)) return;
        e.preventDefault();
        e.stopPropagation();
        var value = radio.getAttribute("value");
        if (value === null) return;
        var panel = radio.closest("[id$=\"-quality\"], [id$=\"-speed\"]");
        var isSpeed = panel && panel.id.endsWith("-speed");
        if (isSpeed) {
          player.speed = parseFloat(value, 10);
        } else {
          player.quality = value;
        }
        radio.setAttribute("aria-checked", "true");
        var list = radio.closest("[role=\"menu\"]");
        if (list) {
          list.querySelectorAll("[role=\"menuitemradio\"]").forEach(function (el) {
            if (el !== radio) el.setAttribute("aria-checked", "false");
          });
        }
        menuContainer.classList.add("adviral-menu-show-home");
        var home = menuContainer.querySelector("[id$=\"-home\"]");
        var qPanel = menuContainer.querySelector("[id$=\"-quality\"]");
        var sPanel = menuContainer.querySelector("[id$=\"-speed\"]");
        [qPanel, sPanel].filter(Boolean).forEach(function (p) { p.hidden = true; });
        if (home) home.hidden = false;
        var valueSpans = home && home.querySelectorAll(".plyr__control--forward .plyr__menu__value");
        if (valueSpans && valueSpans.length >= 2) {
          if (isSpeed) valueSpans[1].textContent = value === "1" ? "Normal" : value + "×";
          else valueSpans[0].textContent = value + "p";
        }
      }, true);
    }

    if (isMobile) {
      player.on("enterfullscreen", function () {
        if (global.screen.orientation && typeof global.screen.orientation.unlock === "function") {
          global.screen.orientation.unlock().catch(function () {});
        }
      });
    }

    if (content && global.MutationObserver) {
      content.setAttribute("data-adviral-click-bound", "1");
    }

    if (isMobile && content) {
      content.addEventListener("click", function (e) {
        if (!e.target.closest("[data-plyr=\"fullscreen\"]")) return;
        if (typeof videoElement.webkitEnterFullscreen === "function") {
          e.preventDefault();
          e.stopPropagation();
          try {
            videoElement.webkitEnterFullscreen();
          } catch (err) {
            if (player && player.fullscreen) player.fullscreen.enter();
          }
        }
      }, true);
      videoElement.addEventListener("webkitendfullscreen", function () {
        if (player && player.fullscreen && player.fullscreen.active) player.fullscreen.exit();
      });
    }

    function setupAdviralControlsIdle(container) {
      if (!container || container.hasAttribute("data-adviral-idle-bound")) return;
      container.setAttribute("data-adviral-idle-bound", "1");
      var idleTimeout = null;
      var IDLE_MS = 1000;
      function scheduleHide() {
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(function () {
          container.classList.add("adviral-controls-idle");
        }, IDLE_MS);
      }
      function showControls() {
        container.classList.remove("adviral-controls-idle");
        scheduleHide();
      }
      function hideControls() {
        clearTimeout(idleTimeout);
        container.classList.add("adviral-controls-idle");
      }
      ["pointermove", "pointerdown", "touchstart", "click", "keydown"].forEach(function (ev) {
        container.addEventListener(ev, showControls, { passive: true });
      });
      container._adviralShowControls = showControls;

      var hasHover = global.matchMedia("(hover: hover)").matches;
      if (!hasHover) {
        var lastTapTime = 0;
        var toggleTimeout = null;
        function isVideoAreaTap(target) {
          if (!target || !container.contains(target)) return false;
          if (target.closest(".plyr__controls") || target.closest(".plyr__control--overlaid") || target.closest(".video-modal-close") || target.closest(".modal-arrow")) return false;
          return true;
        }
        container.addEventListener("touchend", function (e) {
          if (!isVideoAreaTap(e.target)) return;
          var now = Date.now();
          if (now - lastTapTime < 300) {
            clearTimeout(toggleTimeout);
            lastTapTime = 0;
            return;
          }
          lastTapTime = now;
          clearTimeout(toggleTimeout);
          toggleTimeout = setTimeout(function () {
            toggleTimeout = null;
            if (container.classList.contains("adviral-controls-idle")) {
              showControls();
            } else {
              hideControls();
            }
          }, 300);
        }, { capture: true, passive: true });
        container.addEventListener("click", function (e) {
          if (!isVideoAreaTap(e.target)) return;
          if (toggleTimeout !== null) {
            clearTimeout(toggleTimeout);
            toggleTimeout = null;
            e.preventDefault();
            e.stopPropagation();
          }
        }, { capture: true });
      }
    }
    if (content) setupAdviralControlsIdle(content);

    function applyAdviralControlsLayout() {
      if (!content || !player) return;
      var controls = content.querySelector(".plyr__controls");
      if (!controls) return;

      var timeCurrent = content.querySelector(".plyr__time--current");
      var timeDuration = content.querySelector(".plyr__time--duration");
      if (timeCurrent && timeDuration && !content.querySelector(".plyr__time-group")) {
        var timeGroup = doc.createElement("div");
        timeGroup.className = "plyr__time-group";
        var separator = doc.createElement("span");
        separator.className = "plyr__time plyr__time-separator";
        separator.setAttribute("aria-hidden", "true");
        separator.textContent = "/";
        controls.insertBefore(timeGroup, controls.firstChild);
        timeGroup.appendChild(timeCurrent);
        timeGroup.appendChild(separator);
        timeGroup.appendChild(timeDuration);
      }

      function normalizeTimeDisplay() {
        var durationEl = content.querySelector(".plyr__time--duration");
        if (durationEl && /^\s*\/\s*/.test(durationEl.textContent)) {
          durationEl.textContent = durationEl.textContent.replace(/^\s*\/\s*/, "").trim();
        }
        var sep = content.querySelector(".plyr__time-separator");
        if (sep && sep.textContent !== "/") {
          sep.textContent = "/";
        }
      }
      if (!player._adviralNormalizeBound) {
        player.on("timeupdate", normalizeTimeDisplay);
        player.on("loadedmetadata", normalizeTimeDisplay);
        player._adviralNormalizeBound = true;
      }
      normalizeTimeDisplay();

      if (content) {
        content.querySelectorAll(".plyr__menu__container .plyr__control--back").forEach(function (btn) {
          btn.remove();
        });
      }

      var seekInput = content.querySelector(".plyr__progress input[data-plyr=\"seek\"]");
      if (seekInput && !seekInput.dataset.adviralSeekFixed) {
        seekInput.dataset.adviralSeekFixed = "1";
        function fixSeekPosition() {
          var inp = content.querySelector(".plyr__progress input[data-plyr=\"seek\"]");
          if (inp) {
            inp.style.setProperty("left", "0", "important");
            inp.style.setProperty("right", "0", "important");
            inp.style.setProperty("top", "50%", "important");
            inp.style.setProperty("transform", "translateY(-50%)", "important");
          }
        }
        fixSeekPosition();
        var mo = new MutationObserver(fixSeekPosition);
        mo.observe(seekInput, { attributes: true, attributeFilter: ["style"] });
        if (!player._adviralSeekBound) {
          player.on("timeupdate", fixSeekPosition);
          player._adviralSeekBound = true;
        }
      }

      if (!content.querySelector(".adviral-controls-right")) {
        var volume = controls.querySelector(".plyr__controls__item.plyr__volume") || controls.querySelector(".plyr__volume");
        var menu = controls.querySelector(".plyr__menu");
        var fullscreenBtn = controls.querySelector(".plyr__control[data-plyr=\"fullscreen\"]") || controls.querySelector("button[data-plyr=\"fullscreen\"]");
        if (volume && menu && fullscreenBtn) {
          var rightGroup = doc.createElement("div");
          rightGroup.className = "adviral-controls-right";
          controls.insertBefore(rightGroup, volume);
          rightGroup.appendChild(volume);
          rightGroup.appendChild(menu);
          rightGroup.appendChild(fullscreenBtn);
        }
      }

      if (global.innerWidth <= 1024 || ("ontouchstart" in doc.documentElement)) {
        [].slice.call(content.querySelectorAll(".plyr__volume, .plyr__controls__item.plyr__volume")).forEach(function (el) {
          el.style.setProperty("display", "none", "important");
        });
      }
    }

    player.on("ready", function () {
      applyAdviralControlsLayout();
      if (global.innerWidth <= 768) {
        setupMobileGestures();
      }
    });

    function setupMobileGestures() {
      var videoWrapper = content || videoElement.closest(".video-modal-content") || videoElement.closest(".AdviralPlayer");
      var seekIndicator = seekIndicatorId ? doc.getElementById(seekIndicatorId) : null;
      if (!videoWrapper) return;
      var lastTapTime = 0;
      var SEEK_SEC = 5;
      function showSeekIndicatorDir(direction) {
        if (!seekIndicator) return;
        seekIndicator.textContent = direction === "forward" ? "+5 sec" : "-5 sec";
        seekIndicator.classList.remove("forward", "backward");
        seekIndicator.classList.add(direction === "forward" ? "forward" : "backward");
        seekIndicator.classList.add("show");
        clearTimeout(window._adviralSeekIndicatorTimeout);
        window._adviralSeekIndicatorTimeout = setTimeout(function () {
          seekIndicator.classList.remove("show");
        }, 500);
      }
      videoWrapper.addEventListener("touchend", function (e) {
        var now = Date.now();
        var tapLength = now - lastTapTime;
        if (tapLength < 300 && tapLength > 0) {
          var touch = e.changedTouches && e.changedTouches[0];
          if (!touch) { lastTapTime = 0; return; }
          var rect = videoWrapper.getBoundingClientRect();
          var x = touch.clientX - rect.left;
          var screenWidth = rect.width;
          if (player && typeof player.currentTime !== "undefined") {
            if (x < screenWidth / 2) {
              player.rewind(SEEK_SEC);
              showSeekIndicatorDir("backward");
            } else {
              player.forward(SEEK_SEC);
              showSeekIndicatorDir("forward");
            }
          }
          lastTapTime = 0;
        } else {
          lastTapTime = now;
        }
      }, { passive: true });
    }

    return player;
  }

  global.ADViralPlayer = { init: init };
})(typeof window !== "undefined" ? window : this);
