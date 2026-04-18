/**
 * nOS — Creative Director Archetype Page
 * v1.2 — Converted from modal to full page view.
 *         Added Integrations tab (UX design, functionality deferred).
 *
 * INTEGRATION NOTE:
 * This is a full-page component, not a modal. Route to it when the
 * Creative Director skill card is clicked:
 *
 *   {view === 'cd-skill'
 *     ? <CDSkillPage onBack={() => setView('dashboard')} onNewProject={() => setView('new-project')} />
 *     : <Dashboard ... />
 *   }
 *
 * The page handles its own scroll and layout. The sidebar persists
 * alongside it in the dashboard shell.
 */

import { useState, useRef, useEffect } from "react";

/* ─── TOKENS ─────────────────────────────────────────────────── */
const BODY = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";
const MONO = "'SF Mono', 'Fira Code', monospace";
const C = {
  pageBg:    '#EFEEEA',
  cardBg:    '#FFFFFF',
  ink:       '#0F0E0C',
  ink2:      '#3A3A37',
  ink3:      '#6E6E6A',
  ink4:      '#A8A8A3',
  border:    'rgba(15,14,12,.08)',
  borderMd:  'rgba(15,14,12,.13)',
  teal:      '#0B7A75',
  tealLight: '#E8F4F3',
  tealSoft:  'rgba(11,122,117,.1)',
  orb:       'radial-gradient(circle at 42% 38%, #E05018 0%, #C02810 22%, #3C1860 48%, #180E40 72%, #080620 100%)',
};


/* ─── SVG ICONS ─────────────────────────────────────────────── */
const Ic = {
  // Nav / tabs
  overview:     <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/></svg>,
  workflow:     <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="3.5" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16.5" cy="10" r="1.5"/><path d="M5 10h3M11.5 10h3"/></svg>,
  tasks:        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h14M3 10h9M3 15h11"/></svg>,
  nos:          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="10,2 18,7 18,13 10,18 2,13 2,7"/><circle cx="10" cy="10" r="2.5"/></svg>,
  ask:          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2C5.6 2 2 5.1 2 9c0 2.1.9 4 2.4 5.3L4 18l3.8-1.4C8.5 16.9 9.2 17 10 17c4.4 0 8-3.1 8-7s-3.6-8-8-8z"/><path d="M10 8v.01M10 11v2" strokeWidth="1.8"/></svg>,
  integrations: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="5" cy="15" r="2"/><circle cx="15" cy="15" r="2"/><path d="M7 5h6M5 7v6M15 7v6M7 15h6"/></svg>,
  // Actions
  back:         <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5"/></svg>,
  spark:        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 4.8L15 6.5l-3.6 3.2 1.1 4.8L8 12 4.5 14.5l1.1-4.8L2 6.5l5.2-.7z"/></svg>,
  plus:         <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 2v12M2 8h12"/></svg>,
  arrow:        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>,
  check:        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l4 4 6-7"/></svg>,
  user:         <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="10" cy="7" r="4"/><path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6"/></svg>,
  connect:      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="4" cy="8" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="12" cy="12" r="2"/><path d="M6 7.2l4-2.4M6 8.8l4 2.4"/></svg>,
  chevDown:     <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l4 4 4-4"/></svg>,
  chevLeft:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2L4 6l4 4"/></svg>,
  chevRight:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2l4 4-4 4"/></svg>,
  close:        <svg width="10" height="10" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l9 9M11 2L2 11"/></svg>,
  send:         <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2L2 8l6 4 8-8-8 8 4 6z"/></svg>,
  download:     <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 2v8M5 7l3 3 3-3M2 13h12"/></svg>,
  launch:       <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9M10 2h4v4M14 2L8 8"/></svg>,
};

// Icon wrapper for consistent sizing
const Icon = ({ ic, size = 16, color, style = {} }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, color: color || 'currentColor', flexShrink: 0, ...style }}>
    {ic}
  </span>
);


/* ─── ATOMS ──────────────────────────────────────────────────── */
const BackIc  = () => <Icon ic={Ic.back}   size={16} style={{ opacity: .7 }} />;
const SparkIc = () => <Icon ic={Ic.spark}  size={14} />;
const PlusIc  = () => <Icon ic={Ic.plus}   size={13} />;
const ArrowIc = () => <Icon ic={Ic.arrow}  size={13} style={{ opacity: .6 }} />;
const CheckIc = () => (
  <svg width={12} height={12} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7l4 4 6-7"/>
  </svg>
);

const Chip = ({ label, small, color }) => (
  <span style={{ display: 'inline-block', fontFamily: MONO, fontSize: small ? 9 : 10.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', background: color ? color + '18' : C.tealSoft, color: color || C.teal, padding: small ? '3px 8px' : '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>{label}</span>
);
const SectionLabel = ({ children, sub }) => (
  <div style={{ marginBottom: sub ? 14 : 12 }}>
    <div style={{ fontFamily: BODY, fontSize: 17, fontWeight: 800, letterSpacing: '-.3px', color: C.ink, marginBottom: sub ? 4 : 0, lineHeight: 1.2 }}>{children}</div>
    {sub && <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink4, lineHeight: 1.55, fontWeight: 400 }}>{sub}</div>}
  </div>
);
const Divider = () => (
  <div style={{ height: 1, background: C.border, margin: '24px 0' }} />
);

/* ─── PROJECT LAUNCHER SHEET ─────────────────────────────────── */
function ProjectLauncher({ task, domain, onClose, onLaunch }) {
  const [mode, setMode]         = useState(null);
  const [selected, setSelected] = useState(null);
  const [newName, setNewName]   = useState('');
  const [launched, setLaunched] = useState(false);
  const [summary, setSummary]   = useState('');
  const [loading, setLoading]   = useState(false);

  const projectName = mode === 'new' ? newName.trim() : selected?.name;
  const canLaunch   = mode === 'existing' ? !!selected : (mode === 'new' && newName.trim().length > 0);

  const handleLaunch = async () => {
    if (!projectName) return;
    setLoading(true);
    const brief = await callClaude(
      `The Creative Director wants to start a task called "${task}" (from the ${domain} domain) for a project called "${projectName}". Write a short, warm, practical Nia task brief — 2–3 sentences. What should they do first? Under 60 words.`
    );
    setSummary(brief);
    setLoading(false);
    setLaunched(true);
    onLaunch?.({ task, project: projectName, isNew: mode === 'new' });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(15,14,12,.52)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: C.cardBg, borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 600, padding: '12px 28px 44px', boxShadow: '0 -8px 40px rgba(0,0,0,.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
        </div>

        {!launched ? <>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.teal, marginBottom: 7 }}>{domain}</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 20, color: C.ink, letterSpacing: '-.3px', lineHeight: 1.25, marginBottom: 6 }}>{task}</div>
            <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink3, lineHeight: 1.65 }}>Attach this task to a project so Nia can add it to your workspace and generate a brief.</div>
          </div>

          {!mode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'existing', title: 'Add to existing project', sub: 'Choose from your current projects' },
                { id: 'new',      title: 'Start a new project',     sub: 'Create a new project around this task' },
              ].map(opt => (
                <button key={opt.id} onClick={() => setMode(opt.id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 12, cursor: 'pointer', transition: 'all .13s', textAlign: 'left' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.background = C.tealLight; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.pageBg; }}>
                  <div>
                    <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13.5, color: C.ink, marginBottom: 2 }}>{opt.title}</div>
                    <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4 }}>{opt.sub}</div>
                  </div>
                  <Icon ic={Ic.arrow} size={11} style={{ opacity: .5 }} />
                </button>
              ))}
            </div>
          )}

          {mode === 'existing' && <>
            <button onClick={() => { setMode(null); setSelected(null); }} style={{ fontFamily: BODY, fontSize: 12, color: C.ink4, background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 14px' }}>← Back</button>
            <SectionLabel>Your projects</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
              {EXISTING_PROJECTS.map(p => {
                const sel = selected?.id === p.id;
                return (
                  <button key={p.id} onClick={() => setSelected(p)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: sel ? C.tealLight : C.pageBg, border: `1.5px solid ${sel ? C.teal : C.border}`, borderRadius: 10, cursor: 'pointer', transition: 'all .12s', textAlign: 'left' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: sel ? C.teal : C.ink4, flexShrink: 0, transition: 'background .12s' }} />
                    <span style={{ fontFamily: BODY, fontSize: 13, color: sel ? C.teal : C.ink, fontWeight: sel ? 600 : 400 }}>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </>}

          {mode === 'new' && <>
            <button onClick={() => { setMode(null); setNewName(''); }} style={{ fontFamily: BODY, fontSize: 12, color: C.ink4, background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 14px' }}>← Back</button>
            <SectionLabel>Project name</SectionLabel>
            <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && canLaunch && handleLaunch()}
              placeholder="e.g. Thebe Magugu — AW25 Campaign" autoFocus
              style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${C.teal}`, borderRadius: 10, padding: '11px 14px', fontFamily: BODY, fontSize: 13.5, color: C.ink, background: C.pageBg, outline: 'none', marginBottom: 18 }} />
          </>}

          {mode && (
            <button onClick={handleLaunch} disabled={!canLaunch || loading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0', background: canLaunch && !loading ? C.teal : C.border, border: 'none', borderRadius: 12, fontFamily: BODY, fontSize: 14, fontWeight: 600, color: canLaunch && !loading ? '#fff' : C.ink4, cursor: canLaunch && !loading ? 'pointer' : 'default', transition: 'all .15s' }}
              onMouseEnter={e => { if (canLaunch && !loading) e.currentTarget.style.opacity = '.88'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
              {loading
                ? [0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,.7)', animation: `pulse .9s ${i*.15}s ease-in-out infinite` }} />)
                : <><SparkIc />{mode === 'new' ? 'Create project & start task' : `Add to ${projectName}`}</>
              }
            </button>
          )}
        </> : (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: C.tealLight, border: `2px solid ${C.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: C.teal }}><SparkIc /></div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 17, color: C.ink, marginBottom: 5, letterSpacing: '-.2px' }}>Added to {projectName}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.teal, marginBottom: 18 }}>{task}</div>
            {summary && (
              <div style={{ background: C.tealLight, borderRadius: 12, padding: '14px 16px', fontFamily: BODY, fontSize: 13, color: C.ink2, lineHeight: 1.7, textAlign: 'left', marginBottom: 22 }}>
                <span style={{ fontWeight: 600, color: C.teal }}>Nia: </span>{summary}
              </div>
            )}
            <button onClick={onClose} style={{ width: '100%', padding: '13px 0', background: C.ink, border: 'none', borderRadius: 12, fontFamily: BODY, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Go to project</button>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:1;transform:scale(1.35)}}`}</style>
    </div>
  );
}

/* ─── CD PROFILE DATA ────────────────────────────────────────── */
const CD_PROFILE = {
  id: 1, name: 'Creative Director', orb: 0, tier: 'Foundation Archetype',
  desc: 'A senior creative professional responsible for establishing and maintaining the overall creative vision of a project, campaign, or brand.',
  rate: '$1,000–2,000/day', works: 'Art Directors, Photographers, Stylists, Producers, Clients',
  industries: 'Fashion, Film, Music, Advertising, Brand, Editorial, Sport, Beauty, Tech',
  focus: 'Vision, aesthetics, and brand storytelling',

  painPoints: [
    { label: 'The translation gap',        body: 'A clear internal vision constantly gets lost in communication — to clients, crew, collaborators. Hours explaining what should be felt intuitively.' },
    { label: 'Reference fragmentation',    body: 'Inspiration lives across Pinterest, Instagram, screenshots, Google Drive, emails, and physical tear sheets — never connected to a project.' },
    { label: 'Talent sourcing friction',   body: 'Finding the right photographer or stylist means relying on personal networks and cold DMs. No system matches collaborators by taste, not just availability.' },
    { label: 'Brief creation overhead',    body: 'Writing briefs from scratch every time — when 70% of the structure is the same — is time that should go toward creative thinking.' },
    { label: 'Invisible production gaps',  body: 'Understanding shoot timelines, budget logic, and vendor coordination is essential but often underdocumented for CDs without a production background.' },
    { label: 'No creative record',         body: 'Client management happens across ad-hoc emails and calls with no structured creative record. Credit and IP are frequently invisible.' },
    { label: 'Context-switching overload', body: 'Simultaneously concepting a campaign, reviewing edits, sourcing a stylist, and preparing a pitch — with no environment to hold it all.' },
  ],

  workflow: [
    { step: '01', name: 'Concept & Narrative',     desc: 'Not just what looks good, but what means something. The CD develops the conceptual territory — the story, the emotion, the cultural context.' },
    { step: '02', name: 'Campaign Thinking',        desc: 'How does the idea show up in the world? Is it a shoot, a rollout, a drop, a full campaign? Mapping the idea across touchpoints.' },
    { step: '03', name: 'Visual Translation',       desc: 'Styling, casting, set design, references. Turning the idea into something people can see and feel — moodboards, reference decks, direction docs.' },
    { step: '04', name: 'Production Understanding', desc: 'Shoot days, timelines, budgets, logistics. Ideas that cannot be produced properly are just ideas.' },
    { step: '05', name: 'Collaboration',            desc: 'Aligning photographers, stylists, designers, editors so the output feels like one coherent thing.' },
    { step: '06', name: 'Final Output',             desc: 'Choosing what goes out — which images, which edits, in what sequence. Consistency, clarity, fidelity to the original concept.' },
  ],

  taskDomains: [
    { domain: 'Brand & Strategy', tasks: ['Brand guideline creation','Visual consistency checks','Brand positioning strategy','Tone of voice definition','Visual identity development','Competitive analysis','Market and audience research','Brand health monitoring','Brand activation ideation','Brand storytelling','Brand discovery sessions'] },
    { domain: 'Concepting & Ideation', tasks: ['Moodboard creation','Concept ideation','Big-idea generation','Campaign theme development','Cross-platform concepting','Influencer campaign concepts','Experiential campaign direction','Narrative structuring','Messaging frameworks','Naming and taglines'] },
    { domain: 'Production & Execution', tasks: ['Shoot planning','Pre-production direction','On-set creative supervision','Post-production review','Budget-aware creative planning','Resource allocation','Vendor selection','Photographer sourcing','Director sourcing','Stylist coordination','Production team briefing'] },
    { domain: 'Visual Direction', tasks: ['Art direction','Photography style direction','Video style direction','Layout and composition guidance','Typography direction','Colour system development','Iconography systems','Design system definition','Colour grading direction','Motion design direction'] },
    { domain: 'Communication & Presentation', tasks: ['Creative direction decks','Client pitch decks','Concept presentations','Feedback interpretation','Creative documentation','Executive messaging support','PR narrative shaping','Thought-leadership direction'] },
    { domain: 'Team & Culture', tasks: ['Team mentorship','Creative culture building','Talent hiring input','Portfolio reviews','Intern mentoring','Creative training','Inspiration sessions','Internal creative reviews'] },
    { domain: 'Governance & Compliance', tasks: ['Legal and compliance review','Risk mitigation in messaging','Cultural sensitivity checks','Inclusivity reviews','Crisis communication input','Reputation management guidance','Campaign effectiveness analysis'] },
    { domain: 'Events & Experience', tasks: ['Event concepting','Set design direction','Spatial storytelling','Customer journey mapping','Touchpoint design'] },
    { domain: 'Operations & Systems', tasks: ['Workflow systems design','Process improvement','Optimisation strategy','Insight synthesis','Launch strategy input','Campaign rollout planning','Cross-team coordination'] },
  ],

  workingStyles: [
    { type: 'The Visionary',    desc: 'Leads from concept. Strongest in ideation and direction. Needs support in production logistics and operational documentation.' },
    { type: 'The Executor',     desc: 'Strong in translating vision to deliverable. Comfortable in production. May need support in conceptual articulation and client presentation.' },
    { type: 'The Collaborator', desc: 'Leads through team alignment. Relationship-driven. Needs tools for communication, shared references, and collaborative review.' },
    { type: 'The Auteur',       desc: 'Singular, highly defined aesthetic. Works with a tight recurring collaborator network. Needs a system that preserves their creative language.' },
    { type: 'The Generalist',   desc: 'Works across multiple industries and project types simultaneously. Needs strong context-switching support and project organisation.' },
  ],

  collaborators: ['Art Director','Creative Producer','Photographer','Cinematographer / DOP','Stylist','Set Designer','1st AD','Editor','Retoucher / Photo Editor','Music Supervisor','Casting Director','Copywriter','Brand Manager / Client'],

  tools: [
    { cat: 'Reference',     list: 'Pinterest, Are.na, Instagram, Behance, physical archives' },
    { cat: 'Briefs & Docs', list: 'Google Docs, Notion, Adobe InDesign, Keynote' },
    { cat: 'PM',            list: 'Notion, Asana, Trello, Monday.com' },
    { cat: 'Design',        list: 'Adobe Creative Suite, Figma, Canva' },
    { cat: 'Comms',         list: 'Email, Slack, WhatsApp, WeTransfer' },
    { cat: 'File mgmt',     list: 'Google Drive, Dropbox, Frame.io' },
  ],

  outputs: ['Creative brief (pre-production)','Moodboard / visual direction deck','Campaign concept presentation','Shot list','Call sheet (with producer / 1st AD)','Post-production direction notes','Final selection / edit sequence','Project archive (searchable, taste-indexed)'],

  nOSFlow: [
    { step: 'ENTRY', name: 'Onboarding & Identity',    nia: 'Builds your identity profile through a conversation — disciplines, working style, taste signals, collaborators, portfolio. Autofills from Instagram, Behance, or previous sessions.' },
    { step: '01',    name: 'Idea Capture',              nia: 'A single, frictionless surface to put ideas down without editing yourself. Autofills client context from previous work if a brand name is mentioned.' },
    { step: '02',    name: 'Project Creation',          nia: 'Frames the idea as a project. Asks only the minimum: type, client, timeline, budget, context. Autofills brand guidelines and tone from previous projects.' },
    { step: '03',    name: 'Brief Generation',          nia: 'Synthesises your idea, project context, and identity profile into a full creative brief — direction statement, references, tone, audience, deliverables, shot structure.' },
    { step: '04',    name: 'Visual Direction',          nia: 'Builds your moodboard inside nOS — import from Pinterest, Instagram, or upload. Organises references by mood, colour, and discipline. Suggests from your own archive.' },
    { step: '05',    name: 'Collaborator Matching',     nia: 'Matches collaborators by skill, taste alignment, location, and availability. Each receives a role-specific view of the brief. Recurring collaborators surface first.' },
    { step: '06',    name: 'Production Planning',       nia: 'Generates shoot day structure, call sheet, timeline milestones, and delivery checklist. Closes the logistics gap for vision-first CDs.' },
    { step: '07',    name: 'On-Set & In-Production',    nia: 'Communication and coordination layer. Log decisions, capture references, update collaborators — all connected to the original brief.' },
    { step: '08',    name: 'Post-Production Direction', nia: 'Log direction notes, manage selects, track delivery against scope. The brief\'s deliverables list becomes the post-production checklist.' },
    { step: '09',    name: 'Final Output & Delivery',   nia: 'Supports final selection and sequencing. Generates a delivery package for the client or brand.' },
    { step: '10',    name: 'Archive & Learning',        nia: 'Every project is archived — searchable by aesthetic, industry, collaborators, output type. Your nOS profile gets smarter with every project.' },
  ],
};

const PHOTOS = {
  pharrell: "data:image/jpeg;base64,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",
  virgil: "data:image/jpeg;base64,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",
  melina: "data:image/jpeg;base64,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",
  jonathan: "data:image/jpeg;base64,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",
  spike: "data:image/jpeg;base64,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",
  grace: "data:image/jpeg;base64,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",
  kehinde: "data:image/jpeg;base64,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",
  thebe: "data:image/jpeg;base64,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"
};

/* ─── IKA'S PROFILE ─────────────────────────────────────────── */
const IKA_PHOTO = "data:image/jpeg;base64,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";

const IKA_PROFILE = {
  name: 'Ikanyeng Rammutla',
  role: 'Creative Director & Founder',
  org: 'Function Studios / Nia Technologies',
  location: 'Boston, MA  ·  Johannesburg, South Africa',
  industry: 'Film & Fashion',
  nationality: 'South African',
  bio: 'Ikanyeng (Ika) Rammutla is a South African creative director, photographer, and entrepreneur whose work sits at the intersection of visual storytelling, financial strategy, and technology. As the founder of Function Studios, she has produced Electronic Press Kits and visual content for over ten Netflix Africa Originals — including Heart of the Hunter, the first English African Netflix Original to premiere at #1 globally. She is also the founder of Nia Technologies, a creative intelligence platform building AI infrastructure for the global creative economy. Currently an MS in Finance candidate at Babson College, Ika is one of the few practitioners to hold deep expertise across creative production, actuarial analytics, and venture finance simultaneously.',
  workingStyle: 'Vision-led and systems-minded. Ika approaches every project as both a creative and a financial problem — her background in actuarial science and portfolio construction informs how she structures production budgets, allocates resources, and forecasts outcomes. She works with a lean recurring collaborator network and maintains an aesthetic sensibility rooted in 1970s–1980s editorial photography.',
  renownedWorks: [
    'Heart of the Hunter EPK — first English African Netflix Original to premiere #1 globally (11M views, Mar 2024)',
    'Bridgerton Season 3 Parts I & II — EPK & BTS Production',
    'Blood & Water Season 3 — 10-day production, 12-crew EPK',
    'iNumber Number: Jozi Edition, How to Ruin Love, Lobola Man — EPK series',
    'Oscar Talk 2026 — Panelist, Emerson College LA',
  ],
  history: [
    '2020 — Founded The Function Creative Company in Johannesburg',
    '2023 — Scaled to $100K annual revenue; Heart of the Hunter debuts #1 globally',
    '2024 — Founded Nia Technologies; accepted into Foundry by Wix Ventures',
    '2025 — MS in Finance candidate, Babson College (GPA: 3.67)',
    '2026 — Oscar Talk panelist, Emerson College LA; inaugural Foundry cohort participant',
  ],
  currentWork: 'Founder of Function Studios and Nia Technologies. MS in Finance candidate at Babson College. Foundry by Wix Ventures participant.',
  netWorth: 'Not publicly disclosed',
  awards: [
    'Olin MSF Scholarship, Babson College (2025)',
    'Oscar Talk 2026 Panelist — Emerson College LA',
    'Inaugural Foundry by Wix Ventures participant (2026)',
  ],
  links: [
    { label: 'Oscar Talk 2026 — Emerson College', url: 'https://websites.emerson.edu/oscar-talk/panelists/', type: 'Press Feature' },
    { label: 'Function Studios', url: 'https://thefunctioncreativeco.com', type: 'Company Website' },
    { label: 'Nia Technologies', url: 'https://niaresearchinstitute.base44.app', type: 'Platform' },
  ],
  connectedApps: [],
};

const HEADER_IMAGES = [
  { id: "IMG_1884", label: "Salt Flats, South Africa", src: "data:image/jpeg;base64,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" },
  { id: "IMG_1882", label: "Country Road, Japan", src: "data:image/jpeg;base64,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" },
  { id: "IMG_1887", label: "Coastal Road, Italy", src: "data:image/jpeg;base64,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" },
  { id: "IMG_1885", label: "Lençóis Maranhenses, Brazil", src: "data:image/jpeg;base64,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" },
  { id: "IMG_1883", label: "Osorno Volcano, Chile", src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAD3AY4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBEHy/hUi4Uk9R70iZCDuKcAc9+v519P0PlRc98dPWkbnnHT8jTuff/ABpp55xQIYw7AZBHHNM298dakb3HtikC5IzimAzaOCBjJ9aXAJH+FOCnIz0pwXOBxigYzqc4HvSEDd07dMVJt7dhQVx1+tDsBGR3BwQaNvHTkn8KeVHtSBTt68+uKQDNuD0oK+2fenlfXv1pQOO/1o0ER7c54zSlc9sc8U8r83WkKnqR0/woGNx7YzTcAD1z0NSbSMDkYpCPoTQwGbSM0nuM5qTBI5/OjGAOpxQA0genNNABwcHFSFRjI4pCv1Io0AjI69KQqSORUpA9KQrj04oAjIz2574owepH1p4XjGPalK9Ac0AR7e9AGB0zUgAx6ntSYz+NADNpzkigjntx6mn7cdKQjJ79aE0BFjPU5GetJjBz6VIfvHGePWkPTr+NAEeDk+1IRj8etPK8c9qMcYHegLkZXseuaQjJ9u1SEYz/AI0hHPfOKOgyMjPNJg/nUpH+fSmEYGQMUAMKjOAO39abt9RTypwRjrQRyaNxjCDnnmm45xipSCR2/KkIJ9z7mkA0D17nrS4OCBg04Kc8CjGc0CG4yCcUhHHSpAPb8BSbe5z60MZAVxyeKY6+tTMM8D+VRkf/AF6aGV2HHAHNQlfarbLyRzUJXn1/GspGiZ06KPLzkY60EYP4U+MDYByQBTtvOOSfWtU9DAjwQOmPakIOAM/596kx+VBUjHH40kIiK460m05GM/SpcAgH9aQqc4PGOOKYDAoPv7ZzTgOM9e1OC884yO/pTgB6UARlTnuPpSY9c9KlA56ZpuDgCi/YYzaQOmDSFSMkZqQjn8PWkI5wR06UCI9pJ+vvRjjBz+XWnnBB449M0mM5zzzQ2MaV57UEc4ApwAIxgHNLj2xznHrSuAzb2GelJgEEcCnlc4Hv0zRg4zjqKBDMbcZzj0pNue3HtUm3I6DNBXmgZGV4GDSEYJA9Klx+H9aQjkZzQBGRjpxikKgjgH61JtB7H8aCuD05+tADABnkmlK//qFLgdgP896UL6g5ouAwqTnA/wDr0hXAPXn2p4GR6g89aMe3FCYEe0gE57U0rzjrxUrL3Iz+NIVx0Gc0ILERXHTjjNJt44NPK+g6+tBHJ4oAjK8nGaQjPUGpNvPvTSBtAI5o2YxmMDPvigg5z/WnYAxQR36cU7giPGTimkHqPzNSYz1FJtoAjwc4o28ZHSpAMjkUEdcDNICLHHSkI5PX61IVGOmKNucYH0FAyIDOCAadgZ9qXAPJHHalIGM9fxoAZ045FH4UoGR0PFBHBHWi4EZGeMZ/Go2BPB/QVMRxnHFMYdM9KBkJUYpjL7cVOVyMdaZj14rKRaOjiX92Mg49aUjk9vSnRZ8scDHr0pSO/TNaJ6GFtRoHPGRSY+nvTwMe3alI4JAPHUetAyMjP+etIR0GOp6VKR7j8aQLk9/pQAzGDkdvToaUr7fnT8djQRxnGPfGadwGFcnk/hikAPXpzzmpMY//AF0m3gnGB6elK76gMwfTP0ppHOB9QakIOcY5x3oxxxmhsRFjj+v9KApB/kO9SEbSfpxSlcDGM+9K47ERHc9PpS46YJ96k24PegjjGfyouBGcD/8AVScjsQP88VKQSvXkc0YIPPWi4WItvAJNBU4wOo4GalCjjIzSFec5ovoOxGV9elGM4x0HcU8rnjBz/KkIyTxRcLDNoYDINNx+AqUrjGKTHXp/TFDYEeBjPXjNLg8g559Kft/z7Ubf1FFwsR4H4ZpAP8mpSOc/ypOfwz3pBYjIPBP/ANamlenAqbH09s00qSMgkCncCE4J55NBU46e1SbeMgHJFBX5cg0XAiK89Of6Um3Gc4qXaRjv6YpNuB0OPSmBEVOfb37U0jAOePwqbbxng80wrz2HtmgCPbnAx068UhXGal28j3PHrSEeozSuBH1H+etJtPJ45GalKk8d/amlcnOMfypgMI45/l0pu3nvUpXHr9aQgkdPrSuMjxx0PNBXnH86fjnP40Ec+uaLgR7Rk+nvSbc8VJj3Ppmjacc0XAgK/wD1s0jLzjpUxUgZ5GB0pjLgYFO7GiArheg/OkK46VNjknP6803gdRn6VnNlrQ6CJQEBAzxT9ozkjinRD92M4x9adjI/nVpmLRGV5570hUcD/IqTaOnU0hGAeMDFK9wsMxjr17UoUFs4z2PNOwSOv15pdpIJxx34oC1hgUYJHNLtHB5+v/16kwMgg9aMcc5zQOxHt6kfp60FR29KeRj39KCuByT707gRlegFBXA46e1OA4x2oIHX06UdAsMKjBGD7jNBUcE/SnkcYHPFGDwSfypXAjK84JoxjjOOKftAJB6j3pNvOCP8BSTAbtHHX0pNvHX2qTGDSFT647igBoTK9TxRtGOM4p4Xvnp7UoAwc5ouBFtB/L1pCBnHpUpXqcnIpCvbHFAyIrjk9qAPl6j3qUjpyB2FIV5+nGKAsR7eMfnQVAB4708rwMkH+tG3juKAsRgEjBPbgZppBPI9eMVLtyeetAHGCRzQmFiMqc4zx6+tIVAHXOO/rUhUZpCuOvf3oCxFt9KCvbtn1qQrzx/+qkI5xk9eafUQzaOnpSYBOAOtPIOen68UhB24JzkUARlQe1NK9c1KQMkUEccdfSncCDGcn1560pHrnOOKeRkjJ6djTducc496GMaFxyP1NJtzwc1IFPr14pNvGaQEZXAoK9ARUhBxx/KgjpwaAIto7H9aaVxUpXIoK8e2fWgCEqcE5J5+lBXOfyqQr0J4pCpx16UXHYixk9f1pjLxzUxXH/16YQAOT1PQ0AiI4PPPPXmmH34qUrjimkc+tRI0R0USkxjucdqeV7YPPaiAZjHvUm3noPahMysR7TkA5pNvI5/DFTbQRjODimlcEnHTnBNO4hm05AzRgcDt7mnlfcZxxTivPTI+lO4Ee35uAc4pNvoOvqal2joOB6Uu3vx3obHYhKnnOc0m0A4H/wCqptpByD7DNNK/TigdiIjBzznvRjPGO3NSlcsenHvTSuR+PJpX0CwwjJPqBQV47n8ak2846H9aQrxjsOaLg0M28fjSYP09qlK8jge1G3A54P1pXCxHt9eP6UY9zntT8cj6Ubep75ouFhm3jgHijGemcHtUgAHGPb0xQBkA9u1FwsRleQP1pNvAHPPWpSo/D+dN2549eM0XHYjK5PHbrg/pSbTn6/kKlK5I65x0pCoC9OBSbFYj29+tBHb3x0qXbjgA4xSBe/r196GwsRbcg9Tik2+uetS7QQcfz70bRn6c8UBYiKj3496QrjOAalKZ5OB+lIV5yeffNUFiIjAI5NNK47nFSED2xQVHX+RoCxHt4znn+VIR1yep5JqUrxgcYpCvGP8A9dNMViEjAxzj8zSbQTnJ/wAKlI78YFIQBj29TQOxDg5xz1yKCCWAIPB71KV5xg++KQJg54B96AsRbTjB7elGAex5qUgk9Mj+dNwMHg+9F0FhhXnH4YppQlhn8qlIPakwMcde9AWIyuSTzmm46deOlS7Qc54NNxk8/qaAsRleeOc0hXv61Lt4NIRnOcdPzpBYiZTkAVGV+XOTipypJ44PbmmMuRnjincaICuQetN2nt+tTleMn15zTSu44GM9etRLcs6C3XMeSM5FSlRwQAD70lsP3YBFSgfMSAM4pXFYYU6DIPNIV9CORxUpXoMAemaQr6AjHJoTERbTgc0u3Azgf40/HHIB9qCvIx2/Wm3qAzac+nqMU7aR26e4p4XPIHr9aAvHT8xxSbBK5FtOc45xSFcHkA49uamI5Jwc9qYVx6AGi47EZBPYYzSBQWOMe1SleuQBjvzxRgBegzTuFiLbnoP/AK9AXoeOKlK4PI7UFev936c1NwsRhcZ//XRtIPAHNSEADnqOmKUL17UXCxEVGcHB96QryDjke/8AWpQo4Ix+FAX3obCxFt988U4LxngU8r+OaCOPWi4WIypwM/kKQqdwyOfWpivy9P60hA4HGfWhO40iLYSD3NG3HTn+lS7ecgZ4yKNp24xwPwobAiC7sDpikKHqRg46GpguOQKMdaLsViEqQeB+NIVOcd81PtHoRnHSmlTnHPPShMLEBX1HX8qQqeoH/wBepio6nv0ppHHGKL6A0QlTjj8cmmlf1qYg4OfXnimsowef/r0XCxEV9h+dBXHse9SYwOnGaQqcZNVcLEeOOce3NNK9KlC8jv64ppHXue9FwsR7cjnjnkZpNvJPHvgVKRlv8KaFGCfz/OhMLDAvTPHvmjb2OM0/GOoFGCcdcDnFFwsRlc9PzJpu3JwRj0qUqQM4waTAIAx9eaLhYiK55HHHNJt4/Sptvpx9KaUIPQ+w9aLjItuABgAdfpQV7YAp/cgjjtijHI44ouKxGRk546cmmEZ9f8amIOcAUxgceoHagEiAg5Hr2pCueCM98elTYJ56EU3aWJPAqZMtI37VTtBIx6VOFx2OagsmGwDNWwMjAPH61FxJEZXJwQB/WkKgnGOc9qnCnGRjn0pCoHA/LHNCYWIdvftShR/k1JtO3POKULz1ouFiPaevPf8AGjaOoAGPbpUu3J96MevX1xRcEiArtI459CKTbkDrx0qYqcEdRmmkc+3ahsdiIrnOBijaMdKkK9hjB/z1oCnbyR6dKLisRFAT0x6cU4KCCcU/aSOCMdqNpIOOOO9FwsM288daAuB/jUmzjPtSFcEYP6dKTY7DNvABHB70beDlST06VJtI4xzSFTjrgCncLDNoz0OTSBRnpn3qQKQOBj6ClK89OM0mx2IyvPPOaNpzjnOak24PJ/KkKnGOmPbii4JDADjIHT2o2ntjA9qk29x6dO9BXHTFK4WIsccAmlK5APUjvipAuOMA+nNG0/pgHFO4rEIX2+lG3Jxj2JAqUqBwT/WnQ2091cLBbxNLK3RVHOPU9gPUnApc1ldlKLbsiqwABzwMc88fWo9yrxkZ7fWvQtE8NQaaomuVjuLsjqRlI/ZQep9T+WBWrdRRzRFHjRgRgggHI9K5ZYxJ2Sujtjgm1duzPJyOOhHtSFfYV0WreHTCzS2Kkr1MPcf7vr9Py9KwGByQScjORjof6GumFRTV0zlqUpU3ZkJUc8HPQ0bfQZxyOlSlT1weO1IVHOSPyq0zGxFt4GBwOOaaVBOcd+4qXHGeTSFR17immCRHtx2/+uaTGR9OOakIJzyAO31o2nPH+TTuFiPb260hXkcE1IF5HXn2o2nBGefpRcLDCvt09RTdhGQecdeKlwCOuBQFwAM8+1FwsRFSO4x3xTdvsCDU204H05pCpPOMHvnpSuFiLbntz6U0qSMentUu3PB9KQqdx5GenSncLEJX1FMZeehqwVOOn51Gy8dffpQmCRER6jvnio3Gew6+lTFcj3NRuD64qJPU0SNizJMQHXj1q/G2GwelULEHyxz24xV4AZH9KTegkifaOuRnHXPWk285/TNKvQDHT9aey4PfrWaZViMqMZz07g0beueeKkx3x09KNvzDPPccindhYZsOOB0Oc47e9IV79eO9TEdz2pu3gDr7+lFwsQlcHBB6+tIUznP4+tS4+Y479qQgnoeQKdx2ISv59xQFwSe1SkZY5HPrTcDJHJz3x1ouKw3aRjA6elBBwM/pTgvcYx+lOCgH0BHelcLDCpB6dKNuPy9aeVPTrzyKXae5zxn60NhYYVORxTQnUgDHYipduD0H+NBX5vei47EYBJzjrzkGgr0788+1SYOfX8KAOMe9K4WGbQOf8mkCc8cH1qXb75Pb0oC56evftRcdiLbz7dRg0u3qCOv5VLt5xkA9cYpCPyobFYiCnngfjSEehP41atrO5vZCltC0pB5IHA+pPA/Guj07wxFBiW+K3Eg5EY+4PrnqfrgexrKdWMVubU6EpvbTuYGm6Ld6oQY1EUGeZnBx+A7n6ceprsNN0y10qAx26Es3DyNjc59z6ew4FWywwAOg6f59KaWwSfQVwVK0p6dD0aVCNPXdjiSBjk0wqzHIbbz6ZowSpJx1qIziOZUkBwxIDAZAPofT/PSsToK8yhsAMDnIHGOR2HvWPqWiLe5cxEPjiRBk49x3H15963JIwFZ4iDl8FSMgn1Hof51GJgoBY4DE8Ed/Y/5P161cZuLujOcFJWZwN3YT2ZPmJmPOA46H6+h9jVUqcfQ5r0SWK3u2zKAHAwWHIPsQOv41k3XhW1ZmaF5IyegQgjPsCP0yK7YYlW97Q4KmEd7wZyBU4x0OcjNIV4xnAPvWpd6Jd2uSAJ4xzujBzj3U8/zrOOAcEYIGcHgn8K6lNSV0zklTlF2aI9vPPr0zSEZ6DFSY6nPQ80EZUdc9qu5NiMrz6GgLxjHU9KeF5GOtBBweOn6UXFYYVpACB3x6daeeOSD70hYL3H0PFO4WGheCMYz19aTHIxk4/OnFlB6jnPGOlIMMBzknjOKm4WGEcD1pNpJ5/CpDwfc9KTg/j7U0wsRlcDPJ/Wo2HU5zzUxB/MUxh379fpTuCRCVJBHPpTG4A5/KpiASajIJ/wDrVEnqWka1gg8scZ9q0AozjqevSq1go2AjHTBOM1e2nJyM5P50mxpaXGjhcnr15FO2gE56+3SnquO34Zp208EdeB9am5SRH1GBzz2pQoPXBPXp1p+3oMcZx7U4KPQ565obCxGAOnGR3P8AnikKEZ4P1xUxUZ+uOtIVGM4JOPrRcaRAy4bnJGetMK4J5GT09qsbcHOcDpTCoJ5OSf1p3HYiK9yB7jFBXk9vpUsaNIGEalioLHHYDqTSAA4OTj1z0pXFYjAAGelKVwQDgevOakCgnGMCgKOp78kDv/hRcLEZXuP1FLt5GeT2IHSpPfJBxmgKPQ56UXHYj2kkHHOabtGc44681NsAY54x1OaVYmZwioSx6DHPT0/OpbSHy3IgM8Dn3pQoHTOPapShU7WG0jgj3zg/XmkbCqWLADuScCmn2DlI9uSMZ9KNoJzgnuavQafLc7QNsatwu48t9AMn8xitFNK06zXdez+Y+0tsJ28DuFByf8e1ZurFGkaMn5GHb2091J5UETSvjkKOnuSeB+Nb1j4aRSHvnEh/54xnABx0J6n6DH1NXkv7CziCDbapwQGXb1GckdRxzzg1FJqi28hubhI7a1QEtJM581h7IBhRwMZOTxxmuedWUtFodUKEI6vVmoESKNEj2xxrwEUAADHQDoP/AK1NkkEZwQ7EjIVRknnAGP1yeK4/VvFU8dlPKD9hVCVV5kHmkkcBUBypI5wSDgEnGcCtY+M9PtbKS53ybAwMgETM7uw6b2IGRgnAzwR7moVCbV7F+2gtLnbNMizFC5kkGP3SEHZ7k9gT3P60KzsuXVM9SFJOPbJAz+Qrgj8TbRUBXTp/mYbkLBSBj5iDyCegAOM4JJAwDEPiiFB36QQGUgBLgE5zxnjpjqeuegxVrC1X0J+tUl1PQC4Y8oN2CBxkn8PTimXJYIrLjJbgYIJPXIPtivNLv4lX7/8AHraW8JIXLtlj0G4YJx7D+tZuqeONY1EwsjizaCVnja3YqQhAGw88jIByferjgqjeuhEsZTW2p64XDREEMASQdvYg9eemPSoQpkU71VZG64HyP6Yz0P8AI5rzuDx5dz6K28st/ZlZAwIKzgkglgeQMkcDkYGMcVSl+IWtzXgki+yQwhMPEUJRz0JBYkg+gB475OTTWDqNtA8XTSTPTwgOCQc4wSRzj0J6gj8fyprOUUFsspOSeCMds/4j8q8vs/iFrVkAkwjvY+cCVjvGR2kGTjPPIPTHrWhZfEK8udTiR4rZINxZzIdhK44GRwWzjkDknoBSeDqIFi6bO9Uwm4y2x3xnGcMB9Dz+NJLbW87YlijdACCrpuGO2Dgke/8AkV55feLBqk6RhEslQeYhmIBJByNrjO3IPTkZA65xVeLxpfWIS2YLJ5ZPzFi2/nqDxzzjOD7iqWEqbrRieJhfXY7HVNLSEGZIraSFCBsiUo+CcZPXoDkkAdOR6Z6aTFcRh4JWXdkASoRz3B6HjHcVz03i+4mtSHdZcowIIALEng85BA6EYyR+dRQ6/LcOJQj2zByXUOQqkdxk5wScdeOB71vGjUitzKVSlJ3sbkmm3cTlfs7OAM7o/mU/Qj+ozVcx4YqQQRjII5H1zWTceJruVn+ZQBgiQRqeO2Rjg+uMc8ZzVC48RarJtzJbSBBx+6wR9CTnHtnFbQhN7nPJwWx0pQY75+nam7TnoeO+MmuSGuagkhlMjg+gdgo/AkirkfiuVVAkthKRnJLgZ9MYHGP1q3TktjJSR0AX298UhUY571jxeKYGA8+3eM9yh3f5/SpE8T6e0gEiXESnqwQMAPoDn26VLhLsF0+pp7eBnknmm7Sfx9qox69YSH/WFYydpJQlhx97A7A9s5P4Uia7aOAHIU8EgnGR3IJH6H9aOVroOyfUvFcHHvUbKSD9ciq8+sW8c8iAFwoIDg4BPbPoPU9R6UgvgLlIriJUDMFBEgJBJwc54GMgk9Md6LMaSvuTEcjB/TFNb5jjrj0qKfUreGQpLHLGcDGcEA9wTnjH65BHrWdca3GAdkYIzgZBORjrUOLeyLslpc7SxaJI1AK/QVfMkYGd49BxXPafrVoI2ElwkZXjYoL7+OoIyAOnUirMet2zKGkUKGGRt+YjnAyMcZ7f0odOT6CUklubSsTwAfqRgYpee3XpWMPEOnrGX+0sMY42HJ5xgDp78eveqsniy2R8JBcSAd9wTt2BzSVGTewOcVuzoSoBLEjJPXAz+dOVeQA4JPYDrXJS+K7gowgs4VLAHMrFyAOwAwPzz0qsfEOpMCDdFSVwxAA4JzyAO35D860VCbJdWCO9jt5ZQSkUjhepVCQD+FOgsp7iQrGhG0gOxGAnuScfl1rmLbx9rNmioJYLlOxniBYHuAQRwOn0p/8AwsHWVlVybaRRyyeUBnOcEEcggcdT075rJ0KutkjVVqWl2dnLpNlBA1zLeyrbpyXMeM4JBwMZPQ8Ac449aZA/hprEyG5g2bghd5ip3HoOcEEjnGBjvxzXHS+PNQnQefaWc5XJVpEJKEnkjnHGBjI7D3rD1DWbjUrqS7umQzMAFKLjA6nHXgnk+9KOFqS0k7GksTTXwq56PrE8MtnBHHfxafYyoZEjGRJMwGAAVJGwHBJBJ5zkEZqOyiRxc/2n+9kDboyFCkJgcMwwDnqCcHB5A4rgLXxVqlgjrYvFblx87rCgdj0yTgnPJOc9Tmoz4k1lgN185AYvkgbsnGSCRnnHr3J70/qc1pcl4qDd2j0VrOxXc6XSSRxtggyAM2RkYwcHPYYGfU0RQWMkYlRyyNzySDnpgg4IIPBB5B49q8snv7y6kDTXUzkZAzIcLnkgZPFRBpGBBkdgTzkk8/nVrBu2siHiop6RPVJ0sYSxlnSNQMktIAAPck1Bb3FhdyYtpVk5O3ZklsEA49cEgHHqO1eZABecLn1xzSiR1yyFlIOQVJBH49RVLCWXxEvFK/w6HrFnFHcyq8axptJIMxGCRyCBzkcEkngAevSG68WaVpczM9xHdzAFPJtG82Rue5ztGTzjPAx1NeVszPHsd5HjyTsLHaCepwTjmkWV412oxRTwdnBP49aX1JN3b0H9caVkrHoz+MrmZWzplrYW23INzMEwDjJxtyTnphDkk845ML+LrYMx+zxzOcCS4LGMHHQjOZCOmOnY89a8/Zi8hcksx6kkk9O56+1KWcgqBnPQ+laLCQRH1qbOul8bXU0oitI5GL8bIyVJOABg9QOucnPfOeQ0eJrm3ly0sMexC0iQrkbyQAck7n9eo7YyOTywkMSfKcDGDgYzx9f85qEsBgY6c9MVaw8LWsT7ee7Zs/8ACQ37zrcPPIzxE+Ud2wJkknAGRkk8k5P86gk16/8AMilhnlikjTYGDkntyCe/A59OKzWckcknB7+namZJ7ZFWqUFsiHVk+o6aWWSUyyOzyMSSxOSSef50nmuyICx2rkgEnAJxkgds4GfXFGPlwMfjTTxnkZI61oo2M7jtxKnsG/WmknH07UHjjB9eSKQD3oAUg9eh+tMzkg8EA5xSkHnJz60hBx1Bxz1p2AHIYgjA74AAAP0FR5PQUpHYevNIB8pJb9OtGwCZPr9aOo9c0Ec8YNJjr0FCACTtwTkAd+30pjSOy4LNjGACfbpTjg9xzTCBz2PekMAxZjuYHPOT3PvQJiFwcjac/SkJB7UhYY6EH6UxjxMTwc9MD2pSylQAcHORn1qEtxyOv40BievSptYLknmsOQQfXnNBYY+4ecdqiLduD68UFzgcY+gpiuPJQkDJGfcGkIJPykc9s00tkc559qbuXqQTntTDRjijY5GMdiKbnAxnI9D0oDEdCGX0JpGwehwPTBGKkduwquUA2kj6HFON1Mp4lcEdCDg/gaiOdp/PpSHI6Ae9FgRILiQAgksGOTk5yaa1yM8pn8ahLEcdPwpjNjnPX8KzkkWmaNhq1gqAfa0AIweCMj8q0BfWjjIu4T2I3gc/jXCWjELklSMDIGcVdBU9UJHUYP8A9avLWZTW6R1vCxezO1HIyoznjI5FKFYkgAnPoK4cbFyAAoXjgnj9aMgDAyuTxjnP8qtZkusTJ4RdzuCrk5IJHoBQFOcAEgd8Vw/AODnnIGc4+vXFP28kFy3IJAY1X9pr+UPqd+p2/wA2DgHJPpSAkAH06GuMHmIuIp5Iwc8BzkfiKkWe8XkXk557vzTWZR6xD6o+jOtzyRnJ+lNPXjAwa5cX9+uNt63JyQTnP55ph1TW42BS7t5hnJWS3H5Egg46dKtZjTe6sJ4WXRnSrPG0skSsTIgBYFSOD0weh/CnFuOOvXn0rn49cvFLubOGQsAWUSGPJxgY4Ixx3/Or8GtW0sZaWKW3K4ypIJIPoRwf0reGMpS+0ZyoTWyuXy2epz9af7Z/HNQC7tGA2Tx9urgHOM9OMdacHR1JR0YdCQwIB+vrXQqkWrppmPI1uiUSbcZYsc9qazkk5IAHPBpvYkEkA4OOaM8gYJ56+tVuKw4tzkMfemls85z9T0pNx6ZyKTdzyD65BphYduwpwTnvSiQ888d8ikDIFByxb2AI/nTS+48Bie+BihgOZy/JJwe9BPckg54yKZkjGA3PA4NIA+4DaRnj0H5mloMfn0NAf1OB0zmgxkEZ2kkZ++Bj/CkVC2UyoI69efxxijQLO4u4sQAQc/kaC5VSpIHYgf8A1uKbtkCnIB44IINACYAJZT6YBz9MUgJI1LgYDgMcBgOKRopFAOBjPrz+RpNqKwLSgY5AII/nSs0YA2OM9eD+Y9qL6jS0Iwxyc4z37U0scAEgg9TmpWaIqcSLzg8Ekj25pjKM5WQYJxkt/hTTBoNm7OyRH/3QT+NRnIJB4IHcVMWY8JKXOcAEZGfTPFQtlhkkFjwTkDp+FJMLDN2OCQR6Uo+Yn6dTmiTGQAy9OQDx/KhSSq8ghScZOMH6GgBpUkE56dOOtMzjgEE+3WpS5cEgqCDgAkcc/SjhTzsHsD0/DvRcLEQwxPJXjjjim9AeMjPXoM+lTkwjgyszEHsePwquGAJ+UEYxyDg/jQtRtWAHJ4IOKQ5AAIwCeCRwfoaczCRcMyLgcckn6UgaIKN8hJ7gcD2z3oFYbuGM8dc96ARgDAye/J//AF0SNCFyjIc9QTz9etM+1RA5yAoycFhj8SeB/wDW96HtcaWpLmLAIIGTyCcdB155qItuORgDB+lIbq35AYYyeQQc/SmtcWwz/pKkdgFNJ3Ha4pY5PX8qCxAwT78VEbu0UZDux9OgpjX1pjAD569eKYbE5fqCR70wtxkng+oxVZr2DshH6/1qM30XYN7Z5oBFtmxjkjP1ppJ6E4785FVW1JWOSrsexJyajbUlJ/1Tn8aiSKK9iPkXAJIHTpmrhXC4Ctg8VTsmJUYxnsM4q4QSSSMEnI6AD6V8m9z0xCGJB2HpxgUpyCMpyfQfzoUFemQxyPTB+lBcjHXNIBGBYkHkAdP89aVVO3CgYwOCOhpVYNgE4HcjnGKUMuQME8dc8fl60XAVcgYOQfYY4oHGe49+AacGUnKHgk8Egn29KBL1AA4H+T7UXC4wg7iQMj0BpctjPAxxjApwbcoGWJPU5wD9MU0D6nHJ56fhRcEBUliSM5OeTnJpu1s8DgelOHyjPPTpjNAYOQTkc/T+dFwEKk4BAPsTntx1ppGF2kDGckHjJ/KpBkAkgHPIycUikOxyuQD35/LNVzWEJE0kT5RzGw6kcH+dTrf3wJBnYjsCoP8ASojgYyQCT3NL8pAPBKg8k/kBVxqzjs2hOKe6LA1W9XGTER/tJ/PGKcutzqcNbxnHUrnmqoBCg4wGJ6YwT/jTSRg4yMDkjr1xWqxdVbSIdKD6GimugqSbdT7b+np2qVdciySbYnOejDj6ZrLyAR8oBHQk5FIWDDAwcckZx+daLHVu4vYU+xqnW7ZiA8UidjgDP55HvSnV7fcdrTLjk7hjB+grILgghxyTnJOc/lTG+YDkYPTBOKpY+qiXh4G0dWtpgBJI3QAEknAHYccD/wCvStqVptwHYj0LnA/IViHrkAA9s9B+fWkClcEqpz0zjj860WYVFukH1eHc3DqtuQQ8qsD1yST9Rkcf/qph1CBs/vUAHcA5H5msViP7oHHQn86FdQMBVOe56j6Gn/aM+yF9Wi+ptrqcCtkOjZ5IIJ/rSNqsTEASrjpgHrz3rFLjA2jGBgnI5P5D8qDtUg+UMg9MkjGPTr+tCzKf8qD6tHuzabUo2yQUBGRkGmf2lHtIBhPPdhx+WKxiAF+6c9iM800gM2dhGevJprMpfyoX1ZdzZbUgRjdAAeeD0/WmG8LZIaMAdx2/GsXHzZwNueSCOR7CkKgg4QZzwc5x/n1q1mUv5UH1ZdzZN87DBlXBPpkVGbthz5oGfQVk7Quc5AHQelABGMMQCPUiqWZ94g8L5mob1zz5pzjrUZvHycyn8CazyXIwGPtzQWkB65PcZzVLMo9Yk/Vn0ZcN02f9Y39aabgnHzNVMu4HLcY4NMMr46k/TnNWsxpvdC+ryLhmJA5Jzzx2pDKemG9KqCVsdCfrTfNIXlMntyatY+k+onh5di4ZTwADzSLIu9VkjkePIDrGQHIzyBnjOM4J4z1qp5uSfkP4HNNeYFSCSD656VX1yk1bmEqMk72LZcnsPrnrTd5zztz9areYnqBnpxQzD1FaqvTe0kS6cluiwHJI5XHfmmlyT2+magL4zyee5FMzxwT9MGq9pG26DkfYsFz6jg+tMLHqSPzqIk+pFMYkEHPHfmodenHeSKVOT2RMXOcZUUwyY5yD+NQknGSSPwqPdkk4H4mueeMpLrc0VCTNW02EgspAxyM5J465I/8A1e9W1yAMlRg9u307/pVOyZxGMEYI5Jx+lXhHOY/N2ZToGJxzjt+Ar55s67sUAEAgABepJxjikVvmzuGfTJ6evtTcFsg7cjkYA/M/59KUnaCRKM8gcYHsepqQFVlYYVhjgdc8/wCTS8tySRjnqCKHmeX55HBbAAIOeB07Y70sbFHUglcEEkckD6EjNFwHBgJOQxXPIDAdvXBA/Kkk+aQEBhtORlskcY5PGfypwUKp5BUHqSCce4zx9M0siIrYR1cHoSmCenUHPP4mi4DWcM2EYkccnHJ79M8Z6H0pgUbs7j6gZ4p8igAIoAYnn5QAf8frQVyQCwGAcjOR9OKEwGFixzuXkc4AoBJYAYIGOSOKTBDZDAjuc4/DnPNSsuCcnPGSSf8AP60xDAR1IGf6U4AsQAGJPIHGPr1oIAx85YnnGMn3603YGOcYz2YDNAhAQMqCB6jHH5ZoLDAwAD6Ac/8A1qcFBYuXAXHUjrQASCwYc9wTj9KAEIOzGDt64B4P4UFeAACMdegNIV5DBgcn1wf1pCNwJGwn64/D2oAkCNg4ycAjGO1NKtjkDB9RgfrSFCcYcZBHTIx+dDAjGACR0GQMY/Wi9xiqCSSAoPOMYNNDFiMk59DyB/k0jKcgEAjuBxg+tNAOQAMfjz+VO4h+9gAAc9+BgU0sQcAkgdgBg0YwASMnPAPb3ApCpPHyjjnnIHHf0ouMXJLDGAcdCOv6im9W75I9R/8AWpuAvLFCOM80rEKpJYY6f54ouMXIIxlQ3QkjB/GhuTkMAQACADgjsfr701g+3gYA9RkGhlyASpycZwCf8/jRcLiltwAUADJIOOT04J74/SmkYIw3B6D/AOvTTnJGHHYgA0mCx6EAZwTwP1ouAEPkYOQPfr+lIWCHBAPPVe5/SgnPXIU9CDz+tOiiNxdxRB/J82QIXcAhASAScdgMk+wNCY15EZclhgkE45zkY9OaAzHPzcdelZ/i7WLS9v5YNGRbbTrImOB0yJLhc482Rs5JfAIHQAgADknDj1a+hwHupCmODkE4/EVai2jpWHla7Z1e8g4OCDz0xRuGeenTg1Q0m6e804SykMwYruAGSBjr6nnrVzggjgfUYJpO6dmYNNOw4tznJJHPTr/9akJPXgD07UwsOhGeOmaCMjJBB7ZOCT60rgLlcgkDPr0NDBN2AS2ABnpmkJOQTnBHJxwPyphfDZBJ9Bmi4Dwo6Agj09DSMuBkjqeMGm5GMEZP5jP+FIGXaWAHI78fyp3AUqQoGT7g96jK+gPHen7kIJySfXIpAcEkggduhGKLgNAIPUc9eaCSp4NO3bgTg9fWm5yAMjnsaLi0G7mz2J7U0kDqBUpwM8ZIHr+lRkBWOAcdODRcdhjMM9x6800hSeDweeDj+lPZVJBBx6DHNMK5/iH5UDNS0UkhGwjAhTk8DgY6dPU9+9aKRxFnMk5G0ZBVSfMPoM4x9TVOyVBACHTd3QA5A9cnj279+lXPLIYhnG0EAgE5I9Rjj9ahk2SZGfLOQ7Px0+Xqfz4P5044UAKBknBOalKosZILmbJBwgK47c5z9eKQs/CYQ7RghQATk55OAT9Sc1INKxGynaflyzcHABwBjHSl2ktjYck9xgH9c0ojLLtAwc4BJ4I79hj/APXU0e1mjDQxuqrgLGQC3pkgHJ/WglJMrmNlU/IAR22kg0oUkDJ65JIyPzqQKACQAdoyQXwOvTkj3Gf5Zp8r7kB2wxheuxQoJ/mfxJoBpW3ISu1gATgnkE4JPoKjDANkMcDO7HPP+ff0qwFiA+aURuCcAg9uozjI/wDrfSkkEasCGd1IHzbNvOB7nvx68ZoCztciHmbgQS3APGOnuB+NKQCOSDz07fTrx/OpwDvJBJzwCcjqevH/ANf6U1flPy8AdsYx+VAERQLkBkYDowGAfwIB/MUFmiJYAA4IO1ck5+tS7dzALknGeeCBnjinFsRYwqlQSCODnvzjn6HgUAV42VX+dA49CCO3YjrQS2cEnHfB4H51LlBuLzbW7AJ1H1zx+RppcjByAR9CKAfYjCkkAEkemAM80+KCWaZY43JZjtAJAySfU4A/E0/DsoBcBAeAD0PtTTySHIPbGMnHpj60xjQz5Cs4yOcYJ+v4007QB8xGe2D09alKoxODt56nt/8AXpVUngEjJxyD+WKQiOSMLgxXKSk4yApXn8QM0xU3M2ZVjwMguTz7AAH+lSlQu4l+DnPUcUwEqCSUIJ6cjv7f55pjTV9iAqxxySSOSMke4Hf+macqkg4CcDJBznPXjGefrxUpAPyhiRkkHGTn65pVJZCpMiowwQHIBAOSD7Z7UBpchDFnCuzKvrySOPTNBM4BZXJGevI49e/PtUrN8wwHx6HH60BlEXMDbs53huoAIIweO4/T3pgkRMfkIiMhjOCQxAG7HoDg+xPamlW5yMemSCP8/WpD5S4YgZPI4xkeg9fSo2KGUBIlAAyTk5zn3H4cHtRqG40b9oQOQAckEgYP8s4A/DFICFOXkc4BwUweccd8Yz3qXhiSAMZAxjpn16c+9NZVxnBz0BI/p70gREC5cBmBJHOOlas/hyaTwLca/DrMVoYt8bweQ5d04V9rHjOJD0BwQRngkZ5EQbJB5xgbuue1X4tVii8KanoklkJkvpEmWRiD5LoCCQpB5IIBIIIA4qupdNpO7OT0/SLW40q8iuvNXUJ1lkt1I2lUijLg5JAwcYx1wOBkgVl3uliKxjnSKeBhGPODbWGc4ypBzggjgjg55x06m4iVpIm8qKQQscpKMggoRg4zjg5/AVFfWs0+nzQRsqySAKQ4YHAIyTx19uuf11U7NGjqNozdBPkrcWwJPlsHyRycjGcdumfxrUG/BPBHoAQM/XNRpA6Xt1KBGFl2EAcEAAAg8ccgHinj7pI7dgRzUTd3cxerAjABAOcdiRimsQOChJPAwwyf85p5UMATkE8EZB/kaaYccF1AA6dR+FSFxhYDgrIBxwRmlUqBwwI9Mc5pwXAJBUgHk+tLL/rCETb2wSSR7c/n+NAERQN2Az0wBSKEDgEEjPQkjI+o/nTyq4OQOeeDnmlkSJVBDvnHzZAwTnqDnpj9c0XKI9qhSSwPOM9M0hjLEgMGz0IOM1IY0aIN5h8wsQUK4wPXPqemKNo2E7kByMDBJP0I6Y96TY9yNkKkYAPcHNRklSQFIPTkZqUnJ4ce+BmgFhznI6Zxj8aaZOhD5gHG7n1IxikWUMOHXB6Y4qViGwQevQZ6/pTSu5sYAOM8nIouAwklgAAxY4GDyTnoKa++OVldAGBxgg8UMgGTsz7gc0wqgAG3p2zjFFytDWsmXILRkLkYJGcHrz6elaITeGcIAARjJP6jv0PNZlk5PDBMHkkA8e5wP5cCtAy7m2jAOQAwfg8YwCO2PWpe5mwVgxI2AYyRg4z+P4UqfKwLsNrHHLjqfcfWjackllOBnkjn24FQhnQA7I8HJIclgTjuRjJ9j3qbiuWiR1G4kEjKkH8RzzTtpAJPI6ZI6HPTP9KqI2EA2Ruq4ICDGD3II6f1qwuNwO7HAwGJIHGfrzmk2wHKGZSSEHOM+uOe/wCWR70Esp3bEAUcgqBz/nimu48uMp5mOhLgEkkc9Bxz0Bz05pokG0gOpPYjIHToMUXAmeRNoVgMZ4yACe4HXP8AnigTRtnHToBkDHPT+f500XBCmMIjliCpBIYHOeOcdT0NIrOzEkKARgkE5/xB6j/OaExgzIxxgEg5IByPbgY/WhpUXCkA9wQw5Hv+vX9OKRriMZRAVGcgkZ9O2eT6flTBOGGcBlTqQSf06j3pgPDJuwDzyOc9SOaAqBckFhjJGcDGcHk8/lUa+XtO8ADPBAPbtn19j71IqxMdyFgCSD3x2HPGcmi4gUFHOBuJH3jz09fQf/XoDkLyckDJAT06DOOKBCOzyEKcYPcDv9KQMdzKd/IPU4PHOOenNK4DwWcEIoJx8wIwM+w9OR7nIoMhGclRjoOQeBnnPeolaNic+YWzgKSBk9iCOnv7UGUPkKjk84JHJ6Yyfw/WmnqA/wAxuOjEghuAMfn/AJFNZnkwdqnvgE5x25ANOLHgshYAcHIwMnj6H/61NCgvuKkHuox/POf/ANVMFqIzSoSVjjIB4O7B9ORjg0Fgc5CcEgfPgDPT6DmnDd5fKsrMR0IA5xyT/Kn8khnZwAME+mfTpk+o96LoEiASptwwGQODnjGe+fb0Bp2R0BADc8Hoccc4+vb86VpSyOAJiSMjGMH2Jzn8QP8A6zX+WMoIpASM9QMfTnGfX8qAsSMXAAMYwBxgA5Hrnp+vaoi+AGGQMkFgM4PoSfy60whQhOFKEDcGbGe+SMY/H9e9I8lsqNudVXpliOp6fXsKB+hICikkqcckZA9u1IXXDH5SFOOmCf0x6e/Smlo4X6KpPUYJ59T2/nTSUKkAMCByCcAAgnjvyPbvRcVyR3B3JtyV5U4yAvcfX3pjyRFCxdVGOnIOCP8APP8AKmdsOFHPGG6e3+fSmKq4IIBPXAfnH4/hQFyQsNoJIPHBPIPv+o9KaZEV8BiMg4BGR09f8aaXRogSrFMdcjBJ9/w/Q0wEbcKSBzkEZxx7Gmg2FZ0cqQ4BOACMZHOcfjnvSKxKeWc9cABSBkH/AD0/GpAQWKEjOMKWzj1+pP8AX0FOLDAJAwMDBByfYk9++R7UXK1sQljuABYHBHA4/wDr0NgZ5BUDJJB9KkklCr/q/LIBBO4knpxjHHU/p0qEtuBDOGI4IxwfwPbI9qExbDiSuCAAoHB29c9/0NPbIzkEbsYwmMe4A/KoCDvbKg7uCAeD6dR196mVHMoVFIUKOBg4IGTjj156dPXqQoj52kZPHBOOn40g4B4GMZAJwAfr1NKJioDFoyQMgYGf5dB/hTHcKADuBIySQCcepOORmgQeuQQeoIxgce9ADbigQkt0HGevp69OKMHlghJ9CODzyeevP+c0hMQVi+A7ZBAxxg+uKLgrDpoZYmAlRxkY5GM/0P4UxlKZEmVJxwRgkDr+nNKzRkkIyHJx8uAB044z7UhYKxcqpJGc+vt1Jp3ZTsMOOAQDjpnHAz29aCoVSCVGDgYwfTmggKOWUBSRgEY9c5xyaR5QzMHILADkHJ4HfjB7D86LsQhcFjkqO3ABpoO7J3jAI4I6evIFO3IyBgc56A8gA9jTWAJGUGBk5AJoAQMFOC6DPOQM555qN22E42nnHIGalGFVSARg4yAMf4UxjswBtYf9NGIH6d//AK9O4XLtiwkBCJgMew6d+pOau+V8xLFmPIBBx/nj+VFFTIGJ5BkJPYg4yAeMe/8A9anLFJtEvnFw2NuAFySfpx3ooqUK2hMXMWQ21lIyNwyPT655NCXK7RsH7wkqCBgkA/XHUj8qKKXURIryhGbziNwADHJ3Egk/Q++B39aYzshBkDNkYUoAvJ9R9KKKEIRYmkzj5vlLFSxOFHBPb8AKa8HmfeBBUYO1yARnHT8fbvRRT6jtqNChTtBIB5baSOAMjv6U1YxjPzPkc5Ocfmf5UUUxCq7xqNrLGZMoeD83scHGPqD19qlaN87gqLv/ALowSMjAPbqOeP8AGiipAMEttwF/2T0B/X/JpJHjkQHe7MRhmzzn2yO54/zmiihbDI8QkrgdWxgdRx0yfXI5pyLHvXLkBs4UgH8M447fmetFFNiQfuhhN5CkkqpU4OBx0PHXHOaaQu0Bo0fB7k8Hv+v50UUD6AXZBu2R+XwcEZ3cZJI+n/6qAx8slicZwFXge2PTiiimIF8vdGBvAPOA2Bnrk8UgYEZQszsSPqTjOcmiipAZJMh2r8yZOAW5PH0/LmnxyLtBXzCuQOgG09sD86KKFsARNGfLXO1ckcZBzzwMdOnX6ULOQS4AKrnO4ZI689ee4ooplEPnEswwSM4JAGR3wMnjpweaR2dgzBZGBO4lmGT25/yaKKYdAUOXyQyFyQMYOc549hS7wVDJKWLDOHXHXjOR34FFFAiMuFAZpDgkADHqMenHalZnZ9qMoYc5I6jHP40UUB0IZss4WOUlgM4VB0+p9qRCJQwDKzA/KpJ5Jxz0x+fpRRTQxckoTIuQOhVjnp0Gen/66RRGQR5aqR26knqTn8KKKAEcquRIoLDsw4GOSMDIP/1vwokeT5WIAGc8AYHfp7cUUUxMFd9/ykMFYAHpjrz696eVUFxtBfOcDgDPXH8/zooqWNbERWNm+6AxAUYGB3GOP5088B1bBK8g5OAOnA9e9FFAdSP51bhNygZIGM9eevHal3MzEfNwMdQR7+hoopgNL8MAxyeSSOo6fn/hSO3kgFjywLAHqM9sj86KKEMjaWN8c7V79W9vbpVcsw+7JkdOmMCiiqGf/9k=" },
  { id: "IMG_1890", label: "Dune Grass, Denmark", src: "data:image/jpeg;base64,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" },
  { id: "IMG_1889", label: "Cape Cod Horizon", src: "data:image/jpeg;base64,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" },
  { id: "IMG_1880", label: "Station by the Sea, Japan", src: "data:image/jpeg;base64,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" },
  { id: "IMG_1881", label: "Rural Crossing, Japan", src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCADxAWoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3kRRRqQgwD6HIrn9T05EBkRicdjyAOf8AP4Vry2V6pJjdVLHkdvekkW6gONm/j7yjg+xGeK76c+R3TucFSPOmmjlWhA9CPUdqZ5Z+vNalwE84h4BGecDGOvQ1VaPaeCCPX0r0YzujzJU7PQqFDkA9aTaOff2qdkHvQVHAA6dvSr5jKxCVPpx3pCMcVMVxjsT1NJtJ6A0+YLEW09+KMdyMe+KlK9yAP60bQDnijmFZkYHHTml7ZwRinY4JIB49+KUAZ4wKlu40hhx6H0oIGT1z3p4AHfig4IA5+mKQxm3I5H5c0uM9cAU4DI9PXJpcdySKAGEDn/GlC4B44p+3IyBQVx0GOaB2drgq59MYoCAscEAClA98f1o6Ecik2Ul3AqVHTtSc5wKcSR0JFKF+b3P496V+5VuxIqkLkcegpVODyf8A61NC9/anqufXqKnoUkTrxznmtLTbmdJAkahl6ntgd6oQQSzDKRtIoIJ2j/Pat6KFlgzgRhRwO+K5K01a2520YNu+xK1xuckY/wAaUOSRwfY1CincCQQBVpfmGDkj9K5GkjsTbJI8tjJ49KlGB24FRKuDnOPTNDMcDv71DVyk0iYMBSMwquWIHPHamh93A4pco+YsiQk4ANIUUEkKAT14xTI2wcAf/XqQuAMUNWY07rUiEe3jP4gUeVGFIwDnuRzQWYnAGc9qQrIx5GadybEU0YkBAwB0AxxVcWYbOevoetXhGQck5wfSnhN3OD+VUpWJcUytDa7Tzgj0pHtwsn3QM8g9quKhXBA60jkqAMEk8cdvep5ncpw0KJl8n5nGEJwDUkd8jZOcKvUmq97HIpIILAdCOn0NUvnVcg8HggVsoKauYObi7GvLexSwsqHJwRWOjmNwVIyD1q7YwhlIlA2sDkk59O1RXdrFCSQ5BPIHUVUOWLcSZtySkyxZ3Ksx3uQc5HPFX/Oi/vCsBeBkYz60uW9DRKkm73FGs0rHQsiP15FRPENpAJGetUre9h3l3Lhsc5BIH0xUxvI5YiV8wAjhwD+Y9awcZJ2OlTi1co3eirOcwvtIHRgSP/1VjSWvkXXksjPIOyHOSenaulhkcwJI+Q46g85Hr7U+ExNL5xUh2GOR29K3jWlHR6nPKjGeq0ZyVxEFk2mAwt6HP9aheMq2CMfTtXY3hkaJgsKOCP4+hrlJoysrK42sDyBzg11UarmclajyPTUrFSOcAikC5HapSDjkUFR3Gc98V03OXlREV4GfXvSbfYk1Nt7kf4UhX5fQD0ouHKRBe+ffrRt46jNSbc+uKGHHqad0LlIsHIBGBQcHJxz/ACp5X2pCM9hz1pk2YwdP5U7PHINB+nbFSx20sx+RM9uT3obS1Y0m3oRZ56/jmlUFmA5+o9K0rDR5rokuhSPBAJGOf6/yqW90lNPjSUuZMtjGOo9BWDrRvZPU6FRm43a0KRaNbIoEJdu5HPXtUElvLCqs6EFugPUfUV0MFrFcCKcLuGMlSRwR/n9aszxRSxGADYSMDBwKw9vZ2N1QbV7nMR2srqSIyQBk4HatvS7ZEhDqQH435B59Bz0qtKl1YoWljDKTgOp6855H41XGoThdoYqCc5BwfpVSvUWj0FHlpu7Wps6ppgnVZE2RlfvHGOKzRpb7ziQbR0OOopyXEt1EVlnJXgEE4Of8/wA6W1UrKF83O4nPPXHt+ArNc8Va5o+WbvY1LfZBGI1G0Adh196m8xW4wCO/FVlQlckYPpUoUn7o5A7VztXdzqWisickEjIHHTJpVIx1NVXYqSDx6DFIJDjqcVNirl0MAT+tKZQOnb9KzzKd3U0okJ7HNHKFy8Np68g+tAKA8DmqSs27jP41IhYNjGccjFDQJl1WHXingrgDiq6MSMnGfWpck9Mc96hopOw4MSxBUgDvnrUgX5fUYqFWORzxUwbjmpd0WncFXAGTSjOecUinOaCwHU0tw2HU0kE01pkTqRn0zTJLqJOHYKfQ9aLNg2kSZAXnABrOvUhjIYICRnA/z7066vI3hwrkEnsKo3EwmIOTwO/c1vTg07s56k1aw0TtuyABg9RTJJC7ZJJx60wk9Md6aPXNdaSTucrk3ox4IyKMj0P6U0EDPFO59D+dFiTTbRxjiQtyODwP0q5DbFIwrtkj0HT8asUV57nJqzZ6ShFbIha1hcAFBkd+/wCdM+xxbSpGRkEAnOCKs0VKbXUppMjKkjGOK53U9JMO+dJNwJyQRzye1dMQCMGqlxbGU5LcAdxmtKVRxd0ZVaamrM48oO2evpSbMd8/jXVx6bBvDuikg5AxgflUGqRosBAgUZOARgYNdqxF2kkcTw1k3c5kqe3WpYbSW5JESbsYzyO+cU4oQRwQfp0q5pVylpcsX4VlxnHXB/8A11vObSbS1OeMU5JMpS2NzC214JB74yPzFVypyQR2/EV2trcx3UZKOGweR0xzVbUbCKZNwh56lkABPtnvXNHEu9pI6ZYVWvFnJFRmkK9iOcVZkjRpSIVYD0PJzULLg4PXPeuxO5xNNDVh3NgkADvU0EYMqIWKgnk+g9adEApDDGQc8irRbcGfIUgdAOv+FRKT2NIRW5uWU67RGjmQLxycmqurttCHbnByM8YI6VXsL9YNyupOeSfypLydrlyDkLnIBHt1rjjBqd+h3OonTsQRPsZTExy33gBwec9q0Htr6dlkCKikZKFuR+GKo2aiK5WQ8hTnHfNbkd6jAEHPpRUbT0QUkmtWZ09lezxeSYwFx1yMfpWVFYu1yYShVgec8YA/nXWCYHrisjUR/pCzISGB5I7EUU6ktUFSknZjLfT4mnBWX5FwWU8kH09K2DZQPGFCKoBBBA71jxTxs5L/ACk85B6n+hrUt7gMMgj3A7VFTmve5pS5bbD1slC4LHPsKkjURR7ccZp4YtzUcrY9qxTb0ZtZLVEdwnmwsO/UGs0tgkEkexq+ZkBCk4x79ari1hkVmDMRzn/CtI6bmctXoVmYZAHHapI2zwcfX1pjW5VSVPccdcCkj3KwBBP071bs0QtGXFU5IwMVYVNx5BJqOBgQMjrVmP73THtismzRCrEMdMHFPEYwMjJpygjOadWV2a2RHsCkHGaXvkACnEA9aAAOlK4xjPsGWzjr06VQuLvBJQgg8E9gK0iuTnNR+RF8v7tfk5HHSqi0t0TJNrRmR9qKj7oLjoT0FQlmYl2OSTkmtlrC3dslPwBIH5U8WluFx5KY+grZVYrZGLpSe7MAsc4JGKac8gH8q6JYIkUqqKAeo65/Os2+08xgyxDcCclQORk9quNZN2ehlOk0rrUze/pQev8AjQwIJByCDggjp+FBGCM10mFgHpz9aOP7woJA6/jSbx7/AJUxHRxzhuDxin+YCe351nowboRzViNjnI6dq85xR6Kk2Whk+tKBSKTtoGc1maASQMgA+1QTXGxSHUrx1xx+BqwG5xjFKQCOaaaQmrmOL52lKS5UDpxg9e+anYteW7JChAI4duhIq1PaQ3CgSIDjv0P51KirGgRRhVAAHtWjmtGlqZ8j1TehhjQ53Y73jA9QST/IUw6HceZsBQqRnd0H0I610IOaKft5rqS6EOxzO240u5UP0JzgHgjufwrRk1mJQAEJyM89vTitKSKOXHmIrY6ZGcVSl0i0kbKoyH/ZPH5Hin7SMmnNE+zlFWi9DEmgFxKZQCiMSSAAOevGeKrRWk08uyJCSTgnHA+p7V0D6PEsBRJZA2c7ic8/TgVZiQxoMhc45KjAJ9cVr7ey90y+r3ephxaBOIpWdgHUfIFOQxx69vSqBSSPAdGjz/eBGcda65nIycZFY2oXAvNyKgJjJ+YnkeuPXpTp1Zt67BUoxitNyjDCu7l8Ae2TTiwV8ZyM9RTFO0YH68Ukjg/h1xXRuzC6SJx1JBHNSQTbGw4P0qgZTk4z0zViBVYAtuJ7DtUtWWo4y10NRJgykDPA6E5qtOxYFCcAHkZqe3UKPlUYPX1FNuoy2SVxz1zisI2TOl3aM7cFbg8D3qaGZgcqzYJ5xSS2uxgxIII4qxBETkR4A6kH9fetW1YxSaZZguyr4wfm981cLFl+YAk9ulZO2aFyduQO+OtPXUJSpAAOOBnPFYuF3dGynbRi3ksW5suQVOMEHrUdrexJHtZiCckjseTj8cfyqncTGSQljyTnpVcnnAGP0rZU01ZmEqjUro2gQ1sHBySSSc/nTFXPoDmooiUjAGSWGSfenKcMSRxnsayatojdO+pcj+U5PXNW45Rg5qgXJwB0p4mAx0GPyrJq5onY1VJIBzj2p2RnFUI7jjAOR3pGunVht5HWs+RmnOjQyPUUhYeorLa6LE5JP0pwuCT1x6U+Ri50aJbB6UBgTVOO4GASc/zp5mLAgHA70nFoakmTl8N1oEvHSqgmRjgODj0NKLqCNtjOAT054pqL7C513LYbjilBJ7j6GoDdQLHuDA496SO6idgFY5PTIxU8r7Fc67kV1Yo7+b8qnOSDwD7/AFpQIRahXjUKO2BwfWoL+8BBgHOSMkHtWeJHUEByQRgjtit4wk0rnNOpFN2QxlCuVBBwSAcdaZge9O5Jzj60bR6n8q60c25e8iZB1Bwe3WpYndGAbg46VeWJFHTn1z1pshQgoVBGOveuHmud3LYfBJkdc1MDVAAxHKPkHsakSdmAz/8AqqHHsWpdGWyRnmm7sDJ5poIYcEUuwMMbjmpsir9hvnAE5NBmU8A5pDCccYP1HNVpFZDznB/SqST2JbaLQkGeopxlC8E1mmQnBJIPpUiFmAAyTjOapwFzFsTbjtHJp4BA5PNRRKEHqfehpPepavoir6Evyk4ByfrSOwxgColG7kECnhPU8UrJMLtkTfOCoyCQQD71zVxvhndWxvBw2O5FdUwESliRgDkk9K5y9trm4uJZ0hd0LHBGDwOBgenFdNCST12OWunZW3KBlyTycnrTTKevA+lNY454phbrnjNegkee5MkV+T71YikI6EketU1Izk/nVqDYvGCT2IpTWg4N3NGC8MYIIJPr/SpTd7lPQk/pVOOaMQNG0asR0I6g+9NiYKTnB5781y8t9bHUpuyVy75TzgDeq9eCeaVbeW3HJDdhjNVhMFOQcEHOKm+2sygA4I/AmpcWi1KO7HzSlYSN7At1BGfrVMsc5OPTIokuWkLbgMHk8d6hRXmOIkJIHIHYVpGNlqZyld6CtulOEQk+gBPFPigZSGaF8E4wUIFa2mIIYdjFQ5JJI7+nP5VpeYgQFmwBySTWUqzTskawoJq7ephbQeRnA6cc5HH41BJdJCuSec9K1bllaYhWABwfbp2+prJn04SOCsmMkkk9cZ7fSnBpvXQU00tBbW6e5BIAAHUEnP4U9p3iJEiEoDwwGQQfWkhtUt2JBOCBnJ4qRmyMEj06Zpu19NhLmtq9SWKbIByRn1xU5kR1Izg1QVi0oC5weAAOp9qnlgniGGKJkcckk+/pWbSTsaKTaHK5zgLg54zzUqsR1A565FVkBU5LFj6gEDr6VKrDPOT60NWBOxMDgdenr1qvPfKp2Ic8YJHaluHKwsV4OOKzAd2SeeauEL6szqVGtESyS723DcD0Gev6UgYkEkk/jmmgDOTx704AfWtkrHM5NjgxzjJ/PpTgSwGTk/Xp/nmmgYOPenDgUFpuwo9/T8qDyDxTgCeeppQORzmlcoaBzk85ox7mnBQCOMfhTufelcVjUkm+Xk4PXFQNcDB5+nFVmmLHAPSnlEePOMHHXPeublSOxybHyzbgACcmnQrK7AYJ45wKSGNM55JFaakbegBxUydloVFNvVkaxOAOfrUoV8c4pwIHcUx5Ru4PNZXbNUkiQsFHNVJ2DH2oeQsD9KaoBiLscDOPrVJW1JbuQrtBOMe9SqyKeMYp4tcoQjKQccmpFtUUYK7jnqabkhJMhaQbcDOe1NjBlk2kkVbaGIHJUZqMlEbcvBxjpSvfYLNDEJjfBAIB4PtU7IXAKPtwc5xmqzTIW5IB9alRwp68HvSae401sJJah5AzsxHdcnaT7im3N2ltgMCdwJwBngdTUrSFuE5/CqV8krQFlK5AOSeOMZP8qcVdq4paJtGJfxWxdpYpAdxJIB4JPPTtWac56dTU7FWUkAktzknNARduTnPQ/wD1q9SHuqx48/ed0MVOM57cVKpIGen0pDyc4GPT0p6ruHAJqmwS7Buwcjr7U4MMd/wNNK4OTx+NDMMAAcD0qWk9i9hxcgDH5mkDHOepzx61GGJI6f0q7YtCs4MqiM9VJJ6+lQ/dWqKgruxYjt5doTZl5Dk5xgYHqf51Ys7aKBXVyAxGc5zjj19qtiZZ4TIrEjpwcVTKhSWDAsexHGP85/OuXncrp6HYopNNamjGsDKgABO3GR3HrUFw20FCSc8c/wA6pi4eKcZcBgORjH5im75JxvB3AnHHP1+nWoUWnfoW5J6EjoVUMCTu5+lRMwByWAHtV46bA8PzMxcjruOAfUCs6ZIoUkLPll6AetXBpkSVlqRCUuScEAdM8ZpGcDGTz+tPs/JnJ859m3oAcZ/E0l4log/dZLdm35xjtzWqSvZoxb929y/BqAEYQRBB1HIH5CoJ5HklJLZ9DzgVlAkHOeR6dacsjjnJP1NV7FJ3RPt21ZmgCykgn2GOaUMF5JA781QLu3JOSOntS5J4JJFDptbg6nZDp5DLKSM46DPpTQCGyTzTgM9RzQMHtV7Kxi3d3YoB4yfenDvngfSgLz0pwUk8/kRQNJijHXvUkMTTyBI1ySM4yPzqMKSQAMnPAHNadjmCI54ZjuIxz7fyrKpKy03N4R5nZ7DotLAwJZcHqVHp9as/2bb4AAYYx36/Wkj3eZvcNyeCe1WgSQMVxylK+52RhG2iKz6dAwHylceh/wAaT+zLf/b/ADq4KKnml3K5I9jkxKqqGD5J6g8U+O824JBI9u9VCuV56HqKTaQuBn6HtXouCZ56qM2IL0F8ZyDV+OUvwD+IrnYsqQc9PWtCK7CjAIOK55wtsbwqX3NpchiG5GOKgmf5iB1zwCaonUiwwW59aa10Tkjn8azUGtzZzXQuFhjBOSfQU8OnlBcnOc4/z0rL+0Fic5B9KlW8jgYNISSfu8Z+tU4MlTXU1ol8qPGSe5oeZYwCzAexNZMusjPAxk4wRVWa8SYjkAqc4JFSqMm9RutFKyZqT6kg4UgkfTNRR3QmJGSPxrMdVkdXQYyMEY71ZiAjTJI5Geev51p7Oy0M+dt3ZdIQMBwc9SetTqiKOmQBxzmskXqK2WBOO3pUq6kinPoePSk6cuw1Uj3Lj3DxsERGOB0wefbpVTWJJRaqCrqHOD7gjocVOl8kiEh8Ackk471FLqNo2A91AwY4C+YGJPYYz1/wqV7rTaKfvRaTMdbeWRdwQkE4yAetNMRXqB6VvJdxNIEjDhmBIBjYAgYHUgDuO+eawNR1O/ufE0VlDLaLYiPMoeFnkOCCxVg4AGDgcHBBzkdNfrFt0YLDp7PUUqFGSc/SnBgo5HI7VZuRBKqm3XGBhsD6Yz+vNUpAVJBzx3FdEXzLU5pLlehOty6AhWAB6gjI/WoCwZxk43Hn2pgxkfoRU6iJWA2s3PBAJqnaOoleWhqPosX2YSJMxPBJzwR6exqaS9tN6wBVubqAB/JjK7kBGATkgAH39q53xP4v/sLwxdXoCmVAI4QRkFycDI7gdSO4GK8Ni8Xa8k8ksWqTedISztsQliT3JGSM5OOmT2ry61SSdnud8XCCvbc+gbjWNWS8IPh2WSPGfMju4jjBxjBxz3xnpnmpbPWrK9lkCDZNHxJBIu1k9yASD9QSPfNeB/8ACxfFcKBE1eQ5ODmGPIHoTt+gqPTPG1/b6ub6eQSzO++RgME8YPA46egAI471iqri11RaqQlpax9E+VbXs4kZixAAwCRgD0qVJ44SUAQKDjAIrnradZoI7iInZKgdSD2IyKeSWPPOPevUVLmSd9Dkdblb01OkF7AoBc7V9+OlYV4yy3kskfRjxxj9KiBOCSfxJ/zxVaTVLKK0NyJ1mjBGTCQ+ATgHjtnv2wc4AJEt08PrN2E5yq6JFkLz3pdp5z/KiOSOVgkTMTs3coRgcDkkYz7ZzweMCnBeCcYrWFaFTWDuZSg1o9BgXPQU4KScfiRTwo7YoCn0HtVuXYlIQLjn8cU8Lzk4PtQB+H0pwx6mpbuMAMkHGRTgM9OTSKPz64pw6HOTigqK6gAM9qUdODyBxjtTgeM9PejHBI6Y/nUtlE8EkCR/vAQ+TyDgn2rSglDhQBgYxjHT3/8Ar1igDOScgdvWrIvpiuNwxjgEVhOF9jopzS0ZsL8rEFs88U8NgnkEfWsZbuViMkEU/wC1FiATgevesXTZuqiRrGZVxkgCmfaR7fkay5JzgAEknsab559T+lHsmL2qKkOnSv8AewuSBnPT/E1f/s62hQmRDIe5LEfoKrSX/lOAEBwM9c1C2oSO3XA9Ov610NTkc6dOOm7JbiyiJBgJTrkEk5+nes6QmOQrgZHcdKma7lYHDkD24Jpq200y+YACM9SQM/nWsFZe8zGck37iIxcyKoAIwvoAKGupGJPRSeg4pjoVYq2QRnvTGBweDgd615UzLmltcDKd2S7DjnBpsjFmOCSeeSaXHt9aaV9ePxqkkiG31GsxYgnPtSo21gcA46A9OlKVAJ4zSgc8j8KZKuSqZ2TeAxRSBnsD6UpmYqAxJ4xknp9KFlkUDa20DkAHGKNstzLnDOx6VnbqzW/RN3Gxq8hCqpJJwAOasT2c9sFEiYDdMHIHsT61GvmW0/IKupwRnkfjW1E0V5abwMt7nof61FSbi01sa04KSae5hz2w8yMTwqxQlkLKDgkEZHuQSPocU+dLqO4tomDIWkAUE57HPT0qzJGsJSRyTtIzxgCsvxNqllNbKnnxR3ZeMxRy4YkBwWO3PIAB68EjBB5BxqVOWN3sa06TlKyep0U1piWGKFzLKGJfe2AilTgnGO+MDOTz2BIyG04xeKoIWlLg28gEhABYs4JJxgZJJOB+GOlWrWO08pXtL25SEnIIuGfJ753ZOc9c85qq0hh8a26G5lmU2TSAuQSCJBwMAdc989K423ZPudqSvbsbaaHb95ZG5BIGBkeh4/wp0mhW7REIzq2SQSc/hj0/WmLqBEhfjGeanF/5pBVsY7DtWt6i1uZctN6WKMOhOsm64dQgOcJnP6jp1FakbKqhGCpxhcAYUY7GqrXigYLkn8aab1CNpcZzjHpQ+aW4RUYbHP8AxB0K01rSrO2uUkMIlZh5MgjbfsOCTg9gx+oBzxzwUXwp0UNvF3fJxwQ6nufUemD2xkj3r1e7tVv7IwGTYSQyEDIBB4PH5EdwSOM1hFXjlEMimOTnCE53Ad1J6j3H4gHIHPKKvqa8sZatHED4T6ICCb2+YcZ5QH8PlP5+3vxYi+Fvhy3zma+IOckzL0PXPydOa7EK3JwMAc4HSlVTeRiMITCwy8meHHoPUHoT0xkdeiUUJxjFXaI9PthbaXaQLu2xwoq5OSAFAGT3OAM1YEfGe55qK71O0tbK5upZf3duu5mwcEkcAHGCSSBx6iszR9YZ9OM+XvYHcEShlyCQCQcnA6jA7Dk8cjeeOp0bRbumcPsnNt21HeJboW2i3KJdLBNtUklGOUJwwGAckgEfUjJGQayLTTli0557B4JbsSFUwDHGeOU7kEkkEEYOTjqafq93bS65Z3U5tpSEASEBgyvuyCxAORgkg8AjOcgjObJPcW0EMNtavHclxIhjlzEuQQMgkNnJweSG6Dk8eRia6rybvob048i1RraZNMJJ4DcXDzKwJJO9BkZ4JIOAOuBkAckkcdDZTFyYm3ylSR52SwPfByODyeM8AD1443QLBLm1tZrZms4Bb3InjGMQMCgJx16cqMD7gyACTXVS69FCglRI2t1lCMVONgPABBPBz27emOmuHcKK522E7zVrGkVx2IoA46frSW9xFdLlAQckAEg5AIBII4Izx9anX5GBIBwc4Ne7TqxqRUoO6OVwadmRgZGMZ9hS4wTzz1q090XUDYoIPGBUTHcc4x7DnNUpPqgcUtmM4zxiq9zqFpZrIZ7iOMxp5jKWGcdsDuT0A71Fqd6I7O7itHMl6iEJGgyd2BgcjAPI6569DwDwM91cjVLm3vbogSOZGadFKEEcDAPJByMEjJGB6VwYnGqm7Q1fU1hTurs7u18RaddLMYpGcxHBVBuJHqMHp159qt318La2R4gGklJEYdSFJHUEjpwDg/j0rh4IbO01IzrciO3ntxNHMFIU7g5JUE8nAyQSBjHQjB09RvF1vTpJbC5uLaOARxvNGpAKA8gA5JbHIBA4JOeQT5azGpZpv0OhUl2OlsLtb6DdkCRSQ6jsQSOPbIxn1Bq2FOT1weOK840nxFfyXjTXNyLCK3Pli3kKoyAjgtvIJPyggKCME8YxnqLjVL5opkinhNyoR0RXLM6EklggJIGCCM/Q8dd6eZcqtUV2S6Sbujf2nGc/hTJporWBpp5BHGMAsxwAScD8ycVkLrM+5tksb/KJHjePa8IJBx2BwDzkg8Z5J5r3ipqckcd1fqsnURpcFEYAgngHJAIByAMDgk9RpPNKdvdWovYO+5uNdW0U4ikuYlkPRS4BBGDg+hwRU+welcbYaXBDDGZ9PaG5VxGCjF24JAbgYLAZPAPQE4xxpk6vk/8AE4g/FGB/LdWcMz/mQ/YGmqFuSePc4z7UpCEDCkYHIJzShQCRnr0xzijaPUmvfOF6aDNo7cGkKjaOR7ZFPKg9/wAe1IVGOnFAtiIrkkk0nlkHjH1qUr70m3B5/Gi7Fa5EF444/lRtxyRxUhHGMY9qTH6etO7Cw0IWbAOPxxUjWhAyHjOOuGyaQKCOxAoA/wD1UrsaS6iGIrkcH3BBxSKWjIZSQRyCODTwvtjmjGeR196G29w0WqGOTI5djlick+9SwifcBCX5PGPX8ajAGKcHdQACQB6Gh7WGtHdk09jdhC5KuSBwDkn9K8Q1vUr8fEjU0+0zARTNGFBwAFOAPTAr2kzTMAplfHfk15FqfhXxA/im+1QaLdTLcTPIixzW/Ck5GSZM5x7CuDFRlKCSVztw0oxqXvY7HwVeXNw1/FJKzKpjIBAwCQQTwOuAPyFdBGv/ABXFsSCCLFhgjv5g/wABXM+GZL3w3Fd3OpadPYrKYgGmuLcAAEg52yMehzjAzjAycVuDVkk8SzXsYaWK300ybiAA5DEkDJwMDAye59s1yQrQjTVOTs0dM7SrOUdU0dLezSwsAkQIIySPT0NVvtMrRh0iAQnBxzg/SsldfivmIVGMiqCI2O0nIBxk+x688giud1rxMl0Lu2s/tUYsirTYYwkgHnJPGRjGCRxnvxW88ZShT5lqcbUnLsj0NWTAAKkN1BHIqrcTeTMEizgAHr1rk7XU7ttQAcPIqrx5bZBAwRg9CCMjJwQQRjGK6d4ztZycgDJJPGPUnpj3pYTFQrt9GujHVTilYsQ6hMFLOu8DjIIBH4VI11bXgMdzAssTEZSRQ6n3IORVHyyCeCTj07UyWRLaIyyOsYHQt0z246nnsK7KigotsyhUmmkReHorAaFbNLaRzzAth5UDnOTjGQfbFZfjfV4LiG1hk1T7K7OYysQDs+SBgncAmCDkkEAE5xjBxPEGs3Gl+H9Pt0ufshulJD5ABzvyDkYIyQCMjj1NcZd6hqM+ri8iuZLZreNYkedShAyckIBhCMjHoMDJJJPhSxCdPkivmd1dtVHfY2ZIr2S4Is4WaygIkwQ+IVUBwPnH3SCeODwRkY5p6h4ju1W3a3kmjmQkI7osbGPIBIGNoAO7gcqGOTyAIdT8QDU7SCzEzIYwY2dQQ8wHRiQegxnBwRwck5zg263szCCCMvEwLF4o2xz0BI6jkjjA5PTPHKqd9X0Odz10NifxBMl9E7oZZGwXMaZMw57kcEYwCQCSAe3OvFrF9ri20trKZJo/nEJAJLAjgDBJJAAHTjPU4B5QyC1jykrrNOTE+MAcYGQByDkEknqOMZyTp2bWi6ZFapcCNYyWeZlJaIErgbQctwo6g88gA8iZxStYak27NnQade3VlDeXKxPak3GJg6A4JBBwOueASTnqPeqAuntpTbjUGlE/mhgq5DglBvO7IBwSCRk5GOhBq/oN1cPZGFIEmMc7jDLnzWCEAnIwQcgAkgHJ/CxaWlgulR6rd2N3blyVCx7AECsCItrAbBgk5OeAQSPlxi5uLbKs3obnhe/tNOVbZ54zJsQyDB3KCGYcEA5IBJBGcflXQTa7Zxtn5igzvLFU2+gGSMk9ugI7nIzzzalpmpyLFFdM4CFUAIwTknK85BBUHII64yeMV5YYre1EM9wGViVTzFMRwcYOQQByRkEH1CgcV0UcdUpJRWxTpp6s6mPW7SbVTYRpIXUAmTHy4OMEHuOeSOB9QcWtQu002wmuZCoKKdoY4BbsPxP9T2rhAtzZESQmGZ7VSXTzPJdwCQOAoycA5PGRjkitmx1aPxDoF2t3IklsY3UyXCCNI3A+UkjBIyQOCD9MivRo49zTUt2ZOklsV7xjqXhq4uBNaHVIwk7hYwdhJAAcYJII9SRwCOcEc3Ppd1Yy3Gq6rqP9qxIhWM24LLCuMlm4PyABgQCBweR2q3SXOgSyTJLMU8x8AHKTEMQgA3A7e+DzgDjGMz6f43u5ZD9oE9zGJjHcCQgRoGByGJIzkAYz2yOma8+s3N3S9X3LTXUhs/J1W38m6SZ4sARTG7ETQqACCN3BJKjIA44AB5FamneJrTRJLrTEhYLaOUMjIQ7Y7gMTublDtAQZ6YyMcOdSMd3cx2EkkHnTsgMJcyuhLEA5+Yndjg8nB3H10DbwLawyr9tjmjId2mQgqvJOCAcjjJyMAE+lTyLrsSpvodqmo23ieOJXt4m1SDOw3DyLlCCQw25OCQOMAgE84JBit9StILhrSXTGsGV2bIhDibBAYEbyVHHRTwCD0AB5BbqW2mhjilSRnIlUSA/OxAcMRtBYnIPTJyBwcCtbw8v7qd4JzqVsoBmt1iWQ7XAU7dwBJB5KrwRg5JxUOCSuilO5v3sMVz4gUyymO2uFTcpmAa4IGMEk/KQCOCeST0BOIYoRpGtC2SWGWRmIM0wIKDBwhHOCCp46YBJA6Vm2qw6rPLFpNy+nmCQxul4dxKgEAgAZDAEZz05I56ve01DSbiZrsW7lULLsGRIACTjgA4z0PTjIGazsrWZd+qNOfXZ11QWkpnjMZVAYXDNJ8xUEheDkg/Lk9MEjPOgdZswSHtpww6hoxkH3/d1l2LXt9aCPULZ5cSfI8MgJU7RuZSQCASdpBGQAQRgkjo4tRskhRYpYxGqgJiNenap0Rd2+p0Owg8oT9Ka2BxjBFWQ3A5FAbuRwPXtX2fMcnImUioJ49eeKXyi3QcVb2r12jgcCmlsDHHSjnfQnkXUrmHjkioygUjB3Vc3A54HWmFQeMD15pqb6g6aexU27V47dKQjqAMVaKDIO3+VNMXselPmI9mVypx64pSpxjkVOYzjpx+FMxjtz06U+YlwsRkduevrTSvGM8HtUhA44IzSEA4Azn0NF+4uVEZGAfXvQXLHOAOOwxSTyw26hp5UiB6bzjPOOB1NZOs67Bp9tmC5gL4OWMgGzBwOCMHJwDk8Z6GsKuKpUk3J69ilTky3PqlpBcNA8heYLuKRjJAyAM9hnJ/I9xVPVvE1ppum3M9uRdXMSpiIZwC5wMkA4A5JHXjHcV5tPfRz302omCW31Bn3+Sgd8jAJlAGTt5J5Hck+gj1PWEdLaK8SeK8CEvG52JMB0diAODggAjGemCCK8aeYVZNqKsmbKnFK7OktJpfEelz3ttFbxzRkzwrNCJNwJJYAk8Z6jkDtwDmrfhZpYRfC5gkCxabKDCQVIHmOCo3E8gAAgnjA6DFcwPEUk11HPpls88MI8tsHcCDgZIbqexxk/KMgkAnpvDuqSX1nqr/ZhDcwaU44PzMcE5IBwM54A5GO3bipKXNrY6qbT1MO7uLnSdDvDOt7GbYgwmNBlgSclmyCOckAc5YE8nAxLS9SSWeK/R2F6VkSaQbnDFQoIXOCCM4ByQMYOMZ2by11loTexPHZSxxjEgYyAKE5QqM5YOwwQOAMnAPMmi+HLJbIxOt2Q2xpI7p1UkEA8FcAFiQMkkYBHJUmoc1y2aMWm3oEUbwvcpZ6jGDFErRJE4JGQxL7+MANuJyOMHk/LXQafeM2rN5sszQtEmJA4aKUHkFcAEPjIKgY4yQQQTzGqXFrolibi0tI4xxHC5ILEHsmQMAjJyrnBAJJBIHKw+IJpb52vZbOSaMnAMmZNgOSAQCg2gA4zj5cAE80oUpVE5IrmUXZnpM99crqEYTWdtptATdNkMxJInQjJf7wBxtAwRzgEUtd1a5utWBunuIjawiRfs64TcHYchgOSQRk44HBwc1m2euQ2enCWF47qeeMiSaaNRswg4BBCjIzgAEZ7kDBxNd8XH7K0Yea2w5MgOMYJBH7vH+yCQSR0wAKEql+W7aByje50PxDurmBNLsllBt5dPSeQMm4KQ8jAjnO4EAA5HYHgmvO2llWWYtNkA5y5Jw2cdCc8DPY9cECuz+J1zG2raNFJyP7PTIDlSVEkuSPU8Z5J6dBXOzQwTWwvVEUaKhjhikk+eQjGQQM4znknAOGNdUbJKy3M8RdVGmRtJcEo8zwgFBJgMWADDBBJHBwSOO5x6YlS3urWIXlsfIhlY+YwUEEjByOOOuM5zkr3AJzzLIt0JXXyfLOSEJUAgkAgAkg56Y/EcitoLd3umXskQiZY7YSGJSBgAAbwueSPLOSM+/XNOSa9DONmNsEu9d1WVxLDGWJcvgqAACckkEgAgKOp5AOeTS6qqQ6nDFFMs9uXLrMgIL7SQQRnAHGOMZ9R1HRaZHpgtVtp/PgkmzDJtaNFMg5JDk5ABBGMAEjIIJGdOws/D19oip5FoXsldblGG50GMllIIwMknOCMgjOOTi52d7aGip3W+pmLcvceZdWWoJBdSbQbaRw/mB1ClATkAnC8jGSeSMAHrtPa7dS88UlqVO0x+WqrKpHyggYJxyAQT1BA5BHn0virRNEvZvsOjwrHGyhJATvZsZyNxYgcv0IBwBxwa5q48Y3txbSROTIksxnQvIxZCc8ZzzgfLznIOeCARDw86mqVkUqkY7u7PX7vSbKGdNTg06VZILoyJ5MZYyFxwGwSQN2OQMdcDGMZsemLb+IY9VGpk2hBzbQTfvY5DyQGGCUJycEZJHXJ5wZPEuo2fhz/AE3V1uHeYQbbeQF9pUAgEqAhBI4OARkjHarpPinRLRJIpbi7Z1I3GYmPLAAZIToAQDgkng/NxzKw9RJvctzi2jub6e+02Imwihmjdz8kkZgKIG9wBtByCc5AwQB1OL4llm0jSTdtAvm3QUAhzhyApcdeWJDHAGMAnvgcXrnja7vr2SOKRlggcSfMDmQ42kMSTwAccZzySTnI37DxU0vh21mOkW1ynmiJ4Sg8tQMlcBjgtgcYPBwOBgVaw8oJOxLqRldJnOec92huioSOEABN23BJJOCx5z3I5ORnrzraDPqlzqObe3SUwwAurxAgI3AYliASckBcEHngkknX1HxcEuI7+CztYY4HaOKWRAHICIWAbBIGMDjAJ4IFc/c+O9TkvoL+5mE0cQZ47cliwBAOT2AJ4AyCB9ADolKaslYztFNNsWW/S9EiOSkiyMkbDIEaDAKnIyAc5yRxycgHiG3uhNFPAZIY4Y8KzSMjtnpgHIyDjtnHoMZHX2ni3T5bS2ubnT4b2y2EzXD2oLQkgYJABJDZ65PPU5xV/ULvw5Np8caJHALdDcpFbOkYIBIcKRwcjJIHJAz1wRm5yi7OJp7NPVNGLpWkXi6et/pIuJpiDHcQEBnhBLElgQOMHJII5I9yKl3oOq6AYZ3sLmHDqTe20w2lQhBUKCQDgEgg4wOc546CKwsNRsJPskstlJdtnyY7pXQgAAjIBIByG5BIJBIXPGnAX0mUJOk92ZkcGWeGSQuR94NkFcEAHgYOcjgVHtGr3RSpXOY0j+z7je00NxHaIm9jtL+WWOPNc54f74yRgEDJOSRav7y/DTaTcXcPl2oR12Kx80EEgkZyCQRkDBHIHUGlk1TRtPv4rZbK3S2lICPbSgMCNww8bEkgglcYwc8kEZGxa6datd27rK90YURI4bnYVMYLkBAAcYDnAHIC4IOTlPu0NR0snqcxqHia7gkRAi7ogokAOED4GAcnAIBIIGPcdAKv/CYFuXgiDHqCGOD/AN81va/Yw6ldwmWza4MBV1SMAicZIA5wQudoJXIJOCARipDe2kLGNNP05UT5QFKkAD0NWnG2xm4yXU9QLn685OQKC59P0/8Ar1lnXtMBJFzvCkglI2IBHbIFQL4p0hgP9LdSRkK8LgnjPAIHYg469c9DX1HtafdENSRsl8g9OKPMOM4/WuYXx1pA077Rcym0mHBtnwZAecDGcc47kAEjJ5GdGDX9Nnt/PS8jSMBCxc427yQoOe+QRjqMAnggmlOD2aIba3NbcfzPqKN5znkevSuP8XeIoIdNks7a7tzNI5ilZrgRiEDBbJ5J9CAD3z6VP4e8U219EbaSa2U28SkuXYZQAAHDAck8c+h5yCKyeJpqfI3qNJtXR1G4gDk/j3pd5AyTURwqgsAFYgAnuSQAAe5JIA9SR61Suta0yxuBBc30EchQyFC4JAAySQORx0B69Bk1s3FbsnW2ho+Yeh560hcdO3rXN33jjw9p9mbiXUo3UNtCx5ZmOM4A+mTk4HBGcjFZrfE7QPKiYPcvJKm8RpGCwGO/OOuOh75GRk0OcF1JbfVnZl8c55FYXiV71LdDbzCOFgwk+YKQQCRyeRkA9M4wDg9Kxm+JmhK2P9KKquXYRgBDjkckZIPB9wSMjBOZ4v8AH2n/ANlwxWbtMZJMsjoVIUZBIIyecg5HbA7sK5sTOEqbVxxdmmZd1fXMpF1cz29vaRqwYBmkeXA4JR8gEEDBbgEHjOAMLWden14xxSCSVVwoJQxhAMZJA5OSSc9RnnkVLqetDULQRGILNKmYVc7mJGBjBJzkEgZ6njr0ZBpdqt61nLdLcx/aBHKivhwTtOQTjJ/1gOehGCcV40MNe0nuaynrZMnjFjaLZ2VjdJc3Jd8y2TiB4sAsd2SQVwDklsAepAAydX1kNbvaXd5Df3UKKRMkIxFliGUSEBz1AIIA5IJJAzX16FIotQGju4hgXEqyEF2ULGC4wSQCXYkDgAY4xXMx2Ny9vJIYiAwXB65BGR74xgn8PUVpHDJO7ZjKo9kjsJfF0WnQxy2sUE8PmbERsY3gDMqoACABhRuJDYB424rsfA/ilNS0rxBqdxAsSWtlcF1QDJGN5J9SSSMk5OBk14+bXECKxJyu8ED65weh5x6da9D8CQp/wh3i4Lkb9OuQQe2Isev6GrVGCd1ubUZybt0sUNZ8ewyadGumW0ENxIeSEBMLghgykjHUsBgAggHORxk6d4wv4Lq3a8ld445ASQBvAJw3JB4wSMYxyOMgVhyQpEHCGPIOQSODz056DI/I1auMMQSqRxh2yQclQSME98g+vt+JGjCOlrmTqSbvc0Y9Vtr6/W2v7m5ksmby5GDZdlByTk56nJAHGcd+TpNqPhzT7UWlhZJeCUGRmlQNsYA4QkcuAxB5JAAGM8EclbwhpZEYhWC4Ck9cgE9M9BzwOg70+2wrPsySXCAkdzkH0wOh+lN0l0enYSqPdk8l3dpGXd8iUggk85AABBHoABj0A4wAKosEeNwRhlXAwcjGOp/lTlUM13EAAR8684woIGfyIP8A9alY4LEgg+WGIIOCpAyM+pB7dOauySZKd5I9C+KEEj6npDqCANPQbycAESy/hnkf5NcQftGFdxuMQChWBACjGAOOMjP5HpxXYfFCVk1fRQJGI/s4bRnofNl5x3J4GPb61y7SAyTJlQqAKWJACgHAyB3zknHJyPXnGl8COrFJe1Yx4YljIDOZSQAACAoyQc5GMZA/A455q9p1xLZWJlikZA4kjkQS7AwwCFxnGAC2fXOOeajluY4xbg4xPEjEFsbDg7gec4zk/jnrwK9xfgEopUqoKAjknPU5PQE8/h7VTTatY5rpO6ZBfak5uy8RMACiMupJzgDnPUE4z+B69KfY6zNDFIkUEH2gqQZmLFiACMD5gD1JIxgkA4ODVa4lcW7LEcRzkLIBnGQcjt2/xpkCo00aYCk8ZA4PB/qRnrkE46YrRRVrNEXbd7kYiluXZkjYlVJGFwOOTgDgDjgD0FWLO3O8+fuSPhiQvJAODg+vJwau/ZxpGsRJIhWW3xI0TkckDOARng8Dv1z0yKiLRNcukkj7UcRorjJZSOMgcYAxxg9xnjl37FWtq9yG4vpWtzZxFljeTzQzElmI4yTnnoOMADA69aqxFxBkDauAGOecHJ+uDg8e30q7dyl5IkdF3dCMDqD2x34756moAEUSAkgMBkDpuB4PtwDn8KpPQl7lm1tt8Sm5VsGNgMnkhdpOPYg5/XoaaWlSxLI7hJyBIgyABkkA8YAz0GevTmpbBmk8tZC4KvySQcqQAyngdgT3985ots27CZyTboGjIEwjIYqe2cYOcHjkEjmpbNOiJZ7owWkcEbPNDwwZ0APOOCMknoOM47nknFW5hmKO8RLRPkOUGAMjgHHTJAwD1qOe7nupCJSzEckkEFsAD6YGBjGOp9sXpLuFrwTpbKsbxkTCMkkkAg5zjAIPIBPPfpSWnQm6b1IdJt51ugiXQt47geVI+0EYPYg8Ee3fj1FaRe+hsjbysbmJYRbR+UCIhuwVOSACeWPI4OSOCarWym6uoYHtnuwrAFFPDIiA8EAgkAE5weOMHgH0n+yNMk02wW0sBdQq8Unkpb5dgp6KWGTxKB824kEgHPKY1Kqi1dbm9OnzbM4OXVEUxiF5G8hEe4O8yRvgkbhkkAglBngkkDAwa1rDXr8aOGiu2maWfJFwHYyMCDkn+EBcnIIPDZxgbty18P2WpxRyL/o6kq3mIFJmAXJLouHBLK5OCCQOuTg1ZfD1mmnC3EVsGjuJYLiN5trYYjbjGTnbjAPXcQTghhmpQno1qXySWqZymrXCTW9vf216ZyI3T53BaIEhwSOSepHORkHrkiobTV5UntXZpi9gM28R3EBzyScHIBwOefujOcnHVWPhaFIm86yW+EZAi8m5RUnY5A7DglRwCTnkEjABpGnW0OkJML2LzGRRG7AwbnBIJDAnehyik9QCcYJIOjnFK1iFCTd7lm21tLq81CcutwGhEqxQyAZDAJwe4wQD97BTJJIUnqYtV06OJE8ww7QB5f2VW2e2SpJx65P1rLli0TVtNvHtrbyZonE8ksYJUuik/VkPOQMHlsEVl/2Akv7wTod/zZFxb4Of+2o/kPpXM4xlrY11Fg1FrK3N7d3H9lux+aK4JJIBCk4C5HJAwAQMEZAPGLY6ldajqUwluXkEoY4CkRkjIAwCcn1B4HI5Neoyabo9wpR/CDSAtuJe1t+WxjOSc5xSxaLpSsHTwi8bKoUEJAMDjgYJ46elZqas01qy+WTe+hxd0TqPiKwsraWKE+W8t2qAkuwIUK+MjkbucEYOOeBU4g0lNUCafDbGYOkuDMZMAjAADZwORg4PPPAAz3IiiOSPDT5bBORbk8dOo7AD0qK402yvAWn8IQSOf4iLYN16hwAwPfjms+aWybSKUEtzy3Sp9GsteuoYrcSeVJIhV13hdjcAKQAOmRuLEYx1yQ5WiTXZ7NIrOKaCY2zpApgfGQBIDggAAgEKD1PXjHob+DtCkdnbwXBudtzMZowST1yRyep46GrUXhrS7V98HhS0DkAkiZMggEAE45P59euavmTd9SVTlpsec33i4R23ksptgzkIjjJVefn4GSc5IzzzkjkY0fDuvR6tFHp8rpcxhyjgLhRGVOPmOBnIYnAGcDAA5rsbvwxp19cefceFLOSTgbmmTgD0wMU238LadbzebB4YsozgcmYHOOnBBHFEppq2txqEr3drHIvovhrTIfMuHWXzwsqG4mfzdvTIC4GMckEknB5PUvufCvh68lKC5EckUYX/AEdmOVwMAhgwPBHOepBPWu5ewdpEdtD05mXIVnkDFR3wdnH4VL5d5kk6dZAnGSZsk9e+z/OaPb1OjZTpxbeisedaf4J02KM3S65PNFGCWDQlQpHJJznBwOoGeD9K841PXRearcSCWQwFyYgwBO3kAnkc/n1NfRL2U0yskmmaYyOCHBbII54Pycjk8H1NZ0vhPTZsGTw7oWR0IiAI/EID/n8K0hiWneauZToXSUbI+dxO0SK2DGqgkgkZJyRnOMnuCeM1NZzTRzrOclmYjBbGfUHBBHU8g+te8y+BNHudom0LSm2ggYeQAAnPGMd+aYvw/wBEjjZE0axVGBBHnzEc4z39hz7Vp9ch1TMfq0k9zxuZ4De3FtAVSECUoZDgKpUEjOASfvqM4HIx15zFYCRlLBRgAAEdAMcdjz/IV7s3gDSHl3nSrE44BMs5II6Hl+o/Om/8K80cqoOnWQUADAMpAHYDL+tH1yPVMHh5N7ni1jeG1cPFBbybyCPtEazAEEjIyOOT+OfYV3fgS/a68PeKJTBaKBps5VUt0RCfKycqBg56HIOQK6xvh5ozHm0gHTGGk4+mX4qTT9B0zR9YuNMWRYxqljMCCWIYnC45ORnPqPr3qo4mEnoaQpSj1PG59UnvbQoLaxjEq8mKxhjYjJ5DBQRxjv1J681SuQFuJZJTnD8gHqQSCAMepH5GvZz8NdL8qQJMyyEcPtJwcdgSeOvGe/Ws+T4XKy8aqjDnINsADn/gRIz+vPWksXC5m6U2ePiM4kYkkpIM5GeB15z06/p68OBIEzkIAyFxuGCCCDjB/p2x6kV6u/w2u4ySLy2OOSRlSeh54IHSqknw81YcK0Bz1IcY/Ud/8av6zFmfsJLoeaOB9rZ0Yl5Y84UHO14yRnA4xkDB/pkMlhla4+60mI4snBOSUQkZ9c5zjjNely/D7W2j2LFHkkDImGQO4x3/ADqrJ8O9d2kRWYB7BZUGf14NV9Yi0CpSvsR/FNT/AGjoALbC9mikjv8AvZfccAnNcZlC80Gzy2VXDkDPPJ9+h64HcD1z6v4s8N6rrraXLYxO8UdkI32SKvzCRyRyR2IOQD6fTGj8C68NqmzAjzlybhCe/A56ex+tZ0qsVCzOnEwk6raR59dTrJcQuFEZkQ/KATgFicjjuCPoB7Cqq/JIu8NIuTkcjt0/CvQZfBHiIMxFkzADCkvGfzAbHHoDUcXgPXdgD6c3sSyDJ98GtVWicbpyvsceLGWTSoiI4mdiMHeuSuZM55+UgoeDgkEEDGCXRxC2MMjXIWRCDyOV5zk49Mg47jOcYrsW8E670GlOABwd6Z56nGeP19+lMbwZrZznRm6ccoQPyJOfx5pe2RXs32OMuLlJGCKFzEMIdoBIBOCcZ46dDjii4RxL5iYI2+YMAEnBwBn0wAffNdh/wgV+sgc6ROCM8RqMEnHU9cdfrntg5G8IXyJsGkXJTqQY2IB46+vI/T8Kr2segcknujkrlTOI2TP70EYzwGxjrnuTn8qjmhVDM6EZ3kAgdBgEEH37V1zeErwqVOmXA5Jx9mbAJxn0/n1+uQ2TwuhiQPYXCvkA70MYHoQc4I4OcjIz360e1iJwe9jlIGlVQBjd/rCCnJwDkAdgQD+B9qW6hdo5ZYiQrOEck4JOck4HOORn65rpo/DsdpKoFsxkBxuLEEHjgYIBHHvnn1zSyaPG6lBbOIz95RMTknOc4I65NDqrdAoO2xzN1GkcmV5ZvmAGDwT0H0zj8KFt3ZnL5ClCUYHGSQCAD0JOMYPr7V11p4T+0JMILWASAcJJIQ7nPAU4IyRnnPYAnkZB4T1FWBfRriQADaoBK84IyQSMZxkHpg9wcHtU0Cg+xgws0V1G1qAcBQABuPBOBgZPTGfXPGRiuz0FN2hQ/wCnWyBCblkiyd6gnMbZAz+8CYBBGRnpgUtr4Q0gypZzreQzRkNmFyChJHYhsjoMj+76HjXtPAFot5MXv5ZDcI4JeIJjIAJDBgCSCAcYzhgR1rnlOM9DenCSd0jnzf3lvZW8U8V3IG2GNrpBvRAACokccbSSMgAgEknsd261dH0pzc2MU0LMUaFpFjkY7iAMEYyQFGRgFxjgHNWf+ENH9kSWT6sj20swCxNGSQoYAdXxgAAZHG0ZGMk1AvgmFNOmtH1oIAXaRoYBkhmDkAkk5yvGSSMnnms7K90bJT7Gdpl3HJpVvOIJJpLe6i2RySCN4QQ2EcnAICFGBGCck5GCKhlFssmpWdpALSKBEkHOzbLkOIw+OcYGAQQCzAZyBXQweFNKSK0jXUP3cYwHETEttJAB+U9AzAZBJxznjFP/AIV/ocjSI19qZF2fNk3EDa2QcEiIgHJ/hyMAjODg3dXu0xOMrKyM7T9QivNJuXK3FtIjqJYUCoWVsgxEkAH5ScF9xAxyeax016yjjVPLPyjHzNID+I312ln4M0q3tTE01/Ms6hHMysxXAAXkR9RgYI54A96gX4eaNsHz6j07g5/RMU1OK7iUZnrh0rgA3UeCP+eZP9eKjXS4mkkUXsbMhAcBCSpIBwecjIIPuCDUP9iXp4Kvj3kH+NRP4fvmd95QxcFAZCCD3zzjHTAA9c9q9J4em9zW77F7+z4TMI/tg3hA2wRHOM4zjPTPGaU6dAw/4+z/AN+//r1SXw7cb0UtD5IB3AnLFuMENngAZB4zyMEYOZD4eZ+Sbc88Hd/9aj6vTDmfYlOmWpbm8I5xjYB/Wj7BZqQWvW54BO0fTv7VGPD5VdqyWwH+9n+lH9gA5zJbFj15P+FH1al2DmfYla004ZL3ZHrygpBb6Upwbtgfd0GfemLoUa4BlgwD2B/wqU6JH1M8Zxx908Uewpdh3YOmkqvN0cdB+8QZppOjLjdcgZPH75Oad/YURBBnXGe0ZpRosK8ef7Y8k/41XsodhXfYYZNFVs/aM44/1wx69qhdtDJJMh464k6+nbvVoaTbqP8AX/lGf8ajNlp6kM13g5/ugfzNJ0qb3QJvsV2fQ1wCzMMkcSMeR16ClE+gAjrkngF36/lU7WmmDh7rOeRyo/rTRHpLAAXuO2N6f40expdkO8iJrrQhIB5ZJPHDS/0GBTFvNEKki2l4ODzKanKaOpw14e5wZI8U1ptCUkG7BbHTzo84+maXsqXZAmyP7fo65/0R+hI4c5x/+uq8k/h9rtLltPLTxoVRtjkqCckde/H5VP8AbfD4bb9rBJ4GZk5/Kj7XoWRm5yCOP3oI/QU1Cktkguxh1PSGzjTXYjrmI9PxNINV0srldLzu5AMH8+ae2oeH413NMu0dT5h4z9BTf7V8PKwBkXPHWR+547daXLS7INRg1bTzwNIPf/l3AA/Nqd/a1memlR5HrAvH600a14cLYUqTnH3pD78cUf214eTAHlgnkBncE/TPWmvZdbC94R9UgDlU0y2IAUACJNwJzkkZwBxx9DR/a8RdwNOtnK4G0RJuU4yc88ZGMY9aYdb0ESuFhV2wOYyxY9eCAc4AII5/iPTuSeINEhMha2UFSBtBO8nJBBBIxggjknkEcY5T9klfSw1zANZUfKNGQKBgYiTAyf5Uv9scE/2MqgdDsj/wpW1/RVVXNq21hkMyNggEg4yexBpP+Ei0faM2uT0x5ZyTnp1/ClzUe6G+ZPXcX+2uVA0lOTg5WMY/SmnWpecaQoGRjiPJ5+mKQ+ItGUkmyIPHHl+vA43d+1J/wkmkBFb7BhTjBMY7kAfxd8j8/rS56PRoNWP/ALalABGkKvPQBP8ACmjXbvnGkoABgHdH/hTG8U6SoBFivJAH7tRkk4A5buad/wAJLp7EkaZnBwT5SnHOOzevFHPR7oXvD/7avWbH9mRgAdQUOfb7tA1y84/4l6DOeQUyP/HR7Uh8TWak40xjjA4t88HvwenTt3pg8VWGAx08KcHloVHTr34+lNTpd0L3h/8Abl8AM2KN3PKDI/75609dcvzgiwVeOQWXn/xyqr+NNKVGLQ2wABJzs4A5OTntg/kfSo18a6YTtNrAuBljhDjBxzgnHOPzFPnpd0K0u5eOu6iOlqp46b1Gf/HKVtavzkG0TAOOWU/+y1nt430xSR9iU8A/8e479AeOCfTr7UL4508kqLHBGVy0IUZGM8kYwMjJ6Cj2lLyHr3Lo1e+x81hE4HU7k57/ANynR6ncZ4sIQQeQSgx/45WenjiwZABZAuQCFEa5API4xnpzggE09/G1rCSH08KV4I8sHuAMYHv+HOcUva0e6Fqai6vfbATaR9egdcf+g046vdqRmyjIxz8y/wDxNZY8b2SnmyTGSCAF4I9ePcc+9PPjOAkKNPjyTjDbR6e3vS9tR7oevcvNrVwQu+0jjJZQGYhhkkDGAO+QO3Jpx1e6DoptI4ixABO0knBJAwODgHk8D36VnN4uRUc/YI0KKcMQrAHB7AAkdRgEemRU0niUxuM6bFF5ihlZwGOM9wAPQ4GfQ84waVSm1e6sGt7XLb6zfqwC2UbAns6jPr1WlOs3wAJslIzj7yjHv0qgPFkMjArp0WzGTkgkHIGMBeufepD4pQkKthGQegJA59Pu1PtaPdBr3Li6vfDGbKPB6kOuRx/u0v8AbN7/AM+cf/fa/wDxNUB4qRwCNMjZ/Tchx75xTj4pwxH9nRcf7S/4UvbUe6DUlafUWzi/RQQOBbrn9T+FUL99Tt7OSWDUn815UIHlIQSWVD1BwAD0Hp7k1bLEZ45ByecHHrz+v0prRtdTQxfKCZEJG7OSDkfh0rqcdbGXM31GxrfhRJLfyR3LKAxjVOQCSBgg+p7d/phwju1GDqt6RnOMoP5LVi+BiuijFAVUbge3J56dOKq+fngsoLDjGcfU8cj6fnV8q3RPM+rJG+0DIOo3eM4z5gH8h/n9aaUkLENe3pPvMR/KjzQMkkgDOeBnH49Pr0pplAbAdjggYxjB9OT6fT29KlJWuh8z7imE7gDc3Z2j/n4bnj2NAtUBIMs5PXBuHPP59OO9MMiHgbzyR17jGR06/wCcUhlTgAMRnjB/+t1GeRRZ9Bc3mK9lbuQXWRgOxmcjr3GaBYWfJ8hcnk5YnP5mhpgHBwRnIHOckf8A1vxpDMuQAhyfXOc9PX698U7aaoObzFGn2RGfs0ZxxkgGqs+kae7ALY2wxgjEQ5z36fSrRmIYEjvjOO4HXn/IprTBSS2zCjJPHT/I6+9JwTVmHNZ6GdLpkIYKIo1Q5ONoGT246Vn3lqYZQm9QuDwvGRj2/EdMZx7EdEJM4BJBx05HQ9f8+lQ3QlnjkWOeSNiCAVYjkg4PH8vbpXLWw/Mrplxmc3HFLICfJkkG05AQ4zyBg44PGenI5xgjKvaTyFR9kuAjBSSI2AzkZxkYHGOMnPOeAQY5Ev3uFSd53QnawKuT0OQSfwJPoAOScitd6dfNLsaKadWKqQkfDEAnnAP3iQSeAMAcY58Vxs7O5tdlhbe9CrJIgGCZXUSBOBzwSwIHJznplehBqpDBPHr9jE0SmYxTFsOhJIxkEgkDkHqccinxxMtwHGSGCkIDySM4IBGcnOQewAyeKfY2str4gjsDaGQ3Gm3ATgqwIAB4OCeuM9eQTnOA6VnK1mWr32FuZEWCOWO7tkRY8MTk8bSeoBzhRnjsCDnIwRKmcS3sCEfKdglODvCMQSgPWU855IBI4yIx4X1EygLbSfKULqRk8IAcbugOAMEYwo45JFxtJ1SO3AMRQlU3BmXn5GVu/Byc9+AMHIAEckukWTqUTf2karKZblwoHEdvyDyQACwwSY5QBgYJUdlFI11aTQR8zTRkqC4hCggqgOcE4BUbgDngEYOzBNTsy1g8U8sKl42UZukBckKMjDEjkBxxgEHIOSKrLaAyTSJf6aHZpHiY3AXDeaHQ47YO5wOcFsZ9LVOb+yDbN7wrOl3q8pEDwlVBcM4OGJJxgAYIJbnJyACCckihql5KNb1BFhYqLqRVJlyDhynAA4zjHt05OQ9vw4bLRvEEUdxcW0RlQhIw+VeJZMxkYAXhCRx1AAGQOLWseGZb/WLySO7sRHcSGQiRzhk3EZ4ABDRttODnKKQTjA6pxboxilqhRTvcyNQuGOl6c0caD90zh23Eg+YWHCsDnIzyQSA2OMslCW8cQygLDGEK5DAkD5R2JxkA4JxjBz0wR08vhg32n2ltcX9vG0UZDrJufJL5+8BjBGDkEEFVIxyDVHhOHeUk1KMkEklLUsDl2YchgOpJxxgk44JB5VQqdEb1bubaMCTUGEUpimy0ZAGLZMklsYwAeRkcdiQOpIqaG6u2ZnjuVETDKkogxnI64BwcKR7DPTps/wDCKorH/iZExgEMFsjyNuM8DGBgEDoAMY24AlXw5FG7O9/dSMwIY/ZSAec9z68nOc984GH9Xq22MLM5v7Ze4z512SQRhZJSM/KQQO45IOcHpxnAol866zGGlfauDtkY5yMHrkZBJwT0wB3yelTRIFujODclmIOPJGARjB5Oc4ABIPI56gGq0XhGBUQP9pkKggO0agkEk4OXznkcjBGARzzQsNV7DsznSqNI7GNWUkoWduoIUEDGeuSM+uR3BBMjRgmIQAquSxIJOCM85zyjJ+JGehJ6WfwnE24AzBHjeMqYYz94YJ4I54HAx3HcYjl8HmYxl7qYiMtICYUzvIYBj8/PUZHQgdOeGsPVvsS0znYn+7JN5ecBsBTnoeuT1JGcE9d+DkU+NgzgIZBI7gAqMnJRgAcZzkoDx13qeM89P/wjkUaARSXETBw6tsTIOQT1YAg4GQOpBPAOBEvhZVMKi+uSInQgOin7piIB+fPWLnHXcTgnqfV6orM56N7l/KEDgRMSRucLghECAkgZGZBzgdRx0yrNKVIG2OMI23zJAVC5IJOOTjY7nnkgA5GBW9b+EVgEJW5kIj2EAwoPuiL/AG+5hH5kd6aPB8cYhIurkvEUKsYk6qFAJy3OfLXOff1Jqvq1TsFmYrFlmW3a5VWAZiuRkjkEZJxkYIOcchychcU9tu8Bp0DA4YqQcAHAJGMjBBGTyACG64GrH4TCqQ887BlVSCiLnAAzgEjOB6Hkng5IKf8ACIofKaWeaSSJiyNjJUkAEDLdCAeOoz1POU8LUfQLMoRssShIxHkhzISADnPJJB7gZyccEdgcXrR02xFAMSAMuzDBuCcgknI4yB0OQcAnFS/8IrGsyuktwdgKBAAODkAZz2z1x6YxgEJbaBPDlGW5MZAAUbDwCSM5fJwDjt3PAIAl4Sr2KSaJbRxNcrEwUB3KZLgkA8E/mQB39OOa1vEMvkPZkFNpiwAe5BOD7AZ/nVCPSpopluit1JMhUgGGLLYyQCTLwSSeeeSTWnqtqNShs2DskkIcGMxg4JAxkkjkYPIJ4JAIzmuunQksPKDWvQl35rmDJdlQeFDqxBJB5GOvODjnHsSOhOKdHeyMyKdxckYBGDgk59egGcd+cdCRYbQJMgpPKpUggmEdM8A4cE9Tg9Rx6HKR+H50CsLuclVAx5QAJBJGfnOQCTgenGa5HhKrWxWo2OZmhYAsSHJcjAzggAYPrgcdehzyDTjO5JPmdfRqf/Y1x5ZH2hgxHyEwggdcHlvfkcjPIwMASf2NL/BNIF7DyxwP++qn6nV7Duy6t1csoC6dcDDkgmSIcfUScH2+lX9NmMd2jzxvCiSFvnKHg9/kJHUAdj14x00Vs7FePMkJxyPLH5dacLfTgeTNjOMhBz+vFfRc8jNUop3KGtXguL/zbbLrwASQoGBg5z6/TtWeDOpUrDGNhO3dKTgE8jheR17DoK6EQaaSObg9uAOlIItOQkiOcnHcgY/T9alSklZDdOLd2jnx57MB5EYwCARITgHqMFeR3wf8TSMt2/O2IEYIyxYDrkcgZH1romNiBxBKwH958fToKPNs1BC2Rfk9ZTxzjsKOZ9x+zj2OdMN6w274V4Az5ZY46Y+8PwByOe3Y+zXpYZmQDJ5WIjr9SePzroPtEC9LOIA9Mux9fehblQTi0gHqDk4+uTSvLuHJHsc+LW5AI+0ygZ5ARMD81PtTvss5GHnnbtkiMZ78fJx+tb32okjFvbAj0QEfrSC6cjHlQA9sRL/h2pXfcahFdDENrOVOLmcEDGCE6en3OB/9em/2bO6srXUpDDDKdoyMYwQAOo/St77XLjhYRgZ4jUZPX0pTeS4IUrn0Eag9x2H+f0o17jSXYwP7Nl8tQbmQhRgfPgDjpxjH/wCqn/YCMkyStnpiZx/X0/l0raF9cdRLjI5wBxR9vuc4+0Njvg4wB9KQ0kYq6VuIIWRtvQb3OP15xzT49GCjiObg8Dc+PxGcf/rrWW8nJJ8+Uk9cuaeLqVwczyc9MuelLlRXoYkfh0RzPJFZTLIwAYxs43eucdT7nJ96nXQp1YMILnPTJ3nt75rRMszAZlc8dCxwOf8A9dRncSckktwc5pciWyC7Kh8PPI5L2RfPGXjyfxz2/wA/UHhgZBFhCCOh2KM/iMVaKgPyuNx9O9G0bRwckdce1VYBg0SWMZCRxgdvMUf1xThps4JBljz3zMCfx5pSCcZA5P056f5/H8VIC5+XI69e/wDn+dFgsNOioCSZbUEnOTIM59c+vTmpV01VwDc24PfEhH9KjAKnOATnoDx/nrTipGSScZ45oshXY/8AsuLdj7TBwMf6w/4UHTUx/wAfURwM8sT7elNCgKQSACO5/wAfancYGDnPTnP6UWQXGjTIeR9piI44w3+H1pw02Dvcpj2RvXr0pGIAzkZ4wP6/zpCQON3B4wTj8aaSEOOm2wJBugM8Z8s4/l7/AOeyjT7VTzdc56BD/U1CAMck4x37UpUZwCTgYyO/NFkBP9gtcA+e47YEY4/Wg2VkvBlkJHogyP1qAdMZJHpggjt/j/jSlQWGWOCeOD/kUATC1sSQA8pIPoBj9f5UG2sFY5M2MYzgfl1qIKu4dgPfHFKMA9+eSfXp3zRZASiDTRjJmyehwBk/40oh07OAs5I7AjH16VF8pByDnHJOfTsO/PH+eQKpI+UdRx09qYEvlacGPyz5x/eGfT0pdlgo4SbGepYD+lQ7RwcDAxxn9aaCQSeenQ9B/nmgCxsslHEUpx6OOfbp/nNIYrHn91JnPTeP8KjLKAcgHtnj2/z+FJgA4HAH4D/P+NAE5jsySfJlP/Ax/hQEscgmKUcY5YEfyqEYAx049OKXOckk57AHj6fyoAlxY5z5b56/fH+FLtsjn9xISOOXH+FRFunQ/wA/5/5/SkJwCwIx25oAsEWYAIgfA7FwP6U3fZ/88H/7+f8A1qiDEDGPb/Io84+h/OgCM/6tP89xSn74+g/nRRQA2T/Xv9P8KRfvfif5CiigBsnUfT+ppq9T9P60UUgBf9TL9DUg6N9T/OiimAg+6/4fzpv8I+n+FFFIB7feH1H86ST703+6P6UUUAA6p9D/AFpG/wBaPqaKKXUY/wDhH+/Tv+Wsn4fyFFFMFsQt9/8AD+opZPuj/dP86KKBjV/1X+fShPuH8f5miigCZv6D+lRr1T/f/pRRQARfeb6j+ZpP8B/KiigkdH2/Ch/uP9f8aKKAHH/WN9T/ADoP3B+P8qKKYDR1P0P8zSjqf90fzoooAa/QfQf0pT1H1/pRRQAo6/8AAqVOh+o/kaKKABv9Z+f8hQPur9KKKAJD9z8agf74+h/rRRQBKf8AXD6Cmn7iUUUASfwL9BTe/wCI/kKKKAHn/Vn6mkHVP89zRRQAJ94/j/OnUUUCP//Z" },
  { id: "IMG_1886", label: "Lagoon Dunes, Brazil", src: "data:image/jpeg;base64,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" }
];


const RENOWNED = [
  {
    key: 'pharrell', name: 'Pharrell Williams', role: "Men's Creative Director", org: 'Louis Vuitton', industry: 'Fashion', nationality: 'American',
    note: 'Appointed in 2023 following Virgil Abloh. Collapsed the boundary between music, culture, and luxury fashion.',
    bio: 'Pharrell Williams is a Grammy Award-winning producer, musician, and creative director whose influence spans music, fashion, and brand culture. Appointed as Men\'s Creative Director at Louis Vuitton in 2023, he became one of the most prominent Black creative leaders in the history of luxury fashion.',
    workingStyle: 'Culturally intuitive and emotionally driven. Pharrell builds creative universes rather than individual pieces — each collection, campaign, or collaboration is part of a larger worldview rooted in joy, identity, and community.',
    renownedWorks: ['Louis Vuitton FW24 — "Joie de Vivre" debut collection', 'Billionaire Boys Club (co-founded, 2005)', 'Adidas Humanrace collaborations', 'Chanel & Moncler creative campaigns', 'Grammy-winning albums: "In My Mind", "GIRL"'],
    history: ['2003 — Launched Billionaire Boys Club with Nigo', '2015 — Launched Joopiter auction house', '2023 — Appointed Men\'s Creative Director, Louis Vuitton', 'Ongoing — Runs Humanrace skincare & wellness brand'],
    currentWork: 'Men\'s Creative Director, Louis Vuitton. Founder of Humanrace, Joopiter, and Billionaire Boys Club.',
    netWorth: 'Estimated $250–300M',
    awards: ['Grammy Award (multiple)', 'CFDA Fashion Icon Award (2015)', 'BET Humanitarian Award (2020)'],
    links: [{label:'Louis Vuitton Official',url:'https://louisvuitton.com',type:'Official Website'},{label:'Pharrell — Vogue Feature',url:'https://vogue.com',type:'Press'},{label:'Humanrace',url:'https://humanrace.com',type:'Brand Website'}]
  },
  {
    key: 'virgil', name: 'Virgil Abloh', role: 'Artistic Director', org: 'Louis Vuitton Menswear / Off-White™', industry: 'Fashion', nationality: 'American (Ghanaian descent)',
    note: 'The first Black artistic director of a French luxury house. Redefined streetwear\'s relationship with high fashion.',
    bio: 'Virgil Abloh (1980–2021) was an American designer, DJ, and creative director of Ghanaian descent. He served as the Artistic Director of Louis Vuitton\'s menswear from 2018 until his death, and was the founder and CEO of Off-White. He remains one of the most culturally significant creative directors of the 21st century.',
    workingStyle: 'Deconstructive and dialogic. Abloh worked through quotation marks — placing inverted commas around familiar objects to question their meaning. He moved fluidly between architecture, music, art, and fashion, treating each project as an extension of the same ongoing conversation.',
    renownedWorks: ['Louis Vuitton SS19 — debut menswear show on Pont Neuf, Paris', 'Off-White™ x Nike "The Ten" collection (2017)', '"Figures of Speech" retrospective, Museum of Contemporary Art Chicago', 'Ikea "MARKERAD" collaboration (2019)', 'Mercedes-Benz Project Maybach concept car'],
    history: ['2013 — Founded Off-White™ in Milan', '2018 — Appointed Artistic Director, Louis Vuitton Menswear', '2019 — "Figures of Speech" retrospective toured globally', '2021 — Passed away in November, aged 41'],
    currentWork: 'Legacy managed by the Virgil Abloh Estate. Off-White™ continues under new creative direction.',
    netWorth: 'Estate valued at approximately $100M+',
    awards: ['CFDA American Menswear Designer of the Year (2022)', 'GQ Designer of the Year (2018)', 'BFC Emerging Menswear Designer (2013)'],
    links: [{label:'Off-White™ Official',url:'https://off---white.com',type:'Brand Website'},{label:'Virgil Abloh Estate',url:'https://virgilabloh.com',type:'Official Website'},{label:'MCA Chicago — Figures of Speech',url:'https://mcachicago.org',type:'Exhibition'}]
  },
  {
    key: 'melina', name: 'Melina Matsoukas', role: 'Director & Creative Director', org: 'Independent', industry: 'Film & Music', nationality: 'American (Jamaican & Jewish descent)',
    note: 'Grammy and Emmy-winning director behind some of the most culturally significant visual work in contemporary music and film.',
    bio: 'Melina Matsoukas is an American film and music video director of Jamaican and Jewish heritage. She is best known for directing Beyoncé\'s "Formation", which premiered at Super Bowl 50, and for co-writing and directing the feature film "Queen & Slim" (2019). She is the founder of de la Revolución Films.',
    workingStyle: 'Visually bold and politically conscious. Matsoukas centres Black femininity, identity, and resistance in her work. She approaches each project as a statement — precise in composition, unflinching in subject matter, and deeply rooted in cultural specificity.',
    renownedWorks: ['"Formation" — Beyoncé (2016, Super Bowl 50 debut)', '"Queen & Slim" (2019, feature film)', '"We Found Love" — Rihanna ft. Calvin Harris', '"Ran" — Future ft. Rae Sremmurd', 'Solange — "Don\'t Touch My Hair"'],
    history: ['Directed 200+ music videos across a decade', '2016 — "Formation" airs at Super Bowl 50, becomes a cultural landmark', '2016 — Founded de la Revolución Films', '2019 — Directed "Queen & Slim", her feature debut'],
    currentWork: 'Founder and CEO of de la Revolución Films. Active in directing film and commercial projects.',
    netWorth: 'Not publicly disclosed',
    awards: ['Grammy Award — Best Music Film (Formation)', 'Emmy Award (multiple)', 'NAACP Image Award'],
    links: [{label:'de la Revolución Films',url:'https://delarevolucionfilms.com',type:'Company Website'},{label:'NYT Profile — Melina Matsoukas',url:'https://nytimes.com',type:'Press'},{label:'Queen & Slim — Official Site',url:'https://queenandslim.com',type:'Film'}]
  },
  {
    key: 'jonathan', name: 'Jonathan Anderson', role: 'Creative Director', org: 'Loewe / JW Anderson', industry: 'Fashion', nationality: 'Northern Irish',
    note: 'Credited with transforming Loewe into one of the most intellectually rigorous luxury houses of the modern era.',
    bio: 'Jonathan Anderson is a Northern Irish fashion designer and creative director, widely regarded as one of the most intellectually rigorous figures working in luxury fashion today. He is Creative Director of Loewe, which he has led since 2013, and the founder of his own label JW Anderson. He has also collaborated extensively with Uniqlo.',
    workingStyle: 'Conceptual and curatorial. Anderson approaches fashion as an intellectual exercise, drawing from fine art, craft, and cultural history. His work at Loewe is defined by restraint, wit, and an obsessive attention to material quality and presentation.',
    renownedWorks: ['Loewe "Puzzle Bag" (one of the defining accessories of the 2010s)', 'Loewe SS23 — "Monsters" collection', 'JW Anderson x Uniqlo collaboration series', 'Loewe x Studio Ghibli capsule collections', '"The Craftsman" Loewe Foundation prize for craft'],
    history: ['2008 — Founded JW Anderson in London', '2013 — Appointed Creative Director of Loewe (LVMH)', '2015 — LVMH Prize winner', '2023 — Named Menswear Designer of the Year, CFDA'],
    currentWork: 'Creative Director of Loewe. Founder and creative lead of JW Anderson.',
    netWorth: 'Not publicly disclosed',
    awards: ['CFDA Menswear Designer of the Year (2023)', 'British Fashion Award — Designer of the Year (multiple)', 'LVMH Prize (2015)'],
    links: [{label:'Loewe Official',url:'https://loewe.com',type:'Official Website'},{label:'JW Anderson Official',url:'https://j-w-anderson.com',type:'Brand Website'},{label:'AnOther Magazine Interview',url:'https://anothermag.com',type:'Press'}]
  },
  {
    key: 'spike', name: 'Spike Lee', role: 'Director & Creative Director', org: 'Independent', industry: 'Film & Advertising', nationality: 'American',
    note: 'Defining figure in Black cinema. His Nike/Jordan collaborations helped establish the CD as a cultural voice in advertising.',
    bio: 'Spike Lee is an American filmmaker, producer, and creative director whose work has defined Black cinema for four decades. Beyond film, his long-running collaboration with Nike as the creative voice behind the Air Jordan brand — appearing as Mars Blackmon — helped establish the idea of the director as a commercial creative director and cultural figure.',
    workingStyle: 'Direct, confrontational, and culturally specific. Lee does not separate personal voice from professional output — his point of view is the work. He brings the same visual urgency and political clarity to commercials, documentaries, and feature films alike.',
    renownedWorks: ['"Do the Right Thing" (1989)', '"Malcolm X" (1992)', '"25th Hour" (2002)', '"BlacKkKlansman" (2018, Grand Prix, Cannes)', 'Nike Air Jordan "Mars Blackmon" campaign series (1988–1993)'],
    history: ['1986 — Feature debut "She\'s Gotta Have It"', '1989 — "Do the Right Thing" premieres at Cannes', '1992 — "Malcolm X" released', '2019 — Received honorary Palme d\'Or at Cannes', 'Ongoing — Runs 40 Acres and a Mule Filmworks'],
    currentWork: 'Founder of 40 Acres and a Mule Filmworks. Active filmmaker and NYU Tisch School of the Arts faculty.',
    netWorth: 'Estimated $50M',
    awards: ["Honorary Palme d'Or, Cannes (2019)", 'Academy Award — Adapted Screenplay, BlacKkKlansman (2019)', 'Emmy Award (multiple)'],
    links: [{label:'40 Acres and a Mule Filmworks',url:'https://40acres.com',type:'Company Website'},{label:'Spike Lee — NYT Interview',url:'https://nytimes.com',type:'Press'},{label:'Nike x Spike Lee Archive',url:'https://nike.com',type:'Campaign'}]
  },
  {
    key: 'grace', name: 'Grace Coddington', role: 'Creative Director', org: 'Vogue US', industry: 'Publishing & Fashion', nationality: 'British',
    note: 'Creative Director at Vogue for over two decades. One of the most influential figures in fashion editorial history.',
    bio: 'Grace Coddington is a British-born fashion creative director and former model who served as Creative Director of Vogue US for over two decades under Editor-in-Chief Anna Wintour. Her editorial work — characterised by its narrative ambition, romantic visual language, and extraordinary craft — is considered among the most influential fashion imagery ever published.',
    workingStyle: 'Narrative and romantic. Coddington treats every fashion editorial as a short story — with a beginning, emotional arc, and resolution. She is known for obsessive perfectionism on set and an insistence on authentic feeling over commercial polish.',
    renownedWorks: ['Vogue US editorials across 30+ years (1988–2020)', '"The September Issue" documentary (2009)', 'Grace: A Memoir (2012 autobiography)', 'Countless iconic cover shoots across Vogue\'s most celebrated issues'],
    history: ['1960s — Began career as a model, British Vogue', '1968 — Joined British Vogue as Fashion Editor', '1988 — Moved to US Vogue under Anna Wintour', '2016 — Stepped down as full-time Creative Director, retained as consultant'],
    currentWork: 'Creative Director Emeritus, Vogue US. Consultant and occasional collaborator.',
    netWorth: 'Estimated $10–20M',
    awards: ['British Fashion Council Outstanding Achievement Award', 'Time 100 Most Influential People', "Legion d'Honneur (French Government)"],
    links: [{label:'Vogue — Grace Coddington Archive',url:'https://vogue.com',type:'Editorial Archive'},{label:'The September Issue (Documentary)',url:'https://imdb.com',type:'Documentary'},{label:'Grace: A Memoir',url:'https://amazon.com',type:'Book'}]
  },
  {
    key: 'kehinde', name: 'Kehinde Wiley', role: 'Artist & Creative Director', org: 'Independent', industry: 'Fine Art & Brand', nationality: 'American',
    note: 'Recontextualised European classical painting to centre Black subjects. Extended his creative direction to major brand collaborations.',
    bio: 'Kehinde Wiley is an American portrait artist and creative director known for his large-scale paintings that insert Black subjects into the compositional and iconographic frameworks of European classical art. He painted the official White House portrait of President Barack Obama in 2018, his most widely recognised work. He is also the founder of Black Rock Senegal, an artist residency in Dakar.',
    workingStyle: 'Monumental and symbolic. Wiley works with a highly considered visual vocabulary — intricate floral backgrounds, classical poses, contemporary subjects — to assert presence, dignity, and cultural weight in spaces where Black subjects have historically been absent.',
    renownedWorks: ['Official White House portrait of President Barack Obama (2018)', '"Napoleon Leading the Army over the Alps" (2005)', 'Kehinde Wiley x BMW Art Car (2023)', '"An Economy of Grace" portrait series', 'Kehinde Wiley x Spotify campaign (2022)'],
    history: ['2001 — MFA from Yale School of Art', '2012 — Commissioned for "An Economy of Grace" series', '2018 — Unveiled Obama portrait at the Smithsonian', '2019 — Founded Black Rock Senegal residency'],
    currentWork: 'Artist-in-residence. Founder of Black Rock Senegal. Active in fine art, brand collaboration, and public commissions.',
    netWorth: 'Not publicly disclosed',
    awards: ['Smithsonian National Portrait Gallery Commission (Obama Portrait, 2018)', 'BMW Art Car Commission (2023)', 'Black Rock Senegal Founding Residency'],
    links: [{label:'Kehinde Wiley Studio',url:'https://kehindewiley.com',type:'Official Website'},{label:'Black Rock Senegal',url:'https://blackrocksenegal.org',type:'Residency'},{label:'NYT — Obama Portrait Feature',url:'https://nytimes.com',type:'Press'}]
  },
  {
    key: 'thebe',
    name: 'Thebe Magugu',
    role: 'Founder & Creative Director',
    org: 'Thebe Magugu',
    industry: 'Fashion',
    nationality: 'South African',
    note: 'Winner of the 2019 LVMH Young Fashion Designer Prize — the first African designer to receive the award.',
    bio: 'Thebetsile "Thebe" Magugu is a South African fashion designer born in Kimberley and based in Johannesburg. He won the 2019 LVMH Young Fashion Designer Prize, becoming the first African designer to win the award. His work is characterised by its intellectual rigour, archival research, and a distinctly South African visual and cultural language.',
    workingStyle: 'Research-led and culturally rooted. Magugu approaches each collection as a thesis — beginning with archival research, oral histories, and sociological enquiry before arriving at aesthetic decisions. His work insists that African fashion is not a trend but a tradition.',
    renownedWorks: [
      'LVMH Prize-winning AW19 collection',
      '"Alchemy" SS21 collection — Dazed cover',
      'H&M Designer Collaboration (2023)',
      '"Field Notes" SS22 — botanical research series',
      'Thebe Magugu x Woolmark Prize finalist collection (2021)',
    ],
    history: [
      '2018 — Launched Thebe Magugu label from Johannesburg',
      '2019 — Won LVMH Young Fashion Designer Prize (first African winner)',
      '2021 — Finalist, International Woolmark Prize',
      '2023 — H&M designer collaboration, global release',
      'Ongoing — Operates studio and boutique in Johannesburg',
    ],
    currentWork: 'Founder and Creative Director of Thebe Magugu, Johannesburg. Active in both fashion and cultural research.',
    netWorth: 'Not publicly disclosed',
    awards: [
      'LVMH Young Fashion Designer Prize (2019) — first African recipient',
      'International Woolmark Prize Finalist (2021)',
      'CFDA — International Award nominee',
    ],
    links: [
      {label: 'Thebe Magugu Official', url: 'https://www.thebemagugu.com', type: 'Official Website'},
      {label: 'Vogue — Thebe Magugu Feature', url: 'https://vogue.com', type: 'Press'},
      {label: 'LVMH Prize Archive', url: 'https://lvmhprize.com', type: 'Award'},
    ],
  }
];

/* ─── FOLLOW BUTTON ─────────────────────────────────────────── */
function FollowButton({ personKey }) {
  const [following, setFollowing] = useState(false);
  const [hov, setHov]             = useState(false);

  const base = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '5px 14px', borderRadius: 20, cursor: 'pointer',
    fontFamily: BODY, fontSize: 12, fontWeight: 600,
    transition: 'all .15s',
  };

  if (following) {
    return (
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => setFollowing(false)}
        style={{ ...base, background: hov ? 'rgba(255,80,80,.2)' : 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: hov ? '#ff9999' : '#F5EDE0' }}>
        {hov ? <><Icon ic={Ic.close} size={10} /> Unfollow</> : <><Icon ic={Ic.check} size={10} /> Following</>}
      </button>
    );
  }

  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => setFollowing(true)}
      style={{ ...base, background: hov ? C.teal : 'rgba(11,122,117,.25)', border: `1px solid ${hov ? C.teal : 'rgba(11,122,117,.5)'}`, color: hov ? '#fff' : C.teal }}>
      + Follow
    </button>
  );
}

/* ─── RENOWNED MODAL ─────────────────────────────────────────── */
function RenownedModal({ person, onClose }) {
  const [tab, setTab] = useState('overview');
  const photo = PHOTOS[person.key];
  const tabs = [
    { id: 'overview',  label: 'Overview' },
    { id: 'works',     label: 'Renowned Works' },
    { id: 'history',   label: 'History' },
    { id: 'style',     label: 'Working Style' },
  ];

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 700, background: 'rgba(15,14,12,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: C.cardBg, borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,.28)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero */}
        <div style={{ position: 'relative', height: 220, flexShrink: 0, overflow: 'hidden' }}>
          <img src={photo} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(15,14,12,.85) 100%)' }} />
          {/* Close + Follow */}
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <FollowButton personKey={person.key} />
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Icon ic={Ic.close} size={12} style={{ opacity: .55 }} />
            </button>
          </div>
          {/* Name over gradient */}
          <div style={{ position: 'absolute', bottom: 18, left: 22, right: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#fff', background: C.teal, padding: '3px 9px', borderRadius: 20 }}>{person.industry}</span>
              {person.nationality && <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>{person.nationality}</span>}
            </div>
            <h2 style={{ fontFamily: BODY, fontWeight: 800, fontSize: 24, color: '#fff', margin: 0, letterSpacing: '-.4px' }}>{person.name}</h2>
            <div style={{ fontFamily: BODY, fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 3 }}>{person.role} — {person.org}</div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, padding: '0 22px', flexShrink: 0 }}>
          {tabs.map(t => {
            const on = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ fontFamily: BODY, fontSize: 13, fontWeight: on ? 600 : 400, color: on ? C.teal : C.ink4, background: 'none', border: 'none', borderBottom: `2px solid ${on ? C.teal : 'transparent'}`, padding: '12px 0 11px', marginRight: 20, cursor: 'pointer', transition: 'all .12s' }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px 32px' }}>

          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontFamily: BODY, fontSize: 14, color: C.ink2, lineHeight: 1.8, margin: 0 }}>{person.bio}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Currently', val: person.currentWork },
                  { label: 'Net Worth', val: person.netWorth || 'Not publicly disclosed' },
                ].map(({ label, val }) => (
                  <div key={label} style={{ background: C.pageBg, borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 6 }}>{label}</div>
                    <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink2, lineHeight: 1.6 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'works' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontFamily: BODY, fontSize: 13, color: C.ink3, lineHeight: 1.65, margin: '0 0 6px' }}>A selection of the work that defined their creative legacy.</p>
              {(person.renownedWorks || []).map((work, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', background: C.pageBg, borderRadius: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 700, color: '#fff' }}>0{i + 1}</span>
                  </div>
                  <div style={{ fontFamily: BODY, fontSize: 13.5, color: C.ink, lineHeight: 1.55, paddingTop: 4 }}>{work}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(person.history || []).map((event, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.teal, flexShrink: 0, marginTop: 4 }} />
                    {i < arr.length - 1 && <div style={{ width: 1.5, flex: 1, background: `${C.teal}30`, minHeight: 28 }} />}
                  </div>
                  <div style={{ paddingLeft: 14, paddingBottom: i < arr.length - 1 ? 22 : 0, flex: 1 }}>
                    <div style={{ fontFamily: BODY, fontSize: 13.5, color: C.ink, lineHeight: 1.55 }}>{event}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: `linear-gradient(135deg, ${C.teal}0C, ${C.teal}04)`, border: `1px solid ${C.teal}22`, borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: C.teal, marginBottom: 10 }}>Working Style</div>
                <p style={{ fontFamily: BODY, fontSize: 14, color: C.ink2, lineHeight: 1.8, margin: 0 }}>{person.workingStyle}</p>
              </div>
              <div style={{ background: C.pageBg, borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: C.ink4, marginBottom: 10 }}>Current Focus</div>
                <p style={{ fontFamily: BODY, fontSize: 13.5, color: C.ink2, lineHeight: 1.75, margin: 0 }}>{person.currentWork}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes cdLift{0%{opacity:0;transform:translateY(16px) scale(.97)}100%{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
}

/* ─── RENOWNED CAROUSEL ──────────────────────────────────────── */
function RenownedCarousel({ people, onSelect, onCreateProfile }) {
  const trackRef   = useRef(null);
  const rafRef     = useRef(null);
  const stateRef   = useRef({
    isDragging:  false,
    startX:      0,
    scrollLeft:  0,
    velX:        0,
    lastX:       0,
    lastT:       0,
    clicked:     true,
  });

  // Momentum physics
  const FRICTION   = 0.93;
  const MIN_VEL    = 0.3;
  const CARD_W     = 240;
  const GAP        = 14;

  const cancelMomentum = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const runMomentum = () => {
    const s = stateRef.current;
    const el = trackRef.current;
    if (!el) return;
    s.velX *= FRICTION;
    if (Math.abs(s.velX) < MIN_VEL) { s.velX = 0; return; }
    el.scrollLeft -= s.velX;
    rafRef.current = requestAnimationFrame(runMomentum);
  };

  // Mouse events
  const onMouseDown = (e) => {
    cancelMomentum();
    const s = stateRef.current;
    s.isDragging = true;
    s.startX     = e.pageX - trackRef.current.offsetLeft;
    s.scrollLeft = trackRef.current.scrollLeft;
    s.velX       = 0;
    s.lastX      = e.pageX;
    s.lastT      = Date.now();
    s.clicked    = true;
    trackRef.current.style.cursor = 'grabbing';
    trackRef.current.style.userSelect = 'none';
  };

  const onMouseMove = (e) => {
    const s = stateRef.current;
    if (!s.isDragging) return;
    e.preventDefault();
    const now = Date.now();
    const dx  = e.pageX - s.lastX;
    const dt  = now - s.lastT || 16;
    s.velX    = dx / dt * 16;          // pixels per frame @ 60fps
    s.lastX   = e.pageX;
    s.lastT   = now;
    if (Math.abs(e.pageX - (s.startX + trackRef.current.offsetLeft - trackRef.current.scrollLeft)) > 4) {
      s.clicked = false;
    }
    const walk = e.pageX - s.startX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = s.scrollLeft - walk;
  };

  const onMouseUp = (e) => {
    const s = stateRef.current;
    if (!s.isDragging) return;
    s.isDragging = false;
    trackRef.current.style.cursor = 'grab';
    trackRef.current.style.userSelect = '';
    rafRef.current = requestAnimationFrame(runMomentum);
  };

  const onMouseLeave = () => {
    const s = stateRef.current;
    if (!s.isDragging) return;
    s.isDragging = false;
    trackRef.current.style.cursor = 'grab';
    trackRef.current.style.userSelect = '';
    rafRef.current = requestAnimationFrame(runMomentum);
  };

  // Touch events
  const onTouchStart = (e) => {
    cancelMomentum();
    const s = stateRef.current;
    s.isDragging = true;
    s.startX     = e.touches[0].pageX;
    s.scrollLeft = trackRef.current.scrollLeft;
    s.velX       = 0;
    s.lastX      = e.touches[0].pageX;
    s.lastT      = Date.now();
    s.clicked    = true;
  };

  const onTouchMove = (e) => {
    const s = stateRef.current;
    if (!s.isDragging) return;
    const now = Date.now();
    const dx  = e.touches[0].pageX - s.lastX;
    const dt  = now - s.lastT || 16;
    s.velX    = dx / dt * 16;
    s.lastX   = e.touches[0].pageX;
    s.lastT   = now;
    s.clicked = false;
    const walk = e.touches[0].pageX - s.startX;
    trackRef.current.scrollLeft = s.scrollLeft - walk;
  };

  const onTouchEnd = () => {
    const s = stateRef.current;
    s.isDragging = false;
    rafRef.current = requestAnimationFrame(runMomentum);
  };

  // Scroll arrow buttons
  const scrollBy = (dir) => {
    cancelMomentum();
    const el = trackRef.current;
    const target = el.scrollLeft + dir * (CARD_W + GAP) * 2;
    const start = el.scrollLeft;
    const diff  = target - start;
    const dur   = 480;
    let t0 = null;
    const ease = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const progress = Math.min((ts - t0) / dur, 1);
      el.scrollLeft = start + diff * ease(progress);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => () => cancelMomentum(), []);

  return (
    <div style={{ position: 'relative' }}>
      {/* Left fade + arrow */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 64, background: `linear-gradient(to right, ${C.pageBg} 0%, transparent 100%)`, zIndex: 2, pointerEvents: 'none', borderRadius: '14px 0 0 14px' }} />
      <button
        onClick={() => scrollBy(-1)}
        style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', zIndex: 3, width: 32, height: 32, borderRadius: '50%', background: C.cardBg, border: `1px solid ${C.border}`, boxShadow: '0 2px 10px rgba(0,0,0,.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink3, transition: 'all .15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = C.teal; }}
        onMouseLeave={e => { e.currentTarget.style.background = C.cardBg; e.currentTarget.style.color = C.ink3; e.currentTarget.style.borderColor = C.border; }}>
        <Icon ic={Ic.chevLeft} size={14} />
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          display: 'flex',
          gap: GAP,
          overflowX: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: 'grab',
          paddingLeft: 48,
          paddingRight: 48,
          paddingTop: 4,
          paddingBottom: 12,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style>{`
          .renowned-track::-webkit-scrollbar { display: none; }
          @keyframes carouselFadeIn {
            from { opacity: 0; transform: translateX(24px) scale(0.97); }
            to   { opacity: 1; transform: translateX(0) scale(1); }
          }
        `}</style>

        {people.map((person, i) => (
          <div
            key={person.key}
            onClick={() => { if (stateRef.current.clicked) onSelect(person); }}
            style={{
              flexShrink: 0,
              width: CARD_W,
              animation: `carouselFadeIn ${0.32 + i * 0.07}s cubic-bezier(0.22, 1, 0.36, 1) both`,
            }}
          >
            <RenownedCard person={person} onClick={() => { if (stateRef.current.clicked) onSelect(person); }} />
          </div>
        ))}

        {/* Create profile card */}
        <div
          style={{
            flexShrink: 0,
            width: CARD_W,
            borderRadius: 14,
            border: `1.5px dashed ${C.teal}55`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '28px 16px',
            cursor: 'pointer',
            transition: 'all .18s',
            minHeight: 310,
            animation: `carouselFadeIn ${0.32 + people.length * 0.07}s cubic-bezier(0.22, 1, 0.36, 1) both`,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#D6EDE1'; e.currentTarget.style.borderColor = '#1A4D2E'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F0F7F2'; e.currentTarget.style.borderColor = '#1A4D2E'; }}
          onClick={onCreateProfile}
        >
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1.5px dashed #1A4D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A4D2E' }}>
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 4v12M4 10h12"/></svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13, color: '#1A4D2E', marginBottom: 4 }}>Create my Creative Director profile</div>
            <div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink4, lineHeight: 1.6 }}>Add your photo, credits, working style, and taste signals to nOS</div>
          </div>
        </div>
      </div>

      {/* Right fade + arrow */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 64, background: `linear-gradient(to left, ${C.pageBg} 0%, transparent 100%)`, zIndex: 2, pointerEvents: 'none', borderRadius: '0 14px 14px 0' }} />
      <button
        onClick={() => scrollBy(1)}
        style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', zIndex: 3, width: 32, height: 32, borderRadius: '50%', background: C.cardBg, border: `1px solid ${C.border}`, boxShadow: '0 2px 10px rgba(0,0,0,.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink3, transition: 'all .15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = C.teal; }}
        onMouseLeave={e => { e.currentTarget.style.background = C.cardBg; e.currentTarget.style.color = C.ink3; e.currentTarget.style.borderColor = C.border; }}>
        <Icon ic={Ic.chevRight} size={14} />
      </button>
    </div>
  );
}

/* ─── RENOWNED CARD ───────────────────────────────────────────── */
function RenownedCard({ person, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(person)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.cardBg,
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${hov ? C.teal + '44' : C.border}`,
        boxShadow: hov ? '0 12px 32px rgba(0,0,0,.13)' : '0 2px 10px rgba(0,0,0,.06)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform .2s ease, box-shadow .2s ease, border-color .15s ease',
      }}
    >
      {/* Photo */}
      <div style={{ width: '100%', aspectRatio: '3 / 4', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        <img
          src={PHOTOS[person.key]}
          alt={person.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', transition: 'transform .3s ease', transform: hov ? 'scale(1.04)' : 'scale(1)' }}
        />
        {/* Industry chip overlaid on photo */}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: '#fff', background: 'rgba(15,14,12,.55)', backdropFilter: 'blur(6px)', padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>{person.industry}</span>
        </div>
        {/* Hover cue */}
        {hov && (
          <div style={{ position: 'absolute', bottom: 10, right: 10, width: 28, height: 28, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13, color: C.ink, lineHeight: 1.25 }}>{person.name}</div>
        <div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink3, lineHeight: 1.4 }}>
          <span style={{ fontWeight: 600, color: C.ink2 }}>{person.role}</span>
          {' — '}{person.org}
        </div>
        <div style={{ fontFamily: BODY, fontSize: 11, color: C.ink4, lineHeight: 1.55, marginTop: 2 }}>{person.note}</div>
      </div>
    </div>
  );
}

/* ─── TABS ───────────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',     label: 'Overview',      iconId: 'overview'     },
  { id: 'flows',        label: 'Flows',         iconId: 'nos'          },
  { id: 'tasks',        label: 'Task Universe', iconId: 'tasks'        },
  { id: 'ask',          label: 'Ask Nia',       iconId: 'ask'          },
  { id: 'integrations', label: 'Integrations',  iconId: 'integrations' },
];

/* ─── PAIN POINT DIAGRAMS ────────────────────────────────────── */
function PainPointDiagram({ index }) {
  const T = C.teal;
  const ink = C.ink;
  const ink4 = C.ink4;
  const cream = '#F5EDE0';
  const bg = C.pageBg;

  const diagrams = [

    /* 0 — The translation gap
       A single bright idea in one mind, travelling through a long
       distorting corridor before arriving fractured at the other end. */
    <svg viewBox="0 0 340 165" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 165 }}>
      <defs>
        <radialGradient id="g0a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={T} stopOpacity=".18"/>
          <stop offset="100%" stopColor={T} stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Source mind — glowing orb */}
      <ellipse cx="38" cy="55" rx="26" ry="26" fill="url(#g0a)" stroke={T} strokeWidth="1.2"/>
      <circle cx="38" cy="55" r="10" fill={T} opacity=".85"/>
      <text x="38" y="60" textAnchor="middle" fontSize="12" fill="#fff" fontFamily="serif" fontStyle="italic">i</text>
      <text x="38" y="90" textAnchor="middle" fontSize="9" fill={T} fontFamily="sans-serif" opacity=".7">Vision</text>

      {/* Distorting corridor — tapered tube with wavering dashes */}
      <path d="M65 45 Q120 38 180 50 Q240 62 290 45" fill="none" stroke={ink4} strokeWidth="1" strokeDasharray="4 3" opacity=".4"/>
      <path d="M65 65 Q120 72 180 60 Q240 48 290 65" fill="none" stroke={ink4} strokeWidth="1" strokeDasharray="4 3" opacity=".4"/>
      {/* Distortion ripples */}
      {[110, 155, 200, 245].map((x, i) => (
        <ellipse key={i} cx={x} cy="55" rx="4" ry={6 + i * 2} fill="none" stroke={ink4} strokeWidth=".8" opacity={0.18 + i * 0.06}/>
      ))}
      {/* Arrow */}
      <path d="M292 51 L305 55 L292 59" fill="none" stroke={ink4} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>

      {/* Received — fragmented shards */}
      <g opacity=".85">
        <ellipse cx="320" cy="45" rx="8" ry="5" fill="none" stroke={ink} strokeWidth="1.1" transform="rotate(-20 320 45)"/>
        <ellipse cx="330" cy="60" rx="6" ry="4" fill="none" stroke={ink} strokeWidth="1.1" transform="rotate(15 330 60)"/>
        <ellipse cx="316" cy="68" rx="5" ry="3" fill="none" stroke={ink} strokeWidth="1.1" transform="rotate(-8 316 68)"/>
      </g>
      <text x="320" y="90" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif">Received</text>

      {/* Caption */}
      <text x="170" y="104" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">A clear signal, dispersed in transmission.</text>
    </svg>,

    /* 1 — Reference fragmentation
       A single idea at the centre, with fragments orbiting across
       disconnected surfaces — each isolated, never collected. */
    <svg viewBox="0 0 340 175" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 175 }}>
      {/* Central idea nucleus */}
      <circle cx="170" cy="58" r="16" fill={T} opacity=".15" stroke={T} strokeWidth="1.2"/>
      <circle cx="170" cy="58" r="7" fill={T} opacity=".7"/>

      {/* Orbiting fragment islands — scattered, no connecting lines */}
      {[
        { x: 52,  y: 30,  rx: 18, ry: 11, label: 'Pinterest',  rot: -15 },
        { x: 290, y: 28,  rx: 16, ry: 10, label: 'Instagram',  rot: 12  },
        { x: 40,  y: 86,  rx: 15, ry: 9,  label: 'Drive',      rot: 8   },
        { x: 295, y: 88,  rx: 17, ry: 9,  label: 'Screenshots',rot: -10 },
        { x: 130, y: 18,  rx: 14, ry: 8,  label: 'Email',      rot: 5   },
        { x: 215, y: 100, rx: 14, ry: 8,  label: 'Tear sheets', rot: -6 },
      ].map(({ x, y, rx, ry, label, rot }, i) => (
        <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={bg} stroke={ink4} strokeWidth=".9" strokeDasharray="3 2" opacity=".7"/>
          <text x={x} y={y + 3} textAnchor="middle" fontSize="7.5" fill={ink4} fontFamily="sans-serif">{label}</text>
        </g>
      ))}

      {/* Faint broken orbit path */}
      <ellipse cx="170" cy="58" rx="115" ry="45" fill="none" stroke={ink4} strokeWidth=".6" strokeDasharray="2 6" opacity=".25"/>

      <text x="170" y="115" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Inspiration, scattered across ungoverned surfaces.</text>
    </svg>,

    /* 2 — Talent sourcing friction
       A web of people, but only a single thread connects the CD
       to any of them — a narrow, fragile bridge. */
    <svg viewBox="0 0 340 170" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 170 }}>
      {/* CD node */}
      <circle cx="60" cy="57" r="20" fill={T} opacity=".12" stroke={T} strokeWidth="1.2"/>
      <circle cx="60" cy="57" r="9" fill={T} opacity=".75"/>
      <text x="60" y="83" textAnchor="middle" fontSize="8.5" fill={T} fontFamily="sans-serif">CD</text>

      {/* The single narrow bridge */}
      <path d="M80 57 Q170 40 255 57" fill="none" stroke={T} strokeWidth="1.4" strokeDasharray="5 3" opacity=".5"/>
      {/* Friction knot in middle */}
      <circle cx="168" cy="49" r="5" fill="none" stroke={ink4} strokeWidth="1" opacity=".6"/>
      <path d="M164 45 L172 53 M172 45 L164 53" stroke={ink4} strokeWidth="1" strokeLinecap="round" opacity=".6"/>
      <text x="168" y="40" textAnchor="middle" fontSize="8" fill={ink4} fontFamily="sans-serif" fontStyle="italic">word of mouth</text>

      {/* Talent cloud — connected to each other but not to CD */}
      {[
        { x: 275, y: 30  },
        { x: 300, y: 55  },
        { x: 275, y: 80  },
        { x: 255, y: 95  },
        { x: 258, y: 20  },
      ].map(({ x, y }, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill={bg} stroke={ink4} strokeWidth=".9" opacity=".8"/>
          <text x={x} y={y + 3} textAnchor="middle" fontSize="7" fill={ink4} fontFamily="sans-serif">{['Ph','St','AD','Ed','Pr'][i]}</text>
          {i > 0 && <line x1={[275,300,275,255][i-1]} y1={[30,55,80,95][i-1]} x2={x} y2={y} stroke={ink4} strokeWidth=".6" opacity=".25"/>}
        </g>
      ))}

      <text x="170" y="110" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">A field of talent, reachable only through a single frail thread.</text>
    </svg>,

    /* 3 — Brief creation overhead
       An hourglass: the wide bowl of creative potential funnelled
       through a narrow mechanical neck before becoming output. */
    <svg viewBox="0 0 340 175" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 175 }}>
      {/* Left — the creative potential, organic cloud */}
      <path d="M30 35 Q18 35 15 50 Q10 70 25 80 Q35 90 55 85 Q70 88 75 75 Q88 78 90 65 Q95 50 82 40 Q72 28 58 32 Q44 26 30 35 Z"
        fill={T} fillOpacity=".1" stroke={T} strokeWidth="1" opacity=".7"/>
      <text x="52" y="57" textAnchor="middle" fontSize="8.5" fill={T} fontFamily="sans-serif">Creative</text>
      <text x="52" y="69" textAnchor="middle" fontSize="8.5" fill={T} fontFamily="sans-serif">potential</text>

      {/* Hourglass neck — narrow mechanical passage */}
      <path d="M98 50 L148 57 L148 57 L98 64 Z" fill={ink4} fillOpacity=".08"/>
      <path d="M98 50 L148 57" stroke={ink4} strokeWidth=".8" opacity=".4"/>
      <path d="M98 64 L148 57" stroke={ink4} strokeWidth=".8" opacity=".4"/>
      {/* Template labels — bureaucratic friction */}
      {['Section 1','Objectives','Deliverables','Timeline','Budget','Appendix'].map((t, i) => (
        <text key={i} x={118} y={46 + i * 4.5} textAnchor="middle" fontSize="5.5" fill={ink4} fontFamily="sans-serif" opacity=".55">{t}</text>
      ))}

      {/* Right — the output, diminished rectangle */}
      <rect x="158" y="44" width="52" height="26" rx="4" fill={bg} stroke={ink4} strokeWidth=".9" opacity=".8"/>
      <text x="184" y="57" textAnchor="middle" fontSize="8" fill={ink4} fontFamily="sans-serif">Output</text>
      <text x="184" y="67" textAnchor="middle" fontSize="7" fill={ink4} fontFamily="sans-serif" opacity=".6">brief.docx</text>

      {/* Time lost annotation */}
      <path d="M220 57 Q250 57 270 57" stroke={ink4} strokeWidth=".7" strokeDasharray="3 2" opacity=".4"/>
      <text x="270" y="45" fontSize="8.5" fill={ink4} fontFamily="sans-serif" opacity=".65">70% of this</text>
      <text x="270" y="55" fontSize="8.5" fill={ink4} fontFamily="sans-serif" opacity=".65">structure is</text>
      <text x="270" y="65" fontSize="8.5" fill={ink4} fontFamily="sans-serif" opacity=".65">always the same.</text>

      <text x="170" y="108" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Creativity, funnelled through the same narrow passage each time.</text>
    </svg>,

    /* 4 — Invisible production gaps
       A bridge seen from above: the visible creative span,
       and the hidden supporting structure underneath — only visible
       from below. */
    <svg viewBox="0 0 340 175" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 175 }}>
      {/* Concept bank — left */}
      <ellipse cx="42" cy="58" rx="28" ry="22" fill={T} fillOpacity=".1" stroke={T} strokeWidth="1"/>
      <text x="42" y="54" textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">Concept</text>
      <text x="42" y="65" textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">&amp; Vision</text>

      {/* Delivery bank — right */}
      <ellipse cx="298" cy="58" rx="28" ry="22" fill={bg} stroke={ink4} strokeWidth="1"/>
      <text x="298" y="54" textAnchor="middle" fontSize="8" fill={ink4} fontFamily="sans-serif">Final</text>
      <text x="298" y="65" textAnchor="middle" fontSize="8" fill={ink4} fontFamily="sans-serif">Delivery</text>

      {/* The visible bridge — surface */}
      <path d="M70 52 Q170 40 270 52" fill="none" stroke={T} strokeWidth="2" opacity=".5"/>
      <path d="M70 64 Q170 76 270 64" fill="none" stroke={T} strokeWidth="2" opacity=".5"/>

      {/* The hidden substructure — shown as dashed supports below */}
      <path d="M70 64 Q170 76 270 64" fill="none" stroke={ink4} strokeWidth=".7" strokeDasharray="2 4" opacity=".35"/>
      {[105, 140, 170, 200, 235].map((x, i) => {
        const y = 64 + Math.sin((x - 70) / 200 * Math.PI) * 12;
        return <line key={i} x1={x} y1={y} x2={x} y2={y + 18} stroke={ink4} strokeWidth=".8" strokeDasharray="2 2" opacity=".4"/>;
      })}
      {/* Hidden labels */}
      <text x="170" y="97" textAnchor="middle" fontSize="7.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic" opacity=".65">budgets · timelines · vendor logic · call sheets</text>

      <text x="170" y="112" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Every bridge requires invisible architecture beneath.</text>
    </svg>,

    /* 5 — No creative record
       An accumulation of sand: each contribution falls and disperses,
       never consolidated into permanent form. */
    <svg viewBox="0 0 340 170" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 170 }}>
      {/* Falling contributions — particles descending */}
      {[
        { x: 80,  y: 20, label: 'Campaign A' },
        { x: 150, y: 14, label: 'Brand identity' },
        { x: 220, y: 22, label: 'Editorial B' },
        { x: 290, y: 18, label: 'Film project' },
        { x: 50,  y: 42, label: 'Shoot direction' },
        { x: 120, y: 36, label: 'CD credit' },
        { x: 260, y: 38, label: 'Collaboration' },
      ].map(({ x, y, label }, i) => (
        <g key={i} opacity={0.5 + i * 0.04}>
          <ellipse cx={x} cy={y} rx={label.length * 2.6} ry={7} fill={bg} stroke={ink4} strokeWidth=".7"/>
          <text x={x} y={y + 3} textAnchor="middle" fontSize="7" fill={ink4} fontFamily="sans-serif">{label}</text>
          {/* Falling trajectory */}
          <path d={`M${x} ${y + 7} Q${x + 4} ${y + 20} ${x - 2} ${y + 30}`} fill="none" stroke={ink4} strokeWidth=".5" strokeDasharray="2 3" opacity=".3"/>
        </g>
      ))}

      {/* Dispersed pile at the bottom — no form */}
      <path d="M30 85 Q80 78 130 82 Q170 80 210 83 Q255 79 310 84" fill="none" stroke={ink4} strokeWidth=".8" opacity=".3"/>
      {[40, 80, 120, 165, 205, 250, 295].map((x, i) => (
        <ellipse key={i} cx={x + (i%3)*3} cy={88 + (i%2)*3} rx={8 + (i%3)*2} ry={3} fill={ink4} fillOpacity=".07" stroke={ink4} strokeWidth=".4" opacity=".5"/>
      ))}
      <text x="170" y="98" textAnchor="middle" fontSize="8" fill={ink4} fontFamily="sans-serif" fontStyle="italic" opacity=".7">Contributions accumulate without form. Credit disperses.</text>

      <text x="170" y="110" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Work without a record is architecture without a foundation.</text>
    </svg>,

    /* 6 — Context-switching overload
       Multiple orbits pulling a single body in different directions —
       the CD at the centre, tugged by competing gravitational fields. */
    <svg viewBox="0 0 340 175" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 175 }}>
      <defs>
        <radialGradient id="g6a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={T} stopOpacity=".2"/>
          <stop offset="100%" stopColor={T} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* CD centre */}
      <circle cx="170" cy="57" r="24" fill="url(#g6a)"/>
      <circle cx="170" cy="57" r="10" fill={T} opacity=".75"/>
      <text x="170" y="61" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="sans-serif" fontWeight="600">CD</text>

      {/* Gravitational pull vectors — arrows from CD toward each task */}
      {[
        { label: 'Concepting', angle: -130, dist: 72, col: '#8B4513' },
        { label: 'Edits',      angle: -50,  dist: 70, col: '#2A6B7C' },
        { label: 'Pitch deck', angle: 40,   dist: 72, col: '#5A3A7A' },
        { label: 'Sourcing',   angle: 140,  dist: 68, col: '#2A5A3A' },
        { label: 'Client',     angle: -180, dist: 66, col: '#7A3A2A' },
      ].map(({ label, angle, dist, col }, i) => {
        const rad = angle * Math.PI / 180;
        const tx = 170 + Math.cos(rad) * dist;
        const ty = 57  + Math.sin(rad) * dist;
        const mx = 170 + Math.cos(rad) * 30;
        const my = 57  + Math.sin(rad) * 30;
        return (
          <g key={i}>
            {/* Orbit arc hint */}
            <circle cx="170" cy="57" r={dist} fill="none" stroke={col} strokeWidth=".4" strokeDasharray="2 8" opacity=".2"/>
            {/* Pull arrow */}
            <line x1={mx} y1={my} x2={tx - Math.cos(rad) * 18} y2={ty - Math.sin(rad) * 18}
              stroke={col} strokeWidth="1" opacity=".55" strokeDasharray="3 2"/>
            {/* Task node */}
            <ellipse cx={tx} cy={ty} rx={label.length * 3.0} ry={9} fill={bg} stroke={col} strokeWidth=".9" opacity=".85"/>
            <text x={tx} y={ty + 3} textAnchor="middle" fontSize="8" fill={col} fontFamily="sans-serif">{label}</text>
          </g>
        );
      })}

      <text x="170" y="113" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">A single body, held in orbit by competing forces simultaneously.</text>
    </svg>,
  ];

  return (
    <div style={{ background: C.pageBg, borderRadius: 12, padding: '20px 16px 14px', marginTop: 4, border: `1px solid ${C.border}` }}>
      {diagrams[index] || null}
    </div>
  );
}

/* ─── WORKING STYLE DIAGRAMS ─────────────────────────────────── */
function WorkingStyleDiagram({ index }) {
  const T = C.teal; const ink4 = C.ink4; const bg = C.pageBg; const ink = C.ink;

  const diagrams = [
    /* 0 — The Visionary: A single source of radiant light casting
       long beams outward — origin of all direction, but the
       practical scaffolding must be built around it by others. */
    <svg viewBox="0 0 340 145" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 145 }}>
      <defs><radialGradient id="vg0" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={T} stopOpacity=".35"/><stop offset="100%" stopColor={T} stopOpacity="0"/></radialGradient></defs>
      <circle cx="80" cy="50" r="40" fill="url(#vg0)"/>
      <circle cx="80" cy="50" r="16" fill={T} opacity=".8"/>
      <text x="80" y="54" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="sans-serif" fontWeight="700">Vision</text>
      {[0,30,60,-30,-60,90,-90].map((deg, i) => { const r = deg*Math.PI/180; const x2=80+Math.cos(r)*95; const y2=50+Math.sin(r)*40; return <line key={i} x1={80+Math.cos(r)*18} y1={50+Math.sin(r)*18} x2={x2} y2={y2} stroke={T} strokeWidth=".7" strokeDasharray="4 3" opacity={.25-.03*i}/>; })}
      <text x="230" y="35" fontSize="9" fill={ink4} fontFamily="sans-serif">Concept</text>
      <text x="265" y="52" fontSize="9" fill={ink4} fontFamily="sans-serif">Direction</text>
      <text x="228" y="70" fontSize="9" fill={ink4} fontFamily="sans-serif">Brief</text>
      <text x="80" y="93" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">A source that illuminates outward. Others build the frame.</text>
    </svg>,

    /* 1 — The Executor: A concept enters as raw material on the left,
       passes through a series of defined transformation stages,
       and exits as finished output on the right. */
    <svg viewBox="0 0 340 145" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 145 }}>
      <ellipse cx="32" cy="50" rx="22" ry="14" fill={bg} stroke={ink4} strokeWidth=".9" strokeDasharray="3 2" opacity=".7"/>
      <text x="32" y="54" textAnchor="middle" fontSize="8" fill={ink4} fontFamily="sans-serif">Concept</text>
      {['Develop','Refine','Execute','Deliver'].map((label, i) => {
        const x = 80 + i * 58;
        return <g key={i}>
          <rect x={x-22} y={38} width={44} height={24} rx="5" fill={T} fillOpacity={.12+i*.05} stroke={T} strokeWidth=".8"/>
          <text x={x} y={53} textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">{label}</text>
          {i < 3 && <path d={`M${x+22} 50 L${x+36} 50`} stroke={ink4} strokeWidth=".9" markerEnd="url(#arr)" opacity=".5"/>}
        </g>;
      })}
      <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0 1 L4 3 L0 5" fill="none" stroke={ink4} strokeWidth=".8"/></marker></defs>
      <ellipse cx="312" cy="50" rx="20" ry="12" fill={T} fillOpacity=".2" stroke={T} strokeWidth=".9"/>
      <text x="312" y="54" textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">Output</text>
      <text x="170" y="90" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Concept enters. Finished work emerges. Each stage accountable.</text>
    </svg>,

    /* 2 — The Collaborator: A central node with many spokes —
       the CD as connective tissue, maintaining coherence across
       a distributed team rather than issuing from a single point. */
    <svg viewBox="0 0 340 145" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 145 }}>
      <circle cx="170" cy="48" r="18" fill={T} fillOpacity=".15" stroke={T} strokeWidth="1.1"/>
      <circle cx="170" cy="48" r="8" fill={T} opacity=".7"/>
      <text x="170" y="52" textAnchor="middle" fontSize="7.5" fill="#fff" fontFamily="sans-serif">CD</text>
      {[['Photographer',60,18],['Stylist',280,18],['Art Dir',30,65],['Editor',310,65],['Producer',140,92],['Client',200,92]].map(([label,x,y],i) => (
        <g key={i}>
          <line x1="170" y1="48" x2={x} y2={y} stroke={T} strokeWidth=".8" opacity=".35"/>
          <ellipse cx={x} cy={y} rx={label.length*3.2} ry={9} fill={bg} stroke={ink4} strokeWidth=".8" opacity=".8"/>
          <text x={x} y={y+3} textAnchor="middle" fontSize="7.5" fill={ink4} fontFamily="sans-serif">{label}</text>
        </g>
      ))}
      <text x="170" y="102" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Coherence held at the centre. Each spoke essential to the whole.</text>
    </svg>,

    /* 3 — The Auteur: A single continuous thread winding through
       every project — the same unmistakable visual language
       appearing across different surfaces and formats. */
    <svg viewBox="0 0 340 145" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 145 }}>
      <path d="M20 50 C50 20 80 80 110 50 C140 20 170 80 200 50 C230 20 260 80 290 50 C310 35 320 50 330 50" fill="none" stroke={T} strokeWidth="2" opacity=".7"/>
      {[55,165,270].map((x,i) => <circle key={i} cx={x} cy={50} r={7+i*2} fill={T} fillOpacity=".12" stroke={T} strokeWidth=".8"/>)}
      {[['Campaign',55,82],['Editorial',165,82],['Brand',270,82]].map(([label,x,y]) => (
        <text key={label} x={x} y={y} textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif">{label}</text>
      ))}
      <text x="170" y="96" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">One unbroken voice across every surface it touches.</text>
    </svg>,

    /* 4 — The Generalist: Multiple distinct territories held
       simultaneously — each one a separate domain, the CD moving
       fluidly between all without losing orientation. */
    <svg viewBox="0 0 340 145" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 145 }}>
      {[['Fashion',42,38,28,20],['Film',130,28,24,16],['Music',210,42,26,18],['Brand',288,32,22,15],['Sport',170,72,20,14]].map(([label,cx,cy,rx,ry],i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={T} fillOpacity={.08+i*.03} stroke={T} strokeWidth=".9" strokeDasharray={i%2===0?'':'3 2'}/>
          <text x={cx} y={cy+3} textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">{label}</text>
        </g>
      ))}
      {/* CD marker moving between them */}
      <circle cx="170" cy="48" r="6" fill={ink} opacity=".6"/>
      <text x="170" y="52" textAnchor="middle" fontSize="6" fill="#fff" fontFamily="sans-serif">CD</text>
      <text x="170" y="97" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Many territories. One practitioner. Orientation maintained throughout.</text>
    </svg>,
  ];

  return (
    <div style={{ background: C.pageBg, borderRadius: 12, padding: '20px 16px 14px', marginTop: 4, border: `1px solid ${C.border}` }}>
      {diagrams[index] || null}
    </div>
  );
}

/* ─── OVERVIEW TAB ───────────────────────────────────────────── */
function OverviewTab({ cd }) {
  const [renownedPerson, setRenownedPerson] = useState(null);
  const [openPain, setOpenPain]             = useState(null);
  const [openStyle, setOpenStyle]           = useState(null);
  const [aboutExpanded, setAboutExpanded]   = useState(false);

  return (
    <div>
      {/* ── MY PROFILE ────────────────────────────────────────── */}
      <div style={{ background: C.cardBg, borderRadius: 16, padding: '22px 24px', marginBottom: 28, border: `1px solid ${C.teal}30`, boxShadow: `0 2px 12px ${C.teal}10` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          {/* Photo + orb */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <img src={IKA_PHOTO} alt="Ika Rammutla"
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `2.5px solid ${C.teal}`, display: 'block' }} />
              <div style={{ position: 'absolute', bottom: -3, right: -3, width: 20, height: 20, borderRadius: '50%', background: C.orb, border: `2px solid ${C.cardBg}` }} />
            </div>
            <span style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.teal, background: C.tealSoft, padding: '2px 8px', borderRadius: 20 }}>My Profile</span>
          </div>
          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 3 }}>
              <div>
                <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 18, color: C.ink, letterSpacing: '-.3px' }}>{IKA_PROFILE.name}</div>
                <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink3, marginTop: 2 }}>{IKA_PROFILE.role} · {IKA_PROFILE.org}</div>
                <div style={{ fontFamily: MONO, fontSize: 9.5, color: C.ink4, marginTop: 3, letterSpacing: '.02em' }}>{IKA_PROFILE.location}</div>
              </div>
              <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                <span style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, color: C.teal, background: C.tealSoft, padding: '3px 9px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.05em' }}>{IKA_PROFILE.industry}</span>
              </div>
            </div>
            <p style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, lineHeight: 1.7, margin: '10px 0 12px' }}>{IKA_PROFILE.bio}</p>
            {/* Recent work chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {IKA_PROFILE.renownedWorks.slice(0, 3).map((w, i) => (
                <span key={i} style={{ fontFamily: BODY, fontSize: 11, color: C.ink2, background: C.pageBg, border: `1px solid ${C.border}`, padding: '3px 9px', borderRadius: 20 }}>{w.split(' —')[0]}</span>
              ))}
            </div>
            {/* Links */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {IKA_PROFILE.links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: BODY, fontSize: 12, color: C.teal, fontWeight: 600, textDecoration: 'none', background: C.tealLight, padding: '4px 12px', borderRadius: 20, transition: 'opacity .12s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '.75'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  <Icon ic={Ic.launch} size={11} /> {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ABOUT ──────────────────────────────────────────────── */}
      <div style={{ background: C.cardBg, borderRadius: 16, padding: '24px 28px', marginBottom: 28, boxShadow: '0 1px 8px rgba(0,0,0,.05)', border: `1px solid ${C.border}` }}>
        <SectionLabel sub="A formal account of the role, its scope, and its distinction within the creative professions.">About the Creative Director</SectionLabel>
        <p style={{ fontFamily: BODY, fontSize: 14, color: C.ink2, lineHeight: 1.85, margin: '0 0 14px' }}>
          A <strong style={{ color: C.ink, fontWeight: 600 }}>Creative Director</strong> is a senior creative professional responsible for establishing and maintaining the overall creative vision of a project, campaign, or brand. They set the conceptual and aesthetic direction across all visual and communicative outputs, ensuring coherence, intentionality, and quality from brief to delivery.
        </p>

        {aboutExpanded && (
          <>
            <p style={{ fontFamily: BODY, fontSize: 14, color: C.ink2, lineHeight: 1.85, margin: '0 0 18px' }}>
              The role requires a combination of creative leadership, strategic thinking, and production literacy. A Creative Director must be able to develop original concepts, articulate a clear visual language, and translate that language across disciplines — photography, film, design, copy, styling, and spatial environments — while managing the people and processes required to execute at a professional level.
            </p>
            <p style={{ fontFamily: BODY, fontSize: 14, color: C.ink2, lineHeight: 1.85, margin: '0 0 18px' }}>
              Creative Directors operate across industries including fashion, advertising, film and television, music, publishing, and brand communications. They work in agencies, studios, in-house creative departments, and as independent practitioners. Regardless of context, the core function remains consistent: to own the creative standard of the work and be accountable for its outcome.
            </p>
            <p style={{ fontFamily: BODY, fontSize: 14, color: C.ink2, lineHeight: 1.85, margin: '0 0 14px' }}>
              The title carries significant professional weight and is typically earned through years of practice across adjacent disciplines — art direction, design, photography, production — before the practitioner assumes full creative leadership. It is distinct from the Art Director, who executes within a defined visual language, and from the Producer, who manages the logistical conditions for execution. The Creative Director is accountable for the vision itself.
            </p>
          </>
        )}

        <button
          onClick={() => setAboutExpanded(x => !x)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: BODY, fontSize: 13, fontWeight: 600, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'opacity .12s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.7'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {aboutExpanded ? 'Show less' : 'Learn more'}
          <span style={{ display: 'block', transition: 'transform .2s', transform: aboutExpanded ? 'rotate(180deg)' : 'none', fontFamily: MONO, fontSize: 11, lineHeight: 1 }}>▾</span>
        </button>
      </div>


         {/* ── RENOWNED CREATIVE DIRECTORS ──────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionLabel sub="Senior creative professionals who have defined industry practice across fashion, film, advertising, and culture.">Renowned Creative Directors</SectionLabel>
        <RenownedCarousel
          people={RENOWNED}
          onSelect={setRenownedPerson}
          onCreateProfile={() => {}}
        />
      </div>

      {/* Renowned person modal */}
      {renownedPerson && <RenownedModal person={renownedPerson} onClose={() => setRenownedPerson(null)} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Left column */}
        <div>
          {/* Pain Points — accordion */}
          <SectionLabel sub="The recurring frictions that slow creative work and fragment professional momentum.">Pain Points</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
            {cd.painPoints.map((p, i) => {
              const isOpen = openPain === i;
              return (
                <div key={i}
                  style={{ background: C.cardBg, borderRadius: 10, border: `1px solid ${isOpen ? C.teal + '44' : C.border}`, overflow: 'hidden', transition: 'all .15s', boxShadow: isOpen ? `0 0 0 3px ${C.teal}08` : '0 1px 4px rgba(0,0,0,.04)' }}>
                  <button
                    onClick={() => setOpenPain(isOpen ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: isOpen ? C.teal : C.ink4, flexShrink: 0, transition: 'background .15s' }} />
                      <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: isOpen ? C.teal : C.ink, transition: 'color .15s' }}>{p.label}</span>
                    </div>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: C.ink4, display: 'block', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 14px 16px 14px' }}>
                      <PainPointDiagram index={i} />
                      <p style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, lineHeight: 1.7, margin: '12px 0 0 0', paddingLeft: 16 }}>{p.body}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Working Style Types — accordion */}
          <SectionLabel sub="Five distinct modes through which Creative Directors organise their practice.">Working Style Types</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cd.workingStyles.map((ws, i) => {
              const isOpen = openStyle === i;
              return (
                <div key={i}
                  style={{ background: C.cardBg, borderRadius: 10, border: `1px solid ${isOpen ? C.teal + '44' : C.border}`, overflow: 'hidden', transition: 'all .15s', boxShadow: isOpen ? `0 0 0 3px ${C.teal}08` : '0 1px 4px rgba(0,0,0,.04)' }}>
                  <button
                    onClick={() => setOpenStyle(isOpen ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                      <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: isOpen ? '#fff' : C.teal, background: isOpen ? C.teal : C.tealSoft, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap', transition: 'all .15s' }}>{ws.type}</div>
                    </div>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: C.ink4, display: 'block', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 14px 16px 14px' }}>
                      <WorkingStyleDiagram index={i} />
                      <p style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, lineHeight: 1.7, margin: '12px 0 0 0', paddingLeft: 16 }}>{ws.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div>
          <SectionLabel sub="The professional network a Creative Director depends on to realise their vision.">Collaborators</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {cd.collaborators.map(c => <Chip key={c} label={c} small />)}
          </div>
          <Divider />
          {[
            { label: 'Rate', val: cd.rate },
            { label: 'Works with', val: cd.works },
            { label: 'Focus', val: cd.focus },
            { label: 'Industries', val: cd.industries },
          ].map(({ label, val }) => (
            <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 600, color: C.ink4, width: 78, flexShrink: 0, paddingTop: 1, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
              <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink2, flex: 1, lineHeight: 1.55 }}>{val}</div>
            </div>
          ))}
          <Divider />
          <SectionLabel sub="The platforms and software central to creative production practice.">Common Tools</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
            {cd.tools.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 600, color: C.ink4, width: 78, flexShrink: 0, paddingTop: 1 }}>{t.cat}</div>
                <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink3, flex: 1, lineHeight: 1.55 }}>{t.list}</div>
              </div>
            ))}
          </div>
          <Divider />
          <SectionLabel sub="The documents, decisions, and deliverables a Creative Director is responsible for producing.">Outputs</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cd.outputs.map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.teal, flexShrink: 0 }} />
                <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3 }}>{o}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



/* ─── TASK UNIVERSE TAB ──────────────────────────────────────── */
/* ─── WORKFLOW TAB ────────────────────────────────────────────── */
const TEMPLATE_WORKFLOWS = [
  {
    id: 'brand-campaign', icon: '✦', label: 'Brand Campaign', sub: 'Full concept to delivery',
    steps: ['Client brief intake', 'Concept & narrative development', 'Visual direction & moodboard', 'Collaborator sourcing', 'Pre-production & shoot', 'Post-production review', 'Campaign delivery'],
  },
  {
    id: 'editorial', icon: '▣', label: 'Editorial Shoot', sub: 'Publish-ready content',
    steps: ['Concept ideation', 'Styling & casting', 'Set design direction', 'Photography direction', 'Post-production selects', 'Final sequencing'],
  },
  {
    id: 'music-video', icon: '◎', label: 'Music Video', sub: 'Performance & narrative',
    steps: ['Artist brief & vision', 'Treatment development', 'Visual translation', 'Production planning', 'On-set supervision', 'Post-production direction', 'Final cut approval'],
  },
  {
    id: 'brand-identity', icon: '◇', label: 'Brand Identity', sub: 'Visual language system',
    steps: ['Brand discovery session', 'Competitive analysis', 'Visual identity development', 'Design system definition', 'Brand guidelines creation', 'Rollout direction'],
  },
  {
    id: 'event', icon: '◈', label: 'Event & Experience', sub: 'Spatial storytelling',
    steps: ['Event concepting', 'Set design direction', 'Spatial storytelling', 'Collaborator briefing', 'On-site creative direction', 'Final output & documentation'],
  },
];

function WorkflowCard({ w, index, onClick }) {
  const [hov, setHov] = useState(false);

  // Each step gets a distinct tonal gradient header
  const STEP_GRADIENTS = [
    'linear-gradient(145deg, #0F3D3A 0%, #0B7A75 60%, #12A89F 100%)',   // 01 deep teal
    'linear-gradient(145deg, #1A2D1A 0%, #2A5A35 60%, #3D8C50 100%)',   // 02 forest
    'linear-gradient(145deg, #1A1A2E 0%, #2C2560 60%, #4A3D8C 100%)',   // 03 indigo
    'linear-gradient(145deg, #2E1A0A 0%, #6B3A12 60%, #A05A20 100%)',   // 04 amber
    'linear-gradient(145deg, #1A0A2E 0%, #3D1460 60%, #6B2A8C 100%)',   // 05 plum
    'linear-gradient(145deg, #0A1A2E 0%, #143060 60%, #2050A0 100%)',   // 06 cobalt
  ];

  // Small SVG illustration per step — organic, minimal
  const STEP_ILLUSTRATIONS = [
    // 01 Concept — a single glowing nucleus
    <svg viewBox="0 0 120 80" style={{ width: '100%', height: 80 }}>
      <circle cx="60" cy="40" r="22" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1"/>
      <circle cx="60" cy="40" r="12" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1"/>
      <circle cx="60" cy="40" r="5" fill="rgba(255,255,255,.85)"/>
      {[0,60,120,180,240,300].map((deg,i) => { const r=deg*Math.PI/180; return <line key={i} x1={60+Math.cos(r)*14} y1={40+Math.sin(r)*14} x2={60+Math.cos(r)*26} y2={40+Math.sin(r)*26} stroke="rgba(255,255,255,.25)" strokeWidth=".8"/>; })}
    </svg>,
    // 02 Campaign — three overlapping circles (touchpoints)
    <svg viewBox="0 0 120 80" style={{ width: '100%', height: 80 }}>
      <circle cx="38" cy="40" r="18" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.2"/>
      <circle cx="60" cy="40" r="18" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.2"/>
      <circle cx="82" cy="40" r="18" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.2"/>
      <ellipse cx="49" cy="40" rx="5" ry="10" fill="rgba(255,255,255,.12)"/>
      <ellipse cx="71" cy="40" rx="5" ry="10" fill="rgba(255,255,255,.12)"/>
    </svg>,
    // 03 Visual — a grid of small squares (moodboard)
    <svg viewBox="0 0 120 80" style={{ width: '100%', height: 80 }}>
      {[0,1,2,3,4,5].map(i => { const x=28+( i%3)*22; const y=22+Math.floor(i/3)*22; return <rect key={i} x={x} y={y} width={18} height={14} rx="2" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.25)" strokeWidth=".8"/>; })}
    </svg>,
    // 04 Production — a timeline bar
    <svg viewBox="0 0 120 80" style={{ width: '100%', height: 80 }}>
      <line x1="18" y1="40" x2="102" y2="40" stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
      {[18,38,58,78,102].map((x,i) => <circle key={i} cx={x} cy={40} r={i===0||i===4?5:3.5} fill={i===0||i===4?'rgba(255,255,255,.9)':'rgba(255,255,255,.45)'} stroke="none"/>)}
    </svg>,
    // 05 Collaboration — hub and spokes
    <svg viewBox="0 0 120 80" style={{ width: '100%', height: 80 }}>
      <circle cx="60" cy="40" r="10" fill="rgba(255,255,255,.85)"/>
      {[[-30,-22],[30,-22],[36,10],[-36,10],[0,-28]].map(([dx,dy],i) => <g key={i}><line x1="60" y1="40" x2={60+dx} y2={40+dy} stroke="rgba(255,255,255,.3)" strokeWidth=".9"/><circle cx={60+dx} cy={40+dy} r="5" fill="rgba(255,255,255,.4)"/></g>)}
    </svg>,
    // 06 Final output — nested rectangles converging to a point
    <svg viewBox="0 0 120 80" style={{ width: '100%', height: 80 }}>
      {[24,16,9].map((r,i) => <rect key={i} x={60-r*1.6} y={40-r} width={r*3.2} height={r*2} rx="2" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth=".9" opacity={1-i*.2}/>)}
      <circle cx="60" cy="40" r="3" fill="rgba(255,255,255,.9)"/>
    </svg>,
  ];

  return (
    <div
      onClick={() => onClick && onClick(w, index)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flexShrink: 0,
        width: 200,
        background: C.cardBg,
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${hov ? C.teal + '55' : C.border}`,
        boxShadow: hov ? '0 12px 32px rgba(0,0,0,.13)' : '0 2px 10px rgba(0,0,0,.06)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'default',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform .2s ease, box-shadow .2s ease, border-color .15s ease',
      }}
    >
      {/* Illustrated header */}
      <div style={{ background: STEP_GRADIENTS[index] || STEP_GRADIENTS[0], padding: '18px 16px 10px', position: 'relative', flexShrink: 0 }}>
        {/* Step badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', background: 'rgba(255,255,255,.1)', padding: '3px 8px', borderRadius: 20 }}>{w.step}</span>
          {hov && (
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={10} height={10} viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
            </div>
          )}
        </div>
        {/* Illustration */}
        <div style={{ opacity: hov ? 1 : 0.75, transition: 'opacity .2s' }}>
          {STEP_ILLUSTRATIONS[index] || STEP_ILLUSTRATIONS[0]}
        </div>
      </div>
      {/* Info */}
      <div style={{ padding: '13px 14px 15px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13, color: C.ink, lineHeight: 1.25 }}>{w.name}</div>
        <div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink4, lineHeight: 1.6 }}>{w.desc}</div>
      </div>
    </div>
  );
}

/* ─── TASK TAB ────────────────────────────────────────────────── */
function TaskTab({ cd }) {
  const [openDomain, setOpenDomain] = useState(null);
  const [launcher, setLauncher]     = useState(null);

  return (
    <div>
      <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink3, marginBottom: 20, lineHeight: 1.65, maxWidth: 640 }}>
        All the work a Creative Director actually does — organised by domain. Expand any domain, then hit <strong style={{ color: C.ink }}>Start</strong> to attach a task to a project.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {cd.taskDomains.map((td, i) => {
          const isOpen = openDomain === i;
          return (
            <div key={i} style={{ background: isOpen ? C.tealLight : C.cardBg, borderRadius: 12, overflow: 'hidden', border: `1px solid ${isOpen ? C.teal + '44' : C.border}`, transition: 'all .15s', alignSelf: 'start' }}>
              <div onClick={() => setOpenDomain(isOpen ? null : i)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: isOpen ? C.teal : C.ink }}>{td.domain}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: MONO, fontSize: 9.5, color: C.ink4 }}>{td.tasks.length}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: C.ink4, display: 'block', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: '0 10px 12px' }}>
                  {td.tasks.map((task, j) => (
                    <div key={j}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '7px 10px', background: 'rgba(255,255,255,.75)', borderRadius: 7, border: `1px solid ${C.border}`, marginBottom: 5, transition: 'all .12s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.teal + '44'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.75)'; e.currentTarget.style.borderColor = C.border; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.teal, flexShrink: 0 }} />
                        <span style={{ fontFamily: BODY, fontSize: 12, color: C.ink2 }}>{task}</span>
                      </div>
                      <button onClick={e => { e.stopPropagation(); setLauncher({ task, domain: td.domain }); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, height: 26, padding: '0 10px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 13, fontFamily: BODY, fontSize: 11, fontWeight: 500, color: C.ink3, cursor: 'pointer', flexShrink: 0, transition: 'all .12s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#E8E7E3'; e.currentTarget.style.color = C.ink2; }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.color = C.ink3; }}>
                        <Icon ic={Ic.plus} size={9} style={{ opacity: .55 }} /> Start
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {launcher && <ProjectLauncher task={launcher.task} domain={launcher.domain} onClose={() => setLauncher(null)} onLaunch={() => {}} />}
    </div>
  );
}

/* ─── nOS FLOW TAB ───────────────────────────────────────────── */
/* ─── NIA STEP CHAT ──────────────────────────────────────────── */
const STEP_CTAS = [
  { label: 'Set up my profile',    opening: "Let's build your nOS identity profile together. I'll ask you a few focused questions — this should take about three minutes.\n\nFirst: which creative disciplines best describe your practice? (e.g. Fashion, Film, Brand, Editorial, Music — pick as many as apply.)" },
  { label: 'Capture an idea',      opening: "Drop your idea here — no structure needed. Write exactly as you would to a trusted collaborator: a feeling, a reference, a client name, a half-formed instinct.\n\nWhat's on your mind right now?" },
  { label: 'Open a project',       opening: "Let's frame this as a project. I'll ask for the minimum — just what I need to build your workspace and autofill the rest from your profile.\n\nWhat type of project is this? (e.g. Campaign shoot, Editorial, Brand identity, Music video, Event)" },
  { label: 'Generate brief',       opening: "I'll synthesise your idea, project context, and identity profile into a full creative brief.\n\nTo start: what is the core idea or concept for this project? Describe it in one or two sentences — as you would to your best collaborator." },
  { label: 'Build moodboard',      opening: "Let's build your visual direction. I can pull from Pinterest, Instagram, Are.na, or your own archive — or you can describe what you're after and I'll suggest references.\n\nHow would you describe the mood or visual territory for this project?" },
  { label: 'Match collaborators',  opening: "I'll find the right people for this project — matched by skill, taste, and history with your work.\n\nWhat roles do you need? (e.g. Photographer, Stylist, Art Director, Editor, Producer — list as many as you need.)" },
  { label: 'Build production plan',opening: "Let's turn your brief into a production structure. I'll generate a shoot day timeline, call sheet, and delivery checklist.\n\nFirst: what is the confirmed shoot date, or the window you're working toward?" },
  { label: 'Log a decision',       opening: "I'll capture what's happening on set or in production and attach it to your project record.\n\nWhat decision, direction change, or note do you want to log?" },
  { label: 'Track deliverables',   opening: "Let's review your delivery checklist and update the status of each item.\n\nWhich deliverable are you checking in on? (I can show you the full list if you'd like.)" },
  { label: 'Prepare delivery',     opening: "Let's package your approved selects for delivery. I'll generate a formatted delivery set with platform specs and a client-facing summary.\n\nWhich project are we delivering from?" },
  { label: 'Archive this project', opening: "Let's close this project and extract what we've learned. I'll update your identity profile with new taste signals, collaborator rankings, and project patterns.\n\nWhat would you say was the defining creative decision on this project?" },
];

async function callNiaStep(userMsg, history, stepName, stepSteps) {
  const system = `You are Nia, a warm and intelligent creative production assistant inside the nOS (Nia Operating System) for a Creative Director. You are currently guiding the user through the nOS step: "${stepName}".

The three sub-steps for this stage are:
${stepSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Guide the user through these steps conversationally. Ask one question at a time. Acknowledge each answer warmly and briefly (one sentence), then move to the next logical question or action. When all sub-steps are complete, summarise what's been captured and tell the user what Nia will prepare next. Be concise — under 120 words per response.`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 200, system,
        messages: history.concat([{ role: 'user', content: userMsg }])
      })
    });
    const d = await r.json();
    return d.content?.[0]?.text || '';
  } catch { return 'Something went quiet. Try again in a moment.'; }
}

function NiaStepChat({ stepIndex, stepName, stepSteps, cta, onClose }) {
  const [messages, setMessages] = useState([{ role: 'nia', text: STEP_CTAS[stepIndex]?.opening || `Let's work through "${stepName}" together.` }]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [history, setHistory]   = useState([]);
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    const newHistory = [...history, { role: 'user', content: text }];
    const niaSays = await callNiaStep(text, history, stepName, stepSteps);
    setMessages(m => [...m, { role: 'nia', text: niaSays }]);
    setHistory([...newHistory, { role: 'assistant', content: niaSays }]);
    setLoading(false);
  };

  // Sub-step progress — count user turns
  const userTurns = messages.filter(m => m.role === 'user').length;
  const progress  = Math.min(100, Math.round((userTurns / (stepSteps.length || 3)) * 100));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(15,14,12,.52)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={onClose}>
      <div style={{ background: C.cardBg, borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 680, maxHeight: '78vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -16px 60px rgba(0,0,0,.2)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: '#2C2520', padding: '16px 22px 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon ic={Ic.spark} size={13} style={{ color: '#fff' }} />
              </div>
              <div>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13.5, color: '#F5EDE0' }}>{stepName}</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(239,222,196,.4)', letterSpacing: '.05em', textTransform: 'uppercase', marginTop: 1 }}>Nia is guiding you through {stepSteps.length} steps</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(239,222,196,.5)' }}>
              <Icon ic={Ic.close} size={10} />
            </button>
          </div>
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 2.5, background: 'rgba(255,255,255,.1)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: C.teal, borderRadius: 2, transition: 'width .4s ease' }} />
            </div>
            <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(239,222,196,.4)', whiteSpace: 'nowrap' }}>
              {Math.min(userTurns, stepSteps.length)}/{stepSteps.length} steps
            </span>
          </div>
        </div>

        {/* Sub-step pills */}
        <div style={{ padding: '10px 22px 8px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
          {stepSteps.map((step, j) => {
            const done = j < userTurns;
            const active = j === userTurns;
            return (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: done ? C.teal : active ? C.tealSoft : C.pageBg, border: `1px solid ${done ? C.teal : active ? C.teal + '55' : C.border}`, transition: 'all .2s' }}>
                {done && <Icon ic={Ic.check} size={9} style={{ color: '#fff' }} />}
                <span style={{ fontFamily: BODY, fontSize: 10.5, color: done ? '#fff' : active ? C.teal : C.ink4, fontWeight: active || done ? 600 : 400, lineHeight: 1.3 }}>
                  {step.length > 38 ? step.slice(0, 36) + '…' : step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Chat messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              {m.role === 'nia' && (
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Icon ic={Ic.spark} size={12} style={{ color: '#fff' }} />
                </div>
              )}
              <div style={{ maxWidth: '84%', background: m.role === 'nia' ? C.pageBg : C.teal, color: m.role === 'nia' ? C.ink2 : '#fff', borderRadius: m.role === 'nia' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', padding: '11px 14px', fontFamily: BODY, fontSize: 13.5, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon ic={Ic.spark} size={12} style={{ color: '#fff' }} />
              </div>
              <div style={{ padding: '10px 14px', background: C.pageBg, borderRadius: '4px 14px 14px 14px', display: 'flex', gap: 5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: C.ink4, animation: `pulse .9s ${i*.15}s ease-in-out infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 22px 22px', borderTop: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', gap: 9 }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Reply to Nia…"
            style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '11px 15px', fontFamily: BODY, fontSize: 13.5, color: C.ink, background: C.pageBg, outline: 'none' }} />
          <button onClick={send} disabled={!input.trim() || loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, height: 44, padding: '0 16px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 12, fontFamily: BODY, fontSize: 13, fontWeight: 500, color: input.trim() && !loading ? C.ink2 : C.ink4, cursor: input.trim() && !loading ? 'pointer' : 'default', transition: 'all .12s', opacity: input.trim() && !loading ? 1 : .5 }}
            onMouseEnter={e => { if (input.trim() && !loading) { e.currentTarget.style.background = '#E8E7E3'; e.currentTarget.style.borderColor = C.borderMd; } }}
            onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.borderColor = C.border; }}>
            <Icon ic={Ic.send} size={12} style={{ opacity: .65 }} />
            Send
          </button>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:1;transform:scale(1.35)}}`}</style>
      </div>
    </div>
  );
}



function FlowsTab({ cd, onNewProject }) {
  const [openStep, setOpenStep]           = useState(null);
  const [activeStepChat, setActiveStepChat] = useState(null); // index of step chat open
  const T = C.teal; const ink4 = C.ink4; const bg = C.pageBg; const ink = C.ink;

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Carousel state for workflow steps
  const trackRef = useRef(null);
  const stateRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0, velX: 0, lastX: 0, lastT: 0, clicked: true });
  const rafRef   = useRef(null);
  const CARD_W   = 200;
  const GAP      = 14;
  const FRICTION = 0.93;

  const cancelMomentum = () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  const runMomentum = () => {
    const s = stateRef.current; const el = trackRef.current; if (!el) return;
    s.velX *= FRICTION;
    if (Math.abs(s.velX) < 0.3) { s.velX = 0; return; }
    el.scrollLeft -= s.velX;
    rafRef.current = requestAnimationFrame(runMomentum);
  };
  const onMouseDown = (e) => { cancelMomentum(); const s = stateRef.current; s.isDragging = true; s.startX = e.pageX - trackRef.current.offsetLeft; s.scrollLeft = trackRef.current.scrollLeft; s.velX = 0; s.lastX = e.pageX; s.lastT = Date.now(); s.clicked = true; trackRef.current.style.cursor = 'grabbing'; };
  const onMouseMove = (e) => { const s = stateRef.current; if (!s.isDragging) return; e.preventDefault(); const now = Date.now(); const dx = e.pageX - s.lastX; const dt = now - s.lastT || 16; s.velX = dx / dt * 16; s.lastX = e.pageX; s.lastT = now; if (Math.abs(e.pageX - (s.startX + trackRef.current.offsetLeft - trackRef.current.scrollLeft)) > 4) s.clicked = false; trackRef.current.scrollLeft = s.scrollLeft - (e.pageX - s.startX - trackRef.current.offsetLeft); };
  const onMouseUp   = () => { const s = stateRef.current; if (!s.isDragging) return; s.isDragging = false; trackRef.current.style.cursor = 'grab'; rafRef.current = requestAnimationFrame(runMomentum); };
  const scrollBy = (dir) => { cancelMomentum(); const el = trackRef.current; const target = el.scrollLeft + dir * (CARD_W + GAP) * 2; const start = el.scrollLeft; const diff = target - start; const dur = 480; let t0 = null; const ease = t => t < .5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; const step = ts => { if (!t0) t0 = ts; const p = Math.min((ts-t0)/dur,1); el.scrollLeft = start + diff*ease(p); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };


  // Step-by-step implementation detail + diagram for each nOS flow step
  const stepDetail = [
    {
      steps: ['Nia presents a short conversational onboarding — five to seven questions covering your disciplines, working region, aesthetic signals, and key collaborators.', 'Each answer is parsed for taste signals: references to specific movements, industries, or aesthetics are extracted and stored.', 'If Instagram or Behance is connected, Nia reads your visual history and pre-populates your taste profile automatically.'],
      output: 'Identity profile: archetype, working style type, discipline map, taste anchors, collaborator seed list.',
      diagram: <svg viewBox="0 0 320 105" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 105 }}>
        {['Disciplines','Region','Taste','Collaborators','Portfolio'].map((label, i) => (
          <g key={i}>
            <rect x={i*62+4} y={10} width={56} height={22} rx={11} fill={T} fillOpacity={.1+i*.03} stroke={T} strokeWidth=".7"/>
            <text x={i*62+32} y={24} textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">{label}</text>
            <path d={`M${i*62+60} 21 L${i*62+66} 21`} stroke={ink4} strokeWidth=".7" opacity=".4"/>
          </g>
        ))}
        <ellipse cx="160" cy="55" rx="60" ry="10" fill={T} fillOpacity=".12" stroke={T} strokeWidth=".8"/>
        <text x="160" y="59" textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">Identity Profile</text>
      </svg>,
    },
    {
      steps: ['A single open text field — no template, no structure imposed. Write exactly as you would to a collaborator: a feeling, a reference, a client name, a half-formed thought.', 'Nia scans the input for: client name (pulls brand history), project type (suggests matching workflow), timeline signals (extracts dates), and aesthetic language (adds to taste profile).', 'If active projects exist, Nia asks whether this belongs to one or starts something new.'],
      output: 'A captured seed — tagged, timestamped, and linked to your profile context.',
      diagram: <svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 100 }}>
        <rect x="8" y="8" width="180" height="30" rx="8" fill={bg} stroke={ink4} strokeWidth=".9" strokeDasharray="3 2" opacity=".6"/>
        <text x="98" y="27" textAnchor="middle" fontSize="9" fill={ink4} fontFamily="sans-serif" fontStyle="italic">"Something editorial, moody, maybe Thebe..."</text>
        <path d="M190 23 L210 23" stroke={ink4} strokeWidth=".8" opacity=".4"/>
        <text x="205" y="19" fontSize="7.5" fill={T} fontFamily="sans-serif">client?</text>
        <text x="205" y="28" fontSize="7.5" fill={T} fontFamily="sans-serif">type?</text>
        <text x="205" y="37" fontSize="7.5" fill={T} fontFamily="sans-serif">aesthetic?</text>
        <ellipse cx="280" cy="23" rx="32" ry="13" fill={T} fillOpacity=".12" stroke={T} strokeWidth=".8"/>
        <text x="280" y="27" textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">Seed captured</text>
        <text x="160" y="57" textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Unedited input → structured context.</text>
      </svg>,
    },
    {
      steps: ['Nia asks only the minimum: project type, client or brand name, timeline, and budget range. Each field autofills from previous work if the client has appeared before.', 'Previous brand guidelines, tone of voice documents, and project history are surfaced and offered as pre-fills. The CD confirms or overrides.', 'A project workspace opens: brief section, reference section, team section, and delivery checklist — all blank but structured.'],
      output: 'A named project with confirmed scope, autofilled brand context, and an empty but ready structure.',
      diagram: <svg viewBox="0 0 320 105" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 105 }}>
        {[['Type','✓ autofill',44],['Client','✓ autofill',114],['Timeline','⬚ enter',188],['Budget','⬚ enter',258]].map(([label,status,x]) => (
          <g key={label}>
            <rect x={x-30} y={10} width={68} height={34} rx={7} fill={bg} stroke={status.includes('✓') ? T : ink4} strokeWidth=".8" opacity=".8"/>
            <text x={x+4} y={23} textAnchor="middle" fontSize="8" fill={ink} fontFamily="sans-serif" fontWeight="600">{label}</text>
            <text x={x+4} y={36} textAnchor="middle" fontSize="8" fill={status.includes('✓') ? T : ink4} fontFamily="sans-serif">{status}</text>
          </g>
        ))}
        <text x="160" y="60" textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Known information surfaces. Unknown information is requested once.</text>
      </svg>,
    },
    {
      steps: ['Nia synthesises the captured idea, the project context, and the CD\'s identity profile into a structured creative brief.', 'The brief contains: a direction statement, visual mood, tone of voice, audience definition, deliverables list, timeline with milestones, collaborators required, and a suggested shot structure.', 'The CD reviews each section inline and can edit any field. Every edit trains Nia\'s understanding of this CD\'s preferences for future briefs.'],
      output: 'A complete creative brief — personalised, production-ready, and editable.',
      diagram: <svg viewBox="0 0 320 105" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 105 }}>
        <ellipse cx="38" cy="35" rx="28" ry="22" fill={T} fillOpacity=".1" stroke={T} strokeWidth=".9"/>
        <text x="38" y="31" textAnchor="middle" fontSize="7.5" fill={T} fontFamily="sans-serif">Idea</text>
        <text x="38" y="41" textAnchor="middle" fontSize="7.5" fill={T} fontFamily="sans-serif">+ Profile</text>
        <path d="M68 35 L90 35" stroke={ink4} strokeWidth=".8" opacity=".4"/>
        <text x="100" y="39" textAnchor="middle" fontSize="16" fill={T} opacity=".5">⚙</text>
        <path d="M118 35 L138 35" stroke={ink4} strokeWidth=".8" opacity=".4"/>
        <rect x="140" y="12" width="160" height="46" rx="8" fill={bg} stroke={T} strokeWidth=".9"/>
        {['Direction statement','Visual mood','Deliverables','Timeline'].map((item, i) => (
          <g key={i}>
            <circle cx="153" cy={23+i*10} r="2.5" fill={T} opacity=".6"/>
            <text x="160" y={26+i*10} fontSize="8" fill={ink4} fontFamily="sans-serif">{item}</text>
          </g>
        ))}
        <text x="160" y="66" textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Three inputs. One coherent document.</text>
      </svg>,
    },
    {
      steps: ['The CD imports references from Pinterest, Instagram, Are.na, or direct upload. Each reference is tagged by Nia with visual language descriptors: mood, palette, composition style, discipline.', 'References are organised into a living moodboard — searchable, filterable, and shareable with collaborators.', 'Nia cross-references the moodboard against the CD\'s taste profile and surfaces additional references from their own archive that match the current project\'s aesthetic signals.'],
      output: 'A structured reference library — tagged, searchable, shareable, and connected to the brief.',
      diagram: <svg viewBox="0 0 320 105" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 105 }}>
        {[['Pinterest',30,25,'#E60023'],['Instagram',100,18,'#C13584'],['Are.na',170,25,'#1919E6'],['Upload',240,18,C.teal]].map(([label,x,y,col]) => (
          <g key={label}>
            <ellipse cx={x} cy={y} rx={label.length*3.4} ry={10} fill={col} fillOpacity=".08" stroke={col} strokeWidth=".8" opacity=".7"/>
            <text x={x} y={y+3} textAnchor="middle" fontSize="8" fill={col} fontFamily="sans-serif">{label}</text>
            <line x1={x} y1={y+10} x2={160} y2={50} stroke={ink4} strokeWidth=".5" strokeDasharray="3 3" opacity=".3"/>
          </g>
        ))}
        <rect x="120" y="43" width="80" height="22" rx="8" fill={T} fillOpacity=".12" stroke={T} strokeWidth=".9"/>
        <text x="160" y="58" textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">Moodboard</text>
        <text x="160" y="68" textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Many sources. One organised visual language.</text>
      </svg>,
    },
    {
      steps: ['Nia reads the confirmed brief and generates a collaborator shortlist ranked by: skills required, taste alignment score, location, availability, and previous collaboration history with this CD.', 'Each collaborator receives a role-scoped view of the brief — the photographer sees their visual direction; the producer sees the logistics; the stylist sees the aesthetic references.', 'The CD confirms the team. Nia logs the selection and updates the collaborator ranking model for future projects.'],
      output: 'A confirmed production team with role-specific brief access and a first point of contact for each.',
      diagram: <svg viewBox="0 0 320 105" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 105 }}>
        <rect x="4" y="10" width="80" height="30" rx="8" fill={T} fillOpacity=".1" stroke={T} strokeWidth=".9"/>
        <text x="44" y="22" textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">Brief</text>
        <text x="44" y="33" textAnchor="middle" fontSize="7.5" fill={T} fontFamily="sans-serif">+ taste match</text>
        <path d="M86 25 L100 25" stroke={ink4} strokeWidth=".7" opacity=".4"/>
        {[['Photographer',160,12],['Stylist',240,12],['Producer',160,44],['Editor',240,44]].map(([label,x,y]) => (
          <g key={label}>
            <rect x={x-34} y={y} width={68} height={18} rx={9} fill={bg} stroke={ink4} strokeWidth=".7" opacity=".75"/>
            <text x={x} y={y+11} textAnchor="middle" fontSize="7.5" fill={ink4} fontFamily="sans-serif">{label}</text>
          </g>
        ))}
        <text x="160" y="68" textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Brief distributed. Each collaborator sees only what they need.</text>
      </svg>,
    },
    {
      steps: ['Nia generates a shoot day structure from the confirmed brief: call times, location logistics, talent schedule, and equipment checklist.', 'A production call sheet is auto-populated with confirmed collaborators, their roles, contact details, and the day\'s schedule. The CD reviews and approves before distribution.', 'A delivery checklist is created from the brief\'s deliverables list — each item trackable through post-production.'],
      output: 'A complete call sheet, shoot day schedule, and delivery checklist — distributed to all confirmed collaborators.',
      diagram: <svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 100 }}>
        {[['Call sheet',50,22],['Schedule',160,14],['Checklist',270,22]].map(([label,x,y]) => (
          <g key={label}>
            <rect x={x-38} y={y} width={76} height={28} rx={7} fill={bg} stroke={T} strokeWidth=".8"/>
            <text x={x} y={y+18} textAnchor="middle" fontSize="9" fill={T} fontFamily="sans-serif">{label}</text>
          </g>
        ))}
        <path d="M90 36 L120 28" stroke={ink4} strokeWidth=".6" strokeDasharray="3 2" opacity=".4"/>
        <path d="M200 28 L232 36" stroke={ink4} strokeWidth=".6" strokeDasharray="3 2" opacity=".4"/>
        <text x="160" y="58" textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Logistics generated from the brief. Nothing invented manually.</text>
      </svg>,
    },
    {
      steps: ['Nia serves as a live communication layer during the shoot. The CD can log real-time decisions — a direction change, a reference addition, a casting note — without leaving the production floor.', 'All logged decisions are attached to the original brief, so the post-production team inherits the full context of what happened on the day.', 'Collaborators can flag updates or questions through their role-scoped view, keeping communication structured rather than dispersed across SMS and WhatsApp.'],
      output: 'A live production log — every decision recorded, every communication traceable, all linked to the original brief.',
      diagram: <svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 100 }}>
        <circle cx="50" cy="30" r="18" fill={T} fillOpacity=".12" stroke={T} strokeWidth=".9"/>
        <text x="50" y="34" textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">Brief</text>
        {[['Direction change',165,14],['Reference added',200,30],['Casting note',165,46]].map(([label,x,y]) => (
          <g key={label}>
            <line x1="68" y1="30" x2={x-label.length*3} y2={y} stroke={ink4} strokeWidth=".6" strokeDasharray="3 3" opacity=".35"/>
            <rect x={x-label.length*3} y={y-8} width={label.length*6} height={16} rx={8} fill={bg} stroke={ink4} strokeWidth=".7" opacity=".8"/>
            <text x={x} y={y+4} textAnchor="middle" fontSize="7.5" fill={ink4} fontFamily="sans-serif">{label}</text>
          </g>
        ))}
        <text x="160" y="60" textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Every decision returns to the brief. Nothing leaves the record.</text>
      </svg>,
    },
    {
      steps: ['The deliverables list from the brief becomes a live post-production checklist. Each item — selects, retouching, colour grading, final cut — is trackable by status.', 'The CD logs direction notes against specific deliverables: frame selections, grading references, edit feedback. These are sent directly to the relevant collaborator\'s workspace.', 'Nia tracks delivery against scope. If a deliverable falls behind, it flags early rather than at deadline.'],
      output: 'A structured post-production flow — every deliverable tracked, every note attributed, scope managed in real time.',
      diagram: <svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 100 }}>
        {[['Selects','✓ done',44],['Retouching','In progress',134],['Colour grade','⬚ pending',224]].map(([label,status,x],i) => (
          <g key={label}>
            <rect x={x-38} y={10} width={76} height={36} rx={8} fill={bg} stroke={i===0?T:i===1?'#C8963A':ink4} strokeWidth={i===0?1.2:.8} opacity=".85"/>
            <text x={x} y={26} textAnchor="middle" fontSize="8" fill={ink} fontFamily="sans-serif" fontWeight="600">{label}</text>
            <text x={x} y={38} textAnchor="middle" fontSize="7.5" fill={i===0?T:i===1?'#C8963A':ink4} fontFamily="sans-serif">{status}</text>
          </g>
        ))}
        <text x="160" y="57" textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Brief becomes checklist. Checklist becomes delivery record.</text>
      </svg>,
    },
    {
      steps: ['The CD reviews all confirmed deliverables and selects the final set for distribution — which images, which edits, in what sequence and format for each platform.', 'Nia generates a delivery package: organised file structure, format specifications per platform, and a client-facing summary of what is being delivered and why.', 'The client receives a read-only delivery link with the approved set and a summary of the creative direction. Their approval is logged in the project record.'],
      output: 'A formatted delivery package and client-facing record of the completed work.',
      diagram: <svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 100 }}>
        <rect x="8" y="10" width="90" height="36" rx="8" fill={T} fillOpacity=".1" stroke={T} strokeWidth=".9"/>
        <text x="53" y="25" textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">Final selects</text>
        <text x="53" y="37" textAnchor="middle" fontSize="7.5" fill={T} fontFamily="sans-serif">(approved set)</text>
        <path d="M100 28 L120 28" stroke={ink4} strokeWidth=".8" opacity=".4"/>
        <rect x="122" y="12" width="76" height="32" rx="8" fill={bg} stroke={ink4} strokeWidth=".8"/>
        <text x="160" y="28" textAnchor="middle" fontSize="8" fill={ink4} fontFamily="sans-serif">Delivery</text>
        <text x="160" y="38" textAnchor="middle" fontSize="7.5" fill={ink4} fontFamily="sans-serif">package</text>
        <path d="M200 28 L220 28" stroke={ink4} strokeWidth=".8" opacity=".4"/>
        <ellipse cx="258" cy="28" rx="38" ry="14" fill={bg} stroke={ink4} strokeWidth=".8"/>
        <text x="258" y="32" textAnchor="middle" fontSize="8" fill={ink4} fontFamily="sans-serif">Client view</text>
        <text x="160" y="58" textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Selection → package → delivery → approval logged.</text>
      </svg>,
    },
    {
      steps: ['The completed project is archived in nOS — tagged by aesthetic category, industry, project type, collaborators involved, and delivery format.', 'Nia extracts patterns from the project: which collaborators performed best, which references most closely matched the final output, how the brief evolved from first draft to delivery.', 'These patterns update the CD\'s identity profile: taste anchors sharpen, collaborator rankings adjust, and the next brief will autofill more accurately than the last.'],
      output: 'An enriched identity profile, a searchable project archive, and a more calibrated starting point for the next project.',
      diagram: <svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 100 }}>
        <rect x="8" y="12" width="72" height="32" rx="8" fill={bg} stroke={ink4} strokeWidth=".8" opacity=".8"/>
        <text x="44" y="31" textAnchor="middle" fontSize="8" fill={ink4} fontFamily="sans-serif">Project</text>
        <path d="M82 28 L100 28" stroke={ink4} strokeWidth=".7" opacity=".4"/>
        <text x="112" y="20" fontSize="7.5" fill={T} fontFamily="sans-serif">→ tags</text>
        <text x="112" y="30" fontSize="7.5" fill={T} fontFamily="sans-serif">→ patterns</text>
        <text x="112" y="40" fontSize="7.5" fill={T} fontFamily="sans-serif">→ insights</text>
        <path d="M170 28 L190 28" stroke={ink4} strokeWidth=".7" opacity=".4"/>
        <ellipse cx="230" cy="28" rx="36" ry="15" fill={T} fillOpacity=".12" stroke={T} strokeWidth="1"/>
        <text x="230" y="24" textAnchor="middle" fontSize="8" fill={T} fontFamily="sans-serif">Profile</text>
        <text x="230" y="34" textAnchor="middle" fontSize="7.5" fill={T} fontFamily="sans-serif">sharpens</text>
        <path d="M266 28 Q295 14 295 28 Q295 42 266 28" fill="none" stroke={T} strokeWidth=".8" strokeDasharray="3 2" opacity=".5"/>
        <text x="160" y="58" textAnchor="middle" fontSize="8.5" fill={ink4} fontFamily="sans-serif" fontStyle="italic">Every project improves the next. The system compounds.</text>
      </svg>,
    },
  ];

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* ── 6-STAGE REAL-WORLD WORKFLOW ── */}
      <div>
        <div style={{ marginBottom: 18 }}>
          <SectionLabel sub="The six stages through which every Creative Director project moves — from first concept to final delivery. This is the skeleton that the nOS Flow steps below animate into action.">6-Stage Real-World Workflow</SectionLabel>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 56, background: `linear-gradient(to right, ${C.pageBg}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 56, background: `linear-gradient(to left, ${C.pageBg}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
          <button onClick={() => scrollBy(-1)} style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', zIndex: 3, width: 32, height: 32, borderRadius: '50%', background: C.cardBg, border: `1px solid ${C.border}`, boxShadow: '0 2px 10px rgba(0,0,0,.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink3, transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.cardBg; e.currentTarget.style.color = C.ink3; }}>
            <Icon ic={Ic.chevLeft} size={14} />
          </button>
          <div ref={trackRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            style={{ display: 'flex', gap: GAP, overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab', paddingLeft: 44, paddingRight: 44, paddingTop: 4, paddingBottom: 14, WebkitOverflowScrolling: 'touch' }}>
            {cd.workflow.map((w, i) => (
              <WorkflowCard key={i} w={w} index={i} />
            ))}
          </div>
          <button onClick={() => scrollBy(1)} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', zIndex: 3, width: 32, height: 32, borderRadius: '50%', background: C.cardBg, border: `1px solid ${C.border}`, boxShadow: '0 2px 10px rgba(0,0,0,.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink3, transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.cardBg; e.currentTarget.style.color = C.ink3; }}>
            <Icon ic={Ic.chevRight} size={14} />
          </button>
        </div>
      </div>

      {/* Bridge text */}
      <div style={{ background: C.cardBg, borderRadius: 14, padding: '20px 24px', border: `1px solid ${C.border}`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: C.teal }}>
          <Icon ic={Ic.nos} size={17} />
        </div>
        <div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 5 }}>How Nia brings each stage to life</div>
          <p style={{ fontFamily: BODY, fontSize: 13, color: C.ink3, lineHeight: 1.7, margin: '0 0 10px' }}>
            The six stages above define the creative arc of every project. The nOS Flow steps below are how Nia implements each stage — breaking them into specific actions, generating outputs, and guiding you through each sub-step. Expand any step to see Nia's intelligence at work, then start a conversation directly.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[{ label: 'Template workflows', icon: Ic.workflow }, { label: 'Step-by-step guidance', icon: Ic.nos }, { label: 'Nia conversations', icon: Ic.ask }].map(({ label, icon }) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: BODY, fontSize: 12, color: C.teal, background: C.tealSoft, padding: '4px 10px', borderRadius: 20 }}>
                <Icon ic={icon} size={11} /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── START CREATING ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <SectionLabel sub="Select a production template and Nia will generate the brief, timeline, and team structure.">Start Creating</SectionLabel>
          <button onClick={onNewProject}
            style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 12.5, fontWeight: 500, color: C.ink2, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .12s', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8E7E3'; e.currentTarget.style.borderColor = C.borderMd; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.borderColor = C.border; }}>
            <Icon ic={Ic.plus} size={11} style={{ opacity: .6 }} /> Blank project
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {TEMPLATE_WORKFLOWS.map(tmpl => {
            const sel = selectedTemplate === tmpl.id;
            return (
              <div key={tmpl.id} onClick={() => setSelectedTemplate(sel ? null : tmpl.id)}
                style={{ background: sel ? C.teal : C.cardBg, borderRadius: 12, border: `1.5px solid ${sel ? C.teal : C.border}`, padding: '14px 14px', cursor: 'pointer', transition: 'all .15s', boxShadow: sel ? `0 6px 20px ${C.teal}30` : '0 1px 6px rgba(0,0,0,.04)' }}
                onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 4px 14px ${C.teal}20`; } }}
                onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,.04)'; } }}>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{tmpl.icon}</div>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13, color: sel ? '#fff' : C.ink, marginBottom: 3, lineHeight: 1.3 }}>{tmpl.label}</div>
                <div style={{ fontFamily: BODY, fontSize: 11, color: sel ? 'rgba(255,255,255,.65)' : C.ink4, lineHeight: 1.5 }}>{tmpl.sub}</div>
              </div>
            );
          })}
        </div>
        {selectedTemplate && (() => {
          const tmpl = TEMPLATE_WORKFLOWS.find(t => t.id === selectedTemplate);
          return (
            <div style={{ marginTop: 16, background: C.pageBg, borderRadius: 14, padding: '20px 22px', border: `1px solid ${C.teal}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 3 }}>{tmpl.label} — Template Workflow</div>
                  <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3 }}>{tmpl.steps.length} stages · Nia will help you complete each one</div>
                </div>
                <button onClick={onNewProject}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 12.5, fontWeight: 500, color: C.ink2, cursor: 'pointer', transition: 'all .12s', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E8E7E3'; e.currentTarget.style.borderColor = C.borderMd; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.borderColor = C.border; }}>
                  <Icon ic={Ic.arrow} size={11} style={{ opacity: .6 }} /> Start this workflow
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tmpl.steps.length}, 1fr)`, gap: 8 }}>
                {tmpl.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
                    {i < tmpl.steps.length - 1 && <div style={{ position: 'absolute', top: 12, left: '50%', right: '-50%', height: 1, background: `${C.teal}30`, zIndex: 0 }} />}
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                      <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: '#fff' }}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div style={{ fontFamily: BODY, fontSize: 11, color: C.ink2, textAlign: 'center', lineHeight: 1.45 }}>{step}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── nOS FLOW ACCORDION ── */}
      <div>
        <SectionLabel sub="Expand any step to see how Nia implements it — with a flow diagram, step-by-step guidance, and a direct conversation to work through it together.">nOS Flow — Step by Step</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {cd.nOSFlow.map((s, i) => {
        const isOpen = openStep === i;
        const detail = stepDetail[i] || {};
        return (
          <div key={i} style={{ background: C.cardBg, borderRadius: 12, border: `1px solid ${isOpen ? C.teal + '55' : C.border}`, overflow: 'hidden', transition: 'all .15s', boxShadow: isOpen ? `0 0 0 3px ${C.teal}08` : '0 1px 6px rgba(0,0,0,.04)' }}>
            <button onClick={() => setOpenStep(isOpen ? null : i)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, color: '#fff', background: isOpen ? C.ink : C.teal, padding: '4px 8px', borderRadius: 6, whiteSpace: 'nowrap', transition: 'background .15s', flexShrink: 0 }}>{s.step}</div>
              <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: isOpen ? C.teal : C.ink, flex: 1, transition: 'color .15s' }}>{s.name}</div>
              <div style={{ fontFamily: BODY, fontSize: 12, color: C.teal, fontWeight: 500, flexShrink: 0, opacity: isOpen ? 0 : 1, transition: 'opacity .15s' }}>Nia: <span style={{ color: C.ink3, fontWeight: 400 }}>{s.nia.slice(0, 48)}…</span></div>
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.ink4, display: 'block', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
            </button>
            {isOpen && (
              <div style={{ padding: '0 18px 20px' }}>
                {/* Diagram */}
                {detail.diagram && (
                  <div style={{ background: C.pageBg, borderRadius: 12, padding: '18px 14px 12px', marginBottom: 18, border: `1px solid ${C.border}` }}>
                    {detail.diagram}
                  </div>
                )}
                {/* Nia intelligence note */}
                <div style={{ background: C.tealLight, borderRadius: 9, padding: '10px 14px', marginBottom: 14, borderLeft: `3px solid ${C.teal}` }}>
                  <span style={{ fontFamily: BODY, fontSize: 12.5, color: C.teal, fontWeight: 600 }}>Nia: </span>
                  <span style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink2, lineHeight: 1.65 }}>{s.nia}</span>
                </div>
                {/* Step-by-step process */}
                {detail.steps && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4, marginBottom: 8 }}>How it works</div>
                    {detail.steps.map((step, j) => (
                      <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <span style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, color: C.teal }}>{j + 1}</span>
                        </div>
                        <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink2, lineHeight: 1.65 }}>{step}</div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Output */}
                {detail.output && (
                  <div style={{ background: C.pageBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${C.border}`, marginBottom: 14 }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ink4 }}>Output: </span>
                    <span style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink2, lineHeight: 1.55 }}>{detail.output}</span>
                  </div>
                )}
                {/* CTA — begin Nia conversation for this step */}
                {STEP_CTAS[i] && (
                  <button
                    onClick={() => setActiveStepChat(i)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 34, padding: '0 16px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 12.5, fontWeight: 500, color: C.ink2, cursor: 'pointer', transition: 'all .12s', width: '100%', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#E8E7E3'; e.currentTarget.style.borderColor = C.borderMd; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.borderColor = C.border; }}>
                    <Icon ic={Ic.spark} size={12} style={{ opacity: .6 }} />
                    {STEP_CTAS[i].label} with Nia
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
        </div>
      </div>
    </div>

      {activeStepChat !== null && cd.nOSFlow[activeStepChat] && (
        <NiaStepChat
          stepIndex={activeStepChat}
          stepName={cd.nOSFlow[activeStepChat].name}
          stepSteps={(stepDetail[activeStepChat] || {}).steps || []}
          cta={STEP_CTAS[activeStepChat]}
          onClose={() => setActiveStepChat(null)}
        />
      )}
    </>
  );
}
/* ─── ASK NIA TAB ────────────────────────────────────────────── */
function AskNiaTab() {
  const [q, setQ]             = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef                = useRef(null);

  const SUGGESTIONS = [
    'What is the biggest pain point nOS solves for a Creative Director?',
    'How does a Creative Director differ from an Art Director?',
    'What does nOS autofill for a Creative Director?',
    'How does the CD archetype expand to other archetypes?',
    'Which working style type benefits most from nOS?',
    'What makes the Creative Director the foundation archetype?',
  ];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  const ask = async (question) => {
    const text = (question || q).trim();
    if (!text) return;
    setHistory(h => [...h, { role: 'user', text }]);
    setQ(''); setLoading(true);
    const ans = await callClaude(text, `You are Nia, a warm and intelligent creative production assistant with deep knowledge of the Creative Director archetype in the nOS (Nia Operating System) framework. Be specific, practical, and concise. Under 200 words.`);
    setHistory(h => [...h, { role: 'nia', text: ans }]);
    setLoading(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32, alignItems: 'start' }}>
      {/* Suggestions */}
      <div>
        <SectionLabel>Suggested questions</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => ask(s)}
              style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 13px', fontFamily: BODY, fontSize: 12.5, color: C.ink2, textAlign: 'left', cursor: 'pointer', lineHeight: 1.5, transition: 'all .12s', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.ink2; }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {history.length === 0 && (
          <div style={{ background: C.cardBg, borderRadius: 14, padding: '24px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: C.teal }}><SparkIc /></div>
            <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 6 }}>Ask Nia</div>
            <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, lineHeight: 1.65 }}>Ask anything about the Creative Director archetype — pain points, workflows, nOS flow, or how this template extends to other archetypes.</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 440, overflowY: 'auto' }}>
          {history.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '85%', background: m.role === 'user' ? C.ink : C.tealLight, color: m.role === 'user' ? '#fff' : C.ink2, borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', padding: '11px 14px', fontFamily: BODY, fontSize: 13, lineHeight: 1.65 }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 5, padding: '11px 14px', background: C.tealLight, borderRadius: '4px 14px 14px 14px', width: 'fit-content' }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: C.teal, animation: `pulse .9s ${i*.15}s ease-in-out infinite` }} />)}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()}
            placeholder="Ask Nia about this archetype…"
            style={{ flex: 1, border: `1px solid ${C.borderMd}`, borderRadius: 10, padding: '11px 14px', fontFamily: BODY, fontSize: 13, color: C.ink, background: C.cardBg, outline: 'none' }} />
          <button onClick={() => ask()} disabled={!q.trim() || loading}
            style={{ background: !q.trim() || loading ? C.border : C.teal, border: 'none', borderRadius: 10, padding: '11px 18px', color: !q.trim() || loading ? C.ink4 : '#fff', fontFamily: BODY, fontSize: 13, fontWeight: 600, cursor: q.trim() && !loading ? 'pointer' : 'default', transition: 'all .12s', whiteSpace: 'nowrap' }}>
            {loading ? '…' : 'Ask'}
          </button>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}`}</style>
    </div>
  );
}

/* ─── INTEGRATIONS DATA ──────────────────────────────────────── */
const INTEGRATION_CATEGORIES = [
  'All', 'Reference & Inspiration', 'File Management',
  'Briefs & Documents', 'Design', 'Communication', 'Project Management',
];

const INTEGRATIONS = [
  {
    id: 'pinterest',   name: 'Pinterest',       icon: '📌', category: 'Reference & Inspiration',
    color: '#E60023',  softColor: '#FFF0F0',
    desc: 'Pull saved boards and pins directly into your project moodboard.',
    features: ['Boards sync as project reference sets', 'Pins tagged by visual language', 'New saves auto-added to active project'],
    status: 'available',
  },
  {
    id: 'are_na',      name: 'Are.na',           icon: '⬡', category: 'Reference & Inspiration',
    color: '#1919E6',  softColor: '#F0F0FF',
    desc: 'Connect channels so curated references flow into your project workspace.',
    features: ['Channels map to project reference sections', 'Block tags become Nia taste signals', 'Collaborative channels shared with team'],
    status: 'available',
  },
  {
    id: 'instagram',   name: 'Instagram',         icon: '◈', category: 'Reference & Inspiration',
    color: '#C13584',  softColor: '#FFF0FA',
    desc: 'Import saved posts and collections as visual references.',
    features: ['Saved posts pulled into moodboard', 'Collections map to project phases', 'Story saves included in reference pull'],
    status: 'available',
  },
  {
    id: 'behance',     name: 'Behance',           icon: '✦', category: 'Reference & Inspiration',
    color: '#1769FF',  softColor: '#F0F4FF',
    desc: 'Portfolio and appreciated work sync as reference and inspiration.',
    features: ['Appreciated projects become reference cards', 'Your portfolio surfaces in collaborator search', 'Collections map to project mood'],
    status: 'available',
  },
  {
    id: 'google_drive', name: 'Google Drive',     icon: '▲', category: 'File Management',
    color: '#0F9D58',  softColor: '#F0FFF6',
    desc: 'Attach Drive folders directly to projects. Assets stay where they are.',
    features: ['Folders linked to project delivery section', 'Shared Drive permissions respect project team', 'File updates reflected in Nia workspace'],
    status: 'available',
  },
  {
    id: 'dropbox',     name: 'Dropbox',           icon: '◻', category: 'File Management',
    color: '#0061FF',  softColor: '#F0F5FF',
    desc: 'Link Dropbox folders to your project file structure.',
    features: ['Shared folders auto-link to project', 'Version history preserved in Nia', 'Camera uploads routed to active shoot'],
    status: 'available',
  },
  {
    id: 'notion',      name: 'Notion',            icon: '◼', category: 'Briefs & Documents',
    color: '#191919',  softColor: '#F5F5F5',
    desc: 'Two-way sync between Nia briefs and Notion pages.',
    features: ['Briefs export as Notion pages', 'Notion updates sync back to Nia', 'Databases pull into project context'],
    status: 'available',
  },
  {
    id: 'figma',       name: 'Figma',             icon: '◍', category: 'Design',
    color: '#F24E1E',  softColor: '#FFF3F0',
    desc: 'Link design files to project stages. Comments flow into Nia feedback.',
    features: ['Files linked to production stage', 'Comments extracted as feedback items', 'Version history logged in project record'],
    status: 'available',
  },
  {
    id: 'slack',       name: 'Slack',             icon: '◎', category: 'Communication',
    color: '#4A154B',  softColor: '#FAF0FA',
    desc: 'Route project updates and brief summaries to your team channels.',
    features: ['Milestone notifications sent to channel', 'Brief summaries posted on project open', 'Collaborator messages logged in Nia'],
    status: 'coming_soon',
  },
  {
    id: 'asana',       name: 'Asana',             icon: '◉', category: 'Project Management',
    color: '#F06A6A',  softColor: '#FFF0F0',
    desc: 'Sync Nia tasks and milestones with Asana so your production schedule lives in one place.',
    features: ['Nia milestones sync as Asana tasks', 'Status updates reflected in Nia', 'Shoot timelines export to Asana board'],
    status: 'coming_soon',
  },
];

/* ─── INTEGRATIONS TAB ───────────────────────────────────────── */
function IntegrationsTab() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [connecting, setConnecting]         = useState(null);  // integration id during mock connect flow
  const [connected, setConnected]           = useState([]);    // array of connected integration ids
  const [expandedId, setExpandedId]         = useState(null);  // expanded detail card

  const filtered = activeCategory === 'All'
    ? INTEGRATIONS
    : INTEGRATIONS.filter(i => i.category === activeCategory);

  const handleConnect = (id) => {
    setConnecting(id);
    // Simulate OAuth / auth handshake delay
    setTimeout(() => {
      setConnected(c => [...c, id]);
      setConnecting(null);
    }, 1800);
  };

  const handleDisconnect = (id) => {
    setConnected(c => c.filter(x => x !== id));
  };

  const isConnected  = (id) => connected.includes(id);
  const isConnecting = (id) => connecting === id;

  return (
    <div>
      {/* Intro */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 28, display: 'flex', alignItems: 'flex-start', gap: 16, boxShadow: '0 1px 8px rgba(0,0,0,.04)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>⟡</div>
        <div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 5 }}>Connect your tools to nOS</div>
          <div style={{ fontFamily: BODY, fontSize: 13, color: C.ink3, lineHeight: 1.7 }}>
            The tools you already use — Pinterest boards, Google Drive folders, Figma files — can live inside your Nia projects. Connect an integration once, and Nia knows where to look every time you create a new project or build a brief.
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 22 }}>
        {INTEGRATION_CATEGORIES.map(cat => {
          const on = activeCategory === cat;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: on ? 600 : 400, color: on ? '#fff' : C.ink3, background: on ? C.teal : C.cardBg, border: `1px solid ${on ? C.teal : C.border}`, borderRadius: 24, padding: '6px 14px', cursor: 'pointer', transition: 'all .12s', whiteSpace: 'nowrap' }}>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Connected count */}
      {connected.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', background: C.tealLight, borderRadius: 10, border: `1px solid ${C.teal}30` }}>
          <div style={{ color: C.teal }}><CheckIc /></div>
          <span style={{ fontFamily: BODY, fontSize: 13, color: C.teal, fontWeight: 500 }}>
            {connected.length} integration{connected.length > 1 ? 's' : ''} connected
          </span>
        </div>
      )}

      {/* Integration grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtered.map(intg => {
          const conn    = isConnected(intg.id);
          const connIng = isConnecting(intg.id);
          const expanded = expandedId === intg.id;

          return (
            <div key={intg.id}
              style={{ background: C.cardBg, borderRadius: 14, border: `1.5px solid ${conn ? C.teal + '44' : C.border}`, overflow: 'hidden', transition: 'all .15s', boxShadow: conn ? `0 0 0 3px ${C.teal}10` : '0 1px 6px rgba(0,0,0,.04)' }}>

              {/* Card header */}
              <div style={{ padding: '16px 18px 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    {/* Icon badge */}
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: intg.softColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, border: `1px solid ${intg.color}22` }}>
                      {intg.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13.5, color: C.ink, marginBottom: 2 }}>{intg.name}</div>
                      <Chip label={intg.category} small color={intg.color} />
                    </div>
                  </div>

                  {/* Connect / Connected toggle */}
                  {conn ? (
                    <button onClick={() => handleDisconnect(intg.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: C.tealLight, border: `1px solid ${C.teal}44`, borderRadius: 8, fontFamily: BODY, fontSize: 11.5, fontWeight: 600, color: C.teal, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .12s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#FFE9E9'; e.currentTarget.style.borderColor = '#E04040'; e.currentTarget.style.color = '#C03030'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.tealLight; e.currentTarget.style.borderColor = C.teal + '44'; e.currentTarget.style.color = C.teal; }}>
                      <CheckIc /> Connected
                    </button>
                  ) : (
                    <button onClick={() => handleConnect(intg.id)} disabled={connIng}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: connIng ? C.border : C.ink, border: 'none', borderRadius: 8, fontFamily: BODY, fontSize: 11.5, fontWeight: 600, color: connIng ? C.ink4 : '#fff', cursor: connIng ? 'default' : 'pointer', whiteSpace: 'nowrap', transition: 'all .15s' }}>
                      {connIng
                        ? <>{[0,1,2].map(i => <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: C.ink4, animation: `pulse .9s ${i*.15}s infinite` }} />)}</>
                        : 'Connect'
                      }
                    </button>
                  )}
                </div>

                <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, lineHeight: 1.65, marginBottom: 12 }}>{intg.desc}</div>
              </div>

              {/* Expand / collapse features */}
              <div style={{ borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setExpandedId(expanded ? null : intg.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: BODY, fontSize: 12, color: C.ink4, transition: 'color .12s' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.teal}
                  onMouseLeave={e => e.currentTarget.style.color = C.ink4}>
                  <span>{expanded ? 'Hide features' : 'What this unlocks'}</span>
                  <span style={{ transition: 'transform .2s', display: 'block', transform: expanded ? 'rotate(180deg)' : 'none', fontFamily: MONO, fontSize: 11 }}>▾</span>
                </button>
                {expanded && (
                  <div style={{ padding: '0 18px 16px' }}>
                    {intg.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 7 }}>
                        <div style={{ color: C.teal, marginTop: 2, flexShrink: 0 }}><CheckIc /></div>
                        <span style={{ fontFamily: BODY, fontSize: 12, color: C.ink2, lineHeight: 1.55 }}>{f}</span>
                      </div>
                    ))}
                    {conn && (
                      <div style={{ marginTop: 12, padding: '10px 12px', background: C.tealLight, borderRadius: 8, fontFamily: BODY, fontSize: 12, color: C.teal, fontWeight: 500 }}>
                        ✓ Connected — these features are now active in your Nia projects.
                      </div>
                    )}
                    {!conn && (
                      <div style={{ marginTop: 12, padding: '10px 12px', background: C.pageBg, borderRadius: 8, fontFamily: BODY, fontSize: 12, color: C.ink4 }}>
                        Connect {intg.name} above to unlock these features.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:1;transform:scale(1.35)}}`}</style>
    </div>
  );
}

/* ─── ORB PICKER OPTIONS ─────────────────────────────────────── */
const ORB_PRESETS = [
  { id: 'ember',   label: 'Ember',   gradient: 'radial-gradient(circle at 38% 35%, #F2A65A 0%, #E05C2A 30%, #8B1A2A 65%, #2A0A18 100%)' },
  { id: 'ocean',   label: 'Ocean',   gradient: 'radial-gradient(circle at 38% 35%, #6ECFDF 0%, #2A7FBF 30%, #0A3060 65%, #050C20 100%)' },
  { id: 'forest',  label: 'Forest',  gradient: 'radial-gradient(circle at 38% 35%, #8FD4A0 0%, #2A8C50 30%, #0A3D20 65%, #031008 100%)' },
  { id: 'dusk',    label: 'Dusk',    gradient: 'radial-gradient(circle at 38% 35%, #C89BE0 0%, #7B3DBF 30%, #2D0A6A 65%, #0C0420 100%)' },
  { id: 'sand',    label: 'Sand',    gradient: 'radial-gradient(circle at 38% 35%, #F0D9A0 0%, #C8963A 30%, #6B4010 65%, #1E0E04 100%)' },
];

function buildCustomOrb(hex) {
  // Convert hex to RGB, build ombre gradient from light → mid → dark
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const light = `rgb(${Math.min(255,r+80)},${Math.min(255,g+80)},${Math.min(255,b+80)})`;
  const mid   = `rgb(${r},${g},${b})`;
  const dark  = `rgb(${Math.max(0,r-80)},${Math.max(0,g-80)},${Math.max(0,b-80)})`;
  const vdark = `rgb(${Math.max(0,r-140)},${Math.max(0,g-140)},${Math.max(0,b-140)})`;
  return `radial-gradient(circle at 38% 35%, ${light} 0%, ${mid} 30%, ${dark} 65%, ${vdark} 100%)`;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgb(${r}, ${g}, ${b})`;
}

function isValidHex(s) { return /^#[0-9A-Fa-f]{6}$/.test(s); }

/* ─── PROFILE CREATION FLOW ──────────────────────────────────── */
const PROFILE_FIELDS = [
  { key: 'name',         label: 'Full name' },
  { key: 'role',         label: 'Role / title' },
  { key: 'location',     label: 'Based in' },
  { key: 'bio',          label: 'About you' },
  { key: 'industries',   label: 'Industries' },
  { key: 'workingStyle', label: 'Working style' },
  { key: 'renownedWorks',label: 'Notable works' },
  { key: 'collaborators',label: 'Key collaborators' },
  { key: 'tools',        label: 'Tools & platforms' },
  { key: 'website',      label: 'Website / links' },
];

const PROFILE_INTEGRATIONS = [
  { id: 'instagram', name: 'Instagram',   icon: '◈', color: '#C13584', desc: 'Saved posts & collections → moodboard' },
  { id: 'pinterest', name: 'Pinterest',   icon: '📌', color: '#E60023', desc: 'Boards & pins → project references' },
  { id: 'are_na',    name: 'Are.na',      icon: '⬡', color: '#1919E6', desc: 'Channels → curated reference sets' },
  { id: 'behance',   name: 'Behance',     icon: '✦', color: '#1769FF', desc: 'Portfolio → nOS project archive' },
  { id: 'vimeo',     name: 'Vimeo',       icon: '▶', color: '#1AB7EA', desc: 'Video links → project references' },
];

async function callClaudeProfileNia(userMsg, history, profileData) {
  const filled = Object.entries(profileData)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const system = `You are Nia, a warm and intelligent creative production assistant helping a creative professional build their nOS profile. Guide them conversationally — acknowledge each answer warmly in one sentence, then ask the next unanswered field. Fields to collect: bio/about, industries, working style, notable works, key collaborators, tools, website/links. Current profile so far:\n${filled || 'Starting now.'}\nWhen all fields are complete, congratulate them and say their profile is ready.`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 280, system,
        messages: history.concat([{ role: 'user', content: userMsg }])
      })
    });
    const d = await r.json();
    return d.content?.[0]?.text || '';
  } catch { return 'Something went quiet. Try again in a moment.'; }
}

function OrbStep({ selectedOrb, setSelectedOrb, customHex, setCustomHex, customOrb, setCustomOrb }) {
  const [hexInput, setHexInput] = useState(customHex || '');
  const [hexErr,   setHexErr]   = useState(false);

  const applyHex = (val) => {
    const v = val.startsWith('#') ? val : '#' + val;
    if (isValidHex(v)) {
      setCustomHex(v);
      setCustomOrb(buildCustomOrb(v));
      setSelectedOrb('custom');
      setHexErr(false);
    } else { setHexErr(true); }
  };

  const activeGradient = selectedOrb === 'custom' && customOrb
    ? customOrb
    : (ORB_PRESETS.find(o => o.id === selectedOrb)?.gradient || ORB_PRESETS[0].gradient);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: activeGradient, margin: '0 auto 10px', boxShadow: '0 6px 24px rgba(0,0,0,.25)' }} />
        <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'rgba(239,222,196,.5)', letterSpacing: '.07em', textTransform: 'uppercase' }}>Your Nia Orb</div>
      </div>

      {/* Preset orbs */}
      <div>
        <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(239,222,196,.4)', marginBottom: 10 }}>Choose a preset</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {ORB_PRESETS.map(orb => (
            <button key={orb.id} onClick={() => { setSelectedOrb(orb.id); setCustomHex(''); setCustomOrb(null); }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: orb.gradient, border: `2.5px solid ${selectedOrb === orb.id ? '#F5EDE0' : 'rgba(239,222,196,.15)'}`, boxShadow: selectedOrb === orb.id ? '0 0 0 3px rgba(239,222,196,.2)' : 'none', transition: 'all .15s' }} />
              <span style={{ fontFamily: BODY, fontSize: 10, color: selectedOrb === orb.id ? '#F5EDE0' : 'rgba(239,222,196,.4)' }}>{orb.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom hex */}
      <div>
        <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(239,222,196,.4)', marginBottom: 8 }}>Or enter a hex code</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            {customHex && isValidHex(customHex) && (
              <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, borderRadius: '50%', background: customHex, border: '1px solid rgba(255,255,255,.2)' }} />
            )}
            <input
              value={hexInput}
              onChange={e => { setHexInput(e.target.value); setHexErr(false); }}
              onKeyDown={e => e.key === 'Enter' && applyHex(hexInput)}
              placeholder="#1A2B3C"
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.06)', border: `1.5px solid ${hexErr ? '#E05C2A' : 'rgba(239,222,196,.15)'}`, borderRadius: 8, padding: `9px 12px 9px ${customHex && isValidHex(customHex) ? '34px' : '12px'}`, fontFamily: MONO, fontSize: 13, color: '#F5EDE0', outline: 'none' }}
            />
          </div>
          <button onClick={() => applyHex(hexInput)}
            style={{ padding: '9px 16px', background: 'rgba(239,222,196,.1)', border: '1px solid rgba(239,222,196,.2)', borderRadius: 8, fontFamily: BODY, fontSize: 13, color: '#F5EDE0', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Apply
          </button>
        </div>
        {hexErr && <div style={{ fontFamily: BODY, fontSize: 11, color: '#E05C2A', marginTop: 5 }}>Enter a valid hex code (e.g. #1A2B3C)</div>}
        {customHex && isValidHex(customHex) && (
          <div style={{ fontFamily: BODY, fontSize: 11, color: 'rgba(239,222,196,.45)', marginTop: 5 }}>RGB: {hexToRgb(customHex)}</div>
        )}
      </div>
    </div>
  );
}

function PhotoStep({ profilePhoto, setProfilePhoto, headerPhoto, setHeaderPhoto }) {
  const profileRef = useRef(null);
  const headerRef  = useRef(null);

  const handleFile = (e, setter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setter(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header image */}
      <div>
        <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(239,222,196,.4)', marginBottom: 10 }}>Header image</div>
        <div
          onClick={() => headerRef.current?.click()}
          style={{ width: '100%', height: 100, borderRadius: 10, background: headerPhoto ? 'none' : 'rgba(255,255,255,.05)', border: `1.5px dashed ${headerPhoto ? 'transparent' : 'rgba(239,222,196,.2)'}`, overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all .15s' }}>
          {headerPhoto
            ? <img src={headerPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} alt="Header" />
            : <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 6, opacity: .4 }}>⊕</div>
                <div style={{ fontFamily: BODY, fontSize: 12, color: 'rgba(239,222,196,.4)' }}>Upload header image</div>
              </div>
          }
          {headerPhoto && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
              <span style={{ fontFamily: BODY, fontSize: 12, color: '#fff', fontWeight: 600 }}>Change</span>
            </div>
          )}
        </div>
        <input ref={headerRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e, setHeaderPhoto)} />
      </div>

      {/* Profile photo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(239,222,196,.4)', marginBottom: 10 }}>Profile photo</div>
          <div
            onClick={() => profileRef.current?.click()}
            style={{ width: 72, height: 72, borderRadius: '50%', background: profilePhoto ? 'none' : 'rgba(255,255,255,.06)', border: `2px dashed ${profilePhoto ? 'transparent' : 'rgba(239,222,196,.25)'}`, overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {profilePhoto
              ? <img src={profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
              : <div style={{ fontSize: 20, opacity: .35 }}>◎</div>
            }
          </div>
          <input ref={profileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e, setProfilePhoto)} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: BODY, fontSize: 13, color: '#F5EDE0', lineHeight: 1.7 }}>Your profile photo and header will appear across your nOS profile and collaborator cards — the same format as the renowned Creative Directors above.</div>
          <div style={{ fontFamily: BODY, fontSize: 11.5, color: 'rgba(239,222,196,.4)', marginTop: 6 }}>Recommended: portrait photo (3:4), header at 1200×300px or wider.</div>
        </div>
      </div>
    </div>
  );
}

function IntegrationStep({ connected, setConnected }) {
  const [connecting, setConnecting] = useState(null);

  const toggle = (id) => {
    if (connected.includes(id)) {
      setConnected(c => c.filter(x => x !== id));
    } else {
      setConnecting(id);
      setTimeout(() => {
        setConnected(c => [...c, id]);
        setConnecting(null);
      }, 1400);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: BODY, fontSize: 13, color: 'rgba(239,222,196,.6)', lineHeight: 1.65 }}>
        Connect your creative tools so Nia can pull in your saved inspiration, boards, and references automatically when you create projects.
      </div>
      {PROFILE_INTEGRATIONS.map(intg => {
        const conn = connected.includes(intg.id);
        const connIng = connecting === intg.id;
        return (
          <div key={intg.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', background: conn ? 'rgba(11,122,117,.15)' : 'rgba(255,255,255,.04)', border: `1px solid ${conn ? 'rgba(11,122,117,.4)' : 'rgba(239,222,196,.1)'}`, borderRadius: 12, transition: 'all .15s' }}>
            <div style={{ fontSize: 18, flexShrink: 0 }}>{intg.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: '#F5EDE0' }}>{intg.name}</div>
              <div style={{ fontFamily: BODY, fontSize: 11.5, color: 'rgba(239,222,196,.4)' }}>{intg.desc}</div>
            </div>
            <button onClick={() => toggle(intg.id)} disabled={connIng}
              style={{ padding: '6px 14px', background: conn ? 'rgba(11,122,117,.3)' : 'rgba(239,222,196,.08)', border: `1px solid ${conn ? 'rgba(11,122,117,.5)' : 'rgba(239,222,196,.2)'}`, borderRadius: 20, fontFamily: BODY, fontSize: 12, fontWeight: 600, color: conn ? C.teal : '#F5EDE0', cursor: connIng ? 'default' : 'pointer', transition: 'all .15s', whiteSpace: 'nowrap' }}>
              {connIng ? '...' : conn ? '✓ Connected' : 'Connect'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ProfileCreationFlow({ onClose, onComplete }) {
  // Steps: 0=orb, 1=photos, 2=integrations, 3=chat
  const [step, setStep]             = useState(0);
  const [selectedOrb, setSelectedOrb] = useState('ember');
  const [customHex, setCustomHex]   = useState('');
  const [customOrb, setCustomOrb]   = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [headerPhoto, setHeaderPhoto]   = useState(null);
  const [connected, setConnected]   = useState([]);
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [profile, setProfile]       = useState({ name: 'Ikanyeng Rammutla', role: 'Creative Director', location: 'Boston, MA / Johannesburg, South Africa' });
  const [fieldIdx, setFieldIdx]     = useState(3);
  const [chatDone, setChatDone]     = useState(false);
  const [history, setHistory]       = useState([]);
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  const activeGradient = selectedOrb === 'custom' && customOrb
    ? customOrb
    : (ORB_PRESETS.find(o => o.id === selectedOrb)?.gradient || ORB_PRESETS[0].gradient);

  // Init chat when reaching step 3
  useEffect(() => {
    if (step !== 3) return;
    const opening = "Hi Ika! Your orb, photos, and integrations are all set — looking great.\n\nNow let's fill in your professional profile. I already have your name, role, and location.\n\nTo start: write a short professional definition of who you are — your focus, background, and what makes your creative practice distinctive.";
    setMessages([{ role: 'nia', text: opening }]);
    setTimeout(() => inputRef.current?.focus(), 200);
  }, [step]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    const currentField = PROFILE_FIELDS[fieldIdx];
    const updatedProfile = currentField ? { ...profile, [currentField.key]: text } : profile;
    setProfile(updatedProfile);
    const nextIdx = fieldIdx + 1;
    const isDone  = nextIdx >= PROFILE_FIELDS.length;
    setFieldIdx(nextIdx);
    if (isDone) setChatDone(true);
    const newHistory = [...history, { role: 'user', content: text }];
    const niaSays = await callClaudeProfileNia(text, history, updatedProfile);
    setMessages(m => [...m, { role: 'nia', text: niaSays }]);
    setHistory([...newHistory, { role: 'assistant', content: niaSays }]);
    setLoading(false);
  };

  const STEPS = [
    { label: 'Choose Orb', icon: '◎' },
    { label: 'Add photos', icon: '⊕' },
    { label: 'Integrations', icon: '⟡' },
    { label: 'Your profile', icon: '✦' },
  ];

  const progress = step === 3
    ? Math.min(100, Math.round((fieldIdx / PROFILE_FIELDS.length) * 100))
    : Math.round((step / 3) * 33);

  const canProceed = step < 3;

  const buildFinalProfile = () => ({
    ...profile,
    orb: activeGradient,
    orbId: selectedOrb,
    profilePhoto,
    headerPhoto,
    connectedApps: connected,
  });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(15,14,12,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}>
      <div style={{ background: C.cardBg, borderRadius: 20, width: '100%', maxWidth: 580, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,.32)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: '#2C2520', padding: '18px 22px 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: activeGradient, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13.5, color: '#F5EDE0' }}>Create your Creative Director profile</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(239,222,196,.4)', letterSpacing: '.05em', textTransform: 'uppercase', marginTop: 1 }}>Nia Intelligence</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(239,222,196,.5)' }}>
              <Icon ic={Ic.close} size={12} style={{ opacity: .55 }} />
            </button>
          </div>
          {/* Step indicators */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', height: 2, background: i <= step ? C.teal : 'rgba(255,255,255,.1)', transition: 'background .3s', borderRadius: 1 }} />
                <span style={{ fontFamily: BODY, fontSize: 10, color: i === step ? '#F5EDE0' : 'rgba(239,222,196,.3)', transition: 'color .2s' }}>{s.label}</span>
              </div>
            ))}
          </div>
          {step === 3 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 2.5, background: 'rgba(255,255,255,.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: C.teal, borderRadius: 2, transition: 'width .4s ease' }} />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(239,222,196,.4)', whiteSpace: 'nowrap' }}>{fieldIdx}/{PROFILE_FIELDS.length}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: step === 3 ? '0' : '24px 24px 8px' }}>
          {step === 0 && <OrbStep selectedOrb={selectedOrb} setSelectedOrb={setSelectedOrb} customHex={customHex} setCustomHex={setCustomHex} customOrb={customOrb} setCustomOrb={setCustomOrb} />}
          {step === 1 && <PhotoStep profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} headerPhoto={headerPhoto} setHeaderPhoto={setHeaderPhoto} />}
          {step === 2 && <IntegrationStep connected={connected} setConnected={setConnected} />}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 22px', minHeight: 280 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  {m.role === 'nia' && (
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: activeGradient, flexShrink: 0, marginTop: 1 }} />
                  )}
                  <div style={{ maxWidth: '82%', background: m.role === 'nia' ? C.pageBg : C.teal, color: m.role === 'nia' ? C.ink2 : '#fff', borderRadius: m.role === 'nia' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', padding: '11px 14px', fontFamily: BODY, fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{m.text}</div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: activeGradient, flexShrink: 0 }} />
                  <div style={{ padding: '10px 14px', background: C.pageBg, borderRadius: '4px 14px 14px 14px', display: 'flex', gap: 5 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: C.ink4, animation: `pulse .9s ${i*.15}s ease-in-out infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 3 && (
          <div style={{ padding: '14px 24px 20px', borderTop: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {step > 0
              ? <button onClick={() => setStep(s => s - 1)} style={{ fontFamily: BODY, fontSize: 13, color: C.ink3, background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
              : <div />
            }
            <button onClick={() => setStep(s => s + 1)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, height: 34, padding: '0 16px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 13, fontWeight: 500, color: C.ink2, cursor: 'pointer', transition: 'all .12s', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E8E7E3'; e.currentTarget.style.borderColor = C.borderMd; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.borderColor = C.border; }}>
              {step === 2 ? 'Continue to profile' : 'Continue'} <Icon ic={Ic.arrow} size={11} style={{ opacity: .55 }} />
            </button>
          </div>
        )}
        {step === 3 && !chatDone && (
          <div style={{ padding: '12px 22px 18px', borderTop: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', gap: 9 }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Type your answer…"
              style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 11, padding: '11px 14px', fontFamily: BODY, fontSize: 13, color: C.ink, background: C.pageBg, outline: 'none' }} />
            <button onClick={send} disabled={!input.trim() || loading}
              style={{ display: 'flex', alignItems: 'center', gap: 6, height: 44, padding: '0 16px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 11, fontFamily: BODY, fontSize: 13, fontWeight: 500, color: C.ink2, cursor: input.trim() && !loading ? 'pointer' : 'default', transition: 'all .12s', opacity: input.trim() && !loading ? 1 : .45 }}
              onMouseEnter={e => { if (input.trim() && !loading) { e.currentTarget.style.background = '#E8E7E3'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; }}>
              <Icon ic={Ic.send} size={12} style={{ opacity: .6 }} /> {loading ? '…' : 'Send'}
            </button>
          </div>
        )}
        {step === 3 && chatDone && !loading && (
          <div style={{ padding: '14px 22px 20px', borderTop: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', gap: 10 }}>
            <button onClick={() => onComplete?.(buildFinalProfile())}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 36, padding: '0 14px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 13, fontWeight: 500, color: C.ink2, cursor: 'pointer', transition: 'all .12s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E8E7E3'; e.currentTarget.style.borderColor = C.borderMd; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.borderColor = C.border; }}>
              <Icon ic={Ic.user} size={12} style={{ opacity: .6 }} /> View my profile
            </button>
            <button onClick={onClose} style={{ padding: '13px 20px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 11, fontFamily: BODY, fontSize: 13, color: C.ink3, cursor: 'pointer' }}>Close</button>
          </div>
        )}
        <style>{`@keyframes pulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:1;transform:scale(1.35)}}`}</style>
      </div>
    </div>
  );
}

/* ─── PROFILE PREVIEW ────────────────────────────────────────── */
function ProfilePreview({ profile, onClose, onEdit }) {
  const fields = [
    { key: 'bio',          label: 'About' },
    { key: 'industries',   label: 'Industries' },
    { key: 'workingStyle', label: 'Working style' },
    { key: 'renownedWorks',label: 'Notable works' },
    { key: 'collaborators',label: 'Collaborators' },
    { key: 'tools',        label: 'Tools' },
    { key: 'website',      label: 'Links' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(15,14,12,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}>
      <div style={{ background: C.cardBg, borderRadius: 20, width: '100%', maxWidth: 620, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,.28)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>
        {/* Hero */}
        <div style={{ position: 'relative', height: 200, flexShrink: 0 }}>
          <div style={{ width: '100%', height: '100%', background: profile.headerPhoto ? 'none' : '#2C2520', overflow: 'hidden' }}>
            {profile.headerPhoto && <img src={profile.headerPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Header" />}
          </div>
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(15,14,12,.8) 100%)' }} />
          {/* Profile photo + orb */}
          <div style={{ position: 'absolute', bottom: 16, left: 22, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            {profile.profilePhoto
              ? <img src={profile.profilePhoto} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,.2)' }} alt="Profile" />
              : <div style={{ width: 64, height: 64, borderRadius: '50%', background: profile.orb || C.orb, border: '3px solid rgba(255,255,255,.2)' }} />
            }
            <div>
              <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-.3px' }}>{profile.name || 'Your Name'}</div>
              <div style={{ fontFamily: BODY, fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{profile.role}{profile.location ? ` · ${profile.location}` : ''}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 14, background: 'rgba(0,0,0,.4)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Icon ic={Ic.close} size={12} style={{ opacity: .55 }} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px' }}>
          {fields.filter(f => profile[f.key]).map((f, i, arr) => (
            <div key={f.key} style={{ padding: '13px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: C.ink4, marginBottom: 5 }}>{f.label}</div>
              <div style={{ fontFamily: BODY, fontSize: 13.5, color: C.ink2, lineHeight: 1.7 }}>{profile[f.key]}</div>
            </div>
          ))}
          {profile.connectedApps?.length > 0 && (
            <div style={{ padding: '13px 0' }}>
              <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: C.ink4, marginBottom: 8 }}>Connected</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {profile.connectedApps.map(id => {
                  const intg = PROFILE_INTEGRATIONS.find(i => i.id === id);
                  return intg ? <span key={id} style={{ fontFamily: BODY, fontSize: 12, color: C.teal, background: C.tealSoft, padding: '3px 10px', borderRadius: 20 }}>{intg.icon} {intg.name}</span> : null;
                })}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '12px 24px 18px', borderTop: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', gap: 10 }}>
          <button onClick={onEdit} style={{ padding: '12px 20px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 11, fontFamily: BODY, fontSize: 13, fontWeight: 600, color: C.ink2, cursor: 'pointer' }}>Edit profile</button>
          <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 36, padding: '0 14px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 13, fontWeight: 500, color: C.ink2, cursor: 'pointer', transition: 'all .12s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E8E7E3'; e.currentTarget.style.borderColor = C.borderMd; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.borderColor = C.border; }}>
          <Icon ic={Ic.download} size={12} style={{ opacity: .6 }} /> Save to nOS</button>
        </div>
      </div>
    </div>
  );
}


/* ─── HEADER IMAGE PICKER ────────────────────────────────────── */
function HeaderImagePicker({ current, onSelect, onClose }) {
  const [hov, setHov] = useState(null);
  const [selected, setSelected] = useState(current);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(15,14,12,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}>
      <div style={{ background: C.cardBg, borderRadius: 20, width: '100%', maxWidth: 720, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,.28)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: '#2C2520', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 14, color: '#F5EDE0' }}>Choose a header image</div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(239,222,196,.4)', letterSpacing: '.05em', textTransform: 'uppercase', marginTop: 2 }}>Appears on your nOS profile and project headers</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(239,222,196,.5)' }}>
            <Icon ic={Ic.close} size={10} />
          </button>
        </div>

        {/* Preview strip */}
        {selected && (
          <div style={{ height: 120, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
            <img src={selected.src} alt={selected.label} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(15,14,12,.7))' }} />
            <div style={{ position: 'absolute', bottom: 12, left: 20 }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,.7)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{selected.label}</span>
            </div>
          </div>
        )}

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {HEADER_IMAGES.map((img) => {
              const isSel = selected?.id === img.id;
              return (
                <div key={img.id}
                  onClick={() => setSelected(img)}
                  onMouseEnter={() => setHov(img.id)}
                  onMouseLeave={() => setHov(null)}
                  style={{ borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${isSel ? C.teal : hov === img.id ? C.teal + '66' : 'transparent'}`, transition: 'all .15s', boxShadow: isSel ? `0 0 0 3px ${C.teal}30` : 'none', position: 'relative', aspectRatio: '3/2' }}>
                  <img src={img.src} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov === img.id ? 'scale(1.03)' : 'scale(1)', transition: 'transform .2s ease' }} />
                  {isSel && (
                    <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon ic={Ic.check} size={10} style={{ color: '#fff' }} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 8px 6px', background: 'linear-gradient(transparent, rgba(0,0,0,.55))' }}>
                    <span style={{ fontFamily: MONO, fontSize: 7.5, color: 'rgba(255,255,255,.75)', letterSpacing: '.04em' }}>{img.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={() => { if (selected) onSelect(selected); onClose(); }}
            disabled={!selected}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 36, padding: '0 14px', background: C.pageBg, border: `1px solid ${selected ? C.borderMd : C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 13, fontWeight: 500, color: selected ? C.ink2 : C.ink4, cursor: selected ? 'pointer' : 'default', transition: 'all .12s', opacity: selected ? 1 : .5 }}
            onMouseEnter={e => { if (selected) { e.currentTarget.style.background = '#E8E7E3'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; }}>
            <Icon ic={Ic.check} size={12} style={{ opacity: .6 }} /> Use this image
          </button>
          <button onClick={onClose} style={{ padding: '12px 20px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 11, fontFamily: BODY, fontSize: 13, color: C.ink3, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── CD WELCOME SCREEN ──────────────────────────────────────── */
function CDWelcomeScreen({ onEnter, selectedHeader, onChangeHeader }) {
  const [hov, setHov]             = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [headerImg, setHeaderImg] = useState(selectedHeader || HEADER_IMAGES[6]); // Cape Cod default
  const [entered, setEntered]     = useState(false);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => onEnter(headerImg), 500);
  };

  const HIGHLIGHTS = [
    { icon: Ic.overview,     label: '7 pain points mapped',     sub: 'With flow diagrams' },
    { icon: Ic.nos,          label: '11-step nOS workflow',      sub: 'With Nia guidance' },
    { icon: Ic.tasks,        label: '90+ task universe',         sub: 'Across 9 domains' },
    { icon: Ic.integrations, label: '10 platform integrations',  sub: 'Pinterest, Drive & more' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.pageBg, opacity: entered ? 0 : 1, transition: 'opacity .45s ease' }}>

      {/* ── HEADER IMAGE — full width, titles separate below ── */}
      <div style={{ position: 'relative', height: 240, flexShrink: 0, overflow: 'hidden' }}>
        <img src={headerImg.src} alt={headerImg.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'opacity .35s' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,14,12,.15) 0%, rgba(15,14,12,.05) 60%, rgba(15,14,12,.55) 100%)' }} />
        {/* Change image */}
        <button onClick={() => setShowPicker(true)}
          style={{ position: 'absolute', top: 14, right: 14, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 20, fontFamily: BODY, fontSize: 11.5, fontWeight: 600, color: '#fff', cursor: 'pointer', transition: 'background .15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}>
          <Icon ic={Ic.launch} size={10} style={{ color: '#fff' }} /> Change image
        </button>
        {/* Location label bottom-left */}
        <div style={{ position: 'absolute', bottom: 10, left: 20 }}>
          <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,.55)', letterSpacing: '.06em' }}>{headerImg?.label}</span>
        </div>
      </div>

      {/* ── TITLE BLOCK — separated from image, in the white body ── */}
      <div style={{ background: C.cardBg, borderBottom: `1px solid ${C.border}`, padding: '24px 48px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.teal }} />
          <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: C.ink4 }}>nOS · Foundation Archetype</span>
        </div>
        <h1 style={{ fontFamily: BODY, fontWeight: 900, fontSize: 36, color: C.ink, margin: '0 0 8px', letterSpacing: '-1px', lineHeight: 1.1 }}>Creative Director</h1>
        <p style={{ fontFamily: BODY, fontSize: 14, color: C.ink3, margin: '0 0 20px', maxWidth: 580, lineHeight: 1.7 }}>
          A Creative Director is the senior creative professional responsible for establishing and maintaining the overall creative vision of a project, campaign, or brand. They set the conceptual and aesthetic direction across all visual and communicative outputs — ensuring coherence, intentionality, and quality from brief to delivery.
        </p>
        <button onClick={handleEnter}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, padding: '0 18px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 13, fontWeight: 500, color: C.ink2, cursor: 'pointer', transition: 'all .12s', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E8E7E3'; e.currentTarget.style.borderColor = C.borderMd; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.borderColor = C.border; }}>
          <Icon ic={Ic.arrow} size={12} style={{ opacity: .6 }} /> Enter Creative Director
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 48px 48px' }}>

        {/* What's inside — styled like 6-stage workflow cards */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.ink4, marginBottom: 14 }}>What's inside this skill</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} style={{ background: C.cardBg, borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,.06)', display: 'flex', flexDirection: 'column' }}>
                {/* Gradient header — same pattern as workflow cards */}
                <div style={{ background: ['linear-gradient(145deg, #0F3D3A 0%, #0B7A75 60%, #12A89F 100%)', 'linear-gradient(145deg, #1A2D1A 0%, #2A5A35 60%, #3D8C50 100%)', 'linear-gradient(145deg, #1A1A2E 0%, #2C2560 60%, #4A3D8C 100%)', 'linear-gradient(145deg, #2E1A0A 0%, #6B3A12 60%, #A05A20 100%)'][i], padding: '20px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Icon ic={h.icon} size={20} />
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: '13px 14px 15px', flex: 1 }}>
                  <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 4, lineHeight: 1.25 }}>{h.label}</div>
                  <div style={{ fontFamily: BODY, fontSize: 11.5, color: C.ink4, lineHeight: 1.55 }}>{h.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Header image preview strip */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.ink4, marginBottom: 12 }}>Choose your profile header</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            {HEADER_IMAGES.map((img) => {
              const isSel = headerImg?.id === img.id;
              return (
                <div key={img.id} onClick={() => setHeaderImg(img)}
                  onMouseEnter={() => setHov(img.id)} onMouseLeave={() => setHov(null)}
                  style={{ flexShrink: 0, width: 120, height: 76, borderRadius: 9, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${isSel ? C.teal : 'transparent'}`, transition: 'all .15s', boxShadow: isSel ? `0 0 0 3px ${C.teal}30` : '0 1px 6px rgba(0,0,0,.08)', position: 'relative' }}>
                  <img src={img.src} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov === img.id ? 'scale(1.05)' : 'scale(1)', transition: 'transform .2s' }} />
                  {isSel && <div style={{ position: 'absolute', inset: 0, border: `2px solid ${C.teal}`, borderRadius: 9 }} />}
                </div>
              );
            })}
          </div>
          <div style={{ fontFamily: BODY, fontSize: 12, color: C.ink4, marginTop: 8 }}>
            Selected: <span style={{ color: C.ink2, fontWeight: 500 }}>{headerImg?.label}</span>
          </div>
        </div>


      </div>

      {showPicker && (
        <HeaderImagePicker
          current={headerImg}
          onSelect={(img) => { setHeaderImg(img); if (onChangeHeader) onChangeHeader(img); }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function CDSkillPage({ onBack, onNewProject }) {
  const [tab, setTab]                 = useState('overview');
  const tabBarRef                     = useRef(null);
  const [stuck, setStuck]             = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [headerImage, setHeaderImage] = useState(HEADER_IMAGES[6]);
  const cd                            = CD_PROFILE;

  // Sticky tab bar detection
  useEffect(() => {
    const el = tabBarRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 1, rootMargin: '-1px 0px 0px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleNewProject = onNewProject || (() => {});

  // Show welcome screen first
  if (showWelcome) {
    return (
      <CDWelcomeScreen
        selectedHeader={headerImage}
        onChangeHeader={setHeaderImage}
        onEnter={(img) => { setHeaderImage(img); setShowWelcome(false); }}
      />
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.pageBg }}>

      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <div style={{ background: C.cardBg, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Row 1: Back + Actions (top utility bar) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 40px', borderBottom: `1px solid ${C.border}` }}>
            {/* Back */}
            <button onClick={() => setShowWelcome(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 12.5, fontWeight: 500, color: C.ink3, cursor: 'pointer', transition: 'all .12s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E8E7E3'; e.currentTarget.style.color = C.ink2; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.color = C.ink3; }}>
              <Icon ic={Ic.chevLeft} size={12} style={{ opacity: .55 }} /> Skills
            </button>
            {/* Action pills */}
            <div style={{ display: 'flex', gap: 8 }}>
              {userProfile ? (
                <button onClick={() => setShowPreview(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, height: 32, padding: '0 12px 0 5px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 12.5, fontWeight: 500, color: C.ink2, cursor: 'pointer', transition: 'all .12s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.ink2; }}>
                  {userProfile.profilePhoto
                    ? <img src={userProfile.profilePhoto} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} alt="Profile" />
                    : <div style={{ width: 22, height: 22, borderRadius: '50%', background: userProfile.orb || C.orb }} />}
                  My Profile
                </button>
              ) : (
                <button onClick={() => setShowProfile(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 12.5, fontWeight: 500, color: C.ink2, cursor: 'pointer', transition: 'all .12s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.ink2; }}>
                  <Icon ic={Ic.user} size={12} style={{ opacity: .65 }} /> Create profile
                </button>
              )}
              <button onClick={handleNewProject}
                style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', background: C.pageBg, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: BODY, fontSize: 12.5, fontWeight: 500, color: C.ink2, cursor: 'pointer', transition: 'all .12s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E8E7E3'; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.pageBg; }}>
                <Icon ic={Ic.plus} size={12} style={{ opacity: .65 }} /> New Chat
              </button>
            </div>
          </div>

          {/* Row 2: Orb + CD title + description */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 40px 14px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.orb, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <h1 style={{ fontFamily: BODY, fontWeight: 800, fontSize: 21, color: C.ink, letterSpacing: '-.4px', margin: 0 }}>{cd.name}</h1>
                <Chip label={cd.tier} />
              </div>
              <p style={{ fontFamily: BODY, fontSize: 12.5, color: C.ink3, lineHeight: 1.5, margin: 0 }}>{cd.desc}</p>
            </div>
          </div>

          {/* Row 3: Tab pills — below title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 40px 10px' }}>
            {TABS.map(t => {
              const on = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, height: 32, padding: '0 13px', background: on ? '#fff' : 'transparent', border: on ? `1px solid ${C.border}` : '1px solid transparent', borderRadius: 20, fontFamily: BODY, fontSize: 12.5, fontWeight: on ? 600 : 400, color: on ? C.ink : C.ink3, cursor: 'pointer', transition: 'all .12s', boxShadow: on ? '0 1px 4px rgba(0,0,0,.07)' : 'none', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { if (!on) { e.currentTarget.style.background = C.pageBg; e.currentTarget.style.color = C.ink2; } }}
                  onMouseLeave={e => { if (!on) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.ink3; } }}>
                  {t.label}
                  {t.id === 'integrations' && (
                    <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, color: on ? C.ink2 : C.ink4, background: 'rgba(0,0,0,.07)', padding: '1px 5px', borderRadius: 8, lineHeight: 1.6 }}>
                      {INTEGRATIONS.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── TAB CONTENT ──────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '32px 40px 48px', maxWidth: 1200, margin: '0 auto' }}>
          {tab === 'overview'     && <OverviewTab cd={cd} />}
          {tab === 'flows'        && <FlowsTab cd={cd} onNewProject={handleNewProject} />}
          {tab === 'tasks'        && <TaskTab cd={cd} />}
          {tab === 'ask'          && <AskNiaTab />}
          {tab === 'integrations' && <IntegrationsTab />}
        </div>
      </div>

      {/* Profile creation flow */}
      {showProfile && (
        <ProfileCreationFlow
          onClose={() => setShowProfile(false)}
          onComplete={(p) => {
            setUserProfile(p);
            setShowProfile(false);
            setShowPreview(true);
          }}
        />
      )}
      {showPreview && userProfile && (
        <ProfilePreview
          profile={userProfile}
          onClose={() => setShowPreview(false)}
          onEdit={() => { setShowPreview(false); setShowProfile(true); }}
        />
      )}
    </div>
  );
}
