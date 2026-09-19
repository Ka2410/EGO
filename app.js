/* =========================================================
   EGO — Playable Streetwear
   Final version — Overlay hero + mobile dots
   ========================================================= */
(() => {
  'use strict';

  /* =========================================================
     1. MODULE IMPORTS
     ========================================================= */
  const D = window.EGO_DATA;
  const S = window.EGOSanitize;

  if (!D || !S) {
    console.error('[EGO] Required modules missing: data.js, sanitize.js');
    return;
  }

  const { LOOKS, PRODUCTS, SIZE_GUIDES, byId, lookById } = D;
  const esc = S.escapeHtml;

  /* =========================================================
     2. CONSTANTS
     ========================================================= */
  const MOBILE_BREAKPOINT = 700;
  const MAX_BAG_ITEMS = 100;
  const MAX_QTY = 99;
  const MAX_WISHLIST_ITEMS = 100;
  const FREE_SHIPPING_THRESHOLD = 2000;
  const SHIPPING_COST = 60;
  const SWIPE_THRESHOLD = 48;
  const HERO_ANIM_MS = 570;

  const MOODS = ['all', 'RAW', 'MONO', 'DEEP', 'CONTRAST', 'SOFT', 'RED', 'QUIET', 'FUR'];
  const WORLD_PAGES = ['about', 'manifesto', 'contact'];
  const HELP_PAGES = ['hub', 'size-guide', 'shipping', 'returns', 'faq'];
  const VALID_CATEGORIES = ['tops', 'bottoms'];

  const STORAGE_KEYS = {
    bag: 'ego.bag.v15',
    wishlist: 'ego.wishlist.v15',
    recent: 'ego.recent.v15',
    coupons: 'ego.coupons.v15',
  };

  const COLOR_MAP = {
    Black: '#111111', White: '#eeeeee', Red: '#8b1a1a', Purple: '#4a2d7a',
    Green: '#3a5c2a', Burgundy: '#6b1a24', Blue: '#2a3d5c', Grey: '#8a8a8a',
    Beige: '#d8cbb0', 'Grey / Black': '#8a8a8a', 'Washed Grey': '#8a8a8a',
    'Light Wash': '#a8b8c0', 'Grey / Blue': '#7a8896', 'Blue / Red': '#2a3d5c',
    'Black / Red': '#8b1a1a', 'Black / Purple': '#4a2d7a',
    'White / Black': '#eeeeee', 'Black / White': '#111111',
  };

  const FOCUSABLE_SELECTOR =
    'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

  /* =========================================================
     3. STATE
     ========================================================= */
  const state = {
    route: 'home',
    routeParams: {},
    bag: S.safeReadJSON(STORAGE_KEYS.bag, [], Array.isArray),
    wishlist: S.safeReadJSON(STORAGE_KEYS.wishlist, [], Array.isArray),
    recent: S.safeReadJSON(STORAGE_KEYS.recent, [], Array.isArray),
    coupons: S.safeReadJSON(STORAGE_KEYS.coupons, [], Array.isArray),
    heroIndex: 0,
    shopFilter: 'all',
    shopSort: 'featured',
    shopColor: 'all',
    shopSize: 'all',
    shopPrice: 'all',
    lookbookMood: 'all',
    searchQuery: '',
    checkoutStep: 1,
    checkoutData: {},
    modal: { productId: null, color: null, size: null, source: 'pdp' },
    carouselLocked: false,
    queuedDirection: 0,
  };

  const limiters = {
    search: S.createRateLimiter(8, 1000),
    newsletter: S.createRateLimiter(2, 5000),
    notify: S.createRateLimiter(2, 5000),
  };

  /* =========================================================
     4. DOM CACHE
     ========================================================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const dom = {
    routes: $$('.route'),
    characterTrack: $('#characterTrack'),
    heroDrop: $('#heroDrop'),
    heroDesc: $('#heroDesc'),
    characterTag: $('#characterTag'),
    metaNumber: $('#metaNumber'),
    metaName: $('#metaName'),
    metaPrice: $('#metaPrice'),
    progressCurrent: $('#progressCurrent'),
    progressFill: $('#progressFill'),
    progressTotal: $('#progressTotal'),
    shopLookBtn: $('#shopLookBtn'),

    featuredGrid: $('#featuredGrid'),
    lookbookStrip: $('#lookbookStrip'),
    newsletterForm: $('#newsletterForm'),
    newsletterEmail: $('#newsletterEmail'),
    newsletterMsg: $('#newsletterMsg'),

    shopGrid: $('#shopGrid'),
    shopSubtitle: $('#shopSubtitle'),
    shopEmpty: $('#shopEmpty'),
    shopFiltersPanel: $('#shopFiltersPanel'),
    filterChips: $$('.filter-chip'),
    filtersToggle: $('#filtersToggle'),
    filtersBadge: $('#filtersBadge'),
    sortSelect: $('#sortSelect'),

    pdpRoot: $('#pdpRoot'),
    pdpStickyCta: $('#pdpStickyCta'),
    pdpStickyName: $('#pdpStickyName'),
    pdpStickyPrice: $('#pdpStickyPrice'),
    pdpStickyAdd: $('#pdpStickyAdd'),

    lookRoot: $('#lookRoot'),
    lookbookRoot: $('#lookbookRoot'),
    worldRoot: $('#worldRoot'),
    helpRoot: $('#helpRoot'),
    searchRoot: $('#searchRoot'),
    checkoutRoot: $('#checkoutRoot'),
    notFoundRoot: $('#notFoundRoot'),

    bagBtn: $('#bagBtn'),
    bagCount: $('#bagCount'),
    bagDrawer: $('#bagDrawer'),
    bagContent: $('#bagContent'),
    bagSubtotal: $('#bagSubtotal'),
    drawerBackdrop: $('#drawerBackdrop'),
    checkoutBtn: $('#checkoutBtn'),
    checkoutHint: $('#checkoutHint'),
    closeBag: $('#closeBag'),

    wishlistBtn: $('#wishlistBtn'),
    wishlistCount: $('#wishlistCount'),
    wishlistDrawer: $('#wishlistDrawer'),
    wishlistContent: $('#wishlistContent'),
    closeWishlist: $('#closeWishlist'),

    sizeModal: $('#sizeModal'),
    sizeModalImg: $('#sizeModalImg'),
    sizeModalColor: $('#sizeModalColor'),
    sizeModalName: $('#sizeModalName'),
    sizeModalPrice: $('#sizeModalPrice'),
    sizeModalColors: $('#sizeModalColors'),
    sizeChips: $('#sizeChips'),
    sizeError: $('#sizeError'),
    confirmAddToBag: $('#confirmAddToBag'),
    openSizeGuide: $('#openSizeGuide'),
    sizeGuideModal: $('#sizeGuideModal'),
    sizeGuideBody: $('#sizeGuideBody'),

    searchBtn: $('#searchBtn'),
    menuBtn: $('#menuBtn'),
    mobileMenu: $('#mobileMenu'),
    mobileMenuClose: $('#mobileMenuClose'),
    mobileSearchBtn: $('#mobileSearchBtn'),
    mobileWishlistBtn: $('#mobileWishlistBtn'),
    mobileBagBtn: $('#mobileBagBtn'),
    mobileBagCount: $('#mobileBagCount'),
    mobileWishlistCount: $('#mobileWishlistCount'),

    toastStack: $('#toastStack'),
  };

  /* =========================================================
     5. UTILITIES
     ========================================================= */
  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;
  const pad = (n) => String(n).padStart(2, '0');
  const formatEGP = (n) => `EGP ${Number(n).toLocaleString('en-US')}`;

  function showToast({ title, sub, img, accent = true, duration = 2800 }) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML = `
      ${img ? `<img src="${esc(img)}" alt="" />` : ''}
      <div class="toast-body">
        <div class="toast-title ${accent ? 'toast-accent' : ''}">${esc(title)}</div>
        ${sub ? `<div class="toast-sub">${esc(sub)}</div>` : ''}
      </div>
    `;
    dom.toastStack.appendChild(el);
    window.setTimeout(() => {
      el.classList.add('is-leaving');
      window.setTimeout(() => el.remove(), 260);
    }, duration);
  }

  function swatchBg(variant) {
    if (!variant || typeof variant.color !== 'string') return '#333';
    const parts = variant.color.split(' / ').map((s) => s.trim());
    if (parts.length === 2) {
      const c1 = COLOR_MAP[parts[0]] || variant.hex || '#333';
      const c2 = COLOR_MAP[parts[1]] || variant.hex || '#333';
      return `linear-gradient(135deg, ${c1} 0%, ${c1} 50%, ${c2} 50%, ${c2} 100%)`;
    }
    return variant.hex || '#333';
  }

  /* =========================================================
     6. FOCUS TRAP
     ========================================================= */
  function trapFocus(container, returnFocusTo) {
    const previous = returnFocusTo || document.activeElement;
    const handler = (e) => {
      if (e.key !== 'Tab') return;
      const items = $$(FOCUSABLE_SELECTOR, container).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', handler);
    container.__trapCleanup = () => {
      container.removeEventListener('keydown', handler);
      previous?.focus?.();
    };
    window.setTimeout(() => {
      $$(FOCUSABLE_SELECTOR, container).find((el) => el.offsetParent !== null)?.focus();
    }, 30);
  }

  function releaseFocusTrap(container) {
    if (container?.__trapCleanup) {
      container.__trapCleanup();
      delete container.__trapCleanup;
    }
  }

  /* =========================================================
     7. IMAGE SKELETON
     ========================================================= */
  function imgWithSkeleton(src, alt, cls = '') {
    return `
      <div class="img-wrap ${cls}">
        <div class="img-skeleton" aria-hidden="true"></div>
        <img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" />
      </div>
    `;
  }

  function bindImageLoaders(root = document) {
    $$('.img-wrap', root).forEach((wrap) => {
      const img = wrap.querySelector('img');
      if (!img) return;
      if (img.complete && img.naturalWidth > 0) {
        wrap.classList.add('is-loaded');
        return;
      }
      img.addEventListener('load', () => wrap.classList.add('is-loaded'), { once: true });
      img.addEventListener('error', () => wrap.classList.add('is-error'), { once: true });
    });
  }

  /* =========================================================
     8. ROUTER
     ========================================================= */
  function parseRoute() {
    const hash = location.hash || '#/';
    const [pathRaw, queryRaw] = hash.replace(/^#/, '').split('?');
    const query = Object.fromEntries(new URLSearchParams(queryRaw || ''));
    const parts = pathRaw.split('/').filter(Boolean).map((p) => S.cleanParam(p, 60));

    if (!parts.length) return { name: 'home', params: {} };

    const top = parts[0];

    if (top === 'shop') {
      const cat = S.cleanSlug(query.cat || 'all', 20);
      return { name: 'shop', params: { cat: ['all', 'tops', 'bottoms'].includes(cat) ? cat : 'all' } };
    }
    if (top === 'lookbook') {
      const mood = S.cleanSlug(query.mood || 'all', 20);
      return { name: 'lookbook', params: { mood } };
    }
    if (top === 'look') return { name: 'look', params: { id: parts[1] } };
    if (top === 'product') {
      return {
        name: 'product',
        params: { id: parts[1], color: S.cleanParam(query.color || '', 30) },
      };
    }
    if (top === 'world') return { name: 'world', params: { page: S.cleanSlug(parts[1] || 'about', 20) } };
    if (top === 'help') return { name: 'help', params: { page: S.cleanSlug(parts[1] || 'hub', 20) } };
    if (top === 'search') {
      return { name: 'search', params: { q: S.cleanString(query.q || '', S.MAX.search) } };
    }
    if (top === 'checkout') return { name: 'checkout', params: {} };

    return { name: '404', params: { path: pathRaw.slice(0, 200) } };
  }

  function setRoute(name) {
    state.route = name;
    dom.routes.forEach((r) => {
      r.hidden = r.dataset.route !== name;
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function handleRoute() {
    const r = parseRoute();
    state.routeParams = r.params;
    setRoute(r.name);

    if (r.name !== 'product' && dom.pdpStickyCta) {
      dom.pdpStickyCta.classList.remove('is-visible');
      dom.pdpStickyCta.hidden = true;
    }

    switch (r.name) {
      case 'home': renderHome(r.params); break;
      case 'shop':
        state.shopFilter = r.params.cat;
        syncShopFilters();
        syncFiltersWithCategory();
        renderShopFilters();
        renderShop();
        break;
      case 'lookbook':
        state.lookbookMood = r.params.mood;
        renderLookbook();
        break;
      case 'look': renderLook(r.params.id); break;
      case 'product': renderPDP(r.params.id, r.params.color); break;
      case 'world': renderWorld(r.params.page); break;
      case 'help': renderHelp(r.params.page); break;
      case 'search':
        state.searchQuery = r.params.q;
        renderSearchPage(r.params.q);
        break;
      case 'checkout': renderCheckoutPage(); break;
      case '404': render404(r.params.path); break;
    }

    setupStickyCtaObserver();
  }

  /* =========================================================
     9. HOME
     ========================================================= */
  function renderHome(params) {
    renderHero();
    renderFeatured();
    renderLookbookStrip();
    updateCategoryCounts();

    if (params?.scrollTo === 'world') {
      window.setTimeout(() => {
        $('#world')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  /* =========================================================
     10. HERO — Clean 2-slide carousel + mobile dots
     ========================================================= */

  /* Only ONE slide lives in the DOM at rest. */
  function renderHero() {
    if (!dom.characterTrack) return;

    const l = LOOKS[state.heroIndex];
    if (!l) return;

    dom.characterTrack.innerHTML = `
      <div class="character-slide is-current">
        <img class="character" src="${esc(l.src)}" alt="${esc(l.name)}"
             draggable="false" loading="eager" />
      </div>
    `;

    renderHeroMeta();
  }

  function renderHeroMeta() {
    const l = LOOKS[state.heroIndex];
    if (!l) return;

    if (dom.heroDrop) dom.heroDrop.textContent = l.drop;
    if (dom.heroDesc) dom.heroDesc.textContent = l.desc;
    if (dom.characterTag) dom.characterTag.textContent = l.tag;
    if (dom.metaNumber) dom.metaNumber.textContent = `${pad(state.heroIndex + 1)} / ${pad(LOOKS.length)}`;
    if (dom.metaName) dom.metaName.textContent = l.name;

    if (dom.metaPrice) {
      const first = byId[l.products?.[0]];
      const pieces = (l.products || []).length;
      dom.metaPrice.textContent = first
        ? `EGP ${first.price.toLocaleString()} · ${pieces} ${pieces === 1 ? 'piece' : 'pieces'}`
        : '';
    }

    if (dom.progressCurrent) dom.progressCurrent.textContent = pad(state.heroIndex + 1);
    if (dom.progressTotal) dom.progressTotal.textContent = pad(LOOKS.length);
    if (dom.progressFill) {
      dom.progressFill.style.width = `${((state.heroIndex + 1) / LOOKS.length) * 100}%`;
    }

    /* ✅ Mobile dots */
    const hud = document.querySelector('.hero-hud');
    if (hud) {
      let dots = hud.querySelector('.hero-dots');
      if (!dots) {
        dots = document.createElement('div');
        dots.className = 'hero-dots';
        hud.appendChild(dots);
      }
      dots.innerHTML = LOOKS.map((_, i) =>
        `<span class="hero-dot ${i === state.heroIndex ? 'is-active' : ''}"></span>`
      ).join('');
    }
  }

  /* Only 2 slides ever exist during a transition. */
  function goHeroTo(nextIndex, dir) {
    if (state.carouselLocked) {
      state.queuedDirection = dir;
      return;
    }

    const wrapped = (nextIndex + LOOKS.length) % LOOKS.length;
    if (wrapped === state.heroIndex) return;

    state.carouselLocked = true;

    const track = dom.characterTrack;
    if (!track) {
      state.carouselLocked = false;
      return;
    }

    /* Grab the current slide */
    let oldSlide = track.querySelector('.character-slide.is-current');
    if (!oldSlide) oldSlide = track.querySelector('.character-slide');
    if (!oldSlide) {
      /* Defensive fallback */
      state.heroIndex = wrapped;
      renderHero();
      state.carouselLocked = false;
      return;
    }

    /* Remove any leftover slides */
    Array.from(track.children).forEach((child) => {
      if (child !== oldSlide) child.remove();
    });

    /* Build new slide off-screen, WITHOUT transition */
    const newSlide = document.createElement('div');
    newSlide.className = 'character-slide';
    newSlide.style.transition = 'none';
    newSlide.style.transform = `translateX(${dir > 0 ? 100 : -100}%)`;
    newSlide.innerHTML = `
      <img class="character" src="${esc(LOOKS[wrapped].src)}"
           alt="${esc(LOOKS[wrapped].name)}" draggable="false" loading="eager" />
    `;
    track.appendChild(newSlide);

    /* Force reflow so the browser registers the starting position */
    void newSlide.offsetWidth;

    /* Clear the inline transition — CSS takes over */
    newSlide.style.transition = '';

    /* Now animate both */
    oldSlide.classList.remove('is-current');
    oldSlide.style.transform = `translateX(${dir > 0 ? -100 : 100}%)`;
    newSlide.style.transform = 'translateX(0)';
    newSlide.classList.add('is-current');

    /* Update state + meta immediately */
    state.heroIndex = wrapped;
    renderHeroMeta();

    /* After animation completes, cleanup */
    window.setTimeout(() => {
      if (oldSlide.parentNode) oldSlide.remove();
      state.carouselLocked = false;

      if (state.queuedDirection !== 0) {
        const d = state.queuedDirection;
        state.queuedDirection = 0;
        goHeroTo(state.heroIndex + d, d);
      }
    }, HERO_ANIM_MS);
  }

  const nextHero = () => goHeroTo(state.heroIndex + 1, 1);
  const prevHero = () => goHeroTo(state.heroIndex - 1, -1);

  /* =========================================================
     11. HERO INTERACTION — Swipe + Wheel + Keyboard
     ========================================================= */
  function bindHeroInteraction() {
    const stage = $('#characterStage');
    if (!stage) return;

    /* --- Pointer drag (touch / mouse) --- */
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let lockedAxis = null;

    stage.addEventListener('pointerdown', (e) => {
      if (e.isPrimary === false) return;

      dragging = true;
      startX = e.clientX ?? 0;
      startY = e.clientY ?? 0;
      lastX = startX;
      lastY = startY;
      lockedAxis = null;

      try { stage.setPointerCapture?.(e.pointerId); } catch (_) { /* ignore */ }
    });

    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const x = e.clientX ?? 0;
      const y = e.clientY ?? 0;
      lastX = x;
      lastY = y;

      if (lockedAxis === null) {
        const dx = Math.abs(x - startX);
        const dy = Math.abs(y - startY);
        if (dx > 8 || dy > 8) {
          lockedAxis = dx > dy ? 'x' : 'y';
        }
      }
    });

    stage.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;

      const dx = lastX - startX;
      const dy = lastY - startY;

      if (lockedAxis === 'x' && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? nextHero() : prevHero();
      }

      lockedAxis = null;
    });

    stage.addEventListener('pointercancel', () => {
      dragging = false;
      lockedAxis = null;
    });

    /* --- Mouse wheel + trackpad --- */
    let wheelLocked = false;

    stage.addEventListener(
      'wheel',
      (e) => {
        const dx = e.deltaX;
        const dy = e.deltaY;

        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;

        const isHorizontal = Math.abs(dx) >= Math.abs(dy);
        if (!isHorizontal && Math.abs(dy) < 40) return;

        e.preventDefault();

        if (wheelLocked || state.carouselLocked) return;
        wheelLocked = true;

        if (dx > 0 || dy > 0) nextHero();
        else prevHero();

        window.setTimeout(() => {
          wheelLocked = false;
        }, 500);
      },
      { passive: false }
    );

    /* --- Keyboard --- */
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextHero();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevHero();
      }
    });
  }

  /* =========================================================
     12. HOME — Featured / Categories / Lookbook strip
     ========================================================= */
  function renderFeatured() {
    if (!dom.featuredGrid) return;

    const allIds = ['raw-tank', 'panel-hoodie', 'tribal-denim', 'wild-knit', 'spider-sleeve', 'goth-zip'];
    const ids = isMobile() ? allIds.slice(0, 4) : allIds;
    const items = ids.map((id) => byId[id]).filter(Boolean);

    dom.featuredGrid.innerHTML = items.map(renderProductCard).join('');
    bindImageLoaders(dom.featuredGrid);
  }

  function renderLookbookStrip() {
    if (!dom.lookbookStrip) return;

    dom.lookbookStrip.innerHTML = LOOKS.map(
      (l, i) => `
        <a class="lookbook-strip-card" href="#/look/${esc(l.id)}">
          ${imgWithSkeleton(l.src, l.name, 'lsc-img-wrap')}
          <div class="lsc-info">
            <span class="lsc-index">${pad(i + 1)}</span>
            <span class="lsc-name">${esc(l.name)}</span>
          </div>
        </a>
      `
    ).join('');

    bindImageLoaders(dom.lookbookStrip);
  }

  function updateCategoryCounts() {
    const counts = {
      tops: PRODUCTS.filter((p) => p.category === 'tops').length,
      bottoms: PRODUCTS.filter((p) => p.category === 'bottoms').length,
      all: PRODUCTS.length,
    };
    if ($('#catCountTops')) $('#catCountTops').textContent = pad(counts.tops);
    if ($('#catCountBottoms')) $('#catCountBottoms').textContent = pad(counts.bottoms);
    if ($('#catCountAll')) $('#catCountAll').textContent = pad(counts.all);
  }

  /* =========================================================
     13. PRODUCT CARD
     ========================================================= */
  function renderProductCard(p) {
    const v = p.variants[0];
    const stock = D.totalStock(p.id);
    const lowStock = stock > 0 && stock <= 5;
    const saved = isWishlisted(p.id);

    const badge = stock === 0
      ? '<span class="pc-badge pc-badge--danger">SOLD OUT</span>'
      : lowStock
      ? `<span class="pc-badge pc-badge--warn">ONLY ${stock} LEFT</span>`
      : p.tagline === 'LIMITED'
      ? '<span class="pc-badge">LIMITED</span>'
      : '';

    return `
      <a class="product-card" href="#/product/${esc(p.id)}"
         data-card-id="${esc(p.id)}"
         aria-label="${esc(p.name)} — ${esc(formatEGP(p.price))}">
        <div class="product-card-img">
          ${imgWithSkeleton(v.flat, '', 'pc-img-wrap')}
          ${badge}
          <button class="pc-heart" type="button"
                  data-wishlist-toggle="${esc(p.id)}"
                  aria-pressed="${saved}"
                  aria-label="${saved ? 'Remove from wishlist' : 'Save to wishlist'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.5-9.5 9-9.5 9z"/>
            </svg>
          </button>
          ${stock > 0 ? `
            <button class="pc-quick-add" type="button" data-quick-add="${esc(p.id)}">
              QUICK ADD <span>+</span>
            </button>
          ` : ''}
        </div>
        <div class="product-card-info">
          <span class="pc-tagline">${esc(p.tagline)}</span>
          <span class="pc-name">${esc(p.name)}</span>
          <span class="pc-price">${esc(formatEGP(p.price))}</span>
          ${p.variants.length > 1 ? `
            <div class="pc-swatches">
              ${p.variants.slice(0, 4).map((vv) =>
                `<span class="pc-swatch" style="background:${swatchBg(vv)}"></span>`
              ).join('')}
              ${p.variants.length > 4
                ? `<span class="pc-swatch-more">+${p.variants.length - 4}</span>`
                : ''}
            </div>
          ` : ''}
        </div>
      </a>
    `;
  }

  function animateCardAdd(productId) {
    const card = document.querySelector(`[data-card-id="${productId}"]`);
    if (!card) return;
    card.classList.remove('is-adding');
    void card.offsetWidth;
    card.classList.add('is-adding');
    window.setTimeout(() => card.classList.remove('is-adding'), 600);
  }

  function bindGlobalDelegates() {
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-quick-add]');
      if (addBtn) {
        e.preventDefault();
        e.stopPropagation();
        const pid = S.cleanSlug(addBtn.dataset.quickAdd, S.MAX.productId);
        if (byId[pid]) openSizeModal(pid, 'quick-add');
        return;
      }

      const heartBtn = e.target.closest('[data-wishlist-toggle]');
      if (heartBtn) {
        e.preventDefault();
        e.stopPropagation();
        const pid = S.cleanSlug(heartBtn.dataset.wishlistToggle, S.MAX.productId);
        if (byId[pid]) toggleWishlistForProduct(pid);
        return;
      }

      if (e.target.matches('[data-close-drawers]')) {
        closeBag();
        closeWishlist();
      }
    });
  }

  /* =========================================================
     14. SHOP — Dynamic filters
     ========================================================= */
  function syncShopFilters() {
    dom.filterChips.forEach((c) => {
      c.classList.toggle('is-active', c.dataset.filter === state.shopFilter);
    });
  }

  function getAvailableFilters() {
    const baseList =
      state.shopFilter === 'all'
        ? PRODUCTS.slice()
        : PRODUCTS.filter((p) => p.category === state.shopFilter);

    const colors = new Set();
    baseList.forEach((p) => p.variants.forEach((v) => colors.add(v.color)));

    const sizes = new Set();
    baseList.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));

    const priceTests = [
      { id: 'under-1k', label: 'UNDER 1K', test: (p) => p.price < 1000 },
      { id: '1k-2k', label: '1K – 2K', test: (p) => p.price >= 1000 && p.price < 2000 },
      { id: 'over-2k', label: 'OVER 2K', test: (p) => p.price >= 2000 },
    ];
    const priceRanges = [{ id: 'all', label: 'ALL' }, ...priceTests.filter((r) => baseList.some(r.test))];

    return {
      colors: [...colors].sort(),
      sizes: [...sizes].sort((a, b) => {
        const na = parseInt(a, 10);
        const nb = parseInt(b, 10);
        if (!isNaN(na) && !isNaN(nb)) return na - nb;
        return a.localeCompare(b);
      }),
      priceRanges,
    };
  }

  function syncFiltersWithCategory() {
    const { colors, sizes, priceRanges } = getAvailableFilters();
    if (state.shopColor !== 'all' && !colors.includes(state.shopColor)) state.shopColor = 'all';
    if (state.shopSize !== 'all' && !sizes.includes(state.shopSize)) state.shopSize = 'all';
    if (state.shopPrice !== 'all' && !priceRanges.some((r) => r.id === state.shopPrice)) {
      state.shopPrice = 'all';
    }
  }

  function updateFiltersBadge() {
    const badge = dom.filtersBadge;
    const toggle = dom.filtersToggle;
    if (!badge || !toggle) return;

    const activeCount = [
      state.shopColor !== 'all',
      state.shopSize !== 'all',
      state.shopPrice !== 'all',
    ].filter(Boolean).length;

    if (activeCount > 0) {
      badge.hidden = false;
      badge.textContent = String(activeCount);
      toggle.classList.add('is-active');
    } else {
      badge.hidden = true;
      toggle.classList.remove('is-active');
    }
  }

  function renderShopFilters() {
    const container = dom.shopFiltersPanel;
    if (!container) return;

    const { colors, sizes, priceRanges } = getAvailableFilters();

    const colorRow = colors.length
      ? `
        <div class="filter-row">
          <div class="filter-row-head">
            <span>COLOR <span class="filter-count">(${colors.length})</span></span>
            ${state.shopColor !== 'all' ? '<button type="button" data-clear-filter="color">CLEAR</button>' : ''}
          </div>
          <div class="filter-chips">
            <button class="filter-chip-sm ${state.shopColor === 'all' ? 'is-active' : ''}" data-shop-color="all">ALL</button>
            ${colors.map((c) => `
              <button class="filter-chip-sm ${state.shopColor === c ? 'is-active' : ''}" data-shop-color="${esc(c)}">
                <span class="chip-dot" style="background:${COLOR_MAP[c] || '#555'}"></span>
                ${esc(c)}
              </button>
            `).join('')}
          </div>
        </div>
      `
      : '';

    const sizeRow = sizes.length
      ? `
        <div class="filter-row">
          <div class="filter-row-head">
            <span>SIZE <span class="filter-count">(${sizes.length})</span></span>
            ${state.shopSize !== 'all' ? '<button type="button" data-clear-filter="size">CLEAR</button>' : ''}
          </div>
          <div class="filter-chips">
            <button class="filter-chip-sm ${state.shopSize === 'all' ? 'is-active' : ''}" data-shop-size="all">ALL</button>
            ${sizes.map((s) => `
              <button class="filter-chip-sm ${state.shopSize === s ? 'is-active' : ''}" data-shop-size="${esc(s)}">${esc(s)}</button>
            `).join('')}
          </div>
        </div>
      `
      : '';

    const priceRow = priceRanges.length > 1
      ? `
        <div class="filter-row">
          <div class="filter-row-head">
            <span>PRICE</span>
            ${state.shopPrice !== 'all' ? '<button type="button" data-clear-filter="price">CLEAR</button>' : ''}
          </div>
          <div class="filter-chips">
            ${priceRanges.map((r) => `
              <button class="filter-chip-sm ${state.shopPrice === r.id ? 'is-active' : ''}" data-shop-price="${esc(r.id)}">${esc(r.label)}</button>
            `).join('')}
          </div>
        </div>
      `
      : '';

    const activeCount = [
      state.shopColor !== 'all',
      state.shopSize !== 'all',
      state.shopPrice !== 'all',
    ].filter(Boolean).length;

    container.innerHTML = `
      ${activeCount > 0 ? `
        <div class="filter-row filter-row--active">
          <div class="filter-row-head">
            <span>ACTIVE FILTERS <span class="filter-count">(${activeCount})</span></span>
            <button type="button" data-clear-all-filters>CLEAR ALL</button>
          </div>
        </div>
      ` : ''}
      ${colorRow}
      ${sizeRow}
      ${priceRow}
    `;

    $$('[data-shop-color]', container).forEach((b) =>
      b.addEventListener('click', () => {
        state.shopColor = b.dataset.shopColor;
        renderShopFilters();
        renderShop();
      })
    );
    $$('[data-shop-size]', container).forEach((b) =>
      b.addEventListener('click', () => {
        state.shopSize = b.dataset.shopSize;
        renderShopFilters();
        renderShop();
      })
    );
    $$('[data-shop-price]', container).forEach((b) =>
      b.addEventListener('click', () => {
        state.shopPrice = b.dataset.shopPrice;
        renderShopFilters();
        renderShop();
      })
    );
    $$('[data-clear-filter]', container).forEach((b) =>
      b.addEventListener('click', () => {
        const which = b.dataset.clearFilter;
        if (which === 'color') state.shopColor = 'all';
        if (which === 'size') state.shopSize = 'all';
        if (which === 'price') state.shopPrice = 'all';
        renderShopFilters();
        renderShop();
      })
    );
    $$('[data-clear-all-filters]', container).forEach((b) =>
      b.addEventListener('click', () => {
        state.shopColor = 'all';
        state.shopSize = 'all';
        state.shopPrice = 'all';
        renderShopFilters();
        renderShop();
      })
    );

    if (dom.filtersToggle) {
      dom.filtersToggle.onclick = () => {
        const isOpen = container.classList.toggle('is-open');
        dom.filtersToggle.setAttribute('aria-expanded', String(isOpen));
      };
    }

    updateFiltersBadge();
  }

  function filterByPrice(p, range) {
    if (range === 'all') return true;
    if (range === 'under-1k') return p.price < 1000;
    if (range === '1k-2k') return p.price >= 1000 && p.price < 2000;
    if (range === 'over-2k') return p.price >= 2000;
    return true;
  }

  function renderShop() {
    if (!dom.shopGrid) return;

    let list = D.byCategory(state.shopFilter);

    if (state.shopColor !== 'all') {
      list = list.filter((p) => p.variants.some((v) => v.color === state.shopColor));
    }
    if (state.shopSize !== 'all') {
      list = list.filter((p) => p.sizes.includes(state.shopSize));
    }
    if (state.shopPrice !== 'all') {
      list = list.filter((p) => filterByPrice(p, state.shopPrice));
    }

    if (state.shopSort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (state.shopSort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (state.shopSort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    if (!list.length) {
      const hasActiveFilters =
        state.shopColor !== 'all' || state.shopSize !== 'all' || state.shopPrice !== 'all';

      dom.shopGrid.innerHTML = `
        <div class="empty-state">
          <p class="empty-title">NO PRODUCTS MATCH</p>
          <p class="empty-sub">${hasActiveFilters ? 'Try removing a filter.' : 'Nothing here yet.'}</p>
          ${hasActiveFilters ? '<button type="button" class="empty-cta" id="resetFiltersBtn">RESET FILTERS →</button>' : ''}
        </div>
      `;

      document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
        state.shopColor = 'all';
        state.shopSize = 'all';
        state.shopPrice = 'all';
        renderShopFilters();
        renderShop();
      });
      return;
    }

    dom.shopGrid.innerHTML = list.map(renderProductCard).join('');
    bindImageLoaders(dom.shopGrid);

    if (dom.shopSubtitle) {
      dom.shopSubtitle.textContent = `${list.length} ${list.length === 1 ? 'product' : 'products'}`;
    }
  }

  function bindShopControls() {
    dom.filterChips.forEach((btn) => {
      btn.addEventListener('click', () => {
        const f = S.cleanSlug(btn.dataset.filter || 'all', 20);
        const allowed = ['all', 'tops', 'bottoms'];
        const safe = allowed.includes(f) ? f : 'all';

        state.shopColor = 'all';
        state.shopSize = 'all';
        state.shopPrice = 'all';

        dom.shopFiltersPanel?.classList.remove('is-open');
        dom.filtersToggle?.setAttribute('aria-expanded', 'false');

        location.hash = safe === 'all' ? '#/shop' : `#/shop?cat=${safe}`;
      });
    });

    if (dom.sortSelect) {
      dom.sortSelect.addEventListener('change', (e) => {
        const allowed = ['featured', 'price-asc', 'price-desc', 'name'];
        state.shopSort = allowed.includes(e.target.value) ? e.target.value : 'featured';
        renderShop();
      });
    }
  }

  /* =========================================================
     15. LOOKBOOK
     ========================================================= */
  function getLookMood(look) {
    return (look.mood || '').split(' · ')[0] || 'ALL';
  }

  function renderLookbook() {
    if (!dom.lookbookRoot) return;

    const mood = MOODS.includes(state.lookbookMood) ? state.lookbookMood : 'all';
    const filtered = mood === 'all' ? LOOKS : LOOKS.filter((l) => getLookMood(l) === mood);

    dom.lookbookRoot.innerHTML = `
      <div class="page-hero page-hero--lookbook">
        <span class="section-kicker">// THE LOOKBOOK</span>
        <h1 class="page-title">CURATED LOOKS<span class="lime">.</span></h1>
        <p class="page-sub">8 complete outfits. Built piece by piece. Shop them as they are — or break them apart.</p>
      </div>

      <div class="lookbook-filters" role="tablist" aria-label="Mood filter">
        ${MOODS.map((m) => `
          <button class="filter-chip ${m === mood ? 'is-active' : ''}" data-mood="${esc(m)}">${esc(m.toUpperCase())}</button>
        `).join('')}
      </div>

      ${filtered.length ? `
        <div class="lookbook-grid">
          ${filtered.map(renderLookbookCard).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <p class="empty-title">NO LOOKS YET</p>
          <p class="empty-sub">Try a different mood.</p>
          <a href="#/lookbook" class="empty-cta">VIEW ALL →</a>
        </div>
      `}
    `;

    bindImageLoaders(dom.lookbookRoot);

    $$('.filter-chip', dom.lookbookRoot).forEach((btn) => {
      btn.addEventListener('click', () => {
        const m = S.cleanSlug(btn.dataset.mood, 20);
        const safe = MOODS.includes(m) ? m : 'all';
        location.hash = safe === 'all' ? '#/lookbook' : `#/lookbook?mood=${safe}`;
      });
    });
  }

  function renderLookbookCard(l) {
    const items = (l.products || []).map((id) => byId[id]).filter(Boolean);
    const total = items.reduce((s, p) => s + p.price, 0);
    const idx = LOOKS.indexOf(l);

    return `
      <a class="lookbook-card" href="#/look/${esc(l.id)}">
        <div class="lookbook-card-img">
          ${imgWithSkeleton(l.src, l.name, 'lbc-img-wrap')}
          <span class="lbc-index">${pad(idx + 1)}</span>
          <span class="lbc-mood">${esc(getLookMood(l))}</span>
        </div>
        <div class="lookbook-card-info">
          <span class="lbc-kicker">${esc(l.tag)}</span>
          <h3 class="lbc-name">${esc(l.name)}</h3>
          <p class="lbc-desc">${esc(l.desc)}</p>
          <div class="lbc-meta">
            <span>${pad(items.length)} ${items.length === 1 ? 'PIECE' : 'PIECES'}</span>
            <span>${esc(formatEGP(total))}</span>
          </div>
          <span class="lbc-cta">VIEW LOOK →</span>
        </div>
      </a>
    `;
  }

  /* =========================================================
     16. LOOK DETAIL
     ========================================================= */
  function renderLook(lookId) {
    const cleanId = S.cleanSlug(lookId, 50);
    const look = lookById[cleanId];
    if (!look) return render404(`/look/${lookId}`);

    const items = (look.products || []).map((id) => byId[id]).filter(Boolean);
    const total = items.reduce((s, p) => s + p.price, 0);
    const bundlePrice = Math.round(total * 0.9);
    const savings = total - bundlePrice;
    const canBundle = items.length >= 2;

    dom.lookRoot.innerHTML = `
      <nav class="pdp-breadcrumbs">
        <a href="#/">HOME</a><span class="sep">/</span>
        <a href="#/lookbook">LOOKBOOK</a><span class="sep">/</span>
        <span class="current">${esc(look.name)}</span>
      </nav>

      <div class="look-hero">
        <div class="look-hero-image">
          ${imgWithSkeleton(look.src, look.name, 'look-img-wrap')}
        </div>
        <div class="look-hero-info">
          <span class="section-kicker">// ${esc(look.drop)}</span>
          <h1 class="page-title">${esc(look.name)}<span class="lime">.</span></h1>
          <p class="page-sub">${esc(look.desc)}</p>

          <div class="look-meta">
            <div class="look-meta-block">
              <span class="lm-label">MOOD</span>
              <span class="lm-value">${esc(look.mood || '—')}</span>
            </div>
            <div class="look-meta-block">
              <span class="lm-label">PIECES</span>
              <span class="lm-value">${pad(items.length)}</span>
            </div>
          </div>

          ${look.fits?.length ? `
            <div class="look-fits">
              ${look.fits.map((f) => `<span class="fit-chip">${esc(f)}</span>`).join('')}
            </div>
          ` : ''}

          ${canBundle ? `
            <button class="look-buy-all" id="buyFullLook">
              <span>BUY FULL LOOK</span>
              <span class="look-buy-price">${esc(formatEGP(bundlePrice))}</span>
            </button>
            <p class="look-savings">Save ${esc(formatEGP(savings))} vs buying separately</p>
          ` : ''}
        </div>
      </div>

      <div class="section-head section-head--compact">
        <div>
          <span class="section-kicker">// PIECES IN THIS LOOK</span>
          <h2>SHOP THE PIECES<span class="lime">.</span></h2>
        </div>
      </div>

      <div class="look-pieces">
        ${items.map((p, i) => `
          <div class="look-piece">
            <span class="lp-index">${pad(i + 1)}</span>
            <div class="lp-img">${imgWithSkeleton(p.variants[0].flat, p.name, 'lp-img-wrap')}</div>
            <div class="lp-info">
              <span class="lp-name">${esc(p.name)}</span>
              <span class="lp-price">${esc(formatEGP(p.price))}</span>
            </div>
            <div class="lp-actions">
              <a href="#/product/${esc(p.id)}" class="lp-view">VIEW</a>
              <button class="lp-add" data-quick-add="${esc(p.id)}">ADD +</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    bindImageLoaders(dom.lookRoot);

    document.getElementById('buyFullLook')?.addEventListener('click', () => {
      if (!canBundle) return;
      items.forEach((p) => {
        const defaultSize = p.sizes[Math.floor(p.sizes.length / 2)] || p.sizes[0];
        addToBag(p.id, p.variants[0].color, defaultSize);
      });
      openBag();
      showToast({
        title: 'FULL LOOK ADDED',
        sub: `${items.length} pieces · ${formatEGP(bundlePrice)}`,
        img: look.src,
      });
    });
  }

  /* =========================================================
     17. PDP
     ========================================================= */
  function renderPDP(productId, colorFromUrl) {
    const cleanId = S.cleanSlug(productId, S.MAX.productId);
    const p = byId[cleanId];
    if (!p) return render404(`/product/${productId}`);

    pushRecent(p.id);

    const allowedColors = p.variants.map((v) => v.color);
    const requestedColor = S.cleanParam(colorFromUrl || '', S.MAX.color);
    const initialColor = allowedColors.includes(requestedColor) ? requestedColor : p.variants[0].color;

    let activeColor = p.variants.find((v) => v.color === initialColor) || p.variants[0];
    let galleryIndex = 0;

    const root = dom.pdpRoot;

    function buildGallery(variant) {
      const images = [{ src: variant.flat, label: 'Flat lay' }];
      (variant.models || []).forEach((src, i) => {
        images.push({ src, label: `On model ${i + 1}` });
      });
      return images;
    }

    function render() {
      const gallery = buildGallery(activeColor);
      if (galleryIndex >= gallery.length) galleryIndex = 0;
      const activeImage = gallery[galleryIndex];
      const related = getRelatedSection(p);
      const reviews = D.getReviews(p.id);
      const recentItems = getRecentItems(p.id);
      const saved = isWishlisted(p.id);
      const soldOut = activeColor.stock === 0;

      root.innerHTML = `
        <nav class="pdp-breadcrumbs">
          <a href="#/">HOME</a><span class="sep">/</span>
          <a href="#/shop">SHOP</a><span class="sep">/</span>
          <a href="#/shop?cat=${esc(p.category)}">${esc(p.category.toUpperCase())}</a><span class="sep">/</span>
          <span class="current">${esc(p.name)}</span>
        </nav>

        <div class="pdp-inner">
          <div class="pdp-gallery">
            <div class="pdp-main-image">
              ${imgWithSkeleton(activeImage.src, `${p.name} in ${activeColor.color}`, 'pdp-img-wrap')}
              ${stockBadge(activeColor.stock)}
            </div>
            <div class="pdp-thumbs">
              ${gallery.map((img, i) => `
                <button class="pdp-thumb ${i === galleryIndex ? 'is-active' : ''}" data-thumb="${i}" aria-label="${esc(img.label)}">
                  <img src="${esc(img.src)}" alt="" loading="lazy" />
                </button>
              `).join('')}
            </div>
          </div>

          <div class="pdp-info">
            <span class="pdp-tagline">${esc(p.tagline)}</span>
            <h1 class="pdp-name">${esc(p.name)}</h1>
            <p class="pdp-price">${esc(formatEGP(p.price))}</p>
            <p class="pdp-desc">${esc(p.desc)}</p>

            <div class="pdp-block">
              <div class="pdp-block-head">
                <span>COLOR</span>
                <strong>${esc(activeColor.color)}</strong>
              </div>
              <div class="color-swatches color-swatches--pdp">
                ${p.variants.map((v) => `
                  <button class="swatch-v ${v.color === activeColor.color ? 'is-active' : ''}"
                          data-color="${esc(v.color)}"
                          aria-pressed="${v.color === activeColor.color}">
                    <span class="swatch-v-dot" style="background:${swatchBg(v)}"></span>
                    <span class="swatch-v-label">${esc(v.color)}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="pdp-block">
              <div class="pdp-block-head">
                <span>SIZE</span>
                <button class="pdp-guide-link" id="pdpOpenGuide">SIZE GUIDE ↗</button>
              </div>
              <div class="size-chips">
                ${p.sizes.map((s) =>
                  `<button class="size-chip" data-size="${esc(s)}" aria-pressed="false">${esc(s)}</button>`
                ).join('')}
              </div>
              ${p.fitNote ? `<p class="pdp-fit-note">${esc(p.fitNote)}</p>` : ''}
              <p class="size-error" id="pdpSizeError" hidden>Please select a size.</p>
            </div>

            ${soldOut ? `
              <div class="pdp-notify">
                <span class="pdp-notify-title">SOLD OUT — NOTIFY ME WHEN BACK</span>
                <form class="pdp-notify-form" id="pdpNotifyForm" novalidate>
                  <input type="email" name="notify-email" placeholder="your@email.com" maxlength="254" required />
                  <button type="submit">NOTIFY ME</button>
                </form>
                <p class="pdp-notify-success" id="pdpNotifySuccess" hidden>✓ We'll email you when it's back.</p>
              </div>
            ` : `
              <button class="pdp-add" id="pdpAdd">
                <span>ADD TO BAG</span>
                <span>${esc(formatEGP(p.price))}</span>
              </button>

              <div class="pdp-delivery">
                <span class="pdp-delivery-icon">🚚</span>
                <div class="pdp-delivery-text">
                  <strong>Delivers in 2–3 days to Cairo & Giza</strong>
                  Free shipping over EGP 2,000 · 14-day returns
                </div>
              </div>
            `}

            <div class="pdp-actions">
              <button class="pdp-icon-btn" id="pdpWishlist" aria-pressed="${saved}">
                <svg width="18" height="18" viewBox="0 0 24 24"
                     fill="${saved ? 'currentColor' : 'none'}"
                     stroke="currentColor" stroke-width="1.8">
                  <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.5-9.5 9-9.5 9z"/>
                </svg>
                ${saved ? 'SAVED' : 'SAVE'}
              </button>
              <button class="pdp-icon-btn" id="pdpShare">SHARE</button>
            </div>
          </div>
        </div>

        ${related.items.length ? `
          <div class="pdp-related">
            <div class="section-head section-head--compact">
              <div>
                <span class="section-kicker">${esc(related.kicker)}</span>
                <h2>${esc(related.title)}<span class="lime">.</span></h2>
              </div>
            </div>
            <div class="product-grid product-grid--compact">
              ${related.items.map(renderProductCard).join('')}
            </div>
          </div>
        ` : ''}

        <section class="pdp-reviews">
          <div class="section-head section-head--compact">
            <div>
              <span class="section-kicker">// VERIFIED BUYERS</span>
              <h2>REVIEWS<span class="lime">.</span></h2>
            </div>
          </div>
          <div class="reviews-header">
            <div class="reviews-score">
              <p class="reviews-score-num">${reviews.rating.toFixed(1)}</p>
              <div class="reviews-score-stars">${starsHTML(reviews.rating)}</div>
              <p class="reviews-score-count">Based on ${reviews.count} reviews</p>
            </div>
            <div class="reviews-list">
              ${reviews.items.map((r) => `
                <div class="review-card">
                  <div class="review-card-head">
                    <span class="review-card-name">${esc(r.name)}</span>
                    <span class="review-card-date">${esc(r.date)}</span>
                  </div>
                  <span class="review-card-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                  <p class="review-card-text">${esc(r.text)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        ${recentItems.length ? `
          <section class="recently-viewed">
            <div class="section-head section-head--compact">
              <div>
                <span class="section-kicker">// KEEP BROWSING</span>
                <h2>RECENTLY VIEWED<span class="lime">.</span></h2>
              </div>
            </div>
            <div class="recently-viewed-strip">
              ${recentItems.map(renderProductCard).join('')}
            </div>
          </section>
        ` : ''}

        <div class="pdp-details">
          <details><summary>PRODUCT DETAILS</summary><p>${esc(p.details || p.desc)}</p></details>
          <details><summary>SHIPPING</summary><p>Cairo & Giza: 2-3 business days. Other governorates: 3-5 business days. Free shipping over EGP 2,000.</p></details>
          <details><summary>CARE</summary><p>Machine wash cold. Do not bleach. Tumble dry low. Iron on reverse.</p></details>
        </div>
      `;

      bindPDPEvents();
      bindImageLoaders(root);
      updateStickyCta(p, activeColor, soldOut);
    }

    function bindPDPEvents() {
      $$('.pdp-thumb', root).forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.thumb, 10);
          if (Number.isInteger(idx) && idx >= 0 && idx < galleryLength()) {
            galleryIndex = idx;
            render();
          }
        });
      });

      $$('.swatch-v', root).forEach((btn) => {
        btn.addEventListener('click', () => {
          const newColor = S.cleanParam(btn.dataset.color, S.MAX.color);
          if (!allowedColors.includes(newColor) || newColor === activeColor.color) return;
          activeColor = p.variants.find((v) => v.color === newColor);
          galleryIndex = 0;
          updateUrl(p.id, activeColor.color);
          render();
        });
      });

      $$('.size-chip', root).forEach((btn) => {
        btn.addEventListener('click', () => {
          const size = S.cleanString(btn.dataset.size, S.MAX.size);
          if (!p.sizes.includes(size)) return;
          $$('.size-chip', root).forEach((b) => b.setAttribute('aria-pressed', 'false'));
          btn.setAttribute('aria-pressed', 'true');
          root.dataset.selectedSize = size;
          const err = document.getElementById('pdpSizeError');
          if (err) err.hidden = true;
        });
      });

      document.getElementById('pdpAdd')?.addEventListener('click', () => {
        const size = root.dataset.selectedSize;
        if (!size || !p.sizes.includes(size)) {
          const err = document.getElementById('pdpSizeError');
          if (err) err.hidden = false;
          return;
        }
        addToBag(p.id, activeColor.color, size);
        openBag();
        showToast({
          title: 'ADDED TO BAG',
          sub: `${p.name} · ${activeColor.color} · ${size}`,
          img: activeColor.flat,
        });
      });

      document.getElementById('pdpNotifyForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!limiters.notify()) return;
        const input = e.target.querySelector('input[name="notify-email"]');
        const email = S.cleanString(input?.value || '', S.MAX.email).toLowerCase();
        if (!S.isValidEmail(email)) {
          input.style.borderColor = 'var(--danger)';
          return;
        }
        input.style.borderColor = '';
        e.target.hidden = true;
        const success = document.getElementById('pdpNotifySuccess');
        if (success) success.hidden = false;
        showToast({
          title: 'NOTED',
          sub: `We'll email ${email} when it's back.`,
          accent: false,
        });
      });

      document.getElementById('pdpWishlist')?.addEventListener('click', (e) => {
        toggleWishlistForProduct(p.id);
        const now = isWishlisted(p.id);
        const btn = e.currentTarget;
        btn.setAttribute('aria-pressed', String(now));
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24"
               fill="${now ? 'currentColor' : 'none'}"
               stroke="currentColor" stroke-width="1.8">
            <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.5-9.5 9-9.5 9z"/>
          </svg>
          ${now ? 'SAVED' : 'SAVE'}
        `;
      });

      document.getElementById('pdpShare')?.addEventListener('click', async () => {
        const url = location.href;
        if (navigator.share) {
          try {
            await navigator.share({ title: p.name, url });
          } catch (_) { /* cancelled */ }
        } else {
          try {
            await navigator.clipboard.writeText(url);
            showToast({ title: 'LINK COPIED', sub: url, accent: false });
          } catch (_) { /* ignore */ }
        }
      });

      document.getElementById('pdpOpenGuide')?.addEventListener('click', () => {
        openSizeGuide(p.category);
      });
    }

    function galleryLength() {
      return 1 + (activeColor.models?.length || 0);
    }

    function stockBadge(stock) {
      const n = Math.max(0, Math.min(999, parseInt(stock, 10) || 0));
      if (n === 0) return '<span class="stock-badge danger">SOLD OUT</span>';
      if (n <= 5) return `<span class="stock-badge warn">ONLY ${n} LEFT</span>`;
      return `<span class="stock-badge">${n} IN STOCK</span>`;
    }

    function getRelatedSection(product) {
      const look = product.lookRef ? lookById[product.lookRef] : null;
      const lookItems = look
        ? (look.products || [])
            .filter((id) => id !== product.id)
            .map((id) => byId[id])
            .filter(Boolean)
        : [];

      if (lookItems.length >= 1) {
        return { title: 'COMPLETE THE LOOK', kicker: '// STYLE IT WITH', items: lookItems.slice(0, 4) };
      }

      const sameCat = PRODUCTS.filter(
        (x) => x.category === product.category && x.id !== product.id
      ).slice(0, 3);

      return { title: 'YOU MIGHT ALSO LIKE', kicker: '// SIMILAR PIECES', items: sameCat };
    }

    function updateUrl(id, color) {
      try {
        const url = new URL(location.href);
        url.hash = `#/product/${encodeURIComponent(id)}?color=${encodeURIComponent(color)}`;
        history.replaceState(null, '', url);
      } catch (_) { /* ignore */ }
    }

    render();
  }

  /* =========================================================
     18. STICKY CTA
     ========================================================= */
  let stickyObserver = null;

  function updateStickyCta(p, activeColor, soldOut) {
    const sticky = dom.pdpStickyCta;
    if (!sticky) return;

    if (soldOut || !isMobile()) {
      sticky.hidden = true;
      sticky.classList.remove('is-visible');
      return;
    }

    sticky.hidden = false;
    if (dom.pdpStickyName) dom.pdpStickyName.textContent = p.name;
    if (dom.pdpStickyPrice) dom.pdpStickyPrice.textContent = formatEGP(p.price);

    if (dom.pdpStickyAdd) {
      dom.pdpStickyAdd.onclick = () => {
        const root = dom.pdpRoot;
        const size = root?.dataset.selectedSize;
        if (!size || !p.sizes.includes(size)) {
          const sizeBlocks = root?.querySelectorAll('.pdp-block');
          sizeBlocks?.[1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const err = document.getElementById('pdpSizeError');
          if (err) err.hidden = false;
          return;
        }
        addToBag(p.id, activeColor.color, size);
        openBag();
        showToast({
          title: 'ADDED TO BAG',
          sub: `${p.name} · ${activeColor.color} · ${size}`,
          img: activeColor.flat,
        });
      };
    }
  }

  function setupStickyCtaObserver() {
    if (stickyObserver) {
      stickyObserver.disconnect();
      stickyObserver = null;
    }
    if (state.route !== 'product' || !isMobile()) return;

    const sticky = dom.pdpStickyCta;
    const mainAdd = document.getElementById('pdpAdd');
    if (!sticky || !mainAdd) return;

    stickyObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        sticky.classList.toggle('is-visible', !entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    stickyObserver.observe(mainAdd);
  }

  /* =========================================================
     19. HELPERS
     ========================================================= */
  function starsHTML(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let out = '';
    for (let i = 0; i < full; i++) out += '★';
    if (half) out += '⯨';
    while (out.length < 5) out += '☆';
    return out;
  }

  function getRecentItems(excludeId) {
    const ids = state.recent.filter((id) => id !== excludeId).slice(0, 4);
    return ids.map((id) => byId[id]).filter(Boolean);
  }

  function pushRecent(productId) {
    const cleanId = S.cleanSlug(productId, S.MAX.productId);
    if (!cleanId || !byId[cleanId]) return;
    state.recent = [cleanId, ...state.recent.filter((x) => x !== cleanId)].slice(0, 8);
    S.safeWriteJSON(STORAGE_KEYS.recent, state.recent);
  }

  /* =========================================================
     20. WORLD
     ========================================================= */
  function renderWorld(page) {
    if (!dom.worldRoot) return;
    page = WORLD_PAGES.includes(page) ? page : 'about';

    const nav = `
      <div class="world-nav">
        <a href="#/world" class="${page === 'about' ? 'is-active' : ''}">ABOUT</a>
        <a href="#/world/manifesto" class="${page === 'manifesto' ? 'is-active' : ''}">MANIFESTO</a>
        <a href="#/world/contact" class="${page === 'contact' ? 'is-active' : ''}">CONTACT</a>
      </div>
    `;

    if (page === 'manifesto') {
      dom.worldRoot.innerHTML = `
        <div class="world-page">${nav}
          <div class="world-hero world-hero--manifesto">
            <div class="wh-text">
              <span class="section-kicker">// THE EGO PROTOCOL</span>
              <h1 class="world-hero-title">DON'T<br /><span class="outline">FIT IN.</span></h1>
            </div>
          </div>
          <div class="world-sections">
            <section class="world-section"><div class="world-section-inner">
              <span class="ws-number">01</span><h2>The clothes make the noise.</h2>
              <p>We don't chase trends. We build pieces that outlast them. Every seam, every wash, every chain — chosen with intent. What you wear says what you don't need to say.</p>
            </div></section>
            <section class="world-section"><div class="world-section-inner">
              <span class="ws-number">02</span><h2>Oversized by design.</h2>
              <p>Comfort is not a compromise. Our silhouettes are cut wide because movement should feel free.</p>
            </div></section>
            <section class="world-section"><div class="world-section-inner">
              <span class="ws-number">03</span><h2>Made in Egypt. Built for the world.</h2>
              <p>From fabric selection to final stitch, we produce locally. Small runs. Real people.</p>
            </div></section>
          </div>
        </div>
      `;
      return;
    }

    if (page === 'contact') {
      dom.worldRoot.innerHTML = `
        <div class="world-page">${nav}
          <div class="page-hero">
            <span class="section-kicker">// GET IN TOUCH</span>
            <h1 class="page-title">TALK TO US<span class="lime">.</span></h1>
            <p class="page-sub">Sizing questions, order help, or just want to say hi — we reply within 24 hours.</p>
          </div>
          <div class="world-contact">
            <div class="contact-card">
              <span class="cc-label">INSTAGRAM</span>
              <a href="https://instagram.com/ka__2410" target="_blank" rel="noopener" class="cc-value">@ka__2410</a>
              <span class="cc-hint">Fastest response — DMs open</span>
            </div>
            <div class="contact-card">
              <span class="cc-label">EMAIL</span>
              <a href="mailto:hello@ego.eg" class="cc-value">hello@ego.eg</a>
              <span class="cc-hint">For orders & partnerships</span>
            </div>
            <div class="contact-card">
              <span class="cc-label">WHATSAPP</span>
              <a href="https://wa.me/201211659075" target="_blank" rel="noopener" class="cc-value">+20 121 165 9075</a>
              <span class="cc-hint">Mon–Fri, 10am–6pm</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    dom.worldRoot.innerHTML = `
      <div class="world-page">${nav}
        <div class="world-hero">
          <div class="wh-text">
            <span class="section-kicker">// ABOUT EGO</span>
            <h1 class="world-hero-title">WEAR<br />YOUR<br /><span class="outline">EGO.</span></h1>
            <p class="world-hero-sub">Playable streetwear, made in Egypt. Eight curated looks. Built to be worn your way.</p>
          </div>
        </div>
        <div class="world-sections">
          <section class="world-section"><div class="world-section-inner">
            <span class="ws-number">01</span><h2>What we do</h2>
            <p>EGO is a streetwear label built on three things: heavy fabrics, oversized silhouettes, and graphic details that say something.</p>
          </div></section>
          <section class="world-section"><div class="world-section-inner">
            <span class="ws-number">02</span><h2>How we build</h2>
            <p>Every look starts as a full outfit on paper. We design the top and bottom together, then test them on mannequins.</p>
          </div></section>
          <section class="world-section"><div class="world-section-inner">
            <span class="ws-number">03</span><h2>Where we're going</h2>
            <p>Eight drops in the first year. Sixteen more pieces in the pipeline.</p>
          </div></section>
        </div>
        <div class="world-cta">
          <a href="#/shop" class="primary-cta">SHOP THE COLLECTION <span>↗</span></a>
        </div>
      </div>
    `;
  }

  /* =========================================================
     21. HELP
     ========================================================= */
  function renderHelp(page) {
    if (!dom.helpRoot) return;
    page = HELP_PAGES.includes(page) ? page : 'hub';

    const breadcrumbs = (current) => `
      <nav class="pdp-breadcrumbs">
        <a href="#/">HOME</a><span class="sep">/</span>
        <a href="#/help">HELP</a><span class="sep">/</span>
        <span class="current">${esc(current)}</span>
      </nav>
    `;

    if (page === 'size-guide') {
      const tops = SIZE_GUIDES.tops;
      const bottoms = SIZE_GUIDES.bottoms;

      const tableHTML = (guide) => `
        <div class="size-table-scroll">
          <table class="size-table">
            <thead><tr>${guide.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
            <tbody>
              ${guide.rows.map((row) => `
                <tr>
                  <td>${esc(row[0])}</td>
                  ${row.slice(1).map((v) => `<td>${esc(v)}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p class="scroll-hint">← SWIPE TO SEE MORE →</p>
      `;

      dom.helpRoot.innerHTML = `
        <div class="help-page">
          ${breadcrumbs('SIZE GUIDE')}
          <div class="page-hero page-hero--compact">
            <span class="section-kicker">// FIT REFERENCE</span>
            <h1 class="page-title">SIZE GUIDE<span class="lime">.</span></h1>
            <p class="page-sub">All measurements in centimeters.</p>
          </div>
          <div class="help-tables">
            <div class="help-table-block">
              <h3>TOPS</h3>
              ${tableHTML(tops)}
            </div>
            <div class="help-table-block">
              <h3>BOTTOMS</h3>
              ${tableHTML(bottoms)}
            </div>
          </div>
          <div class="help-back"><a href="#/help" class="link-arrow">← Back to help center</a></div>
        </div>
      `;
      return;
    }

    if (page === 'shipping') {
      dom.helpRoot.innerHTML = `
        <div class="help-page">
          ${breadcrumbs('SHIPPING')}
          <div class="page-hero page-hero--compact">
            <span class="section-kicker">// DELIVERY</span>
            <h1 class="page-title">SHIPPING<span class="lime">.</span></h1>
          </div>
          <div class="help-cards help-cards--inline">
            <div class="help-card">
              <span class="hc-label">CAIRO & GIZA</span>
              <span class="hc-value">2–3 business days</span>
              <span class="hc-hint">EGP 60</span>
            </div>
            <div class="help-cards-divider"></div>
            <div class="help-card">
              <span class="hc-label">OTHER GOVERNORATES</span>
              <span class="hc-value">3–5 business days</span>
              <span class="hc-hint">EGP 90</span>
            </div>
            <div class="help-cards-divider"></div>
            <div class="help-card">
              <span class="hc-label">FREE SHIPPING</span>
              <span class="hc-value">Orders over EGP 2,000</span>
            </div>
          </div>
          <div class="help-back"><a href="#/help" class="link-arrow">← Back to help center</a></div>
        </div>
      `;
      return;
    }

    if (page === 'returns') {
      dom.helpRoot.innerHTML = `
        <div class="help-page">
          ${breadcrumbs('RETURNS')}
          <div class="page-hero page-hero--compact">
            <span class="section-kicker">// RETURNS</span>
            <h1 class="page-title">14-DAY RETURNS<span class="lime">.</span></h1>
          </div>
          <div class="world-sections">
            <section class="world-section"><div class="world-section-inner">
              <span class="ws-number">01</span><h2>Return window</h2>
              <p>14 days from delivery. Items must be unworn, unwashed, with tags.</p>
            </div></section>
            <section class="world-section"><div class="world-section-inner">
              <span class="ws-number">02</span><h2>Exchanges</h2>
              <p>Wrong size? We'll swap it free once per order.</p>
            </div></section>
          </div>
          <div class="help-back"><a href="#/help" class="link-arrow">← Back to help center</a></div>
        </div>
      `;
      return;
    }

    if (page === 'faq') {
      const faqs = [
        ['What sizes do you carry?', 'Tops XS–XXL. Bottoms 28–38.'],
        ['How do I know my size?', 'Check the size guide. Between sizes? Size down for fitted.'],
        ['Do you ship outside Egypt?', 'Not yet. GCC shipping coming 2027.'],
        ["How can I track my order?", "You'll get a WhatsApp with tracking the day it ships."],
        ['What payment methods?', 'Card, cash on delivery, mobile wallet.'],
        ['Are the pieces unisex?', 'Most are. Fit notes on each product page.'],
      ];

      dom.helpRoot.innerHTML = `
        <div class="help-page">
          ${breadcrumbs('FAQ')}
          <div class="page-hero page-hero--compact">
            <span class="section-kicker">// QUESTIONS</span>
            <h1 class="page-title">FAQ<span class="lime">.</span></h1>
          </div>
          <div class="faq-list">
            ${faqs.map(([q, a]) => `
              <details class="faq-item">
                <summary>${esc(q)}</summary>
                <p>${esc(a)}</p>
              </details>
            `).join('')}
          </div>
          <div class="help-back"><a href="#/help" class="link-arrow">← Back to help center</a></div>
        </div>
      `;
      return;
    }

    dom.helpRoot.innerHTML = `
      <div class="help-page">
        <div class="page-hero">
          <span class="section-kicker">// SUPPORT</span>
          <h1 class="page-title">HOW CAN WE HELP<span class="lime">?</span></h1>
        </div>
        <div class="help-cards">
          <a href="#/help/size-guide" class="help-card-link">
            <div class="help-card">
              <span class="hc-number">01</span>
              <h3 class="hc-title">SIZE GUIDE</h3>
              <span class="hc-cta">OPEN →</span>
            </div>
          </a>
          <a href="#/help/shipping" class="help-card-link">
            <div class="help-card">
              <span class="hc-number">02</span>
              <h3 class="hc-title">SHIPPING</h3>
              <span class="hc-cta">OPEN →</span>
            </div>
          </a>
          <a href="#/help/returns" class="help-card-link">
            <div class="help-card">
              <span class="hc-number">03</span>
              <h3 class="hc-title">RETURNS</h3>
              <span class="hc-cta">OPEN →</span>
            </div>
          </a>
          <a href="#/help/faq" class="help-card-link">
            <div class="help-card">
              <span class="hc-number">04</span>
              <h3 class="hc-title">FAQ</h3>
              <span class="hc-cta">OPEN →</span>
            </div>
          </a>
        </div>
      </div>
    `;
  }

  /* =========================================================
     22. SEARCH
     ========================================================= */
  function renderSearchPage(initialQuery) {
    if (!dom.searchRoot) return;
    const q = S.cleanString(initialQuery || state.searchQuery || '', S.MAX.search);

    dom.searchRoot.innerHTML = `
      <div class="search-page">
        <div class="page-hero page-hero--compact">
          <span class="section-kicker">// SEARCH</span>
          <h1 class="page-title">FIND YOUR PIECE<span class="lime">.</span></h1>
        </div>
        <div class="search-page-bar">
          <div class="search-field search-field--page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            <input id="searchPageInput" type="search" placeholder="Search products…"
                   value="${esc(q)}" autocomplete="off" maxlength="${S.MAX.search}" />
            <button id="searchPageClear" type="button" aria-label="Clear" ${q ? '' : 'hidden'}>×</button>
          </div>
        </div>
        <div class="search-page-body" id="searchPageBody"></div>
      </div>
    `;

    const input = document.getElementById('searchPageInput');
    const clearBtn = document.getElementById('searchPageClear');
    const body = document.getElementById('searchPageBody');

    function runSearch(rawValue) {
      if (!limiters.search()) return;

      const value = S.cleanString(rawValue, S.MAX.search);
      const query = value.toLowerCase();

      const list = query
        ? PRODUCTS.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              p.tagline.toLowerCase().includes(query) ||
              p.category.toLowerCase().includes(query)
          )
        : PRODUCTS.slice(0, 8);

      try {
        const url = new URL(location.href);
        url.hash = query ? `#/search?q=${encodeURIComponent(value)}` : '#/search';
        history.replaceState(null, '', url);
      } catch (_) { /* ignore */ }

      if (!list.length) {
        const shuffled = PRODUCTS.slice().sort(() => Math.random() - 0.5).slice(0, 4);

        body.innerHTML = `
          <div class="empty-state empty-state--search">
            <p class="empty-title">NO RESULTS FOR "${esc(value)}"</p>
            <p class="empty-sub">Try one of these instead:</p>
            <div class="search-suggestions">
              <a href="#/search?q=denim" class="tag">denim</a>
              <a href="#/search?q=hoodie" class="tag">hoodie</a>
              <a href="#/search?q=black" class="tag">black</a>
              <a href="#/search?q=spider" class="tag">spider</a>
            </div>
          </div>
          <div class="search-fallback">
            <div class="section-head section-head--compact">
              <div>
                <span class="section-kicker">// YOU MIGHT LIKE</span>
                <h2>EXPLORE<span class="lime">.</span></h2>
              </div>
            </div>
            <div class="product-grid">
              ${shuffled.map(renderProductCard).join('')}
            </div>
          </div>
        `;
        bindImageLoaders(body);
        return;
      }

      body.innerHTML = `
        <div class="search-page-meta">
          <span>${list.length} ${list.length === 1 ? 'RESULT' : 'RESULTS'}${query ? ` FOR "${esc(value)}"` : ''}</span>
        </div>
        <div class="product-grid">
          ${list.map(renderProductCard).join('')}
        </div>
      `;
      bindImageLoaders(body);
    }

    input.addEventListener('input', (e) => {
      clearBtn.hidden = !e.target.value;
      runSearch(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.value = '';
        clearBtn.hidden = true;
        runSearch('');
      }
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      clearBtn.hidden = true;
      runSearch('');
      input.focus();
    });

    runSearch(q);
    window.setTimeout(() => input.focus(), 60);
  }

  /* =========================================================
     23. CHECKOUT
     ========================================================= */
  function renderCheckoutPage() {
    if (!dom.checkoutRoot) return;

    if (!state.bag.length) {
      dom.checkoutRoot.innerHTML = `
        <div class="checkout-page">
          <div class="empty-state">
            <p class="empty-title">YOUR BAG IS EMPTY</p>
            <p class="empty-sub">Add a piece to continue.</p>
            <a href="#/shop" class="empty-cta">START SHOPPING →</a>
          </div>
        </div>
      `;
      return;
    }

    state.checkoutStep = 1;
    state.checkoutData = {};

    dom.checkoutRoot.innerHTML = `
      <div class="checkout-page">
        <nav class="pdp-breadcrumbs">
          <a href="#/">HOME</a><span class="sep">/</span>
          <a href="#/shop">SHOP</a><span class="sep">/</span>
          <span class="current">CHECKOUT</span>
        </nav>
        <div class="page-hero page-hero--compact">
          <span class="section-kicker">// SECURE CHECKOUT</span>
          <h1 class="page-title">CHECKOUT<span class="lime">.</span></h1>
          <p class="page-sub demo-note">DEMO MODE — no payment will be processed.</p>
        </div>

        <div class="checkout-layout">
          <div class="checkout-main">
            <div class="checkout-steps" id="checkoutSteps">
              <div class="step is-active" data-step="1"><span>1</span>CONTACT</div>
              <div class="step" data-step="2"><span>2</span>SHIPPING</div>
              <div class="step" data-step="3"><span>3</span>PAYMENT</div>
              <div class="step" data-step="4"><span>4</span>REVIEW</div>
            </div>

            <form id="checkoutForm" novalidate autocomplete="on">
              <fieldset class="checkout-step is-active" data-step="1">
                <label class="field"><span>Full name</span><input type="text" name="name" required maxlength="${S.MAX.name}" autocomplete="name" /><span class="field-error">This field is required.</span></label>
                <label class="field"><span>Email</span><input type="email" name="email" required maxlength="${S.MAX.email}" autocomplete="email" /><span class="field-error">Please enter a valid email.</span></label>
                <label class="field"><span>Phone</span><input type="tel" name="phone" required maxlength="${S.MAX.phone}" autocomplete="tel" inputmode="tel" /><span class="field-error">Please enter a valid phone number.</span></label>
              </fieldset>
              <fieldset class="checkout-step" data-step="2">
                <label class="field"><span>Address</span><input type="text" name="address" required maxlength="${S.MAX.address}" autocomplete="street-address" /><span class="field-error">This field is required.</span></label>
                <label class="field"><span>City</span><input type="text" name="city" required maxlength="${S.MAX.city}" autocomplete="address-level2" /><span class="field-error">This field is required.</span></label>
                <label class="field"><span>Governorate</span><input type="text" name="governorate" required maxlength="${S.MAX.governorate}" autocomplete="address-level1" /><span class="field-error">This field is required.</span></label>
                <label class="field"><span>Order notes (optional)</span><textarea name="notes" rows="2" maxlength="${S.MAX.notes}"></textarea></label>
              </fieldset>
              <fieldset class="checkout-step" data-step="3">
                <div class="payment-methods">
                  <label class="payment-option"><input type="radio" name="payment" value="card" checked /><span>💳 Credit / Debit Card</span></label>
                  <label class="payment-option"><input type="radio" name="payment" value="cod" /><span>💵 Cash on Delivery</span></label>
                  <label class="payment-option"><input type="radio" name="payment" value="wallet" /><span>📱 Mobile Wallet</span></label>
                </div>
              </fieldset>
              <fieldset class="checkout-step" data-step="4"><div id="checkoutReview"></div></fieldset>
            </form>

            <div class="checkout-nav">
              <button type="button" class="checkout-back" id="checkoutBack" hidden>← BACK</button>
              <button type="button" class="modal-cta checkout-next" id="checkoutNext">CONTINUE →</button>
            </div>

            <div class="checkout-success" id="checkoutSuccess" hidden>
              <div class="checkout-success-icon">✓</div>
              <h4>ORDER RESERVED</h4>
              <p>This is a prototype. No real order was placed.</p>
              <a href="#/shop" class="modal-cta">BACK TO SHOP</a>
            </div>
          </div>
          <aside class="checkout-summary" id="checkoutSummary"></aside>
        </div>
      </div>
    `;

    bindCheckoutPage();
    renderCheckoutSummary();
    updateCheckoutStep();
  }

  function bindCheckoutPage() {
    const form = document.getElementById('checkoutForm');
    const back = document.getElementById('checkoutBack');
    const next = document.getElementById('checkoutNext');

    next?.addEventListener('click', () => {
      if (!validateCheckoutStep(state.checkoutStep)) return;
      collectCheckoutStep(state.checkoutStep);

      if (state.checkoutStep < 4) {
        state.checkoutStep++;
        updateCheckoutStep();
      } else {
        submitCheckout();
      }
    });

    back?.addEventListener('click', () => {
      if (state.checkoutStep > 1) {
        state.checkoutStep--;
        updateCheckoutStep();
      }
    });

    form?.addEventListener('submit', (e) => e.preventDefault());
  }

  function updateCheckoutStep() {
    const form = document.getElementById('checkoutForm');
    const steps = document.getElementById('checkoutSteps');
    if (!form || !steps) return;

    $$('.checkout-step', form).forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.step) === state.checkoutStep);
    });

    $$('.step', steps).forEach((el) => {
      const n = Number(el.dataset.step);
      el.classList.toggle('is-active', n === state.checkoutStep);
      el.classList.toggle('is-done', n < state.checkoutStep);
    });

    const back = document.getElementById('checkoutBack');
    const next = document.getElementById('checkoutNext');
    if (back) back.hidden = state.checkoutStep === 1;
    if (next) next.textContent = state.checkoutStep === 4 ? 'PLACE ORDER' : 'CONTINUE →';

    if (state.checkoutStep === 4) renderCheckoutReview();
  }

  function collectCheckoutStep(step) {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    const stepEl = form.querySelector(`.checkout-step[data-step="${step}"]`);
    if (!stepEl) return;

    $$('input, textarea', stepEl).forEach((input) => {
      if (input.type === 'radio') {
        if (input.checked) state.checkoutData[input.name] = input.value;
      } else if (input.name) {
        state.checkoutData[input.name] = input.value;
      }
    });
  }

  function validateCheckoutStep(step) {
    const form = document.getElementById('checkoutForm');
    if (!form) return true;

    const stepEl = form.querySelector(`.checkout-step[data-step="${step}"]`);
    if (!stepEl) return true;

    let valid = true;
    $$('.field', stepEl).forEach((field) => {
      const input = field.querySelector('input, textarea');
      if (!input || !input.name) return;

      const required = input.hasAttribute('required');
      const value = (input.value || '').trim();
      let ok = true;

      if (required && !value) ok = false;
      if (ok && input.type === 'email' && value) ok = S.isValidEmail(value);
      if (ok && input.name === 'phone' && value) ok = S.isValidPhone(value);

      field.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });

    return valid;
  }

  function renderCheckoutSummary() {
    const el = document.getElementById('checkoutSummary');
    if (!el) return;

    let subtotal = 0;
    const items = state.bag.map((x) => {
      const p = byId[x.id];
      if (!p) return '';
      const v = p.variants.find((vv) => vv.color === x.color) || p.variants[0];
      subtotal += p.price * x.qty;
      return `
        <div class="cos-item">
          <img src="${esc(v.flat)}" alt="" />
          <div class="cos-info">
            <span class="cos-name">${esc(p.name)}</span>
            <span class="cos-meta">${esc(x.color)} · ${esc(x.size)} · ×${x.qty}</span>
          </div>
          <span class="cos-price">${esc(formatEGP(p.price * x.qty))}</span>
        </div>
      `;
    }).join('');

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    el.innerHTML = `
      <div class="cos-head">
        <span>ORDER SUMMARY</span>
        <span class="cos-count">${state.bag.length} ${state.bag.length === 1 ? 'ITEM' : 'ITEMS'}</span>
      </div>
      <div class="cos-list">${items}</div>
      <div class="cos-row"><span>SUBTOTAL</span><strong>${esc(formatEGP(subtotal))}</strong></div>
      <div class="cos-row"><span>SHIPPING</span><strong>${shipping === 0 ? 'FREE' : esc(formatEGP(shipping))}</strong></div>
      <div class="cos-row cos-row--total"><span>TOTAL</span><strong>${esc(formatEGP(total))}</strong></div>
    `;
  }

  function renderCheckoutReview() {
    const el = document.getElementById('checkoutReview');
    if (!el) return;

    let subtotal = 0;
    const items = state.bag.map((x) => {
      const p = byId[x.id];
      if (!p) return '';
      subtotal += p.price * x.qty;
      return `
        <div class="review-item">
          <div>
            <div class="n">${esc(p.name)}</div>
            <div class="m">${esc(x.color)} · ${esc(x.size)} · ×${x.qty}</div>
          </div>
          <div class="p">${esc(formatEGP(p.price * x.qty))}</div>
        </div>
      `;
    }).join('');

    el.innerHTML = `
      <div class="review-list">${items}</div>
      <div class="review-total"><span>SUBTOTAL</span><strong>${esc(formatEGP(subtotal))}</strong></div>
    `;
  }

  function submitCheckout() {
    const validation = S.validateCheckoutData(state.checkoutData);
    if (!validation.valid) {
      showToast({ title: 'CHECK FIELDS', sub: 'Some information is missing.', accent: false });
      return;
    }

    state.bag = [];
    persistBag();
    renderBag();

    const form = document.getElementById('checkoutForm');
    const success = document.getElementById('checkoutSuccess');
    const nav = document.querySelector('.checkout-nav');
    if (form) form.hidden = true;
    if (nav) nav.hidden = true;
    if (success) success.hidden = false;

    const summary = document.getElementById('checkoutSummary');
    if (summary) summary.style.display = 'none';
  }

  /* =========================================================
     24. 404
     ========================================================= */
  function render404(path) {
    if (!dom.notFoundRoot) return;

    const safePath = S.cleanString(path || '', 200);
    const suggestions = ['raw-tank', 'panel-hoodie', 'tribal-denim']
      .map((id) => byId[id])
      .filter(Boolean);

    dom.notFoundRoot.innerHTML = `
      <div class="notfound-page">
        <div class="notfound-content">
          <span class="notfound-kicker">// 404</span>
          <h1 class="notfound-title">LOST IN THE<br />WAREHOUSE<span class="lime">.</span></h1>
          <p class="notfound-sub">The page <code>${esc(safePath)}</code> doesn't exist — but these might.</p>
          <div class="notfound-actions">
            <a href="#/" class="primary-cta">BACK TO HOME <span>↗</span></a>
            <a href="#/shop" class="link-arrow">Or browse the shop →</a>
          </div>
        </div>
        <div class="notfound-grid">
          ${suggestions.map(renderProductCard).join('')}
        </div>
      </div>
    `;
    bindImageLoaders(dom.notFoundRoot);
  }

  /* =========================================================
     25. BAG
     ========================================================= */
  function addToBag(productId, color, size) {
    const p = byId[productId];
    if (!p) return;
    if (!p.variants.some((v) => v.color === color)) return;
    if (!p.sizes.includes(size)) return;

    const existing = state.bag.find(
      (x) => x.id === productId && x.color === color && x.size === size
    );

    if (existing) {
      existing.qty = Math.min(existing.qty + 1, MAX_QTY);
    } else {
      if (state.bag.length >= MAX_BAG_ITEMS) return;
      state.bag.push({ id: productId, color, size, qty: 1 });
    }

    persistBag();
    renderBag();
    bumpBagButton();
    animateCardAdd(productId);
  }

  function removeFromBag(idx) {
    if (idx < 0 || idx >= state.bag.length) return;
    state.bag.splice(idx, 1);
    persistBag();
    renderBag();
  }

  function changeQty(idx, delta) {
    const item = state.bag[idx];
    if (!item) return;
    item.qty = Math.max(1, Math.min(MAX_QTY, item.qty + delta));
    persistBag();
    renderBag();
  }

  function persistBag() {
    state.bag = state.bag.filter(S.isValidBagItem);
    S.safeWriteJSON(STORAGE_KEYS.bag, state.bag);
  }

  function bumpBagButton() {
    dom.bagBtn.classList.remove('is-bumped');
    void dom.bagBtn.offsetWidth;
    dom.bagBtn.classList.add('is-bumped');
  }

  function getCrossSellItems() {
    const bagIds = new Set(state.bag.map((x) => x.id));
    const bagCats = new Set(state.bag.map((x) => byId[x.id]?.category).filter(Boolean));

    const lookIds = new Set();
    state.bag.forEach((x) => {
      const p = byId[x.id];
      if (p?.lookRef) lookIds.add(p.lookRef);
    });

    const fromLooks = [];
    lookIds.forEach((lid) => {
      const look = lookById[lid];
      (look?.products || []).forEach((pid) => {
        if (!bagIds.has(pid) && byId[pid] && !fromLooks.find((x) => x.id === pid)) {
          fromLooks.push(byId[pid]);
        }
      });
    });

    const fromCats = PRODUCTS.filter((p) => !bagIds.has(p.id) && bagCats.has(p.category));

    return [...fromLooks, ...fromCats].slice(0, 2);
  }

  function renderBag() {
    const count = state.bag.reduce((s, x) => s + x.qty, 0);
    if (dom.bagCount) dom.bagCount.textContent = pad(count);
    if (dom.mobileBagCount) dom.mobileBagCount.textContent = pad(count);

    if (!state.bag.length) {
      dom.bagContent.innerHTML = `
        <div class="empty-state empty-state--drawer">
          <p class="empty-title">YOUR BAG IS EMPTY</p>
          <p class="empty-sub">Pick a look. Build your loadout.</p>
          <a href="#/shop" class="empty-cta" data-close-drawers>START SHOPPING →</a>
        </div>
      `;
      dom.checkoutBtn.disabled = true;
      dom.checkoutHint.classList.remove('is-hidden');
      dom.bagSubtotal.textContent = formatEGP(0);
      return;
    }

    let subtotal = 0;
    const itemsHTML = state.bag.map((item, idx) => {
      const p = byId[item.id];
      if (!p) return '';
      const v = p.variants.find((x) => x.color === item.color) || p.variants[0];
      subtotal += p.price * item.qty;
      return `
        <div class="bag-item">
          <img src="${esc(v.flat)}" alt="" />
          <div>
            <div class="small">${esc(p.name)}</div>
            <div class="name">${esc(item.color)} · ${esc(item.size)}</div>
            <div class="meta-row">
              <div class="qty" role="group" aria-label="Quantity">
                <button type="button" data-qty="-1" data-idx="${idx}" aria-label="Decrease">−</button>
                <span>${item.qty}</span>
                <button type="button" data-qty="1" data-idx="${idx}" aria-label="Increase">+</button>
              </div>
            </div>
            <div class="price">${esc(formatEGP(p.price * item.qty))}</div>
          </div>
          <button class="remove" data-remove="${idx}" type="button">REMOVE</button>
        </div>
      `;
    }).join('');

    const crossItems = getCrossSellItems();
    const crossHTML = crossItems.length
      ? `
        <div class="bag-cross-sell">
          <p class="bag-cross-sell-title">// COMPLETE THE LOOK</p>
          ${crossItems.map((p) => {
            const v = p.variants[0];
            return `
              <div class="bag-cross-item">
                <img src="${esc(v.flat)}" alt="" />
                <div>
                  <div class="bag-cross-name">${esc(p.name)}</div>
                  <div class="bag-cross-price">${esc(formatEGP(p.price))}</div>
                </div>
                <button class="bag-cross-add" type="button" data-quick-add="${esc(p.id)}">ADD +</button>
              </div>
            `;
          }).join('')}
        </div>
      `
      : '';

    dom.bagContent.innerHTML = itemsHTML + crossHTML;
    dom.bagSubtotal.textContent = formatEGP(subtotal);
    dom.checkoutBtn.disabled = false;
    dom.checkoutHint.classList.add('is-hidden');

    $$('[data-remove]', dom.bagContent).forEach((b) =>
      b.addEventListener('click', () => removeFromBag(Number(b.dataset.remove)))
    );
    $$('[data-qty]', dom.bagContent).forEach((b) =>
      b.addEventListener('click', () => changeQty(Number(b.dataset.idx), Number(b.dataset.qty)))
    );
  }

  function openBag() {
    dom.bagDrawer.classList.add('open');
    dom.drawerBackdrop.classList.add('open');
    dom.bagDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    trapFocus(dom.bagDrawer);
  }

  function closeBag() {
    if (!dom.bagDrawer.classList.contains('open')) return;
    dom.bagDrawer.classList.remove('open');
    dom.drawerBackdrop.classList.remove('open');
    dom.bagDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    releaseFocusTrap(dom.bagDrawer);
  }

  /* =========================================================
     26. WISHLIST
     ========================================================= */
  function isWishlisted(productId) {
    return state.wishlist.some((w) => w.id === productId);
  }

  function toggleWishlistForProduct(productId) {
    const p = byId[productId];
    if (!p) return;

    const idx = state.wishlist.findIndex((w) => w.id === productId);
    const v = p.variants[0];

    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
      showToast({ title: 'REMOVED', sub: p.name, img: v.flat, accent: false });
    } else {
      if (state.wishlist.length >= MAX_WISHLIST_ITEMS) return;
      state.wishlist.push({ id: productId, color: p.variants[0].color });
      showToast({ title: 'SAVED', sub: p.name, img: v.flat });
    }

    S.safeWriteJSON(STORAGE_KEYS.wishlist, state.wishlist);
    renderWishlistCount();
    renderWishlistContent();
    updateWishlistHearts();
  }

  function updateWishlistHearts() {
    $$('[data-wishlist-toggle]').forEach((btn) => {
      const pid = btn.dataset.wishlistToggle;
      btn.setAttribute('aria-pressed', String(isWishlisted(pid)));
    });
  }

  function renderWishlistCount() {
    const count = pad(state.wishlist.length);
    if (dom.wishlistCount) dom.wishlistCount.textContent = count;
    if (dom.mobileWishlistCount) dom.mobileWishlistCount.textContent = count;
  }

  function renderWishlistContent() {
    if (!state.wishlist.length) {
      dom.wishlistContent.innerHTML = `
        <div class="empty-state empty-state--drawer">
          <p class="empty-title">NOTHING SAVED YET</p>
          <p class="empty-sub">Tap the heart on any product to save it.</p>
          <a href="#/shop" class="empty-cta" data-close-drawers>BROWSE THE DROP →</a>
        </div>
      `;
      return;
    }

    dom.wishlistContent.innerHTML = state.wishlist.map((item, idx) => {
      const p = byId[item.id];
      if (!p) return '';
      const v = p.variants.find((x) => x.color === item.color) || p.variants[0];
      return `
        <div class="bag-item bag-item--wish">
          <img src="${esc(v.flat)}" alt="" />
          <div>
            <div class="small">${esc(p.name)}</div>
            <div class="name">${esc(item.color)}</div>
            <div class="price">${esc(formatEGP(p.price))}</div>
            <div class="wish-actions">
              <button class="wish-move" data-move-to-bag="${idx}" type="button">MOVE TO BAG</button>
              <button class="wish-remove" data-unwish="${idx}" type="button">REMOVE</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    $$('[data-move-to-bag]', dom.wishlistContent).forEach((b) => {
      b.addEventListener('click', () => {
        const i = Number(b.dataset.moveToBag);
        const item = state.wishlist[i];
        if (!item) return;
        closeWishlist();
        window.setTimeout(() => openSizeModal(item.id, 'wishlist', item.color), 200);
      });
    });

    $$('[data-unwish]', dom.wishlistContent).forEach((b) => {
      b.addEventListener('click', () => {
        const i = Number(b.dataset.unwish);
        const item = state.wishlist[i];
        if (item) toggleWishlistForProduct(item.id);
      });
    });
  }

  function openWishlist() {
    dom.wishlistDrawer.classList.add('open');
    dom.drawerBackdrop.classList.add('open');
    dom.wishlistDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    trapFocus(dom.wishlistDrawer);
  }

  function closeWishlist() {
    if (!dom.wishlistDrawer.classList.contains('open')) return;
    dom.wishlistDrawer.classList.remove('open');
    dom.drawerBackdrop.classList.remove('open');
    dom.wishlistDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    releaseFocusTrap(dom.wishlistDrawer);
  }

  /* =========================================================
     27. SIZE MODAL
     ========================================================= */
  function openSizeModal(productId, source = 'quick-add', preferredColor = null) {
    const cleanId = S.cleanSlug(productId, S.MAX.productId);
    const p = byId[cleanId];
    if (!p) return;

    const allowedColors = p.variants.map((v) => v.color);
    const cleanColor = S.cleanParam(preferredColor || '', S.MAX.color);

    state.modal.productId = cleanId;
    state.modal.source = source;
    state.modal.color = allowedColors.includes(cleanColor) ? cleanColor : p.variants[0].color;
    state.modal.size = null;

    updateSizeModalUI();
    dom.sizeModal.classList.add('open');
    dom.sizeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    trapFocus(dom.sizeModal);
  }

  function updateSizeModalUI() {
    const p = byId[state.modal.productId];
    if (!p) return;

    const v = p.variants.find((x) => x.color === state.modal.color) || p.variants[0];

    dom.sizeModalImg.src = v.flat;
    dom.sizeModalImg.alt = p.name;
    dom.sizeModalColor.textContent = p.tagline;
    dom.sizeModalName.textContent = p.name;
    dom.sizeModalPrice.textContent = formatEGP(p.price);

    dom.sizeModalColors.innerHTML = p.variants.map((vv) => `
      <button class="swatch-v ${vv.color === state.modal.color ? 'is-active' : ''}"
              data-modal-color="${esc(vv.color)}"
              aria-pressed="${vv.color === state.modal.color}">
        <span class="swatch-v-dot" style="background:${swatchBg(vv)}"></span>
        <span class="swatch-v-label">${esc(vv.color)}</span>
      </button>
    `).join('');

    $$('[data-modal-color]', dom.sizeModalColors).forEach((b) => {
      b.addEventListener('click', () => {
        const newColor = S.cleanParam(b.dataset.modalColor, S.MAX.color);
        if (!p.variants.some((vv) => vv.color === newColor)) return;
        state.modal.color = newColor;
        updateSizeModalUI();
      });
    });

    dom.sizeChips.innerHTML = p.sizes.map((s) => `
      <button class="size-chip" data-modal-size="${esc(s)}"
              aria-pressed="${state.modal.size === s}">${esc(s)}</button>
    `).join('');

    $$('[data-modal-size]', dom.sizeChips).forEach((b) => {
      b.addEventListener('click', () => {
        const size = S.cleanString(b.dataset.modalSize, S.MAX.size);
        if (!p.sizes.includes(size)) return;
        state.modal.size = size;
        updateSizeModalUI();
        dom.sizeError.hidden = true;
      });
    });
  }

  function closeSizeModal() {
    dom.sizeModal.classList.remove('open');
    dom.sizeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    releaseFocusTrap(dom.sizeModal);
  }

  /* =========================================================
     28. SIZE GUIDE MODAL
     ========================================================= */
  function openSizeGuide(category) {
    const cat = VALID_CATEGORIES.includes(category) ? category : 'tops';
    const guide = SIZE_GUIDES[cat] || SIZE_GUIDES.tops;

    dom.sizeGuideBody.innerHTML = `
      <span class="modal-kicker">${esc(guide.kicker)}</span>
      <h3>${esc(guide.title)}</h3>
      <p class="modal-price">${esc(guide.desc)}</p>
      <div class="size-table-scroll">
        <table class="size-table">
          <thead><tr>${guide.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
          <tbody>
            ${guide.rows.map((row) => `
              <tr><td>${esc(row[0])}</td>${row.slice(1).map((v) => `<td>${esc(v)}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <p class="scroll-hint">← SWIPE TO SEE MORE →</p>
      <p class="size-note">Not sure? DM us on Instagram <strong>@ego.eg</strong>.</p>
    `;

    dom.sizeGuideModal.classList.add('open');
    dom.sizeGuideModal.setAttribute('aria-hidden', 'false');
    trapFocus(dom.sizeGuideModal);
  }

  function closeSizeGuide() {
    dom.sizeGuideModal.classList.remove('open');
    dom.sizeGuideModal.setAttribute('aria-hidden', 'true');
    releaseFocusTrap(dom.sizeGuideModal);
  }

  /* =========================================================
     29. MOBILE MENU
     ========================================================= */
  function openMenu() {
    dom.mobileMenu.classList.add('open');
    dom.mobileMenu.setAttribute('aria-hidden', 'false');
    dom.menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    trapFocus(dom.mobileMenu);
  }

  function closeMenu() {
    if (!dom.mobileMenu.classList.contains('open')) return;
    dom.mobileMenu.classList.remove('open');
    dom.mobileMenu.setAttribute('aria-hidden', 'true');
    dom.menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    releaseFocusTrap(dom.mobileMenu);
  }

  /* =========================================================
     30. NAV DROPDOWNS
     ========================================================= */
  function bindNavDropdowns() {
    $$('.nav-dropdown-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = btn.closest('.nav-dropdown');
        const isOpen = parent.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(isOpen));
        $$('.nav-dropdown').forEach((d) => {
          if (d !== parent) d.classList.remove('is-open');
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        $$('.nav-dropdown').forEach((d) => d.classList.remove('is-open'));
      }
    });
  }

  /* =========================================================
     31. NEWSLETTER
     ========================================================= */
  function generateCoupon() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'EGO';
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  function handleNewsletterSubmit(e) {
    e.preventDefault();

    if (!limiters.newsletter()) {
      dom.newsletterMsg.textContent = 'Too many attempts. Try again in a few seconds.';
      dom.newsletterMsg.classList.remove('ok');
      dom.newsletterMsg.classList.add('err');
      return;
    }

    const email = S.cleanString(dom.newsletterEmail.value || '', S.MAX.email).toLowerCase();

    dom.newsletterForm.classList.remove('is-invalid');
    dom.newsletterMsg.classList.remove('ok', 'err');

    if (!S.isValidEmail(email)) {
      dom.newsletterForm.classList.add('is-invalid');
      dom.newsletterMsg.textContent = 'Please enter a valid email address.';
      dom.newsletterMsg.classList.add('err');
      return;
    }

    if (state.coupons.some((c) => c.email === email)) {
      dom.newsletterMsg.textContent = "You're already subscribed.";
      dom.newsletterMsg.classList.add('ok');
      return;
    }

    const coupon = generateCoupon();
    state.coupons.push({ email, code: coupon, ts: Date.now() });
    if (state.coupons.length > 50) state.coupons = state.coupons.slice(-50);
    S.safeWriteJSON(STORAGE_KEYS.coupons, state.coupons);

    dom.newsletterEmail.value = '';
    dom.newsletterMsg.textContent = "You're on the list. Here's your code:";
    dom.newsletterMsg.classList.add('ok');

    dom.newsletterForm.querySelector('.newsletter-coupon')?.remove();

    const couponEl = document.createElement('div');
    couponEl.className = 'newsletter-coupon';
    couponEl.innerHTML = `
      <div>
        <div style="font-size:10px;letter-spacing:.16em;font-weight:800;color:var(--muted);margin-bottom:4px">USE AT CHECKOUT</div>
        <div class="newsletter-coupon-code">${esc(coupon)}</div>
      </div>
      <button type="button" class="newsletter-coupon-copy" data-copy="${esc(coupon)}">COPY</button>
    `;
    dom.newsletterForm.appendChild(couponEl);

    couponEl.querySelector('[data-copy]').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(coupon);
        showToast({ title: 'COPIED', sub: coupon, accent: false });
      } catch (_) { /* ignore */ }
    });

    if (isMobile()) {
      window.setTimeout(() => {
        couponEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        couponEl.classList.add('is-highlighted');
        window.setTimeout(() => couponEl.classList.remove('is-highlighted'), 2400);
      }, 100);
    }

    showToast({ title: 'SUBSCRIBED', sub: `Code: ${coupon}`, duration: 4000 });
  }

  /* =========================================================
     32. EVENT BINDINGS
     ========================================================= */
  function bindEvents() {
    dom.bagBtn?.addEventListener('click', openBag);
    dom.closeBag?.addEventListener('click', closeBag);
    dom.drawerBackdrop?.addEventListener('click', () => {
      closeBag();
      closeWishlist();
    });
    dom.checkoutBtn?.addEventListener('click', () => {
      if (dom.checkoutBtn.disabled) return;
      closeBag();
      location.hash = '#/checkout';
    });

    dom.wishlistBtn?.addEventListener('click', openWishlist);
    dom.closeWishlist?.addEventListener('click', closeWishlist);

    dom.sizeModal?.addEventListener('click', (e) => {
      if (e.target.matches('[data-close-modal]')) closeSizeModal();
    });

    dom.confirmAddToBag?.addEventListener('click', () => {
      const p = byId[state.modal.productId];
      if (!p) return;
      if (!state.modal.size || !p.sizes.includes(state.modal.size)) {
        dom.sizeError.hidden = false;
        return;
      }

      addToBag(state.modal.productId, state.modal.color, state.modal.size);

      if (state.modal.source === 'wishlist') {
        const idx = state.wishlist.findIndex((w) => w.id === state.modal.productId);
        if (idx >= 0) {
          state.wishlist.splice(idx, 1);
          S.safeWriteJSON(STORAGE_KEYS.wishlist, state.wishlist);
          renderWishlistCount();
          renderWishlistContent();
          updateWishlistHearts();
        }
      }

      closeSizeModal();
      openBag();
      showToast({
        title: 'ADDED TO BAG',
        sub: `${p.name} · ${state.modal.color} · ${state.modal.size}`,
        img: p.variants.find((x) => x.color === state.modal.color)?.flat,
      });
    });

    dom.openSizeGuide?.addEventListener('click', () => {
      const p = state.modal.productId ? byId[state.modal.productId] : null;
      openSizeGuide(p?.category || 'tops');
    });
    dom.sizeGuideModal?.addEventListener('click', (e) => {
      if (e.target.matches('[data-close-modal]')) closeSizeGuide();
    });

    dom.menuBtn?.addEventListener('click', openMenu);
    dom.mobileMenuClose?.addEventListener('click', closeMenu);
    $$('#mobileMenu nav a').forEach((a) => a.addEventListener('click', closeMenu));
    dom.mobileSearchBtn?.addEventListener('click', () => {
      closeMenu();
      window.setTimeout(() => {
        location.hash = '#/search';
      }, 200);
    });
    dom.mobileWishlistBtn?.addEventListener('click', () => {
      closeMenu();
      window.setTimeout(openWishlist, 200);
    });
    dom.mobileBagBtn?.addEventListener('click', () => {
      closeMenu();
      window.setTimeout(openBag, 200);
    });

    dom.searchBtn?.addEventListener('click', () => {
      location.hash = '#/search';
    });

    bindShopControls();
    dom.newsletterForm?.addEventListener('submit', handleNewsletterSubmit);

    dom.shopLookBtn?.addEventListener('click', () => {
      const look = LOOKS[state.heroIndex];
      if (look) location.hash = `#/look/${encodeURIComponent(look.id)}`;
    });

    bindNavDropdowns();
    bindHeroInteraction();
    bindGlobalDelegates();

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeBag();
        closeWishlist();
        closeMenu();
        closeSizeModal();
        closeSizeGuide();
        $$('.nav-dropdown').forEach((d) => d.classList.remove('is-open'));
      }
    });

    window.addEventListener('beforeunload', (e) => {
      if (state.bag.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    window.addEventListener('hashchange', handleRoute);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (state.route === 'product') setupStickyCtaObserver();
        if (state.route === 'home') renderFeatured();
      }, 200);
    });
  }

  /* =========================================================
     33. INIT
     ========================================================= */
  function init() {
    bindEvents();
    renderWishlistCount();
    renderWishlistContent();
    renderBag();
    handleRoute();
    window.addEventListener('load', handleRoute);
  }

  init();
})();