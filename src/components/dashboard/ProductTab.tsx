import { useState } from "react";
import { DashboardControls } from "./DashboardControls";
import { ProductKPIs } from "./ProductKPIs";
import { SalesCategoryChart } from "./SalesCategoryChart";
import { TopProductsTable } from "./TopProductsTable";
import { TopModifiersTable } from "./TopModifiersTable";
import { StockAlertsTable } from "./StockAlertsTable";
import { ProductSublevelTable } from "./ProductSublevelTable";
import { TIME_PERIODS } from "./mock-data";
import { DateRange } from "react-day-picker";

export function ProductTab() {
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
      
      <ProductKPIs />
      
      <SalesCategoryChart />
      
      <TopProductsTable />
      
      <TopModifiersTable />
      
      <StockAlertsTable />
      
      <ProductSublevelTable />
    </div>
  );
}