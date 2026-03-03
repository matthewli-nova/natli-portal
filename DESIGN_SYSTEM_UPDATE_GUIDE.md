# 🔄 Design System Update Guide

## What to Replace When You Make Changes

This guide explains exactly which files to update in your existing Figma Make projects when you modify this master design system.

---

## 📋 Quick Reference: Change → Files to Replace

| **What You Changed** | **Files to Replace in Other Projects** | **Impact** |
|---------------------|----------------------------------------|------------|
| **Colors** (brand colors, cyan, dark, etc.) | ✅ `/styles/globals.css` only | All components automatically use new colors |
| **Typography** (font sizes, weights) | ✅ `/styles/globals.css` only | All text automatically updates |
| **Button styling** (hover states, sizes) | ✅ `/components/ui/button.tsx` | All buttons update |
| **Badge styling** (variants, colors) | ✅ `/components/ui/badge.tsx` | All badges update |
| **Any single component** | ✅ That specific `/components/ui/[component].tsx` file | Only that component updates |
| **Multiple components** | ✅ Replace all modified files in `/components/ui/` | All changed components update |
| **Design constants** (documentation) | ✅ `/components/design-constants.ts` | Documentation updates only |
| **Logo component** | ✅ `/components/LeposLogo.tsx` | Logo updates |
| **Complete overhaul** | ✅ Replace everything (see "Full System Update" below) | Everything updates |

---

## 🎨 Scenario 1: You Changed Colors

### **What You Might Change:**
- Brand colors (#023F59, #31D7DB, etc.)
- Gray palette
- Semantic colors (success, warning, error)
- Theme colors (light/dark mode)

### **File to Replace:**
```
📄 /styles/globals.css
```

### **Why Only This File?**
All components use CSS variables from `globals.css`, so changing the colors there automatically updates:
- ✅ All buttons
- ✅ All badges
- ✅ All form inputs
- ✅ All text colors
- ✅ All backgrounds
- ✅ Everything!

### **Steps:**
1. In this project: Edit `/styles/globals.css` with your new colors
2. Copy `/styles/globals.css` to your other project(s)
3. Done! All components automatically use the new colors.

### **Example:**
```css
/* If you change this in /styles/globals.css: */
--lepos-dark-brand: #023F59;  /* Change to --> */ #034567;

/* Then just copy globals.css to other projects.
   All buttons automatically update! No need to touch button.tsx */
```

---

## 🔤 Scenario 2: You Changed Typography

### **What You Might Change:**
- Font sizes (mobile, tablet, kiosk)
- Font weights
- Line heights
- Font families
- Heading styles

### **File to Replace:**
```
📄 /styles/globals.css
```

### **Why Only This File?**
Typography is defined in the CSS variables and element selectors in `globals.css`.

### **Steps:**
1. In this project: Edit typography in `/styles/globals.css`
2. Copy `/styles/globals.css` to your other project(s)
3. Done! All text automatically updates.

---

## 🔘 Scenario 3: You Changed Button Behavior/Styling

### **What You Might Change:**
- Button hover effects
- Button sizes (sm, md, lg)
- Button variants (added new variant)
- Button border radius
- Button animations

### **Files to Replace:**
```
📄 /components/ui/button.tsx
```

**Optional (if you also changed button colors):**
```
📄 /styles/globals.css
```

### **Steps:**
1. In this project: Edit `/components/ui/button.tsx`
2. Copy `/components/ui/button.tsx` to your other project(s)
3. If you also changed colors, copy `/styles/globals.css`
4. Done! All buttons update with new behavior.

---

## 🏷️ Scenario 4: You Changed a Specific Component

### **What You Might Change:**
- Badge, Card, Input, Select, Checkbox, Dialog, Tooltip, etc.
- Any component in `/components/ui/`

### **Files to Replace:**
```
📄 /components/ui/[the-component-you-changed].tsx
```

**For example:**
- Changed Badge → Replace `/components/ui/badge.tsx`
- Changed Input → Replace `/components/ui/input.tsx`
- Changed Card → Replace `/components/ui/card.tsx`

### **Steps:**
1. In this project: Edit the component file
2. Copy that specific component file to your other project(s)
3. Done! That component updates everywhere.

---

## 🔄 Scenario 5: You Changed Multiple Components

### **What You Might Change:**
- Updated 3+ components at once
- Redesigned form elements (Input, Select, Checkbox)
- Updated all navigation components

### **Files to Replace:**
```
📁 /components/ui/ (just the files you changed)
```

### **Steps:**
1. In this project: Edit multiple component files
2. **Option A - Selective:** Copy only the changed files to your other project(s)
3. **Option B - Safe:** Copy the entire `/components/ui/` folder to ensure consistency
4. Done!

### **Pro Tip:**
If you changed 5+ components, it's safer to copy the entire `/components/ui/` folder to avoid missing dependencies.

---

## 🎯 Scenario 6: Full System Update

### **What You Might Change:**
- Complete redesign
- Major version update
- Changed colors + typography + components

### **Files to Replace (Complete Set):**
```
📄 /styles/globals.css
📁 /components/ui/ (entire folder)
📄 /components/design-constants.ts
📄 /components/LeposLogo.tsx (if you use it)
```

### **Steps:**
1. In this project: Make all your changes
2. Copy all 4 items above to your other project(s)
3. Test to ensure nothing broke
4. Done!

---

## 🛠️ Step-by-Step: Updating an Existing Project

### **Example: You Changed Lepos Dark Brand from #023F59 to #034567**

#### **Step 1: Identify What You Changed**
- ✅ Changed color variable in `globals.css`
- ❌ Didn't change any component files
- ❌ Didn't change typography

**Decision: Only need to replace `globals.css`**

#### **Step 2: In This Master Project**
```css
/* /styles/globals.css */
--lepos-dark-brand: #034567;  /* Updated */
```

#### **Step 3: In Your Other Figma Make Project**
1. Open the other project
2. Delete the old `/styles/globals.css`
3. Copy the new `/styles/globals.css` from this project
4. Done!

#### **Step 4: Verify**
- Open the other project
- Check that buttons show the new color (#034567)
- Check that brand badges show the new color
- Everything should automatically update!

---

## 📊 Decision Tree

```
Did you change colors, spacing, or typography?
├─ YES → Replace /styles/globals.css only
└─ NO → Continue...

Did you change a single UI component?
├─ YES → Replace that specific /components/ui/[component].tsx
└─ NO → Continue...

Did you change multiple UI components?
├─ 1-3 components → Replace those specific files
├─ 4-10 components → Replace all changed files or entire /components/ui/
└─ 10+ components → Replace entire /components/ui/ folder

Did you change the logo?
├─ YES → Also replace /components/LeposLogo.tsx
└─ NO → You're done!

Did you change design documentation?
├─ YES → Also replace /components/design-constants.ts
└─ NO → You're done!
```

---

## 🎨 Common Update Scenarios

### **Scenario A: "I changed the primary button color from #023F59 to #FF5733"**

**What to replace:**
- ✅ `/styles/globals.css` (update `--lepos-dark-brand: #FF5733;`)

**Why not button.tsx?**
- The button component uses `bg-lepos-dark-brand`, which references the CSS variable
- Changing the CSS variable automatically updates all buttons

---

### **Scenario B: "I added a new button size (xl)"**

**What to replace:**
- ✅ `/components/ui/button.tsx` (add the new `xl` size variant)

**Do NOT need to replace:**
- ❌ `globals.css` (no color/token changes)

```tsx
// In button.tsx, you added:
size: {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3",
  lg: "h-10 px-6",
  xl: "h-12 px-8",  // ← New size
  icon: "size-9",
}
```

---

### **Scenario C: "I changed the font from Noto Sans to Inter"**

**What to replace:**
- ✅ `/styles/globals.css` (update the `@import` and font-family)

```css
/* Change this: */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:...');

/* To this: */
@import url('https://fonts.googleapis.com/css2?family=Inter:...');

/* And update: */
body {
  font-family: 'Inter', sans-serif;  /* was 'Noto Sans' */
}
```

---

### **Scenario D: "I redesigned all form inputs (Input, Select, Checkbox)"**

**What to replace:**
- ✅ `/components/ui/input.tsx`
- ✅ `/components/ui/select.tsx`
- ✅ `/components/ui/checkbox.tsx`

**Optional (if you also changed colors):**
- ✅ `/styles/globals.css`

**Pro tip:** Copy the entire `/components/ui/` folder if you changed many related components to ensure they work together.

---

### **Scenario E: "I added a brand new color variable"**

**What to replace:**
- ✅ `/styles/globals.css` (add the new variable)

```css
/* Added new color: */
:root {
  --lepos-dark: #21262a;
  --lepos-dark-brand: #023F59;
  --lepos-cyan: #31D7DB;
  --lepos-accent-purple: #8B5CF6;  /* ← New color */
}

/* And utility class: */
.bg-lepos-accent-purple {
  background-color: var(--lepos-accent-purple);
}
```

---

## 🔍 How to Track Your Changes

### **Option 1: Keep a Change Log (Recommended)**

Create a file in this project to track what you changed:

```markdown
# Design System Change Log

## v1.2.0 - 2026-01-30
### Changed
- Updated primary button color from #023F59 to #034567
- **Files affected:** /styles/globals.css

### What to update in other projects:
- Replace /styles/globals.css

---

## v1.1.0 - 2026-01-28
### Changed
- Added 'xl' button size
- Updated badge hover states
- **Files affected:** 
  - /components/ui/button.tsx
  - /components/ui/badge.tsx

### What to update in other projects:
- Replace /components/ui/button.tsx
- Replace /components/ui/badge.tsx
```

---

### **Option 2: Use File Timestamps**

When you make changes:
1. Note the date/time you made the change
2. In other projects, check if their files are older
3. Replace any files older than your change date

---

### **Option 3: Version Tagging**

Add a version comment at the top of files you change:

```tsx
// Button Component
// Design System Version: 1.2.0
// Last Updated: 2026-01-30
// Changes: Added xl size variant

export function Button(...) {
  // component code
}
```

---

## ⚡ Quick Copy Commands

### **Copy Just Styles (colors, typography)**
```
Copy: /styles/globals.css
Paste to: [YourProject]/styles/globals.css
```

### **Copy Just Buttons**
```
Copy: /components/ui/button.tsx
Paste to: [YourProject]/components/ui/button.tsx
```

### **Copy All UI Components**
```
Copy: /components/ui/ (entire folder)
Paste to: [YourProject]/components/ui/
```

### **Copy Everything (Full Update)**
```
Copy: 
  - /styles/globals.css
  - /components/ui/ (entire folder)
  - /components/design-constants.ts
  - /components/LeposLogo.tsx

Paste to: [YourProject]/
```

---

## 🚨 Troubleshooting

### **Problem: "I replaced globals.css but colors didn't change"**

**Solutions:**
1. Hard refresh your browser (Cmd/Ctrl + Shift + R)
2. Check that the CSS import is correct in your main App file
3. Verify you copied the entire `globals.css` file
4. Check browser console for CSS errors

---

### **Problem: "I replaced button.tsx but it broke my app"**

**Solutions:**
1. Make sure you also copied any new dependencies
2. Check if `button.tsx` imports anything from other files
3. Verify all imports are correct (relative paths)
4. Check if you have the required packages (e.g., `@radix-ui/react-slot@1.1.2`)

---

### **Problem: "Some components updated but others didn't"**

**Solution:**
- You probably missed some component files
- **Safe approach:** Copy the entire `/components/ui/` folder to ensure all dependencies are updated together

---

### **Problem: "I don't remember what I changed"**

**Solutions:**
1. Use the change log (see "How to Track Your Changes" above)
2. Compare files side-by-side with your other project
3. **Safe approach:** Replace all 3 core items:
   - `/styles/globals.css`
   - `/components/ui/` folder
   - `/components/design-constants.ts`

---

## ✅ Best Practices

### **1. Keep This Project as Your "Master"**
- ✅ Always make design system changes HERE first
- ✅ Test changes thoroughly in this project
- ✅ Then propagate to other projects
- ❌ Don't make design system changes in individual projects

### **2. Document Your Changes**
- ✅ Keep a change log (see above)
- ✅ Note which files you modified
- ✅ Write what version you're on

### **3. Test Before Propagating**
- ✅ Test changes in this master project first
- ✅ Make sure buttons, forms, etc. still work
- ✅ Then copy to other projects

### **4. Update All Projects at Once**
- ✅ When you make a change, update all your projects immediately
- ❌ Don't let projects get out of sync
- ❌ Avoid having v1.0 in one project and v1.5 in another

### **5. Use Selective Updates When Possible**
- ✅ If you only changed colors, only replace `globals.css`
- ✅ Don't replace everything if you don't need to
- ✅ Selective updates are faster and less risky

---

## 📚 Summary: What to Replace

| **Change Type** | **Replace This** | **Time** |
|----------------|------------------|----------|
| **Colors only** | `globals.css` | 30 seconds |
| **Typography only** | `globals.css` | 30 seconds |
| **Button only** | `button.tsx` | 1 minute |
| **1 component** | That component file | 1 minute |
| **3-5 components** | Those component files | 2 minutes |
| **10+ components** | Entire `/components/ui/` | 3 minutes |
| **Everything** | See "Full System Update" | 5 minutes |

---

## 🎯 Real-World Example Workflow

### **You're working on 3 Figma Make projects:**
1. **Project A:** E-commerce site
2. **Project B:** Dashboard app  
3. **Project C:** Landing page

### **You decide to change the primary button color:**

#### **Step 1: Master Project (this one)**
```css
/* /styles/globals.css */
--lepos-dark-brand: #023F59; /* Change to */ #FF5733;
```

#### **Step 2: Project A**
1. Open Project A in Figma Make
2. Replace `/styles/globals.css` with the new one
3. Test: Check that buttons show #FF5733
4. ✅ Done!

#### **Step 3: Project B**
1. Open Project B in Figma Make
2. Replace `/styles/globals.css` with the new one
3. Test: Check that buttons show #FF5733
4. ✅ Done!

#### **Step 4: Project C**
1. Open Project C in Figma Make
2. Replace `/styles/globals.css` with the new one
3. Test: Check that buttons show #FF5733
4. ✅ Done!

**Total time: ~5 minutes to update all 3 projects!**

---

## 🎉 You're All Set!

Now you know exactly:
- ✅ What to replace when you change colors (just `globals.css`)
- ✅ What to replace when you change components (just that component file)
- ✅ What to replace for major updates (styles + components)
- ✅ How to track your changes
- ✅ How to update multiple projects efficiently

**Keep this guide handy whenever you update your design system!** 📖
