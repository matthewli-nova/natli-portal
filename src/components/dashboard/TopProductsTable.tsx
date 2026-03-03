import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { TopProductsData } from "./product-mock-data";
import { formatCurrency, formatNumber } from "./mock-data";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { SegmentedControl } from "../ui/segmented-control";
import { CardHeaderActions, ActionTextButton, Separator } from "../ui/card-header-actions";
import { ChangeIndicator } from "../ui/change-indicator";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export function TopProductsTable() {
  const [showTop20, setShowTop20] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  
  const handleSalesAmountSort = () => {
    if (sortDirection === null) {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortDirection('asc');
    } else {
      setSortDirection(null);
    }
  };

  const sortedData = [...TopProductsData].sort((a, b) => {
    if (sortDirection === null) return 0;
    if (sortDirection === 'desc') {
      return b.amount - a.amount;
    }
    return a.amount - b.amount;
  });

  const products = showTop20 ? sortedData : sortedData.slice(0, 10);

  return (
    <Card className="flex flex-col h-full gap-0 overflow-hidden">
      <CardHeader className="pt-[14px] pl-[21px] pr-[21px] pb-[7px] flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top Products</CardTitle>
        
        <CardHeaderActions>
          <SegmentedControl 
            value={showTop20 ? '20' : '10'} 
            onChange={(v) => setShowTop20(v === '20')} 
            options={[
              { label: 'Top 10', value: '10' },
              { label: 'Top 20', value: '20' }
            ]}
          />
        </CardHeaderActions>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mt-0 p-[0px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-muted/50">
                <TableHead className="w-[50px] pl-[21px]">Rank</TableHead>
                <TableHead className="w-[50px] text-left">Photo</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end cursor-pointer hover:text-foreground transition-colors" onClick={handleSalesAmountSort}>
                    <span>Sales Amount</span>
                    {sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> :
                     sortDirection === 'desc' ? <ArrowDown className="w-4 h-4 ml-1" /> :
                     <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />}
                  </div>
                </TableHead>
                <TableHead className="text-right">Item Sold</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Reorder</TableHead>
                <TableHead className="text-center pr-[21px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => {
                const isOutOfStock = product.stock === 0;
                const isLowStock = product.stock > 0 && product.stock < product.reorder;
                
                // Calculate percentage changes
                const amountChange = product.previousAmount ? ((product.amount - product.previousAmount) / product.previousAmount) * 100 : 0;
                const quantityChange = product.previousQuantity ? ((product.quantity - product.previousQuantity) / product.previousQuantity) * 100 : 0;

                return (
                  <TableRow key={product.id} className="group hover:bg-muted/50 border-b last:border-0 cursor-pointer">
                    <TableCell className="font-bold text-center pl-[21px]">{index + 1}</TableCell>
                    <TableCell className="text-left">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                         <ImageWithFallback 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                         />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-xs text-slate-500">{product.sku}</TableCell>
                    <TableCell className="font-medium text-sm">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{product.variant}</TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <span>{formatCurrency(product.amount)}</span>
                        <ChangeIndicator change={amountChange} className="ml-0" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span>{formatNumber(product.quantity)}</span>
                        <ChangeIndicator change={quantityChange} className="ml-0" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={cn(
                        "inline-flex items-center justify-center min-w-[30px] px-2 py-1 rounded-full text-xs font-medium",
                        isOutOfStock ? "bg-red-100 text-red-700" : 
                        isLowStock ? "bg-yellow-100 text-yellow-700" : ""
                      )}>
                        {product.stock}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-xs font-medium">{product.reorder}</TableCell>
                    <TableCell className="text-center pr-[21px]">
                      <div className={cn(
                        "inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium",
                        product.status === 'Active' 
                          ? "bg-green-100 text-green-700" 
                          : "bg-gray-100 text-gray-700"
                      )}>
                        {product.status}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}