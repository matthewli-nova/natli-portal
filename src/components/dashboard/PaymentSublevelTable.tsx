import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { PaymentSublevelData, calculatePercentChange } from "./payment-mock-data";
import { formatCurrency, formatNumber } from "./mock-data";
import { ChangeIndicator } from "../ui/change-indicator";

export function PaymentSublevelTable() {
  const totalCashCurrent = PaymentSublevelData.reduce((acc, curr) => acc + curr.cash.current, 0);
  const totalCashPrevious = PaymentSublevelData.reduce((acc, curr) => acc + curr.cash.previous, 0);
  const totalCardCurrent = PaymentSublevelData.reduce((acc, curr) => acc + curr.card.current, 0);
  const totalCardPrevious = PaymentSublevelData.reduce((acc, curr) => acc + curr.card.previous, 0);
  const totalDigitalCurrent = PaymentSublevelData.reduce((acc, curr) => acc + curr.digital.current, 0);
  const totalDigitalPrevious = PaymentSublevelData.reduce((acc, curr) => acc + curr.digital.previous, 0);
  const totalCreditCurrent = PaymentSublevelData.reduce((acc, curr) => acc + curr.credit.current, 0);
  const totalCreditPrevious = PaymentSublevelData.reduce((acc, curr) => acc + curr.credit.previous, 0);
  const totalAllCurrent = PaymentSublevelData.reduce((acc, curr) => acc + curr.total.current, 0);
  const totalAllPrevious = PaymentSublevelData.reduce((acc, curr) => acc + curr.total.previous, 0);
  
  return (
    <Card className="w-full overflow-hidden gap-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-[21px] pl-[21px] pr-[21px] pb-[7px]">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Payment by Business Line</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto mt-0 p-[0px]">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b bg-muted/50">
              <TableHead className="w-[150px] font-medium text-foreground pl-[21px]" rowSpan={2}>Name</TableHead>
              <TableHead colSpan={3} className="font-medium text-foreground border-l border-border pl-[14px]">
                Cash
              </TableHead>
              <TableHead colSpan={3} className="font-medium text-foreground border-l border-border pl-[14px]">
                Card
              </TableHead>
              <TableHead colSpan={3} className="font-medium text-foreground border-l border-border pl-[14px]">
                Digital Wallet
              </TableHead>
              <TableHead colSpan={3} className="font-medium text-foreground border-l border-border pl-[14px]">
                Credit
              </TableHead>
              <TableHead colSpan={3} className="font-medium text-foreground border-l border-border pl-[14px]">
                Total
              </TableHead>
              <TableHead colSpan={3} className="font-medium text-foreground border-l border-border pl-[14px]">% to Total</TableHead>
            </TableRow>
              <TableRow className="hover:bg-transparent border-b text-xs text-foreground bg-muted/30">
                {/* Cash */}
                <TableHead className="text-right border-l border-border text-foreground">Curr</TableHead>
                <TableHead className="text-right text-foreground">LP</TableHead>
                <TableHead className="text-right text-foreground">Chg%</TableHead>

                {/* Card */}
                <TableHead className="text-right border-l border-border text-foreground">Curr</TableHead>
                <TableHead className="text-right text-foreground">LP</TableHead>
                <TableHead className="text-right text-foreground">Chg%</TableHead>

                {/* Digital */}
                <TableHead className="text-right border-l border-border text-foreground">Curr</TableHead>
                <TableHead className="text-right text-foreground">LP</TableHead>
                <TableHead className="text-right text-foreground">Chg%</TableHead>

                {/* Credit */}
                <TableHead className="text-right border-l border-border text-foreground">Curr</TableHead>
                <TableHead className="text-right text-foreground">LP</TableHead>
                <TableHead className="text-right text-foreground">Chg%</TableHead>

                {/* Total */}
                <TableHead className="text-right border-l border-border text-foreground">Curr</TableHead>
                <TableHead className="text-right text-foreground">LP</TableHead>
                <TableHead className="text-right text-foreground">Chg%</TableHead>

                {/* % to Total */}
                <TableHead className="text-right border-l border-border text-foreground">Curr</TableHead>
                <TableHead className="text-right text-foreground">LP</TableHead>
                <TableHead className="text-right text-foreground pr-[21px]">Chg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {PaymentSublevelData.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50 border-b cursor-pointer">
                  <TableCell className="font-medium text-sm pl-[21px]">{row.name}</TableCell>
                  
                  {/* Cash */}
                  <TableCell className="text-right border-l border-border font-medium">{formatCurrency(row.cash.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.cash.previous)}</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(row.cash.current, row.cash.previous)} /></TableCell>

                  {/* Card */}
                  <TableCell className="text-right border-l border-border font-medium">{formatCurrency(row.card.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.card.previous)}</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(row.card.current, row.card.previous)} /></TableCell>

                  {/* Digital */}
                  <TableCell className="text-right border-l border-border font-medium">{formatCurrency(row.digital.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.digital.previous)}</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(row.digital.current, row.digital.previous)} /></TableCell>

                  {/* Credit */}
                  <TableCell className="text-right border-l border-border font-medium">{formatCurrency(row.credit.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.credit.previous)}</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(row.credit.current, row.credit.previous)} /></TableCell>

                  {/* Total */}
                  <TableCell className="text-right border-l border-border font-medium">{formatCurrency(row.total.current)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.total.previous)}</TableCell>
                  <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(row.total.current, row.total.previous)} /></TableCell>

                  {/* % to Total (Change is points, so isPercent={false}) */}
                  <TableCell className="text-right border-l border-border font-medium">{row.percentToTotal.current.toFixed(2)}%</TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.percentToTotal.previous.toFixed(2)}%</TableCell>
                  <TableCell className="text-right pr-[21px]"><ChangeIndicator change={row.percentToTotal.current - row.percentToTotal.previous} isPercent={false} /></TableCell>
                </TableRow>
              ))}

              {/* Total Row */}
              <TableRow className="bg-muted/50 font-bold hover:bg-muted/50 border-t-2">
                <TableCell className="pl-[21px]">TOTAL</TableCell>
                
                {/* Cash */}
                <TableCell className="text-right border-l border-border">{formatCurrency(totalCashCurrent)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(totalCashPrevious)}</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(totalCashCurrent, totalCashPrevious)} /></TableCell>

                {/* Card */}
                <TableCell className="text-right border-l border-border">{formatCurrency(totalCardCurrent)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(totalCardPrevious)}</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(totalCardCurrent, totalCardPrevious)} /></TableCell>

                {/* Digital */}
                <TableCell className="text-right border-l border-border">{formatCurrency(totalDigitalCurrent)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(totalDigitalPrevious)}</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(totalDigitalCurrent, totalDigitalPrevious)} /></TableCell>

                {/* Credit */}
                <TableCell className="text-right border-l border-border">{formatCurrency(totalCreditCurrent)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(totalCreditPrevious)}</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(totalCreditCurrent, totalCreditPrevious)} /></TableCell>

                {/* Total */}
                <TableCell className="text-right border-l border-border">{formatCurrency(totalAllCurrent)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(totalAllPrevious)}</TableCell>
                <TableCell className="text-right"><ChangeIndicator change={calculatePercentChange(totalAllCurrent, totalAllPrevious)} /></TableCell>

                {/* % to Total */}
                <TableCell className="text-right border-l border-border">100.00%</TableCell>
                <TableCell className="text-right text-muted-foreground">100.00%</TableCell>
                <TableCell className="text-right pr-[21px]">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
    </Card>
  );
}