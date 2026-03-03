# Event List & Dashboard

> Module: Module 0 — Event & Session Setup
> Persona: Organizer
> Upstream: Organizer authenticated via Lepōs Admin Portal with valid JWT; business line resolved from token
> Downstream: Event Creation & Configuration (Feature 2); all downstream B2B modules (Registration, Badge Print, Admission, Lead Capture, Campaign Activation)

---

## 1. Feature Summary

The Event List & Dashboard is the organizer's home screen for B2B Events. From here, the organizer can see all their events at a glance — filtered by status or category — and quickly jump into creating a new event or managing an existing one. After an event is published, this same screen serves as the monitoring hub where the organizer tracks registration counts, adjusts quotas, and eventually closes the event.

---

## 2. User Flow

1. Organizer logs in → lands on Lepōs Admin home dashboard
2. Organizer selects their Business Line → clicks "B2B Events" in the left navigation
3. System loads the Event List page showing all events for this business line
4. Organizer sees a filterable list of events with status badges, key dates, and registration counts
5. Organizer can filter by status (Draft, Published, Live, Closed) or by event category
6. Organizer clicks "Create Event" → navigates to Event Creation form (Feature 2)
7. Organizer clicks an event row → navigates to Event Configuration (Feature 2) for that event
8. For published/live events: organizer monitors registration count vs quota in the list
9. Organizer can trigger "Close Event" from a quick-action menu on live/published events → confirmation dialog → event transitions to Closed

---

## 3. Screen Inventory

| Screen | Purpose |
|--------|---------|
| Event List | Primary list view of all events for the organizer's business line, with filters, pagination, and quick actions |
| Close Event Confirmation Dialog | Confirmation modal before closing an event (destructive action) |

---

## 4. Layout & Composition

### Event List
- **Top bar:** Page title ("B2B Events") + "Create Event" primary action button (top-right)
- **Filter bar:** Horizontal row of filter controls — Status dropdown, Category dropdown. Sits below the page title
- **Main content:** Data table or card list showing events. Each row/card displays: event name, status badge, category, dates, venue, quota, registration count, and quick-action menu
- **Pagination:** Bottom of list. Page size selector + page navigation

**Visual hierarchy guidance:**
- Primary focus: the event list itself (name + status badge is the most scannable pair)
- Secondary: filter controls (always visible, not collapsible)
- The "Create Event" button should be the most prominent action on the page

**Content density hint:** A typical organizer manages 5–20 events. Large organizations may have 50+.

### Close Event Confirmation Dialog
- **Centered modal overlay** with a warning icon, confirmation message, and two buttons (Cancel / Confirm Close)
- Destructive action: Confirm button uses destructive styling

---

## 4.1. Sample Data (for design mockups)

### Event List

| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Event Name | RTIA Annual Summit 2026 | RTIA年度峰會2026 | RTIA年度峰会2026 |
| Status | Published | 已發佈 | 已发布 |
| Category | Conference | 會議 | 会议 |
| Type | Summit | 峰會 | 峰会 |
| Start Date | 15 Mar 2026 | 2026年3月15日 | 2026年3月15日 |
| End Date | 17 Mar 2026 | 2026年3月17日 | 2026年3月17日 |
| Venue | HKCEC, Wan Chai | 灣仔會展中心 | 湾仔会展中心 |
| Quota | 500 | 500 | 500 |
| Registered | 312 / 500 | 312 / 500 | 312 / 500 |

**Data volume hints:**
- Typical organizer: 5–20 events across all statuses
- Large organizations (e.g. Wine & Dine team): up to 50+ events
- Event names: typically 20–60 characters (EN); TC/SC may be shorter
- Pagination: default page size 20

---

## 5. Component Checklist

### Event List
- [ ] Data Table — sortable columns, row click navigates to detail
- [ ] Status Badge — 4 variants: Draft (neutral), Published (info), Live (success), Closed (muted)
- [ ] Dropdown / Select — for Status and Category filters
- [ ] Button (primary) — "Create Event"
- [ ] Button (icon / kebab menu) — quick actions per row
- [ ] Pagination — page size selector + page controls
- [ ] Empty State Illustration — when no events exist
- [ ] Loading Skeleton — table row placeholders

### Close Event Confirmation Dialog
- [ ] Dialog / Modal — centered, with overlay
- [ ] Button (destructive) — "Close Event" confirmation
- [ ] Button (secondary) — "Cancel"
- [ ] Alert (warning variant) — confirmation message text

---

## 5.1. Component Gap Analysis

| Component Needed | Exists in Design System? | Recommendation |
|-----------------|------------------------|----------------|
| Data Table with sortable columns | ✅ Yes | Use existing table component with sort indicators |
| Status Badge (4 statuses) | ⚠️ Partial — Badge exists but may not have all 4 colour variants mapped | **Extend:** Map Draft=neutral/grey, Published=info/blue, Live=success/green, Closed=muted/grey. Confirm colour tokens with design system owner |
| Category Badge/Tag | ✅ Yes | Use existing Tag component with neutral styling |
| Quick Action Menu (kebab) | ✅ Yes | Use existing dropdown menu triggered by icon button |
| Registration Progress Indicator | ⚠️ Partial — progress bar exists but inline count format (312/500) may need a compact variant | **Extend:** Consider a compact "count / total" text display or a mini progress bar variant |
| Empty State (no events) | ✅ Yes | Use existing empty state pattern with illustration + CTA |

---

## 5.2. Questions Before Design

> **Q1: Should the event list use a data table layout or a card-based layout?**
> Context: Data tables are more information-dense and better for power users managing many events. Cards are more visual and better for scanning 5–10 events. The wrong choice affects all downstream list screens.
> Suggestion: Data table for MVP — organizers are admin users who need density over aesthetics.

> **Q2: What quick actions are available from the event list row — and do they vary by event status?**
> Context: The FDR mentions "Close Event" as available post-publish, but doesn't specify whether Edit, Duplicate, Delete (draft only), or View Registration Link should appear as quick actions from the list. If actions vary by status, the designer needs to design multiple menu states.
> Suggestion: Draft → Edit, Delete; Published → Edit, Copy Link, Close; Live → Edit, Close; Closed → View Only.

> **Q3: Should the registration count (312/500) include a visual progress indicator (progress bar) or just the numeric ratio?**
> Context: A progress bar adds visual weight but makes quota utilization scannable at a glance. Just numbers are cleaner but harder to scan across many rows.
> Suggestion: Numeric ratio with a subtle inline progress bar for published/live events. No indicator for draft/closed.

> **Q4: Is there a search/text filter for event names, or only dropdown filters for status and category?**
> Context: The FDR's ListEventsRequest supports status and category filters but doesn't mention text search. If organizers have 50+ events, name search becomes important.
> Suggestion: Add a text search input for event name filtering — even if the API doesn't support it yet, design for it.

---

## 6. Data & Field Specification

### Event List — Display-Only Fields (per row)

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Event Name | Text | User input (name_en / name_tc / name_sc — display based on portal language) | Primary text. Bold or medium weight. Clickable — navigates to event detail |
| 2 | Status | Badge | System state | Badge with colour coding: Draft = neutral/grey, Published = info/blue, Live = success/green, Closed = muted/grey |
| 3 | Event Category | Text or Tag | User input | Secondary text or subtle tag. Values: conference, exhibition, festival, gala, workshop, seminar, networking, ceremony, corporate |
| 4 | Event Type | Text | User input (dependent on category) | Displayed alongside category if set. NULL = show category only |
| 5 | Start Date | Date | User input (start_at) | Format: DD MMM YYYY (e.g. "15 Mar 2026"). Localise for TC/SC |
| 6 | End Date | Date | User input (end_at) | Format: DD MMM YYYY. Show as date range with start date (e.g. "15–17 Mar 2026") |
| 7 | Venue | Text | User input (venue_en / venue_tc / venue_sc) | Truncate if long. Tooltip for full text |
| 8 | Quota | Number | User input | Integer. Right-aligned |
| 9 | Registered Count | Number + Progress | Computed (sum of registered_count across ticket types from EventResponse.total_registered) | Show as "312 / 500" with optional progress bar. Only meaningful for published/live/closed events. Draft shows "—" |
| 10 | Session Count | Number | Computed (EventResponse.session_count) | Small count badge or plain number |

### Event List — Filter & Pagination Fields

| # | Field | Input Type | Options / Constraints | Default |
|---|-------|-----------|----------------------|---------|
| 1 | Status Filter | Dropdown (single-select) | All, Draft, Published, Live, Closed | All |
| 2 | Category Filter | Dropdown (single-select) | All, Conference, Exhibition, Festival, Gala, Workshop, Seminar, Networking, Ceremony, Corporate | All |
| 3 | Page Size | Dropdown | 10, 20, 50 | 20 |
| 4 | Page Token | Hidden (system-managed) | Cursor-based pagination string | None |

---

## 7. Interactions & Behaviour

- **Click event row** → Navigate to Event Configuration screen (Feature 2) for that event
- **Click "Create Event" button** → Navigate to Event Creation form (Feature 2)
- **Click kebab menu on a row** → Show contextual action dropdown. Actions depend on status (see Q2 in Section 5.2)
- **Select "Close Event" from kebab menu** → Show Close Event Confirmation Dialog
- **Confirm Close Event** → System transitions event to Closed status. Row updates with Closed badge. Registration count freezes
- **Cancel Close Event dialog** → Dialog dismisses. No change
- **Change Status filter** → List reloads with filtered results. Pagination resets to page 1
- **Change Category filter** → List reloads with filtered results. Pagination resets to page 1
- **List loads with 0 results (after filter)** → Show filtered empty state: "No events match your filters" with a clear-filters link
- **List loads with 0 events (no events at all)** → Show onboarding empty state: "No events yet" with a "Create your first event" CTA

---

## 8. States

### Event List
| State | Description |
|-------|-------------|
| Default / Empty (no events) | No events exist for this business line. Show empty state illustration with "Create your first event" CTA button |
| Empty (filtered) | Events exist but none match the current filter combination. Show "No events match your filters" with a "Clear filters" link |
| Populated | Normal list with event rows, status badges, and registration counts |
| Loading | Table skeleton with 5–8 placeholder rows matching column layout |
| Error — System | Banner at top of page: "Unable to load events. Please try again." with retry action |

### Close Event Confirmation Dialog
| State | Description |
|-------|-------------|
| Default | Modal open with warning message, event name displayed, Cancel and Confirm buttons enabled |
| Processing | Confirm button shows loading spinner. Both buttons disabled |
| Error | Inline error message in dialog: "Unable to close event. Please try again." Buttons re-enabled |

---

## 9. Navigation & Routing

- **Entry point:** Left navigation → "B2B Events" menu item under the selected Business Line
- **Exit points:** Click event row → Event Configuration (Feature 2); Click "Create Event" → Event Creation form (Feature 2)
- **Back behaviour:** This is a top-level list page. Browser back returns to the Admin home dashboard
- **Breadcrumb:** Home > B2B Events

---

## 10. Responsive Considerations (optional)

This is an admin portal screen — desktop-first. On smaller viewports:
- Table columns may need horizontal scrolling or column prioritization (hide Venue, Type on narrow screens)
- Filter bar may stack vertically on tablet widths

---

## 11. Multilingual Notes (optional)

- Event names and venue names display in the portal's current language (EN/TC/SC)
- If the name for the current language is empty, fall back to English (name_en)
- Status badge labels are portal UI labels — translated in the portal's i18n system, not stored in the event record

---

## 12. Design Reminders

- [ ] **READ Section 5.2 (Questions Before Design) FIRST** — resolve all questions with product team before starting design work
- [ ] **CHECK Section 5.1 (Component Gap Analysis)** — if any components are marked ❌ or ⚠️, discuss with design system owner before designing
- [ ] Use existing design system components — do not create new ones without checking the library first
- [ ] Use sample data from Section 4.1 in your mockups — not placeholder text
- [ ] Status badge colours must be consistent across the entire B2B Event platform — confirm the colour mapping once and reuse everywhere
- [ ] The "Close Event" action is destructive and irreversible — use appropriate destructive styling and confirmation patterns
- [ ] Registration count display is read-only in this module — it is computed from downstream module data
