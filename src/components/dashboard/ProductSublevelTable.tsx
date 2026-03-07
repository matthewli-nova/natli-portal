import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ProductSublevelData, calculatePercentChange } from "./product-mock-data";
import { formatCurrency, formatNumber } from "./mock-data";
import { ChangeIndicator } from "../ui/change-indicator";
import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortColumn = 'topProductAmount' | 'topCategoryAmount';
type SortDirection = 'asc' | 'desc' | null;

export function ProductSublevelTable() {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: desc -> asc -> null
      if (sortDirection === null) {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      // New column, start with descending
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Sort the data
  const sortedData = [...ProductSublevelData].sort((a, b) => {
    if (!sortColumn || sortDirection === null) return 0;
    
    let aValue = 0;
    let bValue = 0;
    
    if (sortColumn === 'topProductAmount') {
      aValue = a.topProduct.amount;
      bValue = b.topProduct.amount;
    } else if (sortColumn === 'topCategoryAmount') {
      aValue = a.topCategory.amount;
      bValue = b.topCategory.amount;
    }
    
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 inline-block opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3 h-3 ml-1 inline-block" />;
    } else if (sortDirection === 'desc') {
      return <ArrowDown className="w-3 h-3 ml-1 inline-block" />;
    }
    return <ArrowUpDown className="w-3 h-3 ml-1 inline-block opacity-50" />;
  };

  const totalItemSoldCurrent = ProductSublevelData.reduce((acc, curr) => acc + curr.itemSold.current, 0);
  const totalItemSoldPrevious = ProductSublevelData.reduce((acc, curr) => acc + curr.itemSold.previous, 0);
  
  // For Top Product/Category totals, it's not a simple sum, but the spec shows a "TOTAL" row with specific values.
  // In the mock data, I didn't include "Total" logic for top product.
  // I'll manually add the total row data from the spec sample.
  const totalRow = {
    name: 'TOTAL',
    itemSold: { current: 3892, previous: 3378 },
    topProduct: { name: 'Beer Tower', sold: 156, percentItem: 4.0, amount: 4680, percentTotal: 8.9 },
    topCategory: { name: 'Beverages', sold: 1520, percentItem: 39.0, amount: 22400, percentTotal: 42.8 }
  };

  return (
    <Card className="w-full overflow-hidden min-w-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-[21px] pl-[21px] pr-[21px] pb-[14px]">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Product Performance by Business Line</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mt-0 p-[0px]">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-muted/50">
                <TableHead className="w-[150px] font-medium text-foreground pl-[21px]" rowSpan={2}>Name</TableHead>
                <TableHead colSpan={3} className="font-medium text-foreground border-l border-border pl-[14px]">Item Sold</TableHead>
                <TableHead colSpan={5} className="font-medium text-foreground border-l border-border pl-[14px]">Top Product</TableHead>
                <TableHead colSpan={5} className="font-medium text-foreground border-l border-border pl-[14px]">Top Category</TableHead>
              </TableRow>
              <TableRow className="hover:bg-transparent border-b text-xs text-foreground bg-muted/30">
                {/* Item Sold */}
                <TableHead className="text-right border-l border-border text-foreground">Curr</TableHead>
                <TableHead className="text-right text-foreground">LP</TableHead>
                <TableHead className="text-right text-foreground">Chg%</TableHead>

                {/* Top Product */}
                <TableHead className="text-left border-l border-border text-foreground">Name</TableHead>
                <TableHead className="text-right text-foreground">Sold</TableHead>
                <TableHead className="text-right text-foreground">%Item</TableHead>
                <TableHead 
                  className="text-right text-foreground cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('topProductAmount')}
                >
                  Amount
                  <SortIcon column="topProductAmount" />
                </TableHead>
                <TableHead className="text-right text-foreground">%Total</TableHead>

                {/* Top Category */}
                <TableHead className="text-left border-l border-border text-foreground">Name</TableHead>
                <TableHead className="text-right text-foreground">Sold</TableHead>
                <TableHead className="text-right text-foreground">%Item</TableHead>
                <TableHead 
                  className="text-right text-foreground cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('topCategoryAmount')}
                >
                  Amount
                  <SortIcon column="topCategoryAmount" />
                </TableHead>
                <TableHead className="text-right text-foreground pr-[21px]">%Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {sortedData.map((row) => (
                <TableRow key={row.name} className="hover:bg-muted/50 border-b cursor-pointer">
                  <TableCell className="font-medium text-sm pl-[21px]">{row.name}</TableCell>
                  
                  {/* Item Sold */}
                  <TableCell className="text-right border-l border-border font-medium">{formatNumber(row.itemSold.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatNumber(row.itemSold.previous)}</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(row.itemSold.current, row.itemSold.previous)} /></TableCell>

                  {/* Top Product */}
                  <TableCell className="text-left border-l border-border font-medium text-primary">{row.topProduct.name}</TableCell>
                  <TableCell className="text-right">{formatNumber(row.topProduct.sold)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.topProduct.percentItem.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(row.topProduct.amount)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.topProduct.percentTotal.toFixed(1)}%</TableCell>

                  {/* Top Category */}
                  <TableCell className="text-left border-l border-border font-medium text-primary">{row.topCategory.name}</TableCell>
                  <TableCell className="text-right">{formatNumber(row.topCategory.sold)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.topCategory.percentItem.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(row.topCategory.amount)}</TableCell>
                  <TableCell className="text-right text-muted-foreground pr-[21px]">{row.topCategory.percentTotal.toFixed(1)}%</TableCell>
                </TableRow>
              ))}

              {/* Total Row */}
              <TableRow className="bg-muted/50 font-bold hover:bg-muted/50 border-t-2">
                <TableCell className="pl-[21px]">TOTAL</TableCell>
                
                {/* Item Sold */}
                <TableCell className="text-right border-l border-border">{formatNumber(totalRow.itemSold.current)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatNumber(totalRow.itemSold.previous)}</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(totalRow.itemSold.current, totalRow.itemSold.previous)} /></TableCell>

                {/* Top Product */}
                <TableCell className="text-left border-l border-border text-primary">{totalRow.topProduct.name}</TableCell>
                <TableCell className="text-right">{formatNumber(totalRow.topProduct.sold)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{totalRow.topProduct.percentItem.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{formatCurrency(totalRow.topProduct.amount)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{totalRow.topProduct.percentTotal.toFixed(1)}%</TableCell>

                {/* Top Category */}
                <TableCell className="text-left border-l border-border text-primary">{totalRow.topCategory.name}</TableCell>
                <TableCell className="text-right">{formatNumber(totalRow.topCategory.sold)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{totalRow.topCategory.percentItem.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{formatCurrency(totalRow.topCategory.amount)}</TableCell>
                <TableCell className="text-right text-muted-foreground pr-[21px]">{totalRow.topCategory.percentTotal.toFixed(1)}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}