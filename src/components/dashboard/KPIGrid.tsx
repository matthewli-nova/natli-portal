import { KPICard, KPICardContent, KPICardHeader, CardTitle } from "../ui/card";
import { KPIData, calculateChange, formatCurrency, formatNumber } from "./mock-data";
import { ChangeIndicator } from "../ui/change-indicator";

export function KPIGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {KPIData.map((kpi) => {
        let currentValue = "";
        let previousValue = "";
        let change = 0;

        if (kpi.type === 'numeric') {
          // @ts-ignore
          const formattedCurrent = kpi.format === 'currency' ? formatCurrency(kpi.value) : formatNumber(kpi.value);
          // @ts-ignore
          const formattedPrevious = kpi.format === 'currency' ? formatCurrency(kpi.previous) : formatNumber(kpi.previous);
          
          currentValue = formattedCurrent;
          // @ts-ignore
          change = calculateChange(kpi.value, kpi.previous);
          previousValue = formattedPrevious;

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
                  <ChangeIndicator change={change} iconClassName="w-4 h-4 mr-1" className="ml-2" />
                </div>
              </KPICardContent>
            </KPICard>
          );
        } else {
          // Item type
          const currentItem = kpi.current as { name: string; count: number };
          const previousItem = kpi.previous as { name: string; count: number };

          change = calculateChange(currentItem.count, previousItem.count);
          
          return (
            <KPICard key={kpi.id}>
              <KPICardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {kpi.label}
                </CardTitle>
              </KPICardHeader>
              <KPICardContent>
                <div className="text-lg font-bold truncate mb-1" title={`${currentItem.name} (${currentItem.count})`}>
                  {currentItem.name} <span className="text-muted-foreground font-normal">({currentItem.count})</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground truncate" title={`${previousItem.name} (${previousItem.count})`}>
                  <span className="truncate max-w-[150px]">{previousItem.name} ({previousItem.count})</span>
                  <ChangeIndicator change={change} iconClassName="w-4 h-4 mr-1" className="ml-2" />
                </div>
              </KPICardContent>
            </KPICard>
          );
        }
      })}
    </div>
  );
}
