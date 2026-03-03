# Publish & Validation

> Module: Module 0 — Event & Session Setup
> Persona: Organizer
> Upstream: Event Creation & Configuration (Feature 2), Session Management (Feature 3), Ticket Type Configuration (Feature 4), Session–Ticket Type Mapping (Feature 5) — all must be configured before publish succeeds
> Downstream: Registration & RSVP (Module 1) — registration form URL becomes active on publish; all downstream modules become operational

---

## 1. Feature Summary

The organizer reviews the full event configuration and publishes the event to make it live for registration. Publishing triggers 10 validation rules atomically — all must pass. If any fail, the organizer sees a clear error summary identifying exactly what needs to be fixed. On success, the event transitions from Draft to Published and the registration form URL becomes active. This screen is accessed via the "Review & Publish" tab within the event configuration view.

---

## 2. User Flow

1. Organizer navigates to event → clicks "Review & Publish" tab
2. System loads a read-only summary of the entire event configuration: event details, sessions, ticket types, and access mapping
3. Organizer reviews the summary for completeness
4. **If configuration is incomplete:** system may surface pre-publish warnings (inline indicators on sections that have issues)
5. Organizer clicks "Publish Event" button
6. System runs all 10 validation rules atomically
7. **If all pass:** status transitions to Published. Success state shown with registration form URL. Organizer can copy the URL
8. **If any fail:** error summary displayed as a list of all failed validations with specific messages. Organizer must fix issues (by navigating to the relevant tabs) and retry
9. **If event is already Published:** the Publish button is replaced with status information and post-publish actions (Close Event)

---

## 3. Screen Inventory

| Screen | Purpose |
|--------|---------|
| Review Summary | Read-only overview of the full event configuration organised by section (details, sessions, ticket types, access mapping) |
| Publish Error Summary | Error list shown after failed publish attempt, identifying all validation failures |
| Publish Success State | Confirmation state with registration form URL and next steps |

---

## 4. Layout & Composition

### Review Summary
- **Context:** Tab panel within Event Configuration. Event top bar and tab navigation persistent
- **Top of tab panel:** "Review & Publish" section header + "Publish Event" primary action button (top-right, prominent)
- **Main content:** Read-only summary cards/sections, one per configuration area:
  1. **Event Details** — name, category, type, dates, venue, address, quota, RSVP deadline, branding preview
  2. **Sessions** — count of sessions, grouped by date, each showing name + time + access type + capacity
  3. **Ticket Types** — list of ticket types with colour, scope, quota
  4. **Access Mapping** — summary of which sessions have ticket types assigned. Warning indicators on unmapped admission_required sessions
- **Pre-publish indicators:** Each section shows a ✅ (complete) or ⚠️ (issues found) indicator. The organizer can click a section to navigate to the relevant tab to fix issues

**Visual hierarchy guidance:**
- Primary focus: the "Publish Event" button — this is the culmination of the entire Module 0 workflow
- Secondary: section completion indicators — the organizer is scanning for readiness
- The error summary (when shown) should be the most prominent element, replacing or overlaying the review content

### Publish Error Summary
- Appears after a failed publish attempt
- **Prominent error banner** at the top with count: "X validation errors — fix these before publishing"
- **Error list** below the banner: each error as a row with the validation rule's error message and a link/button to navigate to the relevant section
- Errors are not dismissible — they remain until the organizer fixes the issues and retries

### Publish Success State
- Replaces the Review Summary content (or overlays it) after successful publish
- **Success banner** with confirmation: "Event published successfully!"
- **Registration Form URL** displayed prominently with a "Copy Link" button
- **Next steps** guidance: "Guests can now register. Monitor registrations from the Event List."
- The "Publish Event" button is replaced with a "Published" status indicator

---

## 4.1. Sample Data (for design mockups)

### Review Summary — Event Details Section

| Field | Example Value |
|-------|--------------|
| Event Name | HKIDEAS 2026 — International Dental Exhibition |
| Category | Exhibition |
| Type | Expo |
| Dates | 20 Mar 2026, 09:00 – 22 Mar 2026, 18:00 |
| Venue | HKCEC, Wan Chai |
| Address | 1 Expo Drive, Wan Chai, Hong Kong |
| Quota | 600 |
| RSVP Deadline | 15 Mar 2026, 23:59 |
| Logo | [Thumbnail preview] |
| Banner | [Thumbnail preview] |
| Primary Colour | #1A5276 [swatch] |

### Review Summary — Sessions Section

| Session | Date | Time | Access Type | Capacity |
|---------|------|------|-------------|----------|
| Opening Keynote | 20 Mar | 09:00–10:30 | Open to All | 500 |
| Workshop: Digital Dentistry | 20 Mar | 11:00–12:30 | Admission Required ✅ | 80 |
| Panel: AI in Healthcare | 21 Mar | 14:00–15:30 | Admission Required ⚠️ | 100 |

### Publish Error Summary

| # | Error Message | Section |
|---|---------------|---------|
| 1 | Session "Panel: AI in Healthcare" requires at least one permitted ticket type | → Access tab |
| 2 | RSVP deadline must be before the event end date and in the future | → Details tab |

### Publish Success

| Field | Example Value |
|-------|--------------|
| Registration URL | https://events.lepos.co/hkideas-2026/register |

**Data volume hints:**
- Validation errors: typically 0–3 per publish attempt. Worst case: all 10 rules fail
- Summary sections show condensed data — not full forms

---

## 5. Component Checklist

### Review Summary
- [ ] Section Card / Panel — read-only summary card for each configuration area
- [ ] Completion Indicator — ✅ / ⚠️ per section
- [ ] Summary Table (compact) — sessions and ticket types in condensed format
- [ ] Colour Swatch — for ticket type colour and branding primary colour
- [ ] Image Thumbnail — for logo and banner preview
- [ ] Badge — status badges (access type, ticket scope) reused from Features 3–5
- [ ] Button (primary, prominent) — "Publish Event"
- [ ] Loading Skeleton — section card placeholders

### Publish Error Summary
- [ ] Alert / Banner (error variant) — top-level error count banner
- [ ] Error List — each error as a row with message + link to relevant tab
- [ ] Button / Link — per-error navigation to the relevant configuration tab

### Publish Success State
- [ ] Alert / Banner (success variant) — "Event published" confirmation
- [ ] Text Display (monospace or highlighted) — registration form URL
- [ ] Button (secondary) — "Copy Link"
- [ ] Icon — link/external icon for the registration URL

---

## 5.1. Component Gap Analysis

| Component Needed | Exists in Design System? | Recommendation |
|-----------------|------------------------|----------------|
| Section Completion Indicator (✅ / ⚠️) | ⚠️ Partial — Icon exists but an inline section-level completion indicator may not be a documented pattern | **Compose:** Use existing icon (checkmark-circle for ✅, warning-triangle for ⚠️) placed in the section card header. Define colour tokens: green for complete, orange for warning |
| Error List with navigation links | ⚠️ Partial — Alert exists but a list of errors with per-error navigation links may need a specific layout | **Compose:** Use Alert (error variant) for the top banner. Below it, a simple list where each item has the error message text + a "Go to [Section]" link button. No new component needed — just a documented pattern |
| Registration URL Display with Copy | ⚠️ Partial — Text input (read-only) exists but a styled URL display with copy-to-clipboard button may need a variant | **Compose:** Read-only text input (or code block) + icon button with copy-to-clipboard. Show toast "Link copied" on click. Common pattern — should exist or be easy to compose |

---

## 5.2. Questions Before Design

> **Q1: Should the Review Summary show a live validation check (real-time indicators) or only validate when the organizer clicks "Publish"?**
> Context: Real-time indicators (✅ / ⚠️ per section as the organizer navigates to the Review tab) help the organizer identify issues before clicking Publish. But it requires running validation logic on page load, which may be slower. If validation only runs on publish click, the organizer doesn't know about issues until they try.
> Suggestion: Run a lightweight validation check on Review tab load — show ✅ / ⚠️ indicators per section. The full atomic validation still runs on Publish click. This gives the organizer a heads-up before they commit.

> **Q2: After a successful publish, should the Review tab transform into a post-publish dashboard, or should the organizer be redirected to the Event List?**
> Context: After publishing, the organizer may want to immediately copy the registration URL, or they may want to go back to the Event List to see the updated status. The FDR mentions "Post-Publish Management" happens on the Event Dashboard.
> Suggestion: Show the success state on the Review tab with the registration URL and a "Back to Event List" button. Don't auto-redirect — let the organizer choose.

> **Q3: Should the error summary show ALL 10 validation results (pass/fail) or only the failed ones?**
> Context: Showing all 10 with pass/fail gives the organizer a complete picture and confidence that passing rules are satisfied. Showing only failures is cleaner and more actionable. For 2–3 errors, showing all 10 may be noise. For 8+ errors, showing only failures is more manageable.
> Suggestion: Show only failed validations. Prepend with a count: "3 of 10 checks failed." The passing checks are implicit in the review summary above.

> **Q4: Should the "Publish Event" button be disabled when pre-publish indicators show ⚠️ warnings, or always enabled (letting the server-side validation be the gatekeeper)?**
> Context: Disabling the button prevents wasted publish attempts but may frustrate organizers who think they've fixed the issue but the UI hasn't refreshed. Always-enabled is simpler — the server validation is authoritative.
> Suggestion: Always-enabled. The server-side 10-rule validation is the single source of truth. The pre-publish indicators are advisory only.

---

## 6. Data & Field Specification

### Review Summary — Display-Only Fields

#### Event Details Section

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Event Name | Text | User input (name in current language) | Bold heading. Show all available languages if multiple are set |
| 2 | Event Category | Text | User input | Plain text label |
| 3 | Event Type | Text | User input | Plain text. Show "Not set" in grey if NULL |
| 4 | Start Date & Time | DateTime | User input (start_at) | "DD MMM YYYY, HH:MM" |
| 5 | End Date & Time | DateTime | User input (end_at) | "DD MMM YYYY, HH:MM" |
| 6 | RSVP Deadline | DateTime | User input | "DD MMM YYYY, HH:MM" or "Not set" in grey |
| 7 | Venue | Text | User input (venue in current language) | Plain text |
| 8 | Address | Text | User input (address in current language) | Plain text. "Not set" if empty |
| 9 | Quota | Number | User input | Integer |
| 10 | Logo | Image thumbnail | User input (logo_url) | Small thumbnail or "Lepōs default" label if not set |
| 11 | Banner | Image thumbnail | User input (banner_url) | Small thumbnail or "Lepōs default" label if not set |
| 12 | Primary Colour | Colour swatch | User input (primary_colour) | Swatch + hex code. "Lepōs teal (#00B5AD)" if not set |

#### Sessions Section (compact summary)

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Total Session Count | Number | Computed | "X sessions across Y dates" |
| 2 | Per-session row: Name | Text | Session name | Compact text |
| 3 | Per-session row: Date | Date | session_date | Grouped by date |
| 4 | Per-session row: Time | Text | start_at – end_at | "HH:MM – HH:MM" |
| 5 | Per-session row: Access Type | Badge | access_type | Reuse badge from Feature 3 |
| 6 | Per-session row: Capacity | Number | capacity | Integer |
| 7 | Per-session row: Assigned Ticket Types | Count or chip list | From mapping | "3 ticket types" or colour-coded chips |
| 8 | Completion indicator | Icon | Computed: all admission_required sessions have ≥1 ticket type (or all_sessions ticket exists) | ✅ all mapped, ⚠️ unmapped sessions exist |

#### Ticket Types Section (compact summary)

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Total Ticket Type Count | Number | Computed | "X ticket types" |
| 2 | Per-type row: Name | Text | Ticket type name | With colour swatch |
| 3 | Per-type row: Colour Swatch | Colour | colour_hex | Small circle |
| 4 | Per-type row: Scope | Badge | ticket_scope | "Event" / "Sub-event" |
| 5 | Per-type row: Access Scope | Badge | access_scope | "All Sessions" / "Custom" |
| 6 | Per-type row: Quota | Number | quota | Integer |
| 7 | Completion indicator | Icon | Computed: at least 1 ticket type exists, all quotas > 0 | ✅ / ⚠️ |

### Publish Error Summary — Display-Only Fields

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Error Count | Text | Computed from validation result | "X validation errors" in error banner |
| 2 | Error Message | Text | From validation rule error messages (see list below) | One row per failed rule. Human-readable text |
| 3 | Navigation Link | Link / Button | Mapped to relevant tab | "Go to Details" / "Go to Sessions" / "Go to Tickets" / "Go to Access" per error |

#### All 10 Validation Rules and Their Error Messages

| Rule # | Validation | Error Message | Links to Tab |
|--------|-----------|---------------|-------------|
| 1 | Event name (at least one language) is not empty | "Event name is required." | Details |
| 2 | start_at and end_at are set and start_at ≤ end_at | "Event dates are invalid or missing." | Details |
| 3 | start_at is in the future | "Event start date must be a future date." | Details |
| 4 | Venue name (at least one language) is not empty | "Venue name is required." | Details |
| 5 | quota > 0 | "Event quota must be greater than 0." | Details |
| 6 | At least one active session exists | "At least one session must be configured." | Sessions |
| 7 | All admission_required sessions have at least one permitted ticket type (via junction mapping OR via an all_sessions event-level ticket type) | "Session [name] requires at least one permitted ticket type." | Access |
| 8 | At least one active ticket type exists | "At least one ticket type must be defined." | Tickets |
| 9 | All active ticket type quotas are > 0 | "Ticket type [name] must have a quota greater than 0." | Tickets |
| 10 | If rsvp_deadline is set: rsvp_deadline < end_at AND rsvp_deadline > NOW() | "RSVP deadline must be before the event end date and in the future." | Details |

### Publish Success — Display-Only Fields

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Success Message | Text | Static | "Event published successfully!" in success banner |
| 2 | Registration Form URL | URL (text) | System-generated on publish | Displayed in a highlighted/monospace text block. "Copy Link" button beside it |
| 3 | Event Status | Badge | System state | "Published" badge (info/blue) — shown in the top bar, replacing the "Draft" badge |

---

## 7. Interactions & Behaviour

- **Load Review tab** → System runs lightweight validation check. Populate ✅ / ⚠️ indicators per section. "Publish Event" button enabled regardless
- **Click a section with ⚠️** → Navigate to the relevant tab (Details, Sessions, Tickets, or Access) so the organizer can fix the issue
- **Click "Publish Event"** → Button shows loading state. System runs all 10 validation rules atomically
- **Publish succeeds** → Event status changes to Published. Success banner appears with registration URL. "Publish Event" button replaced by "Published" status. Toast: "Event published!"
- **Publish fails** → Error summary appears below the publish button (or replaces the review summary). Each error shows the message and a link to the relevant tab. Button re-enables for retry after fixes
- **Click "Copy Link" on registration URL** → URL copied to clipboard. Toast: "Link copied to clipboard"
- **Click "Go to [Tab]" on an error row** → Navigate to the specified tab. Organizer fixes the issue and returns to Review tab to retry
- **Organizer returns to Review tab after fixing issues** → Validation indicators refresh. Fixed sections show ✅. Organizer clicks "Publish" again
- **Publish on already-published event** → Idempotent. Success with no state change. No error
- **Event is Published or Live or Closed** → "Publish Event" button hidden. Show current status badge and relevant post-publish information (registration URL for Published/Live, "Event closed" for Closed)

---

## 8. States

### Review Summary
| State | Description |
|-------|-------------|
| Loading | Skeleton placeholders for 4 section cards |
| Draft — all sections complete | All sections show ✅. "Publish Event" button prominent and enabled. Review summary shows full configuration |
| Draft — sections have warnings | One or more sections show ⚠️. "Publish Event" button still enabled. Warning sections are clickable to navigate to the relevant tab |
| Post-Publish — Published | "Publish Event" button replaced by "Published ✅" status. Registration URL displayed. Review summary is read-only |
| Post-Publish — Live | Same as Published but status badge shows "Live". Registration URL still active |
| Post-Publish — Closed | Status badge shows "Closed". Registration URL marked as inactive. Info banner: "This event is closed. No further registrations accepted." |
| Error — System | Banner: "Unable to load review summary. Please try again." |

### Publish Error Summary
| State | Description |
|-------|-------------|
| Visible — validation failed | Error banner + error list displayed after failed publish attempt. Each error has a message and navigation link. "Publish Event" button re-enabled for retry |

### Publish Action
| State | Description |
|-------|-------------|
| Default | "Publish Event" button enabled, primary styling |
| Processing | Button shows loading spinner. Text changes to "Publishing..." Disabled during processing |
| Success | Replaced by "Published ✅" indicator or success state |
| Error (system) | Toast: "Unable to publish. Please try again." Button re-enabled |

---

## 9. Navigation & Routing

- **Entry point:** "Review & Publish" tab within Event Configuration (Feature 2 tab navigation)
- **Exit points:** Error navigation links → other event tabs (Details, Sessions, Tickets, Access); "Back to Event List" button after publish success; Back arrow to Event List
- **Back behaviour:** Browser back from Review tab returns to Event List (or previous tab, depending on navigation history)

---

## 12. Design Reminders

- [ ] **READ Section 5.2 (Questions Before Design) FIRST** — especially Q1 (real-time indicators vs on-publish-only) which affects the entire tab design
- [ ] **CHECK Section 5.1 (Component Gap Analysis)** — section completion indicators and error list with navigation are key patterns
- [ ] Use existing design system components — do not create new ones without checking the library first
- [ ] Use sample data from Section 4.1 in your mockups — not placeholder text
- [ ] The "Publish Event" button is the most important action in all of Module 0. It should be visually prominent and feel like a milestone action (not a casual save)
- [ ] Error messages must be specific and human-readable. Rule 7 names the specific session. Rule 9 names the specific ticket type. The designer should account for variable-length error messages
- [ ] The registration form URL is the primary deliverable of the entire Module 0 workflow. Make it prominent and easy to copy after publish
- [ ] Post-publish states (Published, Live, Closed) need distinct visual treatments on this tab — the organizer may return to this screen at any point in the event lifecycle
- [ ] Excluded from this design: Open Questions #1 (event2_id wallet linkage), #4 (max sessions per event), #6 (token reference_type), #7 (taxonomy final sign-off). These are pending product/engineering decisions and should NOT be designed for until resolved
