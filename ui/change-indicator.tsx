import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "./utils";

export interface ChangeIndicatorProps {
  change: number;
  isPercent?: boolean;
  className?: string;
  iconClassName?: string;
  reverse?: boolean; // If true, positive change is red (bad), negative is green (good)
}

export function ChangeIndicator({ 
  change, 
  isPercent = true, 
  className,
  iconClassName = "w-3 h-3 mr-0.5",
  reverse = false
}: ChangeIndicatorProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  // Determine color based on change direction and reverse flag
  let colorClass = "text-gray-500";
  if (isPositive) {
    colorClass = reverse ? "text-red-500" : "text-green-500";
  } else if (isNegative) {
    colorClass = reverse ? "text-green-500" : "text-red-500";
  }

  return (
    <span
      className={cn(
        "text-xs font-medium inline-flex items-center ml-1",
        colorClass,
        className
      )}
    >
      {isPositive && <ArrowUp className={iconClassName} />}
      {isNegative && <ArrowDown className={iconClassName} />}
      {isNeutral && <Minus className={iconClassName} />}
      {Math.abs(change).toFixed(2)}{isPercent && '%'}
    </span>
  );
}