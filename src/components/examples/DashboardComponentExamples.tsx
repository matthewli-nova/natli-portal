import { useState } from "react";
import { FilterSelect } from "../ui/filter-select";
import { ChangeIndicator } from "../ui/change-indicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CardHeaderActions, ActionTextButton, Separator } from "../ui/card-header-actions";
import { Badge } from "../ui/badge";
import { RevenueChart } from "../dashboard/RevenueChart";
import { RevenueTable } from "../dashboard/RevenueTable";
import { Switch } from "../ui/switch";
import { cn } from "../ui/utils";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { HierarchySelect } from "../ui/hierarchy-select";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

export function PickerExamples() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [hierarchy, setHierarchy] = useState("all-stores");

  return (
    <div className="grid gap-10">
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Pickers & Selectors</h3>
        <p className="text-sm text-muted-foreground">
          Advanced selection components using the "Action Bar" pattern for scalability and commit-based interaction.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border rounded-lg bg-background/50">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Date Range Picker</h4>
            <DatePickerWithRange 
              date={date} 
              onDateChange={setDate} 
            />
            <p className="text-xs text-muted-foreground italic">
              Features buffering logic: selections are only applied when the "Apply" button is clicked.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Hierarchy Selector</h4>
            <HierarchySelect
              label="Hierarchy Level"
              value={hierarchy}
              onChange={setHierarchy}
            />
            <p className="text-xs text-muted-foreground italic">
              Multi-level tree selection with commitment-based interaction via Action Bar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FilterSelectExamples() {
  const [filter1, setFilter1] = useState("Daily");
  const [filter2, setFilter2] = useState("Option 1");
  const [filter3, setFilter3] = useState("All");

  return (
    <div className="grid gap-10">
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Filter Select</h3>
        <p className="text-sm text-muted-foreground">
          Standardized dropdown controls for dashboard filtering and controls.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border rounded-lg bg-background/50 [&_button]:hover:bg-accent/10 [&_button]:hover:text-accent-foreground">
          <FilterSelect
            label="Time Period"
            value={filter1}
            onChange={setFilter1}
            options={["Daily", "Weekly", "Monthly", "Yearly"]}
          />
          
          <FilterSelect
            label="Category"
            value={filter2}
            onChange={setFilter2}
            options={["Option 1", "Option 2", "Option 3"]}
          />
          
          <FilterSelect
            label="Status"
            value={filter3}
            onChange={setFilter3}
            options={["All", "Active", "Inactive", "Pending"]}
          />
        </div>
      </div>
    </div>
  );
}

export function CardHeaderActionExamples() {
  const [isLive, setIsLive] = useState(true);
  const [view, setView] = useState("Chart");

  return (
    <div className="grid gap-10">
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Card Header & Actions</h3>
        <p className="text-sm text-muted-foreground">
          Standardized card header structure with integrated actions and specific padding rules.
          Padding: 14px/14px with actions, 21px/14px without actions.
        </p>
        
        <div className="grid gap-8">
          {/* Card with Actions */}
          <Card>
            <CardHeader className="p-[14px] flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold">Revenue Analytics</CardTitle>
                <Badge variant="outline" className="text-[10px] h-4">Live</Badge>
              </div>
              <CardHeaderActions>
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">Live Update</span>
                  <Switch checked={isLive} onCheckedChange={setIsLive} size="sm" />
                </div>
                <Separator />
                <FilterSelect
                  variant="ghost"
                  value={view}
                  onChange={setView}
                  options={["Chart", "Table", "Summary"]}
                  className="h-7 text-xs"
                />
                <Separator />
                <ActionTextButton onClick={() => alert("Exporting...")}>Export Data</ActionTextButton>
                <ActionTextButton href="#">View All →</ActionTextButton>
              </CardHeaderActions>
            </CardHeader>
            <CardContent className="h-32 flex items-center justify-center text-muted-foreground text-sm border-t">
              Chart/Table Content Area
            </CardContent>
          </Card>

          {/* Card without Actions */}
          <Card>
            <CardHeader className="px-[14px] pt-[21px] pb-[14px]">
              <CardTitle className="text-sm font-semibold">Summary Statistics</CardTitle>
              <CardDescription className="text-xs">Aggregate data for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-24 flex items-center justify-center text-muted-foreground text-sm border-t">
              Simple Content Area
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function ChangeIndicatorExamples() {
  return (
    <div className="grid gap-10">
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Change Indicator</h3>
        <p className="text-sm text-muted-foreground">
          Visual indicators for positive, negative, and neutral trends in data.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 border rounded-lg bg-background/50 items-center justify-items-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Positive</span>
            <ChangeIndicator change={12.5} />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Negative</span>
            <ChangeIndicator change={-5.2} />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Neutral</span>
            <ChangeIndicator change={0} />
          </div>

          <div className="flex flex-col items-center gap-2">
             <span className="text-xs text-muted-foreground">Absolute Value</span>
             <ChangeIndicator change={250} isPercent={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardChartAlignmentExamples() {
  return (
    <div className="grid gap-10">
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Card & Chart Alignment</h3>
        <p className="text-sm text-muted-foreground">
          Best practices for side-by-side alignment of cards and charts in dashboard layouts.
          Uses strict 1136px width constraint for optimal density.
        </p>
        
        <div className="flex flex-col gap-6 max-w-[1136px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <Card className="h-full flex flex-col">
              <CardHeader className="px-[14px] pt-[21px] pb-[14px]">
                <CardTitle className="text-sm font-semibold">Performance Overview</CardTitle>
                <CardDescription className="text-xs">Key metrics for the selected period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 px-[14px] pb-[14px] pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-xl font-bold">$45,231.89</p>
                    <ChangeIndicator change={20.1} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Active Users</p>
                    <p className="text-xl font-bold">2,350</p>
                    <ChangeIndicator change={18.1} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
              <CardHeader className="px-[14px] pt-[21px] pb-[14px]">
                <CardTitle className="text-sm font-semibold">Engagement Stats</CardTitle>
                <CardDescription className="text-xs">User interaction metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 px-[14px] pb-[14px] pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Bounce Rate</p>
                    <p className="text-xl font-bold">42.3%</p>
                    <ChangeIndicator change={-2.1} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Duration</p>
                    <p className="text-xl font-bold">4m 32s</p>
                    <ChangeIndicator change={12} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="p-[14px] flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">Revenue Trend</CardTitle>
              <CardHeaderActions>
                 <ActionTextButton href="#">Full Report →</ActionTextButton>
              </CardHeaderActions>
            </CardHeader>
            <CardContent className="px-2 pb-2 pt-4 border-t">
               <RevenueChart />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-[14px] flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">Recent Transactions</CardTitle>
              <CardHeaderActions>
                 <ActionTextButton onClick={() => alert("Printing...")}>Print</ActionTextButton>
              </CardHeaderActions>
            </CardHeader>
            <CardContent className="p-0 border-t overflow-hidden">
               <RevenueTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function DashboardComponentExamples() {
  return (
    <div className="space-y-12">
      <PickerExamples />
      <FilterSelectExamples />
      <CardHeaderActionExamples />
      <ChangeIndicatorExamples />
      <CardChartAlignmentExamples />
    </div>
  );
}

