import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { TableData, calculateChange, formatCurrency, formatNumber } from "./mock-data";
import { useState } from "react";
import { ChangeIndicator } from "../ui/change-indicator";

interface RevenueTableProps {
  onDrillDown?: (name: string) => void;
}

export function RevenueTable({ onDrillDown }: RevenueTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === null) {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedData = sortColumn && sortDirection ? [...TableData].sort((a, b) => {
    let aValue, bValue;
    
    switch(sortColumn) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'amount':
        aValue = a.amount.current;
        bValue = b.amount.current;
        break;
      case 'percent':
        aValue = a.percent.current;
        bValue = b.percent.current;
        break;
      case 'transactions':
        aValue = a.transactions.current;
        bValue = b.transactions.current;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }) : [...TableData];

  const totals = TableData.reduce((acc, curr) => ({
    amount: {
      current: acc.amount.current + curr.amount.current,
      previous: acc.amount.previous + curr.amount.previous,
    },
    percent: {
      current: acc.percent.current + curr.percent.current,
      previous: acc.percent.previous + curr.percent.previous,
    },
    transactions: {
      current: acc.transactions.current + curr.transactions.current,
      previous: acc.transactions.previous + curr.transactions.previous,
    },
  }), {
    amount: { current: 0, previous: 0 },
    percent: { current: 0, previous: 0 },
    transactions: { current: 0, previous: 0 }
  });

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column || sortDirection === null) {
      return <ArrowUpDown className="w-3 h-3 opacity-50" />;
    }
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  return (
    <Card className="w-full overflow-hidden gap-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-[21px] pl-[21px] pr-[21px] pb-[7px]">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Revenue by Business Level</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto mt-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="w-[200px] cursor-pointer pl-[21px] text-foreground" onClick={() => handleSort('name')}>
                <div className="flex items-center space-x-1 hover:text-foreground transition-colors">
                  <span>Name</span>
                  {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer text-foreground" onClick={() => handleSort('amount')}>
                <div className="flex items-center justify-end space-x-1 hover:text-foreground transition-colors">
                  <span>Amount (Curr / LP / Chg%)</span>
                  {renderSortIcon('amount')}
                </div>
              </TableHead>
              <TableHead className="text-center cursor-pointer text-foreground" onClick={() => handleSort('percent')}>
                <div className="flex items-center justify-center space-x-1 hover:text-foreground transition-colors">
                  <span>% to Total (Curr / LP / Chg)</span>
                  {renderSortIcon('percent')}
                </div>
              </TableHead>
              <TableHead className="text-center cursor-pointer pr-4 text-foreground" onClick={() => handleSort('transactions')}>
                <div className="flex items-center justify-center space-x-1 hover:text-foreground transition-colors">
                  <span>Transactions (Curr / LP / Chg%)</span>
                  {renderSortIcon('transactions')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row) => {
              const amountChange = calculateChange(row.amount.current, row.amount.previous);
              const percentChange = row.percent.current - row.percent.previous;
              const transChange = calculateChange(row.transactions.current, row.transactions.previous);

              return (
                <TableRow 
                  key={row.id} 
                  className="group cursor-pointer hover:bg-muted/50 border-none" 
                  onClick={() => onDrillDown?.(row.name)}
                >
                  <TableCell className="font-bold text-[#023F59] pl-[21px]">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <span className="font-semibold text-sm w-[80px] text-right">{formatCurrency(row.amount.current)}</span>
                      <span className="text-muted-foreground w-[80px] text-right">{formatCurrency(row.amount.previous)}</span>
                      <div className="w-[60px] flex justify-end">
                        <ChangeIndicator change={amountChange} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="font-medium w-[60px] text-right">{row.percent.current.toFixed(2)}%</span>
                      <span className="text-muted-foreground w-[60px] text-right">{row.percent.previous.toFixed(2)}%</span>
                      <div className="w-[60px] flex justify-center">
                        <ChangeIndicator change={percentChange} isPercent={false} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center pr-4">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="font-medium w-[70px] text-right">{formatNumber(row.transactions.current)}</span>
                      <span className="text-muted-foreground w-[70px] text-right">{formatNumber(row.transactions.previous)}</span>
                      <div className="w-[60px] flex justify-center">
                        <ChangeIndicator change={transChange} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {/* Total Row */}
            <TableRow className="bg-muted/50 font-bold hover:bg-muted/50 border-t-2">
              <TableCell className="pl-[21px]">TOTAL</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2 text-xs">
                  <span className="font-bold text-sm w-[80px] text-right">{formatCurrency(totals.amount.current)}</span>
                  <span className="text-muted-foreground w-[80px] text-right">{formatCurrency(totals.amount.previous)}</span>
                  <div className="w-[60px] flex justify-end">
                    <ChangeIndicator change={calculateChange(totals.amount.current, totals.amount.previous)} />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="w-[60px] text-right">100%</span>
                  <span className="text-muted-foreground w-[60px] text-right">100%</span>
                  <span className="text-gray-500 w-[60px] text-center">-</span>
                </div>
              </TableCell>
              <TableCell className="text-center pr-4">
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="font-bold w-[70px] text-right">{formatNumber(totals.transactions.current)}</span>
                  <span className="text-muted-foreground w-[70px] text-right">{formatNumber(totals.transactions.previous)}</span>
                  <div className="w-[60px] flex justify-center">
                    <ChangeIndicator change={calculateChange(totals.transactions.current, totals.transactions.previous)} />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}