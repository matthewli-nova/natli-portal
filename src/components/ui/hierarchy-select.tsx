import * as React from "react";
import { Check, ChevronsUpDown, Store, Building2, LayoutDashboard } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import { Label } from "./label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { scopes, type Scope } from "../data/scopes";

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

interface HierarchySelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function HierarchySelect({
  label = "Hierarchy Level",
  value,
  onChange,
  placeholder = "Select hierarchy level"
}: HierarchySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [pendingValue, setPendingValue] = React.useState(value);

  // Sync pending value when popover opens or value changes
  React.useEffect(() => {
    if (open) {
      setPendingValue(value);
    }
  }, [open, value]);

  const selectedScope = allScopes.find((scope) => scope.value === value);

  const handleApply = () => {
    onChange(pendingValue);
    setOpen(false);
  };

  const handleCancel = () => {
    setPendingValue(value);
    setOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'company':
        return <LayoutDashboard className="size-4 text-muted-foreground" />;
      case 'business-line':
        return <Building2 className="size-4 text-muted-foreground" />;
      case 'store':
        return <Store className="size-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-2">
      <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-9 bg-input-background border-input text-sm font-normal dark:bg-input/30 dark:hover:bg-input/50 transition-colors"
          >
            {selectedScope ? (
              <div className="flex items-center gap-2 min-w-0">
                {getIcon(selectedScope.type)}
                <span className="truncate">{selectedScope.label}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 overflow-hidden" align="start">
          <Command className="bg-popover">
            <CommandInput placeholder="Search hierarchy..." className="h-10 border-none focus:ring-0" />
            <CommandList className="max-h-[400px] overflow-y-auto p-0">
              <CommandEmpty className="py-6 text-center text-sm">No results found.</CommandEmpty>
              <CommandGroup className="p-0">
                {allScopes.map((scope) => (
                  <CommandItem
                    key={scope.value}
                    value={scope.value}
                    onSelect={(currentValue) => {
                      setPendingValue(currentValue);
                    }}
                    className={cn(
                      "flex items-stretch p-0 rounded-none cursor-pointer select-none",
                      "data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent-foreground",
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
                        {getIcon(scope.type)}
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
                      {pendingValue === scope.value && (
                        <Check className="ml-auto size-4 text-primary shrink-0" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="border-t border-border flex justify-end gap-3 bg-muted/5 px-[14px] pt-[10px] pb-[14px]">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground h-9"
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              size="sm" 
              onClick={handleApply}
              className="min-w-[100px] h-9"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}