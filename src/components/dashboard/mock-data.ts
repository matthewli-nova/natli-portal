// MOCK DATA — Replace with real API calls before production use
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export const TIME_PERIODS = [
  'Today', 'Yesterday', 'This Week', 'Last Week', 
  'This Month', 'Last Month', 'This Quarter', 'Last Quarter', 
  'This Year', 'Last Year'
];

export const HIERARCHY_LEVELS = [
  'Group', 'Business Level', 'Store'
];

export const GRANULARITY_OPTIONS = [
  'By Hour', 'By Day', 'By Week', 'By Month'
];

export const KPIData = [
  {
    id: 'total-revenue',
    label: 'Total Revenue',
    value: 124500,
    previous: 98400,
    format: 'currency',
    type: 'numeric'
  },
  {
    id: 'total-transactions',
    label: 'Total Transactions',
    value: 2845,
    previous: 2150,
    format: 'number',
    type: 'numeric'
  },
  {
    id: 'avg-transaction-value',
    label: 'Average Transaction Value',
    value: 43.76,
    previous: 45.76,
    format: 'currency',
    type: 'numeric'
  },
  {
    id: 'total-items-sold',
    label: 'Total Items Sold',
    value: 8450,
    previous: 7200,
    format: 'number',
    type: 'numeric'
  },
  {
    id: 'top-selling-product',
    label: 'Top Selling Product',
    current: { name: 'Weekend VIP Pass', count: 450 },
    previous: { name: 'Early Bird General', count: 320 },
    type: 'item'
  },
  {
    id: 'top-promotion-applied',
    label: 'Top Promotion Applied',
    current: { name: 'Group Bundle 4+1', count: 125 },
    previous: { name: 'Flash Sale 15%', count: 98 },
    type: 'item'
  }
];

export const ChartData = [
  { time: '10:00', current: 2500, previous: 1500, currentTrans: 45, prevTrans: 30 },
  { time: '11:00', current: 4800, previous: 3200, currentTrans: 85, prevTrans: 65 },
  { time: '12:00', current: 9500, previous: 6800, currentTrans: 180, prevTrans: 140 },
  { time: '13:00', current: 15400, previous: 11500, currentTrans: 290, prevTrans: 220 },
  { time: '14:00', current: 22800, previous: 16400, currentTrans: 420, prevTrans: 310 },
  { time: '15:00', current: 31500, previous: 24200, currentTrans: 580, prevTrans: 450 },
  { time: '16:00', current: 42600, previous: 33500, currentTrans: 750, prevTrans: 620 },
  { time: '17:00', current: 58900, previous: 44800, currentTrans: 980, prevTrans: 810 },
  { time: '18:00', current: 76400, previous: 58200, currentTrans: 1250, prevTrans: 1050 },
  { time: '19:00', current: 94500, previous: 72500, currentTrans: 1580, prevTrans: 1320 },
  { time: '20:00', current: 108200, previous: 85400, currentTrans: 1950, prevTrans: 1680 },
  { time: '21:00', current: 118600, previous: 94200, currentTrans: 2450, prevTrans: 1950 },
  { time: '22:00', current: 124500, previous: 98400, currentTrans: 2845, prevTrans: 2150 },
];

export const TableData = [
  {
    id: 1,
    name: 'Sunset Festival 2026',
    amount: { current: 68450, previous: 52100 },
    percent: { current: 54.9, previous: 52.9 },
    transactions: { current: 1560, previous: 1140 }
  },
  {
    id: 2,
    name: 'Electric Wave',
    amount: { current: 38200, previous: 34500 },
    percent: { current: 30.7, previous: 35.1 },
    transactions: { current: 890, previous: 760 }
  },
  {
    id: 3,
    name: 'Urban Beats 2026',
    amount: { current: 17850, previous: 11800 },
    percent: { current: 14.4, previous: 12.0 },
    transactions: { current: 395, previous: 250 }
  }
];

export const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

export const formatCompactCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value);
};
