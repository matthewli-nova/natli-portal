import { useState } from "react";
import { DashboardControls } from "./DashboardControls";
import { KPIGrid } from "./KPIGrid";
import { RevenueChart } from "./RevenueChart";
import { RevenueTable } from "./RevenueTable";
import { TIME_PERIODS } from "./mock-data";
import { DateRange } from "react-day-picker";

export function OverviewTab() {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [selectedHierarchy, setSelectedHierarchy] = useState("all-company");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();

  const handleDrillDown = (name: string) => {
    if (selectedHierarchy === 'Group') {
      setSelectedHierarchy('Business Level');
    } else if (selectedHierarchy === 'Business Level') {
      setSelectedHierarchy('Store');
    }
  };

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
      
      <KPIGrid />
      
      <RevenueChart />
      
      <RevenueTable onDrillDown={handleDrillDown} />
    </div>
  );
}