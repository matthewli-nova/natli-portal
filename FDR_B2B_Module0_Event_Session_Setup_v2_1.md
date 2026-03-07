# Lepōs Platform

## Functional Detail Requirement

### B2B Event Module

### Module 0: Event & Session Setup

Prerequisite for all B2B Event modules

| Field | Value |
|---|---|
| **Document Version** | v2.1 |
| **Status** | Draft — Structural Revamp + Area Preview |
| **Module** | B2B Event — Event & Session Setup |
| **Depends On** | None — root prerequisite module |
| **Downstream Modules** | Module 1: Registration & RSVP (NOTE: Module 1 v1.8 required — t_b2b_registrations.ticket_type_id single FK replaced by t_b2b_registration_tickets junction table), Badge Print, Admission, Lead Capture, Campaign Activation |
| **Target Events** | HKIDEAS 2026, RTIA Annual Summit, OASES, Wine & Dine Festival |
| **Author** | Product Team — Lepōs |
| **Last Updated** | February 2026 |
| **Codebase** | lepos-platform-services-v2 — PostgreSQL, Rust tonic gRPC, fn_api_* SQL pattern |
| **Changes from v1.9** | **STRUCTURAL REVAMP (v2.0):** Sub-events promoted from session nesting (`parent_session_id`) to first-class entity (`t_event_sub_events`). Main Event sessions sit directly under `t_events` — Main Event is the event itself, NOT a default sub-event. New table `t_event_sub_events` introduced. `t_event_sessions` restructured: `parent_session_id` and `depth` removed, `sub_event_id` added (nullable FK). `t_ticket_types` updated: `sub_event_id` added for sub-event-scoped tickets. New gRPC methods: CreateSubEvent, ListSubEvents, UpdateSubEvent, DeleteSubEvent. New SQL functions: `fn_api_b2b_sub_event_*`. Publish validation rules updated for sub-event entity. Test case count increased from 99 to 122. **v2.1 additions:** Area entity introduced as Module 0 foundation — `t_event_areas` table + `t_area_ticket_type_access` junction table defined in Module 0, Area Permission Matrix UI deferred to Module 3 (Access tab). Portal tab structure documented (6 tabs). Ticket type quota validation changed to >= 0 (quota = 0 = defined but not accepting registrations). `access_scope` marked as hidden from organizer UI. Public Guest / Organizer-Staff ticket grouping documented as UI-only. |

---

## 1. Overview

### 1.1 Purpose

This document defines the functional requirements for the Event & Session Setup module — the foundational configuration layer of the Lepōs B2B Event platform. No other module (Registration, Badge Print, Admission, Lead Capture, Campaign Activation) can operate without a correctly configured event and session structure.

### 1.2 Module Position in the B2B Stack

| Order | Module | Dependency |
|---|---|---|
| 0 | Event & Session Setup (this module) | None — root module |
| 1 | Registration & RSVP | Requires Event + Sub-event (if applicable) + Session + Ticket Types |
| 2 | Badge Print | Requires valid Registration record |
| 3 | Admission / Access Control | Requires Event + Session + valid Registration |
| 4 | Exhibitor Lead Capture | Requires Event + Exhibitor profiles |
| 5 | Campaign Activation | Requires Event + Campaign configuration |

### 1.3 Data Hierarchy

| Level | Entity | Table | Example |
|---|---|---|---|
| Level 1 | Event | `t_events` | Wine & Dine Festival 2026 |
| Level 2 | Sub-event (optional) | `t_event_sub_events` | Red Wine Tasting / Beer Garden |
| Level 3 | Session | `t_event_sessions` | Day 1 Opening Ceremony / Red Wine Fri 7pm |

**Hierarchy Diagram:**

```
Event (t_events) — Wine & Dine Festival 2026
├── Main Event Sessions (t_event_sessions WHERE sub_event_id IS NULL)
│   ├── Session: Day 1 Opening Ceremony
│   ├── Session: Day 2 Main Stage
│   └── Session: Day 3 Closing Ceremony
├── Sub-event: Red Wine Tasting (t_event_sub_events)
│   ├── Session: Red Wine Fri 7pm
│   └── Session: Red Wine Sat 7pm
└── Sub-event: Beer Garden (t_event_sub_events)
    └── Session: Beer Garden All Day Sat
```

> **Confirmed — Main Event is the Event Itself:** The "Main Event" is not a sub-event. It is the event itself (`t_events`). Sessions that belong directly to the event (without any sub-event container) are "Main Event Sessions." They sit on `t_event_sessions` with `sub_event_id = NULL`. Sub-events are a separate, optional first-class entity.

> **Confirmed — Sub-events Are First-Class Entities:** Sub-events are stored in `t_event_sub_events` — a dedicated table, not a session variant. Each sub-event can contain its own sessions with independent capacity, schedule, and ticket types. Sub-events inherit all config (venue, branding, date range) from the parent event.

> **Confirmed — OASES Single-Session Structure:** OASES is a single-day, single-session ceremony (~600 guests). A 1-session event with zero sub-events is simply the minimal valid configuration. No flat-event mode exists — the model stays consistent across all event types.

> **Confirmed — No Day Entity:** The Day concept was removed in v1.7. Sessions carry a `session_date DATE` field for UI grouping purposes. The portal groups sessions by `session_date` in the schedule view — this is a display concern, not a data model entity.

---

## 2. Scope

### 2.1 In Scope (MVP)

- Event creation and configuration (name, description, dates, venue, branding, languages, quota, category, type)
- Sub-event creation as a first-class entity within an event (name, description, image, additional fee, sort order)
- Sub-events inherit venue, branding, and date range from parent event — no override
- Session creation and configuration within an event or within a sub-event (with `session_date` for date grouping)
- Session capacity (quota) control per session
- Session access type: Admission Required or Open to All
- Ticket type definition with scope (event-level or sub-event-level) and mapping to sessions
- Ticket type prerequisite enforcement (sub-event tickets require parent event ticket)
- Event status lifecycle: Draft → Published → Live → Closed
- Multi-language support: English, Traditional Chinese, Simplified Chinese
- Organizer-configurable branding per event (logo, banner, primary colour)
- Lepōs default branding fallback when organizer branding not configured
- Event category and type classification (fixed taxonomy)
- Ticket product type hook on sessions for future ticketing module (Section 6.10)
- **Area entity foundation (v2.1):** `t_event_areas` table and `t_area_ticket_type_access` junction table are defined and created in Module 0. Organizers can create, list, update, and delete areas via API. Default areas are seeded on event creation. The Area Permission Matrix UI (Access tab) and scanner enforcement logic are owned by Module 3.

### 2.2 Out of Scope (Explicitly Excluded from MVP)

- Area Permission Matrix UI (Access tab) — the organizer-facing UI for configuring which ticket types can access which areas is owned by Module 3. Module 0 provides the data foundation only (tables + CRUD APIs).
- Area scanner enforcement logic — deferred to Module 3 (Admission / Access Control)
- Sub-event branding override (sub-events inherit parent event branding)
- Sub-event independent venue/date range override
- Recurring events / recurring sessions (`event_mode` and `session_type` columns present but default to 'single')
- Session occurrence materialization (`t_b2b_session_occurrences` deferred to future FDR)
- External calendar sync (Google Calendar, iCal)
- Paid ticket payment processing (free registration only for MVP)
- Session waitlist management
- Public event discovery / event listing page
- `store_id` / `device_id` scoping — B2B events are not scoped to POS stores or devices
- External platform ticketing integration (Ticketmaster, Cityline) — CSV import used instead
- Offline scanner / admission handling — deferred to Admission module

---

## 3. User Stories

### 3.1 Organizer — Event Management

| ID | User Story | Acceptance Criteria |
|---|---|---|
| E-01 | As an organizer, I want to create a new event so that I have a container to configure all event details before publishing. | Event saved in Draft status; organizer can continue editing before publishing; event not visible to guests until Published. |
| E-02 | As an organizer, I want to set a registration quota at the event level so that attendance does not exceed venue capacity. | Quota field required before publishing; Registration module enforces this quota in real-time; organizer can update quota at any time. |
| E-03 | As an organizer, I want to configure event branding (logo, banner, primary colour) so that all guest-facing materials feel consistent with my event identity. | Branding applied to registration form, confirmation email, and wallet pass; Lepōs default applied if not configured. |
| E-04 | As an organizer, I want to publish an event so that the registration form goes live and guests can register. | Publish action validates all required fields; on publish, registration form URL becomes active; status changes to Published. |
| E-05 | As an organizer, I want to close an event so that no further registrations are accepted after the event ends. | Manual close available at any time; automatic close triggered at event end date + 24 hours; closed event registration form shows 'Event has ended' message. |
| E-06 | As an organizer, I want to set a hard RSVP deadline so that the guest list locks in time for badge pre-printing and counter briefing. | RSVP deadline field optional; if set, must be before event end date; Module 1 registration form automatically closes at deadline timestamp. |
| E-07 | As an organizer, I want to categorize my event (conference, exhibition, festival, etc.) so that the platform can apply appropriate defaults and reporting. | Event category required; event type dependent on category; both stored and returned in API responses. |
| E-08 | As an organizer, I want to add a description to my event so that guests understand what the event is about before registering. | Description supports trilingual input; max 5000 chars per language; displayed on registration form. |

### 3.2 Organizer — Sub-event Management

| ID | User Story | Acceptance Criteria |
|---|---|---|
| SE-01 | As an organizer, I want to create sub-events within my event so that I can organize distinct experiences (e.g. Red Wine Tasting, Beer Garden) under one umbrella event. | Sub-event created as a first-class entity in `t_event_sub_events`; requires name (EN); optional description, image, additional fee. |
| SE-02 | As an organizer, I want each sub-event to have its own image and description so that guests can browse and understand each experience before registering. | Image (S3 URL) and trilingual description stored on `t_event_sub_events`; displayed on registration form and event catalogue. |
| SE-03 | As an organizer, I want to set an additional fee on a sub-event so that premium experiences can be priced separately on top of general admission. | Additional fee stored as reference value on `t_event_sub_events`; enforced by future Price Book module. NULL = included in parent ticket (no extra cost). |
| SE-04 | As an organizer, I want to reorder sub-events so that the most important ones appear first in the guest-facing catalogue. | `sort_order` on `t_event_sub_events`; portal allows drag-and-drop reordering. |
| SE-05 | As an organizer, I want to delete a sub-event so that I can remove cancelled experiences before publishing. | Soft delete. Blocked if any session under this sub-event has `admitted_count > 0`. All child sessions must be deleted first OR cascade soft-delete. |

### 3.3 Organizer — Session Management

| ID | User Story | Acceptance Criteria |
|---|---|---|
| S-01 | As an organizer, I want to create sessions within the main event so that I can define the individual agenda items guests can attend. | Session requires: name, date, start time, end time, access type, capacity. `sub_event_id = NULL` for main event sessions. Sessions grouped by date in UI. |
| S-02 | As an organizer, I want to create sessions within a sub-event so that each sub-event has its own schedule and capacity control. | Session created with `sub_event_id` referencing the sub-event. Session inherits event_id from sub-event's parent event. |
| S-03 | As an organizer, I want to set a capacity for each session so that I can control overcrowding in specific rooms. | System warns (does not block) if sum of session capacities exceeds event quota. |
| S-04 | As an organizer, I want to mark certain sessions as Admission Required so that only registered guests with the correct ticket type can enter. | Admission Required sessions require at least one permitted ticket type before the event can be published. |
| S-05 | As an organizer, I want to mark certain sessions as Open to All so that any attendee at the event can walk in freely. | Open to All sessions allow entry without ticket type validation; still tracked for headcount. |

### 3.4 Organizer — Area Management *(NEW in v2.1)*

| ID | User Story | Acceptance Criteria |
|---|---|---|
| A-01 | As an organizer, I want a default "Event Space" area to exist when I create an event so that I have a starting point for access control. | Default area seeded automatically on event creation with code `EVT` and `is_default = true`. |
| A-02 | As an organizer, I want to add custom areas (e.g. VIP Lounge, Backstage) so that I can define physical zones for granular access control. | Area created with name, code (unique within event, max 10 chars), and sort order. |
| A-03 | As an organizer, I want to delete areas I don't need so that the access matrix stays clean and relevant. | Soft delete. Default areas can be deleted. Area-ticket mappings cleaned up on delete. |
| A-04 | As an organizer, I want to assign ticket types to areas so that only guests with the right ticket can enter specific zones. | Area-ticket mapping managed via `t_area_ticket_type_access` junction. Full set replacement per area. |

> **Module Boundary — Areas:** Module 0 provides area CRUD and the mapping data layer. The Access tab UI (matrix visualization) and scanner-side enforcement are owned by Module 3.

> **Module Boundary:** Module 0 ends when the event is Published. The Registration form URL becomes active at that point — guest interaction begins in Module 1.

---

## 4. Organizer User Journey

This section traces the complete organizer workflow through Module 0 — from first login to event published and live.

### 4.1 Portal Tab Structure

The event setup portal uses a 6-tab wizard. Module 0 owns 5 of the 6 tabs. The Access tab is owned by Module 3 (Admission / Access Control).

| Tab # | Tab Name | Module Owner | Description |
|---|---|---|---|
| 1 | Details | Module 0 | Event name, category, type, dates, venue, quota, RSVP deadline |
| 2 | Branding | Module 0 | Logo, banner, primary colour |
| 3 | Sessions & Sub-Events | Module 0 | Main event sessions, sub-events, sub-event sessions |
| 4 | Ticket Types | Module 0 | Public Guest Tickets and Organizer / Staff Tickets |
| 5 | Access | **Module 3** (data foundation: Module 0) | Area Permission Matrix (physical zones) + session-ticket mapping. Module 0 provides `t_event_areas` + `t_area_ticket_type_access` tables and CRUD APIs. Module 3 owns the UI, matrix interaction, and scanner enforcement. |
| 6 | Review & Publish | Module 0 | Pre-publish validation, event summary, publish action |

> **Branding as Separate Tab:** Branding configuration (logo, banner, primary colour) was previously part of the Details tab. It is now its own dedicated tab in the portal wizard. The data model is unchanged — all branding fields remain on `t_events`.

> **Ticket Types — UI Grouping:** The Ticket Types tab displays two tables: "Public Guest Tickets" and "Organizer / Staff Tickets." This is a **UI-only grouping** — there is no `ticket_category` column in `t_ticket_types`. The portal determines grouping based on application logic (e.g. naming convention or a future UI-only flag). The data model treats all ticket types identically.

> **`access_scope` — Hidden from UI:** The `access_scope` column remains in `t_ticket_types` for backend use (scanner shortcut logic). However, it is **not exposed** in the organizer-facing portal for MVP. Default is `'custom'` for all ticket types. The `'all_sessions'` shortcut may be set programmatically for specific use cases (e.g. Organizer/Staff tickets) but is not configurable by the organizer in Module 0. The Access tab (Module 3) may expose this in the future.

### 4.2 Journey Overview

| Phase | Stage | Outcome |
|---|---|---|
| 1 | Login & Navigate | Organizer authenticated, lands on B2B Events dashboard |
| 2 | Create Event | Event record created with status = draft, category and type set |
| 3 | Configure Details | Description, branding, languages configured |
| 4 | Add Main Event Sessions | Sessions added with dates, times, rooms, access types, capacities (sub_event_id = NULL) |
| 5 | Add Sub-events (optional) | Sub-events created with name, description, image, additional fee |
| 6 | Add Sub-event Sessions | Sessions added under each sub-event with their own schedule and capacity |
| 7 | Define Ticket Types | Event-level and sub-event-level ticket types created |
| 8 | Map Tickets to Sessions | Each Admission Required session assigned permitted ticket types |
| 9 | Pre-Publish Review | Organizer reviews full configuration; system surfaces validation warnings |
| 10 | Publish | All validation rules pass; event transitions to Published; registration URL active |
| 11 | Post-Publish Management | Organizer monitors registrations, adjusts quota/sessions if needed, eventually closes event |

### 4.3 Detailed Step-by-Step Journey

| # | Step | Actor / Screen | Organizer Action | System Response |
|---|---|---|---|---|
| 1 | Login | Organizer / Login Page | Navigate to Lepōs Admin Portal. Enter credentials. | JWT issued. Redirected to home dashboard. RBAC scope resolved from token. |
| 2 | Navigate to B2B Events | Organizer / Home Dashboard | Select Business Line. Click 'B2B Events' in left navigation. | B2B Events list page rendered. Shows all events for this business_line_id. |
| 3 | Create New Event | Organizer / New Event Form | Click 'Create Event'. Enter: Event name (EN required), category, type, start & end dates, venue, quota. Optional: description, RSVP deadline, branding. | fn_api_b2b_event_create called. Event record inserted with status = draft. |
| 4 | Configure Details | Organizer / Event Setup — Details | Enter description (EN/TC/SC). Upload logo, banner. Select primary colour. Set RSVP deadline if needed. | Fields saved to t_events via fn_api_b2b_event_update. |
| 5 | Add Main Event Sessions | Organizer / Event Setup — Sessions & Sub-Events | Click 'Add Session' under Main Event Sessions. Enter: name, session_date, start/end time, room, access type, capacity. Repeat for all main event sessions. | fn_api_b2b_event_session_create called with sub_event_id = NULL. Sessions grouped by session_date in UI. |
| 6 | Add Sub-events | Organizer / Event Setup — Sessions & Sub-Events | Click 'Add Sub-event'. Enter: name (EN required), description, image, additional fee. | fn_api_b2b_sub_event_create called. Sub-event record inserted in t_event_sub_events. |
| 7 | Add Sub-event Sessions | Organizer / Event Setup — Sessions & Sub-Events | For each sub-event, click 'Add Session'. Enter: name, session_date, start/end time, room, access type, capacity. | fn_api_b2b_event_session_create called with sub_event_id set. Session linked to sub-event. |
| 8 | Create Ticket Types | Organizer / Event Setup — Ticket Types | Click 'Add Ticket Type'. Enter: name, colour, quota. Set ticket_scope (event or sub_event). For sub_event tickets: select parent ticket type AND select target sub-event. | fn_api_b2b_ticket_type_create called. registered_count initialized to 0. sub_event_id stored for sub-event-scoped tickets. |
| 9 | Map Tickets to Sessions | Organizer / Event Setup — Access | For each Admission Required session: click 'Assign Ticket Types'. Select which ticket types may enter. | fn_api_b2b_session_ticket_types_set called. Junction records created. |
| 10 | Review Configuration | Organizer / Event Setup — Review & Publish | Click 'Preview'. Review full event summary. | System displays preview. Highlights any validation issues. |
| 11 | Publish | Organizer / Event Setup — Review & Publish | Click 'Publish Event'. | fn_api_b2b_event_publish runs all validation rules atomically. On success: status = published. |
| 12 | Post-Publish | Organizer / Event Dashboard | Monitor registrations, adjust quotas, eventually close event. | Dashboard reads registered_count and admitted_count in real-time. |

### 4.4 Error & Edge Case Flows

| Scenario | Organizer Experience | System Behaviour |
|---|---|---|
| Session date outside event range | Date picker shows warning. Save blocked. | fn_api_b2b_event_session_create returns error. |
| Session capacity exceeds event quota | Yellow warning banner shown. Save NOT blocked. | SQL function inserts session but returns warning flag. |
| Publish with no sessions | Publish blocked. Error message returned. | Validation rule fails. |
| Publish with unmapped admission session | Publish blocked. Error names the specific session. | Validation rule fails with session name. |
| Delete ticket type with registrations | Delete blocked. System shows registration count. | blocked_reason returned. |
| Session with start_at after end_at | Form validation rejects. Inline error. | SQL function returns validation error. |
| Delete sub-event with active sessions | Delete blocked. System shows session count. | blocked_reason: 'Remove all sessions in this sub-event before deleting.' |
| Sub-event session created without sub_event_id | Session created as Main Event session. | sub_event_id = NULL. Valid — this is a main event session. |
| Sub-event additional_fee on simple event | Additional fee stored on sub-event. | Stored as reference value. Future Price Book enforces. |

### 4.5 Post-Event Day Timeline

| Trigger | Status Transition | Effect |
|---|---|---|
| Event published manually | draft → published | Registration URL active. Module 1 operational. |
| rsvp_deadline reached (no cron) | published/live — no status change | Module 1's fn_api_b2b_registration_create checks at request time. No cron required. |
| Cron job: NOW() >= start_at | published → live | Event marked live. Admission module operates. |
| Cron job: NOW() >= end_at + 24hrs | live → closed | Registration URL deactivated. |
| Manual: Organizer clicks Close | any state → closed | Immediate close. Idempotent. |

> **rsvp_deadline Enforcement — Module Ownership:** Module 0 stores rsvp_deadline on t_events and validates it at publish time. Module 0 does NOT own enforcement. Module 1's fn_api_b2b_registration_create reads rsvp_deadline at request time.

---

## 5. Architecture & Codebase Conventions

This module is built on the Lepōs v2 backend stack (lepos-platform-services-v2). All conventions below are mandatory.

### 5.1 Stack

| Layer | Technology |
|---|---|
| Database | PostgreSQL (RDS) — all business logic in SQL functions |
| API Layer | gRPC via Rust tonic — proto definitions → thin Rust handlers → SQL calls |
| SQL Pattern | fn_api_* functions: JSONB in, JSONB out, called via sqlx |
| Portal Client | ts-proto — TypeScript gRPC client generated from .proto files |
| ID Type | DocId — custom PostgreSQL domain with fn_generate_id('prefix_') auto-generation |
| Table Prefix | t_ — all tables use t_ prefix |
| Delete Strategy | Soft delete only — deleted_at TIMESTAMPTZ, never hard delete |
| ENUM Strategy | VARCHAR — PostgreSQL ENUMs avoided (painful to modify in production) |

### 5.2 Relationship to Existing event2 Tables

The existing system contains Magi-synced event entities: t_event2, t_event_session2, t_event_ticket2, t_event_distribution_channel, t_event_merchant_device_log, t_event_ticket2_activity_log. These are tightly coupled to the B2C/POS flow.

The B2B tables defined in this FDR run alongside the B2C tables — they are not extensions of, nor replacements for, the event2 tables. The two systems coexist with no FK relationship between them.

> **Architecture Decision Pending — Neeon to Confirm:** t_wallet2 references event2_id. If a B2B event needs to activate wallet tokens, a bridge is required. t_events carries a nullable event2_id column as a lightweight bridge for wallet linkage only.

### 5.3 Standard Audit Columns

Every table in this module includes:

| Column | Type | Nullable | Notes |
|---|---|---|---|
| created_by_id | DocId | No | Set by SQL function from p_user_id injected by tonic interceptor from JWT. |
| updated_by_id | DocId | No | Updated on every write. Set inside fn_api_* function, not a trigger. |
| deleted_at | TIMESTAMPTZ | Yes | NULL = active record. Set on soft delete. |
| deleted_by_id | DocId | Yes | Set alongside deleted_at on soft delete. |

### 5.4 RBAC Hierarchy Denormalization

The Lepōs access control hierarchy is Group → Business Line → Store. All tables carry group_id and business_line_id directly. Child tables additionally carry event_id.

---

## 6. Data Model

### 6.1 t_events

| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | DocId | No | fn_generate_id('b2evt_') — avoids collision with existing t_event2 tables. |
| group_id | DocId | No | FK → t_groups.id. Top-level RBAC scope. |
| business_line_id | DocId | No | FK → t_business_lines.id. Tenant scope. |
| event2_id | DocId | Yes | PENDING NEEON CONFIRMATION. Nullable FK → t_event2.id. Wallet token linkage only. |
| event_category | VARCHAR(30) | No | Fixed list. See Section 6.10 Event Taxonomy. |
| event_type | VARCHAR(30) | Yes | Dependent on event_category. See Section 6.10. Nullable for MVP flexibility. |
| event_mode | VARCHAR(20) | No | DEFAULT 'single'. Placeholder for future recurring support. MVP: always 'single'. |
| name_en | VARCHAR(200) | No | Event name in English. Required. |
| name_tc | VARCHAR(200) | Yes | Event name in Traditional Chinese. |
| name_sc | VARCHAR(200) | Yes | Event name in Simplified Chinese. |
| description_en | TEXT | Yes | Event description in English. Max 5000 chars (validated in SQL function). Displayed on registration form. |
| description_tc | TEXT | Yes | Event description in Traditional Chinese. Max 5000 chars. |
| description_sc | TEXT | Yes | Event description in Simplified Chinese. Max 5000 chars. |
| venue_en | VARCHAR(200) | No | Venue name in English. Required. |
| venue_tc | VARCHAR(200) | Yes | Venue name in Traditional Chinese. |
| venue_sc | VARCHAR(200) | Yes | Venue name in Simplified Chinese. |
| address_en | VARCHAR(300) | Yes | Venue address in English. |
| address_tc | VARCHAR(300) | Yes | Venue address in Traditional Chinese. |
| address_sc | VARCHAR(300) | Yes | Venue address in Simplified Chinese. |
| start_at | TIMESTAMPTZ | No | Event start datetime. Organizer-set boundary — sessions must fall within this range. |
| end_at | TIMESTAMPTZ | No | Event end datetime. Must be >= start_at. |
| rsvp_deadline | TIMESTAMPTZ | Yes | Optional hard RSVP deadline. Module 1 enforces at request time. |
| quota | INTEGER | No | Total registration quota. Must be > 0 before publish. |
| status | VARCHAR(20) | No | draft / published / live / closed. |
| logo_url | TEXT | Yes | S3 URL for organizer logo. NULL = Lepōs default. |
| banner_url | TEXT | Yes | S3 URL for event banner. NULL = Lepōs default. |
| primary_colour | VARCHAR(7) | Yes | Hex colour code e.g. #00B5AD. NULL = Lepōs teal default. |
| created_by_id | DocId | No | Standard audit column. |
| updated_by_id | DocId | No | Standard audit column. |
| deleted_at | TIMESTAMPTZ | Yes | Soft delete. |
| deleted_by_id | DocId | Yes | Soft delete actor. |
| created_at | TIMESTAMPTZ | No | DEFAULT NOW(). |
| updated_at | TIMESTAMPTZ | No | DEFAULT NOW(). Updated by fn_api_* function on every write. DELIBERATE CHOICE: this module does not use the trfn_common_before_update() trigger. |

### 6.2 t_event_sub_events *(NEW in v2.0)*

This is a new first-class entity table. Sub-events represent distinct experiences within an event (e.g. Red Wine Tasting, Beer Garden inside Wine & Dine Festival). Sub-events are optional — an event with zero sub-events is valid (e.g. OASES single-session ceremony).

> **Sub-event Inheritance:** Sub-events inherit venue, branding, and date range from the parent event. No override fields exist on this table for MVP. If future requirements demand independent sub-event branding or venue, columns can be added here without schema changes to other tables.

> **Sub-event vs. Main Event:** The Main Event is the event itself. It is NOT represented in this table. Sessions that belong to the main event have `sub_event_id = NULL` on `t_event_sessions`. Only additional experiences beyond the main event are stored here.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | DocId | No | fn_generate_id('subevt_'). |
| event_id | DocId | No | FK → t_events.id. Parent event. |
| group_id | DocId | No | Denormalized from t_events on insert. |
| business_line_id | DocId | No | Denormalized from t_events on insert. |
| name_en | VARCHAR(200) | No | Sub-event name in English. Required. |
| name_tc | VARCHAR(200) | Yes | Sub-event name in Traditional Chinese. |
| name_sc | VARCHAR(200) | Yes | Sub-event name in Simplified Chinese. |
| description_en | TEXT | Yes | Sub-event description in English. Max 5000 chars. Displayed on registration form and event catalogue. |
| description_tc | TEXT | Yes | Sub-event description in Traditional Chinese. Max 5000 chars. |
| description_sc | TEXT | Yes | Sub-event description in Simplified Chinese. Max 5000 chars. |
| image_url | TEXT | Yes | S3 URL for sub-event promotional image. Displayed on registration form and event catalogue. |
| additional_fee | NUMERIC(10,2) | Yes | Additional fee for this sub-event on top of general admission. NULL = included in parent ticket (no extra cost). Enforced by future Price Book module; stored as reference value for MVP. |
| sort_order | INTEGER | No | Display order within the event's sub-event list. |
| created_by_id | DocId | No | Standard audit column. |
| updated_by_id | DocId | No | Standard audit column. |
| deleted_at | TIMESTAMPTZ | Yes | Soft delete. Blocked if any child session has admitted_count > 0. |
| deleted_by_id | DocId | Yes | Soft delete actor. |
| created_at | TIMESTAMPTZ | No | DEFAULT NOW(). |
| updated_at | TIMESTAMPTZ | No | DEFAULT NOW(). Updated by fn_api_* function on every write. |

### 6.3 t_event_sessions *(RESTRUCTURED in v2.0)*

> **v2.0 Change Summary:** `parent_session_id` and `depth` columns REMOVED. `sub_event_id` column ADDED. `additional_fee` column REMOVED (moved to `t_event_sub_events`). Sessions now belong to either the main event (`sub_event_id = NULL`) or a sub-event (`sub_event_id` set).

> **Session Ownership:** A session's owner is determined by `sub_event_id`. NULL = Main Event session. NOT NULL = sub-event session. This replaces the previous `parent_session_id` / `depth` nesting approach. The flatter structure eliminates depth-check logic and simplifies queries.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | DocId | No | fn_generate_id('ses_') |
| event_id | DocId | No | FK → t_events.id. Direct parent reference. Always set — even for sub-event sessions. |
| sub_event_id | DocId | Yes | FK → t_event_sub_events.id. NULL = Main Event session. NOT NULL = belongs to this sub-event. *(NEW in v2.0 — replaces parent_session_id)* |
| group_id | DocId | No | Denormalized from t_events on insert. |
| business_line_id | DocId | No | Denormalized from t_events on insert. |
| product_id | DocId | Yes | FK → t_product.id (synced from Magi). NULL = free B2B session. See Section 6.10. |
| session_type | VARCHAR(20) | No | DEFAULT 'single'. Placeholder for future recurring support. MVP: always 'single'. |
| session_date | DATE | No | Calendar date for this session. Must fall within event start_at – end_at range. Used by portal for date-based grouping in schedule view. |
| name_en | VARCHAR(200) | No | Session name in English. |
| name_tc | VARCHAR(200) | Yes | Session name in Traditional Chinese. |
| name_sc | VARCHAR(200) | Yes | Session name in Simplified Chinese. |
| description_en | TEXT | Yes | Session description. Max 5000 chars. Displayed on registration form and event catalogue. |
| description_tc | TEXT | Yes | Session description in Traditional Chinese. Max 5000 chars. |
| description_sc | TEXT | Yes | Session description in Simplified Chinese. Max 5000 chars. |
| venue_room | VARCHAR(100) | Yes | Room or sub-venue name. |
| image_url | TEXT | Yes | S3 URL for session promotional image. Used on registration form and event catalogue. |
| start_at | TIMESTAMPTZ | No | Session start datetime. Must be on session_date. |
| end_at | TIMESTAMPTZ | No | Session end datetime. Must be > start_at. |
| access_type | VARCHAR(30) | No | admission_required / open_to_all. |
| capacity | INTEGER | No | Maximum attendees. Must be > 0. |
| admitted_count | INTEGER | No | MATERIALIZED COUNTER. DEFAULT 0. Incremented by Admission module. Read-only in this module. |
| sort_order | INTEGER | No | Display order within date group (main event sessions) or within sub-event (sub-event sessions). |
| created_by_id | DocId | No | Standard audit column. |
| updated_by_id | DocId | No | Standard audit column. |
| deleted_at | TIMESTAMPTZ | Yes | Soft delete. Blocked if admitted_count > 0. |
| deleted_by_id | DocId | Yes | Soft delete actor. |
| created_at | TIMESTAMPTZ | No | DEFAULT NOW(). |
| updated_at | TIMESTAMPTZ | No | DEFAULT NOW(). Updated by fn_api_* function on every write. |

### 6.4 t_ticket_types *(UPDATED in v2.0)*

> **v2.0 Change Summary:** `sub_event_id` column ADDED. For `ticket_scope = 'sub_event'`, this column references the specific sub-event the ticket grants access to. Replaces the indirect inference via `parent_session_id` from v1.9.

> **Ticket Type Scoping:** Event-level tickets (`ticket_scope = 'event'`) are general admission passes. Sub-event tickets (`ticket_scope = 'sub_event'`) grant access to a specific sub-event's sessions and require the guest to also hold a parent event-level ticket. `parent_ticket_type_id` creates the prerequisite chain. `sub_event_id` identifies which sub-event. Module 1 enforces the prerequisite at registration time (backend + frontend).

> **Access Scope Shortcut:** `access_scope = 'all_sessions'` is a VIP convenience. Instead of mapping ticket types to every session individually, the scanner checks: if `access_scope = 'all_sessions'`, skip junction table lookup → always grant access. Otherwise, check `t_session_ticket_type_access`. `access_scope = 'all_sessions'` is only valid on `ticket_scope = 'event'` tickets. Blocked for `ticket_scope = 'sub_event'` tickets in fn_api_b2b_ticket_type_create.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | DocId | No | fn_generate_id('tkt_') |
| event_id | DocId | No | FK → t_events.id. |
| sub_event_id | DocId | Yes | FK → t_event_sub_events.id. Set when ticket_scope = 'sub_event'. NULL when ticket_scope = 'event'. *(NEW in v2.0)* |
| group_id | DocId | No | Denormalized from t_events. |
| business_line_id | DocId | No | Denormalized from t_events. |
| ticket_scope | VARCHAR(20) | No | 'event' = general admission for the event. 'sub_event' = ticket for a specific sub-event. Determines registration prerequisite logic. |
| parent_ticket_type_id | DocId | Yes | FK → t_ticket_types.id (self-referencing). Required when ticket_scope = 'sub_event'. References the event-level ticket type that is a prerequisite. NULL when ticket_scope = 'event'. |
| access_scope | VARCHAR(20) | No | DEFAULT 'custom'. 'custom' = uses t_session_ticket_type_access junction. 'all_sessions' = VIP shortcut — grants access to all sessions without junction lookup. |
| name_en | VARCHAR(100) | No | Ticket type name in English. |
| name_tc | VARCHAR(100) | Yes | Ticket type name in Traditional Chinese. |
| name_sc | VARCHAR(100) | Yes | Ticket type name in Simplified Chinese. |
| description_en | VARCHAR(200) | Yes | Access privilege description in English. |
| description_tc | VARCHAR(200) | Yes | Access privilege description in Traditional Chinese. |
| description_sc | VARCHAR(200) | Yes | Access privilege description in Simplified Chinese. |
| colour_hex | VARCHAR(7) | No | Hex colour for badge colour-coding. |
| quota | INTEGER | No | Max registrations for this ticket type. Must be >= 0. Quota = 0 means the ticket type is defined but not yet accepting registrations. |
| registered_count | INTEGER | No | MATERIALIZED COUNTER. DEFAULT 0. Incremented by Registration module. Soft delete blocked if > 0. |
| max_bring_along_default | INTEGER | Yes | Maximum bring-along companions per primary registration holding this ticket type. NULL = no cap enforced. Used by Module 1 fn_api_b2b_bring_along_create. Example: General Admission = 2, VIP = 5, NULL = unlimited. |
| created_by_id | DocId | No | Standard audit column. |
| updated_by_id | DocId | No | Standard audit column. |
| deleted_at | TIMESTAMPTZ | Yes | Soft delete. Blocked if registered_count > 0. |
| deleted_by_id | DocId | Yes | Soft delete actor. |
| created_at | TIMESTAMPTZ | No | DEFAULT NOW(). |
| updated_at | TIMESTAMPTZ | No | DEFAULT NOW(). Updated by fn_api_* function. |

### 6.5 t_session_ticket_type_access

Junction table. Controls which ticket types are permitted to enter a given session.

> **Hard Delete Exception:** This is the ONE table in this module that uses hard deletes. SetSessionTicketTypes replaces the full mapping set via DELETE then INSERT within a single transaction.

> **PRIMARY KEY:** (session_id, ticket_type_id)

| Column | Type | Nullable | Notes |
|---|---|---|---|
| session_id | DocId | No | FK → t_event_sessions.id. Composite PK with ticket_type_id. |
| ticket_type_id | DocId | No | FK → t_ticket_types.id. Composite PK with session_id. |
| event_id | DocId | No | Denormalized for 'list all mappings for event' queries. |
| group_id | DocId | No | Denormalized for RBAC filtering. |
| business_line_id | DocId | No | Denormalized for RBAC filtering. |
| created_by_id | DocId | No | Standard audit column. |
| created_at | TIMESTAMPTZ | No | DEFAULT NOW(). No updated_at or deleted_at — mapping replaced wholesale. |

### 6.6 t_event_areas *(NEW in v2.1)*

Areas represent physical zones within an event venue that can be independently access-controlled (e.g. Event Space, VIP Lounge, Backstage, Panel Room). Areas are distinct from sessions — a session is a time-bound agenda item, an area is a physical space.

> **Module 0 vs Module 3 Ownership:** Module 0 owns the area entity definition (this table), CRUD operations, and default seeding. Module 3 owns the Area Permission Matrix UI (Access tab), scanner enforcement at entry points, and the full access control logic.

> **Default Areas:** When an event is created, `fn_api_b2b_event_create` seeds a default "Event Space" area with code `EVT`. Organizers can add custom areas (e.g. VIP Lounge, Backstage) and delete defaults they don't need.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | DocId | No | fn_generate_id('area_'). |
| event_id | DocId | No | FK → t_events.id. Parent event. |
| group_id | DocId | No | Denormalized from t_events on insert. |
| business_line_id | DocId | No | Denormalized from t_events on insert. |
| name_en | VARCHAR(100) | No | Area name in English. Required. |
| name_tc | VARCHAR(100) | Yes | Area name in Traditional Chinese. |
| name_sc | VARCHAR(100) | Yes | Area name in Simplified Chinese. |
| code | VARCHAR(10) | No | Short code for display in matrix and scanner UI (e.g. EVT, VIP, BST, OFF, PNL). Unique within event. |
| is_default | BOOLEAN | No | DEFAULT false. True for system-seeded areas (e.g. Event Space). Organizer can delete defaults. |
| sort_order | INTEGER | No | Display order in the Area Permission Matrix. |
| created_by_id | DocId | No | Standard audit column. |
| updated_by_id | DocId | No | Standard audit column. |
| deleted_at | TIMESTAMPTZ | Yes | Soft delete. |
| deleted_by_id | DocId | Yes | Soft delete actor. |
| created_at | TIMESTAMPTZ | No | DEFAULT NOW(). |
| updated_at | TIMESTAMPTZ | No | DEFAULT NOW(). |

**Constraints:**
- UNIQUE INDEX on `(event_id, code) WHERE deleted_at IS NULL` — no duplicate codes within an active event.

### 6.7 t_area_ticket_type_access *(NEW in v2.1)*

Junction table. Controls which ticket types are permitted to enter a given area. This is the data backing the Area Permission Matrix UI (Access tab, Module 3).

> **Hard Delete Exception:** Like `t_session_ticket_type_access`, this table uses hard deletes. The set-area-permissions function replaces the full mapping set via DELETE then INSERT within a single transaction.

> **PRIMARY KEY:** (area_id, ticket_type_id)

| Column | Type | Nullable | Notes |
|---|---|---|---|
| area_id | DocId | No | FK → t_event_areas.id. Composite PK with ticket_type_id. |
| ticket_type_id | DocId | No | FK → t_ticket_types.id. Composite PK with area_id. |
| event_id | DocId | No | Denormalized for 'list all mappings for event' queries. |
| group_id | DocId | No | Denormalized for RBAC filtering. |
| business_line_id | DocId | No | Denormalized for RBAC filtering. |
| created_by_id | DocId | No | Standard audit column. |
| created_at | TIMESTAMPTZ | No | DEFAULT NOW(). No updated_at or deleted_at — mapping replaced wholesale. |

### 6.8 Key Indexes *(UPDATED in v2.1)*

- INDEX on `t_event_areas(event_id)` — powers area listing per event *(NEW in v2.1)*
- UNIQUE INDEX on `t_event_areas(event_id, code) WHERE deleted_at IS NULL` — unique code per event *(NEW in v2.1)*
- INDEX on `t_area_ticket_type_access(event_id)` — powers 'all area mappings for event' query *(NEW in v2.1)*
- INDEX on `t_event_sub_events(event_id)` — powers sub-event listing per event *(NEW in v2.0)*
- INDEX on `t_event_sessions(event_id)` — powers session listing per event
- INDEX on `t_event_sessions(sub_event_id)` — powers session listing per sub-event *(NEW in v2.0, replaces parent_session_id index)*
- INDEX on `t_event_sessions(event_id, session_date)` — powers date-grouped session queries
- INDEX on `t_event_sessions(product_id)` — powers session-to-product lookup
- INDEX on `t_ticket_types(event_id)` — powers ticket type lookup per event
- INDEX on `t_ticket_types(sub_event_id)` — powers ticket type lookup per sub-event *(NEW in v2.0)*
- INDEX on `t_ticket_types(parent_ticket_type_id)` — powers sub-event ticket prerequisite lookup
- UNIQUE INDEX on `t_session_ticket_type_access(session_id, ticket_type_id)` — prevents duplicates
- INDEX on `t_session_ticket_type_access(event_id)` — powers 'all mappings for event' query
- INDEX on `t_events(business_line_id)` — powers RBAC-filtered event listing
- INDEX on `t_events(group_id)` — powers group-level event queries
- INDEX on `t_events(event_category)` — powers category-filtered listing
- Partial indexes: `t_events(deleted_at)`, `t_event_sub_events(deleted_at)`, `t_event_sessions(deleted_at)`, `t_ticket_types(deleted_at)`, `t_event_areas(deleted_at)` — covers `WHERE deleted_at IS NULL`

### 6.9 Ticket Product Type (Ticketing Extension)

This section defines the Ticket product type — a new product_type value added to the existing Lepōs t_product table. The t_product table is shared across the platform (B2C, POS, Online Ordering) and is synced from the Magi MongoDB system via fn_sync_product().

#### 6.9.1 t_product — Ticket Type Extension Fields

The following fields activate when product_type = 'ticket'. All other product types leave these fields NULL.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| product_type | VARCHAR(30) | No | Must be 'ticket' to activate ticketing behaviour. |
| currency | VARCHAR(3) | Yes | ISO 4217 code. NULL for free B2B sessions. |
| base_price | NUMERIC(10,2) | Yes | Reference face value. Actual price governed by future Price Book. |
| wallet_code_prefix | VARCHAR(10) | Yes | Prefix for wallet code generation. |
| on_sale_at | TIMESTAMPTZ | Yes | When ticket goes on sale. NULL = immediately on publish. |
| off_sale_at | TIMESTAMPTZ | Yes | When ticket stops selling. NULL = until event end. |
| re_entry_allowed | BOOLEAN | No | DEFAULT false. |
| re_entry_max | INTEGER | Yes | Max re-entries. NULL = unlimited when re_entry_allowed = true. |

#### 6.9.2 Wallet Token Integration

The wallet system uses generic line items with reference_type as discriminator:

| wallet2_id | reference_type | reference_id | quantity / purpose |
|---|---|---|---|
| <guest_wallet_id> | ticket | <ticket_product_id> | Primary ticket entitlement |
| <guest_wallet_id> | token_std | <ticket_product_id> | Standard token allocation |
| <guest_wallet_id> | token_prem | <ticket_product_id> | Premium token allocation |
| <guest_wallet_id> | sub_event_ticket | <sub_event_ticket_product_id> | Sub-event session entitlement (v1.9+) |

> **Pending — Neeon to Confirm:** The token_std / token_prem / sub_event_ticket reference_type discriminators require no schema change to t_wallet2_line_item. Neeon must confirm all three values are acceptable.

#### 6.9.3 Business Rules

- Only one product of type 'ticket' may be linked to a given session (enforced by product_id FK).
- A ticket product must exist in t_product (synced from Magi) before the session create function accepts the product_id.
- B2B events (OASES, RTIA, HKIDEAS) do not use ticket products. Sessions have product_id = NULL.
- Pricing tiers and dynamic pricing are deferred to future Price Book module.

### 6.10 Event Taxonomy — Category & Type

event_category is a fixed list. event_type is a dependent list per category. Both are VARCHAR — no ENUM constraints. Validation is enforced in fn_api_b2b_event_create and fn_api_b2b_event_update. The portal enforces the dependency via dropdown UX.

#### 6.10.1 Event Categories (Fixed List)

| event_category | Description | Target Event Examples |
|---|---|---|
| conference | Multi-session knowledge sharing event | RTIA Annual Summit |
| exhibition | Trade show, expo, product showcase | HKIDEAS 2026 |
| festival | Multi-day celebration with activities | Wine & Dine Festival |
| gala | Formal dinner or awards ceremony | OASES Annual Gala |
| workshop | Hands-on training or masterclass | — |
| seminar | Lecture, briefing, or webinar | — |
| networking | Mixer, reception, business matching | — |
| ceremony | Opening, closing, graduation, launch | — |
| corporate | AGM, board meeting, town hall, team building | — |

#### 6.10.2 Event Types (Dependent List per Category)

| event_category | event_type options |
|---|---|
| conference | summit, symposium, forum, congress |
| exhibition | trade_show, expo, showcase, fair |
| festival | food_and_beverage, music, arts, cultural, seasonal |
| gala | awards_ceremony, charity_dinner, annual_dinner, fundraiser |
| workshop | training, masterclass, hackathon, bootcamp |
| seminar | webinar, lecture, briefing, roundtable |
| networking | mixer, reception, meet_and_greet, business_matching |
| ceremony | opening, closing, graduation, launch |
| corporate | agm, board_meeting, town_hall, team_building |

> **Validation:** `fn_api_b2b_event_create` validates that `event_type` belongs to the selected `event_category`. If `event_type` is omitted (NULL), that's allowed — the category alone is sufficient for MVP. Invalid category→type combinations are rejected with a specific error message.

---

## 7. gRPC Service Definitions

All B2B Event module endpoints are exposed as gRPC services. REST is not used.

### 7.1 EventSetupService *(UPDATED in v2.0)*

```protobuf
// b2b_event_setup.proto
service EventSetupService {
  // Event CRUD
  rpc CreateEvent(CreateEventRequest)                 returns (EventResponse);
  rpc GetEvent(GetEventRequest)                       returns (EventResponse);
  rpc ListEvents(ListEventsRequest)                   returns (ListEventsResponse);
  rpc UpdateEvent(UpdateEventRequest)                 returns (EventResponse);
  rpc PublishEvent(EventIdRequest)                    returns (EventResponse);
  rpc CloseEvent(EventIdRequest)                      returns (EventResponse);

  // Sub-event CRUD (NEW in v2.0)
  rpc CreateSubEvent(CreateSubEventRequest)           returns (SubEventResponse);
  rpc ListSubEvents(ListSubEventsRequest)             returns (ListSubEventsResponse);
  rpc UpdateSubEvent(UpdateSubEventRequest)           returns (SubEventResponse);
  rpc DeleteSubEvent(SubEventIdRequest)               returns (DeleteResponse);

  // Area CRUD (NEW in v2.1)
  rpc CreateArea(CreateAreaRequest)                   returns (AreaResponse);
  rpc ListAreas(ListAreasRequest)                     returns (ListAreasResponse);
  rpc UpdateArea(UpdateAreaRequest)                   returns (AreaResponse);
  rpc DeleteArea(AreaIdRequest)                       returns (DeleteResponse);
  rpc SetAreaTicketTypes(SetAreaTicketTypesRequest)   returns (AreaTicketTypesResponse);
  rpc GetAreaTicketTypes(AreaIdRequest)               returns (AreaTicketTypesResponse);

  // Session CRUD
  rpc CreateSession(CreateSessionRequest)             returns (SessionResponse);
  rpc ListSessions(ListSessionsRequest)               returns (ListSessionsResponse);
  rpc UpdateSession(UpdateSessionRequest)             returns (SessionResponse);
  rpc DeleteSession(SessionIdRequest)                 returns (DeleteResponse);

  // Ticket Type CRUD
  rpc CreateTicketType(CreateTicketTypeRequest)       returns (TicketTypeResponse);
  rpc ListTicketTypes(EventIdRequest)                 returns (ListTicketTypesResponse);
  rpc UpdateTicketType(UpdateTicketTypeRequest)       returns (TicketTypeResponse);
  rpc DeleteTicketType(TicketTypeIdRequest)           returns (DeleteResponse);

  // Session–Ticket Type Mapping
  rpc SetSessionTicketTypes(SetSessionTicketTypesRequest) returns (SessionTicketTypesResponse);
  rpc GetSessionTicketTypes(SessionIdRequest)         returns (SessionTicketTypesResponse);
}
```

### 7.2 Key Message Types *(UPDATED in v2.0)*

| Message | Fields / Description |
|---|---|
| CreateEventRequest | business_line_id, group_id, name (LocalizedString), description (LocalizedString, optional), start_at, end_at, venue (LocalizedString), address (LocalizedString, optional), quota (int32), event_category (string), event_type (string, optional), branding (optional), rsvp_deadline (optional) |
| ListEventsRequest | business_line_id (required), status (optional filter), event_category (optional filter), page_size (int32), page_token (string) |
| ListEventsResponse | events (repeated EventSummary), next_page_token, total_count |
| UpdateEventRequest | event_id, updatable fields: name, description, start_at, end_at, venue, address, quota, event_category, event_type, branding, rsvp_deadline |
| EventResponse | Full event record including computed summary (session_count, sub_event_count, total_registered, actual_start_at, actual_end_at) |
| **CreateSubEventRequest** *(NEW)* | event_id (DocId), name (LocalizedString), description (LocalizedString, optional), image_url (optional), additional_fee (optional), sort_order (int32) |
| **ListSubEventsRequest** *(NEW)* | event_id (DocId), include_sessions (bool, default false) |
| **ListSubEventsResponse** *(NEW)* | sub_events (repeated SubEventResponse) |
| **UpdateSubEventRequest** *(NEW)* | sub_event_id (DocId), updatable fields: name, description, image_url, additional_fee, sort_order |
| **SubEventResponse** *(NEW)* | Full sub-event record including session_count, child sessions (if include_sessions = true) |
| **CreateAreaRequest** *(NEW v2.1)* | event_id (DocId), name (LocalizedString), code (string, max 10 chars), sort_order (int32) |
| **ListAreasRequest** *(NEW v2.1)* | event_id (DocId) |
| **ListAreasResponse** *(NEW v2.1)* | areas (repeated AreaResponse) |
| **UpdateAreaRequest** *(NEW v2.1)* | area_id (DocId), updatable fields: name, code, sort_order |
| **AreaResponse** *(NEW v2.1)* | Full area record including is_default, assigned ticket type count |
| **SetAreaTicketTypesRequest** *(NEW v2.1)* | area_id, ticket_type_ids (repeated DocId) — replaces full mapping set |
| **AreaTicketTypesResponse** *(NEW v2.1)* | area_id, ticket_types (repeated TicketTypeSummary) |
| CreateSessionRequest | event_id (DocId), sub_event_id (optional — set for sub-event sessions, NULL for main event sessions), name (LocalizedString), description (LocalizedString, optional), session_date (date), venue_room (optional), image_url (optional), start_at, end_at, access_type, capacity (int32), product_id (optional) |
| ListSessionsRequest | event_id (DocId), sub_event_id (optional — filter sessions of a sub-event; omit or NULL for main event sessions only), include_all (bool, default true — returns all sessions across main event and sub-events) |
| SessionResponse | Full session record including sub_event_id, assigned_ticket_types |
| CreateTicketTypeRequest | event_id, sub_event_id (optional — required for sub_event scope), name (LocalizedString), description (LocalizedString, optional), colour_hex, quota (int32), ticket_scope (string: event/sub_event), parent_ticket_type_id (optional — required for sub_event scope), access_scope (string: custom/all_sessions, default custom) |
| SetSessionTicketTypesRequest | session_id, ticket_type_ids (repeated DocId) — replaces full mapping set |
| DeleteResponse | { success: bool, blocked_reason: string } |

### 7.3 Auth Pattern

All RPCs require a valid JWT in gRPC metadata. The Rust tonic interceptor validates the token and injects p_user_id for all SQL function calls.

---

## 8. SQL Function Layer (fn_api_*)

All business logic resides in PostgreSQL functions. Rust handlers are intentionally thin.

### 8.1 Function Inventory *(UPDATED in v2.0)*

| Function Name | gRPC Method | Responsibility |
|---|---|---|
| fn_api_b2b_event_create | CreateEvent | Inserts t_events, validates business_line_id + group_id + event_category/type, sets status=draft. Seeds default area: "Event Space" (code: EVT, is_default: true). *(UPDATED v2.1: area seeding added)* |
| fn_api_b2b_event_get | GetEvent | Returns event + sub-events + sessions (grouped by session_date) + ticket types as nested JSONB. Includes computed actual_start_at/actual_end_at. *(UPDATED: includes sub-events in response)* |
| fn_api_b2b_event_list | ListEvents | Paginated events for a business_line_id. Supports status + category filter. |
| fn_api_b2b_event_update | UpdateEvent | Updates t_events fields. Bidirectional rsvp_deadline/end_at validation. Validates category→type dependency on change. |
| fn_api_b2b_event_publish | PublishEvent | Runs all 12 publish validation rules atomically. Transitions status to published. *(UPDATED: 10 → 12 rules)* |
| fn_api_b2b_event_close | CloseEvent | Transitions status to closed. Idempotent. |
| **fn_api_b2b_sub_event_create** *(NEW)* | CreateSubEvent | Inserts t_event_sub_events. Denormalizes group_id + business_line_id from parent event. Validates event exists and is not closed. |
| **fn_api_b2b_sub_event_list** *(NEW)* | ListSubEvents | Returns sub-events for an event, ordered by sort_order ASC. Optionally includes child sessions. |
| **fn_api_b2b_sub_event_update** *(NEW)* | UpdateSubEvent | Updates sub-event config. Name, description, image, additional_fee, sort_order. |
| **fn_api_b2b_sub_event_delete** *(NEW)* | DeleteSubEvent | Soft deletes if no child sessions have admitted_count > 0 AND no active child sessions exist; returns blocked_reason otherwise. |
| fn_api_b2b_event_session_create | CreateSession | Inserts t_event_sessions. If sub_event_id is provided, validates sub-event exists and belongs to the same event. Validates session_date within event range. *(UPDATED: sub_event_id replaces parent_session_id + depth logic)* |
| fn_api_b2b_event_session_list | ListSessions | Returns sessions for an event, optionally filtered by sub_event_id. Main event sessions (sub_event_id IS NULL) ordered by session_date + start_at. Sub-event sessions ordered by sort_order ASC, then start_at (within their sub-event). *(UPDATED: sub_event_id filter replaces parent_session_id filter)* |
| fn_api_b2b_event_session_update | UpdateSession | Updates session config. admitted_count ignored. sub_event_id immutable after creation (cannot move session between sub-events). |
| fn_api_b2b_event_session_delete | DeleteSession | Soft deletes if admitted_count = 0; returns blocked_reason otherwise. *(SIMPLIFIED: no sub-event child check — that's now on fn_api_b2b_sub_event_delete)* |
| fn_api_b2b_ticket_type_create | CreateTicketType | Inserts with registered_count = 0. Validates ticket_scope + parent_ticket_type_id + sub_event_id consistency. sub_event_id required when ticket_scope = 'sub_event'. *(UPDATED: sub_event_id validation added)* |
| fn_api_b2b_ticket_type_list | ListTicketTypes | Returns all active ticket types with registered_count. Includes sub_event_id for sub-event-scoped tickets. |
| fn_api_b2b_ticket_type_update | UpdateTicketType | Colour + name permitted post-publish. Quota reduction blocked below registered_count. |
| fn_api_b2b_ticket_type_delete | DeleteTicketType | Soft deletes if registered_count = 0; returns blocked_reason otherwise. |
| fn_api_b2b_session_ticket_types_set | SetSessionTicketTypes | Replaces full mapping set (delete-then-insert). |
| fn_api_b2b_session_ticket_types_get | GetSessionTicketTypes | Returns permitted ticket types for a session. |
| **fn_api_b2b_area_create** *(NEW v2.1)* | CreateArea | Inserts t_event_areas. Validates code uniqueness within event. Denormalizes group_id + business_line_id from parent event. |
| **fn_api_b2b_area_list** *(NEW v2.1)* | ListAreas | Returns areas for an event, ordered by sort_order ASC. |
| **fn_api_b2b_area_update** *(NEW v2.1)* | UpdateArea | Updates area name, code, sort_order. Code uniqueness re-validated on change. |
| **fn_api_b2b_area_delete** *(NEW v2.1)* | DeleteArea | Soft deletes area. Also hard-deletes all `t_area_ticket_type_access` records for this area (cleanup). |
| **fn_api_b2b_area_ticket_types_set** *(NEW v2.1)* | SetAreaTicketTypes | Replaces full area-ticket mapping set (delete-then-insert). Same pattern as fn_api_b2b_session_ticket_types_set. |
| **fn_api_b2b_area_ticket_types_get** *(NEW v2.1)* | GetAreaTicketTypes | Returns permitted ticket types for an area. |

### 8.2 Standard Function Signature

```sql
CREATE OR REPLACE FUNCTION fn_api_b2b_event_create(
  p_input  JSONB,
  p_user_id DocId
) RETURNS JSONB AS $$
DECLARE
  v_id DocId := fn_generate_id('b2evt_');
  v_result JSONB;
BEGIN
  -- validation, inserts, audit column population
  RETURN v_result;
END; $$ LANGUAGE plpgsql;
```

### 8.3 Soft Delete Pattern

No entity table uses hard deletes. All delete functions set deleted_at = NOW() and deleted_by_id = p_user_id. All list/get functions include WHERE deleted_at IS NULL.

**Exception:** t_session_ticket_type_access uses hard deletes (Section 6.5). t_area_ticket_type_access uses hard deletes (Section 6.7). Additionally, t_b2b_registration_tickets (Module 1, Section 5.2 of Module 1 FDR) uses hard deletes during registration cancellation — junction records are removed as part of the cancellation transaction. Engineers working on audit tooling or schema migrations should account for all three exceptions.

### 8.4 Materialized Counter Pattern

Both admitted_count (on t_event_sessions) and registered_count (on t_ticket_types) use materialized counters:

```sql
UPDATE t_event_sessions
SET    admitted_count = admitted_count + 1,
       updated_at = NOW(),
       updated_by_id = p_user_id
WHERE  id = p_session_id
AND    admitted_count < capacity;
```

Module 0 initializes both counters to 0 on record creation. Incrementation is owned by downstream modules.

---

## 9. Publish Validation Rules *(UPDATED in v2.0 — 10 → 12 rules)*

When an organizer triggers PublishEvent, fn_api_b2b_event_publish runs all 12 validation rules atomically. All rules must pass. Failed validations returned as JSONB array.

| # | Validation Rule | Error Message if Failed |
|---|---|---|
| 1 | Event name (at least one language) is not empty | Event name is required. |
| 2 | start_at and end_at are set and start_at <= end_at | Event dates are invalid or missing. |
| 3 | start_at is in the future | Event start date must be a future date. |
| 4 | Venue name (at least one language) is not empty | Venue name is required. |
| 5 | quota > 0 | Event quota must be greater than 0. |
| 6 | At least one active (not soft-deleted) session exists (main event or sub-event sessions both count) | At least one session must be configured. |
| 7 | All sessions with access_type = admission_required have at least one entry in t_session_ticket_type_access (OR at least one event-level ticket type with ticket_scope=event AND access_scope=all_sessions exists for the event — this covers ALL admission_required sessions without requiring individual junction entries) | Session [name] requires at least one permitted ticket type. |
| 8 | At least one active t_ticket_types record exists | At least one ticket type must be defined. |
| 9 | All active ticket type quotas are >= 0 | Ticket type [name] must have a non-negative quota. |
| 10 | If rsvp_deadline is set: rsvp_deadline < end_at AND rsvp_deadline > NOW() | RSVP deadline must be before the event end date and in the future. |
| 11 | *(NEW)* Every active sub-event has at least one active session | Sub-event [name] must have at least one session. |
| 12 | *(NEW)* Every sub-event-scoped ticket type (`ticket_scope = 'sub_event'`) references a valid, active sub-event via sub_event_id | Ticket type [name] references a deleted or missing sub-event. |

> **Note:** The previous Day-related rules (v1.6 Rules 6 and 7: "at least one day" and "every day has sessions") were removed in v1.7. Session existence is validated directly at the event level (Rule 6). v2.0 adds Rule 11 (sub-event session existence) and Rule 12 (ticket–sub-event integrity).

---

## 10. Open Questions & Decisions Required

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | event2_id on t_events: confirmed approach for wallet linkage? | Neeon | OPEN |
| 2 | OASES single-session structure | Product | RESOLVED — minimal valid config (1 session, 0 sub-events) |
| 3 | admitted_count: materialized or computed? | Engineering | RESOLVED — materialized counter |
| 4 | Max sessions per event for MVP? | Product | OPEN |
| 5 | Ticket type colour on printed badges — Badge Print module or surfaced here? | Product + Engineering | RESOLVED — colour_hex stays on t_ticket_types (Module 0). Module 2 Badge Print reads it via fn_api_b2b_badge_data_get at print time. |
| 6 | token_std / token_prem reference_type approach confirmed? | Neeon | OPEN |
| 7 | event_category / event_type taxonomy — final list confirmed? | Product | DRAFT — see Section 6.10. Awaiting product sign-off. |
| 8 | *(NEW)* Max sub-events per event for MVP? | Product | OPEN |
| 9 | *(NEW)* Sub-event deletion: cascade soft-delete child sessions, or require manual deletion of children first? | Product + Engineering | RESOLVED — No cascade. Organizer must delete all child sessions first before deleting the sub-event. Prevents accidental data loss. |
| 10 | *(NEW)* Can a session be moved between sub-events after creation (re-parent)? | Product | RESOLVED — No. sub_event_id is immutable after creation. Delete and recreate if needed. |

---

## 11. Test Cases *(UPDATED in v2.1 — 122 → 132 test cases)*

132 test cases across 10 categories. Priority: High = release blocker. Medium = regression risk. Low = edge case.

**Test Precondition:** Unless stated otherwise: organizer authenticated with valid JWT, business_line_id and group_id set, no prior test data.

### 11.1 Event Management (TC-E) — 23 tests

| Test ID | Test Name | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-E-001 | Create event — happy path | Organizer logged in. | Call CreateEvent with valid name_en, start_at < end_at, venue_en, quota=500, event_category=conference. | Event created with status=draft. id prefixed 'b2evt_'. event_category stored. Default area "Event Space" (code: EVT) auto-created. | High |
| TC-E-002 | Create event — missing name_en | Organizer logged in. | Call CreateEvent with name_en = empty. | Error returned. No record inserted. | High |
| TC-E-003 | Create event — end_at before start_at | Organizer logged in. | Call CreateEvent with end_at < start_at. | Error returned. No record inserted. | High |
| TC-E-004 | Create event — multilingual | Organizer logged in. | Call CreateEvent with name_en, name_tc, name_sc, description_en all populated. | All language fields saved correctly. | Medium |
| TC-E-005 | Update event name | Draft event exists. | Call UpdateEvent with new name_en. | name_en updated. updated_by_id refreshed. | Medium |
| TC-E-006 | Update event — quota to zero | Draft event exists. | Call UpdateEvent with quota = 0. | Error returned. Quota must be > 0. | High |
| TC-E-007 | Get event — nested response | Event with sessions, sub-events, and sub-event sessions exists. | Call GetEvent. | Returns event + sub-events + sessions grouped by session_date + sub-event sessions nested under sub-events. actual_start_at/actual_end_at computed. | High |
| TC-E-008 | Close event manually | Published event exists. | Call CloseEvent. | status = closed. Idempotent. | High |
| TC-E-009 | Soft delete event | Draft event, no registrations. | Soft-delete event. | deleted_at set. Excluded from all queries. | High |
| TC-E-010 | Event not visible post soft-delete | Event soft-deleted. | Call ListEvents. | Soft-deleted event not in results. | High |
| TC-E-011 | Branding upload — logo | Draft event exists. | Call UpdateEvent with logo_url. | logo_url saved. GetEvent returns it. | Medium |
| TC-E-012 | Branding fallback — no logo | Draft event, no logo_url. | Call GetEvent. | logo_url = NULL. Portal renders Lepōs default. | Low |
| TC-E-013 | Status lifecycle — draft to live | Published event. NOW() >= start_at. | Cron runs. | status = live. | High |
| TC-E-014 | Auto-close at end_at + 24h | Live event. NOW() >= end_at + 24h. | Cron runs. | status = closed. | High |
| TC-E-015 | RBAC — wrong business line | Organizer belongs to BL-A. | Call GetEvent for BL-B event. | PERMISSION_DENIED. | High |
| TC-E-016 | rsvp_deadline stored on create | Organizer logged in. | Call CreateEvent with rsvp_deadline. | rsvp_deadline stored. | High |
| TC-E-017 | rsvp_deadline nullable | Organizer logged in. | Call CreateEvent without rsvp_deadline. | rsvp_deadline = NULL. | High |
| TC-E-018 | rsvp_deadline update — clear | Published event with rsvp_deadline. | Call UpdateEvent with rsvp_deadline = null. | rsvp_deadline cleared. | Medium |
| TC-E-019 | end_at update blocked by rsvp_deadline | Event with rsvp_deadline = Apr 20, end_at = Apr 26. | Call UpdateEvent with end_at = Apr 18. | Error: end_at cannot be before rsvp_deadline. | High |
| TC-E-020 | Create event — invalid category | Organizer logged in. | Call CreateEvent with event_category = 'invalid_value'. | Error returned. Invalid category. | High |
| TC-E-021 | Create event — mismatched type | Organizer logged in. | Call CreateEvent with event_category = 'conference', event_type = 'food_and_beverage'. | Error returned. Type does not belong to category. | High |
| TC-E-022 | Create event — with description | Organizer logged in. | Call CreateEvent with description_en = 5000 chars. | Description saved correctly. | Medium |
| TC-E-023 | Create event — description too long | Organizer logged in. | Call CreateEvent with description_en > 5000 chars. | Error returned. Description exceeds max length. | Medium |

### 11.2 Sub-event Management (TC-SE) — 14 tests *(NEW in v2.0)*

| Test ID | Test Name | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-SE-001 | Create sub-event — happy path | Draft event exists. | Call CreateSubEvent with valid name_en, event_id. | Sub-event created. id prefixed 'subevt_'. group_id and business_line_id denormalized from parent event. | High |
| TC-SE-002 | Create sub-event — missing name_en | Draft event exists. | Call CreateSubEvent with name_en = empty. | Error returned. No record inserted. | High |
| TC-SE-003 | Create sub-event — multilingual | Draft event exists. | Call CreateSubEvent with name_en, name_tc, name_sc, description_en. | All language fields saved correctly. | Medium |
| TC-SE-004 | Create sub-event — with additional_fee | Draft event exists. | Call CreateSubEvent with additional_fee = 200.00. | additional_fee stored. | Medium |
| TC-SE-005 | Create sub-event — with image | Draft event exists. | Call CreateSubEvent with image_url = S3 URL. | image_url stored. | Medium |
| TC-SE-006 | Create sub-event — invalid event_id | Organizer logged in. | Call CreateSubEvent with non-existent event_id. | Error returned. Event not found. | High |
| TC-SE-007 | List sub-events | Event with 3 sub-events. | Call ListSubEvents. | All 3 returned ordered by sort_order. | Medium |
| TC-SE-008 | List sub-events — include sessions | Event with 2 sub-events, each with sessions. | Call ListSubEvents with include_sessions = true. | Sub-events returned with nested sessions. | Medium |
| TC-SE-009 | Update sub-event name | Sub-event exists. | Call UpdateSubEvent with new name_en. | name_en updated. updated_by_id refreshed. | Medium |
| TC-SE-010 | Update sub-event — additional_fee | Sub-event exists. | Call UpdateSubEvent with additional_fee = 300.00. | additional_fee updated. | Medium |
| TC-SE-011 | Delete sub-event — no sessions | Sub-event with 0 sessions. | Call DeleteSubEvent. | deleted_at set. | High |
| TC-SE-012 | Delete sub-event — has active sessions | Sub-event with 2 active sessions. | Call DeleteSubEvent. | blocked_reason: 'Remove all sessions in this sub-event before deleting.' | High |
| TC-SE-013 | Delete sub-event — has admitted sessions | Sub-event with session having admitted_count > 0. | Call DeleteSubEvent. | blocked_reason returned. | High |
| TC-SE-014 | Denormalized IDs on sub-event | Event in G1, BL1. | Create sub-event. | group_id=G1, business_line_id=BL1. | High |

### 11.3 Session Management (TC-S) — 23 tests *(UPDATED in v2.0)*

| Test ID | Test Name | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-S-001 | Create main event session — admission required | Event exists. | Call CreateSession with access_type=admission_required, capacity=100, session_date within range, sub_event_id=NULL. | Session created. id prefixed 'ses_'. admitted_count = 0. sub_event_id = NULL. | High |
| TC-S-002 | Create main event session — open to all | Event exists. | Call CreateSession with access_type=open_to_all, sub_event_id=NULL. | Session created. No ticket mapping required. | High |
| TC-S-003 | Create session — end_at before start_at | Event exists. | Call CreateSession with end_at < start_at. | Error returned. | High |
| TC-S-004 | Create session — capacity = 0 | Event exists. | Call CreateSession with capacity = 0. | Error returned. | High |
| TC-S-005 | Create session — capacity warning | Event quota = 500. Sessions total > 500. | Call CreateSession pushing over quota. | Session inserted. Warning returned. Not blocked. | High |
| TC-S-006 | List sessions — grouped by date | Event with sessions on 2 dates. | Call ListSessions. | Sessions returned ordered by session_date + start_at. | Medium |
| TC-S-007 | Update session capacity | Session exists. | Call UpdateSession with new capacity. | capacity updated. admitted_count unchanged. | Medium |
| TC-S-008 | Update session — admitted_count read-only | Session with admitted_count = 5. | Call UpdateSession with admitted_count = 0. | admitted_count ignored. Remains 5. | High |
| TC-S-009 | Delete session — no admissions | Session with admitted_count = 0. | Call DeleteSession. | deleted_at set. | High |
| TC-S-010 | Delete session — has admissions | Session with admitted_count = 3. | Call DeleteSession. | blocked_reason returned. | High |
| TC-S-011 | Session with product_id | Product with type=ticket exists. | Call CreateSession with product_id. | Session created with product_id. | Medium |
| TC-S-012 | Session with invalid product_id | No matching product. | Call CreateSession with bad product_id. | Error returned. | Medium |
| TC-S-013 | Session product_id = NULL (B2B) | Normal B2B event. | Call CreateSession without product_id. | Session created. product_id = NULL. | High |
| TC-S-014 | Session date outside event range | Event: Mar 10–12. | Call CreateSession with session_date = Mar 15. | Error returned. | High |
| TC-S-015 | Sessions sorted by start_at | 3 sessions added out of order. | Call ListSessions. | Sorted by session_date then start_at. | Low |
| TC-S-016 | Create sub-event session | Sub-event exists. | Call CreateSession with sub_event_id = sub-event's id. | Session created. sub_event_id set. event_id inherited from sub-event's parent event. | High |
| TC-S-017 | Create sub-event session — invalid sub_event_id | No matching sub-event. | Call CreateSession with bad sub_event_id. | Error: sub-event not found. | High |
| TC-S-018 | Create sub-event session — sub_event_id from different event | Sub-event belongs to Event A. | Call CreateSession with event_id = Event B, sub_event_id = sub-event from Event A. | Error: sub-event does not belong to this event. | High |
| TC-S-019 | Session sub_event_id immutable | Sub-event session exists. | Call UpdateSession with different sub_event_id. | Error: sub_event_id cannot be changed after creation. | High |
| TC-S-020 | List sub-event sessions | Sub-event with 3 sessions. | Call ListSessions with sub_event_id filter. | Only 3 sub-event sessions returned. | Medium |
| TC-S-021 | List main event sessions only | Event with main sessions and sub-event sessions. | Call ListSessions with sub_event_id = NULL filter. | Only main event sessions returned. | Medium |
| TC-S-022 | Create session — with description and image | Event exists. | Call CreateSession with description_en and image_url. | Both fields saved. Returned in SessionResponse. | Medium |
| TC-S-023 | Session denormalization | Event in G1, BL1. | Create session. | group_id=G1, business_line_id=BL1. | High |

### 11.4 Ticket Type Management (TC-T) — 16 tests *(UPDATED in v2.0 — 14 → 16)*

| Test ID | Test Name | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-T-001 | Create ticket type — event scope | Event exists. | Call CreateTicketType with ticket_scope=event, quota=100. | Created. id prefixed 'tkt_'. registered_count = 0. parent_ticket_type_id = NULL. sub_event_id = NULL. | High |
| TC-T-002 | Create ticket type — sub_event scope | Event-level ticket type + sub-event exist. | Call CreateTicketType with ticket_scope=sub_event, parent_ticket_type_id = event ticket, sub_event_id = sub-event. | Created with parent reference and sub_event_id. | High |
| TC-T-003 | Create ticket type — sub_event without parent | Event + sub-event exist. | Call CreateTicketType with ticket_scope=sub_event, no parent_ticket_type_id. | Error: parent_ticket_type_id required for sub_event scope. | High |
| TC-T-004 | Create ticket type — negative quota | Event exists. | Call CreateTicketType with quota = -1. | Error returned. Quota cannot be negative. | High |
| TC-T-005 | Create ticket type — missing name | Event exists. | Call CreateTicketType with name_en = empty. | Error returned. | High |
| TC-T-006 | Update ticket type colour | Published event. | Call UpdateTicketType with new colour_hex. | colour_hex updated. | Medium |
| TC-T-007 | Update quota — below registered_count | Ticket type with registered_count=5. | Call UpdateTicketType with quota=1. | Error: quota cannot be below registered_count. | High |
| TC-T-008 | Delete ticket type — no registrations | registered_count = 0. | Soft-delete. | deleted_at set. | High |
| TC-T-009 | Delete ticket type — has registrations | registered_count = 3. | Soft-delete. | blocked_reason returned. | High |
| TC-T-010 | List ticket types | Event with 3 types (2 event, 1 sub_event). | Call ListTicketTypes. | All 3 returned with scope, parent info, and sub_event_id. | Medium |
| TC-T-011 | Ticket type denormalization | Event in group G1, business line BL1. | Create ticket type. | group_id=G1, business_line_id=BL1. | High |
| TC-T-012 | Multilingual ticket type name | Event exists. | Create with name_en, name_tc, name_sc. | All stored correctly. | Medium |
| TC-T-013 | Create ticket type — access_scope all_sessions | Event exists. | Call CreateTicketType with access_scope=all_sessions, ticket_scope=event. | Created. No junction mapping needed for access. | Medium |
| TC-T-014 | Create sub_event ticket — parent must be event-scoped | Two sub_event-scoped ticket types exist (A and B). | Call CreateTicketType: ticket_scope=sub_event, parent_ticket_type_id=A (which is also sub_event scope). | Error: parent_ticket_type_id must reference an event-scoped ticket type. | High |
| TC-T-015 | *(NEW)* Create sub_event ticket — missing sub_event_id | Event-level ticket exists. | Call CreateTicketType: ticket_scope=sub_event, parent_ticket_type_id set, sub_event_id = NULL. | Error: sub_event_id required for sub_event scope. | High |
| TC-T-016 | *(NEW)* Create sub_event ticket — sub_event_id from different event | Sub-event belongs to Event A. | Call CreateTicketType: event_id=Event B, sub_event_id from Event A. | Error: sub_event does not belong to this event. | High |

### 11.5 Session–Ticket Type Mapping (TC-M) — 6 tests

| Test ID | Test Name | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-M-001 | Assign ticket types to session | Admission session + 2 ticket types. | Call SetSessionTicketTypes with both IDs. | 2 junction records created. | High |
| TC-M-002 | Replace mapping | Session has 2 types. | Call Set with 1 type. | Previous replaced. 1 record remains. | High |
| TC-M-003 | Clear all mappings | Session has 2 types. | Call Set with empty list. | All removed. | Medium |
| TC-M-004 | Map open_to_all session | Open session exists. | Call Set on open session. | Accepted (stored) but not enforced at scan. | Low |
| TC-M-005 | Duplicate prevention | Session has type X. | Call Set with [X, X]. | UNIQUE prevents duplicate. 1 record. | Medium |
| TC-M-006 | Map sub-event session | Sub-event session exists + sub-event ticket type. | Call SetSessionTicketTypes on sub-event session with sub-event ticket type. | Mapping created. | High |

### 11.6 Publish Validation (TC-P) — 20 tests *(UPDATED — 18 → 20)*

| Test ID | Test Name | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-P-001 | Publish — all rules pass | Fully configured event with sub-events. | Call PublishEvent. | status = published. | High |
| TC-P-002 | Publish — rule 1: no name | name_en empty. | Call PublishEvent. | Error: Event name is required. | High |
| TC-P-003 | Publish — rule 2: invalid dates | start_at > end_at. | Call PublishEvent. | Error: dates invalid. | High |
| TC-P-004 | Publish — rule 3: past start | start_at = yesterday. | Call PublishEvent. | Error: must be future. | High |
| TC-P-005 | Publish — rule 4: no venue | venue_en empty. | Call PublishEvent. | Error: venue required. | High |
| TC-P-006 | Publish — rule 5: quota=0 | quota = 0. | Call PublishEvent. | Error: quota > 0. | High |
| TC-P-007 | Publish — rule 6: no sessions | No sessions. | Call PublishEvent. | Error: at least one session required. | High |
| TC-P-008 | Publish — rule 7: admission unmapped | Admission session, no types. No all_sessions ticket type. | Call PublishEvent. | Error: session [name] needs ticket type. | High |
| TC-P-009 | Publish — rule 8: no ticket types | No ticket types. | Call PublishEvent. | Error: at least one ticket type. | High |
| TC-P-010 | Publish — rule 9: ticket quota negative | Ticket type with quota=-1. | Call PublishEvent. | Error: ticket type must have non-negative quota. | High |
| TC-P-011 | Publish — rule 10: invalid rsvp_deadline | rsvp_deadline >= end_at. | Call PublishEvent. | Error: RSVP deadline invalid. | High |
| TC-P-012 | Publish — multiple errors | Missing name + no sessions. | Call PublishEvent. | All errors returned as array. | High |
| TC-P-013 | Publish — idempotent | Already published. | Call PublishEvent again. | Success, no change. | Medium |
| TC-P-014 | Publish — open_to_all no mapping OK | Open session, no mapping. | Call PublishEvent. | Succeeds. Rule 7 skips open sessions. | High |
| TC-P-015 | Publish — atomicity | Rules 2 + 6 both fail. | Call PublishEvent. | Both errors returned. No state change. | High |
| TC-P-016 | Publish — valid rsvp_deadline | rsvp_deadline valid and future. | Call PublishEvent. | Succeeds. | High |
| TC-P-017 | Publish — no rsvp_deadline | rsvp_deadline = NULL. | Call PublishEvent. | Rule 10 skipped. Succeeds. | High |
| TC-P-018 | Publish — all_sessions ticket type covers admission | Admission session unmapped, but ticket type with access_scope=all_sessions exists. | Call PublishEvent. | Rule 7 passes — all_sessions scope covers it. | High |
| TC-P-019 | *(NEW)* Publish — rule 11: sub-event with no sessions | Sub-event exists but has 0 sessions. | Call PublishEvent. | Error: Sub-event [name] must have at least one session. | High |
| TC-P-020 | *(NEW)* Publish — rule 12: orphaned ticket type | Sub-event ticket type references a soft-deleted sub-event. | Call PublishEvent. | Error: Ticket type [name] references a deleted or missing sub-event. | High |

### 11.7 Audit Columns & Soft Delete (TC-A) — 10 tests

| Test ID | Test Name | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-A-001 | created_by_id on create | Organizer usr_abc123. | Call CreateEvent. | created_by_id = usr_abc123. | High |
| TC-A-002 | updated_by_id on update | Different user updates. | Call UpdateEvent. | updated_by_id changed. created_by_id unchanged. | High |
| TC-A-003 | updated_at refreshes | Event created at T1. | Update at T2. | updated_at = T2. created_at unchanged. | High |
| TC-A-004 | Soft delete fields | Session exists. | Soft-delete. | deleted_at + deleted_by_id set. | High |
| TC-A-005 | Soft-deleted invisible in list | Session soft-deleted. | Call ListSessions. | Not returned. | High |
| TC-A-006 | Soft-deleted invisible in get | Session soft-deleted. | Call GetEvent. | Absent from nested response. | High |
| TC-A-007 | No hard delete on entities | All tables. | Inspect all fn_api_*_delete functions. | Only UPDATE SET deleted_at. No DELETE FROM. | High |
| TC-A-008 | deleted_at filter in lists | 3 events, 1 soft-deleted. | Call ListEvents. | Only 2 returned. | High |
| TC-A-009 | Publish ignores soft-deleted | 1 active + 1 soft-deleted session. | Call PublishEvent. | Validates only active session. | High |
| TC-A-010 | Denormalized IDs consistent | Event in G1/BL1. | Create session → sub-event → ticket type. | All carry G1/BL1. | High |

### 11.8 gRPC Auth & Security (TC-AUTH) — 5 tests

| Test ID | Test Name | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-AUTH-001 | No JWT — blocked | No auth header. | Call CreateEvent. | UNAUTHENTICATED. | High |
| TC-AUTH-002 | Expired JWT | JWT expired. | Call GetEvent. | UNAUTHENTICATED. | High |
| TC-AUTH-003 | Valid JWT — correct claims | Valid JWT. | Call CreateEvent. | p_user_id injected correctly. | High |
| TC-AUTH-004 | Cross-tenant blocked | Organizer in BL-A. | Call GetEvent for BL-B event. | PERMISSION_DENIED. | High |
| TC-AUTH-005 | user_id injected | Valid JWT usr_test1. | Call CreateSession. | created_by_id = usr_test1. | High |

### 11.9 Area Management (TC-AR) — 10 tests *(NEW in v2.1)*

| Test ID | Test Name | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-AR-001 | Default area seeded on event create | Organizer logged in. | Call CreateEvent. | Event created. Default area "Event Space" (code: EVT, is_default: true) auto-created in t_event_areas. | High |
| TC-AR-002 | Create custom area | Event exists. | Call CreateArea with name_en="VIP Lounge", code="VIP". | Area created. id prefixed 'area_'. group_id and business_line_id denormalized. | High |
| TC-AR-003 | Create area — duplicate code | Event with area code "VIP" exists. | Call CreateArea with code="VIP". | Error: area code already exists for this event. | High |
| TC-AR-004 | Create area — code too long | Event exists. | Call CreateArea with code="TOOLONGCODE1". | Error: code must be 10 characters or fewer. | Medium |
| TC-AR-005 | List areas | Event with 3 areas (1 default + 2 custom). | Call ListAreas. | All 3 returned ordered by sort_order. is_default flag correct. | Medium |
| TC-AR-006 | Update area name and code | Area exists. | Call UpdateArea with new name_en and code. | Updated. Code uniqueness re-validated. | Medium |
| TC-AR-007 | Delete area — default | Default area exists. | Call DeleteArea on default area. | deleted_at set. Default areas can be deleted. | High |
| TC-AR-008 | Delete area — cleans up mappings | Area with 3 ticket type mappings. | Call DeleteArea. | Area soft-deleted. All t_area_ticket_type_access records for this area hard-deleted. | High |
| TC-AR-009 | Set area ticket types | Area + 2 ticket types exist. | Call SetAreaTicketTypes with both IDs. | 2 junction records created. | High |
| TC-AR-010 | Replace area ticket types | Area has 3 ticket types mapped. | Call SetAreaTicketTypes with 1 ID. | Previous replaced. 1 record remains. | High |

### 11.10 Sub-event Integration (TC-SEI) — 5 tests

| Test ID | Test Name | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-SEI-001 | Full Wine & Dine setup | Event created. | Create 3 main event sessions + 2 sub-events (Red Wine, Beer Garden) + 2 sessions per sub-event + event-level ticket + 2 sub-event tickets. | All entities created. GetEvent returns full nested structure. | High |
| TC-SEI-002 | OASES simple setup — no sub-events | Event created. | Create 1 main event session + 1 event-level ticket type. Publish. | Published successfully. Zero sub-events is valid. | High |
| TC-SEI-003 | Mixed event — main sessions + sub-events | Event created. | Create 2 main event sessions + 1 sub-event with 3 sessions. | ListSessions returns both main and sub-event sessions. Filtering by sub_event_id works. | High |
| TC-SEI-004 | Sub-event cascade validation | Sub-event with sessions exists. | Delete sub-event → blocked. Delete all sessions first → delete sub-event → success. | Correct blocking and unblocking behaviour. | High |
| TC-SEI-005 | Ticket type — sub_event_id consistency | Sub-event A and sub-event B exist. | Create sub-event ticket for A. Attempt to map it to session in B. | Mapping succeeds (junction allows it) but publish validation should warn if scope mismatch. | Medium |

### 11.11 Test Summary

| Category | Total | High | Medium | Low | Test IDs |
|---|---|---|---|---|---|
| Event Management | 23 | 16 | 6 | 1 | TC-E-001 – TC-E-023 |
| Sub-event Management | 14 | 7 | 5 | 0 | TC-SE-001 – TC-SE-014 |
| Session Management | 23 | 14 | 7 | 1 | TC-S-001 – TC-S-023 |
| Ticket Type Management | 16 | 10 | 4 | 0 | TC-T-001 – TC-T-016 |
| Session–Ticket Type Mapping | 6 | 3 | 2 | 1 | TC-M-001 – TC-M-006 |
| Publish Validation | 20 | 19 | 1 | 0 | TC-P-001 – TC-P-020 |
| Audit & Soft Delete | 10 | 10 | 0 | 0 | TC-A-001 – TC-A-010 |
| gRPC Auth & Security | 5 | 5 | 0 | 0 | TC-AUTH-001 – TC-AUTH-005 |
| Area Management *(NEW v2.1)* | 10 | 6 | 3 | 0 | TC-AR-001 – TC-AR-010 |
| Sub-event Integration | 5 | 4 | 1 | 0 | TC-SEI-001 – TC-SEI-005 |
| **TOTAL** | **132** | **94** | **29** | **3** | |

---

## 12. Definition of Done *(UPDATED in v2.1)*

This module is considered complete when:

- Organizer can create an event in Draft status with category, type, description, and all required fields
- Default "Event Space" area (code: EVT) is auto-created on event creation
- Organizer can add sub-events with name, description, image, and additional fee
- Organizer can add main event sessions (sub_event_id = NULL) with session_date, time, capacity, and access type
- Organizer can add sub-event sessions (sub_event_id set) under a specific sub-event
- Session access type Admission Required requires at least one permitted ticket type before publishing
- Open to All sessions save without requiring ticket type assignment
- Organizer can create event-level and sub-event-level ticket types with scope, parent linkage, and sub_event_id
- Ticket type quota = 0 is valid (defined but not accepting registrations)
- Ticket type with access_scope = all_sessions bypasses junction table at scan time
- Organizer can create, update, and delete areas (physical zones) with unique codes per event
- Area-ticket type permission matrix data layer operational (CRUD + set/get mappings)
- Publish validation runs all 12 rules atomically and returns specific error messages
- Sub-event with zero sessions blocks publish (Rule 11)
- Orphaned sub-event ticket types block publish (Rule 12)
- Published event registration form URL becomes active
- Event auto-transitions to Live at start_at (cron-triggered)
- Event auto-closes at end_at + 24 hours (cron-triggered)
- Ticket type deletion blocked if registered_count > 0
- Session deletion blocked if admitted_count > 0
- Sub-event deletion blocked if active child sessions exist
- All admin UI labels render in English, Traditional Chinese, and Simplified Chinese
- All gRPC RPCs return UNAUTHENTICATED for missing/invalid JWT
- All fn_api_* functions populate audit columns correctly
- Soft delete confirmed at all nesting levels (event → sub-event → session, event → area)
- group_id and business_line_id denormalized on all child tables (sub-events, sessions, ticket types, areas)
- rsvp_deadline optional, validated at publish, enforced by Module 1
- event_category validated against fixed list; event_type validated against category-dependent list
- description fields capped at 5000 chars with validation error on exceed
- All 132 test cases in Section 11 pass

---

## 13. Migration Notes — v1.9 → v2.1

This section documents the breaking changes for engineers migrating from v1.9 to v2.1.

### 13.1 Schema Changes

| Change | v1.9 | v2.1 | Migration Action |
|---|---|---|---|
| New table | — | `t_event_sub_events` | CREATE TABLE. |
| New table | — | `t_event_areas` *(v2.1)* | CREATE TABLE. Seed default area for existing events. |
| New table | — | `t_area_ticket_type_access` *(v2.1)* | CREATE TABLE. |
| t_event_sessions: parent_session_id | EXISTS (DocId, nullable) | REMOVED | DROP COLUMN (after data migration). |
| t_event_sessions: depth | EXISTS (INTEGER, CHECK <= 1) | REMOVED | DROP COLUMN (after data migration). |
| t_event_sessions: additional_fee | EXISTS (NUMERIC, nullable) | REMOVED (moved to t_event_sub_events) | DROP COLUMN (after data migration). |
| t_event_sessions: sub_event_id | — | ADDED (DocId, nullable, FK) | ADD COLUMN. Populate from parent_session_id migration. |
| t_ticket_types: sub_event_id | — | ADDED (DocId, nullable, FK) | ADD COLUMN. Populate for existing sub_event-scoped tickets. |
| t_ticket_types: quota | Must be > 0 | Must be >= 0 | No schema change. Validation logic updated. |

### 13.2 Data Migration Steps

1. For each `t_event_sessions` row where `parent_session_id IS NOT NULL` (these were v1.9 "sub-event sessions"):
   - The parent session (referenced by `parent_session_id`) becomes a sub-event in `t_event_sub_events`. Create the sub-event record from the parent session's name, description, image_url, and additional_fee.
   - Set `sub_event_id` on the child session to point to the newly created sub-event.
   - The parent session itself remains as a main event session (sub_event_id = NULL) unless it has no independent purpose — in that case, it may be soft-deleted.

2. For each `t_ticket_types` row where `ticket_scope = 'sub_event'`:
   - Infer the sub-event from the session mapping and set `sub_event_id`.

3. *(v2.1)* For each existing `t_events` row:
   - Insert a default area record in `t_event_areas` with name_en = "Event Space", code = "EVT", is_default = true.

### 13.3 Function Changes

| v1.9 Function | v2.0 Status |
|---|---|
| fn_api_b2b_event_session_create | UPDATED — sub_event_id replaces parent_session_id + depth logic |
| fn_api_b2b_event_session_list | UPDATED — sub_event_id filter replaces parent_session_id filter |
| fn_api_b2b_event_session_delete | SIMPLIFIED — no sub-event child check (moved to fn_api_b2b_sub_event_delete) |
| fn_api_b2b_event_get | UPDATED — includes sub-events in nested response |
| fn_api_b2b_event_publish | UPDATED — 12 rules (was 10) |
| fn_api_b2b_ticket_type_create | UPDATED — sub_event_id validation added |
| fn_api_b2b_sub_event_create | NEW |
| fn_api_b2b_sub_event_list | NEW |
| fn_api_b2b_sub_event_update | NEW |
| fn_api_b2b_sub_event_delete | NEW |
| fn_api_b2b_area_create | NEW *(v2.1)* |
| fn_api_b2b_area_list | NEW *(v2.1)* |
| fn_api_b2b_area_update | NEW *(v2.1)* |
| fn_api_b2b_area_delete | NEW *(v2.1)* |
| fn_api_b2b_area_ticket_types_set | NEW *(v2.1)* |
| fn_api_b2b_area_ticket_types_get | NEW *(v2.1)* |

### 13.4 gRPC Proto Changes

4 new RPCs added for sub-events: CreateSubEvent, ListSubEvents, UpdateSubEvent, DeleteSubEvent. 6 new RPCs added for areas *(v2.1)*: CreateArea, ListAreas, UpdateArea, DeleteArea, SetAreaTicketTypes, GetAreaTicketTypes. CreateSessionRequest: `parent_session_id` field replaced by `sub_event_id`. ListSessionsRequest: `parent_session_id` filter replaced by `sub_event_id` filter. CreateTicketTypeRequest: `sub_event_id` field added.
