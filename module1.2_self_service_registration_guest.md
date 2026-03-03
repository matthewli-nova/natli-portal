# Self-Service Registration

> Module: Module 1 — Registration & RSVP
> Persona: Guest
> Upstream: Event & Session Setup (Module 0) — requires published event with ticket types and sessions configured
> Downstream: Badge Print (Module 2), Admission / Access Control (Module 3), Guest List Management (Organizer)

---

## 1. Feature Summary

Guests visit a public registration URL to register for an event. They select an event-level ticket type, optionally add sub-event session tickets, fill in their personal details, and optionally add bring-along companions. On submission, they receive a confirmation page with a QR code and a confirmation email. This is the primary guest-facing registration experience.

---

## 2. User Flow

1. Guest opens public registration URL → lands on **Registration Page** showing event details and available tickets
2. Guest selects one event-level ticket type → sub-event ticket options become visible
3. Guest optionally selects sub-event tickets (only those linked to the chosen event ticket) → available quota shown per ticket type
4. Guest scrolls to or navigates to **Personal Details Form** → fills in required and optional fields
5. Guest optionally expands **Bring-Along Section** → adds companion(s) with first name and last name
6. If bring-along count exceeds the ticket type's maximum → inline error: limit reached
7. Guest clicks **Register** → system validates all fields, checks all quotas atomically
8. If quota exceeded for any ticket → error message indicating which ticket type is full
9. If RSVP deadline has passed → error message: "Registration is closed"
10. If duplicate email detected → soft warning shown but registration proceeds
11. On success → navigates to **Confirmation Page** with QR code, registration summary, wallet contents
12. Confirmation email sent automatically with QR code and ticket details

---

## 3. Screen Inventory

| Screen | Purpose |
|--------|---------|
| Registration Page | Event overview + ticket selection + personal details form + bring-along section |
| Confirmation Page | Registration success with QR code, registration summary, and wallet contents |

---

## 4. Layout & Composition

### Registration Page
- Single-page vertical scroll layout (not multi-step wizard)
- **Top section:** Event header — event name, description, dates, venue, banner image (from Module 0)
- **Section 1: Ticket Selection** — card-based layout showing available ticket types
  - Event-level tickets shown first (required — select one)
  - Sub-event tickets shown below, initially collapsed/greyed out until event ticket selected
  - Each ticket card shows: name, description, colour swatch, available quota ("12 of 50 remaining"), price (free for MVP)
- **Section 2: Personal Details** — full-width form with logical field groupings
  - Group 1: Name fields (salutation, first name, last name)
  - Group 2: Contact (email, phone country code + phone number)
  - Group 3: Preferences (preferred language, WeChat ID)
  - Group 4: Profile (representative type, additional info fields)
- **Section 3: Bring-Along** — expandable section below form
  - "Add Companion" button → inline row with first name + last name fields
  - Counter showing "2 of 3 companions added" (based on max_bring_along_default)
- **Bottom:** Register button (full-width or right-aligned)

**Visual hierarchy guidance:**
- Primary focus: Ticket selection cards — this is the key decision point
- Secondary: Personal details form
- Tertiary: Bring-along section (optional, collapsed by default)

**Content density:** Typical event has 1–3 event-level ticket types and 0–10 sub-event ticket types. Sub-events may be numerous for large events (Wine & Dine: 20+ sessions).

### Confirmation Page
- Centred single-column layout
- **Top:** Success icon/illustration + "You're registered!" heading
- **QR Code:** Large, prominently displayed — this is the primary thing the guest needs
- **Registration Summary:** Registration number, guest name, event name, event dates
- **Wallet Contents:** List of all ticket types assigned (event + sub-event), each with name and colour badge
- **Bring-Along Summary:** If companions were added, list their names and registration numbers
- **Actions:** "Add to Calendar" button, "Download QR" button (optional)
- **Footer note:** "A confirmation email has been sent to [email]"

**Visual hierarchy guidance:**
- Primary focus: QR code — guest needs to screenshot or save this
- Secondary: Ticket type list (what they're registered for)
- Tertiary: Registration details and companion info

---

## 4.1. Sample Data (for design mockups)

### Registration Page — Ticket Selection
| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Event Name | Hong Kong Wine & Dine Festival 2026 | 香港美酒佳餚巡禮 2026 | 香港美酒佳肴巡礼 2026 |
| Event Dates | 25–28 Oct 2026 | 2026年10月25–28日 | 2026年10月25–28日 |
| Venue | Central Harbourfront Event Space | 中環海濱活動空間 | 中环海滨活动空间 |
| Event Ticket Name | General Admission | 普通入場 | 普通入场 |
| Event Ticket Colour | #00B5AD (teal) | — | — |
| Available Quota | 238 of 500 remaining | 尚餘 238 / 500 | 剩余 238 / 500 |
| Sub-Event Ticket Name | Red Wine Tasting Masterclass | 紅酒品鑑大師班 | 红酒品鉴大师班 |
| Sub-Event Quota | 8 of 30 remaining | 尚餘 8 / 30 | 剩余 8 / 30 |

### Registration Page — Personal Details
| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Salutation | Dr | Dr | Dr |
| First Name | Sarah | 嘉欣 | 嘉欣 |
| Last Name | Chen | 陳 | 陈 |
| Email | sarah.chen@example.com | sarah.chen@example.com | sarah.chen@example.com |
| Phone Country Code | +852 | +852 | +852 |
| Phone Number | 9123 4567 | 9123 4567 | 9123 4567 |
| Preferred Language | English | 繁體中文 | 简体中文 |
| WeChat ID | sarah_chen_wx | sarah_chen_wx | sarah_chen_wx |
| Representative Type | media | 媒體 | 媒体 |

### Confirmation Page
| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Registration Number | A1B2C3D4E5F6G7H8 | A1B2C3D4E5F6G7H8 | A1B2C3D4E5F6G7H8 |
| QR Code Content | A1B2C3D4E5F6G7H8 | — | — |
| Guest Name | Dr Sarah Chen | Dr 陳嘉欣 | Dr 陈嘉欣 |
| Event Ticket | General Admission | 普通入場 | 普通入场 |
| Sub-Event Tickets | Red Wine Tasting Masterclass | 紅酒品鑑大師班 | 红酒品鉴大师班 |
| Bring-Along 1 | James Chen (A9Z8Y7X6W5V4U3T2) | 陳俊明 | 陈俊明 |

**Data volume hints:**
- 1–3 event-level ticket types per event
- 0–20 sub-event ticket types (Wine & Dine can have 20+ sessions)
- Typical guest adds 0–2 bring-along companions; maximum set per ticket type (usually 1–5)
- Registration number is always exactly 16 characters (alphanumeric uppercase)

---

## 5. Component Checklist

### Registration Page
- [ ] Card — ticket type selection card (selectable, shows name, description, colour, quota)
- [ ] Radio / Selectable Card — event-level ticket (select one)
- [ ] Checkbox / Selectable Card — sub-event tickets (select zero or more)
- [ ] Form Input (text) — first name, last name, email, phone number, WeChat ID
- [ ] Form Input (select/dropdown) — salutation, phone country code, preferred language, representative type
- [ ] Button (text) — "Add Companion" in bring-along section
- [ ] Inline Form Row — bring-along companion: first name + last name + remove button
- [ ] Counter / Progress — "2 of 3 companions added"
- [ ] Alert / Banner (warning) — duplicate email soft warning
- [ ] Alert / Banner (error) — quota exceeded, RSVP deadline passed
- [ ] Button (primary) — Register
- [ ] Loading Spinner — on Register button during submission

### Confirmation Page
- [ ] QR Code — large format, client-side rendered from registration_number
- [ ] Card — registration summary card
- [ ] Badge / Tag — ticket type badges with colour_hex
- [ ] List — bring-along companions with their registration numbers
- [ ] Button (secondary) — Add to Calendar, Download QR
- [ ] Alert / Banner (success) — "Confirmation email sent to sarah.chen@example.com"

---

## 5.1. Component Gap Analysis

| Component Needed | Exists in Design System? | Recommendation |
|-----------------|------------------------|----------------|
| Selectable Ticket Card (with colour swatch, quota indicator) | ❌ No | **Compose:** Card + Radio/Checkbox + Colour Swatch + Progress Text. The card should show: ticket name, description, coloured left border or swatch matching `colour_hex`, and quota text. Selected state: border highlight + checkmark |
| Quota Indicator ("238 of 500 remaining") | ❌ No | **Compose:** Text with conditional colour: green (>50% available), amber (10–50%), red (<10%). Could also add a thin progress bar beneath the text |
| QR Code Display | ⚠️ Partial — may not have a dedicated QR component | **Extend:** Use Image component with client-side QR library output. Ensure minimum 200×200px display size for scannability |
| Bring-Along Inline Row | ❌ No | **Compose:** Horizontal form group (2 text inputs + icon button for remove). Similar to repeatable form field pattern |
| Phone Country Code + Number Composite Input | ⚠️ Partial — may exist as separate inputs | **Extend:** Combine Select (country code dropdown with flag icons) + Text Input into a composite phone input |

---

## 5.2. Questions Before Design

> **Q1: Is the registration page a single scrolling page or a multi-step wizard (ticket selection → personal details → review → submit)?**
> Context: The FDR describes the flow sequentially but doesn't mandate a wizard. Single-page is simpler but may feel overwhelming with many sub-event options. A wizard provides better focus but adds navigation complexity.
> Suggestion: Single scrolling page for MVP. Sub-event section reveals progressively after event ticket selection (accordion or slide-down).

> **Q2: How should sub-event ticket types be displayed when there are 20+ options (e.g., Wine & Dine sessions)?**
> Context: Large events can have many sub-event sessions grouped by date. The FDR mentions "sessions grouped by date in UI." Without guidance, the designer may create a flat list that becomes unwieldy.
> Suggestion: Group sub-event tickets by session date using date headers/dividers. Consider a collapsible accordion per date group.

> **Q3: Should the quota indicator show exact numbers ("238 of 500") or a vaguer indicator ("Spots available" / "Almost full" / "Sold out")?**
> Context: Showing exact numbers is transparent but may create urgency anxiety or reveal business metrics the organizer prefers to keep private. The FDR mentions "available quota shown per ticket type" but doesn't specify the format.
> Suggestion: Show exact numbers for transparency. Organizer can configure quota visibility in Module 0 if needed (future enhancement).

> **Q4: What visual treatment should the duplicate email soft warning use — is it a dismissible banner, an inline field warning, or a confirmation dialog?**
> Context: When a guest registers with an email that already has a registration, the system allows it but returns a warning. The guest needs to see this but shouldn't be blocked.
> Suggestion: Inline warning below the email field (amber, non-blocking): "This email is already registered for this event. You can still proceed."

> **Q5: Should the confirmation page be a separate URL (shareable/bookmarkable) or a post-submission state on the same page?**
> Context: If it's a separate URL with the registration number, guests can return to view their QR code later. If it's a post-submit state, refreshing the page might lose the confirmation. The FDR mentions "confirmation page" as a distinct screen.
> Suggestion: Separate URL route: `/events/{event_id}/registration/{registration_number}/confirmation`. Bookmarkable and accessible from confirmation email link.

---

## 6. Data & Field Specification

### Registration Page — Ticket Selection (Display Fields)

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Event Name | Text | From Module 0 `t_events` | Large heading, multilingual |
| 2 | Event Description | Text | From Module 0 `t_events` | Body text below event name, multilingual |
| 3 | Event Dates | Date range | From Module 0 `start_datetime`, `end_datetime` | Formatted date range: "25–28 Oct 2026" |
| 4 | Event Venue | Text | From Module 0 `venue_name` | Below dates, with optional venue address |
| 5 | Event Banner Image | Image | From Module 0 `banner_image_url` | Full-width or header background. Fallback: event colour or default gradient |
| 6 | Ticket Type Name | Text | `t_ticket_types.name` | Card title, multilingual |
| 7 | Ticket Type Description | Text | `t_ticket_types.description` | Card body text, multilingual |
| 8 | Ticket Type Colour | Colour swatch | `t_ticket_types.colour_hex` | Left border or colour accent on card |
| 9 | Ticket Scope | Badge | `t_ticket_types.ticket_scope` | "Event" or "Sub-Event" — small label to differentiate |
| 10 | Available Quota | Text/Progress | `quota - registered_count` | "238 of 500 remaining". Colour: green (>50%), amber (10–50%), red (<10%) |
| 11 | Session Date | Date | From Module 0 `session_date` for sub-event tickets | Date header grouping sub-event tickets |
| 12 | Session Time | Time | From Module 0 `start_time`, `end_time` | Shown on sub-event ticket cards |
| 13 | Price | Text | `t_ticket_types.price` | "Free" for MVP. Future: formatted currency |
| 14 | Max Bring-Along | Number | `t_ticket_types.max_bring_along_default` | Not displayed directly; controls bring-along section limit |

### Registration Page — Personal Details (Input Fields)

| # | Field | Required | Input Type | Constraints | Default | Multilingual | Behaviour Notes |
|---|-------|----------|-----------|-------------|---------|-------------|-----------------|
| 1 | Salutation | No | Dropdown | Options: Mr, Mrs, Ms, Dr, Prof | None | No | Optional prefix for guest name |
| 2 | First Name | Yes | Text | Max 100 chars | None | No | Inline validation: required |
| 3 | Last Name | Yes | Text | Max 100 chars | None | No | Inline validation: required |
| 4 | Email | Yes | Text (email) | Max 255 chars, valid email format | None | No | Inline validation: required + email format. Soft duplicate warning if email already registered |
| 5 | Phone Country Code | No | Dropdown / Searchable Select | Max 5 chars. Common codes: +852 (HK), +86 (CN), +60 (MY), +66 (TH), +65 (SG), +81 (JP), +82 (KR), +886 (TW) | +852 (if HK event) | No | Shown as composite input with phone number |
| 6 | Phone Number | No | Text (tel) | Max 20 chars, digits only | None | No | Paired with country code |
| 7 | Preferred Language | No | Dropdown | Options: English (en), 繁體中文 (zh_tw), 简体中文 (zh_sc) | en | No | Drives confirmation email language |
| 8 | WeChat ID | No | Text | Max 100 chars | None | No | Shown only if relevant to event market (e.g., HK/CN events) |
| 9 | Representative Type | No | Dropdown | Options: Speaker, Exhibitor, Sponsor, Attendee, Media, VIP | None | No | Optional classification. May be hidden for public events |
| 10 | Tags | No | Text / Tag input | JSONB array, free-form | None | No | May not be exposed in guest-facing form (organizer-only field). Confirm with product team |
| 11 | Additional Info | No | Dynamic fields | JSONB key-value. Event-specific profile fields | None | Potentially | Fields defined per event by organizer. Rendered dynamically |

### Registration Page — Bring-Along Section (Input Fields)

| # | Field | Required | Input Type | Constraints | Default | Multilingual | Behaviour Notes |
|---|-------|----------|-----------|-------------|---------|-------------|-----------------|
| 12 | Companion First Name | Yes (per companion) | Text | Max 100 chars | None | No | One row per companion. Required if row is added |
| 13 | Companion Last Name | Yes (per companion) | Text | Max 100 chars | None | No | Paired with first name |

### Confirmation Page — Display Fields

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | QR Code | Image | Client-side rendered from `registration_number` | Large QR code (min 200×200px), prominently displayed |
| 2 | Registration Number | Text (monospace) | `registration_number` (16-char alphanumeric) | Displayed below QR code for manual lookup |
| 3 | Guest Name | Text | Salutation + first_name + last_name | Heading: "Dr Sarah Chen" |
| 4 | Event Name | Text | From Module 0 | Subheading |
| 5 | Event Dates | Date range | From Module 0 | Below event name |
| 6 | Event Venue | Text | From Module 0 | Below dates |
| 7 | Ticket Types | Badge list | All assigned ticket types (event + sub-event) | List of badges with ticket name and colour_hex |
| 8 | Wallet Summary | List | Wallet line items created from registration_tickets | One row per ticket type: name, type (event/sub-event) |
| 9 | Bring-Along Companions | List | From `t_b2b_bring_along_guests` | Each companion: name + their unique registration number |
| 10 | Confirmation Email Note | Text | System-generated | "A confirmation email has been sent to [email]" |

---

## 7. Interactions & Behaviour

- **Guest selects an event-level ticket** → sub-event ticket section reveals with slide-down animation → sub-event cards become interactive (no longer greyed out)
- **Guest deselects event-level ticket** → sub-event selections cleared → sub-event section collapses or greys out
- **Guest selects a sub-event ticket without its parent event ticket** → client-side validation prevents selection (card disabled with tooltip: "Requires [parent ticket name]")
- **Quota is near capacity (<10% remaining)** → quota text turns red, optional "Almost full" label
- **Quota is at 0** → ticket card disabled, greyed out with "Sold Out" overlay. Cannot be selected
- **Guest clicks "Add Companion"** → new inline row appears (first name + last name + remove icon)
- **Companion count reaches max_bring_along_default** → "Add Companion" button disabled, counter shows "3 of 3 companions added"
- **Guest removes a companion** → row removed, counter decrements, "Add Companion" re-enabled
- **Guest submits with empty required fields** → inline validation errors on each empty required field, scroll to first error
- **Guest submits with invalid email** → inline error on email field
- **System returns QUOTA_EXCEEDED** → alert banner: "Sorry, [Ticket Name] is now full. Please choose a different ticket." Scroll to ticket selection
- **System returns RSVP_DEADLINE_PASSED** → alert banner: "Registration for this event is closed." Form disabled
- **System returns duplicate_email warning** → inline amber warning below email field. Registration proceeds normally
- **Successful registration** → redirect to confirmation page → QR code renders client-side from registration_number

---

## 8. States

### Registration Page
| State | Description |
|-------|-------------|
| Default | Event details visible, ticket types loaded, form empty. Sub-event section greyed/collapsed |
| Ticket Selected | Event ticket selected, sub-event options revealed, form fields active |
| Form Filled | All required fields completed, Register button fully active |
| With Bring-Alongs | Companion rows visible below form, counter showing count |
| Loading — Ticket Data | Skeleton cards while ticket types load |
| Loading — Submission | Register button shows spinner, form disabled during submission |
| Error — Validation | Inline field errors shown on required/invalid fields. Scroll to first error |
| Error — Quota Exceeded | Alert banner at top indicating which ticket is full. Ticket card disabled |
| Error — Deadline Passed | Full-page or prominent banner: "Registration is closed." Entire form disabled |
| Error — System | Generic error banner: "Something went wrong. Please try again." |
| Warning — Duplicate Email | Amber inline warning below email field. Form still submittable |

### Confirmation Page
| State | Description |
|-------|-------------|
| Default / Populated | QR code rendered, full registration summary displayed, confirmation email note shown |
| Loading | Skeleton while confirmation data loads (if navigating directly to URL) |
| Error — Not Found | Registration number invalid or not found. Show: "Registration not found" with link back to event page |

---

## 9. Navigation & Routing

- **Entry point:** Guest opens public registration URL (e.g., `https://events.lepos.co/{event_slug}/register`)
- **Exit points:** Confirmation page (post-registration). No further navigation needed — guest can close the page or follow email link later
- **Back behaviour:** Browser back from confirmation page should show a "You've already registered" state, not allow re-submission
- **No authentication required:** Guest registration is a public endpoint — no login needed

---

## 10. Responsive Considerations (optional)

- Registration page must be fully responsive — many guests will register from mobile (email link → phone browser)
- On mobile: ticket cards stack vertically (full width), form fields go single-column
- QR code on confirmation page must be large enough to scan from a phone screen (min 200×200px)
- Bring-along section on mobile: stacked inputs (first name above last name per companion)

---

## 11. Multilingual Notes (optional)

- Event name, description, ticket type names, and ticket type descriptions are multilingual (EN/TC/SC from Module 0)
- Display in the guest's preferred language if set, otherwise default to the event's primary language
- Form labels are localised based on the page language
- Salutation options and representative type options may need localised display labels
- Preferred language dropdown itself shows: "English", "繁體中文", "简体中文"

---

## 12. Design Reminders

- [ ] **READ Section 5.2 (Questions Before Design) FIRST** — resolve all questions with product team before starting design work
- [ ] **CHECK Section 5.1 (Component Gap Analysis)** — if any components are marked ❌ or ⚠️, discuss with design system owner before designing
- [ ] Use existing design system components — do not create new ones without checking the library first
- [ ] Use sample data from Section 4.1 in your mockups — not placeholder text
- [ ] This is a guest-facing public page — design quality and polish matter more than internal tools
- [ ] Mobile-first approach recommended — majority of guests will access via phone from email links
- [ ] QR code must be large, prominent, and scannable — this is the guest's "ticket"
- [ ] Sub-event ticket grouping by date is critical for events with many sessions
- [ ] All prices show "Free" for MVP — but leave visual space for future price display
- [ ] Excluded pending decision: Q-5 (bring-along sub-event access) — do not design sub-event selection for bring-along companions
