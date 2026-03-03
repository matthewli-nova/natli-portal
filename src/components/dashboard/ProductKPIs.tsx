import { KPICard, KPICardContent, KPICardHeader, CardTitle } from "../ui/card";
import { ProductKPIData } from "./product-mock-data";
import { ChangeIndicator } from "../ui/change-indicator";
import { formatCurrency, formatNumber } from "./mock-data";

export function ProductKPIs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {ProductKPIData.map((kpi) => {
        if (kpi.type === 'top-selling') {
          // Top Selling Card
          return (
            <KPICard key={kpi.id}>
              <KPICardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {kpi.label}
                </CardTitle>
              </KPICardHeader>
              <KPICardContent>
                <div className="text-xl font-bold mb-1 truncate" title={kpi.name}>
                  {kpi.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {/* @ts-ignore */}
                  {formatCurrency(kpi.amount)} / {formatNumber(kpi.count)} trans
                </div>
              </KPICardContent>
            </KPICard>
          );
        }

        // Standard Card
        // @ts-ignore
        const currentValue = formatNumber(kpi.current);
        // @ts-ignore
        const previousValue = formatNumber(kpi.previous);
        
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
                  (<ChangeIndicator 
                    // @ts-ignore
                    change={kpi.change_percent} 
                    // @ts-ignore
                    reverse={kpi.reverse} 
                    className="ml-0" 
                  />)
                </span>
              </div>
            </KPICardContent>
          </KPICard>
        );
      })}
    </div>
  );
}
