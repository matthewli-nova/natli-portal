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
  Search,
  ListTodo,
  Calendar,
  Clock,
  FolderOpen,
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
    id: 'natli-agent',
    label: 'Agent',
    icon: Bot,
  },
  {
    id: 'natli-research',
    label: 'Research',
    icon: Search,
  },
  {
    id: 'natli-task',
    label: 'Task',
    icon: ListTodo,
  },
  {
    id: 'natli-calendar',
    label: 'Calendar',
    icon: Calendar,
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