// MOCK DATA — Replace with real API calls before production use
// Payment KPI Data
export const PaymentKPIData = [
  {
    id: 'total_collected',
    label: 'Total Collected',
    current: 52340.00,
    previous: 46620.00,
    change_percent: 12.3,
    format: 'currency',
    reverse: false
  },
  {
    id: 'no_of_transactions',
    label: 'No. of Transactions',
    current: 1247,
    previous: 1153,
    change_percent: 8.1,
    format: 'number',
    reverse: false
  },
  {
    id: 'cash_amount',
    label: 'Cash Amount',
    current: 12580.00,
    previous: 11890.00,
    change_percent: 5.8,
    format: 'currency',
    reverse: false
  },
  {
    id: 'card_amount',
    label: 'Card Amount',
    current: 28460.00,
    previous: 24230.00,
    change_percent: 17.5,
    format: 'currency',
    reverse: false
  },
  {
    id: 'digital_wallet_amount',
    label: 'Digital Wallet Amount',
    current: 9820.00,
    previous: 9150.00,
    change_percent: 7.3,
    format: 'currency',
    reverse: false
  },
  {
    id: 'credit_amount',
    label: 'Credit Amount',
    current: 1480.00,
    previous: 1350.00,
    change_percent: 9.6,
    format: 'currency',
    reverse: false
  }
];

// Sales by Payment Type Data (Donut Chart)
export const PaymentMethodData = [
  { name: 'Card', code: 'CARD', value: 28460, previous: 24230, percent: 54.4, transactions: 623, color: '#0EA5E9' },
  { name: 'Cash', code: 'CASH', value: 12580, previous: 11890, percent: 24.0, transactions: 312, color: '#22C55E' },
  { name: 'Digital Wallet', code: 'DIGITAL', value: 9820, previous: 9150, percent: 18.8, transactions: 278, color: '#8B5CF6' },
  { name: 'Credit', code: 'CREDIT', value: 1480, previous: 1350, percent: 2.8, transactions: 34, color: '#F59E0B' },
];

export const MethodTableData = PaymentMethodData.map(item => ({
  ...item,
  percentChange: ((item.value - item.previous) / item.previous) * 100
}));

// Sales by Provider Data (Bar Chart)
export const PaymentProviderData = [
  { name: 'Visa', category: 'CARD', current: 14200, previous: 11800, percentToTotal: 27.1, transactions: 298, color: '#0EA5E9' },
  { name: 'Mastercard', category: 'CARD', current: 9850, previous: 8600, percentToTotal: 18.8, transactions: 215, color: '#3B82F6' },
  { name: 'Alipay', category: 'DIGITAL', current: 4920, previous: 4580, percentToTotal: 9.4, transactions: 142, color: '#8B5CF6' },
  { name: 'WeChat Pay', category: 'DIGITAL', current: 3680, previous: 3420, percentToTotal: 7.0, transactions: 98, color: '#A855F7' },
  { name: 'UnionPay', category: 'CARD', current: 3210, previous: 2780, percentToTotal: 6.1, transactions: 82, color: '#6366F1' },
  { name: 'Octopus', category: 'DIGITAL', current: 1220, previous: 1150, percentToTotal: 2.3, transactions: 38, color: '#D946EF' },
  { name: 'AMEX', category: 'CARD', current: 1200, previous: 1050, percentToTotal: 2.3, transactions: 28, color: '#EC4899' },
  { name: 'Others', category: 'CREDIT', current: 1480, previous: 1350, percentToTotal: 2.8, transactions: 34, color: '#94A3B8' },
];

export const ProviderTableData = PaymentProviderData.map(item => ({
  ...item,
  percentChange: ((item.current - item.previous) / item.previous) * 100
}));

// Payment Sublevel Data (Table)
export const PaymentSublevelData = [
  {
    id: 'sunset-fest-2026',
    name: 'Sunset Festival 2026',
    cash: { current: 7200, previous: 6850 },
    card: { current: 15800, previous: 13200 },
    digital: { current: 5480, previous: 5030 },
    credit: { current: 800, previous: 700 },
    total: { current: 29280, previous: 25780 },
    percentToTotal: { current: 55.9, previous: 55.3 }
  },
  {
    id: 'electric-wave',
    name: 'Electric Wave',
    cash: { current: 3580, previous: 3340 },
    card: { current: 8420, previous: 7380 },
    digital: { current: 2680, previous: 2540 },
    credit: { current: 420, previous: 400 },
    total: { current: 15100, previous: 13660 },
    percentToTotal: { current: 28.9, previous: 29.3 }
  },
  {
    id: 'urban-beats-2026',
    name: 'Urban Beats 2026',
    cash: { current: 1800, previous: 1700 },
    card: { current: 4240, previous: 3650 },
    digital: { current: 1660, previous: 1580 },
    credit: { current: 260, previous: 250 },
    total: { current: 7960, previous: 7180 },
    percentToTotal: { current: 15.2, previous: 15.4 }
  }
];

export const calculatePercentChange = (curr: number, prev: number) => {
  if (prev === 0) return 0;
  return ((curr - prev) / prev) * 100;
};