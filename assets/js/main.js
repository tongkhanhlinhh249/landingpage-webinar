/* LEGAL x REPUTATION — Webinar Landing Page */
(function () {
  'use strict';

  /* ── Cấu hình gửi form ──────────────────────────────────────────────
     Dữ liệu đổ về Google Sheet qua Google Apps Script (google-apps-script/Code.gs).
     (Không ghi link sheet ở đây — file này public trên website.)
     → Dán URL Web App (dạng https://script.google.com/macros/s/…/exec) vào FORM_ENDPOINT.
     Để trống → chế độ demo (chỉ hiện thông báo thành công, không lưu dữ liệu). */
  var FORM_ENDPOINT = '';

  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktopMQ = window.matchMedia('(min-width: 1024px)');

  /* ── Header: nền kính khi cuộn ── */
  var header = document.getElementById('site-header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu ── */
  var burger = document.getElementById('hamburger');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    header.classList.toggle('menu-open', open);
    if (open) {
      menu.removeAttribute('hidden');
      header.classList.add('is-scrolled');
      var first = menu.querySelector('a');
      if (first) first.focus();
    } else {
      menu.setAttribute('hidden', '');
      onScroll();
    }
  }

  if (burger && menu && header) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });
    desktopMQ.addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ── Mũi tên trên thẻ đối tượng → chọn sẵn vai trò trong form ── */
  document.querySelectorAll('.ta-arrow[data-role]').forEach(function (link) {
    link.addEventListener('click', function () {
      var roleSelect = document.getElementById('f-role');
      if (roleSelect) roleSelect.value = link.dataset.role;
    });
  });

  /* ── KV: nối dây từ đầu ngón tay AI tới thẻ "Hình ảnh doanh nghiệp" ── */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  function drawStrings() {
    var kvEl = document.getElementById('kv3d');
    var group = document.getElementById('kv-strings');
    if (!kvEl || !group || !kvEl.offsetWidth) return;
    var svg = group.ownerSVGElement;
    var screenToSvg = svg.getScreenCTM();
    if (!screenToSvg) return;
    screenToSvg = screenToSvg.inverse();
    var eyelets = kvEl.querySelectorAll('.kvp-eyelet');
    group.textContent = '';
    [1, 2, 3, 4].forEach(function (n, i) {
      var tip = document.getElementById('kv-tip-' + n);
      var eyelet = eyelets[i];
      if (!tip || !eyelet) return;
      // quy đổi đầu ngón tay → toạ độ màn hình → toạ độ viewBox (đúng ở mọi kích thước)
      var tipPt = svg.createSVGPoint();
      tipPt.x = 0; tipPt.y = parseFloat(tip.getAttribute('cy')) || 0;
      tipPt = tipPt.matrixTransform(tip.getScreenCTM()).matrixTransform(screenToSvg);
      var x1 = tipPt.x, y1 = tipPt.y;
      var r = eyelet.getBoundingClientRect();
      var pt = svg.createSVGPoint();
      pt.x = r.left + r.width / 2; pt.y = r.top + r.height / 2;
      pt = pt.matrixTransform(screenToSvg);
      var d = 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1);
      ['kv-string-glow', 'kv-string', 'kv-pulse'].forEach(function (cls) {
        var path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', cls);
        if (cls === 'kv-pulse') path.style.animationDelay = (-i * 0.55) + 's';
        group.appendChild(path);
      });
    });
  }
  if (document.getElementById('kv3d')) {
    var rig = document.querySelector('.kv-rig');
    // đo khi rig đứng yên để toạ độ chuẩn
    var measure = function () {
      if (!rig) return drawStrings();
      var prev = rig.style.animation;
      rig.style.animation = 'none';
      rig.style.transform = 'none';
      var heroVisual = document.querySelector('.hero-visual');
      var prevT = heroVisual ? heroVisual.style.transform : '';
      if (heroVisual) heroVisual.style.transform = 'none';
      drawStrings();
      rig.style.animation = prev;
      rig.style.transform = '';
      if (heroVisual) heroVisual.style.transform = prevT;
    };
    measure();
    window.addEventListener('load', measure);
    window.addEventListener('resize', measure);
  }

  /* ── Parallax nhẹ cho KV 3D (chỉ chuột, tắt khi reduced-motion) ── */
  var kv = document.getElementById('kv3d');
  var hero = document.querySelector('.hero');
  if (kv && hero && !noMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var raf = null;
    hero.addEventListener('pointermove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        kv.style.setProperty('--px', (x * -1).toFixed(3));
        kv.style.setProperty('--py', (y * -1).toFixed(3));
        raf = null;
      });
    });
    hero.addEventListener('pointerleave', function () {
      kv.style.setProperty('--px', 0);
      kv.style.setProperty('--py', 0);
    });
  }

  /* ── Scroll reveal ── */
  var reveals = document.querySelectorAll('.reveal');
  if (noMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('in'); return; }
      revealObs.observe(el);
    });
  }

  /* ── Active nav link ── */
  var navLinks = document.querySelectorAll('.nav-link');
  if ('IntersectionObserver' in window && navLinks.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'loi-ich', 'dien-gia', 'chuong-trinh'].forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) navObs.observe(sec);
    });
  }

  /* ── Sticky CTA (mobile/tablet): hiện ngay từ đầu trang, ẩn khi form hoặc footer đang hiện ── */
  var sticky = document.getElementById('sticky-cta');
  var formCol = document.getElementById('dang-ky');
  var footer = document.querySelector('.site-footer');

  if (sticky && formCol && 'IntersectionObserver' in window) {
    var visible = { form: false, footer: false };
    var stickyLink = sticky.querySelector('a');
    var updateSticky = function () {
      var show = !visible.form && !visible.footer;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', String(!show));
      if (stickyLink) stickyLink.tabIndex = show ? 0 : -1;
    };
    var stickyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target === formCol) visible.form = entry.isIntersecting;
        else if (entry.target === footer) visible.footer = entry.isIntersecting;
      });
      updateSticky();
    });
    stickyObs.observe(formCol);
    updateSticky();
    if (footer) stickyObs.observe(footer);
  }

  /* ── Registration form ── */
  var form = document.getElementById('register-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var successEl = document.getElementById('form-success');
  var submitBtn = document.getElementById('submit-btn');

  var PHONE_RE = /^(?:\+?84|0)(?:3|5|7|8|9)\d{8}$/;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Bắt buộc: Họ tên + Số điện thoại · 2 dropdown tuỳ chọn
  var fields = [
    { input: document.getElementById('f-name'),  err: document.getElementById('f-name-err'),
      test: function (v) { return v.trim().length >= 2; } },
    { input: document.getElementById('f-phone'), err: document.getElementById('f-phone-err'),
      test: function (v) { return PHONE_RE.test(v.replace(/[\s.\-()]/g, '')); } },
    // Email không bắt buộc — chỉ kiểm tra định dạng khi có nhập
    { input: document.getElementById('f-email'), err: document.getElementById('f-email-err'), optional: true,
      test: function (v) { return v.trim() === '' || EMAIL_RE.test(v.trim()); } }
  ];

  function setFieldState(field, ok) {
    field.input.setAttribute('aria-invalid', String(!ok));
    field.err.hidden = ok;
  }

  fields.forEach(function (field) {
    field.input.addEventListener('blur', function () {
      if (field.input.value.trim() !== '') setFieldState(field, field.test(field.input.value));
    });
    field.input.addEventListener('input', function () {
      if (field.input.getAttribute('aria-invalid') === 'true' && field.test(field.input.value)) setFieldState(field, true);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.hidden = true;

    var firstInvalid = null;
    fields.forEach(function (field) {
      var ok = field.test(field.input.value);
      setFieldState(field, ok);
      if (!ok && !firstInvalid) firstInvalid = field.input;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var data = new FormData(form);
    var payload = {
      ho_ten: (data.get('ho_ten') || '').trim(),
      so_dien_thoai: (data.get('so_dien_thoai') || '').trim(),
      email: (data.get('email') || '').trim(),
      vai_tro: data.get('vai_tro') || '',
      mong_muon: data.get('mong_muon') || '',
      nguon: window.location.href
    };

    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.querySelector('.btn-label').textContent = 'Đang gửi đăng ký…';

    // Apps Script không trả CORS → gửi dạng "simple request" (text/plain, no-cors).
    // Script đọc JSON từ e.postData.contents và ghi 1 dòng vào sheet.
    var request = FORM_ENDPOINT
      ? fetch(FORM_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        })
      : new Promise(function (resolve) {
          if (window.console) console.warn('[Form] FORM_ENDPOINT trống — đang chạy demo, dữ liệu không được lưu.');
          setTimeout(resolve, 900);
        });

    request
      .then(function () {
        form.hidden = true;
        successEl.hidden = false;
        successEl.focus();
      })
      .catch(function () {
        statusEl.textContent = 'Không gửi được đăng ký. Vui lòng thử lại hoặc gọi Hotline 079 2251 228.';
        statusEl.hidden = false;
      })
      .then(function () {
        submitBtn.removeAttribute('aria-busy');
        submitBtn.querySelector('.btn-label').textContent = 'Đăng ký tham dự sự kiện';
      });
  });
})();
