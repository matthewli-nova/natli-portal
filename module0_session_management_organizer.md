# Session Management

> Module: Module 0 — Event & Session Setup
> Persona: Organizer
> Upstream: Event Creation & Configuration (Feature 2) — event must exist in Draft or later status
> Downstream: Session–Ticket Type Mapping (Feature 5), Publish & Validation (Feature 6); Admission module reads session capacity and access type; Registration module displays sessions to guests

---

## 1. Feature Summary

The organizer uses this screen to build the event's agenda by creating sessions — the individual time-slots, talks, workshops, or activities that guests can attend. Sessions are grouped visually by date. The organizer also creates sub-event sessions (e.g. "Red Wine Tasting" inside Wine & Dine Festival) which sit one level deep under a parent session and can carry their own capacity, ticket types, and additional fees. This screen is accessed via the "Sessions" tab within the event configuration view.

---

## 2. User Flow

1. Organizer navigates to event → clicks "Sessions" tab
2. System loads the session list for this event, grouped by session_date
3. **If no sessions exist:** empty state with "Add Session" CTA
4. Organizer clicks "Add Session" → session form opens (modal, drawer, or inline — see Q1)
5. Organizer fills: Name (EN), Session Date, Start Time, End Time, Access Type, Capacity. Optional: Name (TC/SC), Description (EN/TC/SC), Venue/Room, Image
6. Organizer clicks "Save" → session created → appears in the list under its date group
7. If session capacity sum exceeds event quota → system shows a non-blocking warning banner
8. To add a sub-event: Organizer clicks "Add Sub-event" on a parent session → sub-event form opens with additional fields: Additional Fee, Image
9. Sub-event created → appears nested under the parent session in the list
10. Organizer can reorder sessions within a date group via sort_order (drag-and-drop or manual ordering)
11. Organizer can edit any session → form re-opens pre-populated
12. Organizer can delete a session → if admitted_count = 0 and no active sub-events: soft delete succeeds. Otherwise: blocked with reason

---

## 3. Screen Inventory

| Screen | Purpose |
|--------|---------|
| Session List (grouped by date) | Displays all sessions under this event, visually grouped by session_date. Shows sub-events nested under parent sessions |
| Session Form (Add / Edit) | Form to create or edit a top-level session |
| Sub-event Session Form (Add / Edit) | Form to create or edit a sub-event session — same base fields as session form plus Additional Fee and Image |
| Delete Session Confirmation Dialog | Confirmation modal before deleting a session |

---

## 4. Layout & Composition

### Session List
- **Context:** This is a tab panel within the Event Configuration screen. The event top bar (event name, status badge) and tab navigation are persistent from Feature 2
- **Top of tab panel:** "Sessions" section header + "Add Session" button (top-right of the panel)
- **Main content:** Sessions grouped by date. Each date group has a date header (e.g. "15 Mar 2026") followed by session cards/rows
- **Session card/row:** Session name, time range, room, access type badge, capacity, admitted count, kebab menu (Edit, Delete, Add Sub-event)
- **Sub-event nesting:** Sub-events are indented under their parent session. Visually distinct (e.g. lighter background, indentation, or a connected-line pattern)
- **Capacity warning:** If sum of session capacities > event quota, show a non-blocking warning banner at the top of the session list

**Visual hierarchy guidance:**
- Primary focus: session names grouped by date headers — the organizer is building an agenda
- Secondary: time range and access type per session
- Sub-events should be clearly subordinate to their parent but still individually actionable
- The "Add Session" button should be prominent. "Add Sub-event" should be contextual (per parent session)

**Content density hint:**
- Small events (OASES): 1 session
- Medium events (RTIA): 5–15 sessions across 2–3 days
- Large events (Wine & Dine): 30–50+ sessions across 3–5 days, with 10+ sub-events

### Session Form (Add / Edit)
- **Modal or right-side drawer** (see Q1). Contains form fields in a single column
- **Field groupings:**
  1. **Basic Info:** Name (EN/TC/SC), Description (EN/TC/SC)
  2. **Schedule:** Session Date, Start Time, End Time
  3. **Location:** Venue/Room
  4. **Access:** Access Type dropdown, Capacity input
  5. **Media (sub-event only):** Image upload
  6. **Pricing (sub-event only):** Additional Fee
- **Footer:** Cancel and Save buttons

### Sub-event Session Form
- Same layout as Session Form but with two additional sections visible: Image Upload and Additional Fee
- The parent session name is displayed as read-only context at the top of the form

---

## 4.1. Sample Data (for design mockups)

### Session List

**Date Group: 20 Mar 2026**

| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Session Name | Opening Keynote | 開幕主題演講 | 开幕主题演讲 |
| Time | 09:00 – 10:30 | 09:00 – 10:30 | 09:00 – 10:30 |
| Room | Hall 1 | 1號展廳 | 1号展厅 |
| Access Type | Open to All | 自由進出 | 自由进出 |
| Capacity | 500 | 500 | 500 |
| Admitted | 0 | 0 | 0 |

| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Session Name | Workshop: Digital Dentistry | 工作坊：數位牙科 | 工作坊：数字牙科 |
| Time | 11:00 – 12:30 | 11:00 – 12:30 | 11:00 – 12:30 |
| Room | Room 201 | 201室 | 201室 |
| Access Type | Admission Required | 需要入場券 | 需要入场券 |
| Capacity | 80 | 80 | 80 |
| Admitted | 0 | 0 | 0 |

**Sub-event under "Wine Tasting Pavilion":**

| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Sub-event Name | Red Wine Masterclass | 紅酒大師班 | 红酒大师班 |
| Time | 14:00 – 15:30 | 14:00 – 15:30 | 14:00 – 15:30 |
| Access Type | Admission Required | 需要入場券 | 需要入场券 |
| Capacity | 30 | 30 | 30 |
| Additional Fee | HKD 200.00 | HKD 200.00 | HKD 200.00 |
| Image | [Wine tasting promo image thumbnail] | — | — |

**Data volume hints:**
- Small event: 1 session, 0 sub-events
- Medium event: 5–15 sessions across 2–3 dates
- Large event: 30–50+ sessions across 5 dates, 10–20 sub-events
- Session names: typically 15–60 characters
- Descriptions: typically 50–500 characters, max 5000
- Room names: typically 5–30 characters

---

## 5. Component Checklist

### Session List
- [ ] Date Header / Divider — section header for each date group
- [ ] Card or List Item — session row displaying name, time, room, badges, capacity
- [ ] Badge — Access Type: "Admission Required" (info variant) and "Open to All" (neutral variant)
- [ ] Badge — capacity count (admitted / total)
- [ ] Nested / Indented List Item — sub-event sessions visually subordinate
- [ ] Button (primary) — "Add Session"
- [ ] Button (secondary / contextual) — "Add Sub-event" (per parent session)
- [ ] Icon Button / Kebab Menu — per session quick actions (Edit, Delete, Add Sub-event)
- [ ] Alert / Banner (warning variant) — capacity exceeds event quota warning
- [ ] Empty State — no sessions yet
- [ ] Loading Skeleton — session card placeholders

### Session Form
- [ ] Modal or Drawer — container for the form
- [ ] Text Input — Name (EN/TC/SC), Venue/Room
- [ ] Textarea — Description (EN/TC/SC) with character counter (5000 max)
- [ ] Date Picker — Session Date (single date, must be within event date range)
- [ ] Time Picker — Start Time, End Time
- [ ] Dropdown / Select — Access Type (2 options)
- [ ] Number Input — Capacity (integer, min 1)
- [ ] Number Input — Additional Fee (decimal, 2 decimal places, min 0) — sub-event only
- [ ] File Upload — Image (sub-event only) with preview
- [ ] Language Tab Group — for multilingual fields
- [ ] Button (primary) — "Save"
- [ ] Button (secondary) — "Cancel"

### Delete Session Confirmation Dialog
- [ ] Dialog / Modal — confirmation with session name displayed
- [ ] Button (destructive) — "Delete Session"
- [ ] Button (secondary) — "Cancel"

---

## 5.1. Component Gap Analysis

| Component Needed | Exists in Design System? | Recommendation |
|-----------------|------------------------|----------------|
| Date-grouped list with headers | ⚠️ Partial — list component exists but date-group header pattern may not | **Extend:** Add a section header variant to the list component that acts as a date divider (e.g. sticky date header when scrolling) |
| Nested/indented sub-item in list | ⚠️ Partial — list items exist but no established nesting/indentation pattern | **Extend:** Define a left-indent (e.g. 24–32px) with a subtle connecting line or background shade for sub-events. Document as a reusable pattern |
| Time Picker (separate from Date) | ⚠️ Partial — Date picker exists but standalone time picker may not | **Extend:** Add a time-only picker (hour:minute) or confirm if the DateTime picker from Feature 2 can be split into Date + Time components |
| Capacity Warning Banner | ✅ Yes | Use existing Alert (warning variant) — non-blocking |
| Session card with multiple data points | ⚠️ Partial — Card exists but may need a specific layout for session data (name, time, room, badge, capacity) | **Compose:** Combine existing Card + Badge + text primitives. Define the layout once and reuse for all sessions |

---

## 5.2. Questions Before Design

> **Q1: Should the session form open as a modal, a right-side drawer, or an inline expandable section within the list?**
> Context: Modals are simple but disconnect the organizer from the session list context. Drawers keep the list visible. Inline expansion keeps context but can be jarring with many sessions. With 30–50+ sessions in large events, the pattern choice significantly affects usability.
> Suggestion: Right-side drawer — keeps the session list visible so the organizer can see the agenda while adding/editing.

> **Q2: Should session reordering (sort_order) be supported via drag-and-drop, or via manual number input, or not exposed at all for MVP?**
> Context: The data model has a sort_order field. Drag-and-drop is intuitive but complex to build. Manual number input is simpler but less user-friendly. Not exposing it means sessions just sort by start_at, which may be sufficient for MVP.
> Suggestion: For MVP, auto-sort by session_date + start_at. Defer drag-and-drop to a later version.

> **Q3: How should the capacity warning ("sum of session capacities exceeds event quota") be displayed — and should it show the numbers?**
> Context: The FDR says "Yellow warning banner shown. Save NOT blocked." The designer needs to know: is this a persistent banner or a one-time toast? Does it show the exact numbers (e.g. "Session total: 650 / Event quota: 500")?
> Suggestion: Persistent warning banner (Alert — warning variant) at the top of the session list. Shows: "Total session capacity (650) exceeds event quota (500). This won't block saving, but you may want to review." Appears/disappears dynamically as sessions are added/removed.

> **Q4: For sub-event sessions, should the Additional Fee show a currency symbol? If so, which currency?**
> Context: The FDR stores additional_fee as a decimal but doesn't specify which currency. B2B events span HKD, MYR, and potentially other currencies. The designer needs to know whether to show a currency prefix and where the currency is determined.
> Suggestion: Show a currency prefix based on the event's region or a global setting. For MVP, hardcode "HKD" and revisit for multi-currency. Confirm with product.

---

## 6. Data & Field Specification

### Session Form — Input Fields (top-level session)

| # | Field | Required | Input Type | Constraints | Default | Multilingual | Behaviour Notes |
|---|-------|----------|-----------|-------------|---------|-------------|-----------------|
| 1 | Session Name (EN) | Yes | Text Input | Max 200 characters | None | Yes (EN required, TC/SC optional) | Required. Inline validation on save |
| 2 | Session Name (TC) | No | Text Input | Max 200 characters | None | Yes — Traditional Chinese | Optional |
| 3 | Session Name (SC) | No | Text Input | Max 200 characters | None | Yes — Simplified Chinese | Optional |
| 4 | Description (EN) | No | Textarea | Max 5000 characters | None | Yes (all optional) | Character counter. Displayed on registration form and event catalogue |
| 5 | Description (TC) | No | Textarea | Max 5000 characters | None | Yes — Traditional Chinese | Character counter |
| 6 | Description (SC) | No | Textarea | Max 5000 characters | None | Yes — Simplified Chinese | Character counter |
| 7 | Session Date | Yes | Date Picker | Must fall within event start_at to end_at date range | None | No | Calendar picker constrained to event date range. Dates outside the range are disabled/greyed out. Inline error: "Session date must be within the event dates ([start] – [end])" |
| 8 | Start Time | Yes | Time Picker | Must be on the session_date. start_at must be < end_at | None | No | Combined with Session Date to form the full start_at timestamp |
| 9 | End Time | Yes | Time Picker | Must be > Start Time | None | No | Inline validation: "End time must be after start time" |
| 10 | Venue / Room | No | Text Input | Max 100 characters | None | No | Optional. e.g. "Hall 1", "Room 201" |
| 11 | Access Type | Yes | Dropdown (single-select) | Must be one of 2 values | None — no default | No | Options: "Admission Required", "Open to All". If "Admission Required" is selected, the organizer must assign at least one ticket type before the event can be published (enforced in Feature 6) |
| 12 | Capacity | Yes | Number Input | Integer. Must be > 0 | None | No | Inline validation: "Capacity must be greater than 0". If sum of all session capacities > event quota, show non-blocking warning (not on this field — on the session list) |

### Sub-event Session Form — Additional Input Fields (in addition to #1–#12 above)

| # | Field | Required | Input Type | Constraints | Default | Multilingual | Behaviour Notes |
|---|-------|----------|-----------|-------------|---------|-------------|-----------------|
| 13 | Additional Fee | No | Number Input (decimal) | Decimal with 2 decimal places (NUMERIC 10,2). Min 0. Only valid on sub-event sessions | None — NULL = included in parent ticket (no extra cost) | No | Only visible on sub-event session form. Not shown for top-level sessions. NULL means free / included. Show helper text: "Leave empty if included in the parent ticket price" |
| 14 | Image | No | File Upload | Image file (confirm formats with engineering). S3 URL stored | None | No | Promotional image for the sub-event. Upload preview as thumbnail. Used on registration form and event catalogue |

### Session List — Display-Only Fields (per session row)

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Session Name | Text | User input (name in current portal language, fallback to EN) | Primary text. Bold or medium weight |
| 2 | Time Range | Text | Derived from start_at and end_at | Format: "HH:MM – HH:MM" (e.g. "09:00 – 10:30") |
| 3 | Session Date | Date header | User input (session_date) | Displayed as a group header, not per-row. Format: "DD MMM YYYY" |
| 4 | Venue / Room | Text | User input (venue_room) | Secondary text. Show "—" or hide if empty |
| 5 | Access Type | Badge | User input | Badge: "Admission Required" (info/blue variant) or "Open to All" (neutral/grey variant) |
| 6 | Capacity | Number | User input | Integer. Right-aligned or in a compact format |
| 7 | Admitted Count | Number | System computed (materialized counter, read-only in this module) | Show as "X / [Capacity]" or just "0" for new sessions. Read-only — updated by Admission module |
| 8 | Sub-event Count | Number | System computed (count of active sub-events under this session) | Small count badge on parent sessions only. e.g. "3 sub-events". Hidden if 0 |
| 9 | Additional Fee (sub-events only) | Currency amount | User input | Displayed on sub-event rows only. Format: "[Currency] [Amount]" e.g. "HKD 200.00". Hidden for top-level sessions and when NULL |
| 10 | Image thumbnail (sub-events only) | Image | User input (image_url) | Small thumbnail on sub-event rows. Hidden for top-level sessions and when no image |

### Session List — Computed Fields

| # | Field | Derivation | Visual Treatment |
|---|-------|-----------|-----------------|
| 1 | Capacity Warning Flag | Sum of all session capacities > event quota | Triggers the warning banner at the top of the session list. Not a per-row field |
| 2 | Assigned Ticket Types (per session) | From session–ticket type access mapping (Feature 5) | Small count or chip list showing how many ticket types are assigned. Useful for organizer to see which sessions still need mapping. Show "No ticket types assigned" in orange/warning for admission_required sessions |

---

## 7. Interactions & Behaviour

- **Click "Add Session"** → Open session form (empty). Session Date picker constrained to event date range
- **Click "Add Sub-event" on a parent session** → Open sub-event form. Parent session name shown as read-only context. Additional Fee and Image fields visible. Depth automatically set to 1 (not visible to organizer)
- **Click kebab menu → "Edit" on a session** → Open session form pre-populated with existing data
- **Click kebab menu → "Delete" on a session** → Show Delete Confirmation Dialog. If session has admitted_count > 0 → delete blocked. Show reason: "Cannot delete — [X] attendees have been admitted." If session has active sub-events → delete blocked. Show reason: "Remove all sub-event sessions before deleting." If both conditions are clear → proceed with soft delete
- **Save session where session_date is outside event range** → Inline error on Session Date: "Session date must be within [event start] – [event end]"
- **Save session where start time > end time** → Inline error on End Time: "End time must be after start time"
- **Save session where capacity = 0** → Inline error on Capacity: "Capacity must be greater than 0"
- **Save top-level session with additional_fee set** → Error: "Additional fee is only valid on sub-event sessions"
- **After saving a session that pushes total capacity over event quota** → Non-blocking warning banner appears/updates at the top of the session list. Session is still saved successfully
- **After deleting a session that was pushing over quota** → Warning banner recalculates and may disappear
- **Sub-event creation attempted on a session that is already depth=1** → Error: "Maximum nesting depth exceeded. Sub-sub-events are not supported"

---

## 8. States

### Session List
| State | Description |
|-------|-------------|
| Default / Empty | No sessions exist for this event. Show empty state: "No sessions yet. Add your first session to start building the agenda." with "Add Session" CTA |
| Populated | Sessions grouped by date headers. Each session shows name, time, room, access type badge, capacity. Sub-events indented under parents |
| Populated with warning | Same as Populated, plus a warning banner at the top: "Total session capacity exceeds event quota" |
| Loading | Skeleton placeholders for 3–5 session cards grouped under 1–2 date headers |
| Error — System | Banner: "Unable to load sessions. Please try again." |

### Session Form (Add)
| State | Description |
|-------|-------------|
| Default / Empty | Blank form. Required fields marked. Session Date picker constrained to event date range |
| Error — Validation | Inline errors on invalid fields. Save button remains enabled for retry |
| Error — System | Inline error or toast: "Unable to save session. Please try again." |
| Success | Form closes. Session appears in the list. Success toast: "Session added" |

### Session Form (Edit)
| State | Description |
|-------|-------------|
| Populated | Form pre-populated with existing session data |
| Error — Validation | Same as Add |
| Error — System | Same as Add |
| Success | Form closes. Session updates in the list. Success toast: "Session updated" |

### Delete Session Confirmation Dialog
| State | Description |
|-------|-------------|
| Default | Modal open with session name. "Delete" and "Cancel" buttons enabled |
| Blocked — has admissions | "Cannot delete" message with reason: "[X] attendees have been admitted to this session." Delete button disabled or hidden. Only Cancel available |
| Blocked — has sub-events | "Cannot delete" message with reason: "Remove all sub-event sessions before deleting this session." Delete button disabled or hidden |
| Processing | Delete button shows loading spinner. Both buttons disabled |
| Error | Inline error: "Unable to delete session. Please try again." Buttons re-enabled |

---

## 9. Navigation & Routing

- **Entry point:** "Sessions" tab within Event Configuration (Feature 2 tab navigation)
- **Exit points:** Tab navigation to other event tabs (Details, Tickets, Access, Review & Publish); Back arrow returns to Event List
- **Back behaviour:** Navigating away from the Sessions tab does not require save confirmation — sessions are saved individually via the form

---

## 11. Multilingual Notes

- Session Name and Description support EN / TC / SC. EN required for Name; all optional for Description
- Use the same multilingual input pattern established in Feature 2 (see Feature 2, Q1)
- Venue/Room is a single-language field (no multilingual variants)

---

## 12. Design Reminders

- [ ] **READ Section 5.2 (Questions Before Design) FIRST** — resolve Q1 (modal vs drawer vs inline) before starting — it fundamentally changes the layout
- [ ] **CHECK Section 5.1 (Component Gap Analysis)** — nested list items and time picker need design system decisions
- [ ] Use existing design system components — do not create new ones without checking the library first
- [ ] Use sample data from Section 4.1 in your mockups — not placeholder text
- [ ] The date-grouped layout is a key design decision — it must handle 1 session (OASES) and 50+ sessions (Wine & Dine) gracefully
- [ ] Sub-event nesting must be visually clear but not create excessive indentation — only 1 level of nesting is supported
- [ ] The capacity warning banner is non-blocking — make sure it's noticeable but not alarming. The organizer may intentionally overbook sessions
- [ ] Delete blocking reasons should be human-readable and specific — not generic "cannot delete" messages
- [ ] Access Type badge styling must be consistent with how it appears in Feature 5 (ticket mapping) and Feature 6 (publish validation)
