/* ==========================================================================
   Motion FX — שכבת שיפור פרוגרסיבי מעל האנימציות ב-CSS, באמצעות Motion.dev
   (הספרייה היורשת של Framer Motion, בגרסת ה-JS הווניל שלה — בלי React,
   בלי build step, טעינה ישירה מ-CDN).

   עיקרון: הכל כאן הוא תוספת. אם הרשת לא זמינה, אם prefers-reduced-motion
   פעיל, או אם טעינת הספרייה נכשלת — האתר ממשיך לעבוד בדיוק כמו קודם עם
   האנימציות ב-CSS. שום דבר לא *תלוי* בקובץ הזה.

   נטען אחרון (אחרי app.js) ומשפר במקום:
   1. מעברי מסך — spring אמיתי במקום CSS keyframes קבועים
   2. ריחוף שכבות הרקע — spring loop אמיתי במקום ease-in-out ליניארי
   3. סימן ✓ בהצלחה — ציור SVG אמיתי (stroke draw-on) במקום גופן אייקון
   4. משוב לחיצה — spring אחיד על כל משטח לחיץ באתר
   ========================================================================== */

(async () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let animate, stagger;
  try {
    ({ animate, stagger } = await import('https://cdn.jsdelivr.net/npm/motion@13.4.0/+esm'));
  } catch (e) {
    return; // הרשת לא זמינה / חסימה — נופלים בחזרה ל-CSS הקיים, בלי שגיאה
  }

  const SPRING = { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 };
  const SPRING_PRESS = { type: 'spring', stiffness: 520, damping: 32 };
  const EASE = [0.22, 1, 0.36, 1];

  /* -------------------------------------------------------------------- */
  /* 1. מעברי מסך — רק בזרימות הנייד הליניאריות (לקוח/סטודנט).            */
  /*    צד הניהול משתמש בדפוס fade-בלבד משלו ונשאר כמו שהוא.              */
  /* -------------------------------------------------------------------- */
  if (typeof window.goToScreen === 'function') {
    const baseGoToScreen = window.goToScreen;
    window.goToScreen = function (appId, screenId, dir = 'forward', isReset = false) {
      baseGoToScreen(appId, screenId, dir, isReset);
      if (appId !== 'client' && appId !== 'student') return;

      const root = document.getElementById('app-' + appId);
      const active = root && root.querySelector('.screen.is-active');
      if (!active) return;

      // ה-CSS כבר הוסיף enter-forward/enter-back; מנטרלים כדי שה-spring
      // ישתלט בלי "התכתשות" על אותה תכונת transform.
      active.classList.remove('enter-forward', 'enter-back');
      const fromX = dir === 'back' ? 28 : -28;
      animate(active,
        { opacity: [0, 1], x: [fromX, 0] },
        { duration: 0.5, ease: EASE }
      );

      drawSuccessIcon(active);
    };
  }

  /* -------------------------------------------------------------------- */
  /* 2. ריחוף שכבות הרקע — spring loop אמיתי במקום ה-CSS keyframes        */
  /* -------------------------------------------------------------------- */
  document.querySelectorAll('.strata-drift').forEach(el => {
    const cs = getComputedStyle(el);
    const dx = parseFloat(cs.getPropertyValue('--dx')) || 0;
    const dy = parseFloat(cs.getPropertyValue('--dy')) || 0;
    const dur = parseFloat(cs.getPropertyValue('--dur')) || 30;
    el.style.animation = 'none'; // מוסר את ה-CSS, ה-JS לוקח את ההגה מכאן
    animate(el,
      { x: [0, dx, 0], y: [0, dy, 0] },
      { duration: dur, repeat: Infinity, ease: 'easeInOut' }
    );
  });

  /* -------------------------------------------------------------------- */
  /* 3. סימן הצלחה — ציור SVG אמיתי (stroke-dashoffset) בכל פעם שמגיעים   */
  /*    למסך עם .success-check-path                                       */
  /* -------------------------------------------------------------------- */
  function drawSuccessIcon(scope) {
    const path = scope.querySelector('.success-check-path');
    const circle = scope.querySelector('.success-icon');
    if (!path || !circle) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    animate(circle, { scale: [0.7, 1], opacity: [0, 1] }, SPRING);
    animate(path, { strokeDashoffset: [len, 0] }, { duration: 0.5, ease: EASE, delay: 0.18 });
  }
  // מסך הצלחה ראשון (c4) עשוי להיות פעיל כבר בטעינה בהדגמות ידניות — נסרוק פעם אחת
  document.querySelectorAll('.screen.is-active').forEach(drawSuccessIcon);

  /* -------------------------------------------------------------------- */
  /* 4. משוב לחיצה אחיד — spring במקום קפיצת scale מיידית של ה-CSS        */
  /* -------------------------------------------------------------------- */
  const PRESSABLE = '.btn, .select-row, .chip, .hub-row, .stepper-btn, ' +
    '.icon-btn, .bottom-nav .nav-btn, .admin-bottom-nav .nav-btn, ' +
    '.admin-nav-item, .exit-btn, .view-toggle';

  document.addEventListener('pointerdown', e => {
    const t = e.target.closest(PRESSABLE);
    if (t) animate(t, { scale: 0.965 }, SPRING_PRESS);
  });
  const release = e => {
    const t = e.target.closest(PRESSABLE);
    if (t) animate(t, { scale: 1 }, SPRING);
  };
  document.addEventListener('pointerup', release);
  document.addEventListener('pointercancel', release);
})();
