import { useState, useEffect } from 'react';
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
import { ARCHETYPES_LIST } from './Onboarding.jsx';

const NOS_CHANGELOG = [
  { version: 'v1.4', date: 'May 13, 2026', notes: [
    'Section-by-section template composer — fill manually, generate per section, skip, or remove sections during project creation.',
    'Visual reference board on Brand Bible — paste URLs or upload images and short videos. Foundation: 5 references, URL-only. Professional: unlimited + upload + drag-drop + clipboard paste.',
    'Onboarding identity step — username with availability check, profile photo with crop, city picker across 26 global cities.',
    'Button system unified — all primary, ghost, and canvas-ghost buttons share three sizes (sm 30px / md 38px / lg 48px).',
    'Success signals across email inputs — green tick on valid format.',
    'CD Skill data layer — full Creative Director archetype profile with pain points, workflows, task domains, working styles, and nOS flow.',
    'Stub-handler sweep — 19 visible-but-broken buttons either removed or wired to real handlers.',
  ]},
  { version: 'v1.3', date: 'May 13, 2026', notes: [
    'Team rail in left panel — between Projects and Templates.',
    'Templates rail (formerly Functions) — single + Use template CTA.',
    'Dock pruned — Calendar and Briefs removed (no destinations).',
    'Capacity-branched onboarding — Individual vs Enterprise flows.',
    'Onboarding progress bar replaces the breadcrumb counter.',
  ]},
  { version: 'v1.2', date: 'May 8, 2026', notes: [
    'Project Canvas — block-based composer with 11 block types and 5 built-in workflows.',
    'New Models: Customer Discovery (TPL-07), Legal Agreement (TPL-08).',
    'Team workspace — three-tab structure: Roster / Assignments / Taste Profiles.',
  ]},
];

function STChangelogToggle({ T }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: 'transparent', border: `1px solid ${T.borderMd}`,
        borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
        fontFamily: BODY, fontSize: 12, fontWeight: 500, color: T.ink2,
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        {open ? 'Hide changelog' : 'View changelog'}
        <span style={{
          fontSize: 9, transform: open ? 'rotate(180deg)' : 'none',
          transition: `transform ${EASE_QUICK}`,
        }}>▼</span>
      </button>
      {open && (
        <div style={{
          width: '100%', maxWidth: 560,
          padding: 14, borderRadius: 10,
          background: T.cardBgAlt, border: `1px solid ${T.dividerInk}`,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {NOS_CHANGELOG.map(entry => (
            <div key={entry.version}>
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 10,
                marginBottom: 6,
              }}>
                <span style={{
                  fontFamily: MONO, fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.04em', color: T.ink,
                }}>nOS {entry.version}</span>
                <span style={{
                  fontFamily: BODY, fontSize: 11, fontStyle: 'italic',
                  color: T.ink4,
                }}>{entry.date}</span>
              </div>
              <ul style={{
                margin: 0, paddingLeft: 18,
                fontFamily: BODY, fontSize: 12, color: T.ink2, lineHeight: 1.6,
              }}>
                {entry.notes.map((n, i) => <li key={i} style={{ marginBottom: 3 }}>{n}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



/* ════════════════════════════════════════════════════════════════════════════

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
        <select value={user.archetypePrimary || ''}
          onChange={(e) => setUser(u => ({ ...u, archetypePrimary: e.target.value || null }))}
          style={{
            background: T.inputBg, border: `1px solid ${T.borderMd}`, borderRadius: 8,
            padding: '7px 12px', fontFamily: BODY, fontSize: 12.5, color: T.ink,
            cursor: 'pointer', outline: 'none', minWidth: 220,
          }}>
          <option value="">Pick one</option>
          {ARCHETYPES_LIST.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
        </select>
      </STRow>

      <STRow T={T} last label="Secondary archetypes"
        hint="Up to 2 additional disciplines if your work spans roles.">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {(user.archetypeSecondary || []).length === 0
            ? <span style={{ fontFamily: BODY, fontSize: 12, color: T.ink4, fontStyle: 'italic' }}>None</span>
            : user.archetypeSecondary.map(a => <STChip key={a} T={T} label={a} />)}
          {(user.archetypeSecondary || []).length < 2 && (
            <select value=""
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return;
                setUser(u => {
                  const cur = u.archetypeSecondary || [];
                  if (v === u.archetypePrimary || cur.includes(v) || cur.length >= 2) return u;
                  return { ...u, archetypeSecondary: [...cur, v] };
                });
              }}
              style={{
                background: 'transparent', border: `1px dashed ${T.borderMd}`,
                borderRadius: 999, padding: '3px 10px', cursor: 'pointer',
                fontFamily: BODY, fontSize: 10.5, color: T.ink3, outline: 'none',
              }}>
              <option value="">+ Add</option>
              {ARCHETYPES_LIST
                .filter(a => a.name !== user.archetypePrimary && !(user.archetypeSecondary || []).includes(a.name))
                .map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
            </select>
          )}
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
              onEdit={() => { window.location.href = 'mailto:billing@nia.app?subject=Update%20payment%20method'; }} />}
      </STRow>

      <STRow T={T} label="Billing email"
        hint="Where invoices are sent. Defaults to your account email.">
        <STInlineValue T={T} value={user.billingEmail || user.email || '—'} monospace
          onEdit={() => { window.location.href = 'mailto:billing@nia.app?subject=Update%20billing%20email'; }} />
      </STRow>

      <STRow T={T} last label="Invoices"
        hint="Past invoices are kept for 7 years per regulatory requirements.">
        <button onClick={() => { window.location.href = 'mailto:billing@nia.app?subject=Invoice%20history%20request'; }} style={{
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
        <STChangelogToggle T={T} />
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

export { SettingsModal, UpgradeGate };
