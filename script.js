/* ══════════════════════════════════════
   Fly Consults — script.js
   순수 HTML/CSS/JS, 외부 API 없음
══════════════════════════════════════ */

(function () {
  "use strict";

  /* ── 1. 네비바: 스크롤 + 활성 링크 ── */
  var navbar   = document.getElementById("navbar");
  var sections = document.querySelectorAll("section[id]");

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 8);

    var scrollY = window.pageYOffset;
    sections.forEach(function (sec) {
      var top    = sec.offsetTop - 90;
      var bottom = top + sec.offsetHeight;
      var id     = sec.getAttribute("id");
      var link   = document.querySelector('.nav-links a[data-section="' + id + '"]');
      if (link) {
        link.classList.toggle("active", scrollY >= top && scrollY < bottom);
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── 2. 모바일 햄버거 메뉴 ── */
  var hamburger = document.getElementById("hamburger");
  var navLinks  = document.getElementById("navLinks");

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

  /* ── 3. 스크롤 페이드인 (IntersectionObserver) ── */
  var revealObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObs.observe(el);
  });

  /* ── 4. 숫자 카운터 애니메이션 ── */
  var statsAnimated = false;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function runCounter(el, target, suffix, duration) {
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var v = Math.round(easeOutQuart(p) * target);
      el.innerHTML = v + '<span class="stat-suffix">' + suffix + "</span>";
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          var nums = document.querySelectorAll(".stat-num");
          var data = [
            { val: 200, suffix: "+",   dur: 1200 },
            { val: 5,   suffix: "년",  dur: 800  },
            { val: 98,  suffix: "%",   dur: 1300 },
            { val: 150, suffix: "+",   dur: 1400 },
          ];
          nums.forEach(function (el, i) {
            if (data[i]) runCounter(el, data[i].val, data[i].suffix, data[i].dur);
          });
          statsObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.7 }
  );

  var heroStats = document.querySelector(".hero-stats");
  if (heroStats) statsObs.observe(heroStats);

  /* ── 5. 문의 폼 전송 (Formspree) ── */
  var form       = document.getElementById("contactForm");
  var successMsg = document.getElementById("formSuccess");
  var errorMsg   = document.getElementById("formError");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector(".form-submit-btn");
      btn.textContent = "전송 중…";
      btn.disabled = true;

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          if (successMsg) {
            successMsg.classList.add("show");
            setTimeout(function () { successMsg.classList.remove("show"); }, 5000);
          }
        } else {
          if (errorMsg) {
            errorMsg.classList.add("show");
            setTimeout(function () { errorMsg.classList.remove("show"); }, 5000);
          }
        }
      })
      .catch(function () {
        if (errorMsg) {
          errorMsg.classList.add("show");
          setTimeout(function () { errorMsg.classList.remove("show"); }, 5000);
        }
      })
      .finally(function () {
        btn.textContent = "상담 신청하기";
        btn.disabled = false;
      });
    });
  }

})();
