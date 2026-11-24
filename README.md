# TripSync — Group Trip Planner

**FBLA Mobile Application Development 2026–2027 · Topic: “Together We Go: Group Trip Planner”**

TripSync helps a group of friends or family plan and run a shared trip from the first idea to the final bill: one shared itinerary, one budget that splits costs fairly, one group chat, and shared checklists, with one-tap sharing to WhatsApp, X and Facebook.

- **Platform:** iOS and Android smartphones (one codebase), built with React Native + Expo SDK 58. A web build is also published as a backup demo.
- **Runs standalone and offline:** all data is stored on the phone in SQLite, so the app works even if the conference Wi-Fi does not.
- **Live web version:** https://fbla-team-shreehan-and-sree.expo.app

---

## How TripSync answers the prompt

| Prompt requirement | TripSync feature | Where |
| --- | --- | --- |
| Collaboration | Shared trips with travelers and roles (organizer/traveler); tasks assigned to teammates | Trip → Overview, Lists |
| Communication | Per-trip group chat; one-tap sharing to WhatsApp, X, Facebook and the phone’s share sheet | Trip → Chat, share cards |
| Scheduling | Day-by-day itinerary with times, categories and double-booking detection | Trip → Plan |
| Budgeting | Group budget, expense logging, even splits, balances and fewest-payments settle-up | Trip → Budget |
| Organization | Shared packing / to-do checklists with progress and assignees | Trip → Lists |
| Trip management (planning → completion) | Countdown, status (planning, in progress, completed), past trips, trip recap | Home, Trip → Overview |
| Multiple users | Every plan, expense and message records which traveler created it | Throughout |

The same mapping is shown inside the app under **Profile → How to use TripSync**.

## Running the app

Requirements: Node.js LTS and the **Expo Go** app on an iPhone or Android phone.

```bash
git clone https://github.com/rsrbtrsdh/FBLA-Mobile-Application-Shreehan-and-Sree.git
cd FBLA-Mobile-Application-Shreehan-and-Sree
npm install
npx expo start          # add --tunnel if the phone is on a different network
```

Scan the QR code with the iPhone Camera app (or the Expo Go app on Android). On Windows PowerShell, use `npx.cmd` if `npx` is blocked.

Other commands:

| Command | Purpose |
| --- | --- |
| `npx tsc --noEmit` | Type-check all source code |
| `npx expo lint` | Lint (ESLint + React Hooks rules) |
| `npx expo export --platform web` then `npx eas-cli deploy --prod` | Publish the web version |
| `node scripts/generate-icons.mjs` | Regenerate the app icon, splash and logo from the SVG source |

## User guide

1. **First launch:** three intro slides, then enter your name. Leave “Add sample trips” on to explore a ready-made trip to Kyoto.
2. **Create a trip:** Home → **Create Trip** (or tap a destination in **Explore**). Enter destination, country, dates (YYYY-MM-DD), budget and a cover photo.
3. **Add travelers:** Trip → Overview → **Invite**, or share the trip to your group chat.
4. **Plan:** Trip → **Plan** → Add a plan (time uses 24-hour HH:MM).
5. **Budget:** Trip → **Budget** → Add an expense, choose who paid and who it’s split with. The Settle up card shows who owes whom and can be sent to WhatsApp.
6. **Chat & Lists:** message the group, add checklist items, tap the circle to complete and the avatar to assign.
7. **After the trip:** it moves to Past Trips with a recap you can share.

## Architecture

Layered **MVVM + Repository** architecture (details and diagrams in [docs/architecture.md](docs/architecture.md)):

```
Screens (src/app)  →  View-model hooks (src/hooks)  →  Repositories (src/data)  →  SQLite (src/db)
      ↑                         ↑                              │
Reusable UI components   Validation (src/validation)    change events re-render screens
(src/components)         Services (src/services)
```

| Folder | Responsibility |
| --- | --- |
| `src/app` | Screens and navigation (Expo Router, file-based). Tabs: Home, Explore, Profile. Stack: trip, forms, help, credits. |
| `src/components` | 25+ reusable, typed UI components (cards, forms, buttons, avatars, trip sections). |
| `src/hooks` | View models: `useTripSummaries`, `useTripDetail`, `useCurrentUser`, generic `useQuery`. |
| `src/data` | Repositories: the only code that reads/writes the database; publishes change events (observer pattern). |
| `src/db` | Schema, versioned migrations and demo seed data. |
| `src/validation` | Syntactic rules (`rules.ts`) and semantic, data-aware form validators (`forms.ts`). |
| `src/services` | Social media integration (WhatsApp, X, Facebook, share sheet). |
| `src/utils` | Pure helpers: dates, money formatting, expense splitting and settle-up algorithm. |
| `src/constants` | Design tokens (colors, spacing, type), photo catalog, categories. |

## Data handling & storage

- **On-device SQLite database** (`tripsync.db`, via `expo-sqlite`): 9 normalized tables (trips, members, trip_members, itinerary_items, expenses, expense_splits, messages, checklist_items, settings).
- **Integrity enforced by the database:** `NOT NULL`, `CHECK` constraints (lengths, positive amounts, valid categories, end date ≥ start date), foreign keys with `ON DELETE CASCADE`, composite primary keys to prevent duplicate memberships.
- **Transactions** wrap multi-row writes (creating a trip with its organizer, an expense with its splits, seeding) so data is never half-saved.
- **Versioned migrations** (`PRAGMA user_version`) let future versions change the schema without losing users’ trips.
- **Security:** every query uses parameter binding (`?` placeholders), so user text can never be executed as SQL (SQL-injection safe). Data never leaves the device unless the user chooses to share it. All text is sanitized (control characters stripped, whitespace normalized) before saving.
- **Money as integer cents** avoids floating-point rounding errors; splits distribute leftover cents so totals always add up exactly.
- **Privacy:** no accounts, passwords or tracking. **Reset app data** in Profile permanently erases everything after confirmation.

## Input validation

Every form validates on two levels before anything is saved, and shows the error next to the field (and announces it to screen readers):

| Level | Examples |
| --- | --- |
| Syntactic (format) | Required fields and length limits; names use letters only; dates must be real calendar dates in YYYY-MM-DD (rejects 2027-02-30); times must be 24-hour HH:MM; money allows up to 2 decimals; email format |
| Semantic (meaning) | Trip can’t start in the past or end before it starts, max 60 days; a plan must fall inside the trip dates; two plans can’t be booked at the same day and time; an expense must be paid by a trip member and split with at least one traveler; the same person can’t be invited twice; duplicate checklist items are rejected; expense date can’t be after the trip ends |

## Accessibility

- Every control has an accessibility role and label; trip cards read out destination, dates, countdown and group size.
- Form errors use live regions so VoiceOver/TalkBack announce them immediately.
- Touch targets are at least 44×44 pt; text supports system font scaling.
- Color contrast meets WCAG AA for body text; status is never shown by color alone (icons + text labels).
- Plain-language instructions in onboarding and the in-app help screen.

## Social media integration

`src/services/social-share.ts` works directly with social apps:

- **WhatsApp:** opens the WhatsApp app (`whatsapp://send`) with the message pre-filled, falling back to `wa.me` on the web.
- **X (Twitter):** opens a pre-filled post (`twitter.com/intent/tweet`).
- **Facebook:** opens the Facebook share dialog with the TripSync link.
- **More…:** the native iOS/Android share sheet (Instagram, Messages, Snapchat, email…).

Shareable content: trip invites, settle-up summaries (who owes whom) and post-trip recaps.

## Libraries & templates used

| Library | Purpose | License |
| --- | --- | --- |
| React Native 0.88 / React 19 | Cross-platform UI | MIT |
| Expo SDK 58 (`expo`, `expo-router`, `expo-sqlite`, `expo-image`, `expo-symbols`, `expo-splash-screen`, `expo-status-bar`) | Native modules, navigation, storage, images, icons | MIT |
| SQLite | Embedded database engine | Public domain |
| react-native-safe-area-context, react-native-screens, react-native-reanimated | Layout and navigation primitives | MIT |
| Material Symbols (via expo-symbols) | Icons on Android and web | Apache 2.0 |
| SF Symbols (via expo-symbols) | Icons on iOS | Apple SF Symbols license |
| TypeScript, ESLint (`eslint-config-expo`) | Type checking and linting | Apache 2.0 / MIT |
| sharp (development only) | Renders the app icon from SVG | Apache 2.0 |

The project was started from the official `create-expo-app` default template (MIT); all starter screens were replaced with original code.

## Copyright & sources

- **Original work:** the TripSync name, logo/app icon (`scripts/generate-icons.mjs`), UI design and all source code were created by our team.
- **Photos:** 9 destination photos from [Unsplash](https://unsplash.com), used under the [Unsplash License](https://unsplash.com/license) (free to use, no permission required). Each image’s source URL is listed in `src/constants/photos.ts` and on the in-app **Credits** screen.
- **Trademarks:** WhatsApp and Facebook are trademarks of Meta Platforms, Inc.; X is a trademark of X Corp. They are named only to label share buttons; TripSync is not affiliated with them.
- **Sample people** in the demo data (Jordan Ellis, Priya Nair, Sam Okafor, Lena Fischer) are fictional.

## Planning documents

- [docs/planning.md](docs/planning.md): problem statement, personas, requirements, user stories, timeline
- [docs/user-journey.md](docs/user-journey.md): user journey map and UX rationale
- [docs/architecture.md](docs/architecture.md): architecture, data model and design decisions
