/* =========================================================
   EGO — Product Catalog v2.0
   Updates in v2.0:
   - REVIEWS data structure + getReviews helper
   - fitNote added to each product
   ========================================================= */
window.EGO_DATA = (function(){
  'use strict';

  /* ============ LOOKS ============ */
  const LOOKS = [
    { id:'look-01', src:'assets/looks/look-01-raw-denim.png',   name:'RAW DENIM',    tag:'THE RAW',      mood:'RAW · OVERSIZED',   fits:['Oversized Top','Wide Denim'],  drop:'NEW DROP 01', desc:'Raw denim. Oversized silhouettes. Designed to stand apart.', products:['raw-tank','tribal-denim'] },
    { id:'look-02', src:'assets/looks/look-02-static.png',      name:'STATIC',       tag:'STATIC',       mood:'MONO · HARD EDGE',  fits:['Knit','Baggy Denim'],           drop:'NEW DROP 02', desc:'Monochrome texture with a hard graphic edge.',                products:['wild-knit','soyla-denim'] },
    { id:'look-03', src:'assets/looks/look-03-violet-mode.png', name:'VIOLET MODE',  tag:'VIOLET MODE',  mood:'DEEP · LAYERED',    fits:['Pullover Hoodie','Baggy Denim'], drop:'NEW DROP 03', desc:'Heavy fleece. Deep violet. A future-facing essential.',       products:['panel-hoodie','chain-denim'] },
    { id:'look-04', src:'assets/looks/look-04-redline.png',     name:'REDLINE',      tag:'REDLINE',      mood:'CONTRAST · STREET', fits:['Raglan Hoodie','Wide Denim'],   drop:'NEW DROP 04', desc:'Contrast energy built for late-night movement.',              products:['stripe-hoodie','block-hoodie','tribal-denim'] },
    { id:'look-05', src:'assets/looks/look-05-heartwash.png',   name:'HEARTWASH',    tag:'LOVE / LOOSE', mood:'SOFT · GRAPHIC',    fits:['Camp Shirt','Patchwork Denim'], drop:'NEW DROP 05', desc:'Soft tailoring meets wide denim and graphic attitude.',       products:['linen-shirt','heart-denim'] },
    { id:'look-06', src:'assets/looks/look-06-spider-code.png', name:'SPIDER CODE',  tag:'SPIDER CODE',  mood:'RED · UTILITY',     fits:['Sleeveless Hoodie'],            drop:'NEW DROP 06', desc:'Sleeveless fleece. Embroidered spider emblem. Heavy silhouette.', products:['spider-sleeve'] },
    { id:'look-07', src:'assets/looks/look-07-ghost-mode.png',  name:'GHOST MODE',   tag:'GHOST MODE',   mood:'QUIET · MAX FIT',   fits:['Zip Hoodie','Sweatpants'],      drop:'NEW DROP 07', desc:'Soft grey layers. Quiet palette. Maximum silhouette.',         products:['zip-sweat-set'] },
    { id:'look-08', src:'assets/looks/look-08-gothic.png',      name:'GOTHIC MODE',  tag:'AFTER DARK',   mood:'FUR · CROSS',       fits:['Fur Zip','Baggy Jorts'],        drop:'NEW DROP 08', desc:'Fur-lined hood. Embroidered cross. Cut for the night.',        products:['goth-zip','denim-shorts'] }
  ];

  /* ============ SIZE GUIDES ============ */
  const SIZE_GUIDES = {
    tops: {
      kicker: '// TOPS FIT REFERENCE',
      title: 'TOPS SIZE GUIDE',
      desc: 'All measurements in centimeters. Cut oversized — size down for a closer fit.',
      columns: ['SIZE','CHEST','LENGTH','SHOULDER','SLEEVE'],
      rows: [
        ['XS', 100, 66, 46, 60],['S', 106, 68, 48, 61],['M', 112, 70, 50, 62],
        ['L', 118, 72, 52, 63],['XL', 124, 74, 54, 64],['XXL', 130, 76, 56, 65]
      ]
    },
    bottoms: {
      kicker: '// BOTTOMS FIT REFERENCE',
      title: 'BOTTOMS SIZE GUIDE',
      desc: 'All measurements in centimeters. Baggy wide-leg cut — take your true waist.',
      columns: ['SIZE','WAIST','HIPS','INSEAM','LENGTH'],
      rows: [
        ['28', 71, 96, 76, 104],['30', 76, 101, 77, 106],['32', 81, 106, 78, 108],
        ['34', 86, 111, 79, 110],['36', 91, 116, 80, 112],['38', 96, 121, 81, 114]
      ]
    }
  };

  /* ============ REVIEWS ============ */
  const REVIEWS = {
    'raw-tank': { rating:4.8, count:24, items:[
      { name:'Ahmed M.', rating:5, text:'Quality is insane for the price. Fits perfectly.', date:'2026-08-12' },
      { name:'Sara K.',  rating:5, text:'Bought 2 more after the first. True to size.',     date:'2026-07-28' },
      { name:'Omar H.',  rating:4, text:'Great fabric. Slightly long but that\'s the look.', date:'2026-07-15' }
    ]},
    'panel-hoodie': { rating:4.9, count:41, items:[
      { name:'Youssef A.', rating:5, text:'Heaviest fleece I own. Worth every pound.', date:'2026-08-20' },
      { name:'Nour M.',    rating:5, text:'The purple color is stunning in person.',   date:'2026-08-05' },
      { name:'Khaled R.',  rating:5, text:'Perfect oversized fit. Ordering green next.', date:'2026-07-22' }
    ]},
    'wild-knit': { rating:4.9, count:18, items:[
      { name:'Laila F.',  rating:5, text:'The jacquard is unreal. So many compliments.', date:'2026-08-18' },
      { name:'Hassan T.', rating:5, text:'Limited done right. Best piece in my wardrobe.', date:'2026-08-02' }
    ]},
    'goth-zip': { rating:5.0, count:12, items:[
      { name:'Ziad H.',   rating:5, text:'The fur is thick and luxurious. Absolutely worth it.', date:'2026-08-25' },
      { name:'Maryam S.', rating:5, text:'Burgundy is the one. Get it before it sells out.',    date:'2026-08-10' }
    ]},
    'tribal-denim': { rating:4.9, count:33, items:[
      { name:'Amr N.',    rating:5, text:'Heaviest denim I own. The embroidery is crazy.',   date:'2026-08-15' },
      { name:'Dina M.',   rating:5, text:'Fits exactly like the pics. Wide leg done right.', date:'2026-08-01' },
      { name:'Tarek S.',  rating:4, text:'Runs long. Take one size down for a cleaner look.',date:'2026-07-20' }
    ]},
    'spider-sleeve': { rating:4.8, count:27, items:[
      { name:'Karim A.', rating:5, text:'Perfect for Egypt summer. Emblem is embroidered.', date:'2026-08-22' },
      { name:'Rana Y.',  rating:4, text:'Wish it had pockets. Otherwise perfect.',          date:'2026-08-08' }
    ]},
    'linen-shirt': { rating:4.7, count:19, items:[
      { name:'Mona L.', rating:5, text:'Breezy and elegant. Beige goes with everything.',  date:'2026-08-14' },
      { name:'Ali R.',  rating:4, text:'Wrinkles fast (it\'s linen) but that\'s the vibe.', date:'2026-07-30' }
    ]},
    'chain-denim': { rating:4.9, count:52, items:[
      { name:'Mostafa K.', rating:5, text:'My everyday pair. The chain is a nice touch.',    date:'2026-08-19' },
      { name:'Yara H.',    rating:5, text:'Fits true. Chain doesn\'t dangle too much.',      date:'2026-08-03' },
      { name:'Sherif A.',  rating:5, text:'Best washed grey I\'ve seen in Egypt.',           date:'2026-07-25' }
    ]},
    'soyla-denim': { rating:4.8, count:22, items:[
      { name:'Hana S.',    rating:5, text:'Graphic is sharp. Everyone asks about it.',      date:'2026-08-16' },
      { name:'Mahmoud E.', rating:4, text:'Baggy in a good way. Size down if you want regular.', date:'2026-08-01' }
    ]},
    'block-hoodie': { rating:4.8, count:16, items:[
      { name:'Farida A.', rating:5, text:'The circle emblem is subtle. Perfect weight.', date:'2026-08-21' },
      { name:'Rami T.',   rating:5, text:'Color-block done right. Great for layering.',  date:'2026-08-06' }
    ]},
    'stripe-hoodie': { rating:4.9, count:21, items:[
      { name:'Nada S.',  rating:5, text:'The red is deeper than the pics. Even better.', date:'2026-08-17' },
      { name:'Ibrahim M.', rating:5, text:'Raglan fit is perfect. Wore it daily for a month.', date:'2026-08-04' }
    ]},
    'heart-denim': { rating:4.8, count:14, items:[
      { name:'Salma R.', rating:5, text:'The leopard hearts are everything. So unique.', date:'2026-08-13' },
      { name:'Yassin K.', rating:4, text:'Distressed details are premium quality.',      date:'2026-07-29' }
    ]},
    'flower-denim': { rating:4.7, count:11, items:[
      { name:'Mariam H.', rating:5, text:'Embroidery is beautifully done. So eye-catching.', date:'2026-08-11' }
    ]},
    'zip-sweat-set': { rating:4.9, count:29, items:[
      { name:'Tamer A.', rating:5, text:'Wore this set on a flight. Never been more comfortable.', date:'2026-08-23' },
      { name:'Dalia F.', rating:5, text:'Grey is the one. Perfect for the Egyptian winter.',      date:'2026-08-07' }
    ]},
    'denim-shorts': { rating:4.6, count:8, items:[
      { name:'Hesham N.', rating:5, text:'Best jorts I own. Contrast stitching is clean.', date:'2026-08-09' }
    ]}
  };

  function getReviews(productId){
    return REVIEWS[productId] || {
      rating: 4.8, count: 12, items: [
        { name:'EGO Customer', rating:5, text:'Great quality. Fast shipping.',              date:'2026-08-01' },
        { name:'EGO Customer', rating:5, text:'Exactly as pictured. Highly recommended.',   date:'2026-07-15' }
      ]
    };
  }

  /* ============ PRODUCTS ============ */
  const PRODUCTS = [
    /* ============ TOPS ============ */
    {
      id:'raw-tank', name:'RAW TANK', tagline:'CORE ESSENTIAL',
      category:'tops', sub:'Ribbed Tank',
      price:690, fitNote:'Runs true to size',
      desc:'Heavyweight ribbed tank. Cut close. Built to layer or stand alone.',
      details:'95% cotton, 5% elastane. Ribbed knit. Pre-shrunk. Machine wash cold.',
      variants:[
        { color:'Black', hex:'#111111', sku:'TANK-BLK', stock:24,
          flat:'assets/products/tank-black.png',
          models:['assets/variants/look-01-black-blue.png','assets/variants/look-01-black.png'] },
        { color:'White', hex:'#eeeeee', sku:'TANK-WHT', stock:18,
          flat:'assets/products/tank-white.png',
          models:['assets/looks/look-01-raw-denim.png','assets/variants/look-01-white-black.png'] }
      ],
      sizes:['XS','S','M','L','XL','XXL'],
      lookRef:'look-01'
    },
    {
      id:'wild-knit', name:'WILD KNIT', tagline:'LIMITED',
      category:'tops', sub:'Jacquard Knit',
      price:1890, fitNote:'Runs oversized — size down for a fitted look',
      desc:'Zebra-pattern jacquard knit. Drop shoulder. Cross pendant styling.',
      details:'Acrylic-wool blend jacquard. Fully fashioned sleeves. Ribbed cuffs and hem. Dry clean only.',
      variants:[
        { color:'Black / Red', hex:'#8b1a1a', sku:'WK-BR', stock:4,
          flat:'assets/products/knit-black-red.png',
          models:['assets/variants/look-02-red.png','assets/looks/look-02-static.png'] },
        { color:'Black / Purple', hex:'#4a2d7a', sku:'WK-BP', stock:8,
          flat:'assets/products/knit-black-purple.png',
          models:['assets/looks/look-02-static.png','assets/variants/look-02-red.png'] }
      ],
      sizes:['XS','S','M','L','XL','XXL'],
      lookRef:'look-02'
    },
    {
      id:'panel-hoodie', name:'PANEL HOODIE', tagline:'NEW DROP',
      category:'tops', sub:'Pullover Hoodie',
      price:1650, fitNote:'Oversized cut. Take your true size for the look',
      desc:'Oversized fleece. Panel-seam detail with metal logo bar. Kangaroo pocket.',
      details:'400gsm cotton fleece. Metal logo bar. Ribbed cuffs and hem. Drop shoulder cut.',
      variants:[
        { color:'Black',  hex:'#111111', sku:'PH-BLK', stock:14,
          flat:'assets/products/hoodie-panel-black.png',
          models:['assets/variants/look-03-black.png','assets/looks/look-03-violet-mode.png'] },
        { color:'Purple', hex:'#4a2d7a', sku:'PH-PUR', stock:7,
          flat:'assets/products/hoodie-panel-purple.png',
          models:['assets/looks/look-03-violet-mode.png','assets/variants/look-03-flow-state.png'] },
        { color:'Green',  hex:'#3a5c2a', sku:'PH-GRN', stock:5,
          flat:'assets/products/hoodie-panel-green.png',
          models:['assets/variants/look-03-flow-state.png','assets/looks/look-03-violet-mode.png'] }
      ],
      sizes:['XS','S','M','L','XL','XXL'],
      lookRef:'look-03'
    },
    {
      id:'block-hoodie', name:'BLOCK HOODIE', tagline:'NEW DROP',
      category:'tops', sub:'Emblem Hoodie',
      price:1750, fitNote:'Runs true to size',
      desc:'Embroidered circle emblem. Contrast panels. Fleece-lined.',
      details:'400gsm cotton fleece. Embroidered circle emblem. Contrast raglan panels.',
      variants:[
        { color:'White / Black', hex:'#eeeeee', sku:'BH-WB', stock:9,
          flat:'assets/products/hoodie-block-white-black.png',
          models:['assets/variants/look-04-white-black.png','assets/looks/look-04-redline.png'] },
        { color:'Black / White', hex:'#111111', sku:'BH-BW', stock:11,
          flat:'assets/products/hoodie-block-black-white.png',
          models:['assets/variants/look-04-white-black.png'] }
      ],
      sizes:['XS','S','M','L','XL','XXL'],
      lookRef:'look-04'
    },
    {
      id:'stripe-hoodie', name:'STRIPE HOODIE', tagline:'NEW DROP',
      category:'tops', sub:'Raglan Hoodie',
      price:1750, fitNote:'Oversized cut. Take your true size for the look',
      desc:'Raglan sleeves with contrast stripes. Embroidered EGO emblem.',
      details:'400gsm cotton fleece. Contrast raglan stripes. Embroidered EGO emblem.',
      variants:[
        { color:'Black / Red', hex:'#8b1a1a', sku:'SH-BR', stock:6,
          flat:'assets/products/hoodie-stripe-black-red.png',
          models:['assets/looks/look-04-redline.png','assets/variants/look-04-white-black.png'] }
      ],
      sizes:['XS','S','M','L','XL','XXL'],
      lookRef:'look-04'
    },
    {
      id:'goth-zip', name:'GOTHIC ZIP', tagline:'LIMITED',
      category:'tops', sub:'Fur Zip Hoodie',
      price:2290, fitNote:'Runs true to size',
      desc:'Faux-fur hood lining. Embroidered cross panels. Heavyweight build.',
      details:'500gsm heavyweight fleece. Faux-fur hood lining. Embroidered cross panels. Full-zip.',
      variants:[
        { color:'Purple', hex:'#4a2d7a', sku:'GZ-PUR', stock:5,
          flat:'assets/products/hoodie-fur-purple.png',
          models:['assets/looks/look-08-gothic.png','assets/variants/look-08-burgundy.png'] },
        { color:'Burgundy', hex:'#6b1a24', sku:'GZ-BUR', stock:3,
          flat:'assets/products/hoodie-fur-burgundy.png',
          models:['assets/variants/look-08-burgundy.png','assets/looks/look-08-gothic.png'] }
      ],
      sizes:['XS','S','M','L','XL','XXL'],
      lookRef:'look-08'
    },
    {
      id:'spider-sleeve', name:'SPIDER SLEEVELESS', tagline:'NEW DROP',
      category:'tops', sub:'Sleeveless Hoodie',
      price:1290, fitNote:'Runs true to size',
      desc:'Sleeveless fleece hoodie. Embroidered spider emblem. Kangaroo pocket.',
      details:'380gsm cotton fleece. Embroidered spider emblem. Drawstring hood. Kangaroo pocket.',
      variants:[
        { color:'Black', hex:'#111111', sku:'SS-BLK', stock:10,
          flat:'assets/products/spider-black.png',
          models:['assets/looks/look-06-spider-code.png','assets/variants/look-06-burgundy.png'] },
        { color:'White', hex:'#eeeeee', sku:'SS-WHT', stock:8,
          flat:'assets/products/spider-white.png',
          models:['assets/variants/look-06-white.png','assets/looks/look-06-spider-code.png'] },
        { color:'Burgundy', hex:'#6b1a24', sku:'SS-BUR', stock:6,
          flat:'assets/products/spider-burgundy.png',
          models:['assets/variants/look-06-burgundy.png','assets/variants/look-06-white.png'] }
      ],
      sizes:['XS','S','M','L','XL','XXL'],
      lookRef:'look-06'
    },
    {
      id:'linen-shirt', name:'LINEN SHIRT', tagline:'SUMMER',
      category:'tops', sub:'Camp Collar Shirt',
      price:890, fitNote:'Relaxed cut. Size down for a closer fit',
      desc:'Breathable linen blend. Camp collar. Relaxed cut.',
      details:'55% linen, 45% cotton. Camp collar. Curved hem. Mother-of-pearl buttons.',
      variants:[
        { color:'Beige', hex:'#d8cbb0', sku:'LS-BEI', stock:12,
          flat:'assets/products/linen-beige.png',
          models:['assets/looks/look-05-heartwash.png','assets/variants/look-05-black.png'] },
        { color:'Black', hex:'#111111', sku:'LS-BLK', stock:11,
          flat:'assets/products/linen-black.png',
          models:['assets/variants/look-05-black.png','assets/looks/look-05-heartwash.png'] }
      ],
      sizes:['XS','S','M','L','XL','XXL'],
      lookRef:'look-05'
    },
    {
      id:'zip-sweat-set', name:'ZIP + SWEAT SET', tagline:'BUNDLE',
      category:'tops', sub:'Zip Hoodie + Sweatpants',
      price:2590, fitNote:'Oversized. Take your true size',
      desc:'Zip hoodie and matching wide-leg sweatpants. Sold as a set.',
      details:'400gsm cotton fleece. Full-zip hoodie. Wide-leg sweatpants with elastic waist.',
      variants:[
        { color:'Black', hex:'#111111', sku:'ZSS-BLK', stock:9,
          flat:'assets/products/zipsweat-black.png',
          models:['assets/variants/look-07-black.png'] },
        { color:'Grey', hex:'#a8a8a8', sku:'ZSS-GRY', stock:7,
          flat:'assets/products/zipsweat-gray.png',
          models:['assets/looks/look-07-ghost-mode.png'] }
      ],
      sizes:['XS','S','M','L','XL','XXL'],
      lookRef:'look-07'
    },

    /* ============ BOTTOMS ============ */
    {
      id:'tribal-denim', name:'TRIBAL DENIM', tagline:'NEW DROP',
      category:'bottoms', sub:'Wide-Leg Denim',
      price:1850, fitNote:'Wide leg. Take your true waist',
      desc:'Wide-leg denim with embroidered tribal artwork. Chain hardware.',
      details:'14oz rigid denim. Embroidered tribal artwork. Metal chain with belt-loop hardware.',
      variants:[
        { color:'Blue / Red', hex:'#2a3d5c', sku:'TD-BLR', stock:8,
          flat:'assets/products/denim-tribal-blue.png',
          models:['assets/looks/look-01-raw-denim.png','assets/variants/look-01-black-blue.png'] },
        { color:'Black / Red', hex:'#111111', sku:'TD-BKR', stock:6,
          flat:'assets/products/denim-tribal-black.png',
          models:['assets/looks/look-04-redline.png','assets/variants/look-04-white-black.png'] }
      ],
      sizes:['28','30','32','34','36','38'],
      lookRef:'look-04'
    },
    {
      id:'heart-denim', name:'HEART DENIM', tagline:'LIMITED',
      category:'bottoms', sub:'Patchwork Denim',
      price:1790, fitNote:'Baggy. Take your true waist',
      desc:'Leopard heart patches. Embroidered heart outlines. Distressed.',
      details:'12oz washed denim. Leopard print heart patches. Embroidered heart outlines.',
      variants:[
        { color:'Light Wash', hex:'#a8b8c0', sku:'HD-LW', stock:7,
          flat:'assets/products/denim-heart.png',
          models:['assets/looks/look-05-heartwash.png','assets/variants/look-05-black.png'] }
      ],
      sizes:['28','30','32','34','36','38'],
      lookRef:'look-05'
    },
    {
      id:'chain-denim', name:'CHAIN DENIM', tagline:'CORE',
      category:'bottoms', sub:'Baggy Denim',
      price:1720, fitNote:'Baggy. Take your true waist',
      desc:'Baggy washed denim. Moon-and-star chain charm.',
      details:'13oz washed denim. Moon-and-star metal charm on chain.',
      variants:[
        { color:'Washed Grey', hex:'#8a8a8a', sku:'CD-WG', stock:15,
          flat:'assets/products/denim-chain.png',
          models:['assets/looks/look-03-violet-mode.png','assets/variants/look-03-flow-state.png','assets/variants/look-03-black.png'] }
      ],
      sizes:['28','30','32','34','36','38'],
      lookRef:'look-03'
    },
    {
      id:'soyla-denim', name:'SOY LA DENIM', tagline:'NEW DROP',
      category:'bottoms', sub:'Graphic Denim',
      price:1790, fitNote:'Baggy. Take your true waist',
      desc:'"Soy La" graphic. Eagle and star embroidery. Baggy cut.',
      details:'13oz washed denim. Embroidered "Soy La" lettering. Eagle and star design.',
      variants:[
        { color:'Grey / Black', hex:'#8a8a8a', sku:'SL-GB', stock:11,
          flat:'assets/products/denim-soyla.png',
          models:['assets/looks/look-02-static.png','assets/variants/look-02-red.png'] }
      ],
      sizes:['28','30','32','34','36','38'],
      lookRef:'look-02'
    },
    {
      id:'flower-denim', name:'FLOWER DENIM', tagline:'NEW DROP',
      category:'bottoms', sub:'Wide-Leg Denim',
      price:1820, fitNote:'Wide leg. Take your true waist',
      desc:'Blue flower embroidery on washed grey denim. Wide leg.',
      details:'12oz washed denim. Blue flower embroidery down both legs.',
      variants:[
        { color:'Grey / Blue', hex:'#7a8896', sku:'FD-GB', stock:9,
          flat:'assets/products/denim-flower.png',
          models:['assets/variants/look-10-block-white.png','assets/variants/look-10-block-black.png'] }
      ],
      sizes:['28','30','32','34','36','38']
    },
    {
      id:'denim-shorts', name:'DENIM SHORTS', tagline:'SUMMER',
      category:'bottoms', sub:'Baggy Jorts',
      price:990, fitNote:'Baggy. Take your true waist',
      desc:'Baggy denim shorts. Contrast stitching. Belt-loop waist.',
      details:'12oz denim. Contrast stitching. Belt loops. Wide cut.',
      variants:[
        { color:'Black', hex:'#111111', sku:'DS-BLK', stock:12,
          flat:'assets/products/denim-shorts-black.png',
          models:['assets/looks/look-08-gothic.png','assets/variants/look-08-burgundy.png'] }
      ],
      sizes:['28','30','32','34','36','38'],
      lookRef:'look-08'
    }
  ];

  /* ============ Helpers ============ */
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const lookById = Object.fromEntries(LOOKS.map(l => [l.id, l]));

  function findVariant(productId, colorName){
    const p = byId[productId];
    if (!p) return null;
    return p.variants.find(v => v.color === colorName) || p.variants[0];
  }
  function totalStock(productId){
    const p = byId[productId];
    return p ? p.variants.reduce((s,v) => s + v.stock, 0) : 0;
  }
  function byCategory(cat){
    if (!cat || cat === 'all') return PRODUCTS.slice();
    return PRODUCTS.filter(p => p.category === cat);
  }
  function getRelated(productId){
    const p = byId[productId];
    if (!p) return [];
    const looks = LOOKS.filter(l => l.products?.includes(productId));
    const ids = new Set();
    looks.forEach(l => (l.products || []).forEach(id => {
      if (id !== productId) ids.add(id);
    }));
    if (ids.size < 3){
      PRODUCTS.filter(x => x.category === p.category && x.id !== productId)
        .forEach(x => ids.add(x.id));
    }
    return [...ids].map(id => byId[id]).filter(Boolean).slice(0, 4);
  }
  function findLookForProduct(productId){
    return LOOKS.find(l => l.products?.includes(productId)) || null;
  }
  function allColors(){
    const set = new Set();
    PRODUCTS.forEach(p => p.variants.forEach(v => set.add(v.color)));
    return [...set].sort();
  }
  function allSizes(){
    const set = new Set();
    PRODUCTS.forEach(p => p.sizes.forEach(s => set.add(s)));
    return [...set].sort((a,b) => {
      const na = parseInt(a,10), nb = parseInt(b,10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });
  }

  return {
    LOOKS, PRODUCTS, SIZE_GUIDES, REVIEWS, byId, lookById,
    findVariant, totalStock, byCategory, getRelated, findLookForProduct,
    getReviews, allColors, allSizes
  };
})();