import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DashboardControls } from "./DashboardControls";
import { SalesKPIs } from "./SalesKPIs";
import { SalesChannelChart } from "./SalesChannelChart";
import { SalesPromotionChart } from "./SalesPromotionChart";
import { SalesSublevelTable } from "./SalesSublevelTable";
import { TIME_PERIODS } from "./mock-data";

export function SalesTab() {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [selectedHierarchy, setSelectedHierarchy] = useState("all-company");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();

  return (
    <div className="space-y-6 min-w-0 w-full">
      <DashboardControls
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        selectedHierarchy={selectedHierarchy}
        onHierarchyChange={setSelectedHierarchy}
        timePeriodOptions={[...TIME_PERIODS, "Custom"]}
        customDateRange={customDateRange}
        onCustomDateRangeChange={setCustomDateRange}
      />
      
      <SalesKPIs />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesChannelChart />
        <SalesPromotionChart />
      </div>
      
      <SalesSublevelTable />
    </div>
  );
}