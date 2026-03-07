# Event Creation & Configuration

> Module: Module 0 — Event & Session Setup
> Persona: Organizer
> Upstream: Organizer authenticated, lands on B2B Events dashboard
> Downstream: Session Management, Ticket Type Configuration, Publish flow

---

## 1. Feature Summary

The organizer creates a new event as the foundational container for all subsequent configuration — sessions, tickets, branding, and registration. The event starts in Draft status and remains invisible to guests until published. This is the first step in every event setup workflow.

---

## 2. User Flow

1. Organizer is on the **B2B Events List** page → clicks "Create Event"
2. **Create Event Form** opens → organizer enters required fields: event name (English), category, type, start & end dates, venue, quota
3. Organizer optionally fills: description (up to 3 languages), RSVP deadline, branding (logo, banner, primary colour)
4. Category selection drives which Type options are available (dependent dropdown)
5. Organizer clicks "Save" → event created in Draft status → redirected to **Event Setup** page
6. On the Event Setup page, organizer can continue editing details, upload branding assets, and refine descriptions
7. Changes auto-save or save on explicit action (confirm with design system pattern)

---

## 3. Screen Inventory

| Screen | Purpose |
|--------|---------|
| B2B Events List | Dashboard showing all events for this business line — entry point |
| Create Event Form | Full form to capture all event details for initial creation |
| Event Setup — Details | Edit view for event metadata, description, branding after creation |

---

## 4. Layout & Composition

### B2B Events List
- Top bar with page title ("B2B Events") and "Create Event" primary action button
- Filterable/sortable table or card list showing all events
- Each row/card shows: event name, dates, status badge, category, registered count
- Empty state when no events exist yet

### Create Event Form
- Full-width form layout or centered content column (max ~800px for readability)
- Grouped into 4 sections: **Basic Info** (name, category, type), **Dates & Venue** (start, end, venue, address, RSVP), **Branding** (logo, banner, colour with live preview), **Quota** (registration quota)
- Category → Type as a dependent dropdown pair, placed side-by-side on wider screens
- Multilingual fields: language tabs above the field group — switching tab updates all multilingual fields at once
- File upload zones for logo (square aspect) and banner (landscape aspect)
- Colour picker for primary colour next to a branding preview panel
- Bottom action bar: sticky on scroll with "Cancel" (secondary) + "Create Event" (primary)
- **Primary focus:** Form fields — the action bar is secondary
- **Content density:** 21 input fields across 4 groups. Designer should ensure sections are collapsible or clearly separated to avoid visual overwhelm

### Event Setup — Details
- Same layout as Create form but in edit mode
- Status indicator visible at top (showing "Draft") — this is the **primary status signal** on the page
- Branding preview area on the right side or below the branding fields, showing uploaded logo/banner with primary colour applied
- Tab navigation at top: Details (this screen) | Sessions | Tickets | Review — to orient the organizer within the setup flow

---

## 4.1. Sample Data (for design mockups)

### B2B Events List

| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Event Name | RTIA Annual Summit 2026 | RTIA 年度峰會 2026 | RTIA 年度峰会 2026 |
| Event Category | Conference | — | — |
| Event Type | Summit | — | — |
| Start Date | 15 Mar 2026 | — | — |
| End Date | 17 Mar 2026 | — | — |
| Venue | Hong Kong Convention & Exhibition Centre | 香港會議展覽中心 | 香港会议展览中心 |
| Quota | 500 | — | — |
| Registered | 342 / 500 | — | — |
| Status | Published | — | — |

**Second row example (different status):**

| Field | Example Value |
|-------|--------------|
| Event Name | Wine & Dine Festival 2026 |
| Category | Festival |
| Type | Food & Beverage |
| Dates | 28 Oct – 1 Nov 2026 |
| Venue | Central Harbourfront |
| Quota | 2,000 |
| Registered | 0 / 2,000 |
| Status | Draft |

### Create Event Form

| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| Event Name | HKIDEAS 2026 International Design Exhibition | HKIDEAS 2026 國際設計展 | HKIDEAS 2026 国际设计展 |
| Description | Asia's premier design exhibition showcasing innovative products, sustainable materials, and emerging design talent from across the region. Features 200+ exhibitors, live demonstrations, and keynote sessions from industry leaders. | 亞洲首屈一指的設計展覽，展示創新產品、可持續材料及區內新興設計人才。設有逾200個參展商、現場示範及業界領袖主題演講。 | 亚洲首屈一指的设计展览，展示创新产品、可持续材料及区内新兴设计人才。设有逾200个参展商、现场示范及业界领袖主题演讲。 |
| Category | Exhibition | — | — |
| Type | Expo | — | — |
| Start Date & Time | 15 Mar 2026, 09:00 | — | — |
| End Date & Time | 17 Mar 2026, 18:00 | — | — |
| Venue Name | Hong Kong Convention & Exhibition Centre | 香港會議展覽中心 | 香港会议展览中心 |
| Address | 1 Expo Drive, Wan Chai, Hong Kong | 香港灣仔博覽道1號 | 香港湾仔博览道1号 |
| Quota | 500 | — | — |
| RSVP Deadline | 10 Mar 2026, 23:59 | — | — |
| Primary Colour | #00B5AD | — | — |

**Data volume hints:**
- A typical organizer manages **5–20 events** per year — design the list for this range, with pagination for heavier users
- Event names are usually **20–80 characters** in English; Chinese names are typically shorter (10–40 characters) but wider per character
- Descriptions range from **100–3,000 characters** in practice; the 5,000 max is a ceiling for edge cases
- Most events have **1–3 days** and **5–20 sessions** — this affects how "busy" the setup flow feels after creation
- Quota ranges from **50 (small ceremony) to 5,000+ (festival)** — number input should handle 4–5 digits comfortably

---

## 5. Component Checklist

### B2B Events List
- [ ] DataTable or CardList — event listing with sort, filter, and pagination
- [ ] StatusBadge — 4 variants: Draft (neutral), Published (info), Live (success), Closed (muted)
- [ ] Tag — event category display
- [ ] Button (primary) — "Create Event" top-right action
- [ ] EmptyState — no events illustration with "Create your first event" CTA
- [ ] SearchInput — free text filter on event name
- [ ] DropdownFilter — status filter (All/Draft/Published/Live/Closed)
- [ ] DropdownFilter — category filter (9 categories)
- [ ] Pagination — server-side with total count display

### Create Event Form / Event Setup — Details
- [ ] TextInput — Event Name per language (Fields #1, #2, #3), Venue Name per language (Fields #11, #12, #13), Venue Address per language (Fields #14, #15, #16). Max length enforcement with character counter
- [ ] Textarea — Event Description per language (Fields #4, #5, #6). Max 5,000 chars with live counter
- [ ] Select/Dropdown — Event Category (Field #7) with 9 fixed options
- [ ] Select/Dropdown — Event Type (Field #8) with category-dependent options. Supports disabled state with placeholder text
- [ ] DateTimePicker — Event Start (Field #9), Event End (Field #10), RSVP Deadline (Field #18)
- [ ] NumberInput — Registration Quota (Field #17). Integer only, min 1
- [ ] FileUpload — Logo (Field #19), Banner (Field #20). Drag-and-drop zone with image preview, remove, and replace actions
- [ ] ColourPicker — Primary Colour (Field #21). Includes hex text input + swatch preview. Shows default teal when empty
- [ ] Tabs or SegmentedControl — language switcher (EN / TC / SC) for multilingual field groups
- [ ] StatusBadge — event status indicator (read-only, top of page)
- [ ] Alert/Banner — inline validation errors per field
- [ ] Alert/Banner (system) — server error banner at top of form
- [ ] Button (primary) — "Create Event" / "Save" action
- [ ] Button (secondary) — "Cancel" action
- [ ] Toast/Snackbar — success feedback after creation or save
- [ ] ImagePreview — logo thumbnail, banner landscape preview, with fallback to platform default display
- [ ] ColourSwatch — primary colour preview in branding section
- [ ] HelperText — below optional fields (e.g. RSVP deadline, branding fields)

---

## 5.1. Component Gap Analysis

| Component Needed | Exists in Design System? | Recommendation |
|-----------------|------------------------|----------------|
| TextInput | ✅ Yes | Use existing. Configure with character counter, required indicator, and inline error variant |
| Textarea | ✅ Yes | Use existing. Configure with live character counter (max 5,000) |
| Select/Dropdown | ✅ Yes | Use existing. Needs: disabled state with placeholder, dynamic option loading for dependent dropdown |
| DateTimePicker | ⚠️ Partial — DatePicker likely exists, but combined date+time picker may not | **Extend:** Check if existing DatePicker supports time selection. If not, compose DatePicker + TimePicker side-by-side. Discuss with design system owner whether a combined DateTimePicker variant should be added |
| NumberInput | ✅ Yes | Use existing. Configure with integer-only, min value = 1 |
| FileUpload | ⚠️ Partial — basic upload may exist, but drag-and-drop with image preview may not | **Extend:** Check if existing FileUpload supports: drag-and-drop zone, image preview thumbnail, remove/replace actions. If not, flag to design system owner. For now, compose with Image + Button + DropZone |
| ColourPicker | ⚠️ Partial — may not exist in design system | **Option A — Compose:** TextInput (for hex code) + colour swatch preview square. **Option B — New component:** If frequently needed across the platform, flag as a new component request to design system owner |
| Branding Preview (composite) | ❌ No — this is feature-specific | **Compose:** Use Card + Image (logo thumbnail) + Image (banner landscape) + ColourSwatch. This is a composition of existing primitives, not a new component. Keep it feature-specific, do not add to design system |
| StatusBadge | ✅ Yes | Use existing. Need 4 colour variants: neutral (Draft), info (Published), success (Live), muted (Closed) |
| EmptyState | ✅ Yes | Use existing. Configure with illustration, title, description, and CTA button |
| DataTable | ✅ Yes | Use existing. Configure with sortable columns, row click action, and inline status badges |
| Tabs / SegmentedControl | ✅ Yes | Use existing. For language switcher (EN/TC/SC) within the form |
| Toast / Snackbar | ✅ Yes | Use existing. Success variant for creation/save confirmation |
| Alert / Banner | ✅ Yes | Use existing. Need: inline field-level error, and page-level system error banner |
| Pagination | ✅ Yes | Use existing. Server-side pagination with total count |

**Summary:** 3 components need extension discussion (DateTimePicker, FileUpload, ColourPicker). 1 feature-specific composition needed (Branding Preview). Designer should resolve ⚠️ items with design system owner before starting.

---

## 5.2. Questions Before Design

> **Q1: Should the Create Event flow be a full page form or a multi-step wizard?**
> Context: The form has 21 fields across 4 groups. A single-page form is simpler but can feel overwhelming. A step-by-step wizard (Basic Info → Dates → Branding → Confirm) is more guided but adds navigation complexity. The FDR doesn't specify which pattern to use.
> Suggestion: Single page with clearly separated sections and a sticky action bar. The form is manageable in one page if sections are well-grouped and optional sections (branding, RSVP) are visually de-emphasised.

> **Q2: How should multilingual input work — language tabs above each field, or one global language toggle for the entire form?**
> Context: 8 fields support EN/TC/SC (name, description, venue, address). If each field has its own language tabs, the form gets very busy. A single global toggle is cleaner but means the designer sees only one language at a time and may not realise content is missing in another language.
> Suggestion: One global language toggle (EN / TC / SC) at the top of the form that switches all multilingual fields at once. Show a small indicator dot on the tab if that language has any empty required fields.

> **Q3: What should the Branding Preview show exactly — a mini registration form header, or just the raw logo + banner + colour?**
> Context: The FDR says branding is "applied to registration form, confirmation email, and wallet pass." The designer needs to know whether to build a rich preview mimicking the guest-facing registration form header, or just show the three assets in isolation. A rich preview is more useful but harder to maintain.
> Suggestion: Show a simplified preview card with: banner as background, logo overlaid, primary colour applied to a sample button or header bar. Not a full registration form mockup.

> **Q4: When an event is in "Live" status, which fields can still be edited?**
> Context: The FDR mentions quota can be updated at any time and branding can change, but it's unclear whether dates, category, or venue can be changed on a live event. The designer needs to know which fields to show as locked vs editable.
> Suggestion: Allow editing of quota, branding, descriptions, and RSVP deadline on live events. Lock category, type, start date, and venue. Show a lock icon or disabled state on locked fields with tooltip "Cannot be changed while event is live."

> **Q5: Should the Events List default to a table view or a card view?**
> Context: The FDR says "B2B Events list page rendered" but doesn't specify the visual format. Tables are more data-dense and better for power users with 10+ events. Cards are more visual and better for at-a-glance scanning. The choice affects how much information is visible without clicking.
> Suggestion: Default to table view for organizer personas (data-heavy use case). Consider offering a view toggle (table / card) if the design system supports it.

> **Q6: What file formats and size limits apply to logo and banner uploads?**
> Context: The FDR says "S3 URL" but doesn't specify accepted file types, max file size, or recommended dimensions. The designer needs this to design the upload zone correctly (showing format hints, size warnings, and dimension recommendations).
> Suggestion: Clarify with engineering. Common defaults: PNG/JPG/SVG, max 5MB, recommended dimensions (e.g. logo 200×200px, banner 1200×400px).

---

## 6. Data & Field Specification

### B2B Events List — Display-Only Fields

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Event Name | Text | User input (English primary, TC/SC secondary) | Primary row text. Show English name. If TC or SC also exists, optionally show as secondary line or tooltip |
| 2 | Event Status | Badge | System-managed lifecycle | Badge with 4 variants: **Draft** (neutral/grey), **Published** (info/blue), **Live** (success/green), **Closed** (muted/grey). Only one active at a time |
| 3 | Event Category | Tag/Label | User input at creation | Display the category label (e.g. "Conference", "Exhibition"). Render as a tag or secondary text |
| 4 | Event Type | Tag/Label | User input at creation (optional) | Secondary to category. May be empty — if null, show category only without blank space |
| 5 | Event Start Date | Date | User input | Format as localised date (e.g. "15 Mar 2026"). Used in date range display |
| 6 | Event End Date | Date | User input | Display as range with start: "15 Mar – 17 Mar 2026". If same day, show single date |
| 7 | Venue Name | Text | User input (English primary) | Secondary row text. Show English venue name |
| 8 | Quota | Number | User input | Display as "X / Y registered" where X = total_registered (computed), Y = quota |
| 9 | Total Registered | Count | System computed (sum of registration counts across ticket types) | Displayed alongside quota as numerator. Real-time value |
| 10 | Session Count | Count | System computed (number of active sessions) | Optional column or metadata. e.g. "5 sessions" |

### B2B Events List — Computed / Summary Fields

| # | Field | Derivation | Visual Treatment |
|---|-------|-----------|-----------------|
| 1 | Total Registered | Sum of all registered_count across ticket types for this event | Number displayed as "X / Y" against quota. Update in near-real-time |
| 2 | Session Count | Count of active (non-deleted) sessions under this event | Small count badge or secondary text |
| 3 | Actual Start Date | Earliest start_at among all sessions (may differ from event start_at) | Only shown in detail view, not list |
| 4 | Actual End Date | Latest end_at among all sessions (may differ from event end_at) | Only shown in detail view, not list |

### B2B Events List — Filter & Pagination Fields

| # | Field | Input Type | Options / Constraints |
|---|-------|-----------|----------------------|
| 1 | Status Filter | Dropdown (single or multi-select) | Options: All, Draft, Published, Live, Closed |
| 2 | Category Filter | Dropdown (single or multi-select) | Options: Conference, Exhibition, Festival, Gala, Workshop, Seminar, Networking, Ceremony, Corporate |
| 3 | Search | Text input | Free text search on event name |
| 4 | Pagination | Page controls | Server-side pagination. Show total count. Page size configurable |

---

### Create Event Form / Event Setup Details — Input Fields

| # | Field | Required | Input Type | Constraints | Default | Multilingual | Behaviour Notes |
|---|-------|----------|-----------|-------------|---------|-------------|-----------------|
| 1 | Event Name (English) | **Yes** | Text input | Max 200 characters | None | Yes — EN required | Primary identifier. Must not be empty. Show character counter approaching limit |
| 2 | Event Name (Traditional Chinese) | No | Text input | Max 200 characters | None | Yes — TC optional | Shown in language tab. Empty is acceptable |
| 3 | Event Name (Simplified Chinese) | No | Text input | Max 200 characters | None | Yes — SC optional | Shown in language tab. Empty is acceptable |
| 4 | Event Description (English) | No | Textarea | Max 5,000 characters | None | Yes — EN optional | Show live character counter. Counter turns red when approaching or exceeding 5,000. Displayed on guest registration form |
| 5 | Event Description (Traditional Chinese) | No | Textarea | Max 5,000 characters | None | Yes — TC optional | Same counter behaviour as EN |
| 6 | Event Description (Simplified Chinese) | No | Textarea | Max 5,000 characters | None | Yes — SC optional | Same counter behaviour as EN |
| 7 | Event Category | **Yes** | Dropdown (single-select) | Must be one of the fixed list | None — must select | No | **Options:** Conference, Exhibition, Festival, Gala, Workshop, Seminar, Networking, Ceremony, Corporate. Selecting a category populates the Event Type dropdown. Changing category resets Event Type |
| 8 | Event Type | No | Dropdown (single-select) | Must belong to selected category. Disabled until category chosen | None | No | **Options per category:** Conference → Summit, Symposium, Forum, Congress · Exhibition → Trade Show, Expo, Showcase, Fair · Festival → Food & Beverage, Music, Arts, Cultural, Seasonal · Gala → Awards Ceremony, Charity Dinner, Annual Dinner, Fundraiser · Workshop → Training, Masterclass, Hackathon, Bootcamp · Seminar → Webinar, Lecture, Briefing, Roundtable · Networking → Mixer, Reception, Meet & Greet, Business Matching · Ceremony → Opening, Closing, Graduation, Launch · Corporate → AGM, Board Meeting, Town Hall, Team Building. Dropdown is disabled and shows placeholder "Select category first" until category is chosen |
| 9 | Event Start Date & Time | **Yes** | DateTime picker | Must be a future date/time at publish time | None — must select | No | Calendar picker + time selector. Used as boundary — sessions must fall within this range. Inline error if set in the past (at publish time) |
| 10 | Event End Date & Time | **Yes** | DateTime picker | Must be ≥ Start Date & Time | None — must select | No | Inline validation error if set before Start Date & Time. Also validated against RSVP Deadline (end must be after RSVP deadline) |
| 11 | Venue Name (English) | **Yes** | Text input | Max 200 characters | None | Yes — EN required | Must not be empty. Show character counter approaching limit |
| 12 | Venue Name (Traditional Chinese) | No | Text input | Max 200 characters | None | Yes — TC optional | Shown in language tab |
| 13 | Venue Name (Simplified Chinese) | No | Text input | Max 200 characters | None | Yes — SC optional | Shown in language tab |
| 14 | Venue Address (English) | No | Text input | Max 300 characters | None | Yes — EN optional | Optional supplementary address detail |
| 15 | Venue Address (Traditional Chinese) | No | Text input | Max 300 characters | None | Yes — TC optional | Shown in language tab |
| 16 | Venue Address (Simplified Chinese) | No | Text input | Max 300 characters | None | Yes — SC optional | Shown in language tab |
| 17 | Registration Quota | **Yes** | Number input | Integer, must be > 0. No decimals | None — must enter | No | Inline error if 0 or negative. This is the total event-level registration cap. Show helper text: "Maximum number of registrations allowed" |
| 18 | RSVP Deadline | No | DateTime picker | If set: must be before Event End Date & Time, and must be in the future at publish time | None (NULL = no deadline) | No | Optional field. When empty, no deadline is enforced. If set and invalid (after end date), show inline error. Can be cleared after initial set. Show helper text: "Leave empty for no deadline" |
| 19 | Logo | No | File upload (image) | Accepts image formats (PNG, JPG, etc.) | None (platform default logo used) | No | Show upload zone with drag-and-drop. After upload: show image preview thumbnail with "Remove" action. When empty: show placeholder text "Platform default logo will be used" with preview of default |
| 20 | Banner Image | No | File upload (image) | Accepts image formats (PNG, JPG, etc.) | None (platform default banner used) | No | Same upload pattern as logo. After upload: show landscape preview. When empty: show placeholder text "Platform default banner will be used" with preview of default |
| 21 | Primary Colour | No | Colour picker | 7-character hex code (e.g. #00B5AD) | #00B5AD (platform teal) | No | Colour picker with manual hex input field. Show colour swatch preview. When not set or cleared: revert to platform teal default. Apply preview to branding area if possible |

### Create Event Form / Event Setup Details — Display-Only Fields

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Event Status | Badge | System-managed | Shows "Draft" on creation. Read-only — organizer cannot change directly. Badge always visible at top of form |
| 2 | Event ID | Text (hidden from most views) | System-generated with prefix "b2evt_" | Not typically shown on form. May appear in URL or admin debug view only |

### Event Setup — Branding Preview (Composite Display)

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Logo Preview | Image | User upload or platform default | Thumbnail of uploaded logo. If none uploaded, show platform default logo with "(Default)" label |
| 2 | Banner Preview | Image | User upload or platform default | Landscape preview of uploaded banner. If none uploaded, show platform default with "(Default)" label |
| 3 | Colour Preview | Colour swatch | User selection or platform default | Swatch showing selected colour or default teal. Applied as accent in the preview area |
| 4 | Combined Branding Preview | Composite | Logo + Banner + Colour combined | Optional: show a mini-preview of how the registration form header will look with current branding settings |

---

## 7. Interactions & Behaviour

- **Category selected (Field #7)** → Event Type dropdown (Field #8) becomes enabled and populated with the category-dependent option list. If category changes, Event Type resets to empty. If category is cleared, Event Type becomes disabled again with placeholder "Select category first"
- **Event Type dropdown before category selected (Field #8)** → Dropdown is disabled, shows placeholder "Select category first"
- **End Date & Time set before Start Date & Time (Field #10 vs #9)** → Show inline validation error on End Date field: end must be ≥ start
- **RSVP Deadline set after Event End Date (Field #18 vs #10)** → Show inline validation error on RSVP Deadline field
- **RSVP Deadline set in the past (Field #18)** → Show inline validation error (enforced at publish time, but helpful to warn early)
- **RSVP Deadline cleared (Field #18)** → Field returns to empty state. Helper text visible: "Leave empty for no deadline"
- **End Date changed to before RSVP Deadline (Field #10 vs #18)** → Show inline validation error on End Date: "End date cannot be before RSVP deadline"
- **Description exceeds 5,000 characters (Fields #4, #5, #6)** → Character counter turns red. Show inline error. Block further typing or truncate with warning
- **Description approaching limit** → Character counter changes colour as warning (e.g. at 4,800+ characters)
- **Quota set to 0 or negative (Field #17)** → Show inline validation error immediately
- **Logo uploaded (Field #19)** → Show image preview thumbnail. Show "Remove" and "Replace" actions. Branding preview area updates
- **Logo removed (Field #19)** → Preview reverts to platform default logo with "(Default)" label
- **Banner uploaded (Field #20)** → Show landscape image preview. Show "Remove" and "Replace" actions. Branding preview area updates
- **Banner removed (Field #20)** → Preview reverts to platform default banner with "(Default)" label
- **Primary Colour selected (Field #21)** → Colour swatch updates. Branding preview area updates accent colour
- **Primary Colour cleared (Field #21)** → Revert to platform teal default (#00B5AD). Swatch shows default
- **Form submitted with missing required fields** → Scroll to first error field. Highlight all invalid fields with inline error messages. Do not submit
- **Form submitted with all required fields valid** → Show loading state on submit button. Disable form fields during submission. On success: navigate to Event Setup page with success toast. On server error: show system error banner at top, re-enable form
- **Language tab switched (multilingual fields)** → Input fields update to show content for selected language. Unsaved content in previous tab is preserved (not lost on switch)
- **Event in "Closed" status on Event Setup page** → All input fields become read-only/disabled. Edit actions hidden. Status badge shows "Closed"

---

## 8. States

### B2B Events List

| State | Description |
|-------|-------------|
| Empty | No events created yet — show empty state illustration with "Create your first event" CTA button. Filters and search still visible but inactive |
| Populated | Table/cards with event data. All columns from Display-Only Fields visible. Sortable by name, date, status. Filterable by status and category |
| Filtered — No Results | Filters applied but no matching events. Show "No events match your filters" with option to clear filters |
| Loading | Skeleton rows/cards matching the table column layout while event list loads |
| Error — System | Banner at top: "Unable to load events. Try again." Retry action available |

### Create Event Form

| State | Description |
|-------|-------------|
| Default | Blank form. All required field indicators (asterisk or label) visible. Event Type dropdown disabled with "Select category first". Branding section shows platform defaults in preview. Language tabs default to EN |
| Partially Filled | Some fields completed. Unfilled required fields not yet in error (errors shown only after first submit attempt). Language tabs show filled indicator on tabs with content |
| Validation Error | After submit attempt: inline errors on each invalid required field (Fields #1, #7, #9, #10, #11, #17). Scroll to first error. Cross-field errors shown: end < start, RSVP deadline conflicts. Description over 5,000 chars error |
| Submitting | Primary button shows spinner/loading. All form fields temporarily disabled. No duplicate submission |
| Error — System | Banner at top: "Unable to create event. Please try again." Form re-enabled for retry |

### Event Setup — Details (Edit Mode)

| State | Description |
|-------|-------------|
| Populated | All saved data pre-filled. Status badge shows "Draft". All fields editable. Branding preview shows current logo/banner/colour or defaults |
| Saving | Saving indicator visible (inline spinner or toast "Saving..."). Fields remain interactive or briefly disabled depending on design pattern |
| Save Success | Success toast shown briefly. Fields remain in edit mode |
| Validation Error | Same inline errors as Create form. Cross-field validation between RSVP deadline and end date |
| Error — System | Banner: "Unable to save changes. Please try again." |
| Read-Only (Closed Event) | All fields disabled/greyed out. Edit buttons hidden. Status badge shows "Closed". Informational banner: "This event is closed and cannot be edited" |
| Read-Only (Live Event) | Most fields editable (quota, branding, descriptions). Some fields locked (category, dates). Show lock icon or disabled state on locked fields |

---

## 9. Navigation & Routing

- **Entry point:** B2B Events List → "Create Event" button
- **After creation:** Redirect to Event Setup page (tabbed interface for Details, Sessions, Tickets, etc.)
- **Back behaviour:** Cancel on Create form → return to Events List (confirm discard if form is dirty)
- **Breadcrumb:** B2B Events → [Event Name] → Details

---

## 11. Multilingual Notes

- Event name, description, venue, and address all support three languages: English (EN), Traditional Chinese (TC), Simplified Chinese (SC)
- English is always required; TC and SC are optional
- Use language tabs or a segmented control to switch between language inputs — do not show all three simultaneously to avoid overwhelming the form
- Admin UI labels themselves should also render in all three languages (platform-level i18n)

---

## 12. Design Reminders

- [ ] **READ Section 5.2 (Questions Before Design) FIRST** — resolve all 6 questions with product team before starting design work. Q1 (page vs wizard) and Q2 (multilingual toggle) directly affect the form layout
- [ ] **CHECK Section 5.1 (Component Gap Analysis)** — 3 components marked ⚠️ (DateTimePicker, FileUpload, ColourPicker) need design system owner sign-off before you proceed
- [ ] Use existing design system components — do not create new ones without checking the library first
- [ ] Use sample data from Section 4.1 in your mockups — real event names, Chinese characters, realistic description lengths. Not "Lorem ipsum"
- [ ] Category → Type is a dependent dropdown — Type options change based on Category selection. **9 categories, each with 4–5 types.** Designer must account for all dropdown option lists
- [ ] Branding fields (logo, banner, colour) should show a live preview — see Q3 for preview scope
- [ ] RSVP deadline is optional — the form should not suggest it's required. Use helper text to clarify
- [ ] Quota is always required and must be > 0 — consider a sensible placeholder hint (e.g. "Enter maximum registrations")
- [ ] Event starts in Draft status — make the status badge prominent so organizers know the event isn't live
- [ ] Platform default branding (teal #00B5AD, default logo, default banner) must be visually communicated when organizer hasn't customised — don't just leave blank
- [ ] 21 input fields on the Create/Edit form — organise into logical groups (Basic Info, Dates & Venue, Branding, Quota) to avoid visual overwhelm
- [ ] Multilingual fields appear three times (EN/TC/SC) — use language tabs to keep form compact. Show missing-content indicator per language
- [ ] Character counters on description fields (5,000 max) and name fields (200 max) — show remaining count, not just current count
- [ ] Cross-field validation: End ≥ Start, RSVP deadline < End date, RSVP deadline > now. Designer must show which field is at fault
- [ ] Events List supports pagination — design for both small lists (5 events) and large lists (100+ events)
- [ ] Closed events should be clearly visually distinct in the list and in the edit view — greyed out or with a banner
- [ ] Chinese text is wider per character than English — test mockups with TC/SC sample data to ensure fields and layouts don't overflow
