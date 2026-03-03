import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { SublevelData, calculatePercentChange } from "./sales-mock-data";
import { formatCurrency, formatNumber } from "./mock-data";
import { ChangeIndicator } from "../ui/change-indicator";

export function SalesSublevelTable() {
  const totalGrossCurrent = SublevelData.reduce((acc, curr) => acc + curr.gross.current, 0);
  const totalGrossPrevious = SublevelData.reduce((acc, curr) => acc + curr.gross.previous, 0);
  const totalDiscountCurrent = SublevelData.reduce((acc, curr) => acc + curr.discounts.current, 0);
  const totalDiscountPrevious = SublevelData.reduce((acc, curr) => acc + curr.discounts.previous, 0);
  const totalVoidCurrent = SublevelData.reduce((acc, curr) => acc + curr.voids.current, 0);
  const totalVoidPrevious = SublevelData.reduce((acc, curr) => acc + curr.voids.previous, 0);
  const totalNetCurrent = SublevelData.reduce((acc, curr) => acc + curr.net.current, 0);
  const totalNetPrevious = SublevelData.reduce((acc, curr) => acc + curr.net.previous, 0);
  
  const totalPercentToGrossCurrent = (totalNetCurrent / totalGrossCurrent) * 100;
  const totalPercentToGrossPrevious = (totalNetPrevious / totalGrossPrevious) * 100;
  const totalPercentToTotalCurrent = 100; // By definition
  const totalPercentToTotalPrevious = 100;

  return (
    <Card className="w-full overflow-hidden min-w-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-[21px] pt-[21px] pb-[7px]">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sales by Business Level</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto mt-[7px] p-[0px]">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-muted/50">
                <TableHead className="w-[150px] font-medium text-[#21262A] pl-[21px]" rowSpan={2}>Name</TableHead>
                <TableHead colSpan={3} className="font-medium text-[#21262A] border-l border-border pl-[14px]">Gross Sales</TableHead>
                <TableHead colSpan={3} className="font-medium text-[#21262A] border-l border-border pl-[14px]">Discounts</TableHead>
                <TableHead colSpan={3} className="font-medium text-[#21262A] border-l border-border pl-[14px]">Voids</TableHead>
                <TableHead colSpan={3} className="font-medium text-[#21262A] border-l border-border pl-[14px]">Net Sales</TableHead>
                <TableHead colSpan={3} className="font-medium text-[#21262A] border-l border-border pl-[14px]">% to Gross</TableHead>
                <TableHead colSpan={3} className="font-medium text-[#21262A] border-l border-border pl-[14px]">% to Total</TableHead>
              </TableRow>
              <TableRow className="hover:bg-transparent border-b text-xs text-[#21262A] bg-muted/30">
                {/* Gross Sales */}
                <TableHead className="text-right border-l border-border text-[#21262A]">Curr</TableHead>
                <TableHead className="text-right text-[#21262A]">LP</TableHead>
                <TableHead className="text-right text-[#21262A]">Chg%</TableHead>

                {/* Discounts */}
                <TableHead className="text-right border-l border-border text-[#21262A]">Curr</TableHead>
                <TableHead className="text-right text-[#21262A]">LP</TableHead>
                <TableHead className="text-right text-[#21262A]">Chg%</TableHead>

                {/* Voids */}
                <TableHead className="text-right border-l border-border text-[#21262A]">Curr</TableHead>
                <TableHead className="text-right text-[#21262A]">LP</TableHead>
                <TableHead className="text-right text-[#21262A]">Chg%</TableHead>

                {/* Net Sales */}
                <TableHead className="text-right border-l border-border text-[#21262A]">Curr</TableHead>
                <TableHead className="text-right text-[#21262A]">LP</TableHead>
                <TableHead className="text-right text-[#21262A]">Chg%</TableHead>

                {/* % to Gross */}
                <TableHead className="text-right border-l border-border text-[#21262A]">Curr</TableHead>
                <TableHead className="text-right text-[#21262A]">LP</TableHead>
                <TableHead className="text-right text-[#21262A]">Chg</TableHead>

                {/* % to Total */}
                <TableHead className="text-right border-l border-border text-[#21262A]">Curr</TableHead>
                <TableHead className="text-right text-[#21262A]">LP</TableHead>
                <TableHead className="text-right text-[#21262A] pr-[21px]">Chg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {SublevelData.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50 border-b cursor-pointer">
                  <TableCell className="font-medium text-sm pl-[21px]">{row.name}</TableCell>
                  
                  {/* Gross Sales */}
                  <TableCell className="text-right border-l border-border font-medium">{formatCurrency(row.gross.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.gross.previous)}</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(row.gross.current, row.gross.previous)} /></TableCell>

                  {/* Discounts (Reverse Color) */}
                  <TableCell className="text-right border-l border-border font-medium">{formatCurrency(row.discounts.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.discounts.previous)}</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(row.discounts.current, row.discounts.previous)} reverse /></TableCell>

                  {/* Voids (Reverse Color) */}
                  <TableCell className="text-right border-l border-border font-medium">{formatCurrency(row.voids.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.voids.previous)}</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(row.voids.current, row.voids.previous)} reverse /></TableCell>

                  {/* Net Sales */}
                  <TableCell className="text-right border-l border-border font-medium">{formatCurrency(row.net.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.net.previous)}</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(row.net.current, row.net.previous)} /></TableCell>

                  {/* % to Gross (Higher is better) */}
                  <TableCell className="text-right border-l border-border font-medium">{row.percentToGross.current.toFixed(2)}%</TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.percentToGross.previous.toFixed(2)}%</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={row.percentToGross.current - row.percentToGross.previous} isPercent={false} /></TableCell>

                  {/* % to Total */}
                  <TableCell className="text-right border-l border-border font-medium">{row.percentToTotal.current.toFixed(2)}%</TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.percentToTotal.previous.toFixed(2)}%</TableCell>
                  <TableCell className="text-right pr-[21px]"><ChangeIndicator change={row.percentToTotal.current - row.percentToTotal.previous} isPercent={false} /></TableCell>
                </TableRow>
              ))}
              
              {/* Total Row */}
              <TableRow className="bg-muted/50 font-bold hover:bg-muted/50 border-t-2">
                <TableCell className="pl-[21px]">TOTAL</TableCell>
                
                {/* Gross Sales */}
                <TableCell className="text-right border-l border-border">{formatCurrency(totalGrossCurrent)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(totalGrossPrevious)}</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(totalGrossCurrent, totalGrossPrevious)} /></TableCell>

                {/* Discounts */}
                <TableCell className="text-right border-l border-border">{formatCurrency(totalDiscountCurrent)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(totalDiscountPrevious)}</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(totalDiscountCurrent, totalDiscountPrevious)} reverse /></TableCell>

                {/* Voids */}
                <TableCell className="text-right border-l border-border">{formatCurrency(totalVoidCurrent)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(totalVoidPrevious)}</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(totalVoidCurrent, totalVoidPrevious)} reverse /></TableCell>

                {/* Net Sales */}
                <TableCell className="text-right border-l border-border">{formatCurrency(totalNetCurrent)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(totalNetPrevious)}</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(totalNetCurrent, totalNetPrevious)} /></TableCell>

                {/* % to Gross */}
                <TableCell className="text-right border-l border-border">{totalPercentToGrossCurrent.toFixed(2)}%</TableCell>
                <TableCell className="text-right text-muted-foreground">{totalPercentToGrossPrevious.toFixed(2)}%</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={totalPercentToGrossCurrent - totalPercentToGrossPrevious} isPercent={false} /></TableCell>

                {/* % to Total */}
                <TableCell className="text-right border-l border-border">100%</TableCell>
                <TableCell className="text-right text-muted-foreground">100%</TableCell>
                <TableCell className="text-right pr-[21px]">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}