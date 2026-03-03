import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { PaymentMethodData, MethodTableData } from "./payment-mock-data";
import { formatCurrency, formatNumber } from "./mock-data";
import { ChangeIndicator } from "../ui/change-indicator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label } from "recharts";

export function PaymentMethodChart() {
  const [isReady, setIsReady] = useState(false);
  const totalAmount = PaymentMethodData.reduce((acc, curr) => acc + curr.value, 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="flex flex-col h-full gap-0 overflow-hidden">
      <CardHeader className="pt-[21px] pl-[21px] pr-[21px] pb-[7px]">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sales by Payment Type</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 p-0">
        <div className="h-[250px] min-h-[250px] w-full relative px-[14px] mt-0">
          {isReady && (
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={50}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={PaymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {PaymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                  <Label
                    position="center"
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 8}
                              className="fill-muted-foreground text-sm"
                            >
                              Total
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 12}
                              className="fill-foreground text-lg font-bold"
                            >
                              {formatCurrency(totalAmount)}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-white rounded-[6px] border border-border shadow-sm p-3 text-xs">
                          <div className="font-semibold text-foreground mb-1">{data.name}</div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-1.5 h-1.5 rounded-full" 
                                style={{ backgroundColor: data.payload.fill || data.payload.color }}
                              />
                              <span className="text-muted-foreground">
                                Amount:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(Number(data.value))}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-muted-foreground ml-4">
                                Trans:
                              </span>
                              <span className="font-medium">
                                {data.payload.transactions}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingLeft: '20px' }}
                  formatter={(value, entry: any) => {
                    const item = PaymentMethodData.find(d => d.name === value);
                    const percent = item ? ((item.value / totalAmount) * 100).toFixed(2) : 0;
                    return <span className="text-gray-600 inline-block py-1">{value} ({percent}%)</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="overflow-x-auto p-[0px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-muted/50">
                <TableHead className="pl-[21px] text-[#21262A]">Method</TableHead>
                <TableHead className="text-right text-[#21262A]">Current</TableHead>
                <TableHead className="text-right text-[#21262A]">LP</TableHead>
                <TableHead className="text-right text-[#21262A]">Chg%</TableHead>
                <TableHead className="text-right text-[#21262A]">% to Total</TableHead>
                <TableHead className="text-right pr-[21px] text-[#21262A]">Trans.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MethodTableData.map((row) => (
                <TableRow key={row.code} className="hover:bg-muted/50 border-b last:border-0">
                  <TableCell className="font-medium pl-[21px]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.color }} />
                      {row.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(row.value)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.previous)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <ChangeIndicator change={row.percentChange} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{row.percent.toFixed(2)}%</TableCell>
                  <TableCell className="text-right pr-[21px]">{row.transactions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}