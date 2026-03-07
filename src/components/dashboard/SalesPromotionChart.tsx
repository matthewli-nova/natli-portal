import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { SalesPromotionData, PromotionTableData, calculatePercentChange } from "./sales-mock-data";
import { formatCurrency, formatNumber } from "./mock-data";
import { ChangeIndicator } from "../ui/change-indicator";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export function SalesPromotionChart() {
  const [isReady, setIsReady] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const totalAmount = SalesPromotionData.reduce((acc, curr) => acc + curr.current, 0);
  const totalPrevious = PromotionTableData.reduce((acc, curr) => acc + curr.previous, 0);
  const totalApplied = PromotionTableData.reduce((acc, curr) => acc + curr.applied, 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLPSort = () => {
    if (sortDirection === null) {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortDirection('asc');
    } else {
      setSortDirection(null);
    }
  };

  const sortedData = [...PromotionTableData].sort((a, b) => {
    if (sortDirection === null) return 0;
    if (sortDirection === 'desc') {
      return b.previous - a.previous;
    }
    return a.previous - b.previous;
  });

  return (
    <Card className="flex flex-col h-full gap-0 overflow-hidden">
      <CardHeader className="pt-[21px] pl-[21px] pr-[21px] pb-[7px]">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sales by Promotion</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 p-0">
        <div className="h-[250px] min-h-[250px] w-full px-[14px] mt-0">
          {isReady && (
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={50}>
              <BarChart
                layout="vertical"
                data={SalesPromotionData}
                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120} 
                  tick={{ fontSize: 12 }} 
                  tickLine={false} 
                  axisLine={false} 
                />
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
                                style={{ backgroundColor: data.payload.color }}
                              />
                              <span className="text-muted-foreground">
                                Sales:
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
                <Bar dataKey="current" barSize={20} radius={[0, 4, 4, 0]}>
                  {SalesPromotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="overflow-x-auto p-[0px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-muted/50">
                <TableHead className="pl-[21px] text-foreground">Promotion</TableHead>
                <TableHead className="text-right text-foreground">Curr</TableHead>
                <TableHead className="text-right text-foreground">
                  <div className="flex items-center justify-end cursor-pointer hover:text-foreground transition-colors" onClick={handleLPSort}>
                    <span>LP</span>
                    {sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> :
                     sortDirection === 'desc' ? <ArrowDown className="w-4 h-4 ml-1" /> :
                     <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="text-right text-foreground">Chg%</TableHead>
                <TableHead className="text-right text-foreground">% Total</TableHead>
                <TableHead className="text-right pr-[21px] text-foreground">Appld</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.name} className="hover:bg-muted/50 border-b last:border-0">
                  <TableCell className="font-medium pl-[21px]">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.color }} />
                       {row.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(row.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.previous)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <ChangeIndicator change={row.percentChange} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{row.percentToTotal.toFixed(2)}%</TableCell>
                  <TableCell className="text-right pr-[21px]">{row.applied}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold hover:bg-muted/50 border-t-2">
                <TableCell className="pl-[21px]">TOTAL</TableCell>
                <TableCell className="text-right">{formatCurrency(totalAmount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalPrevious)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <ChangeIndicator change={calculatePercentChange(totalAmount, totalPrevious)} />
                  </div>
                </TableCell>
                <TableCell className="text-right">100%</TableCell>
                <TableCell className="text-right pr-[21px]">{totalApplied}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}