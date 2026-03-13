/* ══════════════════════════════════════
   Fly Consults — script.js
   순수 HTML/CSS/JS (외부 API 없음)
══════════════════════════════════════ */

(function () {
  "use strict";

  /* ── 1. Navbar: 스크롤 shadow + 활성 링크 ── */
  const navbar   = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-links a[data-section]");
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    /* shadow */
    navbar.classList.toggle("scrolled", window.scrollY > 30);

    /* active link */
    const scrollY = window.pageYOffset;
    sections.forEach(function (sec) {
      const top    = sec.offsetTop - 90;
      const bottom = top + sec.offsetHeight;
      const id     = sec.getAttribute("id");
      const link   = document.querySelector('.nav-links a[data-section="' + id + '"]');
      if (link) {
        link.classList.toggle("active", scrollY >= top && scrollY < bottom);
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── 2. 모바일 햄버거 메뉴 ── */
  const hamburger    = document.getElementById("hamburger");
  const mobileLinks  = document.getElementById("navLinks");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("open");
    mobileLinks.classList.toggle("open");
  });

  /* 링크 클릭 시 메뉴 닫기 */
  mobileLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      hamburger.classList.remove("open");
      mobileLinks.classList.remove("open");
    });
  });

  /* ── 3. Scroll Reveal (IntersectionObserver) ── */
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

  /* ── 4. 히어로 숫자 카운터 애니메이션 ── */
  var statsAnimated = false;

  function animateCounter(el, target, suffix, duration) {
    duration = duration || 1200;
    var start     = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* easeOutQuart */
      var eased = 1 - Math.pow(1 - progress, 4);
      var current = Math.round(eased * target);
      el.innerHTML = current + '<span class="suffix">' + suffix + "</span>";
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          var statEls = document.querySelectorAll(".stat-num");
          var data = [
            { val: 50,  suffix: "+" },
            { val: 3,   suffix: "년" },
            { val: 98,  suffix: "%" },
            { val: 100, suffix: "%" },
          ];
          statEls.forEach(function (el, i) {
            if (data[i]) animateCounter(el, data[i].val, data[i].suffix);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  var heroStats = document.querySelector(".hero-stats");
  if (heroStats) statsObserver.observe(heroStats);

  /* ── 5. 문의 폼 제출 ── */
  var contactForm   = document.getElementById("contactForm");
  var successMsg    = document.getElementById("formSuccess");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var btn = contactForm.querySelector(".form-submit-btn");
      btn.textContent = "전송 중...";
      btn.disabled    = true;

      /* 실제 전송 없이 UI 피드백만 제공 (보안 요구사항: 외부 API 사용 금지) */
      setTimeout(function () {
        contactForm.reset();
        btn.textContent = "문의하기";
        btn.disabled    = false;
        if (successMsg) {
          successMsg.classList.add("show");
          setTimeout(function () {
            successMsg.classList.remove("show");
          }, 4000);
        }
      }, 800);
    });
  }
})();
