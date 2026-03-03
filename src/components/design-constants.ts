// Brand Colors
export const brandColors = [
  {
    name: "Lepos Dark",
    value: "#21262A",
    class: "bg-lepos-dark",
    token: "lepos-dark",
    usage: "Primary text color, logos, and general UI elements for optimal readability"
  },
  {
    name: "Lepos Dark Brand",
    value: "#023F59",
    class: "bg-lepos-dark-brand",
    token: "lepos-dark-brand",
    usage: "Primary buttons, hero sections, feature highlights, and special brand moments"
  },
  {
    name: "Lepos Cyan",
    value: "#31D7DB",
    class: "bg-lepos-cyan",
    token: "lepos-cyan",
    usage: "Secondary buttons, optional actions, and complementary brand elements"
  },
  {
    name: "Lepos Cyan Light",
    value: "#5DE4E8",
    class: "bg-lepos-cyan-light",
    token: "lepos-cyan-light",
    usage: "Light accent color for highlights and decorative elements"
  },
  {
    name: "Lepos Cyan Dark",
    value: "#28BDC1",
    class: "bg-lepos-cyan-dark",
    token: "lepos-cyan-dark",
    usage: "Darker cyan for hover states and emphasis"
  },
  {
    name: "Lepos Cyan Text",
    value: "#107DAC",
    class: "bg-lepos-cyan-text",
    token: "lepos-cyan-text",
    usage: "Readable cyan for inline text, stat numbers, and text elements on dark backgrounds"
  }
];

export const semanticColors = [
  {
    name: "Background",
    value: "#FFFFFF",
    class: "bg-background",
    token: "background",
    usage: "Main application background"
  },
  {
    name: "Foreground",
    value: "#21262A",
    class: "bg-foreground",
    token: "foreground",
    usage: "Primary text color"
  },
  {
    name: "Primary",
    value: "#023F59",
    class: "bg-primary",
    token: "primary",
    usage: "Primary action buttons and key elements"
  },
  {
    name: "Secondary",
    value: "#31D7DB",
    class: "bg-secondary",
    token: "secondary",
    usage: "Secondary actions and complementary elements"
  },
  {
    name: "Accent",
    value: "#5DE4E8",
    class: "bg-accent",
    token: "accent",
    usage: "Highlighted elements and special features"
  },
  {
    name: "Muted",
    value: "#F1F5F9",
    class: "bg-muted",
    token: "muted",
    usage: "Subtle backgrounds and disabled elements"
  },
  {
    name: "Destructive",
    value: "#EF4444",
    class: "bg-destructive",
    token: "destructive",
    usage: "Error states and destructive actions"
  },
  {
    name: "Success",
    value: "#10B981",
    class: "bg-success",
    token: "success",
    usage: "Success states and confirmations"
  }
];

export const spacingTokens = [
  { name: "xs", value: "0.25rem", usage: "4px - Minimal spacing" },
  { name: "sm", value: "0.5rem", usage: "8px - Small spacing" },
  { name: "md", value: "1rem", usage: "16px - Medium spacing" },
  { name: "lg", value: "1.5rem", usage: "24px - Large spacing" },
  { name: "xl", value: "2rem", usage: "32px - Extra large spacing" },
  { name: "2xl", value: "3rem", usage: "48px - Maximum spacing" }
];

export const radiusTokens = [
  { name: "sm", value: "calc(var(--radius) - 4px)", usage: "Small border radius" },
  { name: "md", value: "calc(var(--radius) - 2px)", usage: "Medium border radius" },
  { name: "lg", value: "var(--radius)", usage: "Large border radius (default)" },
  { name: "xl", value: "calc(var(--radius) + 4px)", usage: "Extra large border radius" },
  { name: "2xl", value: "calc(var(--radius) + 8px)", usage: "Maximum border radius" }
];

export const typographyScale = [
  {
    element: "h1",
    name: "Heading 1",
    size: "clamp(1.75rem, 4vw, 3rem)",
    weight: "700",
    lineHeight: "1.2",
    usage: "Main page titles and hero headings"
  },
  {
    element: "h2",
    name: "Heading 2",
    size: "clamp(1.5rem, 3vw, 2.25rem)",
    weight: "600",
    lineHeight: "1.3",
    usage: "Section headings and major divisions"
  },
  {
    element: "h3",
    name: "Heading 3",
    size: "clamp(1.25rem, 2.5vw, 1.875rem)",
    weight: "600",
    lineHeight: "1.4",
    usage: "Subsection headings and component titles"
  },
  {
    element: "h4",
    name: "Heading 4",
    size: "clamp(1.125rem, 2vw, 1.5rem)",
    weight: "500",
    lineHeight: "1.4",
    usage: "Card titles and minor headings"
  },
  {
    element: "p",
    name: "Body Text",
    size: "1rem",
    weight: "400",
    lineHeight: "1.6",
    usage: "Primary text content and descriptions"
  },
  {
    element: "small",
    name: "Small Text",
    size: "0.75rem",
    weight: "400",
    lineHeight: "1.4",
    usage: "Captions, labels, and secondary information"
  }
];

// Component navigation structure
export const componentNavigation = [
  {
    id: "buttons-actions",
    name: "Buttons & Actions",
    count: "2",
    icon: "MousePointerClick",
    components: [
      { id: "button-component", label: "Button" },
      { id: "icon-button-component", label: "Icon Button" }
    ]
  },
  {
    id: "form-inputs",
    name: "Form Inputs",
    count: "6",
    icon: "FormInput",
    components: [
      { id: "input-component", label: "Input" },
      { id: "textarea-component", label: "Textarea" },
      { id: "select-component", label: "Select" },
      { id: "radio-group-component", label: "Radio Group" },
      { id: "checkbox-component", label: "Checkbox" },
      { id: "switch-slider-component", label: "Switch & Slider" }
    ]
  },
  {
    id: "data-display",
    name: "Data Display",
    count: "3",
    icon: "BarChart3",
    components: [
      { id: "badge-component", label: "Badge" },
      { id: "tooltip-component", label: "Tooltip" },
      { id: "avatar-component", label: "Avatar" }
    ]
  },
  {
    id: "feedback",
    name: "Feedback",
    count: "2",
    icon: "MessageSquare",
    components: [
      { id: "alert-component", label: "Alert" },
      { id: "toast-component", label: "Toast" }
    ]
  },
  {
    id: "layout",
    name: "Layout",
    count: "4",
    icon: "LayoutGrid",
    components: [
      { id: "card-component", label: "Card" },
      { id: "accordion-component", label: "Accordion & Collapsible" },
      { id: "tabs-component", label: "Tabs" },
      { id: "separator-component", label: "Separator" }
    ]
  },
  {
    id: "navigation",
    name: "Navigation",
    count: "4",
    icon: "Navigation",
    components: [
      { id: "scope-switcher-component", label: "Scope Switcher" },
      { id: "breadcrumb-component", label: "Breadcrumb" },
      { id: "pagination-component", label: "Pagination" },
      { id: "navigation-menu-component", label: "Navigation Menu" },
      { id: "sidebar-component", label: "Sidebar" }
    ]
  },
  {
    id: "overlays",
    name: "Overlays",
    count: "5",
    icon: "Layers",
    components: [
      { id: "dialog-component", label: "Dialog" },
      { id: "sheet-component", label: "Sheet" },
      { id: "popover-component", label: "Popover" },
      { id: "alert-dialog-component", label: "Alert Dialog" },
      { id: "dropdown-component", label: "Dropdown & Context Menu" }
    ]
  },
  {
    id: "dashboard",
    name: "Dashboard",
    count: "3",
    icon: "LayoutDashboard",
    components: [
      { id: "filter-select-component", label: "Filter Select Component" },
      { id: "change-indicator-component", label: "Change Indicator Component" },
      { id: "picker-component", label: "Pickers & Selectors" }
    ]
  }
];


// Platform-specific guidelines
export const platformGuidelines = {
  mobile: {
    touchTarget: "44px minimum",
    spacing: "Generous (16px+)",
    typography: "16px base size",
    navigation: "Bottom navigation preferred"
  },
  tablet: {
    touchTarget: "40px minimum", 
    spacing: "Balanced (12px+)",
    typography: "15px base size",
    navigation: "Sidebar or top navigation"
  },
  desktop: {
    touchTarget: "36px minimum",
    spacing: "Compact (8px+)",
    typography: "14px base size", 
    navigation: "Top navigation with dropdown menus"
  },
  kiosk: {
    touchTarget: "64px minimum",
    spacing: "Extra generous (24px+)",
    typography: "18px base size",
    navigation: "Simple, linear navigation"
  }
};