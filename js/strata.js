/* ==========================================================================
   Strata — רקעי "שכבות טין"
   כל במה מקבלת שדה קווי-מתאר אורגני משלה, בנוי דינמית כדי לא לנפח את ה-HTML.
   השראה: חתך רוחב של גוש חימר, עץ מגולף, וחריטת גלים בחול.
   ========================================================================== */

/* רכסים — viewBox 1200×900, נמתחים אל מחוץ למסגרת כדי שיהיה מרווח לריחוף */
const STRATA_CRESTS = [
  { y: 90,  d: 'M-150,90 C120,40 380,150 640,110 C900,70 1120,170 1350,130' },
  { y: 195, d: 'M-150,195 C150,140 400,255 660,215 C920,175 1130,270 1350,230' },
  { y: 300, d: 'M-150,300 C100,245 420,360 640,320 C880,280 1150,375 1350,335' },
  { y: 400, d: 'M-150,400 C170,345 390,460 670,420 C930,380 1120,470 1350,435' },
  { y: 505, d: 'M-150,505 C130,450 430,565 650,525 C890,485 1140,580 1350,540' },
  { y: 605, d: 'M-150,605 C160,550 400,665 680,625 C920,585 1130,675 1350,640' },
  { y: 710, d: 'M-150,710 C110,655 440,770 660,730 C900,690 1150,785 1350,745' },
  { y: 810, d: 'M-150,810 C180,755 390,870 670,830 C930,790 1120,880 1350,845' },
];

/* פלטות — לכל שכבה: [גרדיאנט עליון, גרדיאנט תחתון, צבע קו-האור, עוצמת קו-האור] */
const STRATA_PALETTES = {
  /* האב — אגוז מגולף באור ענבר */
  ink: {
    base: '#150E0A',
    layers: [
      ['#2A1B11', '#1B110A', '#8A5A2E', 0.30],
      ['#37230F', '#221507', '#A8692F', 0.34],
      ['#482C12', '#2A1A0B', '#C07C36', 0.38],
      ['#5C3814', '#35200C', '#D68F42', 0.42],
      ['#734517', '#40270E', '#E8A254', 0.46],
      ['#8B541B', '#4E2F10', '#F2B268', 0.48],
      ['#A3621C', '#5B3711', '#F7C07E', 0.46],
      ['#BB7220', '#693F13', '#FBCE94', 0.42],
    ],
  },
  /* זרימת הלקוח — לוח חימר בשכבות טרקוטה */
  clay: {
    base: '#F3E9D9',
    layers: [
      ['#EFE3D0', '#E5D6BF', '#FFFAF0', 0.75],
      ['#E9D8C0', '#DCC8AA', '#FCF4E6', 0.70],
      ['#E0C9A9', '#D0B48F', '#F8EDDB', 0.65],
      ['#D5B68E', '#C29C72', '#F2E2C9', 0.60],
      ['#C79F72', '#B08355', '#ECD6B4', 0.55],
      ['#B8874F', '#9E6B3C', '#E4C79B', 0.50],
      ['#A96F38', '#8C5528', '#DBB782', 0.45],
      ['#9A5A28', '#7A441C', '#D2A96E', 0.42],
    ],
  },
  /* אפליקציית הסטודנטים — חריטת גלים בחול, עם שתי שכבות זיגוג מרווה */
  sand: {
    base: '#F1E8D6',
    layers: [
      ['#EDE3CE', '#E6DAC1', '#FFFBF2', 0.70],
      ['#E8DCC0', '#DFD0AE', '#FCF6E8', 0.65],
      ['#D9DCC2', '#C8CDAB', '#F4F6E6', 0.60],
      ['#DFD0AC', '#D2BF93', '#F6ECD6', 0.55],
      ['#D6C49A', '#C6AF7F', '#F0E2C5', 0.50],
      ['#C8CCAE', '#B4BA96', '#EAEEDC', 0.50],
      ['#CDB78A', '#B9A06E', '#E8D6B2', 0.45],
      ['#C1A97C', '#AC9161', '#E0CBA2', 0.42],
    ],
  },
  /* צד הניהול — כמעט שטוח בכוונה, שלא יתחרה בנתונים */
  quiet: {
    base: '#F4F2ED',
    layers: [
      ['#F1EFE9', '#ECEAE3', '#FFFFFF', 0.50],
      ['#EDEBE4', '#E7E4DC', '#FCFBF7', 0.45],
      ['#E9E6DE', '#E2DFD6', '#FAF8F4', 0.40],
      ['#E5E2D9', '#DDDACF', '#F7F5F0', 0.35],
      ['#E1DDD3', '#D8D4C9', '#F4F2EC', 0.30],
      ['#DDD8CD', '#D3CFC2', '#F1EEE8', 0.28],
      ['#D8D3C6', '#CEC9BB', '#EDEAE3', 0.25],
      ['#D4CEC0', '#C9C3B4', '#E9E5DD', 0.22],
    ],
  },
};

/* ריחוף — כל שכבה נעה במהירות וכיוון שונים, כדי שהשדה "ינשום" */
function driftFor(i) {
  const dir = i % 2 === 0 ? 1 : -1;
  return {
    dx: (dir * (7 + i * 2.2)).toFixed(1) + 'px',
    dy: (-4 - i * 1.1).toFixed(1) + 'px',
    dur: (38 - i * 1.6).toFixed(1) + 's',
    delay: (-i * 2.7).toFixed(1) + 's',
  };
}

function buildStrata(name) {
  const palette = STRATA_PALETTES[name];
  if (!palette) return '';

  let defs = '';
  let body = '';

  STRATA_CRESTS.forEach((crest, i) => {
    const [top, bottom, highlight, hlOpacity] = palette.layers[i];
    const gid = `sg-${name}-${i}`;
    const drift = driftFor(i);

    defs += `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse"
      x1="0" y1="${crest.y - 15}" x2="0" y2="${crest.y + 150}">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>`;

    body += `<g class="strata-rise" style="animation-delay:${70 * i}ms">
      <g class="strata-drift" style="--dx:${drift.dx};--dy:${drift.dy};--dur:${drift.dur};animation-delay:${drift.delay}">
        <path d="${crest.d} L1350,1000 L-150,1000 Z" fill="url(#${gid})"/>
        <path d="${crest.d}" fill="none" stroke="${highlight}"
              stroke-opacity="${hlOpacity}" stroke-width="2" stroke-linecap="round"/>
      </g>
    </g>`;
  });

  return `<svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs>${defs}</defs>
    <rect x="-150" y="-100" width="1500" height="1200" fill="${palette.base}"/>
    ${body}
  </svg>`;
}

document.querySelectorAll('[data-strata]').forEach(el => {
  el.innerHTML = buildStrata(el.dataset.strata);
});
