import { useState } from "react";
import { DashboardControls } from "./DashboardControls";
import { PaymentKPIs } from "./PaymentKPIs";
import { PaymentMethodChart } from "./PaymentMethodChart";
import { PaymentProviderChart } from "./PaymentProviderChart";
import { PaymentSublevelTable } from "./PaymentSublevelTable";
import { TIME_PERIODS } from "./mock-data";
import { DateRange } from "react-day-picker";

export function PaymentTab() {
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
      
      <PaymentKPIs />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PaymentMethodChart />
        <PaymentProviderChart />
      </div>
      
      <PaymentSublevelTable />
    </div>
  );
}