# Session–Ticket Type Mapping

> Module: Module 0 — Event & Session Setup
> Persona: Organizer
> Upstream: Session Management (Feature 3) — sessions must exist; Ticket Type Configuration (Feature 4) — ticket types must exist
> Downstream: Publish & Validation (Feature 6) — admission_required sessions must have at least one mapped ticket type; Admission module — scanner checks mapping to determine entry permission

---

## 1. Feature Summary

The organizer controls which ticket types can enter which sessions. For sessions marked "Admission Required," the organizer must assign at least one ticket type before the event can be published. For "Open to All" sessions, mapping is optional (stored but not enforced at scan time). This screen is accessed via the "Access" tab within the event configuration view. The mapping uses a full-replacement pattern: each save replaces the entire mapping set for that session.

---

## 2. User Flow

1. Organizer navigates to event → clicks "Access" tab
2. System loads all sessions for this event (grouped by date) with their current ticket type assignments
3. For each session, the organizer can see: session name, access type, and which ticket types are currently assigned
4. Organizer clicks on a session (or clicks "Assign" button) → mapping panel opens showing all available ticket types as selectable items
5. Organizer selects/deselects ticket types for this session → the entire selection replaces the previous mapping
6. Organizer clicks "Save" → mapping updated. Previous assignments fully replaced
7. Sessions with access_type = "Admission Required" that have 0 ticket types assigned show a warning indicator
8. Ticket types with access_scope = "All Sessions" are shown as a special note — they don't need per-session mapping (they automatically grant access everywhere)

---

## 3. Screen Inventory

| Screen | Purpose |
|--------|---------|
| Access Mapping Overview | Shows all sessions with their current ticket type assignments. Grouped by date. Highlights unmapped admission_required sessions |
| Ticket Type Assignment Panel | Per-session panel or drawer where the organizer selects which ticket types can enter this session |

---

## 4. Layout & Composition

### Access Mapping Overview
- **Context:** Tab panel within Event Configuration. Event top bar and tab navigation persistent
- **Main content:** Sessions listed, grouped by session_date headers (reuses the date-group pattern from Feature 3). Each session row shows:
  - Session name + time + access type badge
  - List of assigned ticket types (shown as colour-coded chips/tags using each ticket type's colour_hex)
  - "Assign" or "Edit" action button
- **VIP notice:** If any ticket type has access_scope = "All Sessions", show an info banner at the top: "[Ticket Type Name] has All Sessions access — it grants entry to every session automatically"
- **Warning indicators:** Sessions with access_type = "Admission Required" and 0 assigned ticket types show a warning icon or red/orange indicator

**Visual hierarchy guidance:**
- Primary focus: session names with their assigned ticket type chips — the organizer is doing a mapping review
- Warning indicators on unmapped admission sessions should be the most attention-grabbing element
- Sub-event sessions are indented under their parents (same nesting pattern as Feature 3)

**Content density hint:**
- Simple events: 3–5 sessions, 2–3 ticket types → compact view
- Complex events: 20–50 sessions, 10+ ticket types → needs efficient scanning. Consider a matrix view for power users (see Q2)

### Ticket Type Assignment Panel
- **Right-side drawer or modal** (should match Feature 3 and Feature 4 form pattern)
- **Header:** Session name + access type badge (read-only context)
- **Body:** Checklist of all ticket types for this event. Each item shows: colour swatch, ticket type name, scope badge. Selected items are checked
- **Filter/grouping:** Group by scope: "Event Tickets" section, then "Sub-event Tickets" section
- **Footer:** Cancel and Save buttons
- **Note:** If session's access_type = "Open to All", show an info note: "This session is open to all — ticket type mapping is optional and won't be enforced at scan time"

---

## 4.1. Sample Data (for design mockups)

### Access Mapping Overview

| Session | Time | Access Type | Assigned Ticket Types |
|---------|------|-------------|----------------------|
| Opening Keynote | 09:00 – 10:30 | Open to All | — (optional, none assigned) |
| Workshop: Digital Dentistry | 11:00 – 12:30 | Admission Required | 🟢 General Admission, 🟡 VIP |
| Panel: AI in Healthcare | 14:00 – 15:30 | Admission Required | ⚠️ No ticket types assigned |
| ↳ Red Wine Masterclass (sub-event) | 14:00 – 15:30 | Admission Required | 🔴 Red Wine Masterclass Pass |

**VIP Info Banner:** "VIP (All Sessions access) grants entry to every session automatically — no per-session mapping needed"

**Data volume hints:**
- Simple mapping: 3 sessions × 2 ticket types = 6 mapping cells
- Complex mapping: 30 sessions × 10 ticket types = up to 300 mapping cells
- Most sessions will have 1–3 assigned ticket types

---

## 5. Component Checklist

### Access Mapping Overview
- [ ] Date Header / Divider — session date groups (reuse from Feature 3)
- [ ] Session Row / Card — session name + time + access type badge + assigned ticket types
- [ ] Chip / Tag (colour-coded) — each assigned ticket type rendered as a chip using the ticket type's colour_hex as the chip colour or left-border
- [ ] Badge — Access Type: "Admission Required" (info), "Open to All" (neutral) — reuse from Feature 3
- [ ] Warning Icon / Indicator — unmapped admission_required session
- [ ] Alert / Banner (info variant) — "All Sessions" access ticket type notice
- [ ] Button (secondary) — "Assign" / "Edit" per session
- [ ] Nested / Indented List Item — sub-event sessions (reuse from Feature 3)
- [ ] Loading Skeleton

### Ticket Type Assignment Panel
- [ ] Drawer or Modal — container
- [ ] Checkbox List — selectable ticket types
- [ ] Colour Swatch — per ticket type (reuse from Feature 4)
- [ ] Badge — Ticket Scope: "Event" / "Sub-event" — per item
- [ ] Section Header — "Event Tickets" / "Sub-event Tickets" grouping
- [ ] Alert / Banner (info variant) — "Open to All" note when applicable
- [ ] Button (primary) — "Save"
- [ ] Button (secondary) — "Cancel"

---

## 5.1. Component Gap Analysis

| Component Needed | Exists in Design System? | Recommendation |
|-----------------|------------------------|----------------|
| Colour-coded Chip/Tag (using dynamic hex colour) | ⚠️ Partial — Chip/Tag exists but dynamic background colour from a hex value may not be supported | **Extend:** Add a variant where the chip colour (background or left-border) is set dynamically from a hex value. This is essential for ticket type visual identity across the entire platform |
| Matrix / Grid View (for complex mapping) | ❌ No — if matrix view is chosen (see Q2) | **New component if needed.** A checkbox matrix (sessions as rows, ticket types as columns) would require a new component. Defer to Q2 decision. For MVP, the per-session assignment panel is sufficient |
| Warning indicator on list item | ✅ Yes | Use existing icon or badge with warning/error colour. Place inline with the session row |

---

## 5.2. Questions Before Design

> **Q1: For the per-session assignment panel, should the organizer see ALL ticket types (event + sub-event) or only ticket types relevant to that session's level?**
> Context: A top-level session probably shouldn't be assigned a sub-event-scoped ticket type (that ticket is meant for a specific sub-event). Showing irrelevant ticket types adds confusion. However, the FDR doesn't explicitly restrict this — it only blocks the access_scope = all_sessions + sub_event combination.
> Suggestion: Show all ticket types but group them with labels. For sub-event sessions, highlight sub-event ticket types as "recommended" and event-level tickets as "also available." Confirm with product whether cross-scope assignment should be allowed.

> **Q2: Should the mapping view be a per-session drawer (one session at a time) or a matrix view (all sessions × all ticket types in a grid)?**
> Context: Per-session drawer is simpler to design and build but slower when mapping many sessions. A matrix view lets the organizer see the full picture and toggle checkboxes quickly, but it's complex to build and doesn't scale well beyond ~15 sessions or ~8 ticket types without scrolling.
> Suggestion: Per-session drawer for MVP. Add a "matrix view" toggle for power users in a future iteration. The per-session pattern is consistent with how sessions and ticket types are already managed.

> **Q3: Should "All Sessions" ticket types appear in the assignment panel as a pre-checked, read-only item — or should they be excluded entirely with just a banner note?**
> Context: If "All Sessions" VIP ticket types appear in the checklist as always-checked and disabled, it reinforces that VIP guests can enter any session. If they're excluded, the organizer might forget VIP access exists for this session. However, including them as always-checked could be confusing ("why can't I uncheck this?").
> Suggestion: Exclude from the checklist. Show a persistent info note at the top of the panel: "[VIP] has All Sessions access and will always be admitted to this session." This keeps the checklist clean and actionable.

---

## 6. Data & Field Specification

### Access Mapping Overview — Display-Only Fields (per session row)

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Session Name | Text | From session data (name in current language, fallback EN) | Primary text |
| 2 | Time Range | Text | Derived from session start_at / end_at | "HH:MM – HH:MM" |
| 3 | Session Date | Date header | session_date | Group header (not per-row) |
| 4 | Access Type | Badge | session access_type | "Admission Required" (info/blue) or "Open to All" (neutral/grey) |
| 5 | Assigned Ticket Types | Chip list | From session–ticket type mapping junction | Colour-coded chips using each ticket type's colour_hex. Show ticket type name on chip. If no ticket types assigned → show "None assigned" in grey text. If admission_required and none assigned → show warning indicator |
| 6 | Warning: Unmapped Admission Session | Icon + text | Computed: access_type = admission_required AND no assigned ticket types AND no all_sessions ticket type exists for the event | Warning icon (orange/red). Text: "Ticket types required before publish" |
| 7 | Sub-event Indicator | Indentation + label | From session parent_session_id | Sub-events indented under parent. Show "↳" or indented card |

### Ticket Type Assignment Panel — Input Fields

| # | Field | Required | Input Type | Constraints | Default | Multilingual | Behaviour Notes |
|---|-------|----------|-----------|-------------|---------|-------------|-----------------|
| 1 | Ticket Types (multi-select) | Conditional — at least 1 required for admission_required sessions before publish | Checkbox list | Each checkbox = one ticket type. Full replacement pattern: save replaces entire mapping. Duplicate prevention: selecting the same ticket type twice is not possible (checkbox pattern) | Current mapping: previously assigned ticket types are pre-checked | No | All ticket types for this event are shown (grouped by scope). Saving with 0 selections clears all mappings for this session. For admission_required sessions, a note reminds: "At least one ticket type is required before the event can be published" |

### Ticket Type Assignment Panel — Display-Only Fields (per checkbox item)

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Ticket Type Name | Text | From ticket type data | Primary text for the checkbox label |
| 2 | Colour Swatch | Colour | From ticket type colour_hex | Small coloured circle beside the name |
| 3 | Ticket Scope | Badge | From ticket type ticket_scope | "Event" or "Sub-event" badge beside the name |
| 4 | Quota / Registered | Text | From ticket type data | Secondary text: "280 / 400 registered" — gives context on ticket type utilization |

---

## 7. Interactions & Behaviour

- **Click "Assign" / "Edit" on a session row** → Open assignment panel (drawer or modal). Pre-check currently assigned ticket types. If session is "Open to All", show info note about optional mapping
- **Check / uncheck ticket types in the panel** → Selection updates locally (not yet saved)
- **Click "Save" in the assignment panel** → System replaces the full mapping set for this session. Previous assignments are deleted and new ones inserted atomically. Panel closes. Session row in the overview updates to show new ticket type chips
- **Click "Cancel"** → Panel closes. No changes applied
- **Save with 0 ticket types for an admission_required session** → Save succeeds (mapping cleared). Session row now shows warning indicator: "Ticket types required before publish". This does NOT block save — it blocks publish (Feature 6)
- **Save with 0 ticket types for an open_to_all session** → Save succeeds. No warning — mapping is optional for open sessions
- **Ticket type with access_scope = "All Sessions" exists** → Info banner appears at the top of the mapping overview. This ticket type does NOT appear in the per-session assignment panel (see Q3). The scanner will grant access to all sessions automatically
- **Organizer adds a new ticket type in Feature 4** → When returning to the Access tab, the new ticket type appears in the assignment panel checklist for all sessions
- **Organizer deletes a ticket type in Feature 4** → Mapping entries referencing that ticket type are removed. Affected session rows update to reflect the reduced mapping

---

## 8. States

### Access Mapping Overview
| State | Description |
|-------|-------------|
| Default / Empty — no sessions | No sessions configured. Show message: "Add sessions first, then assign ticket types." Link to Sessions tab |
| Empty — sessions exist but no ticket types | Sessions shown but assignment buttons disabled. Banner: "Create ticket types first, then assign them to sessions." Link to Tickets tab |
| Populated — all mapped | All admission_required sessions have at least one ticket type. No warnings. Ready for publish |
| Populated — with warnings | One or more admission_required sessions have 0 assigned ticket types. Warning indicators shown on those sessions. Info banner may show VIP ticket type note |
| Loading | Skeleton for session rows with chip placeholders |
| Error — System | Banner: "Unable to load access mapping. Please try again." |

### Ticket Type Assignment Panel
| State | Description |
|-------|-------------|
| Default | Panel open. Checklist shown with currently assigned types pre-checked. Session name and access type shown as context |
| No ticket types available | Checklist empty. Message: "No ticket types available. Create ticket types first." Save disabled |
| Processing | Save button shows loading spinner |
| Error — System | Inline error: "Unable to save mapping. Please try again." |
| Success | Panel closes. Session row updates. Toast: "Access mapping updated" |

---

## 9. Navigation & Routing

- **Entry point:** "Access" tab within Event Configuration (Feature 2 tab navigation)
- **Exit points:** Tab navigation to other event tabs; Back arrow to Event List
- **Back behaviour:** Navigating away does not require save confirmation — mappings are saved per-session when the panel Save button is clicked

---

## 12. Design Reminders

- [ ] **READ Section 5.2 (Questions Before Design) FIRST** — especially Q2 (drawer vs matrix) which determines the entire layout approach
- [ ] **CHECK Section 5.1 (Component Gap Analysis)** — colour-coded chips are critical and may need design system extension
- [ ] Use existing design system components — do not create new ones without checking the library first
- [ ] Use sample data from Section 4.1 in your mockups — not placeholder text
- [ ] The colour-coded ticket type chips are a key visual pattern. They must use the same colours as the ticket type cards in Feature 4 and the badge colour on printed badges (Module 2). Consistency is critical
- [ ] Warning indicators on unmapped admission_required sessions are the most important visual element on this screen — they guide the organizer to fix issues before publish
- [ ] The "All Sessions" VIP ticket type is a special case. Make sure its implicit access is communicated clearly so organizers don't accidentally double-map it
- [ ] The full-replacement save pattern means the organizer's current selection completely overwrites previous mappings. The panel should pre-check existing assignments so the organizer doesn't accidentally clear them by saving an empty selection
- [ ] This feature scope ends at mapping configuration. The actual access enforcement at scan time is handled by the Admission module (Module 3)
