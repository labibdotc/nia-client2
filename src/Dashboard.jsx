import { useState, useEffect, useRef } from 'react';
import { ALL_CATEGORIES, LIBRARY, TIER_ORDER, ARCHETYPES_LIST } from './Onboarding.jsx';
import {
  BODY, MONO, ACCENT, ACCENT_INK, DANGER, SUCCESS,
  EASE_PHYSICS, EASE_QUICK, EASE_DELIBERATE, EASE_SLOW, SKINS,
  ic, HomeIc, ChevDown, ChevRight, ChevLeft, PlusIc, MinusIc, CloseIc, NewIc,
  SparkPlusIc, ListIc, SearchIc, CheckIc, UploadIc, SendIc, MicIc, DashIc,
  UsersIc, FolderIc, CalIc, FileIc, SettingsIc, SparkIc, ChainIc, CanvasIc,
  UserIc, PlayIc, ShieldIc, BellIc, CardIc, HelpIc, TrashIc, LogOutIc, EditIc,
  KeyIc, PaletteIc, FileMenuIc, GlobeIc, CommunityIc, LearnIc, GoogleIc,
  NOSMark, Pearl, useViewport, useMountReveal, revealStyle, PULSE_KEYFRAMES,
  TIERS, TIER_ORDER_LIST, INTEGRATIONS, requireTier,
  LANGUAGES, FAQS, COMMUNITY_CHANNELS, LEARN_RESOURCES,
  NosToast, nosToast, Field, Input, PrimaryButton, GhostButton, Toggle,
  PROJECT_TYPES, MOODS, DEMO_SEED_EMAILS, DEMO_PROJECTS,
  GREETINGS, pickGreeting, callClaude,
} from './atoms.jsx';
import { CONTACTS_DATA, EVENTS_DATA, VENUES_DATA, FUNCTIONS_CATEGORIES, FUNCTIONS_INTELLIGENCE, MODELS } from './dashboardData.js';

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
  onNewProject,
  user, projects = [],
  rightCollapsed = false, setRightCollapsed,
}) {
  const [hoverId, setHoverId] = useState(null);  // desktop hover state
  const [tapId, setTapId] = useState(null);      // mobile tap state
  const activeMini = isMobile ? tapId : hoverId;

  // Calendar + Briefs removed (no destinations). Functions -> Templates
  // to match the left-rail vocabulary. v1.4.
  const tools = [
    { id: 'dash',    Icon: DashIc,    label: 'Dashboard' },
    { id: 'folder',  Icon: FolderIc,  label: 'Templates',    hasMini: true },
    { id: 'users',   Icon: UsersIc,   label: 'Team',         hasMini: true },
    { id: 'set',     Icon: SettingsIc,label: 'Settings',     onClick: () => onOpenSettings && onOpenSettings() },
  ];
  const btn = isMobile ? 38 : 42;

  // Single-active: every click updates active. v1.4.
  const handleClick = (tool) => {
    setActive(tool.id);
    if (tool.onClick) { tool.onClick(); return; }
    if (tool.hasMini && isMobile) {
      setTapId(prev => prev === tool.id ? null : tool.id);
      return;
    }
  };

  const handleNewProject = () => {
    onNewProject && onNewProject();
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
        {onNewProject && (
          <>
            <button onClick={handleNewProject} title="New project"
              style={{
                width: btn, height: btn, borderRadius: '50%',
                background: ACCENT, color: ACCENT_INK,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `transform ${EASE_QUICK}, background ${EASE_QUICK}`,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              <PlusIc s={isMobile ? 14 : 16} c="currentColor" sw={2} />
            </button>
            <div style={{ width: 1, height: 20, background: T.dividerInk, margin: '0 2px' }} />
          </>
        )}
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
                nosToast('Team workspace is on the roadmap — multi-seat ships with Studio.', { eyebrow: 'Team' });
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
              { label: 'Email support', hint: 'support@nia.app — best for everything', onClick: () => { window.location.href = 'mailto:support@nia.app?subject=Nia%20support%20request'; } },
              { label: 'Bug report',    hint: 'support@nia.app with [BUG] in the subject', onClick: () => { window.location.href = 'mailto:support@nia.app?subject=%5BBUG%5D%20'; } },
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
          <button key={c.id} onClick={() => { if (c.soon) return; if (c.id === 'discord') window.location.href = 'mailto:community@nia.app?subject=Discord%20invite%20request'; }}
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
            onClick={() => {
              if (r.id === 'careers') window.location.href = 'mailto:careers@nia.app?subject=Interest%20in%20Nia';
              else if (r.id === 'press') window.location.href = 'mailto:press@nia.app?subject=Press%20inquiry';
              else window.location.href = `mailto:hello@nia.app?subject=${encodeURIComponent(r.title)}`;
            }}
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
  // Computed fields (v1.4) — derive their value from a function of the other
  // fields. Always read-only, shown with an "Auto" badge. Kept in sync with the
  // stored value via the effect below so saves persist the computed result.
  const computeAll = (src) => {
    const out = {};
    fields.forEach(f => { if (typeof f.computed === 'function') { try { out[f.id] = f.computed(src); } catch { out[f.id] = ''; } } });
    return out;
  };
  useEffect(() => {
    const computed = computeAll(v);
    const changed = Object.keys(computed).some(k => (v[k] || '') !== (computed[k] || ''));
    if (changed) onChange({ ...v, ...computed });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fields.filter(f => typeof f.computed !== 'function').map(f => v[f.id]))]);
  const display = { ...v, ...computeAll(v) };
  return (
    <div style={{
      borderRadius: 10, overflow: 'hidden',
      border: `1px solid ${T.dividerInk}`,
    }}>
      {fields.map((f, i) => {
        const isComputed = typeof f.computed === 'function';
        return (
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
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
          }}>
            <span>{f.label}</span>
            {isComputed && (
              <span style={{
                fontFamily: MONO, fontStyle: 'normal', fontSize: 7.5, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: ACCENT, border: `1px solid ${ACCENT}`, borderRadius: 3,
                padding: '1px 5px', flexShrink: 0,
              }}>Auto</span>
            )}
          </div>
          <div style={{ flex: 1, padding: '10px 14px', minWidth: 0 }}>
            {editing && !isComputed ? (
              <Input T={T} value={v[f.id] || ''}
                onChange={(nv) => onChange({ ...v, [f.id]: nv })}
                placeholder={f.hint || ''} />
            ) : (
              <div style={{
                fontFamily: BODY, fontSize: 12.5, lineHeight: 1.55,
                color: display[f.id] ? (isComputed ? ACCENT : T.ink) : T.ink4,
                fontStyle: display[f.id] ? 'normal' : 'italic',
                fontWeight: isComputed && display[f.id] ? 600 : 400,
              }}>{display[f.id] || (f.hint || 'Empty')}</div>
            )}
          </div>
        </div>
        );
      })}
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
/* ─── Stage D · structurally-optional sections + deletability (v1.4) ─── */
const STRUCTURALLY_OPTIONAL_SECTIONS = new Set([
  // Content Production (TPL-01)
  'priority-bts-scenes', 'epk-concepts', 'pav-concepts', 'folder-structure',
  // Junket Brief (TPL-02)
  'special-concepts', 'post-junket-delivery',
  // Production Budget (TPL-03)
  'economies-of-scale', 'worked-example', 'governance',
  // Shooting Schedule (TPL-04)
  'travel-off-days',
  // Series Bible (TPL-05)
  'season-beyond',
  // Brand Bible (TPL-06)
  'risks', 'archive-learning', 'editorial-pillars',
  // Customer Discovery (TPL-07) — all sections are operational, none auto-optional
  // Legal Agreement (TPL-08) — all sections are required for contract validity
  // NDA Mutual (TPL-09) — Rights and Miscellaneous are in the Expanded preset
  // only. The framework's Essential preset is Cover · Parties · Background ·
  // Definitions · Duty · Term · Execution; Rights and Miscellaneous can be
  // toggled off for very informal pre-pitch conversations.
  'rights', 'miscellaneous',
  // Partnership Equity Split (TPL-10) — Promotion Pathway and Eligibility
  // Gates are only meaningful when contributor-track partners exist. A pure
  // two-founder or three-equal-founder venture can drop both. The other ten
  // sections (Cover · Parties · Purpose · Profit-Split · Reserve · Equity ·
  // Pool · Vesting · Governance · Execution) are structurally essential.
  'promotion-pathway', 'eligibility-gates',
]);


const isSectionDeletable = (section) => {
  if (section?.required === true) return false;
  if (section?.optional === true) return true;
  return STRUCTURALLY_OPTIONAL_SECTIONS.has(section?.id);
};


function DBSectionActionRow({ T, isEditing, onToggleEdit, onRegenerate, isRegenerating, showRegenerate = true, showEdit = true, onSkip = null, onRemove = null, canRemove = false }) {
  const { flashed, flash } = useSuccessFlash(1400);

  // Wrap onToggleEdit so committing (going from editing → done) flashes
  // a success tick in the Edit button for 1.4s. Entering edit mode does
  // not flash — only the commit transition is celebrated.
  const handleToggleEdit = () => {
    if (isEditing) flash();
    onToggleEdit && onToggleEdit();
  };

  const ButtonShell = ({ onClick, disabled, accent, success, danger, children }) => (
    <button onClick={onClick} disabled={disabled}
      style={{
        background: success
          ? 'rgba(92,184,138,0.12)'
          : (accent ? 'rgba(19,19,19,0.10)' : 'transparent'),
        border: `1px solid ${success
          ? 'rgba(92,184,138,0.45)'
          : (accent ? 'rgba(19,19,19,0.35)' : T.borderMd)}`,
        borderRadius: 999, padding: '4px 10px',
        cursor: disabled ? 'wait' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: MONO, fontSize: 9, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: disabled
          ? T.ink4
          : (danger ? DANGER : (success ? SUCCESS : (accent ? ACCENT : T.ink3))),
        transition: `border-color ${EASE_QUICK}, color ${EASE_QUICK}, background ${EASE_QUICK}`,
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (disabled || success) return;
        if (!accent) e.currentTarget.style.borderColor = danger ? DANGER : ACCENT;
      }}
      onMouseLeave={(e) => {
        if (disabled || success) return;
        if (!accent) e.currentTarget.style.borderColor = T.borderMd;
      }}>
      {children}
    </button>
  );

  return (
    <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      {showEdit && (
        <ButtonShell onClick={handleToggleEdit} accent={isEditing && !flashed} success={flashed}>
          <span style={{
            color: flashed ? SUCCESS : (isEditing ? ACCENT : T.ink4),
            display: 'flex',
          }}>
            {flashed
              ? <CheckIc s={9} c="currentColor" sw={2.4} />
              : <EditIc s={9} c="currentColor" sw={2} />}
          </span>
          {flashed ? 'Saved' : (isEditing ? 'Done' : 'Edit')}
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
      {/* Skip — clear the section's value back to defaults. The section
          stays in the project (still navigable, still in the section list),
          but with empty content. Stage D, turn 53. */}
      {onSkip && (
        <ButtonShell onClick={onSkip}>
          Skip
        </ButtonShell>
      )}
      {/* Remove — pull the section out of project.includedSectionIds so
          it no longer renders. Only available on structurally-optional
          sections (canRemove). Restore via the removed-sections panel
          at the bottom. */}
      {onRemove && canRemove && (
        <ButtonShell onClick={onRemove} danger>
          Remove
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
  // Stage D — turn 53. Existing projects respect three new pieces of
  // state on the project record:
  //   · includedSectionIds — array of section IDs the user has kept.
  //     If absent (legacy projects from before turn 47), all model
  //     sections render (backwards compatible — no migration needed).
  //   · skippedSectionIds — sections the user has explicitly skipped
  //     (value reset to defaults, but section stays in the list).
  //   · A removed section IS one whose ID is missing from
  //     includedSectionIds (when that array exists).
  //
  // The composer writes includedSectionIds when creating a new project.
  // Stage D lets the user prune sections from an EXISTING project the
  // same way — pulling the id from includedSectionIds, leaving the
  // section navigable via the bottom Removed-sections panel for one-
  // click restore.

  const sectionCount = model.sections.length;

  // Compute included/removed split. Treat absence as "all included".
  const includedIds = Array.isArray(project.includedSectionIds)
    ? project.includedSectionIds
    : model.sections.map(s => s.id);
  const skippedIds = Array.isArray(project.skippedSectionIds)
    ? project.skippedSectionIds
    : [];

  const visibleSections = model.sections.filter(s => includedIds.includes(s.id));
  const removedSections = model.sections.filter(s => !includedIds.includes(s.id));

  // Auto-sectioning: paginate when 10+ visible sections, scroll otherwise.
  const paginated = visibleSections.length >= 10;
  const [activeIdx, setActiveIdx] = useState(0);
  const [regenBusyId, setRegenBusyId] = useState(null);
  const [editingSectionIds, setEditingSectionIds] = useState(() => new Set());
  const isEditingSection = (id) => editingSectionIds.has(id);
  const toggleSectionEdit = (id) => {
    setEditingSectionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Clamp activeIdx if removals shrank the visible list
  const safeActiveIdx = Math.min(activeIdx, Math.max(0, visibleSections.length - 1));

  const sectionsToRender = paginated && !editing
    ? [visibleSections[safeActiveIdx]].filter(Boolean)
    : visibleSections;

  const updateSection = (sectionId, nextValue) => {
    if (editing) {
      setDraft(d => ({ ...d, modelSections: { ...(d.modelSections || {}), [sectionId]: nextValue } }));
    } else {
      const nextSections = { ...(project.modelSections || {}), [sectionId]: nextValue };
      onUpdate({ ...project, modelSections: nextSections, updatedAt: new Date().toISOString() });
    }
  };

  // Skip a section — reset value to defaults, mark it skipped, keep
  // it in the section list. The user can fill / regenerate later.
  const skipSection = (section) => {
    const defaults = defaultValueForSection(section);
    const nextSections = { ...(project.modelSections || {}), [section.id]: defaults };
    const nextSkipped = skippedIds.includes(section.id) ? skippedIds : [...skippedIds, section.id];
    onUpdate({
      ...project,
      modelSections: nextSections,
      skippedSectionIds: nextSkipped,
      updatedAt: new Date().toISOString(),
    });
    nosToast(`${section.label} skipped — value reset.`, { eyebrow: 'Skipped' });
  };

  // Remove a section — pull its ID out of includedSectionIds. The
  // value stays preserved in modelSections so Restore brings it back
  // exactly as it was. Only structurally-optional sections can be
  // removed (canRemove enforced in the action row prop).
  const removeSection = (section) => {
    const nextIncluded = includedIds.filter(id => id !== section.id);
    onUpdate({
      ...project,
      includedSectionIds: nextIncluded,
      updatedAt: new Date().toISOString(),
    });
    nosToast(`${section.label} removed.`, { eyebrow: 'Removed' });
  };

  const restoreSection = (section) => {
    if (!includedIds.includes(section.id)) {
      onUpdate({
        ...project,
        includedSectionIds: [...includedIds, section.id],
        // If it was in skipped, clear the skipped flag too — restoring
        // implies the user wants this section live again, defaults to
        // "active".
        skippedSectionIds: skippedIds.filter(id => id !== section.id),
        updatedAt: new Date().toISOString(),
      });
      nosToast(`${section.label} restored.`, { eyebrow: 'Restored', kind: 'success' });
    }
  };

  // Per-section regenerate
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
    // Regenerating clears the skipped flag — regenerated content isn't skipped
    const nextSkipped = skippedIds.filter(id => id !== section.id);
    updateSection(section.id, parsed);
    if (nextSkipped.length !== skippedIds.length) {
      onUpdate({ ...project, skippedSectionIds: nextSkipped });
    }
    nosToast(`${section.label} refilled.`, { eyebrow: 'Regenerate', kind: 'success' });
  };

  return (
    <>
      {paginated && !editing && (
        <DBProjectDetailSectionNav T={T}
          sections={visibleSections}
          activeIdx={safeActiveIdx}
          setActiveIdx={setActiveIdx} />
      )}

      {sectionsToRender.map((s, i) => {
        const sectionIdx = paginated && !editing ? safeActiveIdx : visibleSections.indexOf(s);
        const value = (editing ? draft.modelSections : project.modelSections)?.[s.id];
        const isRegenerating = regenBusyId === s.id;
        const isSkipped = skippedIds.includes(s.id);
        const canRemove = isSectionDeletable(s);
        return (
          <div key={s.id} style={{ marginBottom: 28 }}>
            {(!paginated || editing) && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 12, gap: 10, flexWrap: 'wrap',
              }}>
                {/* Section header — uses the same italic title style as
                    "Tell us about you" / "Name your project" / etc.
                    Number prefix removed turn 56. Skipped chip stays. */}
                <div style={{
                  display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
                  minWidth: 0,
                }}>
                  <span style={{
                    fontFamily: BODY, fontWeight: 500, fontStyle: 'italic',
                    fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.015em',
                    color: T.ink,
                  }}>{s.label}</span>
                  {isSkipped && (
                    <span style={{
                      padding: '2px 7px', borderRadius: 4,
                      background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                      color: T.ink4, fontSize: 9, fontFamily: MONO, fontWeight: 600,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                    }}>Skipped</span>
                  )}
                </div>
                {!editing && (
                  <DBSectionActionRow T={T}
                    isEditing={isEditingSection(s.id)}
                    onToggleEdit={() => toggleSectionEdit(s.id)}
                    onRegenerate={() => regenerateSection(s)}
                    isRegenerating={isRegenerating}
                    showRegenerate={!disableRegenerate}
                    showEdit={!disableEdit}
                    onSkip={() => skipSection(s)}
                    onRemove={() => removeSection(s)}
                    canRemove={canRemove} />
                )}
              </div>
            )}
            {paginated && !editing && (
              <div style={{
                display: 'flex', justifyContent: 'flex-end',
                marginBottom: 12, gap: 8, alignItems: 'center', flexWrap: 'wrap',
              }}>
                {isSkipped && (
                  <span style={{
                    padding: '2px 6px', borderRadius: 4,
                    background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                    color: T.ink4, fontFamily: MONO, fontSize: 8.5,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>Skipped</span>
                )}
                <DBSectionActionRow T={T}
                  isEditing={isEditingSection(s.id)}
                  onToggleEdit={() => toggleSectionEdit(s.id)}
                  onRegenerate={() => regenerateSection(s)}
                  isRegenerating={isRegenerating}
                  showRegenerate={!disableRegenerate}
                  showEdit={!disableEdit}
                  onSkip={() => skipSection(s)}
                  onRemove={() => removeSection(s)}
                  canRemove={canRemove} />
              </div>
            )}
            <DBModelSectionRenderer T={T} section={s} value={value}
              editing={editing || isEditingSection(s.id)}
              crew={Array.isArray(user?.crew) ? user.crew : []}
              user={user}
              onChange={(nv) => updateSection(s.id, nv)} />
          </div>
        );
      })}

      {/* Removed sections panel — only renders when at least one section
          has been pulled from this project. Each row offers Restore to
          bring it back. Preserves the user's removed value in
          modelSections (no data loss). Stage D, turn 53. */}
      {removedSections.length > 0 && !editing && (
        <div style={{
          marginTop: 36, padding: '16px 18px', borderRadius: 12,
          background: T.cardBgAlt, border: `1px dashed ${T.borderMd}`,
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: T.ink4, marginBottom: 10,
          }}>
            {removedSections.length} section{removedSections.length === 1 ? '' : 's'} removed from this project
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {removedSections.map(s => (
              <div key={s.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '4px 0',
              }}>
                <span style={{
                  fontFamily: BODY, fontSize: 13, fontStyle: 'italic',
                  color: T.ink3,
                }}>{s.label}</span>
                <button onClick={() => restoreSection(s)} style={{
                  all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                  padding: '4px 12px', borderRadius: 999,
                  fontFamily: BODY, fontSize: 11.5, fontStyle: 'italic',
                  color: ACCENT,
                }}>Restore</button>
              </div>
            ))}
          </div>
        </div>
      )}

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

/* ─── DB · New-project chooser + template picker (v1.4) ─────── */
function DBNewProjectChooser({ T, onPickCanvas, onPickTemplate, onCancel, user }) {
  const { isMobile } = useViewport();
  const [hovered, setHovered] = useState(null);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  if (templatePickerOpen) {
    return (
      <DBTemplatePicker T={T}
        onPick={(modelId) => onPickTemplate(modelId)}
        onBack={() => setTemplatePickerOpen(false)}
        onCancel={onCancel}
        user={user} />
    );
  }

  const cards = [
    {
      id: 'canvas',
      label: 'Canvas',
      desc: 'Start with a blank page. Add blocks as you go — title, spark, references, briefs, anything. Best when the project shape isn\'t obvious yet.',
      footer: 'Free-form composer',
      onClick: onPickCanvas,
      Icon: NoteIc,
      available: true,
    },
    {
      id: 'template',
      label: 'Template',
      desc: `Start from one of ${MODELS.length} in-built frameworks — content production, junket brief, production budget, shooting schedule, and more. Best when you know the shape.`,
      footer: `${MODELS.length} templates · FCC`,
      onClick: () => setTemplatePickerOpen(true),
      Icon: FolderIc,
      available: true,
    },
    {
      id: 'community',
      label: 'Community',
      desc: 'Browse frameworks, workflows, and templates contributed by other creatives. Coming in a future release.',
      footer: 'Coming soon',
      onClick: () => { window.location.href = 'mailto:community@nia.app?subject=Community%20templates%20-%20early%20access'; },
      Icon: UsersIc,
      available: false,
    },
  ];

  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, zIndex: 96,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 16 : 32,
      overflow: 'auto',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 720,
        background: T.cardBg, border: `1px solid ${T.borderMd}`,
        borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
        padding: isMobile ? '28px 22px' : '36px 38px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 16, marginBottom: 8,
        }}>
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: T.ink4, marginBottom: 8,
            }}>nOS · New project</div>
            <div style={{
              fontFamily: BODY, fontWeight: 500, fontStyle: 'italic',
              fontSize: isMobile ? 22 : 28,
              lineHeight: 1.2, letterSpacing: '-0.02em',
              color: T.ink,
            }}>How would you like to start?</div>
          </div>
          <button onClick={onCancel} title="Cancel" style={{
            all: 'unset', cursor: 'pointer',
            width: 32, height: 32, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.ink3, flexShrink: 0,
            transition: `background ${EASE_QUICK}, color ${EASE_QUICK}`,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.cardBgAlt; e.currentTarget.style.color = T.ink; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.ink3; }}>
            <CloseIc s={14} c="currentColor" sw={1.8} />
          </button>
        </div>

        <div style={{
          fontFamily: BODY, fontSize: 13.5, color: T.ink3,
          lineHeight: 1.6, marginBottom: 24,
        }}>
          You can change your mind any time. Templates can be skipped, regenerated, and reshaped section-by-section after you've started.
        </div>

        {/* Card grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 12,
        }}>
          {cards.map(card => {
            const isHovered = hovered === card.id;
            const isAvail = card.available;
            return (
              <button key={card.id}
                onClick={card.onClick}
                onMouseEnter={() => setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                  padding: '20px 20px',
                  borderRadius: 12,
                  background: isHovered && isAvail ? T.cardBgAlt : 'transparent',
                  border: `1px solid ${isHovered && isAvail ? T.ink3 : T.borderMd}`,
                  display: 'flex', flexDirection: 'column', gap: 12,
                  minHeight: 180,
                  transition: `all ${EASE_QUICK}`,
                  transform: isHovered && isAvail ? 'translateY(-2px)' : 'translateY(0)',
                  opacity: isAvail ? 1 : 0.72,
                }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: T.cardBgAlt, border: `1px solid ${T.borderMd}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: T.ink2,
                }}>
                  <card.Icon s={18} c="currentColor" sw={1.6} />
                </div>
                <div>
                  <div style={{
                    fontFamily: BODY, fontWeight: 500, fontStyle: 'italic',
                    fontSize: 17, color: T.ink, letterSpacing: '-0.015em',
                    marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {card.label}
                    {!isAvail && (
                      <span style={{
                        fontFamily: MONO, fontSize: 8.5, fontWeight: 600,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: T.ink4, padding: '2px 6px', borderRadius: 4,
                        border: `1px solid ${T.borderMd}`,
                        fontStyle: 'normal',
                      }}>Soon</span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: BODY, fontSize: 13, color: T.ink3,
                    lineHeight: 1.55,
                  }}>{card.desc}</div>
                </div>
                <div style={{
                  marginTop: 'auto', paddingTop: 8,
                  fontFamily: MONO, fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: T.ink4,
                }}>{card.footer}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── DB · Template picker (turn 56) ─────────────────────────────
   Second screen of the new-project flow when the user picks
   "Template" on the chooser. Lists the in-built MODELS in a
   compact card grid. Click a template → fires onPick(modelId);
   the parent then opens DBNewProjectFlow with attachedModelId
   prefilled to start the intake-then-composer flow.
   ──────────────────────────────────────────────────────────────── */
function DBTemplatePicker({ T, onPick, onBack, onCancel, user }) {
  const { isMobile } = useViewport();
  const [hovered, setHovered] = useState(null);

  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, zIndex: 96,
      background: T.modalScrim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 16 : 32,
      overflow: 'auto',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 780,
        maxHeight: isMobile ? 'calc(100vh - 32px)' : 'calc(100vh - 64px)',
        background: T.cardBg, border: `1px solid ${T.borderMd}`,
        borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
        padding: isMobile ? '24px 20px 20px' : '32px 36px 28px',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 16, marginBottom: 20, flexShrink: 0,
        }}>
          <div style={{ minWidth: 0 }}>
            <button onClick={onBack} style={{
              all: 'unset', cursor: 'pointer',
              fontFamily: BODY, fontSize: 12, fontStyle: 'italic',
              color: T.ink3, marginBottom: 10, display: 'inline-flex',
              alignItems: 'center', gap: 4,
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = T.ink}
              onMouseLeave={(e) => e.currentTarget.style.color = T.ink3}>
              ← Back
            </button>
            <div style={{
              fontFamily: BODY, fontWeight: 500, fontStyle: 'italic',
              fontSize: isMobile ? 20 : 26,
              lineHeight: 1.2, letterSpacing: '-0.02em',
              color: T.ink, marginBottom: 6,
            }}>Pick a template</div>
            <div style={{
              fontFamily: BODY, fontSize: 13, color: T.ink3,
              lineHeight: 1.55,
            }}>
              Each template carries a Function Creative Company framework code (FCC / TPL-XX). Section structure can be reshaped after you start.
            </div>
          </div>
          <button onClick={onCancel} title="Cancel" style={{
            all: 'unset', cursor: 'pointer',
            width: 32, height: 32, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.ink3, flexShrink: 0,
            transition: `background ${EASE_QUICK}, color ${EASE_QUICK}`,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.cardBgAlt; e.currentTarget.style.color = T.ink; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.ink3; }}>
            <CloseIc s={14} c="currentColor" sw={1.8} />
          </button>
        </div>

        {/* Grid — scrollable area */}
        <div style={{
          flex: 1, overflowY: 'auto', minHeight: 0,
          margin: '0 -4px', padding: '0 4px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: 10,
          }}>
            {MODELS.map(model => {
              const isHovered = hovered === model.id;
              const sectionCount = (model.sections || []).length;
              return (
                <button key={model.id}
                  onClick={() => onPick(model.id)}
                  onMouseEnter={() => setHovered(model.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                    padding: '16px 16px', borderRadius: 10,
                    background: isHovered ? T.cardBgAlt : 'transparent',
                    border: `1px solid ${isHovered ? T.ink3 : T.borderMd}`,
                    transition: `all ${EASE_QUICK}`,
                    display: 'flex', flexDirection: 'column', gap: 8,
                    minHeight: 130,
                  }}>
                  <div style={{
                    display: 'flex', alignItems: 'baseline',
                    justifyContent: 'space-between', gap: 10,
                  }}>
                    <span style={{
                      fontFamily: BODY, fontWeight: 500, fontStyle: 'italic',
                      fontSize: 15.5, color: T.ink, letterSpacing: '-0.015em',
                    }}>{model.label}</span>
                    <span style={{
                      fontFamily: MONO, fontSize: 9, fontWeight: 600,
                      letterSpacing: '0.10em', color: T.ink4,
                      flexShrink: 0,
                    }}>{model.fccCode}</span>
                  </div>
                  <div style={{
                    fontFamily: BODY, fontSize: 12.5, color: T.ink3,
                    lineHeight: 1.55, flex: 1,
                  }}>{model.desc}</div>
                  <div style={{
                    fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: T.ink4,
                  }}>{sectionCount} section{sectionCount === 1 ? '' : 's'}</div>
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
  const [newProjectMode, setNewProjectMode] = useState(null); // null | 'choose' | 'template'
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
                <button onClick={() => nosToast('Client preview mode is coming soon.', { eyebrow: 'Preview' })}
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
              onOpenLibrary={() => setLibraryOpen(true)}
              onNewProject={() => setNewProjectMode('choose')} />
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
      {newProjectMode === 'choose' && (
        <DBNewProjectChooser T={T} user={user}
          onPickCanvas={() => { setNewProjectMode(null); tryNewProject(); }}
          onPickTemplate={() => setNewProjectMode('template')}
          onCancel={() => setNewProjectMode(null)} />
      )}
      {newProjectMode === 'template' && (
        <DBTemplatePicker T={T} user={user}
          onPick={(modelId) => { setNewProjectMode(null); setModelDetailId(modelId); }}
          onBack={() => setNewProjectMode('choose')}
          onCancel={() => setNewProjectMode(null)} />
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

export { NOSDashboard, DBSharedProjectView };
