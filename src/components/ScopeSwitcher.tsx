import * as React from "react";
import { Check, ChevronsUpDown, Store, Building2, LayoutDashboard, Loader2 } from "lucide-react";

import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { scopes, type Scope } from "./data/scopes";

type FlatScope = Scope & { 
  level: number;
  isLast: boolean;
  hasChildren: boolean;
  parentPath: boolean[];
};

const flattenScopes = (
  nodes: Scope[], 
  level = 0, 
  parentPath: boolean[] = []
): FlatScope[] => {
  let flat: FlatScope[] = [];
  
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const hasChildren = !!node.children && node.children.length > 0;
    
    flat.push({ 
      ...node, 
      level, 
      isLast, 
      hasChildren,
      parentPath 
    });

    if (hasChildren) {
      const childPath = [...parentPath, !isLast];
      flat = flat.concat(flattenScopes(node.children!, level + 1, childPath));
    }
  });
  return flat;
};

const allScopes = flattenScopes(scopes);

interface ScopeSwitcherProps {
  align?: "center" | "start" | "end";
  isLoading?: boolean;
  defaultValue?: string;
  onScopeChange?: (value: string) => void;
  isCollapsed?: boolean;
  variant?: "default" | "sidebar";
}

export function ScopeSwitcher({ 
  align = "start", 
  isLoading: externalLoading = false,
  defaultValue = "sunset-vip-lounge",
  onScopeChange,
  isCollapsed = false,
  variant = "default"
}: ScopeSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [internalLoading, setInternalLoading] = React.useState(false);
  
  // Simulate initial data fetching
  React.useEffect(() => {
    setInternalLoading(true);
    const timer = setTimeout(() => {
      setInternalLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (currentValue: string) => {
    // If selecting the same value, just close
    if (currentValue === value) {
      setOpen(false);
      return;
    }

    setOpen(false);
    setInternalLoading(true);
    
    // Notify parent immediately
    if (onScopeChange) {
      onScopeChange(currentValue);
    }

    // Simulate network request delay
    setTimeout(() => {
      setValue(currentValue);
      setInternalLoading(false);
    }, 400);
  };

  const isLoading = externalLoading || internalLoading;
  const selectedScope = allScopes.find((scope) => scope.value === value) || allScopes[0];

  const isSidebar = variant === "sidebar";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isSidebar ? "ghost" : "outline"}
          role="combobox"
          aria-expanded={open}
          disabled={isLoading}
          className={cn(
            "justify-between h-9 transition-all duration-200",
            !isSidebar && "bg-background/50 border-input w-[240px]",
            isSidebar && !isCollapsed && "w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white",
            isSidebar && isCollapsed && "w-9 p-0 border-none bg-transparent hover:bg-white/10 text-white"
          )}
        >
          <div className={cn("flex items-center gap-2 truncate", isCollapsed && "justify-center w-full")}>
            {isLoading ? (
              <Loader2 className={cn("h-4 w-4 shrink-0 animate-spin", isSidebar ? "text-white/70" : "text-muted-foreground")} />
            ) : (
              <div className={cn(
                "shrink-0 transition-colors duration-200", 
                isSidebar ? (open ? "text-lepos-cyan" : "text-white") : "text-muted-foreground"
              )}>
                {selectedScope?.type === 'company' && <LayoutDashboard className="h-4 w-4" />}
                {selectedScope?.type === 'business-line' && <Building2 className="h-4 w-4" />}
                {selectedScope?.type === 'store' && <Store className="h-4 w-4" />}
              </div>
            )}
            {!isCollapsed && (
              <span className="truncate text-left flex-1 font-medium">
                {isLoading && !selectedScope ? "Loading..." : selectedScope?.label}
              </span>
            )}
          </div>
          {!isCollapsed && <ChevronsUpDown className={cn("ml-2 h-4 w-4 shrink-0 opacity-50", isSidebar ? "text-white" : "text-muted-foreground")} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-0 overflow-hidden" 
        align={isCollapsed ? "start" : align} 
        side={isCollapsed ? "right" : "bottom"} 
        sideOffset={isCollapsed ? 12 : 4}
      >
        <Command className="bg-popover">
          <CommandInput placeholder="Search" className="h-10 border-none focus:ring-0" />
          <CommandList className="max-h-[400px] overflow-y-auto p-0">
            <CommandEmpty className="py-6 text-center text-sm">No scope found.</CommandEmpty>
            <CommandGroup className="p-0">
               {allScopes.map((scope) => (
                 <CommandItem
                   key={scope.value}
                   value={scope.value}
                   onSelect={() => handleSelect(scope.value)}
                   className={cn(
                     "flex items-stretch p-0 rounded-none cursor-pointer select-none",
                     // Light mode: subtle accent background
                     "data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent-foreground",
                     // Dark mode: subtle input background (matches button.tsx outline variant)
                     "dark:data-[selected=true]:bg-input/50",
                     "transition-colors duration-150"
                   )}
                 >
                   {/* Tree Lines Area */}
                   <div className="flex flex-row shrink-0 select-none bg-transparent">
                     {/* Render lines for ancestor levels */}
                     {scope.parentPath.map((continues, i) => (
                       <div 
                         key={i} 
                         className="relative w-5 flex justify-center"
                       >
                         {/* Full height vertical line if parent continues */}
                         {continues && (
                            <div className="absolute top-0 bottom-0 left-1/2 w-px -ml-px bg-border" />
                         )}
                       </div>
                     ))}

                     {/* Render line/connector for current level (skip for root/level 0) */}
                     {scope.level > 0 && (
                        <div className="relative w-5 flex items-center justify-center">
                          {/* Vertical line from top to center */}
                          <div className="absolute top-0 h-1/2 left-1/2 w-px -ml-px bg-border" />
                          
                          {/* Vertical line from center to bottom (only if not last) */}
                          {!scope.isLast && (
                            <div className="absolute top-1/2 bottom-0 left-1/2 w-px -ml-px bg-border" />
                          )}
                          
                          {/* Horizontal line from center to right */}
                          <div className="absolute top-1/2 left-1/2 right-0 h-px -mt-px bg-border" />
                        </div>
                     )}
                     
                     {/* Spacing for root level if needed, or just padding */}
                     {scope.level === 0 && <div className="w-2" />}
                   </div>

                   {/* Content Area (Icon + Text) */}
                   <div className="flex flex-1 items-center py-2 pr-3 pl-1 min-w-0">
                     <div className="flex items-center justify-center mr-2 shrink-0">
                        {scope.type === 'company' && <LayoutDashboard className="h-4 w-4 text-muted-foreground" />}
                        {scope.type === 'business-line' && <Building2 className="h-4 w-4 text-muted-foreground" />}
                        {scope.type === 'store' && <Store className="h-4 w-4 text-muted-foreground" />}
                     </div>

                     <div className="flex items-center gap-2 flex-1 min-w-0">
                       <span className="truncate text-sm font-medium">{scope.label}</span>
                       {scope.hasChildren && (
                         <span className="text-xs text-muted-foreground bg-muted px-1.5 rounded-sm">
                           {scope.children?.length}
                         </span>
                       )}
                     </div>
                     
                     {/* Selection Checkmark */}
                     {value === scope.value && (
                        <Check className="ml-auto h-4 w-4 text-primary shrink-0" />
                     )}
                   </div>
                 </CommandItem>
               ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
