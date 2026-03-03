# Invitation Management

> Module: Module 1 — Registration & RSVP
> Persona: Organizer
> Upstream: Event & Session Setup (Module 0) — requires published event with ticket types configured
> Downstream: RSVP Confirmation (Guest), Guest List Management (Organizer), Email Template Management (Organizer)

---

## 1. Feature Summary

Organizers invite guests to their event by importing a CSV of guest details and pre-assigned ticket types, then sending personalised invitation emails. This feature covers the full invitation lifecycle: bulk import with validation and preview, individual send actions, and tracking email engagement (opens, clicks, bounces) through a live-updating invitation list.

---

## 2. User Flow

1. Organizer navigates to Event → **Invitations** tab → sees the invitation list (empty state if first visit)
2. Organizer clicks **Import CSV** → import modal opens
3. Organizer uploads a CSV file → system parses and validates all rows
4. If validation errors exist → error rows highlighted with inline error messages; valid rows shown normally
5. Organizer reviews parsed preview → fixes or removes error rows → clicks **Confirm Import**
6. System creates invitation records → modal closes → invitation list refreshes with new entries (status: `pending`)
7. Organizer selects one or more invitations → clicks **Send Invitations**
8. System sends emails → invitation status updates to `sent`
9. As guests interact with emails → status updates automatically: `opened` → `clicked` → `confirmed` / `declined` / `bounced`
10. Organizer can filter and search the list by status, ticket type, or guest name
11. Organizer can export the invitation list

---

## 3. Screen Inventory

| Screen | Purpose |
|--------|---------|
| Invitation List | View, filter, search, and manage all guest invitations for an event |
| CSV Import Modal | Upload and validate a CSV file of guest invitations |
| Import Preview | Review parsed rows, see validation errors, confirm or cancel import |

---

## 4. Layout & Composition

### Invitation List
- Full-width data table with toolbar above
- Toolbar: search input (left), filter dropdowns (centre-left), action buttons (right: Import CSV, Send Invitations, Export)
- Table columns: checkbox, guest name, email, ticket types (badges), invitation status (badge), channel, last sent date, actions (resend, view)
- Bottom: pagination controls
- **Primary focus:** The invitation status column — organizer scans for engagement progress
- **Secondary:** Guest names and ticket type badges for quick identification

**Visual hierarchy guidance:**
- Status badges use colour to indicate engagement funnel: grey (pending), blue (sent), teal (opened), green (clicked/confirmed), red (bounced/declined)
- Ticket type badges match the colour_hex configured in Module 0

### CSV Import Modal
- Centred modal overlay (medium width ~640px)
- Step 1: file upload dropzone with format instructions
- Step 2: transitions to Import Preview (can be same modal expanded, or modal content swap)

### Import Preview
- Full-width within modal (may expand to large ~960px)
- Data table showing parsed rows with columns: row #, first name, last name, email, ticket types, status (valid/error)
- Error rows highlighted with red background or red left border; error message shown inline per row
- Summary bar at top: "X valid rows, Y errors"
- Footer: Cancel and Confirm Import buttons. Confirm disabled if all rows have errors

**Visual hierarchy guidance:**
- Primary focus: error summary count — organizer needs to know if import is clean
- Secondary: individual error rows for fixing

---

## 4.1. Sample Data (for design mockups)

### Invitation List
| Field | Example Value (EN) | Example Value (TC) | Example Value (SC) |
|-------|--------------------|--------------------|--------------------|
| First Name | Sarah | 嘉欣 | 嘉欣 |
| Last Name | Chen | 陳 | 陈 |
| Email | sarah.chen@example.com | sarah.chen@example.com | sarah.chen@example.com |
| Ticket Types | General Admission, Red Wine Tasting | 普通入場, 紅酒品鑑 | 普通入场, 红酒品鉴 |
| Invitation Status | clicked | 已點擊 | 已点击 |
| Channel | email | 電郵 | 电邮 |
| Last Sent | 15 Mar 2026, 10:30 AM | 2026年3月15日 上午10:30 | 2026年3月15日 上午10:30 |

### CSV Import Preview
| Field | Example Value |
|-------|---------------|
| Row # | 3 |
| First Name | David |
| Last Name | Wong |
| Email | david.wong@corp.hk |
| Ticket Type IDs | tkt_abc123\|tkt_def456 |
| Validation Status | ✓ Valid |
| Error Row Email | not-an-email |
| Error Message | Invalid email format |
| Error Row Ticket | tkt_nonexistent |
| Error Message | Unknown ticket type ID: tkt_nonexistent |

**Data volume hints:**
- A typical event has 50–500 invitations; large events (Wine & Dine, HKIDEAS) can have 1,000–5,000
- CSV imports typically contain 50–500 rows per batch
- Guest names are 2–30 characters; emails 10–60 characters
- A guest may have 1–3 pre-assigned ticket types

---

## 5. Component Checklist

### Invitation List
- [ ] Data Table — with row selection (checkboxes), sortable columns, inline status badges
- [ ] Search Input — text search for guest name or email
- [ ] Dropdown / Select — filter by invitation status, ticket type, channel
- [ ] Status Badge — 7 variants: pending, sent, opened, clicked, confirmed, declined, bounced
- [ ] Tag / Badge — ticket type badges with custom colour_hex
- [ ] Button (primary) — Send Invitations
- [ ] Button (secondary) — Import CSV, Export
- [ ] Pagination — standard page controls
- [ ] Checkbox — row selection for bulk actions
- [ ] Empty State — illustration + "No invitations yet. Import a CSV to get started."

### CSV Import Modal
- [ ] Modal / Dialog — medium to large width
- [ ] File Upload / Dropzone — CSV file upload with drag-and-drop
- [ ] Data Table — preview table with row validation status
- [ ] Alert / Banner (error) — row-level validation errors
- [ ] Alert / Banner (info) — summary: "X valid, Y errors"
- [ ] Button (primary) — Confirm Import
- [ ] Button (secondary) — Cancel
- [ ] Loading Skeleton — while CSV is being parsed

---

## 5.1. Component Gap Analysis

| Component Needed | Exists in Design System? | Recommendation |
|-----------------|------------------------|----------------|
| Data Table with row checkboxes | ✅ Yes | Use existing selectable table variant |
| Status Badge (7 invitation statuses) | ⚠️ Partial — badge component exists but may not have all 7 colour variants | **Extend:** Add colour mappings for pending (grey), sent (blue), opened (teal), clicked (green), confirmed (green-bold), declined (orange), bounced (red) |
| Ticket Type Badge with dynamic colour | ⚠️ Partial — tag component exists but needs to accept arbitrary hex colour | **Extend:** Add `colour_hex` prop to existing Tag component for organizer-defined colours |
| File Upload Dropzone | ✅ Yes | Use existing file upload component |
| Inline Row Error Highlight | ⚠️ Partial — table row states may not include error highlighting | **Extend:** Add error row variant to Data Table (red left border or light red background) |
| Import Summary Bar | ❌ No | **Compose:** Use existing Alert (info variant) with custom content showing "X valid, Y errors" counts |

---

## 5.2. Questions Before Design

> **Q1: Should the Import Preview show inside the same modal or navigate to a full-page review?**
> Context: For large imports (500+ rows), a modal table may feel cramped. A full-page preview allows better scrolling and error management. Getting this wrong means redesigning the import flow later.
> Suggestion: Use modal for <100 rows, full-page for ≥100 rows. Or always use a stepped modal that expands width on the preview step.

> **Q2: Can organizers edit individual rows in the import preview, or must they fix the CSV and re-upload?**
> Context: The FDR mentions "fix errors" in the preview step but doesn't specify whether inline editing is supported. Inline edit is more user-friendly but significantly more complex to design and build.
> Suggestion: MVP — re-upload only. Show clear error messages so organizer knows what to fix in the CSV.

> **Q3: How should multi-ticket type pre-assignment display in the invitation list — as multiple badges per row, a comma-separated list, or a "+N more" overflow pattern?**
> Context: A guest could have 1–3+ ticket types. If the column is too wide, the table layout breaks. If truncated too aggressively, organizers can't see ticket assignments at a glance.
> Suggestion: Show first 2 as badges + "+N" overflow chip. Full list on hover tooltip or row expansion.

> **Q4: Is the invitation list real-time updated (webhook pushes status changes live) or does the organizer need to refresh?**
> Context: Email engagement tracking (opens, clicks) happens asynchronously via webhooks. If the list auto-updates, the designer needs to account for status badge transitions and possibly subtle animations. If manual refresh, a "Refresh" button or pull-to-refresh pattern is needed.
> Suggestion: Auto-update with subtle badge colour transition (no animation needed — just re-render on data change).

---

## 6. Data & Field Specification

### Invitation List — Display Fields

| # | Field | Format | Source | Visual Treatment |
|---|-------|--------|--------|-----------------|
| 1 | Guest Name | Text | `first_name` + `last_name` from invitation | Concatenated: "Sarah Chen". Primary text weight |
| 2 | Email | Text | `email` from invitation | Secondary text colour, truncate with ellipsis if >30 chars |
| 3 | Salutation | Text | `salutation` from invitation | Displayed before name if present: "Dr Sarah Chen" |
| 4 | Phone | Text | `phone_country_code` + `phone_number` | Formatted: "+852 9123 4567". Hidden by default, shown in expanded row or detail |
| 5 | Preferred Language | Badge | `preferred_language` | Short code badge: EN / TC / SC |
| 6 | Ticket Types | Badges | `ticket_type_ids` resolved to ticket type names + colour_hex | One badge per ticket type, using the ticket's `colour_hex` as badge background |
| 7 | Invitation Status | Badge | `invitation_status` | Colour-coded badge: pending (grey), sent (blue), opened (teal), clicked (green), confirmed (green-bold), declined (orange), bounced (red) |
| 8 | Invitation Channel | Text/Badge | `invitation_channel` | email / whatsapp / manual — small label or icon |
| 9 | Last Sent Date | Date | Latest `sent_at` from send logs | Format: "15 Mar 2026, 10:30 AM". Show "Not sent" if no send log exists |
| 10 | Representative Type | Badge | `representative_type` | speaker / exhibitor / sponsor / attendee / media / vip — optional badge if set |
| 11 | WeChat ID | Text | `wechat_id` | Hidden by default, shown in expanded row or detail |
| 12 | Tags | Tags | `tags` JSONB | Shown as small tag chips if present |

### Invitation List — Filter & Pagination Fields

| # | Field | Input Type | Options / Constraints |
|---|-------|-----------|----------------------|
| 1 | Search | Text input | Searches across first_name, last_name, email |
| 2 | Invitation Status Filter | Multi-select dropdown | pending, sent, opened, clicked, confirmed, declined, bounced |
| 3 | Ticket Type Filter | Multi-select dropdown | All ticket types for this event (populated from Module 0) |
| 4 | Channel Filter | Single-select dropdown | email, whatsapp, manual |
| 5 | Page Number | Pagination | Standard pagination |
| 6 | Page Size | Dropdown | 25, 50, 100 |

### CSV Import — Input Fields (CSV Columns)

| # | Field | Required | Input Type | Constraints | Default | Multilingual | Behaviour Notes |
|---|-------|----------|-----------|-------------|---------|-------------|-----------------|
| 1 | First Name | Yes | Text (CSV column) | Max 100 chars | None | No | Mapped from CSV column `first_name` |
| 2 | Last Name | Yes | Text (CSV column) | Max 100 chars | None | No | Mapped from CSV column `last_name` |
| 3 | Email | Yes | Text (CSV column) | Max 255 chars, valid email format | None | No | Validated per row. Invalid emails reject the row |
| 4 | Salutation | No | Text (CSV column) | Max 20 chars. Values: Mr, Mrs, Ms, Dr, Prof | None | No | Free text in CSV but should match known values |
| 5 | Phone Country Code | No | Text (CSV column) | Max 5 chars, format: +NNN | None | No | e.g. +852, +86, +60 |
| 6 | Phone Number | No | Text (CSV column) | Max 20 chars, digits only | None | No | Without country code prefix |
| 7 | Ticket Type IDs | No | Text (CSV column) | Pipe-separated DocId values | None (guest selects at RSVP) | No | e.g. "tkt_abc123\|tkt_def456". All IDs validated against event's ticket types. Sub-event tickets require parent event ticket in same row |

### Invitation List — Computed / Summary Fields

| # | Field | Derivation | Visual Treatment |
|---|-------|-----------|-----------------|
| 1 | Send Count | Count of send log records for this invitation | Small counter if >1 (indicates resends) |
| 2 | Open/Click Status | MAX status across all send logs (watermark) | Reflected in the invitation status badge |

---

## 7. Interactions & Behaviour

- **Organizer uploads CSV** → file dropzone shows file name and size → system begins parsing → loading state on preview table
- **CSV parse completes with errors** → error summary banner appears: "42 valid, 8 errors" → error rows highlighted in red → error message shown per row
- **CSV parse completes with no errors** → success summary: "50 valid rows" → Confirm Import button enabled
- **Organizer clicks Confirm Import** → loading spinner on button → invitation list refreshes with new entries → success toast: "50 invitations imported"
- **Organizer selects invitations via checkboxes** → Send Invitations button shows count: "Send (12)" → click sends → status updates to `sent` → success toast
- **Organizer clicks Send on a single row** → confirmation: "Send invitation to Sarah Chen?" → send → status badge transitions from `pending` to `sent`
- **Webhook updates arrive** → status badges update in-place (no page refresh needed): `sent` → `opened` → `clicked`
- **Organizer clicks on a row** → expands to show full detail: phone, WeChat ID, tags, send history log, ticket type details
- **Organizer filters by status** → table filters immediately; pagination resets to page 1
- **Bulk import with prerequisite violation** → row shows error: "Sub-event ticket 'Wine Tasting' requires parent event ticket. Add the event-level ticket ID to this row."

---

## 8. States

### Invitation List
| State | Description |
|-------|-------------|
| Default / Empty | No invitations yet. Empty state illustration with message: "No invitations yet" and prominent Import CSV button |
| Populated | Table showing invitation rows with status badges, pagination active |
| Loading | Table skeleton while invitation data loads |
| Filtered — No Results | Table is empty after applying filters. Show: "No invitations match your filters" with a Clear Filters button |
| Bulk Selection Active | One or more rows selected via checkboxes. Send Invitations button shows selected count |
| Error — System | Banner at top: "Failed to load invitations. Please try again." |

### CSV Import Modal
| State | Description |
|-------|-------------|
| Default | Dropzone visible, no file uploaded. Instructions: "Upload a CSV file with columns: first_name, last_name, email, salutation, phone_country_code, phone_number, ticket_type_ids" |
| File Uploading | Progress indicator while file is being uploaded and parsed |
| Preview — All Valid | All rows pass validation. Summary: "50 valid rows". Confirm Import enabled |
| Preview — Partial Errors | Mix of valid and error rows. Error rows highlighted. Summary: "42 valid, 8 errors". Confirm Import enabled (imports valid rows only) |
| Preview — All Errors | All rows have errors. Summary: "0 valid, 50 errors". Confirm Import disabled |
| Importing | Confirm clicked, system creating records. Loading overlay on modal |
| Error — File Format | Uploaded file is not a CSV or is malformed. Alert banner: "Invalid file format. Please upload a .csv file." |

---

## 9. Navigation & Routing

- **Entry point:** Event detail page → Invitations tab (tab navigation within event management)
- **Exit points:** Organizer stays within Invitations tab after import/send. Can navigate to Guest List tab, Reminders tab, or back to Event list
- **Back behaviour:** Closing the import modal returns to the invitation list without changes (unless import was confirmed)
- **Breadcrumb:** Events > [Event Name] > Invitations

---

## 10. Responsive Considerations (optional)

This feature is primarily desktop (organizer portal). On tablet widths, the data table should horizontally scroll. The CSV import modal should remain functional but may need full-screen treatment on smaller screens.

---

## 11. Multilingual Notes (optional)

- The invitation list UI is in the organizer's portal language
- Guest-facing fields (preferred_language) are stored per invitation and drive email template language selection — but this is not visible in the UI beyond displaying the language badge
- Ticket type names may be multilingual (from Module 0). Display in the organizer's preferred language

---

## 12. Design Reminders

- [ ] **READ Section 5.2 (Questions Before Design) FIRST** — resolve all questions with product team before starting design work
- [ ] **CHECK Section 5.1 (Component Gap Analysis)** — if any components are marked ❌ or ⚠️, discuss with design system owner before designing
- [ ] Use existing design system components — do not create new ones without checking the library first
- [ ] Use sample data from Section 4.1 in your mockups — not placeholder text
- [ ] Status badge colours must be distinct and accessible — 7 statuses need 7 visually distinguishable colours
- [ ] CSV column format must be clearly documented in the import modal — organizers will create CSVs from Excel/Google Sheets
- [ ] Pipe-separated ticket_type_ids in CSV is a technical format — consider showing resolved ticket type names in the preview, not raw IDs
- [ ] Invitation send is irreversible — ensure confirmation before bulk send
- [ ] Excluded pending decision: Q-5 (bring-along sub-event access) — do not design for this
