# Event Creation & Configuration

> Module: Module 0 — Event & Session Setup
> Persona: Organizer
> Upstream: Event List & Dashboard (Feature 1) — organizer clicks "Create Event" or selects an existing event
> Downstream: Session Management (Feature 3), Ticket Type Configuration (Feature 4), Publish & Validation (Feature 6); all downstream B2B modules depend on a correctly configured event

---

## 1. Feature Summary

This is where the organizer creates a new event and configures all its core details — name, category, type, dates, venue, description, quota, RSVP deadline, and branding. The same screen serves both creation (initial save creates a Draft event) and ongoing editing (organizer returns to update fields before publishing). The event starts in Draft status and remains editable until closed.

---

## 2. User Flow

1. **Create path:** Organizer clicks "Create Event" from Event List → system opens a blank event form
2. Organizer fills in required fields: Event Name (EN), Category, Start Date, End Date, Venue (EN), Quota
3. Organizer optionally fills: Event Type (dependent on Category), Description (EN/TC/SC), RSVP Deadline, Address (EN/TC/SC), Name (TC/SC), Venue (TC/SC)
4. Organizer optionally configures branding: upload Logo, upload Banner, select Primary Colour
5. Organizer clicks "Save" → system creates the event in Draft status → organizer remains on the event configuration screen
6. System shows a success toast: "Event created"
7. **Edit path:** Organizer clicks an event from Event List → system opens the existing event form pre-populated with saved data
8. Organizer modifies fields → clicks "Save" → system updates the event
9. If Category changes → Event Type dropdown resets (dependent field)
10. After saving, organizer can navigate to Sessions tab, Tickets tab, or proceed to Publish

---

## 3. Screen Inventory

| Screen | Purpose |
|--------|---------|
| Event Form (Create) | Blank form for creating a new event with all required and optional fields |
| Event Form (Edit) | Pre-populated form for editing an existing event. Same layout as Create but with data filled in |

Note: Create and Edit are the same screen layout — the difference is whether fields are blank or pre-populated, and whether the save action calls Create or Update.

---

## 4. Layout & Composition

### Event Form
- **Top bar:** Back arrow (← to Event List) + Event Name as page title (or "New Event" for create) + Status badge (Draft/Published/Live/Closed) + "Save" primary button (top-right)
- **Tab navigation:** Below the top bar. Tabs: **Details** (this feature) | **Sessions** (Feature 3) | **Tickets** (Feature 4) | **Access** (Feature 5) | **Review & Publish** (Feature 6). The Details tab is active for this feature
- **Form body:** Full-width form with logical field groupings in sections, separated by section headers or dividers

**Field groupings (suggested section breaks):**
1. **Basic Information** — Event Name (EN/TC/SC), Category, Type
2. **Schedule** — Start Date & Time, End Date & Time, RSVP Deadline
3. **Location** — Venue (EN/TC/SC), Address (EN/TC/SC)
4. **Capacity** — Quota
5. **Description** — Description (EN/TC/SC) — rich text or textarea, each language as a tab or stacked input
6. **Branding** — Logo upload, Banner upload, Primary Colour picker

**Visual hierarchy guidance:**
- Primary focus: Basic Information section (event name is the first thing organizer fills)
- The Save button should be persistently visible (sticky top bar or sticky footer)
- Multilingual fields (EN/TC/SC) should use a tab pattern or clearly labelled stacked inputs — EN is always first and required
- Branding section is optional and can be collapsed or placed at the bottom

---

## 4.1. Sample Data (for design mockups)

### Event Form

| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Event Name | HKIDEAS 2026 — International Dental Exhibition | HKIDEAS 2026 — 國際牙科展覽 | HKIDEAS 2026 — 国际牙科展览 |
| Category | Exhibition | 展覽 | 展览 |
| Type | Expo | 博覽會 | 博览会 |
| Start Date & Time | 20 Mar 2026, 09:00 | 2026年3月20日 09:00 | 2026年3月20日 09:00 |
| End Date & Time | 22 Mar 2026, 18:00 | 2026年3月22日 18:00 | 2026年3月22日 18:00 |
| RSVP Deadline | 15 Mar 2026, 23:59 | 2026年3月15日 23:59 | 2026年3月15日 23:59 |
| Venue | HKCEC, Wan Chai | 灣仔會議展覽中心 | 湾仔会议展览中心 |
| Address | 1 Expo Drive, Wan Chai, Hong Kong | 香港灣仔博覽道1號 | 香港湾仔博览道1号 |
| Quota | 600 | 600 | 600 |
| Description | Asia's premier dental industry exhibition... (long paragraph) | 亞洲首屈一指的牙科行業展覽... | 亚洲首屈一指的牙科行业展览... |
| Logo | [Uploaded image preview: HKIDEAS logo] | — | — |
| Banner | [Uploaded image preview: event hero banner] | — | — |
| Primary Colour | #1A5276 (dark blue) | — | — |

**Data volume hints:**
- Event names: typically 20–80 characters (EN). TC/SC may be shorter
- Descriptions: typically 100–2000 characters. Max 5000 chars
- Address: typically 30–100 characters
- Logo: single image file
- Banner: single image file

---

## 5. Component Checklist

### Event Form
- [ ] Text Input — for Event Name (EN/TC/SC), Venue (EN/TC/SC), Address (EN/TC/SC)
- [ ] Textarea — for Description (EN/TC/SC), with character counter
- [ ] Dropdown / Select — for Event Category (9 options), Event Type (dependent, 4–5 options per category)
- [ ] Date-Time Picker — for Start Date & Time, End Date & Time, RSVP Deadline
- [ ] Number Input — for Quota (integer, min 1)
- [ ] File Upload — for Logo and Banner images, with preview
- [ ] Colour Picker — for Primary Colour (hex input + visual picker)
- [ ] Language Tab Group / Segmented Control — for switching between EN/TC/SC on multilingual fields
- [ ] Button (primary) — "Save"
- [ ] Button (secondary / ghost) — Back / Cancel
- [ ] Status Badge — Draft / Published / Live / Closed (read-only display)
- [ ] Toast / Snackbar — success and error feedback
- [ ] Section Header / Divider — to separate form field groups
- [ ] Inline Validation Error — per-field error messages
- [ ] Loading Skeleton — form placeholder while loading existing event data

---

## 5.1. Component Gap Analysis

| Component Needed | Exists in Design System? | Recommendation |
|-----------------|------------------------|----------------|
| Text Input | ✅ Yes | Use standard text input with label, helper text, and error state |
| Textarea with character counter | ⚠️ Partial — Textarea exists but character counter may need to be added | **Extend:** Add "X / 5000" character counter below the textarea. Show counter in red when approaching or exceeding limit |
| Dependent Dropdown (Category → Type) | ⚠️ Partial — Dropdown exists but cascading/dependent behaviour may not be documented | **Extend:** Document the dependent pattern: when Category changes, Type resets to empty and its option list updates. Needs a loading state during option refresh |
| Date-Time Picker | ⚠️ Partial — Date picker likely exists but may not support time selection | **Extend:** Add time selection (hour:minute) to the existing date picker, or use a separate time input alongside the date input. Confirm with design system owner |
| Colour Picker (hex) | ❌ No — unlikely to exist in current design system | **Option A — Compose:** Text Input (for hex code) + Colour Swatch preview square. **Option B — New component:** If a full colour picker with visual selector is desired, flag as a new component. For MVP, a hex text input with a preview swatch is sufficient |
| File Upload with image preview | ⚠️ Partial — File upload may exist but image preview (thumbnail after upload) may need a variant | **Extend:** Add image preview thumbnail after upload. Include: file name, file size, remove/replace button. For Logo: square thumbnail. For Banner: wide thumbnail |
| Language Tab Group (EN/TC/SC) | ⚠️ Partial — Tab component exists but a compact variant for inline field-level language switching may not | **Extend:** Use a segmented control or small tab variant placed above/beside the multilingual text input. Must clearly indicate which language is currently being edited and which languages have content filled |

---

## 5.2. Questions Before Design

> **Q1: Should multilingual fields (name, description, venue, address) use a tab pattern (switch between EN/TC/SC) or stacked inputs (all 3 visible at once)?**
> Context: Tab pattern saves vertical space but hides unfilled languages. Stacked inputs show everything but make the form very long (especially with 3 description fields of 5000 chars each). This decision affects every multilingual form across the entire B2B platform.
> Suggestion: Tab pattern for description (long text). Stacked inputs for name, venue, address (short text, organizers benefit from seeing all languages at once).

> **Q2: Is the form a single scrollable page with sections, or a multi-step wizard?**
> Context: A single page is faster for experienced organizers who know what they need. A wizard helps first-time organizers but adds friction for repeat use. The FDR implies a single page (journey steps 3–4 happen on the same "Event Setup" screen).
> Suggestion: Single scrollable page with anchor links or a mini-nav for section jumping. Not a wizard.

> **Q3: Should the "Save" action auto-close/redirect, or keep the organizer on the form?**
> Context: After creating a new event, the organizer needs to add sessions and ticket types (Features 3–4). If Save redirects to the Event List, the organizer must click back in. If Save keeps them on the form, they can navigate to the Sessions tab directly.
> Suggestion: Save keeps the organizer on the Event Configuration screen. Show a success toast. The tab navigation becomes available after the first save.

> **Q4: For branding fields (logo, banner, primary colour) — should these be in a collapsible section or always visible?**
> Context: Branding is optional. Many B2B events (OASES, RTIA) may not configure branding and will use Lepōs defaults. Showing branding fields always makes the form longer for no benefit in those cases.
> Suggestion: Collapsible section, collapsed by default, with a "Configure Branding" expand trigger. Show a preview of Lepōs default branding when collapsed.

> **Q5: What image formats and size limits apply to logo and banner uploads?**
> Context: The FDR specifies S3 URLs but does not state accepted file types, maximum file sizes, or recommended dimensions. The designer needs this to specify upload validation states and preview aspect ratios.
> Suggestion: Logo — square, max 2MB, PNG/JPG/SVG, recommended 400×400px. Banner — wide, max 5MB, PNG/JPG, recommended 1200×400px. Confirm with engineering.

---

## 6. Data & Field Specification

### Event Form — Input Fields

| # | Field | Required | Input Type | Constraints | Default | Multilingual | Behaviour Notes |
|---|-------|----------|-----------|-------------|---------|-------------|-----------------|
| 1 | Event Name (EN) | Yes | Text Input | Max 200 characters | None | Yes (EN required, TC/SC optional) | Inline validation: required on save. Character counter visible |
| 2 | Event Name (TC) | No | Text Input | Max 200 characters | None | Yes — Traditional Chinese | Optional. Falls back to EN on guest-facing surfaces if empty |
| 3 | Event Name (SC) | No | Text Input | Max 200 characters | None | Yes — Simplified Chinese | Optional. Falls back to EN on guest-facing surfaces if empty |
| 4 | Event Category | Yes | Dropdown (single-select) | Must be one of 9 fixed values | None — no default | No | Options: conference, exhibition, festival, gala, workshop, seminar, networking, ceremony, corporate. Required before save |
| 5 | Event Type | No | Dropdown (single-select) | Must be valid for the selected Category. See full mapping below | None | No | **Dependent on Category (#4).** Disabled until Category is selected. Resets to empty when Category changes. Options change dynamically per category. NULL is acceptable for MVP |
| 6 | Start Date & Time | Yes | DateTime Picker | Must be a future date/time (at publish time). start_at must be ≤ end_at | None | No | Inline validation if end_at is already set and start_at > end_at |
| 7 | End Date & Time | Yes | DateTime Picker | Must be ≥ Start Date & Time | None | No | Inline validation if start_at is set and end_at < start_at |
| 8 | RSVP Deadline | No | DateTime Picker | Must be < End Date & Time. Must be in the future (validated at publish time) | None — field left empty | No | Optional. If set, validated at publish time. Shown as helper text: "Leave empty if no RSVP deadline" |
| 9 | Venue (EN) | Yes | Text Input | Max 200 characters | None | Yes (EN required, TC/SC optional) | Required for publish. Inline validation on save |
| 10 | Venue (TC) | No | Text Input | Max 200 characters | None | Yes — Traditional Chinese | Optional |
| 11 | Venue (SC) | No | Text Input | Max 200 characters | None | Yes — Simplified Chinese | Optional |
| 12 | Address (EN) | No | Text Input | Max 300 characters | None | Yes (all optional) | Optional across all languages |
| 13 | Address (TC) | No | Text Input | Max 300 characters | None | Yes — Traditional Chinese | Optional |
| 14 | Address (SC) | No | Text Input | Max 300 characters | None | Yes — Simplified Chinese | Optional |
| 15 | Quota | Yes | Number Input | Integer. Must be > 0 | None | No | Required before publish. Inline validation: "Quota must be greater than 0" if 0 or negative entered. Organizer can update quota at any time, even post-publish |
| 16 | Description (EN) | No | Textarea | Max 5000 characters | None | Yes (all optional) | Character counter: "X / 5000". Displayed on guest-facing registration form |
| 17 | Description (TC) | No | Textarea | Max 5000 characters | None | Yes — Traditional Chinese | Character counter. Optional |
| 18 | Description (SC) | No | Textarea | Max 5000 characters | None | Yes — Simplified Chinese | Character counter. Optional |
| 19 | Logo | No | File Upload | Image file (PNG/JPG/SVG, confirm size limits with engineering) | None — Lepōs default logo used | No | Upload preview: square thumbnail. Remove/replace action. When empty, show placeholder with Lepōs default logo and "Upload your logo" prompt |
| 20 | Banner | No | File Upload | Image file (PNG/JPG, confirm size limits with engineering) | None — Lepōs default banner used | No | Upload preview: wide thumbnail. Remove/replace action. When empty, show placeholder with Lepōs default banner |
| 21 | Primary Colour | No | Colour Picker (hex input + swatch) | Valid hex colour code (e.g. #1A5276). 7 characters including # | #00B5AD (Lepōs teal) | No | Colour swatch preview updates in real-time as hex code is typed. Default to Lepōs teal when not set |

### Event Type Options per Category (for dropdown #5)

| Category | Type Options |
|----------|-------------|
| conference | summit, symposium, forum, congress |
| exhibition | trade_show, expo, showcase, fair |
| festival | food_and_beverage, music, arts, cultural, seasonal |
| gala | awards_ceremony, charity_dinner, annual_dinner, fundraiser |
| workshop | training, masterclass, hackathon, bootcamp |
| seminar | webinar, lecture, briefing, roundtable |
| networking | mixer, reception, meet_and_greet, business_matching |
| ceremony | opening, closing, graduation, launch |
| corporate | agm, board_meeting, town_hall, team_building |

### Event Form — Display-Only Fields

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Status | Badge | System state | Read-only badge in the top bar. Draft = neutral/grey, Published = info/blue, Live = success/green, Closed = muted/grey. Organizer cannot change this directly — status changes via Publish or Close actions |
| 2 | Event ID | Text | System generated | Not displayed to organizer. Internal use only |

---

## 7. Interactions & Behaviour

- **Select Category dropdown (#4)** → Event Type dropdown (#5) becomes enabled. Its option list populates with types for the selected category. If Type was previously set and the new category doesn't include it, Type resets to empty
- **Clear Category selection** → Event Type dropdown disables and clears
- **Type Start Date (#6) that is after End Date (#7)** → Show inline validation error on Start Date: "Start date must be before end date"
- **Type End Date (#7) that is before Start Date (#6)** → Show inline validation error on End Date: "End date must be after start date"
- **Type RSVP Deadline (#8) that is after End Date** → Show inline validation error: "RSVP deadline must be before event end date"
- **Type Quota (#15) as 0 or negative** → Show inline validation error: "Quota must be greater than 0"
- **Type in Description exceeding 5000 characters** → Character counter turns red. Prevent further input or show error on save
- **Upload Logo (#19)** → Show upload progress → on success, show square thumbnail preview with file name and a remove/replace button
- **Upload Banner (#20)** → Show upload progress → on success, show wide thumbnail preview with file name and a remove/replace button
- **Remove uploaded Logo/Banner** → Thumbnail removed. Placeholder restored showing Lepōs default
- **Type hex colour in Primary Colour (#21)** → Colour swatch updates in real-time. If invalid hex, swatch shows grey/empty with inline error
- **Click "Save"** → System validates required fields inline. If validation passes: save the event (create or update), show success toast ("Event saved"), remain on the form. If validation fails: scroll to first error, highlight all invalid fields
- **Click Back arrow** → If unsaved changes exist: show "Unsaved changes" confirmation dialog. Otherwise, navigate back to Event List

---

## 8. States

### Event Form (Create)
| State | Description |
|-------|-------------|
| Default / Empty | Blank form with all fields empty. Required field labels marked with asterisk. Tab navigation shows only "Details" tab as active — other tabs (Sessions, Tickets, etc.) appear but may be disabled until first save |
| Populated (partially filled) | Some fields filled, some empty. Character counters show current counts. Uploaded images show previews |
| Loading | N/A for create — form loads instantly blank |
| Error — Validation | One or more required fields are empty or invalid. Inline error messages appear below each invalid field. Form scrolls to first error |
| Error — System | Banner at top of form: "Unable to save event. Please try again." Save button re-enabled |
| Success | Toast notification: "Event created" or "Event saved". Form remains populated. Tab navigation becomes fully active |

### Event Form (Edit)
| State | Description |
|-------|-------------|
| Loading | Form skeleton with field placeholders while existing event data loads |
| Populated | All saved fields pre-populated. Status badge visible in top bar. All tabs active |
| Disabled / Read-only | When event status is Closed: all fields become read-only. Save button hidden. Show info banner: "This event is closed and cannot be edited" |
| Error — Validation | Same as Create validation error state |
| Error — System | Same as Create system error state |

---

## 9. Navigation & Routing

- **Entry point:** "Create Event" button from Event List; or click an event row from Event List
- **Exit points:** Back arrow → Event List; Tab navigation → Sessions (Feature 3), Tickets (Feature 4), Access (Feature 5), Review & Publish (Feature 6)
- **Back behaviour:** Back arrow returns to Event List. If unsaved changes, show confirmation dialog
- **Breadcrumb:** Home > B2B Events > [Event Name] > Details

---

## 11. Multilingual Notes

- Event Name, Description, Venue, and Address each have EN / TC / SC variants
- EN is always required for Name and Venue; TC and SC are optional
- All three languages are optional for Description and Address
- The designer should implement a consistent multilingual input pattern that will be reused across Sessions (Feature 3) and Ticket Types (Feature 4)
- For long text fields (Description), a tab-based language switcher is recommended
- For short text fields (Name, Venue, Address), stacked inputs labelled with language may be more efficient — confirm in Q1

---

## 12. Design Reminders

- [ ] **READ Section 5.2 (Questions Before Design) FIRST** — resolve all questions with product team before starting design work
- [ ] **CHECK Section 5.1 (Component Gap Analysis)** — Colour Picker marked ❌, Date-Time Picker marked ⚠️. Discuss with design system owner
- [ ] Use existing design system components — do not create new ones without checking the library first
- [ ] Use sample data from Section 4.1 in your mockups — not placeholder text
- [ ] The multilingual input pattern decided here will be reused across all B2B Event forms — get it right once
- [ ] Category → Type dependency is a core interaction. Ensure the dropdown refresh is smooth and the reset behaviour is clear
- [ ] Branding fields are optional — design the empty/default state clearly so organizers know what Lepōs defaults look like
- [ ] The form must work for both Create (blank) and Edit (pre-populated) — test both states in mockups
- [ ] Primary Colour picker fallback: Lepōs teal (#00B5AD) must be visually represented as the default state
