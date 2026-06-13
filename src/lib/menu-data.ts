import {
  Box,
  Warehouse,
  CalendarFold,
  DollarSign,
  Calculator,
  ChartNoAxesCombined,
  Settings,
  ListTodo,
  Calendar,
  Clock,
  FolderOpen,
  Mail,
  Users,
  FileText,
  BarChart2,
  Briefcase,
  LayoutDashboard,
  Activity,
  Coins,
  KeyRound,
  BrainCircuit,
  Boxes,
  type LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  group?: string;
  badge?: string;
}

// ─── Hermes Claw (Agent) — dedicated management portals ──────
export const natliMenuItems: MenuItem[] = [
  { id: 'natli-dashboard', label: 'Overview',        icon: LayoutDashboard, group: 'Operate' },
  { id: 'natli-sessions',  label: 'Sessions',        icon: Activity,        group: 'Operate' },
  { id: 'natli-model',     label: 'Models & Tokens', icon: Coins,           group: 'Operate' },
  { id: 'natli-scheduler', label: 'Scheduler',       icon: Clock,           group: 'Operate' },
  { id: 'natli-skills',    label: 'Skills',          icon: Boxes,           group: 'Build' },
  { id: 'natli-memory',    label: 'Memory & Wiki',   icon: BrainCircuit,    group: 'Build' },
  { id: 'natli-documents', label: 'Documents',       icon: FolderOpen,      group: 'Build' },
  { id: 'natli-api',       label: 'API Keys',        icon: KeyRound,        group: 'Configure' },
  { id: 'natli-settings',  label: 'Settings',        icon: Settings,        group: 'Configure' },
];

// ─── Work platform ───────────────────────────────────────────
export const workMenuItems: MenuItem[] = [
  { id: 'work-tasks',     label: 'Tasks',     icon: ListTodo,  group: 'Workspace' },
  { id: 'work-calendar',  label: 'Calendar',  icon: Calendar,  group: 'Workspace', badge: 'Soon' },
  { id: 'work-email',     label: 'Email',     icon: Mail,      group: 'Workspace', badge: 'Soon' },
  { id: 'work-contacts',  label: 'Contacts',  icon: Users,     group: 'Workspace', badge: 'Soon' },
  { id: 'work-documents', label: 'Documents', icon: FileText,  group: 'Workspace', badge: 'Soon' },
  { id: 'work-projects',  label: 'Projects',  icon: Briefcase, group: 'Workspace', badge: 'Soon' },
  { id: 'work-reports',   label: 'Reports',   icon: BarChart2, group: 'Workspace', badge: 'Soon' },
  { id: 'work-settings',  label: 'Settings',  icon: Settings,  group: 'Workspace', badge: 'Soon' },
];

export const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'products',
    label: 'Products',
    icon: Box,
    subItems: [
      { id: 'products-list', label: 'Products' },
      { id: 'packages', label: 'Packages' },
      { id: 'tickets', label: 'Tickets' },
      { id: 'wallets', label: 'Wallets' },
      { id: 'brands', label: 'Brands' },
      { id: 'categories', label: 'Categories' },
      { id: 'menus', label: 'Menus' },
      { id: 'attributes', label: 'Attributes' },
      { id: 'modifiers', label: 'Modifiers' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Warehouse,
    subItems: [
      { id: 'inventory-stock', label: 'Inventory Stock' },
      { id: 'inventory-transfer', label: 'Inventory Transfer' },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    icon: CalendarFold,
    subItems: [
      { id: 'events-list', label: 'Events' },
      { id: 'invitations', label: 'Invitations' },
      { id: 'registration-links', label: 'Registration' },
      { id: 'event-sessions', label: 'Event Sessions' },
      { id: 'event-distribution-channels', label: 'Event Distribution Channels' },
      { id: 'event-ticket-templates', label: 'Event Ticket Templates' },
      { id: 'wallet-generation', label: 'Wallet Generation' },
    ],
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: DollarSign,
  },
  {
    id: 'register',
    label: 'Register',
    icon: Calculator,
    subItems: [
      { id: 'device-sessions', label: 'Device Sessions' },
      { id: 'registers', label: 'Registers' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: ChartNoAxesCombined,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    subItems: [
      { id: 'group-settings', label: 'Group Settings' },
      { id: 'inventory-settings', label: 'Inventory Settings' },
      { id: 'business-line-store', label: 'Business Line & Store' },
      { id: 'devices-navigation-settings', label: 'Devices Navigation Settings' },
      { id: 'device-settings', label: 'Device Settings' },
      { id: 'payments-settings', label: 'Payments Settings' },
      { id: 'payment-methods', label: 'Payment Methods' },
      { id: 'price-book-setup', label: 'Price Book Setup' },
    ],
  },
];