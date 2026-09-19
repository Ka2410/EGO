/* =========================================================
   EGO — i18n Layer
   Egyptian Arabic + English, RTL support, localStorage persistence
   ========================================================= */
(function(window){
  'use strict';

  const translations = {
    en: {
      /* Header */
      'nav.shop': 'SHOP',
      'nav.newDrop': 'NEW DROP',
      'nav.world': 'WORLD',
      'nav.search': 'SEARCH',
      'nav.bag': 'BAG',
      'nav.wishlist': 'SAVED',
      'nav.menu': 'MENU',
      'nav.close': 'CLOSE',

      /* Hero */
      'hero.desc.0': 'Raw denim. Oversized silhouettes. Designed to stand apart.',
      'hero.desc.1': 'Soft tailoring meets wide denim and graphic attitude.',
      'hero.desc.2': 'Heavy fleece. Deep violet. A future-facing essential.',
      'hero.desc.3': 'Contrast energy built for late-night movement.',
      'hero.desc.4': 'Monochrome texture with a hard graphic edge.',
      'hero.desc.5': 'Deep red utility set. Clean hardware. Heavy silhouette.',
      'hero.desc.6': 'Washed utility. Relaxed proportions. Everyday armor.',
      'hero.desc.7': 'Soft grey layers. Quiet palette. Maximum silhouette.',
      'hero.cta': 'SHOP THIS LOOK',
      'hero.dragHint': 'DRAG TO EXPLORE',
      'hero.swipe': 'SWIPE',
      'hero.scroll': 'SCROLL TO ENTER',
      'hero.charSelect': 'CHARACTER SELECT',

      /* Drop */
      'drop.kicker': '// CURRENT INVENTORY',
      'drop.title': 'THE DROP.',
      'drop.subtitle': 'Choose a look. Build your loadout. Make it yours.',
      'drop.filter.all': 'ALL',
      'drop.filter.denim': 'DENIM',
      'drop.filter.hoodie': 'HOODIES',
      'drop.filter.set': 'SETS',
      'drop.empty': 'No looks match that filter.',
      'drop.shopLook': 'SHOP LOOK',
      'drop.viewers': '{n} VIEWING',
      'drop.lowStock': 'ONLY {n} LEFT',
      'drop.soldOut': 'SOLD OUT',
      'drop.save': 'SAVE',
      'drop.saved': 'SAVED',

      /* Manifesto */
      'manifesto.kicker': '// EGO PROTOCOL',
      'manifesto.text': 'The UI stays quiet. The clothes make the noise.',
      'manifesto.word1': "DON'T",
      'manifesto.word2': 'FIT IN.',

      /* Newsletter */
      'newsletter.kicker': '// STAY IN THE LOOP',
      'newsletter.title': 'JOIN THE LIST',
      'newsletter.desc': 'Early access to drops. No spam. Unsubscribe anytime.',
      'newsletter.placeholder': 'your@email.com',
      'newsletter.cta': 'SUBSCRIBE',
      'newsletter.success': "You're on the list. Welcome to EGO.",
      'newsletter.invalid': 'Please enter a valid email address.',
      'newsletter.alreadyIn': "You're already subscribed.",

      /* Bag */
      'bag.title': 'YOUR BAG',
      'bag.empty': 'Your loadout is empty.',
      'bag.emptyHint': 'Select a look to start.',
      'bag.subtotal': 'SUBTOTAL',
      'bag.checkout': 'CHECKOUT',
      'bag.checkoutHint': 'Add at least one item to checkout.',
      'bag.remove': 'REMOVE',
      'bag.item': 'ITEM',
      'bag.size': 'SIZE',
      'bag.qty': 'QTY',

      /* Wishlist */
      'wishlist.title': 'YOUR WISHLIST',
      'wishlist.empty': 'Nothing saved yet.',
      'wishlist.emptyHint': 'Tap the heart on any look to save it.',
      'wishlist.moveToBag': 'MOVE TO BAG',

      /* Size modal */
      'size.title': 'SELECT SIZE',
      'size.guide': 'SIZE GUIDE',
      'size.error': 'Please select a size to continue.',
      'size.addToBag': 'ADD TO BAG',

      /* Size guide */
      'guide.kicker': '// FIT REFERENCE',
      'guide.title': 'SIZE GUIDE',
      'guide.desc': 'All measurements in centimeters. Garments are cut oversized — size down for a closer fit.',
      'guide.size': 'SIZE',
      'guide.chest': 'CHEST',
      'guide.length': 'LENGTH',
      'guide.shoulder': 'SHOULDER',
      'guide.waist': 'WAIST',
      'guide.note': "Not sure? DM us on Instagram @ego.eg — we'll help you pick.",

      /* Search */
      'search.title': 'Search',
      'search.placeholder': 'Search drops, colors, styles…',
      'search.clear': 'Clear search',
      'search.close': 'Close search',
      'search.recent': 'RECENT',
      'search.popular': 'POPULAR',
      'search.results': 'RESULTS',
      'search.noResults': 'No results for "{q}".',
      'search.clearRecent': 'CLEAR',

      /* Checkout */
      'checkout.title': 'CHECKOUT',
      'checkout.step.contact': 'CONTACT',
      'checkout.step.shipping': 'SHIPPING',
      'checkout.step.payment': 'PAYMENT',
      'checkout.step.review': 'REVIEW',
      'checkout.name': 'Full name',
      'checkout.email': 'Email',
      'checkout.phone': 'Phone',
      'checkout.address': 'Address',
      'checkout.city': 'City',
      'checkout.governorate': 'Governorate',
      'checkout.notes': 'Order notes (optional)',
      'checkout.next': 'CONTINUE',
      'checkout.back': 'BACK',
      'checkout.placeOrder': 'PLACE ORDER',
      'checkout.demoNote': 'DEMO MODE — no payment will be processed. This is a UI prototype.',
      'checkout.success.title': 'ORDER RESERVED',
      'checkout.success.desc': 'This is a prototype. No real order was placed. Backend integration coming soon.',
      'checkout.success.done': 'DONE',
      'checkout.required': 'This field is required.',
      'checkout.invalidEmail': 'Please enter a valid email.',

      /* Toasts */
      'toast.added': 'ADDED TO BAG',
      'toast.wishlisted': 'SAVED TO WISHLIST',
      'toast.unwishlisted': 'REMOVED FROM WISHLIST',
      'toast.demo': 'DEMO MODE',
      'toast.demoSub': 'This is a prototype — no real action taken.',
      'toast.langChanged': 'LANGUAGE CHANGED',

      /* Language */
      'lang.switch': 'العربية',
      'lang.code': 'EN',

      /* Footer */
      'footer.rights': 'ALL RIGHTS RESERVED',
    },

    ar: {
      /* Header */
      'nav.shop': 'المتجر',
      'nav.newDrop': 'وصل حديثاً',
      'nav.world': 'العالم',
      'nav.search': 'بحث',
      'nav.bag': 'الحقيبة',
      'nav.wishlist': 'المحفوظات',
      'nav.menu': 'القائمة',
      'nav.close': 'إغلاق',

      /* Hero */
      'hero.desc.0': 'دنيم خام. قصات واسعة. مصمم ليكون مختلف.',
      'hero.desc.1': 'خياطة ناعمة مع دنيم واسع وستايل جرافيك.',
      'hero.desc.2': 'فليس تقيل. بنفسجي غامق. أساسي للمستقبل.',
      'hero.desc.3': 'تباين قوي اتعمل عشان الحركة بالليل.',
      'hero.desc.4': 'خامة أحادية اللون بحواف جرافيكية حادة.',
      'hero.desc.5': 'طقم أحمر غامق. تفاصيل نظيفة. قصة تقيلة.',
      'hero.desc.6': 'ستايل مغسول. قصة مريحة. درعك اليومي.',
      'hero.desc.7': 'طبقات رمادية ناعمة. ألوان هادية. سيلويت أقصى.',
      'hero.cta': 'تسوق اللوك ده',
      'hero.dragHint': 'اسحب للاستكشاف',
      'hero.swipe': 'اسحب',
      'hero.scroll': 'انزل تحت',
      'hero.charSelect': 'اختيار الشخصية',

      /* Drop */
      'drop.kicker': '// المتوفر حالياً',
      'drop.title': 'الإصدار.',
      'drop.subtitle': 'اختار لوك. جهّز اللوك بتاعك. خليه بتاعك.',
      'drop.filter.all': 'الكل',
      'drop.filter.denim': 'دنيم',
      'drop.filter.hoodie': 'هوديز',
      'drop.filter.set': 'أطقم',
      'drop.empty': 'مفيش لوك مطابق للفلتر ده.',
      'drop.shopLook': 'تسوق اللوك',
      'drop.viewers': '{n} بيشوفوا دلوقتي',
      'drop.lowStock': 'باقي {n} قطع بس',
      'drop.soldOut': 'خلص',
      'drop.save': 'احفظ',
      'drop.saved': 'محفوظ',

      /* Manifesto */
      'manifesto.kicker': '// بروتوكول إيغو',
      'manifesto.text': 'الواجهة هادية. الملابس هي اللي بتعمل دوشة.',
      'manifesto.word1': 'متبقاش',
      'manifesto.word2': 'زي الكل.',

      /* Newsletter */
      'newsletter.kicker': '// خليك في الدايرة',
      'newsletter.title': 'انضم للقايمة',
      'newsletter.desc': 'وصول مبكر للإصدارات. مفيش سبام. تلغي في أي وقت.',
      'newsletter.placeholder': 'your@email.com',
      'newsletter.cta': 'اشترك',
      'newsletter.success': 'بقيت في القايمة. أهلاً بيك في إيغو.',
      'newsletter.invalid': 'من فضلك اكتب إيميل صح.',
      'newsletter.alreadyIn': 'انت مشترك بالفعل.',

      /* Bag */
      'bag.title': 'حقيبتك',
      'bag.empty': 'حقيبتك فاضية.',
      'bag.emptyHint': 'اختار لوك عشان تبدأ.',
      'bag.subtotal': 'المجموع الفرعي',
      'bag.checkout': 'إتمام الشراء',
      'bag.checkoutHint': 'ضيف عنصر واحد على الأقل.',
      'bag.remove': 'شيل',
      'bag.item': 'عنصر',
      'bag.size': 'المقاس',
      'bag.qty': 'الكمية',

      /* Wishlist */
      'wishlist.title': 'المحفوظات',
      'wishlist.empty': 'مفيش حاجة محفوظة لسه.',
      'wishlist.emptyHint': 'دوس على القلب عشان تحفظ أي لوك.',
      'wishlist.moveToBag': 'انقل للحقيبة',

      /* Size modal */
      'size.title': 'اختار المقاس',
      'size.guide': 'دليل المقاسات',
      'size.error': 'من فضلك اختار مقاس عشان تكمل.',
      'size.addToBag': 'ضيف للحقيبة',

      /* Size guide */
      'guide.kicker': '// مرجع المقاسات',
      'guide.title': 'دليل المقاسات',
      'guide.desc': 'كل القياسات بالسنتيمتر. القصات واسعة — اختار مقاس أصغر لو عايز قصة أضيق.',
      'guide.size': 'المقاس',
      'guide.chest': 'الصدر',
      'guide.length': 'الطول',
      'guide.shoulder': 'الكتف',
      'guide.waist': 'الخصر',
      'guide.note': 'مش متأكد؟ كلمنا على إنستغرام @ego.eg — هنساعدك تختار.',

      /* Search */
      'search.title': 'بحث',
      'search.placeholder': 'ابحث في الإصدارات، الألوان، الستايلات…',
      'search.clear': 'امسح البحث',
      'search.close': 'اقفل البحث',
      'search.recent': 'اللي فات',
      'search.popular': 'الأكثر بحثاً',
      'search.results': 'النتايج',
      'search.noResults': 'مفيش نتايج لـ "{q}".',
      'search.clearRecent': 'امسح',

      /* Checkout */
      'checkout.title': 'إتمام الشراء',
      'checkout.step.contact': 'بيانات التواصل',
      'checkout.step.shipping': 'الشحن',
      'checkout.step.payment': 'الدفع',
      'checkout.step.review': 'المراجعة',
      'checkout.name': 'الاسم بالكامل',
      'checkout.email': 'الإيميل',
      'checkout.phone': 'رقم الموبايل',
      'checkout.address': 'العنوان',
      'checkout.city': 'المدينة',
      'checkout.governorate': 'المحافظة',
      'checkout.notes': 'ملاحظات الطلب (اختياري)',
      'checkout.next': 'كمّل',
      'checkout.back': 'ارجع',
      'checkout.placeOrder': 'أكّد الطلب',
      'checkout.demoNote': 'وضع تجريبي — مش هيتعمل أي دفع حقيقي. ده نموذج للواجهة.',
      'checkout.success.title': 'تم حجز الطلب',
      'checkout.success.desc': 'ده نموذج أولي. مفيش طلب حقيقي اتعمل. ربط الباك إند قادم قريباً.',
      'checkout.success.done': 'تمام',
      'checkout.required': 'الخانة دي مطلوبة.',
      'checkout.invalidEmail': 'من فضلك اكتب إيميل صح.',

      /* Toasts */
      'toast.added': 'اتضاف للحقيبة',
      'toast.wishlisted': 'اتحفظ في المفضلة',
      'toast.unwishlisted': 'اتشال من المفضلة',
      'toast.demo': 'وضع تجريبي',
      'toast.demoSub': 'ده نموذج أولي — مفيش إجراء حقيقي.',
      'toast.langChanged': 'اتغيرت اللغة',

      /* Language */
      'lang.switch': 'English',
      'lang.code': 'AR',

      /* Footer */
      'footer.rights': 'كل الحقوق محفوظة',
    }
  };

  let currentLang = 'en';

  function detectLang(){
    const stored = localStorage.getItem('ego.lang');
    if (stored === 'ar' || stored === 'en') return stored;
    const browser = (navigator.language || 'en').toLowerCase();
    return browser.startsWith('ar') ? 'ar' : 'en';
  }

  function t(key, vars){
    const dict = translations[currentLang] || translations.en;
    let str = dict[key] ?? translations.en[key] ?? key;
    if (vars){
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return str;
  }

  function applyTranslations(root = document){
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (el.dataset.i18nAttr){
        el.setAttribute(el.dataset.i18nAttr, val);
      } else {
        el.textContent = val;
      }
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    // Also update lang switcher label
    document.querySelectorAll('[data-lang-label]').forEach(el => {
      el.textContent = t('lang.switch');
    });
    document.querySelectorAll('[data-lang-code]').forEach(el => {
      el.textContent = t('lang.code');
    });
  }

  function setLang(lang){
    if (lang !== 'ar' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('ego.lang', lang);
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('is-rtl', lang === 'ar');
    applyTranslations();
    document.dispatchEvent(new CustomEvent('ego:langchange', { detail: { lang } }));
  }

  function initLang(){
    currentLang = detectLang();
    const html = document.documentElement;
    html.lang = currentLang;
    html.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('is-rtl', currentLang === 'ar');
    applyTranslations();
  }

  function toggleLang(){
    setLang(currentLang === 'en' ? 'ar' : 'en');
  }

  window.EGOi18n = {
    t, setLang, getLang: () => currentLang, toggleLang,
    applyTranslations, initLang,
  };
})(window);