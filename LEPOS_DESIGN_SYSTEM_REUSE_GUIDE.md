# 🎨 Lepos Design System - Reusability Guide

## How to Use This Design System in Other Figma Make Projects

This guide explains how to apply the Lepos design system to any new Figma Make project to maintain consistent branding, colors, typography, and component styling.

---

## 📋 Quick Start Checklist

To apply the Lepos design system to a new project:

- [ ] Copy `/styles/globals.css` to your new project
- [ ] Copy `/components/ui/` folder (all UI components)
- [ ] Copy `/components/design-constants.ts` (optional, for design documentation)
- [ ] Copy `/components/LeposLogo.tsx` (if you need the logo component)
- [ ] Import components as needed in your new App.tsx

---

## 🗂️ Essential Files to Copy

### **1. Core Styling File** ⭐ **REQUIRED**

```
📄 /styles/globals.css
```

**What it contains:**
- All CSS design tokens (colors, spacing, typography)
- Color variables (`--lepos-dark`, `--lepos-dark-brand`, `--lepos-cyan`)
- Typography system (font sizes, weights, line heights)
- Light/dark theme configurations
- Utility classes (`.bg-lepos-dark-brand`, `.text-lepos-cyan`, etc.)

**Why you need it:**
This is the foundation of the entire design system. Without this file, components won't have the correct Lepos styling.

---

### **2. UI Components Folder** ⭐ **REQUIRED**

```
📁 /components/ui/
├── button.tsx          ← Primary buttons with Lepos Dark Brand (#023F59)
├── badge.tsx           ← Badge variants including brand badges
├── card.tsx            ← Card containers
├── input.tsx           ← Form inputs
├── label.tsx           ← Form labels
├── select.tsx          ← Dropdown selects
├── checkbox.tsx        ← Checkboxes
├── switch.tsx          ← Toggle switches
├── textarea.tsx        ← Text areas
├── dialog.tsx          ← Modal dialogs
├── tooltip.tsx         ← Tooltips
├── tabs.tsx            ← Tab navigation
├── utils.ts            ← Utility functions (cn helper)
└── ... (copy all files in this folder)
```

**What it contains:**
- Pre-styled components that follow Lepos design system
- Button with `bg-lepos-dark-brand` (#023F59)
- All form controls, navigation, overlays, etc.

**Why you need it:**
These components are already configured with Lepos styling. Just import and use them.

---

### **3. Design Constants File** (Optional but Recommended)

```
📄 /components/design-constants.ts
```

**What it contains:**
- Brand color definitions with usage guidelines
- Color palette arrays
- Design token references
- Typography scales
- Platform-specific guidelines

**Why you need it:**
Useful if you want to display design documentation or need programmatic access to design tokens.

---

### **4. Logo Component** (Optional)

```
📄 /components/LeposLogo.tsx
```

**What it contains:**
- Lepos logo component with multiple variants
- Color variants (default, light, dark, cyan)
- Size options (xs, sm, md, lg, xl)

**Why you need it:**
If your new project needs the Lepos logo, this component is ready to use.

---

## 🚀 Step-by-Step Setup for New Projects

### **Method 1: Manual Copy (Recommended)**

1. **Create a new Figma Make project**
   - Start with a blank canvas or basic app

2. **Copy the styles file**
   ```
   From this project: /styles/globals.css
   To new project:    /styles/globals.css
   ```

3. **Copy the UI components folder**
   ```
   From this project: /components/ui/ (entire folder)
   To new project:    /components/ui/ (entire folder)
   ```

4. **Copy optional files** (if needed)
   ```
   /components/design-constants.ts
   /components/LeposLogo.tsx
   ```

5. **Start using components in your App.tsx**
   ```tsx
   import { Button } from './components/ui/button';
   import { Badge } from './components/ui/badge';
   import { Card } from './components/ui/card';
   
   export default function App() {
     return (
       <div className="p-8">
         <h1>My New Lepos App</h1>
         <Button>Primary Action</Button>
         <Badge className="bg-lepos-dark-brand text-white">Premium</Badge>
       </div>
     );
   }
   ```

---

## 🎨 Using Lepos Colors in Your New Project

Once you've copied `globals.css`, these colors are available:

### **CSS Variables**
```css
var(--lepos-dark)           /* #21262a - Text, logos, general UI */
var(--lepos-dark-brand)     /* #023F59 - Buttons, badges, brand moments */
var(--lepos-cyan)           /* #31D7DB - Secondary actions, highlights */
var(--lepos-cyan-light)     /* #5DE4E8 - Light accents */
var(--lepos-cyan-dark)      /* #28BDC1 - Dark accents */
var(--lepos-cyan-text)      /* #107DAC - Readable cyan for text on dark backgrounds */
```

### **Tailwind Utility Classes**
```tsx
// Backgrounds
<div className="bg-lepos-dark-brand">Primary button color</div>
<div className="bg-lepos-dark">General dark background</div>
<div className="bg-lepos-cyan">Secondary color</div>

// Text
<p className="text-lepos-dark">Body text</p>
<p className="text-lepos-dark-brand">Brand accent text</p>
<p className="text-lepos-cyan">Cyan decorative text</p>
<p className="text-lepos-cyan-text">Readable cyan text (for stats, inline text)</p>

// Borders
<div className="border border-lepos-dark-brand">Brand border</div>
```

### **Color Usage Rules** 🎯

**Lepos Cyan (#31D7DB)** - Use for:
- Decorative elements (bullets, icons, dividers)
- Secondary buttons and backgrounds
- Visual accents and highlights

**Lepos Cyan Text (#107DAC)** - Use for:
- Inline text within paragraphs (e.g., "Check the **Resources** tab")
- Large stat numbers and metrics (e.g., "45+", "100%")
- Any text content that needs better readability on dark backgrounds

**Lepos Dark Brand (#023F59)** - Use for:
- Primary action buttons
- Hero sections and feature highlights
- Special brand badges
- Strategic brand moments

---

## 🔘 Pre-Configured Components

All components are pre-styled with Lepos branding:

### **Buttons**
```tsx
import { Button } from './components/ui/button';

// Primary button (uses #023F59 - Lepos Dark Brand)
<Button>Primary Action</Button>

// Secondary button (uses #31D7DB - Lepos Cyan)
<Button variant="secondary">Secondary Action</Button>

// Other variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

### **Badges**
```tsx
import { Badge } from './components/ui/badge';

// Default badge
<Badge>Default</Badge>

// Brand badge (uses #023F59)
<Badge className="bg-lepos-dark-brand text-white hover:bg-[#034A6C]">
  Premium
</Badge>

// Secondary badge (uses #31D7DB)
<Badge variant="secondary">Secondary</Badge>
```

### **Form Inputs**
```tsx
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Checkbox } from './components/ui/checkbox';
import { Switch } from './components/ui/switch';

<div>
  <Label>Email</Label>
  <Input type="email" placeholder="Enter email" />
</div>

<Checkbox id="terms" />
<Switch />
```

All form components automatically use Lepos colors for focus states, borders, and interactions.

---

## 📱 Typography System

The design system includes responsive typography that scales across platforms:

### **Headings**
```tsx
<h1>Main Heading</h1>        {/* Pre-styled with Lepos typography */}
<h2>Section Heading</h2>
<h3>Subsection</h3>
<h4>Card Title</h4>
```

### **Body Text**
```tsx
<p>Body text automatically uses Lepos Dark (#21262a) for readability</p>
<p className="text-sm">Smaller text</p>
<p className="text-muted-foreground">Secondary text</p>
```

---

## 🎯 Design Tokens Quick Reference

### **Colors**
| Token | Value | Usage |
|-------|-------|-------|
| `--lepos-dark` | `#21262a` | Text, logos, general UI |
| `--lepos-dark-brand` | `#023F59` | **Buttons, brand moments** |
| `--lepos-cyan` | `#31D7DB` | Secondary actions |
| `--lepos-cyan-light` | `#5DE4E8` | Light accents |
| `--lepos-cyan-dark` | `#28BDC1` | Dark accents |
| `--lepos-cyan-text` | `#107DAC` | Readable cyan for text on dark backgrounds |

### **Spacing**
- Use Tailwind spacing utilities: `p-4`, `m-8`, `gap-6`, etc.
- System uses `--radius: 0.75rem` for consistent border-radius

### **Typography**
- Default font size: `14px` (mobile/desktop)
- Tablet: `16px`
- Kiosk (32"): `20px`
- Font family: 'Noto Sans' (loaded automatically from globals.css)

---

## 🔄 Keeping Your Projects in Sync

### **When to Update Your Projects:**

If you make changes to this design system (color updates, new components, etc.), you'll need to:

1. **Copy updated `globals.css`** to all projects
2. **Copy any modified components** from `/components/ui/`
3. **Test the changes** in each project

### **Version Control Tip:**

Consider keeping this "master" design system project as your source of truth. Whenever you update colors or components here, propagate those changes to your other projects.

---

## 💡 Common Use Cases

### **1. Creating a New Landing Page**
```tsx
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Card } from './components/ui/card';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lepos-dark to-lepos-dark-brand">
      <div className="container mx-auto px-4 py-16 text-white">
        <Badge className="bg-lepos-cyan text-lepos-dark mb-4">New Feature</Badge>
        <h1 className="text-5xl font-bold mb-6">Welcome to Lepos</h1>
        <p className="text-xl mb-8 text-white/80">Build amazing experiences</p>
        <Button size="lg">Get Started</Button>
      </div>
    </div>
  );
}
```

### **2. Creating a Dashboard**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';

export default function App() {
  return (
    <div className="p-8 space-y-6">
      <h1>Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$24,500</p>
            <Badge className="bg-success text-white mt-2">+12%</Badge>
          </CardContent>
        </Card>
        
        {/* More cards... */}
      </div>
      
      <Button>View Report</Button>
    </div>
  );
}
```

### **3. Creating a Form**
```tsx
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Checkbox } from './components/ui/checkbox';

export default function App() {
  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="your@email.com" />
        </div>
        
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Your message" />
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">I agree to the terms</Label>
        </div>
        
        <Button className="w-full">Submit</Button>
      </div>
    </div>
  );
}
```

---

## 🎨 Advanced Customization

### **Adding Custom Colors While Keeping Lepos Branding**

If you need project-specific colors alongside Lepos colors:

```css
/* In your project's globals.css, add after Lepos colors: */
:root {
  /* Lepos colors (keep these) */
  --lepos-dark: #21262a;
  --lepos-dark-brand: #023F59;
  --lepos-cyan: #31D7DB;
  
  /* Your custom colors */
  --custom-purple: #8B5CF6;
  --custom-green: #10B981;
}
```

```tsx
// Use in components
<div className="bg-[var(--custom-purple)]">Custom colored section</div>
```

### **Creating Project-Specific Component Variants**

You can extend Lepos components for project-specific needs:

```tsx
// components/CustomButton.tsx
import { Button } from './ui/button';

export function HeroButton({ children, ...props }) {
  return (
    <Button 
      className="text-lg px-8 py-6 bg-lepos-dark-brand hover:bg-[#034A6C] shadow-2xl"
      {...props}
    >
      {children}
    </Button>
  );
}
```

---

## 📚 Additional Resources

### **Key Files Reference**
- **Colors:** `/styles/globals.css` (lines 5-12)
- **Button styling:** `/components/ui/button.tsx`
- **Typography:** `/styles/globals.css` (lines 163-192)
- **Design tokens:** `/components/design-constants.ts`

### **Documentation Files (Optional)**
These files are part of THIS style guide project but aren't needed for new apps:
- `/App.tsx` - The style guide interface
- `/components/StyleGuide.tsx` - Style guide UI
- `/components/tabs/*` - Style guide tabs
- `/components/examples/*` - Component examples

**Don't copy these to production apps** - they're just for design reference.

---

## ✅ Final Checklist for New Projects

Before you start building your new Lepos-branded app:

- [ ] ✅ Copied `/styles/globals.css` to new project
- [ ] ✅ Copied `/components/ui/` folder to new project
- [ ] ✅ Tested that buttons use #023F59 (Lepos Dark Brand)
- [ ] ✅ Tested that text uses #21262a (Lepos Dark)
- [ ] ✅ Verified typography looks correct
- [ ] ✅ Confirmed component imports work
- [ ] 🎉 Ready to build your app!

---

## 🤝 Questions?

Common issues:

**Q: Components look unstyled**
A: Make sure you copied `/styles/globals.css` - this is required!

**Q: Colors are wrong**
A: Check that your imports point to `./components/ui/...` correctly

**Q: Button is not using #023F59**
A: You may have an old version of `button.tsx` - recopy from this project

**Q: Typography doesn't match**
A: Ensure `globals.css` is imported in your main file

---

## 🎉 You're All Set!

Your new project will now have:
✅ Consistent Lepos branding
✅ #023F59 for primary buttons and brand moments
✅ #21262a for text and readability
✅ #31D7DB for secondary actions
✅ All pre-styled components ready to use
✅ Responsive typography across all platforms

**Happy building with the Lepos Design System!** 🚀