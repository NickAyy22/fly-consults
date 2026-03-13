/* ══════════════════════════════════════
   Fly Consults — script.js
   Pure HTML/CSS/JS, no external APIs
══════════════════════════════════════ */

(function () {
  "use strict";

  /* ── 1. Navbar: scroll shadow + active link ── */
  var navbar   = document.getElementById("navbar");
  var sections = document.querySelectorAll("section[id]");

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 10);

    var scrollY = window.pageYOffset;
    sections.forEach(function (sec) {
      var top    = sec.offsetTop - 80;
      var bottom = top + sec.offsetHeight;
      var id     = sec.getAttribute("id");
      var link   = document.querySelector('.nav-links a[data-section="' + id + '"]');
      if (link) {
        link.classList.toggle("active", scrollY >= top && scrollY < bottom);
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── 2. Mobile hamburger menu ── */
  var hamburger  = document.getElementById("hamburger");
  var navLinks   = document.getElementById("navLinks");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  /* ── 3. Scroll reveal ── */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── 4. Hero counter animation ── */
  var statsAnimated = false;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el, target, suffix, duration) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current  = Math.round(easeOutQuart(progress) * target);
      el.innerHTML = current + '<span class="stat-suffix">' + suffix + "</span>";
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          var statNums = document.querySelectorAll(".stat-num");
          var data = [
            { val: 50,  suffix: "+",  dur: 1000 },
            { val: 3,   suffix: " Yrs", dur: 700  },
            { val: 98,  suffix: "%",  dur: 1200 },
            { val: 100, suffix: "%",  dur: 1400 },
          ];
          statNums.forEach(function (el, i) {
            if (data[i]) animateCounter(el, data[i].val, data[i].suffix, data[i].dur);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.7 }
  );

  var heroStats = document.querySelector(".hero-stats");
  if (heroStats) statsObserver.observe(heroStats);

  /* ── 5. Contact form feedback ── */
  var form       = document.getElementById("contactForm");
  var successMsg = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var btn = form.querySelector(".form-submit-btn");
      btn.textContent = "Sending…";
      btn.disabled    = true;

      /* No external API — UI feedback only */
      setTimeout(function () {
        form.reset();
        btn.textContent = "Send Message";
        btn.disabled    = false;
        if (successMsg) {
          successMsg.classList.add("show");
          setTimeout(function () {
            successMsg.classList.remove("show");
          }, 4000);
        }
      }, 900);
    });
  }

})();
