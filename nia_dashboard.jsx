import { useState, useEffect, useRef } from "react";

const BODY = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";
const MONO = "'SF Mono', 'Fira Code', monospace";

const C = {
  pageBg:    '#EFEEEA', sideBg:  '#FFFFFF', cardBg:  '#FFFFFF',
  rightBg:   '#E8E7E2', bottomBg:'#D8D6D0',
  ink:       '#0F0E0C', ink2:    '#3A3A37', ink3:    '#6E6E6A', ink4: '#A8A8A3',
  border:    'rgba(15,14,12,.08)', borderMd: 'rgba(15,14,12,.13)',
  teal:      '#0B7A75', tealLight:'#E8F4F3', tealSoft:'rgba(11,122,117,.1)',
  clay:      '#C4602A', clayLight:'#FDF1EB',
  green:     '#1B7A4A', greenLight:'#EAF5F0',
};

const ORBS = [
  'radial-gradient(circle at 42% 38%, #E05018 0%, #C02810 22%, #3C1860 48%, #180E40 72%, #080620 100%)',
  'radial-gradient(circle at 38% 42%, #D04820 0%, #B02215 22%, #2A1858 48%, #140C38 72%, #060418 100%)',
  'radial-gradient(circle at 45% 35%, #C84010 0%, #A81E10 22%, #321460 48%, #160A3A 72%, #060418 100%)',
  'radial-gradient(circle at 40% 40%, #E85820 0%, #C83015 22%, #401A62 48%, #1C1045 72%, #080520 100%)',
  'radial-gradient(circle at 35% 38%, #D84E18 0%, #B82810 22%, #381660 48%, #160C40 72%, #060418 100%)',
  'radial-gradient(circle at 44% 36%, #C03810 0%, #A01C10 22%, #2E1258 48%, #120A38 72%, #050418 100%)',
];

/* ─── GREETINGS ──────────────────────────────────────────────── */
const GREETINGS = [
  n => { const h = new Date().getHours(); return `Good ${h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'}, ${n}.`; },
  n => `Welcome back, ${n}.`,
  n => `Hey, ${n}.`,
  n => `Hi ${n}.`,
  n => `Hello, ${n}.`,
  n => `Good to see you, ${n}.`,
  n => `Back again, ${n}.`,
  n => `Ready to create, ${n}?`,
  n => `What are we making today, ${n}?`,
];
const pickGreeting = name => GREETINGS[Math.floor(Math.random() * GREETINGS.length)](name);

/* ─── STATIC DATA ────────────────────────────────────────────── */
const SKILLS = [
  { id: 1, name: 'Creative Director', orb: 0, desc: 'The most common senior creative leadership role — responsible for creative concept, visual direction, and overall aesthetic execution.', rate: '$1,000–2,000/day', works: 'Photographers, Stylists, Producers' },
  { id: 2, name: 'Stylist',           orb: 1, desc: 'Responsible for visual styling direction — wardrobe, props, set dressing, and the overall tactile aesthetic of any production.', rate: '$700–1,200/day', works: 'Creative Director, Photographers' },
  { id: 3, name: '1st AD',            orb: 2, desc: 'The operational spine of any shoot — managing the schedule, crew, and the creative director\'s time so the day runs as planned.', rate: '$800–1,500/day', works: 'Director, Crew, Production' },
  { id: 4, name: 'PR Specialist',     orb: 3, desc: 'Shapes external communications, press relationships, and amplification strategy from project launch through to post-publication.', rate: '$600–1,000/day', works: 'Brand, Press, Creative Director' },
  { id: 5, name: 'Art Director',      orb: 4, desc: 'Shapes the visual language of a production — from moodboard to set dressing, colour palette to typographic decisions.', rate: '$1,000–1,800/day', works: 'Creative Director, Photographer' },
  { id: 6, name: 'Music Supervisor',  orb: 5, desc: 'Oversees all music decisions — licensing, sync clearances, sound direction, and composer relationships across production.', rate: '$2,000–4,000/project', works: 'Director, Post-Production, Legal' },
  { id: 7, name: 'Cinematographer',   orb: 0, desc: 'Responsible for the visual grammar of filmed work — lighting design, camera movement, lens choices, and image quality.', rate: '$1,500–3,000/day', works: 'Director, Gaffer, Focus Puller' },
  { id: 8, name: 'Producer',          orb: 1, desc: 'Holds the production together — budget, logistics, crew, delivery. The person who makes sure the thing actually gets made.', rate: '$1,200–2,000/day', works: 'All departments' },
];

const WORKFLOWS = [
  { id: 1, label: 'Create a pre-production document',              sub: 'Generate a structured production brief…' },
  { id: 2, label: 'Search for photographers in Atlanta',            sub: 'Find verified photographers in your market…' },
  { id: 3, label: 'Download images from my latest Pinterest board', sub: 'Pull references into a Nia project…' },
  { id: 4, label: 'Personalize your profile with video',            sub: 'Add a video intro to your Nia profile…' },
];

const PROJECT_TYPES = [
  { id: 'event',      icon: '◈', label: 'Event Coverage',       sub: 'Documentary, editorial' },
  { id: 'campaign',   icon: '✦', label: 'Brand Campaign',       sub: 'Concept to delivery' },
  { id: 'editorial',  icon: '▣', label: 'Editorial',            sub: 'Publish-ready content' },
  { id: 'music',      icon: '◎', label: 'Music Video',          sub: 'Performance, narrative' },
  { id: 'doc',        icon: '⟡', label: 'Documentary',          sub: 'Long-form storytelling' },
  { id: 'series',     icon: '◇', label: 'Content Series',       sub: 'Recurring, episodic' },
  { id: 'commercial', icon: '◉', label: 'Commercial',           sub: 'Broadcast, digital' },
  { id: 'brief',      icon: '∷', label: 'Pre-Production Brief', sub: 'Planning document' },
];

const MOODS = ['Quiet','Urgent','Warm','Cold','Intimate','Epic','Raw','Refined','Playful','Solemn','Nostalgic','Forward','Tender','Bold','Fragile','Powerful','Dreamlike','Precise','Chaotic','Still'];

/* ─── TEAM DATA ──────────────────────────────────────────────── */
const MY_TEAM = [
  { id: 201, name: 'Khianna Lav',    role: 'Production Assistant', initials: 'KL', bg: '#5B7FA6', available: true,  location: 'Boston'   },
  { id: 202, name: 'Will Eifler',    role: 'Video Producer',       initials: 'WE', bg: '#5A8C6A', available: true,  location: 'New York' },
  { id: 203, name: 'Latalia Howard', role: 'PR Lead',              initials: 'LH', bg: '#8C5A6A', available: false, location: 'Boston'   },
  { id: 204, name: 'Labib Afia',     role: 'Technology Lead',      initials: 'LA', bg: '#6A5A8C', available: true,  location: 'Boston'   },
  { id: 205, name: 'Tony Zhang',     role: 'Brand Strategist',     initials: 'TZ', bg: '#8C7A5A', available: true,  location: 'New York' },
];

const NIA_CREATORS = [
  { id: 301, name: 'Thabo Nkosi',    role: 'Director of Photography', location: 'Johannesburg', match: 94, rate: '$1,200–2,000/day',     orb: 2, skills: ['Cinematography','Commercial','Lighting'], available: true  },
  { id: 302, name: 'Aisha Williams', role: 'Event Photographer',      location: 'New York',      match: 91, rate: '$900–1,400/day',       orb: 0, skills: ['Editorial','B&W','Portrait'],             available: true  },
  { id: 303, name: 'Sipho Dlamini',  role: 'Video Producer',          location: 'Cape Town',     match: 88, rate: '$1,000–1,600/day',     orb: 1, skills: ['Brand','Documentary','Delivery'],         available: false },
  { id: 304, name: 'Maya Laurent',   role: 'Editorial Stylist',       location: 'Boston',        match: 86, rate: '$600–1,000/day',       orb: 4, skills: ['Fashion','Editorial','Commercial'],       available: true  },
  { id: 305, name: 'Kofi Mensah',    role: 'Art Director',            location: 'Lagos',         match: 84, rate: '$800–1,400/day',       orb: 5, skills: ['Art Direction','Campaign','Identity'],     available: true  },
  { id: 306, name: 'Zara Ahmed',     role: 'Music Supervisor',        location: 'London',        match: 82, rate: '$1,500–3,000/project', orb: 3, skills: ['Licensing','Sync','Sound'],               available: true  },
  { id: 307, name: 'Naledi Dube',    role: 'Production Assistant',    location: 'Johannesburg',  match: 79, rate: '$350–550/day',         orb: 2, skills: ['Logistics','On-set','Coordination'],     available: true  },
  { id: 308, name: 'James Okafor',   role: 'Graphic Designer',        location: 'Lagos',         match: 77, rate: '$400–900/day',         orb: 1, skills: ['Typography','Brand','Digital'],           available: false },
];

const MARKETPLACES = [
  { id: 'nia',   name: 'Nia Creators',    sub: 'On-platform',         desc: 'Creative professionals who use Nia. Shared taste signals, verified work, and direct collaboration — all within the Terminal.', accent: '#0B7A75', bg: '#E8F4F3', count: '282 early members',     cta: 'Browse Nia Creators', badge: 'ON PLATFORM' },
  { id: 'flora', name: 'Flora',           sub: 'General Intelligence', desc: 'Curated creative talent for high-end productions. Photographers, directors, and creative leads vetted for professional output.', accent: '#2D5A3D', bg: '#EAF3ED', count: '4,200+ creatives',     cta: 'Browse on Flora',     badge: null },
  { id: 'wix',   name: 'Wix Marketplace', sub: '',                    desc: 'Verified professionals across design, photography, video, and content — with portfolios, ratings, and availability.',           accent: '#1A6B6B', bg: '#E6F3F3', count: '12,000+ professionals', cta: 'Browse on Wix',       badge: null },
  { id: 'whop',  name: 'Whop',            sub: '',                    desc: 'Independent and digital-first creative professionals. Great for content series, social, and emerging talent.',                   accent: '#5A3D7A', bg: '#EFE8F8', count: '6,800+ creators',      cta: 'Browse on Whop',      badge: null },
];

/* ─── CLAUDE API ─────────────────────────────────────────────── */
async function callClaude(msg, system) {
  try {
    const r = await fetch("/api/claude/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800,
        system: system || "You are Nia, a warm and intelligent creative production assistant for Creative Directors. Be concise, specific, and practically useful. Under 180 words.",
        messages: [{ role: "user", content: msg }] })
    });
    const d = await r.json();
    return d.content?.[0]?.text || '';
  } catch { return 'Something went quiet. Try again in a moment.'; }
}

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
function Pearl({ size = 80 }) {
  const s = size;
  return (
    <div style={{ width: s, height: s, borderRadius: '50%', flexShrink: 0, background: `radial-gradient(circle at 34% 28%, #FFFFFF 0%, #F0EDE8 18%, #DDD8D0 40%, #C4BDB3 62%, #ADA69C 80%, #968E84 100%)`, boxShadow: `inset ${-s*.05}px ${-s*.05}px ${s*.14}px rgba(0,0,0,.18), inset ${s*.03}px ${s*.03}px ${s*.08}px rgba(255,255,255,.9), 0 ${s*.06}px ${s*.2}px rgba(0,0,0,.14)` }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `radial-gradient(circle at 28% 22%, rgba(255,255,255,.7) 0%, transparent 40%)` }} />
    </div>
  );
}
function GradOrb({ idx = 0, size = 56 }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: ORBS[idx % 6], flexShrink: 0 }} />;
}
function InitialsAvatar({ initials, bg, size = 38 }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: bg || '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontSize: size * .32, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>;
}
function AvailDot({ available }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: available ? C.green : C.clay }} /><span style={{ fontFamily: BODY, fontSize: 11, color: available ? C.green : C.clay }}>{available ? 'Available' : 'Busy'}</span></div>;
}
function Pill({ text, bg, color, size = 11 }) {
  return <span style={{ fontFamily: BODY, fontSize: size, fontWeight: 600, background: bg, color, padding: '2px 7px', borderRadius: 10 }}>{text}</span>;
}

/* ─── ICONS ──────────────────────────────────────────────────── */
const ic = paths => ({ s = 15, c = 'currentColor' } = {}) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
    {paths.map((d, i) => <path key={i} d={d} />)}
  </svg>
);
const DashIc   = ic(["M1 1h6v6H1zM9 1h6v6H9zM1 9h6v6H1zM9 9h6v6H9z"]);
const TeamIc   = ic(["M5.5 7a3 3 0 100-6 3 3 0 000 6z","M1 15c0-2.5 2-4.5 4.5-4.5S10 12.5 10 15","M11 5a2.5 2.5 0 110-5","M13.5 10c1.2.5 2 1.8 2 3.5"]);
const FolderIc = ic(["M1 4a1 1 0 011-1h3.5L7 5h8a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4z"]);
const CalIc    = ic(["M1 4a1 1 0 011-1h12a1 1 0 011 1v11a1 1 0 01-1 1H2a1 1 0 01-1-1V4z","M5 1v4M11 1v4M1 7h14"]);
const DocIc    = ic(["M3 2h7.5L13 5.5V14a1 1 0 01-1 1H3V2z","M10 2v4h3","M5 8h6M5 11h4"]);
const RepIc    = ic(["M2 13l4-4.5 3 3L14 4"]);
const ClipIc   = ic(["M13.5 7L7 13.5a4 4 0 01-5.5-5.5l7-7a2.5 2.5 0 013.5 3.5L5 11a1 1 0 01-1.5-1.5L10 4"]);
const WfIc     = ({ s = 14, c = 'currentColor' } = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round"><rect x="1" y="6" width="4" height="4" rx="1"/><rect x="11" y="1" width="4" height="4" rx="1"/><rect x="11" y="11" width="4" height="4" rx="1"/><path d="M5 8h2.5M8.5 3h2.5M8.5 13h2.5M8.5 3v10"/></svg>;
const CloseIc  = ({ s = 13, c = 'currentColor' } = {}) => <svg width={s} height={s} viewBox="0 0 13 13" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round"><path d="M2 2l9 9M11 2L2 11"/></svg>;
const SendIc   = ({ s = 15, c = 'currentColor' } = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill={c}><path d="M14 1.5L1 6.5l5.5 2 2 5.5L14 1.5z"/></svg>;
const SparkIc  = ({ s = 15, c = 'currentColor' } = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill={c}><path d="M8 1.5l1.8 5h5.2l-4.2 3 1.6 5L8 12l-4.4 2.5 1.6-5L1 6.5h5.2z"/></svg>;
const SearchIc = ic(["M6.5 11a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM10 10l3.5 3.5"]);

/* ─── SIDEBAR ────────────────────────────────────────────────── */
function Sidebar({ active, setActive }) {
  const nav = [
    { id: 'dashboard', icon: DashIc,   label: 'Dashboard' },
    { id: 'team',      icon: TeamIc,   label: 'Team' },
    { id: 'projects',  icon: FolderIc, label: 'Projects' },
    { id: 'calendar',  icon: CalIc,    label: 'Calendar' },
    { id: 'documents', icon: DocIc,    label: 'Documents' },
    { id: 'report',    icon: RepIc,    label: 'Report' },
  ];
  return (
    <div style={{ width: 196, background: C.sideBg, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '16px 10px' }}>
      <div style={{ padding: '4px 10px 16px', borderBottom: `1px solid ${C.border}`, marginBottom: 10 }}>
        <div style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: 500, color: C.ink4 }}>Product logo</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {nav.map(n => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => setActive(n.id)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 8, border: 'none', width: '100%', textAlign: 'left', background: on ? '#F0F0EC' : 'transparent', cursor: 'pointer', fontFamily: BODY, fontSize: 13.5, color: on ? C.ink : C.ink3, fontWeight: on ? 500 : 400, transition: 'all .12s' }}>
              <n.icon s={14} c={on ? C.ink : C.ink3} /> {n.label}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 20, padding: '0 2px' }}>
        <div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4, marginBottom: 6, padding: '0 8px' }}>Your teams</div>
        {[{id:'D',name:'Design'},{id:'E',name:'Engineering'}].map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 7, cursor: 'pointer' }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: '#EEEEE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontSize: 10, fontWeight: 600, color: C.ink3 }}>{t.id}</div>
            <span style={{ fontFamily: BODY, fontSize: 13, color: C.ink3 }}>{t.name}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: '0 2px' }}>
        <div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4, marginBottom: 6, padding: '0 8px' }}>Reports</div>
        {[{icon:RepIc,label:'Month to Date'},{icon:RepIc,label:'Year to Date'}].map(({icon:Ic,label}) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 7, cursor: 'pointer' }}>
            <Ic s={13} c={C.ink4} /><span style={{ fontFamily: BODY, fontSize: 13, color: C.ink3 }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#3D3D38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontSize: 11, fontWeight: 600, color: '#E8E8E3', flexShrink: 0 }}>IK</div>
        <div><div style={{ fontFamily: BODY, fontSize: 12, fontWeight: 500, color: C.ink }}>Ika</div><div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4 }}>Creative Director</div></div>
      </div>
    </div>
  );
}

/* ─── RIGHT PANEL ────────────────────────────────────────────── */
function RightPanel({ onWorkflow }) {
  const [tab, setTab] = useState('recent');
  const articles = ['Some Things I Took Away From An Event Apart 2022 in Denver','A Pure CSS Gallery Focus Effect with :not','Early Days of Container Style Queries','Rendering External API Data in WordPress Blocks on the Front End'];
  return (
    <div style={{ width: 304, background: C.rightBg, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 18px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14.5, color: C.ink, marginBottom: 14 }}>My workflows</div>
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.borderMd}`, marginBottom: 14 }}>
            {['Recent','Popular','Trending'].map(t => { const on = tab === t.toLowerCase(); return <button key={t} onClick={() => setTab(t.toLowerCase())} style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: on ? 500 : 400, color: on ? C.teal : C.ink3, background: 'none', border: 'none', borderBottom: `2px solid ${on ? C.teal : 'transparent'}`, padding: '0 0 8px', marginRight: 14, cursor: 'pointer' }}>{t}</button>; })}
          </div>
          {articles.map((a, i) => <div key={i} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i < articles.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}><div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink2, lineHeight: 1.45, marginBottom: 3 }}>{a}</div><div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4 }}>Jan 7 · 29 comments · 16 shares</div></div>)}
        </div>
        <div>
          <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14.5, color: C.ink, marginBottom: 12 }}>My workflows</div>
          <div style={{ background: C.cardBg, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
            {WORKFLOWS.map((w, i) => (
              <div key={w.id} onClick={() => onWorkflow(w)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderBottom: i < WORKFLOWS.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', transition: 'background .1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8F7F3'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <WfIc s={13} c={C.ink4} />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: 500, color: C.ink, lineHeight: 1.3 }}>{w.label}</div><div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{w.sub}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── NEW PROJECT CARD ───────────────────────────────────────── */
function NewProjectCard({ onCreate }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onCreate} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ border: `1.5px dashed ${hov ? C.ink3 : C.borderMd}`, borderRadius: 14, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: hov ? 'rgba(15,14,12,.025)' : 'transparent', transition: 'all .15s' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: `1.5px dashed ${hov ? C.ink3 : C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: hov ? C.cardBg : 'transparent', transition: 'all .15s' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={hov ? C.ink2 : C.ink4} strokeWidth="1.5" strokeLinecap="round"><path d="M9 4v10M4 9h10" /></svg>
      </div>
      <div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14.5, color: hov ? C.ink : C.ink3, marginBottom: 3, transition: 'color .15s' }}>New project</div>
        <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink4, lineHeight: 1.45 }}>Start from a spark — brief, team, and production flow.</div>
      </div>
      <div style={{ marginLeft: 'auto', fontFamily: BODY, fontSize: 12.5, color: hov ? C.teal : C.ink4, transition: 'color .15s', flexShrink: 0 }}>Begin →</div>
    </div>
  );
}

/* ─── SKILL CARD ─────────────────────────────────────────────── */
function SkillCard({ skill, onClick, active = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={() => onClick(skill)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: active ? C.tealLight : C.cardBg, border: `1.5px solid ${active ? C.teal + '55' : hov ? C.borderMd : C.border}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 13, cursor: 'pointer', transition: 'all .15s', boxShadow: active || hov ? '0 3px 16px rgba(0,0,0,.07)' : 'none' }}>
      <GradOrb idx={skill.orb} size={52} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14.5, color: active ? C.teal : C.ink, marginBottom: 4, transition: 'color .15s' }}>{skill.name}</div>
        <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{skill.desc}</div>
      </div>
      {active && <div style={{ flexShrink: 0, color: C.teal }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l5 5 5-5"/></svg></div>}
    </div>
  );
}

/* ─── SKILL MODAL ────────────────────────────────────────────── */
function SkillModal({ skill, onClose }) {
  const [q, setQ] = useState(''); const [resp, setResp] = useState(''); const [busy, setBusy] = useState(false);
  const ask = async () => { if (!q.trim()) return; setBusy(true); setResp(''); const a = await callClaude(q, `You are a Nia creative industry expert. Answer about the ${skill.name} role. Be specific, practical, concise. Under 150 words.`); setResp(a); setBusy(false); };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(15,14,12,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: C.cardBg, borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '88vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <GradOrb idx={skill.orb} size={68} />
          <div style={{ flex: 1 }}><div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 22, color: C.ink, marginBottom: 5 }}>{skill.name}</div><div style={{ fontFamily: BODY, fontSize: 13, color: C.ink3, lineHeight: 1.6 }}>{skill.desc}</div></div>
          <button onClick={onClose} style={{ background: '#F0F0EC', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink3, flexShrink: 0 }}><CloseIc /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 24px 20px' }}>
          {[{ label: 'Rate range', val: skill.rate }, { label: 'Works with', val: skill.works }].map(({ label, val }) => (
            <div key={label} style={{ background: C.pageBg, borderRadius: 10, padding: '11px 13px' }}>
              <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: C.ink4, marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink2 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: C.border, margin: '0 24px' }} />
        <div style={{ padding: '18px 24px 24px' }}>
          <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, marginBottom: 10 }}>Ask Nia about this skill</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder={`What does a ${skill.name} typically deliver?`} style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 10, padding: '9px 13px', fontFamily: BODY, fontSize: 13.5, color: C.ink, background: C.pageBg, outline: 'none' }} />
            <button onClick={ask} disabled={!q.trim() || busy} style={{ background: q.trim() && !busy ? C.ink : C.border, border: 'none', borderRadius: 10, padding: '9px 18px', color: q.trim() && !busy ? '#fff' : C.ink4, fontFamily: BODY, fontSize: 13, fontWeight: 500, cursor: q.trim() && !busy ? 'pointer' : 'default', whiteSpace: 'nowrap' }}>{busy ? '…' : 'Ask Nia'}</button>
          </div>
          {resp && <div style={{ marginTop: 12, padding: '13px 15px', background: C.tealLight, borderRadius: 10, fontFamily: BODY, fontSize: 13.5, color: C.ink2, lineHeight: 1.7 }}>{resp}</div>}
        </div>
      </div>
    </div>
  );
}

/* ─── HEY NIA CHAT ───────────────────────────────────────────── */
function HeyNia({ onClose }) {
  const [msgs, setMsgs] = useState([{ role: 'nia', text: "Hey Ika — what's on your mind? I can help you start a project, build a brief, find collaborators, or think something through." }]);
  const [val, setVal] = useState(''); const [busy, setBusy] = useState(false); const [file, setFile] = useState(null);
  const endRef = useRef(null); const inputRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 120); }, []);
  const send = async () => {
    const text = val.trim(); if (!text && !file) return;
    setMsgs(m => [...m, { role: 'user', text: file ? `${text}${text ? ' · ' : ''}Attached: ${file}` : text }]);
    setVal(''); setFile(null); setBusy(true);
    const r = await callClaude(text || `File: ${file}`, `You are Nia, creative production assistant for Ika, a Creative Director in Boston. Warm, concise, practical. Under 180 words.`);
    setMsgs(m => [...m, { role: 'nia', text: r }]); setBusy(false);
  };
  const CHIPS = ['Start a new project', 'Find a photographer', 'Build a brief', 'What skills do I need for an event?'];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(15,14,12,.38)', display: 'flex', alignItems: 'flex-end' }} onClick={onClose}>
      <div style={{ width: '100%', background: C.cardBg, borderRadius: '20px 20px 0 0', maxHeight: '76vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -6px 32px rgba(0,0,0,.14)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}><div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} /></div>
        <div style={{ padding: '8px 22px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <Pearl size={32} />
          <div style={{ flex: 1 }}><div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14.5, color: C.ink }}>Nia</div><div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink4 }}>Creative production assistant</div></div>
          <button onClick={onClose} style={{ background: '#F0F0EC', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink3 }}><CloseIc s={12} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              {m.role === 'nia' && <Pearl size={26} />}
              <div style={{ maxWidth: '80%', background: m.role === 'nia' ? C.pageBg : C.ink, color: m.role === 'nia' ? C.ink2 : '#fff', borderRadius: m.role === 'nia' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', padding: '10px 14px', fontFamily: BODY, fontSize: 13.5, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{m.text}</div>
            </div>
          ))}
          {busy && <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Pearl size={26} /><div style={{ padding: '10px 14px', background: C.pageBg, borderRadius: '4px 14px 14px 14px', display: 'flex', gap: 5 }}>{[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: C.ink4, animation: `bop .9s ${i*.15}s ease-in-out infinite` }} />)}</div></div>}
          {msgs.length === 1 && !busy && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 2 }}>{CHIPS.map(ch => <button key={ch} onClick={() => { setVal(ch); inputRef.current?.focus(); }} style={{ fontFamily: BODY, fontSize: 12.5, padding: '6px 13px', borderRadius: 24, border: `1px solid ${C.border}`, background: C.cardBg, color: C.ink2, cursor: 'pointer' }}>{ch}</button>)}</div>}
          <div ref={endRef} />
        </div>
        {file && <div style={{ padding: '0 22px 4px' }}><div style={{ fontFamily: BODY, fontSize: 12, background: C.tealLight, color: C.teal, padding: '3px 9px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 5 }}><ClipIc s={11} c={C.teal} />{file}<button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.teal, fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button></div></div>}
        <div style={{ padding: '10px 22px 22px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, flexShrink: 0 }}>
          <label style={{ border: `1px solid ${C.border}`, borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.ink3, flexShrink: 0 }}><ClipIc s={14} /><input type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0]?.name)} /></label>
          <input ref={inputRef} value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} placeholder="What's on your heart?" style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 10, padding: '9px 13px', fontFamily: BODY, fontSize: 14, color: C.ink, background: C.pageBg, outline: 'none' }} />
          <button onClick={send} disabled={!val.trim() && !file} style={{ width: 36, height: 36, borderRadius: '50%', background: val.trim() || file ? C.ink : C.pageBg, border: 'none', cursor: val.trim() || file ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><SendIc s={14} c={val.trim() || file ? '#fff' : C.ink4} /></button>
        </div>
      </div>
      <style>{`@keyframes bop{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-4px)}}`}</style>
    </div>
  );
}

/* ─── TEAM MATCHER ───────────────────────────────────────────── */
function TeamMatcher({ form, upd }) {
  const [tab, setTab] = useState('my-team');
  const [search, setSearch] = useState('');
  const [requested, setRequested] = useState(new Set());
  const team = form.team || [];
  const inTeam = id => !!team.find(t => t.id === id);
  const addMember = m => { if (!inTeam(m.id)) upd({ team: [...team, m] }); };
  const removeMember = id => upd({ team: team.filter(t => t.id !== id) });
  const request = p => { setRequested(prev => new Set([...prev, p.id])); addMember({ ...p, source: 'nia', status: 'requested' }); };
  const filter = list => !search ? list : list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()));

  const TABS = [
    { id: 'my-team',      label: 'My Team',     count: MY_TEAM.length },
    { id: 'nia',          label: 'Nia Creators', count: NIA_CREATORS.length },
    { id: 'marketplaces', label: 'Marketplaces', count: MARKETPLACES.length },
  ];

  return (
    <div>
      {/* ── Team summary ── */}
      {team.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 10 }}>Your team · {team.length} added</div>
          {team.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 13px', background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 7 }}>
              {m.orb !== undefined ? <GradOrb idx={m.orb} size={32} /> : <InitialsAvatar initials={m.initials} bg={m.bg} size={32} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.ink, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {m.name}
                  {m.source === 'nia' && <Pill text="NIA" bg={C.tealSoft} color={C.teal} />}
                  {m.status === 'requested' && <Pill text="REQUESTED" bg={C.clayLight} color={C.clay} />}
                </div>
                <div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink4 }}>{m.role}{m.location ? ` · ${m.location}` : ''}</div>
              </div>
              {m.rate && <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.ink4, whiteSpace: 'nowrap' }}>{m.rate}</div>}
              <button onClick={() => removeMember(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ink4, fontSize: 17, lineHeight: 1, padding: '0 0 0 4px' }}>×</button>
            </div>
          ))}
          <div style={{ height: 1, background: C.border, margin: '16px 0' }} />
        </div>
      )}

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: 14 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); }}
            style={{ fontFamily: BODY, fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? C.teal : C.ink3, background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? C.teal : 'transparent'}`, padding: '0 0 10px', marginRight: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            {t.label}
            <span style={{ fontFamily: MONO, fontSize: 9.5, color: tab === t.id ? C.teal : C.ink4, background: tab === t.id ? C.tealSoft : C.pageBg, padding: '1px 5px', borderRadius: 8 }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      {tab !== 'marketplaces' && (
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><SearchIc s={13} c={C.ink4} /></div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tab === 'my-team' ? 'Search your team by name or role…' : 'Search Nia creators by name or role…'}
            style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '9px 12px 9px 30px', fontFamily: BODY, fontSize: 13.5, color: C.ink, background: C.cardBg, outline: 'none', boxSizing: 'border-box' }} />
        </div>
      )}

      {/* ── MY TEAM ── */}
      {tab === 'my-team' && (
        <div>
          <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4, marginBottom: 10 }}>People from your organisation, agency, or regular collaborators</div>
          {filter(MY_TEAM).length === 0 && <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink4, textAlign: 'center', padding: 24 }}>No matches found.</div>}
          {filter(MY_TEAM).map(p => {
            const added = inTeam(p.id);
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: added ? C.tealLight : C.cardBg, border: `1px solid ${added ? C.teal + '35' : C.border}`, borderRadius: 10, marginBottom: 8, transition: 'all .12s' }}>
                <InitialsAvatar initials={p.initials} bg={p.bg} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13.5, color: C.ink, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink3 }}>{p.role} · {p.location}</div>
                </div>
                <AvailDot available={p.available} />
                {added
                  ? <button onClick={() => removeMember(p.id)} style={{ fontFamily: BODY, fontSize: 11, background: 'none', border: `1px solid ${C.borderMd}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: C.ink3 }}>Remove</button>
                  : <button onClick={() => addMember(p)} disabled={!p.available} style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, background: p.available ? C.ink : C.pageBg, color: p.available ? '#fff' : C.ink4, border: 'none', borderRadius: 6, padding: '5px 12px', cursor: p.available ? 'pointer' : 'default' }}>Add</button>
                }
              </div>
            );
          })}
          <button style={{ fontFamily: BODY, fontSize: 12.5, color: C.teal, background: 'none', border: `1px dashed ${C.teal}50`, borderRadius: 8, padding: 10, width: '100%', cursor: 'pointer', marginTop: 4 }}>+ Invite someone new to your team</button>
        </div>
      )}

      {/* ── NIA CREATORS ── */}
      {tab === 'nia' && (
        <div>
          <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4, marginBottom: 10 }}>Matched to your project — sorted by skill relevance · taste matching coming soon</div>
          {filter(NIA_CREATORS).map(p => {
            const added = inTeam(p.id);
            const isReq = requested.has(p.id);
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: added ? C.tealLight : C.cardBg, border: `1px solid ${added ? C.teal + '35' : C.border}`, borderRadius: 10, marginBottom: 8, transition: 'all .12s' }}>
                <GradOrb idx={p.orb} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13.5, color: C.ink, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink3, marginBottom: 5 }}>{p.role} · {p.location}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{p.skills.map(s => <span key={s} style={{ fontFamily: BODY, fontSize: 10.5, background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 4, padding: '2px 6px', color: C.ink3 }}>{s}</span>)}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: BODY, fontSize: 16, fontWeight: 700, color: C.teal, lineHeight: 1 }}>{p.match}%</div>
                  <div style={{ fontFamily: BODY, fontSize: 10, color: C.ink4 }}>match</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.ink4, marginBottom: 4 }}>{p.rate}</div>
                  <AvailDot available={p.available} />
                </div>
                <div style={{ flexShrink: 0 }}>
                  {isReq || added
                    ? <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, background: C.tealSoft, color: C.teal, borderRadius: 6, padding: '5px 10px' }}>Requested</div>
                    : <button onClick={() => request(p)} disabled={!p.available} style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, background: p.available ? C.teal : C.pageBg, color: p.available ? '#fff' : C.ink4, border: 'none', borderRadius: 6, padding: '5px 12px', cursor: p.available ? 'pointer' : 'default' }}>Request</button>
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MARKETPLACES ── */}
      {tab === 'marketplaces' && (
        <div>
          <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4, marginBottom: 14 }}>Connect to creative professionals on partner platforms</div>
          {MARKETPLACES.map(m => (
            <div key={m.id} style={{ background: m.bg, border: `1px solid ${m.accent}22`, borderRadius: 12, padding: '16px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: m.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '-.3px' }}>{m.name.slice(0,3).toUpperCase()}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 14, color: C.ink }}>{m.name}</div>
                  {m.sub && <span style={{ fontFamily: BODY, fontSize: 10.5, color: m.accent, background: m.accent + '18', padding: '1px 7px', borderRadius: 10 }}>{m.sub}</span>}
                  {m.badge && <span style={{ fontFamily: BODY, fontSize: 9.5, color: '#fff', background: C.teal, padding: '2px 7px', borderRadius: 10, fontWeight: 600 }}>{m.badge}</span>}
                </div>
                <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, lineHeight: 1.5, marginBottom: 4 }}>{m.desc}</div>
                <div style={{ fontFamily: MONO, fontSize: 10.5, color: m.accent }}>{m.count}</div>
              </div>
              <button style={{ fontFamily: BODY, fontSize: 12, fontWeight: 600, color: m.accent, background: 'transparent', border: `1.5px solid ${m.accent}`, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .12s' }}
                onMouseEnter={e => { e.currentTarget.style.background = m.accent; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = m.accent; }}>
                {m.cta} →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── PROJECTS VIEW ──────────────────────────────────────────── */
function ProjectsView({ projects, onOpen }) {
  const empty = projects.length === 0;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '28px 44px 20px', borderBottom: `1px solid ${C.border}`, background: C.cardBg, flexShrink: 0 }}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 20, color: C.ink, marginBottom: 2 }}>Projects</div>
        <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink4 }}>{projects.length} project{projects.length !== 1 ? 's' : ''} in your terminal</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 44px 48px' }}>
        {empty ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: C.pageBg, border: `1px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <FolderIc s={24} c={C.ink4} />
            </div>
            <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 16, color: C.ink, marginBottom: 6 }}>No projects yet</div>
            <div style={{ fontFamily: BODY, fontSize: 13.5, color: C.ink4, lineHeight: 1.6 }}>Projects you create will live here.<br />Start by clicking Create.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
            {projects.map(p => {
              const typeLabel = PROJECT_TYPES.find(t => t.id === p.type)?.label || p.type;
              return (
                <div key={p.id} onClick={() => onOpen(p)} style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', cursor: 'pointer', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', background: C.tealSoft, color: C.teal, padding: '3px 8px', borderRadius: 20 }}>{typeLabel}</span>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.ink4 }}>{p.date}</span>
                  </div>
                  <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, marginBottom: 12 }}>{p.client}</div>
                  {p.brief?.overview && <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4, lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.brief.overview}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex' }}>
                      {(p.team || []).slice(0, 4).map((m, i) => (
                        <div key={m.id} style={{ width: 24, height: 24, borderRadius: '50%', background: m.bg || '#888', marginLeft: i > 0 ? -6 : 0, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff', fontFamily: BODY }}>
                          {m.initials?.[0] || m.name[0]}
                        </div>
                      ))}
                      {(p.team || []).length > 4 && <div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4, marginLeft: 4, lineHeight: '24px' }}>+{p.team.length - 4}</div>}
                    </div>
                    {p.moods?.length > 0 && <div style={{ display: 'flex', gap: 4 }}>{p.moods.slice(0, 2).map(m => <span key={m} style={{ fontFamily: BODY, fontSize: 10, color: C.clay, background: C.clayLight, padding: '2px 7px', borderRadius: 10 }}>{m}</span>)}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PROJECT DETAIL OVERLAY ─────────────────────────────────── */
function ProjectDetail({ project, onClose }) {
  if (!project) return null;
  const typeLabel = PROJECT_TYPES.find(t => t.id === project.type)?.label || project.type;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(15,14,12,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: C.cardBg, borderRadius: 20, width: '100%', maxWidth: 580, maxHeight: '88vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, letterSpacing: '.08em', color: C.teal, marginBottom: 5 }}>{typeLabel}</div>
              <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 22, color: C.ink, letterSpacing: '-.5px', marginBottom: 2 }}>{project.name}</div>
              <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink3 }}>{project.client} · {project.date}</div>
            </div>
            <button onClick={onClose} style={{ background: C.pageBg, border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink3, flexShrink: 0 }}><CloseIc /></button>
          </div>
          {project.moods?.length > 0 && <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 20 }}>{project.moods.map(m => <span key={m} style={{ fontFamily: BODY, fontSize: 11, background: C.clayLight, color: C.clay, padding: '3px 8px', borderRadius: 20 }}>{m}</span>)}</div>}
        </div>
        <div style={{ padding: '0 24px 24px' }}>
          {[['overview','Overview'],['creativeDirection','Creative Direction'],['deliverables','Deliverables'],['visualDirection','Visual Direction'],['timeline','Timeline']].map(([k, label]) => (
            project.brief?.[k] && (
              <div key={k} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 8 }}>{label}</div>
                <div style={{ fontFamily: BODY, fontSize: 13.5, color: C.ink2, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{project.brief[k]}</div>
              </div>
            )
          ))}
          {project.team?.length > 0 && (
            <div>
              <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 10 }}>Team</div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {project.team.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 11px 5px 7px', background: m.source === 'nia' ? C.tealLight : C.pageBg, borderRadius: 24, border: `1px solid ${m.source === 'nia' ? C.teal + '30' : C.border}` }}>
                    {m.orb !== undefined ? <GradOrb idx={m.orb} size={18} /> : <InitialsAvatar initials={m.initials?.[0] || m.name[0]} bg={m.bg || '#888'} size={18} />}
                    <span style={{ fontFamily: BODY, fontSize: 12, color: m.source === 'nia' ? C.teal : C.ink2, fontWeight: 500 }}>{m.name}</span>
                    {m.source === 'nia' && <Pill text="NIA" bg={C.tealSoft} color={C.teal} size={9.5} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── NEW PROJECT FLOW ───────────────────────────────────────── */
function NewProjectFlow({ onBack, onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ spark: '', client: '', name: '', type: '', moods: [], context: '', team: [] });
  const [project, setProject] = useState(null);
  const upd = p => setForm(f => ({ ...f, ...p }));

  const generate = async () => {
    setStep(5);
    const moodStr = form.moods.join(', ') || 'undefined';
    const typeLabel = PROJECT_TYPES.find(t => t.id === form.type)?.label || form.type;
    const raw = await callClaude(
      `Generate a creative production brief as JSON only. Project: "${form.name}", Client: "${form.client || 'Own work'}", Type: ${typeLabel}, Mood: ${moodStr}, Context: ${form.spark}. Return: {"overview":"2-3 sentences","creativeDirection":"2-3 sentences on vision","deliverables":"specific items one per line with —","visualDirection":"2-3 sentences on aesthetic","timeline":"key milestones"}`,
      'Return valid JSON only. No markdown, no fences, no extra text.'
    );
    let brief = {};
    try { brief = JSON.parse(raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim()); }
    catch { brief = { overview: form.spark, creativeDirection: 'To be refined.', deliverables: '— TBD', visualDirection: moodStr || 'TBD', timeline: 'TBD' }; }
    const proj = { id: Date.now(), name: form.name, client: form.client || 'Own work', type: form.type, brief, team: form.team, moods: form.moods, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) };
    setProject(proj); setStep(6);
  };

  const canContinue = () => {
    if (step === 1) return form.spark.trim().length > 3;
    if (step === 2) return !!(form.name.trim() && form.type);
    return true;
  };
  const LABELS = ['The Spark', 'The What', 'The Feeling', 'The People'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.pageBg, overflow: 'hidden' }}>
      {step < 5 && (
        <div style={{ padding: '16px 28px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, background: C.cardBg, flexShrink: 0 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ink3, fontSize: 18, lineHeight: 1, padding: '0 4px 0 0', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}><div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13.5, color: C.ink }}>New project — <span style={{ color: C.ink3, fontWeight: 400 }}>{LABELS[step - 1]}</span></div></div>
          <div style={{ display: 'flex', gap: 5 }}>{LABELS.map((_, i) => <div key={i} style={{ height: 3, width: i < step ? 28 : 14, borderRadius: 2, background: i < step ? C.teal : C.border, transition: 'all .25s' }} />)}</div>
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {step === 1 && (
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '36px 28px 80px' }}>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.ink, letterSpacing: '-.4px', marginBottom: 6 }}>Where did this begin?</div>
            <div style={{ fontFamily: BODY, fontSize: 14, color: C.ink3, marginBottom: 28, lineHeight: 1.65, fontWeight: 300 }}>The start of a project is rarely clean. Write what's true, not what's tidy.</div>
            <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 8 }}>The spark</div>
            <textarea value={form.spark} onChange={e => upd({ spark: e.target.value })} placeholder={"What's in your head right now? Don't edit yourself — write it as it arrives."} rows={5} style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', fontFamily: BODY, fontSize: 15, color: C.ink, background: C.cardBg, outline: 'none', resize: 'none', lineHeight: 1.7, boxSizing: 'border-box', marginBottom: 20 }} />
            <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 8 }}>Client or partner</div>
            <input value={form.client} onChange={e => upd({ client: e.target.value })} placeholder="e.g. Sbur Labs — or leave blank if personal" style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 14px', fontFamily: BODY, fontSize: 14, color: C.ink, background: C.cardBg, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        )}
        {step === 2 && (
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '36px 28px 80px' }}>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.ink, letterSpacing: '-.4px', marginBottom: 6 }}>What are we making?</div>
            <div style={{ fontFamily: BODY, fontSize: 14, color: C.ink3, marginBottom: 28, lineHeight: 1.65, fontWeight: 300 }}>A working title is enough. You can always rename it later.</div>
            <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 8 }}>Project name</div>
            <input value={form.name} onChange={e => upd({ name: e.target.value })} placeholder="e.g. Sbur Labs April Content" style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 15px', fontFamily: BODY, fontSize: 16, fontWeight: 600, color: C.ink, background: C.cardBg, outline: 'none', boxSizing: 'border-box', marginBottom: 24 }} />
            <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 12 }}>Project type</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PROJECT_TYPES.map(t => {
                const on = form.type === t.id;
                return <div key={t.id} onClick={() => upd({ type: t.id })} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', border: `1.5px solid ${on ? C.teal : C.border}`, borderRadius: 11, background: on ? C.tealLight : C.cardBg, cursor: 'pointer', transition: 'all .13s' }}><span style={{ fontSize: 16, opacity: .65 }}>{t.icon}</span><div><div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: on ? C.teal : C.ink, marginBottom: 1 }}>{t.label}</div><div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4 }}>{t.sub}</div></div></div>;
              })}
            </div>
          </div>
        )}
        {step === 3 && (
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '36px 28px 80px' }}>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.ink, letterSpacing: '-.4px', marginBottom: 6 }}>What should it feel like?</div>
            <div style={{ fontFamily: BODY, fontSize: 14, color: C.ink3, marginBottom: 28, lineHeight: 1.65, fontWeight: 300 }}>Before structure, there's a feeling this project is reaching toward. What is it?</div>
            <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 12 }}>Mood — select up to 5</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 26 }}>
              {MOODS.map(m => { const on = (form.moods || []).includes(m); return <button key={m} onClick={() => upd({ moods: on ? form.moods.filter(x => x !== m) : form.moods.length < 5 ? [...form.moods, m] : form.moods })} style={{ fontFamily: BODY, fontSize: 13, padding: '7px 14px', borderRadius: 24, border: `1.5px solid ${on ? C.clay : C.border}`, background: on ? C.clayLight : C.cardBg, color: on ? C.clay : C.ink3, cursor: 'pointer', fontWeight: on ? 600 : 400, transition: 'all .12s' }}>{m}</button>; })}
            </div>
            <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 8 }}>References, images, or notes</div>
            <textarea value={form.context} onChange={e => upd({ context: e.target.value })} placeholder={"Describe images, name directors, mention songs, describe light or textures…"} rows={4} style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 12, padding: '13px 15px', fontFamily: BODY, fontSize: 14, color: C.ink, background: C.cardBg, outline: 'none', resize: 'none', lineHeight: 1.7, boxSizing: 'border-box' }} />
          </div>
        )}
        {step === 4 && (
          <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 28px 80px' }}>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.ink, letterSpacing: '-.4px', marginBottom: 6 }}>Who needs to be part of this?</div>
            <div style={{ fontFamily: BODY, fontSize: 14, color: C.ink3, marginBottom: 28, lineHeight: 1.65, fontWeight: 300 }}>Add from your own team, match with Nia Creators, or browse partner platforms. The team can be adjusted at any time.</div>
            <TeamMatcher form={form} upd={upd} />
          </div>
        )}
        {step === 5 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, textAlign: 'center', minHeight: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}><Pearl size={64} /></div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.ink, letterSpacing: '-.4px', marginBottom: 8 }}>Nia is writing your brief</div>
            <div style={{ fontFamily: BODY, fontSize: 14, color: C.ink3, fontWeight: 300 }}>Reading everything. Composing something specific to you.</div>
          </div>
        )}
        {step === 6 && project && (
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '36px 28px 80px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, letterSpacing: '.08em', color: C.teal, marginBottom: 10 }}>PROJECT CREATED</div>
              <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.ink, letterSpacing: '-.5px', marginBottom: 4 }}>{project.name}</div>
              <div style={{ fontFamily: BODY, fontSize: 14, color: C.ink3 }}>{project.client} · {PROJECT_TYPES.find(t => t.id === project.type)?.label}</div>
              {project.moods?.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 10 }}>{project.moods.map(m => <span key={m} style={{ fontFamily: BODY, fontSize: 12, background: C.clayLight, color: C.clay, padding: '3px 9px', borderRadius: 20 }}>{m}</span>)}</div>}
            </div>
            {[['overview','Overview'],['creativeDirection','Creative direction'],['deliverables','Deliverables'],['visualDirection','Visual direction'],['timeline','Timeline']].map(([k, label]) => (
              project.brief?.[k] && (
                <div key={k} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 7 }}>{label}</div>
                  <div style={{ fontFamily: BODY, fontSize: 14, color: C.ink2, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{project.brief[k]}</div>
                </div>
              )
            ))}
            {project.team?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 10 }}>Team</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {project.team.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px 5px 7px', background: m.source === 'nia' ? C.tealLight : C.pageBg, borderRadius: 24, border: `1px solid ${m.source === 'nia' ? C.teal + '22' : C.border}` }}>
                      {m.orb !== undefined ? <GradOrb idx={m.orb} size={18} /> : <InitialsAvatar initials={m.initials?.[0] || m.name[0]} bg={m.bg || '#888'} size={18} />}
                      <span style={{ fontFamily: BODY, fontSize: 12.5, color: m.source === 'nia' ? C.teal : C.ink2, fontWeight: 500 }}>{m.name}</span>
                      {m.source === 'nia' && <Pill text="NIA" bg={C.tealSoft} color={C.teal} size={9.5} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => onDone(project)} style={{ flex: 1, padding: '12px', background: C.ink, border: 'none', borderRadius: 12, color: '#fff', fontFamily: BODY, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Open workspace →</button>
              <button onClick={onBack} style={{ padding: '12px 20px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 12, color: C.ink2, fontFamily: BODY, fontSize: 14, cursor: 'pointer' }}>Studio</button>
            </div>
          </div>
        )}
      </div>
      {step < 5 && (
        <div style={{ padding: '13px 28px 18px', borderTop: `1px solid ${C.border}`, background: C.cardBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4 }}>{step} of 4</div>
          <button onClick={() => step < 4 ? setStep(s => s + 1) : generate()} disabled={!canContinue()} style={{ padding: '10px 28px', background: canContinue() ? C.ink : C.border, border: 'none', borderRadius: 24, color: canContinue() ? '#fff' : C.ink4, fontFamily: BODY, fontSize: 14, fontWeight: 600, cursor: canContinue() ? 'pointer' : 'default', transition: 'all .13s' }}>
            {step < 4 ? 'Continue →' : '✦  Generate brief'}
          </button>
        </div>
      )}
    </div>
  );
}


/* ─── SKILLS LIBRARY (full archetype browser) ───────────────── */
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
  // Cat 1 — Creative Direction & Vision
  { id:1,  cat:1, type:'Strategy',   name:'Chief Creative Officer (CCO)',      tier:'C-Suite',    rate:'$2,000–5,000/day',     orb:0, sum:'Holds ultimate creative authority across an organisation — setting philosophy, culture, and standards that govern all output.' },
  { id:2,  cat:1, type:'Strategy',   name:'Executive Creative Director (ECD)', tier:'Executive',  rate:'$1,500–4,000/day',     orb:0, sum:'Oversees all creative output across a division — responsible for maintaining creative excellence and developing talent.' },
  { id:3,  cat:1, type:'Strategy',   name:'Creative Director',                 tier:'Senior',     rate:'$800–2,000/day',       orb:0, sum:'The most common senior creative leadership role — responsible for concept, visual direction, and aesthetic execution.' },
  { id:4,  cat:1, type:'Visual',     name:'Art Director',                      tier:'Mid-Senior', rate:'$600–1,500/day',       orb:0, sum:'Shapes the visual language of a production — from moodboard to set dressing, colour palette to typographic decisions.' },
  { id:5,  cat:1, type:'Strategy',   name:'Senior Art Director',               tier:'Senior',     rate:'$800–1,800/day',       orb:0, sum:'A more experienced Art Director who leads visual decision-making across larger or more complex projects.' },
  { id:6,  cat:1, type:'Visual',     name:'Junior Art Director',               tier:'Junior',     rate:'$300–700/day',         orb:0, sum:'A developing creative building foundational skills in visual concept development, layout, and art direction.' },
  { id:7,  cat:1, type:'Strategy',   name:'Brand Creative Director',           tier:'Senior',     rate:'$900–2,000/day',       orb:0, sum:'Leads creative strategy and execution for a specific brand — maintaining visual and tonal consistency across all touchpoints.' },
  { id:8,  cat:1, type:'Strategy',   name:'Campaign Creative Director',        tier:'Senior',     rate:'$900–2,200/day',       orb:0, sum:'Leads the creative development of marketing and advertising campaigns from concept through to final delivery.' },
  { id:9,  cat:1, type:'Strategy',   name:'Creative Strategist',               tier:'Mid-Senior', rate:'$600–1,400/day',       orb:0, sum:'Bridges creative and strategic thinking — translating audience insight and brand goals into actionable creative direction.' },
  { id:10, cat:1, type:'Strategy',   name:'Concept Developer',                 tier:'Mid',        rate:'$400–1,000/day',       orb:0, sum:'Specialises in early-stage idea development — building concepts, territories, and narrative frameworks from briefs.' },
  // Cat 2 — Production & Direction
  { id:11, cat:2, type:'Production', name:'Film Director',                     tier:'Senior',     rate:'$1,500–5,000/day',     orb:1, sum:'Leads the creative and narrative vision of a film or video production — responsible for all on-screen performance and visual storytelling.' },
  { id:12, cat:2, type:'Production', name:'Commercial Director',               tier:'Senior',     rate:'$1,200–4,000/day',     orb:1, sum:'Specialises in directing advertising and brand content — expert in distilling a message into a visually compelling short-form piece.' },
  { id:13, cat:2, type:'Production', name:'Music Video Director',              tier:'Senior',     rate:'$1,000–3,500/day',     orb:1, sum:'Directs music video productions — combining visual storytelling with performance, choreography, and the artist\'s brand identity.' },
  { id:14, cat:2, type:'Production', name:'Documentary Director',              tier:'Senior',     rate:'$1,000–3,000/day',     orb:1, sum:'Leads the creative vision of documentary projects — shaping real-world subject matter into a compelling narrative arc.' },
  { id:15, cat:2, type:'Production', name:'Executive Producer',                tier:'Executive',  rate:'$1,200–3,500/day',     orb:1, sum:'Oversees the financial, logistical, and creative management of a production at the highest level.' },
  { id:16, cat:2, type:'Production', name:'Producer',                          tier:'Senior',     rate:'$800–2,000/day',       orb:1, sum:'Holds the production together — budget, logistics, crew, delivery. The person who makes sure the thing gets made.' },
  { id:17, cat:2, type:'Production', name:'Line Producer',                     tier:'Mid-Senior', rate:'$700–1,800/day',       orb:1, sum:'Manages the day-to-day operational and financial running of a production — translating the producer\'s decisions into logistics.' },
  { id:18, cat:2, type:'Production', name:'Associate Producer',                tier:'Mid',        rate:'$450–1,000/day',       orb:1, sum:'Supports the producer with research, coordination, and production tasks across the project lifecycle.' },
  { id:19, cat:2, type:'Production', name:'Content Producer',                  tier:'Mid',        rate:'$400–900/day',         orb:1, sum:'Manages the end-to-end creation of digital or social content — from brief to published asset.' },
  { id:20, cat:2, type:'Production', name:'Production Coordinator',            tier:'Junior',     rate:'$250–600/day',         orb:1, sum:'Provides operational support across all production departments — managing schedules, logistics, and communication.' },
  // Cat 3 — Camera, Lighting & On-Set
  { id:21, cat:3, type:'Technical',  name:'Director of Photography (DoP)',     tier:'Senior',     rate:'$1,200–3,000/day',     orb:2, sum:'Responsible for the visual language of a filmed production — lighting design, camera movement, lens choices, and image quality.' },
  { id:22, cat:3, type:'Technical',  name:'Camera Operator',                   tier:'Mid-Senior', rate:'$600–1,400/day',       orb:2, sum:'Operates the camera under the DoP\'s direction — responsible for shot execution, framing, and physical camera movement.' },
  { id:23, cat:3, type:'Technical',  name:'1st Assistant Camera (1st AC)',     tier:'Mid',        rate:'$500–1,100/day',       orb:2, sum:'Manages focus pulling, lens changes, and camera maintenance — works directly under the camera operator.' },
  { id:24, cat:3, type:'Technical',  name:'2nd Assistant Camera (2nd AC)',     tier:'Junior',     rate:'$300–650/day',         orb:2, sum:'Supports the camera department with slate operation, equipment management, and camera reports.' },
  { id:25, cat:3, type:'Technical',  name:'Gaffer (Chief Lighting Technician)',tier:'Senior',     rate:'$800–2,000/day',       orb:2, sum:'Heads the electrical department — responsible for designing and executing the lighting plan in collaboration with the DoP.' },
  { id:26, cat:3, type:'Technical',  name:'Best Boy Electric',                 tier:'Mid',        rate:'$500–1,100/day',       orb:2, sum:'Second-in-command of the lighting department — manages equipment, crew logistics, and assists the Gaffer.' },
  { id:27, cat:3, type:'Technical',  name:'Grip (Key Grip)',                   tier:'Senior',     rate:'$700–1,600/day',       orb:2, sum:'Leads the grip department — responsible for all camera support, rigs, dollies, and on-set mechanical equipment.' },
  { id:28, cat:3, type:'Technical',  name:'Steadicam Operator',                tier:'Specialist', rate:'$900–2,200/day',       orb:2, sum:'Specialises in Steadicam operation — providing smooth, mobile camera movement for complex tracking and action shots.' },
  { id:29, cat:3, type:'Technical',  name:'Drone Operator (UAV Pilot)',        tier:'Specialist', rate:'$800–2,000/day',       orb:2, sum:'Operates unmanned aerial vehicles for aerial cinematography — licensed, safety-certified, and experienced with film-grade camera rigs.' },
  { id:30, cat:3, type:'Technical',  name:'DIT (Digital Imaging Technician)',  tier:'Specialist', rate:'$700–1,600/day',       orb:2, sum:'Manages on-set digital image quality, colour management, data security, and the technical pipeline from camera to post.' },
  // Cat 4 — Post-Production & Technical
  { id:31, cat:4, type:'Technical',  name:'Editor (Film / Video)',             tier:'Senior',     rate:'$800–2,000/day',       orb:3, sum:'Assembles raw footage into a cohesive narrative or visual sequence — shaping pacing, rhythm, and story in the edit suite.' },
  { id:32, cat:4, type:'Technical',  name:'Colour Grader / Colourist',         tier:'Specialist', rate:'$900–2,400/day',       orb:3, sum:'Applies colour correction and creative colour grading to footage — establishing the final visual tone and mood of the piece.' },
  { id:33, cat:4, type:'Technical',  name:'VFX Supervisor',                    tier:'Senior',     rate:'$1,000–3,000/day',     orb:3, sum:'Oversees all visual effects from pre-production planning through to final compositing and delivery.' },
  { id:34, cat:4, type:'Technical',  name:'VFX Artist / Compositor',           tier:'Mid-Senior', rate:'$600–1,500/day',       orb:3, sum:'Creates and composites visual effects elements — integrating CGI, motion graphics, and live-action footage.' },
  { id:35, cat:4, type:'Technical',  name:'Motion Graphics Designer',          tier:'Mid-Senior', rate:'$550–1,300/day',       orb:3, sum:'Designs and animates graphic elements for film, broadcast, and digital media — titles, transitions, and infographic sequences.' },
  { id:36, cat:4, type:'Technical',  name:'Sound Designer',                    tier:'Senior',     rate:'$800–2,000/day',       orb:3, sum:'Creates the sonic world of a production — designing, recording, and editing all non-music audio elements.' },
  { id:37, cat:4, type:'Technical',  name:'Re-recording Mixer',                tier:'Senior',     rate:'$900–2,200/day',       orb:3, sum:'Balances and mixes all audio elements — dialogue, music, effects — into the final broadcast or cinema mix.' },
  { id:38, cat:4, type:'Technical',  name:'Production Sound Mixer',            tier:'Senior',     rate:'$800–1,800/day',       orb:3, sum:'Captures clean, broadcast-quality audio on set — operating the sound recording system and directing the sound team.' },
  { id:39, cat:4, type:'Technical',  name:'Boom Operator',                     tier:'Mid',        rate:'$400–900/day',         orb:3, sum:'Operates the boom microphone on set — responsible for capturing clean dialogue and ambient sound in every scene.' },
  { id:40, cat:4, type:'Technical',  name:'Post-Production Supervisor',        tier:'Senior',     rate:'$800–1,800/day',       orb:3, sum:'Manages all post-production processes from picture lock through to final delivery — coordinating editors, VFX, sound, and grade.' },
  // Cat 5 — Design & Visual Arts
  { id:41, cat:5, type:'Visual',     name:'Graphic Designer',                  tier:'Mid',        rate:'$400–1,000/day',       orb:4, sum:'Creates visual communication across print and digital media — typography, layout, identity, and graphic assets.' },
  { id:42, cat:5, type:'Visual',     name:'Senior Graphic Designer',           tier:'Senior',     rate:'$600–1,400/day',       orb:4, sum:'A more experienced designer who leads visual projects and may mentor junior designers or manage design systems.' },
  { id:43, cat:5, type:'Visual',     name:'Brand Designer',                    tier:'Mid-Senior', rate:'$550–1,300/day',       orb:4, sum:'Specialises in brand identity — developing visual systems, guidelines, and assets that define how a brand looks and feels.' },
  { id:44, cat:5, type:'Visual',     name:'UX/UI Designer',                    tier:'Mid-Senior', rate:'$600–1,500/day',       orb:4, sum:'Designs user experiences for digital products — focused on usability, interaction design, and visual interface systems.' },
  { id:45, cat:5, type:'Visual',     name:'Illustrator',                       tier:'Specialist', rate:'$450–1,200/day',       orb:4, sum:'Creates original artwork for editorial, advertising, and brand contexts — working in a wide range of styles and media.' },
  { id:46, cat:5, type:'Visual',     name:'Typographer',                       tier:'Specialist', rate:'$500–1,300/day',       orb:4, sum:'Specialises in typography — selecting, setting, and designing typefaces for editorial, identity, and environmental applications.' },
  { id:47, cat:5, type:'Visual',     name:'Production Designer',               tier:'Senior',     rate:'$900–2,200/day',       orb:4, sum:'Designs the physical world of a film or commercial — responsible for sets, locations, props, and the overall visual environment.' },
  { id:48, cat:5, type:'Visual',     name:'Set Designer',                      tier:'Mid-Senior', rate:'$600–1,400/day',       orb:4, sum:'Works under the Production Designer to design and dress specific sets and environments for production.' },
  { id:49, cat:5, type:'Visual',     name:'Props Master',                      tier:'Mid-Senior', rate:'$500–1,200/day',       orb:4, sum:'Sources, manages, and maintains all props used on a production — from hero props to background dressing.' },
  { id:50, cat:5, type:'Visual',     name:'Storyboard Artist',                 tier:'Specialist', rate:'$600–1,500/day',       orb:4, sum:'Visualises scripts and creative briefs as sequential illustration — communicating shot composition and narrative flow.' },
  // Cat 6 — Styling, Wardrobe & Beauty
  { id:51, cat:6, type:'Styling',    name:'Fashion Stylist',                   tier:'Senior',     rate:'$700–1,800/day',       orb:5, sum:'Curates and directs the wardrobe and overall visual aesthetic of editorial, commercial, and fashion productions.' },
  { id:52, cat:6, type:'Styling',    name:'Editorial Stylist',                 tier:'Mid-Senior', rate:'$500–1,200/day',       orb:5, sum:'Specialises in styling for editorial and magazine contexts — sourcing looks, dressing talent, and managing shoots.' },
  { id:53, cat:6, type:'Styling',    name:'Celebrity Stylist',                 tier:'Senior',     rate:'$800–2,500/day',       orb:5, sum:'Manages the personal styling and wardrobe of high-profile talent for red carpet, press, and public appearances.' },
  { id:54, cat:6, type:'Styling',    name:'Wardrobe Supervisor',               tier:'Senior',     rate:'$650–1,500/day',       orb:5, sum:'Manages the entire wardrobe department on a production — from fittings and sourcing to on-set dressing and continuity.' },
  { id:55, cat:6, type:'Styling',    name:'Costume Designer',                  tier:'Senior',     rate:'$900–2,200/day',       orb:5, sum:'Designs and oversees the creation of all costumes for a narrative production — film, television, or live performance.' },
  { id:56, cat:6, type:'Styling',    name:'Make-Up Artist (MUA)',              tier:'Mid-Senior', rate:'$500–1,200/day',       orb:5, sum:'Applies make-up and beauty looks to talent for film, photo, and live productions — from editorial to special effects.' },
  { id:57, cat:6, type:'Styling',    name:'Hair Stylist',                      tier:'Mid-Senior', rate:'$450–1,100/day',       orb:5, sum:'Styles and manages talent hair for productions — from editorial looks to period-accurate designs and continuity management.' },
  { id:58, cat:6, type:'Styling',    name:'Grooming Artist',                   tier:'Mid',        rate:'$400–900/day',         orb:5, sum:'Provides on-set grooming and finishing for talent — focused on skin, hair, and presentation for camera.' },
  { id:59, cat:6, type:'Styling',    name:'Nail Artist',                       tier:'Specialist', rate:'$350–800/day',         orb:5, sum:'Designs and applies nail art for editorial, beauty, and commercial productions.' },
  { id:60, cat:6, type:'Styling',    name:'Body Painter',                      tier:'Specialist', rate:'$600–1,400/day',       orb:5, sum:'Applies body art and paint for editorial, conceptual, and fashion productions — works closely with the creative director and photographer.' },
  // Cat 7 — Music, Audio & Performance
  { id:61, cat:7, type:'Sound',      name:'Music Producer',                    tier:'Senior',     rate:'$1,000–5,000/project', orb:0, sum:'Oversees the creative and technical production of a music recording — from arrangement and studio sessions to final mix.' },
  { id:62, cat:7, type:'Sound',      name:'Music Supervisor',                  tier:'Senior',     rate:'$1,500–4,000/project', orb:0, sum:'Selects, clears, and licences music for film, TV, advertising, and digital content — a strategic creative role.' },
  { id:63, cat:7, type:'Sound',      name:'Composer',                          tier:'Senior',     rate:'$1,000–4,000/project', orb:0, sum:'Creates original music for film, advertising, and multimedia — composing and arranging to picture or brief.' },
  { id:64, cat:7, type:'Sound',      name:'Sound Engineer (Recording)',        tier:'Specialist', rate:'$600–1,500/day',       orb:0, sum:'Operates recording studio equipment during sessions — responsible for signal chain, microphone placement, and audio capture.' },
  { id:65, cat:7, type:'Sound',      name:'Mix Engineer',                      tier:'Specialist', rate:'$700–2,000/project',   orb:0, sum:'Balances and processes all elements of a recorded track into a polished stereo or spatial mix.' },
  { id:66, cat:7, type:'Sound',      name:'Mastering Engineer',                tier:'Specialist', rate:'$300–800/project',     orb:0, sum:'Applies the final stage of audio processing to a mix — optimising levels, tone, and format for distribution.' },
  { id:67, cat:7, type:'Sound',      name:'DJ / Selector',                     tier:'Mid-Senior', rate:'$500–3,000/event',     orb:0, sum:'Selects and mixes recorded music for live events, brand activations, and creative productions.' },
  { id:68, cat:7, type:'Sound',      name:'Live Sound Engineer',               tier:'Mid-Senior', rate:'$500–1,300/day',       orb:0, sum:'Manages the audio system and mixing for live events — monitors, front-of-house, and stage coordination.' },
  { id:69, cat:7, type:'Sound',      name:'Session Musician',                  tier:'Specialist', rate:'$300–1,000/day',       orb:0, sum:'Performs as an instrumentalist in recording sessions or live productions — typically working to a brief or arrangement.' },
  { id:70, cat:7, type:'Sound',      name:'Vocal Coach',                       tier:'Specialist', rate:'$200–600/session',     orb:0, sum:'Supports vocalists in technique, performance, and preparation for recording sessions or live performance.' },
  // Cat 8 — Photography & Digital Media
  { id:71, cat:8, type:'Visual',     name:'Commercial Photographer',           tier:'Senior',     rate:'$1,000–3,000/day',     orb:1, sum:'Produces photography for advertising, brand campaigns, and commercial contexts — working to brief and delivering production-ready assets.' },
  { id:72, cat:8, type:'Visual',     name:'Editorial Photographer',            tier:'Senior',     rate:'$800–2,000/day',       orb:1, sum:'Creates photography for magazine, press, and editorial contexts — known for a distinct visual voice and strong storytelling.' },
  { id:73, cat:8, type:'Visual',     name:'Portrait Photographer',             tier:'Mid-Senior', rate:'$600–1,500/day',       orb:1, sum:'Specialises in photographing people — from studio portraiture to environmental and documentary portrait work.' },
  { id:74, cat:8, type:'Visual',     name:'Fashion Photographer',              tier:'Senior',     rate:'$1,000–3,500/day',     orb:1, sum:'Creates photography for fashion brands, magazines, and campaigns — often leading the visual narrative of a full shoot.' },
  { id:75, cat:8, type:'Visual',     name:'Documentary Photographer',          tier:'Mid-Senior', rate:'$500–1,400/day',       orb:1, sum:'Documents real-world subjects, events, and stories with an observational visual approach.' },
  { id:76, cat:8, type:'Visual',     name:'Product Photographer',              tier:'Mid',        rate:'$400–1,000/day',       orb:1, sum:'Specialises in still-life and product photography — precise lighting, styling, and post-processing for e-commerce and advertising.' },
  { id:77, cat:8, type:'Visual',     name:'Event Photographer',                tier:'Mid',        rate:'$500–1,200/day',       orb:1, sum:'Documents live events, activations, and productions — delivering selects quickly and maintaining a consistent editorial eye.' },
  { id:78, cat:8, type:'Visual',     name:'Photo Editor / Retoucher',          tier:'Mid-Senior', rate:'$400–1,000/day',       orb:1, sum:'Selects, edits, and retouches photography for publication — working to brand or editorial standards.' },
  { id:79, cat:8, type:'Visual',     name:'Content Creator',                   tier:'Mid',        rate:'$300–800/day',         orb:1, sum:'Produces photo and video content for social media, brand channels, and digital platforms — often self-shooting and self-editing.' },
  { id:80, cat:8, type:'Visual',     name:'Digital Asset Manager (DAM)',       tier:'Specialist', rate:'$400–900/day',         orb:1, sum:'Manages the organisation, storage, and distribution of digital assets across a production or brand.' },
  // Cat 9 — Production Operations
  { id:81, cat:9, type:'Production', name:'1st Assistant Director (1st AD)',   tier:'Senior',     rate:'$700–1,600/day',       orb:2, sum:'The operational spine of any shoot — managing the schedule, crew, and creative director\'s time so the day runs as planned.' },
  { id:82, cat:9, type:'Production', name:'2nd Assistant Director (2nd AD)',   tier:'Mid',        rate:'$450–1,000/day',       orb:2, sum:'Supports the 1st AD in scheduling, call sheets, and crew management — a key logistics role on any production.' },
  { id:83, cat:9, type:'Production', name:'3rd Assistant Director (3rd AD)',   tier:'Junior',     rate:'$250–600/day',         orb:2, sum:'Manages background artists, assists with crowd control, and supports ADs in the field.' },
  { id:84, cat:9, type:'Production', name:'Production Manager',                tier:'Mid-Senior', rate:'$600–1,400/day',       orb:2, sum:'Manages the operational and logistical running of a production — budgets, schedules, vendors, and crew contracts.' },
  { id:85, cat:9, type:'Production', name:'Production Assistant (PA)',         tier:'Junior',     rate:'$200–500/day',         orb:2, sum:'Provides on-set and event logistics support — an entry-level production role with high exposure to all departments.' },
  { id:86, cat:9, type:'Production', name:'Location Manager',                  tier:'Mid-Senior', rate:'$600–1,400/day',       orb:2, sum:'Sources, scouts, and manages all filming locations — permits, logistics, and on-the-ground coordination throughout the shoot.' },
  { id:87, cat:9, type:'Production', name:'Casting Director',                  tier:'Senior',     rate:'$800–2,000/day',       orb:2, sum:'Manages the casting process for film, commercial, and brand productions — sourcing talent and coordinating auditions.' },
  { id:88, cat:9, type:'Production', name:'Talent Manager',                    tier:'Mid-Senior', rate:'$500–1,200/day',       orb:2, sum:'Manages the schedules, logistics, and welfare of talent and crew throughout a production.' },
  { id:89, cat:9, type:'Production', name:'Catering / Craft Services',         tier:'Specialist', rate:'$250–700/day',         orb:2, sum:'Provides on-set catering and craft services — managing food, beverages, and crew welfare across production days.' },
  { id:90, cat:9, type:'Production', name:'Runner',                            tier:'Junior',     rate:'$150–350/day',         orb:2, sum:'An entry-level production role — providing support across all departments with a wide range of on-set and off-set tasks.' },
  // Cat 10 — Enterprise & Brand
  { id:91, cat:10, type:'Enterprise', name:'Brand Strategist',                 tier:'Senior',     rate:'$800–2,000/day',       orb:3, sum:'Develops brand strategy — positioning, audience definition, messaging frameworks, and competitive landscape analysis.' },
  { id:92, cat:10, type:'Enterprise', name:'Marketing Director',               tier:'Senior',     rate:'$900–2,200/day',       orb:3, sum:'Leads the marketing function — campaign strategy, media planning, performance, and team management.' },
  { id:93, cat:10, type:'Enterprise', name:'PR Specialist',                    tier:'Mid-Senior', rate:'$500–1,200/day',       orb:3, sum:'Shapes external communications, press relationships, and amplification strategy from project launch through to coverage.' },
  { id:94, cat:10, type:'Enterprise', name:'Social Media Manager',             tier:'Mid',        rate:'$350–800/day',         orb:3, sum:'Manages brand presence across social platforms — content planning, community management, and performance reporting.' },
  { id:95, cat:10, type:'Enterprise', name:'Community Manager',                tier:'Mid',        rate:'$300–700/day',         orb:3, sum:'Builds and manages online communities around a brand or creator — engagement, moderation, and growth.' },
  { id:96, cat:10, type:'Writing',    name:'Copywriter',                       tier:'Mid-Senior', rate:'$400–1,000/day',       orb:3, sum:'Creates written content for advertising, brand, and editorial contexts — headlines, body copy, scripts, and brand voice.' },
  { id:97, cat:10, type:'Writing',    name:'Content Strategist',               tier:'Mid-Senior', rate:'$500–1,200/day',       orb:3, sum:'Develops content strategy — audience mapping, editorial planning, and content system design across platforms.' },
  { id:98, cat:10, type:'Enterprise', name:'Media Buyer',                      tier:'Mid-Senior', rate:'$500–1,200/day',       orb:3, sum:'Plans and purchases media placements across digital and traditional channels to reach target audiences.' },
  { id:99, cat:10, type:'Enterprise', name:'Events Producer',                  tier:'Mid-Senior', rate:'$600–1,400/day',       orb:3, sum:'Produces brand events, activations, and experiential campaigns from concept through to live execution.' },
  { id:100,cat:10, type:'Enterprise', name:'Partnerships Manager',             tier:'Mid-Senior', rate:'$500–1,200/day',       orb:3, sum:'Identifies, develops, and manages brand partnerships and collaborations — commercial and creative.' },
  // Cat 11 — Technology Companies
  { id:101,cat:11, type:'Tech',       name:'Chief Technology Officer (CTO)',   tier:'C-Suite',    rate:'$2,000–5,000/day',     orb:4, sum:'Leads the technical vision and engineering function of an organisation — responsible for technology strategy and team leadership.' },
  { id:102,cat:11, type:'Tech',       name:'VP of Engineering',                tier:'Executive',  rate:'$1,500–3,500/day',     orb:4, sum:'Manages the engineering organisation — team structure, delivery, hiring, and technical standards across product and platform.' },
  { id:103,cat:11, type:'Tech',       name:'Software Engineer',                tier:'Mid',        rate:'$600–1,500/day',       orb:4, sum:'Designs, builds, and maintains software systems — from frontend interfaces to backend APIs and infrastructure.' },
  { id:104,cat:11, type:'Tech',       name:'Senior Software Engineer',         tier:'Senior',     rate:'$800–2,000/day',       orb:4, sum:'A more experienced engineer who leads technical design decisions and mentors junior team members.' },
  { id:105,cat:11, type:'Tech',       name:'Product Manager',                  tier:'Mid-Senior', rate:'$700–1,600/day',       orb:4, sum:'Defines and leads product strategy — translating user needs and business goals into a clear, prioritised product roadmap.' },
  { id:106,cat:11, type:'Tech',       name:'Product Designer',                 tier:'Mid-Senior', rate:'$600–1,400/day',       orb:4, sum:'Designs digital product experiences — research, UX systems, interface design, and prototyping for software products.' },
  { id:107,cat:11, type:'Tech',       name:'Data Scientist',                   tier:'Mid-Senior', rate:'$700–1,600/day',       orb:4, sum:'Analyses and models complex data to generate insight — supporting product decisions, campaigns, and business strategy.' },
  { id:108,cat:11, type:'Tech',       name:'AI/ML Engineer',                   tier:'Senior',     rate:'$900–2,200/day',       orb:4, sum:'Builds machine learning models and AI systems — from data pipeline to model training, evaluation, and deployment.' },
  { id:109,cat:11, type:'Tech',       name:'DevOps Engineer',                  tier:'Mid-Senior', rate:'$700–1,600/day',       orb:4, sum:'Manages infrastructure, deployment pipelines, and operational reliability of software systems.' },
  { id:110,cat:11, type:'Tech',       name:'QA Engineer',                      tier:'Mid',        rate:'$450–1,000/day',       orb:4, sum:'Tests software products for quality and reliability — writing test cases, identifying bugs, and maintaining quality standards.' },
  // Cat 12 — Business & Leadership
  { id:111,cat:12, type:'Business',   name:'Chief Executive Officer (CEO)',    tier:'C-Suite',    rate:'$2,000–6,000/day',     orb:5, sum:'Leads the overall direction, strategy, and performance of an organisation — responsible for vision, culture, and outcomes.' },
  { id:112,cat:12, type:'Business',   name:'Chief Operating Officer (COO)',    tier:'C-Suite',    rate:'$1,800–4,500/day',     orb:5, sum:'Manages the operational running of a business — processes, people, and performance across all functions.' },
  { id:113,cat:12, type:'Business',   name:'Chief Financial Officer (CFO)',    tier:'C-Suite',    rate:'$1,800–4,500/day',     orb:5, sum:'Leads financial strategy, planning, and reporting — responsible for the financial health and integrity of the organisation.' },
  { id:114,cat:12, type:'Business',   name:'Venture Partner',                  tier:'Investor',   rate:'Equity / Deal fee',    orb:5, sum:'Partners with a VC firm to source deals, support portfolio companies, and provide sector expertise.' },
  { id:115,cat:12, type:'Business',   name:'Angel Investor',                   tier:'Investor',   rate:'Equity / Deal fee',    orb:5, sum:'Invests personal capital in early-stage companies — providing capital, networks, and strategic guidance.' },
  { id:116,cat:12, type:'Business',   name:'Founder',                          tier:'Founder',    rate:'Equity / Variable',    orb:5, sum:'Creates and leads a new company — responsible for vision, capital, product, and team from zero to scale.' },
  { id:117,cat:12, type:'Business',   name:'Business Development Manager',     tier:'Mid-Senior', rate:'$600–1,400/day',       orb:5, sum:'Identifies and develops new business opportunities — partnerships, clients, markets, and revenue streams.' },
  { id:118,cat:12, type:'Business',   name:'Operations Manager',               tier:'Mid-Senior', rate:'$500–1,200/day',       orb:5, sum:'Manages day-to-day business operations — processes, systems, vendors, and team coordination.' },
  { id:119,cat:12, type:'Business',   name:'Legal Counsel',                    tier:'Senior',     rate:'$800–2,500/day',       orb:5, sum:'Provides legal advice and contract management — intellectual property, employment, commercial agreements, and risk.' },
  { id:120,cat:12, type:'Business',   name:'Finance Manager',                  tier:'Mid-Senior', rate:'$600–1,400/day',       orb:5, sum:'Manages financial reporting, budgeting, and compliance — supports the CFO or founder in financial decision-making.' },
  // Cat 13 — Fine Art & Cultural Practice
  { id:121,cat:13, type:'Visual',     name:'Visual Artist',                    tier:'Independent / Commissioned', rate:'Project-based', orb:0, sum:'Creates original fine art works across media — painting, sculpture, installation, or mixed media — for exhibition or commission.' },
  { id:122,cat:13, type:'Visual',     name:'Gallery Curator',                  tier:'Senior',     rate:'$600–1,500/day',       orb:0, sum:'Develops and manages art exhibitions — selecting works, working with artists, and shaping the cultural narrative of a show.' },
  { id:123,cat:13, type:'Visual',     name:'Art Fair Director',                tier:'Senior',     rate:'$800–2,000/day',       orb:0, sum:'Leads the curation, logistics, and commercial operations of an art fair — gallery relations, programming, and audience.' },
  { id:124,cat:13, type:'Visual',     name:'Arts Administrator',               tier:'Mid',        rate:'$350–800/day',         orb:0, sum:'Manages the operational and administrative functions of arts organisations — grants, budgets, communications, and programming.' },
  { id:125,cat:13, type:'Visual',     name:'Cultural Consultant',              tier:'Senior',     rate:'$700–1,600/day',       orb:0, sum:'Provides cultural strategy advice to brands, institutions, and governments — on representation, programming, and community.' },
  { id:126,cat:13, type:'Visual',     name:'Photographer (Fine Art)',          tier:'Independent / Commissioned', rate:'Project-based', orb:0, sum:'Creates photography as fine art — exhibited in galleries, collected by institutions, and produced for cultural publications.' },
  { id:127,cat:13, type:'Visual',     name:'Sculptor',                         tier:'Independent / Commissioned', rate:'Project-based', orb:0, sum:'Creates three-dimensional works in a variety of materials — for gallery, public, or commercial contexts.' },
  { id:128,cat:13, type:'Writing',    name:'Arts Writer / Critic',             tier:'Mid-Senior', rate:'$300–800/day',         orb:0, sum:'Writes critically about art, culture, and creative practice for publications, catalogues, and digital platforms.' },
  { id:129,cat:13, type:'Visual',     name:'Museum Educator',                  tier:'Mid',        rate:'$300–700/day',         orb:0, sum:'Develops and delivers educational programmes for museum and gallery visitors — from schools to adult learning.' },
  { id:130,cat:13, type:'Visual',     name:'Public Art Coordinator',           tier:'Mid-Senior', rate:'$450–1,000/day',       orb:0, sum:'Manages public art commissions and installations — artist liaison, permissions, fabrication logistics, and community engagement.' },
];

const TIER_ORDER = ['C-Suite','Executive','Director / Executive','Senior Leadership','Head of Department','Director / Senior','Senior / Advisory','Senior / Director','Senior / Specialist','Senior','Mid–Senior','Mid-Senior','Mid','Junior-Mid','Junior','Entry','Specialist','Senior Specialist','Independent / Commissioned','Independent / Represented','Private / Institutional','Enterprise','Technology','Investor','Senior Investor','Investment','Founder','Advisory','C-Suite / Advisory','Professional Services'];

function SkillsLibrary({ onBack, onSkillClick }) {
  const [activeCat, setActiveCat] = useState(0);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');

  const types = ['All', ...Array.from(new Set(LIBRARY.map(a => a.type))).sort()];

  const filtered = LIBRARY.filter(a => {
    if (activeCat !== 0 && a.cat !== activeCat) return false;
    if (activeType !== 'All' && a.type !== activeType) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.sum.toLowerCase().includes(q) || ALL_CATEGORIES.find(c => c.id === a.cat)?.label.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.pageBg }}>
      {/* Header */}
      <div style={{ padding: '18px 28px', borderBottom: `1px solid ${C.border}`, background: C.cardBg, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ink3, fontSize: 18, lineHeight: 1, padding: '0 4px 0 0', flexShrink: 0 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 16, color: C.ink }}>Skills Library</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.ink4 }}>{filtered.length} of {LIBRARY.length} archetypes · 13 categories</div>
        </div>
        {/* Search */}
        <div style={{ position: 'relative', width: 240 }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={C.ink4} strokeWidth="1.35" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10 10l3.5 3.5"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills…" style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px 8px 30px', fontFamily: BODY, fontSize: 13, color: C.ink, background: C.pageBg, outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Category sidebar */}
        <div style={{ width: 200, background: C.sideBg, borderRight: `1px solid ${C.border}`, overflowY: 'auto', flexShrink: 0, padding: '12px 8px' }}>
          {ALL_CATEGORIES.map(cat => {
            const count = cat.id === 0 ? LIBRARY.length : LIBRARY.filter(a => a.cat === cat.id).length;
            const on = activeCat === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, width: '100%', padding: '7px 10px', borderRadius: 7, border: 'none', textAlign: 'left', background: on ? C.tealLight : 'transparent', cursor: 'pointer', marginBottom: 2, transition: 'all .1s' }}>
                <span style={{ fontFamily: BODY, fontSize: 12.5, color: on ? C.teal : C.ink3, fontWeight: on ? 600 : 400, lineHeight: 1.3, flex: 1 }}>{cat.label}</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: on ? C.teal : C.ink4, flexShrink: 0 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Main area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Type filter chips */}
          <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0, background: C.cardBg }}>
            {types.map(t => {
              const on = activeType === t;
              return <button key={t} onClick={() => setActiveType(t)} style={{ fontFamily: BODY, fontSize: 12, padding: '5px 12px', borderRadius: 20, border: `1px solid ${on ? C.teal : C.border}`, background: on ? C.tealLight : C.pageBg, color: on ? C.teal : C.ink3, cursor: 'pointer', fontWeight: on ? 600 : 400, transition: 'all .12s' }}>{t}</button>;
            })}
          </div>

          {/* Grid */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: BODY, fontSize: 14, color: C.ink4 }}>No skills match that search.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                {filtered.map(a => {
                  const catLabel = ALL_CATEGORIES.find(c => c.id === a.cat)?.label || '';
                  return (
                    <div key={a.id} onClick={() => onSkillClick({ id: a.id, name: a.name, orb: a.orb, desc: a.sum, rate: a.rate, works: catLabel })}
                      style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all .13s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.boxShadow = '0 3px 14px rgba(0,0,0,.07)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <GradOrb idx={a.orb} size={36} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.ink, lineHeight: 1.3, marginBottom: 2 }}>{a.name}</div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <span style={{ fontFamily: BODY, fontSize: 10, background: C.tealSoft, color: C.teal, padding: '1px 6px', borderRadius: 8, fontWeight: 600 }}>{a.type}</span>
                            <span style={{ fontFamily: BODY, fontSize: 10, background: C.pageBg, color: C.ink4, padding: '1px 6px', borderRadius: 8 }}>{a.tier}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink3, lineHeight: 1.5, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.sum}</div>
                      <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.ink4 }}>{a.rate}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LANDING ────────────────────────────────────────────────── */
function Landing({ onLogin, onChat, onCreate, onSkill, greeting }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 60); }, []);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.pageBg, overflow: 'auto', position: 'relative', opacity: entered ? 1 : 0, transition: 'opacity .4s' }}>
      <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 10 }}>
        <button onClick={onLogin} style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 600, background: C.ink, color: '#fff', border: 'none', borderRadius: 24, padding: '9px 22px', cursor: 'pointer' }}>Log in</button>
      </div>
      <div style={{ textAlign: 'center', padding: '56px 24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Pearl size={100} /></div>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 48, color: C.ink, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 8 }}>{greeting}</div>
        <div style={{ fontFamily: BODY, fontSize: 14, color: C.ink3 }}>Creative Director | Boston, MA</div>
      </div>
      <div style={{ maxWidth: 820, margin: '0 auto 40px', padding: '0 28px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ background: C.cardBg, borderRadius: 18, padding: '20px 22px', border: `1px solid ${C.border}`, boxShadow: '0 2px 20px rgba(0,0,0,.06)' }}>
          <div onClick={onChat} style={{ fontFamily: BODY, fontSize: 16, color: C.ink4, marginBottom: 18, cursor: 'text' }}>What's on your heart?</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', border: `1px solid ${C.borderMd}`, borderRadius: 24, background: C.cardBg, fontFamily: BODY, fontSize: 13.5, color: C.ink2, cursor: 'pointer' }}><ClipIc s={14} c={C.ink3} /> Attach</button>
            <button onClick={onCreate} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', background: C.ink, border: 'none', borderRadius: 24, fontFamily: BODY, fontSize: 13.5, fontWeight: 600, color: '#fff', cursor: 'pointer' }}><SparkIc s={14} c="#fff" /> Create</button>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 28px 48px', width: '100%', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 16, color: C.ink, marginBottom: 14 }}>Explore Workflows</div>
          <div style={{ background: C.cardBg, borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}` }}>
            {WORKFLOWS.map((w, i) => (
              <div key={w.id} onClick={onChat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderBottom: i < WORKFLOWS.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', transition: 'background .1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8F7F3'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <WfIc s={14} c={C.ink4} />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{w.label}</div><div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.sub}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 16, color: C.ink, marginBottom: 14 }}>Explore Skills</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SKILLS.slice(0, 4).map(s => (
              <div key={s.id} onClick={() => onSkill(s)} style={{ background: C.cardBg, borderRadius: 14, padding: '14px', border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'all .13s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.boxShadow = '0 3px 14px rgba(0,0,0,.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}>
                <GradOrb idx={s.orb} size={48} />
                <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13.5, color: C.ink, margin: '10px 0 4px' }}>{s.name}</div>
                <div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink3, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SKILL → WORKFLOW MAP ───────────────────────────────────── */
const SKILL_WORKFLOWS = {
  'Creative Director': [
    { icon: '✦', label: 'Write a creative brief',        sub: 'Generate a structured brief from your concept and client context.' },
    { icon: '◈', label: 'Build a mood board',            sub: 'Pull visual references and define the aesthetic language of the project.' },
    { icon: '◇', label: 'Assemble your team',            sub: 'Identify the roles this project needs and match from Nia or your roster.' },
    { icon: '▣', label: 'Define project deliverables',   sub: 'List outputs, formats, and deadlines before production begins.' },
  ],
  'Stylist': [
    { icon: '◎', label: 'Build a styling deck',          sub: 'Compile visual references, colour palette, and material direction.' },
    { icon: '✦', label: 'Source looks for a shoot',      sub: 'Generate a pull list by category, brand tier, and aesthetic.' },
    { icon: '◇', label: 'Create a wardrobe run-of-show', sub: 'Map each look to a scene, talent, and time slot on the schedule.' },
    { icon: '▣', label: 'Write a styling brief',         sub: 'Translate the creative direction into a visual language for the team.' },
  ],
  '1st AD': [
    { icon: '◈', label: 'Build a shoot schedule',        sub: 'Generate a scene-by-scene schedule from crew size and brief.' },
    { icon: '◇', label: 'Create a call sheet',           sub: 'Draft a call sheet with crew, talent, locations, and timings.' },
    { icon: '✦', label: 'Run a pre-production check',    sub: 'Generate a production checklist by project type and scale.' },
    { icon: '▣', label: 'Write department briefs',       sub: 'Summarise the shoot plan for each crew department.' },
  ],
  'PR Specialist': [
    { icon: '✦', label: 'Write a press release',         sub: 'Draft from your brief, client name, and key messages.' },
    { icon: '◎', label: 'Build a media list',            sub: 'Generate a targeted press list by vertical, tier, and geography.' },
    { icon: '◇', label: 'Create a pitch email',          sub: 'Write a concise, tailored pitch for a specific publication.' },
    { icon: '▣', label: 'Plan a campaign timeline',      sub: 'Map press activity from announcement to coverage.' },
  ],
  'Art Director': [
    { icon: '✦', label: 'Define the visual language',    sub: 'Articulate the typographic, colour, and compositional system.' },
    { icon: '◈', label: 'Create an art direction deck',  sub: 'Build a reference deck that communicates look and feel to the team.' },
    { icon: '◇', label: 'Write set design notes',        sub: 'Translate the concept into prop, dressing, and environment direction.' },
    { icon: '▣', label: 'Brief a photographer',          sub: 'Write a brief from the creative direction and shot list.' },
  ],
  'Music Supervisor': [
    { icon: '◎', label: 'Build a music brief',           sub: 'Define tempo, genre, era, and emotional direction for the project.' },
    { icon: '✦', label: 'Create a sync shortlist',       sub: 'Generate candidates by mood, energy, and clearance complexity.' },
    { icon: '◇', label: 'Draft a licensing request',     sub: 'Write a clear licensing request to a label or publisher.' },
    { icon: '▣', label: 'Write a sound direction doc',   sub: 'Summarise the sonic identity and music strategy.' },
  ],
  'Cinematographer': [
    { icon: '✦', label: 'Write a cinematography brief',  sub: 'Define camera language, lenses, movement, and lighting philosophy.' },
    { icon: '◈', label: 'Build a lighting plan',         sub: 'Generate a scene-by-scene approach from the creative brief.' },
    { icon: '◇', label: 'Create a shot list',            sub: 'Draft a structured shot list by scene, setup, and framing.' },
    { icon: '▣', label: 'Source camera and grip kit',    sub: 'Specify equipment requirements for the shoot.' },
  ],
  'Producer': [
    { icon: '✦', label: 'Build a production budget',     sub: 'Generate a line-item budget from project type, crew, and schedule.' },
    { icon: '◈', label: 'Write a scope of work',         sub: 'Define deliverables, timelines, and responsibilities.' },
    { icon: '◇', label: 'Create a risk register',        sub: 'Identify production risks and draft mitigation plans.' },
    { icon: '▣', label: 'Draft a vendor brief',          sub: 'Write a brief for a supplier, location, or post-production house.' },
  ],
};

/* ─── WORKFLOW DRAWER ────────────────────────────────────────── */
function WorkflowDrawer({ skill, onLaunch, onViewSkill, onClose }) {
  const flows = SKILL_WORKFLOWS[skill.name] || [];
  const [hov, setHov] = useState(null);
  return (
    <div style={{ marginTop: 2, background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', animation: 'slideDown .18s ease-out' }}>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <GradOrb idx={skill.orb} size={28} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.ink }}>Suggested workflows for a {skill.name}</div>
          <div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink4 }}>Select one to begin, or open the full skill profile.</div>
        </div>
        <button onClick={onViewSkill} style={{ fontFamily: BODY, fontSize: 11.5, color: C.teal, background: C.tealLight, border: 'none', borderRadius: 8, padding: '5px 11px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 500 }}>View skill →</button>
        <button onClick={onClose} style={{ background: C.pageBg, border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink3, flexShrink: 0 }}><CloseIc s={11} /></button>
      </div>
      <div>
        {flows.map((f, i) => (
          <div key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: i < flows.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', background: hov === i ? C.pageBg : 'transparent', transition: 'background .1s' }}
            onClick={() => onLaunch(skill, f)}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: C.pageBg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{f.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 13.5, color: C.ink, marginBottom: 2 }}>{f.label}</div>
              <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4, lineHeight: 1.45 }}>{f.sub}</div>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 12, color: hov === i ? C.teal : C.ink4, transition: 'color .1s', flexShrink: 0 }}>Begin →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────────── */
function Dashboard({ onChat, onCreate, onSkill, onExploreSkills, onWorkflowLaunch, greeting }) {
  const [activeSkill, setActiveSkill] = useState(null);

  const handleSkillClick = skill => {
    setActiveSkill(prev => prev?.id === skill.id ? null : skill);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '36px 44px 24px' }}>

        {/* Greeting */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Pearl size={72} /></div>
          <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 38, color: C.ink, letterSpacing: '-1.5px', lineHeight: 1.05 }}>{greeting}</div>
        </div>

        {/* New project card */}
        <NewProjectCard onCreate={onCreate} />

        {/* Skills section */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 16, color: C.ink }}>Skills</div>
            <button onClick={onExploreSkills} style={{ fontFamily: BODY, fontSize: 12.5, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Explore all skills →</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
            {SKILLS.slice(0, 4).map(s => (
              <SkillCard key={s.id} skill={s} onClick={handleSkillClick} active={activeSkill?.id === s.id} />
            ))}
          </div>

          {/* Workflow drawer — expands below grid on skill selection */}
          {activeSkill && (
            <WorkflowDrawer
              skill={activeSkill}
              onLaunch={(skill, flow) => { onWorkflowLaunch(skill, flow); setActiveSkill(null); }}
              onViewSkill={() => { onSkill(activeSkill); setActiveSkill(null); }}
              onClose={() => setActiveSkill(null)}
            />
          )}

          <div style={{ marginTop: 10, textAlign: 'right' }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.ink4 }}>282 archetypes across 13 categories</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: C.bottomBg, borderRadius: '14px 14px 0 0', flexShrink: 0 }}>
        <div style={{ padding: '18px 22px 22px' }}>
          <div onClick={onChat} style={{ fontFamily: BODY, fontSize: 15, color: C.ink3, marginBottom: 16, cursor: 'text' }}>What's on your heart?</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', border: `1px solid ${C.borderMd}`, borderRadius: 24, background: C.cardBg, fontFamily: BODY, fontSize: 13.5, color: C.ink2, cursor: 'pointer' }}><ClipIc s={14} c={C.ink3} /> Attach</button>
            <button onClick={onCreate} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', background: C.ink, border: 'none', borderRadius: 24, fontFamily: BODY, fontSize: 13.5, fontWeight: 600, color: '#fff', cursor: 'pointer' }}><SparkIc s={14} c="#fff" /> Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TEAM MODULE DATA ───────────────────────────────────────── */
const TEAM_ROSTER = [
  {
    id: 201, name: 'Khianna Lav',    initials: 'KL', bg: '#5B7FA6',
    role: 'Production Assistant', skill: 'Production Operations',
    tier: 'Junior', rate: '$400–600/day', location: 'Boston, MA',
    available: true, status: 'active',
    email: 'khianna@function.studio', phone: '+1 617 555 0120',
    bio: 'On-set logistics, scheduling, and equipment management across event and brand productions.',
    tags: ['On-set', 'Scheduling', 'Equipment'],
    projects: ['Sbur Labs April Coverage', 'Wix Foundry Event'],
    clients: ['Sbur', 'Wix Ventures'],
    workflows: ['Call sheet prep', 'Equipment manifests', 'Day-of coordination'],
    capacity: 80, joined: 'Jan 2024',
  },
  {
    id: 202, name: 'Will Eifler',    initials: 'WE', bg: '#5A8C6A',
    role: 'Video Producer', skill: 'Production & Direction',
    tier: 'Mid-Senior', rate: '$1,200–2,000/day', location: 'New York, NY',
    available: true, status: 'active',
    email: 'will@function.studio', phone: '+1 212 555 0183',
    bio: 'End-to-end video production for brand campaigns, editorial, and content series.',
    tags: ['Brand', 'Editorial', 'Content'],
    projects: ['DHCB Pre-production Brief', 'Sbur Labs April Coverage'],
    clients: ['DHCB', 'Sbur', 'Daily Reposition'],
    workflows: ['Budget management', 'Crew coordination', 'Post delivery'],
    capacity: 60, joined: 'Mar 2023',
  },
  {
    id: 203, name: 'Latalia Howard', initials: 'LH', bg: '#8C5A6A',
    role: 'PR Lead', skill: 'Enterprise & Brand',
    tier: 'Senior', rate: '$600–1,000/day', location: 'Boston, MA',
    available: false, status: 'on-project',
    email: 'latalia@talia-mgmt.com', phone: '+1 617 555 0241',
    bio: 'Press strategy, media relations, and amplification for music, fashion, and cultural projects.',
    tags: ['Press', 'Media', 'Culture'],
    projects: ['Daily Reposition Q2 Campaign'],
    clients: ['Daily Reposition', 'Afrobeats Weekly'],
    workflows: ['Press release drafts', 'Media list build', 'Campaign timelines'],
    capacity: 100, joined: 'Jun 2023',
  },
  {
    id: 204, name: 'Labib Afia',     initials: 'LA', bg: '#6A5A8C',
    role: 'Technology Lead', skill: 'Technology Companies',
    tier: 'Senior', rate: '$800–1,400/day', location: 'Boston, MA',
    available: true, status: 'active',
    email: 'labib@dhcb.co', phone: '+1 617 555 0308',
    bio: 'Technical infrastructure, AI integration, and product development for creative businesses.',
    tags: ['AI', 'Infrastructure', 'Product'],
    projects: ['Nia Technologies Build', 'DHCB Technical Infrastructure'],
    clients: ['DHCB', 'Nia Technologies'],
    workflows: ['Tech scoping', 'Integration briefs', 'System architecture'],
    capacity: 70, joined: 'Sep 2023',
  },
  {
    id: 205, name: 'Tony Zhang',     initials: 'TZ', bg: '#8C7A5A',
    role: 'Brand Strategist', skill: 'Enterprise & Brand',
    tier: 'Mid-Senior', rate: '$700–1,200/day', location: 'New York, NY',
    available: true, status: 'active',
    email: 'tony@sbur.co', phone: '+1 646 555 0174',
    bio: 'Brand strategy, community-building, and partnership development for founder-led companies.',
    tags: ['Brand', 'Community', 'Partnerships'],
    projects: ['Sbur Labs April Coverage', 'Boston Tech Week'],
    clients: ['Sbur', 'Wix Ventures', 'Foundry'],
    workflows: ['Brand audits', 'Partnership decks', 'Event strategy'],
    capacity: 50, joined: 'Nov 2023',
  },
];

const TEAM_PROJECTS_MOCK = [
  { id: 'p1', name: 'Sbur Labs April Coverage',    type: 'event',    client: 'Sbur',          status: 'active',    deadline: '29 May 2026', members: [201, 202, 205] },
  { id: 'p2', name: 'DHCB Pre-production Brief',   type: 'brief',    client: 'DHCB',          status: 'active',    deadline: '20 Apr 2026', members: [202, 204] },
  { id: 'p3', name: 'Daily Reposition Q2 Campaign',type: 'campaign', client: 'Daily Reposition', status: 'active',  deadline: '1 Jun 2026',  members: [203] },
  { id: 'p4', name: 'Nia Technologies Build',       type: 'commercial', client: 'Nia Technologies', status: 'active', deadline: 'Ongoing',  members: [204] },
  { id: 'p5', name: 'Boston Tech Week',              type: 'event',    client: 'Sbur / Foundry', status: 'upcoming', deadline: '29 May 2026', members: [205] },
];

const AVAIL_COLOR = a => a ? C.green : C.clay;
const AVAIL_BG    = a => a ? C.greenLight : C.clayLight;
const STATUS_LABEL = s => s === 'active' ? 'Available' : s === 'on-project' ? 'On project' : 'Away';

/* ─── CAPACITY BAR ───────────────────────────────────────────── */
function CapacityBar({ pct }) {
  const color = pct >= 90 ? C.clay : pct >= 60 ? '#B8860B' : C.teal;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.border, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: color, transition: 'width .3s' }} />
      </div>
      <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.ink4, minWidth: 28 }}>{pct}%</span>
    </div>
  );
}

/* ─── MEMBER DETAIL PANEL ────────────────────────────────────── */
function MemberDetail({ member, allProjects, onClose, onAddToProject }) {
  const [tab, setTab] = useState('overview');
  const memberProjects = allProjects.filter(p => p.members.includes(member.id));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(15,14,12,.45)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ width: 480, height: '100vh', background: C.cardBg, boxShadow: '-8px 0 32px rgba(0,0,0,.14)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '24px 24px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <InitialsAvatar initials={member.initials} bg={member.bg} size={52} />
              <div>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 2 }}>{member.name}</div>
                <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink3 }}>{member.role}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: AVAIL_COLOR(member.available) }} />
                  <span style={{ fontFamily: BODY, fontSize: 12, color: AVAIL_COLOR(member.available) }}>{STATUS_LABEL(member.status)}</span>
                  <span style={{ fontFamily: BODY, fontSize: 12, color: C.ink4 }}>·</span>
                  <span style={{ fontFamily: BODY, fontSize: 12, color: C.ink4 }}>{member.location}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: C.pageBg, border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink3 }}>
              <CloseIc />
            </button>
          </div>

          {/* Key stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
            {[
              { label: 'Rate', val: member.rate },
              { label: 'Skill tier', val: member.tier },
              { label: 'Joined', val: member.joined },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: C.pageBg, borderRadius: 9, padding: '9px 11px' }}>
                <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: C.ink4, marginBottom: 3 }}>{label}</div>
                <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink2, fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Capacity */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: C.ink4, marginBottom: 6 }}>Capacity</div>
            <CapacityBar pct={member.capacity} />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginTop: 18 }}>
            {['overview', 'projects', 'workflows'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ fontFamily: BODY, fontSize: 13, fontWeight: tab === t ? 600 : 400, color: tab === t ? C.teal : C.ink3, background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? C.teal : 'transparent'}`, padding: '0 0 10px', marginRight: 20, cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Tab body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px 28px' }}>
          {tab === 'overview' && (
            <div>
              <div style={{ fontFamily: BODY, fontSize: 13.5, color: C.ink2, lineHeight: 1.7, marginBottom: 20 }}>{member.bio}</div>
              <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: C.ink4, marginBottom: 8 }}>Skill tags</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {member.tags.map(t => <span key={t} style={{ fontFamily: BODY, fontSize: 12, background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 9px', color: C.ink2 }}>{t}</span>)}
              </div>
              <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: C.ink4, marginBottom: 8 }}>Contact</div>
              <div style={{ background: C.pageBg, borderRadius: 10, padding: '12px 14px' }}>
                {[['Email', member.email], ['Phone', member.phone]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: l === 'Email' ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink4 }}>{l}</span>
                    <span style={{ fontFamily: BODY, fontSize: 12.5, color: C.teal }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: C.ink4, marginBottom: 8 }}>Regular clients</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {member.clients.map(c => <span key={c} style={{ fontFamily: BODY, fontSize: 12, background: C.tealSoft, color: C.teal, borderRadius: 20, padding: '3px 10px', fontWeight: 500 }}>{c}</span>)}
                </div>
              </div>
            </div>
          )}

          {tab === 'projects' && (
            <div>
              {memberProjects.length === 0
                ? <div style={{ fontFamily: BODY, fontSize: 13.5, color: C.ink4, textAlign: 'center', paddingTop: 32 }}>Not assigned to any active projects.</div>
                : memberProjects.map(p => {
                  const typeLabel = PROJECT_TYPES.find(t => t.id === p.type)?.label || p.type;
                  return (
                    <div key={p.id} style={{ background: C.pageBg, borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13.5, color: C.ink }}>{p.name}</div>
                        <span style={{ fontFamily: BODY, fontSize: 10, background: p.status === 'active' ? C.tealSoft : C.clayLight, color: p.status === 'active' ? C.teal : C.clay, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{p.status}</span>
                      </div>
                      <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4 }}>{p.client} · {typeLabel} · Due {p.deadline}</div>
                    </div>
                  );
                })
              }
            </div>
          )}

          {tab === 'workflows' && (
            <div>
              <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4, marginBottom: 14 }}>Responsibilities and workflows {member.name.split(' ')[0]} handles.</div>
              {member.workflows.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: C.pageBg, borderRadius: 9, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.teal, flexShrink: 0 }} />
                  <span style={{ fontFamily: BODY, fontSize: 13.5, color: C.ink2 }}>{w}</span>
                </div>
              ))}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: C.ink4, marginBottom: 10 }}>Assign to project</div>
                {TEAM_PROJECTS_MOCK.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: C.pageBg, borderRadius: 9, marginBottom: 7 }}>
                    <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink2 }}>{p.name}</div>
                    {p.members.includes(member.id)
                      ? <span style={{ fontFamily: BODY, fontSize: 11, color: C.teal, fontWeight: 600 }}>Assigned</span>
                      : <button onClick={() => onAddToProject(member, p)} style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, background: C.ink, color: '#fff', border: 'none', borderRadius: 5, padding: '3px 10px', cursor: 'pointer' }}>Add</button>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: '14px 24px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, flexShrink: 0 }}>
          <button style={{ flex: 1, padding: '10px', background: C.ink, border: 'none', borderRadius: 10, color: '#fff', fontFamily: BODY, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Message {member.name.split(' ')[0]}</button>
          <button style={{ padding: '10px 16px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 10, color: C.ink2, fontFamily: BODY, fontSize: 13, cursor: 'pointer' }}>Edit profile</button>
        </div>
      </div>
    </div>
  );
}

/* ─── ADD MEMBER MODAL ───────────────────────────────────────── */
function AddMemberModal({ onClose, onAdd }) {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [step, setStep] = useState('skill'); // skill | details

  const CAT_SKILLS = LIBRARY.slice(0, 40).filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase())
  );

  const [form, setForm] = useState({ name: '', email: '', location: '', rate: '' });
  const upd = p => setForm(f => ({ ...f, ...p }));

  const handleAdd = () => {
    if (!form.name.trim() || !selectedSkill) return;
    const newMember = {
      id: Date.now(),
      name: form.name,
      initials: form.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase(),
      bg: ['#5B7FA6','#5A8C6A','#8C5A6A','#6A5A8C','#8C7A5A','#7A6A5A'][Math.floor(Math.random()*6)],
      role: selectedSkill.name,
      skill: selectedSkill.name,
      tier: selectedSkill.tier,
      rate: form.rate || selectedSkill.rate,
      location: form.location || 'Location TBD',
      available: true, status: 'active',
      email: form.email || '',
      phone: '',
      bio: selectedSkill.sum,
      tags: selectedSkill.type ? [selectedSkill.type] : [],
      projects: [], clients: [],
      workflows: SKILL_WORKFLOWS[selectedSkill.name]?.map(w => w.label) || [],
      capacity: 0, joined: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
    };
    onAdd(newMember);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(15,14,12,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: C.cardBg, borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '88vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 17, color: C.ink }}>Add team member</div>
            <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink4 }}>{step === 'skill' ? 'Choose a skill from the library' : 'Enter their details'}</div>
          </div>
          <button onClick={onClose} style={{ background: C.pageBg, border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink3 }}><CloseIc /></button>
        </div>

        {step === 'skill' && (
          <div style={{ padding: '0 24px 24px' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills…" style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 9, padding: '9px 13px', fontFamily: BODY, fontSize: 13.5, color: C.ink, background: C.pageBg, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {CAT_SKILLS.map(s => (
                <div key={s.id} onClick={() => setSelectedSkill(s)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 9, marginBottom: 5, cursor: 'pointer', background: selectedSkill?.id === s.id ? C.tealLight : 'transparent', border: `1px solid ${selectedSkill?.id === s.id ? C.teal + '40' : C.border}`, transition: 'all .12s' }}>
                  <GradOrb idx={s.orb} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: selectedSkill?.id === s.id ? C.teal : C.ink }}>{s.name}</div>
                    <div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4 }}>{s.tier} · {s.rate}</div>
                  </div>
                  {selectedSkill?.id === s.id && <div style={{ color: C.teal, fontSize: 16 }}>✓</div>}
                </div>
              ))}
            </div>
            <button onClick={() => selectedSkill && setStep('details')} disabled={!selectedSkill} style={{ width: '100%', padding: '11px', background: selectedSkill ? C.ink : C.border, border: 'none', borderRadius: 10, color: selectedSkill ? '#fff' : C.ink4, fontFamily: BODY, fontSize: 14, fontWeight: 600, cursor: selectedSkill ? 'pointer' : 'default', marginTop: 14 }}>
              Continue →
            </button>
          </div>
        )}

        {step === 'details' && selectedSkill && (
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: C.tealLight, borderRadius: 9, marginBottom: 18 }}>
              <GradOrb idx={selectedSkill.orb} size={28} />
              <div>
                <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.teal }}>{selectedSkill.name}</div>
                <div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4 }}>{selectedSkill.tier} · {selectedSkill.rate}</div>
              </div>
              <button onClick={() => setStep('skill')} style={{ marginLeft: 'auto', fontFamily: BODY, fontSize: 11, color: C.ink3, background: 'none', border: 'none', cursor: 'pointer' }}>Change</button>
            </div>
            {[['Full name', 'name', 'e.g. Jordan Lee', true], ['Email', 'email', 'jordan@studio.co', false], ['Location', 'location', 'e.g. Cape Town, SA', false], ['Rate (optional override)', 'rate', selectedSkill.rate, false]].map(([label, key, ph, required]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: C.ink4, marginBottom: 6 }}>{label}{required && ' *'}</div>
                <input value={form[key]} onChange={e => upd({ [key]: e.target.value })} placeholder={ph} style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 9, padding: '10px 13px', fontFamily: BODY, fontSize: 14, color: C.ink, background: C.pageBg, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <button onClick={handleAdd} disabled={!form.name.trim()} style={{ width: '100%', padding: '11px', background: form.name.trim() ? C.teal : C.border, border: 'none', borderRadius: 10, color: form.name.trim() ? '#fff' : C.ink4, fontFamily: BODY, fontSize: 14, fontWeight: 600, cursor: form.name.trim() ? 'pointer' : 'default', marginTop: 6 }}>
              Add to team
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── TEAM VIEW (main page) ──────────────────────────────────── */
function TeamView({ onBack }) {
  const [roster, setRoster] = useState(TEAM_ROSTER);
  const [projects, setProjects] = useState(TEAM_PROJECTS_MOCK);
  const [tab, setTab] = useState('roster'); // roster | projects | capacity
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [search, setSearch] = useState('');
  const [filterAvail, setFilterAvail] = useState('all'); // all | available | busy
  const [filterSkill, setFilterSkill] = useState('All');

  const skillOptions = ['All', ...Array.from(new Set(roster.map(m => m.skill)))];

  const filtered = roster.filter(m => {
    if (filterAvail === 'available' && !m.available) return false;
    if (filterAvail === 'busy' && m.available) return false;
    if (filterSkill !== 'All' && m.skill !== filterSkill) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.role.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAddMember = m => {
    setRoster(r => [...r, m]);
    setShowAddMember(false);
  };

  const handleAddToProject = (member, project) => {
    setProjects(ps => ps.map(p => p.id === project.id ? { ...p, members: [...p.members, member.id] } : p));
  };

  const availCount    = roster.filter(m => m.available).length;
  const onProjectCount = roster.filter(m => m.status === 'on-project').length;
  const activeProjects = projects.filter(p => p.status === 'active').length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.pageBg }}>

      {/* ── Header ── */}
      <div style={{ padding: '22px 36px 0', background: C.cardBg, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 20, color: C.ink, marginBottom: 2 }}>Team</div>
            <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink4 }}>Function Creative Company · Boston & New York</div>
          </div>
          <button onClick={() => setShowAddMember(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: C.ink, border: 'none', borderRadius: 10, fontFamily: BODY, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2v8M2 6h8"/></svg>
            Add member
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
          {[
            { label: 'Total members', val: roster.length },
            { label: 'Available now', val: availCount, color: C.green },
            { label: 'On project',    val: onProjectCount, color: C.clay },
            { label: 'Active projects', val: activeProjects, color: C.teal },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div style={{ fontFamily: BODY, fontSize: 22, fontWeight: 700, color: color || C.ink, lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink4, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {[['roster','Roster'],['projects','Projects'],['capacity','Capacity']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: tab === id ? 600 : 400, color: tab === id ? C.teal : C.ink3, background: 'none', border: 'none', borderBottom: `2px solid ${tab === id ? C.teal : 'transparent'}`, padding: '0 0 12px', marginRight: 24, cursor: 'pointer' }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── ROSTER TAB ── */}
      {tab === 'roster' && (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Filters bar */}
          <div style={{ padding: '14px 36px', background: C.cardBg, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={C.ink4} strokeWidth="1.35" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10 10l3.5 3.5"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or role…" style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px 8px 30px', fontFamily: BODY, fontSize: 13, color: C.ink, background: C.pageBg, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {['all','available','busy'].map(v => (
              <button key={v} onClick={() => setFilterAvail(v)} style={{ fontFamily: BODY, fontSize: 12.5, padding: '6px 13px', borderRadius: 20, border: `1px solid ${filterAvail === v ? C.teal : C.border}`, background: filterAvail === v ? C.tealLight : C.pageBg, color: filterAvail === v ? C.teal : C.ink3, cursor: 'pointer', fontWeight: filterAvail === v ? 600 : 400, textTransform: 'capitalize' }}>{v === 'all' ? 'All' : v === 'available' ? 'Available' : 'On project'}</button>
            ))}
            <select value={filterSkill} onChange={e => setFilterSkill(e.target.value)} style={{ fontFamily: BODY, fontSize: 12.5, padding: '7px 10px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.pageBg, color: C.ink2, outline: 'none', cursor: 'pointer' }}>
              {skillOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Roster list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 36px 40px' }}>
            {filtered.length === 0 && <div style={{ fontFamily: BODY, fontSize: 14, color: C.ink4, textAlign: 'center', paddingTop: 48 }}>No team members match.</div>}

            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1fr 120px', gap: 12, padding: '0 16px 8px', marginBottom: 4 }}>
              {['Member', 'Role', 'Location', 'Rate', 'Capacity', ''].map(h => (
                <div key={h} style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: C.ink4 }}>{h}</div>
              ))}
            </div>

            {filtered.map(m => {
              const memberProjects = projects.filter(p => p.members.includes(m.id));
              return (
                <div key={m.id} onClick={() => setSelectedMember(m)}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1fr 120px', gap: 12, alignItems: 'center', padding: '12px 16px', background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 8, cursor: 'pointer', transition: 'all .13s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}>

                  {/* Member */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <InitialsAvatar initials={m.initials} bg={m.bg} size={36} />
                    <div>
                      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13.5, color: C.ink }}>{m.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: AVAIL_COLOR(m.available) }} />
                        <span style={{ fontFamily: BODY, fontSize: 11, color: AVAIL_COLOR(m.available) }}>{STATUS_LABEL(m.status)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink2 }}>{m.role}</div>
                    <div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4, marginTop: 1 }}>{m.tier}</div>
                  </div>

                  {/* Location */}
                  <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3 }}>{m.location}</div>

                  {/* Rate */}
                  <div style={{ fontFamily: MONO, fontSize: 11.5, color: C.ink2 }}>{m.rate}</div>

                  {/* Capacity */}
                  <CapacityBar pct={m.capacity} />

                  {/* Projects + action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {memberProjects.length > 0 && (
                      <div style={{ display: 'flex' }}>
                        {memberProjects.slice(0, 2).map((p, i) => (
                          <div key={p.id} title={p.name} style={{ width: 20, height: 20, borderRadius: '50%', background: C.tealSoft, border: `2px solid ${C.cardBg}`, marginLeft: i > 0 ? -6 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontSize: 8, fontWeight: 700, color: C.teal }}>
                            {p.name[0]}
                          </div>
                        ))}
                        {memberProjects.length > 2 && <div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4, marginLeft: 4, lineHeight: '20px' }}>+{memberProjects.length - 2}</div>}
                      </div>
                    )}
                    <div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink4, marginLeft: 'auto' }}>View →</div>
                  </div>
                </div>
              );
            })}

            {/* Add member ghost card */}
            <div onClick={() => setShowAddMember(true)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 16px', border: `1.5px dashed ${C.borderMd}`, borderRadius: 12, cursor: 'pointer', marginTop: 6, transition: 'all .13s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.ink4}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.borderMd}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px dashed ${C.borderMd}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.ink4} strokeWidth="1.5" strokeLinecap="round"><path d="M7 3v8M3 7h8"/></svg>
              </div>
              <span style={{ fontFamily: BODY, fontSize: 13.5, color: C.ink4 }}>Add a team member from the Skills library</span>
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECTS TAB ── */}
      {tab === 'projects' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 36px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
            {projects.map(p => {
              const typeLabel = PROJECT_TYPES.find(t => t.id === p.type)?.label || p.type;
              const members = p.members.map(id => roster.find(m => m.id === id)).filter(Boolean);
              return (
                <div key={p.id} style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', transition: 'all .13s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMd; e.currentTarget.style.boxShadow = '0 3px 16px rgba(0,0,0,.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 11 }}>
                    <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', background: p.status === 'active' ? C.tealSoft : C.clayLight, color: p.status === 'active' ? C.teal : C.clay, padding: '3px 8px', borderRadius: 20 }}>{p.status}</span>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.ink4 }}>Due {p.deadline}</span>
                  </div>
                  <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 14.5, color: C.ink, marginBottom: 3, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, marginBottom: 14 }}>{p.client} · {typeLabel}</div>
                  {/* Team avatars */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex' }}>
                      {members.map((m, i) => (
                        <div key={m.id} title={m.name} onClick={e => { e.stopPropagation(); setSelectedMember(m); }} style={{ width: 26, height: 26, borderRadius: '50%', background: m.bg, marginLeft: i > 0 ? -7 : 0, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontSize: 9, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                          {m.initials[0]}
                        </div>
                      ))}
                    </div>
                    <span style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink4 }}>{members.length} member{members.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CAPACITY TAB ── */}
      {tab === 'capacity' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 36px 48px' }}>
          <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink4, marginBottom: 20 }}>
            Capacity reflects current workload across active projects. 100% = fully committed.
          </div>
          {roster.map(m => {
            const memberProjects = projects.filter(p => p.members.includes(m.id));
            return (
              <div key={m.id} style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <InitialsAvatar initials={m.initials} bg={m.bg} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13.5, color: C.ink }}>{m.name}</div>
                      <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink3 }}>{m.role}</div>
                    </div>
                    <div style={{ marginTop: 8 }}><CapacityBar pct={m.capacity} /></div>
                  </div>
                </div>
                {memberProjects.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {memberProjects.map(p => (
                      <span key={p.id} style={{ fontFamily: BODY, fontSize: 11, background: C.tealSoft, color: C.teal, padding: '3px 9px', borderRadius: 20 }}>{p.name}</span>
                    ))}
                  </div>
                )}
                {memberProjects.length === 0 && (
                  <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4 }}>No active projects — fully available.</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Overlays ── */}
      {selectedMember && (
        <MemberDetail
          member={selectedMember}
          allProjects={projects}
          onClose={() => setSelectedMember(null)}
          onAddToProject={(member, project) => { handleAddToProject(member, project); }}
        />
      )}
      {showAddMember && (
        <AddMemberModal onClose={() => setShowAddMember(false)} onAdd={handleAddMember} />
      )}
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState('landing');
  const [navActive, setNavActive] = useState('dashboard');
  const [chatOpen, setChatOpen] = useState(false);
  const [skillModal, setSkillModal] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [greeting, setGreeting] = useState(() => pickGreeting('Ika'));

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap';
    document.head.appendChild(link);
  }, []);

  const handleLogin = () => {
    setGreeting(pickGreeting('Ika')); // fresh greeting each login
    setView('dashboard');
    setNavActive('dashboard');
  };

  const handleDone = proj => {
    setProjects(p => [proj, ...p]);
    setView('projects');       // land directly on Projects after creation
    setNavActive('projects');
  };

  const handleNavChange = id => {
    setNavActive(id);
    if (id === 'projects') setView('projects');
    else if (id === 'team') setView('team');
    else setView('dashboard');
  };

  const showShell = ['dashboard', 'new-project', 'projects', 'skills-library', 'team'].includes(view);

  return (
    <div style={{ height: '100vh', display: 'flex', background: C.pageBg, overflow: 'hidden', fontFamily: BODY }}>
      {view === 'landing' && (
        <Landing onLogin={handleLogin} onChat={() => setChatOpen(true)} onCreate={() => setView('new-project')} onSkill={s => setSkillModal(s)} greeting={greeting} />
      )}
      {showShell && (
        <>
          <Sidebar active={navActive} setActive={handleNavChange} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            {view === 'dashboard' && (
              <Dashboard
                onChat={() => setChatOpen(true)}
                onCreate={() => setView('new-project')}
                onSkill={s => setSkillModal(s)}
                onExploreSkills={() => setView('skills-library')}
                onWorkflowLaunch={(skill, flow) => setChatOpen(true)}
                greeting={greeting}
              />
            )}
            {view === 'new-project' && (
              <NewProjectFlow onBack={() => { setView('dashboard'); setNavActive('dashboard'); }} onDone={handleDone} />
            )}
            {view === 'projects' && (
              <ProjectsView projects={projects} onOpen={p => setSelectedProject(p)} />
            )}
            {view === 'skills-library' && (
              <SkillsLibrary
                onBack={() => setView('dashboard')}
                onSkillClick={s => setSkillModal(s)}
              />
            )}
            {view === 'team' && (
              <TeamView onBack={() => { setView('dashboard'); setNavActive('dashboard'); }} />
            )}
          </div>
          {(view === 'dashboard' || view === 'projects') && <RightPanel onWorkflow={() => setChatOpen(true)} />}
        </>
      )}
      {chatOpen && <HeyNia onClose={() => setChatOpen(false)} />}
      {skillModal && <SkillModal skill={skillModal} onClose={() => setSkillModal(null)} />}
      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
}
