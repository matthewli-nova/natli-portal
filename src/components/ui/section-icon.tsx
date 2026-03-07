import { LucideIcon } from "lucide-react";
import { cn } from "./utils";

interface SectionIconProps {
  icon: LucideIcon;
  className?: string;
  color?: string;
}

/**
 * SectionIcon - A wrapper component for icons in section headers (CardTitle, page headers, etc.)
 * 
 * Default behavior: Applies the Lepos cyan-dark color for brand consistency
 * 
 * Usage:
 * <SectionIcon icon={Code} />
 * <SectionIcon icon={Palette} color="text-lepos-dark-brand" /> // Override color
 * <SectionIcon icon={Package} className="h-6 w-6" /> // Override size
 */
export function SectionIcon({ 
  icon: Icon, 
  className,
  color = "text-[var(--lepos-cyan-dark)]"
}: SectionIconProps) {
  return <Icon className={cn("h-5 w-5", color, className)} />;
}