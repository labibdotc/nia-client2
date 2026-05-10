/* ════════════════════════════════════════════════════════════════════════════
   NIA · nOS — UNIFIED APPLICATION FILE
   v1.3 · May 2026 · For: Muheet Irfan (Lead Engineer)
   ────────────────────────────────────────────────────────────────────────────
   This file is intentionally structured as FOUR INDEPENDENT REGIONS plus an
   app shell. Each region is editable in isolation — changes inside a region
   never break code in another region as long as the documented CONTRACT at
   the top of each region is preserved.

       REGION 1 · SHARED ATOMS         (tokens, icons, primitives)
                  Used by every region. Edit here = ripple to all.
                  Treat this as the design system. Coordinate before changes.

       REGION 2 · ONBOARDING MODULE    (sign-up → verify → profile → handoff)
                  Self-contained. Communicates with shell only via:
                    props.onComplete(user)
                    props.referralSource

       REGION 3 · DASHBOARD MODULE     (the nOS three-panel terminal)
                  Self-contained. Communicates with shell only via:
                    props.user
                    props.onOpenSettings()
                    props.onLogOut()

       REGION 4 · SETTINGS MODULE      (account, profile, preferences,
                  privacy, billing, workspace, help, danger zone)
                  Modal overlay. Mountable from anywhere. Communicates
                  through:
                    props.user
                    props.setUser(updater)
                    props.skinKey, props.setSkinKey
                    props.onClose()
                    props.onLogOut()
                    props.onDeleteAccount()

       REGION 5 · APP SHELL            (default export — routes between
                  onboarding and dashboard based on auth state)

   Anyone can rewrite the visual treatment of a region without touching
   the others. The contracts above are the only things that must hold.
   ════════════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════════════════════════════════
   ┃                                                                          ┃
   ┃   REGION 1 · SHARED ATOMS                                                ┃
   ┃   ───────────────────────                                                ┃
   ┃   Design tokens, icon factory, base primitives.                          ┃
   ┃   Edit here = changes propagate to all regions.                          ┃
   ┃                                                                          ┃
   ════════════════════════════════════════════════════════════════════════════ */

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

/* ════════════════════════════════════════════════════════════════════════════
   ┃                                                                          ┃
   ┃   REGION 2 · ONBOARDING MODULE                                           ┃
   ┃   ─────────────────────────────                                          ┃
   ┃                                                                          ┃
   ┃   Contract:                                                              ┃
   ┃     <NiaOnboarding                                                       ┃
   ┃       referralSource={'globalcollectiveproject' | ...}                   ┃
   ┃       onComplete={user => ...}                                           ┃
   ┃     />                                                                   ┃
   ┃                                                                          ┃
   ┃   Skin: locked to Charcoal (T_OB constant below).                        ┃
   ┃   Anything inside this region is safe to redesign without affecting      ┃
   ┃   the dashboard or settings.                                             ┃
   ┃                                                                          ┃
   ════════════════════════════════════════════════════════════════════════════ */

const T_OB = SKINS.metallic; // onboarding-locked skin (matches Figma Make brand intro)

/* ─── NRI Skills Library — full 282-archetype dataset ─────────
   Canonical source for the Skills Library browser (Region 3).
   Schema:
     id    — stable identifier
     cat   — category id (1-13, see ALL_CATEGORIES)
     type  — discipline group ('Strategy', 'Production', 'Post', etc.)
     name  — role title
     tier  — seniority band (used for filtering and TIER_ORDER sort)
     rate  — typical day-rate range
     orb   — gradient-orb index (legacy field, kept for compatibility)
     sum   — one-paragraph role summary
   ──────────────────────────────────────────────────────────────── */
const ALL_CATEGORIES = [
  { id: 0,  label: 'All skills' },
  { id: 1,  label: 'Creative Direction & Vision' },
  { id: 2,  label: 'Production & Direction' },
  { id: 3,  label: 'Camera, Lighting & On-Set' },
  { id: 4,  label: 'Post-Production & Technical' },
  { id: 5,  label: 'Design & Visual Arts' },
  { id: 6,  label: 'Styling, Wardrobe & Beauty' },
  { id: 7,  label: 'Music, Audio & Performance' },
  { id: 8,  label: 'Photography & Digital Media' },
  { id: 9,  label: 'Production Operations' },
  { id: 10, label: 'Enterprise & Brand' },
  { id: 11, label: 'Technology Companies' },
  { id: 12, label: 'Business & Leadership' },
  { id: 13, label: 'Fine Art & Cultural Practice' },
];

const LIBRARY = [
  {id:1,cat:1,type:'Strategy',name:'Chief Creative Officer (CCO)',tier:'C-Suite',rate:'$2,000–5,000/day',orb:0,sum:'The CCO holds ultimate creative authority across an entire organisation — setting the creative philosophy, culture, and standards that govern all output. R'},
  {id:2,cat:1,type:'Strategy',name:'Executive Creative Director (ECD)',tier:'Executive',rate:'$1,500–4,000/day',orb:0,sum:'The ECD oversees all creative output across a division or the entire agency — responsible for maintaining creative excellence, developing creative talent, '},
  {id:3,cat:1,type:'Strategy',name:'Creative Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'The most common senior creative leadership role — responsible for the creative concept, visual direction, and overall aesthetic execution of campaigns, pro'},
  {id:4,cat:1,type:'Strategy',name:'Associate Creative Director (ACD)',tier:'Mid-Senior',rate:'$600–1,500/day',orb:0,sum:'The ACD operates as a senior creative executor and junior creative leader — developing strong conceptual and craft skills while beginning to manage junior '},
  {id:5,cat:1,type:'Strategy',name:'Art Director',tier:'Mid-Senior',rate:'$600–1,500/day',orb:0,sum:'Translates creative direction into tangible visual systems — overseeing layout, colour, typography, imagery, and on-set visual execution. Works across edit'},
  {id:6,cat:1,type:'Strategy',name:'Junior Art Director',tier:'Junior',rate:'$200–600/day',orb:0,sum:'A developing creative professional building foundational skills in visual concept development, layout, and art direction. Works under the guidance of Art D'},
  {id:7,cat:1,type:'Strategy',name:'Creative Strategist',tier:'Strategy',rate:'$500–1,500/day',orb:0,sum:'Sits at the intersection of data, culture, and creativity. Develops insight-led creative frameworks that align brand objectives with cultural relevance and'},
  {id:8,cat:1,type:'Strategy',name:'Creative Consultant',tier:'Senior / Advisory',rate:'$1,000–2,500/day',orb:0,sum:'An experienced senior creative who operates in an advisory or project-based capacity — brought in to solve specific creative challenges, evaluate existing '},
  {id:9,cat:1,type:'Strategy',name:'Treatment Designer',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Produces the creative treatment documents that directors and production companies use to pitch and win projects. Combines exceptional visual storytelling, '},
  {id:10,cat:1,type:'Strategy',name:'Creative Producer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:0,sum:'Bridges creative direction and production logistics — ensuring that creative vision is executed practically, on time, and within budget. The Creative Produ'},
  {id:11,cat:1,type:'Strategy',name:'Concept Developer',tier:'Mid',rate:'$400–1,000/day',orb:0,sum:'Specialises in the early-stage development of creative ideas — building concepts, territories, and narrative frameworks from briefs before they reach the d'},
  {id:12,cat:1,type:'Strategy',name:'Creative Operations Manager',tier:'Operations',rate:'$500–1,500/day',orb:0,sum:'Manages the operational processes that enable a creative department to function — traffic management, resource planning, workflow systems, and the administ'},
  {id:13,cat:1,type:'Strategy',name:'Head of Creative',tier:'Senior Leadership',rate:'$1,200–3,000/day',orb:0,sum:'Leads the internal creative function for a brand, platform, or organisation — responsible for all creative output, team management, and the alignment of cr'},
  {id:14,cat:1,type:'Strategy',name:'Brand Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Responsible for the holistic management and evolution of a brand — overseeing the strategy, identity, and communication standards that define how the brand'},
  {id:15,cat:1,type:'Strategy',name:'In-House Creative Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'A Creative Director embedded within a brand or organisation rather than operating from an agency — responsible for all externally and internally facing cre'},
  {id:16,cat:1,type:'Strategy',name:'Experiential Creative Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Leads creative direction for live events, experiential activations, pop-ups, and immersive brand experiences — combining spatial design, narrative, and pro'},
  {id:17,cat:1,type:'Strategy',name:'Fashion Creative Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Leads creative direction within the fashion industry — overseeing editorial content, campaign imagery, runway show aesthetics, and brand identity from a fa'},
  {id:18,cat:1,type:'Strategy',name:'Digital Creative Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Leads creative direction specifically for digital and social channels — developing platform-native creative strategies, content systems, and interactive ex'},
  {id:19,cat:1,type:'Strategy',name:'Storyboard Artist',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Creates sequential visual narratives that translate scripts, treatments, and concepts into drawn or rendered panels — used for pre-visualising commercials,'},
  {id:20,cat:1,type:'Strategy',name:'Creative Project Manager',tier:'Mid',rate:'$400–1,000/day',orb:0,sum:'Manages the project lifecycle for creative work — scoping, scheduling, resourcing, and delivering creative projects on time and on budget while protecting '},
  {id:21,cat:2,type:'Production',name:'Director (Narrative / Commercial)',tier:'Director',rate:'$1,000–2,500/day',orb:1,sum:'Brings scripts and creative briefs to life through directorial vision — making every creative decision related to performance, framing, atmosphere, pacing,'},
  {id:22,cat:2,type:'Production',name:'Music Video Director',tier:'Director',rate:'$1,000–2,500/day',orb:1,sum:'Specialises in directing music videos — creating narrative, conceptual, or performance-based visual interpretations of music tracks. Works closely with art'},
  {id:23,cat:2,type:'Production',name:'Documentary Director',tier:'Director',rate:'$1,000–2,500/day',orb:1,sum:'Directs documentary productions — developing research-driven narratives, gaining access and trust from subjects, and shaping raw reality into compelling st'},
  {id:24,cat:2,type:'Production',name:'Content Director',tier:'Director / Senior',rate:'$1,000–2,500/day',orb:1,sum:'Directs digital-first content — social video, branded content, web series, and platform-native productions. Operates at the intersection of editorial creat'},
  {id:25,cat:2,type:'Production',name:'Short Film Director',tier:'Director',rate:'$1,000–2,500/day',orb:1,sum:'Directs short films — typically for festival circuit, streaming, or development as a proof of concept for longer-form work. Operates with limited budgets, '},
  {id:26,cat:2,type:'Production',name:'Executive Producer',tier:'Executive',rate:'$1,500–4,000/day',orb:1,sum:'Holds ultimate financial and operational accountability for a production — managing client relationships, overseeing budgets, assembling key crew, and ensu'},
  {id:27,cat:2,type:'Production',name:'Producer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'The operational backbone of any production — translating creative vision into schedules, budgets, crew, and logistics. Manages all moving parts from brief '},
  {id:28,cat:2,type:'Production',name:'Line Producer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'The operational bridge between the Executive Producer and the production departments — managing day-to-day costs, crew coordination, and schedule integrity'},
  {id:29,cat:2,type:'Production',name:'Post Producer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Manages the complete post-production process for a project — from picture lock through all finishing stages to final delivery. Acts as the logistical and c'},
  {id:30,cat:2,type:'Production',name:'Field Producer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Manages production logistics in the field — organising locations, talent, crew, and equipment for documentary, news, or branded content shoots conducted ou'},
  {id:31,cat:2,type:'Production',name:'Associate Producer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Supports the Producer or Executive Producer across a range of production duties — often responsible for specific elements such as casting coordination, log'},
  {id:32,cat:2,type:'Production',name:'Experiential Producer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'Produces live events, experiential activations, and immersive brand experiences — managing the logistics, budget, and vendor network required to execute la'},
  {id:33,cat:2,type:'Production',name:'Production Manager',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Manages the day-to-day operational logistics of a production — from crew contracts to travel, accommodation, and equipment — working under the Line Produce'},
  {id:34,cat:2,type:'Production',name:'1st Assistant Director (1st AD)',tier:'Department Head',rate:'$500–1,500/day',orb:1,sum:'The operational authority on set — responsible for running the schedule, managing the crew, and ensuring that the director can focus on creative decisions '},
  {id:35,cat:2,type:'Production',name:'2nd Assistant Director (2nd AD)',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Supports the 1st AD by managing talent movement — getting actors and talent to set on time, managing background artists, and handling the administrative ou'},
  {id:36,cat:2,type:'Production',name:'Director\'s Assistant',tier:'Junior',rate:'$200–600/day',orb:1,sum:'A personal and professional assistant to the director — managing their schedule, communication, research, and administrative needs across development, pre-'},
  {id:37,cat:2,type:'Production',name:'Production Assistant',tier:'Entry',rate:'$500–1,500/day',orb:1,sum:'The entry-level production role — supporting all departments with tasks as required, learning the industry while performing essential on-set and office dut'},
  {id:38,cat:2,type:'Production',name:'Technical Director',tier:'Senior Specialist',rate:'$800–2,000/day',orb:1,sum:'Oversees all technical aspects of a production or live event — managing the technical infrastructure, crew, and systems that enable the show to run. Bridge'},
  {id:39,cat:2,type:'Production',name:'Co-Producer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'Partners with the lead Producer on specific aspects of a production — often responsible for a particular territory, financing stream, or production element'},
  {id:40,cat:2,type:'Production',name:'Location Producer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Manages all aspects of production in a specific geographic location or territory — from crew and vendor sourcing to local authority relationships, permits,'},
  {id:41,cat:3,type:'Technical',name:'Director of Photography (DP / Cinematographer)',tier:'Head of Department',rate:'$1,000–2,500/day',orb:2,sum:'The visual architect of any production. Responsible for every image seen on screen — framing, lighting, lens choice, camera movement, and the overall visua'},
  {id:42,cat:3,type:'Technical',name:'Camera Operator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Physically operates the camera on set, executing the framing, movement, and technical requirements directed by the DP. Works across dolly, handheld, crane,'},
  {id:43,cat:3,type:'Technical',name:'1st AC (Focus Puller)',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'The 1st Assistant Camera manages the camera department\'s equipment and is responsible for maintaining precise focus throughout every shot. This is among th'},
  {id:44,cat:3,type:'Technical',name:'2nd AC (Clapper Loader)',tier:'Junior-Mid',rate:'$300–700/day',orb:2,sum:'The 2nd Assistant Camera manages media and slates — loading, labelling, and transferring all camera cards and magazines, and operating the clapperboard to '},
  {id:45,cat:3,type:'Technical',name:'Gaffer',tier:'Head of Department',rate:'$1,000–2,500/day',orb:2,sum:'Chief lighting technician and head of the electrical department. Works directly with the DP to design and execute the lighting plan — selecting fixtures, m'},
  {id:46,cat:3,type:'Technical',name:'Key Grip',tier:'Head of Department',rate:'$1,000–2,500/day',orb:2,sum:'Head of the grip department — responsible for all camera support equipment, rigging, and camera movement systems. Works closely with the Gaffer and DP to s'},
  {id:47,cat:3,type:'Technical',name:'Grip',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Executes all camera support rigging under the direction of the Key Grip — physically setting up, adjusting, and moving all grip equipment throughout the sh'},
  {id:48,cat:3,type:'Technical',name:'Grip Assistant',tier:'Junior',rate:'$200–600/day',orb:2,sum:'The entry-level grip role — supporting the grip department with equipment loading, setup, and general tasks under Key Grip and Grip direction.'},
  {id:49,cat:3,type:'Technical',name:'Assistant Electrician',tier:'Junior-Mid',rate:'$300–700/day',orb:2,sum:'Supports the Gaffer and electrical department — running cable, setting lights, and operating lighting equipment under the direction of the Gaffer and Best '},
  {id:50,cat:3,type:'Technical',name:'Lighting Designer',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Designs lighting concepts and systems for live events, theatre productions, and experiential installations — creating atmosphere, directing attention, and '},
  {id:51,cat:3,type:'Technical',name:'Lighting Director',tier:'Senior',rate:'$800–2,000/day',orb:2,sum:'Responsible for the overall lighting direction of broadcast television productions — designing and managing lighting for studios, live broadcasts, and mult'},
  {id:52,cat:3,type:'Technical',name:'Lighting Tech',tier:'Junior-Mid',rate:'$300–700/day',orb:2,sum:'A lighting technician who operates lighting fixtures and equipment under the direction of the Gaffer or Lighting Director — setting, adjusting, and maintai'},
  {id:53,cat:3,type:'Technical',name:'Drone Operator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates unmanned aerial vehicles to capture footage from aerial perspectives — combining technical piloting skill with cinematic sensibility to deliver sh'},
  {id:54,cat:3,type:'Technical',name:'FPV Drone Pilot',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates First Person View drones — high-performance, highly agile unmanned aircraft capable of moves impossible with traditional cinema drones. Used for d'},
  {id:55,cat:3,type:'Technical',name:'DIT (Digital Imaging Technician)',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages the digital pipeline on set — responsible for data ingest, backup, live colour management, and the delivery of dailies. Acts as the technical guard'},
  {id:56,cat:3,type:'Technical',name:'Digitech',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'The photographic equivalent of a DIT — manages all digital capture, tethering, and data management on still photography sets. Provides the photographer and'},
  {id:57,cat:3,type:'Technical',name:'Steadicam Operator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates a Steadicam rig — a camera stabilisation system worn by the operator — to achieve smooth, flowing camera movement impossible to replicate with a h'},
  {id:58,cat:3,type:'Technical',name:'Jib Operator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates camera jib cranes — mechanical arm systems that enable smooth, elevated, and extended-reach camera movements. Used for reveal shots, elevated angl'},
  {id:59,cat:3,type:'Technical',name:'Jib Crane Tech / Jib Tech',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Supports the Jib Operator by assembling, operating the panning head, and managing the technical mechanics of the jib system throughout the shooting day.'},
  {id:60,cat:3,type:'Technical',name:'Technocrane Operator',tier:'Senior Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates a Technocrane — a remotely operated telescoping camera crane capable of extreme reach and precision movement. Used on high-end productions for com'},
  {id:61,cat:3,type:'Technical',name:'Technocrane Tech',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Supports the Technocrane Operator with assembly, cabling, remote head setup, and technical maintenance of the Technocrane system throughout the shooting da'},
  {id:62,cat:3,type:'Technical',name:'Remote Head Tech',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Specialises in the setup and operation of remotely controlled camera head systems — enabling the camera to be precisely controlled from a distance or from '},
  {id:63,cat:3,type:'Technical',name:'Underwater Camera Operator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates camera systems underwater — combining diving skill and certification with cinematographic technique to capture footage in aquatic environments.'},
  {id:64,cat:3,type:'Technical',name:'VTR Operator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Video Tape Recording Operator — manages the playback and recording of video content during production. In modern contexts, operates digital recording syste'},
  {id:65,cat:3,type:'Technical',name:'Picture Car Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Sources, manages, and coordinates all hero and background vehicles used in a production — from period cars for historical productions to contemporary fleet'},
  {id:66,cat:4,type:'Technical',name:'Editor',tier:'Mid-Senior',rate:'$600–1,500/day',orb:3,sum:'Constructs the narrative from raw footage — selecting, assembling, and refining shots to create pacing, emotion, and story. The editor is among the most cr'},
  {id:67,cat:4,type:'Technical',name:'Assistant Editor',tier:'Junior-Mid',rate:'$300–700/day',orb:3,sum:'Supports the Editor with technical and organisational tasks — managing media, syncing audio, organising project files, and enabling the Editor to focus on '},
  {id:68,cat:4,type:'Technical',name:'Colorist',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Shapes the final visual mood and atmosphere of a production through colour grading — balancing, enhancing, and transforming footage to achieve creative int'},
  {id:69,cat:4,type:'Technical',name:'Color Producer',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Manages the business and scheduling operations of a colour department or grading facility — booking suites, managing client relationships, and ensuring tha'},
  {id:70,cat:4,type:'Technical',name:'VFX Supervisor',tier:'Senior',rate:'$800–2,000/day',orb:3,sum:'Responsible for all visual effects in a production — from on-set supervision through to final composited images. Oversees VFX artists, manages vendors, and'},
  {id:71,cat:4,type:'Technical',name:'VFX Artist',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Creates individual visual effects shots — compositing, rotoscoping, painting, particle simulation, or any combination of digital techniques required to pro'},
  {id:72,cat:4,type:'Technical',name:'Compositor',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Combines multiple image elements — CG renders, live-action footage, matte paintings, and effects — into seamless finished shots. Compositing is the final c'},
  {id:73,cat:4,type:'Technical',name:'Motion Designer',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Creates animated graphics, title sequences, and motion-based visual elements — combining design sensibility with technical animation skill across formats f'},
  {id:74,cat:4,type:'Technical',name:'3D Artist',tier:'Mid-Senior',rate:'$600–1,500/day',orb:3,sum:'Creates three-dimensional digital assets, environments, and animations — building the raw materials that VFX supervisors, compositors, and animators work w'},
  {id:75,cat:4,type:'Technical',name:'CG Artist',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Creates computer-generated imagery across characters, creatures, environments, and simulations — contributing to the CG pipeline at a production level as d'},
  {id:76,cat:4,type:'Technical',name:'Render Artist',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Manages the technical process of rendering — converting 3D scene data into finished images — optimising render settings, managing render farms, and trouble'},
  {id:77,cat:4,type:'Technical',name:'Finishing Artist',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Performs the final technical and creative finishing steps on a project — online editing, conform, title integration, and all technical corrections that pre'},
  {id:78,cat:4,type:'Technical',name:'Retoucher',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Produces final polished photographs for editorial, advertising, and e-commerce — performing beauty retouching, compositing, and technical corrections to br'},
  {id:79,cat:4,type:'Technical',name:'Post Production Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Manages the administrative and logistical operations of the post-production phase — coordinating schedules, deliveries, and communication between editorial'},
  {id:80,cat:4,type:'Technical',name:'Post Sound Mixer',tier:'Senior',rate:'$800–2,000/day',orb:3,sum:'Manages the final audio mix for a production — balancing all sound elements including dialogue, music, sound effects, and foley into a coherent and technic'},
  {id:81,cat:4,type:'Technical',name:'Foley Artist',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Creates synchronised sound effects in a recording studio to match the actions on screen — footsteps, handling sounds, cloth movement — bringing physical re'},
  {id:82,cat:4,type:'Technical',name:'Sound Designer',tier:'Senior',rate:'$800–2,000/day',orb:3,sum:'Creates and assembles all non-music sonic elements in a production — from ambient environments and foley direction to designed effects, transitions, and so'},
  {id:83,cat:4,type:'Technical',name:'Audio Engineer (Post)',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Manages the technical aspects of audio recording, processing, and delivery in post-production — handling ADR recording, audio restoration, and the technica'},
  {id:84,cat:4,type:'Technical',name:'Animator',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Brings characters, objects, and environments to life through movement — working across 2D and 3D animation disciplines to create the motion that gives CG w'},
  {id:85,cat:4,type:'Technical',name:'Data Manager (Post)',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Manages all digital assets throughout the post-production pipeline — ensuring that media, project files, deliverables, and archives are correctly managed, '},
  {id:86,cat:5,type:'Visual',name:'Graphic Designer',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Creates visual communication across print and digital — from brand identity to campaign artwork, publications, packaging, and digital assets. The broadest '},
  {id:87,cat:5,type:'Visual',name:'Digital Designer',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Specialises in design for digital environments — creating interfaces, digital campaigns, web graphics, and interactive elements optimised for screens and d'},
  {id:88,cat:5,type:'Visual',name:'Brand Identity Designer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:4,sum:'Specialises in developing visual brand identities — creating logo systems, colour palettes, typography hierarchies, and comprehensive visual language guide'},
  {id:89,cat:5,type:'Visual',name:'Illustrator',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Creates original illustrations across editorial, advertising, publishing, and digital contexts — developing a distinctive visual voice and applying it to c'},
  {id:90,cat:5,type:'Visual',name:'UI/UX Designer',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Designs the user interfaces and experiences for digital products — from apps and platforms to creative tools — combining user research, information archite'},
  {id:91,cat:5,type:'Visual',name:'Web Designer',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Designs websites — creating visual layouts, page structures, and user experiences optimised for web environments. Often works closely with web developers o'},
  {id:92,cat:5,type:'Visual',name:'Web Developer',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Builds and maintains websites and web applications — implementing designs, developing functionality, and ensuring performance, accessibility, and technical'},
  {id:93,cat:5,type:'Visual',name:'Product Designer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:4,sum:'Designs physical or digital products — from consumer electronics and industrial objects to digital product experiences — combining functional and aesthetic'},
  {id:94,cat:5,type:'Visual',name:'Set Designer',tier:'Head of Department',rate:'$1,000–2,500/day',orb:4,sum:'Creates the physical environments in which productions take place — designing, planning, and overseeing the construction and dressing of sets that serve th'},
  {id:95,cat:5,type:'Visual',name:'Set Decorator',tier:'Head of Department',rate:'$1,000–2,500/day',orb:4,sum:'Responsible for everything inside a set that is not architectural — selecting, sourcing, and placing all props, furniture, and dressing that populate the p'},
  {id:96,cat:5,type:'Visual',name:'Set Dresser',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Physically executes the placement and arrangement of all set decoration under the direction of the Set Decorator — dressing and striking sets, managing pro'},
  {id:97,cat:5,type:'Visual',name:'Production Designer',tier:'Head of Department',rate:'$1,000–2,500/day',orb:4,sum:'The head of the entire art department — responsible for the visual concept of the complete production environment. Creates a coherent, immersive world thro'},
  {id:98,cat:5,type:'Visual',name:'Scenic Painter',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Creates painted environments, backdrops, and scenic elements — from realistic architectural finishes and aged textures to artistic painted backdrops and de'},
  {id:99,cat:5,type:'Visual',name:'Layout Artist',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Creates the spatial layouts that define camera angles, character placement, and environment compositions in animated productions — translating storyboard p'},
  {id:100,cat:5,type:'Visual',name:'Projection Mapping Specialist',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Designs and executes projection mapping installations — projecting images and video onto three-dimensional surfaces to transform spaces and create immersiv'},
  {id:101,cat:5,type:'Visual',name:'Stage Designer / Live Show Designer',tier:'Senior Specialist',rate:'$800–2,000/day',orb:4,sum:'Designs the physical stage environment and visual landscape for live music performances, theatre productions, and large-scale events — creating the spatial'},
  {id:102,cat:5,type:'Visual',name:'Spatial Designer',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Creates spatial experiences — designing the way people move through, interact with, and experience physical spaces. Combines architectural thinking with ex'},
  {id:103,cat:5,type:'Visual',name:'Interior Designer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:4,sum:'Designs and specifies the interior environments of spaces — for residential, commercial, and production contexts — creating functional, beautiful interiors'},
  {id:104,cat:5,type:'Visual',name:'Fabricator',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Builds, constructs, and manufactures custom physical elements — sets, props, scenic pieces, display structures, and event installations — to design specifi'},
  {id:105,cat:5,type:'Visual',name:'Design Assistant',tier:'Junior',rate:'$200–600/day',orb:4,sum:'Supports senior designers and art directors with the execution of design tasks — preparing files, sourcing references, managing assets, and developing foun'},
  {id:106,cat:6,type:'Styling',name:'Editorial Stylist',tier:'Mid-Senior',rate:'$600–1,500/day',orb:5,sum:'Creates fashion and lifestyle narratives for editorial contexts — working with photographers and art directors to build looks that tell stories rather than'},
  {id:107,cat:6,type:'Styling',name:'Commercial Stylist',tier:'Mid-Senior',rate:'$600–1,500/day',orb:5,sum:'Styles commercial advertising and branded content — prioritising product presentation, brand alignment, and client approval over editorial artistry. Balanc'},
  {id:108,cat:6,type:'Styling',name:'Celebrity Stylist',tier:'Senior',rate:'$800–2,000/day',orb:5,sum:'Manages the personal style and public appearance of high-profile talent — dressing them for red carpets, media appearances, editorial shoots, and everyday '},
  {id:109,cat:6,type:'Styling',name:'Street Stylist',tier:'Mid',rate:'$400–1,000/day',orb:5,sum:'Documents and curates real-world fashion as it appears on the street — photographing, interviewing, and profiling individuals whose personal style is cultu'},
  {id:110,cat:6,type:'Styling',name:'Prop Stylist',tier:'Mid',rate:'$400–1,000/day',orb:5,sum:'Sources, styles, and arranges props and objects in photographic and film productions — creating the physical supporting environment that frames and context'},
  {id:111,cat:6,type:'Styling',name:'Stylist Assistant',tier:'Junior',rate:'$200–600/day',orb:5,sum:'Supports lead stylists in all aspects of the styling workflow — from showroom pulls and steaming through to on-set dressing assistance and return coordinat'},
  {id:112,cat:6,type:'Styling',name:'Costume Designer',tier:'Head of Department',rate:'$1,000–2,500/day',orb:5,sum:'Designs or sources every costume worn on screen — building a coherent visual world through clothing that expresses character, period, status, and narrative'},
  {id:113,cat:6,type:'Styling',name:'Costume Assistant',tier:'Junior',rate:'$200–600/day',orb:5,sum:'Supports the Costume Designer and Wardrobe Supervisor with all costume department tasks — from shopping and sourcing through to on-set dressing and continu'},
  {id:114,cat:6,type:'Styling',name:'Wardrobe Supervisor',tier:'Mid-Senior',rate:'$600–1,500/day',orb:5,sum:'Manages the day-to-day operations of the wardrobe department — overseeing costume continuity, maintenance, and the daily workflow of the wardrobe team duri'},
  {id:115,cat:6,type:'Styling',name:'Fashion Designer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:5,sum:'Creates original clothing and accessories — from concept through pattern, sampling, and production. Operates across haute couture, ready-to-wear, and comme'},
  {id:116,cat:6,type:'Styling',name:'Garment Production Manager',tier:'Mid-Senior',rate:'$600–1,500/day',orb:5,sum:'Manages the production process for garment manufacturing — coordinating factories, managing quality control, and ensuring garments are produced to specific'},
  {id:117,cat:6,type:'Styling',name:'Seamstress',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates and alters garments by hand and machine — bringing pattern maker and designer specifications into physical existence and performing alterations to '},
  {id:118,cat:6,type:'Styling',name:'Tailor',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates precision tailored garments — primarily menswear suits, coats, and structured pieces — using traditional tailoring techniques to achieve exact fit '},
  {id:119,cat:6,type:'Styling',name:'Prop Master',tier:'Head of Department',rate:'$1,000–2,500/day',orb:5,sum:'Heads the props department — responsible for every hand-held or actor-manipulated object that appears on screen, from hero props to background dressing use'},
  {id:120,cat:6,type:'Styling',name:'Hair Stylist',tier:'Mid',rate:'$400–1,000/day',orb:5,sum:'Creates and maintains all hair styling for talent on set — from natural, character-driven hairstyles to period-specific and creative fantasy hair concepts.'},
  {id:121,cat:6,type:'Styling',name:'Makeup Artist (Beauty)',tier:'Mid',rate:'$400–1,000/day',orb:5,sum:'Creates beauty and lifestyle makeup for commercial photography, television, and editorial — executing flawless, camera-ready beauty that enhances the talen'},
  {id:122,cat:6,type:'Styling',name:'Character Makeup Artist',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates non-naturalistic character makeup — ageing, injuries, cultural markings, period-specific looks, and any makeup work that transforms an actor\'s appe'},
  {id:123,cat:6,type:'Styling',name:'SFX Makeup Artist',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates special effects makeup — wounds, burns, ageing effects, creature makeup, and any makeup work that creates physical transformation or illusion using'},
  {id:124,cat:6,type:'Styling',name:'SFX Coordinator',tier:'Head of Department',rate:'$1,000–2,500/day',orb:5,sum:'Heads the special effects department — responsible for all practical on-set physical effects, including fire, water, explosions, atmospheric effects, and m'},
  {id:125,cat:6,type:'Styling',name:'Groomer',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Maintains talent\'s overall appearance on set — managing hair touch-ups, makeup maintenance, and general grooming between and during takes to ensure consist'},
  {id:126,cat:6,type:'Styling',name:'Nail Artist',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates nail art and nail styling for photo and film productions — from natural, commercial-ready nail looks to elaborate nail art designs for editorial an'},
  {id:127,cat:6,type:'Styling',name:'Food Stylist',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Prepares and styles food and beverages for photography and film — making food look its most appealing on camera using specialist techniques, equipment, and'},
  {id:128,cat:6,type:'Styling',name:'Florist',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates floral arrangements and botanical installations for productions and events — from table centrepieces and bridal work to elaborate set dressing and '},
  {id:129,cat:7,type:'Sound',name:'Composer',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Creates original music scores that serve the emotional and narrative needs of a production. Works closely with directors and music supervisors from spottin'},
  {id:130,cat:7,type:'Sound',name:'Music Supervisor',tier:'Senior Specialist',rate:'$800–2,000/day',orb:0,sum:'Finds, licenses, and manages all music used in a production — from source music and sync licenses to trailer music and artist collaborations. Sits at the i'},
  {id:131,cat:7,type:'Sound',name:'Music Supervisor Assistant',tier:'Junior',rate:'$200–600/day',orb:0,sum:'Supports the Music Supervisor with research, clearance administration, cue sheet management, and client communication — building the skills and relationshi'},
  {id:132,cat:7,type:'Sound',name:'Sound Designer',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Creates the complete sonic world of a production — designing, sourcing, and assembling all non-music sound elements that build the audio environment.'},
  {id:133,cat:7,type:'Sound',name:'Production Sound Mixer',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Captures and manages all audio on set during principal photography — responsible for the quality and technical standard of all production sound that will b'},
  {id:134,cat:7,type:'Sound',name:'Post Sound Mixer',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Manages the final audio mix — balancing dialogue, music, sound effects, and foley into a complete and technically compliant audio experience across all req'},
  {id:135,cat:7,type:'Sound',name:'Boom Operator',tier:'Mid',rate:'$400–1,000/day',orb:0,sum:'Physically positions and operates the boom microphone to capture on-set dialogue at the highest possible quality — working in precise coordination with the'},
  {id:136,cat:7,type:'Sound',name:'Studio Recording Engineer',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Records and engineers all studio audio sessions — from music recording and voice-over to ADR and podcast production. Manages the technical environment of t'},
  {id:137,cat:7,type:'Sound',name:'Live Sound Engineer',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Manages all audio for live performances — mixing front-of-house sound for the audience and monitoring sound for performers on stage.'},
  {id:138,cat:7,type:'Sound',name:'Audio Visual Technician',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Sets up, operates, and troubleshoots all audio-visual equipment at events and venues — from projection and display systems to audio playback and streaming '},
  {id:139,cat:7,type:'Sound',name:'Foley Artist',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Creates synchronised sound effects in a recording studio to match on-screen physical actions — bringing sonic reality to the audio world through precise pe'},
  {id:140,cat:7,type:'Sound',name:'Choreographer',tier:'Senior Specialist',rate:'$800–2,000/day',orb:0,sum:'Creates, teaches, and directs all dance and movement sequences in a production — developing movement vocabulary that serves the narrative, character, and v'},
  {id:141,cat:7,type:'Sound',name:'Movement Director',tier:'Senior Specialist',rate:'$800–2,000/day',orb:0,sum:'Works with actors and performers on all non-dance physical movement — developing physical performance, bodily character expression, and movement sequences '},
  {id:142,cat:7,type:'Sound',name:'Stunt Coordinator',tier:'Head of Department',rate:'$1,000–2,500/day',orb:0,sum:'Plans, designs, and executes all stunt work on a production — ensuring that all physical action is achieved safely while meeting the director\'s creative re'},
  {id:143,cat:7,type:'Sound',name:'Music Producer (Album/Track)',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Oversees and shapes the creative and technical development of recorded music — working with artists to define and realise the sonic identity of a track, EP'},
  {id:144,cat:7,type:'Sound',name:'Vocal Director',tier:'Senior Specialist',rate:'$800–2,000/day',orb:0,sum:'Works with singers and vocal performers to achieve the best possible vocal performance — from individual artists to large-scale choral arrangements.'},
  {id:145,cat:7,type:'Sound',name:'Music Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Leads the musical performance of a production — directing musicians, managing musical arrangements, and ensuring musical quality across live and recorded c'},
  {id:146,cat:7,type:'Sound',name:'Playback Operator',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Manages all pre-recorded music playback on set — ensuring that artists and performers have the correct music playing at the right moment during filming or '},
  {id:147,cat:7,type:'Sound',name:'DJ / Music Programmer',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Curates, mixes, and performs music for events, branded activations, content productions, and broadcast contexts — creating sonic atmosphere that serves the'},
  {id:148,cat:7,type:'Sound',name:'Intimacy Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Supports performers and directors in planning, choreographing, and safely executing scenes that involve physical intimacy — ensuring consent, comfort, and '},
  {id:149,cat:7,type:'Sound',name:'Composer / Arranger',tier:'Mid-Senior',rate:'$600–1,500/day',orb:0,sum:'Composes and arranges music across commercial and creative contexts — often working at higher volume and speed than a film composer, producing tracks, iden'},
  {id:150,cat:8,type:'Writing',name:'Editorial / Fashion Photographer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'Creates imagery for editorial contexts — magazine features, fashion stories, and visual narratives that prioritise artistic storytelling over direct commer'},
  {id:151,cat:8,type:'Writing',name:'Commercial / Advertising Photographer',tier:'Senior',rate:'$800–2,000/day',orb:1,sum:'Creates photography for commercial advertising purposes — delivering images that serve specific commercial objectives while meeting rigorous technical and '},
  {id:152,cat:8,type:'Writing',name:'Portrait Photographer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Specialises in photographing individuals — creating images that capture personality, status, and character for corporate, editorial, and personal contexts.'},
  {id:153,cat:8,type:'Writing',name:'E-Commerce Photographer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Produces high-volume product photography for e-commerce platforms — creating consistent, technically precise imagery that meets platform specifications and'},
  {id:154,cat:8,type:'Writing',name:'BTS (Behind-the-Scenes) Photographer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Documents the making of productions — capturing candid and staged behind-the-scenes imagery for use in marketing, press, and content purposes.'},
  {id:155,cat:8,type:'Writing',name:'Event & Press Photographer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Covers live events — red carpets, premieres, openings, corporate events, and press conferences — capturing newsworthy and marketable imagery under unpredic'},
  {id:156,cat:8,type:'Writing',name:'Sports Photographer',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Captures compelling imagery at sporting events — requiring technical mastery of high-speed photography, knowledge of specific sports, and access management'},
  {id:157,cat:8,type:'Writing',name:'Documentary Photographer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'Creates long-form photographic documentary projects — using photography as a tool for journalism, advocacy, and cultural documentation. Requires patience, '},
  {id:158,cat:8,type:'Writing',name:'Street Photographer',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Creates candid photography in public spaces — documenting the human condition, social dynamics, and visual poetry of everyday urban life.'},
  {id:159,cat:8,type:'Writing',name:'Photo Assistant',tier:'Junior',rate:'$200–600/day',orb:1,sum:'Supports the photographer with all technical and logistical tasks — from equipment preparation and lighting setup through to on-set assistance and post-sho'},
  {id:160,cat:8,type:'Writing',name:'Content Creator / Influencer',tier:'Generalist',rate:'$500–1,500/day',orb:1,sum:'Produces original content primarily for social media — building and monetising audiences through a combination of production skill, platform knowledge, and'},
  {id:161,cat:8,type:'Writing',name:'Social Media Manager',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Manages the day-to-day operations of social media accounts — publishing content, managing communities, responding to audiences, and reporting on performanc'},
  {id:162,cat:8,type:'Writing',name:'Social Media Strategist',tier:'Senior',rate:'$800–2,000/day',orb:1,sum:'Develops social media strategy — defining platform approach, content pillars, audience growth strategy, and the framework that guides all social content an'},
  {id:163,cat:8,type:'Writing',name:'Copywriter',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Creates written content for advertising, marketing, and brand communications — from campaign headlines and social captions to long-form articles and brand '},
  {id:164,cat:8,type:'Writing',name:'Videographer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Captures and edits video content across corporate, event, social, and documentary formats — often operating as a one-person crew, shooting and editing inde'},
  {id:165,cat:8,type:'Writing',name:'UGC Creator',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Creates user-generated-style content — lo-fi, authentic-feeling video and photo content used by brands in paid advertising and organic social media.'},
  {id:166,cat:8,type:'Writing',name:'Marketing Director',tier:'Senior',rate:'$800–2,000/day',orb:1,sum:'Leads all marketing activity for an organisation — overseeing brand communications, campaign strategy, digital marketing, and the measurement and optimisat'},
  {id:167,cat:8,type:'Writing',name:'Marketing Manager',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Executes and manages marketing programmes — developing campaigns, managing vendors, and tracking performance across multiple channels and platforms.'},
  {id:168,cat:8,type:'Writing',name:'Marketing Coordinator',tier:'Junior-Mid',rate:'$300–700/day',orb:1,sum:'Supports the marketing team with coordination, scheduling, and administrative tasks — managing content calendars, vendor communications, and campaign logis'},
  {id:169,cat:8,type:'Writing',name:'Writer / Content Journalist',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Creates written content for editorial, brand, and digital platforms — combining journalism skills with content marketing capability to produce authoritativ'},
  {id:170,cat:8,type:'Writing',name:'Podcast Producer',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Produces podcasts from concept through distribution — managing recording, editing, guest booking, show notes, and the publishing workflow that brings audio'},
  {id:171,cat:8,type:'Writing',name:'Storyboard Artist (Marketing Context)',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Creates visual scripts for advertising, content, and digital productions — producing storyboard sequences that communicate camera direction, pacing, and na'},
  {id:172,cat:9,type:'Production',name:'Production Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'The operational hub of any production — managing the flow of information, documents, and logistics between all departments and the production office.'},
  {id:173,cat:9,type:'Production',name:'Post Production Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Manages the operational flow of the post-production phase — coordinating schedules, deliveries, and communication between editorial, colour, sound, VFX, an'},
  {id:174,cat:9,type:'Production',name:'Casting Director',tier:'Senior Specialist',rate:'$800–2,000/day',orb:2,sum:'Responsible for finding and recommending the right talent for every speaking and principal role in a production — combining an encyclopaedic knowledge of a'},
  {id:175,cat:9,type:'Production',name:'Casting Associate',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Supports the Casting Director across all casting functions — managing audition logistics, maintaining talent files, and developing the skills to become an '},
  {id:176,cat:9,type:'Production',name:'Location Manager',tier:'Senior',rate:'$800–2,000/day',orb:2,sum:'Responsible for finding, securing, and managing all filming locations — negotiating access agreements, managing location relationships, and ensuring each l'},
  {id:177,cat:9,type:'Production',name:'Location Scout',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Finds and photographs potential filming locations based on creative briefs — building a visual library of options for the Location Manager and director to '},
  {id:178,cat:9,type:'Production',name:'Project Manager (Production)',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Manages the complete lifecycle of creative and production projects — from scoping and scheduling through to delivery — ensuring all workstreams stay on tim'},
  {id:179,cat:9,type:'Production',name:'Production Office Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Runs the production office — managing the physical and operational infrastructure of the production base, including communication systems, crew services, a'},
  {id:180,cat:9,type:'Production',name:'Script Supervisor',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Maintains the creative and technical continuity of a production — tracking every detail of performance, set dressing, costume, and camera that must match a'},
  {id:181,cat:9,type:'Production',name:'Data Manager (Production)',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages all digital production data during principal photography — overseeing camera card ingest, backup verification, daily data delivery, and the integri'},
  {id:182,cat:9,type:'Production',name:'Transportation Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages all transportation logistics for a production — crew vehicles, talent cars, equipment trucks, and all movement of people and assets between locatio'},
  {id:183,cat:9,type:'Production',name:'Catering Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages all on-set catering and craft services — ensuring the crew is fed, nourished, and comfortable throughout the shooting day.'},
  {id:184,cat:9,type:'Production',name:'Props Buyer',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Sources and purchases all props required for the production under the direction of the Prop Master — building a detailed knowledge of markets, vendors, and'},
  {id:185,cat:9,type:'Production',name:'Art Department Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Manages the administrative and operational functions of the art department — coordinating between the Production Designer, Set Designer, Set Decorator, and'},
  {id:186,cat:9,type:'Production',name:'Wardrobe Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Manages the administrative and logistical operations of the wardrobe department — coordinating fittings, managing costume inventory, and supporting the Cos'},
  {id:187,cat:9,type:'Production',name:'Talent Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Manages all logistics related to on-screen talent — actor and presenter scheduling, appearance fees, travel and accommodation, and the day-of talent manage'},
  {id:188,cat:9,type:'Production',name:'Clearances Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages all intellectual property, music, image, and brand clearances required for a production — ensuring every piece of content and every identifiable el'},
  {id:189,cat:9,type:'Production',name:'Assistant Production Manager',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Supports the Production Manager with all operational logistics — managing specific departments or functions delegated by the PM to ensure smooth day-to-day'},
  {id:190,cat:9,type:'Production',name:'Picture Car Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Sources, manages, and coordinates all hero and background vehicles used across a production — managing the very specific world of specialist vehicle supply'},
  {id:191,cat:9,type:'Production',name:'Unit Publicist',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages all press and promotional activity during principal photography — handling set visits, press junket logistics, unit photography direction, and all '},
  {id:192,cat:10,type:'Enterprise',name:'Consumer Brand / Advertiser',tier:'Client',rate:'$500–1,500/day',orb:3,sum:'Consumer-facing brands that use advertising and branded content to drive product awareness, consideration, and purchase. Budget holders for campaign and co'},
  {id:193,cat:10,type:'Enterprise',name:'Fashion House / Luxury Brand',tier:'Client',rate:'$500–1,500/day',orb:3,sum:'Fashion and luxury brands with complex seasonal content requirements — editorial campaigns, runway coverage, social content, and brand films that uphold an'},
  {id:194,cat:10,type:'Enterprise',name:'Record Label',tier:'Client',rate:'$500–1,500/day',orb:3,sum:'Music industry companies that represent and develop recording artists — commissioning music videos, album rollout content, tour materials, and artist brand'},
  {id:195,cat:10,type:'Enterprise',name:'Advertising Agency',tier:'Client / Partner',rate:'$500–1,500/day',orb:3,sum:'Full-service advertising agencies that develop campaigns for brand clients — commissioning production companies, photographers, and creative talent to exec'},
  {id:196,cat:10,type:'Enterprise',name:'Creative Agency',tier:'Client / Partner',rate:'$500–1,500/day',orb:3,sum:'Agencies that specialise in brand identity, content, and creative strategy — developing the conceptual and visual systems that brands build their communica'},
  {id:197,cat:10,type:'Enterprise',name:'Production Company / Studio',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Independent production companies and studios that develop, produce, and distribute creative content — building director and talent rosters, developing proj'},
  {id:198,cat:10,type:'Enterprise',name:'Talent Management Agency',tier:'Client / Partner',rate:'$500–1,500/day',orb:3,sum:'Agencies that manage the careers and commercial interests of artists, actors, musicians, athletes, and other talent — commissioning content and managing ta'},
  {id:199,cat:10,type:'Enterprise',name:'PR Agency',tier:'Client / Partner',rate:'$500–1,500/day',orb:3,sum:'Public relations agencies that manage media coverage, reputation, and brand narrative for clients — commissioning content and photography to support press '},
  {id:200,cat:10,type:'Enterprise',name:'Events Company',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Events companies that plan, produce, and manage live experiences — from corporate conferences and product launches to entertainment events and experiential'},
  {id:201,cat:10,type:'Enterprise',name:'Post-Production House',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Post-production facilities that provide editorial, colour, sound, VFX, and finishing services to film, TV, advertising, and content clients.'},
  {id:202,cat:10,type:'Enterprise',name:'Streaming Platform / Broadcaster',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Streaming platforms and broadcasters that commission, develop, and distribute content — setting creative and technical standards for all content that carri'},
  {id:203,cat:10,type:'Enterprise',name:'Publishing House',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Publishers that commission written and visual content — managing editorial calendars, commissioning photographers and writers, and producing content for pr'},
  {id:204,cat:10,type:'Enterprise',name:'Sports Organisation',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Sports clubs, leagues, and governing bodies that use content, photography, and film to tell their stories, build fan engagement, and attract commercial par'},
  {id:205,cat:10,type:'Enterprise',name:'Cultural Institution / Museum',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Museums, galleries, cultural centres, and arts organisations that commission creative content, exhibitions, and educational materials — increasingly using '},
  {id:206,cat:10,type:'Enterprise',name:'Non-Profit / NGO',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Non-governmental and charitable organisations that use content and creative communication to advance their missions — requiring compelling imagery and stor'},
  {id:207,cat:10,type:'Enterprise',name:'Government / Tourism Board',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Government bodies and tourism organisations that commission content to promote destinations, policies, and public sector initiatives — often requiring comp'},
  {id:208,cat:10,type:'Enterprise',name:'Music Festival / Live Events',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Music festivals and large-scale live events that require significant creative, production, and content capability — from stage design and lighting to photo'},
  {id:209,cat:10,type:'Enterprise',name:'E-Commerce Brand',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Digitally-native brands that sell directly to consumers online — requiring continuous, high-volume product and lifestyle photography, video content, and di'},
  {id:210,cat:10,type:'Enterprise',name:'Sports Brand',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Sports and athletic lifestyle brands that use imagery, content, and athlete partnerships to build brand equity and drive product sales.'},
  {id:211,cat:10,type:'Enterprise',name:'Tech Company (Creative Client)',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Technology companies that commission creative content — from product photography and brand film to social content and event production — to support marketi'},
  {id:212,cat:11,type:'Tech',name:'Creative Tech Platform (SaaS)',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Software-as-a-service companies that build tools specifically for creative professionals — project management, asset management, collaboration, and creativ'},
  {id:213,cat:11,type:'Tech',name:'AI / Machine Learning Company (Creative)',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'AI companies building products for creative professionals — from image generation and editing tools to music composition, scriptwriting, and creative intel'},
  {id:214,cat:11,type:'Tech',name:'Production Management Software',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Software companies building tools to manage the operational workflows of productions — call sheets, scheduling, budgeting, and crew management for film, TV'},
  {id:215,cat:11,type:'Tech',name:'Creative Talent Marketplace',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Platforms that connect creative professionals with clients and opportunities — from freelance marketplaces to curated creative talent discovery platforms.'},
  {id:216,cat:11,type:'Tech',name:'Digital Asset Management (DAM) Platform',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Software platforms that help organisations store, organise, and distribute their digital creative assets — photos, videos, brand files, and creative collat'},
  {id:217,cat:11,type:'Tech',name:'Video Streaming Infrastructure',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Technology companies that provide the infrastructure and tools for video streaming — transcoding, CDN, live streaming, and video hosting platforms used by '},
  {id:218,cat:11,type:'Tech',name:'Music Tech Platform',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Technology companies building tools for musicians, producers, and the music industry — from music creation and recording software to music licensing, distr'},
  {id:219,cat:11,type:'Tech',name:'E-Commerce Tech for Creatives',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Platforms enabling creative professionals to sell their work directly — print-on-demand, digital download, licensing, and portfolio sites with integrated e'},
  {id:220,cat:11,type:'Tech',name:'Analytics & Intelligence Platform (Creative)',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Platforms providing data and intelligence specifically for the creative economy — audience insights, content performance analytics, trend intelligence, and'},
  {id:221,cat:11,type:'Tech',name:'Creative Collaboration Tool',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Platforms enabling creative teams to collaborate remotely — real-time feedback, asset sharing, version control, and approval workflows for creative project'},
  {id:222,cat:11,type:'Tech',name:'Post-Production Software Company',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Companies that build professional post-production software — editing, colour, VFX, and audio tools used by post-production professionals globally.'},
  {id:223,cat:11,type:'Tech',name:'Virtual Production Technology',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Companies developing virtual production infrastructure — LED volume stages, real-time rendering engines, camera tracking, and the integrated technology sys'},
  {id:224,cat:11,type:'Tech',name:'AR / VR / XR Content Company',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Companies creating augmented, virtual, and extended reality content — from brand experiences and advertising to entertainment, education, and training cont'},
  {id:225,cat:11,type:'Tech',name:'Podcast Tech Platform',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Companies building tools and infrastructure for podcast creation, distribution, monetisation, and analytics — serving independent creators and enterprise p'},
  {id:226,cat:11,type:'Tech',name:'Creator Economy Infrastructure',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Companies building financial and operational infrastructure for the creator economy — payment processing, subscription management, creator financing, and b'},
  {id:227,cat:11,type:'Tech',name:'Media Monitoring & Intelligence',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Platforms that monitor media coverage, social mentions, and brand performance across all channels — providing intelligence that brands, agencies, and PR fi'},
  {id:228,cat:11,type:'Tech',name:'Licensing & Rights Management Platform',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Technology platforms that manage intellectual property licensing, rights clearance, and royalty management for photographers, musicians, publishers, and me'},
  {id:229,cat:11,type:'Tech',name:'Creative Education Platform',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Online education platforms that teach creative skills — photography, filmmaking, design, music production, and business skills for creative professionals.'},
  {id:230,cat:11,type:'Tech',name:'Content Delivery Network (CDN)',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Technology infrastructure companies that distribute digital content at speed and scale globally — enabling fast delivery of images, video, and digital asse'},
  {id:231,cat:11,type:'Tech',name:'Virtual Production Previsualization Tool',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Software tools that enable film and VFX teams to previsualize and plan productions digitally before physical shooting — simulating camera positions, lighti'},
  {id:232,cat:12,type:'Business',name:'Creative Company CEO / Managing Director',tier:'C-Suite',rate:'$2,000–5,000/day',orb:5,sum:'The ultimate decision-maker in a creative business — responsible for overall strategy, culture, financial performance, and stakeholder relationships. Sets '},
  {id:233,cat:12,type:'Business',name:'Head of Production (Company Level)',tier:'Senior Leadership',rate:'$1,200–3,000/day',orb:5,sum:'Leads all production operations for an entire company or studio — overseeing the production pipeline, allocating resources, managing client relationships a'},
  {id:234,cat:12,type:'Business',name:'Chief Financial Officer (Creative Company)',tier:'C-Suite',rate:'$2,000–5,000/day',orb:5,sum:'Manages all financial operations for a creative company — from financial planning and reporting through to investor relations, fundraising, and financial r'},
  {id:235,cat:12,type:'Business',name:'Venture Capitalist (Media / Creative Tech)',tier:'Investor',rate:'Equity / Deal fee',orb:5,sum:'Venture capital investors who focus on media, creative technology, and the creator economy — identifying, funding, and supporting early-stage companies bui'},
  {id:236,cat:12,type:'Business',name:'Angel Investor (Creative Economy)',tier:'Investor',rate:'Equity / Deal fee',orb:5,sum:'Individual investors who provide early capital to creative economy companies — often former creative industry professionals with both capital and operating'},
  {id:237,cat:12,type:'Business',name:'Institutional / Strategic Investor',tier:'Investor',rate:'Equity / Deal fee',orb:5,sum:'Corporate or institutional investors who take strategic stakes in creative economy businesses — often large media companies, technology platforms, or famil'},
  {id:238,cat:12,type:'Business',name:'Private Equity (Media / Creative)',tier:'Investor',rate:'Equity / Deal fee',orb:5,sum:'Private equity firms that invest in and operate media and creative businesses — typically acquiring majority stakes and driving value creation through oper'},
  {id:239,cat:12,type:'Business',name:'Founder / Co-Founder (Creative Company)',tier:'Founder',rate:'Equity / Deal fee',orb:5,sum:'The builders of new creative economy companies — founding production companies, creative platforms, SaaS tools, and other ventures that serve or operate wi'},
  {id:240,cat:12,type:'Business',name:'Studio Executive',tier:'Senior Leadership',rate:'$1,200–3,000/day',orb:5,sum:'Senior decision-makers at major studios and streaming platforms — overseeing content strategy, development slates, and the commissioning decisions that sha'},
  {id:241,cat:12,type:'Business',name:'General Partner (Creative Fund)',tier:'Senior Investor',rate:'$500–1,500/day',orb:5,sum:'The senior decision-maker within a creative or media-focused investment fund — managing the full investment cycle from fundraising through deal-making and '},
  {id:242,cat:12,type:'Business',name:'Board Member / Advisor',tier:'Advisory',rate:'$500–1,500/day',orb:5,sum:'Senior individuals who provide strategic guidance to creative companies — bringing specific expertise in creative industries, finance, technology, or marke'},
  {id:243,cat:12,type:'Business',name:'Chief Operating Officer (Creative Company)',tier:'C-Suite',rate:'$2,000–5,000/day',orb:5,sum:'Manages the day-to-day operations of a creative company — translating the CEO\'s strategy into operational execution and managing the functional departments'},
  {id:244,cat:12,type:'Business',name:'Head of Business Development',tier:'Senior',rate:'$800–2,000/day',orb:5,sum:'Leads new business and partnership development for a creative company — identifying, developing, and closing new client relationships and strategic partner'},
  {id:245,cat:12,type:'Business',name:'Fund Manager (Creative Sector)',tier:'Investment',rate:'$500–1,500/day',orb:5,sum:'Manages investment portfolios with exposure to creative sector assets — from media company equity through to creative IP and content rights.'},
  {id:246,cat:12,type:'Business',name:'Limited Partner (LP)',tier:'Investor',rate:'Equity / Deal fee',orb:5,sum:'Institutional or high-net-worth investors who commit capital to creative economy funds — providing the capital base that GPs deploy into creative sector co'},
  {id:247,cat:12,type:'Business',name:'Entertainment Lawyer',tier:'Professional Services',rate:'$500–1,500/day',orb:5,sum:'Specialist lawyers who advise clients on intellectual property, contracts, talent deals, production agreements, and all legal matters specific to the enter'},
  {id:248,cat:12,type:'Business',name:'Talent Agent',tier:'Professional Services',rate:'$500–1,500/day',orb:5,sum:'Represents creative professionals — actors, directors, photographers, writers, and musicians — securing work, negotiating deals, and developing careers on '},
  {id:249,cat:12,type:'Business',name:'Business Manager (Entertainment)',tier:'Professional Services',rate:'$500–1,500/day',orb:5,sum:'Manages the financial, tax, and business affairs of entertainment industry talent — ensuring clients are financially compliant, protected, and building lon'},
  {id:250,cat:12,type:'Business',name:'Creative Industry Consultant',tier:'Advisory',rate:'$500–1,500/day',orb:5,sum:'Provides specialist advisory services to creative businesses, brands, and institutions — applying deep industry expertise to solve specific strategic, oper'},
  {id:251,cat:12,type:'Business',name:'Chief Creative Officer (Capital / Strategy Context)',tier:'C-Suite / Advisory',rate:'$500–1,500/day',orb:5,sum:'The most senior creative voice within a capital structure or multi-entity creative group — responsible for ensuring creative quality, vision, and cultural '},
  {id:252,cat:2,type:'Production',name:'Lead Actor / Principal Cast',tier:'Principal Talent',rate:'$500–1,500/day',orb:1,sum:'The primary on-screen talent driving the narrative — responsible for embodying character, delivering performance, and anchoring the emotional core of a pro'},
  {id:253,cat:2,type:'Production',name:'Supporting Actor',tier:'Supporting Talent',rate:'$500–1,500/day',orb:1,sum:'Delivers defined character performances in support of the lead narrative — bringing specificity, depth, and craft to roles that shape the world around the '},
  {id:254,cat:2,type:'Production',name:'Background Artist / Extra',tier:'Background Talent',rate:'$500–1,500/day',orb:1,sum:'Populates the world of a production — creating the ambient human texture of scenes without dialogue, bringing authenticity and life to any environment.'},
  {id:255,cat:2,type:'Production',name:'Stunt Coordinator',tier:'Senior Specialist',rate:'$800–2,000/day',orb:1,sum:'Designs, plans, and supervises all stunt and action sequences — ensuring performer safety while delivering the visceral physical storytelling the director '},
  {id:256,cat:2,type:'Production',name:'Stunt Performer / Stunt Double',tier:'Specialist Talent',rate:'$500–1,500/day',orb:1,sum:'Executes physical action sequences requiring specialist training — doubling for principal cast or performing featured stunt work in high-risk action scenar'},
  {id:257,cat:2,type:'Production',name:'Acting / Performance Coach',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Works one-on-one or in small groups with cast to develop performance, refine technique, and prepare actors for the specific demands of a role or production'},
  {id:258,cat:2,type:'Production',name:'Dialect & Accent Coach',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Trains and coaches actors in specific dialects, accents, and speech patterns required for their role — ensuring authenticity and consistency across the ful'},
  {id:259,cat:2,type:'Production',name:'Chemistry & Intimacy Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Facilitates authentic relational and intimate performance between cast — creating the psychological and physical safety framework that allows actors to do '},
  {id:260,cat:2,type:'Production',name:'Casting Director',tier:'Senior Specialist',rate:'$800–2,000/day',orb:1,sum:'Leads the identification, audition, and selection of all talent for a production — translating character vision into the human performances that will defin'},
  {id:261,cat:2,type:'Production',name:'Script Supervisor',tier:'Mid–Senior',rate:'$600–1,500/day',orb:1,sum:'The guardian of continuity on set — tracking every visual, dialogue, and physical detail across takes to ensure the editor has everything needed for a seam'},
  {id:262,cat:13,type:'Visual',name:'Fine Art Painter',tier:'Independent / Represented',rate:'$500–1,500/day',orb:0,sum:'Creates original works on canvas, panel, or surface — developing a sustained body of practice that interrogates the world through paint, material, and mark'},
  {id:263,cat:13,type:'Visual',name:'Muralist',tier:'Independent / Commissioned',rate:'$500–1,500/day',orb:0,sum:'Creates large-scale painted works in public and private spaces — transforming walls, buildings, and environments into sites of cultural expression and comm'},
  {id:264,cat:13,type:'Visual',name:'Sculptor',tier:'Independent / Represented',rate:'$500–1,500/day',orb:0,sum:'Works in three-dimensional form — across material, scale, and process — to create objects and installations that occupy, challenge, and transform physical '},
  {id:265,cat:13,type:'Strategy',name:'Art Collector',tier:'Private / Institutional',rate:'$500–1,500/day',orb:0,sum:'Builds and manages a curated body of art acquisitions — developing taste, relationships, and a collection that holds cultural and financial significance.'},
  {id:266,cat:13,type:'Strategy',name:'Exhibition Curator',tier:'Mid–Senior',rate:'$600–1,500/day',orb:0,sum:'Conceives, develops, and delivers art exhibitions — selecting work, building interpretive frameworks, and creating the conditions for meaningful encounters'},
  {id:267,cat:13,type:'Strategy',name:'Art Gallery Director',tier:'Senior / Director',rate:'$1,000–2,500/day',orb:0,sum:'Leads the commercial, curatorial, and institutional direction of a gallery — managing artist relationships, sales strategy, and long-term programme develop'},
  {id:268,cat:13,type:'Strategy',name:'Art Dealer / Secondary Market Specialist',tier:'Mid–Senior',rate:'$600–1,500/day',orb:0,sum:'Operates in the secondary art market — identifying, valuing, sourcing, and placing artworks for private clients through direct sales, auction, and private '},
  {id:269,cat:13,type:'Strategy',name:'Art Advisor / Art Consultant',tier:'Mid–Senior',rate:'$600–1,500/day',orb:0,sum:'Provides expert guidance to private collectors, corporations, and institutions on art acquisition, collection development, and cultural investment strategy'},
  {id:270,cat:13,type:'Production',name:'Art Conservator / Restorer',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Preserves, stabilises, and restores artworks — applying specialist scientific and material knowledge to protect cultural objects for future generations.'},
  {id:271,cat:13,type:'Strategy',name:'Museum / Gallery Educator',tier:'Mid',rate:'$400–1,000/day',orb:0,sum:'Develops and delivers educational programmes that open art to diverse audiences — connecting exhibitions, collections, and ideas to communities, schools, a'},
  {id:272,cat:13,type:'Visual',name:'Printmaker',tier:'Independent / Represented',rate:'$500–1,500/day',orb:0,sum:'Creates original artworks through printmaking processes — etching, screenprint, lithography, and digital — developing editions that bring fine art to a bro'},
  {id:273,cat:13,type:'Visual',name:'Textile & Fibre Artist',tier:'Independent / Represented',rate:'$500–1,500/day',orb:0,sum:'Works with fabric, thread, and fibre as primary artistic media — creating works that bridge craft tradition, conceptual art practice, and contemporary mate'},
  {id:274,cat:13,type:'Visual',name:'Installation Artist',tier:'Independent / Institutional',rate:'$500–1,500/day',orb:0,sum:'Creates immersive, site-responsive environments and installations — transforming space itself into a medium for artistic experience.'},
  {id:275,cat:13,type:'Strategy',name:'Art Fair Director',tier:'Director / Executive',rate:'$1,200–3,000/day',orb:0,sum:'Leads the strategic, curatorial, and commercial direction of an art fair — selecting galleries, building the programme, and positioning the fair within the'},
  {id:276,cat:13,type:'Strategy',name:'Artist Estate Manager',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Manages the legal, commercial, and cultural legacy of a deceased or incapacitated artist — protecting their work, reputation, and the integrity of their pr'},
  {id:277,cat:13,type:'Visual',name:'Ceramic Artist / Potter',tier:'Independent / Represented',rate:'$500–1,500/day',orb:0,sum:'Works with clay and fire to create objects and artworks that span functional craft, decorative art, and fine art practice — building a market across multip'},
  {id:278,cat:13,type:'Strategy',name:'Public Art Commissioning Officer',tier:'Mid–Senior',rate:'$600–1,500/day',orb:0,sum:'Manages the commissioning, procurement, and delivery of public art on behalf of institutions, developers, and government bodies.'},
  {id:279,cat:13,type:'Strategy',name:'Art Writer / Critic',tier:'Independent / Staff',rate:'$500–1,500/day',orb:0,sum:'Writes critically and interpretively about art — reviewing exhibitions, profiling artists, and developing the discourse through which art is understood and'},
  {id:280,cat:13,type:'Production',name:'Art Technician / Gallery Installer',tier:'Mid',rate:'$400–1,000/day',orb:0,sum:'Handles the physical installation, care, and deinstallation of artworks — ensuring works are presented with precision, safety, and curatorial fidelity.'},
  {id:281,cat:13,type:'Strategy',name:'Cultural Fundraiser / Development Officer',tier:'Mid–Senior',rate:'$600–1,500/day',orb:0,sum:'Secures the financial support — through trusts, foundations, corporate partners, and individual donors — that makes ambitious cultural programming possible'},
  {id:282,cat:13,type:'Strategy',name:'Arts Lawyer / Cultural Property Specialist',tier:'Senior / Specialist',rate:'$500–1,500/day',orb:0,sum:'Provides specialist legal counsel on art transactions, intellectual property, cultural property, authenticity disputes, and the legal infrastructure of the'}
];

const TIER_ORDER = ['C-Suite','Executive','Director / Executive','Senior Leadership','Head of Department','Director / Senior','Senior / Advisory','Senior / Director','Senior / Specialist','Senior','Mid–Senior','Mid-Senior','Mid','Junior-Mid','Junior','Entry','Specialist','Senior Specialist','Independent / Commissioned','Independent / Represented','Private / Institutional','Enterprise','Technology','Investor','Senior Investor','Investment','Founder','Advisory','C-Suite / Advisory','Professional Services'];

/* ARCHETYPES_LIST kept as a smaller "primary disciplines" subset for places
   that don't need the full 282 (onboarding's first-glance list, switcher
   quick-pick). The full LIBRARY is the canonical source for the Skills
   Library browser.                                                       */
const ARCHETYPES_LIST = [
  { name: 'Creative Director', tier: 'Foundation', desc: 'Vision, aesthetics, brand storytelling' },
  { name: 'Art Director',      tier: 'Visual',     desc: 'Visual language, layout, design systems' },
  { name: 'Stylist',           tier: 'Visual',     desc: 'Wardrobe, props, set dressing' },
  { name: 'Photographer',      tier: 'Production', desc: 'Stills, editorial, commercial' },
  { name: 'Cinematographer',   tier: 'Production', desc: 'Camera, lighting, lensing' },
  { name: '1st AD',            tier: 'Production', desc: 'Schedule, crew, set logistics' },
  { name: 'Producer',          tier: 'Production', desc: 'Budget, delivery, logistics' },
  { name: 'Editor',            tier: 'Post',       desc: 'Picture cut, sequence, pacing' },
  { name: 'Music Supervisor',  tier: 'Post',       desc: 'Licensing, sync, sound direction' },
  { name: 'Retoucher',         tier: 'Post',       desc: 'Image finishing, colour' },
  { name: 'PR Specialist',     tier: 'Strategy',   desc: 'Press, narrative, amplification' },
  { name: 'Brand Strategist',  tier: 'Strategy',   desc: 'Positioning, identity, voice' },
  { name: 'Casting Director',  tier: 'Production', desc: 'Talent sourcing, chemistry' },
  { name: 'Set Designer',      tier: 'Visual',     desc: 'Spatial design, fabrication' },
  { name: 'Copywriter',        tier: 'Strategy',   desc: 'Voice, taglines, narrative' },
  { name: 'Creative Producer', tier: 'Production', desc: 'Producer + creative oversight' },
];

/* ─── OB · step pills (top progress) ─────────────────────────── */
function OBStepPills({ step, total = 3, labels = [] }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={i} style={{
            padding: '6px 14px', borderRadius: 999,
            background: active ? ACCENT : (done ? T_OB.cardBgAlt : 'transparent'),
            border: `1px solid ${active ? 'transparent' : T_OB.borderMd}`,
            display: 'flex', alignItems: 'center', gap: 7,
            transition: `all ${EASE_DELIBERATE}`,
          }}>
            <span style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em',
              color: active ? ACCENT_INK : (done ? T_OB.ink3 : T_OB.ink4),
            }}>{String(n).padStart(2, '0')}</span>
            {labels[i] && (
              <span style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 11.5, letterSpacing: '-0.005em',
                color: active ? ACCENT_INK : (done ? T_OB.ink2 : T_OB.ink4),
              }}>{labels[i]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── OB · step stack (the 3 cards on the left) ────────────── */
function OBStepStack({ step, titles, onPick }) {
  // The tall left-side step stack used to repeat what the top-bar
  // step pills already say. With the pills present, this stack added
  // visual noise without adding information — three progress indicators
  // on one screen. So this component now returns null. The signature is
  // preserved so callers don't need to be modified.
  return null;
}

/* ─── OB · pre-population banner ───────────────────────────── */
function OBPrepopBanner({ source }) {
  return (
    <div style={{
      padding: '10px 14px',
      background: 'rgba(255,171,13,0.08)',
      border: '1px solid rgba(255,171,13,0.20)',
      borderRadius: 10,
      display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, marginTop: 6, flexShrink: 0 }}/>
      <div>
        <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 12, color: T_OB.ink2, marginBottom: 2 }}>
          Found from your {source}
        </div>
        <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 11, color: T_OB.ink3, lineHeight: 1.5 }}>
          Confirm or update each field. Nothing is saved until you continue.
        </div>
      </div>
    </div>
  );
}

/* ─── OB · shared layout (top bar + bottom counter) ────────── */
function OBLayout({ children, step }) {
  const { isMobile, isTablet } = useViewport();
  // Hide the step-pill labels on mobile (just show the number); show full labels on tablet+
  const pillLabels = isMobile ? [] : ['Identity', 'Archetype', 'Photo'];
  return (
    <div style={{
      width: '100%', minHeight: '100vh', background: T_OB.pageBg,
      fontFamily: BODY, color: T_OB.ink,
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '16px 20px' : (isTablet ? '20px 28px' : '24px 40px'),
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${T_OB.dividerInk}`,
        gap: 12,
      }}>
        <NOSMark T={T_OB} size={isMobile ? 12 : 14} label={isMobile ? null : "Welcome"} />
        {step
          ? <OBStepPills step={step} labels={pillLabels} />
          : <div style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: T_OB.ink4,
            }}>Onboarding</div>}
        {!isMobile && (
          <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 12, color: T_OB.ink4 }}>v1.4</div>
        )}
      </div>
      {/* Body — centred, single column. The previous design used a
          two-column layout with a tall left "step stack" repeating
          the step titles, but the step pills above already carry that
          information. One column reads cleaner and gives the form
          itself room to breathe. */}
      <div style={{
        flex: 1,
        padding: isMobile ? '24px 20px' : (isTablet ? '40px 36px' : '60px 80px'),
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: 0,
      }}>{children}</div>
    </div>
  );
}

/* ─── OB · screens ──────────────────────────────────────────── */

function OBSignUp({ form, setForm, onContinue, onSwitchToLogin }) {
  const [pwError, setPwError] = useState(null);
  const { isMobile } = useViewport();
  const valid = form.email && /\S+@\S+\.\S+/.test(form.email)
                && form.password && form.password.length >= 8;
  const handle = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return;
    if (form.password.length < 8) { setPwError('Minimum 8 characters'); return; }
    onContinue();
  };
  return (
    <OBLayout>
      <div style={{
        width: '100%', maxWidth: 420,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: isMobile ? 32 : 44,
          lineHeight: 1.05, letterSpacing: '-0.025em',
          color: T_OB.ink, marginBottom: isMobile ? 28 : 40,
          textAlign: 'center',
        }}>Welcome to Nia.</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button
            onClick={() => onContinue({ provider: 'google' })}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: T_OB.inputBg, border: `1px solid ${T_OB.borderMd}`,
              borderRadius: 10, padding: '12px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: BODY, fontSize: 13, fontWeight: 500,
              color: T_OB.ink, cursor: 'pointer',
            }}>
            <GoogleIc s={15} />
            Continue with Google
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
            <div style={{ flex: 1, height: 1, background: T_OB.dividerInk }}/>
            <span style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: T_OB.ink4,
            }}>or</span>
            <div style={{ flex: 1, height: 1, background: T_OB.dividerInk }}/>
          </div>
          <Field T={T_OB} label="Email">
            <Input T={T_OB} value={form.email}
              onChange={v => setForm(f => ({ ...f, email: v }))}
              placeholder="you@studio.com" type="email" autoFocus />
          </Field>
          <Field T={T_OB} label="Password" hint="Minimum 8 characters." error={pwError}>
            <Input T={T_OB} value={form.password}
              onChange={v => { setPwError(null); setForm(f => ({ ...f, password: v })); }}
              placeholder="••••••••" type="password" />
          </Field>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
            <PrimaryButton T={T_OB} onClick={handle} disabled={!valid}>
              Continue <ChevRight s={11} c="currentColor" sw={2} />
            </PrimaryButton>
          </div>
        </div>
        <div style={{
          marginTop: 28, fontFamily: BODY, fontSize: 12, color: T_OB.ink3, textAlign: 'center',
        }}>
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 12, color: ACCENT, padding: 0,
          }}>Log in</button>
        </div>
      </div>
    </OBLayout>
  );
}

function OBVerify({ form, onVerified, onResend }) {
  return (
    <OBLayout>
      <div style={{
        margin: '0 auto', maxWidth: 540, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginTop: 40,
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: 22,
          background: T_OB.cardBg, border: `1px solid ${T_OB.borderMd}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: T_OB.cardShadow,
        }}>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 36, lineHeight: 1, letterSpacing: '-0.04em', color: ACCENT,
          }}>✓</div>
        </div>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: T_OB.ink4, marginBottom: 14,
          }}>Step zero</div>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 36, lineHeight: 1.15, letterSpacing: '-0.025em',
            color: T_OB.ink, marginBottom: 18,
          }}>Verify your email.</div>
          <div style={{
            fontFamily: BODY, fontSize: 13.5, lineHeight: 1.65,
            color: T_OB.ink3, maxWidth: 420, margin: '0 auto',
          }}>
            We sent a verification link to{' '}
            <span style={{ color: T_OB.ink, fontWeight: 500 }}>{form.email}</span>.
            Click it to continue setting up your terminal.
          </div>
        </div>
        <div style={{
          padding: '14px 18px', background: T_OB.cardBgAlt,
          border: `1px solid ${T_OB.dividerInk}`, borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: BODY, fontSize: 12, color: T_OB.ink3,
        }}>
          <span>Didn't get it?</span>
          <button onClick={onResend} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 12, color: ACCENT, padding: 0,
          }}>Resend email</button>
        </div>
        <div style={{ marginTop: 20 }}>
          <PrimaryButton T={T_OB} onClick={onVerified}>
            I've verified — continue <ChevRight s={11} c="currentColor" sw={2} />
          </PrimaryButton>
        </div>
      </div>
    </OBLayout>
  );
}

function OBIdentity({ form, setForm, onContinue, onBack }) {
  const valid = form.name && form.location && form.role;
  return (
    <OBLayout step={1}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {form.prepopulated && <OBPrepopBanner source="Google profile" />}
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.025em',
          color: T_OB.ink, marginBottom: 8,
        }}>Identity.</div>
        <div style={{ fontFamily: BODY, fontSize: 13, color: T_OB.ink3, marginBottom: 26, lineHeight: 1.6 }}>
          The basics. Used to personalise your briefs and shortcuts —
          never shared, never used to advertise.
        </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field T={T_OB} label="Full name">
              <Input T={T_OB} value={form.name}
                onChange={v => setForm(f => ({ ...f, name: v }))}
                placeholder="Ikanyeng Rammutla" autoFocus
                suggested={form.prepopulated && !form.nameEdited}/>
            </Field>
            <Field T={T_OB} label="City" hint="Used for regional NRI rates and local team matching.">
              <Input T={T_OB} value={form.location}
                onChange={v => setForm(f => ({ ...f, location: v }))}
                placeholder="Boston" />
            </Field>
            <Field T={T_OB} label="What do you do?" hint="A short title is fine. You'll pick an archetype next.">
              <Input T={T_OB} value={form.role}
                onChange={v => setForm(f => ({ ...f, role: v }))}
                placeholder="Creative Director" />
            </Field>
          </div>
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GhostButton T={T_OB} onClick={onBack}>← Back</GhostButton>
            <PrimaryButton T={T_OB} onClick={onContinue} disabled={!valid}>
              Continue <ChevRight s={11} c="currentColor" sw={2} />
            </PrimaryButton>
          </div>
      </div>
    </OBLayout>
  );
}

function OBArchetype({ form, setForm, onContinue, onBack, onPickStep }) {
  const { isMobile, isTablet } = useViewport();
  const [query, setQuery] = useState('');
  const [showSecondary, setShowSecondary] = useState(false);
  const filtered = ARCHETYPES_LIST.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.tier.toLowerCase().includes(query.toLowerCase()) ||
    a.desc.toLowerCase().includes(query.toLowerCase())
  );
  const pickPrimary = (a) => setForm(f => ({ ...f, archetypePrimary: a.name }));
  const toggleSecondary = (a) => setForm(f => {
    const list = f.archetypeSecondary || [];
    if (list.includes(a.name)) return { ...f, archetypeSecondary: list.filter(n => n !== a.name) };
    if (list.length >= 2) return f;
    return { ...f, archetypeSecondary: [...list, a.name] };
  });
  const valid = !!form.archetypePrimary;
  return (
    <OBLayout step={2}>
      <div style={{ width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.025em',
            color: T_OB.ink, marginBottom: 8,
          }}>Archetype.</div>
          <div style={{ fontFamily: BODY, fontSize: 13, color: T_OB.ink3, marginBottom: 22, lineHeight: 1.6 }}>
            Your archetype shapes everything Nia does for you — the shortcuts that load,
            the brief templates you start with, the language Claude uses. Pick one primary.
            Add up to two secondary if your work spans disciplines.
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: T_OB.inputBg, border: `1px solid ${T_OB.borderMd}`,
            borderRadius: 10, padding: '10px 14px', marginBottom: 18,
          }}>
            <SearchIc s={13} c={T_OB.ink3} sw={1.5} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search 282 archetypes…"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                flex: 1, color: T_OB.ink, fontFamily: BODY, fontSize: 13, letterSpacing: '-0.005em',
              }}/>
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: T_OB.ink3, padding: 0, display: 'flex',
              }}>
                <CloseIc s={11} c="currentColor" sw={1.6} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {[
              { id: false, label: 'Primary' },
              { id: true,  label: `Secondary (${(form.archetypeSecondary || []).length}/2)` },
            ].map(t => {
              const on = showSecondary === t.id;
              return (
                <button key={String(t.id)} onClick={() => setShowSecondary(t.id)} style={{
                  background: on ? T_OB.cardBg : 'transparent',
                  border: `1px solid ${on ? T_OB.borderMd : 'transparent'}`,
                  borderRadius: 999, padding: '6px 12px',
                  fontFamily: BODY, fontSize: 11.5, fontWeight: 500,
                  fontStyle: on ? 'normal' : 'italic', letterSpacing: '-0.005em',
                  color: on ? T_OB.ink : T_OB.ink3, cursor: 'pointer',
                }}>{t.label}</button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
            {filtered.map(a => {
              const isPrimary = form.archetypePrimary === a.name;
              const isSecondary = (form.archetypeSecondary || []).includes(a.name);
              const active = showSecondary ? isSecondary : isPrimary;
              const disabled = showSecondary && a.name === form.archetypePrimary;
              const handle = () => {
                if (disabled) return;
                if (showSecondary) toggleSecondary(a); else pickPrimary(a);
              };
              return (
                <button key={a.name} onClick={handle} disabled={disabled}
                  style={{
                    all: 'unset', boxSizing: 'border-box',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    padding: '12px 14px', borderRadius: 10,
                    background: active ? 'rgba(255,171,13,0.08)' : T_OB.cardBgAlt,
                    border: `1px solid ${active ? ACCENT : T_OB.dividerInk}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 12, opacity: disabled ? 0.4 : 1, transition: `all ${EASE_QUICK}`,
                  }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                    <div style={{
                      fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                      fontSize: 13.5, color: T_OB.ink, letterSpacing: '-0.005em',
                    }}>{a.name}</div>
                    <div style={{ fontFamily: BODY, fontSize: 11.5, color: T_OB.ink3, lineHeight: 1.4 }}>{a.desc}</div>
                  </div>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: active ? ACCENT : T_OB.ink4, flexShrink: 0,
                  }}>
                    {disabled ? 'Primary' : (active ? '✓ Selected' : a.tier)}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GhostButton T={T_OB} onClick={onBack}>← Back</GhostButton>
            <PrimaryButton T={T_OB} onClick={onContinue} disabled={!valid}>
              Continue <ChevRight s={11} c="currentColor" sw={2} />
            </PrimaryButton>
          </div>
      </div>
    </OBLayout>
  );
}

function OBPhoto({ form, setForm, onContinue, onSkip, onBack, onPickStep }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(form.avatarUrl || null);
  const handleFile = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => { setPreview(e.target.result); setForm(f => ({ ...f, avatarUrl: e.target.result, avatarFile: file })); };
    r.readAsDataURL(file);
  };
  return (
    <OBLayout step={3}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.025em',
          color: T_OB.ink, marginBottom: 8,
        }}>Photo.</div>
        <div style={{ fontFamily: BODY, fontSize: 13, color: T_OB.ink3, marginBottom: 32, lineHeight: 1.6 }}>
          Optional. Adds a face to your work when you collaborate with other Nia users.
          You can change or remove this anytime.
        </div>
          <button
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            style={{
              all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
              width: '100%', minHeight: 220,
              background: T_OB.cardBgAlt,
              border: `1px dashed ${preview ? 'transparent' : T_OB.borderMd}`,
              borderRadius: 16,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 14, padding: 24, position: 'relative', overflow: 'hidden',
            }}>
            {preview ? (
              <>
                <img src={preview} alt="" style={{
                  width: 140, height: 140, borderRadius: '50%',
                  objectFit: 'cover', border: `2px solid ${ACCENT}`,
                }}/>
                <div style={{ fontFamily: BODY, fontStyle: 'italic', fontWeight: 500, fontSize: 12, color: T_OB.ink3 }}>
                  Click to change
                </div>
              </>
            ) : (
              <>
                <UploadIc s={28} c={T_OB.ink3} sw={1.4} />
                <div style={{
                  fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 14, color: T_OB.ink2, letterSpacing: '-0.005em',
                }}>Drop a photo, or click to upload</div>
                <div style={{
                  fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
                  letterSpacing: '0.14em', textTransform: 'uppercase', color: T_OB.ink4,
                }}>JPG · PNG · ≤ 5MB</div>
              </>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden
            onChange={e => handleFile(e.target.files[0])}/>
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GhostButton T={T_OB} onClick={onBack}>← Back</GhostButton>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <GhostButton T={T_OB} onClick={onSkip}>Skip for now</GhostButton>
              <PrimaryButton T={T_OB} onClick={onContinue}>
                Finish setup <ChevRight s={11} c="currentColor" sw={2} />
              </PrimaryButton>
            </div>
          </div>
      </div>
    </OBLayout>
  );
}

function OBWelcome({ form, onEnter }) {
  // Final screen of onboarding. The user just finished setup — this is
  // a personal greeting before the terminal opens. Click anywhere to
  // enter. No button, no avatar, no eyebrow, no body copy.
  const firstName = (form.name || 'there').split(' ')[0];
  return (
    <OBLayout>
      <button onClick={onEnter}
        aria-label="Enter Nia"
        style={{
          all: 'unset', cursor: 'pointer',
          width: '100%', flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
        }}>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 'clamp(36px, 6vw, 56px)',
          lineHeight: 1.05, letterSpacing: '-0.03em',
          color: T_OB.ink,
        }}>Hi, {firstName}.</div>
      </button>
    </OBLayout>
  );
}

/* ─── OB · orchestrator ─────────────────────────────────────── */
function NiaOnboarding({ onComplete, referralSource = 'direct' }) {
  const [stage, setStage] = useState('signup');
  const [form, setForm] = useState({
    email: '', password: '', provider: null, referralSource,
    name: '', location: '', role: '',
    archetypePrimary: '', archetypeSecondary: [],
    avatarUrl: null, avatarFile: null, prepopulated: false,
  });
  useEffect(() => {
    if (form.provider === 'google' && !form.prepopulated) {
      setTimeout(() => {
        setForm(f => ({
          ...f,
          name: f.name || 'Ikanyeng Rammutla',
          location: f.location || 'Boston',
          prepopulated: true,
        }));
      }, 200);
    }
  }, [form.provider]);
  const stages = {
    signup: <OBSignUp form={form} setForm={setForm}
      onContinue={(opts) => {
        if (opts?.provider === 'google') { setForm(f => ({ ...f, provider: 'google' })); setStage('identity'); }
        else { setForm(f => ({ ...f, provider: 'email' })); setStage('verify'); }
      }}
      onSwitchToLogin={() => nosToast('Login flow — wire to /login', { eyebrow: 'Stub' })} />,
    verify: <OBVerify form={form}
      onVerified={() => setStage('identity')}
      onResend={() => nosToast(`Verification resent to ${form.email}`, { eyebrow: 'Email' })} />,
    identity: <OBIdentity form={form} setForm={setForm}
      onContinue={() => setStage('archetype')}
      onBack={() => setStage(form.provider === 'google' ? 'signup' : 'verify')} />,
    archetype: <OBArchetype form={form} setForm={setForm}
      onContinue={() => setStage('photo')} onBack={() => setStage('identity')}
      onPickStep={(n) => n === 1 && setStage('identity')} />,
    photo: <OBPhoto form={form} setForm={setForm}
      onContinue={() => setStage('welcome')} onSkip={() => setStage('welcome')}
      onBack={() => setStage('archetype')}
      onPickStep={(n) => { if (n === 1) setStage('identity'); if (n === 2) setStage('archetype'); }} />,
    welcome: <OBWelcome form={form}
      onEnter={() => onComplete?.({
        name: form.name, email: form.email, location: form.location, role: form.role,
        archetypePrimary: form.archetypePrimary, archetypeSecondary: form.archetypeSecondary,
        avatarUrl: form.avatarUrl, provider: form.provider,
        referralSource: form.referralSource,
        createdAt: new Date().toISOString(),
        allowProfileSuggestions: true,
        emailVerified: form.provider === 'google' || form.provider === 'email',
        // ─── Tier defaults ─────────────────────────────────────
        // Every new user starts on Foundation. They can upgrade through
        // the Upgrade Gate triggered by paywall events or Settings → Billing.
        tier: 'foundation',
        tierSince: new Date().toISOString(),
        aiCallsThisMonth: 0,
        aiCallsResetAt: new Date().toISOString().slice(0, 7), // YYYY-MM
        connectedIntegrations: [],
      })} />,
  };
  return stages[stage] || null;
}

/* END OF REGION 2 — ONBOARDING MODULE */

/* ════════════════════════════════════════════════════════════════════════════
   ┃                                                                          ┃
   ┃   REGION 3 · DASHBOARD MODULE                                            ┃
   ┃   ────────────────────────────                                           ┃
   ┃                                                                          ┃
   ┃   Contract:                                                              ┃
   ┃     <NOSDashboard                                                        ┃
   ┃       user={user} setUser={setUser}                                      ┃
   ┃       projects={projects} setProjects={setProjects}                      ┃
   ┃       skinKey={skinKey} setSkinKey={setSkinKey}                          ┃
   ┃       onOpenSettings={() => ...}                                         ┃
   ┃       onLogOut={() => ...}                                               ┃
   ┃     />                                                                   ┃
   ┃                                                                          ┃
   ┃   The three-panel terminal: left rail, canvas, right rail.               ┃
   ┃   All visual treatment scoped to this region. Skin tokens come from      ┃
   ┃   REGION 1's SKINS object — themes inside this region must reference     ┃
   ┃   T = SKINS[skinKey] and never hardcode colours.                         ┃
   ┃                                                                          ┃
   ════════════════════════════════════════════════════════════════════════════ */

const ARCHETYPES_QUICKPICK = [
  { id: 1, name: 'Creative Director',  tier: 'Foundation' },
  { id: 2, name: 'Stylist',             tier: 'Visual'     },
  { id: 3, name: '1st AD',              tier: 'Production' },
  { id: 5, name: 'Art Director',        tier: 'Visual'     },
  { id: 7, name: 'Cinematographer',     tier: 'Production' },
  { id: 8, name: 'Producer',            tier: 'Production' },
  { id: 4, name: 'PR Specialist',       tier: 'Strategy'   },
  { id: 6, name: 'Music Supervisor',    tier: 'Production' },
];

/* ─── DB · top-bar pill ─────────────────────────────────────── */
function DBTopPill({ T, label, active, accent, onClick }) {
  const bg     = active ? (accent ? ACCENT : T.activeTabBg) : 'transparent';
  const ink    = active ? (accent ? ACCENT_INK : T.activeTabInk) : T.pillInk;
  const border = active ? 'transparent' : T.borderMd;
  return (
    <button onClick={onClick} style={{
      fontFamily: BODY, fontSize: 12.5, fontWeight: 500,
      letterSpacing: '-0.01em', color: ink,
      background: bg, border: `1px solid ${border}`,
      padding: '7px 16px', borderRadius: 999,
      cursor: 'pointer', transition: `all ${EASE_QUICK}`, whiteSpace: 'nowrap',
    }}>{label}</button>
  );
}

/* ─── DB · rail section (collapsible) ───────────────────────── */
function DBRailSection({ T, label, children, last, collapsed, onToggle, count }) {
  return (
    <div style={{
      borderBottom: last ? 'none' : `1px solid ${T.dividerInk}`,
      padding: collapsed ? '14px 18px' : '16px 18px 18px',
      transition: `padding ${EASE_QUICK}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: collapsed ? 0 : 12, gap: 8,
      }}>
        <button onClick={onToggle} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: 0, margin: 0,
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 12.5, letterSpacing: '-0.01em',
          color: T.ink, flex: 1, textAlign: 'left',
        }}>
          <span>{label}</span>
          {typeof count === 'number' && (
            <span style={{
              fontFamily: MONO, fontStyle: 'normal', fontSize: 9.5,
              fontWeight: 500, letterSpacing: '0.08em', color: T.ink4,
            }}>{count}</span>
          )}
        </button>
        <button onClick={onToggle} aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
          style={{
            width: 20, height: 20, borderRadius: 5,
            background: 'transparent', border: `1px solid ${T.borderMd}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.ink3, flexShrink: 0, transition: `all ${EASE_QUICK}`,
          }}>
          {collapsed ? <PlusIc s={10} c="currentColor" sw={1.6} /> : <MinusIc s={10} c="currentColor" sw={1.6} />}
        </button>
      </div>
      {!collapsed && <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>}
    </div>
  );
}

function DBRailItem({ T, label, dim, soon, tag, onClick }) {
  const [hover, setHover] = useState(false);
  const disabled = soon;
  return (
    <button
      onMouseEnter={() => !disabled && setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        textAlign: 'left', background: hover ? T.dividerInk : 'transparent',
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        padding: '6px 8px', margin: '0 -8px',
        borderRadius: 6,
        fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
        fontSize: 11.5, letterSpacing: '-0.005em', lineHeight: 1.2,
        color: (dim || disabled) ? T.ink4 : T.ink3,
        transition: `background ${EASE_QUICK}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        width: 'auto',
      }}>
      <span>{label}</span>
      {soon && (
        <span style={{
          fontFamily: MONO, fontSize: 7.5, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: T.ink4, padding: '1px 5px', borderRadius: 3,
          border: `1px solid ${T.borderMd}`, lineHeight: 1.4,
        }}>Soon</span>
      )}
      {!soon && tag && (
        <span style={{
          fontFamily: MONO, fontSize: 7.5, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: ACCENT_INK, padding: '1px 5px', borderRadius: 3,
          background: ACCENT, lineHeight: 1.4,
        }}>{tag}</span>
      )}
    </button>
  );
}

/* ─── DB · Quick Tools dock ─────────────────────────────────── */
/* ─── DB · Tools dock with hover-driven mini-modals ─────────
   Master Guideline §4 — every touchpoint is communication. The dock
   is no longer a row of dead icons. Three buttons (Functions, Team,
   Intelligence) expand on hover (desktop) or tap (mobile) into a
   small panel anchored above the dock.

   Hover bridge: the gap between the button and the mini-modal stays
   "live" — moving across the gap doesn't dismiss because we tracking
   hover at the wrapper level. Mobile uses tap-toggle.

   Contract:
     · onOpenFunctions      — fires when "Browse all functions" picked
     · onOpenFunction(id)   — fires for a specific function quick-pick
     · onOpenContacts       — Intelligence quick-access
     · onOpenEvents         — Intelligence quick-access
     · onOpenLibrary        — Archetypes / Skills Library
     · projects             — current projects array (for team panel)
     · user                 — for tier gating and avatar
   ────────────────────────────────────────────────────────────── */
function DBToolsDock({
  T, active, setActive, onOpenSettings, isMobile = false,
  onOpenFunctions, onOpenFunction,
  onOpenContacts, onOpenEvents, onOpenLibrary,
  user, projects = [],
  rightCollapsed = false, setRightCollapsed,
}) {
  const [hoverId, setHoverId] = useState(null);  // desktop hover state
  const [tapId, setTapId] = useState(null);      // mobile tap state
  const activeMini = isMobile ? tapId : hoverId;

  const tools = [
    { id: 'dash',    Icon: DashIc,    label: 'Dashboard' },
    { id: 'users',   Icon: UsersIc,   label: 'Team',         hasMini: true },
    { id: 'folder',  Icon: FolderIc,  label: 'Functions',    hasMini: true },
    { id: 'cal',     Icon: CalIc,     label: 'Calendar' },
    { id: 'file',    Icon: FileIc,    label: 'Briefs' },
    { id: 'set',     Icon: SettingsIc,label: 'Settings',     onClick: () => onOpenSettings && onOpenSettings() },
  ];
  const btn = isMobile ? 38 : 42;

  const handleClick = (tool) => {
    if (tool.onClick) { tool.onClick(); return; }
    if (tool.hasMini && isMobile) {
      setTapId(prev => prev === tool.id ? null : tool.id);
      return;
    }
    setActive(tool.id);
  };

  return (
    <div
      onMouseLeave={() => !isMobile && setHoverId(null)}
      style={{
        position: 'absolute',
        bottom: isMobile ? 80 : 28,
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 12,
      }}>
      {/* Mini-modal — appears above the dock when a hover/tap lands on a
          mini-capable button. The wrapper's onMouseLeave dismisses on desktop. */}
      {activeMini && (
        <DBToolsMiniModal T={T} kind={activeMini} isMobile={isMobile}
          user={user} projects={projects}
          onClose={() => { setHoverId(null); setTapId(null); }}
          onOpenFunctions={onOpenFunctions}
          onOpenFunction={onOpenFunction}
          onOpenContacts={onOpenContacts}
          onOpenEvents={onOpenEvents}
          onOpenLibrary={onOpenLibrary} />
      )}

      <div style={{
        display: 'flex', alignItems: 'center',
        gap: isMobile ? 2 : 6,
        padding: isMobile ? 5 : 7,
        background: T.dockBg, border: `1px solid ${T.dockBorder}`,
        borderRadius: 999, boxShadow: T.dockShadow,
        maxWidth: 'calc(100vw - 24px)',
      }}>
        {tools.map(tool => {
          const { id, Icon, label, hasMini } = tool;
          const isActive = active === id;
          const miniOpen = activeMini === id;
          return (
            <button key={id}
              onMouseEnter={() => !isMobile && hasMini && setHoverId(id)}
              onClick={() => handleClick(tool)}
              title={label}
              style={{
                width: btn, height: btn, borderRadius: '50%',
                background: isActive || miniOpen ? ACCENT : 'transparent',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isActive || miniOpen ? ACCENT_INK : T.ink3,
                transition: `background ${EASE_QUICK}, color ${EASE_QUICK}, transform ${EASE_QUICK}`,
                flexShrink: 0,
                transform: miniOpen ? 'translateY(-2px)' : 'translateY(0)',
              }}>
              <Icon s={isMobile ? 15 : 17} c="currentColor" sw={1.5} />
            </button>
          );
        })}
        <div style={{ width: 1, height: 20, background: T.dividerInk, margin: '0 2px' }} />
        {/* Ask Nia — toggles the right-side chat panel. The chat panel
            stays collapsed by default; this is one of two ways to open
            it (the other is dragging the spine on its right edge).
            Highlights in accent when the panel is currently open. */}
        <button
          onClick={() => setRightCollapsed && setRightCollapsed(c => !c)}
          title="Ask Nia"
          style={{
            width: btn, height: btn, borderRadius: '50%',
            background: !rightCollapsed ? ACCENT : 'transparent',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: !rightCollapsed ? ACCENT_INK : T.ink3,
            transition: `background ${EASE_QUICK}, color ${EASE_QUICK}, transform ${EASE_QUICK}`,
            flexShrink: 0,
          }}>
          <SparkIc s={isMobile ? 15 : 17} c="currentColor" sw={1.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── DB · Tools mini-modal (per dock-button quick panel) ──── */
function DBToolsMiniModal({ T, kind, isMobile, user, projects = [], onClose, onOpenFunctions, onOpenFunction, onOpenContacts, onOpenEvents, onOpenLibrary }) {
  const mounted = useMountReveal();
  // Recently used Functions — pulled from a simple in-memory log; for now
  // we mirror the Intelligence trio (real recency tracking is Phase 2.5)
  const recentFunctions = [
    { id: 'contacts',   label: 'Contacts',   onPick: onOpenContacts },
    { id: 'events',     label: 'Events',     onPick: onOpenEvents },
    { id: 'archetypes', label: 'Archetypes', onPick: onOpenLibrary },
  ];

  // Active project — pull the most recent (real) project's collaborators
  const activeProj = projects.find(p => p.status === 'active') || projects[0];

  const PanelRow = ({ icon, label, hint, onClick, accent }) => (
    <button onClick={() => { onClose(); onClick && onClick(); }} style={{
      all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
      width: '100%', padding: '10px 12px', borderRadius: 8,
      display: 'flex', alignItems: 'center', gap: 10,
      transition: `background ${EASE_QUICK}`,
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = T.dividerInk}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <span style={{ display: 'flex', color: accent ? ACCENT : T.ink3 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 12.5, color: accent ? ACCENT : T.ink, letterSpacing: '-0.005em',
        }}>{label}</div>
        {hint && (
          <div style={{ fontFamily: BODY, fontSize: 10.5, color: T.ink3 }}>{hint}</div>
        )}
      </div>
      <ChevRight s={10} c={T.ink4} sw={1.6} />
    </button>
  );

  const SectionLabel = ({ children }) => (
    <div style={{
      padding: '0 12px 6px',
      fontFamily: MONO, fontSize: 9, fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: T.ink4,
    }}>{children}</div>
  );

  return (
    <div
      onMouseEnter={() => null}
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 12px)', left: '50%',
        transform: `translate(-50%, ${mounted ? 0 : 8}px)`,
        opacity: mounted ? 1 : 0,
        transition: `opacity ${EASE_DELIBERATE}, transform ${EASE_DELIBERATE}`,
        width: 280,
        background: T.dockBg, border: `1px solid ${T.borderMd}`,
        borderRadius: 14, boxShadow: T.dockShadow,
        padding: '10px 6px',
        fontFamily: BODY,
      }}>
      {/* Bridge zone — invisible spacer keeping hover alive across the gap */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '100%', height: 14,
      }}/>

      {kind === 'folder' && (
        <>
          <SectionLabel>Functions</SectionLabel>
          <PanelRow accent
            icon={<FolderIc s={13} c="currentColor" sw={1.5}/>}
            label="Browse all functions"
            hint="Intelligence · Models · Agents"
            onClick={onOpenFunctions} />
          <div style={{ height: 1, background: T.dividerInk, margin: '6px 12px' }}/>
          <SectionLabel>Recently used</SectionLabel>
          {recentFunctions.map(f => (
            <PanelRow key={f.id}
              icon={
                f.id === 'contacts' ? <UsersIc s={13} c="currentColor" sw={1.5}/>
                : f.id === 'events' ? <CalIc s={13} c="currentColor" sw={1.5}/>
                : <SparkIc s={13} c="currentColor" sw={1.5}/>}
              label={f.label}
              onClick={f.onPick} />
          ))}
        </>
      )}

      {kind === 'users' && (
        <>
          <SectionLabel>Team & collaborators</SectionLabel>
          {activeProj && (activeProj.sharedWith || []).length > 0 ? (
            <>
              <div style={{ padding: '4px 12px 8px' }}>
                <div style={{
                  fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 12, color: T.ink2, marginBottom: 6,
                }}>{activeProj.name}</div>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 4,
                }}>
                  {activeProj.sharedWith.slice(0, 6).map((s, i) => (
                    <div key={i} title={s.email} style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: BODY, fontStyle: 'italic', fontWeight: 600,
                      fontSize: 11, color: T.ink2,
                    }}>{(s.email || '?')[0].toUpperCase()}</div>
                  ))}
                </div>
              </div>
              <div style={{ height: 1, background: T.dividerInk, margin: '6px 12px' }}/>
            </>
          ) : (
            <div style={{
              padding: '4px 12px 12px',
              fontFamily: BODY, fontStyle: 'italic', fontSize: 11.5,
              color: T.ink4, lineHeight: 1.5,
            }}>No team members on the active project.</div>
          )}
          <PanelRow accent
            icon={<PlusIc s={13} c="currentColor" sw={1.6}/>}
            label="Invite teammate"
            onClick={() => nosToast('Open Share modal to invite.', { eyebrow: 'Tip' })} />
          <PanelRow
            icon={<UsersIc s={13} c="currentColor" sw={1.5}/>}
            label="Open team dashboard"
            hint="Studio tier"
            onClick={() => {
              const gate = requireTier('agent', { user });
              if (!gate.allowed) {
                window.dispatchEvent(new CustomEvent('nos:upgrade', {
                  detail: { feature: 'agent', reason: 'Team dashboard requires Studio.', body: 'Multi-seat workspace and team capacity dashboards are part of the Studio tier.', requiredTier: 'studio' }
                }));
              } else {
                nosToast('Opens team dashboard.', { eyebrow: 'Stub' });
              }
            }} />
        </>
      )}

      {kind === 'spark' && (
        <>
          <SectionLabel>Intelligence quick access</SectionLabel>
          <PanelRow
            icon={<UsersIc s={13} c="currentColor" sw={1.5}/>}
            label="Contacts"
            hint={`${CONTACTS_DATA.length} contacts`}
            onClick={onOpenContacts} />
          <PanelRow
            icon={<CalIc s={13} c="currentColor" sw={1.5}/>}
            label="Events"
            hint={`${EVENTS_DATA.length} events in 2026`}
            onClick={onOpenEvents} />
          <PanelRow
            icon={<SparkIc s={13} c="currentColor" sw={1.5}/>}
            label="Archetypes"
            hint={`${LIBRARY.length} creative roles`}
            onClick={onOpenLibrary} />
        </>
      )}
    </div>
  );
}

/* ─── DB · nOS dropdown menu (workspace customization) ──────── */
/* ════════════════════════════════════════════════════════════════
   nOS Menu Capabilities — Six modal surfaces reachable from the
   nOS dropdown:
     · DBFileMenu       — File: New, Open recent, Import, Export
     · DBLanguageModal  — Language picker (top 10 spoken globally)
     · DBSearchPalette  — Cmd-K style search across the platform
     · DBHelpCenter     — Tabbed: Contact, FAQs, Developer tools
     · DBCommunityModal — Channels, Showcase, Templates, Events
     · DBLearnMoreModal — Manifesto, methods, changelog, careers
   Each follows the same overlay pattern as Settings — backdrop click
   to close, Escape to close, full-screen on mobile.
   ════════════════════════════════════════════════════════════════ */

/* ─── DB · shared modal shell ──────────────────────────────── */
function DBModalShell({ T, isMobile, isTablet, title, eyebrow, onClose, children, maxWidth = 640, height = 'auto' }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 96,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : maxWidth,
        height: isMobile ? '100vh' : (height === 'auto' ? 'auto' : height),
        maxHeight: isMobile ? '100vh' : `calc(100vh - ${isTablet ? 32 : 48}px)`,
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 16,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.dockShadow,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          flexShrink: 0,
          padding: isMobile ? '14px 16px' : '18px 24px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          borderBottom: `1px solid ${T.dividerInk}`, gap: 12,
        }}>
          <div>
            {eyebrow && (
              <div style={{
                fontFamily: MONO, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4, marginBottom: 4,
              }}>{eyebrow}</div>
            )}
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: isMobile ? 18 : 22, color: T.ink, letterSpacing: '-0.015em',
            }}>{title}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'transparent', border: `1px solid ${T.borderMd}`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
            flexShrink: 0,
          }}>
            <CloseIc s={12} c="currentColor" sw={1.6} />
          </button>
        </div>
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: isMobile ? '20px 18px' : '24px 28px',
        }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── Functions data — Phase 2 ──────────────────────────────────
   Sourced from media_contacts__1_.xlsx · v3.0 March 2026.
   These tables back the three live Intelligence Functions:
     · CONTACTS_DATA  — 410 industry/media contacts
     · EVENTS_DATA    — 275 industry events from 2026 calendar
     · VENUES_DATA    — 48 venues with addresses for map view
   ──────────────────────────────────────────────────────────── */
const CONTACTS_DATA = [{"id": 1, "org": "Sunshine Sachs", "name": "Lauren Kelcher Stevenson", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 2, "org": "Sunshine Sachs", "name": "Maggie Faircloth", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 3, "org": "Sunshine Sachs", "name": "Pipere Boggio", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 4, "org": "Sunshine Sachs", "name": "Bryanna Vera", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 5, "org": "Sunshine Sachs", "name": "Bridget Cirone", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 6, "org": "Sunshine Sachs", "name": "Sarah Borchardt", "email": "bbma@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": ""}, {"id": 7, "org": "Sunshine Sachs", "name": "NAACP Image Awards Desk", "email": "NAACPImageAwards@ssmandl.com", "email2": "", "site": "ssmandl.com", "note": "57th NAACP Image Awards – Feb 28"}, {"id": 8, "org": "Sunshine Sachs", "name": "Producers Guild Desk", "email": "producersguild@ssmandl.com", "email2": "", "site": "ssmandl.com", "note": "37th Producers Guild Awards – Feb 28"}, {"id": 9, "org": "Sunshine Sachs", "name": "Mercedes Smith (NAACP)", "email": "naacpimageawards@sunshinesachs.com", "email2": "", "site": "sunshinesachs.com", "note": "NAACP Image Awards – Sunshine Sachs lead"}, {"id": 10, "org": "MRC", "name": "Emily Spence", "email": "espence@mrcentertainment.com", "email2": "", "site": "mrcentertainment.com", "note": ""}, {"id": 11, "org": "MRC", "name": "Kristin Robinson", "email": "krobinson@mrcentertainment.com", "email2": "", "site": "mrcentertainment.com", "note": ""}, {"id": 12, "org": "MRC", "name": "Leah Palacios", "email": "lpalacios@mrcentertainment.com", "email2": "", "site": "mrcentertainment.com", "note": ""}, {"id": 13, "org": "NBC", "name": "Ryan McCormick", "email": "ryan.mccormick@nbcuni.com", "email2": "", "site": "nbcuni.com", "note": ""}, {"id": 14, "org": "NBC", "name": "Mariana Duran", "email": "mariana.duran@nbcuni.com", "email2": "", "site": "nbcuni.com", "note": ""}, {"id": 15, "org": "NBC", "name": "Melissa Cuasito", "email": "melissa.cuasito@nbcuni.com", "email2": "", "site": "nbcuni.com", "note": ""}, {"id": 16, "org": "NBC", "name": "Jaime Weinreb", "email": "jaime.weinreb@nbcuni.com", "email2": "", "site": "nbcuni.com", "note": ""}, {"id": 17, "org": "NBC", "name": "Jennifer Black", "email": "Jennifer.Black@nbcuni.com", "email2": "", "site": "nbcuni.com", "note": "VP Global Publicity – Jurassic World Rebirth"}, {"id": 18, "org": "Apple", "name": "Jessica Bass", "email": "jessica_bass@apple.com", "email2": "", "site": "apple.com", "note": "Apple Music Radio; Super Bowl Halftime"}, {"id": 19, "org": "Apple", "name": "Haley Agurs", "email": "hagurs@apple.com", "email2": "", "site": "apple.com", "note": "Apple TV+"}, {"id": 20, "org": "Apple", "name": "Stephanie Sommer", "email": "ssommer@apple.com", "email2": "", "site": "apple.com", "note": "Apple TV+"}, {"id": 21, "org": "Apple", "name": "Media Helpline", "email": "media.help@apple.com", "email2": "", "site": "apple.com", "note": "Apple Original Films (F1)"}, {"id": 22, "org": "42West", "name": "Fantasy Life Desk", "email": "fantasylife@42west.com", "email2": "", "site": "42west.com", "note": "Fantasy Life [Greenwich Ent.]"}, {"id": 23, "org": "42West", "name": "Greenwich Desk", "email": "greenwich@42west.com", "email2": "", "site": "42west.com", "note": "Diane Warren: Relentless"}, {"id": 24, "org": "42West", "name": "CBS Primetime", "email": "cbsprimetime@42west.com", "email2": "", "site": "42west.com", "note": "Marshals / CBS"}, {"id": 25, "org": "42West", "name": "Slamdance", "email": "Slamdance@42west.com", "email2": "", "site": "42west.com", "note": "Slamdance Film Festival – Feb 18-25"}, {"id": 26, "org": "42West", "name": "Mr. Nobody Desk", "email": "mrnobody@42west.com", "email2": "", "site": "42west.com", "note": "Mr. Nobody Against Putin [Kino Lorber]"}, {"id": 27, "org": "42West", "name": "Kokuho Desk", "email": "teamkokuho@42west.com", "email2": "", "site": "42west.com", "note": "Kokuho [GKids]"}, {"id": 28, "org": "42West", "name": "Puppy Bowl Desk", "email": "Teampuppybowl@42west.com", "email2": "", "site": "42west.com", "note": "Puppy Bowl XXII – Animal Planet/Discovery"}, {"id": 29, "org": "Accolade PR", "name": "Team Inbox", "email": "Team@AccoladePR.com", "email2": "", "site": "accoladepr.com", "note": "ARCO, Secret Agent, Sirāt, Smashing Machine [NEON/A24]; Vidiots"}, {"id": 30, "org": "APEX Public Relations", "name": "Shawn Purdy", "email": "TonyAwardsPR@theapex-pr.com", "email2": "", "site": "theapex-pr.com", "note": "Tony Awards"}, {"id": 31, "org": "APEX Public Relations", "name": "Elyse Weissman", "email": "TonyAwardsPR@theapex-pr.com", "email2": "", "site": "theapex-pr.com", "note": "Tony Awards"}, {"id": 32, "org": "APEX Public Relations", "name": "Andy Gelb", "email": "andy@theapex-pr.com", "email2": "", "site": "theapex-pr.com", "note": "Vanity Fair Oscar Party; MPTF Night Before Oscars"}, {"id": 33, "org": "APEX Public Relations", "name": "Julia Rossen", "email": "julia@theapex-pr.com", "email2": "", "site": "theapex-pr.com", "note": "Vanity Fair Oscar Party; MPTF Night Before Oscars"}, {"id": 34, "org": "APEX Public Relations", "name": "Lindsey Brown", "email": "lindsey@theapex-pr.com", "email2": "", "site": "theapex-pr.com", "note": "37th GLAAD Media Awards – March 5"}, {"id": 35, "org": "A24", "name": "Press Desk", "email": "news@a24films.com", "email2": "", "site": "a24films.com", "note": "Marty Supreme; The Drama (Zendaya)"}, {"id": 36, "org": "A24", "name": "Claire Colletti", "email": "claire@a24films.com", "email2": "", "site": "a24films.com", "note": "If I Had Legs I'd Kick You"}, {"id": 37, "org": "American Cinematheque", "name": "Publicity", "email": "publicity@americancinematheque.com", "email2": "", "site": "americancinematheque.com", "note": "Timothee Chalamet Retro; Chloe Zhao; Train Dreams; The Natural"}, {"id": 38, "org": "Warner Bros. / WBD", "name": "Veronica Van Pelt", "email": "Veronica.VanPelt@wbd.com", "email2": "", "site": "wbd.com", "note": "VP Media Relations – HBO Docs; Alabama Solution"}, {"id": 39, "org": "Warner Bros. / WBD", "name": "Hayley Hanson", "email": "Hayley.Hanson@wbd.com", "email2": "", "site": "wbd.com", "note": "Manager Media Relations – HBO Docs"}, {"id": 40, "org": "Warner Bros. / WBD", "name": "Cortney Lawson", "email": "teamlawsonmedia@wbd.com", "email2": "", "site": "wbd.com", "note": "One Battle After Another"}, {"id": 41, "org": "Warner Bros. / WBD", "name": "DJ Jean", "email": "dj.jean@wbd.com", "email2": "", "site": "wbd.com", "note": "Sinners"}, {"id": 42, "org": "Warner Bros. / WBD", "name": "Chelsey Riemann", "email": "chelsey.riemann@wbd.com", "email2": "", "site": "wbd.com", "note": "Property Brothers: Under Pressure [HGTV]"}, {"id": 43, "org": "Warner Bros. / WBD", "name": "Lynne Davis", "email": "lynne.davis@wbd.com", "email2": "", "site": "wbd.com", "note": "Property Brothers: Under Pressure [HGTV]"}, {"id": 44, "org": "Netflix", "name": "Frankenstein Desk", "email": "frankensteinpublicity@netflix.com", "email2": "", "site": "netflix.com", "note": "Frankenstein"}, {"id": 45, "org": "Netflix", "name": "Sabryna Phillips", "email": "Sphillips@netflix.com", "email2": "", "site": "netflix.com", "note": "Sex, Lies, and Videotape / LAFCA"}, {"id": 46, "org": "Netflix", "name": "Nicole Player", "email": "nplayer@netflix.com", "email2": "", "site": "netflix.com", "note": "Sex, Lies, and Videotape / LAFCA"}, {"id": 47, "org": "Netflix", "name": "SAG Awards PR Desk", "email": "sagawards-pr@netflix.com", "email2": "", "site": "netflix.com", "note": "32nd SAG Awards on Netflix"}, {"id": 48, "org": "Disney", "name": "Domestic Press", "email": "wds.events.rsvp@disney.com", "email2": "", "site": "disney.com", "note": "Elio, Zootopia 2, Avatar – broadcast/print/Hispanic"}, {"id": 49, "org": "Disney", "name": "International Press", "email": "wdsmpi.publicity.rsvp@disney.com", "email2": "", "site": "disney.com", "note": "Elio, Zootopia 2, Avatar – international"}, {"id": 50, "org": "Disney", "name": "Photo Desk", "email": "wds.photorsvp@disney.com", "email2": "", "site": "disney.com", "note": "Elio, Zootopia 2, Avatar – photographers"}, {"id": 51, "org": "Disney", "name": "Chelsie Tanamachi", "email": "chelsie.m.tanamachi@disney.com", "email2": "", "site": "disney.com", "note": "ABC Media Relations – Oscars broadcast"}, {"id": 52, "org": "Focus Features", "name": "Press Desk", "email": "info@focusfeatures.com", "email2": "", "site": "focusfeatures.com", "note": "Bugonia; Hamnet; Song Sung Blue"}, {"id": 53, "org": "NEON", "name": "Ezra Scott-Henning", "email": "ezra@neonrated.com", "email2": "", "site": "neonrated.com", "note": "It Was Just An Accident"}, {"id": 54, "org": "Oscars / Academy", "name": "Publicity", "email": "publicity@oscars.org", "email2": "", "site": "oscars.org", "note": "98th Oscars – general press"}, {"id": 55, "org": "Oscars / Academy", "name": "Credentials", "email": "credentials@oscars.org", "email2": "", "site": "oscars.org", "note": "98th Oscars – media credentials"}, {"id": 56, "org": "Oscars / Academy", "name": "Natalie Kojen", "email": "nkojen@oscars.org", "email2": "", "site": "oscars.org", "note": "Academy Communications"}, {"id": 57, "org": "Oscars / Academy", "name": "Museum Press", "email": "museumpress@oscars.org", "email2": "", "site": "oscars.org", "note": "Academy Museum; Star Trek IV screening"}, {"id": 58, "org": "Recording Academy / GRAMMYs", "name": "Communications", "email": "communications@grammy.com", "email2": "", "site": "grammy.com", "note": "68th GRAMMYs – general"}, {"id": 59, "org": "Recording Academy / GRAMMYs", "name": "Britta Purcell", "email": "britta.purcell@grammy.com", "email2": "", "site": "grammy.com", "note": "P&E Wing Grammy Week Celebration"}, {"id": 60, "org": "Recording Academy / GRAMMYs", "name": "Rachel Friedman", "email": "rachel.friedman@grammy.com", "email2": "", "site": "grammy.com", "note": "Entertainment Law Initiative Luncheon"}, {"id": 61, "org": "GRAMMY Museum", "name": "Media Desk", "email": "media@grammymuseum.org", "email2": "jlywen-dill@grammymuseum.org", "site": "grammymuseum.org", "note": "Grammy Week events; After Party"}, {"id": 62, "org": "GRAMMY Museum", "name": "Jasmine Lywen-Dill", "email": "jlywen-dill@grammymuseum.org", "email2": "media@grammymuseum.org", "site": "grammymuseum.org", "note": "Director of Communications"}, {"id": 63, "org": "PMK Entertainment", "name": "Grammy RSVP", "email": "GrammyAwards@pmkentertainment.com", "email2": "", "site": "pmkentertainment.com", "note": "Grammy Awards media RSVP"}, {"id": 64, "org": "PMK Entertainment", "name": "Caroline Stegner", "email": "caroline.stegner@pmkentertainment.com", "email2": "", "site": "pmkentertainment.com", "note": "Recording Academy Honors RSVP"}, {"id": 65, "org": "DKC News", "name": "Caroline Stegner", "email": "caroline_stegner@dkcnews.com", "email2": "", "site": "dkcnews.com", "note": "28th Costume Designers Guild Awards – Feb 12"}, {"id": 66, "org": "DKC News", "name": "Joe Schneider", "email": "joe_schneider@dkcnews.com", "email2": "", "site": "dkcnews.com", "note": "28th Costume Designers Guild Awards"}, {"id": 67, "org": "DKC News", "name": "Madison Thomas", "email": "madison_thomas@dkcnews.com", "email2": "", "site": "dkcnews.com", "note": "28th Costume Designers Guild Awards"}, {"id": 68, "org": "LA Philharmonic", "name": "Leah Price", "email": "leah.price@laphil.org", "email2": "", "site": "laphil.org", "note": "Concerts at Walt Disney Concert Hall"}, {"id": 69, "org": "LA Philharmonic", "name": "Lev Mamuya", "email": "lev.mamuya@laphil.org", "email2": "", "site": "laphil.org", "note": "Dudamel / Beethoven – Cate Blanchett"}, {"id": 70, "org": "Hunter PR", "name": "Don Julio Desk", "email": "DONJULIO@HUNTERPR.COM", "email2": "", "site": "hunterpr.com", "note": "Don Julio brand"}, {"id": 71, "org": "Epic Records", "name": "Publicity Desk", "email": "EPICPUBLICITY@EPICRECORDS.COM", "email2": "", "site": "epicrecords.com", "note": ""}, {"id": 72, "org": "Jensen Communications", "name": "Michael Jensen", "email": "mj@jensencom.com", "email2": "", "site": "jensencom.com", "note": "FestForums – Feb 11 Santa Barbara"}, {"id": 73, "org": "Jensen Communications", "name": "Leo Lavoro", "email": "leo@jensencom.com", "email2": "", "site": "jensencom.com", "note": "FestForums"}, {"id": 74, "org": "FestForums", "name": "Laurie Kirby", "email": "Laurie@festforums.com", "email2": "", "site": "festforums.com", "note": "Feb 11 – Mar Monte Hotel, Santa Barbara"}, {"id": 75, "org": "K-Star PR / De Castellane Creative", "name": "Asst Desk", "email": "asst@K-StarPR.com", "email2": "", "site": "k-starpr.com", "note": "TikTok Live concert (Las Vegas); Songtrybe launch"}, {"id": 76, "org": "K-Star PR / De Castellane Creative", "name": "Daniel", "email": "daniel@decastellanecreative.com", "email2": "", "site": "decastellanecreative.com", "note": "Media/press attendance"}, {"id": 77, "org": "K-Star PR / De Castellane Creative", "name": "Press/Talent", "email": "press@decastellanecreative.com", "email2": "", "site": "decastellanecreative.com", "note": "Talent submissions"}, {"id": 78, "org": "Perception PR", "name": "Matthew Jordan", "email": "matthew@perceptionpr.com", "email2": "", "site": "perceptionpr.com", "note": "76th ACE Eddie Awards; 73rd Golden Reel Awards"}, {"id": 79, "org": "Perception PR", "name": "Natasha Barrett", "email": "natasha@perceptionpr.com", "email2": "", "site": "perceptionpr.com", "note": "73rd Golden Reel Awards"}, {"id": 80, "org": "Perception PR", "name": "Lea Yardum", "email": "lea@perceptionpr.com", "email2": "", "site": "perceptionpr.com", "note": "ACE Eddie Awards; Golden Reel Awards"}, {"id": 81, "org": "MusiCares", "name": "Jessica Carmona", "email": "jessica.carmona@musicares.org", "email2": "", "site": "musicares.org", "note": "35th Person of the Year – Mariah Carey, Jan 30"}, {"id": 82, "org": "The Oriel Co.", "name": "Chloe Walsh", "email": "chloe@theoriel.co", "email2": "", "site": "theoriel.co", "note": "Jason Isbell"}, {"id": 83, "org": "The Oriel Co.", "name": "UnitedMasters", "email": "UMGrammy2026@theoriel.co", "email2": "", "site": "theoriel.co", "note": "UnitedMasters GRAMMY party – Hollywood Palladium"}, {"id": 84, "org": "Shore Fire Media", "name": "ASCAP Desk", "email": "ascapexperience@shorefire.com", "email2": "", "site": "shorefire.com", "note": "ASCAP Experience conference – Feb 12"}, {"id": 85, "org": "Reybee PR", "name": "Rey Roldan", "email": "rey@reybee.com", "email2": "", "site": "reybee.com", "note": "Eddie Schwartz"}, {"id": 86, "org": "Reybee PR", "name": "Heather Hawke", "email": "heather@reybee.com", "email2": "", "site": "reybee.com", "note": "Eddie Schwartz"}, {"id": 87, "org": "Atom Splitter PR", "name": "Press Desk", "email": "press@atomsplitterpr.com", "email2": "", "site": "atomsplitterpr.com", "note": "Buckcherry"}, {"id": 88, "org": "BT PR", "name": "Olga Makrias", "email": "Olga@btpr.biz", "email2": "", "site": "btpr.biz", "note": "Dermot Kennedy – The Weight of the Woods"}, {"id": 89, "org": "BT PR", "name": "Benny Tarantini", "email": "Benny@btpr.biz", "email2": "", "site": "btpr.biz", "note": "Dermot Kennedy"}, {"id": 90, "org": "117 Group", "name": "Zach Farnum", "email": "zach@117group.com", "email2": "", "site": "117group.com", "note": "Dan Seals Estate"}, {"id": 91, "org": "117 Group", "name": "Taylor Steele", "email": "taylor@117group.com", "email2": "", "site": "117group.com", "note": "Dan Seals Estate"}, {"id": 92, "org": "KMJ PR", "name": "Kim Jakwerth", "email": "kim@kmjpr.com", "email2": "", "site": "kmjpr.com", "note": "Dan Seals Estate"}, {"id": 93, "org": "Anderson Group PR", "name": "Whitney & Caitlin", "email": "AGPR@AndersonGroupPR.com", "email2": "", "site": "andersongrouppr.com", "note": "Karimah Westbrook – All American / Dream House"}, {"id": 94, "org": "Tribeca Film Festival", "name": "Festival Press", "email": "festivalpress@tribecafilm.com", "email2": "", "site": "tribecafilm.com", "note": "June 3-14, 2026 – 25th Anniversary"}, {"id": 95, "org": "The Mesulam Group", "name": "Shari Mesulam", "email": "shari@themesulamgroup.com", "email2": "", "site": "themesulamgroup.com", "note": "40th AFI Fest; AFI Life Achievement Award – Eddie Murphy"}, {"id": 96, "org": "Break White Light", "name": "Stephanie Goodell", "email": "stephanie@breakwhitelight.com", "email2": "", "site": "breakwhitelight.com", "note": "Television Academy – 78th Emmy Awards, Sept 14"}, {"id": 97, "org": "Film Independent", "name": "Publicity", "email": "publicity@filmindependent.org", "email2": "", "site": "filmindependent.org", "note": "41st Spirit Awards – Feb 15"}, {"id": 98, "org": "Costa Communications", "name": "Ray Costa", "email": "rcosta@costacomm.com", "email2": "", "site": "costacomm.com", "note": "2026 SCL Awards – Feb 6"}, {"id": 99, "org": "Costa Communications", "name": "Rebekah Alperin", "email": "ralperin@costacomm.com", "email2": "", "site": "costacomm.com", "note": "2026 SCL Awards"}, {"id": 100, "org": "Houser PR", "name": "Gretchen Houser", "email": "Gretchen@houserpr.com", "email2": "", "site": "houserpr.com", "note": "53rd Annie Awards – ASIFA-Hollywood, Feb 21"}, {"id": 101, "org": "Right On! PR", "name": "Sheila Kenny", "email": "sheila@rightonpr.com", "email2": "", "site": "rightonpr.com", "note": "Kyle Gass Band"}, {"id": 102, "org": "Raz Public Relations", "name": "Shannon Deoul", "email": "shannon@razpr.com", "email2": "", "site": "razpr.com", "note": "24th VES Awards – Feb 25"}, {"id": 103, "org": "Smithhouse Strategy", "name": "CSA Desk", "email": "csa@smithhousestrategy.com", "email2": "", "site": "smithhousestrategy.com", "note": "Casting Society – 41st Artios Awards – Feb 26"}, {"id": 104, "org": "Print Shop PR", "name": "Matt Ross", "email": "Matt@printshoppr.com", "email2": "", "site": "printshoppr.com", "note": "Artios Awards – New York"}, {"id": 105, "org": "Print Shop PR", "name": "Liz Lombardi", "email": "Liz@printshoppr.com", "email2": "", "site": "printshoppr.com", "note": "Artios Awards – New York"}, {"id": 106, "org": "Solters PR", "name": "Sam Threadgill", "email": "sthreadgill@solters.com", "email2": "", "site": "solters.com", "note": "Agua Caliente Casino – Jeff Foxworthy, Brad Paisley, Collective Soul"}, {"id": 107, "org": "Solters PR", "name": "Anna Loynes", "email": "aloynes@solters.com", "email2": "", "site": "solters.com", "note": "Kia Forum / New Edition Way Tour"}, {"id": 108, "org": "Tre Media", "name": "Tresa Sanders", "email": "tresa@tre-media.net", "email2": "", "site": "tre-media.net", "note": "Black Promoters Collective; New Edition Way Tour"}, {"id": 109, "org": "Tre Media", "name": "Daylan Cole", "email": "Daylan@Tre-media.net", "email2": "", "site": "tre-media.net", "note": "Black Promoters Collective; New Edition Way Tour"}, {"id": 110, "org": "JMigs PR", "name": "JoAnn Mignano", "email": "jo@jmigspr.com", "email2": "", "site": "jmigspr.com", "note": "Boyz II Men"}, {"id": 111, "org": "The Chamber Group", "name": "Juliana Plotkin", "email": "juliana@thechambergroup.com", "email2": "", "site": "thechambergroup.com", "note": "Toni Braxton"}, {"id": 112, "org": "PCPR", "name": "Phyllis Caddell", "email": "pcpr@pcpr.co", "email2": "", "site": "pcpr.co", "note": "All-Star Gospel Celebration – media"}, {"id": 113, "org": "iSquared PR", "name": "Rochelle", "email": "info@iSquaredPR.com", "email2": "", "site": "isquaredpr.com", "note": "Celebrity Charity Poker Night – Feb 12"}, {"id": 114, "org": "LEDE Company", "name": "Andrea Ng", "email": "andrea.ng@ledecompany.com", "email2": "", "site": "ledecompany.com", "note": "UnitedMasters GRAMMY party"}, {"id": 115, "org": "UMe / Universal Music", "name": "Meg McLean Corso", "email": "meg.mcleancorso@umusic.com", "email2": "", "site": "umusic.com", "note": "Pretty in Pink 40th Anniversary reissue"}, {"id": 116, "org": "BBR Music Group / BMG Nashville", "name": "Mark Logsdon", "email": "mark@bbrmusicgroup.com", "email2": "", "site": "bbrmusicgroup.com", "note": "Atlus – Art of Letting Go, March 20"}, {"id": 117, "org": "BBR Music Group / BMG Nashville", "name": "Brent Burns", "email": "brent@bbrmusicgroup.com", "email2": "", "site": "bbrmusicgroup.com", "note": "Atlus – Art of Letting Go"}, {"id": 118, "org": "Jay Jones Music", "name": "Jay Jones", "email": "jay@jayjonesmusic.com", "email2": "", "site": "jayjonesmusic.com", "note": "Atlus (artist rep)"}, {"id": 119, "org": "Elton John AIDS Foundation", "name": "AAVP Desk", "email": "AAVP@eltonjohnaidsfoundation.org", "email2": "", "site": "eltonjohnaidsfoundation.org", "note": "Oscar Viewing Party – March 15"}, {"id": 120, "org": "Elton John AIDS Foundation", "name": "Mary Pavlu", "email": "mary.pavlu@eltonjohnaidsfoundation.org", "email2": "", "site": "eltonjohnaidsfoundation.org", "note": "Oscar Viewing Party"}, {"id": 121, "org": "SAG Awards", "name": "Nic Vivas", "email": "nvivas@sagawards.org", "email2": "", "site": "sagawards.org", "note": "32nd SAG Awards – March 1 on Netflix"}, {"id": 122, "org": "DGA", "name": "Press Desk", "email": "MSchwenz@dga.org", "email2": "", "site": "dga.org", "note": "78th DGA Awards – Feb 7"}, {"id": 123, "org": "ASC", "name": "Patty Armacost", "email": "patty@theasc.com", "email2": "", "site": "theasc.com", "note": "40th ASC Awards – March 8"}, {"id": 124, "org": "PAFF", "name": "Press Room", "email": "press@paff.org", "email2": "", "site": "paff.org", "note": "34th Pan African Film & Arts Festival – Feb 9-16"}, {"id": 125, "org": "Universal Studios Hollywood", "name": "Publicity", "email": "USH.Publicity@udx.com", "email2": "", "site": "udx.com", "note": "Universal Fan Fest Nights – Apr 23-May 16"}, {"id": 126, "org": "Kino Lorber", "name": "Kate Patterson", "email": "kpatterson@kinolorber.com", "email2": "", "site": "kinolorber.com", "note": "Mr. Nobody Against Putin"}, {"id": 127, "org": "Sony Pictures Classics", "name": "Press Desk", "email": "press@spe.sony.com", "email2": "", "site": "spe.sony.com", "note": "Blue Moon"}, {"id": 128, "org": "Vesper PR", "name": "Mariluz Gonzalez", "email": "mgonzalez@vesperpublicrelations.com", "email2": "", "site": "vesperpublicrelations.com", "note": "Kings Del Wepa – Feb 12 Regent Theater"}, {"id": 129, "org": "WGA Foundation", "name": "Events", "email": "events@wgfoundation.org", "email2": "", "site": "wgfoundation.org", "note": "Beyond Words 2026 – Feb 12"}, {"id": 130, "org": "LAFCA / MPRM", "name": "Press", "email": "lafca@mprm.com", "email2": "", "site": "mprm.com", "note": "LAFCA At The Egyptian – Sex, Lies, and Videotape"}, {"id": 131, "org": "Cinetic Media", "name": "Just An Accident Desk", "email": "justanaccident@cineticmedia.com", "email2": "", "site": "cineticmedia.com", "note": "It Was Just An Accident [NEON]"}, {"id": 132, "org": "TopOfTheLine PR", "name": "Media/Talent", "email": "TopOfTheLineprla@gmail.com", "email2": "", "site": "gmail.com", "note": "Deep Frame premiere – Feb 10, Culver Theatre"}, {"id": 133, "org": "Vibrato Grill Jazz", "name": "Admin", "email": "admin@vibratogrilljazz.com", "email2": "", "site": "vibratogrilljazz.com", "note": "Herb Alpert's venue – Bel Air"}, {"id": 134, "org": "Laugh Factory", "name": "Info", "email": "info@laughfactory.com", "email2": "", "site": "laughfactory.com", "note": "Feb 11 – Jason Stuart & Friends"}, {"id": 135, "org": "Medium Rare", "name": "Info", "email": "info@medium-rare.com", "email2": "", "site": "medium-rare.com", "note": "Sports Illustrated Golf Invitational"}, {"id": 136, "org": "Sport Beach", "name": "RSVP", "email": "hello@sportbeach.com", "email2": "", "site": "sportbeach.com", "note": "Sport Beach Club House Pop-Up – Metreon, SF"}, {"id": 137, "org": "Fleishman Hillard", "name": "BAHC Desk", "email": "fh.bahc@fleishman.com", "email2": "", "site": "fleishman.com", "note": "BAHC Kickoff Party – Dolby SF"}, {"id": 138, "org": "Sharp Associates PR", "name": "Info", "email": "info@sharpassociatespr.com", "email2": "", "site": "sharpassociatespr.com", "note": "Artur Zakiyan piano concert – Feb 1"}, {"id": 139, "org": "BET", "name": "Mercedes Smith", "email": "mercedes.smith@bet.net", "email2": "", "site": "bet.net", "note": "NAACP Image Awards"}, {"id": 140, "org": "BET", "name": "Erica Knox", "email": "Erica.Knox@bet.net", "email2": "", "site": "bet.net", "note": "NAACP Image Awards"}, {"id": 141, "org": "BET", "name": "Autumn Griffith", "email": "Autumn.Griffin@bet.net", "email2": "", "site": "bet.net", "note": "NAACP Image Awards"}, {"id": 142, "org": "NAACP Hollywood Bureau", "name": "Ariana Drummond", "email": "imagepublicist@naacpnet.org", "email2": "", "site": "naacpnet.org", "note": "NAACP Image Awards publicist"}, {"id": 143, "org": "Variety", "name": "Jordan Moreau", "email": "jmoreau@variety.com", "email2": "", "site": "variety.com", "note": "Online news editor – breaking news, film & TV. Runs internship program (NY + LA). Based in NYC."}, {"id": 144, "org": "Variety", "name": "Haley Kluge", "email": "Hkluge@variety.com", "email2": "", "site": "variety.com", "note": "Creative Director. Formerly Netflix Tudum design team."}, {"id": 145, "org": "Victoria Beckham", "name": "Press / General Inbox", "email": "clientservices@victoriabeckham.com", "email2": "", "site": "victoriabeckham.com", "note": ""}, {"id": 146, "org": "Victoria Beckham", "name": "Press / General Inbox", "email": "support@victoriabeckhambeauty.com", "email2": "", "site": "victoriabeckhambeauty.com", "note": ""}, {"id": 147, "org": "Victoria Beckham", "name": "Lauren Archer", "email": "lauren.archer@victoriabeckham.com", "email2": "", "site": "victoriabeckham.com", "note": ""}, {"id": 148, "org": "Victoria Beckham", "name": "Jasmine Sevan", "email": "jasmine.sevan@victoriabeckham.com", "email2": "", "site": "victoriabeckham.com", "note": ""}, {"id": 149, "org": "Victoria Beckham", "name": "Global PR Coordinator (Beauty) Lucy Ewbank", "email": "lucy.ewbank@victoriabeckham.com", "email2": "", "site": "victoriabeckham.com", "note": ""}, {"id": 150, "org": "Victoria Beckham", "name": "Director, Global PR and Comm (Beauty) Julie Kirwan", "email": "julie.kirwan.ext@victoriabeckham.com", "email2": "", "site": "victoriabeckham.com", "note": ""}, {"id": 151, "org": "Burberry", "name": "Press / General Inbox", "email": "press.office@burberry.com", "email2": "", "site": "burberry.com", "note": ""}, {"id": 152, "org": "Burberry", "name": "Stephanie Mackie", "email": "stephanie.mackie@burberry.com", "email2": "", "site": "burberry.com", "note": ""}, {"id": 153, "org": "Burberry", "name": "Press Contact", "email": "gemma.parsons@burberry.com", "email2": "", "site": "burberry.com", "note": ""}, {"id": 154, "org": "Miu Miu", "name": "Press / General Inbox", "email": "pressoffice@miumiu.com", "email2": "", "site": "miumiu.com", "note": ""}, {"id": 155, "org": "Miu Miu", "name": "Press Contact", "email": "martina.forte@prada.com", "email2": "", "site": "prada.com", "note": ""}, {"id": 156, "org": "Miu Miu", "name": "Press Contact", "email": "owen.parry@prada.com", "email2": "", "site": "prada.com", "note": ""}, {"id": 157, "org": "JW Anderson", "name": "Press / General Inbox", "email": "press@jwanderson.com", "email2": "oceane.curey@jwanderson.com", "site": "jwanderson.com", "note": ""}, {"id": 158, "org": "JW Anderson", "name": "Press Contact", "email": "oceane.curey@jwanderson.com", "email2": "press@jwanderson.com", "site": "jwanderson.com", "note": ""}, {"id": 159, "org": "Simone Rocha", "name": "Press Contact", "email": "marion@dh-pr.com", "email2": "", "site": "dh-pr.com", "note": ""}, {"id": 160, "org": "Roksanda", "name": "Honor Gell", "email": "honor@roksanda.com", "email2": "", "site": "roksanda.com", "note": ""}, {"id": 161, "org": "Erdem", "name": "Press / General Inbox", "email": "press@erdem.com", "email2": "nadia.bean@erdem.com", "site": "erdem.com", "note": ""}, {"id": 162, "org": "Erdem", "name": "Nadia Bean", "email": "nadia.bean@erdem.com", "email2": "press@erdem.com", "site": "erdem.com", "note": ""}, {"id": 163, "org": "Erdem", "name": "Press Contact", "email": "emily.witley@erdem.com", "email2": "press@erdem.com", "site": "erdem.com", "note": ""}, {"id": 164, "org": "Phoebe English", "name": "Press Contact", "email": "phoebe@phoebeenglish.com", "email2": "", "site": "phoebeenglish.com", "note": ""}, {"id": 165, "org": "Sharon Wauchob", "name": "Press Contact", "email": "sharon@sharonwauchob.uk", "email2": "", "site": "sharonwauchob.uk", "note": ""}, {"id": 166, "org": "Sharon Wauchob", "name": "Press Contact", "email": "joshua@sharonwauchob.uk", "email2": "", "site": "sharonwauchob.uk", "note": ""}, {"id": 167, "org": "Kim Jones", "name": "Press / General Inbox", "email": "press@dior.com", "email2": "", "site": "dior.com", "note": ""}, {"id": 168, "org": "Kim Jones", "name": "Jed Partridge", "email": "jed@kimjonesstudio.com", "email2": "", "site": "kimjonesstudio.com", "note": ""}, {"id": 169, "org": "Kim Jones", "name": "Conor McCOry", "email": "conor@kimjonesstudio.com", "email2": "", "site": "kimjonesstudio.com", "note": ""}, {"id": 170, "org": "Kim Jones", "name": "Press Contact", "email": "lucy@kimjonesstudio.com", "email2": "", "site": "kimjonesstudio.com", "note": ""}, {"id": 171, "org": "Mary Katrantzou", "name": "Anastasia Antoniadou", "email": "anastasia.antoniadou@marykatrantzou.com", "email2": "", "site": "marykatrantzou.com", "note": ""}, {"id": 172, "org": "Bronx and Banco", "name": "Lucia Tyden", "email": "lucia@bronxandbanco.com", "email2": "", "site": "bronxandbanco.com", "note": ""}, {"id": 173, "org": "Bronx and Banco", "name": "Felicia Geller", "email": "felicia@bronxandbanco.com", "email2": "", "site": "bronxandbanco.com", "note": ""}, {"id": 174, "org": "Bronx and Banco", "name": "Banco", "email": "natalie@bronxandbanco.com", "email2": "", "site": "bronxandbanco.com", "note": ""}, {"id": 175, "org": "Bronx and Banco", "name": "Press Contact", "email": "peri@bronxandbanco.com", "email2": "", "site": "bronxandbanco.com", "note": ""}, {"id": 176, "org": "Bronx and Banco", "name": "Press Contact", "email": "jasmine@bronxandbanco.com", "email2": "", "site": "bronxandbanco.com", "note": ""}, {"id": 177, "org": "Bottega Veneta", "name": "Press / General Inbox", "email": "press@bottegaveneta.com", "email2": "aiko.inoue@bottegaveneta.com", "site": "bottegaveneta.com", "note": ""}, {"id": 178, "org": "Bottega Veneta", "name": "Aiko INoue", "email": "aiko.inoue@bottegaveneta.com", "email2": "press@bottegaveneta.com", "site": "bottegaveneta.com", "note": ""}, {"id": 179, "org": "Bottega Veneta", "name": "Maria SIlva", "email": "silva.maria@bottegaveneta.com", "email2": "press@bottegaveneta.com", "site": "bottegaveneta.com", "note": ""}, {"id": 180, "org": "The Row", "name": "Mai Sawai", "email": "mai.sawaai@therow.com", "email2": "", "site": "therow.com", "note": ""}, {"id": 181, "org": "The Row", "name": "Victoria Sutrisno", "email": "victoria.sutrisno@therow.com", "email2": "", "site": "therow.com", "note": ""}, {"id": 182, "org": "Virgil Abloh", "name": "Press / General Inbox", "email": "press@louisvuitton.com", "email2": "", "site": "louisvuitton.com", "note": ""}, {"id": 183, "org": "Virgil Abloh", "name": "Alexandre Demri", "email": "alexandre.demri@louisvuitton.com", "email2": "", "site": "louisvuitton.com", "note": ""}, {"id": 184, "org": "Virgil Abloh", "name": "Press Contact", "email": "eleonora.silvestri@off---white.com", "email2": "", "site": "off-white.com", "note": ""}, {"id": 185, "org": "Virgil Abloh", "name": "white.com", "email": "offwhite@karlaotto.com", "email2": "", "site": "karlaotto.com", "note": ""}, {"id": 186, "org": "Virgil Abloh", "name": "Press Contact", "email": "simon.lee@off---white.com", "email2": "", "site": "off-white.com", "note": ""}, {"id": 187, "org": "Alessandro Michele", "name": "Press / General Inbox", "email": "press@gucci.com", "email2": "mara.convertini@gucci.com", "site": "gucci.com", "note": ""}, {"id": 188, "org": "Alessandro Michele", "name": "Mara Convertini", "email": "mara.convertini@gucci.com", "email2": "press@gucci.com", "site": "gucci.com", "note": ""}, {"id": 189, "org": "Alessandro Michele", "name": "Press Contact", "email": "sarah.dhaoui@gucci.com", "email2": "press@gucci.com", "site": "gucci.com", "note": ""}, {"id": 190, "org": "Balenciaga", "name": "Press / General Inbox", "email": "press@balenciaga.com", "email2": "gianfranco.gianangeli@balenciaga.com", "site": "balenciaga.com", "note": ""}, {"id": 191, "org": "Balenciaga", "name": "Press Contact", "email": "gianfranco.gianangeli@balenciaga.com", "email2": "press@balenciaga.com", "site": "balenciaga.com", "note": ""}, {"id": 192, "org": "Saint Laurent", "name": "Press / General Inbox", "email": "press@ysl.com", "email2": "kevin.legoux@ysl.com", "site": "ysl.com", "note": ""}, {"id": 193, "org": "Saint Laurent", "name": "Press Contact", "email": "kevin.legoux@ysl.com", "email2": "press@ysl.com", "site": "ysl.com", "note": ""}, {"id": 194, "org": "Saint Laurent", "name": "Press Contact", "email": "anicka.wintle@ysl.com", "email2": "press@ysl.com", "site": "ysl.com", "note": ""}, {"id": 195, "org": "Saint Laurent", "name": "Press Contact", "email": "sarah.coffey@ysl.com", "email2": "press@ysl.com", "site": "ysl.com", "note": ""}, {"id": 196, "org": "Saint Laurent", "name": "Press Contact", "email": "soomin.cho@ysl.com", "email2": "press@ysl.com", "site": "ysl.com", "note": ""}, {"id": 197, "org": "Maison Margiela", "name": "Press / General Inbox", "email": "presse@margiela.com", "email2": "", "site": "margiela.com", "note": ""}, {"id": 198, "org": "Maison Margiela", "name": "Press & Celebrities", "email": "emma_sidibe@margiela.com", "email2": "", "site": "margiela.com", "note": ""}, {"id": 199, "org": "Maison Margiela", "name": "Press Contact", "email": "clemence_duquenne@margiela.com", "email2": "", "site": "margiela.com", "note": ""}, {"id": 200, "org": "Maison Margiela", "name": "Press Contact", "email": "elise_weber@margiela.com", "email2": "", "site": "margiela.com", "note": ""}, {"id": 201, "org": "Prada", "name": "Press Contact", "email": "evgeniya.melnikova@prada.com", "email2": "", "site": "prada.com", "note": ""}, {"id": 202, "org": "Prada", "name": "Press Contact", "email": "oceanne.bessou@prada.com", "email2": "", "site": "prada.com", "note": ""}, {"id": 203, "org": "Prada", "name": "Press Contact", "email": "madeline.grebil@prada.com", "email2": "", "site": "prada.com", "note": ""}, {"id": 204, "org": "Alexander McQueen", "name": "Press / General Inbox", "email": "camilla.cioffredi@alexandermcqueen.com", "email2": "", "site": "alexandermcqueen.com", "note": ""}, {"id": 205, "org": "Alexander McQueen", "name": "PR and Marketing", "email": "Manager-olivia.jiang@alexandermcqueen.com", "email2": "", "site": "alexandermcqueen.com", "note": ""}, {"id": 206, "org": "Stella McCartney", "name": "Press / General Inbox", "email": "giorgia.massaccesi@stellamccartney.com", "email2": "", "site": "stellamccartney.com", "note": ""}, {"id": 207, "org": "Stella McCartney", "name": "Press / General Inbox", "email": "arabella.rufino@stellamccartney.com", "email2": "", "site": "stellamccartney.com", "note": ""}, {"id": 208, "org": "Stella McCartney", "name": "Press Contact", "email": "virginia.nanni@stellamccartney.com", "email2": "", "site": "stellamccartney.com", "note": ""}, {"id": 209, "org": "Ferragamo", "name": "Press / General Inbox", "email": "alessia.arosio@ferragamo.com", "email2": "", "site": "ferragamo.com", "note": ""}, {"id": 210, "org": "Ferragamo", "name": "Press Contact", "email": "marta.riccobono@ferragamo.com", "email2": "", "site": "ferragamo.com", "note": ""}, {"id": 211, "org": "Ferragamo", "name": "Press Contact", "email": "klara.bredlow@ferragamo.com", "email2": "", "site": "ferragamo.com", "note": ""}, {"id": 212, "org": "16Arlington", "name": "Press / General Inbox", "email": "craig@16arlington.co.uk", "email2": "", "site": "16arlington.co.uk", "note": ""}, {"id": 213, "org": "16Arlington", "name": "Press Contact", "email": "bliss@16arlington.co.uk", "email2": "", "site": "16arlington.co.uk", "note": ""}, {"id": 214, "org": "16Arlington", "name": "Press Contact", "email": "isee@16arlington.co.uk", "email2": "", "site": "16arlington.co.uk", "note": ""}, {"id": 215, "org": "Nensi Dojaka", "name": "Press / General Inbox", "email": "studio@nensidojaka.co.uk", "email2": "", "site": "nensidojaka.co.uk", "note": ""}, {"id": 216, "org": "Richard Quinn", "name": "Press / General Inbox", "email": "press@richardquinn.com", "email2": "", "site": "richardquinn.com", "note": ""}, {"id": 217, "org": "Richard Quinn", "name": "Press Contact", "email": "info@richardquinnstudio.co.uk", "email2": "", "site": "richardquinnstudio.co.uk", "note": ""}, {"id": 218, "org": "Ashish", "name": "Press / General Inbox", "email": "studio@ashish.co.uk", "email2": "", "site": "ashish.co.uk", "note": ""}, {"id": 219, "org": "Conner Ives", "name": "Press / General Inbox", "email": "studio@connerives.com", "email2": "", "site": "connerives.com", "note": ""}, {"id": 220, "org": "Conner Ives", "name": "Press / General Inbox", "email": "connerives@dlx.co", "email2": "", "site": "dlx.co", "note": ""}, {"id": 221, "org": "Conner Ives", "name": "Press Contact", "email": "sara@belier.info", "email2": "", "site": "belier.info", "note": ""}, {"id": 222, "org": "Dilara Fındıkoğlu", "name": "Press / General Inbox", "email": "studio@dilarafindikoglu.com", "email2": "", "site": "dilarafindikoglu.com", "note": ""}, {"id": 223, "org": "Dilara Fındıkoğlu", "name": "Press Contact", "email": "deniz@dilarafindikoglu.com", "email2": "", "site": "dilarafindikoglu.com", "note": ""}, {"id": 224, "org": "Huishan Zhang", "name": "Press / General Inbox", "email": "viet-anh@huishanzhang.com", "email2": "", "site": "huishanzhang.com", "note": ""}, {"id": 225, "org": "Chet Lo", "name": "Press / General Inbox", "email": "chet@chetlo.com", "email2": "", "site": "chetlo.com", "note": ""}, {"id": 226, "org": "British Fashion Council", "name": "Press / General Inbox", "email": "eve.cousins@britishfashioncouncil.com", "email2": "", "site": "britishfashioncouncil.com", "note": ""}, {"id": 227, "org": "British Fashion Council", "name": "Press Contact", "email": "tanya.spero@britishfashioncouncil.com", "email2": "", "site": "britishfashioncouncil.com", "note": ""}, {"id": 228, "org": "KCD Worldwide", "name": "Press / General Inbox", "email": "info@kcdworldwide.com", "email2": "annasuishow@kcdworldwide.com", "site": "kcdworldwide.com", "note": ""}, {"id": 229, "org": "Caroline Mower PR", "name": "Press / General Inbox", "email": "info@carolinemowerpr.com", "email2": "", "site": "carolinemowerpr.com", "note": ""}, {"id": 230, "org": "Purple PR", "name": "Press / General Inbox", "email": "info@purplepr.com", "email2": "carolyn.batista@purplepr.com", "site": "purplepr.com", "note": ""}, {"id": 231, "org": "Hannah Sharman-Cox PR", "name": "Press / General Inbox", "email": "info@hannahsharmancox.com", "email2": "", "site": "hannahsharmancox.com", "note": ""}, {"id": 232, "org": "The Communications Store", "name": "Press / General Inbox", "email": "info@thecommunicationsstore.com", "email2": "", "site": "thecommunicationsstore.com", "note": ""}, {"id": 233, "org": "Borough PR", "name": "Press / General Inbox", "email": "info@boroughpr.com", "email2": "", "site": "boroughpr.com", "note": ""}, {"id": 234, "org": "M&C Saatchi PR", "name": "Press / General Inbox", "email": "info@mcsaatchi.com", "email2": "", "site": "mcsaatchi.com", "note": ""}, {"id": 235, "org": "Iris PR", "name": "Press / General Inbox", "email": "info@irispr.com", "email2": "", "site": "irispr.com", "note": ""}, {"id": 236, "org": "Frank PR", "name": "Press / General Inbox", "email": "info@frankpr.it", "email2": "", "site": "frankpr.it", "note": ""}, {"id": 237, "org": "BFA @bfa", "name": "Press / General Inbox", "email": "maryjoy@bfamedia.co", "email2": "", "site": "bfamedia.co", "note": ""}, {"id": 238, "org": "BFA @bfa", "name": "Press Contact", "email": "banjo@bfamedia.co", "email2": "", "site": "bfamedia.co", "note": ""}, {"id": 239, "org": "CFDA", "name": "Press / General Inbox", "email": "communications@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 240, "org": "CFDA", "name": "Press / General Inbox", "email": "awards@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 241, "org": "CFDA", "name": "Senior Marketing & Communications Manager;", "email": "a.araujo@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 242, "org": "CFDA", "name": "Director of Special Projects + Events", "email": "l.king@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 243, "org": "CFDA", "name": "Press Contact", "email": "p.viteri@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 244, "org": "CFDA", "name": "Press Contact", "email": "m.karimzadeh@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 245, "org": "CFDA", "name": "Press Contact", "email": "i.mayes@cfda.com", "email2": "", "site": "cfda.com", "note": ""}, {"id": 246, "org": "Baby2Baby", "name": "Press Contact", "email": "haewan@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 247, "org": "", "name": "Press Contact", "email": "jennifer.moreno@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 248, "org": "", "name": "Press Contact", "email": "briney@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 249, "org": "", "name": "Press Contact", "email": "shea@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 250, "org": "", "name": "Press Contact", "email": "melissa@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 251, "org": "", "name": "Press Contact", "email": "kelly@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 252, "org": "", "name": "Press Contact", "email": "norah@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 253, "org": "", "name": "Press Contact", "email": "donate@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 254, "org": "", "name": "Press Contact", "email": "brittany@baby2baby.org", "email2": "", "site": "baby2baby.org", "note": ""}, {"id": 255, "org": "Vogue (US / UK / Arabia / Vogue Runway)", "name": "Jorden Bickham", "email": "jorden_bickham@condenast.com", "email2": "", "site": "condenast.com", "note": "Fashion | High-End / Prestige | Priority: High | Patrick is a contributing photographer to British and Australian Vogue living in Connecticut. Alexandra was just promoted from her role as a market editor. Jorden is based in the NY office. | Status: emailed except patrick"}, {"id": 256, "org": "Vogue (US / UK / Arabia / Vogue Runway)", "name": "Alexandra Michler", "email": "alexandra_michler@vogue.com", "email2": "", "site": "vogue.com", "note": "Fashion | High-End / Prestige | Priority: High | Patrick is a contributing photographer to British and Australian Vogue living in Connecticut. Alexandra was just promoted from her role as a market editor. Jorden is based in the NY office. | Status: emailed except patrick"}, {"id": 257, "org": "Harper’s Bazaar (US / UK / Arabia)", "name": "Ariana Marsh", "email": "ariana.marsh@hearst.com", "email2": "", "site": "hearst.com", "note": "Fashion | High-End / Prestige | Priority: High | Andrea overseas all things celebrity and tv. Ariana have covered Kali Uchis and Giveon recently. Amy seems easy to contact, UK based. | Status: emailed all"}, {"id": 258, "org": "Harper’s Bazaar (US / UK / Arabia)", "name": "Andrea Cuttler", "email": "andrea.cuttler@hearst.com", "email2": "", "site": "hearst.com", "note": "Fashion | High-End / Prestige | Priority: High | Andrea overseas all things celebrity and tv. Ariana have covered Kali Uchis and Giveon recently. Amy seems easy to contact, UK based. | Status: emailed all"}, {"id": 259, "org": "Harper’s Bazaar (US / UK / Arabia)", "name": "Amy Klerk", "email": "amy.deklerk@hearst.co.uk", "email2": "", "site": "hearst.co.uk", "note": "Fashion | High-End / Prestige | Priority: High | Andrea overseas all things celebrity and tv. Ariana have covered Kali Uchis and Giveon recently. Amy seems easy to contact, UK based. | Status: emailed all"}, {"id": 260, "org": "NY Mag", "name": "Asia Milia", "email": "asia.ware@voxmedia.com", "email2": "", "site": "voxmedia.com", "note": "Fashion | Mid-Tier / Accessible | Priority: Medium | Status: Emailed"}, {"id": 261, "org": "Revolt", "name": "Oumou Fofana", "email": "ofofana@ladmm.tv", "email2": "", "site": "ladmm.tv", "note": "Fashion | Fashion/Pop Culture | Priority: Prestige | Status: Emailed"}, {"id": 262, "org": "SS Activewear", "name": "American Apparel With Love Cocktail — RSVP", "email": "dfreet@ssactivewear.com", "email2": "", "site": "ssactivewear.com", "note": "NYFW SS25 | Aug 29 | American Apparel With Love Cocktail | RSVP"}, {"id": 263, "org": "Harper's Bazaar", "name": "Harper's Bazaar Icons Issue — RSVP", "email": "events@harpersbazaar.com", "email2": "", "site": "harpersbazaar.com", "note": "NYFW SS25 | Sep 4 | Harper's Bazaar Icons Issue NYFW Kickoff | RSVP"}, {"id": 264, "org": "Randi Rahm", "name": "Randi Rahm", "email": "randirahm2@gmail.com", "email2": "", "site": "gmail.com", "note": "NYFW SS25 | Sep 4 | Randi Rahm S/S25 Fashion Presentation | RSVP"}, {"id": 265, "org": "RHC (Riff Raff Club)", "name": "Riff Raff Club Opening Party — RSVP", "email": "riffraffclubrsvp@wearerhc.com", "email2": "", "site": "wearerhc.com", "note": "NYFW SS25 | Sep 4 | Riff Raff Club Opening Party | RSVP"}, {"id": 266, "org": "Daily Front Row", "name": "Daily Front Row — RSVP", "email": "rsvp@dailyfrontrow.com", "email2": "eddie@dailyfrontrow.com", "site": "dailyfrontrow.com", "note": "NYFW SS25 | Sep 4 | Daily Front Row NYFW Kickoff with Ana Sky | RSVP"}, {"id": 267, "org": "KCD Worldwide", "name": "Veronica Beard Cocktail Party — Requests", "email": "veronicabeard@kcdworldwide.co.uk", "email2": "noel.garcia@veronicabeard.com", "site": "kcdworldwide.co.uk", "note": "NYFW SS25 | Sep 5 | Veronica Beard Cocktail Party | Requests"}, {"id": 268, "org": "Veronica Beard", "name": "Noel Garcia", "email": "noel.garcia@veronicabeard.com", "email2": "veronicabeard@kcdworldwide.co.uk", "site": "veronicabeard.com", "note": "NYFW SS25 | Sep 5 | Veronica Beard Cocktail Party | Requests"}, {"id": 269, "org": "Billboard", "name": "Billboard Impact Dinner / R&B Hip-Hop Power Players — RSVP", "email": "rsvp@billboard.com", "email2": "", "site": "billboard.com", "note": "NYFW SS25 | Sep 5 | Billboard Impact Dinner / R&B Hip-Hop Power Players | RSVP"}, {"id": 270, "org": "Paul Wilmot Communications", "name": "Supima Design Competition — RSVP", "email": "supima@paulwilmot.com", "email2": "", "site": "paulwilmot.com", "note": "NYFW SS25 | Sep 5 | Supima Design Competition | RSVP"}, {"id": 271, "org": "Ralph Lauren", "name": "Lauren Astry", "email": "lauren.astry@ralphlauren.com", "email2": "", "site": "ralphlauren.com", "note": "NYFW SS25 | Sep 5 | Ralph Lauren Runway Show | Requests"}, {"id": 272, "org": "Maui x Lolita", "name": "Maui x Lolita — RSVP", "email": "pr@mauixlolita.com", "email2": "", "site": "mauixlolita.com", "note": "NYFW SS25 | Sep 6 | Maui x Lolita SS25 Show | RSVP"}, {"id": 273, "org": "The Lounge", "name": "The Lounge — Contact", "email": "lastinglegacypr@gmail.com", "email2": "", "site": "gmail.com", "note": "NYFW SS25 | Sep 6 | The Lounge NYFW Kickoff Party | Contact"}, {"id": 274, "org": "Daily Front Row", "name": "Daily Front Row Party — Contact", "email": "eddie@dailyfrontrow.com", "email2": "rsvp@dailyfrontrow.com", "site": "dailyfrontrow.com", "note": "NYFW SS25 | Sep 6 | Daily Front Row Party | Contact"}, {"id": 275, "org": "CLD PR / Style House", "name": "CLD PR Kickoff Event — Requests", "email": "michelle@cldstylehouse.com", "email2": "", "site": "cldstylehouse.com", "note": "NYFW SS25 | Sep 6 | CLD PR Kickoff Event | Requests"}, {"id": 276, "org": "Tenique Bernard", "name": "Brandon Maxwell — Contact", "email": "tenique@teniquebernard.com", "email2": "", "site": "teniquebernard.com", "note": "NYFW SS25 | Sep 6 | Brandon Maxwell s/s25 Runway | Contact"}, {"id": 277, "org": "The Residency Experience", "name": "Libertine — Contact", "email": "stephen@theresidencyexperience.com", "email2": "", "site": "theresidencyexperience.com", "note": "NYFW SS25 | Sep 6 | Libertine s/s25 Runway | Contact"}, {"id": 278, "org": "Purple PR", "name": "Badgley Mischka Spring 2025 — RSVP", "email": "badgleymischka@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 6 | Badgley Mischka Spring 2025 Presentation | RSVP"}, {"id": 279, "org": "CLD PR / Style House", "name": "CLD PR — RSVP", "email": "sammy@cldstylehouse.com", "email2": "", "site": "cldstylehouse.com", "note": "NYFW SS25 | Sep 6 | CLD PR NYFW Kickoff Event | RSVP"}, {"id": 280, "org": "John Varvatos", "name": "John Varvatos Kiln & Craft — RSVP", "email": "jamesschuck@johnnvarvatos.com", "email2": "", "site": "johnvarvatos.com", "note": "NYFW SS25 | Sep 6 | John Varvatos Kiln & Craft Presentation | RSVP"}, {"id": 281, "org": "CCPR NYC", "name": "Chris Constable", "email": "rynshu@ccpr-nyc.com", "email2": "", "site": "ccpr-nyc.com", "note": "NYFW SS25 | Sep 6 | Rynshu SS25 Collection | Contact"}, {"id": 282, "org": "Daily Front Row", "name": "Fashion Media Awards — RSVP", "email": "fma@dailyfrontrow.com", "email2": "jocelyn.cash@purplepr.com", "site": "dailyfrontrow.com", "note": "NYFW SS25 | Sep 6 | Fashion Media Awards | RSVP"}, {"id": 283, "org": "Purple PR", "name": "Jocelyn Cash", "email": "jocelyn.cash@purplepr.com", "email2": "info@purplepr.com", "site": "purplepr.com", "note": "NYFW SS25 | Sep 6 | Fashion Media Awards | Contact"}, {"id": 284, "org": "KCD Worldwide", "name": "Tommy Hilfiger Spring 2025 — Contact", "email": "oneill@kcdworldwide.co.uk", "email2": "", "site": "kcdworldwide.co.uk", "note": "NYFW SS25 | Sep 8 | Tommy Hilfiger Spring 2025 Runway | Contact"}, {"id": 285, "org": "The Hinton Group", "name": "Sergio Hudson — Contact", "email": "omari@thehintongroup.co", "email2": "claudiali@thehintongroup.co", "site": "thehintongroup.co", "note": "NYFW SS25 | Sep 7 | Sergio Hudson s/s25 Runway | Contact"}, {"id": 286, "org": "Gia Kuan Consulting", "name": "Kim Shui — Contact", "email": "kimshui@giakuan.com", "email2": "cynthiarowley@giakuan.com", "site": "giakuan.com", "note": "NYFW SS25 | Sep 7 | Kim Shui s/s25 Runway | Contact"}, {"id": 287, "org": "alice + olivia", "name": "Lauren Bochner", "email": "lauren.bochner@aliceandolivia.com", "email2": "sydney@sydneyreising.com", "site": "aliceandolivia.com", "note": "NYFW SS25 | Sep 7 | alice + olivia s/s25 Runway | Contact"}, {"id": 288, "org": "Prabal Gurung", "name": "Prabal Gurung — Contact", "email": "marianna@prabalgurung.com", "email2": "", "site": "prabalgurung.com", "note": "NYFW SS25 | Sep 7 | Prabal Gurung s/s25 Runway | Contact"}, {"id": 289, "org": "Lucien Pagès PR", "name": "Off-White — Contact", "email": "nsimond@lucienpages.com", "email2": "", "site": "lucienpages.com", "note": "NYFW SS25 | Sep 8 | Off-White s/s25 Runway (Paris) | Contact"}, {"id": 290, "org": "Jason Wu", "name": "Jason Wu — Contact", "email": "gina@jasonwustudio.com", "email2": "", "site": "jasonwustudio.com", "note": "NYFW SS25 | Sep 8 | Jason Wu s/s25 Runway | Contact"}, {"id": 291, "org": "Ulla Johnson", "name": "Ulla Johnson — Contact", "email": "cori@ullajohnson.com", "email2": "", "site": "ullajohnson.com", "note": "NYFW SS25 | Sep 8 | Ulla Johnson s/s25 Runway | Contact"}, {"id": 292, "org": "Eckhaus Latta", "name": "ECKHAUS LATTA — Contact", "email": "press@eckhauslatta.com", "email2": "", "site": "eckhauslatta.com", "note": "NYFW SS25 | Sep 8 | ECKHAUS LATTA s/s25 Runway | Contact"}, {"id": 293, "org": "KPM Gregor", "name": "Bach Mai — Contact", "email": "patrick@kpmgregor.com", "email2": "", "site": "kpmgregor.com", "note": "NYFW SS25 | Sep 8 | Bach Mai s/s25 Runway | Contact"}, {"id": 294, "org": "3.1 Phillip Lim", "name": "3.1 Phillip Lim — Contact", "email": "rsikar@31philliplim.com", "email2": "", "site": "31philliplim.com", "note": "NYFW SS25 | Sep 8 | 3.1 Phillip Lim s/s25 Runway | Contact"}, {"id": 295, "org": "LaQuan Smith", "name": "LaQuan Smith — Inquiries", "email": "office@laquansmith.com", "email2": "", "site": "laquansmith.com", "note": "NYFW SS25 | Sep 9 | LaQuan Smith s/s25 Runway | Inquiries"}, {"id": 296, "org": "Coach", "name": "Coach — Contact", "email": "agarciasantana@coach.com", "email2": "bbelke@coach.com", "site": "coach.com", "note": "NYFW SS25 | Sep 9 | Coach s/s25 Runway | Contact"}, {"id": 297, "org": "Coach", "name": "Coach — Contact", "email": "bbelke@coach.com", "email2": "toconnell@coach.com", "site": "coach.com", "note": "NYFW SS25 | Sep 9 | Coach s/s25 Runway | Contact"}, {"id": 298, "org": "Coach", "name": "Coach — Contact", "email": "toconnell@coach.com", "email2": "agarciasantana@coach.com", "site": "coach.com", "note": "NYFW SS25 | Sep 9 | Coach s/s25 Runway | Contact"}, {"id": 299, "org": "Carolina Herrera", "name": "Jenna Cavanagh", "email": "jenna.cavanagh@cherrera.com", "email2": "", "site": "cherrera.com", "note": "NYFW SS25 | Sep 9 | Carolina Herrera s/s25 Runway | Contact"}, {"id": 300, "org": "Lafayette 148 New York", "name": "Rachel Kaplan", "email": "rachel.kaplan@lafayette148.com", "email2": "", "site": "lafayette148.com", "note": "NYFW SS25 | Sep 9 | Lafayette 148 New York s/s25 Runway | Contact"}, {"id": 301, "org": "KWT Global", "name": "Naeem Khan — Contact", "email": "bhospodor@kwtglobal.com", "email2": "", "site": "kwtglobal.com", "note": "NYFW SS25 | Sep 9 | Naeem Khan s/s25 Runway | Contact"}, {"id": 302, "org": "COS", "name": "Georgia Long", "email": "georgia.long@cosstores.com", "email2": "niklas.peter@cosstores.com", "site": "cosstores.com", "note": "NYFW SS25 | Sep 10 | COS s/s25 Runway | Contact"}, {"id": 303, "org": "COS", "name": "Niklas Peter", "email": "niklas.peter@cosstores.com", "email2": "georgia.long@cosstores.com", "site": "cosstores.com", "note": "NYFW SS25 | Sep 10 | COS s/s25 Runway | Contact"}, {"id": 304, "org": "Cynthia Rowley", "name": "Cynthia Rowley — Contact", "email": "prdept@cynthiarowley.com", "email2": "", "site": "cynthiarowley.com", "note": "NYFW SS25 | Sep 10 | Cynthia Rowley s/s25 Runway | Contact"}, {"id": 305, "org": "Totême", "name": "Totême — Contact", "email": "sabina@toteme-studio.com", "email2": "", "site": "toteme-studio.com", "note": "NYFW SS25 | Sep 10 | Totême s/s25 Runway | Contact"}, {"id": 306, "org": "Negri Firman PR", "name": "A Luna", "email": "a.luna@negrifirman.com", "email2": "chris@ccpr-nyc.com", "site": "negrifirman.com", "note": "NYFW SS25 | Sep 11 | Frederick Anderson s/s25 Runway | Contact"}, {"id": 307, "org": "CCPR NYC", "name": "Frederick Anderson — Contact", "email": "chris@ccpr-nyc.com", "email2": "a.luna@negrifirman.com", "site": "ccpr-nyc.com", "note": "NYFW SS25 | Sep 11 | Frederick Anderson s/s25 Runway | Contact"}, {"id": 308, "org": "Sebastien Ami", "name": "Sebastien Ami — Requests", "email": "pr@sebastienami.com", "email2": "", "site": "sebastienami.com", "note": "NYFW SS25 | Sep 11 | Sebastien Ami s/s25 Runway | Requests"}, {"id": 309, "org": "Monse", "name": "Monse — Requests", "email": "pr@monse.com", "email2": "", "site": "monse.com", "note": "NYFW SS25 | Sep 7 | Monse s/s25 Runway | Requests"}, {"id": 310, "org": "Purple PR", "name": "Grace Ling — RSVP", "email": "graceling@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 6 | Grace Ling SS25 Runway (Purple PR) | RSVP"}, {"id": 311, "org": "Purple PR", "name": "Willy Chavarria — RSVP", "email": "willychavarria@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 6 | Willy Chavarria SS25 Runway (Purple PR) | RSVP"}, {"id": 312, "org": "Purple PR", "name": "Campillo — RSVP", "email": "campillo@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 7 | Campillo SS25 Runway (Purple PR) | RSVP"}, {"id": 313, "org": "Purple PR", "name": "Palomo Spain — RSVP", "email": "palomospain@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 7 | Palomo Spain SS25 Runway (Purple PR) | RSVP"}, {"id": 314, "org": "Purple PR", "name": "Christian Cowan — RSVP", "email": "christiancowan@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 8 | Christian Cowan SS25 Runway (Purple PR) | RSVP"}, {"id": 315, "org": "Purple PR", "name": "The Blonds — RSVP", "email": "theblonds@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 8 | The Blonds SS25 Runway (Purple PR) | RSVP"}, {"id": 316, "org": "Purple PR", "name": "Naeem Khan — RSVP", "email": "naeemkhan@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 9 | Naeem Khan SS25 Runway (Purple PR) | RSVP"}, {"id": 317, "org": "Purple PR", "name": "Dennis Basso — RSVP", "email": "dennisbasso@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 9 | Dennis Basso SS25 Runway (Purple PR) | RSVP"}, {"id": 318, "org": "Purple PR", "name": "Juzui — RSVP", "email": "juzui@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 10 | Juzui SS25 Runway (Purple PR) | RSVP"}, {"id": 319, "org": "Purple PR", "name": "FIT MFA Design Graduate — RSVP", "email": "fitmfashow@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 10 | FIT MFA Design Graduate Runway (Purple PR) | RSVP"}, {"id": 320, "org": "Purple PR", "name": "Pamella Roland — RSVP", "email": "pamellaroland@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW SS25 | Sep 10 | Pamella Roland SS25 Runway (Purple PR) | RSVP"}, {"id": 321, "org": "Adeam", "name": "Katrina Stephen", "email": "press@adeamonline.com", "email2": "", "site": "adeamonline.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 322, "org": "Agentry PR", "name": "Henry Kessler", "email": "aknvas@agentrypr.com", "email2": "cseries@agentrypr.com", "site": "agentrypr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 323, "org": "Sydney Reising PR", "name": "Sydney Reising", "email": "sydney@sydneyreising.com", "email2": "taylor.arnold@aliceandolivia.com", "site": "sydneyreising.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 324, "org": "alice + olivia", "name": "Taylor Arnold", "email": "taylor.arnold@aliceandolivia.com", "email2": "lauren.bochner@aliceandolivia.com", "site": "aliceandolivia.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 325, "org": "Amen", "name": "Cristina Colli", "email": "amenpress@jato.it", "email2": "", "site": "jato.it", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 326, "org": "KCD Worldwide", "name": "Charlotte Buchanan", "email": "annasuishow@kcdworldwide.com", "email2": "info@kcdworldwide.com", "site": "kcdworldwide.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 327, "org": "Badgley Mischka", "name": "Rob Caldwell", "email": "rcaldwell@badgleymischka.com", "email2": "", "site": "badgleymischka.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 328, "org": "Mode World PR", "name": "Jameela Lake", "email": "jameela@modeworld.com", "email2": "", "site": "modeworld.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 329, "org": "Bibhu Mohapatra", "name": "Anne Fahey-Stormont", "email": "rsvp@bibhu.com", "email2": "", "site": "bibhu.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 330, "org": "Black in Fashion Council", "name": "Sandrine Charles", "email": "sandrine@blackinfashioncouncil.com", "email2": "", "site": "blackinfashioncouncil.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 331, "org": "Purple PR", "name": "Meline Agabaian", "email": "bronxandbanco@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 332, "org": "Agentry PR", "name": "Agentry PR Desk", "email": "cseries@agentrypr.com", "email2": "aknvas@agentrypr.com", "site": "agentrypr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 333, "org": "Purple PR", "name": "Jocelyn Mak", "email": "chocheng@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 334, "org": "Christian Cowan", "name": "Natthias Mitchinson", "email": "natthias@christiancowan.com", "email2": "", "site": "christiancowan.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 335, "org": "Catinella PR", "name": "Robyn Catinella", "email": "press@catinella.com.au", "email2": "", "site": "catinella.com.au", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 336, "org": "Chromat", "name": "Chromat Press", "email": "info@chromat.co", "email2": "", "site": "chromat.co", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 337, "org": "Jay All LLC", "name": "Noreen Scott", "email": "nscott@jayallc.com", "email2": "", "site": "jayallc.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 338, "org": "The Hinton Group", "name": "Ashlyn Johnson", "email": "claudiali@thehintongroup.co", "email2": "sergio@thehintongroup.co", "site": "thehintongroup.co", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 339, "org": "Gia Kuan Consulting", "name": "Gia Kuan — Collina Strada", "email": "collinastrada@giakuan.com", "email2": "cynthiarowley@giakuan.com", "site": "giakuan.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 340, "org": "Purple PR", "name": "Concept Korea Desk", "email": "conceptkorea@purplepr.com", "email2": "", "site": "purplepr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 341, "org": "NY China Fashion Collective", "name": "Claire Lin", "email": "info@nychinafashioncollective.com", "email2": "", "site": "nychinafashioncollective.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 342, "org": "Gia Kuan Consulting", "name": "Gia Kuan — Cynthia Rowley", "email": "cynthiarowley@giakuan.com", "email2": "collinastrada@giakuan.com", "site": "giakuan.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 343, "org": "Kim Shui", "name": "Kim Shui Press Team", "email": "hello@kimshui.net", "email2": "", "site": "kimshui.net", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 344, "org": "The Blonds", "name": "Brynne Formato", "email": "press@theblonds.nyc", "email2": "", "site": "theblonds.nyc", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 345, "org": "Pat Bo", "name": "Savannah Engel", "email": "claire@savannahengel.com", "email2": "", "site": "savannahengel.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 346, "org": "Area", "name": "Area PR Desk", "email": "requests@area.nyc", "email2": "maggie@area.nyc", "site": "area.nyc", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 347, "org": "Lucien Pagès PR", "name": "NYC Desk", "email": "nyc@lucienpages.com", "email2": "", "site": "lucienpages.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 348, "org": "Lindsey Media", "name": "Lindsey Solomon", "email": "lindsey@lindsey.media", "email2": "wiederhoeft@lindsey.media", "site": "lindsey.media", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 349, "org": "Thom Browne", "name": "Thom Browne Press", "email": "press@thombrowne.com", "email2": "", "site": "thombrowne.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 350, "org": "Marc Jacobs", "name": "Hilary McCanse", "email": "h.mccanse@marcjacobs.com", "email2": "", "site": "marcjacobs.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 351, "org": "Batsheva", "name": "Batsheva Press", "email": "info@batsheva.com", "email2": "", "site": "batsheva.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 352, "org": "Karla Otto PR", "name": "Elgene Castueras", "email": "elgene.castueras@karlaotto.com", "email2": "", "site": "karlaotto.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 353, "org": "Loft Creative Group", "name": "Gregory (Loft CG)", "email": "gregory@loftcreativegroup.com", "email2": "", "site": "loftcreativegroup.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 354, "org": "Michael Kors", "name": "Raya Goonetilleke", "email": "raya.goonetilleke@michaelkors.com", "email2": "edwin.zotamba@michaelkors.com", "site": "michaelkors.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 355, "org": "Michael Kors", "name": "Edwin Zotamba", "email": "edwin.zotamba@michaelkors.com", "email2": "allison.stein@michaelkors.com", "site": "michaelkors.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 356, "org": "Michael Kors", "name": "Allison Stein", "email": "allison.stein@michaelkors.com", "email2": "raya.goonetilleke@michaelkors.com", "site": "michaelkors.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 357, "org": "Purple PR", "name": "Carolyn Batista", "email": "carolyn.batista@purplepr.com", "email2": "info@purplepr.com", "site": "purplepr.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 358, "org": "Lindsey Media", "name": "Collina Strada Contact", "email": "linds@lindsey.media", "email2": "lindsey@lindsey.media", "site": "lindsey.media", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 359, "org": "Edelman", "name": "Brittany Herrmann", "email": "brittany.herrmann@edelman.com", "email2": "jessica.moschella@edelman.com", "site": "edelman.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 360, "org": "Edelman", "name": "Jessica Moschella", "email": "jessica.moschella@edelman.com", "email2": "brittany.herrmann@edelman.com", "site": "edelman.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 361, "org": "CFDA", "name": "A. Sandall", "email": "a.sandall@cfda.com", "email2": "", "site": "cfda.com", "note": "NYFW PSG 2024 | NYFW Fashion Show/PR Contact"}, {"id": 362, "org": "VSJ Consulting", "name": "Emily (VSJ)", "email": "emily@vsj-consulting.com", "email2": "carmenlucia@vsj-consulting.com", "site": "vsj-consulting.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 363, "org": "Area", "name": "Area RSVP", "email": "rsvp@area.nyc", "email2": "maggie@area.nyc", "site": "area.nyc", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 364, "org": "Area", "name": "Maggie (Area)", "email": "maggie@area.nyc", "email2": "requests@area.nyc", "site": "area.nyc", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 365, "org": "Rep Agency", "name": "Private Policy PR", "email": "privatepolicy@rep-agency.com", "email2": "", "site": "rep-agency.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 366, "org": "Calvin Klein", "name": "Lisa Lupinski", "email": "lisalupinski@ck.com", "email2": "", "site": "ck.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 367, "org": "FFORME", "name": "FFORME Press", "email": "press@fforme.com", "email2": "", "site": "fforme.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 368, "org": "Ashlyn New York", "name": "Nancy (Ashlyn)", "email": "nancy@ashlynnewyork.com", "email2": "", "site": "ashlynnewyork.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 369, "org": "Purple PR", "name": "Victor Leonard", "email": "victor.leonard@purplepr.com", "email2": "info@purplepr.com", "site": "purplepr.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 370, "org": "VSJ Consulting", "name": "Carmen Lucia", "email": "carmenlucia@vsj-consulting.com", "email2": "emily@vsj-consulting.com", "site": "vsj-consulting.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 371, "org": "Lindsey Media", "name": "Wiederhoeft RSVP", "email": "wiederhoeft@lindsey.media", "email2": "linds@lindsey.media", "site": "lindsey.media", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 372, "org": "LEDE Company", "name": "Alexander Wang PR", "email": "alexanderwang@ledecompany.com", "email2": "", "site": "ledecompany.com", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 373, "org": "The Hinton Group", "name": "Sergio Hudson — Direct", "email": "sergio@thehintongroup.co", "email2": "omari@thehintongroup.co", "site": "thehintongroup.co", "note": "NYFW SS26 CFDA | NYFW Fashion Show/PR Contact"}, {"id": 374, "org": "alice + olivia", "name": "GW Store RSVP", "email": "gwstore@aliceandolivia.com", "email2": "", "site": "aliceandolivia.com", "note": "alice + olivia Greenwich store VIP shopping event | Sep 4, 2–4pm | 335 Greenwich Ave | Stylist: Tina Broccole"}, {"id": 375, "org": "CLD PR / Style House", "name": "Caity (CLD PR)", "email": "caity@cldstylehouse.com", "email2": "michelle@cldstylehouse.com", "site": "cldstylehouse.com", "note": "NYFW SS26 Kickoff Event RSVP | Sep 12, 2025, 9am–4pm | W Hotel Times Square, 1567 Broadway NYC"}, {"id": 376, "org": "CLD PR / Style House", "name": "Michelle (CLD PR)", "email": "michelle@cldstylehouse.com", "email2": "caity@cldstylehouse.com", "site": "cldstylehouse.com", "note": "CLD PR NYFW Kickoff — brand activation inquiries & opt-in | @CLDSTYLE"}, {"id": 377, "org": "Alexander Wang", "name": "RSVP Desk", "email": "rsvp@alexanderwang.com", "email2": "press@alexanderwang.com", "site": "alexanderwang.com", "note": "Alexander Wang SS26 NYFW | Sep 12, 2025"}, {"id": 378, "org": "Alexander Wang", "name": "Press Desk", "email": "press@alexanderwang.com", "email2": "rsvp@alexanderwang.com", "site": "alexanderwang.com", "note": "Alexander Wang SS26 NYFW Press | Sep 12, 2025"}, {"id": 379, "org": "KCD Worldwide", "name": "Alexander Wang Requests", "email": "request@kcdworldwide.com", "email2": "rsvp@alexanderwang.com", "site": "kcdworldwide.com", "note": "Alexander Wang SS26 via KCD Worldwide | Sep 12, 2025"}, {"id": 380, "org": "Alexander Wang", "name": "Patrick Hunt", "email": "patrick.hunt@alexanderwang.com", "email2": "james.mccullagh@alexanderwang.com", "site": "alexanderwang.com", "note": "Alexander Wang SS26 NYFW | Named press contact"}, {"id": 381, "org": "Alexander Wang", "name": "James McCullagh", "email": "james.mccullagh@alexanderwang.com", "email2": "patrick.hunt@alexanderwang.com", "site": "alexanderwang.com", "note": "Alexander Wang SS26 NYFW | Named press contact"}, {"id": 382, "org": "Purple Brand", "name": "NYFW Events", "email": "nyfw@purple-brand.com", "email2": "", "site": "purple-brand.com", "note": "Purple Brand NYFW Block Party | Sep 12, 2025, 5–9pm | 50 Howard St, NY 10013 | Non-transferable"}, {"id": 383, "org": "Christian Siriano Collection", "name": "PR Desk (Collection)", "email": "pr@christiansirianocollection.com", "email2": "pr@christiansiriano.com", "site": "christiansirianocollection.com", "note": "NYFW: Christian Siriano SS26 runway show | Sep 11, 2025, 3pm NYC"}, {"id": 384, "org": "Christian Siriano", "name": "PR Desk (Direct)", "email": "pr@christiansiriano.com", "email2": "pr@christiansirianocollection.com", "site": "christiansiriano.com", "note": "NYFW: Christian Siriano SS26 — alternate press contact"}, {"id": 385, "org": "Maximus Communications", "name": "Info Desk", "email": "info@maximuscommunications.com", "email2": "", "site": "maximuscommunications.com", "note": "NYFW: PASSÉ VIP opening — Brad Walls solo US exhibition | Sep 11, 2025, 6–9pm | Sohotel, 347 Broome St NY 10013"}, {"id": 386, "org": "What Goes Around Comes Around", "name": "RSVP", "email": "rsvp@wgacany.com", "email2": "marketing@wgacany.com", "site": "wgacany.com", "note": "WGACA x Law Roach — Exclusive Archival Fashion Installation | Sep 11, 2025, 7–9pm | WGACA Atelier, 113 Wooster St, Soho | 21+"}, {"id": 387, "org": "What Goes Around Comes Around", "name": "Press Inquiries", "email": "marketing@wgacany.com", "email2": "rsvp@wgacany.com", "site": "wgacany.com", "note": "WGACA — Press inquiries & marketing contact"}, {"id": 388, "org": "Special Projects Media", "name": "W Magazine Events", "email": "wmagazine@specialprojectsmedia.com", "email2": "", "site": "specialprojectsmedia.com", "note": "W Magazine x Bloomingdale's NYFW Celebration | Sep 11, 2025 | Details TBC"}, {"id": 389, "org": "Michael Kors", "name": "Mona Swanson", "email": "mona.swanson@michaelkors.com", "email2": "raya.goonetilleke@michaelkors.com", "site": "michaelkors.com", "note": "Michael Kors Collection SS26 runway show | Sep 11, 2025, 11am | NYFW — embargoed"}, {"id": 390, "org": "RK Communications", "name": "Nicole Allen", "email": "nicole@rkcommunications.us", "email2": "", "site": "rkcommunications.us", "note": "CAMPBELL&KRAMER NYFW Party | Sep 10, 2025, 5–8pm | Café Forgot, 29 Ludlow St NY 10002"}, {"id": 391, "org": "Karla Otto PR", "name": "Jessica McCormack RSVP", "email": "jessicamccormackrsvp@karlaotto.com", "email2": "elgene.castueras@karlaotto.com", "site": "karlaotto.com", "note": "Jessica McCormack x Zoë Kravitz celebration — Jessica's NY arrival | Sep 10, 2025, 7pm | The Frick, 1 E 70th St NY 10021"}, {"id": 392, "org": "Miss Circle New York", "name": "PR Desk", "email": "pr@misscircle.com", "email2": "", "site": "misscircle.com", "note": "NYFW Red Label Presentation | 7–9pm presentation + 9–10pm after party"}, {"id": 393, "org": "Lanvin", "name": "SOHO Events", "email": "soho@lanvin.com", "email2": "", "site": "lanvin.com", "note": "Lanvin x GSH Contemporary — AW25 debut collection preview | Sep 10, 2025, 5–9pm | Sutton Tower, 430 E 58th St PH78, NY 10022"}, {"id": 394, "org": "Moda Operandi", "name": "Fendi Events", "email": "fendi@modaoperandi.com", "email2": "", "site": "modaoperandi.com", "note": "Fendi Roma Spy Bag NYFW celebration hosted by Lauren Santo Domingo | Sep 9, 2025, 7–9pm | Chez Fifi, 140 E 74th St NYC | Non-transferable"}, {"id": 395, "org": "Fairchild Fashion Media", "name": "M. Rocco", "email": "mrocco@fairchildfashion.com", "email2": "", "site": "fairchildfashion.com", "note": "WWD x FN x Beauty Inc Women in Power Annual Gala (4th edition) | Sep 8, 2025 | The Glasshouses, 545 W 25th St 21F NY 10001"}, {"id": 396, "org": "Prada", "name": "Fashion Press", "email": "fashionpress@prada.com", "email2": "", "site": "prada.com", "note": "Prada Paradigme fragrance launch party | Sep 6, 2025, 9pm | 281 Park Ave South NY 10010"}, {"id": 397, "org": "International Tennis Hall of Fame", "name": "N. Kowalsick", "email": "nkowalsick@tennisfame.com", "email2": "bcarnevale@tennisfame.com", "site": "tennisfame.com", "note": "The Legends Ball — Annual ITHF gala during US Open (10th edition) | Sep 6, 2025, 7pm | Ziegfeld Ballroom, 141 W 54th St NY 10019"}, {"id": 398, "org": "International Tennis Hall of Fame", "name": "B. Carnevale", "email": "bcarnevale@tennisfame.com", "email2": "nkowalsick@tennisfame.com", "site": "tennisfame.com", "note": "The Legends Ball — Annual ITHF gala during US Open | Sep 6, 2025"}, {"id": 399, "org": "Public Serv-ce", "name": "Press / RSVP", "email": "press@publicserv-ce.com", "email2": "sales@publicserv-ce.com", "site": "publicserv-ce.com", "note": "Public Serv-ce SS26 'Street Tailorism' | Sep 14, 2025, 5pm | 101 Reade St, NYC 10013"}, {"id": 400, "org": "Public Serv-ce", "name": "Commercial / Sales", "email": "sales@publicserv-ce.com", "email2": "press@publicserv-ce.com", "site": "publicserv-ce.com", "note": "Public Serv-ce SS26 — commercial/sales contact | @publicserv_ce"}, {"id": 401, "org": "Fashion Bomb Daily", "name": "Events Team", "email": "events@fashionbombdaily.com", "email2": "", "site": "fashionbombdaily.com", "note": "The Bomb Fashion Show — NYFW show/sponsorship inquiries | fashionbombdaily.com"}, {"id": 402, "org": "Durkin Entertainment", "name": "Debbie (EcoLuxe)", "email": "debbie@durkinentertainment.com", "email2": "", "site": "durkinentertainment.com", "note": "EcoLuxe Lounge — Endless Summer Festival (Emmys season) | Sep 13, 2025, 11:30am–5pm | Beverly Hills CA 90210"}, {"id": 403, "org": "True Blue PR", "name": "RSVP / Press", "email": "hello@truebluepr.com", "email2": "", "site": "truebluepr.com", "note": "Bibiré SS26 Spring/Summer Preview | Sep 12, 2025, 7pm | Brooklyn Chophouse, 253 W 47th St NYC"}, {"id": 404, "org": "Center Theatre Group", "name": "Gil Diaz (Music Ctr)", "email": "gdiaz@musiccenter.org", "email2": "ctgmedia@ctgla.org", "site": "musiccenter.org", "note": "Kim's Convenience; Beverly Hills play — Music Center co-presenter"}, {"id": 405, "org": "Interscope Capitol", "name": "Lisa DiAngelo", "email": "lisa.diangelo@umusic.com", "email2": "nicole.crystal@umusic.com", "site": "umusic.com", "note": "Disclosure Spring 2026 North America Tour — Santa Barbara Bowl kickoff"}, {"id": 406, "org": "Interscope Capitol", "name": "Nicole Crystal", "email": "nicole.crystal@umusic.com", "email2": "lisa.diangelo@umusic.com", "site": "umusic.com", "note": "Disclosure Tour — secondary contact"}, {"id": 407, "org": "Blue Note LA", "name": "Contact", "email": "info@bluenotejazz.com", "email2": "", "site": "bluenotejazz.com", "note": "Robert Glasper Residency — 6374 Sunset Blvd, LA"}, {"id": 408, "org": "Amoeba Music", "name": "Press", "email": "contact@amoeba.com", "email2": "", "site": "amoeba.com", "note": "Arlo Parks Album Listening Party — 6200 Hollywood Blvd, Hollywood"}, {"id": 409, "org": "Hollywood Beauty Awards", "name": "Info", "email": "info@hollywoodbeautyawards.com", "email2": "", "site": "hollywoodbeautyawards.com", "note": "Hollywood Beauty Awards — Taglyan Center, 1201 N. Vine St, Hollywood"}, {"id": 410, "org": "Coachella", "name": "Press", "email": "press@coachella.com", "email2": "", "site": "coachella.com", "note": "Coachella Valley Music & Arts Festival 2026 — April 10-12/17-19"}];

const EVENTS_DATA = [{"month": "January", "date": "Jan 1", "title": "New Year's Day", "category": "Holiday", "endDate": "", "note": "Global public holiday", "source": "Cision"}, {"month": "January", "date": "Jan 2", "title": "Science Fiction Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 3", "title": "Mahayana", "category": "Cultural", "endDate": "", "note": "Buddhist holiday", "source": "Cision"}, {"month": "January", "date": "Jan 6", "title": "Consumer Electronics Show (CES)", "category": "Tech", "endDate": "Jan 9", "note": "Las Vegas — major tech launch platform", "source": "Cision"}, {"month": "January", "date": "Jan 7", "title": "Orthodox Christmas Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 11", "title": "Golden Globes", "category": "Entertainment", "endDate": "", "note": "Beverly Hills — TV/Film awards season opener", "source": "Cision"}, {"month": "January", "date": "Jan 12", "title": "Australian Open Tennis", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 13", "title": "Creator Economy Live West", "category": "Media/PR", "endDate": "Feb 1", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 14", "title": "Orthodox New Year", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 17", "title": "International Mentoring Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 19", "title": "Martin Luther King Jr. Day", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "January", "date": "Jan 19", "title": "World Economic Forum", "category": "Media/PR", "endDate": "Jan 23", "note": "Davos, Switzerland", "source": "Cision"}, {"month": "January", "date": "Jan 21", "title": "Int'l Media Marketplace North America", "category": "Media/PR", "endDate": "Jan 22", "note": "", "source": "Cision / Media Contacts"}, {"month": "January", "date": "Jan 22", "title": "Sundance Film Festival", "category": "Film", "endDate": "Feb 1", "note": "Park City, Utah", "source": "Cision"}, {"month": "January", "date": "Jan 23", "title": "Winter X Games", "category": "Sports", "endDate": "Jan 25", "note": "Aspen, Colorado", "source": "Cision"}, {"month": "January", "date": "Jan 24", "title": "International Education Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 24", "title": "New York Travel Show", "category": "Media/PR", "endDate": "Jan 25", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 27", "title": "Holocaust Remembrance Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 27", "title": "National Geographic Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 28", "title": "Data Privacy Day", "category": "Tech", "endDate": "", "note": "", "source": "Cision"}, {"month": "January", "date": "Jan 30", "title": "MusiCares Person of the Year", "category": "Music", "endDate": "", "note": "Mariah Carey — Grammy Week LA", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "UMG Brunch", "category": "Music", "endDate": "", "note": "Nya Studios WEST, 1520 Wilcox Ave, 10am–3pm", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "YouTube PAMOJA", "category": "Music", "endDate": "", "note": "Los Angeles, 1–6pm — Afrobeats/African music", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "Recording Academy Golden Hour", "category": "Music", "endDate": "", "note": "Rolling Greens on Mateo, 1–4pm", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "Recording Academy Academy Proud", "category": "Music", "endDate": "", "note": "Rolling Greens on Mateo, 7–10pm", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "Clive Davis Pre-Grammy Gala", "category": "Music", "endDate": "", "note": "The Beverly Hilton, 6–11pm", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "Pitchfork x Best New Music Party", "category": "Music", "endDate": "", "note": "El Cid, 4212 W. Sunset Blvd, 9pm", "source": "Media Contacts"}, {"month": "January", "date": "Jan 31", "title": "UnitedMasters Celebration of Independence", "category": "Music", "endDate": "", "note": "Hollywood Palladium, 9pm", "source": "Media Contacts"}, {"month": "February", "date": "Feb 1", "title": "68th Annual Grammy Awards", "category": "Music", "endDate": "", "note": "Crypto Arena, Los Angeles", "source": "Media Contacts"}, {"month": "February", "date": "Feb 1", "title": "UMG Grammy Afterparty", "category": "Music", "endDate": "", "note": "Grammy Week — LA", "source": "Media Contacts"}, {"month": "February", "date": "Feb 2", "title": "Groundhog Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 4", "title": "World Cancer Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 6", "title": "AI Action Summit", "category": "Tech", "endDate": "Feb 11", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 6", "title": "Winter Olympic Games", "category": "Sports", "endDate": "Feb 22", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 7", "title": "78th DGA Awards", "category": "Film", "endDate": "", "note": "Awards season", "source": "Media Contacts"}, {"month": "February", "date": "Feb 7", "title": "Chicago Auto Show", "category": "Cultural", "endDate": "Feb 16", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 8", "title": "Super Bowl LX", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 9", "title": "34th Pan African Film & Arts Festival", "category": "Film", "endDate": "Feb 16", "note": "PAFF — Los Angeles", "source": "Media Contacts"}, {"month": "February", "date": "Feb 10", "title": "Safer Internet Day", "category": "Tech", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 12", "title": "Berlin Film Festival", "category": "Film", "endDate": "Feb 22", "note": "Berlinale", "source": "Cision"}, {"month": "February", "date": "Feb 12", "title": "28th Costume Designers Guild Awards", "category": "Entertainment", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "February", "date": "Feb 12", "title": "ASCAP Experience", "category": "Music", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "February", "date": "Feb 12", "title": "WGA Beyond Words", "category": "Film", "endDate": "", "note": "WGA Foundation event", "source": "Media Contacts"}, {"month": "February", "date": "Feb 12", "title": "New York Fashion Week", "category": "Fashion", "endDate": "Feb 17", "note": "NYFW — major US fashion event", "source": "Cision"}, {"month": "February", "date": "Feb 13", "title": "World Radio Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 13", "title": "Munich Security Conference", "category": "Media/PR", "endDate": "Feb 15", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 14", "title": "Valentine's Day", "category": "Holiday", "endDate": "", "note": "Major retail/brand activation moment", "source": "Cision"}, {"month": "February", "date": "Feb 15", "title": "41st Film Independent Spirit Awards", "category": "Film", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "February", "date": "Feb 15", "title": "NBA All-Star Game", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 16", "title": "Presidents' Day", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "February", "date": "Feb 17", "title": "Mardi Gras / Shrove Tuesday", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 17", "title": "Chinese New Year", "category": "Holiday", "endDate": "", "note": "Year of the Snake", "source": "Cision"}, {"month": "February", "date": "Feb 17", "title": "Ramadan begins", "category": "Holiday", "endDate": "Mar 18", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 18", "title": "Slamdance Film Festival", "category": "Film", "endDate": "Feb 25", "note": "", "source": "Media Contacts"}, {"month": "February", "date": "Feb 19", "title": "London Fashion Week", "category": "Fashion", "endDate": "Feb 23", "note": "LFW — major UK fashion event", "source": "Cision"}, {"month": "February", "date": "Feb 22", "title": "BAFTA Film Awards", "category": "Film", "endDate": "", "note": "London", "source": "Cision"}, {"month": "February", "date": "Feb 24", "title": "Marketing & Communications Summit", "category": "Media/PR", "endDate": "Feb 26", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 24", "title": "Milan Fashion Week", "category": "Fashion", "endDate": "Mar 2", "note": "", "source": "Cision"}, {"month": "February", "date": "Feb 28", "title": "57th NAACP Image Awards", "category": "Entertainment", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "February", "date": "Feb 28", "title": "37th Producers Guild Awards", "category": "Film", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "March", "date": "Mar 1", "title": "32nd SAG Awards", "category": "Entertainment", "endDate": "", "note": "On Netflix", "source": "Media Contacts"}, {"month": "March", "date": "Mar 1", "title": "Tokyo Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 2", "title": "Paris Fashion Week", "category": "Fashion", "endDate": "Mar 10", "note": "PFW — major global fashion event", "source": "Cision"}, {"month": "March", "date": "Mar 2", "title": "Mobile World Congress", "category": "Tech", "endDate": "Mar 5", "note": "Barcelona", "source": "Cision"}, {"month": "March", "date": "Mar 3", "title": "World Wildlife Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 3", "title": "Holi — Hindu Festival of Color", "category": "Holiday", "endDate": "Mar 4", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 5", "title": "37th GLAAD Media Awards", "category": "Entertainment", "endDate": "", "note": "", "source": "Media Contacts"}, {"month": "March", "date": "Mar 6", "title": "Winter Paralympics", "category": "Sports", "endDate": "Mar 15", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 8", "title": "International Women's Day", "category": "Awareness", "endDate": "", "note": "Global — major brand activation moment", "source": "Cision"}, {"month": "March", "date": "Mar 8", "title": "40th ASC Awards", "category": "Film", "endDate": "", "note": "American Society of Cinematographers", "source": "Media Contacts"}, {"month": "March", "date": "Mar 9", "title": "Ragan Social Media Conference", "category": "Media/PR", "endDate": "Mar 11", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 9", "title": "Int'l Media Marketplace UK", "category": "Media/PR", "endDate": "Mar 10", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 12", "title": "SXSW", "category": "Tech", "endDate": "Mar 18", "note": "Austin, TX — music, film, tech convergence", "source": "Cision"}, {"month": "March", "date": "Mar 15", "title": "Academy Awards / Oscars", "category": "Film", "endDate": "", "note": "98th Oscars — Dolby Theatre, Hollywood", "source": "Cision / Media Contacts"}, {"month": "March", "date": "Mar 15", "title": "Elton John AIDS Foundation Oscar Party", "category": "Entertainment", "endDate": "", "note": "Oscar viewing party", "source": "Media Contacts"}, {"month": "March", "date": "Mar 17", "title": "St. Patrick's Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 17", "title": "NCAA Finals / March Madness begins", "category": "Sports", "endDate": "Apr 6", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 17", "title": "NCAA Finals/March Madness begins", "category": "Sports", "endDate": "Apr 6", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 20", "title": "Spring Equinox", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 28", "title": "Earth Hour", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "March", "date": "Mar 31", "title": "Int'l Transgender Day of Visibility", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 1", "title": "April Fool's Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 1", "title": "Passover begins", "category": "Holiday", "endDate": "Apr 9", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 2", "title": "World Autism Awareness Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 2", "title": "Holy Thursday", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 3", "title": "Good Friday", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 5", "title": "Easter Sunday", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 7", "title": "World Health Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 9", "title": "Masters Tournament", "category": "Sports", "endDate": "Apr 12", "note": "Augusta, Georgia", "source": "Cision"}, {"month": "April", "date": "Apr 10", "title": "Coachella", "category": "Music", "endDate": "Apr 19", "note": "Indio, CA — major artist/brand platform", "source": "Cision"}, {"month": "April", "date": "Apr 12", "title": "Paris Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 14", "title": "Social Media Week", "category": "Media/PR", "endDate": "Apr 16", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 15", "title": "Tax Day (U.S.)", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 15", "title": "World Art Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 19", "title": "NBA Playoffs begin", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 20", "title": "Boston Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 21", "title": "Int'l Creativity & Innovation Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 22", "title": "Earth Day", "category": "Awareness", "endDate": "", "note": "Global — sustainability campaigns", "source": "Cision"}, {"month": "April", "date": "Apr 26", "title": "London Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 27", "title": "POSSIBLE Conference", "category": "Media/PR", "endDate": "Apr 29", "note": "", "source": "Cision"}, {"month": "April", "date": "Apr 28", "title": "Social Media Marketing World", "category": "Media/PR", "endDate": "Apr 30", "note": "", "source": "Cision"}, {"month": "May", "date": "May 2", "title": "Kentucky Derby", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "May", "date": "May 3", "title": "World Press Freedom Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "May", "date": "May 4", "title": "Met Gala", "category": "Fashion", "endDate": "", "note": "Metropolitan Museum of Art, NYC — top fashion event", "source": "Cision"}, {"month": "May", "date": "May 4", "title": "Star Wars Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "May", "date": "May 5", "title": "Cinco de Mayo", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "May", "date": "May 9", "title": "Europe Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "May", "date": "May 10", "title": "Mother's Day (U.S.)", "category": "Holiday", "endDate": "", "note": "Major retail/brand moment", "source": "Cision"}, {"month": "May", "date": "May 11", "title": "PGA Championship", "category": "Sports", "endDate": "May 17", "note": "", "source": "Cision"}, {"month": "May", "date": "May 12", "title": "Cannes Film Festival", "category": "Film", "endDate": "May 23", "note": "Cannes, France", "source": "Cision"}, {"month": "May", "date": "May 14", "title": "PR360 Conference", "category": "Media/PR", "endDate": "May 15", "note": "", "source": "Cision"}, {"month": "May", "date": "May 18", "title": "French Open Tennis", "category": "Sports", "endDate": "Jun 7", "note": "Roland Garros, Paris", "source": "Cision"}, {"month": "May", "date": "May 25", "title": "Memorial Day", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "May", "date": "May 25", "title": "Africa Day", "category": "Cultural", "endDate": "", "note": "Relevant — Afrobeats/African culture content", "source": "Cision"}, {"month": "May", "date": "May 30", "title": "UEFA Champions League Final", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 1", "title": "Pride Month begins", "category": "Awareness", "endDate": "Jun 30", "note": "LGBTQ+ — major brand activation month", "source": "Cision"}, {"month": "June", "date": "Jun 3", "title": "PR Daily Conference", "category": "Media/PR", "endDate": "Jun 5", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 5", "title": "F1 Monaco Grand Prix", "category": "Sports", "endDate": "Jun 7", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 5", "title": "World Environment Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 8", "title": "World Oceans Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 11", "title": "FIFA World Cup begins", "category": "Sports", "endDate": "Jul 19", "note": "Major global sports event", "source": "Cision"}, {"month": "June", "date": "Jun 14", "title": "IABC World Conference", "category": "Media/PR", "endDate": "Jun 16", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 19", "title": "Juneteenth", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "June", "date": "Jun 21", "title": "Father's Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 21", "title": "Summer Solstice", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "June", "date": "Jun 22", "title": "Cannes Lions", "category": "Media/PR", "endDate": "Jun 26", "note": "Cannes, France — major creative/advertising festival", "source": "Cision"}, {"month": "June", "date": "Jun 29", "title": "Wimbledon Tennis", "category": "Sports", "endDate": "Jul 12", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 1", "title": "Canada Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 3", "title": "F1 British Grand Prix", "category": "Sports", "endDate": "Jul 5", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 4", "title": "U.S. Independence Day", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "July", "date": "Jul 4", "title": "Tour de France begins", "category": "Sports", "endDate": "Jul 26", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 14", "title": "Bastille Day", "category": "Holiday", "endDate": "", "note": "France", "source": "Cision"}, {"month": "July", "date": "Jul 14", "title": "2026 MLB All-Star Game", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 14", "title": "Int'l Non-Binary People's Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 16", "title": "World PR Day", "category": "Media/PR", "endDate": "", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 18", "title": "Nelson Mandela Day", "category": "Cultural", "endDate": "", "note": "Relevant — South Africa / Africa content", "source": "Cision"}, {"month": "July", "date": "Jul 23", "title": "Commonwealth Games", "category": "Sports", "endDate": "Aug 2", "note": "", "source": "Cision"}, {"month": "July", "date": "Jul 30", "title": "International Day of Friendship", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "August", "date": "Aug 1", "title": "World Wide Web Day", "category": "Tech", "endDate": "", "note": "", "source": "Cision"}, {"month": "August", "date": "Aug 7", "title": "International Beer Day", "category": "Cultural", "endDate": "", "note": "Bacardi / Sovereign Brands activation opp", "source": "Cision"}, {"month": "August", "date": "Aug 12", "title": "International Youth Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "August", "date": "Aug 19", "title": "World Humanitarian Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "August", "date": "Aug 25", "title": "Mawlid al-Nabi", "category": "Holiday", "endDate": "Aug 26", "note": "", "source": "Cision"}, {"month": "August", "date": "Aug 29", "title": "American Apparel With Love Cocktail", "category": "Fashion", "endDate": "", "note": "NYFW SS25 lead-up", "source": "NYFW Contacts"}, {"month": "August", "date": "Aug 30", "title": "Burning Man", "category": "Cultural", "endDate": "Sep 6", "note": "Black Rock City, Nevada", "source": "Cision"}, {"month": "August", "date": "Aug 31", "title": "U.S. Tennis Open begins", "category": "Sports", "endDate": "Sep 13", "note": "USTA Billie Jean King National Tennis Center", "source": "Cision"}, {"month": "September", "date": "Sep 4", "title": "Harper's Bazaar Icons Issue NYFW Kickoff", "category": "Fashion", "endDate": "", "note": "NYFW SS25", "source": "NYFW Contacts"}, {"month": "September", "date": "Sep 4", "title": "New York Fashion Week SS25 begins", "category": "Fashion", "endDate": "Sep 11", "note": "Major global fashion event", "source": "NYFW Contacts / Cision"}, {"month": "September", "date": "Sep 4", "title": "Daily Front Row NYFW Kickoff", "category": "Fashion", "endDate": "", "note": "with Ana Sky", "source": "NYFW Contacts"}, {"month": "September", "date": "Sep 5", "title": "Billboard R&B Hip-Hop Power Players Dinner", "category": "Music", "endDate": "", "note": "", "source": "NYFW Contacts"}, {"month": "September", "date": "Sep 5", "title": "Ralph Lauren Runway Show", "category": "Fashion", "endDate": "", "note": "NYFW SS25", "source": "NYFW Contacts"}, {"month": "September", "date": "Sep 6", "title": "Fashion Media Awards", "category": "Fashion", "endDate": "", "note": "Daily Front Row", "source": "NYFW Contacts"}, {"month": "September", "date": "Sep 7", "title": "Labor Day (U.S.)", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "September", "date": "Sep 10", "title": "World Suicide Prevention Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 10", "title": "International Makeup Day", "category": "Fashion", "endDate": "", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 11", "title": "Rosh Hashanah", "category": "Holiday", "endDate": "Sep 13", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 15", "title": "Hispanic Heritage Month begins", "category": "Awareness", "endDate": "Oct 15", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 16", "title": "INBOUND Conference", "category": "Media/PR", "endDate": "Sep 18", "note": "HubSpot conference", "source": "Cision"}, {"month": "September", "date": "Sep 17", "title": "London Fashion Week", "category": "Fashion", "endDate": "Sep 21", "note": "LFW — major UK fashion event", "source": "Cision"}, {"month": "September", "date": "Sep 20", "title": "Yom Kippur", "category": "Holiday", "endDate": "Sep 21", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 21", "title": "Int'l Day of Peace", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 23", "title": "Autumn Equinox", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 25", "title": "Sukkot begins", "category": "Holiday", "endDate": "Oct 2", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 27", "title": "Berlin Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "September", "date": "Sep 30", "title": "International Podcast Day", "category": "Media/PR", "endDate": "", "note": "Relevant for DR content strategy", "source": "Cision"}, {"month": "October", "date": "Oct 1", "title": "International Conference on Comms & Media Studies", "category": "Media/PR", "endDate": "Oct 2", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 1", "title": "International Music Day", "category": "Music", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 4", "title": "World Animal Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 5", "title": "World Teachers' Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 10", "title": "World Mental Health Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 11", "title": "National Coming Out Day (U.S.)", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 11", "title": "Chicago Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 12", "title": "Indigenous Peoples' Day", "category": "Holiday", "endDate": "", "note": "U.S.", "source": "Cision"}, {"month": "October", "date": "Oct 16", "title": "World Food Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 22", "title": "Global PR Summit Middle East", "category": "Media/PR", "endDate": "Oct 23", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 24", "title": "United Nations Day", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "October", "date": "Oct 31", "title": "Halloween", "category": "Holiday", "endDate": "", "note": "Major brand/retail moment", "source": "Cision"}, {"month": "November", "date": "Nov 1", "title": "New York Marathon", "category": "Sports", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 1", "title": "All Saints' Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 8", "title": "Diwali", "category": "Holiday", "endDate": "Nov 12", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 11", "title": "Veterans Day", "category": "Holiday", "endDate": "", "note": "U.S. federal holiday", "source": "Cision"}, {"month": "November", "date": "Nov 13", "title": "World Kindness Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 14", "title": "World Diabetes Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 15", "title": "World Public Relations Forum", "category": "Media/PR", "endDate": "Nov 21", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 21", "title": "World Television Day", "category": "Entertainment", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 26", "title": "Thanksgiving", "category": "Holiday", "endDate": "", "note": "U.S. — major retail/brand activation", "source": "Cision"}, {"month": "November", "date": "Nov 27", "title": "Black Friday", "category": "Cultural", "endDate": "", "note": "Major retail moment", "source": "Cision"}, {"month": "November", "date": "Nov 28", "title": "Small Business Saturday", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "November", "date": "Nov 30", "title": "Cyber Monday", "category": "Cultural", "endDate": "", "note": "E-commerce peak day", "source": "Cision"}, {"month": "December", "date": "Dec 1", "title": "World AIDS Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 1", "title": "Giving Tuesday", "category": "Cultural", "endDate": "", "note": "Global generosity movement", "source": "Cision"}, {"month": "December", "date": "Dec 4", "title": "Hanukkah begins", "category": "Holiday", "endDate": "Dec 12", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 5", "title": "International Volunteer Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 10", "title": "Human Rights Day", "category": "Awareness", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 14", "title": "Green Monday", "category": "Cultural", "endDate": "", "note": "E-commerce", "source": "Cision"}, {"month": "December", "date": "Dec 19", "title": "Super Saturday", "category": "Cultural", "endDate": "", "note": "Retail", "source": "Cision"}, {"month": "December", "date": "Dec 21", "title": "Winter Solstice", "category": "Cultural", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 24", "title": "Christmas Eve", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 25", "title": "Christmas Day", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 26", "title": "Kwanzaa begins", "category": "Holiday", "endDate": "Jan 1", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 26", "title": "Boxing Day (UK)", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "December", "date": "Dec 31", "title": "New Year's Eve", "category": "Holiday", "endDate": "", "note": "", "source": "Cision"}, {"month": "Holiday", "date": "", "title": "Entertainment", "category": "", "endDate": "Fashion", "note": "", "source": "Media/PR"}, {"month": "Sports", "date": "", "title": "Cultural", "category": "", "endDate": "Music", "note": "", "source": "Film"}, {"month": "Tech", "date": "", "title": "Awareness", "category": "", "endDate": "", "note": "", "source": ""}, {"month": "March", "date": "Mar 17", "title": "The Boys Final Season Virtual Global Press Junket", "category": "Entertainment", "endDate": "", "note": "42West | TheBoys@42West.com | Virtual | Cast and showrunner global press day", "source": "NIA Database"}, {"month": "March", "date": "Mar 17", "title": "The Daughters of Dolomite Preview Screening", "category": "Film", "endDate": "", "note": "Jazzmyne PR | jazzmynepr@gmail.com | LOOK Dine-In Cinemas, 128 Artsakh Ave, Glendale | Foster Corder, Gary Anthony Sturgis", "source": "NIA Database"}, {"month": "March", "date": "Mar 17", "title": "Liza Minnelli Live in Conversation", "category": "Entertainment", "endDate": "", "note": "How To Academy | contact@howtoacademy.com | Million Dollar Theater, 307 S. Broadway, Downtown LA", "source": "NIA Database"}, {"month": "March", "date": "Mar 17", "title": "DINASTÍA Tour — Peso Pluma", "category": "Music", "endDate": "", "note": "Elina Adut (The Exclusive Agency) | eadut@eadut.com | Acrisure Arena, 75702 Varner Rd, Thousand Palms", "source": "NIA Database"}, {"month": "March", "date": "Mar 18", "title": "Femme 2026 Power Confab Retreat", "category": "Entertainment", "endDate": "", "note": "Reyna Trevino | reyna@trevinoenterprises.net | The Langham Huntington, 1401 S. Oak Knoll, Pasadena | Michelle Kwan, Soledad O'Brien, Suzette Quintanilla", "source": "NIA Database"}, {"month": "March", "date": "Mar 18", "title": "The English Patient in 35mm Screening", "category": "Film", "endDate": "", "note": "museumpress@oscars.org | Academy Museum David Geffen Theater | Hannah Minghella, Max Minghella", "source": "NIA Database"}, {"month": "March", "date": "Mar 19", "title": "Something Very Bad Is Going to Happen — Netflix Premiere", "category": "Film", "endDate": "", "note": "Paul Panday (APEX PR) | paul@theapex-pr.com | Egyptian Theatre, 6712 Hollywood Blvd | Camila Morrone, Adam DiMarco, Victoria Pedretti", "source": "NIA Database"}, {"month": "March", "date": "Mar 19", "title": "Champions for Children Gala", "category": "Entertainment", "endDate": "", "note": "Harvin Rogas (5B Events) | harvin@5bevents.com | Beverly Wilshire Hotel, 9500 Wilshire Blvd, Beverly Hills", "source": "NIA Database"}, {"month": "March", "date": "Mar 19", "title": "Ron Carter Birthday Celebration Concert", "category": "Music", "endDate": "", "note": "Sharp Associates PR | info@sharpassociatespr.com | Catalina Jazz Club, 6725 W. Sunset Blvd, Hollywood", "source": "NIA Database"}, {"month": "March", "date": "Mar 20", "title": "DINASTÍA Tour — Peso Pluma (Inglewood)", "category": "Music", "endDate": "", "note": "Elina Adut | eadut@eadut.com | Intuit Dome, 3930 W. Century Blvd, Inglewood", "source": "NIA Database"}, {"month": "March", "date": "Mar 20", "title": "Amber Mark — The Pretty Idea Tour", "category": "Music", "endDate": "", "note": "Rebecca Marlis (UMG) | rebecca.marlis@umusic.com | The Fonda Theatre, 6126 Hollywood Blvd", "source": "NIA Database"}, {"month": "March", "date": "Mar 20", "title": "Passing the Torch Awards (Black LGBTQ+)", "category": "Entertainment", "endDate": "", "note": "Christopher Sibley | christophersibley@thesibleyfirm.com | Hotel Indigo, 899 Francisco St, LA", "source": "NIA Database"}, {"month": "March", "date": "Mar 21", "title": "TruthAwards — Black LGBTQ+ Leadership Gala", "category": "Entertainment", "endDate": "", "note": "Christopher Sibley | christophersibley@thesibleyfirm.com | Beverly Hilton, 9876 Wilshire, Beverly Hills | Vivica A. Fox, Don Lemon, Jenifer Lewis", "source": "NIA Database"}, {"month": "March", "date": "Mar 21", "title": "The Sopranos Season 3 25th Anniversary Panel", "category": "Film", "endDate": "", "note": "American Cinematheque | publicity@americancinematheque.com | Egyptian Theatre, Hollywood | David Chase, Steve Buscemi, Terence Winter", "source": "NIA Database"}, {"month": "March", "date": "Mar 21", "title": "Gabriel Iglesias & Jo Koy: One Night Only", "category": "Entertainment", "endDate": "", "note": "Hollywood Park press | press@hollywoodparkca.com | SoFi Stadium, 1001 S. Stadium Dr, Inglewood", "source": "NIA Database"}, {"month": "March", "date": "Mar 21", "title": "VinylCon! Festival", "category": "Music", "endDate": "Mar 22", "note": "Leah Concialdi (Champagne House Media) | leah@champagnehousemedia.com | California Market Center, 110 E. 9th St, LA", "source": "NIA Database"}, {"month": "March", "date": "Mar 21", "title": "Song of the North — Pasadena Playhouse", "category": "Entertainment", "endDate": "", "note": "Peter Goldman (Davidson & Choy) | p.goldman@dcpublicity.com | 39 S. El Molino Ave, Pasadena | Hamid Rahmanian", "source": "NIA Database"}, {"month": "March", "date": "Mar 22", "title": "B2K Reunites — Boys 4 Life Tour", "category": "Music", "endDate": "", "note": "Tresa Sanders (TreMedia) | tresa@tre-media.net | Kia Forum, 3900 W. Manchester Blvd, Inglewood | B2K, Bow Wow, Jeremih", "source": "NIA Database"}, {"month": "March", "date": "Mar 22", "title": "Trees Lounge 30th Anniversary Screening", "category": "Film", "endDate": "", "note": "American Cinematheque | publicity@americancinematheque.com | Aero Theatre, 1328 Montana Ave, Santa Monica | Steve Buscemi", "source": "NIA Database"}, {"month": "March", "date": "Mar 23", "title": "Ain't Misbehavin' Opening Night", "category": "Entertainment", "endDate": "", "note": "Patty Onagan | patty@pattyonagan.com | Nate Holden PAC, 4718 W. Washington Blvd, LA | Ledisi, Chester Gregory", "source": "NIA Database"}, {"month": "March", "date": "Mar 24", "title": "Kim's Convenience — Ahmanson Theatre Opening", "category": "Entertainment", "endDate": "", "note": "CTG Media | ctgmedia@ctgla.org | Ahmanson Theatre, 135 N. Grand Ave, LA | Ins Choi — Netflix series inspiration", "source": "NIA Database"}, {"month": "March", "date": "Mar 27", "title": "Stand By Me Screening — Cast Event", "category": "Film", "endDate": "", "note": "Sheila (Right On! PR) | sheila@rightonpr.com | City National Grove of Anaheim | Corey Feldman, Jerry O'Connell, Wil Wheaton", "source": "NIA Database"}, {"month": "March", "date": "Mar 28", "title": "45th College Television Awards", "category": "Entertainment", "endDate": "", "note": "Jane (Break White Light) | jane@breakwhitelight.com | Saban Media Center, 5210 Lankershim, North Hollywood | Rhenzy Feliz", "source": "NIA Database"}, {"month": "March", "date": "Mar 30", "title": "Brandy Walk of Fame Star Ceremony", "category": "Entertainment", "endDate": "", "note": "Ana Martinez (Hollywood Chamber) | ana@hollywoodchamber.net | Hollywood Walk of Fame, 6201 Hollywood Blvd | Brandy, Issa Rae, Babyface", "source": "NIA Database"}, {"month": "March", "date": "Mar 31", "title": "Red Rocket Special Screening", "category": "Film", "endDate": "", "note": "LAFCA / Netflix | lafca@mprm.com | Egyptian Theatre, Hollywood | Sean Baker, Simon Rex — 35mm", "source": "NIA Database"}, {"month": "March", "date": "Mar 31", "title": "The Snappys Awards Show", "category": "Tech", "endDate": "", "note": "Snap Inc. | press@snap.com | Snap Inc., 2772 Donald Douglas Loop N, Santa Monica | DJ Khaled, Matt Friend", "source": "NIA Database"}, {"month": "April", "date": "Apr 1", "title": "Robert Glasper Residency — Blue Note LA", "category": "Music", "endDate": "", "note": "Blue Note LA | 6374 Sunset Blvd, LA | bluenotejazz.com/la/contact", "source": "NIA Database"}, {"month": "April", "date": "Apr 2", "title": "Arlo Parks Album Listening Party", "category": "Music", "endDate": "", "note": "Amoeba Music | 6200 Hollywood Blvd, Hollywood | Early album listen + sales event", "source": "NIA Database"}, {"month": "April", "date": "Apr 3", "title": "DAVE Concert — Album Support", "category": "Music", "endDate": "", "note": "Live Nation | livenation.com/pressrequests | Hollywood Palladium, 6215 Sunset Blvd, Hollywood", "source": "NIA Database"}, {"month": "April", "date": "Apr 3", "title": "The Last Five Years Concert Staging", "category": "Entertainment", "endDate": "", "note": "Anna Loynes (Scoop/Solters) | aloynes@solters.com | Hollywood Bowl | Ben Platt, Rachel Zegler", "source": "NIA Database"}, {"month": "April", "date": "Apr 4", "title": "PaleyFest — Pluribus Finale Screening", "category": "Entertainment", "endDate": "", "note": "Teresa Brady (Paley Center) | tbrady@paleycenter.org | Dolby Theatre, 6801 Hollywood Blvd", "source": "NIA Database"}, {"month": "April", "date": "Apr 4", "title": "English — Pulitzer Play Opening (The Wallis)", "category": "Entertainment", "endDate": "", "note": "Victoria Westbrook (DC Publicity) | v.westbrook@dcpublicity.com | The Wallis, 9390 N. Santa Monica Blvd, BH | Sanaz Toossi", "source": "NIA Database"}, {"month": "April", "date": "Apr 4", "title": "LANY — Soft World Tour", "category": "Music", "endDate": "", "note": "Kaeleah Isaac (The Oriel) | kaeleah@theoriel.co | Intuit Dome, 3930 W. Century Blvd, Inglewood", "source": "NIA Database"}, {"month": "April", "date": "Apr 6", "title": "PaleyFest — Charlie's Angels 50th Anniversary", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre | Kate Jackson, Jaclyn Smith, Cheryl Ladd", "source": "NIA Database"}, {"month": "April", "date": "Apr 6", "title": "LEGENDS Comedy Show", "category": "Entertainment", "endDate": "", "note": "Hollywood Improv | hollywood@improv.com | 8162 Melrose Ave, Hollywood | Jay Leno, Damon Wayans, Larry Wilmore", "source": "NIA Database"}, {"month": "April", "date": "Apr 7", "title": "PaleyFest — Shrinking Finale", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre | Bill Lawrence, Brett Goldstein, Jason Segel, Harrison Ford", "source": "NIA Database"}, {"month": "April", "date": "Apr 7", "title": "Bruce Springsteen & E Street Band", "category": "Music", "endDate": "", "note": "Anna Loynes (Solters) | aloynes@solters.com | Kia Forum, 3900 W. Manchester Blvd, Inglewood", "source": "NIA Database"}, {"month": "April", "date": "Apr 7", "title": "Disclosure — Spring 2026 North America Tour", "category": "Music", "endDate": "", "note": "Lisa DiAngelo (Interscope/Capitol) | Lisa.DiAngelo@umusic.com | Santa Barbara Bowl, kickoff", "source": "NIA Database"}, {"month": "April", "date": "Apr 8", "title": "BEEF S2 World Premiere", "category": "Film", "endDate": "", "note": "Julia Rossen (APEX PR) | julia@theapex-pr.com | Egyptian Theatre, Hollywood | Oscar Isaac, Carey Mulligan, Charles Melton", "source": "NIA Database"}, {"month": "April", "date": "Apr 8", "title": "Trail Blazers Ball — Environmental Leadership Gala", "category": "Entertainment", "endDate": "", "note": "Jennifer Price (The Lippin Group) | jprice@lippingroup.com | Skirball Cultural Center | Nancy Pelosi, Morgan Freeman, Ted Turner", "source": "NIA Database"}, {"month": "April", "date": "Apr 8", "title": "PaleyFest — Nobody Wants This", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre | Kristen Bell, Adam Brody, Erin Foster", "source": "NIA Database"}, {"month": "April", "date": "Apr 9", "title": "Colleagues Spring Luncheon & Oscar de la Renta Fashion Show", "category": "Fashion", "endDate": "", "note": "Ann Gurrola (Marleah Leslie) | ann@marleahleslie.com | Beverly Wilshire 4 Seasons | Luc Robitaille, Kate Flannery", "source": "NIA Database"}, {"month": "April", "date": "Apr 9", "title": "Global Gaming League Championship", "category": "Entertainment", "endDate": "", "note": "Owen (Thought Gang Media) | owen@thoughtgangmedia.com | WePlay Studios, 235 Florence Ave, Inglewood | NE-YO, Howie Mandel, Kardinal Offishall", "source": "NIA Database"}, {"month": "April", "date": "Apr 10", "title": "Coachella Valley Music & Arts Festival (Weekend 1)", "category": "Music", "endDate": "Apr 12", "note": "press@coachella.com | Empire Polo Field, 81800 51st Ave, Indio | Justin Bieber, Sabrina Carpenter, Karol G", "source": "NIA Database"}, {"month": "April", "date": "Apr 10", "title": "Beverly Hills Theater — Kirk Douglas", "category": "Entertainment", "endDate": "", "note": "CTGmedia@ctgla.org | Kirk Douglas Theater, 9820 Washington Blvd, Culver City | Nathan Fillion, Dulé Hill, Lamorne Morris", "source": "NIA Database"}, {"month": "April", "date": "Apr 10", "title": "PaleyFest — Emily in Paris", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre, Hollywood", "source": "NIA Database"}, {"month": "April", "date": "Apr 11", "title": "Sonic Desert — Coachella Brand Experience", "category": "Entertainment", "endDate": "", "note": "Style Firm | hello@style-firm.com | Private Ranch, Thermal CA (RSVP only) | Lizzo, Charlie D'Amelio, Dominic Fike", "source": "NIA Database"}, {"month": "April", "date": "Apr 11", "title": "PaleyFest — Scrubs / Your Friends & Neighbors", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre", "source": "NIA Database"}, {"month": "April", "date": "Apr 11", "title": "We Them One's Comedy Tour", "category": "Entertainment", "endDate": "", "note": "BMN Entertainment | press@blitzmediaevents.com | Intuit Dome, Inglewood | Mike Epps, Tony Roberts", "source": "NIA Database"}, {"month": "April", "date": "Apr 12", "title": "PaleyFest Finale — The Pitt", "category": "Entertainment", "endDate": "", "note": "Teresa Brady | tbrady@paleycenter.org | Dolby Theatre | Noah Wyle, Katherine LaNasa, Shawn Hatosy", "source": "NIA Database"}, {"month": "April", "date": "Apr 12", "title": "Beverly Hills Film Festival", "category": "Film", "endDate": "Apr 19", "note": "info@beverlyhillsfilmfestival.com | TCL Chinese Theatre, 6925 Hollywood Blvd, Hollywood", "source": "NIA Database"}, {"month": "April", "date": "Apr 13", "title": "CinemaCon 2026", "category": "Film", "endDate": "Apr 16", "note": "cinemaconpress@cinemaunited.org | Caesars Palace, 3570 Las Vegas Blvd S, Las Vegas | Cinema industry convention", "source": "NIA Database"}, {"month": "April", "date": "Apr 14", "title": "D23: The Ultimate Disney Fan Event", "category": "Entertainment", "endDate": "", "note": "TWDC.pressinquiries@Disney.com | Anaheim Convention Center, 800 W. Katella Ave", "source": "NIA Database"}, {"month": "April", "date": "Apr 14", "title": "Fashion Los Angeles Awards", "category": "Fashion", "endDate": "", "note": "Andy Gelb / Julia Rossen (APEX PR) | andy@theapex-pr.com | Beverly Hills | Tiffany Haddish", "source": "NIA Database"}, {"month": "April", "date": "Apr 14", "title": "Music Sustainability Summit & Awards", "category": "Music", "endDate": "", "note": "Jennifer Gross (EMG PR) | jennifer@emgpr.com | Solotech Studios, 1017 N. Las Palmas Ave, LA | Music Sustainability Alliance", "source": "NIA Database"}, {"month": "April", "date": "Apr 17", "title": "EmpowHer Institute — Female Mentor Opportunity", "category": "Awareness", "endDate": "", "note": "sheila@empowher.org | Teen summit seeking female mentors | Apply via email", "source": "NIA Database"}, {"month": "April", "date": "Apr 17", "title": "Tony Awards PR Kickoff", "category": "Entertainment", "endDate": "", "note": "APEX PR | TonyAwardsPR@theapex-pr.com | Broadway League / American Theatre Wing | June 7 main event", "source": "NIA Database"}, {"month": "April", "date": "Apr 18", "title": "NAB Show 2026", "category": "Tech", "endDate": "Apr 22", "note": "mraymond@nab.org | Las Vegas Convention Center | Broadcast, media, entertainment technology", "source": "NIA Database"}, {"month": "April", "date": "Apr 18", "title": "AFI Life Achievement Award — Eddie Murphy", "category": "Film", "endDate": "", "note": "Shari Mesulam | shari@themesulamgroup.com | Hollywood | Annual AFI tribute", "source": "NIA Database"}, {"month": "April", "date": "Apr 19", "title": "Elton John — The Remixes (Record Store Day Release)", "category": "Music", "endDate": "", "note": "Meg McLean Corso (UMG) | meg.mcleancorso@umusic.com | Amokhtar@2pmsharp.com", "source": "NIA Database"}, {"month": "April", "date": "Apr 23", "title": "ReelAbilities Film Festival", "category": "Film", "endDate": "Apr 30", "note": "press@reelabilities.org | New York City | Disabilities-focused film festival", "source": "NIA Database"}, {"month": "April", "date": "Apr 25", "title": "MEHA Celebrity Invitational Golf Tournament", "category": "Sports", "endDate": "", "note": "prstarus2000@yahoo.com | Seeking celebrity golfers — talent opportunity", "source": "NIA Database"}, {"month": "April", "date": "Apr 28", "title": "Academy Scientific and Technical Awards", "category": "Film", "endDate": "", "note": "publicity@oscars.org | Academy Museum of Motion Pictures, Los Angeles", "source": "NIA Database"}, {"month": "May", "date": "May 25", "title": "American Music Awards 2026", "category": "Music", "endDate": "", "note": "APEX/Dick Clark/CBS/Paramount | AMAs@theapex-pr.com | Las Vegas", "source": "NIA Database"}, {"month": "May", "date": "May 26", "title": "Los Angeles Greek Film Festival", "category": "Film", "endDate": "May 31", "note": "Melinda Manos | melinda@manospr.com | Los Angeles", "source": "NIA Database"}, {"month": "June", "date": "Jun 3", "title": "Tribeca Film Festival", "category": "Film", "endDate": "Jun 14", "note": "festivalpress@tribecafilm.com | New York City", "source": "NIA Database"}, {"month": "June", "date": "Jun 7", "title": "Tony Awards 2026", "category": "Entertainment", "endDate": "", "note": "APEX PR | TonyAwardsPR@theapex-pr.com | Broadway League / American Theatre Wing", "source": "NIA Database"}, {"month": "June", "date": "Jun 17", "title": "Nantucket Film Festival", "category": "Film", "endDate": "Jun 22", "note": "Stephanie (Frank Publicity) | stephanie@frankpublicity.com | Nantucket", "source": "NIA Database"}, {"month": "September", "date": "Sep 14", "title": "Emmy Awards 2026", "category": "Entertainment", "endDate": "", "note": "Break White Light | stephanie@breakwhitelight.com | Television Academy | NBC broadcast", "source": "NIA Database"}, {"month": "October", "date": "Oct 21", "title": "AFI Fest 2026", "category": "Film", "endDate": "Oct 25", "note": "Shari Mesulam | shari@themesulamgroup.com | Hollywood", "source": "NIA Database"}];

const VENUES_DATA = [{"id": "01", "name": "Hollywood Bowl", "type": "Amphitheatre / Concert Venue", "address": "2301 N. Highland Avenue, Hollywood, CA 90068", "city": "Los Angeles, CA", "phone": "+1 (323) 850-2000", "site": "hollywoodbowl.com", "capacity": "17,500", "desc": "Iconic outdoor amphitheatre and home of the Los Angeles Philharmonic summer season. One of the most celebrated music venues in the world, hosting major concerts, festivals, and film nights.", "eventsHosted": "The Last Five Years Concert Staging (Apr 3, 2026)"}, {"id": "02", "name": "Intuit Dome", "type": "Arena", "address": "3930 W. Century Blvd., Inglewood, CA 90304", "city": "Inglewood, CA", "phone": "+1 (213) 742-7100", "site": "intuitdome.com", "capacity": "18,000", "desc": "State-of-the-art arena opened 2024, home of the LA Clippers. Purpose-built for entertainment with cutting-edge technology and immersive fan experiences. DR contacts: D. Rogers + G. Corrigan (Clippers).", "eventsHosted": "LANY Soft World Tour (Apr 4); DINASTÍA Tour; We Them One's Comedy Tour"}, {"id": "03", "name": "SoFi Stadium / Hollywood Park", "type": "Stadium / Entertainment Complex", "address": "1001 S. Stadium Drive, Inglewood, CA 90301", "city": "Inglewood, CA", "phone": "+1 (833) 463-7634", "site": "hollywoodparkca.com", "capacity": "70,000", "desc": "Home of the LA Rams and LA Chargers, SoFi Stadium is part of the Hollywood Park entertainment district. Hosts major concerts, comedy shows, and live events alongside NFL games.", "eventsHosted": "Gabriel Iglesias & Jo Koy: One Night Only; Monster Jam; We Them One's Comedy Tour"}, {"id": "04", "name": "Kia Forum", "type": "Arena", "address": "3900 W. Manchester Blvd., Inglewood, CA 90305", "city": "Inglewood, CA", "phone": "+1 (310) 330-7300", "site": "theforum.com", "capacity": "17,500", "desc": "Legendary arena in Inglewood, venue for major concerts and sporting events. Formerly known as The Forum (home of the Showtime Lakers). One of LA's premier indoor entertainment venues.", "eventsHosted": "B2K Reunites Boys 4 Life Tour (Mar 22); Bruce Springsteen & E Street Band (Apr 7)"}, {"id": "05", "name": "Hollywood Palladium", "type": "Concert Hall", "address": "6215 Sunset Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 962-7600", "site": "livenation.com", "capacity": "3,500", "desc": "Historic 1940s Hollywood ballroom and concert venue on Sunset Blvd. One of LA's most storied live music spaces, known for intimate mid-size shows.", "eventsHosted": "DAVE Concert (Apr 3, 2026)"}, {"id": "06", "name": "The Fonda Theatre", "type": "Concert Venue", "address": "6126 Hollywood Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 464-6269", "site": "fondatheatre.com", "capacity": "1,300", "desc": "Intimate Hollywood concert venue with a rich history. Known for its excellent acoustics and close-quarters standing room layout, popular for mid-level touring acts.", "eventsHosted": "Amber Mark — The Pretty Idea Tour (Mar 20, 2026)"}, {"id": "07", "name": "Catalina Jazz Club", "type": "Jazz Club / Restaurant", "address": "6725 W. Sunset Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 466-2210", "site": "catalinajazzclub.com", "capacity": "250", "desc": "Intimate jazz supper club on Sunset Blvd, one of LA's last dedicated jazz venues. Features world-class performers nightly with dinner service. DR PR contact via Sharp Associates PR.", "eventsHosted": "Ron Carter Birthday (Mar 19); Jane Monheit (Apr 3); Norwood Young (Apr 5); Cuban Jam Sessions (Apr 9)"}, {"id": "08", "name": "Largo at the Coronet", "type": "Intimate Performance Venue", "address": "366 N. La Cienega Blvd., Los Angeles, CA 90048", "city": "Los Angeles, CA", "phone": "+1 (310) 855-0350", "site": "largo-la.com", "capacity": "275", "desc": "Beloved Los Angeles performance space known for intimate comedy, music, and spoken word events. Frequented by industry insiders. Home to residencies by top comedians and musicians.", "eventsHosted": "Inara George Album Release Benefit (Mar 20); Sara Silverman and Friends (Mar 30); Marc Maron & Friends (Apr 7)"}, {"id": "09", "name": "Blue Note Los Angeles", "type": "Jazz Club", "address": "6374 Sunset Blvd., Los Angeles, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 469-2583", "site": "bluenotejazz.com/la", "capacity": "150", "desc": "LA outpost of the legendary New York jazz institution. Intimate venue on Sunset Strip for jazz residencies, live recordings, and premium performances.", "eventsHosted": "Robert Glasper Residency (Apr 1, 2026)"}, {"id": "10", "name": "Vibrato Grill Jazz", "type": "Jazz Club / Fine Dining", "address": "2930 N. Beverly Glen Circle, Bel Air, CA 90077", "city": "Bel Air, CA", "phone": "+1 (310) 474-9400", "site": "vibratogrilljazz.com", "capacity": "200", "desc": "Intimate Bel Air jazz club and fine dining restaurant founded by Herb Alpert. Upscale setting with top-tier jazz performers and an excellent food menu.", "eventsHosted": "Pete Escovedo featuring Juan & Peter Michael Escovedo (Apr 8, 2026)"}, {"id": "11", "name": "Hollywood Improv", "type": "Comedy Club", "address": "8162 Melrose Ave., Los Angeles, CA 90046", "city": "Los Angeles, CA", "phone": "+1 (323) 651-2583", "site": "improv.com/hollywood", "capacity": "400", "desc": "Original Improv comedy club on Melrose, a legendary institution in stand-up comedy. Launch pad for major comedians. Part of the Improv Comedy Clubs chain.", "eventsHosted": "LEGENDS Comedy Show — Jay Leno, Damon Wayans, Larry Wilmore (Apr 6, 2026)"}, {"id": "12", "name": "Egyptian Theatre", "type": "Historic Cinema / Screening Venue", "address": "6712 Hollywood Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 461-2020", "site": "americancinematheque.com", "capacity": "616", "desc": "One of Hollywood's most storied historic cinemas, built in 1922. Now operated by the American Cinematheque, it hosts premieres, special screenings, and retrospectives. Press via American Cinematheque.", "eventsHosted": "BEEF S2 World Premiere; Something Very Bad Is Going to Happen; Sopranos 25th; Red Rocket; Faces of Death"}, {"id": "13", "name": "Dolby Theatre", "type": "Entertainment Venue", "address": "6801 Hollywood Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 308-6300", "site": "dolbytheatre.com", "capacity": "3,332", "desc": "Home of the Academy Awards since 2002, and host of PaleyFest, major theatrical productions, and award ceremonies. One of the most recognisable entertainment venues in the world.", "eventsHosted": "PaleyFest 2026 (Pluribus, Charlie's Angels, Shrinking, Nobody Wants This, Emily in Paris, Scrubs, The Pitt)"}, {"id": "14", "name": "Academy Museum of Motion Pictures", "type": "Museum / Screening Venue", "address": "6067 Wilshire Blvd. at Fairfax Ave., Los Angeles, CA 90036", "city": "Los Angeles, CA", "phone": "+1 (323) 930-3000", "site": "academymuseum.org", "capacity": "Varies (David Geffen Theater: 1,000)", "desc": "The world's premier museum dedicated to the art and science of movies. Features two screenings spaces — the David Geffen Theater and the Ted Mann Theater. Press via Academy Museum press team.", "eventsHosted": "The English Patient in 35mm; Inside JAWS; Follow That Bird; Welcome II the Terrordome; Academy Sci-Tech Awards"}, {"id": "15", "name": "Ahmanson Theatre / Center Theatre Group", "type": "Theatre", "address": "135 N. Grand Ave., Los Angeles, CA 90012", "city": "Los Angeles, CA", "phone": "+1 (213) 628-2772", "site": "centertheatregroup.org", "capacity": "2,100", "desc": "LA's premier large-scale theatre, part of the Music Center. Home to major Broadway productions and world premieres. CTG operates Ahmanson, Mark Taper Forum, and Kirk Douglas Theater.", "eventsHosted": "Kim's Convenience — inspired Netflix series (Mar 24, 2026)"}, {"id": "16", "name": "Kirk Douglas Theater", "type": "Theatre", "address": "9820 Washington Blvd., Culver City, CA 90232", "city": "Culver City, CA", "phone": "+1 (213) 628-2772", "site": "centertheatregroup.org", "capacity": "317", "desc": "Intimate 317-seat theatre in Culver City operated by Center Theatre Group. Known for world premieres and innovative productions. Part of the CTG family with Ahmanson and Mark Taper Forum.", "eventsHosted": "Beverly Hills play (Apr 10, 2026) — Nathan Fillion, Dulé Hill, Lamorne Morris"}, {"id": "17", "name": "REDCAT / Roy and Edna Disney/CalArts Theater", "type": "Experimental Theatre", "address": "631 West Second Street at Hope, Downtown Los Angeles, CA 90012", "city": "Los Angeles, CA", "phone": "+1 (213) 237-2800", "site": "redcat.org", "capacity": "250", "desc": "Innovative multi-disciplinary arts venue inside Walt Disney Concert Hall. Presents boundary-pushing theatre, dance, film, and visual art — operated by CalArts.", "eventsHosted": "Sad Boys in Harpy Land — Alex Tatarsky, West Coast premiere (Mar 19, 2026)"}, {"id": "18", "name": "Aero Theatre", "type": "Historic Cinema", "address": "1328 Montana Avenue, Santa Monica, CA 90403", "city": "Santa Monica, CA", "phone": "+1 (310) 260-1528", "site": "americancinematheque.com", "capacity": "265", "desc": "Charming 1940s neighbourhood cinema in Santa Monica, operated by the American Cinematheque. Known for curated repertory programming, Q&As, and retrospective screenings.", "eventsHosted": "Trees Lounge 30th Anniversary; YES/Policeman; Faces of Death Advance Screening"}, {"id": "19", "name": "Skirball Cultural Center", "type": "Cultural Centre / Event Venue", "address": "2701 N. Sepulveda Blvd., Los Angeles, CA 90049", "city": "Los Angeles, CA", "phone": "+1 (310) 440-4500", "site": "skirball.org", "capacity": "Varies (largest space: 500+)", "desc": "Major Jewish cultural institution and event venue in the Santa Monica Mountains. Hosts galas, exhibitions, performances, and community events in a stunning architectural setting.", "eventsHosted": "Trail Blazers Ball — Nancy Pelosi, Morgan Freeman, Ted Turner, Dolores Huerta (Apr 8, 2026)"}, {"id": "20", "name": "The Wallis Annenberg Center for the Performing Arts", "type": "Performing Arts Centre", "address": "9390 N. Santa Monica Blvd., Beverly Hills, CA 90210", "city": "Beverly Hills, CA", "phone": "+1 (310) 746-4000", "site": "thewallis.org", "capacity": "500", "desc": "Premier performing arts venue in Beverly Hills presenting theatre, dance, music, and film. A landmark cultural institution in the heart of Beverly Hills.", "eventsHosted": "English — Pulitzer Prize-winning play by Sanaz Toossi (Apr 4, 2026)"}, {"id": "21", "name": "Pasadena Playhouse", "type": "Theatre", "address": "39 S. El Molino Avenue, Pasadena, CA 91101", "city": "Pasadena, CA", "phone": "+1 (626) 356-7529", "site": "pasadenaplayhouse.org", "capacity": "686", "desc": "California State Theater, one of the country's oldest and most celebrated theatres. Presents world premieres and regional productions with strong casting.", "eventsHosted": "Song of the North — Hamid Rahmanian (Mar 21, 2026)"}, {"id": "22", "name": "Nate Holden Performing Arts Center", "type": "Theatre", "address": "4718 West Washington Boulevard, Los Angeles, CA 90016", "city": "Los Angeles, CA", "phone": "+1 (323) 964-9766", "site": "natehold.org", "capacity": "99", "desc": "Intimate Black-owned and community-anchored theatre on the Westside of LA. Known for productions celebrating African-American stories and talent.", "eventsHosted": "Ain't Misbehavin' — Ledisi, Chester Gregory (Mar 23, 2026)"}, {"id": "23", "name": "Petersen Automotive Museum", "type": "Museum / Event Venue", "address": "6060 Wilshire Blvd., Los Angeles, CA 90036", "city": "Los Angeles, CA", "phone": "+1 (323) 930-2277", "site": "petersen.org", "capacity": "Varies", "desc": "World-class automotive museum on the Miracle Mile with extraordinary event spaces. Hosts industry events, screenings, and celebrations with stunning car displays as backdrop.", "eventsHosted": "Petersen Breakfast Club Cruise-In — Jeff Dunham (Apr 12, 2026)"}, {"id": "24", "name": "Los Angeles State Historic Park", "type": "Public Park / Outdoor Venue", "address": "1245 N. Spring Street, Downtown Los Angeles, CA 90012", "city": "Los Angeles, CA", "phone": "+1 (213) 221-9944", "site": "parks.ca.gov", "capacity": "Up to 65,000 (open air)", "desc": "32-acre park on the LA River near Chinatown, used for large-scale outdoor festivals, concerts, and community events. Views of the Downtown skyline.", "eventsHosted": "Bob Baker Day festival — April 12, 2026"}, {"id": "25", "name": "WePlay Studios", "type": "eSports / Event Studios", "address": "235 Florence Avenue, Inglewood, CA 90301", "city": "Inglewood, CA", "phone": "", "site": "weplay.tv", "capacity": "2,000", "desc": "Purpose-built eSports and live event production studio near SoFi Stadium. Used for gaming championships, live broadcasts, and celebrity events.", "eventsHosted": "Global Gaming League Championship — NE-YO, Howie Mandel, Kardinal Offishall (Apr 9, 2026)"}, {"id": "26", "name": "Beverly Wilshire, A Four Seasons Hotel", "type": "Hotel / Event Venue", "address": "9500 Wilshire Blvd., Beverly Hills, CA 90212", "city": "Beverly Hills, CA", "phone": "+1 (310) 275-5200", "site": "fourseasons.com/beverlywilshire", "capacity": "Varies (Grand Ballroom: 1,000+)", "desc": "Iconic Beverly Hills luxury hotel and event venue. Host to major galas, luncheons, and awards events. The setting for Pretty Woman and countless Hollywood milestones.", "eventsHosted": "Colleagues Spring Luncheon & Oscar de la Renta Fashion Show (Apr 9); Champions for Children Gala"}, {"id": "27", "name": "Acrisure Arena", "type": "Arena", "address": "75702 Varner Road, Thousand Palms, CA 92276", "city": "Thousand Palms, CA", "phone": "+1 (442) 222-1000", "site": "acrisurearena.com", "capacity": "11,000", "desc": "Premier arena in the Coachella Valley, opened 2022. Home of the Firebirds hockey team, and the region's largest indoor concert venue — gateway for major touring acts to the desert market.", "eventsHosted": "DINASTÍA Tour — Peso Pluma, Tito Double P (Mar 17, 2026)"}, {"id": "28", "name": "Empire Polo Club / Coachella", "type": "Festival Grounds", "address": "81800 51st Avenue, Indio, CA 92201", "city": "Indio, CA", "phone": "", "site": "coachella.com", "capacity": "125,000/day", "desc": "Home of the Coachella Valley Music and Arts Festival, one of the world's most influential music and culture events. Annual April weekends draw global artists, brands, and media.", "eventsHosted": "Coachella 2026 — Weekend 1 (Apr 10-12); Weekend 2 (Apr 17-19). Justin Bieber, Sabrina Carpenter, Karol G, Anyma"}, {"id": "29", "name": "The Langham Huntington, Pasadena", "type": "Luxury Hotel / Event Venue", "address": "1401 S. Oak Knoll Avenue, Pasadena, CA 91106", "city": "Pasadena, CA", "phone": "+1 (626) 568-3900", "site": "langhamhotels.com/en/the-langham/pasadena", "capacity": "Varies", "desc": "Historic luxury resort hotel in Pasadena with grand event spaces and lush gardens. A go-to venue for high-profile retreats, luncheons, and galas.", "eventsHosted": "Femme 2026 Power Confab Retreat — Michelle Kwan, Soledad O'Brien (Mar 18, 2026)"}, {"id": "30", "name": "TCL Chinese Theatre", "type": "Historic Cinema / Event Venue", "address": "6925 Hollywood Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 461-3331", "site": "tclchinesetheatres.com", "capacity": "932", "desc": "One of the most recognisable buildings in the world. The TCL Chinese Theatre has been the site of Hollywood premieres since 1927. Famous for its celebrity handprints and footprints in the forecourt.", "eventsHosted": "Beverly Hills Film Festival — TCL Chinese Theatre (Apr 13-19, 2026)"}, {"id": "31", "name": "Beverly Hilton", "type": "Hotel / Event Venue", "address": "9876 Wilshire Blvd., Beverly Hills, CA 90210", "city": "Beverly Hills, CA", "phone": "+1 (310) 274-7777", "site": "beverlyhilton.com", "capacity": "Varies (International Ballroom: 1,500+)", "desc": "Iconic Beverly Hills hotel, home of the Golden Globes and numerous major industry events. One of the most storied event venues in Hollywood.", "eventsHosted": "TruthAwards — Black LGBTQ+ Leadership (Mar 21, 2026)"}, {"id": "32", "name": "Amoeba Music Hollywood", "type": "Record Store / Event Space", "address": "6200 Hollywood Blvd., Hollywood, CA 90028", "city": "Los Angeles, CA", "phone": "+1 (323) 245-6400", "site": "amoeba.com", "capacity": "500", "desc": "The world's largest independent record store. Hosts in-store performances, album listening parties, and signings — a beloved LA cultural institution for music fans and industry alike.", "eventsHosted": "Arlo Parks Album Listening Party (Apr 2, 2026)"}, {"id": "33", "name": "W Hotel Times Square", "type": "Hotel / Event Venue", "address": "1567 Broadway, New York, NY 10036", "city": "New York, NY", "phone": "+1 (212) 930-7400", "site": "marriott.com/en-us/hotels/nycwt", "capacity": "Varies", "desc": "Centrally located hotel in the heart of Times Square. Used for fashion week press events, brand activations, and media kickoff events. NYFW SS26 CLD PR Kickoff venue.", "eventsHosted": "CLD PR NYFW SS26 Kickoff Event — Fri Sep 12, 2025, 9am–4pm"}, {"id": "34", "name": "Spring Studios", "type": "Creative Studios / Event Venue", "address": "50 Varick St., 5th Floor, New York, NY 10013", "city": "New York, NY", "phone": "+1 (212) 965-1850", "site": "springstudios.com", "capacity": "Varies", "desc": "Major creative hub in Tribeca, home to NYFW shows, brand activations, and editorial shoots. One of NYC's most versatile multi-floor event and production spaces.", "eventsHosted": "Sergio Hudson SS26 Spring/Summer Runway Show — Fri Sep 12, 2025, 7pm"}, {"id": "35", "name": "The Frick Collection", "type": "Museum / Private Event Venue", "address": "1 East 70th Street, New York, NY 10021", "city": "New York, NY", "phone": "+1 (212) 288-0700", "site": "frick.org", "capacity": "Limited (private events)", "desc": "One of New York's greatest art museums, housed in the Gilded Age mansion of industrialist Henry Clay Frick. Hosts exclusive, invitation-only private events.", "eventsHosted": "Jessica McCormack x Zoë Kravitz celebration — Wed Sep 10, 2025, 7pm"}, {"id": "36", "name": "Brooklyn Chophouse", "type": "Restaurant / Private Dining", "address": "253 W. 47th Street, New York, NY 10036", "city": "New York, NY", "phone": "+1 (212) 944-4040", "site": "brooklynchophouse.com", "capacity": "Private dining available", "desc": "Upscale steakhouse and events space in Midtown Manhattan. Frequently used for fashion industry launch events, brand dinners, and media previews.", "eventsHosted": "Bibiré SS26 Spring/Summer Preview — Fri Sep 12, 2025, 7pm (True Blue PR)"}, {"id": "37", "name": "Sutton Tower", "type": "Residential Tower / Event Venue", "address": "430 East 58th Street, Penthouse 78, New York, NY 10022", "city": "New York, NY", "phone": "", "site": "suttontowernyc.com", "capacity": "Private events", "desc": "East Side's tallest waterfront residential tower with dramatic penthouse event spaces and panoramic views of the East River and Midtown skyline.", "eventsHosted": "Lanvin x GSH Contemporary AW25 debut collection preview — Wed Sep 10, 2025, 5–9pm"}, {"id": "38", "name": "WGACA Atelier", "type": "Vintage Fashion / Exhibition Space", "address": "113 Wooster Street, SoHo, New York, NY 10012", "city": "New York, NY", "phone": "+1 (212) 343-1100", "site": "wgacany.com", "capacity": "200", "desc": "What Goes Around Comes Around's flagship SoHo atelier for iconic vintage fashion. The space hosts exclusive archival installations and fashion events, including the Law Roach NYFW collaboration.", "eventsHosted": "WGACA x Law Roach — Exclusive Archival Fashion Installation, Thu Sep 11, 2025, 7–9pm"}, {"id": "39", "name": "The Glasshouses", "type": "Event Venue", "address": "545 West 25th Street, 21st Floor, New York, NY 10001", "city": "New York, NY", "phone": "+1 (212) 924-8888", "site": "theglasshouses.com", "capacity": "Varies (up to 600)", "desc": "Stunning glass-enclosed event venue in Chelsea with panoramic Hudson River views. One of NYC's premier rooftop and penthouse event spaces for fashion, media, and entertainment.", "eventsHosted": "WWD x FN x Beauty Inc Women in Power Annual Gala (4th edition) — Mon Sep 8, 2025"}, {"id": "40", "name": "50 Howard Street", "type": "Mixed-Use / Event Space", "address": "50 Howard Street, New York, NY 10013", "city": "New York, NY", "phone": "", "site": "purple-brand.com", "capacity": "Varies", "desc": "SoHo/Tribeca loft-style event space in Lower Manhattan. Versatile raw industrial space used for brand activations, fashion week events, and block parties.", "eventsHosted": "Purple Brand NYFW Block Party — Fri Sep 12, 2025, 5–9pm"}, {"id": "41", "name": "Chez Fifi", "type": "Restaurant / Private Events", "address": "140 East 74th Street, New York, NY 10021", "city": "New York, NY", "phone": "+1 (212) 879-4282", "site": "", "capacity": "Private dining", "desc": "Intimate upscale restaurant on the Upper East Side. Used by fashion houses and luxury brands for private cocktail events and brand dinners.", "eventsHosted": "Fendi Roma Spy Bag NYFW celebration hosted by Lauren Santo Domingo — Tue Sep 9, 2025, 7–9pm"}, {"id": "42", "name": "Ziegfeld Ballroom", "type": "Ballroom / Event Venue", "address": "141 W. 54th St., New York, NY 10019", "city": "New York, NY", "phone": "+1 (212) 455-0041", "site": "ziegfeldballroom.com", "capacity": "1,000", "desc": "Grand Midtown Manhattan ballroom used for galas, award ceremonies, and large-scale industry events. Features classic theatrical décor and a spacious main floor.", "eventsHosted": "The Legends Ball — International Tennis Hall of Fame annual gala during US Open (Sep 6, annual)"}, {"id": "43", "name": "101 Reade Street", "type": "Fashion Event Space / Studio", "address": "101 Reade Street, New York, NY 10013", "city": "New York, NY", "phone": "", "site": "publicserv-ce.com", "capacity": "Varies", "desc": "Tribeca event and showroom space used for designer runway presentations and collection previews. Located in Lower Manhattan's creative district.", "eventsHosted": "Public Serv-ce 'Street Tailorism' SS26 — Sun Sep 14, 2025, 5pm"}, {"id": "44", "name": "575 Madison Avenue", "type": "Office Tower / Showroom", "address": "575 Madison Avenue, 26th Floor, New York, NY 10022", "city": "New York, NY", "phone": "", "site": "", "capacity": "Showroom / presentation", "desc": "Midtown Manhattan office tower used for fashion showroom presentations and brand appointments during NYFW. Hikari no Yami SS26 presentation venue.", "eventsHosted": "Hikari no Yami SS26 Presentation — Fri Sep 12, 2025, 4:30–6:30pm. Under Armour footwear partnership."}, {"id": "45", "name": "Sohotel New York", "type": "Hotel / Event Venue", "address": "347 Broome Street, New York, NY 10013", "city": "New York, NY", "phone": "+1 (212) 226-1482", "site": "sohotelny.com", "capacity": "Varies", "desc": "Boutique hotel in the heart of SoHo, New York. Used for intimate industry events, gallery openings, and exhibition launches.", "eventsHosted": "NYFW: PASSÉ — Brad Walls solo US exhibition VIP opening, Thu Sep 11, 2025, 6–9pm"}, {"id": "46", "name": "Caesars Palace / CinemaCon", "type": "Hotel / Casino / Convention", "address": "3570 S. Las Vegas Blvd., Las Vegas, NV 89109", "city": "Las Vegas, NV", "phone": "+1 (702) 731-7110", "site": "caesarspalace.com", "capacity": "Varies (Colosseum: 4,300)", "desc": "Iconic Las Vegas resort and convention centre. Home of CinemaCon, the annual cinema industry convention. The Colosseum hosts major residencies and concerts.", "eventsHosted": "CinemaCon 2026 — April 13-16, 2026"}, {"id": "47", "name": "Venetian Theatre", "type": "Concert Theatre", "address": "3355 S. Las Vegas Blvd., Las Vegas, NV 89109", "city": "Las Vegas, NV", "phone": "+1 (702) 414-1000", "site": "venetianresort.com", "capacity": "1,815", "desc": "Intimate theatre at The Venetian Resort Las Vegas. Home to exclusive entertainment residencies and concert series.", "eventsHosted": "Boy George & Culture Club: Live in Las Vegas residency (Mar 18 ongoing)"}, {"id": "48", "name": "Agua Caliente Casino Resort Spa", "type": "Casino / Concert Venue", "address": "32-250 Bob Hope Drive, Rancho Mirage, CA 92270", "city": "Rancho Mirage, CA", "phone": "+1 (888) 999-1995", "site": "aguacalientecasinos.com", "capacity": "Varies", "desc": "Desert resort casino in Rancho Mirage with multiple entertainment venues. Hosts touring artists and residency performers in the Coachella Valley.", "eventsHosted": "Rick Springfield (Apr 4); Ron White (Apr 11, 2026) — Scoop Marketing / Solters"}];


/* ════════════════════════════════════════════════════════════════
   FUNCTIONS — Phase 2 build

   Functions help you create using a variety of data-driven, repeatable
   and reproducible processes, databases and models built for creative
   production work. Building blocks that ensure consistent creative
   output.

   Architecture:
     · FUNCTIONS_CATEGORIES — top-level categories (Intelligence is live;
       Agents and Models are scaffolded as SOON)
     · FUNCTIONS_INTELLIGENCE — the three Functions under Intelligence
       (Contacts, Events, Archetypes)
     · DBFunctionTutorial — first-use coachmark, persists dismissal in
       user.tutorialsSeen.functions
     · DBFunctionsBrowser — categories on the left, Functions on the right
     · DBContactsFunction — table / list / map views over 410 contacts
     · DBEventsFunction — calendar / list views over 275 events
     · Archetypes — reuses DBSkillsLibrary built in earlier turn

   Phase 3 will populate the Models category with five production-
   framework models (Content Production Guideline, Junket Brief, Budget,
   Schedule, Series Bible).
   ════════════════════════════════════════════════════════════════ */

const FUNCTIONS_CATEGORIES = [
  {
    id: 'intelligence',
    label: 'Intelligence',
    desc: 'Living databases the rest of Nia draws from',
    soon: false,
  },
  {
    id: 'models',
    label: 'Models',
    desc: 'Production frameworks turned into reusable templates',
    soon: false,                  // Phase 3 — live; gated by tier
    requiresTier: 'professional', // Foundation sees Pro pill on each card
  },
  {
    id: 'agents',
    label: 'Agents',
    desc: 'Long-running assistants that work on your behalf',
    soon: true,
  },
];

// Three live Functions under Intelligence
const FUNCTIONS_INTELLIGENCE = [
  {
    id: 'contacts',
    label: 'Contacts',
    desc: '410 media, PR, music, film, fashion contacts across 216 organizations',
    count: CONTACTS_DATA.length,
    countLabel: 'contacts',
    icon: 'users',
  },
  {
    id: 'events',
    label: 'Events',
    desc: '275 industry events, awards seasons, fashion weeks, and cultural moments in 2026',
    count: EVENTS_DATA.length,
    countLabel: 'events',
    icon: 'calendar',
  },
  {
    id: 'archetypes',
    label: 'Archetypes',
    desc: '282 creative production roles from the NRI Library — rates, tiers, descriptions',
    count: LIBRARY.length,
    countLabel: 'archetypes',
    icon: 'spark',
  },
];

/* ─── Models — FCC-faithful production framework templates ──────
   Five built-in templates derived from the canonical Function Creative
   Company TPL frameworks (TPL-01 through TPL-05). Each Model is an
   ordered sequence of typed sections.

   Section types:
     prose      — multi-line freeform paragraph
     list       — bulleted list (each row begins with —)
     fields     — labelled key/value table; section.fields = [{id,label,hint?}]
     grid       — repeating data table; section.columns = [{id,label,hint?}], section.targetRows
     checklist  — bulleted items with a checkbox state; section.items = string[] of suggested items
     repeating  — sub-schema repeated N times; section.sub = [{id,label,prompt,type,fields?}]
                  section.targetCount = suggested instance count

   When a user instantiates a Model, Claude is prompted with the schema
   and asked to return JSON with one key per section id. The shape of
   each value depends on the section's type:
     prose / list      → string
     fields            → object { fieldId: string, ... }
     grid              → array of objects [{ columnId: string, ... }]
     checklist         → array of objects [{ text: string, checked: boolean }]
     repeating         → array of objects, each shaped like a fields block

   Each Model also declares an optional `systemPrompt` that frames the
   AI's voice for the whole document.
   ────────────────────────────────────────────────────────────────── */
const MODELS = [
  {
    id: 'content-production',
    label: 'Content Production Guideline',
    desc: 'A framework for planning BTS, EPK, and promotional video shoots on episodic, film, and branded productions.',
    type: 'editorial',
    icon: 'file',
    fccCode: 'FCC / TPL-01',
    sections: [
      {
        id: 'project-summary',
        label: 'Project Summary',
        type: 'fields',
        prompt: 'Anchor every stakeholder in the same understanding of what is being made and why. Fill each field with project-specific information.',
        fields: [
          { id: 'projectTitle',       label: 'Project Title',       hint: 'The name of the production this content supports' },
          { id: 'client',             label: 'Client',              hint: 'The studio, broadcaster, distributor or brand commissioning the content' },
          { id: 'productionCompany',  label: 'Production Company',  hint: 'Your company name' },
          { id: 'contentType',        label: 'Content Type',        hint: 'BTS, EPK, PAV, social cutdowns, trailer assets — list all that apply' },
          { id: 'productionDates',    label: 'Production Dates',    hint: 'Every shoot day this brief covers' },
          { id: 'locations',          label: 'Locations',           hint: 'Cities, regions, or specific venues' },
          { id: 'languages',          label: 'Languages',           hint: 'Primary and secondary languages for interviews and on-camera content' },
          { id: 'briefAuthor',        label: 'Brief Author',        hint: 'Who is responsible for this document' },
          { id: 'lastUpdated',        label: 'Last Updated',        hint: 'Version date' },
        ],
      },
      {
        id: 'crew-contacts',
        label: 'Crew & Points of Contact',
        type: 'repeating',
        prompt: 'Identify everyone responsible for capturing, managing, or approving content on this project. Keep operational — full crew lists belong on the call sheet.',
        targetCount: 4,
        instanceLabel: 'Capture crew',
        sub: [
          { id: 'role',  label: 'Role',  type: 'prose' },
          { id: 'name',  label: 'Name',  type: 'prose' },
          { id: 'phone', label: 'Phone', type: 'prose' },
          { id: 'email', label: 'Email', type: 'prose' },
        ],
      },
      {
        id: 'approvals-escalation',
        label: 'Approvals & Escalation',
        type: 'fields',
        prompt: 'Define the four people who hold decision-making authority on this production.',
        fields: [
          { id: 'productionApprovals', label: 'Production approvals', hint: 'Producer with sign-off authority' },
          { id: 'clientApprovals',     label: 'Client approvals',     hint: 'Marketing or publicity contact at the client' },
          { id: 'onSetEscalation',     label: 'On-set escalation',    hint: 'Who to call when something needs a decision now' },
          { id: 'postProductionLead',  label: 'Post-production lead', hint: 'Editor or post supervisor receiving the rushes' },
        ],
      },
      {
        id: 'bts-coverage',
        label: 'Behind-the-Scenes Coverage',
        type: 'list',
        prompt: 'List the core moments, textures, and stories your BTS coverage needs to deliver. Each row starts with —. Cover candid cast moments, department spotlights, set context, process moments, bloopers, and any production-specific moments.',
      },
      {
        id: 'priority-bts-scenes',
        label: 'Priority Scenes for BTS Capture',
        type: 'grid',
        prompt: 'Reference the master shooting schedule. List scenes where BTS coverage is non-negotiable.',
        targetRows: 5,
        columns: [
          { id: 'scene',    label: 'Scene / Moment' },
          { id: 'date',     label: 'Shoot Date' },
          { id: 'location', label: 'Location' },
          { id: 'rationale',label: 'Why it matters' },
        ],
      },
      {
        id: 'epk-concepts',
        label: 'EPK Concepts',
        type: 'repeating',
        prompt: 'Each EPK concept gets its own brief block. A typical campaign runs 3-6 EPK concepts. Lock cast, questions, and capture environment well in advance.',
        targetCount: 3,
        instanceLabel: 'EPK Concept',
        sub: [
          { id: 'name',          label: 'Concept name',     type: 'prose' },
          { id: 'summary',       label: 'Concept summary',  type: 'prose' },
          { id: 'reference',     label: 'Reference',        type: 'prose' },
          { id: 'productionDay', label: 'Production day',   type: 'prose' },
          { id: 'location',      label: 'Location',         type: 'prose' },
          { id: 'mandatoryTalent', label: 'Mandatory talent', type: 'prose' },
          { id: 'optionalTalent',  label: 'Optional talent',  type: 'prose' },
          { id: 'questionSet',   label: 'Question set',     type: 'prose' },
          { id: 'deliverables',  label: 'Deliverables',     type: 'prose' },
        ],
      },
      {
        id: 'pav-concepts',
        label: 'Promotional Asset Video (PAV) Concepts',
        type: 'grid',
        prompt: 'Short-form, platform-native pieces designed to drive conversation before, during, and after launch. Sketch them here; finalise in a separate creative deck.',
        targetRows: 4,
        columns: [
          { id: 'concept',  label: 'Concept' },
          { id: 'platform', label: 'Platform & Format' },
          { id: 'talent',   label: 'Talent' },
          { id: 'shootDay', label: 'Shoot Day' },
          { id: 'status',   label: 'Status' },
        ],
      },
      {
        id: 'daily-checklist',
        label: 'Daily Operating Checklist',
        type: 'checklist',
        prompt: 'This checklist runs on every shoot day. Capture leads tick it off in the daily log. Surface problems before they become deliverable issues.',
        items: [
          'Full gear check against the equipment list',
          'Briefing with capture team on the day\'s priority moments',
          'Review the call sheet and confirm any schedule changes',
          'Confirm media cards are formatted and labelled',
          'Sync clocks and timecode across all cameras and audio',
          'Eat — capture days run long, food is non-negotiable',
          'Maintain a running technical camera log',
          'Flag any difficulty or talent issue to the producer in real time',
          'Back up media at every meal break, never only at wrap',
          'Full gear check at wrap — count it back into its case',
          'Compile the daily log and review the day\'s footage',
          'Organize content into delivery folder structure',
          'Generate proxies (max 720p) for the next-day review',
          'Upload daily-pick reels to the agreed shared folder',
        ],
      },
      {
        id: 'technical-delivery',
        label: 'Technical Delivery Standards',
        type: 'fields',
        prompt: 'Confirm every spec with the post-production lead and the client before the first shoot day. Spec drift is the most common cause of last-minute reshoots.',
        fields: [
          { id: 'masterCodec',     label: 'Master codec',         hint: 'ProRes 422 HQ, ProRes 4444, or client-specified standard' },
          { id: 'resolution',      label: 'Resolution',           hint: '4K, UHD, HD' },
          { id: 'frameRate',       label: 'Frame rate',           hint: 'Project-standard frame rate' },
          { id: 'audioSpec',       label: 'Audio specification',  hint: 'Channel layout, peak levels, sample rate' },
          { id: 'proxySpec',       label: 'Proxy specification',  hint: 'Codec and resolution for review proxies' },
          { id: 'naming',          label: 'Naming convention',    hint: 'Filename structure required by post' },
          { id: 'deliveryLocation',label: 'Delivery location',    hint: 'Cloud asset manager, hard drive, or shared folder URL' },
          { id: 'backupProtocol',  label: 'Backup protocol',      hint: 'Where the second copy lives and who is responsible' },
        ],
      },
      {
        id: 'folder-structure',
        label: 'Delivery Folder Structure',
        type: 'list',
        prompt: 'Standardize the folder structure before the first day of capture. List six top-level folders, each starting with —, in the FCC standard format: 01_EPK, 02_BTS_B-Roll, 03_PAV_Captures, 04_Stills, 05_Proxies_720p, 06_Daily_Logs.',
      },
      {
        id: 'approvals-signoff',
        label: 'Approvals & Sign-off',
        type: 'grid',
        prompt: 'This brief is locked once all named approvers have signed. Changes after sign-off are managed through written change-orders.',
        targetRows: 4,
        columns: [
          { id: 'role',      label: 'Role' },
          { id: 'name',      label: 'Name' },
          { id: 'date',      label: 'Date' },
          { id: 'signature', label: 'Signature / Initials' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Function Creative Company Content Production Guideline. Be specific, practical, and production-realistic. No fluff, no jargon, no marketing voice.',
  },

  {
    id: 'junket-brief',
    label: 'Junket Brief',
    desc: 'A planning framework for press junkets, broadcast roundtables, and publicity-day shoots.',
    type: 'epk',
    icon: 'users',
    fccCode: 'FCC / TPL-02',
    sections: [
      {
        id: 'junket-overview',
        label: 'Junket Overview',
        type: 'fields',
        prompt: 'A junket is a high-density publicity day with tight scheduling, multiple press outlets, and limited talent windows. This is the source of truth — everyone walking into the venue should have read it.',
        fields: [
          { id: 'projectTitle', label: 'Project Title',  hint: 'The film, series or campaign being promoted' },
          { id: 'junketDate',   label: 'Junket Date',    hint: 'Day of the junket' },
          { id: 'setupDate',    label: 'Setup / Prep Date', hint: 'When the venue is dressed and tested' },
          { id: 'cityRegion',   label: 'City / Region',  hint: 'Junket location' },
          { id: 'junketType',   label: 'Junket Type',    hint: 'Broadcast, print, digital, hybrid' },
          { id: 'languages',    label: 'Languages',      hint: 'Primary and secondary languages required' },
          { id: 'briefAuthor',  label: 'Brief Author',   hint: 'Document owner' },
          { id: 'scheduleLink', label: 'Schedule Link',  hint: 'URL to the master run-of-day schedule' },
          { id: 'lastUpdated',  label: 'Last Updated',   hint: 'Version date' },
        ],
      },
      {
        id: 'venue-details',
        label: 'Venue Details',
        type: 'fields',
        prompt: 'Most junkets run multiple parallel rooms. Define the venue logistics so capture, comms, and venue ops are all aligned.',
        fields: [
          { id: 'venueName',    label: 'Venue name',     hint: 'Hotel, studio or location' },
          { id: 'address',      label: 'Address',        hint: 'Full address' },
          { id: 'venueContact', label: 'Venue contact',  hint: 'On-site coordinator with phone and email' },
          { id: 'loadIn',       label: 'Load-in time',   hint: 'When crew can access the venue' },
          { id: 'loadOut',      label: 'Load-out time',  hint: 'Hard-out for clearing the venue' },
          { id: 'parkingAccess',label: 'Parking & access', hint: 'Trucks, talent vehicles, press arrival' },
        ],
      },
      {
        id: 'room-allocation',
        label: 'Room Allocation',
        type: 'grid',
        prompt: 'Common allocation: two broadcast rooms for video interviews, one audio room for podcasts and remote calls, one staging or hold area for talent.',
        targetRows: 4,
        columns: [
          { id: 'room',          label: 'Room' },
          { id: 'purpose',       label: 'Purpose' },
          { id: 'sizeSqm',       label: 'Size (sqm)' },
          { id: 'ceilingHeight', label: 'Ceiling height' },
        ],
      },
      {
        id: 'talent-groupings',
        label: 'Talent Groupings & Pairings',
        type: 'grid',
        prompt: 'How talent is paired through the day shapes the entire run-of-show. Group by character relationships, story dynamics, or scheduling availability — write the rationale down so press can pitch the angles correctly.',
        targetRows: 5,
        columns: [
          { id: 'group',     label: 'Group' },
          { id: 'talent',    label: 'Talent' },
          { id: 'rationale', label: 'Rationale' },
          { id: 'languages', label: 'Languages' },
        ],
      },
      {
        id: 'talent-windows',
        label: 'Talent Windows',
        type: 'grid',
        prompt: 'Some talent will only be available for part of the day. List arrival and departure constraints so the schedule is built around them.',
        targetRows: 4,
        columns: [
          { id: 'talent',    label: 'Talent' },
          { id: 'arrival',   label: 'Arrival' },
          { id: 'departure', label: 'Departure' },
          { id: 'notes',     label: 'Notes' },
        ],
      },
      {
        id: 'capture-setup',
        label: 'Capture Setup by Room',
        type: 'repeating',
        prompt: 'Detail the camera, audio, and lighting package for each room. Crews reference this when load-in begins, so it must be specific.',
        targetCount: 3,
        instanceLabel: 'Room',
        sub: [
          { id: 'roomName',        label: 'Room name',         type: 'prose' },
          { id: 'cameraPackage',   label: 'Camera package',    type: 'prose' },
          { id: 'lightingPackage', label: 'Lighting package',  type: 'prose' },
          { id: 'audioPackage',    label: 'Audio package',     type: 'prose' },
          { id: 'gripSupport',     label: 'Grip / support',    type: 'prose' },
          { id: 'media',           label: 'Media',             type: 'prose' },
          { id: 'backdropBranding',label: 'Backdrop & branding', type: 'prose' },
        ],
      },
      {
        id: 'physical-deliverables',
        label: 'Printing & Physical Deliverables',
        type: 'grid',
        prompt: 'Title treatments, key art, and physical signage need to be produced and delivered to the venue with time for setup. This is the print spec sheet.',
        targetRows: 5,
        columns: [
          { id: 'item',         label: 'Item' },
          { id: 'specification',label: 'Specification' },
          { id: 'quantity',     label: 'Quantity' },
          { id: 'deliveryDate', label: 'Delivery date' },
        ],
      },
      {
        id: 'photography-setup',
        label: 'Photography Setup',
        type: 'fields',
        prompt: 'Photo coverage is often squeezed into the morning before interviews start. Plan it as a discrete block with its own setup, talent calls, and shot list.',
        fields: [
          { id: 'photographer', label: 'Photographer', hint: 'Name and contact' },
          { id: 'setupStyle',   label: 'Setup style',  hint: 'Express glam, formal portraits, environmental' },
          { id: 'location',     label: 'Location',     hint: 'Dedicated room or shared interview space' },
          { id: 'lighting',     label: 'Lighting',     hint: 'Strobe, continuous, available light' },
          { id: 'backdrop',     label: 'Backdrop',     hint: 'Colour, material, dimensions' },
        ],
      },
      {
        id: 'required-shots',
        label: 'Required Shots',
        type: 'checklist',
        prompt: 'The minimum photo coverage list. Add character pairings or ensemble configurations specific to this junket.',
        items: [
          'Solo of each cast member',
          'Solo of director and / or showrunner',
          'Group photo with director / showrunner',
          'Group photo without director / showrunner',
        ],
      },
      {
        id: 'special-concepts',
        label: 'Special Concept Segments',
        type: 'repeating',
        prompt: 'Branded content segments — themed games, partner integrations, talk-show formats, influencer-led pieces. Aim for two to four concepts maximum on a single junket day.',
        targetCount: 2,
        instanceLabel: 'Concept',
        sub: [
          { id: 'name',           label: 'Concept name',  type: 'prose' },
          { id: 'summary',        label: 'Concept summary', type: 'prose' },
          { id: 'format',         label: 'Format',        type: 'prose' },
          { id: 'host',           label: 'Host or guest interviewer', type: 'prose' },
          { id: 'talentRequired', label: 'Talent required', type: 'prose' },
          { id: 'reference',      label: 'Reference',     type: 'prose' },
          { id: 'propsWardrobe',  label: 'Props / wardrobe', type: 'prose' },
          { id: 'owner',          label: 'Owner',         type: 'prose' },
          { id: 'deliveryDate',   label: 'Delivery date', type: 'prose' },
        ],
      },
      {
        id: 'run-of-day',
        label: 'Run of Day',
        type: 'grid',
        prompt: 'Lock the high-level day shape. The detailed minute-by-minute schedule lives in a separate spreadsheet linked above; this is for the producer\'s wall.',
        targetRows: 8,
        columns: [
          { id: 'time',     label: 'Time' },
          { id: 'activity', label: 'Activity' },
          { id: 'talent',   label: 'Talent' },
          { id: 'room',     label: 'Room' },
        ],
      },
      {
        id: 'post-junket-delivery',
        label: 'Post-Junket Delivery',
        type: 'grid',
        prompt: 'Junket footage is time-sensitive — most assets need to land within 48 to 72 hours. Lock delivery against this schedule before the junket happens.',
        targetRows: 5,
        columns: [
          { id: 'asset',         label: 'Asset' },
          { id: 'specification', label: 'Specification' },
          { id: 'owner',         label: 'Owner' },
          { id: 'deadline',      label: 'Delivery deadline' },
        ],
      },
      {
        id: 'approvals-signoff',
        label: 'Approvals & Sign-off',
        type: 'grid',
        prompt: 'Document who signed off and when. Changes after sign-off are managed through written change-orders.',
        targetRows: 4,
        columns: [
          { id: 'role',      label: 'Role' },
          { id: 'name',      label: 'Name' },
          { id: 'date',      label: 'Date' },
          { id: 'signature', label: 'Signature / Initials' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Function Creative Company Junket Brief. Be specific, professional, PR-realistic. Address the talent and PR team directly.',
  },

  {
    id: 'production-budget',
    label: 'Production Budgeting Framework',
    desc: 'A pricing methodology, tiered service model, and variable cost framework for production studios and creative agencies.',
    type: 'editorial',
    icon: 'card',
    fccCode: 'FCC / TPL-03',
    sections: [
      {
        id: 'operating-principles',
        label: 'Operating Principles',
        type: 'list',
        prompt: 'Four principles underpin this framework. Each row starts with —. Cover: data-driven pricing not intuition; invoiced price vs variable cost as the key relationship; planning for the worst case on variable costs; and the four variable cost categories (labor, equipment, materials, administrative).',
      },
      {
        id: 'sufficiency-figures',
        label: 'Working Assumptions',
        type: 'fields',
        prompt: 'Sufficiency is the minimum monthly revenue your studio needs to cover fixed costs and deliver target profit. Pricing below sufficiency means you\'re losing money on every project. Fill with this studio\'s actual data — the example uses 70% variable cost.',
        fields: [
          { id: 'variableCostPct', label: 'Variable cost as % of revenue', hint: 'Operational range — typically 50-70%' },
          { id: 'tmr',             label: 'Target Monthly Revenue (TMR)', hint: 'Revenue figure required to hit profit goals' },
          { id: 'fixedCosts',      label: 'Monthly fixed costs', hint: 'Rent, salaries, software, recurring services' },
          { id: 'profitExpectation', label: 'Monthly profit expectation', hint: 'Owner draw, retained earnings, reinvestment' },
          { id: 'markupPct',       label: 'Resulting markup %', hint: 'Calculated from TMR and variable cost' },
          { id: 'gpmPct',          label: 'Resulting gross profit margin %', hint: '100% minus variable cost percentage' },
        ],
      },
      {
        id: 'four-step-pricing',
        label: 'Four-Step Pricing Logic',
        type: 'list',
        prompt: 'Once sufficiency is locked, every project follows the same logic. List four steps, each starting with —. Cover: calculate total variable cost; divide by VC% for project price; remainder covers fixed costs and profit; savings vs projection become retained earnings.',
      },
      {
        id: 'margin-flexibility',
        label: 'Margin Flexibility',
        type: 'grid',
        prompt: 'Not every project hits target margin. The discipline is knowing when to flex, when to hold, and when to walk away.',
        targetRows: 3,
        columns: [
          { id: 'tier',      label: 'Margin Tier' },
          { id: 'range',     label: 'Range' },
          { id: 'whenApply', label: 'When to Apply' },
        ],
      },
      {
        id: 'tier-pricing-architecture',
        label: 'Tier Pricing Architecture',
        type: 'grid',
        prompt: 'Tiered pricing replaces custom-quoting. Each tier carries a price range and corresponding variable cost budget — 70% of every project price allocated to delivering the work.',
        targetRows: 4,
        columns: [
          { id: 'tier',          label: 'Tier' },
          { id: 'priceRange',    label: 'Price Range' },
          { id: 'threshold',     label: 'Threshold (Above)' },
          { id: 'vcBudget',      label: 'Variable Cost Budget' },
        ],
      },
      {
        id: 'team-composition',
        label: 'Creative Team Composition by Tier',
        type: 'grid',
        prompt: 'Team size scales with tier. Match team to project — don\'t over-staff Core, don\'t under-staff Premium.',
        targetRows: 4,
        columns: [
          { id: 'tier',     label: 'Tier' },
          { id: 'teamSize', label: 'Team Size' },
          { id: 'profile',  label: 'Talent Profile' },
          { id: 'approach', label: 'Project Approach' },
        ],
      },
      {
        id: 'tier-positioning',
        label: 'Marketing Positioning by Tier',
        type: 'grid',
        prompt: 'Each tier needs its own pitch — a sentence that captures what the client gets and why this tier costs what it does.',
        targetRows: 4,
        columns: [
          { id: 'tier',        label: 'Tier' },
          { id: 'positioning', label: 'Sample positioning' },
        ],
      },
      {
        id: 'economies-of-scale',
        label: 'Economies of Scale Strategies',
        type: 'list',
        prompt: 'Strategies for structurally lowering variable costs without reducing quality. Each row starts with —. Cover labor (ECN library, standardized kits, short-term contracts), equipment (owned over rental, long-term deals, scheduling utilization), materials (bulk purchase, inventory system, reusable elements), and admin (single-platform booking, annual renegotiation, per-project tracking).',
      },
      {
        id: 'ecn-roles',
        label: 'Extended Creative Network — Starting Roles',
        type: 'list',
        prompt: 'The fifteen foundational roles to build the ECN library against before expanding. Each row starts with —. Cover the production roles in order: Cinematographer/DP, Photographer, Director, Editor, Set Designer, Project Manager, Live Editor, Colorist, Mixer/Sound Designer, Creative Director, Producer, Lighting Tech/Gaffer, Animator/MoGfx, Camera Operator, plus one studio-specialization role.',
      },
      {
        id: 'ecn-role-profile',
        label: 'ECN Role Profile Template',
        type: 'fields',
        prompt: 'For each role in the network, document the profile below. This becomes the source of truth for quoting, scoping, and freelancer onboarding.',
        fields: [
          { id: 'roleTitle',         label: 'Role title',            hint: 'Standardized name used across all internal documents' },
          { id: 'coreSkills',        label: 'Core skills',           hint: 'Minimum capability set for the role' },
          { id: 'tierFeatures',      label: 'Tier-unlocked features',hint: 'Specialized capabilities at Essential, Smart, Premium' },
          { id: 'halfDayRate',       label: 'Rate range — half day', hint: 'Negotiated half-day rates by tier' },
          { id: 'fullDayRate',       label: 'Rate range — full day', hint: 'Negotiated full-day rates by tier' },
          { id: 'equipmentIncluded', label: 'Equipment included',    hint: 'Any kit the freelancer brings as standard' },
          { id: 'pastProjects',      label: 'Notable past projects', hint: 'Quick reference for client-facing case studies' },
          { id: 'availability',      label: 'Availability windows',  hint: 'Typical lead time and recurring blackouts' },
        ],
      },
      {
        id: 'worked-example',
        label: 'Worked Example — Pricing a Project',
        type: 'fields',
        prompt: 'Apply the framework to a sample project. Walk through the steps to validate the approach.',
        fields: [
          { id: 'project',          label: 'Project',                  hint: 'Brief description' },
          { id: 'tier',             label: 'Tier classification',      hint: 'Core / Essential / Smart / Premium' },
          { id: 'laborCosts',       label: 'Labor costs',              hint: 'Sum of all freelancer fees' },
          { id: 'equipmentCosts',   label: 'Equipment rental costs',   hint: 'Sum of all rental line items' },
          { id: 'materialsCosts',   label: 'Materials & supplies costs', hint: 'Set, props, consumables' },
          { id: 'adminCosts',       label: 'Administrative costs',     hint: 'Travel, meals, miscellaneous' },
          { id: 'totalVariable',    label: 'Total variable costs',     hint: 'Sum of the four categories' },
          { id: 'projectPrice',     label: 'Project price (calculated)', hint: 'Variable costs / VC%' },
          { id: 'markupPct',        label: 'Markup %',                 hint: 'Calculated' },
          { id: 'gpmPct',           label: 'Gross profit margin %',    hint: 'Calculated' },
          { id: 'decision',         label: 'Decision',                 hint: 'Quote, restructure, or decline' },
        ],
      },
      {
        id: 'governance',
        label: 'Governance & Review',
        type: 'fields',
        prompt: 'A pricing framework that doesn\'t get reviewed becomes wrong. Build review cadence into the studio\'s operating rhythm.',
        fields: [
          { id: 'monthlyReview',  label: 'Monthly review',  hint: 'Compare projected vs actual variable costs across all live projects' },
          { id: 'quarterlyReview',label: 'Quarterly review',hint: 'Recalibrate sufficiency figures and tier price ranges' },
          { id: 'annualReview',   label: 'Annual review',   hint: 'Full framework review — tier definitions, ECN, target margins, fixed costs' },
          { id: 'frameworkOwner', label: 'Framework owner', hint: 'Senior leader responsible for the framework' },
          { id: 'dataOwner',      label: 'Data owner',      hint: 'Operations or finance lead maintaining cost and margin data' },
          { id: 'ecnOwner',       label: 'ECN owner',       hint: 'Producer or talent lead maintaining the freelancer library' },
          { id: 'reviewChair',    label: 'Review chair',    hint: 'Who runs the quarterly review meeting' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Function Creative Company Production Budgeting Framework. This is a strategic methodology, not a line-item budget. Be specific with realistic numbers but use TBD where studio-specific data should go. Currency in USD unless specified.',
  },

  {
    id: 'shooting-schedule',
    label: 'Shooting Schedule',
    desc: 'A structural framework for building, maintaining, and distributing production schedules across episodic, feature, and commercial shoots.',
    type: 'epk',
    icon: 'cal',
    fccCode: 'FCC / TPL-04',
    sections: [
      {
        id: 'schedule-overview',
        label: 'Schedule Overview',
        type: 'fields',
        prompt: 'The shooting schedule is the most-read document on any production. Get it right and the whole machine runs; get it wrong and every department misfires.',
        fields: [
          { id: 'projectTitle',     label: 'Project Title',     hint: 'Series, film, or commercial name' },
          { id: 'productionCompany',label: 'Production Company',hint: 'Producing entity' },
          { id: 'scheduleVersion',  label: 'Schedule Version',  hint: 'Numbered draft (e.g. Draft 5)' },
          { id: 'dateIssued',       label: 'Date Issued',       hint: 'When this version was published' },
          { id: 'scheduleOwner',    label: 'Schedule Owner',    hint: 'First Assistant Director or scheduling producer' },
          { id: 'totalDays',        label: 'Total Shoot Days',  hint: 'Calendar days from start of principal to wrap' },
          { id: 'totalPages',       label: 'Total Pages',       hint: 'Cumulative page count of all scenes' },
          { id: 'format',           label: 'Format',            hint: 'Single camera, multi-camera, mixed unit' },
        ],
      },
      {
        id: 'scheduling-logic',
        label: 'Scheduling Logic',
        type: 'list',
        prompt: 'The principles governing how this schedule was built. Each row starts with —. Cover: grouping by location, clustering cast availability, scheduling complex setups when crew is fresh, front-loading weather risk, buffer days for contingency, and any production-specific principles.',
      },
      {
        id: 'page-count-targets',
        label: 'Daily Page Count Targets',
        type: 'fields',
        prompt: 'Lock the page count discipline before scheduling individual days.',
        fields: [
          { id: 'targetPerDay',  label: 'Target page count per day',    hint: 'Typical 4-6 pages on standard scripted productions' },
          { id: 'tolerance',     label: 'Page count tolerance',         hint: 'Acceptable variance day to day' },
          { id: 'maxDailyPages', label: 'Maximum daily page count',     hint: 'Hard ceiling that triggers schedule restructuring' },
          { id: 'specialUnits',  label: 'Stunts & special unit days',   hint: 'Reduced page count expectations' },
        ],
      },
      {
        id: 'union-constraints',
        label: 'Cast & Union Constraints',
        type: 'list',
        prompt: 'Constraints that govern crew/cast scheduling. Each row starts with —. Cover: 12-hour turnaround, 6-day work week, child performer hours, stunt double availability, plus region-specific union or production agreements.',
      },
      {
        id: 'cast-numbers',
        label: 'Cast Number Reference',
        type: 'grid',
        prompt: 'Every cast member is assigned a permanent cast number that appears against scenes throughout the schedule. The number stays consistent across every version. Reserve the first numbers for series regulars or principal cast.',
        targetRows: 10,
        columns: [
          { id: 'castNumber', label: 'Cast #' },
          { id: 'character',  label: 'Character' },
          { id: 'performer',  label: 'Performer' },
          { id: 'notes',      label: 'Notes' },
        ],
      },
      {
        id: 'location-index',
        label: 'Location Index',
        type: 'grid',
        prompt: 'Catalogue every shooting location with its real-world venue, access constraints, and the scenes scheduled there. The bridge between the schedule and the location department.',
        targetRows: 6,
        columns: [
          { id: 'scriptName', label: 'Location Name (script)' },
          { id: 'venue',      label: 'Actual Venue' },
          { id: 'cityRegion', label: 'City / Region' },
          { id: 'access',     label: 'Access Notes' },
        ],
      },
      {
        id: 'unit-structure',
        label: 'Unit Structure',
        type: 'grid',
        prompt: 'Most productions run more than one unit at some point. Define each unit\'s purpose and boundaries before assigning scenes.',
        targetRows: 4,
        columns: [
          { id: 'unit',     label: 'Unit' },
          { id: 'purpose',  label: 'Purpose' },
          { id: 'days',     label: 'Days Scheduled' },
          { id: 'crewLead', label: 'Crew Lead' },
        ],
      },
      {
        id: 'shoot-days',
        label: 'Shoot Days',
        type: 'repeating',
        prompt: 'Each shoot day gets its own block. Most productions run 20-60 days. For this template, generate the first 5 days as a demonstrable structure.',
        targetCount: 5,
        instanceLabel: 'Shoot Day',
        sub: [
          { id: 'dayNumber',  label: 'Day Number',          type: 'prose' },
          { id: 'dayDate',    label: 'Day & Date',          type: 'prose' },
          { id: 'dayType',    label: 'Day Type',            type: 'prose' },
          { id: 'locationGroup', label: 'Location Group',   type: 'prose' },
          { id: 'crewCall',   label: 'Crew Call',           type: 'prose' },
          { id: 'firstShot',  label: 'First Shot',          type: 'prose' },
          { id: 'lunch',      label: 'Lunch',               type: 'prose' },
          { id: 'wrap',       label: 'Estimated Wrap',      type: 'prose' },
          { id: 'pageCount',  label: 'Total Page Count',    type: 'prose' },
          { id: 'weatherCover', label: 'Weather Contingency', type: 'prose' },
          { id: 'scenes',     label: 'Scenes Scheduled',    type: 'prose' },
          { id: 'dayNotes',   label: 'Day Notes',           type: 'prose' },
        ],
      },
      {
        id: 'travel-off-days',
        label: 'Travel, Turnaround & Off Days',
        type: 'grid',
        prompt: 'Non-shooting days are part of the schedule. Track them so the line producer can budget transport, accommodation, and per-diem accurately. Day types include travel, turnaround, prep, weather hold, weekend, public holiday, hiatus.',
        targetRows: 6,
        columns: [
          { id: 'date',     label: 'Date' },
          { id: 'dayType',  label: 'Day Type' },
          { id: 'detail',   label: 'Detail' },
          { id: 'affected', label: 'Affected Crew / Cast' },
        ],
      },
      {
        id: 'schedule-summary',
        label: 'Schedule Summary',
        type: 'fields',
        prompt: 'A one-page summary of the total schedule, used for production accounting, insurance, and client reporting.',
        fields: [
          { id: 'mainUnitDays',     label: 'Total shoot days — main unit',     hint: 'Count' },
          { id: 'secondUnitDays',   label: 'Total shoot days — second unit',   hint: 'Count' },
          { id: 'splinterDays',     label: 'Total splinter / drone / plates days', hint: 'Count' },
          { id: 'travelDays',       label: 'Total travel days',                hint: 'Count' },
          { id: 'weatherHoldDays',  label: 'Total weather hold days budgeted', hint: 'Count' },
          { id: 'totalPages',       label: 'Total cumulative page count',      hint: 'Sum across all units' },
          { id: 'avgPagesPerDay',   label: 'Average pages per day — main unit',hint: 'Calculated' },
          { id: 'locationsCount',   label: 'Locations covered',                hint: 'Number of unique locations' },
          { id: 'castDaysRegulars', label: 'Cast days — series regulars',      hint: 'Total contracted days' },
          { id: 'castDaysGuest',    label: 'Cast days — guest / recurring',    hint: 'Total contracted days' },
        ],
      },
    ],
    systemPrompt: 'You are filling a Function Creative Company Shooting Schedule. Be specific, realistic, production-grade. Time slots in 24-hour format. Use realistic-looking placeholder dates and times where the user has not provided specifics.',
  },

  {
    id: 'series-bible',
    label: 'Series Bible',
    desc: 'A structural framework for developing television series, web series, and serialized streaming content from concept through episode breakdown.',
    type: 'series',
    icon: 'file',
    fccCode: 'FCC / TPL-05',
    sections: [
      {
        id: 'concept',
        label: 'The Concept',
        type: 'fields',
        prompt: 'The opening pages of any bible. Buyers, financiers, and writers\' rooms read these first. Get the title, genre, and format right and the rest of the document earns the reader\'s attention.',
        fields: [
          { id: 'workingTitle',    label: 'Working title',           hint: 'The title of the series' },
          { id: 'genre',           label: 'Genre',                   hint: 'Primary and secondary genres' },
          { id: 'format',          label: 'Format',                  hint: 'Episode count and runtime — e.g. 6 x 60\', 10 x 30\'' },
          { id: 'languages',       label: 'Language(s)',             hint: 'Languages spoken in the show' },
          { id: 'productionCompany', label: 'Production company',    hint: 'Producing entity' },
          { id: 'createdBy',       label: 'Created by',              hint: 'Creator credit(s)' },
          { id: 'showrunner',      label: 'Showrunner / head writer',hint: 'If different from creator' },
          { id: 'targetPlatform',  label: 'Target platform',         hint: 'Streamer, broadcaster, theatrical' },
        ],
      },
      {
        id: 'logline-question-idea',
        label: 'Logline, Dramatic Question & Controlling Idea',
        type: 'fields',
        prompt: 'The three pieces of writing that anchor the bible. The logline tells the reader what the series is. The dramatic question drives the season. The controlling idea is the thematic argument.',
        fields: [
          { id: 'logline',         label: 'Logline',           hint: 'Two to four sentences. Make a reader lean in, not lean back. Tell what the series is, who its protagonist is, what they want, what stands in their way.' },
          { id: 'dramaticQuestion',label: 'Dramatic question', hint: 'One sentence, phrased as a question. The question that drives the season — and that the season answers.' },
          { id: 'controllingIdea', label: 'Controlling idea',  hint: 'Two to four sentences articulating the show\'s central thematic claim. Not a slogan — a worldview.' },
        ],
      },
      {
        id: 'series-synopsis',
        label: 'Series Synopsis',
        type: 'prose',
        prompt: 'The full narrative arc of the season, told as story. Aim for two to five paragraphs. Move chronologically through the season, but don\'t reduce it to bullet points. Use scene-level texture — surprises, reversals, moments of intimacy. End on the note the season ends on. Present tense, active voice.',
      },
      {
        id: 'creators-intent',
        label: 'Creators\' Intent',
        type: 'prose',
        prompt: 'The why behind the show. Three or four paragraphs in the creators\' voice. Answer three questions: Why this story? Why now? Why us? Reference what audiences will get from the show that they can\'t get elsewhere — in human terms, not industry-jargon.',
      },
      {
        id: 'treatment',
        label: 'Treatment',
        type: 'fields',
        prompt: 'How the show actually works as a piece of television. Structural choices and storytelling rules.',
        fields: [
          { id: 'episodicStructure', label: 'Episodic structure', hint: 'How does each episode begin, build, and resolve? Procedural beats? Cold opens? Cliffhangers? Multi-strand storytelling?' },
          { id: 'seasonStructure',   label: 'Season structure',   hint: 'Where does the season pivot? Where does the midpoint sit? What\'s the difference between the first and final episodes\' tone and stakes?' },
          { id: 'ipConnection',      label: 'Connection to existing IP', hint: 'If this is a spin-off, prequel, sequel, or part of a wider universe. Skip if not applicable.' },
        ],
      },
      {
        id: 'themes',
        label: 'Themes',
        type: 'repeating',
        prompt: 'The thematic territory the show occupies. Three themes is typical — fewer feels thin, more feels unfocused. Each should be the kind of thing a critic would identify after watching the show, not a list of topics.',
        targetCount: 3,
        instanceLabel: 'Theme',
        sub: [
          { id: 'name',        label: 'Theme name',  type: 'prose' },
          { id: 'articulation', label: 'Articulation', type: 'prose' },
        ],
      },
      {
        id: 'world',
        label: 'The World',
        type: 'fields',
        prompt: 'The show\'s setting, atmosphere, and rules of engagement. Some shows have literal worlds; most have figurative ones — a profession, a community, a family dynamic, a city.',
        fields: [
          { id: 'storyWorld',      label: 'Story world',           hint: 'Two to four paragraphs. Central social, professional, or geographic territory the show lives in. Rules. Texture of daily life.' },
          { id: 'visualReferences',label: 'Visual & tonal references', hint: 'Films, series, photographers, painters, music, visual cultures the show draws from.' },
          { id: 'tone',            label: 'Tone',                  hint: 'One paragraph capturing the show\'s emotional register. Comedic? Melancholic? Procedural? Surreal?' },
        ],
      },
      {
        id: 'lead-characters',
        label: 'Lead Characters',
        type: 'repeating',
        prompt: 'Detailed profiles of every series regular. Most series bibles cover three to six leads in detail. Each profile follows the same structure for ensemble comparison.',
        targetCount: 4,
        instanceLabel: 'Character',
        sub: [
          { id: 'name',         label: 'Name',          type: 'prose' },
          { id: 'age',          label: 'Age',           type: 'prose' },
          { id: 'want',         label: 'Want',          type: 'prose' },
          { id: 'need',         label: 'Need',          type: 'prose' },
          { id: 'wound',        label: 'Wound',         type: 'prose' },
          { id: 'comedicFlaw',  label: 'Comedic flaw',  type: 'prose' },
          { id: 'traits',       label: 'Traits',        type: 'prose' },
          { id: 'profile',      label: 'Profile',       type: 'prose' },
          { id: 'arc',          label: 'Season arc',    type: 'prose' },
        ],
      },
      {
        id: 'episode-synopses',
        label: 'Episode Synopses',
        type: 'repeating',
        prompt: 'A paragraph or two on each episode of the season. Episode synopses show how the season is structured episode by episode without locking the writers\' room into beat-by-beat rigidity. End on the season finale.',
        targetCount: 6,
        instanceLabel: 'Episode',
        sub: [
          { id: 'number',   label: 'Episode #', type: 'prose' },
          { id: 'title',    label: 'Title',     type: 'prose' },
          { id: 'synopsis', label: 'Synopsis',  type: 'prose' },
        ],
      },
      {
        id: 'season-beyond',
        label: 'Season One and Beyond',
        type: 'prose',
        prompt: 'How does the show extend beyond the first season? One to two paragraphs sketching where Season Two could go, what the broader franchise potential looks like, and which characters or themes carry forward. Buyers want to see runway.',
      },
    ],
    systemPrompt: 'You are filling a Function Creative Company Series Bible. Write with conviction and specificity, like a working showrunner pitching the network. Use present tense and active voice for narrative sections.',
  },
];

/* ─── Model schema prompt builders ──────────────────────────────
   These helpers translate a Model's structured schema into:
     1. A natural-language prompt that teaches Claude exactly what
        JSON shape to return per section type
     2. Default values used as fallbacks if Claude's response can't
        be parsed or omits a section

   Section type → JSON shape mapping:
     prose      → string
     list       → string (one bulleted line per row, each starts with —)
     fields     → object { fieldId: string, ... }
     grid       → array of { columnId: string, ... }
     checklist  → array of { text: string, checked: false }
     repeating  → array of { subFieldId: string, ... }
   ────────────────────────────────────────────────────────────────── */
function describeSectionShape(s) {
  switch (s.type) {
    case 'prose':
      return `"${s.id}": "<string of multi-line prose>"`;
    case 'list':
      return `"${s.id}": "<string with each item on its own line, each line beginning with —>"`;
    case 'fields': {
      const inner = (s.fields || []).map(f => `"${f.id}": "<value for ${f.label}${f.hint ? `: ${f.hint}` : ''}>"`).join(', ');
      return `"${s.id}": { ${inner} }`;
    }
    case 'grid': {
      const cols = (s.columns || []).map(c => `"${c.id}": "<${c.label}>"`).join(', ');
      const target = s.targetRows || 4;
      return `"${s.id}": [ ${target} objects in the form { ${cols} } ]`;
    }
    case 'checklist': {
      const target = (s.items && s.items.length) || 6;
      return `"${s.id}": [ ${target}+ objects of the form { "text": "<item text>", "checked": false } ]`;
    }
    case 'repeating': {
      const subFields = (s.sub || []).map(f => `"${f.id}": "<${f.label}>"`).join(', ');
      const target = s.targetCount || 3;
      return `"${s.id}": [ ${target} objects in the form { ${subFields} } ]`;
    }
    default:
      return `"${s.id}": "<content>"`;
  }
}

function buildModelSchemaPrompt(model) {
  return model.sections.map((s, i) => {
    const numberPrefix = `${String(i + 1).padStart(2, '0')}. ${s.label}`;
    return `${numberPrefix}\nGuidance: ${s.prompt}\nShape: ${describeSectionShape(s)}`;
  }).join('\n\n');
}

function buildSingleSectionPrompt(model, section) {
  return `Refill the section "${section.label}" of a "${model.label}" framework.\nGuidance: ${section.prompt}\nReturn JSON only of the shape: ${describeSectionShape(section)}\nReturn only the value, not the wrapping key.`;
}

function defaultValueForSection(s) {
  switch (s.type) {
    case 'prose':
    case 'list':
      return '';
    case 'fields': {
      const obj = {};
      (s.fields || []).forEach(f => { obj[f.id] = ''; });
      return obj;
    }
    case 'grid': {
      const target = s.targetRows || 3;
      return Array.from({ length: target }, () => {
        const row = {};
        (s.columns || []).forEach(c => { row[c.id] = ''; });
        return row;
      });
    }
    case 'checklist':
      return (s.items || []).map(t => ({ text: t, checked: false }));
    case 'repeating': {
      const target = s.targetCount || 2;
      return Array.from({ length: target }, () => {
        const obj = {};
        (s.sub || []).forEach(f => { obj[f.id] = ''; });
        return obj;
      });
    }
    default:
      return '';
  }
}

/* Parse a Claude response for a single section. Strips fences, parses JSON,
   falls back to the raw string for prose/list types if parse fails. */
function parseSectionResponse(s, raw) {
  const text = String(raw).replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  // For prose/list, accept raw text directly
  if (s.type === 'prose' || s.type === 'list') {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'string') return parsed;
    } catch {}
    return text;
  }
  // For object/array types, must be JSON
  try {
    return JSON.parse(text);
  } catch {
    return defaultValueForSection(s);
  }
}

/* ─── DB · Functions tutorial (first-use coachmark) ─────────
   Three-step overlay shown the first time a user opens a Function.
   Dismissal persists in user.tutorialsSeen.functions = true.       */
function DBFunctionTutorial({ T, onDismiss }) {
  const { isMobile } = useViewport();
  const [step, setStep] = useState(0);
  const steps = [
    {
      eyebrow: 'Welcome to Functions',
      title: 'Functions are the building blocks.',
      body: 'Each Function is a database, a process, or a model that other parts of Nia draw on. Together they keep your creative output consistent — same archetype rates, same trusted contacts, same proven frameworks across every project.',
      cta: 'Show me how',
    },
    {
      eyebrow: 'How they fit together',
      title: 'Use them solo, or wire them into a project.',
      body: 'Open a Function on its own to browse the data — or call a Function from inside the Intelligence Bar to pull from it while you work. Ask Nia to "find a PR contact for Coachella" and it queries the Contacts function. Ask for "rates for a Senior DOP in NYC" and it queries Archetypes.',
      cta: 'One more thing',
    },
    {
      eyebrow: 'Three live · two coming',
      title: 'Intelligence is live now.',
      body: 'Contacts, Events, and Archetypes are ready to use today. Agents (long-running assistants) and Models (production frameworks) are next — Models lands in the next release with five built-in production templates.',
      cta: 'Got it — let me in',
    },
  ];
  const s = steps[step];
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.70)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 20 : 40, fontFamily: BODY,
    }}>
      <div style={{
        width: '100%', maxWidth: 540, padding: isMobile ? 28 : 36,
        background: T.cardBg, borderRadius: 18,
        border: `1px solid ${T.borderMd}`, boxShadow: T.dockShadow,
      }}>
        {/* Step pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? ACCENT : T.borderMd,
              transition: `background ${EASE_DELIBERATE}`,
            }}/>
          ))}
        </div>
        <div style={{
          fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: T.ink4, marginBottom: 12,
        }}>{s.eyebrow}</div>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: isMobile ? 22 : 26, lineHeight: 1.2,
          letterSpacing: '-0.02em',
          color: T.ink, marginBottom: 16,
        }}>{s.title}</div>
        <div style={{
          fontFamily: BODY, fontSize: 13.5, lineHeight: 1.65,
          color: T.ink2, marginBottom: 28,
        }}>{s.body}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <button onClick={onDismiss} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '8px 4px',
            fontFamily: BODY, fontStyle: 'italic', fontSize: 12,
            color: T.ink3, letterSpacing: '-0.005em',
          }}>Skip tutorial</button>
          <PrimaryButton T={T}
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : onDismiss()}>
            {s.cta} <ChevRight s={11} c="currentColor" sw={2} />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ─── DB · Contacts function (table / list / map) ───────────
   Table view: spreadsheet-like with all columns.
   List view: card layout grouped by organization.
   Map view: SVG world map clusters showing venue locations from
   VENUES_DATA (the only addressable subset of the contacts data).  */
function DBContactsFunction({ T, onClose }) {
  const { isMobile, isTablet } = useViewport();
  const [view, setView] = useState(isMobile ? 'list' : 'table');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? CONTACTS_DATA.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.org || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.note || '').toLowerCase().includes(q)
      )
    : CONTACTS_DATA;

  // Group by organization for list view
  const byOrg = {};
  filtered.forEach(c => {
    const k = c.org || 'Unaffiliated';
    (byOrg[k] = byOrg[k] || []).push(c);
  });
  const orgKeys = Object.keys(byOrg).sort();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 96,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : 1080,
        height: isMobile ? '100vh' : `min(800px, calc(100vh - ${isTablet ? 32 : 48}px))`,
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 18,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.dockShadow,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          flexShrink: 0,
          padding: isMobile ? '14px 16px' : '18px 24px',
          borderBottom: `1px solid ${T.dividerInk}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 4,
            }}>Function · Intelligence</div>
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: isMobile ? 18 : 22, color: T.ink, letterSpacing: '-0.015em',
            }}>Contacts · {filtered.length} of {CONTACTS_DATA.length}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'transparent', border: `1px solid ${T.borderMd}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.ink3, flexShrink: 0,
          }}>
            <CloseIc s={12} c="currentColor" sw={1.6} />
          </button>
        </div>

        {/* Toolbar — view toggle + search */}
        <div style={{
          flexShrink: 0,
          padding: isMobile ? '10px 16px' : '12px 24px',
          display: 'flex', alignItems: 'center',
          gap: 10, flexWrap: 'wrap',
          borderBottom: `1px solid ${T.dividerInk}`,
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'table', label: 'Table' },
              { id: 'list',  label: 'List'  },
              { id: 'map',   label: 'Map'   },
            ].map(v => {
              const on = view === v.id;
              return (
                <button key={v.id} onClick={() => setView(v.id)} style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '6px 14px', borderRadius: 999,
                  background: on ? T.activeTabBg : 'transparent',
                  border: `1px solid ${on ? T.borderMd : 'transparent'}`,
                  color: on ? T.ink : T.ink3,
                  fontFamily: BODY, fontSize: 12, fontWeight: 500,
                  fontStyle: on ? 'normal' : 'italic',
                  letterSpacing: '-0.005em',
                }}>{v.label}</button>
              );
            })}
          </div>
          <div style={{
            flex: 1, minWidth: 180,
            display: 'flex', alignItems: 'center', gap: 8,
            background: T.inputBg, border: `1px solid ${T.borderMd}`,
            borderRadius: 8, padding: '7px 12px',
          }}>
            <SearchIc s={12} c={T.ink3} sw={1.5} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search name, organization, email…"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                flex: 1, color: T.ink, fontFamily: BODY, fontSize: 12.5,
                letterSpacing: '-0.005em', minWidth: 0,
              }}/>
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: T.ink3, padding: 0, display: 'flex',
              }}>
                <CloseIc s={11} c="currentColor" sw={1.6} />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* TABLE VIEW */}
          {view === 'table' && (
            <div style={{ flex: 1, overflow: 'auto' }}>
              <table style={{
                width: '100%', borderCollapse: 'collapse',
                fontFamily: BODY, fontSize: 12, color: T.ink2,
              }}>
                <thead>
                  <tr style={{
                    background: T.cardBgAlt,
                    position: 'sticky', top: 0, zIndex: 2,
                  }}>
                    {['ID', 'Organization', 'Name', 'Email', 'Notes'].map(h => (
                      <th key={h} style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: T.ink4,
                        borderBottom: `1px solid ${T.dividerInk}`,
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} onClick={() => setSelected(c)} style={{
                      cursor: 'pointer',
                      borderBottom: `1px solid ${T.dividerInk}`,
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = T.cardBgAlt}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 14px', fontFamily: MONO, fontSize: 11, color: T.ink4 }}>{String(c.id || '').padStart(3, '0')}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 500, color: T.ink }}>{c.org}</td>
                      <td style={{ padding: '10px 14px', fontStyle: 'italic' }}>{c.name}</td>
                      <td style={{ padding: '10px 14px', fontFamily: MONO, fontSize: 11, color: T.ink3 }}>{c.email}</td>
                      <td style={{ padding: '10px 14px', fontSize: 11.5, color: T.ink3, maxWidth: 320 }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.note}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* LIST VIEW — grouped by org */}
          {view === 'list' && (
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: isMobile ? '14px 16px' : '18px 24px',
            }}>
              {orgKeys.map(org => (
                <div key={org} style={{ marginBottom: 24 }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: T.ink4, marginBottom: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span>{org}</span>
                    <span>{byOrg[org].length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {byOrg[org].map(c => (
                      <button key={c.id} onClick={() => setSelected(c)}
                        style={{
                          all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                          width: '100%', padding: '10px 14px', borderRadius: 10,
                          background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                          display: 'flex', flexDirection: 'column', gap: 3,
                        }}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          alignItems: 'baseline', gap: 10,
                        }}>
                          <span style={{
                            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                            fontSize: 13, color: T.ink, letterSpacing: '-0.005em',
                          }}>{c.name}</span>
                          <span style={{
                            fontFamily: MONO, fontSize: 9.5, color: T.ink4, flexShrink: 0,
                          }}>#{String(c.id || '').padStart(3, '0')}</span>
                        </div>
                        <div style={{
                          fontFamily: MONO, fontSize: 11, color: T.ink3,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{c.email}</div>
                        {c.note && (
                          <div style={{
                            fontFamily: BODY, fontSize: 11, color: T.ink3,
                            lineHeight: 1.5, marginTop: 2,
                          }}>{c.note}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MAP VIEW — venue locations clustered by city */}
          {view === 'map' && (
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: isMobile ? '14px 16px' : '18px 24px',
            }}>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontSize: 12.5,
                color: T.ink3, lineHeight: 1.6, marginBottom: 18,
              }}>
                Venues with addresses, grouped by city. Use these as anchors when
                planning shoots, junkets, or industry events.
              </div>
              {(() => {
                const byCity = {};
                VENUES_DATA.forEach(v => {
                  const k = v.city || 'Unspecified';
                  (byCity[k] = byCity[k] || []).push(v);
                });
                return Object.keys(byCity).sort().map(city => (
                  <div key={city} style={{ marginBottom: 24 }}>
                    <div style={{
                      fontFamily: MONO, fontSize: 10, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: ACCENT, marginBottom: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span>{city}</span>
                      <span style={{ color: T.ink4 }}>{byCity[city].length} venues</span>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: 8,
                    }}>
                      {byCity[city].map(v => (
                        <div key={v.id || v.name} style={{
                          padding: '12px 14px', borderRadius: 10,
                          background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                        }}>
                          <div style={{
                            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                            fontSize: 13, color: T.ink, letterSpacing: '-0.005em',
                            marginBottom: 4,
                          }}>{v.name}</div>
                          <div style={{
                            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                            letterSpacing: '0.10em', textTransform: 'uppercase',
                            color: T.ink4, marginBottom: 6,
                          }}>{v.type}</div>
                          {v.address && (
                            <div style={{
                              fontFamily: BODY, fontSize: 11.5, color: T.ink3,
                              lineHeight: 1.45, marginBottom: 4,
                            }}>{v.address}</div>
                          )}
                          {v.capacity && (
                            <div style={{
                              fontFamily: MONO, fontSize: 10, color: T.ink4,
                            }}>cap. {v.capacity}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>

        {/* Selected contact detail panel */}
        {selected && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            background: 'rgba(0,0,0,0.40)',
            display: 'flex', justifyContent: 'flex-end',
          }} onClick={() => setSelected(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{
              width: isMobile ? '100%' : 380,
              height: '100%', overflowY: 'auto',
              background: T.cardBg,
              borderLeft: isMobile ? 'none' : `1px solid ${T.borderMd}`,
              padding: '20px 22px',
              boxShadow: T.dockShadow,
            }}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: 12, marginBottom: 18,
              }}>
                <div>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: T.ink4, marginBottom: 4,
                  }}>{selected.org} · #{String(selected.id || '').padStart(3, '0')}</div>
                  <div style={{
                    fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                    fontSize: 20, color: T.ink, letterSpacing: '-0.015em', lineHeight: 1.2,
                  }}>{selected.name}</div>
                </div>
                <button onClick={() => setSelected(null)} aria-label="Close" style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
                }}>
                  <CloseIc s={11} c="currentColor" sw={1.6} />
                </button>
              </div>
              {selected.email && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: T.ink4, marginBottom: 4,
                  }}>Email</div>
                  <a href={`mailto:${selected.email}`} style={{
                    fontFamily: MONO, fontSize: 12, color: ACCENT,
                    textDecoration: 'none', wordBreak: 'break-all',
                  }}>{selected.email}</a>
                </div>
              )}
              {selected.email2 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: T.ink4, marginBottom: 4,
                  }}>Secondary</div>
                  <a href={`mailto:${selected.email2}`} style={{
                    fontFamily: MONO, fontSize: 12, color: ACCENT,
                    textDecoration: 'none', wordBreak: 'break-all',
                  }}>{selected.email2}</a>
                </div>
              )}
              {selected.site && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: T.ink4, marginBottom: 4,
                  }}>Website</div>
                  <a href={`https://${selected.site}`} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: MONO, fontSize: 12, color: ACCENT, textDecoration: 'none',
                  }}>{selected.site}</a>
                </div>
              )}
              {selected.note && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: T.ink4, marginBottom: 6,
                  }}>Notes</div>
                  <div style={{
                    fontFamily: BODY, fontSize: 12.5, color: T.ink2, lineHeight: 1.6,
                  }}>{selected.note}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DB · Events function (calendar / list) ────────────────
   Calendar view: 12 month cards with event counts and accent dots.
   List view: chronological with category tags.                    */
function DBEventsFunction({ T, onClose }) {
  const { isMobile, isTablet } = useViewport();
  const [view, setView] = useState('calendar');
  const [query, setQuery] = useState('');
  const [activeMonth, setActiveMonth] = useState(null); // null = all
  const [selectedEvent, setSelectedEvent] = useState(null);

  const q = query.trim().toLowerCase();
  const filtered = EVENTS_DATA.filter(e => {
    if (q && !(
      (e.title || '').toLowerCase().includes(q) ||
      (e.note || '').toLowerCase().includes(q) ||
      (e.category || '').toLowerCase().includes(q) ||
      (e.month || '').toLowerCase().includes(q)
    )) return false;
    if (activeMonth && e.month !== activeMonth) return false;
    return true;
  });

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const eventsByMonth = months.map(m => ({
    name: m,
    events: EVENTS_DATA.filter(e => e.month === m),
  }));

  // Category palette — sourced from T.cat* tokens, varies per skin
  const catColor = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('award'))    return T.catOchre;
    if (c.includes('fashion'))  return T.catMauve;
    if (c.includes('music'))    return T.catGreen;
    if (c.includes('film'))     return T.catBlue;
    if (c.includes('cultural')) return T.catTan;
    if (c.includes('holiday'))  return T.catGrey;
    return T.ink3;
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 96,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : 1080,
        height: isMobile ? '100vh' : `min(800px, calc(100vh - ${isTablet ? 32 : 48}px))`,
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 18,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.dockShadow,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          flexShrink: 0,
          padding: isMobile ? '14px 16px' : '18px 24px',
          borderBottom: `1px solid ${T.dividerInk}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 4,
            }}>Function · Intelligence</div>
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: isMobile ? 18 : 22, color: T.ink, letterSpacing: '-0.015em',
            }}>Events · {filtered.length} of {EVENTS_DATA.length}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'transparent', border: `1px solid ${T.borderMd}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.ink3, flexShrink: 0,
          }}>
            <CloseIc s={12} c="currentColor" sw={1.6} />
          </button>
        </div>

        {/* Toolbar */}
        <div style={{
          flexShrink: 0,
          padding: isMobile ? '10px 16px' : '12px 24px',
          display: 'flex', alignItems: 'center',
          gap: 10, flexWrap: 'wrap',
          borderBottom: `1px solid ${T.dividerInk}`,
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'calendar', label: 'Calendar' },
              { id: 'list',     label: 'List'     },
            ].map(v => {
              const on = view === v.id;
              return (
                <button key={v.id} onClick={() => setView(v.id)} style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '6px 14px', borderRadius: 999,
                  background: on ? T.activeTabBg : 'transparent',
                  border: `1px solid ${on ? T.borderMd : 'transparent'}`,
                  color: on ? T.ink : T.ink3,
                  fontFamily: BODY, fontSize: 12, fontWeight: 500,
                  fontStyle: on ? 'normal' : 'italic',
                  letterSpacing: '-0.005em',
                }}>{v.label}</button>
              );
            })}
          </div>
          <div style={{
            flex: 1, minWidth: 180,
            display: 'flex', alignItems: 'center', gap: 8,
            background: T.inputBg, border: `1px solid ${T.borderMd}`,
            borderRadius: 8, padding: '7px 12px',
          }}>
            <SearchIc s={12} c={T.ink3} sw={1.5} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search events, categories…"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                flex: 1, color: T.ink, fontFamily: BODY, fontSize: 12.5,
                letterSpacing: '-0.005em', minWidth: 0,
              }}/>
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: T.ink3, padding: 0, display: 'flex',
              }}>
                <CloseIc s={11} c="currentColor" sw={1.6} />
              </button>
            )}
          </div>
          {activeMonth && (
            <button onClick={() => setActiveMonth(null)} style={{
              background: ACCENT, color: ACCENT_INK,
              border: 'none', borderRadius: 999, padding: '5px 12px',
              cursor: 'pointer', fontFamily: BODY, fontSize: 11, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {activeMonth} <CloseIc s={9} c="currentColor" sw={2} />
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {view === 'calendar' && (
            <div style={{
              padding: isMobile ? '14px 16px' : '18px 24px',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
              gap: 12,
            }}>
              {eventsByMonth.map(m => {
                const count = m.events.length;
                return (
                  <button key={m.name}
                    onClick={() => { setActiveMonth(m.name); setView('list'); }}
                    style={{
                      all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                      padding: '16px 18px', borderRadius: 14,
                      background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                      display: 'flex', flexDirection: 'column', gap: 12,
                      minHeight: 130,
                      transition: `all ${EASE_QUICK}`,
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{
                        fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                        fontSize: 18, color: T.ink, letterSpacing: '-0.015em',
                      }}>{m.name}</span>
                      <span style={{
                        fontFamily: MONO, fontSize: 11, color: ACCENT, fontWeight: 600,
                        letterSpacing: '0.08em',
                      }}>{count}</span>
                    </div>
                    {/* Category dots — shows quick visual sense of month */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {m.events.slice(0, 16).map((e, i) => (
                        <div key={i} title={e.title} style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: catColor(e.category),
                          opacity: 0.85,
                        }}/>
                      ))}
                      {count > 16 && (
                        <span style={{
                          fontFamily: MONO, fontSize: 9.5, color: T.ink4, marginLeft: 4,
                        }}>+{count - 16}</span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: BODY, fontStyle: 'italic', fontSize: 11.5,
                      color: T.ink3, lineHeight: 1.5,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{m.events[0]?.title || 'No events'}{m.events[1] ? `, ${m.events[1].title}` : ''}{count > 2 ? '…' : ''}</div>
                  </button>
                );
              })}
            </div>
          )}

          {view === 'list' && (
            <div style={{ padding: isMobile ? '14px 16px' : '18px 24px' }}>
              {filtered.length === 0 ? (
                <div style={{
                  padding: '40px 18px', textAlign: 'center',
                  fontFamily: BODY, fontStyle: 'italic', fontSize: 13, color: T.ink3,
                }}>No events match{query ? ` "${query}"` : ''}{activeMonth ? ` in ${activeMonth}` : ''}.</div>
              ) : filtered.map((e, i) => (
                <button key={i} onClick={() => setSelectedEvent(e)} style={{
                  all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  marginBottom: 6,
                }}>
                  <div style={{
                    width: 4, alignSelf: 'stretch', borderRadius: 2,
                    background: catColor(e.category), flexShrink: 0,
                  }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex', alignItems: 'baseline', gap: 10,
                      flexWrap: 'wrap', marginBottom: 4,
                    }}>
                      <span style={{
                        fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                        fontSize: 13, color: T.ink, letterSpacing: '-0.005em',
                      }}>{e.title}</span>
                      <span style={{
                        fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
                        letterSpacing: '0.10em', color: T.ink4, textTransform: 'uppercase',
                      }}>{e.month} · {e.date}{e.endDate && e.endDate !== 'nan' ? `–${e.endDate}` : ''}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: MONO, fontSize: 9, fontWeight: 600,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: catColor(e.category),
                        padding: '2px 7px', borderRadius: 4,
                        background: T.cardBg,
                      }}>{e.category}</span>
                      {e.note && (
                        <span style={{
                          fontFamily: BODY, fontSize: 11.5, color: T.ink3,
                          lineHeight: 1.5, flex: 1, minWidth: 0,
                        }}>{e.note}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected event detail panel */}
        {selectedEvent && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            background: 'rgba(0,0,0,0.40)',
            display: 'flex', justifyContent: 'flex-end',
          }} onClick={() => setSelectedEvent(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{
              width: isMobile ? '100%' : 380,
              height: '100%', overflowY: 'auto',
              background: T.cardBg,
              borderLeft: isMobile ? 'none' : `1px solid ${T.borderMd}`,
              padding: '20px 22px',
              boxShadow: T.dockShadow,
            }}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: 12, marginBottom: 18,
              }}>
                <div>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: catColor(selectedEvent.category), marginBottom: 4,
                  }}>{selectedEvent.category}</div>
                  <div style={{
                    fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                    fontSize: 20, color: T.ink, letterSpacing: '-0.015em', lineHeight: 1.2,
                  }}>{selectedEvent.title}</div>
                </div>
                <button onClick={() => setSelectedEvent(null)} aria-label="Close" style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
                }}>
                  <CloseIc s={11} c="currentColor" sw={1.6} />
                </button>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontFamily: MONO, fontSize: 9, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: T.ink4, marginBottom: 4,
                }}>When</div>
                <div style={{ fontFamily: BODY, fontSize: 13, color: T.ink, fontWeight: 500 }}>
                  {selectedEvent.month} {selectedEvent.date}
                  {selectedEvent.endDate && selectedEvent.endDate !== 'nan' ? ` – ${selectedEvent.endDate}` : ''}
                </div>
              </div>
              {selectedEvent.note && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: T.ink4, marginBottom: 4,
                  }}>Notes</div>
                  <div style={{
                    fontFamily: BODY, fontSize: 12.5, color: T.ink2, lineHeight: 1.6,
                  }}>{selectedEvent.note}</div>
                </div>
              )}
              {selectedEvent.source && (
                <div>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: T.ink4, marginBottom: 4,
                  }}>Source</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: T.ink3 }}>{selectedEvent.source}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DB · Functions browser (top-level overlay) ────────────
   Categories on the left (Intelligence / Agents / Models),
   Functions inside the active category on the right.
   Picking a Function dispatches up to the dashboard.            */
function DBFunctionsBrowser({ T, user, onClose, onPickFunction, onPickModel, initialCategory = 'intelligence' }) {
  const { isMobile, isTablet } = useViewport();
  const [activeCat, setActiveCat] = useState(initialCategory);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const cat = FUNCTIONS_CATEGORIES.find(c => c.id === activeCat) || FUNCTIONS_CATEGORIES[0];

  // Build items list per category. Models are mapped to the Function-card
  // shape so the rendering loop below stays uniform.
  const items = activeCat === 'intelligence'
    ? FUNCTIONS_INTELLIGENCE
    : activeCat === 'models'
      ? MODELS.map(m => ({
          id: m.id,
          label: m.label,
          desc: m.desc,
          count: m.sections.length,
          countLabel: 'sections',
          icon: m.icon,
          isModel: true,
        }))
      : [];

  // Icon mapping
  const iconFor = (id) => {
    if (id === 'users')    return <UsersIc s={16} c="currentColor" sw={1.5} />;
    if (id === 'calendar') return <CalIc   s={16} c="currentColor" sw={1.5} />;
    if (id === 'cal')      return <CalIc   s={16} c="currentColor" sw={1.5} />;
    if (id === 'card')     return <CardIc  s={16} c="currentColor" sw={1.5} />;
    if (id === 'spark')    return <SparkIc s={16} c="currentColor" sw={1.5} />;
    if (id === 'file')     return <FileIc  s={16} c="currentColor" sw={1.5} />;
    return <FolderIc s={16} c="currentColor" sw={1.5} />;
  };

  // Tier gate per item — Models category fires at the click level
  const handlePick = (item) => {
    if (item.isModel) {
      const gate = requireTier('model', { user });
      if (!gate.allowed) {
        window.dispatchEvent(new CustomEvent('nos:upgrade', { detail: { feature: 'model', ...gate } }));
        return;
      }
      onPickModel && onPickModel(item.id);
      return;
    }
    onPickFunction && onPickFunction(item.id);
  };
  const tierGate = activeCat === 'models' ? requireTier('model', { user }) : { allowed: true };
  const showTierLock = !tierGate.allowed;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 95,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : 880,
        height: isMobile ? '100vh' : `min(640px, calc(100vh - ${isTablet ? 32 : 48}px))`,
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 18,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.dockShadow,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden',
      }}>
        {/* Categories */}
        <div style={{
          width: isMobile ? '100%' : 240,
          flexShrink: 0,
          background: T.cardBgAlt,
          borderRight: isMobile ? 'none' : `1px solid ${T.dividerInk}`,
          borderBottom: isMobile ? `1px solid ${T.dividerInk}` : 'none',
          padding: isMobile ? '12px 14px' : '22px 14px',
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: isMobile ? 6 : 0,
          overflowX: isMobile ? 'auto' : 'visible',
        }}>
          {!isMobile && (
            <>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 18, color: T.ink, letterSpacing: '-0.015em',
                padding: '0 12px 16px',
                borderBottom: `1px solid ${T.dividerInk}`, marginBottom: 12,
              }}>Functions</div>
              <div style={{
                fontFamily: BODY, fontSize: 11.5, color: T.ink3, lineHeight: 1.5,
                padding: '0 12px 14px',
              }}>
                Building blocks for consistent creative output.
              </div>
            </>
          )}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            gap: isMobile ? 6 : 2, flex: 1, minWidth: 0,
          }}>
            {FUNCTIONS_CATEGORIES.map(c => {
              const on = activeCat === c.id;
              return (
                <button key={c.id} onClick={() => !c.soon && setActiveCat(c.id)}
                  disabled={c.soon}
                  style={{
                    all: 'unset', cursor: c.soon ? 'not-allowed' : 'pointer',
                    boxSizing: 'border-box',
                    padding: isMobile ? '7px 12px' : '10px 12px',
                    borderRadius: isMobile ? 999 : 8,
                    background: on
                      ? T.activeTabBg
                      : (isMobile ? T.cardBg : 'transparent'),
                    border: isMobile ? `1px solid ${on ? T.borderMd : 'transparent'}` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 8, flexShrink: 0,
                    opacity: c.soon ? 0.55 : 1,
                  }}>
                  <span style={{
                    fontFamily: BODY, fontStyle: on ? 'normal' : 'italic',
                    fontWeight: 500, fontSize: 12.5,
                    color: on ? T.ink : T.ink2, letterSpacing: '-0.005em',
                  }}>{c.label}</span>
                  {c.soon && (
                    <span style={{
                      fontFamily: MONO, fontSize: 8, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: T.ink4, padding: '2px 6px', borderRadius: 4,
                      border: `1px solid ${T.borderMd}`, flexShrink: 0,
                    }}>Soon</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Functions list (active category) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            flexShrink: 0,
            padding: isMobile ? '14px 16px 10px' : '20px 24px 14px',
            borderBottom: `1px solid ${T.dividerInk}`,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: 12,
          }}>
            <div>
              <div style={{
                fontFamily: MONO, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4, marginBottom: 4,
              }}>nOS · {cat.label}</div>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: isMobile ? 18 : 22, color: T.ink, letterSpacing: '-0.015em',
              }}>{cat.desc}</div>
            </div>
            <button onClick={onClose} aria-label="Close" style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'transparent', border: `1px solid ${T.borderMd}`,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
              flexShrink: 0,
            }}>
              <CloseIc s={12} c="currentColor" sw={1.6} />
            </button>
          </div>
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: isMobile ? '14px 16px' : '20px 24px',
          }}>
            {cat.soon ? (
              <div style={{
                padding: '60px 24px', textAlign: 'center',
                fontFamily: BODY, fontStyle: 'italic', fontSize: 14,
                color: T.ink3, lineHeight: 1.6,
              }}>
                <div style={{ fontSize: 32, color: ACCENT, marginBottom: 16 }}>✦</div>
                {cat.label} ships next.
              </div>
            ) : items.map(f => (
              <button key={f.id} onClick={() => handlePick(f)}
                style={{
                  all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                  width: '100%', padding: '16px 18px', borderRadius: 12,
                  background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  marginBottom: 10,
                  transition: `all ${EASE_QUICK}`,
                  opacity: showTierLock ? 0.65 : 1,
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = ACCENT}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = T.dividerInk}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: T.cardBg, border: `1px solid ${T.borderMd}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: ACCENT, flexShrink: 0,
                }}>{iconFor(f.icon)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'baseline',
                    gap: 10, marginBottom: 4, flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                      fontSize: 15, color: T.ink, letterSpacing: '-0.01em',
                    }}>{f.label}</span>
                    <span style={{
                      fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                      letterSpacing: '0.10em', color: ACCENT,
                    }}>{f.count.toLocaleString()} {f.countLabel}</span>
                    {showTierLock && f.isModel && (
                      <span style={{
                        fontFamily: MONO, fontSize: 8.5, fontWeight: 600,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: T.ink4, padding: '2px 7px', borderRadius: 4,
                        border: `1px solid ${T.borderMd}`,
                      }}>Pro</span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: BODY, fontSize: 12, color: T.ink3, lineHeight: 1.55,
                  }}>{f.desc}</div>
                </div>
                <ChevRight s={12} c={T.ink3} sw={1.6} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DB · Model Detail (read-only schema preview) ────────────
   Shows the full structure of a Model template — every section, its
   prompt, the type. The user previews here before instantiating.
   ──────────────────────────────────────────────────────────────── */
function DBModelDetail({ T, modelId, onClose, onUse }) {
  const { isMobile, isTablet } = useViewport();
  const mounted = useMountReveal();
  const model = MODELS.find(m => m.id === modelId);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!model) return null;

  const typeLabel = (PROJECT_TYPES.find(t => t.id === model.type) || {}).label || model.type;
  const sectionTypeLabel = (t) =>
    t === 'list'      ? 'List' :
    t === 'table'     ? 'Grid' :
    t === 'fields'    ? 'Fields' :
    t === 'grid'      ? 'Grid' :
    t === 'checklist' ? 'Checklist' :
    t === 'repeating' ? 'Blocks' :
    'Prose';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 96,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
      opacity: mounted ? 1 : 0,
      transition: `opacity ${EASE_DELIBERATE}`,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : 720,
        height: isMobile ? '100vh' : `min(720px, calc(100vh - ${isTablet ? 32 : 48}px))`,
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 18,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.dockShadow,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        ...revealStyle(mounted, 16),
      }}>
        {/* Header */}
        <div style={{
          flexShrink: 0,
          padding: isMobile ? '16px 18px' : '20px 28px',
          borderBottom: `1px solid ${T.dividerInk}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 4,
            }}>Model · {typeLabel}</div>
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: isMobile ? 20 : 26, color: T.ink,
              letterSpacing: '-0.02em', lineHeight: 1.2,
              marginBottom: 6,
            }}>{model.label}</div>
            <div style={{
              fontFamily: BODY, fontSize: 13, color: T.ink3, lineHeight: 1.55,
              maxWidth: 520,
            }}>{model.desc}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'transparent', border: `1px solid ${T.borderMd}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.ink3, flexShrink: 0,
            transition: `background ${EASE_QUICK}`,
          }}>
            <CloseIc s={12} c="currentColor" sw={1.6} />
          </button>
        </div>

        {/* Sections preview */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: isMobile ? '16px 18px' : '20px 28px',
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: T.ink4, marginBottom: 14,
          }}>Schema · {model.sections.length} sections</div>
          {model.sections.map((s, i) => {
            // Content-shape preview tokens — small caps showing what gets generated
            let shapeChips = [];
            if (s.type === 'fields' && s.fields) {
              shapeChips = s.fields.map(f => f.label);
            } else if (s.type === 'grid' && s.columns) {
              shapeChips = s.columns.map(c => c.label);
            } else if (s.type === 'repeating' && s.sub) {
              shapeChips = s.sub.map(f => f.label);
            } else if (s.type === 'checklist' && s.items) {
              shapeChips = [`${s.items.length} default items`];
            }
            const targetCount = s.type === 'repeating' ? s.targetCount
                              : s.type === 'grid' ? s.targetRows
                              : null;
            return (
              <div key={s.id} style={{
                padding: '14px 16px', borderRadius: 10,
                background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                marginBottom: 8,
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{
                  fontFamily: MONO, fontSize: 10, fontWeight: 600,
                  color: T.ink4, marginTop: 2, flexShrink: 0,
                  width: 24, textAlign: 'right',
                }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4,
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                      fontSize: 13.5, color: T.ink, letterSpacing: '-0.005em',
                    }}>{s.label}</span>
                    <span style={{
                      fontFamily: MONO, fontSize: 8.5, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: ACCENT,
                    }}>{sectionTypeLabel(s.type)}{targetCount ? ` · ${targetCount}` : ''}</span>
                  </div>
                  <div style={{
                    fontFamily: BODY, fontSize: 11.5, color: T.ink3, lineHeight: 1.55,
                    fontStyle: 'italic',
                  }}>{s.prompt}</div>
                  {shapeChips.length > 0 && (
                    <div style={{
                      marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4,
                    }}>
                      {shapeChips.slice(0, 8).map((c, ci) => (
                        <span key={ci} style={{
                          fontFamily: MONO, fontSize: 9, fontWeight: 500,
                          letterSpacing: '0.06em', color: T.ink3,
                          padding: '2px 7px', borderRadius: 4,
                          background: T.cardBg, border: `1px solid ${T.dividerInk}`,
                        }}>{c}</span>
                      ))}
                      {shapeChips.length > 8 && (
                        <span style={{
                          fontFamily: MONO, fontSize: 9, fontWeight: 500,
                          color: T.ink4, padding: '2px 4px',
                        }}>+{shapeChips.length - 8} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          flexShrink: 0,
          padding: isMobile ? '14px 18px' : '16px 28px',
          borderTop: `1px solid ${T.dividerInk}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
        }}>
          <GhostButton T={T} onClick={onClose}>← Back to models</GhostButton>
          <PrimaryButton T={T} onClick={() => onUse(model.id)}>
            Use this model <ChevRight s={11} c="currentColor" sw={2} />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ─── DB · Model Instantiate (project from template) ───────────
   Three-step variant of the project flow. The Model dictates the
   project type. Step 3 runs Claude to fill every section of the
   Model's schema with project-specific content.

   On completion: dispatches onCreate(project) with the full project
   record including project.modelId and project.modelSections (the
   filled schema). DBProjectDetail renders model-typed projects
   using these sections instead of the generic 5-section brief.
   ──────────────────────────────────────────────────────────────── */
function DBModelInstantiate({ T, modelId, tierContext = null, onCancel, onCreate }) {
  const { isMobile, isTablet } = useViewport();
  const model = MODELS.find(m => m.id === modelId);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    client: '',
    moods: [],
    spark: '',
  });
  const [genStatus, setGenStatus] = useState('idle'); // idle | working
  const [genPhase, setGenPhase] = useState('');
  const upd = patch => setForm(f => ({ ...f, ...patch }));

  const STEP_LABELS = ['Project name', 'Feeling'];
  const canContinue = () => {
    if (step === 1) return form.name.trim().length > 0;
    if (step === 2) return form.moods.length > 0;
    return true;
  };

  const generate = async () => {
    if (!model) return;
    setStep(3);
    setGenStatus('working');
    const phases = [
      'Reading your spark…',
      `Filling ${model.sections.length} sections…`,
      'Cross-checking against the framework…',
      'Polishing language…',
    ];
    let p = 0;
    setGenPhase(phases[0]);
    const interval = setInterval(() => {
      p = (p + 1) % phases.length;
      setGenPhase(phases[p]);
    }, 1400);

    // Build a schema-aware JSON shape description that teaches Claude
    // exactly what to return per section type.
    const schemaDescription = buildModelSchemaPrompt(model);

    const moodStr = form.moods.join(', ') || 'undefined';
    const promptText =
      `You are filling a "${model.label}" framework for a project.\n` +
      `Project name: ${form.name}\n` +
      `Client: ${form.client || 'Own work'}\n` +
      `Moods: ${moodStr}\n` +
      `Spark / context: ${form.spark || 'No additional context provided.'}\n\n` +
      `Return JSON only — one key per section id. The shape per section:\n\n` +
      schemaDescription;

    const raw = await callClaude(
      promptText,
      `${model.systemPrompt} Return valid JSON only. No markdown, no fences, no extra text. Make every value SPECIFIC to this project — never echo the prompt back.`,
      tierContext || {}
    );
    clearInterval(interval);

    // Tier gate fired — bail out, upgrade modal is opening
    if (raw && typeof raw === 'object' && raw.gated) {
      setStep(2); setGenStatus('idle');
      return;
    }

    let modelSections = {};
    try {
      modelSections = JSON.parse(String(raw).replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      // Fallback: build a default per section type so the project still creates
      model.sections.forEach(s => {
        modelSections[s.id] = defaultValueForSection(s);
      });
    }
    // Backfill any missing sections with defaults
    model.sections.forEach(s => {
      if (!(s.id in modelSections)) modelSections[s.id] = defaultValueForSection(s);
    });

    const project = {
      id: Date.now(),
      name: form.name,
      client: form.client || 'Own work',
      type: model.type,
      moods: form.moods,
      spark: form.spark,
      context: '',
      // Flag this project as Model-instantiated and store the filled schema
      modelId: model.id,
      modelLabel: model.label,
      modelSections,
      // Keep a minimal generic brief alongside, so legacy detail rendering
      // continues to work for users who don't yet support modelSections
      brief: {
        overview: modelSections.overview || modelSections.logline || modelSections.summary || form.spark,
        creativeDirection: 'See Model sections below.',
        visualDirection: moodStr,
        deliverables: '— See Model schema',
        timeline: 'See Model schema',
      },
      team: [],
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };
    setGenStatus('idle');
    onCreate(project);
  };

  const toggleMood = (m) => upd({
    moods: form.moods.includes(m)
      ? form.moods.filter(x => x !== m)
      : (form.moods.length >= 5 ? form.moods : [...form.moods, m])
  });

  if (!model) return null;
  const typeLabel = (PROJECT_TYPES.find(t => t.id === model.type) || {}).label || model.type;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 97,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
    }}>
      <div onClick={step < 3 ? onCancel : undefined} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : 720,
        height: isMobile ? '100vh' : `min(680px, calc(100vh - ${isTablet ? 32 : 48}px))`,
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 18,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.dockShadow,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        {step < 3 && (
          <div style={{
            flexShrink: 0,
            padding: isMobile ? '14px 16px' : '18px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: isMobile ? 10 : 14, borderBottom: `1px solid ${T.dividerInk}`,
          }}>
            <button onClick={onCancel} aria-label="Close" style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
            }}>
              <CloseIc s={12} c="currentColor" sw={1.6} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: MONO, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4, marginBottom: 3,
              }}>{model.label} · {String(step).padStart(2, '0')} / 02</div>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 16, color: T.ink, letterSpacing: '-0.01em',
              }}>{STEP_LABELS[step - 1]}</div>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {STEP_LABELS.map((_, i) => (
                <div key={i} style={{
                  height: 3, width: i + 1 === step ? 28 : 14, borderRadius: 2,
                  background: i + 1 <= step ? ACCENT : T.borderMd,
                  transition: `all ${EASE_DELIBERATE}`,
                }}/>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '24px 18px' : '32px 36px' }}>
          {step === 1 && (
            <>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: isMobile ? 22 : 28, color: T.ink, letterSpacing: '-0.025em',
                marginBottom: 8,
              }}>Name your project.</div>
              <div style={{
                fontFamily: BODY, fontSize: 13.5, color: T.ink3,
                lineHeight: 1.65, marginBottom: 28,
              }}>This Model is locked to <span style={{ color: T.ink2, fontStyle: 'italic' }}>{typeLabel}</span> — that's just the format, you can name the project anything.</div>
              <NPField T={T} label="Project name">
                <Input T={T} value={form.name}
                  onChange={v => upd({ name: v })}
                  placeholder="Working title is fine" autoFocus />
              </NPField>
              <NPField T={T} label="Client or partner"
                hint="Leave blank if this is personal work.">
                <Input T={T} value={form.client}
                  onChange={v => upd({ client: v })}
                  placeholder="e.g. Sbur Labs" />
              </NPField>
              <NPField T={T} label="The spark"
                hint="What's the project really about? Nia uses this to fill every section of the framework.">
                <NPTextarea T={T} value={form.spark}
                  onChange={v => upd({ spark: v })}
                  placeholder="Write whatever's true." rows={4} />
              </NPField>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: isMobile ? 22 : 28, color: T.ink, letterSpacing: '-0.025em',
                marginBottom: 8,
              }}>How should it feel?</div>
              <div style={{
                fontFamily: BODY, fontSize: 13.5, color: T.ink3,
                lineHeight: 1.65, marginBottom: 28,
              }}>Up to five mood words. These steer the tone Claude uses to fill the framework.</div>
              <NPField T={T} label={`Feeling · ${form.moods.length}/5`}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {MOODS.map(m => {
                    const on = form.moods.includes(m);
                    const dis = !on && form.moods.length >= 5;
                    return (
                      <button key={m} onClick={() => toggleMood(m)} disabled={dis}
                        style={{
                          all: 'unset', cursor: dis ? 'not-allowed' : 'pointer', boxSizing: 'border-box',
                          padding: '7px 13px', borderRadius: 999,
                          background: on ? ACCENT : T.cardBgAlt,
                          border: `1px solid ${on ? 'transparent' : T.borderMd}`,
                          color: on ? ACCENT_INK : (dis ? T.ink4 : T.ink2),
                          fontFamily: BODY, fontStyle: 'italic',
                          fontSize: 12, fontWeight: 500, letterSpacing: '-0.005em',
                          opacity: dis ? 0.5 : 1, transition: `all ${EASE_QUICK}`,
                        }}>{m}</button>
                    );
                  })}
                </div>
              </NPField>
            </>
          )}

          {step === 3 && (
            <div style={{
              minHeight: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 24, textAlign: 'center', padding: 40,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 28, color: ACCENT,
                animation: 'nia-pulse-scale 1.6s ease-in-out infinite',
              }}>✦</div>
              <div>
                <div style={{
                  fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: T.ink4, marginBottom: 10,
                }}>Filling {model.label}</div>
                <div style={{
                  fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 22, color: T.ink, letterSpacing: '-0.015em',
                  marginBottom: 16,
                }}>{form.name}</div>
                <div style={{
                  fontFamily: BODY, fontSize: 13, color: T.ink3, lineHeight: 1.6,
                  maxWidth: 380, margin: '0 auto',
                }}>{genPhase}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 3 && (
          <div style={{
            flexShrink: 0,
            borderTop: `1px solid ${T.dividerInk}`,
            padding: isMobile ? '12px 16px' : '14px 28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
          }}>
            <GhostButton T={T} onClick={() => step === 1 ? onCancel() : setStep(s => s - 1)}>
              {step === 1 ? 'Cancel' : '← Back'}
            </GhostButton>
            <PrimaryButton T={T}
              disabled={!canContinue()}
              onClick={() => step === 2 ? generate() : setStep(s => s + 1)}>
              {step === 2 ? 'Fill the framework ✦' : <>Continue <ChevRight s={11} c="currentColor" sw={2} /></>}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DB · File menu modal ──────────────────────────────────── */
function DBFileMenu({ T, onClose, onNewProject, projects = [], onOpenProject }) {
  const { isMobile, isTablet } = useViewport();
  const recents = projects.slice(0, 5);

  const ItemRow = ({ icon, label, hint, onClick, accent, disabled }) => (
    <button onClick={onClick} disabled={disabled} style={{
      all: 'unset', cursor: disabled ? 'not-allowed' : 'pointer',
      boxSizing: 'border-box', width: '100%',
      padding: '12px 14px', borderRadius: 10,
      background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
      display: 'flex', alignItems: 'center', gap: 12,
      marginBottom: 6, opacity: disabled ? 0.5 : 1,
      transition: `background ${EASE_QUICK}`,
    }}>
      <span style={{ display: 'flex', color: accent ? ACCENT : T.ink3, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 13, color: accent ? ACCENT : T.ink, letterSpacing: '-0.005em',
        }}>{label}</div>
        {hint && (
          <div style={{ fontFamily: BODY, fontSize: 11, color: T.ink3, marginTop: 2 }}>{hint}</div>
        )}
      </div>
      {disabled && (
        <span style={{
          fontFamily: MONO, fontSize: 8.5, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: T.ink4, padding: '2px 6px', borderRadius: 4,
          border: `1px solid ${T.borderMd}`, flexShrink: 0,
        }}>Soon</span>
      )}
    </button>
  );

  return (
    <DBModalShell T={T} isMobile={isMobile} isTablet={isTablet}
      title="File" eyebrow="nOS" onClose={onClose} maxWidth={560}>
      <div style={{
        fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: T.ink4, marginBottom: 10,
      }}>Create</div>
      <ItemRow accent
        icon={<NewIc s={14} c="currentColor" sw={1.6} />}
        label="New project"
        hint="Start the four-step Spark / What / Feeling / People flow"
        onClick={() => { onClose(); onNewProject(); }} />

      <div style={{
        fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: T.ink4, margin: '20px 0 10px',
      }}>Open recent</div>
      {recents.length === 0 ? (
        <div style={{
          padding: '20px 14px', textAlign: 'center',
          fontFamily: BODY, fontStyle: 'italic', fontSize: 12,
          color: T.ink4, background: T.cardBgAlt,
          border: `1px dashed ${T.borderMd}`, borderRadius: 10,
        }}>No projects yet — your first project will appear here.</div>
      ) : recents.map(p => (
        <ItemRow key={p.id}
          icon={<FileIc s={13} c="currentColor" sw={1.5} />}
          label={p.name}
          hint={`${p.client} · ${(PROJECT_TYPES.find(t => t.id === p.type) || {}).label || 'Brief'}`}
          onClick={() => { onClose(); onOpenProject(p.id); }} />
      ))}

      <div style={{
        fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: T.ink4, margin: '20px 0 10px',
      }}>Import / Export</div>
      <ItemRow disabled
        icon={<UploadIc s={13} c="currentColor" sw={1.5} />}
        label="Import a brief"
        hint="From PDF, DOCX, or another platform" />
      <ItemRow disabled
        icon={<FileIc s={13} c="currentColor" sw={1.5} />}
        label="Export project as PDF"
        hint="Branded, client-ready PDF — also pushes to Google Drive" />
      <ItemRow disabled
        icon={<FileIc s={13} c="currentColor" sw={1.5} />}
        label="Export workspace archive"
        hint="ZIP of all projects, briefs, and references" />
    </DBModalShell>
  );
}

/* ─── DB · Language picker modal ───────────────────────────── */
function DBLanguageModal({ T, user, setUser, onClose }) {
  const { isMobile, isTablet } = useViewport();
  const current = user.language || 'en';
  const pick = (code) => {
    setUser(u => ({ ...u, language: code }));
    onClose();
  };
  return (
    <DBModalShell T={T} isMobile={isMobile} isTablet={isTablet}
      title="Language" eyebrow="nOS" onClose={onClose} maxWidth={520}>
      <div style={{
        fontFamily: BODY, fontSize: 12.5, color: T.ink3,
        lineHeight: 1.55, marginBottom: 18,
      }}>
        Choose your interface language. Briefs you generate stay in
        whatever language you prompt Nia in — this only changes the
        chrome around them.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {LANGUAGES.map(l => {
          const active = current === l.code;
          return (
            <button key={l.code} onClick={() => pick(l.code)} style={{
              all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
              width: '100%', padding: '12px 14px', borderRadius: 10,
              background: active ? 'rgba(255,171,13,0.08)' : T.cardBgAlt,
              border: `1px solid ${active ? ACCENT : T.dividerInk}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, transition: `all ${EASE_QUICK}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, minWidth: 0 }}>
                <span style={{
                  fontFamily: BODY, fontWeight: 500, fontSize: 13.5,
                  color: T.ink, letterSpacing: '-0.005em',
                }}>{l.name}</span>
                <span style={{
                  fontFamily: BODY, fontStyle: 'italic', fontSize: 12,
                  color: T.ink3,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{l.native}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{
                  fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
                  letterSpacing: '0.10em', color: T.ink4,
                }}>{l.speakers}</span>
                {active && <CheckIc s={12} c={ACCENT} sw={2} />}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{
        marginTop: 18, padding: '10px 14px',
        background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
        borderRadius: 10,
        fontFamily: BODY, fontStyle: 'italic', fontSize: 11.5,
        color: T.ink3, lineHeight: 1.55,
      }}>Most translations are still being polished — interface strings outside English will gradually fill in over the coming releases.</div>
    </DBModalShell>
  );
}

/* ─── DB · Search palette ──────────────────────────────────── */
function DBSearchPalette({ T, projects = [], onClose, onOpenProject, onOpenSettings, onOpenLibrary, onOpenFunction, onOpenFunctions }) {
  const { isMobile, isTablet } = useViewport();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  // Build a flat searchable index across the platform
  const items = [
    ...projects.map(p => ({
      id: `p-${p.id}`,
      kind: 'Project',
      label: p.name,
      hint: `${p.client} · ${(PROJECT_TYPES.find(t => t.id === p.type) || {}).label || 'Brief'}`,
      onPick: () => { onClose(); onOpenProject(p.id); },
    })),
    // Functions — three live ones under Intelligence
    ...(onOpenFunction ? [
      {
        id: 'fn-contacts',  kind: 'Function', label: 'Contacts',
        hint: `${CONTACTS_DATA.length} media & industry contacts`,
        onPick: () => { onClose(); onOpenFunction('contacts'); },
      },
      {
        id: 'fn-events',    kind: 'Function', label: 'Events',
        hint: `${EVENTS_DATA.length} events in 2026 calendar`,
        onPick: () => { onClose(); onOpenFunction('events'); },
      },
      {
        id: 'fn-archetypes', kind: 'Function', label: 'Archetypes',
        hint: `${LIBRARY.length} creative production roles`,
        onPick: () => { onClose(); onOpenFunction('archetypes'); },
      },
      {
        id: 'fn-browse',    kind: 'Function', label: 'Browse all functions',
        hint: 'Open the Functions browser',
        onPick: () => { onClose(); onOpenFunctions && onOpenFunctions(); },
      },
    ] : []),
    ...LIBRARY.slice(0, 60).map(a => ({
      id: `a-${a.id}`,
      kind: 'Archetype',
      label: a.name,
      hint: a.tier + ' · ' + a.rate,
      onPick: () => { onClose(); onOpenLibrary(); },
    })),
    {
      id: 'set-account',  kind: 'Settings', label: 'Account settings',
      hint: 'Email, password, providers',
      onPick: () => { onClose(); onOpenSettings('account'); },
    },
    {
      id: 'set-profile',  kind: 'Settings', label: 'Profile settings',
      hint: 'Name, location, archetype',
      onPick: () => { onClose(); onOpenSettings('profile'); },
    },
    {
      id: 'set-prefs',    kind: 'Settings', label: 'Preferences',
      hint: 'Skin, language, density',
      onPick: () => { onClose(); onOpenSettings('preferences'); },
    },
    {
      id: 'set-billing',  kind: 'Settings', label: 'Billing',
      hint: 'Plan, payment, invoices',
      onPick: () => { onClose(); onOpenSettings('billing'); },
    },
    {
      id: 'set-privacy',  kind: 'Settings', label: 'Privacy & data',
      hint: 'Export data, third-party scrapes',
      onPick: () => { onClose(); onOpenSettings('privacy'); },
    },
  ];

  const filtered = q
    ? items.filter(it =>
        it.label.toLowerCase().includes(q) ||
        (it.hint || '').toLowerCase().includes(q) ||
        it.kind.toLowerCase().includes(q)
      ).slice(0, 24)
    : items.slice(0, 12);

  // Group by kind for display
  const grouped = filtered.reduce((acc, it) => {
    (acc[it.kind] = acc[it.kind] || []).push(it);
    return acc;
  }, {});

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 97,
      background: T.modalScrim,
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'flex-start',
      justifyContent: 'center',
      paddingTop: isMobile ? 0 : '12vh',
      padding: isMobile ? 0 : (isTablet ? '12vh 16px 16px' : '12vh 24px 24px'),
      fontFamily: BODY,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : 640,
        maxHeight: isMobile ? '100vh' : '70vh',
        height: isMobile ? '100vh' : 'auto',
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 14,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: T.dockShadow,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Search bar */}
        <div style={{
          flexShrink: 0, padding: isMobile ? '14px 14px' : '14px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${T.dividerInk}`,
        }}>
          <SearchIc s={15} c={T.ink3} sw={1.5} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            autoFocus
            placeholder="Search projects, archetypes, settings…"
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              flex: 1, color: T.ink,
              fontFamily: BODY, fontSize: 14, letterSpacing: '-0.005em',
            }}/>
          {!isMobile && (
            <span style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
              letterSpacing: '0.10em', color: T.ink4,
              padding: '2px 6px', borderRadius: 4,
              border: `1px solid ${T.borderMd}`,
            }}>ESC</span>
          )}
        </div>
        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: '32px 18px', textAlign: 'center',
              fontFamily: BODY, fontStyle: 'italic', fontSize: 13,
              color: T.ink3,
            }}>No results for "{query}"</div>
          ) : Object.entries(grouped).map(([kind, list]) => (
            <div key={kind} style={{ padding: '4px 0' }}>
              <div style={{
                padding: '6px 18px',
                fontFamily: MONO, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4,
              }}>{kind}</div>
              {list.map(it => (
                <button key={it.id} onClick={it.onPick} style={{
                  all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                  width: '100%', padding: '10px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  transition: `background ${EASE_QUICK}`,
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = T.dividerInk}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                      fontSize: 13, color: T.ink, letterSpacing: '-0.005em',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{it.label}</div>
                    {it.hint && (
                      <div style={{
                        fontFamily: BODY, fontSize: 11, color: T.ink3,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{it.hint}</div>
                    )}
                  </div>
                  <ChevRight s={11} c={T.ink4} sw={1.6} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── DB · Help center ─────────────────────────────────────── */
function DBHelpCenter({ T, onClose }) {
  const { isMobile, isTablet } = useViewport();
  const [tab, setTab] = useState('contact');
  const [openFaq, setOpenFaq] = useState(null);

  const tabs = [
    { id: 'contact',   label: 'Contact'        },
    { id: 'faqs',      label: 'FAQs'           },
    { id: 'developer', label: 'Developer tools'},
  ];

  return (
    <DBModalShell T={T} isMobile={isMobile} isTablet={isTablet}
      title="Get help" eyebrow="nOS" onClose={onClose} maxWidth={680}
      height={isMobile ? '100vh' : 'min(640px, calc(100vh - 48px))'}>
      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 22,
        borderBottom: `1px solid ${T.dividerInk}`,
        paddingBottom: 0,
      }}>
        {tabs.map(t => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              all: 'unset', cursor: 'pointer',
              padding: '8px 14px',
              fontFamily: BODY, fontSize: 12.5, fontWeight: 500,
              fontStyle: on ? 'normal' : 'italic',
              letterSpacing: '-0.005em',
              color: on ? T.ink : T.ink3,
              borderBottom: `2px solid ${on ? ACCENT : 'transparent'}`,
              marginBottom: -1,
            }}>{t.label}</button>
          );
        })}
      </div>

      {tab === 'contact' && (
        <>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 18, color: T.ink, letterSpacing: '-0.015em',
            marginBottom: 8,
          }}>Customer service</div>
          <div style={{
            fontFamily: BODY, fontSize: 13, color: T.ink3,
            lineHeight: 1.6, marginBottom: 22,
          }}>
            Real people, replying within one business day. Tell us what you
            need — bugs, billing questions, feature requests, or anything else.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Email support',     hint: 'support@nia.app — best for everything',          onClick: () => nosToast('Opening mail to support@nia.app') },
              { label: 'Live chat',         hint: 'Mon–Fri, 9am–6pm ET',                            onClick: () => nosToast('Live chat opens here', { eyebrow: 'Stub' }) },
              { label: 'Schedule a call',   hint: 'For Studio plan customers',                      onClick: () => nosToast('Calendly — Studio only', { eyebrow: 'Stub' }) },
              { label: 'Bug report',        hint: 'GitHub Issues — public-facing',                  onClick: () => nosToast('Opens GitHub Issues', { eyebrow: 'Stub' }) },
            ].map((row, i) => (
              <button key={i} onClick={row.onClick} style={{
                all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                width: '100%', padding: '12px 14px', borderRadius: 10,
                background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                transition: `background ${EASE_QUICK}`,
              }}>
                <div>
                  <div style={{
                    fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                    fontSize: 13, color: T.ink, letterSpacing: '-0.005em',
                  }}>{row.label}</div>
                  <div style={{ fontFamily: BODY, fontSize: 11, color: T.ink3, marginTop: 2 }}>{row.hint}</div>
                </div>
                <ChevRight s={11} c={T.ink4} sw={1.6} />
              </button>
            ))}
          </div>
        </>
      )}

      {tab === 'faqs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={i} style={{
                background: T.cardBgAlt,
                border: `1px solid ${T.dividerInk}`,
                borderRadius: 10, overflow: 'hidden',
              }}>
                <button onClick={() => setOpenFaq(open ? null : i)} style={{
                  all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                  width: '100%', padding: '12px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                }}>
                  <span style={{
                    fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                    fontSize: 13, color: T.ink, letterSpacing: '-0.005em',
                  }}>{f.q}</span>
                  <span style={{ display: 'flex', color: T.ink3, transform: open ? 'rotate(180deg)' : 'none', transition: `transform ${EASE_QUICK}` }}>
                    <ChevDown s={11} c="currentColor" sw={1.6} />
                  </span>
                </button>
                {open && (
                  <div style={{
                    padding: '0 14px 14px',
                    fontFamily: BODY, fontSize: 12.5, color: T.ink2, lineHeight: 1.65,
                  }}>{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'developer' && (
        <>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 18, color: T.ink, letterSpacing: '-0.015em',
            marginBottom: 8,
          }}>Developer tools</div>
          <div style={{
            fontFamily: BODY, fontSize: 13, color: T.ink3,
            lineHeight: 1.6, marginBottom: 22,
          }}>
            For developers building on or integrating with Nia. The public
            API is in private beta — request access below.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'API documentation',   hint: 'REST endpoints, auth, webhooks',           onClick: () => nosToast('Opens docs.nia.app', { eyebrow: 'Stub' }) },
              { label: 'API key management',  hint: 'Generate, revoke, scope access',           onClick: () => nosToast('Opens API key console', { eyebrow: 'Stub' }) },
              { label: 'Request beta access', hint: 'Currently invite-only',                    onClick: () => nosToast('Opens beta access form', { eyebrow: 'Stub' }) },
              { label: 'Webhook playground',  hint: 'Test integrations against your account',   onClick: () => nosToast('Opens webhook tester', { eyebrow: 'Stub' }) },
              { label: 'Status page',         hint: 'Real-time uptime and incident history',    onClick: () => nosToast('Opens status.nia.app', { eyebrow: 'Stub' }) },
              { label: 'Changelog (API)',     hint: 'Version history of public-facing changes', onClick: () => nosToast('Opens API changelog', { eyebrow: 'Stub' }) },
            ].map((row, i) => (
              <button key={i} onClick={row.onClick} style={{
                all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                width: '100%', padding: '12px 14px', borderRadius: 10,
                background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              }}>
                <div>
                  <div style={{
                    fontFamily: MONO, fontSize: 12, fontWeight: 500,
                    color: T.ink, letterSpacing: '-0.005em',
                  }}>{row.label}</div>
                  <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 11.5, color: T.ink3, marginTop: 2 }}>{row.hint}</div>
                </div>
                <ChevRight s={11} c={T.ink4} sw={1.6} />
              </button>
            ))}
          </div>
        </>
      )}
    </DBModalShell>
  );
}

/* ─── DB · Community modal ─────────────────────────────────── */
function DBCommunityModal({ T, onClose }) {
  const { isMobile, isTablet } = useViewport();
  return (
    <DBModalShell T={T} isMobile={isMobile} isTablet={isTablet}
      title="Community" eyebrow="nOS" onClose={onClose} maxWidth={580}>
      <div style={{
        fontFamily: BODY, fontSize: 13, color: T.ink3,
        lineHeight: 1.6, marginBottom: 22,
      }}>
        Where Nia users share work, swap templates, and learn from each other.
        Most channels are still being built — Discord is live now.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {COMMUNITY_CHANNELS.map(c => (
          <button key={c.id} onClick={() => c.soon ? null : nosToast(`Opens ${c.name}`, { eyebrow: 'Stub' })}
            disabled={c.soon}
            style={{
              all: 'unset', cursor: c.soon ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box', width: '100%',
              padding: '14px 16px', borderRadius: 12,
              background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              opacity: c.soon ? 0.6 : 1,
            }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 14, color: T.ink, letterSpacing: '-0.01em',
                marginBottom: 4,
              }}>{c.name}</div>
              <div style={{ fontFamily: BODY, fontSize: 12, color: T.ink3, lineHeight: 1.55 }}>{c.desc}</div>
            </div>
            {c.soon ? (
              <span style={{
                fontFamily: MONO, fontSize: 8.5, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4, padding: '3px 7px', borderRadius: 4,
                border: `1px solid ${T.borderMd}`, flexShrink: 0,
              }}>Soon</span>
            ) : (
              <ChevRight s={12} c={ACCENT} sw={1.8} />
            )}
          </button>
        ))}
      </div>
    </DBModalShell>
  );
}

/* ─── DB · Learn more modal ────────────────────────────────── */
function DBLearnMoreModal({ T, onClose }) {
  const { isMobile, isTablet } = useViewport();
  return (
    <DBModalShell T={T} isMobile={isMobile} isTablet={isTablet}
      title="Learn more" eyebrow="nOS" onClose={onClose} maxWidth={580}>
      <div style={{
        fontFamily: BODY, fontSize: 13, color: T.ink3,
        lineHeight: 1.6, marginBottom: 22,
      }}>
        Background reading on Nia, the principles we've built it on, and
        what we're working on next.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {LEARN_RESOURCES.map(r => (
          <button key={r.id}
            onClick={() => nosToast(`Opens ${r.title}`, { eyebrow: 'Stub' })}
            style={{
              all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
              width: '100%', padding: '14px 16px', borderRadius: 12,
              background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 14, color: T.ink, letterSpacing: '-0.01em',
                marginBottom: 4,
              }}>{r.title}</div>
              <div style={{ fontFamily: BODY, fontSize: 12, color: T.ink3, lineHeight: 1.55 }}>{r.desc}</div>
            </div>
            <ChevRight s={12} c={T.ink3} sw={1.6} />
          </button>
        ))}
      </div>
      <div style={{
        marginTop: 22, padding: '14px 16px',
        background: 'rgba(255,171,13,0.06)', border: '1px solid rgba(255,171,13,0.20)',
        borderRadius: 12,
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 9, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: ACCENT, marginBottom: 6,
        }}>nOS · v1.3 · May 2026</div>
        <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 12.5, color: T.ink2, lineHeight: 1.6 }}>
          Nia is built by Nia Technologies, Inc. — based in Boston, with
          contributors across South Africa and the United States.
        </div>
      </div>
    </DBModalShell>
  );
}

/* ─── DB · nOS dropdown menu (workspace customization) ──────── */
function DBNOSMenu({ T, skinKey, setSkinKey, onClose, onOpenSettings, onLogOut, user, onOpenFile, onOpenLanguage, onOpenSearch, onOpenHelp, onOpenCommunity, onOpenLearnMore }) {
  const { isMobile } = useViewport();
  const skins = [
    { key: 'pale',     swatch: '#FFFFFF' },
    { key: 'silver',   swatch: '#F1EFEC' },
    { key: 'metallic', swatch: 'linear-gradient(180deg,#F4F4F7 0%,#C3C1C7 100%)' },
    { key: 'charcoal', swatch: '#26261F' },
  ];
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: isMobile ? T.modalScrim : 'transparent',
      }}/>
      <div style={isMobile ? {
        position: 'fixed', left: 0, right: 0, bottom: 0,
        background: T.dockBg,
        borderTopLeftRadius: 18, borderTopRightRadius: 18,
        boxShadow: T.dockShadow,
        zIndex: 41, fontFamily: BODY, overflow: 'hidden',
        maxHeight: '85vh',
      } : {
        position: 'absolute', top: 56 - 6, left: 14,
        width: 268,
        background: T.dockBg, border: `1px solid ${T.borderMd}`,
        borderRadius: 12, boxShadow: T.dockShadow,
        zIndex: 41, fontFamily: BODY, overflow: 'hidden',
      }}>
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: T.borderMd }}/>
          </div>
        )}
        {/* Identity row */}
        <div style={{ padding: '14px 14px 12px', borderBottom: `1px solid ${T.dividerInk}`,
          display: 'flex', alignItems: 'center', gap: 10 }}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}/>
          ) : (
            <div style={{
              width: 30, height: 30, borderRadius: '50%', background: T.cardBgAlt,
              border: `1px solid ${T.borderMd}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: BODY, fontWeight: 600, fontSize: 11, color: T.ink2,
            }}>{(user?.name || 'N')[0]}</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: BODY, fontWeight: 500, fontSize: 12.5,
              color: T.ink, letterSpacing: '-0.005em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{user?.name || 'Your account'}</div>
            <div style={{
              fontFamily: BODY, fontSize: 10.5, color: T.ink3, fontStyle: 'italic',
            }}>{user?.archetypePrimary || 'Creative'}</div>
          </div>
        </div>

        {/* Skin */}
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 500, color: T.ink2 }}>Skin</span>
            <span style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 11, color: T.ink3 }}>{SKINS[skinKey].name}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {skins.map(s => {
              const active = skinKey === s.key;
              return (
                <button key={s.key} onClick={() => setSkinKey(s.key)} title={SKINS[s.key].name}
                  style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: s.swatch, border: `1px solid ${T.borderMd}`,
                    cursor: 'pointer', padding: 0,
                    boxShadow: active ? `0 0 0 2px ${T.dockBg}, 0 0 0 3px ${ACCENT}` : 'none',
                    transition: `box-shadow ${EASE_QUICK}`,
                  }}/>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ borderTop: `1px solid ${T.dividerInk}` }}>
          {[
            { label: 'File',         icon: <FileMenuIc s={13} c="currentColor" sw={1.5}/>, onClick: () => { onClose(); onOpenFile(); } },
            { label: 'Language',     icon: <GlobeIc s={13} c="currentColor" sw={1.5}/>,    onClick: () => { onClose(); onOpenLanguage(); } },
            { label: 'Search',       icon: <SearchIc s={13} c="currentColor" sw={1.5}/>,   onClick: () => { onClose(); onOpenSearch(); } },
            { label: 'Settings',     icon: <SettingsIc s={13} c="currentColor" sw={1.5}/>, onClick: () => { onClose(); onOpenSettings(); } },
            { label: 'Get help',     icon: <HelpIc s={13} c="currentColor" sw={1.5}/>,     onClick: () => { onClose(); onOpenHelp(); } },
            { label: 'Community',    icon: <CommunityIc s={13} c="currentColor" sw={1.5}/>,onClick: () => { onClose(); onOpenCommunity(); } },
            { label: 'Learn more',   icon: <LearnIc s={13} c="currentColor" sw={1.5}/>,    onClick: () => { onClose(); onOpenLearnMore(); } },
            { label: 'Browse community designs', icon: <PaletteIc s={13} c="currentColor" sw={1.5}/>, soon: true, onClick: onClose },
            { label: 'Sign out',     icon: <LogOutIc s={13} c="currentColor" sw={1.5}/>,   danger: true, onClick: () => { onClose(); onLogOut(); } },
          ].map((row, i) => (
            <button key={i} onClick={row.onClick} style={{
              all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
              width: '100%', padding: '11px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              borderTop: i > 0 ? `1px solid ${T.dividerInk}` : 'none',
              color: row.danger ? DANGER : T.ink2,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'flex', color: row.danger ? DANGER : T.ink3 }}>{row.icon}</span>
                <span style={{
                  fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 12, letterSpacing: '-0.005em',
                }}>{row.label}</span>
              </div>
              {row.soon && (
                <span style={{
                  fontFamily: MONO, fontSize: 8.5, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: T.ink4, padding: '2px 6px', borderRadius: 4,
                  border: `1px solid ${T.borderMd}`,
                }}>Soon</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── DB · project / archetype switcher ─────────────────────── */
function DBSwitcherSection({ T, label }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: T.ink4, padding: '10px 12px 6px',
    }}>{label}</div>
  );
}
function DBSwitcherRow({ T, label, meta, onClick, active }) {
  const [hover, setHover] = useState(false);
  return (
    <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        background: hover ? T.dividerInk : (active ? T.activeTabBg : 'transparent'),
        border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 10, transition: `background ${EASE_QUICK}`,
      }}>
      <span style={{
        fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
        fontSize: 12.5, color: T.ink2,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{label}</span>
      {meta && (
        <span style={{
          fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: active ? ACCENT : T.ink4, flexShrink: 0,
        }}>{active ? 'Active' : meta}</span>
      )}
    </button>
  );
}
function DBSwitcherAction({ T, icon, label, onClick, accent }) {
  const [hover, setHover] = useState(false);
  return (
    <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        background: accent ? (hover ? ACCENT : 'transparent') : (hover ? T.dividerInk : 'transparent'),
        border: accent ? `1px solid ${ACCENT}` : 'none', cursor: 'pointer',
        padding: '9px 12px', borderRadius: 8,
        display: 'flex', alignItems: 'center', gap: 10,
        color: accent ? (hover ? ACCENT_INK : ACCENT) : T.ink2,
        transition: `all ${EASE_QUICK}`, margin: '2px 0',
      }}>
      <span style={{ display: 'flex' }}>{icon}</span>
      <span style={{ fontFamily: BODY, fontStyle: 'italic', fontWeight: 500, fontSize: 12.5, letterSpacing: '-0.005em' }}>{label}</span>
    </button>
  );
}
function DBProjectSwitcher({ T, recents, projects, archetypes, currentArchetype, onClose, onPickProject, onViewAll, onNewProject, onPickArchetype, onViewAllArchetypes, onAddArchetype }) {
  const { isMobile } = useViewport();
  const [tab, setTab] = useState('projects');
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: isMobile ? T.modalScrim : T.modalScrimSoft,
        backdropFilter: 'blur(2px)',
      }}/>
      <div style={isMobile ? {
        position: 'fixed', left: 0, right: 0, bottom: 0,
        maxHeight: '85vh',
        background: T.dockBg,
        borderTopLeftRadius: 18, borderTopRightRadius: 18,
        boxShadow: T.dockShadow, zIndex: 41,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', fontFamily: BODY,
      } : {
        position: 'absolute', top: 56 + 6, left: '50%', transform: 'translateX(-50%)',
        width: 460, maxHeight: 540,
        background: T.dockBg, border: `1px solid ${T.borderMd}`,
        borderRadius: 16, boxShadow: T.dockShadow, zIndex: 41,
        display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: BODY,
      }}>
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: T.borderMd }}/>
          </div>
        )}
        <div style={{
          padding: '14px 16px', borderBottom: `1px solid ${T.dividerInk}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 14, color: T.ink, letterSpacing: '-0.01em',
          }}>Switch to…</div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
          }}>
            <CloseIc s={11} c="currentColor" sw={1.6} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: '8px 16px 0' }}>
          {[{ id: 'projects', label: 'Projects' }, { id: 'archetypes', label: 'Archetypes' }].map(t => {
            const on = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                fontFamily: BODY, fontSize: 12, fontWeight: 500, letterSpacing: '-0.005em',
                color: on ? T.activeTabInk : T.pillInk,
                background: on ? T.activeTabBg : 'transparent',
                border: `1px solid ${on ? T.borderMd : 'transparent'}`,
                padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
              }}>{t.label}</button>
            );
          })}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 12px' }}>
          {tab === 'projects' && (
            <>
              <DBSwitcherSection T={T} label="Recents" />
              {recents.map((r, i) => (
                <DBSwitcherRow key={`r${i}`} T={T} label={r.label || r}
                  meta={r.real === false ? 'Sample' : 'Opened recently'}
                  onClick={() => { onPickProject(r); onClose(); }} />
              ))}
              <DBSwitcherSection T={T} label="All projects" />
              {projects.map((p, i) => (
                <DBSwitcherRow key={`p${i}`} T={T} label={p.label || p}
                  meta={p.real === false ? 'Sample' : null}
                  onClick={() => { onPickProject(p); onClose(); }} />
              ))}
              <div style={{ height: 1, background: T.dividerInk, margin: '8px 8px' }} />
              <DBSwitcherAction T={T} icon={<ListIc s={13} c="currentColor" sw={1.5} />}
                label="View all projects" onClick={() => { onViewAll(); onClose(); }} />
              <DBSwitcherAction T={T} icon={<NewIc s={13} c="currentColor" sw={1.6} />}
                label="Create new project" accent
                onClick={() => { onNewProject(); onClose(); }} />
            </>
          )}
          {tab === 'archetypes' && (
            <>
              <DBSwitcherSection T={T} label={`Active · ${currentArchetype}`} />
              {archetypes.map(a => (
                <DBSwitcherRow key={a.id} T={T} label={a.name} meta={a.tier}
                  active={a.active}
                  onClick={() => { onPickArchetype(a); onClose(); }} />
              ))}
              <div style={{ height: 1, background: T.dividerInk, margin: '8px 8px' }} />
              <DBSwitcherAction T={T} icon={<ListIc s={13} c="currentColor" sw={1.5} />}
                label="View all 282 archetypes"
                onClick={() => { onViewAllArchetypes(); onClose(); }} />
              <DBSwitcherAction T={T} icon={<SparkPlusIc s={13} c="currentColor" sw={1.5} />}
                label="Add a new skill / switch archetype" accent
                onClick={() => { onAddArchetype(); onClose(); }} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── DB · resizer (drag handle for rails) ─────────────────── */
function DBResizer({ T, side, width, setWidth, collapsed, setCollapsed, min = 200, max = 460, openTo = 280 }) {
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const startX = e.clientX;
    const startW = collapsed ? 0 : width;
    const onMove = (ev) => {
      const delta = side === 'left' ? (ev.clientX - startX) : (startX - ev.clientX);
      const next = startW + delta;
      if (next < min - 40) setCollapsed(true);
      else { setCollapsed(false); setWidth(Math.min(max, Math.max(min, next))); }
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  if (collapsed) {
    return (
      <button onClick={() => { setCollapsed(false); setWidth(openTo); }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        title={side === 'left' ? 'Show left panel' : 'Show right panel'}
        style={{
          position: 'relative', width: 14, height: '100%',
          background: hover ? T.dividerInk : 'transparent',
          border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
          transition: `background ${EASE_QUICK}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.ink3,
        }}>
        {side === 'left' ? <ChevRight s={11} c="currentColor" sw={1.6} /> : <ChevLeft s={11} c="currentColor" sw={1.6} />}
      </button>
    );
  }
  return (
    <div onMouseDown={onMouseDown}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onDoubleClick={() => setCollapsed(true)}
      title="Drag to resize · double-click to collapse"
      style={{
        width: 6, flexShrink: 0, cursor: 'col-resize',
        position: 'relative', background: 'transparent', zIndex: 5,
      }}>
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: hover || dragging ? 2 : 1,
        background: hover || dragging ? ACCENT : T.dividerInk,
        transition: `background ${EASE_QUICK}, width ${EASE_QUICK}`,
      }}/>
      {(hover || dragging) && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 4, height: 36, background: ACCENT, borderRadius: 2, opacity: 0.9,
        }}/>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Project Workflow — End-to-end create / edit / delete / share

   Project record schema (the canonical shape stored in the
   projects[] array on the App Shell):

     {
       id:          number   // Date.now() at creation
       name:        string   // user-visible title
       client:      string   // client/partner or 'Own work'
       type:        string   // PROJECT_TYPES id (brand|editorial|...)
       moods:       string[] // selected MOODS, max 5
       spark:       string   // raw idea text
       context:     string   // refs / notes
       brief:       {                    // Claude-generated sections
         overview, creativeDirection,
         visualDirection, deliverables, timeline,
       }
       team:        archetype[]          // team roles assigned
       sharedWith:  { email, role }[]    // viewer/editor/admin
       createdAt:   ISO date
       updatedAt:   ISO date
       status:      'draft'|'active'|'delivered'|'archived'
     }
   ════════════════════════════════════════════════════════════════ */

/* ─── DB · field block helper for new project flow ────────── */
function NPField({ T, label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
      <label style={{
        fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: T.ink4,
      }}>{label}</label>
      {children}
      {hint && (
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontSize: 11,
          color: T.ink4, marginTop: 2,
        }}>{hint}</div>
      )}
    </div>
  );
}

/* ─── DB · multi-line input ────────────────────────────────── */
function NPTextarea({ T, value, onChange, placeholder, rows = 4 }) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea value={value || ''} onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      placeholder={placeholder} rows={rows}
      style={{
        background: T.inputBg,
        border: `1px solid ${focus ? ACCENT : T.borderMd}`,
        borderRadius: 10, padding: '12px 14px',
        fontFamily: BODY, fontSize: 13.5, lineHeight: 1.6,
        color: T.ink, letterSpacing: '-0.005em',
        resize: 'none', outline: 'none',
        width: '100%', boxSizing: 'border-box',
        transition: `border-color ${EASE_QUICK}`,
      }}/>
  );
}

/* ─── DB · New Project Flow (4 steps + generation) ─────────── */
function DBNewProjectFlow({ T, prefill = {}, onCancel, onCreate, tierContext = null }) {
  const { isMobile, isTablet } = useViewport();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    spark:   prefill.spark   || '',
    client:  prefill.client  || '',
    name:    prefill.name    || '',
    type:    prefill.type    || '',
    moods:   prefill.moods   || [],
    context: prefill.context || '',
    team:    prefill.team    || [],
  });
  const [genStatus, setGenStatus] = useState('idle'); // idle | working | error
  const [genPhase, setGenPhase] = useState('');
  const upd = patch => setForm(f => ({ ...f, ...patch }));

  const STEP_LABELS = ['The Spark', 'The What', 'The Feeling', 'The People'];
  const canContinue = () => {
    if (step === 1) return form.spark.trim().length > 3;
    if (step === 2) return !!(form.name.trim() && form.type);
    if (step === 3) return form.moods.length > 0;
    return true;
  };

  const generate = async () => {
    setStep(5);
    setGenStatus('working');
    const phases = [
      'Reading your spark…',
      'Mapping the format and feeling…',
      'Drafting overview and direction…',
      'Sequencing deliverables and timeline…',
    ];
    let p = 0;
    setGenPhase(phases[0]);
    const interval = setInterval(() => {
      p = (p + 1) % phases.length;
      setGenPhase(phases[p]);
    }, 1400);

    const moodStr = form.moods.join(', ') || 'undefined';
    const typeLabel = (PROJECT_TYPES.find(t => t.id === form.type) || {}).label || form.type;
    const raw = await callClaude(
      `Generate a creative production brief as JSON only. Project: "${form.name}", Client: "${form.client || 'Own work'}", Type: ${typeLabel}, Mood: ${moodStr}, Context: ${form.spark}. Additional notes: ${form.context || 'none'}. Return: {"overview":"2-3 sentences","creativeDirection":"2-3 sentences on vision","visualDirection":"2-3 sentences on aesthetic","deliverables":"specific items, one per line, each prefixed with —","timeline":"key milestones, one per line"}`,
      'Return valid JSON only. No markdown, no fences, no extra text.',
      tierContext || {}
    );
    clearInterval(interval);

    // Tier gate fired — bail out, upgrade modal is opening
    if (raw && typeof raw === 'object' && raw.gated) {
      setStep(4); setGenStatus('idle');
      return;
    }

    let brief = {};
    try {
      brief = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      brief = {
        overview: form.spark,
        creativeDirection: 'To be refined.',
        visualDirection: moodStr || 'TBD',
        deliverables: '— TBD',
        timeline: 'TBD',
      };
    }
    const project = {
      id: Date.now(),
      name: form.name,
      client: form.client || 'Own work',
      type: form.type,
      moods: form.moods,
      spark: form.spark,
      context: form.context,
      brief,
      team: form.team,
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };
    setGenStatus('idle');
    onCreate(project);
  };

  const toggleMood = (m) => upd({
    moods: form.moods.includes(m)
      ? form.moods.filter(x => x !== m)
      : (form.moods.length >= 5 ? form.moods : [...form.moods, m])
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 95,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
    }}>
      <div onClick={step < 5 ? onCancel : undefined} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : 720,
        height: isMobile ? '100vh' : `min(720px, calc(100vh - ${isTablet ? 32 : 48}px))`,
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 18,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.dockShadow,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        {step < 5 && (
          <div style={{
            flexShrink: 0,
            padding: isMobile ? '14px 16px' : '18px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: isMobile ? 10 : 14, borderBottom: `1px solid ${T.dividerInk}`,
          }}>
            <button onClick={onCancel} aria-label="Close" style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
            }}>
              <CloseIc s={12} c="currentColor" sw={1.6} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: MONO, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4, marginBottom: 3,
              }}>New project · {String(step).padStart(2, '0')} / 04</div>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 16, color: T.ink, letterSpacing: '-0.01em',
              }}>{STEP_LABELS[step - 1]}</div>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {STEP_LABELS.map((_, i) => (
                <div key={i} style={{
                  height: 3, width: i + 1 === step ? 28 : 14, borderRadius: 2,
                  background: i + 1 <= step ? ACCENT : T.borderMd,
                  transition: `all ${EASE_DELIBERATE}`,
                }}/>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '24px 18px' : '32px 36px' }}>
          {step === 1 && (
            <>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: isMobile ? 22 : 28, color: T.ink, letterSpacing: '-0.025em',
                marginBottom: 8,
              }}>Where did this begin?</div>
              <div style={{
                fontFamily: BODY, fontSize: 13.5, color: T.ink3,
                lineHeight: 1.65, marginBottom: 28,
              }}>The start of a project is rarely clean. Write what's true, not what's tidy.</div>
              <NPField T={T} label="The spark">
                <NPTextarea T={T} value={form.spark}
                  onChange={v => upd({ spark: v })}
                  placeholder="What's in your head right now? Don't edit yourself — write it as it arrives." rows={5} />
              </NPField>
              <NPField T={T} label="Client or partner"
                hint="Leave blank if this is personal work.">
                <Input T={T} value={form.client}
                  onChange={v => upd({ client: v })}
                  placeholder="e.g. Sbur Labs" />
              </NPField>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: isMobile ? 22 : 28, color: T.ink, letterSpacing: '-0.025em',
                marginBottom: 8,
              }}>What is this?</div>
              <div style={{
                fontFamily: BODY, fontSize: 13.5, color: T.ink3,
                lineHeight: 1.65, marginBottom: 28,
              }}>Give it a name and a shape. The name can change later.</div>
              <NPField T={T} label="Project name">
                <Input T={T} value={form.name}
                  onChange={v => upd({ name: v })}
                  placeholder="Working title is fine" autoFocus />
              </NPField>
              <NPField T={T} label="Format"
                hint="This drives Canvas section pre-selection and brief depth.">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {PROJECT_TYPES.map(t => {
                    const on = form.type === t.id;
                    return (
                      <button key={t.id} onClick={() => upd({ type: t.id })}
                        style={{
                          all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                          padding: '8px 14px', borderRadius: 999,
                          background: on ? ACCENT : T.cardBgAlt,
                          border: `1px solid ${on ? 'transparent' : T.borderMd}`,
                          color: on ? ACCENT_INK : T.ink2,
                          fontFamily: BODY, fontSize: 12, fontWeight: 500,
                          letterSpacing: '-0.005em',
                          transition: `all ${EASE_QUICK}`,
                        }}>{t.label}</button>
                    );
                  })}
                </div>
              </NPField>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: isMobile ? 22 : 28, color: T.ink, letterSpacing: '-0.025em',
                marginBottom: 8,
              }}>How should it feel?</div>
              <div style={{
                fontFamily: BODY, fontSize: 13.5, color: T.ink3,
                lineHeight: 1.65, marginBottom: 28,
              }}>Pick up to five mood words. These become the emotional anchors for the brief.</div>
              <NPField T={T} label={`Feeling · ${form.moods.length}/5`}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {MOODS.map(m => {
                    const on = form.moods.includes(m);
                    const dis = !on && form.moods.length >= 5;
                    return (
                      <button key={m} onClick={() => toggleMood(m)} disabled={dis}
                        style={{
                          all: 'unset', cursor: dis ? 'not-allowed' : 'pointer', boxSizing: 'border-box',
                          padding: '7px 13px', borderRadius: 999,
                          background: on ? ACCENT : T.cardBgAlt,
                          border: `1px solid ${on ? 'transparent' : T.borderMd}`,
                          color: on ? ACCENT_INK : (dis ? T.ink4 : T.ink2),
                          fontFamily: BODY, fontStyle: 'italic',
                          fontSize: 12, fontWeight: 500, letterSpacing: '-0.005em',
                          opacity: dis ? 0.5 : 1, transition: `all ${EASE_QUICK}`,
                        }}>{m}</button>
                    );
                  })}
                </div>
              </NPField>
              <NPField T={T} label="Visual references"
                hint="Optional — names of directors, films, photographers, songs, anything that anchors the visual world.">
                <NPTextarea T={T} value={form.context}
                  onChange={v => upd({ context: v })}
                  placeholder="e.g. Wong Kar-wai, Rinko Kawauchi, that one Tirzah video…" rows={3} />
              </NPField>
            </>
          )}

          {step === 4 && (
            <>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: isMobile ? 22 : 28, color: T.ink, letterSpacing: '-0.025em',
                marginBottom: 8,
              }}>Who's making it?</div>
              <div style={{
                fontFamily: BODY, fontSize: 13.5, color: T.ink3,
                lineHeight: 1.65, marginBottom: 28,
              }}>Optional — pick the disciplines you'll need. You can build the team in detail later.</div>
              <NPField T={T} label={`Disciplines · ${form.team.length} selected`}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
                  maxHeight: 320, overflowY: 'auto', paddingRight: 4,
                }}>
                  {ARCHETYPES_LIST.map(a => {
                    const on = form.team.includes(a.name);
                    return (
                      <button key={a.name} onClick={() => upd({
                        team: on ? form.team.filter(n => n !== a.name) : [...form.team, a.name]
                      })} style={{
                        all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                        padding: '10px 12px', borderRadius: 8,
                        background: on ? 'rgba(255,171,13,0.08)' : T.cardBgAlt,
                        border: `1px solid ${on ? ACCENT : T.dividerInk}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 8, transition: `all ${EASE_QUICK}`,
                      }}>
                        <span style={{
                          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                          fontSize: 12, color: T.ink, letterSpacing: '-0.005em',
                        }}>{a.name}</span>
                        {on && <CheckIc s={11} c={ACCENT} sw={2} />}
                      </button>
                    );
                  })}
                </div>
              </NPField>
            </>
          )}

          {step === 5 && (
            <div style={{
              minHeight: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 24, textAlign: 'center', padding: 40,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 28, color: ACCENT,
                animation: 'nia-pulse 1.6s ease-in-out infinite',
              }}>✦</div>
              <style>{`@keyframes nia-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.7; } }`}</style>
              <div>
                <div style={{
                  fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: T.ink4, marginBottom: 10,
                }}>Generating your brief</div>
                <div style={{
                  fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 22, color: T.ink, letterSpacing: '-0.015em',
                  marginBottom: 16,
                }}>{form.name}</div>
                <div style={{
                  fontFamily: BODY, fontSize: 13, color: T.ink3, lineHeight: 1.6,
                  maxWidth: 380, margin: '0 auto',
                }}>{genPhase}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 5 && (
          <div style={{
            flexShrink: 0,
            borderTop: `1px solid ${T.dividerInk}`,
            padding: isMobile ? '12px 16px' : '14px 28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
          }}>
            <GhostButton T={T} onClick={() => step === 1 ? onCancel() : setStep(s => s - 1)}>
              {step === 1 ? 'Cancel' : '← Back'}
            </GhostButton>
            <PrimaryButton T={T}
              disabled={!canContinue()}
              onClick={() => step === 4 ? generate() : setStep(s => s + 1)}>
              {step === 4 ? 'Generate brief ✦' : <>Continue <ChevRight s={11} c="currentColor" sw={2} /></>}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DB · Project Detail / Edit overlay ────────────────────
   Opens when a project is selected. Shows the brief sections, lets the
   user inline-edit the title, format, moods, and brief copy. Holds the
   delete and share actions in its header.                          */
/* ─── DB · Model section renderers ─────────────────────────────
   Type-aware renderers used by DBProjectDetail when project.modelId
   is set. Each section type (prose, list, fields, grid, checklist,
   repeating) gets its own visual treatment in both view and edit mode.

   Contract for each renderer:
     props: { T, section, value, editing, onChange }
     value: shape per section type — string, object, array depending
     onChange(nextValue): commits the updated value
   ───────────────────────────────────────────────────────────────── */
function DBModelSectionRenderer({ T, section, value, editing, onChange }) {
  switch (section.type) {
    case 'prose':
    case 'list':
      return <DBMSProse T={T} section={section} value={value} editing={editing} onChange={onChange} />;
    case 'fields':
      return <DBMSFields T={T} section={section} value={value} editing={editing} onChange={onChange} />;
    case 'grid':
      return <DBMSGrid T={T} section={section} value={value} editing={editing} onChange={onChange} />;
    case 'checklist':
      return <DBMSChecklist T={T} section={section} value={value} editing={editing} onChange={onChange} />;
    case 'repeating':
      return <DBMSRepeating T={T} section={section} value={value} editing={editing} onChange={onChange} />;
    default:
      return null;
  }
}

/* Prose / list — single multi-line value rendered with whitespace preserved */
function DBMSProse({ T, section, value, editing, onChange }) {
  const v = typeof value === 'string' ? value : '';
  if (editing) {
    return <NPTextarea T={T} value={v} onChange={onChange}
      placeholder={section.prompt} rows={section.type === 'list' ? 6 : 4} />;
  }
  return v
    ? <div style={{
        fontFamily: BODY, fontSize: 13.5, lineHeight: 1.7,
        color: T.ink2, whiteSpace: 'pre-wrap',
      }}>{v}</div>
    : <DBMSEmpty T={T} />;
}

/* Fields — labelled key/value table */
function DBMSFields({ T, section, value, editing, onChange }) {
  const v = (value && typeof value === 'object' && !Array.isArray(value)) ? value : {};
  const fields = section.fields || [];
  return (
    <div style={{
      borderRadius: 10, overflow: 'hidden',
      border: `1px solid ${T.dividerInk}`,
    }}>
      {fields.map((f, i) => (
        <div key={f.id} style={{
          display: 'flex',
          borderBottom: i < fields.length - 1 ? `1px solid ${T.dividerInk}` : 'none',
          background: i % 2 === 0 ? T.cardBgAlt : T.cardBg,
        }}>
          <div style={{
            width: 200, flexShrink: 0,
            padding: '10px 14px',
            borderRight: `1px solid ${T.dividerInk}`,
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 12, color: T.ink2, letterSpacing: '-0.005em',
          }}>{f.label}</div>
          <div style={{ flex: 1, padding: '10px 14px', minWidth: 0 }}>
            {editing ? (
              <Input T={T} value={v[f.id] || ''}
                onChange={(nv) => onChange({ ...v, [f.id]: nv })}
                placeholder={f.hint || ''} />
            ) : (
              <div style={{
                fontFamily: BODY, fontSize: 12.5, lineHeight: 1.55,
                color: v[f.id] ? T.ink : T.ink4,
                fontStyle: v[f.id] ? 'normal' : 'italic',
              }}>{v[f.id] || (f.hint || 'Empty')}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Grid — repeating data table with named columns */
function DBMSGrid({ T, section, value, editing, onChange }) {
  const rows = Array.isArray(value) ? value : [];
  const columns = section.columns || [];
  const updateRow = (idx, col, nv) => {
    const next = rows.slice();
    next[idx] = { ...(next[idx] || {}), [col]: nv };
    onChange(next);
  };
  const addRow = () => {
    const blank = {};
    columns.forEach(c => { blank[c.id] = ''; });
    onChange([...rows, blank]);
  };
  const removeRow = (idx) => {
    onChange(rows.filter((_, i) => i !== idx));
  };
  return (
    <div style={{
      borderRadius: 10, border: `1px solid ${T.dividerInk}`,
      overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontFamily: BODY, fontSize: 12,
        }}>
          <thead>
            <tr style={{ background: T.cardBgAlt }}>
              {columns.map(c => (
                <th key={c.id} style={{
                  padding: '8px 12px', textAlign: 'left',
                  fontFamily: MONO, fontSize: 9, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: T.ink3,
                  borderBottom: `1px solid ${T.dividerInk}`,
                }}>{c.label}</th>
              ))}
              {editing && <th style={{ width: 36 }}/>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length + (editing ? 1 : 0)} style={{
                padding: '16px 12px', textAlign: 'center',
                fontFamily: BODY, fontStyle: 'italic', fontSize: 12, color: T.ink4,
              }}>No rows.</td></tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} style={{
                background: i % 2 === 0 ? T.cardBg : T.cardBgAlt,
              }}>
                {columns.map(c => (
                  <td key={c.id} style={{
                    padding: '8px 12px', verticalAlign: 'top',
                    borderBottom: i < rows.length - 1 ? `1px solid ${T.dividerInk}` : 'none',
                  }}>
                    {editing ? (
                      <input type="text" value={row[c.id] || ''}
                        onChange={(e) => updateRow(i, c.id, e.target.value)}
                        style={{
                          width: '100%', minWidth: 80,
                          background: 'transparent', border: 'none',
                          padding: 0, fontFamily: BODY, fontSize: 12,
                          color: T.ink, outline: 'none',
                        }}/>
                    ) : (
                      <span style={{
                        color: row[c.id] ? T.ink2 : T.ink4,
                        fontStyle: row[c.id] ? 'normal' : 'italic',
                      }}>{row[c.id] || '—'}</span>
                    )}
                  </td>
                ))}
                {editing && (
                  <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                    <button onClick={() => removeRow(i)} title="Remove row" style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: T.ink4, padding: 4, display: 'flex',
                    }}>
                      <CloseIc s={10} c="currentColor" sw={1.5} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div style={{
          padding: 8, background: T.cardBgAlt,
          borderTop: `1px solid ${T.dividerInk}`,
        }}>
          <button onClick={addRow} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: ACCENT, padding: '4px 10px',
          }}>+ Add row</button>
        </div>
      )}
    </div>
  );
}

/* Checklist — bullet items with checkboxes */
function DBMSChecklist({ T, section, value, editing, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const toggle = (idx) => {
    const next = items.map((it, i) => i === idx ? { ...it, checked: !it.checked } : it);
    onChange(next);
  };
  const updateText = (idx, text) => {
    const next = items.map((it, i) => i === idx ? { ...it, text } : it);
    onChange(next);
  };
  const addItem = () => onChange([...items, { text: '', checked: false }]);
  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.length === 0 && (
        <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 12, color: T.ink4 }}>No items.</div>
      )}
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 10px', borderRadius: 6,
        }}>
          <button onClick={() => toggle(i)} style={{
            width: 16, height: 16, borderRadius: 4,
            border: `1.5px solid ${item.checked ? ACCENT : T.borderMd}`,
            background: item.checked ? ACCENT : 'transparent',
            cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: `all ${EASE_QUICK}`,
          }}>
            {item.checked && <CheckIc s={9} c={ACCENT_INK} sw={2.5}/>}
          </button>
          {editing ? (
            <>
              <input type="text" value={item.text || ''}
                onChange={(e) => updateText(i, e.target.value)}
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  fontFamily: BODY, fontSize: 12.5, color: T.ink,
                  outline: 'none', padding: 0,
                  textDecoration: item.checked ? 'line-through' : 'none',
                }}/>
              <button onClick={() => removeItem(i)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: T.ink4, padding: 2, display: 'flex',
              }}>
                <CloseIc s={10} c="currentColor" sw={1.5} />
              </button>
            </>
          ) : (
            <span style={{
              flex: 1, fontFamily: BODY, fontSize: 12.5, color: T.ink2,
              textDecoration: item.checked ? 'line-through' : 'none',
              opacity: item.checked ? 0.55 : 1,
            }}>{item.text}</span>
          )}
        </div>
      ))}
      {editing && (
        <button onClick={addItem} style={{
          alignSelf: 'flex-start', marginTop: 6,
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: ACCENT, padding: '4px 10px',
        }}>+ Add item</button>
      )}
    </div>
  );
}

/* Repeating — sub-schema instances rendered as cards */
function DBMSRepeating({ T, section, value, editing, onChange }) {
  const blocks = Array.isArray(value) ? value : [];
  const updateBlock = (idx, sub, nv) => {
    const next = blocks.slice();
    next[idx] = { ...(next[idx] || {}), [sub]: nv };
    onChange(next);
  };
  const addBlock = () => {
    const blank = {};
    (section.sub || []).forEach(f => { blank[f.id] = ''; });
    onChange([...blocks, blank]);
  };
  const removeBlock = (idx) => onChange(blocks.filter((_, i) => i !== idx));

  const instanceLabel = section.instanceLabel || 'Block';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {blocks.length === 0 && (
        <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 12, color: T.ink4 }}>No {instanceLabel.toLowerCase()}s.</div>
      )}
      {blocks.map((block, i) => (
        <div key={i} style={{
          padding: '12px 14px', borderRadius: 10,
          background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 4,
          }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: ACCENT,
            }}>{instanceLabel} {String(i + 1).padStart(2, '0')}</div>
            {editing && (
              <button onClick={() => removeBlock(i)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: T.ink4, padding: 2, display: 'flex',
              }}>
                <CloseIc s={11} c="currentColor" sw={1.5} />
              </button>
            )}
          </div>
          {(section.sub || []).map(f => (
            <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{
                fontFamily: MONO, fontSize: 8.5, fontWeight: 500,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: T.ink4,
              }}>{f.label}</div>
              {editing ? (
                <Input T={T} value={block[f.id] || ''}
                  onChange={(nv) => updateBlock(i, f.id, nv)}
                  placeholder={f.label} />
              ) : (
                <div style={{
                  fontFamily: BODY, fontSize: 12.5, color: block[f.id] ? T.ink2 : T.ink4,
                  fontStyle: block[f.id] ? 'normal' : 'italic', lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                }}>{block[f.id] || 'Empty'}</div>
              )}
            </div>
          ))}
        </div>
      ))}
      {editing && (
        <button onClick={addBlock} style={{
          alignSelf: 'flex-start',
          background: 'transparent', border: `1px dashed ${T.borderMd}`,
          borderRadius: 8, cursor: 'pointer',
          fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: T.ink3, padding: '8px 14px',
          transition: `all ${EASE_QUICK}`,
        }}>+ Add {instanceLabel.toLowerCase()}</button>
      )}
    </div>
  );
}

/* Empty state for prose/list when value is empty */
function DBMSEmpty({ T }) {
  return (
    <div style={{
      fontFamily: BODY, fontStyle: 'italic', fontSize: 12.5, color: T.ink4,
      padding: '8px 0',
    }}>Empty</div>
  );
}

/* ─── DB · Section action row ───────────────────────────────────
   The pill cluster sitting alongside each Model section header in
   view mode. Two buttons: Edit (toggles per-section edit) and
   Regenerate (re-runs Claude on this section only). Edit becomes
   "Done" while a section is being edited.
   ─────────────────────────────────────────────────────────────── */
function DBSectionActionRow({ T, isEditing, onToggleEdit, onRegenerate, isRegenerating, showRegenerate = true, showEdit = true }) {
  const ButtonShell = ({ onClick, disabled, accent, children }) => (
    <button onClick={onClick} disabled={disabled}
      style={{
        background: accent ? 'rgba(255,171,13,0.10)' : 'transparent',
        border: `1px solid ${accent ? 'rgba(255,171,13,0.35)' : T.borderMd}`,
        borderRadius: 999, padding: '4px 10px',
        cursor: disabled ? 'wait' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: MONO, fontSize: 9, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: disabled ? T.ink4 : (accent ? ACCENT : T.ink3),
        transition: `border-color ${EASE_QUICK}, color ${EASE_QUICK}, background ${EASE_QUICK}`,
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (!accent) e.currentTarget.style.borderColor = ACCENT;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        if (!accent) e.currentTarget.style.borderColor = T.borderMd;
      }}>
      {children}
    </button>
  );

  return (
    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
      {showEdit && (
        <ButtonShell onClick={onToggleEdit} accent={isEditing}>
          <span style={{ color: isEditing ? ACCENT : T.ink4, display: 'flex' }}>
            <EditIc s={9} c="currentColor" sw={2} />
          </span>
          {isEditing ? 'Done' : 'Edit'}
        </ButtonShell>
      )}
      {showRegenerate && (
        <ButtonShell onClick={onRegenerate} disabled={isRegenerating}>
          <span style={{
            color: ACCENT, display: 'flex',
            animation: isRegenerating ? 'nia-pulse-scale 1.4s ease-in-out infinite' : 'none',
          }}>
            <SparkIc s={9} c="currentColor" sw={2} />
          </span>
          {isRegenerating ? 'Refilling' : 'Regenerate'}
        </ButtonShell>
      )}
    </div>
  );
}

/* ─── DB · Project detail section nav ─────────────────────────
   The header strip for paginated Model projects. Shows the active
   section's name as a heading, with prev/next arrow buttons on each
   side. Click the heading to open a dropdown that lists every section
   for jumping. Replaces the previous numeric chip strip — better for
   orientation when sections have meaningful names.
   ─────────────────────────────────────────────────────────────── */
function DBProjectDetailSectionNav({ T, sections, activeIdx, setActiveIdx }) {
  const [open, setOpen] = useState(false);
  const active = sections[activeIdx];
  const total = sections.length;
  const canPrev = activeIdx > 0;
  const canNext = activeIdx < total - 1;

  // Close dropdown on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) {
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [open]);

  const ArrowBtn = ({ disabled, dir, onClick }) => (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      title={disabled ? '' : (dir === 'prev' ? 'Previous section' : 'Next section')}
      style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'transparent', border: `1px solid ${disabled ? T.dividerInk : T.borderMd}`,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: disabled ? T.ink4 : T.ink3, opacity: disabled ? 0.4 : 1,
        transition: `border-color ${EASE_QUICK}, color ${EASE_QUICK}`,
        flexShrink: 0,
        transform: dir === 'prev' ? 'rotate(180deg)' : 'rotate(0)',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.borderColor = ACCENT; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.borderColor = T.borderMd; }}>
      <ChevRight s={11} c="currentColor" sw={2}/>
    </button>
  );

  return (
    <div style={{ position: 'relative', marginBottom: 24 }}>
      <div style={{
        padding: '10px 12px', borderRadius: 12,
        background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <ArrowBtn disabled={!canPrev} dir="prev"
          onClick={() => setActiveIdx(activeIdx - 1)} />

        {/* Active section heading — click to open jump menu */}
        <button onClick={() => setOpen(o => !o)} style={{
          all: 'unset', flex: 1, cursor: 'pointer',
          padding: '4px 10px', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          minWidth: 0,
          transition: `background ${EASE_QUICK}`,
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = T.dividerInk}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 2,
            }}>Section {String(activeIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: 14, color: T.ink, letterSpacing: '-0.01em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{active.label}</div>
          </div>
          <span style={{
            color: T.ink3, display: 'flex', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: `transform ${EASE_QUICK}`,
          }}>
            <ChevDown s={11} c="currentColor" sw={1.6}/>
          </span>
        </button>

        <ArrowBtn disabled={!canNext} dir="next"
          onClick={() => setActiveIdx(activeIdx + 1)} />
      </div>

      {/* Jump menu — full section list */}
      {open && (
        <>
          <div onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 1 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            zIndex: 2,
            background: T.cardBg, border: `1px solid ${T.borderMd}`,
            borderRadius: 12, boxShadow: T.dockShadow,
            padding: 6, maxHeight: 320, overflowY: 'auto',
          }}>
            {sections.map((s, i) => {
              const isActive = i === activeIdx;
              return (
                <button key={s.id}
                  onClick={() => { setActiveIdx(i); setOpen(false); }}
                  style={{
                    all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                    width: '100%', padding: '8px 12px', borderRadius: 6,
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: isActive ? T.dividerInk : 'transparent',
                    transition: `background ${EASE_QUICK}`,
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = T.dividerInk; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.10em', color: isActive ? ACCENT : T.ink4,
                    width: 22, flexShrink: 0,
                  }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{
                    flex: 1, minWidth: 0,
                    fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                    fontSize: 12.5, color: isActive ? T.ink : T.ink2, letterSpacing: '-0.005em',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── DB · Project detail model body ────────────────────────────
   Renders a Model-instantiated project's schema-sections list.
   Auto-sections when the Model has 10+ sections (one section visible
   at a time with prev/next navigation). Per-section regenerate button
   appears next to each section header in view mode.

   Props:
     T, model, project, editing, draft, setDraft, user, setUser, onUpdate
   ─────────────────────────────────────────────────────────────────── */
function DBProjectDetailModelBody({ T, model, project, editing, draft, setDraft, user, setUser, onUpdate, disableRegenerate = false, disableEdit = false }) {
  const sectionCount = model.sections.length;
  // Auto-sectioning: if the Model has 10+ sections, paginate; otherwise
  // render the whole thing as one scrolling page (current behaviour).
  const paginated = sectionCount >= 10;
  const [activeIdx, setActiveIdx] = useState(0);
  const [regenBusyId, setRegenBusyId] = useState(null);
  // Per-section local edit mode. Independent of global edit (which flips
  // the entire project into editable form). Lets a viewer drill in,
  // tweak one section, and commit without affecting anything else.
  const [editingSectionIds, setEditingSectionIds] = useState(() => new Set());
  const isEditingSection = (id) => editingSectionIds.has(id);
  const toggleSectionEdit = (id) => {
    setEditingSectionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Determine which sections to render this pass
  const sectionsToRender = paginated && !editing
    ? [model.sections[activeIdx]]
    : model.sections;

  const updateSection = (sectionId, nextValue) => {
    if (editing) {
      setDraft(d => ({ ...d, modelSections: { ...(d.modelSections || {}), [sectionId]: nextValue } }));
    } else {
      // Direct write through onUpdate when not in edit mode (used by checkbox toggles, regenerate)
      const nextSections = { ...(project.modelSections || {}), [sectionId]: nextValue };
      onUpdate({ ...project, modelSections: nextSections, updatedAt: new Date().toISOString() });
    }
  };

  // Per-section regenerate — runs Claude only on this section's prompt
  const regenerateSection = async (section) => {
    if (regenBusyId) return;
    const gate = requireTier('aiCall', { user });
    if (!gate.allowed) {
      window.dispatchEvent(new CustomEvent('nos:upgrade', { detail: { feature: 'aiCall', ...gate } }));
      return;
    }
    setRegenBusyId(section.id);
    nosToast(`Refilling ${section.label}…`, { eyebrow: 'Regenerate' });
    const moodStr = (project.moods || []).join(', ') || 'undefined';
    const prompt =
      `Project name: ${project.name}\n` +
      `Client: ${project.client || 'Own work'}\n` +
      `Moods: ${moodStr}\n` +
      `Spark / context: ${project.spark || 'No additional context provided.'}\n\n` +
      buildSingleSectionPrompt(model, section);
    const raw = await callClaude(
      prompt,
      `${model.systemPrompt} Return JSON only — no markdown, no fences, no commentary.`,
      { user, setUser }
    );
    setRegenBusyId(null);
    if (raw && typeof raw === 'object' && raw.gated) return;
    const parsed = parseSectionResponse(section, raw);
    updateSection(section.id, parsed);
    nosToast(`${section.label} refilled.`, { eyebrow: 'Regenerate', kind: 'success' });
  };

  return (
    <>
      {/* Section navigation — paginated mode renders one section at a time
          with a header showing the current section name, prev/next arrows,
          and a "All sections" toggle for jumping. Non-paginated mode skips
          this entirely and just renders all sections inline. */}
      {paginated && !editing && (
        <DBProjectDetailSectionNav T={T}
          sections={model.sections}
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx} />
      )}

      {/* Render the chosen section(s) */}
      {sectionsToRender.map((s, i) => {
        const sectionIdx = paginated && !editing ? activeIdx : model.sections.indexOf(s);
        const value = (editing ? draft.modelSections : project.modelSections)?.[s.id];
        const isRegenerating = regenBusyId === s.id;
        return (
          <div key={s.id} style={{ marginBottom: 28 }}>
            {/* Header — only show inline when not paginated; in paginated mode
                the section name lives in the nav strip above. */}
            {(!paginated || editing) && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 8, gap: 10, flexWrap: 'wrap',
              }}>
                <div style={{
                  fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: T.ink4, display: 'flex', alignItems: 'baseline', gap: 8,
                }}>
                  <span style={{ color: T.ink3 }}>{String(sectionIdx + 1).padStart(2, '0')}</span>
                  <span>{s.label}</span>
                </div>
                {!editing && (
                  <DBSectionActionRow T={T}
                    isEditing={isEditingSection(s.id)}
                    onToggleEdit={() => toggleSectionEdit(s.id)}
                    onRegenerate={() => regenerateSection(s)}
                    isRegenerating={isRegenerating}
                    showRegenerate={!disableRegenerate}
                    showEdit={!disableEdit} />
                )}
              </div>
            )}
            {/* Paginated header — section name is in the nav strip above,
                so this strip just holds the Edit + Regenerate actions */}
            {paginated && !editing && (
              <div style={{
                display: 'flex', justifyContent: 'flex-end',
                marginBottom: 12,
              }}>
                <DBSectionActionRow T={T}
                  isEditing={isEditingSection(s.id)}
                  onToggleEdit={() => toggleSectionEdit(s.id)}
                  onRegenerate={() => regenerateSection(s)}
                  isRegenerating={isRegenerating}
                  showRegenerate={!disableRegenerate}
                  showEdit={!disableEdit} />
              </div>
            )}
            {/* Type-aware renderer. The `editing` flag is true when EITHER
                global edit mode is on OR this specific section is being
                edited via the per-section Edit button. */}
            <DBModelSectionRenderer T={T} section={s} value={value}
              editing={editing || isEditingSection(s.id)}
              onChange={(nv) => updateSection(s.id, nv)} />
          </div>
        );
      })}

      {/* Section nav footer — paginated only. Shows the destination
          section name on each side, not just an arrow. */}
      {paginated && !editing && (
        <div style={{
          marginTop: 24, paddingTop: 18,
          borderTop: `1px solid ${T.dividerInk}`,
          display: 'flex', alignItems: 'stretch', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
        }}>
          {activeIdx > 0 ? (
            <button onClick={() => setActiveIdx(activeIdx - 1)} style={{
              all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
              flex: '1 1 200px', minWidth: 0,
              padding: '10px 14px', borderRadius: 10,
              background: 'transparent', border: `1px solid ${T.dividerInk}`,
              transition: `border-color ${EASE_QUICK}, background ${EASE_QUICK}`,
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = T.borderMd}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = T.dividerInk}>
              <div style={{
                fontFamily: MONO, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4, marginBottom: 3,
              }}>← Previous</div>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 13, color: T.ink2, letterSpacing: '-0.005em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{model.sections[activeIdx - 1].label}</div>
            </button>
          ) : <div style={{ flex: '1 1 200px' }}/>}
          {activeIdx < sectionCount - 1 ? (
            <button onClick={() => setActiveIdx(activeIdx + 1)} style={{
              all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
              flex: '1 1 200px', minWidth: 0, textAlign: 'right',
              padding: '10px 14px', borderRadius: 10,
              background: 'transparent', border: `1px solid ${T.dividerInk}`,
              transition: `border-color ${EASE_QUICK}, background ${EASE_QUICK}`,
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = T.borderMd}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = T.dividerInk}>
              <div style={{
                fontFamily: MONO, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4, marginBottom: 3,
              }}>Next →</div>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 13, color: T.ink2, letterSpacing: '-0.005em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{model.sections[activeIdx + 1].label}</div>
            </button>
          ) : <div style={{ flex: '1 1 200px' }}/>}
        </div>
      )}
    </>
  );
}

/* ─── DB · Shared project view (public link recipient) ──────────
   Minimal layout for users who arrived via ?share=<token>. No left
   rail, no quick-tools dock, no Hey Nia bar. Just a header strip with
   the project name and an exit affordance, then the project body
   itself (Model schema or generic brief, depending on project shape).

   When the share's permissions are 'edit', the body is editable in
   the same way the owner edits — using the same setProject mutator
   (in this prototype, the same in-memory projects[] array). When
   permissions are 'view', the body renders read-only with no edit
   pencil and no per-section regenerate.

   Props:
     T              — current skin tokens
     project        — the matched shared project (or null if token invalid)
     onUpdate(p)    — applies edits back to the projects[] state
     onExit()       — clears the share token, returns to normal app
     hasAccount     — whether a user is signed in (controls the exit copy)
   ─────────────────────────────────────────────────────────────── */
function DBSharedProjectView({ T, project, onUpdate, onExit, hasAccount }) {
  const { isMobile, isTablet } = useViewport();
  const mounted = useMountReveal();

  // Invalid or expired token — show a friendly fallback instead of crashing.
  if (!project) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: T.pageBg,
        fontFamily: BODY, color: T.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, ...revealStyle(mounted, 12),
      }}>
        <div style={{ maxWidth: 440, textAlign: 'center' }}>
          <div style={{
            fontFamily: MONO, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: T.ink4, marginBottom: 14,
          }}>System Constraint</div>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 22, color: T.ink, letterSpacing: '-0.02em',
            marginBottom: 12, lineHeight: 1.3,
          }}>This share link is no longer active.</div>
          <div style={{
            fontFamily: BODY, fontSize: 13, color: T.ink2, lineHeight: 1.6,
            marginBottom: 24,
          }}>The owner may have disabled the link or the project may have moved. Ask them to send a fresh link.</div>
          <PrimaryButton T={T} onClick={onExit}>
            {hasAccount ? 'Back to Nia' : 'Open Nia'}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const permissions = project.publicShare?.permissions || 'view';
  const canEdit = permissions === 'edit';
  const typeLabel = (PROJECT_TYPES.find(t => t.id === project.type) || {}).label || project.type;
  const modelOnProject = project.modelId ? MODELS.find(m => m.id === project.modelId) : null;

  // Local edit state — only used when the link grants edit permissions.
  // We use the same draft pattern as DBProjectDetail so saves go through
  // onUpdate cleanly. There's no dedicated edit-mode toggle here —
  // changes commit immediately because there's no global save bar.
  const [draft, setDraft] = useState(null);

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: T.pageBg, fontFamily: BODY, color: T.ink,
      ...revealStyle(mounted, 16),
    }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        background: T.cardBg, borderBottom: `1px solid ${T.dividerInk}`,
        padding: isMobile ? '12px 16px' : '14px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <NOSMark T={T} size={isMobile ? 11 : 12} label="Shared project" labelInk={T.ink3} />
          <div style={{ width: 1, height: 18, background: T.dividerInk }}/>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 2,
            }}>
              {typeLabel} · {permissions === 'edit' ? 'Can edit' : 'View only'}
            </div>
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: isMobile ? 14 : 16, color: T.ink, letterSpacing: '-0.01em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: isMobile ? 200 : 360,
            }}>{project.name}</div>
          </div>
        </div>
        <button onClick={onExit} style={{
          background: 'transparent', border: `1px solid ${T.borderMd}`,
          borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
          fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink2,
          flexShrink: 0,
          transition: `border-color ${EASE_QUICK}, background ${EASE_QUICK}`,
        }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = ACCENT}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = T.borderMd}>
          {hasAccount ? 'Open in Nia' : 'Open Nia'}
        </button>
      </div>

      {/* Body */}
      <div style={{
        maxWidth: 920, margin: '0 auto',
        padding: isMobile ? '24px 16px' : '36px 28px 60px',
      }}>
        {/* Project heading + tags */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: T.ink4, marginBottom: 8,
          }}>{typeLabel} · {project.client}</div>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: isMobile ? 26 : 36, color: T.ink, letterSpacing: '-0.025em',
            lineHeight: 1.15,
          }}>{project.name}</div>
          <div style={{
            marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
          }}>
            {modelOnProject && (
              <span style={{
                fontFamily: MONO, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: ACCENT_INK, padding: '3px 9px', borderRadius: 4,
                background: ACCENT,
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <SparkIc s={9} c="currentColor" sw={2} />
                {modelOnProject.label}
              </span>
            )}
            {(project.moods || []).slice(0, 5).map(m => (
              <span key={m} style={{
                fontFamily: MONO, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: T.ink3, padding: '3px 8px', borderRadius: 4,
                background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
              }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Body — Model schema if Model-instantiated, generic brief otherwise.
            For shared edit-mode, we route updates through onUpdate directly.
            DBProjectDetailModelBody uses the same pattern so reusing it gives
            us identical type-aware rendering and per-section regenerate.       */}
        {modelOnProject ? (
          <DBProjectDetailModelBody T={T} model={modelOnProject} project={project}
            editing={false}
            draft={draft || project}
            setDraft={setDraft}
            user={null} setUser={null}
            onUpdate={canEdit ? onUpdate : (() => {})}
            disableRegenerate={true}
            disableEdit={!canEdit} />
        ) : (
          [
            { id: 'overview',          label: 'Overview' },
            { id: 'creativeDirection', label: 'Creative Direction' },
            { id: 'visualDirection',   label: 'Visual Direction' },
            { id: 'deliverables',      label: 'Deliverables' },
            { id: 'timeline',          label: 'Timeline' },
          ].map(s => (
            <div key={s.id} style={{ marginBottom: 28 }}>
              <div style={{
                fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4, marginBottom: 8,
              }}>{s.label}</div>
              {canEdit ? (
                <NPTextarea T={T} value={project.brief?.[s.id] || ''}
                  onChange={(v) => onUpdate({
                    ...project,
                    brief: { ...(project.brief || {}), [s.id]: v },
                    updatedAt: new Date().toISOString(),
                  })}
                  placeholder={`Add ${s.label.toLowerCase()}…`} rows={4} />
              ) : (
                <div style={{
                  fontFamily: BODY, fontSize: 13.5, lineHeight: 1.7,
                  color: T.ink2, whiteSpace: 'pre-wrap',
                }}>{project.brief?.[s.id] || <span style={{ color: T.ink4, fontStyle: 'italic' }}>Empty</span>}</div>
              )}
            </div>
          ))
        )}

        {/* Footer attribution */}
        <div style={{
          marginTop: 48, padding: '16px 0',
          borderTop: `1px solid ${T.dividerInk}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 14, flexWrap: 'wrap',
        }}>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontSize: 11.5,
            color: T.ink4,
          }}>Shared via Nia · {permissions === 'edit' ? 'Edits sync to the owner' : 'Read-only'}</div>
          <button onClick={onExit} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: T.ink3, padding: 0,
          }}>{hasAccount ? '← Back to Nia' : 'Open Nia →'}</button>
        </div>
      </div>
    </div>
  );
}

function DBProjectDetail({ T, project, onClose, onUpdate, onDelete, onShare, user, setUser, inline = false }) {
  const { isMobile, isTablet } = useViewport();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(project);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !editing && !confirmDelete) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, editing, confirmDelete]);

  const saveEdit = () => {
    onUpdate({ ...draft, updatedAt: new Date().toISOString() });
    setEditing(false);
  };
  const cancelEdit = () => { setDraft(project); setEditing(false); };

  const typeLabel = (PROJECT_TYPES.find(t => t.id === project.type) || {}).label || project.type;

  return (
    <div style={inline ? {
      // Inline mode — fills the canvas centre panel. No scrim, no fixed
      // positioning. Rounded card mounted in the middle of the canvas
      // with the tools dock and Canvas pill still visible around it.
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: 'transparent', fontFamily: BODY,
    } : {
      position: 'fixed', inset: 0, zIndex: 95,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
    }}>
      {!inline && (
        <div onClick={() => !editing && !confirmDelete && onClose()} style={{ position: 'absolute', inset: 0 }}/>
      )}
      <div style={inline ? {
        position: 'relative', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'transparent',
      } : {
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : 820,
        height: isMobile ? '100vh' : `min(800px, calc(100vh - ${isTablet ? 32 : 48}px))`,
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 18,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.dockShadow,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          flexShrink: 0,
          padding: isMobile ? '14px 16px' : '20px 28px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 16, borderBottom: `1px solid ${T.dividerInk}`,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 6,
            }}>{typeLabel} · {project.client}</div>
            {editing ? (
              <Input T={T} value={draft.name}
                onChange={v => setDraft(d => ({ ...d, name: v }))}
                placeholder="Project name" />
            ) : (
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: isMobile ? 20 : 26, color: T.ink, letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}>{project.name}</div>
            )}
            <div style={{
              marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
            }}>
              {project.modelId && (() => {
                const m = MODELS.find(mm => mm.id === project.modelId);
                if (!m) return null;
                return (
                  <span style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: ACCENT_INK, padding: '3px 9px', borderRadius: 4,
                    background: ACCENT,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}>
                    <SparkIc s={9} c="currentColor" sw={2} />
                    {m.label}
                  </span>
                );
              })()}
              {project.moods.slice(0, 5).map(m => (
                <span key={m} style={{
                  fontFamily: MONO, fontSize: 9, fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: T.ink3, padding: '3px 8px', borderRadius: 4,
                  background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                }}>{m}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            {editing ? (
              <>
                <GhostButton T={T} onClick={cancelEdit}>Cancel</GhostButton>
                <PrimaryButton T={T} onClick={saveEdit}>Save</PrimaryButton>
              </>
            ) : (
              <>
                <button onClick={onShare} title="Share"
                  style={{
                    background: 'transparent', border: `1px solid ${T.borderMd}`,
                    borderRadius: 8, padding: '7px 12px', cursor: 'pointer',
                    fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink2,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  Share
                </button>
                <button onClick={() => setEditing(true)} title="Edit"
                  style={{
                    background: 'transparent', border: `1px solid ${T.borderMd}`,
                    borderRadius: 8, padding: '7px 12px', cursor: 'pointer',
                    fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink2,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <EditIc s={11} c="currentColor" sw={1.6} /> Edit
                </button>
                <button onClick={() => setConfirmDelete(true)} title="Delete"
                  style={{
                    background: 'transparent', border: `1px solid ${T.borderMd}`,
                    borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
                    color: T.ink3, display: 'flex', alignItems: 'center',
                  }}>
                  <TrashIc s={12} c="currentColor" sw={1.6} />
                </button>
                <button onClick={onClose} aria-label="Close" style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'transparent', border: `1px solid ${T.borderMd}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: T.ink3, marginLeft: 4,
                }}>
                  <CloseIc s={12} c="currentColor" sw={1.6} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 18px' : '24px 28px' }}>
          {/* Model-instantiated projects render the Model's schema sections.
              Generic projects render the 5-section brief. */}
          {project.modelId ? (() => {
            const model = MODELS.find(m => m.id === project.modelId);
            if (!model) return null;
            return (
              <DBProjectDetailModelBody T={T} model={model} project={project}
                editing={editing} draft={draft} setDraft={setDraft}
                user={user} setUser={setUser} onUpdate={onUpdate} />
            );
          })() : (
            [
              { id: 'overview',          label: 'Overview' },
              { id: 'creativeDirection', label: 'Creative Direction' },
              { id: 'visualDirection',   label: 'Visual Direction' },
              { id: 'deliverables',      label: 'Deliverables' },
              { id: 'timeline',          label: 'Timeline' },
            ].map(s => (
              <div key={s.id} style={{ marginBottom: 24 }}>
                <div style={{
                  fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: T.ink4, marginBottom: 8,
                }}>{s.label}</div>
                {editing ? (
                  <NPTextarea T={T} value={draft.brief?.[s.id] || ''}
                    onChange={v => setDraft(d => ({ ...d, brief: { ...d.brief, [s.id]: v } }))}
                    placeholder={`Add ${s.label.toLowerCase()}…`} rows={4} />
                ) : (
                  <div style={{
                    fontFamily: BODY, fontSize: 13.5, lineHeight: 1.7,
                    color: T.ink2, whiteSpace: 'pre-wrap',
                  }}>{project.brief?.[s.id] || <span style={{ color: T.ink4, fontStyle: 'italic' }}>Empty</span>}</div>
                )}
              </div>
            ))
          )}

          {/* Team */}
          {(project.team || []).length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4, marginBottom: 8,
              }}>Team</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {project.team.map(name => (
                  <span key={name} style={{
                    fontFamily: BODY, fontStyle: 'italic', fontSize: 12,
                    color: T.ink2, padding: '5px 11px', borderRadius: 999,
                    background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                  }}>{name}</span>
                ))}
              </div>
            </div>
          )}

          {/* Shared with */}
          {(project.sharedWith || []).length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4, marginBottom: 8,
              }}>Shared with</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {project.sharedWith.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', borderRadius: 8,
                    background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                  }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: T.ink2 }}>{s.email}</span>
                    <span style={{
                      fontFamily: MONO, fontSize: 9, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase', color: T.ink3,
                    }}>{s.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div style={{
            marginTop: 32, paddingTop: 16,
            borderTop: `1px solid ${T.dividerInk}`,
            display: 'flex', justifyContent: 'space-between',
            fontFamily: MONO, fontSize: 9.5, color: T.ink4,
            letterSpacing: '0.10em', textTransform: 'uppercase',
          }}>
            <span>Created · {new Date(project.createdAt).toLocaleDateString()}</span>
            <span>Updated · {new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Delete confirmation */}
        {confirmDelete && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 28,
          }}>
            <div style={{
              width: '100%', maxWidth: 420, padding: 24,
              background: T.cardBg, border: `1px solid ${T.borderMd}`,
              borderRadius: 14, boxShadow: T.dockShadow,
            }}>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 18, color: DANGER, marginBottom: 8,
              }}>Delete this project?</div>
              <div style={{
                fontFamily: BODY, fontSize: 13, color: T.ink2, lineHeight: 1.6, marginBottom: 22,
              }}>
                <span style={{ fontWeight: 500 }}>{project.name}</span> and its brief
                will be removed. Project history and shared access disappear with it.
                This cannot be undone.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <GhostButton T={T} onClick={() => setConfirmDelete(false)}>Cancel</GhostButton>
                <PrimaryButton T={T} danger onClick={() => { onDelete(project.id); }}>
                  Delete project
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DB · Share modal ─────────────────────────────────────── */
function DBShareModal({ T, project, onClose, onUpdate }) {
  const { isMobile } = useViewport();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [copied, setCopied] = useState(false);

  // Public share state — derived from project.publicShare. When the
  // owner enables sharing, we mint a token and bind the permissions
  // level. The link embeds the token as a query string the App Shell
  // route handler reads on mount.
  const publicShare = project.publicShare || { enabled: false, token: null, permissions: 'view' };
  const buildLink = (token) => {
    const origin = (typeof window !== 'undefined' && window.location?.origin) ? window.location.origin : 'https://nia.app';
    return `${origin}/?share=${token}`;
  };
  const link = publicShare.token ? buildLink(publicShare.token) : '';

  // Mint a fresh token. Cryptographically-strong randomness when the
  // browser provides it, fallback to Date.now+random otherwise.
  const mintToken = () => {
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
      return window.crypto.randomUUID().replace(/-/g, '').slice(0, 24);
    }
    return (Date.now().toString(36) + Math.random().toString(36).slice(2, 14)).slice(0, 24);
  };

  const enableSharing = (permissions) => {
    onUpdate({
      ...project,
      publicShare: {
        enabled: true,
        token: publicShare.token || mintToken(),
        permissions: permissions || publicShare.permissions || 'view',
        createdAt: publicShare.createdAt || new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    });
  };
  const disableSharing = () => {
    onUpdate({
      ...project,
      publicShare: { enabled: false, token: null, permissions: 'view' },
      updatedAt: new Date().toISOString(),
    });
  };
  const setPermissions = (permissions) => {
    if (!publicShare.enabled) {
      enableSharing(permissions);
      return;
    }
    onUpdate({
      ...project,
      publicShare: { ...publicShare, permissions },
      updatedAt: new Date().toISOString(),
    });
  };

  const addInvite = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    const next = [...(project.sharedWith || []), { email, role }];
    onUpdate({ ...project, sharedWith: next, updatedAt: new Date().toISOString() });
    setEmail(''); setRole('viewer');
  };
  const removeInvite = (e) => {
    onUpdate({
      ...project,
      sharedWith: (project.sharedWith || []).filter(s => s.email !== e),
      updatedAt: new Date().toISOString(),
    });
  };
  const copyLink = async () => {
    if (!publicShare.enabled) {
      enableSharing();
      // Wait a tick for state to settle before reading the token; on
      // first enable the token will be present in the next render so
      // we mint locally and copy in the same call:
      const token = publicShare.token || mintToken();
      const url = buildLink(token);
      try { await navigator.clipboard.writeText(url); } catch {}
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — silent */ }
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 96,
      background: T.modalScrim,
      display: isMobile ? 'flex' : 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      padding: isMobile ? 0 : 24, fontFamily: BODY,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : 520,
        background: T.cardBg,
        borderRadius: isMobile ? '18px 18px 0 0' : 16,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: T.dockShadow,
        overflow: 'hidden',
        maxHeight: isMobile ? '90vh' : 'none',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px', borderBottom: `1px solid ${T.dividerInk}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 3,
            }}>Share</div>
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: 16, color: T.ink, letterSpacing: '-0.01em',
              maxWidth: 380, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{project.name}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
          }}>
            <CloseIc s={11} c="currentColor" sw={1.6} />
          </button>
        </div>

        <div style={{ padding: 22 }}>
          {/* Invite by email */}
          <div style={{
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: T.ink4, marginBottom: 10,
          }}>Invite people</div>
          <div style={{
            display: 'flex', gap: 8, alignItems: 'stretch', marginBottom: 14,
          }}>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="email@studio.com" type="email"
              onKeyDown={(e) => e.key === 'Enter' && addInvite()}
              style={{
                flex: 1,
                background: T.inputBg, border: `1px solid ${T.borderMd}`,
                borderRadius: 8, padding: '9px 12px',
                fontFamily: BODY, fontSize: 13, color: T.ink,
                letterSpacing: '-0.005em', outline: 'none',
              }}/>
            <select value={role} onChange={e => setRole(e.target.value)}
              style={{
                background: T.inputBg, border: `1px solid ${T.borderMd}`,
                borderRadius: 8, padding: '9px 12px',
                fontFamily: BODY, fontSize: 12.5, color: T.ink, cursor: 'pointer', outline: 'none',
              }}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={addInvite} disabled={!email || !/\S+@\S+\.\S+/.test(email)}
              style={{
                background: !email || !/\S+@\S+\.\S+/.test(email) ? T.cardBgAlt : ACCENT,
                color: !email || !/\S+@\S+\.\S+/.test(email) ? T.ink4 : ACCENT_INK,
                border: 'none', borderRadius: 8, padding: '9px 16px',
                fontFamily: BODY, fontSize: 12.5, fontWeight: 600,
                cursor: !email || !/\S+@\S+\.\S+/.test(email) ? 'not-allowed' : 'pointer',
              }}>Invite</button>
          </div>

          {/* Existing access */}
          {(project.sharedWith || []).length > 0 ? (
            <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {project.sharedWith.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 12px', borderRadius: 8,
                  background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                }}>
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 11.5, color: T.ink2, fontWeight: 500 }}>{s.email}</div>
                    <div style={{
                      fontFamily: MONO, fontSize: 9, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase', color: T.ink4, marginTop: 2,
                    }}>{s.role}</div>
                  </div>
                  <button onClick={() => removeInvite(s.email)} aria-label="Remove access"
                    style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: T.ink3, padding: 6, display: 'flex',
                    }}>
                    <TrashIc s={11} c="currentColor" sw={1.6} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontSize: 12,
              color: T.ink4, marginBottom: 18,
            }}>No collaborators yet.</div>
          )}

          {/* Public link sharing */}
          <div style={{
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: T.ink4, marginBottom: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          }}>
            <span>Share link</span>
            <Toggle T={T} checked={publicShare.enabled}
              onChange={(v) => v ? enableSharing() : disableSharing()} />
          </div>

          {publicShare.enabled ? (
            <>
              {/* Permission picker */}
              <div style={{
                display: 'flex', gap: 4, padding: 4,
                background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                borderRadius: 999, marginBottom: 10,
                width: 'fit-content',
              }}>
                {[
                  { id: 'view', label: 'View only',  hint: 'Anyone with the link can read' },
                  { id: 'edit', label: 'Can edit',   hint: 'Anyone with the link can edit' },
                ].map(p => {
                  const on = publicShare.permissions === p.id;
                  return (
                    <button key={p.id} onClick={() => setPermissions(p.id)}
                      title={p.hint}
                      style={{
                        all: 'unset', cursor: 'pointer',
                        padding: '5px 14px', borderRadius: 999,
                        background: on ? T.cardBg : 'transparent',
                        boxShadow: on ? T.cardShadow : 'none',
                        fontFamily: BODY, fontStyle: on ? 'normal' : 'italic',
                        fontSize: 11.5, fontWeight: 500,
                        color: on ? T.ink : T.ink3,
                        transition: `all ${EASE_QUICK}`,
                      }}>{p.label}</button>
                  );
                })}
              </div>

              {/* Link box */}
              <div style={{
                display: 'flex', gap: 8, alignItems: 'stretch',
                padding: '9px 12px',
                background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`, borderRadius: 8,
              }}>
                <span style={{
                  flex: 1, fontFamily: MONO, fontSize: 11, color: T.ink2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  alignSelf: 'center',
                }}>{link}</span>
                <button onClick={copyLink} style={{
                  background: copied ? SUCCESS : ACCENT,
                  color: copied ? '#FFF' : ACCENT_INK,
                  border: 'none',
                  borderRadius: 6, padding: '5px 14px', cursor: 'pointer',
                  fontFamily: BODY, fontSize: 11.5, fontWeight: 500,
                  transition: `all ${EASE_QUICK}`,
                }}>{copied ? 'Copied' : 'Copy link'}</button>
              </div>
              <div style={{
                marginTop: 8, fontFamily: BODY, fontStyle: 'italic',
                fontSize: 11, color: T.ink4,
              }}>{publicShare.permissions === 'edit'
                ? 'Anyone with this link can view and edit the project. Edits sync back here.'
                : 'Anyone with this link can view the project. They can\'t make changes.'}</div>
            </>
          ) : (
            <button onClick={() => enableSharing()} style={{
              all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
              width: '100%', padding: '12px 14px',
              background: T.cardBgAlt, border: `1px dashed ${T.borderMd}`,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: BODY, fontStyle: 'italic', fontSize: 12.5,
              color: T.ink3, letterSpacing: '-0.005em',
              transition: `all ${EASE_QUICK}`,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = T.ink2; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.borderMd; e.currentTarget.style.color = T.ink3; }}>
              <ChainIc s={11} c="currentColor" sw={1.6}/>
              Generate a shareable link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── DB · Profile panel overlay ────────────────────────────
   Top-right quick-edit affordance for the user's profile. Mirrors the
   structure of Settings → Profile so edits made here are identical in
   shape to what the Settings modal would write — same setUser updater,
   same field names. Anchored as a popover under the Profile pill.
   Includes the Open in Settings escape hatch for the long-form
   surface.                                                          */
function DBProfilePanel({ T, user, setUser, onClose, onOpenSettings, onLogOut, onPickArchetype }) {
  const { isMobile } = useViewport();
  const fileRef = useRef(null);
  const handleFile = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => setUser(u => ({ ...u, avatarUrl: e.target.result }));
    r.readAsDataURL(file);
  };

  // Close on escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: isMobile ? T.modalScrim : 'transparent',
      }}/>
      {/* Panel — popover on desktop/tablet, bottom sheet on mobile */}
      <div style={isMobile ? {
        position: 'fixed', left: 0, right: 0, bottom: 0,
        maxHeight: '85vh',
        background: T.dockBg,
        borderTopLeftRadius: 18, borderTopRightRadius: 18,
        boxShadow: T.dockShadow,
        zIndex: 51, fontFamily: BODY, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      } : {
        position: 'absolute', top: 56 + 6, right: 20,
        width: 360, maxHeight: 'calc(100vh - 120px)',
        background: T.dockBg, border: `1px solid ${T.borderMd}`,
        borderRadius: 14, boxShadow: T.dockShadow,
        zIndex: 51, fontFamily: BODY, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Mobile drag handle */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: T.borderMd }}/>
          </div>
        )}
        {/* Header */}
        <div style={{
          padding: '16px 18px',
          borderBottom: `1px solid ${T.dividerInk}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 3,
            }}>Profile</div>
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: 15, color: T.ink, letterSpacing: '-0.01em',
            }}>Your identity in Nia</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
          }}>
            <CloseIc s={11} c="currentColor" sw={1.6} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
          {/* Avatar row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '8px 0 16px',
            borderBottom: `1px solid ${T.dividerInk}`, marginBottom: 14,
          }}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" style={{
                width: 52, height: 52, borderRadius: '50%',
                objectFit: 'cover', border: `1px solid ${T.borderMd}`,
              }}/>
            ) : (
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 600,
                fontSize: 20, color: T.ink3,
              }}>{(user.name || 'N')[0]}</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: BODY, fontWeight: 500, fontSize: 13,
                color: T.ink, letterSpacing: '-0.005em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{user.name || 'Your name'}</div>
              <div style={{
                fontFamily: BODY, fontSize: 11, color: T.ink3, fontStyle: 'italic',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{user.email || 'your@email.com'}</div>
            </div>
            <button onClick={() => fileRef.current?.click()} style={{
              background: 'transparent', border: `1px solid ${T.borderMd}`,
              borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
              fontFamily: BODY, fontSize: 10.5, fontWeight: 500, color: T.ink2,
              whiteSpace: 'nowrap',
            }}>{user.avatarUrl ? 'Change' : 'Upload'}</button>
            <input ref={fileRef} type="file" accept="image/*" hidden
              onChange={e => handleFile(e.target.files[0])}/>
          </div>

          {/* Editable fields — same field names as Settings → Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field T={T} label="Full name">
              <Input T={T} value={user.name}
                onChange={v => setUser(u => ({ ...u, name: v }))}
                placeholder="Your name" />
            </Field>
            <Field T={T} label="City"
              hint="Used for regional NRI rates and team matching.">
              <Input T={T} value={user.location}
                onChange={v => setUser(u => ({ ...u, location: v }))}
                placeholder="Boston" />
            </Field>
            <Field T={T} label="Title">
              <Input T={T} value={user.role}
                onChange={v => setUser(u => ({ ...u, role: v }))}
                placeholder="Creative Director" />
            </Field>

            {/* Archetype — display + change action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{
                fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.ink4,
              }}>Primary archetype</label>
              <button onClick={onPickArchetype} style={{
                all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                width: '100%', padding: '11px 14px',
                background: T.inputBg, border: `1px solid ${T.borderMd}`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 10,
              }}>
                <span style={{
                  fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 13, color: T.ink, letterSpacing: '-0.005em',
                }}>{user.archetypePrimary || 'Pick one'}</span>
                <span style={{
                  fontFamily: MONO, fontSize: 9, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: ACCENT,
                }}>Change ›</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{
          flexShrink: 0,
          borderTop: `1px solid ${T.dividerInk}`,
          padding: '10px 8px',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          <button onClick={() => { onClose(); onOpenSettings(); }} style={{
            all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
            width: '100%', padding: '10px 14px', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = T.dividerInk}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <span style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: 12, color: T.ink2, letterSpacing: '-0.005em',
            }}>Open in Settings</span>
            <ChevRight s={10} c={T.ink3} sw={1.6} />
          </button>
          <button onClick={() => { onClose(); onLogOut(); }} style={{
            all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
            width: '100%', padding: '10px 14px', borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 10,
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = T.dividerInk}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <LogOutIc s={12} c={T.ink3} sw={1.5} />
            <span style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: 12, color: T.ink2, letterSpacing: '-0.005em',
            }}>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── DB · Skills Library overlay ───────────────────────────
   Full-screen overlay browsing the 282 archetypes. Reachable from
   the project switcher's "View all 282 archetypes" action. Search
   filters across name, summary, and category label. Picking a row
   sets it as the dashboard's current archetype.                     */
function DBSkillsLibrary({ T, currentArchetype, onPick, onClose, user = null }) {
  const { isMobile, isTablet } = useViewport();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState(0);
  const q = query.trim().toLowerCase();
  const filtered = LIBRARY.filter(a => {
    const inCat = activeCat === 0 || a.cat === activeCat;
    if (!inCat) return false;
    if (!q) return true;
    const catLabel = (ALL_CATEGORIES.find(c => c.id === a.cat) || {}).label || '';
    return a.name.toLowerCase().includes(q)
        || a.sum.toLowerCase().includes(q)
        || a.tier.toLowerCase().includes(q)
        || catLabel.toLowerCase().includes(q);
  });
  // Sort by tier seniority within the result set
  const sorted = [...filtered].sort((a, b) => {
    const ai = TIER_ORDER.indexOf(a.tier);
    const bi = TIER_ORDER.indexOf(b.tier);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 90,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: isMobile ? '100vw' : 1080,
        height: isMobile ? '100vh' : `min(740px, calc(100vh - ${isTablet ? 32 : 48}px))`,
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 18,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.dockShadow,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          flexShrink: 0,
          padding: isMobile ? '14px 16px' : '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${T.dividerInk}`,
        }}>
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 4,
            }}>NRI Library</div>
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: 22, color: T.ink, letterSpacing: '-0.015em',
            }}>282 archetypes.</div>
          </div>
          <button onClick={onClose} aria-label="Close library"
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'transparent', border: `1px solid ${T.borderMd}`,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
            }}>
            <CloseIc s={12} c="currentColor" sw={1.6} />
          </button>
        </div>

        {/* Search */}
        <div style={{ flexShrink: 0, padding: '14px 24px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: T.inputBg, border: `1px solid ${T.borderMd}`,
            borderRadius: 10, padding: '10px 14px',
          }}>
            <SearchIc s={13} c={T.ink3} sw={1.5} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              autoFocus
              placeholder="Search by role, tier, or discipline…"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                flex: 1, color: T.ink,
                fontFamily: BODY, fontSize: 13, letterSpacing: '-0.005em',
              }}/>
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: T.ink3, padding: 0, display: 'flex',
              }}>
                <CloseIc s={11} c="currentColor" sw={1.6} />
              </button>
            )}
            <span style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
              letterSpacing: '0.10em', textTransform: 'uppercase', color: T.ink4,
            }}>{sorted.length}</span>
          </div>
        </div>

        {/* Body — categories sidebar + result list */}
        <div style={{
          flex: 1, display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          minHeight: 0,
        }}>
          {/* Category rail — vertical sidebar on tablet+, horizontal scroll on mobile */}
          <div style={{
            width: isMobile ? '100%' : 220,
            flexShrink: 0,
            overflowY: isMobile ? 'visible' : 'auto',
            overflowX: isMobile ? 'auto' : 'visible',
            padding: isMobile ? '10px 16px' : '14px 12px 14px 24px',
            borderRight: isMobile ? 'none' : `1px solid ${T.dividerInk}`,
            borderBottom: isMobile ? `1px solid ${T.dividerInk}` : 'none',
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            gap: isMobile ? 6 : 0,
            whiteSpace: isMobile ? 'nowrap' : 'normal',
          }}>
            {ALL_CATEGORIES.map(cat => {
              const on = activeCat === cat.id;
              const count = cat.id === 0 ? LIBRARY.length : LIBRARY.filter(a => a.cat === cat.id).length;
              return (
                <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                  style={{
                    all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                    width: isMobile ? 'auto' : '100%',
                    padding: isMobile ? '6px 12px' : '8px 10px',
                    borderRadius: isMobile ? 999 : 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 8, marginBottom: isMobile ? 0 : 2,
                    background: on ? T.activeTabBg : (isMobile ? T.cardBgAlt : 'transparent'),
                    border: isMobile ? `1px solid ${on ? T.borderMd : 'transparent'}` : 'none',
                    color: on ? T.ink : T.ink3,
                    flexShrink: 0,
                    transition: `background ${EASE_QUICK}, color ${EASE_QUICK}`,
                  }}>
                  <span style={{
                    fontFamily: BODY, fontStyle: on ? 'normal' : 'italic',
                    fontWeight: 500, fontSize: 12, letterSpacing: '-0.005em',
                  }}>{cat.label}</span>
                  <span style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 500,
                    letterSpacing: '0.08em',
                    color: on ? ACCENT : T.ink4,
                  }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Result list */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: isMobile ? '12px 16px' : '14px 24px',
          }}>
            {sorted.length === 0 ? (
              <div style={{
                padding: '40px 14px', textAlign: 'center',
                fontFamily: BODY, fontStyle: 'italic', fontSize: 13,
                color: T.ink3,
              }}>No archetypes match "{query}".</div>
            ) : sorted.map(a => {
              const isActive = a.name === currentArchetype;
              const catLabel = (ALL_CATEGORIES.find(c => c.id === a.cat) || {}).label || '';
              // Tier gate: Foundation users can only pick the first 60 archetypes
              const gate = requireTier('archetype', { user, archetype: a });
              const locked = !gate.allowed;
              return (
                <button key={a.id}
                  onClick={() => {
                    if (locked) {
                      window.dispatchEvent(new CustomEvent('nos:upgrade', { detail: { feature: 'archetype', ...gate } }));
                      return;
                    }
                    onPick(a); onClose();
                  }}
                  style={{
                    all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                    width: '100%', padding: '14px 16px', borderRadius: 10,
                    background: isActive ? 'rgba(255,171,13,0.06)' : T.cardBgAlt,
                    border: `1px solid ${isActive ? ACCENT : T.dividerInk}`,
                    marginBottom: 8,
                    display: 'flex', flexDirection: 'column', gap: 6,
                    transition: `all ${EASE_QUICK}`,
                    opacity: locked ? 0.55 : 1,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{
                      fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                      fontSize: 14, color: T.ink, letterSpacing: '-0.01em',
                    }}>{a.name}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      {locked && (
                        <span style={{
                          fontFamily: MONO, fontSize: 8.5, fontWeight: 600,
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          color: T.ink4, padding: '2px 7px', borderRadius: 4,
                          border: `1px solid ${T.borderMd}`,
                        }}>Pro</span>
                      )}
                      <span style={{
                        fontFamily: MONO, fontSize: 9, fontWeight: 600,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: isActive ? ACCENT : T.ink4,
                      }}>{isActive ? '✓ Active' : a.tier}</span>
                    </div>
                  </div>
                  <div style={{
                    fontFamily: BODY, fontSize: 11.5, color: T.ink3,
                    lineHeight: 1.5,
                  }}>{a.sum}</div>
                  <div style={{
                    display: 'flex', gap: 10, alignItems: 'center',
                    marginTop: 2,
                  }}>
                    <span style={{
                      fontFamily: MONO, fontSize: 9, fontWeight: 500,
                      letterSpacing: '0.10em', color: T.ink4,
                    }}>{catLabel}</span>
                    <span style={{ color: T.ink4, fontSize: 10 }}>·</span>
                    <span style={{
                      fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
                      letterSpacing: '0.06em', color: T.ink3,
                    }}>{a.rate}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DB · main dashboard ──────────────────────────────────── */
function NOSDashboard({ user, setUser, projects = [], setProjects, skinKey, setSkinKey, onOpenSettings, onLogOut }) {
  const T = SKINS[skinKey];
  const { isMobile, isTablet, isDesktop } = useViewport();
  // On mobile, the rails become full-screen sheets driven by these flags
  // rather than living in the layout. Resizing/collapsing is desktop-only.
  const [mobileSheet, setMobileSheet] = useState(null); // null | 'left' | 'right'
  const [activeTool, setActiveTool] = useState('users');
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [chatReply, setChatReply] = useState(null);   // last Nia reply, shown inline above the bar
  const [profileOpen, setProfileOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [nosMenuOpen, setNosMenuOpen]   = useState(false);
  const [libraryOpen, setLibraryOpen]   = useState(false); // SkillsLibrary overlay
  const [fileOpen, setFileOpen]         = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [helpOpen, setHelpOpen]         = useState(false);
  const [communityOpen, setCommunityOpen]   = useState(false);
  const [learnMoreOpen, setLearnMoreOpen]   = useState(false);

  // ─── Functions feature state (Phase 2) ─────────────────────
  // functionsOpen toggles the top-level Functions browser overlay.
  // activeFunction holds the id of the currently-open Function detail
  // ('contacts' | 'events' | 'archetypes'); null when no Function is open.
  // tutorialOverride forces the tutorial to show even after dismissal,
  // when the user explicitly re-triggers it (e.g. from a help link).
  const [functionsOpen, setFunctionsOpen] = useState(false);
  const [functionsCategory, setFunctionsCategory] = useState('intelligence');
  const [activeFunction, setActiveFunction] = useState(null);
  const [tutorialOverride, setTutorialOverride] = useState(false);

  // First-use tutorial gating — fires on first Function open ever.
  // Persisted on the user record at user.tutorialsSeen.functions = true.
  const tutorialSeen = !!(user?.tutorialsSeen?.functions);
  const tutorialShowing = (functionsOpen || activeFunction) && (!tutorialSeen || tutorialOverride);
  const dismissTutorial = () => {
    setTutorialOverride(false);
    setUser && setUser(u => ({
      ...u,
      tutorialsSeen: { ...(u.tutorialsSeen || {}), functions: true },
    }));
  };

  // Open a Function — closes the browser, opens the detail screen
  const pickFunction = (id) => {
    if (id === 'archetypes') {
      // Reuse the existing Skills Library overlay
      setFunctionsOpen(false);
      setLibraryOpen(true);
      return;
    }
    setFunctionsOpen(false);
    setActiveFunction(id);
  };

  // ─── Models state (Phase 3) ───────────────────────────────
  // modelDetailId — id of the Model whose schema preview is open
  // modelInstantiateId — id of the Model being instantiated into a project
  const [modelDetailId, setModelDetailId] = useState(null);
  const [modelInstantiateId, setModelInstantiateId] = useState(null);

  // Open a Model's schema preview from the Functions browser
  const pickModel = (id) => {
    setFunctionsOpen(false);
    setModelDetailId(id);
  };
  // From the schema preview, "Use this model" → 3-step instantiation flow
  const useModel = (id) => {
    setModelDetailId(null);
    setModelInstantiateId(id);
  };
  // Instantiation completes → close flow, store project, open detail
  const completeModelInstantiation = (project) => {
    setProjects(ps => [project, ...ps]);
    setModelInstantiateId(null);
    setSelectedProjectId(project.id);
  };
  const [leftWidth, setLeftWidth]   = useState(232);
  const [rightWidth, setRightWidth] = useState(288);
  const [leftCollapsed, setLeftCollapsed]   = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [collapsed, setCollapsed] = useState({ recents: false, projects: false, functions: false });
  const toggle = key => setCollapsed(c => ({ ...c, [key]: !c[key] }));
  const [currentProject, setCurrentProject] = useState('Micael Matthews SS26');
  const [currentArchetype, setCurrentArchetype] = useState(user?.archetypePrimary || 'Creative Director');

  // Greeting picked once per session — feels alive without being chaotic
  const [greeting] = useState(() => pickGreeting(user?.name?.split(' ')[0] || 'there'));

  // Cmd-K / Ctrl-K opens search palette — common SaaS shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Send to Claude. Uses the user's archetype to colour the system prompt
  // so HeyNia feels role-aware from the first message.
  const handleSend = async () => {
    const text = chatInput.trim();
    if (!text || chatBusy) return;
    setChatBusy(true); setChatReply(null);
    const sys = `You are Nia, a warm creative production assistant for ${user?.name || 'the user'}, a ${user?.archetypePrimary || 'Creative Director'} based in ${user?.location || 'Boston'}. Be concise, practical, helpful. Under 180 words.`;
    const reply = await callClaude(text, sys, { user, setUser });
    if (reply && typeof reply === 'object' && reply.gated) {
      // Tier gate fired — clear busy state, the upgrade modal is opening
      setChatBusy(false);
      return;
    }
    setChatReply(reply);
    setChatInput('');
    setChatBusy(false);
  };

  // ─── Project workflow state ────────────────────────────────
  // Real-project state lives at the App Shell (projects[]) and is passed
  // in via props. Local state here just tracks which overlays are open.
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectPrefill, setNewProjectPrefill] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [shareProjectId, setShareProjectId] = useState(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;
  const shareProject    = projects.find(p => p.id === shareProjectId) || null;

  // Project mutators — go through setProjects so the App Shell holds truth
  const updateProject = (next) => setProjects(ps => ps.map(p => p.id === next.id ? next : p));
  const deleteProject = (id) => {
    setProjects(ps => ps.filter(p => p.id !== id));
    if (selectedProjectId === id) setSelectedProjectId(null);
    if (shareProjectId === id)    setShareProjectId(null);
  };
  const createProject = (project) => {
    setProjects(ps => [project, ...ps]);
    setNewProjectOpen(false);
    setNewProjectPrefill({});
    setSelectedProjectId(project.id);  // open the new project's detail immediately
  };

  // ─── Tier-gated project creation ──────────────────────────
  // Single entry point for opening the new project flow. Checks the
  // user's tier limits via requireTier; on a paywall hit, dispatches
  // `nos:upgrade` with the constraint context instead of opening flow.
  const tryNewProject = (prefill = {}) => {
    const gate = requireTier('project', { user, projectCount: projects.length });
    if (!gate.allowed) {
      window.dispatchEvent(new CustomEvent('nos:upgrade', { detail: { feature: 'project', ...gate } }));
      return;
    }
    setNewProjectPrefill(prefill);
    setNewProjectOpen(true);
  };

  // Static fallback strings for when no real projects exist (preview only)
  const fallbackProjects = [
    'Micael Matthews SS26',
    'Coachella · Desert Rose House',
    'Netflix · How To Ruin Valentine\'s',
    'Kandasamys: The Baby — EPK',
    'Sbur Labs · Brand Discovery',
    'Function Studios — Q2 Roster',
  ];

  // Project list shown in left rail — real projects first, fallback when empty
  const railProjects = projects.length > 0
    ? projects.map(p => ({ id: p.id, label: p.name, real: true }))
    : fallbackProjects.map(name => ({ id: null, label: name, real: false }));

  // Recents — derive from real projects' updatedAt if any exist
  const recents = projects.length > 0
    ? [...projects].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
        .slice(0, 4)
        .map(p => ({ id: p.id, label: `${p.name} — ${(PROJECT_TYPES.find(t => t.id === p.type) || {}).label || 'Brief'}`, real: true }))
    : [
        { id: null, label: 'Micael Matthews SS26 — Editorial Brief',         real: false },
        { id: null, label: 'Teyana Taylor · Desert Rose · Coachella',         real: false },
        { id: null, label: 'Kandasamys: The Baby — Junket Brief',             real: false },
        { id: null, label: 'How To Ruin Valentine\'s — Production Bible',     real: false },
      ];

  // Left rail "Functions" section — Intelligence and Models are live; Agents is SOON.
  // Each item knows its own click target so the rail can route them in one map.
  const functionsRail = [
    { id: 'agents',       label: 'Agents',       soon: true,   onPick: null },
    { id: 'intelligence', label: 'Intelligence', soon: false,  onPick: () => setFunctionsOpen(true) },
    { id: 'models',       label: 'Models',       soon: false,  tag: 'New',
      onPick: () => { setFunctionsCategory('models'); setFunctionsOpen(true); } },
    { id: 'view-all',     label: 'View all',     soon: false,  onPick: () => setFunctionsOpen(true), dim: true },
  ];

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: T.pageBg, fontFamily: BODY, color: T.ink,
      padding: isMobile ? 0 : (isTablet ? 12 : 24),
      boxSizing: 'border-box',
      transition: `background ${EASE_DELIBERATE}, color ${EASE_DELIBERATE}`,
      position: 'relative',
    }}>
      <div style={{
        width: '100%', maxWidth: 1640, margin: '0 auto',
        height: isMobile ? '100vh' : `calc(100vh - ${isTablet ? 24 : 48}px)`,
        minHeight: isMobile ? '100vh' : 720,
        background: T.canvasBg,
        borderRadius: isMobile ? 0 : 18,
        overflow: 'hidden', position: 'relative',
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.panelShadow,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* TOP BAR */}
        <div style={{
          flexShrink: 0,
          height: isMobile ? 52 : 56,
          padding: isMobile ? '0 12px' : '0 20px',
          display: 'flex', alignItems: 'center',
          background: T.topBarBg,
          borderBottom: `1px solid ${T.topBarBorder || T.dividerInk}`,
          gap: isMobile ? 8 : 16,
        }}>
          {/* Mobile-only: hamburger that opens the left rail as a sheet */}
          {isMobile && (
            <button onClick={() => setMobileSheet('left')} aria-label="Open menu"
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink2,
                flexShrink: 0,
              }}>
              <ListIc s={16} c="currentColor" sw={1.6} />
            </button>
          )}
          <button onClick={() => setNosMenuOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: '4px 6px',
            flexShrink: 0,
          }}>
            <NOSMark T={T} size={13} />
            <ChevDown s={11} c={T.ink3} sw={1.4} />
          </button>
          {/* Centred breadcrumb — hidden on mobile to save horizontal space */}
          {!isMobile && (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
              <button title="Home" style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
              }}>
                <HomeIc s={14} c="currentColor" sw={1.5} />
              </button>
              <span style={{ fontFamily: BODY, fontSize: 13, color: T.ink4, lineHeight: 1 }}>›</span>
              <button onClick={() => setSwitcherOpen(o => !o)} style={{
                padding: '5px 12px', background: T.activeTabBg,
                border: `1px solid ${T.borderMd}`, borderRadius: 999,
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: BODY, fontSize: 12, fontWeight: 500,
                color: T.breadcrumb, letterSpacing: '-0.01em', cursor: 'pointer',
                maxWidth: isTablet ? 200 : 360,
              }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentProject.length > (isTablet ? 18 : 24) ? currentProject.slice(0, isTablet ? 18 : 24) + '…' : currentProject}
                </span>
                <ChevDown s={10} c={T.ink3} sw={1.5} />
              </button>
            </div>
          )}
          {/* Mobile breadcrumb — minimal, just project switcher button */}
          {isMobile && (
            <button onClick={() => setSwitcherOpen(o => !o)} style={{
              flex: 1, padding: '6px 10px', background: T.activeTabBg,
              border: `1px solid ${T.borderMd}`, borderRadius: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
              fontFamily: BODY, fontSize: 11.5, fontWeight: 500,
              color: T.breadcrumb, letterSpacing: '-0.01em', cursor: 'pointer',
              minWidth: 0,
            }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentProject}
              </span>
              <ChevDown s={9} c={T.ink3} sw={1.5} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 8, flexShrink: 0 }}>
            {/* Profile pill — always visible, becomes icon-only on mobile */}
            {isMobile ? (
              <button onClick={() => setProfileOpen(o => !o)} aria-label="Profile"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: profileOpen ? T.activeTabBg : 'transparent',
                  border: `1px solid ${T.borderMd}`, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, overflow: 'hidden',
                }}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                ) : (
                  <span style={{
                    fontFamily: BODY, fontStyle: 'italic', fontWeight: 600,
                    fontSize: 13, color: T.ink2,
                  }}>{(user?.name || 'N')[0]}</span>
                )}
              </button>
            ) : (
              <>
                {/* Profile — circular icon button. Renders the user's avatar
                    when present, otherwise a UserIc glyph. Replaces the
                    text "Profile" pill. */}
                <button onClick={() => setProfileOpen(o => !o)} aria-label="Profile"
                  title="Profile"
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: profileOpen ? T.activeTabBg : 'transparent',
                    border: `1px solid ${profileOpen ? 'transparent' : T.borderMd}`,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, overflow: 'hidden', flexShrink: 0,
                    color: profileOpen ? T.activeTabInk : T.pillInk,
                    transition: `all ${EASE_QUICK}`,
                  }}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  ) : (
                    <UserIc s={13} c="currentColor" sw={1.6} />
                  )}
                </button>
                {/* Preview — circular icon button with a play glyph.
                    Replaces the text "Preview" pill. */}
                <button onClick={() => nosToast('Preview — Phase 2', { eyebrow: 'Stub' })}
                  aria-label="Preview" title="Preview"
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'transparent',
                    border: `1px solid ${T.borderMd}`,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, flexShrink: 0,
                    color: T.pillInk,
                    transition: `all ${EASE_QUICK}`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = ACCENT}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = T.borderMd}>
                  <PlayIc s={11} c="currentColor" sw={1.6} />
                </button>
                <DBTopPill T={T} label="Share" active accent
                  onClick={() => setShareOpen(true)} />
              </>
            )}
          </div>
        </div>

        {/* BODY — three columns on desktop/tablet, single column with sheets on mobile */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {!leftCollapsed && !isMobile && (
            <aside style={{
              width: isTablet ? Math.min(leftWidth, 200) : leftWidth,
              flexShrink: 0, background: T.railBg,
              display: 'flex', flexDirection: 'column', overflowY: 'auto',
            }}>
              <DBRailSection T={T} label="Recents" count={recents.length}
                collapsed={collapsed.recents} onToggle={() => toggle('recents')}>
                {recents.map((r, i) => (
                  <DBRailItem key={i} T={T} label={r.label} dim={!r.real}
                    onClick={() => r.real && setSelectedProjectId(r.id)} />
                ))}
              </DBRailSection>
              <DBRailSection T={T} label="Projects" count={railProjects.length}
                collapsed={collapsed.projects} onToggle={() => toggle('projects')}>
                {railProjects.map((p, i) => (
                  <DBRailItem key={i} T={T} label={p.label} dim={!p.real}
                    onClick={() => p.real && setSelectedProjectId(p.id)} />
                ))}
                {/* Always-on Create CTA at the bottom of the section */}
                <button onClick={() => { tryNewProject(); }}
                  style={{
                    all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                    width: '100%', padding: '8px 8px',
                    margin: '6px -8px 0',
                    borderRadius: 6,
                    display: 'flex', alignItems: 'center', gap: 6,
                    color: ACCENT,
                    fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                    fontSize: 11.5, letterSpacing: '-0.005em',
                  }}>
                  <PlusIc s={10} c="currentColor" sw={1.6} />
                  <span>New project</span>
                </button>
              </DBRailSection>
              <DBRailSection T={T} label="Functions" last count={functionsRail.filter(f => !f.soon && f.id !== 'view-all').length}
                collapsed={collapsed.functions} onToggle={() => toggle('functions')}>
                {functionsRail.map((f, i) => (
                  <DBRailItem key={i} T={T} label={f.label}
                    dim={f.dim} soon={f.soon} tag={f.tag}
                    onClick={f.onPick} />
                ))}
              </DBRailSection>
              {/* Foundation upgrade pill — Master Guideline §4 quiet nudge.
                  Only renders for Foundation users; pulses softly to draw the
                  eye without screaming. Click dispatches the pricing modal. */}
              {(user?.tier || 'foundation') === 'foundation' && (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('nos:upgrade', { detail: { feature: 'pricing' } }))}
                  style={{
                    margin: '12px 14px 16px', padding: '10px 14px',
                    background: 'rgba(255,171,13,0.06)',
                    border: '1px solid rgba(255,171,13,0.20)',
                    borderRadius: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: `background ${EASE_QUICK}, border-color ${EASE_QUICK}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,171,13,0.10)';
                    e.currentTarget.style.borderColor = 'rgba(255,171,13,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,171,13,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255,171,13,0.20)';
                  }}>
                  <span style={{
                    color: ACCENT, display: 'flex',
                    animation: 'nia-pulse 2.4s ease-in-out infinite',
                  }}>
                    <SparkIc s={12} c="currentColor" sw={1.6} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{
                      fontFamily: MONO, fontSize: 8.5, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: ACCENT, marginBottom: 2,
                    }}>Foundation</div>
                    <div style={{
                      fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                      fontSize: 11.5, color: T.ink2, letterSpacing: '-0.005em',
                    }}>Upgrade your instance</div>
                  </div>
                  <ChevRight s={10} c={T.ink3} sw={1.6} />
                </button>
              )}
            </aside>
          )}
          {!isMobile && (
            <DBResizer T={T} side="left"
              width={leftWidth} setWidth={setLeftWidth}
              collapsed={leftCollapsed} setCollapsed={setLeftCollapsed}
              min={200} max={420} openTo={232} />
          )}

          <main style={{
            flex: 1, background: T.canvasBg,
            position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: isMobile ? 14 : 18,
              left: '50%', transform: 'translateX(-50%)',
              padding: isMobile ? '5px 12px' : '6px 16px',
              background: T.pillBg,
              border: `1px solid ${T.borderMd}`, borderRadius: 999, zIndex: 4,
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: isMobile ? 11 : 12,
              color: T.ink3, letterSpacing: '-0.005em',
            }}>
              <CanvasIc s={isMobile ? 10 : 11} c="currentColor" sw={1.5} />
              <span>{selectedProject ? selectedProject.name : 'Canvas'}</span>
            </div>
            {selectedProject ? (
              // Project opens INLINE on the canvas. The detail surface
              // mounts in the centre of the canvas with the Canvas pill,
              // tools dock, and rails still visible — the project is the
              // canvas's current content, not an overlay on top of it.
              <div style={{
                flex: 1, display: 'flex',
                paddingTop: isMobile ? 50 : 60,
                paddingBottom: isMobile ? 130 : 80,
                paddingLeft: isMobile ? 12 : 24,
                paddingRight: isMobile ? 12 : 24,
                minHeight: 0,
              }}>
                <div style={{
                  flex: 1, minWidth: 0, minHeight: 0,
                  background: T.cardBg,
                  borderRadius: isMobile ? 12 : 18,
                  border: `1px solid ${T.borderMd}`,
                  boxShadow: T.dockShadow,
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  maxWidth: 920, margin: '0 auto', width: '100%',
                }}>
                  <DBProjectDetail T={T} project={selectedProject}
                    user={user} setUser={setUser}
                    inline={true}
                    onClose={() => setSelectedProjectId(null)}
                    onUpdate={updateProject}
                    onDelete={deleteProject}
                    onShare={() => { setShareProjectId(selectedProject.id); }} />
                </div>
              </div>
            ) : (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                padding: isMobile ? '60px 20px 0' : '80px 40px 0',
              }}>
                <div style={{ width: 'min(440px, 92%)', textAlign: 'center' }}>
                  <div style={{
                    fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                    fontSize: isMobile ? 24 : 32,
                    lineHeight: 1.15, letterSpacing: '-0.02em',
                    color: T.ink2, marginBottom: 28,
                  }}>Start with an idea.</div>
                  {/* Actionable rows — each is a real button that fires the
                      surface it describes. The arrow on the right reinforces
                      that these are press-able, not just instructions. */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      {
                        label: 'Ask Nia',
                        sub: 'Open the chat panel and start a conversation',
                        onClick: () => setRightCollapsed(false),
                      },
                      {
                        label: 'Pick a Function',
                        sub: 'Use a structured workflow — brief, schedule, contacts',
                        onClick: () => setFunctionsOpen(true),
                      },
                    ].map((row, i) => (
                      <button key={i} onClick={row.onClick}
                        style={{
                          all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                          width: '100%', textAlign: 'left',
                          padding: '14px 6px',
                          borderTop: i === 0 ? `1px solid ${T.dividerInk}` : 'none',
                          borderBottom: `1px solid ${T.dividerInk}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          gap: 12, transition: `padding ${EASE_QUICK}, color ${EASE_QUICK}`,
                          color: T.ink2,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = '14px'; e.currentTarget.style.color = T.ink; }}
                        onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '6px'; e.currentTarget.style.color = T.ink2; }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{
                            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                            fontSize: isMobile ? 15 : 16,
                            letterSpacing: '-0.01em', lineHeight: 1.3,
                            marginBottom: 2,
                          }}>{row.label}</div>
                          <div style={{
                            fontFamily: BODY, fontSize: 12,
                            color: T.ink3, lineHeight: 1.45,
                          }}>{row.sub}</div>
                        </div>
                        <span style={{ color: T.ink3, display: 'flex', flexShrink: 0 }}>
                          <ChevRight s={13} c="currentColor" sw={1.6}/>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div style={{
              position: 'absolute',
              bottom: isMobile ? 140 : 88,
              left: 0, right: 0,
              textAlign: 'center', pointerEvents: 'none',
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 400,
              fontSize: 11.5, letterSpacing: '0.02em', color: T.inkSoft,
            }}>Nia Operating Systems, Inc.</div>
            <DBToolsDock T={T}
              active={activeTool} setActive={setActiveTool}
              onOpenSettings={onOpenSettings} isMobile={isMobile}
              user={user} projects={projects}
              rightCollapsed={rightCollapsed} setRightCollapsed={setRightCollapsed}
              onOpenFunctions={() => setFunctionsOpen(true)}
              onOpenFunction={pickFunction}
              onOpenContacts={() => setActiveFunction('contacts')}
              onOpenEvents={() => setActiveFunction('events')}
              onOpenLibrary={() => setLibraryOpen(true)} />
          </main>

          {!isMobile && (
            <DBResizer T={T} side="right"
              width={rightWidth} setWidth={setRightWidth}
              collapsed={rightCollapsed} setCollapsed={setRightCollapsed}
              min={240} max={480} openTo={288} />
          )}

          {!rightCollapsed && !isMobile && (
            <aside style={{
              width: isTablet ? Math.min(rightWidth, 240) : rightWidth,
              flexShrink: 0, background: T.rightBg,
              display: 'flex', flexDirection: 'column', position: 'relative',
              padding: '28px 22px',
            }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
                {/* Inline reply from Nia — appears above the bar after a send */}
                {(chatBusy || chatReply) && (
                  <div style={{
                    background: T.cardBgAlt,
                    border: `1px solid ${T.borderMd}`,
                    borderRadius: 12,
                    padding: '12px 14px',
                    marginBottom: 14,
                    maxHeight: 280, overflowY: 'auto',
                  }}>
                    <div style={{
                      fontFamily: MONO, fontSize: 9, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: T.ink4, marginBottom: 6,
                    }}>Nia</div>
                    <div style={{
                      fontFamily: BODY, fontSize: 12.5, lineHeight: 1.55,
                      color: T.ink2, whiteSpace: 'pre-wrap',
                    }}>{chatBusy ? 'Thinking…' : chatReply}</div>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{
                  fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 22, color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.2,
                }}>{greeting}</div>
              </div>
              <div style={{
                background: T.inputBg, border: `1px solid ${T.borderMd}`,
                borderRadius: 14, padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <textarea value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="What can I help you with?" rows={3}
                  disabled={chatBusy}
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    resize: 'none', width: '100%',
                    fontFamily: BODY, fontSize: 13, lineHeight: 1.5,
                    color: T.ink, letterSpacing: '-0.005em',
                    opacity: chatBusy ? 0.5 : 1,
                  }}/>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
                    letterSpacing: '0.10em', textTransform: 'uppercase', color: T.ink4,
                  }}>HeyNia</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button title="Voice" style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'transparent', border: `1px solid ${T.borderMd}`,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
                    }}>
                      <MicIc s={13} c="currentColor" sw={1.5} />
                    </button>
                    <button title="Send" onClick={handleSend} disabled={chatBusy || !chatInput.trim()}
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: chatBusy || !chatInput.trim() ? T.cardBgAlt : T.micBg,
                        border: 'none',
                        cursor: chatBusy || !chatInput.trim() ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: chatBusy || !chatInput.trim() ? T.ink4 : T.micInk,
                        transition: `all ${EASE_QUICK}`,
                    }}>
                      <SendIc s={13} c="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
              <div style={{
                marginTop: 14,
                fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: T.ink4, textAlign: 'right',
              }}>nOS · v1.3</div>
            </aside>
          )}
        </div>
      </div>

      {switcherOpen && (
        <DBProjectSwitcher T={T}
          recents={recents} projects={railProjects}
          archetypes={ARCHETYPES_QUICKPICK.map(a => ({ ...a, active: a.name === currentArchetype }))}
          currentArchetype={currentArchetype}
          onClose={() => setSwitcherOpen(false)}
          onPickProject={(row) => {
            // Real project? Open detail. Sample? Just update the breadcrumb.
            if (row.real && row.id) {
              setSelectedProjectId(row.id);
            } else {
              setCurrentProject((row.label || row).replace(/ — .*$/, ''));
            }
          }}
          onViewAll={() => setActiveTool('folder')}
          onNewProject={() => { tryNewProject(); }}
          onPickArchetype={(a) => setCurrentArchetype(a.name)}
          onViewAllArchetypes={() => setLibraryOpen(true)}
          onAddArchetype={() => setLibraryOpen(true)} />
      )}
      {newProjectOpen && (
        <DBNewProjectFlow T={T} prefill={newProjectPrefill}
          tierContext={{ user, setUser }}
          onCancel={() => { setNewProjectOpen(false); setNewProjectPrefill({}); }}
          onCreate={createProject} />
      )}
      {shareProject && (
        <DBShareModal T={T} project={shareProject}
          onClose={() => setShareProjectId(null)}
          onUpdate={updateProject} />
      )}
      {/* Top-bar Share pill — shares the currently-selected breadcrumb project */}
      {shareOpen && !shareProject && (() => {
        // Try to find a real project matching the breadcrumb. If none, prompt to create one.
        const match = projects.find(p => p.name === currentProject);
        if (match) {
          setShareProjectId(match.id); setShareOpen(false); return null;
        }
        return (
          <div onClick={() => setShareOpen(false)} style={{
            position: 'fixed', inset: 0, zIndex: 96, background: T.modalScrim,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              maxWidth: 420, padding: 24,
              background: T.cardBg, border: `1px solid ${T.borderMd}`,
              borderRadius: 14, boxShadow: T.dockShadow, fontFamily: BODY,
            }}>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 16, color: T.ink, marginBottom: 8,
              }}>Nothing to share yet.</div>
              <div style={{ fontFamily: BODY, fontSize: 13, color: T.ink3, lineHeight: 1.6, marginBottom: 18 }}>
                Create a project first — Sharing only works on real projects, not the sample preview shown in the breadcrumb.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <GhostButton T={T} onClick={() => setShareOpen(false)}>Close</GhostButton>
                <PrimaryButton T={T} onClick={() => { setShareOpen(false); tryNewProject(); }}>
                  Create project
                </PrimaryButton>
              </div>
            </div>
          </div>
        );
      })()}
      {libraryOpen && (
        <DBSkillsLibrary T={T}
          user={user}
          currentArchetype={currentArchetype}
          onPick={(a) => {
            setCurrentArchetype(a.name);
            // Persist the choice — profile updates the user record too
            setUser && setUser(u => ({ ...u, archetypePrimary: a.name }));
          }}
          onClose={() => setLibraryOpen(false)} />
      )}
      {profileOpen && setUser && (
        <DBProfilePanel T={T} user={user} setUser={setUser}
          onClose={() => setProfileOpen(false)}
          onOpenSettings={onOpenSettings}
          onLogOut={onLogOut}
          onPickArchetype={() => { setProfileOpen(false); setLibraryOpen(true); }} />
      )}
      {nosMenuOpen && (
        <DBNOSMenu T={T} skinKey={skinKey} setSkinKey={setSkinKey}
          onClose={() => setNosMenuOpen(false)}
          onOpenSettings={onOpenSettings}
          onOpenFile={() => setFileOpen(true)}
          onOpenLanguage={() => setLanguageOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenHelp={() => setHelpOpen(true)}
          onOpenCommunity={() => setCommunityOpen(true)}
          onOpenLearnMore={() => setLearnMoreOpen(true)}
          onLogOut={onLogOut} user={user} />
      )}
      {fileOpen && (
        <DBFileMenu T={T} projects={projects}
          onNewProject={() => { tryNewProject(); }}
          onOpenProject={(id) => setSelectedProjectId(id)}
          onClose={() => setFileOpen(false)} />
      )}
      {languageOpen && setUser && (
        <DBLanguageModal T={T} user={user} setUser={setUser}
          onClose={() => setLanguageOpen(false)} />
      )}
      {searchOpen && (
        <DBSearchPalette T={T} projects={projects}
          onOpenProject={(id) => setSelectedProjectId(id)}
          onOpenSettings={(section) => onOpenSettings(section)}
          onOpenLibrary={() => setLibraryOpen(true)}
          onOpenFunction={pickFunction}
          onOpenFunctions={() => setFunctionsOpen(true)}
          onClose={() => setSearchOpen(false)} />
      )}
      {helpOpen && (
        <DBHelpCenter T={T} onClose={() => setHelpOpen(false)} />
      )}
      {communityOpen && (
        <DBCommunityModal T={T} onClose={() => setCommunityOpen(false)} />
      )}
      {learnMoreOpen && (
        <DBLearnMoreModal T={T} onClose={() => setLearnMoreOpen(false)} />
      )}

      {/* ─── FUNCTIONS — Phase 2 ────────────────────────────────
         Browser → category picker. Detail screens for each Function.
         First-use tutorial gates the whole experience until dismissed
         (then persists in user.tutorialsSeen.functions).               */}
      {functionsOpen && (
        <DBFunctionsBrowser T={T} user={user}
          initialCategory={functionsCategory}
          onClose={() => { setFunctionsOpen(false); setFunctionsCategory('intelligence'); }}
          onPickFunction={pickFunction}
          onPickModel={pickModel} />
      )}
      {activeFunction === 'contacts' && (
        <DBContactsFunction T={T}
          onClose={() => setActiveFunction(null)} />
      )}
      {activeFunction === 'events' && (
        <DBEventsFunction T={T}
          onClose={() => setActiveFunction(null)} />
      )}
      {/* Models — Phase 3 */}
      {modelDetailId && (
        <DBModelDetail T={T} modelId={modelDetailId}
          onClose={() => setModelDetailId(null)}
          onUse={useModel} />
      )}
      {modelInstantiateId && (
        <DBModelInstantiate T={T} modelId={modelInstantiateId}
          tierContext={{ user, setUser }}
          onCancel={() => setModelInstantiateId(null)}
          onCreate={completeModelInstantiation} />
      )}
      {tutorialShowing && setUser && (
        <DBFunctionTutorial T={T} onDismiss={dismissTutorial} />
      )}

      {/* ─── MOBILE RAIL SHEET (left) ────────────────────────────
         On mobile the left rail isn't part of the layout. It's a
         drawer that slides in from the left when the hamburger
         is tapped. Same content as the desktop rail, just remounted
         here so the layout above stays clean.                    */}
      {isMobile && mobileSheet === 'left' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 80,
          background: T.modalScrim,
          display: 'flex',
        }}>
          <div onClick={() => setMobileSheet(null)} style={{ flex: 1 }}/>
          <aside style={{
            width: 'min(320px, 88vw)', flexShrink: 0,
            background: T.railBg,
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto', overflowX: 'hidden',
            boxShadow: T.dockShadow,
          }}>
            <div style={{
              padding: '14px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: `1px solid ${T.dividerInk}`, flexShrink: 0,
            }}>
              <NOSMark T={T} size={13} label="Menu" />
              <button onClick={() => setMobileSheet(null)} aria-label="Close menu"
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
                }}>
                <CloseIc s={11} c="currentColor" sw={1.6} />
              </button>
            </div>
            <DBRailSection T={T} label="Recents" count={recents.length}
              collapsed={collapsed.recents} onToggle={() => toggle('recents')}>
              {recents.map((r, i) => (
                <DBRailItem key={i} T={T} label={r.label} dim={!r.real}
                  onClick={() => { if (r.real) { setSelectedProjectId(r.id); setMobileSheet(null); } }} />
              ))}
            </DBRailSection>
            <DBRailSection T={T} label="Projects" count={railProjects.length}
              collapsed={collapsed.projects} onToggle={() => toggle('projects')}>
              {railProjects.map((p, i) => (
                <DBRailItem key={i} T={T} label={p.label} dim={!p.real}
                  onClick={() => { if (p.real) { setSelectedProjectId(p.id); setMobileSheet(null); } }} />
              ))}
              <button onClick={() => { tryNewProject(); setMobileSheet(null); }}
                style={{
                  all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                  width: '100%', padding: '10px 8px', margin: '6px -8px 0',
                  borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6,
                  color: ACCENT,
                  fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 12, letterSpacing: '-0.005em',
                }}>
                <PlusIc s={11} c="currentColor" sw={1.6} />
                <span>New project</span>
              </button>
            </DBRailSection>
            <DBRailSection T={T} label="Functions" last count={functionsRail.filter(f => !f.soon && f.id !== 'view-all').length}
              collapsed={collapsed.functions} onToggle={() => toggle('functions')}>
              {functionsRail.map((f, i) => (
                <DBRailItem key={i} T={T} label={f.label}
                  dim={f.dim} soon={f.soon} tag={f.tag}
                  onClick={() => { if (f.onPick) { f.onPick(); setMobileSheet(null); } }} />
              ))}
            </DBRailSection>
          </aside>
        </div>
      )}

      {/* ─── MOBILE INTELLIGENCE BAR (sticky bottom) ────────────
         The right rail's chat composer collapses onto the canvas
         floor on mobile. Tapping it opens the full chat sheet.   */}
      {isMobile && (
        <div style={{
          position: 'fixed', left: 12, right: 12, bottom: 14,
          zIndex: 25,
          background: T.cardBg,
          border: `1px solid ${T.borderMd}`,
          borderRadius: 999,
          boxShadow: T.dockShadow,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px 8px 16px',
        }}>
          <span style={{
            fontFamily: BODY, fontStyle: 'italic', fontSize: 13,
            color: T.ink3, flex: 1, letterSpacing: '-0.005em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
            onClick={() => setMobileSheet('right')}>
            {chatBusy ? 'Thinking…' : (chatReply ? 'Tap to continue…' : 'What can I help you with?')}
          </span>
          <button onClick={() => setMobileSheet('right')} aria-label="Open chat"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: T.micBg, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.micInk, flexShrink: 0,
            }}>
            <SendIc s={14} c="currentColor" />
          </button>
        </div>
      )}

      {/* ─── MOBILE CHAT SHEET (right) ──────────────────────────
         Full-height bottom sheet showing the welcome card, the last
         reply, and the composer.                                 */}
      {isMobile && mobileSheet === 'right' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 81,
          background: T.modalScrim,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <div onClick={() => setMobileSheet(null)} style={{ flex: 1, minHeight: 80 }}/>
          <div style={{
            background: T.rightBg,
            borderTopLeftRadius: 18, borderTopRightRadius: 18,
            padding: '20px 18px 24px',
            boxShadow: T.dockShadow,
            display: 'flex', flexDirection: 'column',
            maxHeight: '85vh',
          }}>
            <div style={{
              width: 40, height: 4, borderRadius: 2,
              background: T.borderMd, margin: '0 auto 16px',
            }}/>
            {(chatBusy || chatReply) && (
              <div style={{
                background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                borderRadius: 12, padding: '12px 14px', marginBottom: 14,
                maxHeight: 'min(50vh, 320px)', overflowY: 'auto',
              }}>
                <div style={{
                  fontFamily: MONO, fontSize: 9, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: T.ink4, marginBottom: 6,
                }}>Nia</div>
                <div style={{
                  fontFamily: BODY, fontSize: 13, lineHeight: 1.55,
                  color: T.ink2, whiteSpace: 'pre-wrap',
                }}>{chatBusy ? 'Thinking…' : chatReply}</div>
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 20, color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.2,
              }}>{greeting}</div>
            </div>
            <div style={{
              background: T.inputBg, border: `1px solid ${T.borderMd}`,
              borderRadius: 14, padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <textarea value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="What can I help you with?" rows={3}
                disabled={chatBusy}
                autoFocus
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  resize: 'none', width: '100%',
                  fontFamily: BODY, fontSize: 14, lineHeight: 1.5,
                  color: T.ink, letterSpacing: '-0.005em',
                  opacity: chatBusy ? 0.5 : 1,
                }}/>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
                  letterSpacing: '0.10em', textTransform: 'uppercase', color: T.ink4,
                }}>HeyNia</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setMobileSheet(null)} title="Close" style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'transparent', border: `1px solid ${T.borderMd}`,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3,
                  }}>
                    <CloseIc s={12} c="currentColor" sw={1.6} />
                  </button>
                  <button onClick={handleSend} title="Send"
                    disabled={chatBusy || !chatInput.trim()}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: chatBusy || !chatInput.trim() ? T.cardBgAlt : T.micBg,
                      border: 'none',
                      cursor: chatBusy || !chatInput.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: chatBusy || !chatInput.trim() ? T.ink4 : T.micInk,
                    }}>
                    <SendIc s={14} c="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* END OF REGION 3 — DASHBOARD MODULE */

/* ════════════════════════════════════════════════════════════════════════════
   ┃                                                                          ┃
   ┃   REGION 4 · SETTINGS MODULE                                             ┃
   ┃   ───────────────────────────                                            ┃
   ┃                                                                          ┃
   ┃   Contract:                                                              ┃
   ┃     <SettingsModal                                                       ┃
   ┃       user={user} setUser={setUser}                                      ┃
   ┃       skinKey={skinKey} setSkinKey={setSkinKey}                          ┃
   ┃       initialSection={'account'|'profile'|...}  (optional deep-link)     ┃
   ┃       onClose={() => ...}                                                ┃
   ┃       onLogOut={() => ...}                                               ┃
   ┃       onDeleteAccount={() => ...}                                        ┃
   ┃     />                                                                   ┃
   ┃                                                                          ┃
   ┃   The standard SaaS-table-stakes surfaces. Modal overlay reachable       ┃
   ┃   from the nOS dropdown menu and the Quick Tools dock. Sidebar nav       ┃
   ┃   on the left, scrollable content on the right.                          ┃
   ┃                                                                          ┃
   ┃   Sections (each is its own sub-component, edit in isolation):           ┃
   ┃     · Account     — email, password, connected providers                 ┃
   ┃     · Profile     — name, location, role, archetypes, photo              ┃
   ┃     · Preferences — skin, language, timezone, profile suggestions        ┃
   ┃     · Notifications — email digest, in-app, mention alerts               ┃
   ┃     · Privacy & Data — data download, scrape opt-out                     ┃
   ┃     · Billing     — plan, payment method, invoices                       ┃
   ┃     · Workspace   — name, members (multi-seat placeholder)               ┃
   ┃     · Help        — shortcuts, support, version                          ┃
   ┃     · Danger zone — sign out, delete account                             ┃
   ┃                                                                          ┃
   ════════════════════════════════════════════════════════════════════════════ */

/* ─── ST · sidebar nav item ─────────────────────────────────── */
function STNavItem({ T, icon, label, active, onClick, danger }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
        width: '100%', padding: '9px 14px', borderRadius: 8,
        display: 'flex', alignItems: 'center', gap: 10,
        background: active ? T.activeTabBg : (hover ? T.dividerInk : 'transparent'),
        color: danger ? (active || hover ? DANGER : T.ink3) : (active ? T.ink : T.ink2),
        transition: `background ${EASE_QUICK}, color ${EASE_QUICK}`,
      }}>
      <span style={{ display: 'flex', flexShrink: 0, color: 'currentColor' }}>{icon}</span>
      <span style={{
        fontFamily: BODY, fontWeight: 500, fontSize: 12.5,
        letterSpacing: '-0.005em',
      }}>{label}</span>
    </button>
  );
}

/* ─── ST · section heading inside content area ─────────────── */
function STSection({ T, title, description, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{
        fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
        fontSize: 22, color: T.ink, letterSpacing: '-0.015em',
        marginBottom: description ? 6 : 18,
      }}>{title}</div>
      {description && (
        <div style={{
          fontFamily: BODY, fontSize: 12.5, color: T.ink3,
          lineHeight: 1.55, marginBottom: 22, maxWidth: 540,
        }}>{description}</div>
      )}
      {children}
    </div>
  );
}

/* ─── ST · row within a section (label + control) ──────────── */
function STRow({ T, label, hint, children, danger, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', gap: 24,
      padding: '16px 0',
      borderBottom: last ? 'none' : `1px solid ${T.dividerInk}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: BODY, fontWeight: 500, fontSize: 13,
          color: danger ? DANGER : T.ink, letterSpacing: '-0.005em',
          marginBottom: hint ? 3 : 0,
        }}>{label}</div>
        {hint && (
          <div style={{
            fontFamily: BODY, fontSize: 11.5, color: T.ink3,
            lineHeight: 1.5, maxWidth: 460,
          }}>{hint}</div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

/* ─── ST · inline edit value (display + edit button) ───────── */
function STInlineValue({ T, value, monospace, onEdit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        fontFamily: monospace ? MONO : BODY, fontSize: 12.5,
        color: T.ink2, fontStyle: monospace ? 'normal' : 'italic',
        fontWeight: 500,
      }}>{value}</span>
      {onEdit && (
        <button onClick={onEdit} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: T.ink3, padding: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <EditIc s={11} c="currentColor" sw={1.6} />
        </button>
      )}
    </div>
  );
}

/* ─── ST · status chip ─────────────────────────────────────── */
function STChip({ T, label, tone = 'neutral' }) {
  const tones = {
    success: { bg: 'rgba(92,184,138,0.12)', border: 'rgba(92,184,138,0.30)', ink: SUCCESS },
    danger:  { bg: 'rgba(224,122,95,0.12)', border: 'rgba(224,122,95,0.30)', ink: DANGER },
    accent:  { bg: 'rgba(255,171,13,0.12)', border: 'rgba(255,171,13,0.30)', ink: ACCENT },
    neutral: { bg: T.cardBgAlt,             border: T.borderMd,              ink: T.ink3 },
  };
  const c = tones[tone];
  return (
    <span style={{
      fontFamily: MONO, fontSize: 9, fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: c.ink, padding: '3px 8px', borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`,
    }}>{label}</span>
  );
}

/* ─── ST · skin swatch picker ───────────────────────────────── */
function STSkinPicker({ T, skinKey, setSkinKey }) {
  const skins = [
    { key: 'pale',     swatch: '#FFFFFF' },
    { key: 'silver',   swatch: '#F1EFEC' },
    { key: 'metallic', swatch: 'linear-gradient(180deg,#F4F4F7 0%,#C3C1C7 100%)' },
    { key: 'charcoal', swatch: '#26261F' },
  ];
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {skins.map(s => {
        const active = skinKey === s.key;
        return (
          <button key={s.key} onClick={() => setSkinKey(s.key)} title={SKINS[s.key].name}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: s.swatch, border: `1px solid ${T.borderMd}`,
              cursor: 'pointer', padding: 0,
              boxShadow: active ? `0 0 0 2px ${T.cardBg}, 0 0 0 3px ${ACCENT}` : 'none',
              transition: `box-shadow ${EASE_QUICK}`,
            }}/>
        );
      })}
    </div>
  );
}

/* ─── ST · select-like dropdown stub ───────────────────────── */
function STSelect({ T, value, options, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      background: T.inputBg, border: `1px solid ${T.borderMd}`,
      borderRadius: 8, padding: '8px 12px',
      fontFamily: BODY, fontSize: 12.5, color: T.ink,
      cursor: 'pointer', outline: 'none', minWidth: 180,
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

/* ─── ST · ACCOUNT section ─────────────────────────────────── */
function STAccount({ T, user, setUser }) {
  const [editingPw, setEditingPw] = useState(false);
  return (
    <STSection T={T} title="Account"
      description="Your sign-in credentials and connected providers. Changes take effect immediately.">

      <STRow T={T} label="Email"
        hint="Primary email address. Used for sign-in, notifications, and account recovery.">
        <STInlineValue T={T} value={user.email || 'you@studio.com'} monospace
          onEdit={() => nosToast('Email change → confirmation sent.', { eyebrow: 'Account' })} />
      </STRow>

      <STRow T={T} label="Email verified"
        hint="Verification confirms account ownership. Required for password resets.">
        <STChip T={T} label={user.emailVerified ? 'Verified' : 'Unverified'}
          tone={user.emailVerified ? 'success' : 'danger'} />
      </STRow>

      <STRow T={T} label="Password"
        hint={user.provider === 'google'
          ? 'Managed by Google. Change it in your Google account.'
          : 'Minimum 8 characters. We recommend a unique passphrase.'}>
        {user.provider === 'google'
          ? <STChip T={T} label="Google managed" />
          : (
            <button onClick={() => setEditingPw(e => !e)} style={{
              background: 'transparent', border: `1px solid ${T.borderMd}`,
              borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
              fontFamily: BODY, fontSize: 12, fontWeight: 500,
              color: T.ink2, letterSpacing: '-0.005em',
            }}>{editingPw ? 'Cancel' : 'Change password'}</button>
          )}
      </STRow>

      {editingPw && (
        <div style={{
          padding: 18, marginTop: 4, marginBottom: 4,
          background: T.cardBgAlt, borderRadius: 12,
          border: `1px solid ${T.borderMd}`,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <Field T={T} label="Current password">
            <Input T={T} value="" onChange={() => {}} type="password" placeholder="••••••••" />
          </Field>
          <Field T={T} label="New password" hint="Minimum 8 characters.">
            <Input T={T} value="" onChange={() => {}} type="password" placeholder="••••••••" />
          </Field>
          <Field T={T} label="Confirm new password">
            <Input T={T} value="" onChange={() => {}} type="password" placeholder="••••••••" />
          </Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <GhostButton T={T} onClick={() => setEditingPw(false)}>Cancel</GhostButton>
            <PrimaryButton T={T} onClick={() => { setEditingPw(false); nosToast('Password updated.', { eyebrow: 'Account', kind: 'success' }); }}>
              Update password
            </PrimaryButton>
          </div>
        </div>
      )}

      <STRow T={T} label="Connected accounts"
        hint="Sign-in providers linked to this account.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px',
            background: T.cardBgAlt, borderRadius: 999,
            border: `1px solid ${T.borderMd}`,
          }}>
            <GoogleIc s={13} />
            <span style={{ fontFamily: BODY, fontSize: 11.5, color: T.ink2, fontWeight: 500 }}>
              Google
            </span>
            {user.provider === 'google' &&
              <STChip T={T} label="Active" tone="success" />}
          </div>
        </div>
      </STRow>

      <STRow T={T} last label="Account created"
        hint="Date your account was provisioned.">
        <STInlineValue T={T} value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'} monospace />
      </STRow>
    </STSection>
  );
}

/* ─── ST · PROFILE section ─────────────────────────────────── */
function STProfile({ T, user, setUser }) {
  const fileRef = useRef(null);
  const handleFile = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => setUser(u => ({ ...u, avatarUrl: e.target.result }));
    r.readAsDataURL(file);
  };
  return (
    <STSection T={T} title="Profile"
      description="How you appear in Nia and to collaborators. This data shapes your archetype's recommendations.">

      <div style={{
        display: 'flex', alignItems: 'center', gap: 18,
        padding: '20px 0', borderBottom: `1px solid ${T.dividerInk}`,
      }}>
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" style={{
            width: 64, height: 64, borderRadius: '50%',
            objectFit: 'cover', border: `1px solid ${T.borderMd}`,
          }}/>
        ) : (
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 600,
            fontSize: 24, color: T.ink3,
          }}>{(user.name || 'N')[0]}</div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 13, color: T.ink, marginBottom: 2 }}>
            Profile photo
          </div>
          <div style={{ fontFamily: BODY, fontSize: 11.5, color: T.ink3, lineHeight: 1.5 }}>
            JPG or PNG. Optional. Visible to collaborators on shared projects.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => fileRef.current?.click()} style={{
            background: 'transparent', border: `1px solid ${T.borderMd}`,
            borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
            fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink2,
          }}>Upload</button>
          {user.avatarUrl && (
            <button onClick={() => setUser(u => ({ ...u, avatarUrl: null }))} style={{
              background: 'transparent', border: `1px solid ${T.borderMd}`,
              borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
              fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink3,
            }}>Remove</button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden
          onChange={e => handleFile(e.target.files[0])}/>
      </div>

      <STRow T={T} label="Full name">
        <div style={{ width: 280 }}>
          <Input T={T} value={user.name} onChange={v => setUser(u => ({ ...u, name: v }))}
            placeholder="Your name" />
        </div>
      </STRow>

      <STRow T={T} label="City"
        hint="Used for regional NRI rates and local team matching.">
        <div style={{ width: 280 }}>
          <Input T={T} value={user.location} onChange={v => setUser(u => ({ ...u, location: v }))}
            placeholder="Boston" />
        </div>
      </STRow>

      <STRow T={T} label="Title"
        hint="The short title that appears on briefs and shared work.">
        <div style={{ width: 280 }}>
          <Input T={T} value={user.role} onChange={v => setUser(u => ({ ...u, role: v }))}
            placeholder="Creative Director" />
        </div>
      </STRow>

      <STRow T={T} label="Primary archetype"
        hint="Drives shortcut suggestions and brief templates. From the NRI Library of 282.">
        <STInlineValue T={T} value={user.archetypePrimary || '—'}
          onEdit={() => nosToast('Archetype picker.', { eyebrow: 'Stub' })} />
      </STRow>

      <STRow T={T} last label="Secondary archetypes"
        hint="Up to 2 additional disciplines if your work spans roles.">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {(user.archetypeSecondary || []).length === 0
            ? <span style={{ fontFamily: BODY, fontSize: 12, color: T.ink4, fontStyle: 'italic' }}>None</span>
            : user.archetypeSecondary.map(a => <STChip key={a} T={T} label={a} />)}
          <button onClick={() => nosToast('Secondary archetype picker.', { eyebrow: 'Stub' })} style={{
            background: 'transparent', border: `1px dashed ${T.borderMd}`,
            borderRadius: 999, padding: '3px 10px', cursor: 'pointer',
            fontFamily: BODY, fontSize: 10.5, color: T.ink3, fontStyle: 'italic',
          }}>+ Add</button>
        </div>
      </STRow>
    </STSection>
  );
}

/* ─── ST · PREFERENCES section ──────────────────────────────── */
function STPreferences({ T, user, setUser, skinKey, setSkinKey }) {
  return (
    <STSection T={T} title="Preferences"
      description="How Nia looks and behaves for you. Workspace-level customization.">

      <STRow T={T} label="Skin"
        hint="Theme palette. Community-built designs are coming soon.">
        <STSkinPicker T={T} skinKey={skinKey} setSkinKey={setSkinKey} />
      </STRow>

      <STRow T={T} label="Language"
        hint="Interface language. Changes take effect on next session.">
        <STSelect T={T}
          value={user.language || 'en'}
          options={[
            { value: 'en',    label: 'English' },
            { value: 'es',    label: 'Español' },
            { value: 'fr',    label: 'Français' },
            { value: 'pt',    label: 'Português' },
            { value: 'zu',    label: 'isiZulu' },
          ]}
          onChange={v => setUser(u => ({ ...u, language: v }))} />
      </STRow>

      <STRow T={T} label="Timezone"
        hint="Used for deadlines, scheduling, and timestamp display.">
        <STSelect T={T}
          value={user.timezone || 'America/New_York'}
          options={[
            { value: 'America/New_York',     label: 'Eastern (US/Canada)' },
            { value: 'America/Los_Angeles',  label: 'Pacific (US/Canada)' },
            { value: 'Europe/London',        label: 'London (GMT/BST)' },
            { value: 'Africa/Johannesburg',  label: 'Johannesburg (SAST)' },
            { value: 'Asia/Tokyo',           label: 'Tokyo (JST)' },
          ]}
          onChange={v => setUser(u => ({ ...u, timezone: v }))} />
      </STRow>

      <Toggle T={T}
        on={user.allowProfileSuggestions !== false}
        onChange={v => setUser(u => ({ ...u, allowProfileSuggestions: v }))}
        label="Profile suggestions"
        description="Let Nia pre-fill profile fields from your public sources (LinkedIn, Behance, web search) at sign-in. Disable to skip the pre-population job."/>

      <Toggle T={T}
        on={user.compactDensity || false}
        onChange={v => setUser(u => ({ ...u, compactDensity: v }))}
        label="Compact density"
        description="Tighten padding throughout the interface. Useful on smaller screens."/>

      <Toggle T={T}
        on={user.reducedMotion || false}
        onChange={v => setUser(u => ({ ...u, reducedMotion: v }))}
        label="Reduce motion"
        description="Minimise animations and transitions. Respects your OS-level preference by default."/>
    </STSection>
  );
}

/* ─── ST · NOTIFICATIONS section ────────────────────────────── */
function STNotifications({ T, user, setUser }) {
  const n = user.notifications || {
    emailDigest: 'weekly', mentions: true, comments: true,
    shares: true, productUpdates: false, marketing: false,
  };
  const set = (patch) => setUser(u => ({ ...u, notifications: { ...n, ...patch } }));
  return (
    <STSection T={T} title="Notifications"
      description="What you get notified about, and where. Email and in-app are configured separately.">

      <STRow T={T} label="Email digest cadence"
        hint="Roll-up of activity sent to your email.">
        <STSelect T={T} value={n.emailDigest}
          options={[
            { value: 'off',     label: 'Off' },
            { value: 'daily',   label: 'Daily' },
            { value: 'weekly',  label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
          onChange={v => set({ emailDigest: v })} />
      </STRow>

      <Toggle T={T} on={n.mentions} onChange={v => set({ mentions: v })}
        label="Mentions" description="Email + in-app when someone @mentions you in a brief or comment."/>
      <Toggle T={T} on={n.comments} onChange={v => set({ comments: v })}
        label="Comments on your work" description="When a collaborator leaves feedback on a section you authored."/>
      <Toggle T={T} on={n.shares} onChange={v => set({ shares: v })}
        label="Shared with you" description="When someone gives you access to a project, brief, or Function."/>
      <Toggle T={T} on={n.productUpdates} onChange={v => set({ productUpdates: v })}
        label="Product updates" description="Major releases, new Functions, archetype additions. ~1 email/month."/>
      <Toggle T={T} on={n.marketing} onChange={v => set({ marketing: v })}
        label="Marketing & community" description="Stories from other Nia users, community templates, events. Optional."/>
    </STSection>
  );
}

/* ─── ST · PRIVACY & DATA section ───────────────────────────── */
function STPrivacy({ T, user, setUser }) {
  const p = user.privacy || { thirdPartyScrape: true, taste: true, telemetry: true };
  const set = (patch) => setUser(u => ({ ...u, privacy: { ...p, ...patch } }));
  return (
    <STSection T={T} title="Privacy & Data"
      description="What Nia stores, learns from, and shares. You control the inputs.">

      <Toggle T={T} on={p.thirdPartyScrape} onChange={v => set({ thirdPartyScrape: v })}
        label="Third-party profile lookups"
        description="Allow Nia to look up public LinkedIn / Behance / web mentions when you sign up or update your profile. Already-stored data is unaffected."/>

      <Toggle T={T} on={p.taste} onChange={v => set({ taste: v })}
        label="Build my taste profile"
        description="Nia learns your voice from references kept, briefs rewritten, AI outputs accepted. This is what makes your fifth project sound like you. Disabling pauses learning but doesn't delete what's already there."/>

      <Toggle T={T} on={p.telemetry} onChange={v => set({ telemetry: v })}
        label="Anonymous usage analytics"
        description="Helps us improve Nia. No content, no PII — just aggregate counts of features used."/>

      <STRow T={T} label="Download my data"
        hint="Export everything Nia stores about you — profile, projects, briefs, references — as a single archive.">
        <button onClick={() => nosToast('Export queued. Download link emailed within 24 hours.', { eyebrow: 'Privacy' })}
          style={{
            background: 'transparent', border: `1px solid ${T.borderMd}`,
            borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
            fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink2,
          }}>Request export</button>
      </STRow>

      <STRow T={T} last label="Data retention"
        hint="Briefs and projects are kept until you delete them. Voice memos transcribed to text after 30 days; original audio deleted. Aggregate analytics retained 13 months.">
        <STInlineValue T={T} value="Standard" />
      </STRow>
    </STSection>
  );
}

/* ─── ST · BILLING section ──────────────────────────────────── */
function STBilling({ T, user }) {
  const plan = user.plan || { tier: 'free', renews: null };
  return (
    <STSection T={T} title="Billing"
      description="Your plan, payment method, and invoice history.">

      <div style={{
        padding: '20px 22px',
        background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
        borderRadius: 14, marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18,
      }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: T.ink4, marginBottom: 6,
          }}>Current plan</div>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 22, color: T.ink, letterSpacing: '-0.015em',
          }}>{plan.tier === 'free' ? 'Free' : plan.tier === 'pro' ? 'Pro · $24/mo' : 'Studio · $96/mo'}</div>
          <div style={{ fontFamily: BODY, fontSize: 11.5, color: T.ink3, marginTop: 4 }}>
            {plan.tier === 'free'
              ? 'Up to 3 projects, 50 briefs/mo. Upgrade for unlimited.'
              : plan.renews ? `Renews ${new Date(plan.renews).toLocaleDateString()}` : 'Active'}
          </div>
        </div>
        <PrimaryButton T={T} onClick={() => window.dispatchEvent(new CustomEvent('nos:upgrade', { detail: { feature: 'pricing' } }))}>
          {plan.tier === 'free' ? 'Upgrade' : 'Change plan'}
        </PrimaryButton>
      </div>

      <STRow T={T} label="Payment method"
        hint="Used for plan renewal and add-ons.">
        {plan.tier === 'free'
          ? <span style={{ fontFamily: BODY, fontSize: 12, color: T.ink4, fontStyle: 'italic' }}>None on file</span>
          : <STInlineValue T={T} value="•••• •••• •••• 4242" monospace
              onEdit={() => nosToast('Card update — Stripe element.', { eyebrow: 'Stub' })} />}
      </STRow>

      <STRow T={T} label="Billing email"
        hint="Where invoices are sent. Defaults to your account email.">
        <STInlineValue T={T} value={user.billingEmail || user.email || '—'} monospace
          onEdit={() => nosToast('Update billing email.', { eyebrow: 'Stub' })} />
      </STRow>

      <STRow T={T} last label="Invoices"
        hint="Past invoices are kept for 7 years per regulatory requirements.">
        <button onClick={() => nosToast('Invoice history.', { eyebrow: 'Stub' })} style={{
          background: 'transparent', border: `1px solid ${T.borderMd}`,
          borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
          fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink2,
        }}>View invoices</button>
      </STRow>
    </STSection>
  );
}

/* ─── ST · WORKSPACE section ────────────────────────────────── */
function STWorkspace({ T, user, setUser }) {
  const ws = user.workspace || { name: `${(user.name || 'Your').split(' ')[0]}'s Workspace`, members: [] };
  return (
    <STSection T={T} title="Workspace"
      description="Multi-seat workspace settings. Invite collaborators when your team is ready.">

      <STRow T={T} label="Workspace name"
        hint="The name your team sees in shared projects and exports.">
        <div style={{ width: 280 }}>
          <Input T={T} value={ws.name}
            onChange={v => setUser(u => ({ ...u, workspace: { ...ws, name: v } }))}
            placeholder="Workspace name" />
        </div>
      </STRow>

      <STRow T={T} label="Members"
        hint="Currently solo. Multi-seat workspaces ship in v1.5.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <STChip T={T} label="1 member · You" />
          <STChip T={T} label="Soon" tone="accent" />
        </div>
      </STRow>

      <STRow T={T} last label="Invite collaborators"
        hint="Send a link to add someone as a viewer, editor, or admin.">
        <button disabled style={{
          background: 'transparent', border: `1px dashed ${T.borderMd}`,
          borderRadius: 8, padding: '7px 14px', cursor: 'not-allowed',
          fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink4,
        }}>Send invite (Soon)</button>
      </STRow>
    </STSection>
  );
}

/* ─── ST · HELP section ─────────────────────────────────────── */
function STHelp({ T }) {
  const shortcuts = [
    { keys: ['⌘', 'K'],     desc: 'Open command palette' },
    { keys: ['⌘', '/'],     desc: 'Focus the Intelligence Bar' },
    { keys: ['⌘', 'N'],     desc: 'New project' },
    { keys: ['⌘', '⇧', 'P'], desc: 'Switch project' },
    { keys: ['⌘', ','],     desc: 'Open Settings' },
    { keys: ['⌘', '['],     desc: 'Toggle left rail' },
    { keys: ['⌘', ']'],     desc: 'Toggle right rail' },
    { keys: ['?'],          desc: 'Show this list' },
  ];
  return (
    <STSection T={T} title="Help"
      description="Shortcuts, support, and what's new in Nia.">

      <div style={{ marginBottom: 26 }}>
        <div style={{
          fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: T.ink4, marginBottom: 12,
        }}>Keyboard shortcuts</div>
        <div style={{
          background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
          borderRadius: 12, overflow: 'hidden',
        }}>
          {shortcuts.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: i < shortcuts.length - 1 ? `1px solid ${T.dividerInk}` : 'none',
            }}>
              <span style={{ fontFamily: BODY, fontSize: 12, color: T.ink2 }}>{s.desc}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {s.keys.map((k, j) => (
                  <kbd key={j} style={{
                    fontFamily: MONO, fontSize: 10, fontWeight: 600,
                    color: T.ink2,
                    background: T.cardBg, border: `1px solid ${T.borderMd}`,
                    borderRadius: 4, padding: '2px 7px', minWidth: 16,
                    textAlign: 'center',
                  }}>{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <STRow T={T} label="Contact support"
        hint="Get help from a real person. Reply within 1 business day.">
        <button onClick={() => nosToast('Opening mail to support@nia.app')} style={{
          background: 'transparent', border: `1px solid ${T.borderMd}`,
          borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
          fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink2,
        }}>Email support</button>
      </STRow>

      <STRow T={T} label="What's new"
        hint="Release notes for the last few versions.">
        <button onClick={() => nosToast('Changelog — v1.3, v1.2, v1.1.', { eyebrow: 'Stub' })} style={{
          background: 'transparent', border: `1px solid ${T.borderMd}`,
          borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
          fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink2,
        }}>View changelog</button>
      </STRow>

      <STRow T={T} last label="Version"
        hint="Current Nia release. Auto-updates on next session.">
        <STInlineValue T={T} value="nOS 1.3.0" monospace />
      </STRow>
    </STSection>
  );
}

/* ─── ST · DANGER ZONE section ──────────────────────────────── */
function STDanger({ T, onLogOut, onDeleteAccount }) {
  const [confirmText, setConfirmText] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  return (
    <STSection T={T} title="Danger zone"
      description="Irreversible actions. Read carefully before continuing.">

      <STRow T={T} label="Sign out"
        hint="End this session. You'll need to sign in again to access your terminal.">
        <button onClick={onLogOut} style={{
          background: 'transparent', border: `1px solid ${T.borderMd}`,
          borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
          fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink2,
        }}>Sign out</button>
      </STRow>

      <STRow T={T} last danger label="Delete account"
        hint="Permanently removes your profile, projects, briefs, and taste signals. There is a 30-day grace period during which you can restore the account by signing in again. After 30 days, all data is destroyed and cannot be recovered.">
        <button onClick={() => setShowDelete(true)} style={{
          background: 'transparent', border: `1px solid ${DANGER}`,
          borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
          fontFamily: BODY, fontSize: 12, fontWeight: 500, color: DANGER,
        }}>Delete my account</button>
      </STRow>

      {showDelete && (
        <div style={{
          marginTop: 20, padding: 22,
          background: 'rgba(224,122,95,0.06)',
          border: `1px solid rgba(224,122,95,0.30)`,
          borderRadius: 14,
        }}>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 16, color: DANGER, marginBottom: 8,
          }}>This will permanently delete your account.</div>
          <div style={{ fontFamily: BODY, fontSize: 12.5, color: T.ink2, lineHeight: 1.6, marginBottom: 18 }}>
            All projects, briefs, references, voice notes, and your taste profile
            will be marked for deletion. You have 30 days to recover by signing in.
            After that, the data is unrecoverable.
          </div>
          <Field T={T} label="Type DELETE to confirm">
            <Input T={T} value={confirmText} onChange={setConfirmText} placeholder="DELETE" />
          </Field>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <GhostButton T={T} onClick={() => { setShowDelete(false); setConfirmText(''); }}>
              Cancel
            </GhostButton>
            <PrimaryButton T={T} danger
              disabled={confirmText !== 'DELETE'}
              onClick={() => { setShowDelete(false); onDeleteAccount(); }}>
              Permanently delete account
            </PrimaryButton>
          </div>
        </div>
      )}
    </STSection>
  );
}

/* ─── ST · MAIN MODAL ───────────────────────────────────────── */
/* ════════════════════════════════════════════════════════════════
   UpgradeGate — Master Guideline-compliant paywall flow

   A single component handles three sequential states for any paywall
   trigger across the app: 'constraint' → 'pricing' → 'checkout'. The
   App Shell listens for the `nos:upgrade` event and mounts this gate
   with the dispatched detail as the initial context.

   Context shape:
     { feature: 'project'|'archetype'|'integration'|'model'|'agent'|'aiCall'|'pricing',
       reason?, body?, requiredTier?, currentValue?, limit? }

   Choreography:
     - Mount: useMountReveal() drives the modal in (400ms physics)
     - State changes: opacity fade + slight translateY (300ms)
     - Hover/focus: EASE_QUICK on all interactive surfaces

   ════════════════════════════════════════════════════════════════ */
function UpgradeGate({ T, user, setUser, context, onClose }) {
  const { isMobile, isTablet } = useViewport();
  const mounted = useMountReveal();
  // 'pricing' context skips the constraint screen and goes straight to the
  // tier comparison (used when the user explicitly clicks "Upgrade").
  const [state, setState] = useState(context?.feature === 'pricing' ? 'pricing' : 'constraint');
  const [billingCycle, setBillingCycle] = useState('annual');
  const [pickedTier, setPickedTier] = useState(context?.requiredTier || 'professional');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Stub — real implementation routes through Stripe checkout
  const processUpgrade = (tierId, cycle) => {
    setUser && setUser(u => ({
      ...u,
      tier: tierId,
      tierSince: new Date().toISOString(),
      billingCycle: cycle,
    }));
    nosToast(`Welcome to ${TIERS[tierId].label}.`, { eyebrow: 'Upgraded', kind: 'success' });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 110,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
      ...(mounted
        ? { opacity: 1 }
        : { opacity: 0 }),
      transition: `opacity ${EASE_DELIBERATE}`,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: state === 'pricing'
          ? (isMobile ? '100vw' : 940)
          : (isMobile ? '100vw' : 480),
        maxHeight: isMobile ? '100vh' : `calc(100vh - ${isTablet ? 32 : 48}px)`,
        height: isMobile ? '100vh' : 'auto',
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 16,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: T.dockShadow,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        ...revealStyle(mounted, 16),
      }}>
        {state === 'constraint' && (
          <UGConstraint T={T} context={context}
            onClose={onClose}
            onViewTiers={() => { setPickedTier(context?.requiredTier || 'professional'); setState('pricing'); }} />
        )}
        {state === 'pricing' && (
          <UGPricing T={T} user={user}
            isMobile={isMobile} isTablet={isTablet}
            billingCycle={billingCycle} setBillingCycle={setBillingCycle}
            pickedTier={pickedTier} setPickedTier={setPickedTier}
            onClose={onClose}
            onContinue={(tier) => {
              if (tier === 'studio') {
                nosToast('Studio is custom — we\'ll be in touch.', { eyebrow: 'Sales', kind: 'success' });
                onClose();
              } else if (tier === 'foundation') {
                onClose();
              } else {
                setPickedTier(tier);
                setState('checkout');
              }
            }} />
        )}
        {state === 'checkout' && (
          <UGCheckout T={T} user={user}
            isMobile={isMobile}
            tierId={pickedTier} cycle={billingCycle}
            onBack={() => setState('pricing')}
            onClose={onClose}
            onConfirm={() => processUpgrade(pickedTier, billingCycle)} />
        )}
      </div>
    </div>
  );
}

/* ─── UG · constraint state ─────────────────────────────────
   Shows when the user hits a tier-gated feature.
   Mono SYSTEM CONSTRAINT eyebrow, italic body, two CTAs.            */
function UGConstraint({ T, context, onClose, onViewTiers }) {
  // Resolve constraint copy from the context. Falls back to generic if
  // the dispatcher didn't pass `reason`/`body` (most callers will).
  const reason = context?.reason || 'Tier upgrade required.';
  const body = context?.body
    || 'This feature is part of a higher Nia tier. View pricing to compare.';
  return (
    <div style={{ padding: '32px 32px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{
          fontFamily: MONO, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: T.ink4, marginBottom: 14,
        }}>System Constraint</div>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 22, lineHeight: 1.25, letterSpacing: '-0.02em',
          color: T.ink, marginBottom: 12,
        }}>{reason}</div>
        <div style={{
          fontFamily: BODY, fontSize: 13.5, lineHeight: 1.65,
          color: T.ink2,
        }}>{body}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PrimaryButton T={T} onClick={onViewTiers}>
          View tiers <ChevRight s={11} c="currentColor" sw={2} />
        </PrimaryButton>
        <GhostButton T={T} onClick={onClose}>Not now</GhostButton>
      </div>
    </div>
  );
}

/* ─── UG · pricing state ────────────────────────────────────
   Three-tier comparison. Recommended tier (Professional) gets accent
   border. Annual/monthly toggle at the top. Tier card click selects;
   Continue confirms and moves to checkout (or sales).                */
function UGPricing({ T, user, isMobile, isTablet, billingCycle, setBillingCycle, pickedTier, setPickedTier, onClose, onContinue }) {
  const currentTier = user?.tier || 'foundation';
  const tiers = TIER_ORDER_LIST.map(id => TIERS[id]);

  return (
    <>
      {/* Header */}
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '18px 20px' : '24px 32px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 14, borderBottom: `1px solid ${T.dividerInk}`,
      }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: T.ink4, marginBottom: 6,
          }}>Tiers</div>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: isMobile ? 22 : 26, color: T.ink,
            letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>Choose your instance.</div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'transparent', border: `1px solid ${T.borderMd}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.ink3, flexShrink: 0,
          transition: `background ${EASE_QUICK}`,
        }}>
          <CloseIc s={12} c="currentColor" sw={1.6} />
        </button>
      </div>

      {/* Cycle toggle */}
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '14px 20px 0' : '20px 32px 0',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          display: 'inline-flex', gap: 4, padding: 4,
          background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
          borderRadius: 999,
        }}>
          {[
            { id: 'annual', label: 'Annual' },
            { id: 'monthly', label: 'Monthly' },
          ].map(c => {
            const on = billingCycle === c.id;
            return (
              <button key={c.id} onClick={() => setBillingCycle(c.id)}
                style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '7px 18px', borderRadius: 999,
                  background: on ? T.cardBg : 'transparent',
                  boxShadow: on ? T.cardShadow : 'none',
                  fontFamily: BODY, fontSize: 12, fontWeight: 500,
                  fontStyle: on ? 'normal' : 'italic',
                  color: on ? T.ink : T.ink3,
                  transition: `all ${EASE_QUICK}`,
                }}>
                {c.label}
                {c.id === 'annual' && (
                  <span style={{
                    marginLeft: 8, fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.10em', color: ACCENT,
                  }}>SAVE</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier cards */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: isMobile ? '20px' : '24px 32px 28px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr 1fr' : 'repeat(3, 1fr)'),
          gap: 12,
        }}>
          {tiers.map(t => (
            <UGTierCard key={t.id} T={T} tier={t}
              billingCycle={billingCycle}
              isCurrent={t.id === currentTier}
              isPicked={t.id === pickedTier}
              onPick={() => setPickedTier(t.id)} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '14px 20px' : '16px 32px',
        borderTop: `1px solid ${T.dividerInk}`,
        display: 'flex',
        flexDirection: isMobile ? 'column-reverse' : 'row',
        justifyContent: 'space-between', alignItems: 'center', gap: 10,
      }}>
        <GhostButton T={T} onClick={onClose}>Maybe later</GhostButton>
        <PrimaryButton T={T} onClick={() => onContinue(pickedTier)}>
          {pickedTier === 'studio'  ? 'Contact sales'  :
           pickedTier === 'foundation' ? 'Stay on Foundation' :
           `Continue with ${TIERS[pickedTier].label}`} <ChevRight s={11} c="currentColor" sw={2} />
        </PrimaryButton>
      </div>
    </>
  );
}

/* ─── UG · individual tier card ────────────────────────────── */
function UGTierCard({ T, tier, billingCycle, isCurrent, isPicked, onPick }) {
  const recommended = !!tier.recommended;
  const showAnnualSavings = billingCycle === 'annual' && tier.annualLabel && tier.id !== 'foundation';

  // Price label — tier might still have placeholder pricing
  const priceText = tier.priceLabel === 'Free' ? 'Free'
                  : tier.priceLabel === 'Custom' ? 'Custom'
                  : tier.price !== null ? `$${tier.price}/mo`
                  : 'Pricing TBD';

  return (
    <button onClick={onPick} disabled={isCurrent} style={{
      all: 'unset', cursor: isCurrent ? 'default' : 'pointer',
      boxSizing: 'border-box',
      padding: '20px 18px', borderRadius: 14,
      background: T.cardBgAlt,
      border: `1px solid ${isPicked ? ACCENT : T.dividerInk}`,
      display: 'flex', flexDirection: 'column', gap: 14,
      position: 'relative',
      transition: `border-color ${EASE_QUICK}, transform ${EASE_QUICK}`,
      transform: isPicked ? 'translateY(-2px)' : 'translateY(0)',
      opacity: isCurrent ? 0.7 : 1,
    }}
      onMouseEnter={(e) => { if (!isCurrent && !isPicked) e.currentTarget.style.borderColor = T.borderMd; }}
      onMouseLeave={(e) => { if (!isCurrent && !isPicked) e.currentTarget.style.borderColor = T.dividerInk; }}>
      {/* Recommended pill */}
      {recommended && (
        <div style={{
          position: 'absolute', top: -10, right: 14,
          padding: '3px 10px', borderRadius: 999,
          background: ACCENT, color: ACCENT_INK,
          fontFamily: MONO, fontSize: 9, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>Recommended</div>
      )}
      {isCurrent && (
        <div style={{
          position: 'absolute', top: -10, right: 14,
          padding: '3px 10px', borderRadius: 999,
          background: T.cardBg, border: `1px solid ${T.borderMd}`,
          fontFamily: MONO, fontSize: 9, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: T.ink3,
        }}>Current</div>
      )}
      <div>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 18, color: T.ink, letterSpacing: '-0.015em',
          marginBottom: 4,
        }}>{tier.label}</div>
        <div style={{
          fontFamily: BODY, fontSize: 11.5, color: T.ink3, lineHeight: 1.5,
        }}>{tier.tagline}</div>
      </div>
      <div>
        <div style={{
          fontFamily: BODY, fontWeight: 500,
          fontSize: 26, color: T.ink, letterSpacing: '-0.025em',
          lineHeight: 1,
        }}>{priceText}</div>
        {showAnnualSavings && (
          <div style={{
            marginTop: 6, fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
            letterSpacing: '0.12em', color: ACCENT, textTransform: 'uppercase',
          }}>{tier.annualLabel}</div>
        )}
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', gap: 6,
        paddingTop: 14, borderTop: `1px solid ${T.dividerInk}`,
      }}>
        {tier.features.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            fontFamily: BODY, fontSize: 12, color: T.ink2, lineHeight: 1.5,
          }}>
            <span style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }}>
              <CheckIc s={11} c="currentColor" sw={2}/>
            </span>
            <span>{f}</span>
          </div>
        ))}
      </div>
    </button>
  );
}

/* ─── UG · checkout state ──────────────────────────────────────
   Minimal payment form matching the Notion-style reference. Shape is
   Stripe-ready: name / business / card / expiry / cvc / country / zip.
   The actual processUpgrade() is stubbed at the parent.              */
function UGCheckout({ T, user, isMobile, tierId, cycle, onBack, onClose, onConfirm }) {
  const tier = TIERS[tierId] || TIERS.professional;
  const [form, setForm] = useState({
    name: user?.name || '',
    business: '',
    card: '',
    exp: '',
    cvc: '',
    country: 'United States',
    zip: '',
    autoRenew: true,
  });
  const valid = form.name && form.card.replace(/\s/g, '').length >= 13
                && /^\d{2}\s*\/\s*\d{2}$/.test(form.exp)
                && form.cvc.length >= 3
                && form.zip.length >= 3;

  const priceCopy = tier.priceLabel === 'Free' ? 'Free'
    : tier.price !== null ? `$${tier.price} / ${cycle === 'annual' ? 'year' : 'month'}`
    : `${tier.label} pricing TBD`;

  return (
    <>
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '18px 20px' : '24px 32px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 14, borderBottom: `1px solid ${T.dividerInk}`,
      }}>
        <div>
          <button onClick={onBack} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 0, marginBottom: 8,
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: T.ink4,
            transition: `color ${EASE_QUICK}`,
          }}>← Back to tiers</button>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: isMobile ? 20 : 24, color: T.ink, letterSpacing: '-0.02em',
          }}>Upgrade to {tier.label}</div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'transparent', border: `1px solid ${T.borderMd}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.ink3, flexShrink: 0,
        }}>
          <CloseIc s={12} c="currentColor" sw={1.6} />
        </button>
      </div>
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: isMobile ? '20px' : '24px 32px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 14, marginBottom: 14,
        }}>
          <Field T={T} label="Name">
            <Input T={T} value={form.name}
              onChange={v => setForm(f => ({ ...f, name: v }))}
              placeholder="Full name" />
          </Field>
          <Field T={T} label="Business name (optional)">
            <Input T={T} value={form.business}
              onChange={v => setForm(f => ({ ...f, business: v }))}
              placeholder="Studio or company" />
          </Field>
        </div>
        <Field T={T} label="Card number">
          <Input T={T} value={form.card}
            onChange={v => setForm(f => ({ ...f, card: v }))}
            placeholder="1234 1234 1234 1234" />
        </Field>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
          gap: 14, marginTop: 14,
        }}>
          <Field T={T} label="Expiry">
            <Input T={T} value={form.exp}
              onChange={v => setForm(f => ({ ...f, exp: v }))}
              placeholder="MM / YY" />
          </Field>
          <Field T={T} label="Security">
            <Input T={T} value={form.cvc}
              onChange={v => setForm(f => ({ ...f, cvc: v }))}
              placeholder="CVC" />
          </Field>
          <Field T={T} label="ZIP">
            <Input T={T} value={form.zip}
              onChange={v => setForm(f => ({ ...f, zip: v }))}
              placeholder="12345" />
          </Field>
        </div>
        <div style={{
          marginTop: 18, padding: '14px 16px',
          background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 4,
            }}>Total</div>
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: 18, color: T.ink, letterSpacing: '-0.015em',
            }}>{priceCopy}</div>
          </div>
          <Toggle T={T} checked={form.autoRenew}
            onChange={(v) => setForm(f => ({ ...f, autoRenew: v }))} />
        </div>
        <div style={{
          marginTop: 10,
          fontFamily: BODY, fontSize: 11, fontStyle: 'italic',
          color: T.ink4, lineHeight: 1.5,
        }}>Auto-renew is on by default. You can cancel anytime in Settings → Billing.</div>
      </div>
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '14px 20px' : '16px 32px',
        borderTop: `1px solid ${T.dividerInk}`,
        display: 'flex', justifyContent: 'flex-end', gap: 8,
      }}>
        <GhostButton T={T} onClick={onClose}>Cancel</GhostButton>
        <PrimaryButton T={T} disabled={!valid} onClick={onConfirm}>
          Confirm upgrade <ChevRight s={11} c="currentColor" sw={2} />
        </PrimaryButton>
      </div>
    </>
  );
}

/* ─── ST · INTEGRATIONS section ─────────────────────────────
   Lists the eight Professional-tier integrations. On Foundation each row
   is gated — clicking Connect dispatches `nos:upgrade`. Connected state
   tracked in user.connectedIntegrations[].                              */
function STIntegrations({ T, user, setUser }) {
  const tierId = user?.tier || 'foundation';
  const connected = user?.connectedIntegrations || [];

  const toggle = (id) => {
    const gate = requireTier('integration', { user, integrationId: id });
    if (!gate.allowed) {
      window.dispatchEvent(new CustomEvent('nos:upgrade', { detail: { feature: 'integration', ...gate } }));
      return;
    }
    if (connected.includes(id)) {
      setUser(u => ({ ...u, connectedIntegrations: (u.connectedIntegrations || []).filter(x => x !== id) }));
      nosToast('Disconnected.', { eyebrow: 'Integration' });
    } else {
      setUser(u => ({ ...u, connectedIntegrations: [...(u.connectedIntegrations || []), id] }));
      nosToast('Connected.', { eyebrow: 'Integration', kind: 'success' });
    }
  };

  // Group by category for visual rhythm
  const byCat = {};
  INTEGRATIONS.forEach(i => { (byCat[i.category] = byCat[i.category] || []).push(i); });

  return (
    <div>
      <div style={{
        fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
        fontSize: 22, color: T.ink, letterSpacing: '-0.02em', marginBottom: 8,
      }}>Integrations</div>
      <div style={{
        fontFamily: BODY, fontSize: 13, color: T.ink3, lineHeight: 1.6,
        marginBottom: 24, maxWidth: 540,
      }}>
        Connect external tools to push and pull assets directly. All
        integrations are part of the Professional tier.
      </div>

      {tierId === 'foundation' && (
        <div style={{
          padding: '14px 16px', borderRadius: 12, marginBottom: 22,
          background: 'rgba(255,171,13,0.06)', border: '1px solid rgba(255,171,13,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: ACCENT, marginBottom: 4,
            }}>Foundation tier</div>
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontSize: 13,
              color: T.ink2, lineHeight: 1.5,
            }}>Upgrade to Professional to connect integrations.</div>
          </div>
          <PrimaryButton T={T}
            onClick={() => window.dispatchEvent(new CustomEvent('nos:upgrade', { detail: { feature: 'pricing' } }))}>
            Upgrade
          </PrimaryButton>
        </div>
      )}

      {Object.keys(byCat).map(cat => (
        <div key={cat} style={{ marginBottom: 22 }}>
          <div style={{
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: T.ink4, marginBottom: 8,
          }}>{cat}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {byCat[cat].map(i => {
              const isOn = connected.includes(i.id);
              const gate = requireTier('integration', { user, integrationId: i.id });
              const locked = !gate.allowed;
              return (
                <div key={i.id} style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  opacity: locked ? 0.65 : 1,
                  transition: `opacity ${EASE_QUICK}`,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3,
                    }}>
                      <span style={{
                        fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                        fontSize: 13.5, color: T.ink, letterSpacing: '-0.005em',
                      }}>{i.name}</span>
                      {locked && (
                        <span style={{
                          fontFamily: MONO, fontSize: 8.5, fontWeight: 600,
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          color: T.ink4, padding: '2px 7px', borderRadius: 4,
                          border: `1px solid ${T.borderMd}`,
                        }}>Pro</span>
                      )}
                      {isOn && !locked && (
                        <span style={{
                          fontFamily: MONO, fontSize: 8.5, fontWeight: 600,
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          color: SUCCESS, padding: '2px 7px', borderRadius: 4,
                          border: `1px solid ${SUCCESS}`,
                        }}>Connected</span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: BODY, fontSize: 11.5, color: T.ink3, lineHeight: 1.5,
                    }}>{i.desc}</div>
                  </div>
                  <button onClick={() => toggle(i.id)} style={{
                    background: isOn && !locked ? 'transparent' : (locked ? T.cardBgAlt : ACCENT),
                    color: isOn && !locked ? T.ink2 : (locked ? T.ink3 : ACCENT_INK),
                    border: isOn && !locked ? `1px solid ${T.borderMd}` : (locked ? `1px solid ${T.borderMd}` : 'none'),
                    borderRadius: 999, padding: '6px 14px', cursor: 'pointer',
                    fontFamily: BODY, fontSize: 11.5, fontWeight: 500,
                    letterSpacing: '-0.005em',
                    transition: `background ${EASE_QUICK}`,
                    flexShrink: 0,
                  }}>
                    {isOn && !locked ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */

function SettingsModal({ user, setUser, skinKey, setSkinKey, initialSection, onClose, onLogOut, onDeleteAccount }) {
  const T = SKINS[skinKey];
  const { isMobile, isTablet } = useViewport();
  const [section, setSection] = useState(initialSection || 'account');

  const sections = [
    { id: 'account',       label: 'Account',         icon: <UserIc s={14} c="currentColor" sw={1.5}/>,    Comp: STAccount },
    { id: 'profile',       label: 'Profile',         icon: <EditIc s={14} c="currentColor" sw={1.5}/>,    Comp: STProfile },
    { id: 'preferences',   label: 'Preferences',     icon: <SettingsIc s={14} c="currentColor" sw={1.5}/>,Comp: STPreferences },
    { id: 'notifications', label: 'Notifications',   icon: <BellIc s={14} c="currentColor" sw={1.5}/>,    Comp: STNotifications },
    { id: 'privacy',       label: 'Privacy & Data',  icon: <ShieldIc s={14} c="currentColor" sw={1.5}/>,  Comp: STPrivacy },
    { id: 'billing',       label: 'Billing',         icon: <CardIc s={14} c="currentColor" sw={1.5}/>,    Comp: STBilling },
    { id: 'integrations',  label: 'Integrations',    icon: <FolderIc s={14} c="currentColor" sw={1.5}/>,  Comp: STIntegrations },
    { id: 'workspace',     label: 'Workspace',       icon: <UsersIc s={14} c="currentColor" sw={1.5}/>,   Comp: STWorkspace },
    { id: 'help',          label: 'Help',            icon: <HelpIc s={14} c="currentColor" sw={1.5}/>,    Comp: STHelp },
  ];
  const ActiveComp = (sections.find(s => s.id === section) || sections[0]).Comp;

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : (isTablet ? 16 : 24),
      fontFamily: BODY,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }}/>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: isMobile ? '100vw' : 1080,
        height: isMobile ? '100vh' : `min(720px, calc(100vh - ${isTablet ? 32 : 48}px))`,
        background: T.cardBg,
        borderRadius: isMobile ? 0 : 18,
        border: isMobile ? 'none' : `1px solid ${T.borderMd}`,
        boxShadow: isMobile ? 'none' : T.dockShadow,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden',
      }}>
        {/* Sidebar — vertical on tablet+, horizontal scroll on mobile */}
        <div style={{
          width: isMobile ? '100%' : 232,
          flexShrink: 0,
          background: T.cardBgAlt,
          borderRight: isMobile ? 'none' : `1px solid ${T.dividerInk}`,
          borderBottom: isMobile ? `1px solid ${T.dividerInk}` : 'none',
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          padding: isMobile ? '12px 12px' : '22px 12px',
          overflowX: isMobile ? 'auto' : 'visible',
          overflowY: isMobile ? 'hidden' : 'auto',
          gap: isMobile ? 4 : 0,
          alignItems: isMobile ? 'center' : 'stretch',
        }}>
          {!isMobile && (
            <div style={{
              fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
              fontSize: 18, color: T.ink, letterSpacing: '-0.015em',
              padding: '0 14px 16px',
              borderBottom: `1px solid ${T.dividerInk}`,
              marginBottom: 12,
            }}>Settings</div>
          )}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            gap: isMobile ? 4 : 2,
            flex: 1,
            overflowX: isMobile ? 'auto' : 'visible',
          }}>
            {sections.map(s => (
              <STNavItem key={s.id} T={T} icon={s.icon} label={s.label}
                active={section === s.id}
                onClick={() => setSection(s.id)} />
            ))}
            {!isMobile && <div style={{ flex: 1 }} />}
            {!isMobile && <div style={{ height: 1, background: T.dividerInk, margin: '8px 8px' }} />}
            <STNavItem T={T} icon={<TrashIc s={14} c="currentColor" sw={1.5}/>}
              label={isMobile ? 'Danger' : 'Danger zone'} danger
              active={section === 'danger'}
              onClick={() => setSection('danger')} />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header bar */}
          <div style={{
            flexShrink: 0, padding: '18px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: `1px solid ${T.dividerInk}`,
          }}>
            <div style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4,
            }}>Settings · {(sections.find(s => s.id === section) || { label: 'Danger zone' }).label}</div>
            <button onClick={onClose} aria-label="Close settings"
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'transparent', border: `1px solid ${T.borderMd}`,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.ink3,
              }}>
              <CloseIc s={12} c="currentColor" sw={1.6} />
            </button>
          </div>
          {/* Scrollable body */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: isMobile ? '20px 18px' : (isTablet ? '24px 28px' : '32px 36px'),
          }}>
            {section === 'danger'
              ? <STDanger T={T} onLogOut={onLogOut} onDeleteAccount={onDeleteAccount} />
              : <ActiveComp T={T} user={user} setUser={setUser}
                  skinKey={skinKey} setSkinKey={setSkinKey} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* END OF REGION 4 — SETTINGS MODULE */

/* ════════════════════════════════════════════════════════════════════════════
   ┃                                                                          ┃
   ┃   REGION 5 · APP SHELL                                                   ┃
   ┃   ─────────────────────                                                  ┃
   ┃                                                                          ┃
   ┃   The default export. Routes between onboarding and dashboard based on   ┃
   ┃   auth state, mounts the settings overlay on top of either, and holds    ┃
   ┃   the only piece of truly app-wide state: the active user.               ┃
   ┃                                                                          ┃
   ┃   Edits here change routing/orchestration only. They do not touch any    ┃
   ┃   region's internal visual treatment.                                    ┃
   ┃                                                                          ┃
   ┃   Wire to real backend by replacing:                                     ┃
   ┃     · setUser(null)              → call POST /auth/logout                ┃
   ┃     · setUser(profile)           → POST /profile (persist on completion) ┃
   ┃     · onDeleteAccount handler    → DELETE /account (with grace window)  ┃
   ┃                                                                          ┃
   ┃   Read referralSource from the URL (?ref= param) on mount in production. ┃
   ┃                                                                          ┃
   ┃   ──────────────────────────────────────────────────────────────────     ┃
   ┃   How to extend this file safely (instructions for Muheet & future you): ┃
   ┃                                                                          ┃
   ┃   · Want to add a new screen to onboarding?                              ┃
   ┃     Edit only inside REGION 2. Add the screen component, register it    ┃
   ┃     in the `stages` map of NiaOnboarding, and wire navigation. The      ┃
   ┃     contract `onComplete(user)` is the only thing the shell sees.        ┃
   ┃                                                                          ┃
   ┃   · Want to redesign the dashboard?                                      ┃
   ┃     Edit only inside REGION 3. As long as NOSDashboard accepts the      ┃
   ┃     four props in its contract, the shell doesn't care what you do      ┃
   ┃     inside.                                                              ┃
   ┃                                                                          ┃
   ┃   · Want to add a new Settings section?                                  ┃
   ┃     Edit only inside REGION 4. Build a new ST*  sub-component, add it   ┃
   ┃     to the `sections` array in SettingsModal. No other region changes.   ┃
   ┃                                                                          ┃
   ┃   · Want to change a colour, font, or icon used everywhere?              ┃
   ┃     Edit REGION 1. Be aware: changes ripple to every region.             ┃
   ┃                                                                          ┃
   ════════════════════════════════════════════════════════════════════════════ */

export default function NiaApp({ referralSource = 'direct' }) {
  // The single piece of global state: who is signed in.
  // null = onboarding shows. populated = dashboard shows.
  const [user, setUser] = useState(null);

  // Projects live at the shell so they survive Settings opens and other
  // overlays. Each project follows the schema documented at the top of
  // the project workflow block in Region 3.
  const [projects, setProjects] = useState([]);

  // Skin lives at the shell so it survives navigation between regions.
  // Default is metallic silver — the brand's signature post-onboarding skin.
  // Onboarding remains charcoal-locked (see T_OB in Region 2).
  // Users can change skin via nOS menu or Settings → Preferences.
  const [skinKey, setSkinKey] = useState('metallic');

  // Settings modal is global — reachable from dashboard and (eventually)
  // from onboarding too if we add an "edit before continuing" path.
  // settingsOpen is null when closed; otherwise an object { initialSection? }
  // letting callers (e.g. the search palette) deep-link into a specific section.
  const [settingsOpen, setSettingsOpen] = useState(null);

  // ─── Public share token handler ─────────────────────────────
  // When the URL contains ?share=<token>, the app renders a
  // <DBSharedProjectView> instead of dashboard or onboarding.
  // The token is parsed once on mount; refreshing or navigating
  // away clears it. Owners' edits to a shared project propagate
  // automatically because the same projects[] state drives both
  // the dashboard view and the shared view.
  const [shareToken, setShareToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get('share');
    } catch { return null; }
  });
  const exitSharedView = () => {
    setShareToken(null);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('share');
        window.history.replaceState({}, '', url.toString());
      } catch {}
    }
  };

  // ─── Global upgrade-gate listener ────────────────────────────
  // Any component can dispatch `nos:upgrade` with detail = { feature, ... }
  // and the gate appears. Removes the need to prop-drill setUpgradeContext.
  // CRITICAL: This must be declared BEFORE the early `if (!user) return`
  // below — Rules of Hooks demand identical hook count on every render.
  const [upgradeContext, setUpgradeContext] = useState(null);
  useEffect(() => {
    const onUpgrade = (e) => setUpgradeContext(e.detail || { feature: 'pricing' });
    window.addEventListener('nos:upgrade', onUpgrade);
    return () => window.removeEventListener('nos:upgrade', onUpgrade);
  }, []);

  // ─── Demo seed (founder + insider accounts) ────────────────
  // Two independent effects fire for accounts in DEMO_SEED_EMAILS:
  //
  //   1. Tier elevation. Runs whenever the matched user's tier isn't
  //      already 'studio'. Sets tier to 'studio' to grant full
  //      permissions and all features. Persists across sessions.
  //      Splitting this out from project seeding means: if a seed user
  //      deletes their reference projects, they keep their tier; if a
  //      seed user is somehow reset to Foundation, they get re-elevated.
  //
  //   2. Project seeding. Runs once per account: when projects[] is
  //      empty AND user.demoSeeded is not set. After running, marks
  //      demoSeeded so deleting projects doesn't bring them back.
  //
  // Both effects guard against firing on non-matching emails so other
  // accounts get standard Foundation onboarding.
  const isDemoEmail = !!user && DEMO_SEED_EMAILS.includes((user.email || '').toLowerCase());

  // Effect 1 — tier elevation
  useEffect(() => {
    if (!user) return;
    if (!isDemoEmail) return;
    if (user.tier === 'studio') return;
    setUser(u => ({
      ...u,
      tier: 'studio',
      tierSince: new Date().toISOString(),
      tierElevatedReason: 'demo_seed_account',
    }));
    nosToast('Welcome — full Studio access enabled.', { eyebrow: 'Account', kind: 'success' });
  }, [user, isDemoEmail]);

  // Effect 2 — project seeding (one-shot)
  useEffect(() => {
    if (!user) return;
    if (!isDemoEmail) return;
    if (user.demoSeeded) return;
    if (projects.length > 0) return;
    setProjects(DEMO_PROJECTS);
    setUser(u => ({ ...u, demoSeeded: true, demoSeededAt: new Date().toISOString() }));
    nosToast('Reference projects loaded — see your project list.', { eyebrow: 'Demo seed', kind: 'success' });
  }, [user, projects.length, isDemoEmail]);

  // ─── Auth handlers ────────────────────────────────────────────
  const handleOnboardingComplete = (profile) => {
    // In production: POST /profile with the assembled User record,
    // then setUser with the persisted version (including UUID, etc).
    setUser({
      ...profile,
      // Defaults for fields not collected during onboarding
      language: 'en',
      timezone: 'America/New_York',
      compactDensity: false,
      reducedMotion: false,
      notifications: {
        emailDigest: 'weekly',
        mentions: true, comments: true, shares: true,
        productUpdates: false, marketing: false,
      },
      privacy: {
        thirdPartyScrape: true,
        taste: true,
        telemetry: true,
      },
      plan: { tier: 'free', renews: null },
    });
  };

  const handleLogOut = () => {
    setSettingsOpen(false);
    setProjects([]);
    setUser(null);
    // In production: POST /auth/logout to revoke the session token.
  };

  const handleDeleteAccount = () => {
    setSettingsOpen(false);
    setProjects([]);
    setUser(null);
    // In production: DELETE /account, server-side starts the 30-day
    // grace window. Show a "Your account is scheduled for deletion"
    // confirmation screen here in v1.4.
    nosToast('Account marked for deletion. 30-day grace window.', { eyebrow: 'Account', kind: 'danger', durationMs: 5000 });
  };

  // ─── Render ───────────────────────────────────────────────────

  // Public-share view takes precedence over both onboarding and the
  // dashboard. A visitor with ?share=<token> sees the project directly,
  // no onboarding, no signup. Owners viewing their own share link see
  // the same view (with an Open in Nia escape back to the dashboard).
  if (shareToken) {
    const sharedProject = projects.find(p =>
      p.publicShare?.enabled && p.publicShare?.token === shareToken
    );
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: PULSE_KEYFRAMES }} />
        <DBSharedProjectView
          T={SKINS[skinKey]}
          project={sharedProject}
          onUpdate={(next) => setProjects(ps => ps.map(p => p.id === next.id ? next : p))}
          onExit={exitSharedView}
          hasAccount={!!user} />
        <NosToast T={SKINS[skinKey]} />
      </>
    );
  }

  if (!user) {
    return (
      <NiaOnboarding
        referralSource={referralSource}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <>
      {/* Pulse keyframes — injected once, used app-wide */}
      <style dangerouslySetInnerHTML={{ __html: PULSE_KEYFRAMES }} />

      <NOSDashboard
        user={user} setUser={setUser}
        projects={projects} setProjects={setProjects}
        skinKey={skinKey} setSkinKey={setSkinKey}
        onOpenSettings={(section) => setSettingsOpen({ initialSection: section || null })}
        onLogOut={handleLogOut}
      />
      {settingsOpen && (
        <SettingsModal
          user={user} setUser={setUser}
          skinKey={skinKey} setSkinKey={setSkinKey}
          initialSection={settingsOpen.initialSection}
          onClose={() => setSettingsOpen(null)}
          onLogOut={handleLogOut}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      {/* Upgrade gate — mounts on demand from anywhere */}
      {upgradeContext && (
        <UpgradeGate
          T={SKINS[skinKey]}
          user={user}
          setUser={setUser}
          context={upgradeContext}
          onClose={() => setUpgradeContext(null)} />
      )}

      {/* Global toast — mounts once, listens for nos:toast events */}
      <NosToast T={SKINS[skinKey]} />
    </>
  );
}

/* END OF REGION 5 — APP SHELL */
/* END OF FILE */
