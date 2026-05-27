[README.md](https://github.com/user-attachments/files/28294383/README.md)
# Finished modules — 7 patches applied, build-verified

These five files are the repo's `src/` modules with patches 01, 02, 03, 05, 06, 07, 08
applied. Built against a fresh clone of `labibdotc/nia-client2` (master) with
`npm run build` passing clean after every patch and once more all together.

## How to use
For each file: open it in your repo (e.g. `src/Dashboard.jsx`), select all (Cmd/Ctrl+A),
paste the matching file here, save. No find/replace hunting. Then `npm run build` to
confirm, commit, push, open the PR.

## What changed per file

**Dashboard.jsx** — 01 dock (Templates rename, + New-project button wired to the chooser,
single-active; fixed the `onNewProject={/* comment */}` build bug) · 02 stub sweep (13 stubs:
mailto wiring, Developer tab removed, Live-chat/Schedule rows dropped) · 05 template chooser
(DBNewProjectChooser + DBTemplatePicker, routes into the existing Models flow) · 06 Stage D
(DBSectionActionRow + DBProjectDetailModelBody now do skip/remove/restore; added
STRUCTURALLY_OPTIONAL_SECTIONS + isSectionDeletable helpers) · 07 computed totals
(DBMSFields renders `computed` fields read-only with an Auto badge).

**Settings.jsx** — 02 stub sweep (6 stubs: real archetype `<select>`s driven by
ARCHETYPES_LIST, Stripe billing rows → mailto) · 08 changelog (NOS_CHANGELOG +
STChangelogToggle replacing the stub). Adds an import of ARCHETYPES_LIST from Onboarding.

**dashboardData.js** — 07 computed totals (parseCurrency/formatCurrency/parsePercent
helpers; `computed:` added to totalVariable, projectPrice, markupPct, gpmPct in the
worked-example, and markupPct/gpmPct in working-assumptions). Math verified:
$9,000 → $12,857.14 @70% VC → 42.9% markup → 30% GPM.

**atoms.jsx** — 03 identity (ONBOARDING_CITIES, USERNAME_PATTERN, TAKEN_USERNAMES,
usernameIssue/isUsernameAvailable/suggestUsernames/slugifyForUsername added + exported).

**Onboarding.jsx** — 03 identity (CityPicker component; OBIdentity enhanced with the city
dropdown + live-availability @username field; username added to the form and the
onComplete payload). NOTE: the repo's separate OBPhoto step was left as-is on purpose —
no flow breakage.

## NOT included
**Patch 04 (working style)** is not applied. The repo has no ARCHETYPE_PROFILES /
workingStyles data layer (~250 lines of archetype data needed first). Treat as a separate
later piece.

## Flag for Labib — Supabase persistence
These fields are set in local state only; they need Supabase writes:
- user.username (onboarding completion)
- user.archetypePrimary / archetypeSecondary (Settings)
- project.includedSectionIds / skippedSectionIds (Stage D)
