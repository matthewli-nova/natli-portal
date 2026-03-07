import {
  Gauge,
  Box,
  Warehouse,
  CalendarFold,
  DollarSign,
  Calculator,
  ChartNoAxesCombined,
  Settings,
  Building2,
  Bot,
  Brain,
  Search,
  ListTodo,
  Calendar,
  Clock,
  FolderOpen,
  Wrench,
  Mail,
  Users,
  FileText,
  BarChart2,
  Briefcase,
} from 'lucide-react';

export const natliMenuItems = [
  {
    id: 'natli-dashboard',
    label: 'Dashboard',
    icon: Gauge,
  },
  {
    id: 'natli-office',
    label: 'Office',
    icon: Building2,
  },
  {
    id: 'natli-model',
    label: 'Model',
    icon: Brain,
  },
  {
    id: 'natli-agent',
    label: 'Agent',
    icon: Bot,
  },
  {
    id: 'natli-skills',
    label: 'Skills',
    icon: Wrench,
  },
  {
    id: 'natli-scheduler',
    label: 'Scheduler',
    icon: Clock,
  },
  {
    id: 'natli-file',
    label: 'File',
    icon: FolderOpen,
  },
  {
    id: 'natli-settings',
    label: 'Setting',
    icon: Settings,
  },
];

export const workMenuItems = [
  {
    id: 'work-dashboard',
    label: 'Dashboard',
    icon: Gauge,
  },
  {
    id: 'work-tasks',
    label: 'Tasks',
    icon: ListTodo,
  },
  {
    id: 'work-calendar',
    label: 'Calendar',
    icon: Calendar,
  },
  {
    id: 'work-email',
    label: 'Email',
    icon: Mail,
  },
  {
    id: 'work-contacts',
    label: 'Contacts',
    icon: Users,
  },
  {
    id: 'work-documents',
    label: 'Documents',
    icon: FileText,
  },
  {
    id: 'work-projects',
    label: 'Projects',
    icon: Briefcase,
  },
  {
    id: 'work-reports',
    label: 'Reports',
    icon: BarChart2,
  },
  {
    id: 'work-settings',
    label: 'Settings',
    icon: Settings,
  },
];

export const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Gauge,
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