import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { StockAlertsData } from "./product-mock-data";
import { ChevronDown, ChevronRight, AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "../ui/utils";
import { CardHeaderActions, ActionTextButton } from "../ui/card-header-actions";

export function StockAlertsTable() {
  const [expandedOutlets, setExpandedOutlets] = useState<Record<string, boolean>>(
    StockAlertsData.reduce((acc, outlet) => ({ ...acc, [outlet.outlet]: true }), {})
  );

  const toggleOutlet = (outletName: string) => {
    setExpandedOutlets(prev => ({ ...prev, [outletName]: !prev[outletName] }));
  };

  return (
    <Card className="flex flex-col h-full gap-0 overflow-hidden">
      <CardHeader className="pt-[14px] pl-[21px] pr-[21px] pb-[7px] flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Stock Alerts</CardTitle>
        <CardHeaderActions>
          <ActionTextButton className="h-8">View All →</ActionTextButton>
        </CardHeaderActions>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mt-0 p-[0px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-muted/50">
                <TableHead className="w-[100px] text-[#21262A] pl-[21px]">Status</TableHead>
                <TableHead className="text-[#21262A]">SKU</TableHead>
                <TableHead className="text-[#21262A]">Product/Variant</TableHead>
                <TableHead className="text-[#21262A]">Category</TableHead>
                <TableHead className="text-center text-[#21262A]">Stock</TableHead>
                <TableHead className="text-center text-[#21262A]">Reorder</TableHead>
                <TableHead className="text-right text-[#21262A] pr-[21px]">Last Sale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {StockAlertsData.flatMap((group) => {
                const rows = [
                  <TableRow 
                    key={group.outlet} 
                    className="hover:bg-muted/50 border-b cursor-pointer bg-muted/20"
                    onClick={() => toggleOutlet(group.outlet)}
                  >
                    <TableCell colSpan={7} className="font-semibold py-2 pl-[21px]">
                      <div className="flex items-center">
                        {expandedOutlets[group.outlet] ? (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                        {group.outlet}
                      </div>
                    </TableCell>
                  </TableRow>
                ];
                
                if (expandedOutlets[group.outlet]) {
                  rows.push(...group.items.map((item) => (
                    <TableRow key={`${group.outlet}-${item.sku}`} className="hover:bg-muted/50 border-b last:border-0">
                      <TableCell className="pl-[21px]">
                        <div className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                          item.status === 'out' 
                            ? "bg-red-50 text-red-700 border-red-200" 
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        )}>
                          {item.status === 'out' ? (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" /> Out
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 mr-1" /> Low
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{item.sku}</TableCell>
                      <TableCell className="font-medium text-sm">{item.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.category}</TableCell>
                      <TableCell className="text-center text-xs font-medium">
                        <div className={cn(
                          "inline-flex items-center justify-center min-w-[30px] px-2 py-1 rounded-full text-xs font-medium",
                          item.stock === 0 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        )}>
                          {item.stock}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground text-xs font-medium">{item.reorder}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground pr-[21px]">{item.lastSale}</TableCell>
                    </TableRow>
                  )));
                }

                return rows;
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}