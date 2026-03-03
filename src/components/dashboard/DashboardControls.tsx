import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { FilterSelect } from "../ui/filter-select";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { HierarchySelect } from "../ui/hierarchy-select";
import { TIME_PERIODS, HIERARCHY_LEVELS } from "./mock-data";
import { DateRange } from "react-day-picker";

interface DashboardControlsProps {
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  selectedHierarchy: string;
  onHierarchyChange: (value: string) => void;
  timePeriodOptions?: string[];
  customDateRange?: DateRange;
  onCustomDateRangeChange?: (range: DateRange | undefined) => void;
}

export function DashboardControls({
  selectedPeriod,
  onPeriodChange,
  selectedHierarchy,
  onHierarchyChange,
  timePeriodOptions = TIME_PERIODS,
  customDateRange,
  onCustomDateRangeChange,
}: DashboardControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
      <div className="flex-1 max-w-[200px]">
        <FilterSelect
          label="Time Period"
          value={selectedPeriod}
          onChange={onPeriodChange}
          options={timePeriodOptions}
          placeholder="Select period"
        />
      </div>

      {selectedPeriod === "Custom" && (
        <div className="flex-1 max-w-[300px]">
          <div className="grid gap-2">
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Custom Range
            </Label>
            <DatePickerWithRange 
              date={customDateRange} 
              onDateChange={onCustomDateRangeChange} 
            />
          </div>
        </div>
      )}

      <div className="flex-1 max-w-[200px]">
        <HierarchySelect
          label="Hierarchy Level"
          value={selectedHierarchy}
          onChange={onHierarchyChange}
          placeholder="Select level"
        />
      </div>
    </div>
  );
}