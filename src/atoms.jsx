import { useState, useEffect, useRef } from 'react';

/* REGION 1 · SHARED ATOMS — design tokens, icon factory, base primitives.
   Edit here = changes propagate to all regions. */

/* ─── Typography ──────────────────────────────────────────────── */
const BODY = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";
const MONO = "'SF Mono', 'Fira Code', monospace";

/* ─── Brand constants (constant across all skins) ─────────────── */
const ACCENT     = '#FFAB0D';
const ACCENT_INK = '#FCF8F5';
const DANGER     = '#E07A5F';
const SUCCESS    = '#5CB88A';

/* ─── Motion system — Master Guideline §2, §4 ─────────────────────
   Three canonical easing/duration pairs. Every transition in the app
   uses one of these — no arbitrary timings. The physics curve is the
   default; quick is for hover/focus states, deliberate is for mounts
   and structural reveals.
   Reference: cubic-bezier(0.16, 1, 0.3, 1) is "easeOutExpo-like" —
   physics-based, decelerates naturally, never overshoots.
   ───────────────────────────────────────────────────────────────── */
const EASE_PHYSICS    = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_QUICK      = `200ms ${EASE_PHYSICS}`;       // hover, focus
const EASE_DELIBERATE = `400ms ${EASE_PHYSICS}`;       // mount, transition
const EASE_SLOW       = `600ms ${EASE_PHYSICS}`;       // page-level reveal

/* ─── Skin palette — 4 variants, one source of truth ──────────── */
const SKINS = {
  pale: {
    name: 'Pale White',
    pageBg: '#F5F5F5', pageGrad: null,
    railBg: '#FFFFFF', canvasBg: '#FFFFFF', topBarBg: '#FFFFFF', rightBg: '#FFFFFF',
    ink: '#131313', ink2: '#2C2C2C', ink3: '#727272', ink4: '#C8C8C8',
    inkSoft: 'rgba(41, 41, 58, 0.23)',
    border: 'rgba(0,0,0,0.05)', borderMd: 'rgba(0,0,0,0.10)',
    pillBg: '#F8F6F5', pillInk: '#727272',
    activeTabBg: '#F5F5F5', activeTabInk: '#000000',
    dockBg: '#FFFFFF', dockBorder: 'rgba(0,0,0,0.05)',
    dockShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    cardShadow: '0 1px 4px rgba(0,0,0,0.04)',
    panelShadow: '0 4px 4px rgba(0,0,0,0.04)',
    dividerInk: 'rgba(0,0,0,0.06)', breadcrumb: '#000000',
    inputBg: '#F5F5F5', micBg: '#1C1C1C', micInk: '#FFFFFF',
    cardBg: '#FFFFFF', cardBgAlt: '#F5F5F5',
    modalScrim: 'rgba(20, 18, 16, 0.45)', modalScrimSoft: 'rgba(20, 18, 16, 0.18)',
    catOchre: '#C77C2C', catMauve: '#A65A8C', catGreen: '#5A8C6A',
    catBlue: '#5B7FA6', catTan: '#8C7A5A', catGrey: '#9C9A92',
  },
  silver: {
    name: 'Silver',
    pageBg: '#EFEEEA', pageGrad: null,
    railBg: '#F9F8F6', canvasBg: '#F2F1EE', topBarBg: '#F9F8F6', rightBg: '#F9F8F6',
    ink: '#141414', ink2: '#2C2C2C', ink3: '#73726C', ink4: '#A8A8A3',
    inkSoft: 'rgba(20, 20, 20, 0.22)',
    border: 'rgba(15,14,12,0.06)', borderMd: 'rgba(15,14,12,0.13)',
    pillBg: '#F1EFEC', pillInk: '#727272',
    activeTabBg: '#F9F8F6', activeTabInk: '#000000',
    dockBg: '#F9F8F6', dockBorder: 'rgba(0,0,0,0.06)',
    dockShadow: '0 6px 28px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
    cardShadow: '0 1px 4px rgba(0,0,0,0.04)',
    panelShadow: '0 4px 6px rgba(0,0,0,0.06)',
    dividerInk: 'rgba(0,0,0,0.06)', breadcrumb: '#0F0E0C',
    inputBg: '#EFEEEA', micBg: '#1C1C1C', micInk: '#FFFFFF',
    cardBg: '#F9F8F6', cardBgAlt: '#EFEEEA',
    modalScrim: 'rgba(28, 26, 22, 0.42)', modalScrimSoft: 'rgba(28, 26, 22, 0.18)',
    catOchre: '#B5712B', catMauve: '#9B5582', catGreen: '#557F62',
    catBlue: '#557498', catTan: '#827053', catGrey: '#8E8E89',
  },
  metallic: {
    name: 'Metallic Silver',
    pageBg: 'linear-gradient(236.6deg, #D6D9E2 -1.57%, #C3C1C7 99.62%)', pageGrad: true,
    railBg: 'linear-gradient(180deg, #FAFAFC 0%, #EEEEF1 100%)',
    canvasBg: 'linear-gradient(180deg, #F4F4F7 0%, #E8E8EC 100%)',
    topBarBg: 'linear-gradient(180deg, #F8F8FA 0%, #ECEDF0 100%)',
    rightBg: 'linear-gradient(180deg, #FAFAFC 0%, #EEEEF1 100%)',
    ink: '#1A1A22', ink2: '#2E2E36', ink3: '#6B6B74', ink4: '#A0A0A8',
    inkSoft: 'rgba(26, 26, 34, 0.22)',
    border: 'rgba(255,255,255,0.5)', borderMd: 'rgba(0,0,0,0.10)',
    pillBg: 'linear-gradient(180deg, #F8F8FA 0%, #E8E8EC 100%)', pillInk: '#6B6B74',
    activeTabBg: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F4 100%)', activeTabInk: '#1A1A22',
    dockBg: 'linear-gradient(180deg, #FCFCFE 0%, #ECECF0 100%)',
    dockBorder: 'rgba(255,255,255,0.6)',
    dockShadow: '0 8px 32px rgba(60,65,80,0.18), inset 0 1px 0 rgba(255,255,255,0.8)',
    cardShadow: '0 1px 4px rgba(60,65,80,0.10), inset 0 1px 0 rgba(255,255,255,0.6)',
    panelShadow: '0 4px 12px rgba(60,65,80,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
    dividerInk: 'rgba(0,0,0,0.08)', breadcrumb: '#1A1A22',
    inputBg: 'linear-gradient(180deg, #ECECF0 0%, #DEDEE3 100%)',
    micBg: '#1C1C1C', micInk: '#FFFFFF',
    cardBg: 'linear-gradient(180deg, #FAFAFC 0%, #EEEEF1 100%)',
    cardBgAlt: 'linear-gradient(180deg, #F4F4F7 0%, #E8E8EC 100%)',
    modalScrim: 'rgba(40, 42, 50, 0.50)', modalScrimSoft: 'rgba(40, 42, 50, 0.20)',
    catOchre: '#B5712B', catMauve: '#9B5582', catGreen: '#557F62',
    catBlue: '#557498', catTan: '#827053', catGrey: '#8E8E89',
  },
  charcoal: {
    name: 'Charcoal',
    pageBg: '#1A1A18', pageGrad: null,
    railBg: '#26261F', canvasBg: '#1C1C1C', topBarBg: '#26261F', rightBg: '#26261F',
    ink: '#F2F1ED', ink2: '#D8D6CF', ink3: '#9C9A92', ink4: '#6B6964',
    inkSoft: 'rgba(255, 255, 255, 0.20)',
    border: 'rgba(255,255,255,0.06)', borderMd: 'rgba(255,255,255,0.13)',
    pillBg: 'rgba(255,255,255,0.06)', pillInk: '#C8C5BC',
    activeTabBg: '#33332B', activeTabInk: '#FFFFFF',
    dockBg: '#2E2E26', dockBorder: 'rgba(255,255,255,0.08)',
    dockShadow: '0 8px 32px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.20)',
    cardShadow: '0 1px 4px rgba(0,0,0,0.25)',
    panelShadow: '0 4px 8px rgba(0,0,0,0.30)',
    dividerInk: 'rgba(255,255,255,0.08)', breadcrumb: '#F2F1ED',
    inputBg: '#1F1F1A', micBg: '#F2F1ED', micInk: '#1C1C1C',
    cardBg: '#26261F', cardBgAlt: '#2E2E26',
    modalScrim: 'rgba(0, 0, 0, 0.65)', modalScrimSoft: 'rgba(0, 0, 0, 0.32)',
    catOchre: '#D9974A', catMauve: '#C77AAB', catGreen: '#7DAB8E',
    catBlue: '#7E9BC2', catTan: '#A89376', catGrey: '#B8B6AE',
  },
};

/* ─── Icon factory ────────────────────────────────────────────── */
const ic = (paths, opts = {}) => ({ s = 16, c = 'currentColor', sw = 1.4 } = {}) => (
  <svg width={s} height={s} viewBox={opts.vb || "0 0 16 16"} fill="none"
       stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths.map((d, i) => <path key={i} d={d} />)}
  </svg>
);

const HomeIc      = ic(["M2 7l6-5 6 5v7a1 1 0 01-1 1H3a1 1 0 01-1-1V7z","M6 15v-4h4v4"]);
const ChevDown    = ic(["M3 6l5 5 5-5"]);
const ChevRight   = ic(["M6 3l5 5-5 5"]);
const ChevLeft    = ic(["M10 3L5 8l5 5"]);
const PlusIc      = ic(["M8 3v10","M3 8h10"]);
const MinusIc     = ic(["M3 8h10"]);
const CloseIc     = ic(["M3 3l10 10","M13 3L3 13"]);
const NewIc       = ic(["M8 3v10","M3 8h10"]);
const SparkPlusIc = ic(["M8 1.5l1.4 4.1L13.5 7l-4.1 1.4L8 12.5l-1.4-4.1L2.5 7l4.1-1.4L8 1.5z","M14 12v3","M12.5 13.5h3"]);
const ListIc      = ic(["M2 4h12","M2 8h12","M2 12h12"]);
const SearchIc    = ic(["M11 11l3 3","M7 12a5 5 0 100-10 5 5 0 000 10z"]);
const CheckIc     = ic(["M3 8l3.5 3.5L13 5"]);
const UploadIc    = ic(["M8 11V2","M4.5 5.5L8 2l3.5 3.5","M2 13h12"]);
const SendIc      = ({ s = 14, c = 'currentColor' } = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill={c}><path d="M14.5 1.5L1 6.5l5.5 2 2 5.5L14.5 1.5z"/></svg>;
const MicIc       = ic(["M8 1.5a2.5 2.5 0 00-2.5 2.5v4a2.5 2.5 0 005 0V4A2.5 2.5 0 008 1.5z","M3.5 7.5v.5a4.5 4.5 0 009 0v-.5","M8 12.5v2","M5.5 14.5h5"]);
const DashIc      = ic(["M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z"]);
const UsersIc     = ic(["M5.5 7.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z","M1 14c0-2.2 2-4 4.5-4S10 11.8 10 14","M11 5.5a2 2 0 110-4","M13.5 10c1 .4 1.8 1.4 1.8 3"]);
const FolderIc    = ic(["M1.5 4a1 1 0 011-1H6l1.5 1.5h6a1 1 0 011 1V13a1 1 0 01-1 1H2.5a1 1 0 01-1-1V4z"]);
const CalIc       = ic(["M2 4a1 1 0 011-1h10a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4z","M5 1.5v3M11 1.5v3M2 7h12"]);
const FileIc      = ic(["M3.5 1.5h6L13 5v9.5a1 1 0 01-1 1H3.5a1 1 0 01-1-1v-12a1 1 0 011-1z","M9.5 1.5V5h3.5"]);
const SettingsIc  = ic(["M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z","M13 8.5l1.5-.5-1.5-.5M3 8.5L1.5 8 3 7.5M11 11l1 1 .5-1.5M5 5L4 4l-.5 1.5M8 13.5V15M8 1v1.5M11 5l1-1-1.5-.5M5 11l-1 1 1.5.5"]);
const SparkIc     = ic(["M8 1.5l1.4 4.1L13.5 7l-4.1 1.4L8 12.5l-1.4-4.1L2.5 7l4.1-1.4L8 1.5z"]);
const ChainIc     = ic(["M6.5 9.5l3-3","M5.5 4.5L7 3a3 3 0 014 4l-1.5 1.5","M10.5 11.5L9 13a3 3 0 01-4-4l1.5-1.5"]);
const CanvasIc    = ic(["M3 3h10v10H3z","M2 2v2","M14 2v2","M2 14v-2","M14 14v-2"]);
const UserIc      = ic(["M8 8a3 3 0 100-6 3 3 0 000 6z","M2 14c0-3 2.5-5 6-5s6 2 6 5"]);
const PlayIc      = ic(["M4 2.5l9 5.5-9 5.5z"]);
const ShieldIc    = ic(["M8 1.5L2.5 3.5v4c0 3.5 2.4 6.7 5.5 7.5 3.1-.8 5.5-4 5.5-7.5v-4L8 1.5z"]);
const BellIc      = ic(["M8 2v1","M3 11h10l-1.5-2V6.5A3.5 3.5 0 008 3a3.5 3.5 0 00-3.5 3.5V9L3 11z","M6.5 13a1.5 1.5 0 003 0"]);
const CardIc      = ic(["M2 4h12v8H2zM2 7h12"]);
const HelpIc      = ic(["M8 14a6 6 0 100-12 6 6 0 000 12z","M6 6.5a2 2 0 014 0c0 1-1 1.5-1.5 2-.5.5-.5 1-.5 1.5","M8 12v.5"]);
const TrashIc     = ic(["M2.5 4h11","M5 4V2.5h6V4","M4 4l1 10h6l1-10","M6.5 7v4M9.5 7v4"]);
const LogOutIc    = ic(["M9 2.5h3a1 1 0 011 1v9a1 1 0 01-1 1H9","M5 5l-3 3 3 3","M2 8h8"]);
const EditIc      = ic(["M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z"]);
const KeyIc       = ic(["M10 7a3 3 0 100 6 3 3 0 000-6z","M7.5 8.5L1.5 14.5","M4 12h2","M5 11l1 1"]);
const PaletteIc   = ic(["M8 1.5a6.5 6.5 0 100 13c.5 0 .5-.5.5-1s-.5-1-.5-1.5 1-2 2.5-2c2 0 3.5-1 3.5-3.5C14 4 11.3 1.5 8 1.5z","M5 7.5a.5.5 0 100-1 .5.5 0 000 1zM7.5 5a.5.5 0 100-1 .5.5 0 000 1zM10.5 5a.5.5 0 100-1 .5.5 0 000 1z"]);
const FileMenuIc  = ic(["M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z","M10 2v3h3"]);
const GlobeIc     = ic(["M8 14a6 6 0 100-12 6 6 0 000 12z","M2 8h12","M8 2c2 2 2.5 4 2.5 6S10 12 8 14","M8 2C6 4 5.5 6 5.5 8S6 12 8 14"]);
const CommunityIc = ic(["M5 4a2 2 0 110 4 2 2 0 010-4z","M11 4a2 2 0 110 4 2 2 0 010-4z","M2 13c0-1.5 1-3 3-3","M14 13c0-1.5-1-3-3-3","M5 13c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5"]);
const LearnIc     = ic(["M2 4l6-2 6 2-6 2-6-2z","M2 4v5l6 2 6-2V4","M11 5.5v4"]);
const GoogleIc    = ({ s = 14 } = {}) => (
  <svg width={s} height={s} viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.27c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 009 18z"/>
    <path fill="#FBBC05" d="M3.97 10.7a5.4 5.4 0 010-3.45V4.96H.96a9 9 0 000 8.08l3.01-2.34z"/>
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.43 1.35l2.58-2.58A8.99 8.99 0 009 0 9 9 0 00.96 4.96l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z"/>
  </svg>
);

/* ─── Brand wordmark ──────────────────────────────────────────── */
function NOSMark({ T, size = 13, label, labelInk }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, fontFamily: BODY }}>
      <span style={{ fontStyle: 'italic', fontWeight: 500, fontSize: size + 1, letterSpacing: '-0.04em', color: T.ink }}>n</span>
      <span style={{ fontWeight: 600, fontSize: size, letterSpacing: '-0.02em', color: T.ink }}>OS</span>
      {label && <span style={{ fontStyle: 'italic', fontWeight: 400, fontSize: size - 1, color: labelInk || T.ink3, marginLeft: 2 }}>{label}</span>}
    </div>
  );
}

/* ─── Pearl avatar (used in Welcome card and elsewhere) ───────── */
function Pearl({ size = 28 }) {
  const s = size;
  return (
    <div style={{
      width: s, height: s, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle at 34% 28%, #FFFFFF 0%, #F0EDE8 18%, #DDD8D0 40%, #C4BDB3 62%, #ADA69C 80%, #968E84 100%)`,
      boxShadow: `inset ${-s*.05}px ${-s*.05}px ${s*.14}px rgba(0,0,0,.18), inset ${s*.03}px ${s*.03}px ${s*.08}px rgba(255,255,255,.9), 0 ${s*.06}px ${s*.2}px rgba(0,0,0,.14)`,
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `radial-gradient(circle at 28% 22%, rgba(255,255,255,.7) 0%, transparent 40%)` }} />
    </div>
  );
}

/* ─── Viewport hook (responsive tier detection) ───────────────
   Returns the active tier for the current window width, plus the raw
   width if a component needs to fine-tune. Tiers:
     mobile  · width  < 768px   (iPhone 15 Pro Max is 430px portrait)
     tablet  · 768 .. 1023px    (iPad portrait, small laptops)
     desktop · ≥ 1024px         (full three-panel terminal)
   Components consume via:  const { tier, isMobile, isTablet } = useViewport();
   ──────────────────────────────────────────────────────────── */
function useViewport() {
  const get = () => {
    if (typeof window === 'undefined') return { width: 1280, tier: 'desktop' };
    const w = window.innerWidth;
    const tier = w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
    return { width: w, tier };
  };
  const [vp, setVp] = useState(get);
  useEffect(() => {
    const onResize = () => setVp(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return {
    width: vp.width, tier: vp.tier,
    isMobile:  vp.tier === 'mobile',
    isTablet:  vp.tier === 'tablet',
    isDesktop: vp.tier === 'desktop',
  };
}

/* ─── useMountReveal — physics-based mount choreography ────────
   Drives the canonical opacity 0→1 + translateY(20px → 0) reveal
   pattern used by every modal, mini-modal and section. Replaces the
   ad-hoc `setTimeout(setIsMounted, 16)` patterns scattered through
   the file.

   Usage:
     const mounted = useMountReveal();
     <div style={{ ...revealStyle(mounted), ... }}/>

   Master Guideline §2 + §4 — physics-based, deliberate, never abrupt.
   ──────────────────────────────────────────────────────────────── */
function useMountReveal(delayMs = 0) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (delayMs > 0) {
        const t = setTimeout(() => setMounted(true), delayMs);
        return () => clearTimeout(t);
      }
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, [delayMs]);
  return mounted;
}

/* Helper: produces the canonical reveal style object. */
function revealStyle(mounted, distance = 20) {
  return {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : `translateY(${distance}px)`,
    transition: `opacity ${EASE_DELIBERATE}, transform ${EASE_DELIBERATE}`,
  };
}

/* ─── Soft pulse keyframes (loading, nudges) ──────────────────
   Single shared keyframes block — injected once via a sentinel <style>
   tag at the App Shell so any component can use animation: 'nia-pulse 2s
   ease-in-out infinite' without redefining keyframes per-component.    */
const PULSE_KEYFRAMES = `
  @keyframes nia-pulse {
    0%, 100% { opacity: 0.4; }
    50%      { opacity: 1; }
  }
  @keyframes nia-pulse-scale {
    0%, 100% { opacity: 0.4; transform: scale(0.92); }
    50%      { opacity: 1;   transform: scale(1); }
  }
  @keyframes nia-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

/* ─── Tier system — Master Guideline §3, paywall taxonomy ──────
   Three tiers with explicit feature gates. Used by requireTier() to
   determine whether an action is allowed for the current user.
   Pricing values are placeholder until real numbers are set; the UI
   reads from this constant so updating prices is one-line.
   ──────────────────────────────────────────────────────────────── */
const TIERS = {
  foundation: {
    id: 'foundation',
    label: 'Foundation',
    price: 0,
    priceLabel: 'Free',
    annualLabel: null,
    tagline: 'Begin building your taste.',
    description: 'Everything you need to ship your first three projects.',
    limits: {
      projects:    3,
      archetypes:  60,                 // Mid-tier and below only
      aiCallsMonth: 50,
      integrations: [],
      models:       false,
      agents:       false,
      teamSeats:    1,
    },
    features: [
      '3 concurrent projects',
      '60 foundational archetypes',
      'Read-only Contacts and Events',
      '50 AI generations per month',
      '1 seat',
    ],
  },
  professional: {
    id: 'professional',
    label: 'Professional',
    price: null,            // Real pricing TBD by user; UI shows placeholder
    priceLabel: 'TBD',
    annualLabel: 'Save with annual',
    recommended: true,
    tagline: 'For working creatives.',
    description: 'The full creative production terminal, no caps.',
    limits: {
      projects:    Infinity,
      archetypes:  282,
      aiCallsMonth: Infinity,
      integrations: ['figma', 'behance', 'adobe', 'capture-one', 'pixieset', 'savee', 'cosmos', 'aftershoot'],
      models:       true,
      agents:       false,
      teamSeats:    1,
    },
    features: [
      'Unlimited projects',
      'All 282 archetypes',
      'All 8 integrations',
      'Production models (briefs, schedules, budgets)',
      'Unlimited AI generations',
      '1 seat',
    ],
  },
  studio: {
    id: 'studio',
    label: 'Studio',
    price: null,
    priceLabel: 'Custom',
    annualLabel: 'Contact sales',
    tagline: 'For agencies and teams.',
    description: 'Everything in Professional, plus shared workspaces and Custom Agents.',
    limits: {
      projects:    Infinity,
      archetypes:  Infinity,        // Plus custom additions
      aiCallsMonth: Infinity,
      integrations: '*',            // All Professional + custom API
      models:       true,
      agents:       true,
      teamSeats:    Infinity,
    },
    features: [
      'Everything in Professional',
      'Multi-seat shared workspace',
      'Custom Agents',
      'Custom archetypes and integrations',
      'Shared NRI rate cards',
      'Team capacity dashboards',
      'Priority support',
    ],
  },
};
const TIER_ORDER_LIST = ['foundation', 'professional', 'studio'];

/* ─── Integrations catalogue ──────────────────────────────────
   Eight Professional-tier integrations, one Studio-tier custom slot.
   Used by Settings → Integrations and the Upgrade flow.            */
const INTEGRATIONS = [
  { id: 'figma',       name: 'Figma',        category: 'Design',     desc: 'Pull frames and components into briefs' },
  { id: 'behance',     name: 'Behance',      category: 'Reference',  desc: 'Sync curated work into project moodboards' },
  { id: 'adobe',       name: 'Adobe CC',     category: 'Production', desc: 'Pass assets between Photoshop, Illustrator, Premiere' },
  { id: 'capture-one', name: 'Capture One',  category: 'Photography',desc: 'Tether sessions and pull selects directly' },
  { id: 'pixieset',    name: 'Pixieset',     category: 'Delivery',   desc: 'Push approved galleries to clients' },
  { id: 'savee',       name: 'Savee',        category: 'Reference',  desc: 'Sync your reference library into Canvas' },
  { id: 'cosmos',      name: 'Cosmos',       category: 'Reference',  desc: 'Pull mood references and inspiration boards' },
  { id: 'aftershoot',  name: 'Aftershoot',   category: 'Photography',desc: 'AI culling and editing on imported sessions' },
];

/* ─── requireTier — single gating utility ────────────────────────
   Every paywall trigger calls this. Returns either { allowed: true }
   or { allowed: false, reason, requiredTier, context }.
   Call sites: project creation, archetype picker, integration toggle,
   models browser, agents browser, AI call counter.

   @param feature  string — one of: 'project', 'archetype', 'integration',
                                     'model', 'agent', 'aiCall'
   @param ctx      object — { user, archetype?, projectCount?, integrationId?, ... }
   @returns        { allowed, reason?, requiredTier?, currentValue?, limit? }
   ──────────────────────────────────────────────────────────────── */
function requireTier(feature, ctx = {}) {
  const tierId = ctx.user?.tier || 'foundation';
  const tier = TIERS[tierId] || TIERS.foundation;
  const limits = tier.limits;

  switch (feature) {
    case 'project': {
      const count = ctx.projectCount ?? 0;
      if (count < limits.projects) return { allowed: true };
      return {
        allowed: false,
        reason: 'Workspace capacity reached.',
        body: `Foundation includes ${limits.projects} concurrent projects. Upgrade to Professional for unlimited workspaces.`,
        requiredTier: 'professional',
        currentValue: count,
        limit: limits.projects,
      };
    }
    case 'archetype': {
      // Foundation gates anything above the 60th by id (the basic tiers)
      const a = ctx.archetype;
      if (!a) return { allowed: true };
      if (a.id <= limits.archetypes) return { allowed: true };
      return {
        allowed: false,
        reason: 'Archetype access tier reached.',
        body: `${a.name} is a Professional-tier archetype. Foundation includes the first ${limits.archetypes} foundational roles.`,
        requiredTier: 'professional',
      };
    }
    case 'integration': {
      const id = ctx.integrationId;
      if (limits.integrations === '*') return { allowed: true };
      if (Array.isArray(limits.integrations) && limits.integrations.includes(id)) return { allowed: true };
      return {
        allowed: false,
        reason: 'Integration requires Professional.',
        body: `External integrations require a Professional Instance to establish secure, bidirectional data bridges.`,
        requiredTier: 'professional',
      };
    }
    case 'model': {
      if (limits.models) return { allowed: true };
      return {
        allowed: false,
        reason: 'Production Models require Professional.',
        body: 'Briefs, schedules, budgets and the rest of the framework library unlock with Professional.',
        requiredTier: 'professional',
      };
    }
    case 'agent': {
      if (limits.agents) return { allowed: true };
      return {
        allowed: false,
        reason: 'Custom Agents require Studio.',
        body: 'Long-running creative agents are part of the Studio tier — built per workspace.',
        requiredTier: 'studio',
      };
    }
    case 'aiCall': {
      const used = ctx.user?.aiCallsThisMonth ?? 0;
      if (used < limits.aiCallsMonth) return { allowed: true };
      return {
        allowed: false,
        reason: 'AI generation limit reached.',
        body: `Foundation includes ${limits.aiCallsMonth} AI generations per month. Upgrade for unlimited.`,
        requiredTier: 'professional',
        currentValue: used,
        limit: limits.aiCallsMonth,
      };
    }
    default:
      return { allowed: true };
  }
}

/* ─── Languages — top 10 most-spoken globally (2026) ─────────── */
const LANGUAGES = [
  { code: 'en',    name: 'English',        native: 'English',     speakers: '1.5B' },
  { code: 'zh',    name: 'Mandarin',       native: '中文',        speakers: '1.2B' },
  { code: 'hi',    name: 'Hindi',          native: 'हिन्दी',         speakers: '609M' },
  { code: 'es',    name: 'Spanish',        native: 'Español',     speakers: '559M' },
  { code: 'ar',    name: 'Arabic',         native: 'العربية',       speakers: '335M' },
  { code: 'fr',    name: 'French',         native: 'Français',    speakers: '312M' },
  { code: 'bn',    name: 'Bengali',        native: 'বাংলা',         speakers: '284M' },
  { code: 'pt',    name: 'Portuguese',     native: 'Português',   speakers: '267M' },
  { code: 'ru',    name: 'Russian',        native: 'Русский',     speakers: '255M' },
  { code: 'ur',    name: 'Urdu',           native: 'اردو',          speakers: '232M' },
];

/* ─── FAQs — surfaced inside the Help center ──────────────────── */
const FAQS = [
  {
    q: 'What is Nia?',
    a: 'Nia is a creative production terminal — a single environment for capturing ideas, writing briefs, building teams, and delivering work. Designed for Creative Directors, photographers, producers, and the 282 disciplines in the NRI Library.',
  },
  {
    q: 'How does Nia learn my taste?',
    a: 'As you work — every reference you keep, every brief section you rewrite, every AI output you accept or reject becomes a taste signal. Over 5+ projects Nia begins to sound like you. Over 50+ projects, switching platforms means losing your accumulated voice.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Project data, briefs, references, and taste signals belong to you. We use anonymous aggregate analytics only with your permission (toggle in Settings → Privacy). You can export everything at any time.',
  },
  {
    q: 'How do I change my archetype?',
    a: 'Open the Profile pill in the top right, tap your archetype, and pick from the 282 NRI archetypes. Or open Settings → Profile for the long-form version.',
  },
  {
    q: 'Why does my brief feel generic on my first project?',
    a: 'It will. The first brief is the hardest — Nia hasn\'t observed your patterns yet. By project five, the language begins to sound like you. By project twenty, it anticipates your next move.',
  },
  {
    q: 'What\'s the difference between Pro and Studio?',
    a: 'Pro is for individuals — unlimited projects, unlimited briefs, full archetype access. Studio adds multi-seat workspaces, shared NRI rate cards, and team capacity dashboards.',
  },
  {
    q: 'How do I share a project with a client?',
    a: 'Open the project, click Share. Add their email and pick a role (Viewer / Editor / Admin), or copy the share link. Viewers see a read-only version of the brief.',
  },
  {
    q: 'Can I delete my account?',
    a: 'Yes. Settings → Danger zone → Delete my account. There is a 30-day grace window during which you can restore by signing back in. After that, all data is unrecoverable.',
  },
];

/* ─── Community channels ────────────────────────────────────── */
const COMMUNITY_CHANNELS = [
  { id: 'discord',  name: 'Discord',           desc: 'Real-time chat with creative directors and producers using Nia',     soon: false },
  { id: 'showcase', name: 'Showcase',          desc: 'Briefs, references, and projects shared by the Nia community',        soon: true  },
  { id: 'templates',name: 'Community templates', desc: 'Brief templates contributed by working creatives',                  soon: true  },
  { id: 'events',   name: 'Events',            desc: 'Workshops, salons, and live working sessions',                        soon: true  },
];

/* ─── Learn-more resources ──────────────────────────────────── */
const LEARN_RESOURCES = [
  { id: 'about',     title: 'About Nia',                desc: 'The product, the principles, and why we built it' },
  { id: 'manifesto', title: 'The Nia Manifesto',        desc: 'On taste as a compounding asset and why it matters' },
  { id: 'methods',   title: 'How taste profiles work',  desc: 'The signals, the math, and the boundaries' },
  { id: 'changelog', title: 'What\'s new',              desc: 'Release notes for nOS v1.0 onwards' },
  { id: 'careers',   title: 'Careers',                  desc: 'We\'re hiring across product, design, and engineering' },
  { id: 'press',     title: 'Press kit',                desc: 'Logos, screenshots, and editorial copy for journalists' },
];

/* ─── NosToast — minimal, constrained, floating ─────────────────
   Replaces alert() across the app. Single-line message, optional eyebrow,
   bottom-centre, auto-dismiss. Triggered via the global custom event
   `nos:toast` so any component can dispatch without prop-drilling.

   Usage anywhere in the app:
     window.dispatchEvent(new CustomEvent('nos:toast', {
       detail: { message: 'Saved.', kind: 'success' }
     }));

   Mount once at the App Shell. Master Guideline §4 — quiet, inline,
   never aggressive.
   ────────────────────────────────────────────────────────────────── */
function NosToast({ T }) {
  const [toast, setToast] = useState(null); // { id, message, eyebrow?, kind? }
  const [mounted, setMounted] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    const onToast = (e) => {
      const id = ++idRef.current;
      setToast({ id, ...e.detail });
      requestAnimationFrame(() => setMounted(true));
      const dur = e.detail?.durationMs ?? 3200;
      setTimeout(() => setMounted(false), dur);
      setTimeout(() => {
        setToast((cur) => (cur && cur.id === id ? null : cur));
      }, dur + 400);
    };
    window.addEventListener('nos:toast', onToast);
    return () => window.removeEventListener('nos:toast', onToast);
  }, []);

  if (!toast) return null;
  const kindInk = toast.kind === 'danger'  ? DANGER
                : toast.kind === 'success' ? SUCCESS
                : T.ink;
  return (
    <div style={{
      position: 'fixed', left: '50%', bottom: 28,
      transform: `translate(-50%, ${mounted ? 0 : 12}px)`,
      opacity: mounted ? 1 : 0,
      zIndex: 300,
      transition: `opacity ${EASE_DELIBERATE}, transform ${EASE_DELIBERATE}`,
      pointerEvents: 'none',
      maxWidth: 'min(92vw, 480px)',
    }}>
      <div style={{
        background: T.cardBg, border: `1px solid ${T.borderMd}`,
        borderRadius: 999, padding: '10px 18px',
        boxShadow: T.dockShadow,
        fontFamily: BODY, fontSize: 12.5, lineHeight: 1.4,
        color: kindInk, letterSpacing: '-0.005em',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {toast.eyebrow && (
          <span style={{
            fontFamily: MONO, fontSize: 9, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: T.ink4,
          }}>{toast.eyebrow}</span>
        )}
        <span style={{ fontStyle: 'italic' }}>{toast.message}</span>
      </div>
    </div>
  );
}

/* Dispatch helper — every alert() replacement uses this. */
function nosToast(message, opts = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('nos:toast', {
    detail: { message, ...opts },
  }));
}

/* ─── Form primitives ─────────────────────────────────────────── */
function Field({ T, label, children, hint, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: T.ink4,
      }}>{label}</label>
      {children}
      {hint && !error && (
        <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 11, color: T.ink4, marginTop: 2 }}>{hint}</div>
      )}
      {error && (
        <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 11, color: DANGER, marginTop: 2 }}>{error}</div>
      )}
    </div>
  );
}

function Input({ T, value, onChange, placeholder, type = 'text', autoFocus, suggested, disabled }) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      type={type} value={value || ''} autoFocus={autoFocus} disabled={disabled}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      placeholder={placeholder}
      style={{
        background: T.inputBg,
        border: `1px solid ${focus ? ACCENT : T.borderMd}`,
        borderRadius: 10, padding: '12px 14px',
        fontFamily: BODY, fontSize: 13.5, fontWeight: 400,
        color: disabled ? T.ink4 : (suggested && !focus ? T.ink3 : T.ink),
        fontStyle: suggested && !focus ? 'italic' : 'normal',
        letterSpacing: '-0.005em', outline: 'none',
        transition: `border-color ${EASE_QUICK}`,
        width: '100%', boxSizing: 'border-box',
        cursor: disabled ? 'not-allowed' : 'text',
      }}/>
  );
}

function PrimaryButton({ T, children, onClick, disabled, loading, danger, fullWidth }) {
  const [hover, setHover] = useState(false);
  const fill = danger ? DANGER : ACCENT;
  return (
    <button
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick} disabled={disabled || loading}
      style={{
        background: disabled ? T.cardBgAlt : fill,
        color: disabled ? T.ink4 : ACCENT_INK,
        border: 'none', borderRadius: 999,
        padding: '13px 26px',
        fontFamily: BODY, fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : 'auto',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        transform: hover && !disabled ? 'translateY(-1px)' : 'none',
        boxShadow: hover && !disabled ? `0 4px 14px ${danger ? 'rgba(224,122,95,0.35)' : 'rgba(255,171,13,0.35)'}` : 'none',
        transition: `all ${EASE_QUICK}`, whiteSpace: 'nowrap',
      }}>
      {loading ? '…' : children}
    </button>
  );
}

function GhostButton({ T, children, onClick, danger }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        background: 'transparent',
        color: danger ? (hover ? DANGER : T.ink3) : (hover ? T.ink2 : T.ink3),
        border: 'none', cursor: 'pointer', padding: '13px 18px',
        fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
        fontSize: 12.5, letterSpacing: '-0.005em',
      }}>{children}</button>
  );
}

function Toggle({ T, on, onChange, label, description }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
      width: '100%', display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', gap: 14,
      padding: '14px 0',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        <div style={{
          fontFamily: BODY, fontWeight: 500, fontSize: 13,
          color: T.ink, letterSpacing: '-0.005em',
        }}>{label}</div>
        {description && (
          <div style={{
            fontFamily: BODY, fontSize: 11.5, color: T.ink3, lineHeight: 1.5,
          }}>{description}</div>
        )}
      </div>
      <div style={{
        width: 38, height: 22, borderRadius: 999, flexShrink: 0,
        background: on ? ACCENT : T.borderMd,
        position: 'relative', transition: `background ${EASE_QUICK}`,
        marginTop: 2,
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 18 : 2,
          width: 18, height: 18, borderRadius: '50%',
          background: '#FFFFFF',
          transition: `left ${EASE_QUICK}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}/>
      </div>
    </button>
  );
}

/* ─── Project taxonomy + mood vocabulary (shared) ─────────────── */
const PROJECT_TYPES = [
  { id: 'brand',       label: 'Brand Campaign' },
  { id: 'editorial',   label: 'Editorial' },
  { id: 'music',       label: 'Music Video' },
  { id: 'doc',         label: 'Documentary' },
  { id: 'series',      label: 'Content Series' },
  { id: 'epk',         label: 'EPK' },
  { id: 'podcast',     label: 'Podcast' },
  { id: 'event',       label: 'Event' },
];
const MOODS = [
  'Quiet','Urgent','Warm','Cold','Intimate','Epic','Raw','Refined',
  'Playful','Solemn','Nostalgic','Forward','Tender','Bold','Fragile',
  'Powerful','Dreamlike','Precise','Chaotic','Still',
];

/* ─── Demo seed — Function Studios reference projects ─────────
   When a user matching DEMO_SEED_EMAILS signs in for the first time
   AND their projects array is empty AND user.demoSeeded is not set,
   the App Shell auto-loads two real Function Studios projects as
   reference material. After seeding it sets user.demoSeeded = true
   so the seed never re-runs. Users can delete the projects without
   them coming back.

   Built from the canonical project briefs at:
     /mnt/user-data/uploads/FS-2026-001_Xiluva_Mbungela.md
     /mnt/user-data/uploads/FS-2026-002_Nhlamulo_Tlakula_Sesing.md
   ─────────────────────────────────────────────────────────────── */
const DEMO_SEED_EMAILS = [
  // Founder + insider accounts. On first sign-in for a matching email:
  //   1. Tier is auto-elevated to 'studio' (full permissions, all features)
  //   2. The reference Function Studios projects are seeded
  //   3. user.demoSeeded is set so neither effect re-runs
  // Comparison is case-insensitive — seed effect lowercases user.email first.
  'ikanyeng.thefunctioncreativeco@gmail.com',
  'labib.afia@dhcb.io',
  'talia@taliamanagement.com',
];

const DEMO_PROJECTS = [
  {
    id: 'fs-2026-001-xiluva',
    name: 'Xiluva Mbungela — Harvard GSD Graduation',
    client: 'Xiluva Mbungela',
    type: 'editorial',
    moods: ['Refined', 'Warm', 'Intimate', 'Powerful'],
    spark: 'Cool, creative, original — elegant and timeless. Rooted in South African identity. A graduation portrait series and 60-second editorial that honours the journey from South Africa to Harvard GSD, anchored by a traditional attire look.',
    context: 'May 27 is peak graduation day — heavy crowds expected on campus. Shoot requires tight sequencing, strategic location timing, and crowd awareness throughout. Two locations: GSD campus and Harvard T Station (specifically requested by client).',
    // Model-instantiated using the Content Production Guideline framework
    modelId: 'content-production',
    modelLabel: 'Content Production Guideline',
    modelSections: {
      'project-summary': {
        projectTitle: 'Xiluva Mbungela — Harvard GSD Graduation',
        client: 'Xiluva Mbungela (private commission)',
        productionCompany: 'Function Studios',
        contentType: 'Editorial portrait series + 60-second editorial video',
        productionDates: 'Wed 27 May 2026 (alt: Thu 29 May 2026), wrap before 14:30',
        locations: 'Harvard Graduate School of Design campus, Cambridge MA · Harvard T Station',
        languages: 'English, with Xitsonga and isiZulu where natural to talent',
        briefAuthor: 'Ikanyeng Rammutla, Function Studios',
        lastUpdated: '2026-05-04',
      },
      'crew-contacts': [
        { role: 'Lead photographer', name: 'Ikanyeng Rammutla', phone: 'TBC', email: 'studio@functionstudios.com' },
        { role: 'Video / editorial', name: 'TBC', phone: 'TBC', email: 'TBC' },
        { role: 'Behind-the-scenes / second shooter', name: 'TBC (graduation crowd density makes a second pair of eyes valuable)', phone: 'TBC', email: 'TBC' },
        { role: 'On-day producer', name: 'Ikanyeng Rammutla (player-coach for a single-day shoot)', phone: 'TBC', email: 'studio@functionstudios.com' },
      ],
      'approvals-escalation': {
        productionApprovals: 'Ikanyeng Rammutla (Function Studios)',
        clientApprovals: 'Xiluva Mbungela',
        onSetEscalation: 'Ikanyeng Rammutla — single point of contact for the day',
        postProductionLead: 'Ikanyeng Rammutla',
      },
      'bts-coverage': '— Family arrival and reunion at the GSD campus, immediately after ceremony\n— The traditional attire change as a discrete photographed moment\n— Candid family interactions across the morning\n— Wide establishers of the GSD campus quad and the Harvard T Station entrance\n— Behind-the-scenes capture during outfit transitions and lighting setups\n— Quiet portrait moments between Xiluva and each individual family member',
      'priority-bts-scenes': [
        { scene: 'Family arrival on campus', date: '2026-05-27', location: 'GSD entrance', rationale: 'First moment family sees Xiluva in cap and gown — once-only emotional beat' },
        { scene: 'Traditional attire reveal', date: '2026-05-27', location: 'GSD interior', rationale: 'Anchors the South African identity narrative the editorial leans on' },
        { scene: 'Harvard T Station portraits', date: '2026-05-27', location: 'Harvard T Station', rationale: 'Client-specified location — symbolic of the journey' },
        { scene: 'Individual family member portraits', date: '2026-05-27', location: 'GSD quad', rationale: 'Each family member traveled from SA — these moments earn the trip' },
        { scene: 'Final group portrait', date: '2026-05-27', location: 'GSD signature view', rationale: 'The hero image that anchors the gallery' },
      ],
      'epk-concepts': [
        {
          name: '60-second editorial film',
          summary: 'A short editorial that braids Xiluva\'s Harvard graduation moment with her South African identity. Slow-cut, music-led, no voiceover. Designed to live on Instagram and as a personal keepsake.',
          reference: 'Pinterest mood board (received from client) — pinned references skew refined and timeless',
          productionDay: '2026-05-27',
          location: 'GSD campus + Harvard T Station',
          mandatoryTalent: 'Xiluva Mbungela',
          optionalTalent: 'Family members (interspersed)',
          questionSet: 'No interview component — film is observational',
          deliverables: '— 60-second master, 16:9 and 9:16\n— 30-second social cutdown\n— Three still frames pulled from the master',
        },
      ],
      'pav-concepts': [
        { concept: 'Traditional attire reveal — vertical', platform: 'Instagram Reels · 9:16 · 15s', talent: 'Xiluva', shootDay: '2026-05-27', status: 'In scope' },
        { concept: 'Harvard T Station hero portrait', platform: 'Editorial still · 4:5', talent: 'Xiluva', shootDay: '2026-05-27', status: 'In scope' },
        { concept: 'Family group still', platform: 'Editorial still · 3:2', talent: 'Family ensemble', shootDay: '2026-05-27', status: 'In scope' },
        { concept: 'Behind-the-scenes carousel', platform: 'Instagram Carousel · 4:5', talent: 'Various', shootDay: '2026-05-27', status: 'Optional' },
      ],
      'daily-checklist': [
        { text: 'Full gear check against the equipment list', checked: false },
        { text: 'Briefing with capture team on the day\'s priority moments', checked: false },
        { text: 'Review the call sheet and confirm any schedule changes', checked: false },
        { text: 'Confirm media cards are formatted and labelled', checked: false },
        { text: 'Sync clocks and timecode across all cameras and audio', checked: false },
        { text: 'Confirm wrap before 14:30 with client (graduation crowd window)', checked: false },
        { text: 'Eat — capture days run long, food is non-negotiable', checked: false },
        { text: 'Maintain a running technical camera log', checked: false },
        { text: 'Flag any difficulty or talent issue to the producer in real time', checked: false },
        { text: 'Back up media at every meal break, never only at wrap', checked: false },
        { text: 'Full gear check at wrap — count it back into its case', checked: false },
        { text: 'Compile the daily log and review the day\'s footage', checked: false },
        { text: 'Organize content into delivery folder structure', checked: false },
        { text: 'Generate proxies (max 720p) for the next-day review', checked: false },
        { text: 'Upload daily-pick reels to the agreed shared folder', checked: false },
      ],
      'technical-delivery': {
        masterCodec: 'ProRes 422 HQ for video; RAW (CR3 / NEF) for stills',
        resolution: '4K UHD (3840×2160) for video; 24+ MP for stills',
        frameRate: '24fps for editorial film',
        audioSpec: 'Stereo, -12 dB peak, 48kHz / 24-bit (ambient only — no interview)',
        proxySpec: 'H.264, 1080p, 8 Mbps for review',
        naming: 'FS-2026-001_XM_[type]_[NN]',
        deliveryLocation: 'Pixieset gallery (stills) + WeTransfer / Google Drive (video master)',
        backupProtocol: 'Triple backup: card → laptop SSD → external 2TB. Master kept for 12 months.',
      },
      'folder-structure': '— 01_EPK / 60-second editorial film and stills\n— 02_BTS_B-Roll / categorized by location and outfit change\n— 03_PAV_Captures / organized per concept (traditional reveal, T Station, family group)\n— 04_Stills / master selects from the gallery\n— 05_Proxies_720p / mirrored structure of the master folders\n— 06_Daily_Logs / one document for the shoot day',
      'approvals-signoff': [
        { role: 'Studio sign-off', name: 'Ikanyeng Rammutla', date: '2026-05-04', signature: 'IR' },
        { role: 'Client sign-off', name: 'Xiluva Mbungela', date: 'TBC at prep call', signature: '' },
      ],
    },
    // Legacy brief retained for fallback compatibility
    brief: {
      overview: 'Graduation photography and editorial video for Xiluva Mbungela, a South African Harvard GSD graduate. Wednesday 27 May 2026, wrap before 14:30. See Model sections below.',
      creativeDirection: 'See Model sections below.',
      visualDirection: 'Refined, warm, intimate, powerful.',
      deliverables: '— See Model schema',
      timeline: 'See Model schema',
    },
    fsMetadata: {
      projectId: 'FS-2026-001',
      tour: 'Function Studios Summer \'26',
      financials: {
        currency: 'USD',
        total: 500,
        depositPaid: 250,
        depositDate: '2026-05-02',
        confirmation: 'qk00sbvtk',
        method: 'Adv Plus Banking — 1512',
        balanceOutstanding: 250,
      },
      customerJourney: {
        framework: 'Function Studios 6-Touchpoint Journey',
        completed: 1,
        total: 6,
      },
      internalNotes: 'Met at HBS Africa Business Conference. Shared South African background — strong personal connection. Heart of the Hunter (first English African Netflix Original to debut #1 globally) is a relevant credential for client confidence.',
    },
    team: [],
    sharedWith: [],
    createdAt: '2026-05-04T09:00:00.000Z',
    updatedAt: '2026-05-04T09:00:00.000Z',
    status: 'active',
  },
  {
    id: 'fs-2026-002-nhlamulo',
    name: 'Nhlamulo — Amapiano: A Cultural Export',
    client: 'Nhlamulo Tlakula-Sesing',
    type: 'epk',
    moods: ['Bold', 'Powerful', 'Refined', 'Forward'],
    spark: 'Event photography across a 9.5-hour window — Harvard panel and live performance, dinner at Ama Restaurant, after-party. The framing is historically significant: 30 years of SA Constitution, 50 years since June 16 Uprising, 70 years since the 1956 Women\'s March.',
    context: '3.5-hour gap between panel wrap (~6:20 PM) and after-party start (10:00 PM). Dinner fills the window. Dress code: all black across production team for cohesion.',
    // Model-instantiated using the Junket Brief framework
    modelId: 'junket-brief',
    modelLabel: 'Junket Brief',
    modelSections: {
      'junket-overview': {
        projectTitle: 'Amapiano: A Cultural Export — Panel & Live Performance',
        junketDate: '2026-05-08',
        setupDate: '2026-05-08 (same-day setup, 14:00 access)',
        cityRegion: 'Cambridge, MA',
        junketType: 'Hybrid — academic panel, live performance, editorial photography only',
        languages: 'English (with isiZulu, Sesotho, and Xitsonga passages where natural to talent)',
        briefAuthor: 'Function Studios on behalf of Nhlamulo Tlakula-Sesing',
        scheduleLink: 'See Run of Day section',
        lastUpdated: '2026-05-04',
      },
      'venue-details': {
        venueName: 'Harvard University Center for African Studies',
        address: '1280 Massachusetts Avenue, Cambridge, MA',
        venueContact: 'Nhlamulo Tlakula-Sesing (MC & Producer) — primary on-site',
        loadIn: '14:00 — band load-in and sound check at 15:00',
        loadOut: 'Venue clear by 19:00 (post-program)',
        parkingAccess: 'Harvard visitor parking; press arrival at lobby for accreditation',
      },
      'room-allocation': [
        { room: 'Main hall', purpose: 'Panel + live performance', sizeSqm: 'TBC', ceilingHeight: 'TBC' },
        { room: 'Reception lobby', purpose: 'Canapés, guest arrivals', sizeSqm: 'TBC', ceilingHeight: 'TBC' },
        { room: 'Hold / green room', purpose: 'Talent prep and dwell', sizeSqm: 'TBC', ceilingHeight: 'TBC' },
      ],
      'talent-groupings': [
        { group: 'Headliner', talent: 'Zakes Bantwini', rationale: 'Anchor of the global cultural export narrative', languages: 'English, isiZulu' },
        { group: 'Academic / industry panel', talent: 'Palesa Nomanzi Shongwe, Kevin Boakye, Prof. Tinashe Mushakavanhu', rationale: 'Filmmaker, agency founder, and academic — three angles on the same conversation', languages: 'English' },
        { group: 'Performance', talent: 'Witness Matlou', rationale: 'Berklee professor — bridges performance and pedagogy', languages: 'English' },
        { group: 'MC / Production', talent: 'Nhlamulo Tlakula-Sesing', rationale: 'Sets the tempo for the day and threads remarks together', languages: 'English' },
        { group: 'Hosts', talent: 'Zoe (Harvard CAS), Jimmy Ranamane / Jerry Mpufane (Global SA Program)', rationale: 'Opening and contextual framing remarks', languages: 'English' },
      ],
      'talent-windows': [
        { talent: 'Zakes Bantwini', arrival: '~16:15', departure: 'After Q&A, 18:20', notes: 'Confirm arrival logistics' },
        { talent: 'Palesa Nomanzi Shongwe', arrival: '~16:15', departure: '~18:20', notes: '' },
        { talent: 'Kevin Boakye', arrival: '~16:15', departure: '~18:20', notes: '' },
        { talent: 'Witness Matlou', arrival: '15:00 (with band)', departure: '~18:20', notes: 'Sound check at 15:00' },
        { talent: 'Prof. Tinashe Mushakavanhu', arrival: '~16:15', departure: '~18:20', notes: '' },
      ],
      'capture-setup': [
        {
          roomName: 'Main hall (panel + performance)',
          cameraPackage: 'Primary mirrorless body + 24-70mm f/2.8 + 70-200mm f/2.8 for panel; 35mm prime for performance',
          lightingPackage: 'Available house lighting only — no rigged lighting in academic venue',
          audioPackage: 'Photography only — no on-camera audio',
          gripSupport: 'Monopod for low-light performance shots',
          media: '2× CFexpress + 2× SD backup, 256GB each',
          backdropBranding: 'Harvard Center for African Studies signage in frame where possible — co-presenter logos visible',
        },
        {
          roomName: 'Reception lobby (canapés, arrivals)',
          cameraPackage: 'Single body + 35mm prime for candid documentary',
          lightingPackage: 'Available light — supplemented by small handheld LED if needed',
          audioPackage: 'N/A',
          gripSupport: 'None — handheld',
          media: 'Continued from main hall load',
          backdropBranding: 'Capture branded step-and-repeat if dressed',
        },
      ],
      'physical-deliverables': [
        { item: 'Step-and-repeat backdrop', specification: 'Co-presenter logos: Harvard CAS, Brand SA, Global SA Network, Global Maseme, Sanaa Groove', quantity: '1', deliveryDate: 'TBC' },
        { item: 'Wristbands for after-party', specification: 'Distributed at panel exit, not at check-in', quantity: 'Headcount + 20%', deliveryDate: '2026-05-07' },
        { item: 'Printed program (for hold)', specification: '8-page A5, single colour', quantity: '50', deliveryDate: '2026-05-07' },
      ],
      'photography-setup': {
        photographer: 'Function Studios — Ikanyeng Rammutla',
        setupStyle: 'Documentary-editorial, no formal portrait setup',
        location: 'Multi-location across the 9.5-hour window',
        lighting: 'Available light primarily; minimal supplemental',
        backdrop: 'Captured in-environment (Harvard CAS interior, Ama Restaurant, after-party venue)',
      },
      'required-shots': [
        { text: 'Solo of each panelist (Zakes, Palesa, Kevin, Witness, Tinashe)', checked: false },
        { text: 'Solo of MC (Nhlamulo)', checked: false },
        { text: 'Group photo of all panelists', checked: false },
        { text: 'Group photo with hosts (Zoe, Jimmy/Jerry)', checked: false },
        { text: 'Performance shots — Witness at piano + band', checked: false },
        { text: 'Audience reaction shots during Q&A', checked: false },
        { text: 'Reception candids — guests arriving, canapés, conversations', checked: false },
        { text: 'Dinner candids at Ama Restaurant', checked: false },
        { text: 'After-party energy + portraits', checked: false },
      ],
      'special-concepts': [
        {
          name: 'Pan-window editorial sequence',
          summary: 'A cohesive editorial set that threads the three windows (panel, dinner, after-party) into a single visual narrative. Captures the historical framing — 30 years of SA Constitution, 50 years since June 16, 70 years since 1956 Women\'s March — through imagery rather than text.',
          format: 'Photography only · 4:5 and 16:9 mix · 25-30 hero images',
          host: 'N/A — observational',
          talentRequired: 'All primary subjects',
          reference: 'Editorial documentary references TBC at prep',
          propsWardrobe: 'All-black dress code for production team — production aesthetic',
          owner: 'Ikanyeng Rammutla',
          deliveryDate: '2026-05-12 (within 72h window)',
        },
      ],
      'run-of-day': [
        { time: '15:00', activity: 'Band load-in & sound check', talent: 'Witness Matlou + band', room: 'Main hall' },
        { time: '15:30', activity: 'Photographer call', talent: 'Production team', room: 'Lobby' },
        { time: '16:00', activity: 'Doors open — guest arrivals & reception', talent: 'All', room: 'Lobby' },
        { time: '16:55', activity: 'Opening remarks', talent: 'Zoe (Harvard CAS)', room: 'Main hall' },
        { time: '17:15–17:55', activity: 'Panel discussion', talent: 'Moderator + panelists', room: 'Main hall' },
        { time: '17:55–18:15', activity: 'Q&A', talent: 'All', room: 'Main hall' },
        { time: '18:15–18:20', activity: 'Closing + wristband distribution', talent: 'Nhlamulo + FOH', room: 'Main hall exit' },
        { time: '22:00–01:00', activity: 'After-party / after-celebration', talent: 'All', room: 'TBC' },
      ],
      'post-junket-delivery': [
        { asset: 'Edited gallery — panel + reception (priority)', specification: '60-80 selects, edited, web + print', owner: 'Ikanyeng Rammutla', deadline: '2026-05-10 (48h)' },
        { asset: 'Edited gallery — dinner', specification: '20-30 selects, edited', owner: 'Ikanyeng Rammutla', deadline: '2026-05-11' },
        { asset: 'Edited gallery — after-party', specification: '40-60 selects, edited', owner: 'Ikanyeng Rammutla', deadline: '2026-05-12' },
        { asset: 'Hero set — pan-window editorial sequence', specification: '25-30 images, full edit', owner: 'Ikanyeng Rammutla', deadline: '2026-05-12' },
      ],
      'approvals-signoff': [
        { role: 'Studio sign-off', name: 'Ikanyeng Rammutla', date: '2026-05-04', signature: 'IR' },
        { role: 'Client sign-off', name: 'Nhlamulo Tlakula-Sesing', date: 'TBC at prep call', signature: '' },
      ],
    },
    // Legacy brief retained for fallback compatibility
    brief: {
      overview: 'Event photography for Amapiano: A Cultural Export. Friday 8 May 2026. See Model sections below.',
      creativeDirection: 'See Model sections below.',
      visualDirection: 'Bold, powerful, refined, forward.',
      deliverables: '— See Model schema',
      timeline: 'See Model schema',
    },
    fsMetadata: {
      projectId: 'FS-2026-002',
      tour: 'Function Studios Summer \'26',
      financials: {
        currency: 'USD',
        total: 450,
        depositPaid: 225,
        depositDate: null,
        confirmation: null,
        method: null,
        balanceOutstanding: 225,
      },
      customerJourney: {
        framework: 'Function Studios 6-Touchpoint Journey',
        completed: 0,
        total: 6,
      },
      openItems: [
        { priority: 'high', text: 'After-party venue address not confirmed' },
        { priority: 'high', text: 'Ama Restaurant address for dinner not confirmed' },
        { priority: 'medium', text: 'Edited image count and delivery turnaround not agreed' },
        { priority: 'low', text: 'Deposit payment method, date, and confirmation number not recorded' },
      ],
      internalNotes: 'Strong NRI research value (African creative economy / cultural export). Full shoot day spans 9.5 hours with a 3.5-hour gap between panel and after-party. Dress code: all black.',
    },
    team: [],
    sharedWith: [],
    createdAt: '2026-05-04T09:00:00.000Z',
    updatedAt: '2026-05-04T09:00:00.000Z',
    status: 'active',
  },
];

/* ─── Greetings — rotates per session for the welcome card ───── */
const GREETINGS = [
  name => `Welcome back, ${name}.`,
  name => `Hi ${name}.`,
  name => `Good to see you, ${name}.`,
  name => `${name} — what are we making today?`,
  name => `Hey ${name}.`,
  name => `Back in the terminal, ${name}.`,
  name => `${name}. Ready when you are.`,
  name => `Hi ${name}. The work waits.`,
];
const pickGreeting = (name) => GREETINGS[Math.floor(Math.random() * GREETINGS.length)](name || 'there');

/* Claude API helper

   Drop-in fetch to the Anthropic Messages API. Used by HeyNia, Brief
   generation, and anywhere else we ask the model for structured text.
   In production: route through your backend so the API key isn't on
   the client. For Base44 dev/preview, direct call is fine.            */
/**
 * Call the Claude API with optional tier gating.
 *
 * @param msg     string  — the user prompt
 * @param system  string? — optional system prompt
 * @param opts    object? — { user, setUser } for tier counter integration.
 *                          When provided, increments user.aiCallsThisMonth
 *                          and returns a tier-gate object instead of text
 *                          when the Foundation cap is hit.
 *
 * @returns string  — the assistant's reply
 *          | { gated: true, gate: {...} } — when the call is blocked by tier
 */
async function callClaude(msg, system, opts = {}) {
  // Tier check — only when caller passes user+setUser
  if (opts.user) {
    // Reset the monthly counter if the YYYY-MM bucket has rolled over
    const thisMonth = new Date().toISOString().slice(0, 7);
    if (opts.user.aiCallsResetAt !== thisMonth && opts.setUser) {
      opts.setUser(u => ({ ...u, aiCallsThisMonth: 0, aiCallsResetAt: thisMonth }));
    }
    const gate = requireTier('aiCall', { user: opts.user });
    if (!gate.allowed) {
      window.dispatchEvent(new CustomEvent('nos:upgrade', { detail: { feature: 'aiCall', ...gate } }));
      return { gated: true, gate };
    }
    // Increment counter optimistically
    if (opts.setUser) {
      opts.setUser(u => ({ ...u, aiCallsThisMonth: (u.aiCallsThisMonth || 0) + 1 }));
    }
  }
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: system || "You are Nia, a warm and intelligent creative production assistant. Be concise, specific, and practically useful. Under 180 words.",
        messages: [{ role: "user", content: msg }],
      }),
    });
    const d = await r.json();
    return d.content?.[0]?.text || '';
  } catch {
    return 'Something went quiet. Try again in a moment.';
  }
}

export {
  BODY, MONO,
  ACCENT, ACCENT_INK, DANGER, SUCCESS,
  EASE_PHYSICS, EASE_QUICK, EASE_DELIBERATE, EASE_SLOW,
  SKINS,
  ic, HomeIc, ChevDown, ChevRight, ChevLeft, PlusIc, MinusIc, CloseIc, NewIc,
  SparkPlusIc, ListIc, SearchIc, CheckIc, UploadIc, SendIc, MicIc, DashIc,
  UsersIc, FolderIc, CalIc, FileIc, SettingsIc, SparkIc, ChainIc, CanvasIc,
  UserIc, PlayIc, ShieldIc, BellIc, CardIc, HelpIc, TrashIc, LogOutIc, EditIc,
  KeyIc, PaletteIc, FileMenuIc, GlobeIc, CommunityIc, LearnIc, GoogleIc,
  NOSMark, Pearl,
  useViewport, useMountReveal, revealStyle,
  PULSE_KEYFRAMES,
  TIERS, TIER_ORDER_LIST, INTEGRATIONS, requireTier,
  LANGUAGES, FAQS, COMMUNITY_CHANNELS, LEARN_RESOURCES,
  NosToast, nosToast,
  Field, Input, PrimaryButton, GhostButton, Toggle,
  PROJECT_TYPES, MOODS,
  DEMO_SEED_EMAILS, DEMO_PROJECTS,
  GREETINGS, pickGreeting,
  callClaude,
};
