// MOCK DATA — Replace with real API calls before production use
// KPI Data
export const SalesKPIData = [
  {
    id: 'gross_sales',
    label: 'GROSS SALES',
    current: 58200,
    previous: 51450,
    change_percent: 13.1,
    format: 'currency'
  },
  {
    id: 'net_sales',
    label: 'NET SALES',
    current: 52340,
    previous: 46620,
    change_percent: 12.3,
    format: 'currency'
  },
  {
    id: 'no_of_transactions',
    label: 'NO. OF TRANSACTIONS',
    current: 1247,
    previous: 1153,
    change_percent: 8.1,
    format: 'number'
  },
  {
    id: 'promotion_applied',
    label: 'PROMOTION APPLIED',
    current: 358,
    previous: 298,
    change_percent: 20.1,
    format: 'number'
  },
  {
    id: 'discount_amount',
    label: 'DISCOUNT AMOUNT',
    current: 4280,
    previous: 3540,
    change_percent: 20.9,
    format: 'currency',
    reverse: true // higher is worse (red)
  },
  {
    id: 'void_amount',
    label: 'VOID AMOUNT',
    current: { amount: 1580, count: 23 },
    previous: { amount: 1290, count: 18 },
    change_percent: 22.5,
    format: 'void', // special format
    reverse: true // higher is worse (red)
  }
];

// Sales by Channel Data
export const SalesChannelData = [
  { name: 'POS', code: 'POS', value: 28500, previous: 25200, color: '#0EA5E9' },
  { name: 'Terminal', code: 'TERMINAL', value: 18200, previous: 16800, color: '#22C55E' },
  { name: 'Kiosk', code: 'KIOSK', value: 6500, previous: 5450, color: '#F59E0B' },
  { name: 'Online Order', code: 'ONLINE', value: 3800, previous: 2900, color: '#8B5CF6' },
  { name: 'QR Order', code: 'QR', value: 1200, previous: 1100, color: '#EC4899' },
];

export const ChannelTableData = SalesChannelData.map(item => ({
  ...item,
  percentChange: ((item.value - item.previous) / item.previous) * 100,
  percentToTotal: (item.value / 58200) * 100 // Using total gross sales
}));

// Sales by Promotion Data
export const SalesPromotionData = [
  { name: 'Happy Hour 20%', current: 12400, previous: 10800, applied: 89, color: '#0EA5E9' },
  { name: 'Buy 2 Get 1 Free', current: 9600, previous: 8200, applied: 72, color: '#22C55E' },
  { name: 'Member 10% Off', current: 7800, previous: 7100, applied: 65, color: '#F59E0B' },
  { name: 'Weekend Special', current: 6200, previous: 5400, applied: 58, color: '#8B5CF6' },
  { name: 'Early Bird', current: 4100, previous: 3600, applied: 42, color: '#EC4899' },
  { name: 'Others', current: 2780, previous: 2350, applied: 32, color: '#94A3B8' },
];

export const PromotionTableData = SalesPromotionData.map(item => ({
  ...item,
  percentChange: ((item.current - item.previous) / item.previous) * 100,
  percentToTotal: (item.current / 42880) * 100 // Using total promo sales
}));

// Sales by Sublevel Data (Table)
export const SublevelData = [
  {
    id: 'central',
    name: 'Central',
    gross: { current: 32500, previous: 28200 },
    discounts: { current: 2400, previous: 1980 },
    voids: { current: 820, previous: 640 },
    net: { current: 29280, previous: 25580 },
    percentToGross: { current: 90.1, previous: 90.7 },
    percentToTotal: { current: 55.9, previous: 54.9 }
  },
  {
    id: 'east',
    name: 'East',
    gross: { current: 16800, previous: 15450 },
    discounts: { current: 1280, previous: 1050 },
    voids: { current: 520, previous: 480 },
    net: { current: 15000, previous: 13920 },
    percentToGross: { current: 89.3, previous: 90.1 },
    percentToTotal: { current: 28.7, previous: 29.9 }
  },
  {
    id: 'west',
    name: 'West',
    gross: { current: 8900, previous: 7800 },
    discounts: { current: 600, previous: 510 },
    voids: { current: 240, previous: 170 },
    net: { current: 8060, previous: 7120 },
    percentToGross: { current: 90.6, previous: 91.3 },
    percentToTotal: { current: 15.4, previous: 15.2 }
  }
];

export const calculatePercentChange = (curr: number, prev: number) => {
  if (prev === 0) return 0;
  return ((curr - prev) / prev) * 100;
};