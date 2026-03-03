import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SegmentedControl } from '../ui/segmented-control';
import { CardHeaderActions, ActionTextButton, Separator } from '../ui/card-header-actions';
import { GRANULARITY_OPTIONS, ChartData, formatCurrency } from './mock-data';

export function RevenueChart() {
  const [isReady, setIsReady] = useState(false);
  const [granularity, setGranularity] = useState('By Hour');
  const [displayMode, setDisplayMode] = useState<'standard' | 'accumulated'>('standard');

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate accumulated data if needed
  const chartData = displayMode === 'accumulated' 
    ? ChartData.reduce((acc: any[], curr, index) => {
        if (index === 0) {
          acc.push(curr);
        } else {
          const prev = acc[index - 1];
          acc.push({
            ...curr,
            current: curr.current + prev.current,
            previous: curr.previous + prev.previous,
          });
        }
        return acc;
      }, [])
    : ChartData;

  return (
    <Card className="w-full flex flex-col gap-0 overflow-hidden">
      <CardHeader className="pt-[14px] pl-[21px] pr-[21px] pb-[7px] flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Revenue Trend</CardTitle>
        
        <CardHeaderActions className="!gap-3">
          <Select value={granularity} onValueChange={setGranularity}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Granularity" />
            </SelectTrigger>
            <SelectContent>
              {GRANULARITY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <SegmentedControl 
            value={displayMode} 
            onChange={(v) => setDisplayMode(v)} 
            options={[
              { label: 'Standard', value: 'standard' },
              { label: 'Accumulated', value: 'accumulated' }
            ]}
          />

          <Separator />

          <ActionTextButton className="h-8">
            View All
            <span className="text-[10px] ml-1">→</span>
          </ActionTextButton>
        </CardHeaderActions>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] min-h-[300px] w-full min-h-[300px] mt-0 px-[14px] pt-[0px] pb-[7px]">
          {isReady && (
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={50}>
              <LineChart
                data={(() => {
                  const data24h = [
                    { time: '08:00', current: 2500, previous: 2100 },
                    { time: '09:00', current: 3800, previous: 3200 },
                    { time: '10:00', current: 5500, previous: 4800 },
                    { time: '11:00', current: 7200, previous: 6100 },
                    { time: '12:00', current: 12400, previous: 10500 },
                    { time: '13:00', current: 15800, previous: 13200 },
                    { time: '14:00', current: 18200, previous: 15500 },
                    { time: '15:00', current: 22500, previous: 19800 },
                    { time: '16:00', current: 28400, previous: 24500 },
                    { time: '17:00', current: 35600, previous: 30200 },
                    { time: '18:00', current: 42800, previous: 36500 },
                    { time: '19:00', current: 48500, previous: 41200 },
                    { time: '20:00', current: 55200, previous: 46800 },
                    { time: '21:00', current: 62400, previous: 52500 },
                    { time: '22:00', current: 58500, previous: 49800 },
                    { time: '23:00', current: 45200, previous: 38500 },
                    { time: '00:00', current: 32400, previous: 27500 },
                    { time: '01:00', current: 22500, previous: 19200 },
                    { time: '02:00', current: 15200, previous: 12800 },
                    { time: '03:00', current: 8500, previous: 7200 },
                    { time: '04:00', current: 4200, previous: 3500 },
                    { time: '05:00', current: 1800, previous: 1500 },
                    { time: '06:00', current: 1200, previous: 1000 },
                    { time: '07:00', current: 1500, previous: 1200 },
                  ];
                  
                  if (displayMode === 'accumulated') {
                    return data24h.reduce((acc: any[], curr, index) => {
                      if (index === 0) {
                        acc.push(curr);
                      } else {
                        const prev = acc[index - 1];
                        acc.push({
                          ...curr,
                          current: curr.current + prev.current,
                          previous: curr.previous + prev.previous,
                        });
                      }
                      return acc;
                    }, []);
                  }
                  return data24h;
                })()}
                margin={{ top: 0, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="time" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white rounded-[6px] border border-border shadow-sm p-3 text-xs">
                          <div className="font-semibold text-foreground mb-1">{label}</div>
                          <div className="flex flex-col gap-1">
                            {payload.map((entry: any, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <div 
                                  className="w-1.5 h-1.5 rounded-full" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-muted-foreground">
                                  {entry.name}:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(Number(entry.value))}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  name="This Period"
                  type="monotone"
                  dataKey="current"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  name="Last Period"
                  type="monotone"
                  dataKey="previous"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}