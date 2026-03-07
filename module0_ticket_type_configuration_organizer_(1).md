# Ticket Type Configuration

> Module: Module 0 — Event & Session Setup
> Persona: Organizer
> Upstream: Event Creation & Configuration (Feature 2) — event must exist; Session Management (Feature 3) — sessions should exist before mapping ticket types
> Downstream: Session–Ticket Type Mapping (Feature 5) — ticket types are mapped to sessions; Publish & Validation (Feature 6) — at least one ticket type required for publish; Registration module (Module 1) — ticket types drive the registration form; Badge Print module — colour_hex used for badge colour-coding

---

## 1. Feature Summary

The organizer defines the ticket types that guests will select when registering for the event. Ticket types come in two scopes: event-level (general admission) and sub-event-level (access to a specific sub-event, requiring a parent event ticket). Each ticket type has a name, colour (for badge printing), quota, and optionally a description. The organizer also controls access scope — whether the ticket grants access to custom-mapped sessions or to all sessions (VIP shortcut). This screen is accessed via the "Tickets" tab within the event configuration view.

---

## 2. User Flow

1. Organizer navigates to event → clicks "Tickets" tab
2. System loads the ticket type list for this event
3. **If no ticket types exist:** empty state with "Add Ticket Type" CTA
4. Organizer clicks "Add Ticket Type" → ticket type form opens
5. Organizer fills: Name (EN), Colour, Quota, Ticket Scope (event / sub_event). Optional: Name (TC/SC), Description (EN/TC/SC), Access Scope, Max Bring-Along Default
6. If Ticket Scope = "sub_event" → Parent Ticket Type dropdown appears (required). Access Scope locked to "custom"
7. If Ticket Scope = "event" → Access Scope dropdown available: "Custom" or "All Sessions"
8. Organizer clicks "Save" → ticket type created with registered_count = 0
9. Organizer can edit ticket type → colour and name always editable. Quota cannot be reduced below registered_count post-publish
10. Organizer can delete ticket type → only if registered_count = 0. Otherwise: blocked with reason showing registration count

---

## 3. Screen Inventory

| Screen | Purpose |
|--------|---------|
| Ticket Type List | Displays all ticket types for this event with scope, colour, quota, and registration count |
| Ticket Type Form (Add / Edit) | Form to create or edit a ticket type |
| Delete Ticket Type Confirmation Dialog | Confirmation modal before deleting a ticket type |

---

## 4. Layout & Composition

### Ticket Type List
- **Context:** Tab panel within Event Configuration. Event top bar and tab navigation persistent from Feature 2
- **Top of tab panel:** "Ticket Types" section header + "Add Ticket Type" button (top-right)
- **Main content:** List or card grid of ticket types. Each item shows: colour swatch, name, scope badge, quota, registered count, access scope, and kebab menu
- **Grouping:** Optionally group by scope: "Event Tickets" section and "Sub-event Tickets" section. Sub-event tickets show their parent ticket type as a reference

**Visual hierarchy guidance:**
- Primary focus: ticket type name + colour swatch — the colour is a key visual identifier (used on badges)
- Secondary: quota vs registered count — the organizer needs to see utilization at a glance
- Scope badges help distinguish event-level from sub-event-level tickets
- Parent ticket type reference on sub-event tickets should be subtle but present

**Content density hint:**
- Simple events: 1–3 ticket types (e.g. General Admission, VIP)
- Complex events: 5–10 event-level types + 3–10 sub-event types
- Maximum is uncapped in the FDR but practically 20–30

### Ticket Type Form
- **Modal or drawer** (should match the pattern chosen for Session Form in Feature 3)
- **Single-column form** with logical grouping:
  1. **Identity:** Name (EN/TC/SC), Colour Picker
  2. **Scope:** Ticket Scope dropdown, Parent Ticket Type dropdown (conditional), Access Scope dropdown (conditional)
  3. **Capacity:** Quota, Max Bring-Along Default
  4. **Description:** Description (EN/TC/SC)
- **Footer:** Cancel and Save buttons

---

## 4.1. Sample Data (for design mockups)

### Ticket Type List

| Field | Example 1 (EN) | Example 2 (EN) | Example 3 (EN) |
|-------|----------------|----------------|----------------|
| Name | General Admission | VIP | Red Wine Masterclass |
| Name (TC) | 普通入場 | 貴賓 | 紅酒大師班 |
| Colour Swatch | #4CAF50 (green) | #FFD700 (gold) | #8B0000 (dark red) |
| Scope | Event | Event | Sub-event |
| Access Scope | Custom | All Sessions | Custom |
| Parent Ticket | — | — | General Admission |
| Quota | 400 | 50 | 30 |
| Registered | 280 / 400 | 42 / 50 | 0 / 30 |
| Max Bring-Along | 2 | 5 | — (NULL = unlimited) |

**Data volume hints:**
- Typical: 2–5 ticket types
- Complex events: up to 10–15 event-level + 5–10 sub-event types
- Ticket type names: typically 10–40 characters
- Descriptions: typically 20–100 characters, max 200

---

## 5. Component Checklist

### Ticket Type List
- [ ] Card or List Item — ticket type row with colour swatch, name, badges, quota display
- [ ] Colour Swatch — small circle or square showing the ticket type colour
- [ ] Badge — Scope: "Event" (neutral) and "Sub-event" (info variant)
- [ ] Badge — Access Scope: "All Sessions" (VIP — accent variant) and "Custom" (neutral)
- [ ] Progress text or bar — registered count vs quota
- [ ] Icon Button / Kebab Menu — Edit, Delete actions
- [ ] Button (primary) — "Add Ticket Type"
- [ ] Empty State — no ticket types yet
- [ ] Loading Skeleton — card placeholders

### Ticket Type Form
- [ ] Text Input — Name (EN/TC/SC)
- [ ] Textarea or Text Input — Description (EN/TC/SC, max 200 chars)
- [ ] Colour Picker — hex input + visual swatch (same component as Feature 2 branding colour)
- [ ] Dropdown / Select — Ticket Scope (2 options)
- [ ] Dropdown / Select — Parent Ticket Type (dynamic, filtered to event-scope tickets only)
- [ ] Dropdown / Select — Access Scope (2 options)
- [ ] Number Input — Quota (integer, min 1)
- [ ] Number Input — Max Bring-Along Default (integer, min 0, optional — NULL = unlimited)
- [ ] Language Tab Group — for multilingual fields
- [ ] Button (primary) — "Save"
- [ ] Button (secondary) — "Cancel"

### Delete Confirmation Dialog
- [ ] Dialog / Modal — with ticket type name and colour swatch
- [ ] Button (destructive) — "Delete"
- [ ] Button (secondary) — "Cancel"

---

## 5.1. Component Gap Analysis

| Component Needed | Exists in Design System? | Recommendation |
|-----------------|------------------------|----------------|
| Colour Swatch (small, inline) | ⚠️ Partial — Colour picker from Feature 2 exists but a small inline swatch (16–24px circle) for list display may not | **Compose:** Small filled circle element with the hex colour as background. Simple CSS — no new component needed, just document the pattern |
| Colour Picker | ❌ or ⚠️ — Same gap identified in Feature 2 | Use the same Colour Picker component decision from Feature 2. Do NOT create a different pattern |
| Parent Ticket Type Dropdown (dynamic filtered) | ⚠️ Partial — Dropdown exists but dynamically filtered options (only event-scope tickets) needs implementation guidance | **Extend:** Document that this dropdown's option list is derived from the current event's ticket types where ticket_scope = "event". It updates when ticket types are added/removed |
| Registration Count Display (X / Total) | ✅ Yes | Use same pattern as Event List registration count display from Feature 1 |

---

## 5.2. Questions Before Design

> **Q1: Should ticket types be displayed as a list (table-like rows) or as cards (with prominent colour swatches)?**
> Context: Cards with large colour swatches make the colour-coding very visual and help organizers associate colours with badge types at a glance. List rows are more compact. Since colours are a key feature (used on printed badges), the visual prominence of the colour matters.
> Suggestion: Cards with a prominent colour band or left-border using the ticket type colour. This reinforces the badge colour association.

> **Q2: Should the "Max Bring-Along Default" field be exposed directly, or hidden under an "Advanced" toggle?**
> Context: Max Bring-Along is a Module 1 feature (companion registration). It's stored in Module 0 as a default value. Most organizers creating simple events won't need this. Exposing it adds complexity to the ticket type form for a field that many won't use.
> Suggestion: Place under a collapsible "Advanced Settings" section, collapsed by default. Show helper text: "Set a maximum number of companions each registrant with this ticket type can bring."

> **Q3: How should the "All Sessions" access scope be visually distinguished from "Custom" in the list?**
> Context: "All Sessions" is a VIP shortcut — it means this ticket type bypasses session-level ticket mapping entirely. This is a powerful privilege and the organizer should clearly understand the difference. If it's not visually distinct, an organizer might accidentally grant VIP access.
> Suggestion: Use a distinct badge colour or icon for "All Sessions" (e.g. gold/accent badge with a star icon, versus neutral badge for "Custom"). Add a tooltip: "This ticket type grants access to all sessions without individual mapping."

> **Q4: When editing a ticket type post-publish, which fields should be editable and which should be read-only?**
> Context: The FDR states that colour and name are always editable, and quota cannot be reduced below registered_count. But it doesn't clearly state whether ticket_scope, access_scope, and parent_ticket_type_id are editable post-publish. Changing scope post-publish could break existing registrations.
> Suggestion: Post-publish: Name, Description, Colour, and Quota (with floor) are editable. Ticket Scope, Access Scope, and Parent Ticket Type are read-only. Show a notice: "Some fields cannot be changed after the event is published."

---

## 6. Data & Field Specification

### Ticket Type Form — Input Fields

| # | Field | Required | Input Type | Constraints | Default | Multilingual | Behaviour Notes |
|---|-------|----------|-----------|-------------|---------|-------------|-----------------|
| 1 | Ticket Type Name (EN) | Yes | Text Input | Max 100 characters | None | Yes (EN required, TC/SC optional) | Required. Inline validation on save |
| 2 | Ticket Type Name (TC) | No | Text Input | Max 100 characters | None | Yes — Traditional Chinese | Optional |
| 3 | Ticket Type Name (SC) | No | Text Input | Max 100 characters | None | Yes — Simplified Chinese | Optional |
| 4 | Description (EN) | No | Text Input or Textarea | Max 200 characters | None | Yes (all optional) | "Access privilege description." Character counter |
| 5 | Description (TC) | No | Text Input or Textarea | Max 200 characters | None | Yes — Traditional Chinese | Character counter |
| 6 | Description (SC) | No | Text Input or Textarea | Max 200 characters | None | Yes — Simplified Chinese | Character counter |
| 7 | Colour | Yes | Colour Picker (hex input + swatch) | Valid hex colour code (7 chars including #). e.g. #4CAF50 | None — no default | No | Used for badge colour-coding. Real-time swatch preview. Required field |
| 8 | Ticket Scope | Yes | Dropdown (single-select) | Must be "event" or "sub_event" | None — no default | No | Options: "Event" (general admission for the event), "Sub-event" (ticket for a specific sub-event session). When "Sub-event" is selected → Parent Ticket Type (#9) becomes required and visible. When "Sub-event" is selected → Access Scope (#10) locked to "Custom". See Interactions section |
| 9 | Parent Ticket Type | Conditional — required when Ticket Scope = "sub_event" | Dropdown (single-select) | Must reference an existing ticket type where ticket_scope = "event". Must be an event-scoped ticket (cannot reference another sub-event ticket) | None | No | **Only visible when Ticket Scope = "sub_event."** Options: dynamically populated from this event's ticket types where ticket_scope = "event". If no event-scope tickets exist → show message: "Create an event-level ticket type first." Dropdown is disabled. The parent ticket must itself be event-scoped — sub_event parents are rejected |
| 10 | Access Scope | Yes | Dropdown (single-select) | Must be "custom" or "all_sessions" | custom | No | Options: "Custom" (use session–ticket type mapping to control access), "All Sessions" (VIP — grants access to all sessions). **Only editable when Ticket Scope = "event."** When Ticket Scope = "sub_event" → locked to "Custom" (greyed out or hidden). "All Sessions" + "sub_event" combination is blocked |
| 11 | Quota | Yes | Number Input | Integer. Must be > 0 | None | No | Maximum registrations for this ticket type. Inline validation: "Quota must be greater than 0." Post-publish: cannot be reduced below registered_count. If organizer tries to reduce below registered_count → inline error: "Quota cannot be less than [X] (current registrations)" |
| 12 | Max Bring-Along Default | No | Number Input | Integer. Min 0. NULL = no cap / unlimited | None — NULL (unlimited) | No | Maximum companion registrations per primary registrant holding this ticket type. Used by Module 1. Show helper text: "Leave empty for unlimited." 0 = no companions allowed. Suggested placement: under "Advanced Settings" collapsible |

### Ticket Type List — Display-Only Fields (per item)

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Ticket Type Name | Text | User input (name in current portal language, fallback to EN) | Primary text. Bold or medium weight |
| 2 | Colour Swatch | Colour | User input (colour_hex) | Small filled circle or square (16–24px) showing the hex colour |
| 3 | Ticket Scope | Badge | User input | "Event" = neutral badge, "Sub-event" = info badge |
| 4 | Access Scope | Badge | User input | "All Sessions" = accent/gold badge (VIP), "Custom" = neutral badge. Only meaningful for event-scope tickets |
| 5 | Parent Ticket Type | Text | User input (parent_ticket_type_id → resolved to parent name) | Shown on sub-event tickets only. Format: "Requires: [Parent Name]" or "↳ [Parent Name]". Hidden for event-scope tickets |
| 6 | Quota | Number | User input | Integer |
| 7 | Registered Count | Number + Progress | System computed (materialized counter, read-only in this module) | "X / [Quota]" with optional mini progress bar. 0 for new ticket types. Updated by Registration module |
| 8 | Max Bring-Along Default | Number or Text | User input | Show number if set (e.g. "Max 2 companions"). Show "Unlimited" or "—" if NULL. Show "No companions" if 0 |
| 9 | Description | Text | User input (description in current language, fallback to EN) | Secondary text. Truncated with tooltip if long |

---

## 7. Interactions & Behaviour

- **Select Ticket Scope = "event" (#8)** → Parent Ticket Type (#9) is hidden or disabled. Access Scope (#10) is enabled with "Custom" and "All Sessions" options
- **Select Ticket Scope = "sub_event" (#8)** → Parent Ticket Type (#9) becomes visible and required. Access Scope (#10) is locked to "Custom" (greyed out, or hidden with a note: "Sub-event tickets always use custom session mapping"). If no event-scope ticket types exist for this event, Parent Ticket Type shows: "Create an event-level ticket type first" and Save is blocked
- **Change Ticket Scope from "sub_event" back to "event"** → Parent Ticket Type clears and hides. Access Scope re-enables
- **Click "Save" with Ticket Scope = "sub_event" and no Parent Ticket Type selected** → Inline error on Parent Ticket Type: "Required — select a parent event ticket type"
- **Click "Save" with Quota = 0** → Inline error: "Quota must be greater than 0"
- **Edit post-publish — attempt to reduce Quota below registered_count** → Inline error: "Quota cannot be less than [registered_count] (current registrations)"
- **Edit post-publish — attempt to change Ticket Scope** → Field is read-only. Show note: "Ticket scope cannot be changed after the event is published"
- **Click kebab → "Delete" on ticket type with registered_count = 0** → Confirmation dialog → soft delete → ticket type removed from list
- **Click kebab → "Delete" on ticket type with registered_count > 0** → Delete blocked. Dialog shows: "Cannot delete — [X] registrations use this ticket type." Delete button disabled
- **After creating a ticket type** → It immediately appears in the ticket type list. registered_count shows "0 / [Quota]". The ticket type also becomes available for session mapping in Feature 5

---

## 8. States

### Ticket Type List
| State | Description |
|-------|-------------|
| Default / Empty | No ticket types exist for this event. Show empty state: "No ticket types yet. Add at least one ticket type before publishing." with "Add Ticket Type" CTA |
| Populated | Ticket types displayed as cards or rows. Colour swatches, scope badges, and quota visible |
| Loading | Skeleton placeholders for 2–4 ticket type cards |
| Error — System | Banner: "Unable to load ticket types. Please try again." |

### Ticket Type Form (Add)
| State | Description |
|-------|-------------|
| Default / Empty | Blank form. Required fields marked. Ticket Scope defaults to no selection. Parent Ticket Type hidden. Access Scope disabled until Scope selected |
| Sub-event selected — no parent tickets exist | Parent Ticket Type dropdown shows "Create an event-level ticket type first". Save blocked |
| Error — Validation | Inline errors on invalid fields |
| Error — System | Toast or inline: "Unable to save. Please try again." |
| Success | Form closes. Ticket type appears in list. Toast: "Ticket type added" |

### Ticket Type Form (Edit)
| State | Description |
|-------|-------------|
| Populated | Form pre-populated. Post-publish: Ticket Scope, Access Scope, Parent Ticket Type are read-only with info notice |
| Quota constrained | Post-publish: Quota input shows minimum floor hint: "Min: [registered_count]" |
| Error — Validation | Inline errors (e.g. quota below registered_count) |
| Success | Form closes. Ticket type updates in list. Toast: "Ticket type updated" |

### Delete Ticket Type Confirmation Dialog
| State | Description |
|-------|-------------|
| Default | Modal with ticket type name and colour swatch. Delete and Cancel buttons enabled |
| Blocked — has registrations | "Cannot delete" message: "[X] registrations use this ticket type." Delete button disabled. Only Cancel available |
| Processing | Delete button shows loading spinner |
| Error | Inline error: "Unable to delete. Please try again." |

---

## 9. Navigation & Routing

- **Entry point:** "Tickets" tab within Event Configuration (Feature 2 tab navigation)
- **Exit points:** Tab navigation to other event tabs; Back arrow to Event List
- **Back behaviour:** Navigating away does not require save confirmation — ticket types are saved individually

---

## 11. Multilingual Notes

- Ticket Type Name supports EN / TC / SC. EN required; TC and SC optional
- Description supports EN / TC / SC. All optional
- Use the same multilingual input pattern established in Feature 2
- Note: Name max is 100 chars (shorter than event name's 200 chars). Description max is 200 chars (shorter than event description's 5000 chars)

---

## 12. Design Reminders

- [ ] **READ Section 5.2 (Questions Before Design) FIRST** — resolve all questions with product team
- [ ] **CHECK Section 5.1 (Component Gap Analysis)** — Colour Picker gap carries over from Feature 2
- [ ] Use existing design system components — do not create new ones without checking the library first
- [ ] Use sample data from Section 4.1 in your mockups — not placeholder text
- [ ] The colour swatch is a signature UI element — it appears on ticket type cards, session–ticket mapping (Feature 5), registration forms (Module 1), and printed badges (Module 2). Ensure the swatch size and style is established as a reusable pattern
- [ ] Ticket Scope → Parent Ticket Type dependency is a critical interaction. Test with: 0 event-scope tickets (edge case), 1 event-scope ticket, and 5+ event-scope tickets
- [ ] "All Sessions" access scope is powerful (VIP) — make it visually distinct so organizers don't accidentally grant it
- [ ] Post-publish edit restrictions must be clearly communicated — show which fields are locked and why
- [ ] The registered_count display is read-only in this module but is critical context for the organizer deciding whether to edit or delete a ticket type
