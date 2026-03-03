# 🚀 Lepos Design System - Quick Reference Card

## 📦 What to Copy to New Projects

```
Essential Files (Always Copy):
├── /styles/globals.css          ← All colors, typography, tokens
└── /components/ui/              ← All components (45+ files)

Optional Files:
├── /components/design-constants.ts  ← Design documentation
└── /components/LeposLogo.tsx        ← Logo component
```

---

## 🔄 What to Replace When You Make Changes

| **You Changed** | **Replace in Other Projects** |
|----------------|-------------------------------|
| 🎨 **Colors** | `/styles/globals.css` only |
| 📝 **Typography** | `/styles/globals.css` only |
| 🔘 **Button** | `/components/ui/button.tsx` |
| 🏷️ **Badge** | `/components/ui/badge.tsx` |
| 📥 **Input/Form** | That specific component file |
| 🎯 **One Component** | Just that file |
| 📦 **3-5 Components** | Those specific files |
| 🌐 **Everything** | All 3 core items |

---

## ⚡ Quick Copy Guide

### **New Project Setup (First Time)**
```bash
# 1. Copy to your new project:
   /styles/globals.css
   /components/ui/ (entire folder)
   
# 2. Start using:
   import { Button } from './components/ui/button';
```

### **Updating Existing Projects (After Changes)**
```bash
# IF you changed colors:
   → Replace /styles/globals.css
   
# IF you changed a component:
   → Replace /components/ui/[that-component].tsx
   
# IF you changed everything:
   → Replace globals.css + /components/ui/
```

---

## 🎨 Color Reference

```css
--lepos-dark: #21262a;         /* Text, logos, readability */
--lepos-dark-brand: #023F59;   /* Buttons, brand moments */
--lepos-cyan: #31D7DB;         /* Secondary, highlights */
--lepos-cyan-light: #5DE4E8;   /* Light accents */
--lepos-cyan-dark: #28BDC1;    /* Dark accents */
```

---

## 🔧 Common Scenarios

### **Scenario: Changed button color**
✅ Replace: `globals.css` only
⏱️ Time: 30 seconds

### **Scenario: Added new button size**
✅ Replace: `button.tsx` only
⏱️ Time: 1 minute

### **Scenario: Redesigned all forms**
✅ Replace: All form component files
⏱️ Time: 3 minutes

### **Scenario: Complete redesign**
✅ Replace: Everything (globals.css + /components/ui/)
⏱️ Time: 5 minutes

---

## 📚 Full Guides Available

- **Reusability Guide:** `/LEPOS_DESIGN_SYSTEM_REUSE_GUIDE.md`
- **Update Guide:** `/DESIGN_SYSTEM_UPDATE_GUIDE.md`
- **Resources Tab:** In the app interface

---

## ✅ Best Practices

1. ✅ Keep THIS project as your "master"
2. ✅ Make all changes HERE first
3. ✅ Test thoroughly before copying
4. ✅ Update all projects at once
5. ✅ Use selective updates (don't replace everything if you don't need to)

---

**Print this card or keep it handy! 📌**
