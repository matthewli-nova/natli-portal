import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { useHeaderSlot } from "../lib/header-slot-context";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface PortalHeaderProps {
  breadcrumbs: { label: string; href?: string; active?: boolean }[];
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export function PortalHeader({ breadcrumbs, isDark, onToggleTheme }: PortalHeaderProps) {
  const { centerSlot, rightSlot } = useHeaderSlot();

  const items = [];
  breadcrumbs.forEach((item, index) => {
    items.push(
      <BreadcrumbItem key={`item-${index}`}>
        {item.active ? (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={item.href || "#"}>{item.label}</BreadcrumbLink>
        )}
      </BreadcrumbItem>
    );
    if (index < breadcrumbs.length - 1) {
      items.push(<BreadcrumbSeparator key={`sep-${index}`} />);
    }
  });

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b bg-background px-4 xl:px-8">
      {/* Left — breadcrumbs */}
      <div className="flex-1 min-w-0">
        <Breadcrumb>
          <BreadcrumbList>{items}</BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center — injected slot (e.g. GlobalSearch) */}
      {centerSlot && (
        <div className="absolute left-1/2 -translate-x-1/2">
          {centerSlot}
        </div>
      )}

      {/* Right — injected slots + dark mode toggle */}
      <div className="flex items-center gap-1 ml-auto">
        {rightSlot && (
          <div className="flex items-center gap-1">
            {rightSlot}
          </div>
        )}
        {onToggleTheme && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isDark ? 'Light mode' : 'Dark mode'}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  );
}
