/* =========================================================
   EGO — Animations Layer (Live + Advanced)
   Cursor animations intentionally omitted.
   Horizontal Pin removed.
   Includes: Lookbook Shop Bars + Back to Top
   ========================================================= */
(() => {
  'use strict';

  const reduce  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* =========================================================
     1. TEXT REVEAL — LIVE
     ========================================================= */
  const REVEAL_TARGETS = [
    '.hero-copy h1',
    '.page-title',
    '.section-head h2',
    '.newsletter-title',
    '.world-hero-title',
    '.notfound-title',
    '.manifesto-word'
  ];

  const textIO = !reduce
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle('is-revealed', e.isIntersecting);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    : null;

  function applyTextReveal(root = document) {
    if (reduce || !textIO) return;
    REVEAL_TARGETS.forEach((sel) => {
      $$(sel, root).forEach((el) => {
        if (el.dataset.revealApplied) return;
        if (el.querySelector('.reveal-mask')) {
          el.dataset.revealApplied = '1';
          textIO.observe(el.querySelector('.reveal-mask'));
          return;
        }
        el.dataset.revealApplied = '1';
        const inner = el.innerHTML;
        el.innerHTML = `<span class="reveal-mask"><span>${inner}</span></span>`;
        textIO.observe(el.querySelector('.reveal-mask'));
      });
    });
  }

  /* =========================================================
     2. SCROLL REVEAL — LIVE
     ========================================================= */
  const SCROLL_TARGETS = [
    '.product-card',
    '.lookbook-card',
    '.lookbook-strip-card',
    '.category-tile',
    '.featured-section .section-head',
    '.categories-section .section-head',
    '.lookbook-preview .section-head',
    '.review-card',
    '.reviews-score',
    '.contact-card',
    '.help-card',
    '.help-table-block',
    '.faq-item',
    '.world-section',
    '.checkout-summary',
    '.look-piece',
    '.look-hero-info',
    '.look-hero-image',
    '.pdp-info',
    '.pdp-gallery',
    '.newsletter-inner > *',
    '.footer-top > *',
    '.pdp-details'
  ];

  const scrollIO = !reduce
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle('is-visible', e.isIntersecting);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' })
    : null;

  function applyScrollReveal(root = document) {
    if (reduce || !scrollIO) return;
    SCROLL_TARGETS.forEach((sel) => {
      $$(sel, root).forEach((el) => {
        if (el.dataset.scrollApplied) return;
        el.dataset.scrollApplied = '1';
        el.classList.add('reveal-on-scroll');
        scrollIO.observe(el);
      });
    });

    $$('.product-grid, .lookbook-grid, .recently-viewed-strip, .category-tiles', root)
      .forEach((grid) => {
        [...grid.children].forEach((child, i) => {
          child.style.setProperty('--i', i % 8);
          child.setAttribute('data-stagger', '');
        });
      });
  }

  /* =========================================================
     3. MARQUEE
     ========================================================= */
  function injectMarquee() {
    if ($('.marquee')) return;
    const manifesto  = $('.manifesto');
    const newsletter = $('.newsletter');
    if (!manifesto || !newsletter) return;

    const items = [
      { text: 'DON\u2019T FIT IN', outline: false },
      { text: 'WEAR YOUR EGO',     outline: true  },
      { text: 'MADE IN EGYPT',     outline: false },
      { text: 'NEW DROP 01',       outline: true  },
      { text: 'LIMITED RUNS',      outline: false },
      { text: 'STREETWEAR',        outline: true  }
    ];

    const build = () => items.map((it) => {
      const t = it.outline ? `<em class="marquee__outline">${it.text}</em>` : it.text;
      return `<span>${t}<span class="marquee__dot"></span></span>`;
    }).join('');

    const el = document.createElement('div');
    el.className = 'marquee';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<div class="marquee__track">${build()}${build()}</div>`;
    newsletter.parentNode.insertBefore(el, newsletter);
  }

  /* =========================================================
     4. MAGNETIC BUTTONS
     ========================================================= */
  const MAGNET_SEL = '.primary-cta, .modal-cta, .look-buy-all, .pdp-add, .newsletter-cta, .pdp-sticky-btn';
  const MAGNET_STRENGTH = 0.18;
  const MAGNET_MAX = 10;

  function bindMagnetic(root = document) {
    if (reduce || isTouch) return;
    $$(MAGNET_SEL, root).forEach((btn) => {
      if (btn.dataset.magnetized) return;
      btn.dataset.magnetized = '1';

      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        let x = (e.clientX - r.left - r.width / 2) * MAGNET_STRENGTH;
        let y = (e.clientY - r.top - r.height / 2) * MAGNET_STRENGTH;
        x = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, x));
        y = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, y));
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* =========================================================
     5. GLITCH — hero headline
     ========================================================= */
  function applyGlitch() {
    if (reduce) return;
    const h1 = $('.hero-copy h1');
    if (!h1 || h1.dataset.glitchBound) return;
    h1.dataset.glitchBound = '1';
    h1.classList.add('glitch');

    const fire = () => {
      if (document.hidden) return;
      const route = document.querySelector('.route[data-route="home"]');
      if (!route || route.hidden) return;
      if (!h1.isConnected) return;
      h1.classList.add('is-glitching');
      setTimeout(() => h1.classList.remove('is-glitching'), 520);
    };

    fire();
    setInterval(fire, 6500);
  }

  /* =========================================================
     6. CHARACTER WIPE
     ========================================================= */
  function applyCharacterWipe() {
    if (reduce) return;
    const stage = document.getElementById('characterStage');
    const track = document.getElementById('characterTrack');
    if (!stage || !track) return;
    if (stage.dataset.wipeBound) return;
    stage.dataset.wipeBound = '1';

    let wipe = stage.querySelector('.character-wipe');
    if (!wipe) {
      wipe = document.createElement('div');
      wipe.className = 'character-wipe';
      stage.appendChild(wipe);
    }

    const mo = new MutationObserver((mutations) => {
      let added = false;
      mutations.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1 && n.classList && n.classList.contains('character-slide')) {
            added = true;
          }
        });
      });
      if (!added) return;

      wipe.classList.remove('is-wiping');
      void wipe.offsetWidth;
      wipe.classList.add('is-wiping');
      setTimeout(() => wipe.classList.remove('is-wiping'), 650);
    });

    mo.observe(track, { childList: true });
  }

  /* =========================================================
     7. ODOMETER NUMBER ROLL
     ========================================================= */
  function odometer(el, newValue, duration = 420) {
    if (!el) return;
    const oldText = el.textContent || '';
    const targetStr = String(newValue);
    const len = Math.max(oldText.length, targetStr.length);
    const oldStr = oldText.padStart(len, '0');
    const newStr = targetStr.padStart(len, '0');

    if (oldStr === newStr || reduce) {
      el.textContent = newStr;
      return;
    }

    el.classList.add('odometer');
    el.textContent = '';

    for (let i = 0; i < len; i++) {
      const oldD = oldStr[i];
      const newD = newStr[i];

      if (/\D/.test(oldD) && /\D/.test(newD)) {
        const sep = document.createElement('span');
        sep.className = 'odometer-sep';
        sep.textContent = newD;
        el.appendChild(sep);
        continue;
      }

      const col = document.createElement('span');
      col.className = 'odometer-col';

      if (oldD === newD) {
        col.classList.add('is-static');
        col.textContent = newD;
      } else {
        col.classList.add('is-rolling');
        col.innerHTML =
          `<span class="odometer-digit">${oldD}</span>` +
          `<span class="odometer-digit">${newD}</span>`;
      }

      el.appendChild(col);
    }

    setTimeout(() => {
      el.classList.remove('odometer');
      el.textContent = newStr;
    }, duration + 60);
  }

  function bindCounters() {
    const ids = ['bagCount', 'wishlistCount', 'mobileBagCount', 'mobileWishlistCount'];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el || el.dataset.counterBound) return;
      el.dataset.counterBound = '1';

      const mo = new MutationObserver(() => {
        const next = parseInt(el.textContent, 10);
        if (isNaN(next)) return;
        const cur = parseInt(el.dataset.lastVal || '0', 10);
        if (cur === next) return;
        el.dataset.lastVal = String(next);
        if (!el.classList.contains('odometer')) odometer(el, next);
      });
      mo.observe(el, { childList: true, characterData: true, subtree: true });

      el.dataset.lastVal = String(parseInt(el.textContent, 10) || 0);
    });

    const metaNumber = document.getElementById('metaNumber');
    if (metaNumber && !metaNumber.dataset.odoBound) {
      metaNumber.dataset.odoBound = '1';
      const mo = new MutationObserver(() => {
        const cur = metaNumber.textContent || '';
        const next = parseInt(cur.replace(/^0+/, ''), 10);
        if (isNaN(next)) return;
        const prev = parseInt(metaNumber.dataset.lastVal || '0', 10);
        if (prev === next) return;
        metaNumber.dataset.lastVal = String(next);

        const totalPart = cur.split('/')[1];
        const justNumber = metaNumber.querySelector('.odometer');
        if (!justNumber) {
          metaNumber.innerHTML =
            `<span class="ego-meta-num"></span>${totalPart ? ' /' + totalPart : ''}`;
        }
        const numEl = metaNumber.querySelector('.ego-meta-num');
        if (numEl) odometer(numEl, next);
      });
      mo.observe(metaNumber, { childList: true, characterData: true, subtree: true });
    }

    const progressCurrent = document.getElementById('progressCurrent');
    if (progressCurrent && !progressCurrent.dataset.odoBound) {
      progressCurrent.dataset.odoBound = '1';
      const mo = new MutationObserver(() => {
        const next = parseInt(progressCurrent.textContent, 10);
        if (isNaN(next)) return;
        const prev = parseInt(progressCurrent.dataset.lastVal || '0', 10);
        if (prev === next) return;
        progressCurrent.dataset.lastVal = String(next);
        if (!progressCurrent.classList.contains('odometer')) odometer(progressCurrent, next);
      });
      mo.observe(progressCurrent, { childList: true, characterData: true, subtree: true });
      progressCurrent.dataset.lastVal = String(parseInt(progressCurrent.textContent, 10) || 1);
    }
  }

  /* =========================================================
     8. PARALLAX ZOOM
     ========================================================= */
  function bindParallaxZoom(root = document) {
    if (reduce || isTouch) return;
    $$('.product-card, .lookbook-card', root).forEach((card) => {
      if (card.dataset.parallaxBound) return;
      card.dataset.parallaxBound = '1';
      const img = card.querySelector('.img-wrap img, img');
      if (!img) return;

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        img.style.transform = `scale(1.08) translate(${x * 14}px, ${y * 14}px)`;
      });
      card.addEventListener('mouseleave', () => {
        img.style.transform = '';
      });
    });
  }

  /* =========================================================
     9. HERO BOOT
     ========================================================= */
  let lastBootAt = 0;
  const BOOT_COOLDOWN = 3000;

  function heroBoot(force = false) {
    if (reduce) return;
    const home = document.querySelector('.route[data-route="home"]');
    if (!home || home.hidden) return;
    if (!document.getElementById('characterStage')) return;

    const now = Date.now();
    if (!force && now - lastBootAt < BOOT_COOLDOWN) return;
    lastBootAt = now;

    document.body.classList.remove('is-booting');
    void document.body.offsetWidth;
    document.body.classList.add('is-booting');
    setTimeout(() => document.body.classList.remove('is-booting'), 3000);
  }

  /* =========================================================
     10. TEXT SCRAMBLE
     ========================================================= */
  const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#@$%&';
  const scrambleCooldowns = new WeakMap();
  const SCRAMBLE_COOLDOWN = 4000;

  function scramble(el, duration = 900) {
    if (reduce || !el) return;
    const now = Date.now();
    const last = scrambleCooldowns.get(el) || 0;
    if (now - last < SCRAMBLE_COOLDOWN) return;
    scrambleCooldowns.set(el, now);

    const original = el.dataset.scrambleText || el.textContent;
    el.dataset.scrambleText = original;
    const len = original.length;
    const total = Math.max(18, Math.round(duration / 30));
    let frame = 0;
    el.classList.add('scramble');

    const tick = () => {
      const p = frame / total;
      const revealed = Math.floor(p * len);
      let out = '';
      for (let i = 0; i < len; i++) {
        const c = original[i];
        if (c === ' ' || c === '\n') { out += c; continue; }
        out += (i < revealed)
          ? c
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = out;
      frame++;
      if (frame < total) requestAnimationFrame(tick);
      else el.textContent = original;
    };
    tick();
  }

  const scrambleIO = !reduce
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) scramble(e.target, 850);
        });
      }, { threshold: 0.4 })
    : null;

  function bindScramble(root = document) {
    if (reduce || !scrambleIO) return;
    $$('.section-kicker, .pdp-tagline', root).forEach((el) => {
      if (el.dataset.scrambleBound) return;
      el.dataset.scrambleBound = '1';
      scrambleIO.observe(el);
    });
  }

  /* =========================================================
     11. 3D TILT
     ========================================================= */
  function bindTilt(root = document) {
    if (reduce || isTouch) return;
    const MAX = 7;
    $$('.lookbook-card', root).forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top)  / r.height;
        const rx = (y - 0.5) * -MAX;
        const ry = (x - 0.5) *  MAX;
        card.classList.add('is-tilting');
        card.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

  /* =========================================================
     12. CART FLY-TO-BAG
     ========================================================= */
  function flyToBag(src, fromEl) {
    if (reduce || !src) return;
    const bag = document.getElementById('bagBtn') || document.getElementById('mobileBagBtn');
    if (!bag) return;

    const bagRect = bag.getBoundingClientRect();
    const rect = fromEl?.getBoundingClientRect() || {
      left: window.innerWidth / 2 - 40,
      top: window.innerHeight / 2 - 50,
      width: 80,
      height: 100
    };

    const img = document.createElement('img');
    img.src = src;
    img.className = 'ego-fly-img';
    img.style.left = rect.left + 'px';
    img.style.top  = rect.top  + 'px';
    img.style.width  = Math.min(rect.width,  120) + 'px';
    img.style.height = Math.min(rect.height, 150) + 'px';
    img.style.opacity = '1';
    img.style.transition = 'all 0.85s cubic-bezier(0.5, -0.4, 0.35, 1.15)';
    document.body.appendChild(img);

    void img.offsetWidth;

    const tx = bagRect.left + bagRect.width / 2;
    const ty = bagRect.top  + bagRect.height / 2;

    requestAnimationFrame(() => {
      img.style.left = (tx - 16) + 'px';
      img.style.top  = (ty - 20) + 'px';
      img.style.width  = '32px';
      img.style.height = '40px';
      img.style.opacity = '0.15';
      img.style.transform = 'rotate(-15deg) scale(0.9)';
    });

    setTimeout(() => {
      img.remove();
      cartShake(bag);
    }, 900);
  }

  function bindFlyToBag() {
    if (reduce) return;
    if (document.body.dataset.flyBound) return;
    document.body.dataset.flyBound = '1';

    document.addEventListener('click', (e) => {
      const quick = e.target.closest('[data-quick-add]');
      if (quick) {
        const card = quick.closest('.product-card, .bag-cross-item, .look-piece');
        const img = card?.querySelector('img');
        if (img) flyToBag(img.currentSrc || img.src, img);
        return;
      }

      const pdpAdd = e.target.closest('#pdpAdd, #pdpStickyAdd');
      if (pdpAdd) {
        const img = document.querySelector('.pdp-main-image img') ||
                    document.querySelector('.pdp-thumb img');
        if (img) flyToBag(img.currentSrc || img.src, img);
        return;
      }

      if (e.target.closest('#confirmAddToBag')) {
        const img = document.getElementById('sizeModalImg');
        if (img) flyToBag(img.currentSrc || img.src, img);
        return;
      }

      if (e.target.closest('#buyFullLook')) {
        const img = document.querySelector('.look-hero-image img');
        if (img) flyToBag(img.currentSrc || img.src, img);
      }
    }, true);
  }

  /* =========================================================
     13. SCROLL PROGRESS BAR
     ========================================================= */
  function mountScrollProgress() {
    if (reduce || $('.ego-scroll-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'ego-scroll-progress';
    document.body.appendChild(bar);

    let raf = null;
    const update = () => {
      raf = null;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      bar.style.width = p + '%';
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* =========================================================
     14. HERO PARALLAX
     ========================================================= */
  function mountHeroParallax() {
    if (reduce) return;
    const hero = $('.hero');
    if (!hero) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const y = window.scrollY;
        const h = window.innerHeight;
        if (y > h) return;
        const p = y / h;
        const char = document.querySelector('.character-track');
        if (char) char.style.transform = `translateY(${p * 40}px)`;
        // NOTE: hero-copy parallax removed — it created a stacking
        // context that pushed the "SHOP THIS LOOK" CTA below the
        // character stage. Character parallax alone is enough.
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* =========================================================
     15. ROUTE TRANSITION CURTAIN
     ========================================================= */
  let curtainEl = null;
  let curtainPlaying = false;

   function mountCurtain() {
    if (curtainEl) return;
    curtainEl = document.createElement('div');
    curtainEl.className = 'ego-curtain';
    curtainEl.setAttribute('aria-hidden', 'true');
    curtainEl.innerHTML = `
      <div class="ego-curtain__label" aria-hidden="true">
        <span class="curtain-small">MADE BY</span>
        <span class="curtain-big">KARAM</span>
      </div>
    `;
    document.body.appendChild(curtainEl);
  }

    function playCurtain(onMidpoint) {
    if (reduce || !curtainEl || curtainPlaying) return;
    curtainPlaying = true;

    curtainEl.classList.remove('is-opening', 'is-resetting');
    void curtainEl.offsetWidth;
    curtainEl.classList.add('is-active');

    // ⬆️ Hold time increased from 420 → 700ms
    //    So the "MADE BY KARAM" label is readable.
    setTimeout(() => {
      if (typeof onMidpoint === 'function') onMidpoint();
      curtainEl.classList.remove('is-active');
      curtainEl.classList.add('is-opening');

      setTimeout(() => {
        curtainEl.classList.remove('is-opening');
        curtainEl.classList.add('is-resetting');
        void curtainEl.offsetWidth;
        curtainEl.classList.remove('is-resetting');
        curtainPlaying = false;
      }, 550);
    }, 700);
  }

   function bindCurtain() {
    if (reduce) return;

    document.addEventListener('click', (e) => {
      if (curtainPlaying) { e.preventDefault(); return; }

      // ⬇️ Skip if the click started inside a BUTTON that lives inside a link
      // (heart, quick-add, remove, qty, etc.)
      if (e.target.closest('button')) return;

      // ⬇️ Skip if the click started inside an interactive control
      if (e.target.closest('[data-wishlist-toggle]')) return;
      if (e.target.closest('[data-quick-add]')) return;
      if (e.target.closest('[data-remove]')) return;
      if (e.target.closest('[data-qty]')) return;
      if (e.target.closest('[data-move-to-bag]')) return;
      if (e.target.closest('[data-unwish]')) return;

      const link = e.target.closest('a[href^="#/"]');
      if (!link) return;
      if (link.target === '_blank') return;
      const href = link.getAttribute('href');
      if (!href || href === location.hash) return;

      e.preventDefault();
      playCurtain(() => {
        location.hash = href;
      });
    }, true);
  }
  /* =========================================================
     16. IMAGE CLIP-PATH REVEAL
     ========================================================= */
  const clipIO = !reduce
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle('is-clipped-in', e.isIntersecting);
        });
      }, { threshold: 0.15 })
    : null;

  function bindClipReveal(root = document) {
    if (reduce || !clipIO) return;
    $$('.pc-img-wrap, .lbc-img-wrap, .lp-img-wrap, .pdp-img-wrap, .look-img-wrap', root)
      .forEach((el) => {
        if (el.dataset.clipBound) return;
        el.dataset.clipBound = '1';
        el.classList.add('reveal-clip');
        clipIO.observe(el);
      });
  }

  /* =========================================================
     17. SCROLL-LINKED BACKGROUND
     ========================================================= */
  function mountScrollBg() {
    if (reduce) return;
    if ($('.ego-scroll-bg')) return;
    const layer = document.createElement('div');
    layer.className = 'ego-scroll-bg';
    document.body.appendChild(layer);

    let raf = null;
    const update = () => {
      raf = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      layer.style.setProperty('--bgx', p.toFixed(3));
      layer.style.setProperty('--bgy', p.toFixed(3));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  /* =========================================================
     18. LETTER-BY-LETTER SPLIT REVEAL
     ========================================================= */
  const SPLIT_TARGETS = [
    '.page-title',
    '.section-head h2',
    '.newsletter-title',
    '.world-hero-title',
    '.notfound-title'
  ];

  function splitLetters(el) {
    const original = el.innerHTML;
    if (!original || el.querySelector('.letter-split')) return;

    const temp = document.createElement('div');
    temp.innerHTML = original;

    const out = document.createElement('span');
    out.className = 'letter-split';

    let idx = 0;

    const walk = (node, parent) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          const words = child.textContent.split(/(\s+)/);
          words.forEach((word) => {
            if (!word) return;
            if (/^\s+$/.test(word)) {
              const sp = document.createElement('span');
              sp.className = 'ls-space';
              sp.innerHTML = '&nbsp;';
              parent.appendChild(sp);
              idx++;
              return;
            }
            const wordWrap = document.createElement('span');
            wordWrap.className = 'ls-word';
            [...word].forEach((ch) => {
              const c = document.createElement('span');
              c.className = 'ls-char';
              c.style.setProperty('--i', idx++);
              c.textContent = ch;
              wordWrap.appendChild(c);
            });
            parent.appendChild(wordWrap);
          });
        } else if (child.nodeType === 1) {
          const clone = document.createElement('span');
          if (child.className) clone.className = child.className;
          if (child.classList && child.classList.contains('lime')) {
            clone.classList.add('lime');
          }
          parent.appendChild(clone);
          walk(child, clone);
        }
      });
    };

    walk(temp, out);
    el.innerHTML = '';
    el.appendChild(out);
  }

  const splitIO = !reduce
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle('is-revealed', e.isIntersecting);
        });
      }, { threshold: 0.15 })
    : null;

  function applyLetterSplit(root = document) {
    if (reduce || !splitIO) return;
    SPLIT_TARGETS.forEach((sel) => {
      $$(sel, root).forEach((el) => {
        if (el.dataset.splitApplied) return;
        el.dataset.splitApplied = '1';
        splitLetters(el);
        const split = el.querySelector('.letter-split');
        if (split) splitIO.observe(split);
      });
    });
  }

  /* =========================================================
     19. WORD ROTATOR
     ========================================================= */
  const ROTATOR_WORDS = ['STREETWEAR', 'OVERSIZED FIT', 'MADE IN EGYPT', 'LIMITED RUNS'];

  function mountWordRotator() {
    if (reduce) return;
    const heroCopy = $('.route[data-route="home"] .hero-copy');
    if (!heroCopy) return;
    if (heroCopy.querySelector('.word-rotator')) return;

    const rotator = document.createElement('div');
    rotator.className = 'word-rotator';
    rotator.setAttribute('aria-live', 'polite');
    rotator.innerHTML = ROTATOR_WORDS.map((w, i) =>
      `<span class="rotator-word ${i === 0 ? 'is-active' : ''}">${w}</span>`
    ).join('');

    const eyebrow = heroCopy.querySelector('.eyebrow');
    if (eyebrow && eyebrow.nextSibling) {
      heroCopy.insertBefore(rotator, eyebrow.nextSibling);
    } else {
      heroCopy.appendChild(rotator);
    }

    let idx = 0;
    const words = rotator.querySelectorAll('.rotator-word');

    setInterval(() => {
      const route = document.querySelector('.route[data-route="home"]');
      if (!route || route.hidden) return;

      const current = words[idx];
      const next = words[(idx + 1) % words.length];

      current.classList.remove('is-active');
      current.classList.add('is-leaving');
      setTimeout(() => current.classList.remove('is-leaving'), 700);

      next.classList.add('is-active');
      idx = (idx + 1) % words.length;
    }, 3200);
  }

  /* =========================================================
     20. WISHLIST HEART BURST
     ========================================================= */
  function heartBurst(x, y) {
    if (reduce) return;
    const count = 10;

    const ring = document.createElement('div');
    ring.className = 'heart-burst-ring';
    ring.style.left = (x - 15) + 'px';
    ring.style.top  = (y - 15) + 'px';
    document.body.appendChild(ring);
    ring.animate(
      [
        { transform: 'scale(0.4)', opacity: 1 },
        { transform: 'scale(2.2)', opacity: 0 }
      ],
      { duration: 620, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    ).onfinish = () => ring.remove();

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'heart-burst-particle';
      p.style.left = (x - 4) + 'px';
      p.style.top  = (y - 4) + 'px';
      document.body.appendChild(p);

      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const dist  = 40 + Math.random() * 36;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const scale = 0.4 + Math.random() * 0.5;

      p.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0 }
        ],
        { duration: 720 + Math.random() * 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      ).onfinish = () => p.remove();
    }
  }

  function bindHeartBurst() {
    if (reduce) return;
    if (document.body.dataset.heartBurst) return;
    document.body.dataset.heartBurst = '1';

    document.addEventListener('click', (e) => {
      const heart = e.target.closest('[data-wishlist-toggle], #pdpWishlist');
      if (!heart) return;
      const wasSaved = heart.getAttribute('aria-pressed') === 'true';
      if (wasSaved) return;

      const r = heart.getBoundingClientRect();
      heartBurst(r.left + r.width / 2, r.top + r.height / 2);
    }, true);
  }

  /* =========================================================
     21. ADD TO BAG CHECKMARK MORPH
     ========================================================= */
  const MORPH_SEL = '#pdpAdd, #pdpStickyAdd, #confirmAddToBag, .lp-add';

  function morphButton(btn) {
    if (!btn || btn.classList.contains('is-morphed')) return;

    if (!btn.querySelector('.btn-label')) {
      const label = document.createElement('span');
      label.className = 'btn-label';
      while (btn.firstChild) label.appendChild(btn.firstChild);

      const check = document.createElement('span');
      check.className = 'btn-check';
      check.innerHTML = '✓';

      btn.classList.add('btn-morph');
      btn.appendChild(label);
      btn.appendChild(check);
    }

    btn.classList.add('is-morphed');
    setTimeout(() => btn.classList.remove('is-morphed'), 1300);
  }

  function bindBtnMorph() {
    if (reduce) return;
    if (document.body.dataset.morphBound) return;
    document.body.dataset.morphBound = '1';

    document.addEventListener('click', (e) => {
      const btn = e.target.closest(MORPH_SEL);
      if (!btn) return;
      const root = document.getElementById('pdpRoot');
      if (btn.id === 'pdpAdd' || btn.id === 'pdpStickyAdd') {
        const size = root?.dataset.selectedSize;
        if (!size) return;
      }
      setTimeout(() => morphButton(btn), 60);
    }, true);
  }

  /* =========================================================
     22. CART ICON SHAKE
     ========================================================= */
  function cartShake(el) {
    if (!el || reduce) return;
    el.classList.remove('cart-shake');
    void el.offsetWidth;
    el.classList.add('cart-shake');
    setTimeout(() => el.classList.remove('cart-shake'), 650);
  }

  /* =========================================================
     23. FILTER CHIP MORPH (FLIP)
     ========================================================= */
  let chipSnapshot = null;

  function captureChips() {
    const panel = document.getElementById('shopFiltersPanel');
    if (!panel) return;
    chipSnapshot = new Map();
    panel.querySelectorAll('.filter-chip-sm').forEach((chip) => {
      const key =
        chip.dataset.shopColor ||
        chip.dataset.shopSize  ||
        chip.dataset.shopPrice;
      if (!key) return;
      const label = chip.textContent.trim();
      chipSnapshot.set(key + '::' + label, chip.getBoundingClientRect());
    });
  }

  function playChipFlip() {
    if (!chipSnapshot) return;
    const panel = document.getElementById('shopFiltersPanel');
    if (!panel) { chipSnapshot = null; return; }

    requestAnimationFrame(() => {
      panel.querySelectorAll('.filter-chip-sm').forEach((chip) => {
        const key =
          chip.dataset.shopColor ||
          chip.dataset.shopSize  ||
          chip.dataset.shopPrice;
        if (!key) return;
        const label = chip.textContent.trim();
        const old = chipSnapshot.get(key + '::' + label);
        if (!old) return;

        const cur = chip.getBoundingClientRect();
        const dx = old.left - cur.left;
        const dy = old.top  - cur.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

        chip.style.transition = 'none';
        chip.style.transform = `translate(${dx}px, ${dy}px)`;
        void chip.offsetWidth;
        chip.style.transition =
          'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease';
        chip.style.transform = '';
      });
      chipSnapshot = null;
    });
  }

  function bindChipMorph() {
    if (reduce) return;
    document.addEventListener('click', (e) => {
      if (e.target.closest(
        '[data-shop-color], [data-shop-size], [data-shop-price], ' +
        '[data-clear-filter], [data-clear-all-filters], .filter-chip'
      )) {
        captureChips();
      }
    }, true);

    const panel = document.getElementById('shopFiltersPanel');
    if (panel && !panel.dataset.chipMO) {
      panel.dataset.chipMO = '1';
      const mo = new MutationObserver(() => {
        if (chipSnapshot) playChipFlip();
      });
      mo.observe(panel, { childList: true, subtree: true });
    }
  }

  /* =========================================================
     24. FLIP GRID SHUFFLE
     ========================================================= */
  let gridSnapshot = null;

  function captureShopGrid() {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;
    gridSnapshot = new Map();
    grid.querySelectorAll('[data-card-id]').forEach((card) => {
      gridSnapshot.set(card.dataset.cardId, card.getBoundingClientRect());
    });
  }

  function playGridShuffle() {
    if (!gridSnapshot) return;
    const grid = document.getElementById('shopGrid');
    if (!grid) { gridSnapshot = null; return; }

    requestAnimationFrame(() => {
      grid.querySelectorAll('[data-card-id]').forEach((card) => {
        const id = card.dataset.cardId;
        const old = gridSnapshot.get(id);
        const cur = card.getBoundingClientRect();

        if (!old) {
          card.classList.add('flip-card-enter');
          setTimeout(() => card.classList.remove('flip-card-enter'), 600);
          return;
        }

        const dx = old.left - cur.left;
        const dy = old.top  - cur.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

        card.style.transition = 'none';
        card.style.transform = `translate(${dx}px, ${dy}px)`;
        void card.offsetWidth;
        card.style.transition =
          'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), ' +
          'box-shadow var(--dur) var(--ease-snap)';
        card.style.transform = '';
      });
      gridSnapshot = null;
    });
  }

  function bindGridShuffle() {
    if (reduce) return;
    document.addEventListener('click', (e) => {
      if (e.target.closest(
        '[data-shop-color], [data-shop-size], [data-shop-price], ' +
        '[data-clear-filter], [data-clear-all-filters], ' +
        '.filter-chip, #resetFiltersBtn'
      )) {
        captureShopGrid();
      }
    }, true);

    document.addEventListener('change', (e) => {
      if (e.target.matches('#sortSelect')) captureShopGrid();
    }, true);

    const grid = document.getElementById('shopGrid');
    if (grid && !grid.dataset.flipMO) {
      grid.dataset.flipMO = '1';
      const mo = new MutationObserver(() => {
        if (gridSnapshot) playGridShuffle();
      });
      mo.observe(grid, { childList: true, subtree: false });
    }
  }

  /* =========================================================
     25. LOOKBOOK — Inline "SHOP THE LOOK" price bar
     Injects price + CTA into each lookbook card
     ========================================================= */
  function injectLookbookShopBars(root = document) {
    $$('.lookbook-card', root).forEach((card) => {
      if (card.querySelector('.lbc-shop-bar')) return;

      const info = card.querySelector('.lookbook-card-info');
      if (!info) return;

      // Extract total price from meta row
      const metaSpans = info.querySelectorAll('.lbc-meta span');
      let price = '';
      metaSpans.forEach((s) => {
        const t = (s.textContent || '').trim();
        if (/EGP/i.test(t)) price = t;
      });
      if (!price) return;

      const bar = document.createElement('div');
      bar.className = 'lbc-shop-bar';
      bar.setAttribute('aria-hidden', 'true');
      bar.innerHTML = `
        <span class="lbc-shop-price">${price}</span>
        <span class="lbc-shop-cta">SHOP <span aria-hidden="true">→</span></span>
      `;
      info.appendChild(bar);
    });
  }

  /* =========================================================
     26. BACK TO TOP BUTTON
     ========================================================= */
  let backToTopEl = null;

  function mountBackToTop() {
    if (reduce || backToTopEl) return;

    backToTopEl = document.createElement('button');
    backToTopEl.type = 'button';
    backToTopEl.className = 'ego-back-to-top';
    backToTopEl.setAttribute('aria-label', 'Back to top');
    backToTopEl.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(backToTopEl);

    backToTopEl.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let raf = null;
    const update = () => {
      raf = null;
      const y = window.scrollY;
      const threshold = window.innerHeight * 0.9;
      backToTopEl.classList.toggle('is-visible', y > threshold);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  /* =========================================================
     27. SAFETY NET — Force reveal anything that's stuck
     ========================================================= */
  function forceRevealStuck() {
    const vh = window.innerHeight;
    const inView = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.top < vh + 60 && r.bottom > -60;
    };

    $$('.reveal-clip:not(.is-clipped-in)').forEach((el) => {
      if (inView(el)) el.classList.add('is-clipped-in');
    });

    $$('.reveal-on-scroll:not(.is-visible)').forEach((el) => {
      if (inView(el)) el.classList.add('is-visible');
    });

    $$('.reveal-mask:not(.is-revealed)').forEach((el) => {
      if (inView(el)) el.classList.add('is-revealed');
    });

    $$('.letter-split:not(.is-revealed)').forEach((el) => {
      if (inView(el)) el.classList.add('is-revealed');
    });
  }

  /* =========================================================
     28. GLOBAL SCAN
     ========================================================= */
  function scanAll(root = document) {
    applyTextReveal(root);
    applyScrollReveal(root);
    applyLetterSplit(root);
    bindClipReveal(root);
    bindMagnetic(root);
    bindParallaxZoom(root);
    bindTilt(root);
    bindScramble(root);
    bindCounters();
        mountLookbookStripScrollbar(root);
            mountLookbookStripArrows(root);
    forceRevealStuck();
  }

  let scanTimer = null;
  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(() => scanAll(), 80);
  }

  /* =========================================================
     HERO CTA — Force it above the character layer
     Protects against any future stacking context issues.
     ========================================================= */
  function forceHeroCtaOnTop() {
    const cta = document.querySelector('.hero-copy .primary-cta');
    if (!cta) return;

    // Move CTA to end of hero-copy so it comes last in DOM order
    const parent = cta.parentElement;
    if (parent && parent.lastElementChild !== cta) {
      parent.appendChild(cta);
    }

    // Hard-code the stacking rules inline
    cta.style.position = 'relative';
    cta.style.zIndex = '9999';
    cta.style.pointerEvents = 'auto';
    cta.style.isolation = 'isolate';
  }

  /* =========================================================
     LOOKBOOK CAROUSEL — Arrows to scroll cards
     ========================================================= */
  function mountLookbookCarousel(root = document) {
    $$('.lookbook-grid', root).forEach((grid) => {
      if (grid.dataset.carouselMounted) return;
      // Only on the lookbook page (2+ cards)
      if (!grid.classList.contains('lookbook-grid')) return;
      if (grid.children.length < 2) return;

      grid.dataset.carouselMounted = '1';
      grid.classList.add('lookbook-grid--carousel');

      // Wrap in carousel container (needed for arrows positioning)
      const wrap = document.createElement('div');
      wrap.className = 'lookbook-carousel';
      grid.parentNode.insertBefore(wrap, grid);
      wrap.appendChild(grid);

      // Create arrows
      const prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'lookbook-arrow lookbook-arrow--prev';
      prev.setAttribute('aria-label', 'Previous look');
      prev.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18l-6-6 6-6"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'lookbook-arrow lookbook-arrow--next';
      next.setAttribute('aria-label', 'Next look');
      next.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 6l6 6-6 6"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

      wrap.appendChild(prev);
      wrap.appendChild(next);

      // Scroll by one card width
      const scrollByCard = (dir) => {
        const firstCard = grid.querySelector('.lookbook-card');
        if (!firstCard) return;
        const gap = 16;
        const step = firstCard.offsetWidth + gap;
        grid.scrollBy({ left: dir * step, behavior: 'smooth' });
      };

      prev.addEventListener('click', () => scrollByCard(-1));
      next.addEventListener('click', () => scrollByCard(1));

      // Update arrow disabled state on scroll
      const updateArrows = () => {
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        const x = grid.scrollLeft;
        prev.disabled = x <= 4;
        next.disabled = x >= maxScroll - 4;
      };
      grid.addEventListener('scroll', updateArrows, { passive: true });
      window.addEventListener('resize', updateArrows);

      // Initial state
      requestAnimationFrame(updateArrows);

      // Wheel → horizontal (nice on desktop)
      grid.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          grid.scrollLeft += e.deltaY;
        }
      }, { passive: false });
    });
  }

    /* =========================================================
     LOOKBOOK — Custom vertical scrollbar
     Only visible when the lookbook route is active
     ========================================================= */
  let lookbookScrollbarEl = null;

  function mountLookbookScrollbar() {
    if (reduce || lookbookScrollbarEl) return;

    const el = document.createElement('div');
    el.className = 'ego-lookbook-scrollbar';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="ego-lookbook-scrollbar__track"></div>
      <div class="ego-lookbook-scrollbar__thumb"></div>
    `;
    document.body.appendChild(el);
    lookbookScrollbarEl = el;

    const thumb = el.querySelector('.ego-lookbook-scrollbar__thumb');
    const TRACK_PADDING = 12; // 12px top + 12px bottom

    let raf = null;

    function update() {
      raf = null;
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight;
      const clientHeight = doc.clientHeight;

      if (scrollHeight <= clientHeight) {
        thumb.style.opacity = '0';
        return;
      }
      thumb.style.opacity = '1';

      const trackHeight = window.innerHeight - TRACK_PADDING * 2;
      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(40, trackHeight * ratio);
      const maxTop = trackHeight - thumbHeight;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? doc.scrollTop / maxScroll : 0;
      const top = progress * maxTop;

      thumb.style.height = thumbHeight + 'px';
      thumb.style.transform = `translateY(${top}px)`;
    }

    function onScroll() {
      if (!el.classList.contains('is-visible')) return;
      if (raf) return;
      raf = requestAnimationFrame(update);
    }

    function show() {
      el.classList.add('is-visible');
      update();
    }

    function hide() {
      el.classList.remove('is-visible');
    }

    function isLookbook() {
      const route = document.querySelector('.route[data-route="lookbook"]');
      return route && !route.hidden;
    }

    function syncVisibility() {
      const root = document.documentElement;
      if (isLookbook()) {
        root.classList.add('is-lookbook');
        show();
      } else {
        root.classList.remove('is-lookbook');
        hide();
      }
    }

    /* ---- Drag support ---- */
    let dragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    thumb.addEventListener('pointerdown', (e) => {
      if (e.isPrimary === false) return;
      dragging = true;
      dragStartY = e.clientY;
      dragStartScroll = document.documentElement.scrollTop;
      el.classList.add('is-dragging');
      try { thumb.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
    });

    thumb.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const doc = document.documentElement;
      const trackHeight = window.innerHeight - TRACK_PADDING * 2;
      const ratio = doc.clientHeight / doc.scrollHeight;
      const thumbHeight = Math.max(40, trackHeight * ratio);
      const maxTop = trackHeight - thumbHeight;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      if (maxTop <= 0) return;
      const deltaY = e.clientY - dragStartY;
      const scrollDelta = (deltaY / maxTop) * maxScroll;
      window.scrollTo(0, dragStartScroll + scrollDelta);
    });

    const stopDrag = () => {
      dragging = false;
      el.classList.remove('is-dragging');
    };
    thumb.addEventListener('pointerup', stopDrag);
    thumb.addEventListener('pointercancel', stopDrag);

    /* ---- Click on track to jump ---- */
    el.addEventListener('click', (e) => {
      if (e.target === thumb) return;
      if (e.target.classList.contains('ego-lookbook-scrollbar__thumb')) return;

      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const trackHeight = window.innerHeight - TRACK_PADDING * 2;
      const progress = Math.max(0, Math.min(1, (y - TRACK_PADDING) / trackHeight));
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      window.scrollTo({
        top: progress * maxScroll,
        behavior: 'smooth'
      });
    });

    /* ---- Listeners ---- */
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      if (el.classList.contains('is-visible')) update();
    });
    window.addEventListener('hashchange', () => {
      setTimeout(syncVisibility, 120);
    });

    // Watch the route section itself for visibility changes
    const lookbookRoute = document.querySelector('.route[data-route="lookbook"]');
    if (lookbookRoute) {
      const mo = new MutationObserver(syncVisibility);
      mo.observe(lookbookRoute, { attributes: true, attributeFilter: ['hidden'] });
    }

    // Initial sync
    setTimeout(syncVisibility, 200);
  }

  /* =========================================================
     HOME — Lookbook Preview: Custom horizontal scrollbar
     ========================================================= */
  function mountLookbookStripScrollbar(root = document) {
    const strip = root.querySelector('.lookbook-strip');
    if (!strip) return;
    if (strip.dataset.stripScrollbarBound) return;
    strip.dataset.stripScrollbarBound = '1';

    // Inject the scrollbar right after the strip
    const bar = document.createElement('div');
    bar.className = 'ego-strip-scrollbar';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = `
      <div class="ego-strip-scrollbar__track"></div>
      <div class="ego-strip-scrollbar__thumb"></div>
    `;
    strip.parentNode.insertBefore(bar, strip.nextSibling);

    const thumb = bar.querySelector('.ego-strip-scrollbar__thumb');
    let raf = null;

    function update() {
      raf = null;
      const trackWidth = bar.clientWidth;
      const contentWidth = strip.scrollWidth;
      const viewWidth = strip.clientWidth;

      // Hide if no overflow
      if (contentWidth <= viewWidth + 4) {
        bar.classList.remove('is-visible');
        return;
      }
      bar.classList.add('is-visible');

      const ratio = viewWidth / contentWidth;
      const thumbWidth = Math.max(48, trackWidth * ratio);
      const maxLeft = trackWidth - thumbWidth;
      const maxScroll = contentWidth - viewWidth;
      const progress = maxScroll > 0 ? strip.scrollLeft / maxScroll : 0;
      const left = progress * maxLeft;

      thumb.style.width = thumbWidth + 'px';
      thumb.style.transform = `translate(${left}px, -50%)`;
    }

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    strip.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    /* ---- Drag support ---- */
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    thumb.addEventListener('pointerdown', (e) => {
      if (e.isPrimary === false) return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartScroll = strip.scrollLeft;
      bar.classList.add('is-dragging');
      try { thumb.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
    });

    thumb.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const trackWidth = bar.clientWidth;
      const thumbWidth = thumb.getBoundingClientRect().width;
      const maxLeft = trackWidth - thumbWidth;
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      if (maxLeft <= 0) return;
      const deltaX = e.clientX - dragStartX;
      const scrollDelta = (deltaX / maxLeft) * maxScroll;
      strip.scrollLeft = dragStartScroll + scrollDelta;
    });

    const stopDrag = () => {
      dragging = false;
      bar.classList.remove('is-dragging');
    };
    thumb.addEventListener('pointerup', stopDrag);
    thumb.addEventListener('pointercancel', stopDrag);

    /* ---- Click on track to jump ---- */
    bar.addEventListener('click', (e) => {
      if (e.target === thumb) return;
      const rect = bar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const progress = Math.max(0, Math.min(1, x / bar.clientWidth));
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      strip.scrollTo({
        left: progress * maxScroll,
        behavior: 'smooth'
      });
    });

    // Initial measurements (after the strip renders its cards)
    setTimeout(update, 100);
    setTimeout(update, 700);
  }

    /* =========================================================
     HOME — Lookbook Preview: Left/Right arrows
     ========================================================= */
  function mountLookbookStripArrows(root = document) {
    const strip = root.querySelector('.lookbook-strip');
    if (!strip) return;
    if (strip.dataset.stripArrowsBound) return;
    strip.dataset.stripArrowsBound = '1';

    // Wrap the strip (only if not already wrapped)
    let wrap = strip.parentElement;
    if (!wrap.classList.contains('ego-strip-wrap')) {
      wrap = document.createElement('div');
      wrap.className = 'ego-strip-wrap';
      strip.parentNode.insertBefore(wrap, strip);
      wrap.appendChild(strip);
    }

    // Prev arrow
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'ego-strip-arrow ego-strip-arrow--prev';
    prev.setAttribute('aria-label', 'Previous looks');
    prev.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 18l-6-6 6-6"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Next arrow
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'ego-strip-arrow ego-strip-arrow--next';
    next.setAttribute('aria-label', 'Next looks');
    next.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 6l6 6-6 6"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    wrap.appendChild(prev);
    wrap.appendChild(next);

    // Scroll by one card width
    const scrollByCard = (dir) => {
      const firstCard = strip.querySelector('.lookbook-strip-card');
      if (!firstCard) return;
      const gap = 14;
      const step = firstCard.offsetWidth + gap;
      strip.scrollBy({ left: dir * step, behavior: 'smooth' });
    };

    prev.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollByCard(-1);
    });
    next.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollByCard(1);
    });

    // Update disabled state on scroll / resize
    const updateArrows = () => {
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      const x = strip.scrollLeft;
      const hasOverflow = maxScroll > 4;
      prev.disabled = !hasOverflow || x <= 4;
      next.disabled = !hasOverflow || x >= maxScroll - 4;
      // Hide both if no overflow
      if (!hasOverflow) {
        prev.style.display = 'none';
        next.style.display = 'none';
      } else {
        prev.style.display = '';
        next.style.display = '';
      }
    };

    strip.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);

    requestAnimationFrame(updateArrows);
    setTimeout(updateArrows, 300);
    setTimeout(updateArrows, 900);
  }

/* =========================================================
   IMAGE PRELOADER
   Loads ALL images (products + looks + variants) once on first
   visit. Browser caches them → every page loads instantly.
   Uses requestIdleCallback so it doesn't slow down the initial paint.
   ========================================================= */
let preloadStarted = false;

function preloadAllImages() {
  if (preloadStarted) return;
  preloadStarted = true;

  const D = window.EGO_DATA;
  if (!D || !D.PRODUCTS || !D.LOOKS) return;

  // Collect unique URLs
  const urls = new Set();

  // Product images (flat + models for every variant)
  D.PRODUCTS.forEach((p) => {
    (p.variants || []).forEach((v) => {
      if (v.flat) urls.add(v.flat);
      (v.models || []).forEach((src) => urls.add(src));
    });
  });

  // Look images
  D.LOOKS.forEach((l) => {
    if (l.src) urls.add(l.src);
  });

  const list = [...urls];
  if (!list.length) return;

  // Load in batches so we don't saturate the connection
  const BATCH_SIZE = 6;
  let index = 0;

  const loadBatch = () => {
    const batch = list.slice(index, index + BATCH_SIZE);
    index += BATCH_SIZE;

    batch.forEach((url) => {
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      // No need to attach to DOM — browser caches on fetch
      img.src = url;
    });

    if (index < list.length) {
      // Schedule next batch
      schedule(loadBatch);
    }
  };

  const schedule = (fn) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: 800 });
    } else {
      setTimeout(fn, 120);
    }
  };

  // Start after first paint so it doesn't block anything visible
  schedule(loadBatch);
}


  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    mountCurtain();
    mountScrollProgress();
    mountHeroParallax();
    mountScrollBg();

    requestAnimationFrame(() => {
      applyGlitch();
      applyCharacterWipe();
      injectMarquee();
      mountWordRotator();
      bindFlyToBag();
      bindHeartBurst();
      bindBtnMorph();
      bindChipMorph();
      bindGridShuffle();
      bindCurtain();
      scanAll();
            // Force "SHOP THIS LOOK" above everything in the hero
      forceHeroCtaOnTop();

      // NEW — Lookbook UX
      injectLookbookShopBars();
            mountLookbookCarousel();
      mountBackToTop();
            mountLookbookScrollbar();

      setTimeout(() => {
        heroBoot(true);
      }, 120);
    });

    window.addEventListener('hashchange', () => {
      scheduleScan();

      setTimeout(() => {
        const home = document.querySelector('.route[data-route="home"]');
        if (home && !home.hidden) heroBoot(false);
      }, 150);

      // Re-inject Shop Bars after route change
      setTimeout(() => {
        injectLookbookShopBars();
                forceHeroCtaOnTop();
        mountBackToTop();
                mountLookbookScrollbar();
      }, 200);
    });

    const mo = new MutationObserver(scheduleScan);
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety timers
    setTimeout(forceRevealStuck, 400);
    setTimeout(forceRevealStuck, 1500);

    let safetyRaf = null;
    window.addEventListener('scroll', () => {
      if (safetyRaf) return;
      safetyRaf = requestAnimationFrame(() => {
        safetyRaf = null;
        forceRevealStuck();
      });
    }, { passive: true });

    window.addEventListener('hashchange', () => {
      setTimeout(forceRevealStuck, 100);
      setTimeout(forceRevealStuck, 600);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
      // Preload all images in the background
    window.addEventListener('load', () => {
      setTimeout(preloadAllImages, 1200);
    });
})();