/* =========================================================
   EGO — Analytics Layer
   GA4 + Plausible ready, debug mode via ?debug=1
   ========================================================= */
(function(window){
  'use strict';

  const DEBUG = new URLSearchParams(location.search).has('debug');
  const queue = [];
  const MAX_QUEUE = 100;
  let gtagReady = false;

  function ensureGtag(){
    if (gtagReady) return;
    if (typeof window.gtag === 'function'){ gtagReady = true; return; }
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    gtagReady = true;
  }

  function track(eventName, params = {}){
    const payload = {
      event: eventName,
      ts: Date.now(),
      lang: window.EGOi18n?.getLang?.() || 'en',
      path: location.pathname,
      ...params,
    };

    if (DEBUG){
      // eslint-disable-next-line no-console
      console.log('%c[analytics]', 'color:#c8ff00;font-weight:800', eventName, params);
    }

    ensureGtag();
    try { window.gtag('event', eventName, params); } catch(e){}

    try {
      if (typeof window.plausible === 'function'){
        window.plausible(eventName, { props: params });
      }
    } catch(e){}

    queue.push(payload);
    if (queue.length > MAX_QUEUE) queue.shift();
    try { sessionStorage.setItem('ego.events', JSON.stringify(queue)); } catch(e){}
  }

  function page(name){
    track('page_view', { page_title: name || document.title });
  }

  /* Commerce events per GA4 spec */
  const commerce = {
    viewItem:   (c, i) => track('view_item',      { currency:'EGP', value:c.priceNum, items:[{ item_id:`ego-${i+1}`, item_name:c.name, item_category:c.category, price:c.priceNum }] }),
    selectItem: (c, i) => track('select_item',    { item_list_name:'drop_grid', items:[{ item_id:`ego-${i+1}`, item_name:c.name, price:c.priceNum }] }),
    addToCart:  (c, i, size, qty=1) => track('add_to_cart', { currency:'EGP', value:c.priceNum*qty, items:[{ item_id:`ego-${i+1}`, item_name:c.name, item_variant:size, price:c.priceNum, quantity:qty }] }),
    removeFromCart: (c, i, size) => track('remove_from_cart', { currency:'EGP', value:c.priceNum, items:[{ item_id:`ego-${i+1}`, item_name:c.name, item_variant:size, price:c.priceNum }] }),
    viewCart:   (items, value) => track('view_cart', { currency:'EGP', value, items }),
    beginCheckout: (items, value) => track('begin_checkout', { currency:'EGP', value, items }),
    purchase:   (order) => track('purchase', { currency:'EGP', transaction_id:order.id, value:order.value, items:order.items }),
    addToWishlist: (c, i) => track('add_to_wishlist', { currency:'EGP', value:c.priceNum, items:[{ item_id:`ego-${i+1}`, item_name:c.name, price:c.priceNum }] }),
  };

  /* UX events */
  const ux = {
    languageChange: (lang) => track('language_change', { language: lang }),
    search: (q, results) => track('search', { search_term: q, results_count: results }),
    filterChange: (f, count) => track('filter_change', { filter: f, results_count: count }),
    carouselNav: (i, dir) => track('carousel_nav', { index: i, direction: dir }),
    newsletterSignup: (email) => track('newsletter_signup', { email_domain: (email.split('@')[1]||'').toLowerCase() }),
    wishlistView: () => track('wishlist_view'),
  };

  window.EGOAnalytics = {
    track, page,
    commerce, ux,
    getQueue: () => queue.slice(),
  };
})(window);