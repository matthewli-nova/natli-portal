import { formatCompactCurrency } from "./mock-data";

// Product KPI Data
export const ProductKPIData = [
  {
    id: 'total_items_sold',
    label: 'Total Items Sold',
    current: 3892,
    previous: 3378,
    change_percent: 15.2,
    type: 'standard',
    reverse: false // Higher is better (Green)
  },
  {
    id: 'unique_products_sold',
    label: 'Unique Products Sold',
    current: 156,
    previous: 142,
    change_percent: 9.9,
    type: 'standard',
    reverse: false // Higher is better (Green)
  },
  {
    id: 'top_selling_product',
    label: 'Top Selling Product',
    name: 'Beer Tower',
    amount: 4680.00,
    count: 156,
    type: 'top-selling'
  },
  {
    id: 'top_selling_category',
    label: 'Top Selling Category',
    name: 'Beverages',
    amount: 22400.00,
    count: 1520,
    type: 'top-selling'
  },
  {
    id: 'stock_out_count',
    label: 'Stock-out Count',
    current: 8,
    previous: 5,
    change_percent: 60.0,
    type: 'standard',
    reverse: true // Higher is worse (Red)
  },
  {
    id: 'low_stock_count',
    label: 'Low Stock Count',
    current: 23,
    previous: 18,
    change_percent: 27.8,
    type: 'standard',
    reverse: true // Higher is worse (Red)
  }
];

// Sales by Category Data (with Drill-down)
// Level 1: Categories
export const CategoryData = [
  { id: 'cat-1', name: 'Beverages', quantity: 1520, previousQty: 1286, quantityMix: 39.0, amount: 22400, previousAmount: 19800, amountMix: { current: 42.8, previous: 41.5 }, color: '#0EA5E9' },
  { id: 'cat-2', name: 'Food', quantity: 1380, previousQty: 1226, quantityMix: 35.5, amount: 18600, previousAmount: 16200, amountMix: { current: 35.5, previous: 34.8 }, color: '#22C55E' },
  { id: 'cat-3', name: 'Merchandise', quantity: 620, previousQty: 540, quantityMix: 15.9, amount: 9800, previousAmount: 8950, amountMix: { current: 18.7, previous: 20.1 }, color: '#F59E0B' },
  { id: 'cat-4', name: 'Tickets', quantity: 372, previousQty: 342, quantityMix: 9.6, amount: 1540, previousAmount: 1385, amountMix: { current: 2.9, previous: 3.6 }, color: '#8B5CF6' },
];

// Level 2: Products (Mock for Beverages)
export const ProductLevelData = [
  { id: 'prod-1', name: 'Beer Tower', quantity: 156, previousQty: 127, quantityMix: 10.3, amount: 4680, previousAmount: 3883, amountMix: { current: 20.9, previous: 19.6 }, color: '#0EA5E9' },
  { id: 'prod-2', name: 'Craft Beer', quantity: 142, previousQty: 123, quantityMix: 9.3, amount: 2840, previousAmount: 2400, amountMix: { current: 12.7, previous: 12.1 }, color: '#3B82F6' },
  { id: 'prod-3', name: 'House Wine', quantity: 298, previousQty: 265, quantityMix: 19.6, amount: 4470, previousAmount: 3914, amountMix: { current: 20.0, previous: 19.8 }, color: '#6366F1' },
  { id: 'prod-4', name: 'Soft Drinks', quantity: 524, previousQty: 418, quantityMix: 34.5, amount: 2620, previousAmount: 2145, amountMix: { current: 11.7, previous: 10.8 }, color: '#8B5CF6' },
  { id: 'prod-5', name: 'Cocktails', quantity: 212, previousQty: 186, quantityMix: 13.9, amount: 4240, previousAmount: 3639, amountMix: { current: 18.9, previous: 18.3 }, color: '#A855F7' },
  { id: 'prod-6', name: 'Coffee', quantity: 188, previousQty: 169, quantityMix: 12.4, amount: 1550, previousAmount: 1374, amountMix: { current: 6.9, previous: 6.9 }, color: '#D946EF' },
];

// Level 3: Variants (Mock for Craft Beer)
export const VariantLevelData = [
  { id: 'var-1', name: 'Craft Beer - IPA', quantity: 58, previousQty: 49, quantityMix: 40.8, amount: 1160, previousAmount: 960, amountMix: { current: 40.8, previous: 39.2 }, color: '#0EA5E9' },
  { id: 'var-2', name: 'Craft Beer - Lager', quantity: 52, previousQty: 46, quantityMix: 36.6, amount: 1040, previousAmount: 900, amountMix: { current: 36.6, previous: 37.5 }, color: '#22C55E' },
  { id: 'var-3', name: 'Craft Beer - Stout', quantity: 32, previousQty: 28, quantityMix: 22.5, amount: 640, previousAmount: 550, amountMix: { current: 22.5, previous: 23.3 }, color: '#F59E0B' },
];

// Top Products Data
export const TopProductsData = [
  { id: 'p1', sku: 'BEV-001', name: 'Beer Tower', variant: '-', amount: 4680, previousAmount: 4320, quantity: 156, previousQuantity: 142, stock: 42, reorder: 30, image: 'figma:asset/beertower.png', status: 'Active' },
  { id: 'p2', sku: 'BEV-012', name: 'House Wine', variant: 'Red', amount: 4625, previousAmount: 4450, quantity: 185, previousQuantity: 178, stock: 18, reorder: 24, image: 'figma:asset/wine.png', status: 'Active' },
  { id: 'p3', sku: 'FOOD-003', name: 'Burger Combo', variant: '-', amount: 4260, previousAmount: 4580, quantity: 142, previousQuantity: 153, stock: 85, reorder: 50, image: 'figma:asset/burger.png', status: 'Active' },
  { id: 'p4', sku: 'FOOD-008', name: 'Fish & Chips', variant: '-', amount: 4200, previousAmount: 3950, quantity: 168, previousQuantity: 158, stock: 62, reorder: 40, image: 'figma:asset/fishnchips.png', status: 'Active' },
  { id: 'p5', sku: 'MERCH-002', name: 'Event T-Shirt', variant: 'M', amount: 2940, previousAmount: 3120, quantity: 98, previousQuantity: 104, stock: 45, reorder: 20, image: 'figma:asset/tshirt.png', status: 'Inactive' },
  { id: 'p6', sku: 'BEV-005', name: 'Craft Beer', variant: 'IPA', amount: 2840, previousAmount: 2680, quantity: 142, previousQuantity: 134, stock: 36, reorder: 24, image: 'figma:asset/craftbeer.png', status: 'Active' },
  { id: 'p7', sku: 'FOOD-001', name: 'Pizza', variant: 'Pepperoni', amount: 2520, previousAmount: 2520, quantity: 84, previousQuantity: 84, stock: 28, reorder: 30, image: 'figma:asset/pizza.png', status: 'Active' },
  { id: 'p8', sku: 'BEV-008', name: 'Soft Drinks', variant: 'Cola', amount: 2620, previousAmount: 2480, quantity: 524, previousQuantity: 496, stock: 120, reorder: 100, image: 'figma:asset/softdrink.png', status: 'Active' },
  { id: 'p9', sku: 'FOOD-015', name: 'Nachos', variant: 'Grande', amount: 2100, previousAmount: 2310, quantity: 105, previousQuantity: 115, stock: 55, reorder: 40, image: 'figma:asset/nachos.png', status: 'Inactive' },
  { id: 'p10', sku: 'MERCH-005', name: 'Cap', variant: 'Black', amount: 1800, previousAmount: 1650, quantity: 90, previousQuantity: 83, stock: 32, reorder: 25, image: 'figma:asset/cap.png', status: 'Active' },
];

// Top Modifiers Data
export const TopModifiersData = [
  { rank: 1, name: 'Extra Cheese', parents: 'Burger, Pizza, Sandwich', quantity: 342, previousQty: 289, amount: 684, previousAmount: 578 },
  { rank: 2, name: 'Add Bacon', parents: 'Burger, Salad, Wrap', quantity: 256, previousQty: 210, amount: 768, previousAmount: 630 },
  { rank: 3, name: 'Large Size', parents: 'Soft Drinks, Fries', quantity: 428, previousQty: 370, amount: 428, previousAmount: 370 },
  { rank: 4, name: 'No Ice', parents: 'All Beverages', quantity: 185, previousQty: 171, amount: 0, previousAmount: 0 },
  { rank: 5, name: 'Extra Shot', parents: 'Coffee, Espresso', quantity: 124, previousQty: 97, amount: 186, previousAmount: 146 },
  { rank: 6, name: 'Gluten Free', parents: 'Pizza, Pasta', quantity: 89, previousQty: 78, amount: 267, previousAmount: 234 },
  { rank: 7, name: 'Extra Sauce', parents: 'Wings, Nuggets', quantity: 156, previousQty: 142, amount: 78, previousAmount: 71 },
  { rank: 8, name: 'No Onion', parents: 'Burger, Salad', quantity: 134, previousQty: 128, amount: 0, previousAmount: 0 },
  { rank: 9, name: 'Whipped Cream', parents: 'Coffee, Dessert', quantity: 98, previousQty: 85, amount: 49, previousAmount: 43 },
  { rank: 10, name: 'Spicy', parents: 'Wings, Fries', quantity: 112, previousQty: 102, amount: 0, previousAmount: 0 },
];

// Stock Alerts Data
export const StockAlertsData = [
  {
    outlet: 'Diamond VIP Lounge',
    items: [
      { status: 'out', sku: 'MERCH-002-XL', name: 'Event T-Shirt - XL', category: 'Merchandise', stock: 0, reorder: 20, lastSale: '2 hrs ago' },
      { status: 'low', sku: 'BEV-001', name: 'Beer Tower', category: 'Beverages', stock: 8, reorder: 30, lastSale: '15 min ago' },
      { status: 'low', sku: 'BEV-012-R', name: 'House Wine - Red', category: 'Beverages', stock: 6, reorder: 24, lastSale: '30 min ago' },
    ]
  },
  {
    outlet: 'Global Food Court',
    items: [
      { status: 'low', sku: 'FOOD-003P', name: 'Burger Patty', category: 'Food', stock: 12, reorder: 50, lastSale: '5 min ago' },
      { status: 'low', sku: 'MERCH-002-L', name: 'Event T-Shirt - L', category: 'Merchandise', stock: 5, reorder: 15, lastSale: '1 hr ago' },
    ]
  },
  {
    outlet: 'Main Stage Bar',
    items: [
      { status: 'out', sku: 'BEV-005-S', name: 'Craft Beer - Stout', category: 'Beverages', stock: 0, reorder: 24, lastSale: '45 min ago' },
      { status: 'low', sku: 'FOOD-008', name: 'Fish & Chips', category: 'Food', stock: 8, reorder: 40, lastSale: '20 min ago' },
    ]
  }
];

// Product Sublevel Data
export const ProductSublevelData = [
  {
    name: 'Sunset Festival 2026',
    itemSold: { current: 2180, previous: 1890 },
    topProduct: { name: 'Beer Tower', sold: 92, percentItem: 4.2, amount: 2760, percentTotal: 9.4 },
    topCategory: { name: 'Beverages', sold: 856, percentItem: 39.3, amount: 12800, percentTotal: 43.7 }
  },
  {
    name: 'Electric Wave',
    itemSold: { current: 1120, previous: 980 },
    topProduct: { name: 'Fish & Chips', sold: 68, percentItem: 6.1, amount: 1700, percentTotal: 11.3 },
    topCategory: { name: 'Food', sold: 445, percentItem: 39.7, amount: 6200, percentTotal: 41.1 }
  },
  {
    name: 'Urban Beats 2026',
    itemSold: { current: 592, previous: 508 },
    topProduct: { name: 'Craft Beer', sold: 48, percentItem: 8.1, amount: 960, percentTotal: 12.1 },
    topCategory: { name: 'Beverages', sold: 238, percentItem: 40.2, amount: 3580, percentTotal: 45.0 }
  }
];

// Helper to calculate percentage change
export const calculatePercentChange = (curr: number, prev: number) => {
  if (prev === 0) return 0;
  return ((curr - prev) / prev) * 100;
};