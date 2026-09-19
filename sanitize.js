/* =========================================================
   EGO — Input Sanitization & Validation Layer
   كل input من اليوزر لازم يعدي من هنا قبل ما يتحط في DOM أو
   يتخزن في localStorage أو يتقرأ من URL.
   ========================================================= */
window.EGOSanitize = (function(){
  'use strict';

  /* =========================================================
     الحدود القصوى لكل حقل
     ========================================================= */
  const MAX = {
    email:       254,
    name:        100,
    phone:       20,
    address:     200,
    city:        50,
    governorate: 50,
    notes:       500,
    search:      100,
    param:       100,
    color:       30,
    size:        10,
    productId:   50,
    lookId:      50,
    mood:        20,
    category:    20
  };

  /* =========================================================
     1) HTML escape — أي حاجة هتتحط في innerHTML
     ========================================================= */
  function escapeHtml(str){
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  /* =========================================================
     2) إزالة control characters (null bytes, backspace, إلخ)
     ========================================================= */
  function stripControl(str){
    if (typeof str !== 'string') return '';
    // eslint-disable-next-line no-control-regex
    return str.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
  }

  /* =========================================================
     3) تنظيف نص عادي (اسم، مدينة، إلخ)
     ========================================================= */
  function cleanString(str, maxLen = MAX.name){
    if (typeof str !== 'string') return '';
    return stripControl(str)
      .replace(/\s+/g, ' ')     // مسافات متعددة → مسافة واحدة
      .trim()
      .slice(0, maxLen);
  }

  /* =========================================================
     4) تنظيف نص متعدد السطور (notes)
     ========================================================= */
  function cleanMultiline(str, maxLen = MAX.notes){
    if (typeof str !== 'string') return '';
    return stripControl(str)
      .replace(/[^\S\n]+/g, ' ')  // مسافات بدون newlines
      .replace(/\n{3,}/g, '\n\n')  // 3 newlines → 2
      .trim()
      .slice(0, maxLen);
  }

  /* =========================================================
     5) تنظيف URL param — بس حروف وأرقام وشرطات
     ========================================================= */
  function cleanParam(str, maxLen = MAX.param){
    if (typeof str !== 'string') return '';
    return str.replace(/[^\w\s\-\.]/g, '').trim().slice(0, maxLen);
  }

  /* =========================================================
     6) تنظيف slug — للحاجات زي mood و category
     ========================================================= */
  function cleanSlug(str, maxLen = 50){
    if (typeof str !== 'string') return '';
    return str.toLowerCase().replace(/[^a-z0-9\-_]/g, '').slice(0, maxLen);
  }

  /* =========================================================
     7) التحقق من الإيميل (RFC-basic)
     ========================================================= */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function isValidEmail(str){
    if (typeof str !== 'string') return false;
    const trimmed = str.trim().toLowerCase();
    if (trimmed.length < 5 || trimmed.length > MAX.email) return false;
    return EMAIL_RE.test(trimmed);
  }

  /* =========================================================
     8) التحقق من رقم التليفون (يقبل +20 والمسافات والشرطات)
     ========================================================= */
  const PHONE_RE = /^[\+]?[\d\s\-\(\)]{7,20}$/;
  function isValidPhone(str){
    if (typeof str !== 'string') return false;
    const digitsOnly = str.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) return false;
    return PHONE_RE.test(str.trim());
  }

  /* =========================================================
     9) التحقق من إن القيمة موجودة في قائمة مسموحة
     ========================================================= */
  function isAllowed(str, allowedList){
    if (typeof str !== 'string') return false;
    if (!Array.isArray(allowedList)) return false;
    return allowedList.includes(str);
  }

  /* =========================================================
     10) تنقية array من localStorage — نتحقق من كل عنصر
     ========================================================= */
  function safeArray(arr, validator, maxItems = 100){
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => {
      try { return validator(item); } catch { return false; }
    }).slice(0, maxItems);
  }

  /* =========================================================
     11) قراءة آمنة من localStorage
     ========================================================= */
  function safeReadJSON(key, fallback, validator){
    try {
      const raw = localStorage.getItem(key);
      if (!raw || raw.length > 100000) return fallback;  // 100KB حد أقصى
      const parsed = JSON.parse(raw);
      if (typeof validator === 'function' && !validator(parsed)) return fallback;
      return parsed;
    } catch {
      return fallback;
    }
  }

  /* =========================================================
     12) كتابة آمنة في localStorage
     ========================================================= */
  function safeWriteJSON(key, value){
    try {
      const str = JSON.stringify(value);
      if (str.length > 100000) return false;  // حد أقصى 100KB
      localStorage.setItem(key, str);
      return true;
    } catch {
      return false;
    }
  }

  /* =========================================================
     13) Rate limiter — يمنع spam على input/search
     ========================================================= */
  function createRateLimiter(maxPerWindow = 5, windowMs = 1000){
    const timestamps = [];
    return function(){
      const now = Date.now();
      while (timestamps.length && now - timestamps[0] > windowMs) timestamps.shift();
      if (timestamps.length >= maxPerWindow) return false;
      timestamps.push(now);
      return true;
    };
  }

  /* =========================================================
     14) التحقق من بيانات checkout
     ========================================================= */
  function validateCheckoutData(data){
    const errors = {};
    const cleaned = {
      name:        cleanString(data.name,        MAX.name),
      email:       cleanString(data.email,       MAX.email).toLowerCase(),
      phone:       cleanString(data.phone,       MAX.phone),
      address:     cleanString(data.address,     MAX.address),
      city:        cleanString(data.city,        MAX.city),
      governorate: cleanString(data.governorate, MAX.governorate),
      notes:       cleanMultiline(data.notes,    MAX.notes)
    };

    if (!cleaned.name || cleaned.name.length < 2) errors.name = 'required';
    if (!isValidEmail(cleaned.email))             errors.email = 'invalid';
    if (!isValidPhone(cleaned.phone))             errors.phone = 'invalid';
    if (!cleaned.address || cleaned.address.length < 5) errors.address = 'required';
    if (!cleaned.city || cleaned.city.length < 2) errors.city = 'required';
    if (!cleaned.governorate || cleaned.governorate.length < 2) errors.governorate = 'required';

    return {
      valid: Object.keys(errors).length === 0,
      errors,
      cleaned
    };
  }

  /* =========================================================
     15) التحقق من عنصر في السلة (من localStorage)
     ========================================================= */
  function isValidBagItem(item){
    if (!item || typeof item !== 'object') return false;
    if (typeof item.id !== 'string' || item.id.length === 0 || item.id.length > MAX.productId) return false;
    if (typeof item.color !== 'string' || item.color.length > MAX.color) return false;
    if (typeof item.size !== 'string' || item.size.length > MAX.size) return false;
    if (typeof item.qty !== 'number' || item.qty < 1 || item.qty > 99) return false;
    if (!Number.isInteger(item.qty)) return false;
    return true;
  }

  function isValidWishlistItem(item){
    if (!item || typeof item !== 'object') return false;
    if (typeof item.id !== 'string' || item.id.length === 0 || item.id.length > MAX.productId) return false;
    if (typeof item.color !== 'string' || item.color.length > MAX.color) return false;
    return true;
  }

  function isValidRecentId(id){
    return typeof id === 'string' && id.length > 0 && id.length <= MAX.productId;
  }

  /* =========================================================
     16) تنظيف أي كائن — يمنع __proto__ pollution
     ========================================================= */
  function safeObject(obj){
    if (!obj || typeof obj !== 'object') return {};
    const out = {};
    for (const key in obj){
      if (Object.prototype.hasOwnProperty.call(obj, key)){
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
        out[key] = obj[key];
      }
    }
    return out;
  }

  /* =========================================================
     Exports
     ========================================================= */
  return {
    MAX,
    escapeHtml,
    stripControl,
    cleanString,
    cleanMultiline,
    cleanParam,
    cleanSlug,
    isValidEmail,
    isValidPhone,
    isAllowed,
    safeArray,
    safeReadJSON,
    safeWriteJSON,
    createRateLimiter,
    validateCheckoutData,
    isValidBagItem,
    isValidWishlistItem,
    isValidRecentId,
    safeObject
  };
})();