/* ==========================================================================
   הסטודיו של תמימה — נתוני דמו (Mock Data, ללא באקאנד)
   ========================================================================== */

const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const MONTH_NAMES = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}
function fmtDate(d) {
  return `${d.getDate()} ב${MONTH_NAMES[d.getMonth()]}`;
}
function fmtDateShort(d) {
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
}
function daysBetween(a, b) {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((db - da) / 86400000);
}

const TODAY = new Date();

/* --- זרימת לקוח: סדנת קרמיקה --- */
const WORKSHOP = {
  title: 'סדנת קרמיקה על האובניים',
  subtitle: 'שעה אובניים + שעה עבודת יד · לזוגות ולקבוצות',
  duration: '2 שעות',
  pricePerPerson: 220,
  maxParticipants: 6,
  location: 'הסטודיו של תמימה, קמפוס האוניברסיטה העברית, ירושלים',
};

/* חלון הזמנה של 4 ימים קדימה (בהתאם למה שנבדק בדמו, ראו קובץ 04) */
const AVAILABILITY = [
  { offset: 0, slots: ['17:00', '19:30'] },
  { offset: 1, slots: ['10:00', '16:00', '18:30', '20:30'] },
  { offset: 2, slots: [] }, // יום ללא זמינות — להדגמת מסך "אין שעות פנויות"
  { offset: 3, slots: ['09:30', '11:00', '17:30'] },
].map(d => ({
  date: addDays(TODAY, d.offset),
  offset: d.offset,
  slots: d.slots,
}));

/* משבצות "חלופיות" שמוצגות ב-Slot Picker כשמשבצת שנבחרה כבר נתפסה */
function nextAvailableSlots(excludeOffset, excludeTime, count = 3) {
  const out = [];
  for (const day of AVAILABILITY) {
    for (const t of day.slots) {
      if (day.offset === excludeOffset && t === excludeTime) continue;
      out.push({ date: day.date, offset: day.offset, time: t });
      if (out.length >= count) return out;
    }
  }
  return out;
}

/* --- אפליקציית סטודנטים: תלמידה לדוגמה --- */
const CURRENT_STUDENT = {
  name: 'נועה כהן',
  phone: '050-1234567',
  absencesThisMonth: 0,
  maxAbsencesPerMonth: 1,
  paymentStatus: 'שולם',
  nextLesson: { date: addDays(TODAY, 2), time: '18:00', teacher: 'תמימה' },
  packageProgress: { used: 2, total: 4 },
};

const MY_LESSONS = [
  { date: addDays(TODAY, 2), time: '18:00', status: 'upcoming' },
  { date: addDays(TODAY, 9), time: '18:00', status: 'upcoming' },
  { date: addDays(TODAY, 16), time: '18:00', status: 'upcoming' },
  { date: addDays(TODAY, -5), time: '18:00', status: 'done' },
  { date: addDays(TODAY, -12), time: '18:00', status: 'done' },
  { date: addDays(TODAY, -19), time: '18:00', status: 'missed-late' },
  { date: addDays(TODAY, -26), time: '18:00', status: 'done' },
];

const MY_PAYMENTS = [
  { date: addDays(TODAY, -3), amount: 720, method: 'הוראת קבע', status: 'שולם', doc: 'חשבונית + קבלה #4821' },
  { date: addDays(TODAY, -31), amount: 720, method: 'הוראת קבע', status: 'שולם', doc: 'חשבונית + קבלה #4715' },
  { date: addDays(TODAY, -59), amount: 720, method: 'כרטיס אשראי', status: 'שולם', doc: 'חשבונית + קבלה #4602' },
];

/* מועדי השלמה זמינים בחודש התוקף (לביטול עם 24h+ הודעה) */
function makeupOptions() {
  return [
    { date: addDays(TODAY, 4), time: '17:00' },
    { date: addDays(TODAY, 6), time: '19:30' },
    { date: addDays(TODAY, 11), time: '18:00' },
  ];
}

/* --- צד ניהול: דשבורד --- */
const ADMIN_KPI = {
  monthRevenue: 18450,
  activeStudents: 15,
  workshopsThisMonth: 12,
  studioCapacityToday: { used: 4, total: 6 }, // 6 אובניים בסך הכל בסטודיו (ראו קובץ 00) — לא 12
  marketingCost: null, // placeholder — טרם נבנה דוח מפורט (ראו קובץ 04)
};

/* אין כאן רשימת "ממתין לך עכשיו" נפרדת בכוונה — היא נגזרת ב-app.js מתוך
   ADMIN_STUDENTS ו-state.adminWorkshops, כדי שלא תוכל להתפצל מהמקור האמיתי
   (זה בדיוק המקום שבו נתונים כפולים "נשברים" כשמחברים באק-אנד אמיתי). */

const ADMIN_TODAY = [
  { time: '10:00', name: 'קבוצת גן ילדים — יום הולדת', kind: 'סדנה', participants: 6 },
  { time: '16:00', name: 'שיעור קבוע — נועה כהן', kind: 'שיעור', participants: 1 },
  { time: '18:30', name: 'זוג — יובל ומאיה', kind: 'סדנה', participants: 2 },
  { time: '20:30', name: 'שיעור קבוע — עדן שרון', kind: 'שיעור', participants: 1 },
];

const ADMIN_WORKSHOPS = [
  { id: 1, name: 'קבוצת גן ילדים — יום הולדת', date: addDays(TODAY, 0), time: '10:00', participants: 6, source: 'בסלון', receipt: 'manual', amount: 1320 },
  { id: 2, name: 'זוג — יובל ומאיה', date: addDays(TODAY, 0), time: '18:30', participants: 2, source: 'וואטסאפ', receipt: 'auto', amount: 440 },
  { id: 3, name: 'משפחת אברג׳יל', date: addDays(TODAY, -1), time: '18:00', participants: 5, source: 'בסלון', receipt: 'manual', amount: 1100 },
  { id: 4, name: 'רועי ודנה', date: addDays(TODAY, -1), time: '09:20', participants: 2, source: 'בסלון', receipt: 'manual', amount: 440 },
  { id: 5, name: 'ימי הולדת — קבוצת נריה', date: addDays(TODAY, 1), time: '17:00', participants: 4, source: 'וואטסאפ', receipt: 'auto', amount: 880 },
  { id: 6, name: 'קבוצת רווקות — שירה', date: addDays(TODAY, 3), time: '19:00', participants: 6, source: 'בסלון', receipt: 'pending', amount: 1320 },
];

const ADMIN_STUDENTS = [
  { name: 'שירה לוי', status: 'ממתינה לתשלום', urgent: true, lessons: '3/4', absences: 0, phone: '050-2221111' },
  { name: 'נועה כהן', status: 'שולם', urgent: false, lessons: '2/4', absences: 0, phone: '050-1234567' },
  { name: 'עדן שרון', status: 'שולם', urgent: false, lessons: '1/4', absences: 1, phone: '050-3332222' },
  { name: 'יעל אבידור', status: 'שולם', urgent: false, lessons: '4/4', absences: 0, phone: '052-4443333' },
  { name: 'טל ברקוביץ', status: 'ממתין לתשלום', urgent: true, lessons: '0/4', absences: 0, phone: '054-5554444' },
  { name: 'מאיה גולן', status: 'שולם', urgent: false, lessons: '3/4', absences: 0, phone: '050-6665555' },
  { name: 'איתי נבון', status: 'שולם', urgent: false, lessons: '2/4', absences: 1, phone: '053-7776666' },
  { name: 'רותם שגיא', status: 'שולם', urgent: false, lessons: '1/4', absences: 0, phone: '050-8887777' },
  { name: 'דנה פרץ', status: 'שולם', urgent: false, lessons: '4/4', absences: 0, phone: '052-9998888' },
  { name: 'אור מזרחי', status: 'שולם', urgent: false, lessons: '2/4', absences: 0, phone: '054-1112222' },
  { name: 'ליה שרעבי', status: 'שולם', urgent: false, lessons: '3/4', absences: 0, phone: '050-3334444' },
  { name: 'גיא רוזן', status: 'שולם', urgent: false, lessons: '1/4', absences: 0, phone: '053-5556666' },
  { name: 'נעמי כץ', status: 'שולם', urgent: false, lessons: '4/4', absences: 1, phone: '050-7778888' },
  { name: 'עומר ששון', status: 'שולם', urgent: false, lessons: '2/4', absences: 0, phone: '052-9990000' },
  { name: 'הדר וייס', status: 'שולם', urgent: false, lessons: '3/4', absences: 0, phone: '054-1230000' },
];

/* מחיר קבוע לחישוב קבלה ידנית — נגזר מ-WORKSHOP.pricePerPerson כדי שלא יוכל
   להתפצל ממנו (מסך עדכון מחיר נפרד טרם קיים, ראו קובץ 02) */
const FIXED_WORKSHOP_PRICE = WORKSHOP.pricePerPerson;
