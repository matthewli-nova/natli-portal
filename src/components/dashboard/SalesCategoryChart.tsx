import { useState, useEffect } from "react";
import { SegmentedControl } from "../ui/segmented-control";
import { CardHeaderActions, ActionTextButton, Separator } from "../ui/card-header-actions";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { formatCurrency, formatNumber } from "./mock-data";
import { CategoryData, ProductLevelData, VariantLevelData } from "./product-mock-data";
import { ChangeIndicator } from "../ui/change-indicator";

type DrillLevel = 'category' | 'product' | 'variant';
type ChartOrientation = 'horizontal' | 'vertical';

export function SalesCategoryChart() {
  const [isReady, setIsReady] = useState(false);
  const [drillLevel, setDrillLevel] = useState<DrillLevel>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<ChartOrientation>('horizontal');

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Determine current data based on level
  // In a real app, you'd fetch data based on the selected ID.
  // Here we just swap the mock data arrays.
  let currentData: any[] = [];
  let title = "Sales by Category";

  if (drillLevel === 'category') {
    currentData = CategoryData;
    title = "Sales by Category";
  } else if (drillLevel === 'product') {
    currentData = ProductLevelData;
    title = `Sales by Product (${selectedCategory})`;
  } else {
    currentData = VariantLevelData;
    title = `Sales by Variant (${selectedProduct})`;
  }

  // Calculate totals for the current view
  const totalQty = currentData.reduce((acc, item) => acc + item.quantity, 0);
  const totalQtyPrev = currentData.reduce((acc, item) => acc + item.previousQty, 0);
  const totalAmount = currentData.reduce((acc, item) => acc + item.amount, 0);
  const totalAmountPrev = currentData.reduce((acc, item) => acc + item.previousAmount, 0);

  const handleDrillDown = (item: any) => {
    if (drillLevel === 'category') {
      setDrillLevel('product');
      setSelectedCategory(item.name);
    } else if (drillLevel === 'product') {
      setDrillLevel('variant');
      setSelectedProduct(item.name);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setDrillLevel('category');
      setSelectedCategory(null);
      setSelectedProduct(null);
    } else if (index === 1) {
      setDrillLevel('product');
      setSelectedProduct(null);
    }
  };

  // Helper to safely get nested mix values or direct values
  const getMixCurrent = (item: any) => typeof item.amountMix === 'object' ? item.amountMix.current : item.amountMix;
  const getMixPrevious = (item: any) => typeof item.amountMix === 'object' ? item.amountMix.previous : 0; // Variant level doesn't have prev mix in mock? Let's check.
  // Variant mock has `amountMix: { current: ..., previous: ... }` so it's fine.

  // Calculate dynamic chart height with conditional gaps
  const barSize = 20;
  const gapSize = drillLevel === 'product' ? 16 : 10; // Larger gap for product view
  const chartHeight = orientation === 'horizontal' 
    ? (currentData.length * barSize) + ((currentData.length - 1) * gapSize) + 10
    : 300; // Fixed height for vertical orientation

  return (
    <Card className="flex flex-col h-full gap-0 overflow-hidden">
      <CardHeader className="pt-[14px] pl-[21px] pr-[21px] pb-[7px] flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        
        <CardHeaderActions>
          <SegmentedControl 
            value={orientation} 
            onChange={(v) => setOrientation(v)} 
            options={[
              { label: 'Horizontal', value: 'horizontal' },
              { label: 'Vertical', value: 'vertical' }
            ]}
          />

          <Separator />

          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-1">
            {['All Categories', selectedCategory, selectedProduct]
              .filter((crumb): crumb is string => crumb !== null)
              .map((crumb, index, filteredArray) => (
              <div key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />}
                <ActionTextButton onClick={() => handleBreadcrumbClick(index)}>
                  {index === 0 ? `${crumb} →` : crumb}
                </ActionTextButton>
              </div>
            ))}
          </div>
        </CardHeaderActions>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 p-0">
        {/* Bar Chart - Dynamic Orientation */}
        <div style={{ height: `${chartHeight}px`, minHeight: `${chartHeight}px` }} className="w-full mt-0 p-[14px]">
          {isReady && (
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={50}>
              <BarChart
                layout={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
                data={currentData}
                margin={orientation === 'horizontal' 
                  ? { top: 0, right: 16, left: 26, bottom: 0 }
                  : { top: 10, right: 16, left: 16, bottom: 40 }
                }
                barCategoryGap={drillLevel === 'product' ? '20%' : '50%'}
              >
                {orientation === 'horizontal' ? (
                  <>
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100} 
                      tick={{ fontSize: 12 }} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                  </>
                ) : (
                  <>
                    <XAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false} 
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      type="number" 
                      hide
                    />
                  </>
                )}
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-white rounded-[6px] border border-border shadow-sm p-3 text-xs">
                          <div className="font-semibold text-foreground mb-1">{data.payload.name}</div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-1.5 h-1.5 rounded-full" 
                                style={{ backgroundColor: data.payload.color || '#8884d8' }}
                              />
                              <span className="text-muted-foreground">
                                Revenue:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(Number(data.value))}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  barSize={20} 
                  radius={orientation === 'horizontal' ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                >
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-[0px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-muted/50">
                <TableHead className="w-[20%] pl-[21px] text-foreground">Name</TableHead>
                <TableHead className="text-right text-foreground">Qty Sold</TableHead>
                <TableHead className="text-right text-foreground">Product Mix %</TableHead>
                <TableHead className="text-right text-foreground">Revenue</TableHead>
                <TableHead className="text-right pr-[21px] text-foreground">Revenue Mix %</TableHead>
              </TableRow>
              <TableRow className="hover:bg-transparent border-b text-xs text-foreground bg-muted/30">
                <TableHead className="pl-[21px] text-foreground"></TableHead>
                <TableHead className="text-right text-foreground">
                    <div className="flex justify-end gap-4">
                        <span className="w-[60px] text-right">Curr</span>
                        <span className="w-[60px] text-right">Chg%</span>
                    </div>
                </TableHead>
                <TableHead className="text-right text-foreground">Curr</TableHead>
                <TableHead className="text-right text-foreground">
                    <div className="flex justify-end gap-4">
                        <span className="w-[60px] text-right">Curr</span>
                        <span className="w-[60px] text-right">Chg%</span>
                    </div>
                </TableHead>
                <TableHead className="text-right pr-[21px] text-foreground">
                    <div className="flex justify-end gap-4">
                        <span className="w-[50px] text-right">Curr</span>
                        <span className="w-[50px] text-right">LP</span>
                        <span className="w-[60px] text-right">Chg</span>
                    </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row) => (
                <TableRow 
                  key={row.id} 
                  className={`hover:bg-muted/50 border-b last:border-0 ${drillLevel !== 'variant' ? 'cursor-pointer' : ''}`}
                  onClick={() => drillLevel !== 'variant' && handleDrillDown(row)}
                >
                  <TableCell className="font-medium pl-[21px]">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.color }} />
                       {row.name}
                    </div>
                  </TableCell>
                  
                  {/* Qty Sold */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-4 items-center">
                        <span className="font-medium w-[60px] text-right">{formatNumber(row.quantity)}</span>
                        <div className="w-[60px] flex justify-end">
                          <ChangeIndicator change={((row.quantity - row.previousQty) / row.previousQty) * 100} />
                        </div>
                    </div>
                  </TableCell>

                  {/* Product Mix % */}
                  <TableCell className="text-right">{row.quantityMix.toFixed(1)}%</TableCell>

                  {/* Revenue */}
                  <TableCell className="text-right">
                     <div className="flex justify-end gap-4 items-center">
                        <span className="font-medium w-[60px] text-right">{formatCurrency(row.amount)}</span>
                        <div className="w-[60px] flex justify-end">
                          <ChangeIndicator change={((row.amount - row.previousAmount) / row.previousAmount) * 100} />
                        </div>
                    </div>
                  </TableCell>

                  {/* Revenue Mix % */}
                  <TableCell className="text-right pr-[21px]">
                    <div className="flex justify-end gap-4 items-center">
                        <span className="font-medium w-[50px] text-right">{getMixCurrent(row).toFixed(1)}%</span>
                        <span className="text-muted-foreground w-[50px] text-right">{getMixPrevious(row).toFixed(1)}%</span>
                        <div className="w-[60px] flex justify-end">
                          <ChangeIndicator change={getMixCurrent(row) - getMixPrevious(row)} isPercent={false} />
                        </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Total Row */}
              <TableRow className="bg-muted/50 font-bold hover:bg-muted/50 border-t-2">
                <TableCell className="pl-[21px]">TOTAL {drillLevel !== 'category' && `(${selectedCategory || selectedProduct})`}</TableCell>
                
                {/* Qty Sold Total */}
                <TableCell className="text-right">
                    <div className="flex justify-end gap-4 items-center">
                        <span className="w-[60px] text-right">{formatNumber(totalQty)}</span>
                        <div className="w-[60px] flex justify-end">
                          <ChangeIndicator change={((totalQty - totalQtyPrev) / totalQtyPrev) * 100} />
                        </div>
                    </div>
                </TableCell>

                 {/* Product Mix Total */}
                 <TableCell className="text-right">100%</TableCell>

                 {/* Revenue Total */}
                 <TableCell className="text-right">
                    <div className="flex justify-end gap-4 items-center">
                        <span className="w-[60px] text-right">{formatCurrency(totalAmount)}</span>
                        <div className="w-[60px] flex justify-end">
                          <ChangeIndicator change={((totalAmount - totalAmountPrev) / totalAmountPrev) * 100} />
                        </div>
                    </div>
                 </TableCell>

                 {/* Revenue Mix Total */}
                 <TableCell className="text-right pr-[21px]">
                    <div className="flex justify-end gap-4 items-center">
                        <span className="w-[50px] text-right">100%</span>
                        <span className="text-muted-foreground w-[50px] text-right">100%</span>
                        <span className="w-[60px] text-right">-</span>
                    </div>
                 </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}