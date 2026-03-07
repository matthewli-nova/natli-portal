import { KPICard, KPICardContent, KPICardHeader, CardTitle } from "../ui/card";
import { SalesKPIData } from "./sales-mock-data";
import { ChangeIndicator } from "../ui/change-indicator";
import { formatCurrency, formatNumber } from "./mock-data";

export function SalesKPIs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {SalesKPIData.map((kpi) => {
        const isVoid = kpi.id === 'void_amount';
        const isNumeric = kpi.format !== 'void';

        if (isVoid) {
          // Special handling for Void Amount
          // @ts-ignore
          const current = kpi.current as { amount: number, count: number };
          // @ts-ignore
          const previous = kpi.previous as { amount: number, count: number };
          const change = kpi.change_percent;

          return (
            <KPICard key={kpi.id}>
              <KPICardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {kpi.label}
                </CardTitle>
              </KPICardHeader>
              <KPICardContent>
                <div className="text-2xl font-bold mb-1">
                  {formatCurrency(current.amount)} <span className="text-lg font-normal text-muted-foreground">({current.count})</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>
                    {formatCurrency(previous.amount)} ({previous.count})
                  </span>
                  <ChangeIndicator change={change} reverse={kpi.reverse} className="ml-2" />
                </div>
              </KPICardContent>
            </KPICard>
          );
        }

        // Standard Numeric Cards (1-5)
        const currentValue = kpi.format === 'currency' 
          // @ts-ignore
          ? formatCurrency(kpi.current) 
          // @ts-ignore
          : formatNumber(kpi.current);
          
        const previousValue = kpi.format === 'currency'
          // @ts-ignore
          ? formatCurrency(kpi.previous)
          // @ts-ignore
          : formatNumber(kpi.previous);

        return (
          <KPICard key={kpi.id}>
            <KPICardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {kpi.label}
              </CardTitle>
            </KPICardHeader>
            <KPICardContent>
              <div className="text-2xl font-bold mb-1">{currentValue}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{previousValue}</span>
                {/* @ts-ignore */}
                <ChangeIndicator change={kpi.change_percent} reverse={kpi.reverse} className="ml-2" />
              </div>
            </KPICardContent>
          </KPICard>
        );
      })}
    </div>
  );
}
