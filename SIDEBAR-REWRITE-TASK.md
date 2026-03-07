# Sidebar Rewrite Task — Minimax M2.5

## Goal
Extract and rewrite the `AppSidebar` component from `src/App.tsx` into a new standalone file `src/components/AppSidebar.tsx`. Consolidate the reference design (below) with the existing code. Then update `src/App.tsx` to import from the new file.

## Reference Design (AppSidebar.tsx from Lepōs project)
This is the design to incorporate — study it carefully:

```tsx
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub,
  SidebarMenuSubButton, SidebarMenuSubItem, useSidebar,
} from './ui/sidebar';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuArrow,
} from './ui/dropdown-menu';
import { cn } from './ui/utils';
import { LeposLogo } from './LeposLogo';
import { LeposIcon } from './LeposIcon';
import { menuItems } from '../lib/menu-data';
import { ChevronRight, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton } from './ui/skeleton';
import React from 'react';

export interface AppSidebarProps {
  activeItem: string;
  setActiveItem: (id: string) => void;
  openMenus: string[];
  toggleMenu: (id: string) => void;
  isLoading?: boolean;
  theme?: 'dark' | 'light';
}

export function AppSidebar({ activeItem, setActiveItem, openMenus, toggleMenu, isLoading = false, theme = 'light' }: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === "expanded";
  const isDark = theme === 'dark';

  return (
    <Sidebar
      collapsible="icon"
      style={
        isDark ? {
          "--sidebar": "var(--lepos-dark)",
          "--sidebar-foreground": "#ffffff",
          "--sidebar-primary": "var(--lepos-cyan)",
          "--sidebar-primary-foreground": "var(--lepos-dark)",
          "--sidebar-accent": "#023F59",
          "--sidebar-accent-foreground": "#ffffff",
          "--sidebar-border": "rgba(255,255,255,0.1)",
          "--sidebar-ring": "var(--lepos-cyan)",
        } as React.CSSProperties : {
          "--sidebar": "#F8FAFC",
          "--sidebar-foreground": "#334155",
          "--sidebar-primary": "var(--lepos-cyan)",
          "--sidebar-primary-foreground": "var(--lepos-dark)",
          "--sidebar-accent": "#F1F5F9",
          "--sidebar-accent-foreground": "#0F172A",
          "--sidebar-border": "#E2E8F0",
          "--sidebar-ring": "var(--lepos-cyan)",
        } as React.CSSProperties
      }
      className={cn(
        "z-20 border-none [&>[data-slot=sidebar-inner]]:rounded-r-2xl",
        !isDark && "border-r border-slate-200"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute top-[44px] z-[100] transition-all duration-200",
          "w-8 h-8 rounded-full",
          isDark ? "bg-gray-600 hover:bg-gray-500" : "bg-white border border-slate-200 hover:bg-slate-50",
          "flex items-center justify-center shadow-lg",
          "right-0 translate-x-1/2"
        )}
        aria-label="Toggle Sidebar"
      >
        {isExpanded
          ? <PanelLeftClose className={cn("w-4 h-4", isDark ? "text-white" : "text-slate-600")} />
          : <PanelLeftOpen className={cn("w-4 h-4", isDark ? "text-white" : "text-slate-600")} />
        }
      </button>

      <SidebarHeader className="border-b border-sidebar-border relative z-[10] flex flex-col transition-all duration-200 overflow-hidden">
        <div className="flex items-center w-full h-[56px] px-2 shrink-0">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div key="logo-full" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="w-full h-[31px] flex items-center">
                <LeposLogo size="md" variant={isDark ? "light" : "default"} className="w-auto h-full" />
              </motion.div>
            ) : (
              <motion.div key="logo-icon" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }} className="w-full h-[31px] flex justify-center items-center">
                <LeposIcon size="md" className="w-auto h-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pt-[9px] flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <SidebarMenu>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton className="pointer-events-none transition-none" isActive={false}>
                    <Skeleton className={cn("w-4 h-4 shrink-0 rounded-sm", isDark ? "bg-white/10" : "bg-slate-200")} />
                    {isExpanded && <Skeleton className={cn("h-4 w-24 ml-2 rounded-sm", isDark ? "bg-white/10" : "bg-slate-200")} />}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              menuItems.map((item) => {
                const Icon = item.icon;
                const isChildActive = item.subItems?.some(sub => sub.id === activeItem) ?? false;
                const isActive = activeItem === item.id || (isChildActive && !isExpanded);
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isOpen = openMenus.includes(item.id);

                if (hasSubItems && !isExpanded) {
                  return (
                    <SidebarMenuItem key={item.id}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton isActive={isActive} className={cn("text-sidebar-foreground", isDark ? "hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white" : "hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-lepos-cyan data-[active=true]:text-lepos-dark")}>
                            <Icon className="w-4 h-4 shrink-0" />
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" sideOffset={8} className={cn(isDark ? "bg-gray-600 text-white border-gray-500" : "bg-white text-slate-900 border-slate-200")}>
                          <DropdownMenuArrow className={isDark ? "fill-gray-600" : "fill-white"} />
                          <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                          <DropdownMenuSeparator className={isDark ? "bg-white/10" : "bg-slate-100"} />
                          {item.subItems?.map((subItem) => (
                            <DropdownMenuItem key={subItem.id} onClick={() => setActiveItem(subItem.id)} className={cn("cursor-pointer", isDark ? "focus:bg-gray-500 focus:text-white" : "focus:bg-slate-50 focus:text-slate-900")}>
                              {subItem.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                }

                if (hasSubItems) {
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton isActive={isActive} onClick={() => toggleMenu(item.id)} className={cn("text-sidebar-foreground", isDark ? "hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white" : "hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-lepos-cyan data-[active=true]:text-lepos-dark")}>
                        <Icon className="w-4 h-4 shrink-0" />
                        {isExpanded && <span className="truncate overflow-hidden">{item.label}</span>}
                        {isExpanded && <div className="ml-auto"><ChevronRight className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-90')} /></div>}
                      </SidebarMenuButton>
                      {isOpen && (
                        <SidebarMenuSub>
                          {item.subItems?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton isActive={activeItem === subItem.id} onClick={() => setActiveItem(subItem.id)} className={cn("text-sidebar-foreground/80", isDark ? "hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white" : "hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-lepos-cyan data-[active=true]:text-lepos-dark")}>
                                <span className="ml-1 whitespace-normal break-words">{subItem.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton isActive={isActive} onClick={() => setActiveItem(item.id)} className={cn("text-sidebar-foreground", isDark ? "hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white" : "hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-lepos-cyan data-[active=true]:text-lepos-dark")}>
                      <Icon className="w-4 h-4 shrink-0" />
                      {isExpanded && <span className="truncate overflow-hidden">{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("border-t mt-auto overflow-hidden", isDark ? "border-sidebar-border" : "border-slate-200", isExpanded ? "pt-2 pb-4 pl-4 pr-2" : "py-4 px-0 flex flex-col items-center justify-center")}>
        <SidebarMenu className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className={cn("text-sidebar-foreground group-data-[collapsible=icon]:justify-center", isDark ? "hover:bg-[#034A6C] hover:text-white" : "hover:bg-slate-100 hover:text-slate-900")}>
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarFallback className="bg-lepos-cyan text-lepos-dark text-xs font-bold">JD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className={cn("truncate font-semibold", isDark ? "text-white" : "text-slate-900")}>John Doe</span>
                <span className="truncate text-xs text-sidebar-foreground/70">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Sign Out" className={cn("text-sidebar-foreground group-data-[collapsible=icon]:justify-center", isDark ? "hover:bg-[#034A6C] hover:text-white" : "hover:bg-slate-100 hover:text-slate-900")}>
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
```

## What Already Exists in App.tsx
The current `AppSidebar` in `App.tsx` has these ADDITIONAL features beyond the reference:
1. **SSE connection indicator** — shows online/offline dot + text next to Nat Lee name in header (when expanded)
2. **Platform switcher** — three tabs: Agent | Work | * (natli, work, template) — shown in a pill-style switcher below header when expanded
3. **Three menu systems** — `natliMenuItems`, `workMenuItems`, `menuItems` (template) — rendered based on `platform` state
4. **Nat Lee branding** — avatar image + "Nat Lee" text (not Lepōs logo, since this is the natli-portal)
5. **`isDark` always true** — dark theme only currently (existing code doesn't support light)
6. **`sseConnected` prop** — passed from AppShell via `useSSEContext()`
7. **`platform` + `setPlatform` props** — for the platform switcher

## Your Task

1. **Read the existing App.tsx** to understand the current AppSidebar structure fully
2. **Create `src/components/AppSidebar.tsx`** — a clean standalone component that:
   - Uses the reference design's structure as the base (theming system, toggle button, CSS variables, light/dark support)
   - Keeps ALL the existing natli-portal features (SSE indicator, platform switcher, three menus, Nat Lee branding)
   - Uses the reference's improved `isDark` conditional patterns for theming throughout (hover, active states, dropdown colors, footer border, skeleton colors)
   - The `theme` prop defaults to `'dark'` (since the portal is currently always dark)
   - Correct import paths: `../components/ui/sidebar`, `../lib/menu-data`, etc.
3. **Update `src/App.tsx`**:
   - Remove the `AppSidebar` function and its `AppSidebarProps` interface
   - Add import: `import { AppSidebar } from './components/AppSidebar';`
   - Keep everything else in App.tsx unchanged

## Import Notes for AppSidebar.tsx
All UI imports are relative from `src/components/`:
- `./ui/sidebar` — sidebar primitives
- `./ui/avatar` — Avatar, AvatarFallback
- `./ui/dropdown-menu` — DropdownMenu etc.
- `./ui/utils` — cn
- `./ui/skeleton` — Skeleton
- `../lib/menu-data` — menuItems, natliMenuItems, workMenuItems
- `lucide-react` — icons
- `motion/react` — motion, AnimatePresence
- `react` — React

## After Creating the Files
1. Run `npm run build` to check for TypeScript errors
2. Fix any errors
3. Commit: `git add -A && git commit -m "refactor: extract AppSidebar to standalone component with theme support"`
4. Run: `openclaw system event --text "Sidebar rewrite complete — AppSidebar extracted to src/components/AppSidebar.tsx, theme support added, build passes" --mode now`
