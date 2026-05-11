import { useState, useEffect } from 'react';
import { supabase } from './supabase.js';
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
import { NiaOnboarding } from './Onboarding.jsx';
import { NOSDashboard, DBSharedProjectView } from './Dashboard.jsx';
import { SettingsModal, UpgradeGate } from './Settings.jsx';


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
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skinKey, setSkinKey] = useState('metallic');
  const [settingsOpen, setSettingsOpen] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [pendingSession, setPendingSession] = useState(null);

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
  const [upgradeContext, setUpgradeContext] = useState(null);
  useEffect(() => {
    const onUpgrade = (e) => setUpgradeContext(e.detail || { feature: 'pricing' });
    window.addEventListener('nos:upgrade', onUpgrade);
    return () => window.removeEventListener('nos:upgrade', onUpgrade);
  }, []);

  // ─── Supabase auth helpers ────────────────────────────────────
  const buildUserProfile = (d) => ({
    id: d.id, email: d.email, name: d.name, location: d.location,
    role: d.role, archetypePrimary: d.archetype_primary,
    archetypeSecondary: d.archetype_secondary || [], avatarUrl: d.avatar_url,
    provider: d.provider, referralSource: d.referral_source,
    tier: d.tier || 'foundation', tierSince: d.tier_since,
    language: d.language || 'en', timezone: d.timezone || 'America/New_York',
    compactDensity: d.compact_density || false, reducedMotion: d.reduced_motion || false,
    notifications: d.notifications || { emailDigest: 'weekly', mentions: true, comments: true, shares: true, productUpdates: false, marketing: false },
    privacy: d.privacy || { thirdPartyScrape: true, taste: true, telemetry: true },
    demoSeeded: d.demo_seeded || false, demoSeededAt: d.demo_seeded_at,
    aiCallsThisMonth: d.ai_calls_this_month || 0, aiCallsResetAt: d.ai_calls_reset_at,
    connectedIntegrations: d.connected_integrations || [],
    allowProfileSuggestions: true, emailVerified: true,
    plan: { tier: 'free', renews: null }, createdAt: d.created_at,
  });

  const fetchProfile = async (sbUser) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', sbUser.id).maybeSingle();
    return data ? buildUserProfile(data) : null;
  };

  const toPending = (sbUser) => ({
    stage: 'identity',
    form: {
      email: sbUser.email,
      name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || '',
      avatarUrl: sbUser.user_metadata?.avatar_url || null,
      provider: sbUser.app_metadata?.provider || 'email',
    },
  });

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        const profile = await fetchProfile(session.user);
        if (!mounted) return;
        if (profile) setUser(profile);
        else setPendingSession(toPending(session.user));
      }
      if (mounted) setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session) {
        const profile = await fetchProfile(session.user);
        if (!mounted) return;
        if (profile) { setUser(profile); setPendingSession(null); }
        else setPendingSession(toPending(session.user));
        if (mounted) setLoadingAuth(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null); setPendingSession(null);
        if (mounted) setLoadingAuth(false);
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
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
  const handleOnboardingComplete = async (profile) => {
    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (!sbUser) return;
    const now = new Date().toISOString();
    const { data, error } = await supabase.from('profiles').upsert({
      id: sbUser.id, email: sbUser.email,
      name: profile.name, location: profile.location, role: profile.role,
      archetype_primary: profile.archetypePrimary,
      archetype_secondary: profile.archetypeSecondary || [],
      avatar_url: profile.avatarUrl, provider: profile.provider,
      referral_source: profile.referralSource,
      tier: 'foundation', tier_since: now,
      language: 'en', timezone: 'America/New_York',
      compact_density: false, reduced_motion: false,
      notifications: { emailDigest: 'weekly', mentions: true, comments: true, shares: true, productUpdates: false, marketing: false },
      privacy: { thirdPartyScrape: true, taste: true, telemetry: true },
      ai_calls_this_month: 0, ai_calls_reset_at: now.slice(0, 7),
      connected_integrations: [],
    }).select().single();
    if (error) { nosToast('Could not save profile — please retry.', { eyebrow: 'Error', kind: 'danger' }); return; }
    setUser(buildUserProfile(data));
    setPendingSession(null);
  };

  const handleLogOut = async () => {
    setSettingsOpen(false);
    await supabase.auth.signOut();
    setProjects([]);
    setUser(null);
  };

  const handleDeleteAccount = async () => {
    setSettingsOpen(false);
    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (sbUser) {
      await supabase.from('profiles')
        .update({ pending_deletion: true, pending_deletion_at: new Date().toISOString() })
        .eq('id', sbUser.id);
    }
    await supabase.auth.signOut();
    setProjects([]);
    setUser(null);
    nosToast('Account marked for deletion. 30-day grace window.', { eyebrow: 'Account', kind: 'danger', durationMs: 5000 });
  };

  // ─── Render ───────────────────────────────────────────────────
  if (loadingAuth) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 20, letterSpacing: '-0.02em', color: '#666',
        }}>Loading…</div>
      </div>
    );
  }

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
        initialStage={pendingSession?.stage}
        initialForm={pendingSession?.form}
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
