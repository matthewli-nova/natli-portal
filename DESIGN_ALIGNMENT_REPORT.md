# Lepos Ticketing Design System Alignment Report

**Date**: March 2, 2026  
**Reviewed By**: AI Assistant  
**Scope**: Ticket display components across registration, confirmation emails, and invitation emails

---

## Executive Summary

⚠️ **CRITICAL FINDING**: Color inconsistency detected between the official Lepos Design System and ticketing implementations.

### Key Issues Identified

1. **Non-DSL Color Usage**: `#00B5AD` is used extensively but **NOT** in the official Lepos Design System
2. **Mixed Color Standards**: Components use different shades of cyan/teal inconsistently
3. **Border Width Variations**: Ticket cards use different border-left widths (4px vs 6px)

---

## Official Lepos Design System Colors

From `/styles/globals.css` (lines 8-15):

```css
--lepos-dark: #21262a;           /* Text, logos, general UI */
--lepos-dark-brand: #023F59;     /* Buttons, brand moments */
--lepos-cyan: #31D7DB;           /* Secondary actions, highlights */
--lepos-cyan-light: #5DE4E8;     /* Light accents */
--lepos-cyan-dark: #28BDC1;      /* Dark accents */
--lepos-cyan-text: #107DAC;      /* Readable cyan for text on dark backgrounds */
--lepos-cyan-subtle: #A5F3FC;    /* Subtle accents */
```

**✅ Official Lepos Cyan Colors**:
- Primary Cyan: `#31D7DB`
- Cyan Text (readable): `#107DAC`
- Dark Brand: `#023F59`

**❌ NOT in Design System**:
- `#00B5AD` (teal - used in multiple places)

---

## Current Implementation Analysis

### 1. TicketCard Component (`/components/registration/TicketCard.tsx`)

**Status**: ✅ **ALIGNED with DSL**

```typescript
// Selection state
selected && "border-[#107DAC] bg-blue-50/50"  // ✅ Uses lepos-cyan-text

// Selection indicator
"bg-[#107DAC] border-[#107DAC]"              // ✅ Uses lepos-cyan-text

// Price display
"text-[#023F59]"                              // ✅ Uses lepos-dark-brand

// Border
borderLeftWidth: "6px"                        // Uses 6px border-left
borderLeftColor: ticket.colorHex              // Dynamic color per ticket
```

**Design Pattern**:
- ✅ Consistently uses `#107DAC` (lepos-cyan-text) for interactive states
- ✅ Uses `#023F59` (lepos-dark-brand) for price display
- ✅ Dynamic left border color based on ticket type
- ✅ 6px left border width

---

### 2. TicketTypeBadge Component (`/components/invitations/TicketTypeBadge.tsx`)

**Status**: ✅ **ALIGNED with DSL**

```typescript
// Default color
colorHex = "#107DAC"                          // ✅ Uses lepos-cyan-text as default

// Badge styling
backgroundColor: rgba(colorHex, 0.1)          // 10% opacity background
borderColor: rgba(colorHex, 0.3)              // 30% opacity border
color: colorHex                               // Full color text
```

**Design Pattern**:
- ✅ Uses `#107DAC` as default fallback
- ✅ Accepts dynamic colorHex prop for custom ticket colors
- ✅ Semi-transparent backgrounds maintain readability

---

### 3. Invitation Email Templates (`/components/invitations/InvitationEmailEditor.tsx`)

**Status**: ❌ **NOT ALIGNED with DSL**

#### 3.1 Invitation Email Template (lines 1562-1624)

```html
<!-- Top Bar -->
<td style="background-color:#00B5AD;">           ❌ Should be #31D7DB or #107DAC

<!-- "You're Invited" label -->
<p style="color:#00B5AD;">                       ❌ Should be #107DAC

<!-- CTA Button -->
<a style="background-color:#00B5AD;">             ❌ Should be #107DAC or #023F59

<!-- Email links -->
<a style="color:#00B5AD;">                       ❌ Should be #107DAC
```

#### 3.2 Confirmation Email Template (lines 1626-1839)

```html
<!-- Top Bar -->
<td style="background-color:#00B5AD;">           ❌ Should be #31D7DB or #107DAC

<!-- Success checkmark -->
<span style="color:#00B5AD;">                    ❌ Should be #31D7DB or #107DAC

<!-- Ticket Card - Border -->
<td style="border-left:4px solid #00B5AD;">      ❌ Should be #107DAC (and 6px for consistency)

<!-- Ticket Badge -->
<td style="background-color:#00B5AD;">           ❌ Should be #107DAC

<!-- "What's Next" numbered badges -->
<td style="background-color:#00B5AD;">           ❌ Should be #107DAC
```

**Critical Issues**:
- ❌ Uses `#00B5AD` (non-DSL color) for ALL accent colors
- ❌ Ticket border is 4px (should be 6px to match TicketCard)
- ❌ No consistency with TicketCard or TicketTypeBadge components

---

### 4. Registration Form Template (`/components/registration-links/default-registration-form.ts`)

**Status**: ❌ **NOT ALIGNED with DSL**

```css
:root {
  --primary: #00B5AD;              ❌ Should be #107DAC or #31D7DB
  --primary-dark: #009E96;         ❌ Not in DSL
  --primary-light: #e6f9f7;        ❌ Not in DSL
  --primary-glow: rgba(0,181,173,0.15);  ❌ Based on non-DSL color
}
```

**Critical Issues**:
- ❌ Entire color system based on `#00B5AD`
- ❌ Creates custom shades not in DSL
- ❌ No alignment with Lepos brand colors

---

## Recommended Corrections

### Priority 1: Replace `#00B5AD` with DSL Colors

**Recommendation**: Use `#107DAC` (lepos-cyan-text) as the primary replacement

**Why `#107DAC` over `#31D7DB`?**
- ✅ Already used consistently in TicketCard and TicketTypeBadge
- ✅ Better readability on both light and dark backgrounds
- ✅ Designed specifically for "readable cyan text"
- ✅ Matches existing React component patterns

**Alternative**: Use `#31D7DB` for large accent areas (backgrounds, hero sections)

---

### Priority 2: Standardize Ticket Card Design

**Current State**:
- TicketCard: 6px left border
- Email template: 4px left border

**Recommendation**: Use **6px** border-left consistently everywhere

```html
<!-- Before -->
<td style="border-left:4px solid #00B5AD;">

<!-- After -->
<td style="border-left:6px solid #107DAC;">
```

---

### Priority 3: Update Email Templates

#### Invitation Email Changes

```html
<!-- Top Bar -->
- <td style="background-color:#00B5AD;">
+ <td style="background-color:#107DAC;">

<!-- "You're Invited" label -->
- <p style="color:#00B5AD;">
+ <p style="color:#107DAC;">

<!-- CTA Button (consider primary brand color) -->
- <a style="background-color:#00B5AD;">
+ <a style="background-color:#023F59;">  <!-- or #107DAC -->

<!-- Links -->
- <a style="color:#00B5AD;">
+ <a style="color:#107DAC;">
```

#### Confirmation Email Changes

```html
<!-- Top Bar -->
- <td style="background-color:#00B5AD;">
+ <td style="background-color:#107DAC;">

<!-- Success checkmark and accents -->
- style="color:#00B5AD;"
+ style="color:#107DAC;"

<!-- Ticket Card Border -->
- <td style="border-left:4px solid #00B5AD;">
+ <td style="border-left:6px solid #107DAC;">

<!-- Ticket Badge -->
- <td style="background-color:#00B5AD;">
+ <td style="background-color:#107DAC;">

<!-- "What's Next" badges -->
- <td style="background-color:#00B5AD;">
+ <td style="background-color:#107DAC;">
```

---

### Priority 4: Update Registration Form Template

```css
:root {
-  --primary: #00B5AD;
+  --primary: #107DAC;
-  --primary-dark: #009E96;
+  --primary-dark: #0d6390;  /* Darker shade of #107DAC */
-  --primary-light: #e6f9f7;
+  --primary-light: #e8f6fc;  /* Light tint of #107DAC */
-  --primary-glow: rgba(0,181,173,0.15);
+  --primary-glow: rgba(16,125,172,0.15);  /* #107DAC with opacity */
}
```

---

## Color Usage Guidelines (from DSL)

### When to Use Each Lepos Cyan

**`#31D7DB` (lepos-cyan)** - Use for:
- Decorative elements (bullets, icons, dividers)
- Secondary buttons and backgrounds
- Visual accents and highlights
- Large colored areas

**`#107DAC` (lepos-cyan-text)** - Use for:
- Inline text within paragraphs
- Large stat numbers and metrics
- Any text content on dark backgrounds
- **Interactive elements** (buttons, links, selected states)
- **Ticket-related displays**

**`#023F59` (lepos-dark-brand)** - Use for:
- Primary action buttons
- Hero sections and feature highlights
- Special brand badges
- Strategic brand moments
- Price displays

---

## Component Comparison Table

| Component | Current Color | Border Width | DSL Aligned? | Recommendation |
|-----------|--------------|--------------|--------------|----------------|
| TicketCard | `#107DAC` | 6px | ✅ Yes | Keep as-is |
| TicketTypeBadge | `#107DAC` | N/A | ✅ Yes | Keep as-is |
| Invitation Email | `#00B5AD` | N/A | ❌ No | Change to `#107DAC` |
| Confirmation Email | `#00B5AD` | 4px | ❌ No | Change to `#107DAC` + 6px border |
| Registration Form | `#00B5AD` | N/A | ❌ No | Change to `#107DAC` |

---

## Implementation Checklist

- [ ] Update `/components/invitations/InvitationEmailEditor.tsx`
  - [ ] Replace all `#00B5AD` with `#107DAC` (or `#023F59` for primary CTAs)
  - [ ] Change ticket border from 4px to 6px
  - [ ] Update dark mode cyan shades
- [ ] Update `/components/registration-links/default-registration-form.ts`
  - [ ] Replace `--primary: #00B5AD` with `--primary: #107DAC`
  - [ ] Update derivative colors (primary-dark, primary-light, etc.)
- [ ] Test email rendering across devices
  - [ ] Mobile (iPhone, Android)
  - [ ] Tablet (iPad)
  - [ ] Desktop (Outlook, Gmail, Apple Mail)
- [ ] Verify dark mode appearance
- [ ] Update any hardcoded mock data using `#00B5AD`
  - [ ] Check `/components/data/b2b-events.ts` line 180

---

## Design System Strengths

✅ **What's Working Well**:
1. React components (TicketCard, TicketTypeBadge) are DSL-compliant
2. Clear color naming convention in globals.css
3. Good separation of concerns (lepos-cyan vs lepos-cyan-text)
4. Comprehensive color palette with light/dark variants

---

## References

- **Design System Guide**: `/LEPOS_DESIGN_SYSTEM_REUSE_GUIDE.md`
- **Global Styles**: `/styles/globals.css` (lines 5-15)
- **Color Constants**: `/components/design-constants.ts`
- **TicketCard**: `/components/registration/TicketCard.tsx`
- **TicketTypeBadge**: `/components/invitations/TicketTypeBadge.tsx`
- **Email Templates**: `/components/invitations/InvitationEmailEditor.tsx`
- **Registration Form**: `/components/registration-links/default-registration-form.ts`

---

## Conclusion

The React components are well-designed and DSL-compliant. The primary issue is the **HTML email templates and registration form using a non-DSL color** (`#00B5AD`). Updating these to use `#107DAC` will:

1. ✅ Align with the official Lepos Design System
2. ✅ Create visual consistency across all touchpoints
3. ✅ Match existing React component patterns
4. ✅ Improve brand recognition
5. ✅ Simplify maintenance (fewer unique colors)

**Estimated Impact**: Medium effort, high value. Email template updates can be completed in one focused session.
