# TripSync — Planning Document

## 1. Problem statement

Group trips fall apart in group chats. Plans get buried in hundreds of messages, nobody knows the schedule, one person ends up paying for everything, and it takes weeks to figure out who owes whom. The 2026–2027 FBLA topic, **“Together We Go: Group Trip Planner,”** asks for a mobile app that helps groups organize and manage a shared trip *from planning through completion*, supporting collaboration, communication, scheduling, budgeting, organization and trip management for multiple users.

**Our goal:** one place where every traveler sees the same plan, the same budget and the same conversation, and that works on a phone even with no internet.

## 2. Research summary

We looked at how groups plan trips today (group texts, shared notes, spreadsheets, separate expense-splitting apps) and the pain points that come up repeatedly:

| Pain point | Design response |
| --- | --- |
| Information is scattered across apps | One trip hub with Overview, Plan, Budget, Chat and Lists tabs |
| Nobody knows the schedule | Day-by-day itinerary, “Up next” card, double-booking detection |
| Money awkwardness | Expense splitting with a fewest-payments settle-up |
| Forgotten items and tasks | Shared checklist with assignees and progress |
| Friends use different messaging apps | Share to WhatsApp, X, Facebook or any app via the share sheet |
| Spotty connectivity while traveling | All data stored on-device in SQLite; works offline |

## 3. Personas

- **Maya, 17, the organizer.** Plans the annual friends’ trip. Needs to collect ideas, set a budget and keep everyone on track. *Goal: less chasing people for answers.*
- **Jordan, 18, the easy-going traveler.** Wants to know where to be and what he owes. *Goal: a glanceable schedule and a clear “you owe $X.”*
- **The Nair family.** Parents and two teens on a family vacation. *Goal: a packing list everyone can check off, and accessible, easy-to-read screens for every age.*

## 4. Requirements

### Functional

1. Create, view and delete trips (destination, country, dates, budget, cover photo).
2. Add and remove travelers; record who created each plan, expense and message.
3. Itinerary: add and delete plans with day, time, category, location and notes; prevent clashes.
4. Budget: log expenses (amount, payer, category, date, split), show totals by category, balances and settle-up.
5. Communication: per-trip group chat; share invites, settle-ups and recaps to social media.
6. Organization: shared checklist with add, complete, assign and delete.
7. Trip lifecycle: countdown, planning → in progress → completed, past trips and recap.
8. Onboarding with instructions, plus an in-app help screen and credits screen.

### Non-functional

- Runs standalone on iOS and Android smartphones with no programming errors.
- Works fully offline; data persists between launches.
- Every input validated (syntactic + semantic) with clear inline messages.
- Accessible: screen-reader labels, 44 pt touch targets, WCAG AA contrast, dynamic type.
- Consistent visual design from a single set of design tokens.

## 5. User stories (backlog)

| # | As a… | I want to… | So that… | Priority |
| --- | --- | --- | --- | --- |
| 1 | organizer | create a trip with dates and a budget | the group has a home for the plan | Must |
| 2 | organizer | invite friends to the trip | everyone is part of the plan | Must |
| 3 | traveler | see a day-by-day itinerary | I know where to be and when | Must |
| 4 | traveler | log what I paid and who it was for | costs are shared fairly | Must |
| 5 | traveler | see who owes whom | we can settle up quickly | Must |
| 6 | traveler | chat with the group inside the trip | decisions stay with the plan | Should |
| 7 | family member | check off a shared packing list | nothing is forgotten | Should |
| 8 | organizer | share the trip to WhatsApp / social media | friends without the app can see it | Should |
| 9 | traveler | see past trips and a recap | we can remember and share the trip | Could |
| 10 | new user | see instructions on first launch | I know how to use the app | Must |

## 6. Development process & timeline

We used an **Agile / iterative** process with short sprints, a prioritized backlog (MoSCoW) and a working build at the end of each sprint.

| Sprint | Focus | Deliverables |
| --- | --- | --- |
| 1 | Research & design | Problem research, personas, user stories, wireframes, design tokens, app icon |
| 2 | Foundation | Expo project, navigation (tabs + stack), Home screen, reusable components |
| 3 | Data layer | SQLite schema & migrations, repositories, validation rules, seed data |
| 4 | Core features | Create trip, trip hub, itinerary, budget & settle-up, chat, checklists |
| 5 | Integration & polish | Social sharing, onboarding, help & credits, accessibility pass, offline photos |
| 6 | Testing & release | Manual test plan (below), type-check + lint, web backup deployment, presentation prep |

Version control: Git + GitHub (`main` branch), with descriptive commits per feature.

## 7. Wireframe summary

- **Home:** greeting → Create Trip card → Upcoming Trips cards → Past Trips.
- **Trip hub:** photo header (destination, dates, countdown) → sticky tab pills (Overview · Plan · Budget · Chat · Lists) → section content.
- **Forms:** full-screen modal with title, fields with inline errors, pinned primary button.
- **Explore:** search → category chips → 2-column destination grid → tap to start a trip.
- **Profile:** avatar + stats → account, about (help, credits), data (reset).

## 8. Test plan (manual, run on iOS, Android and web)

| Test | Steps | Expected |
| --- | --- | --- |
| Onboarding validation | Submit empty name, then “J4ck!” | “Your name is required.” / “can only use letters…” |
| Create trip, past date | Start 2025-06-10 | “Start date can’t be in the past.” |
| Create trip, impossible date | End 2027-02-30 | “End date isn’t a real calendar date.” |
| Create trip, reversed dates | Start 2027-06-10, end 2027-06-01 | “End date must be on or after the start date.” |
| Plan outside trip | Day after trip ends | “Pick a day during the trip (…).” |
| Plan clash | Same day/time as existing plan | “‘…’ is already planned at 7:30 PM that day.” |
| Expense split | $1,280 lodging split 4 ways, etc. | Balances and settle-up add up exactly to the cent |
| Duplicate traveler | Invite an existing name | “… is already on this trip.” |
| Offline | Airplane mode, relaunch | All trips, photos and data still load |
| Persistence | Add data, force-quit, reopen | Data is still there |
| Share | Tap WhatsApp on a trip | WhatsApp opens with the invite text filled in |
| Screen reader | VoiceOver on Home | Trip cards read destination, dates, countdown, travelers |
