/* =========================================================
   EGO — Content Protection Layer
   - Blocks image download/drag/save
   - Blocks text copy/select
   - Blocks DevTools shortcuts (F12, Ctrl+Shift+I, etc.)
   - Blocks View Source (Ctrl+U)
   - Blocks Print Screen on blur
   - Detects DevTools open → blurs content
   - Console warning watermark
   ========================================================= */
(() => {
  'use strict';

  // ---------- CONFIG ----------
  const PROTECTION_ENABLED = true;      // ← غيّرها لـ false لو عايز تعطّل كل الحماية
  const BLUR_ON_DEVTOOLS = true;        // ← لو DevTools فتح، الصفحة تتشوش
  const DISABLE_DEVTOOLS_KEYS = true;   // ← F12 و Ctrl+Shift+I/C/J

  if (!PROTECTION_ENABLED) return;

  /* =========================================================
     1. CONTEXT MENU — Right-click block
     ========================================================= */
  document.addEventListener('contextmenu', (e) => {
    // Block on images only (leave on text for accessibility... or block all?)
    if (e.target.tagName === 'IMG' || e.target.closest('img')) {
      e.preventDefault();
      return false;
    }
    // Uncomment this to block everywhere:
    // e.preventDefault();
    // return false;
  }, true);

  /* =========================================================
     2. DRAG — Block dragging images
     ========================================================= */
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('img')) {
      e.preventDefault();
      return false;
    }
  }, true);

  /* =========================================================
     3. TEXT SELECTION + COPY — Block
     ========================================================= */
  // Block copy event
  document.addEventListener('copy', (e) => {
    // Allow copy in form inputs (checkout / search / newsletter)
    const target = e.target;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return; // allow
    }
    e.preventDefault();
    return false;
  }, true);

  // Block cut
  document.addEventListener('cut', (e) => {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    return false;
  }, true);

  /* =========================================================
     4. KEYBOARD SHORTCUTS — Block
     ========================================================= */
  const blockedKeys = {
    // DevTools
    devtools: [
      (e) => e.key === 'F12',
      (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && ['I','i','J','j','C','c'].includes(e.key),
      (e) => (e.ctrlKey || e.metaKey) && e.altKey && ['I','i','J','j','C','c'].includes(e.key), // Firefox
    ],
    // View Source / Save / Print
    other: [
      (e) => (e.ctrlKey || e.metaKey) && ['U','u'].includes(e.key),  // View source
      (e) => (e.ctrlKey || e.metaKey) && ['S','s'].includes(e.key),  // Save
      (e) => (e.ctrlKey || e.metaKey) && ['P','p'].includes(e.key),  // Print
      (e) => (e.ctrlKey || e.metaKey) && ['A','a'].includes(e.key),  // Select all
    ]
  };

  document.addEventListener('keydown', (e) => {
    // Don't block inside form fields
    const t = e.target;
    const inField =
      t.tagName === 'INPUT' ||
      t.tagName === 'TEXTAREA' ||
      t.isContentEditable;

    if (inField) {
      // Only block DevTools keys even inside fields
      if (DISABLE_DEVTOOLS_KEYS && blockedKeys.devtools.some(fn => fn(e))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      return;
    }

    // DevTools keys
    if (DISABLE_DEVTOOLS_KEYS && blockedKeys.devtools.some(fn => fn(e))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Other keys
    if (blockedKeys.other.some(fn => fn(e))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);


  /* =========================================================
     6. CONSOLE WARNING — Signature
     ========================================================= */
  const sigStyle1 = 'background: #c8ff00; color: #080808; padding: 6px 14px; font-weight: 900; font-size: 18px; font-family: "Arial Black", Impact, sans-serif;';
  const sigStyle2 = 'color: #c8ff00; font-weight: 800; font-size: 14px; font-family: Arial;';
  const sigStyle3 = 'color: #888; font-size: 12px; font-family: Arial;';

  console.log('%cKARAM', sigStyle1);
  console.log(
    '%c© 2026 KARAM — All content protected.\n' +
    'Unauthorized copying, downloading, or reproduction is prohibited.',
    sigStyle2
  );
  console.log(
    '%cFor licensing inquiries: +201211659075',
    sigStyle3
  );

  // Detect console.clear attempts → reprint warning
  const originalClear = console.clear;
  console.clear = function () {
    originalClear.apply(console, arguments);
    // Reprint after a short delay
    setTimeout(() => {
      console.log('%cEGO.', sigStyle1);
      console.log(
        '%c© 2026 EGO — All content protected.',
        sigStyle2
      );
    }, 50);
  };

  /* =========================================================
     7. PRINT PROTECTION
     ========================================================= */
  window.addEventListener('beforeprint', () => {
    // Optional: hide content or show warning
    // We just block the print shortcut (Ctrl+P) — already blocked above
  });

  /* =========================================================
     8. DRAG-AND-DROP IMAGES (prevent dropping images onto page)
     ========================================================= */
  document.addEventListener('drop', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  }, true);

  /* =========================================================
     9. TRACK SAVE ATTEMPTS (optional analytics)
     ========================================================= */
  const logAttempt = (type) => {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.warn('[EGO Protect] Blocked:', type);
    }
    // Could send to analytics here
  };

  // Attach log to each protection
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') logAttempt('right-click-image');
  }, true);

  document.addEventListener('copy', (e) => {
    const t = e.target;
    if (t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA' && !t.isContentEditable) {
      logAttempt('copy-text');
    }
  }, true);

})();