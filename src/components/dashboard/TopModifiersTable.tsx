import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { TopModifiersData } from "./product-mock-data";
import { formatCurrency, formatNumber } from "./mock-data";
import { ChangeIndicator } from "../ui/change-indicator";

export function TopModifiersTable() {
  return (
    <Card className="flex flex-col h-full gap-0 overflow-hidden">
      <CardHeader className="pt-[21px] pl-[21px] pr-[21px] pb-[14px]">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top 10 Modifiers</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mt-0 p-[0px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-muted/50">
                <TableHead className="w-[50px] pl-[21px]">Rank</TableHead>
                <TableHead>Modifier SKU</TableHead>
                <TableHead>Modifier Group</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Qty LP</TableHead>
                <TableHead className="text-right">Chg%</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Rev LP</TableHead>
                <TableHead className="text-right pr-[21px]">Chg%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TopModifiersData.map((modifier) => (
                <TableRow key={modifier.rank} className="hover:bg-muted/50 border-b last:border-0">
                  <TableCell className="font-bold text-center pl-[21px]">{modifier.rank}</TableCell>
                  <TableCell className="font-medium text-sm">{modifier.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{modifier.parents}</TableCell>
                  <TableCell className="text-right">{formatNumber(modifier.quantity)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatNumber(modifier.previousQty)}</TableCell>
                  <TableCell className="text-right">
                    <ChangeIndicator change={((modifier.quantity - modifier.previousQty) / modifier.previousQty) * 100} />
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(modifier.amount)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(modifier.previousAmount)}</TableCell>
                  <TableCell className="text-right pr-[21px]">
                    {modifier.previousAmount === 0 ? '-' : (
                      <ChangeIndicator change={((modifier.amount - modifier.previousAmount) / modifier.previousAmount) * 100} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}