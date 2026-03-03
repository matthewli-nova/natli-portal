import { KPICard, KPICardContent, KPICardHeader, CardTitle } from "../ui/card";
import { PaymentKPIData } from "./payment-mock-data";
import { ChangeIndicator } from "../ui/change-indicator";
import { formatCurrency, formatNumber } from "./mock-data";

export function PaymentKPIs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {PaymentKPIData.map((kpi) => {
        // @ts-ignore
        const currentValue = kpi.format === 'currency' 
          ? formatCurrency(kpi.current) 
          : formatNumber(kpi.current);
          
        // @ts-ignore
        const previousValue = kpi.format === 'currency'
          ? formatCurrency(kpi.previous)
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
                <span className="ml-1 flex items-center">
                  (<ChangeIndicator change={kpi.change_percent} reverse={kpi.reverse} className="ml-0" />)
                </span>
              </div>
            </KPICardContent>
          </KPICard>
        );
      })}
    </div>
  );
}
