# RSVP Confirmation

> Module: Module 1 — Registration & RSVP
> Persona: Guest (invited)
> Upstream: Invitation Management (Organizer sends invitation email), Event & Session Setup (Module 0)
> Downstream: Confirmation Page (shared with Self-Service Registration), Badge Print (Module 2), Admission (Module 3)

---

## 1. Feature Summary

Invited guests receive an email with a personalised RSVP link. Clicking the link takes them to an RSVP page where they can confirm attendance and optionally add bring-along companions. If the invitation has pre-assigned ticket types, those are displayed as read-only. If no ticket types are pre-assigned, the guest selects their own (same ticket selection UI as self-service registration). On confirmation, a registration is created and the guest sees the shared Confirmation Page with their QR code.

---

## 2. User Flow

1. Guest receives invitation email → clicks **RSVP link** (unique per invitation)
2. Guest lands on **RSVP Page** showing event details and their invitation
3. **If ticket types are pre-assigned:** Guest sees their assigned tickets as read-only badges (no selection needed)
4. **If no ticket types pre-assigned:** Guest sees ticket selection UI (same as self-service — select event ticket, optionally add sub-events)
5. Guest optionally adds bring-along companions (first name + last name per companion)
6. Guest clicks **Confirm Attendance**
7. System validates quotas, creates registration with all ticket types + wallet + bring-along records
8. Guest is redirected to **Confirmation Page** (shared screen — see Self-Service Registration feature)
9. Confirmation email sent automatically

**Alternate flows:**
- If RSVP deadline has passed → RSVP page shows "Registration is closed" message
- If invitation is already confirmed → RSVP page shows "You're already registered" with existing QR code
- If any pre-assigned ticket is at quota → error shown, guest cannot confirm

---

## 3. Screen Inventory

| Screen | Purpose |
|--------|---------|
| RSVP Page | Invited guest confirms attendance, views pre-assigned tickets, adds bring-alongs |
| Confirmation Page | Shared with Self-Service Registration — QR code, registration summary, wallet contents |

---

## 4. Layout & Composition

### RSVP Page
- Single-column centred layout (narrower than self-service — this is a simpler flow)
- **Top section:** Event header — event name, dates, venue (same as self-service but lighter treatment)
- **Invitation greeting:** Personalised: "Hello Dr Sarah Chen, you're invited to..."
- **Section 1: Pre-Assigned Tickets** (if `ticket_type_ids` is set on the invitation)
  - Read-only badge list showing ticket type names with colour swatches
  - Label: "Your assigned tickets:"
  - Guest cannot change these — they are pre-selected by the organizer
- **Section 1 (alternate): Ticket Selection** (if `ticket_type_ids` is NULL)
  - Same ticket selection UI as Self-Service Registration (event ticket → sub-event tickets)
- **Section 2: Bring-Along** — same bring-along section as Self-Service Registration
- **Bottom:** Confirm Attendance button

**Visual hierarchy guidance:**
- Primary focus: The personalised greeting + ticket assignment — guest needs to quickly understand what they're confirming
- Secondary: Bring-along section
- The RSVP page should feel lighter and more "confirmation-like" than the full registration form (fewer fields, fewer decisions)

### Confirmation Page
- **Shared screen** — identical to the Self-Service Registration confirmation page. See that feature's Section 4 for full layout details.

---

## 4.1. Sample Data (for design mockups)

### RSVP Page — Pre-Assigned Tickets
| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Greeting | Hello Dr Sarah Chen, you're invited to Hong Kong Wine & Dine Festival 2026 | 陳嘉欣博士您好，誠邀您出席香港美酒佳餚巡禮 2026 | 陈嘉欣博士您好，诚邀您出席香港美酒佳肴巡礼 2026 |
| Event Dates | 25–28 Oct 2026 | 2026年10月25–28日 | 2026年10月25–28日 |
| Venue | Central Harbourfront Event Space | 中環海濱活動空間 | 中环海滨活动空间 |
| Pre-Assigned Ticket 1 | General Admission (colour: #00B5AD) | 普通入場 | 普通入场 |
| Pre-Assigned Ticket 2 | Red Wine Tasting Masterclass (colour: #8B0000) | 紅酒品鑑大師班 | 红酒品鉴大师班 |

**Data volume hints:**
- Pre-assigned tickets: typically 1–3 per invitation
- Bring-along companions: 0–5 (bounded by max_bring_along_default)
- RSVP page is much simpler than self-service — fewer fields, fewer decisions

---

## 5. Component Checklist

### RSVP Page
- [ ] Card — event summary card (lighter version of registration page header)
- [ ] Badge / Tag — pre-assigned ticket type badges with colour_hex (read-only)
- [ ] Selectable Card — ticket type selection (only shown when no pre-assignment)
- [ ] Inline Form Row — bring-along companion (first name + last name + remove)
- [ ] Counter — "2 of 3 companions added"
- [ ] Button (primary) — Confirm Attendance
- [ ] Alert / Banner (info) — "Your tickets have been pre-assigned by the organizer"
- [ ] Alert / Banner (error) — quota exceeded, RSVP deadline passed
- [ ] Alert / Banner (success) — already confirmed state with existing QR

---

## 5.1. Component Gap Analysis

| Component Needed | Exists in Design System? | Recommendation |
|-----------------|------------------------|----------------|
| Read-Only Ticket Badge List | ✅ Yes | Use existing Tag/Badge component with colour_hex background, in a horizontal list |
| Personalised Greeting Banner | ⚠️ Partial — may need a styled text block | **Compose:** Use Card or Banner component with larger personalised text. Not a standard alert — more of a hero greeting |
| Already-Confirmed State with QR | ❌ No | **Compose:** Alert (success variant) containing a mini QR code preview + link to full confirmation page. Or redirect directly to confirmation page |

---

## 5.2. Questions Before Design

> **Q1: When an already-confirmed guest clicks the RSVP link again, should they see the RSVP page with an "already registered" message, or be redirected directly to the Confirmation Page?**
> Context: Guests may click the RSVP link from email multiple times (to find their QR code). A redirect is more useful; a message requires an extra click.
> Suggestion: Redirect to Confirmation Page directly. Show a subtle banner: "You're already registered for this event."

> **Q2: For pre-assigned tickets, should the guest see a full ticket card (with description, dates, venue) or just the ticket name as a badge?**
> Context: Pre-assigned guests don't choose tickets — they just need to know what they're getting. Too much detail adds noise; too little may leave VIP guests confused about what sessions they can attend.
> Suggestion: Show ticket name + colour + one-line description. For sub-event tickets, also show session date/time.

> **Q3: Does the RSVP page need personal details fields (email, phone, etc.) or are all details carried over from the invitation?**
> Context: The invitation already has first_name, last_name, email, salutation, phone, etc. The FDR's CreateRegistration copies these from the invitation. If the guest doesn't need to enter any details, the RSVP page is just: greeting + tickets + bring-alongs + confirm button.
> Suggestion: No personal details form on RSVP — carry over from invitation. RSVP is a one-click confirmation with optional bring-along add.

---

## 6. Data & Field Specification

### RSVP Page — Display Fields

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Guest Name | Text | `first_name` + `last_name` from invitation | Personalised greeting heading: "Hello [Salutation] [Name]" |
| 2 | Guest Email | Text | `email` from invitation | Shown as subtext: "Invitation sent to sarah.chen@example.com" |
| 3 | Event Name | Text | From Module 0 | Heading below greeting, multilingual |
| 4 | Event Dates | Date range | From Module 0 | Formatted date range |
| 5 | Event Venue | Text | From Module 0 | Below dates |
| 6 | Pre-Assigned Ticket Types | Badge list | `ticket_type_ids` from invitation, resolved to names + colour_hex | Read-only badges. One per ticket type. Show ticket scope (event/sub-event) if mixed |
| 7 | Pre-Assigned Ticket Description | Text | `t_ticket_types.description` | One line per ticket below the badge |
| 8 | Pre-Assigned Ticket Session Date/Time | Date/Time | From Module 0 session data | Shown for sub-event tickets only |

### RSVP Page — Input Fields (Bring-Along only)

| # | Field | Required | Input Type | Constraints | Default | Multilingual | Behaviour Notes |
|---|-------|----------|-----------|-------------|---------|-------------|-----------------|
| 1 | Companion First Name | Yes (per companion) | Text | Max 100 chars | None | No | Same as self-service bring-along |
| 2 | Companion Last Name | Yes (per companion) | Text | Max 100 chars | None | No | Same as self-service bring-along |

### RSVP Page — Ticket Selection Fields (only when no pre-assignment)

If `ticket_type_ids` is NULL on the invitation, the RSVP page shows the same ticket selection UI as Self-Service Registration. Refer to **Self-Service Registration → Section 6 → Ticket Selection** for the full field specification.

---

## 7. Interactions & Behaviour

- **Guest lands on RSVP page with pre-assigned tickets** → tickets shown as read-only badges → no selection needed → guest scrolls to bring-along or clicks Confirm directly
- **Guest lands on RSVP page without pre-assigned tickets** → ticket selection UI shown (same as self-service) → guest must select at least one event-level ticket
- **Guest adds bring-along companions** → same interaction as self-service (inline rows, counter, max check)
- **Guest clicks Confirm Attendance** → loading state on button → system creates registration → redirect to Confirmation Page
- **RSVP deadline has passed** → RSVP page loads but shows banner: "Registration for this event is closed. The RSVP deadline has passed." → Confirm button disabled/hidden
- **Already confirmed** → redirect to Confirmation Page (or show "Already registered" with link)
- **Quota exceeded on pre-assigned ticket** → error banner: "Sorry, [Ticket Name] is now at capacity. Please contact the event organizer." → Confirm disabled
- **Invitation status is declined or bounced** → show appropriate message (edge case — may not need distinct design)

---

## 8. States

### RSVP Page
| State | Description |
|-------|-------------|
| Default — Pre-Assigned | Greeting shown, ticket badges displayed (read-only), bring-along section available, Confirm button active |
| Default — No Pre-Assignment | Greeting shown, ticket selection UI visible, personal form may be shown, Confirm button active |
| With Bring-Alongs | Companion rows visible, counter showing |
| Loading — Page | Skeleton while invitation and event data loads |
| Loading — Submission | Confirm button shows spinner, inputs disabled |
| Already Confirmed | Guest has already RSVP'd. Show "Already registered" state or redirect to Confirmation |
| Error — Deadline Passed | Banner: "Registration is closed." Confirm hidden/disabled. Event details still visible |
| Error — Quota Exceeded | Banner indicating which pre-assigned ticket is full. Confirm disabled |
| Error — Invitation Not Found | Invalid RSVP link. "Invitation not found" with link to event page |
| Error — System | Generic error banner |

---

## 9. Navigation & Routing

- **Entry point:** Guest clicks RSVP link from invitation email (e.g., `https://events.lepos.co/{event_slug}/rsvp/{invitation_id}`)
- **Exit points:** Confirmation Page on success. Dead end on error (guest contacts organizer)
- **Back behaviour:** Browser back from Confirmation Page → "Already registered" state on RSVP page (or redirect back to confirmation)
- **No authentication required:** RSVP link contains invitation_id for lookup — no login needed

---

## 10. Responsive Considerations (optional)

- RSVP page must be fully responsive — guests will click from email on their phones
- Simpler layout than self-service (fewer fields) so mobile responsiveness is more straightforward
- QR code on confirmation page must remain large and scannable on mobile

---

## 11. Multilingual Notes (optional)

- RSVP page language determined by invitation's `preferred_language`
- Event name, ticket names displayed in guest's preferred language
- Greeting text localised: "Hello" / "您好" depending on language
- Confirmation email sent in guest's preferred language

---

## 12. Design Reminders

- [ ] **READ Section 5.2 (Questions Before Design) FIRST** — resolve all questions with product team before starting design work
- [ ] **CHECK Section 5.1 (Component Gap Analysis)** — discuss any ❌ or ⚠️ items with design system owner
- [ ] Use existing design system components — do not create new ones without checking the library first
- [ ] Use sample data from Section 4.1 in your mockups — not placeholder text
- [ ] RSVP page should feel like a "confirmation" — lighter, more celebratory than the full registration form
- [ ] The personalised greeting is the hero moment — make the guest feel welcome and expected
- [ ] Pre-assigned tickets are read-only — make it visually clear the guest cannot change them
- [ ] The Confirmation Page is shared with Self-Service Registration — ensure consistent design
- [ ] Excluded pending decision: Q-5 (bring-along sub-event access) — bring-alongs inherit event-level ticket only
