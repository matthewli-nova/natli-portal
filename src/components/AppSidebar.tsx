import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from './ui/sidebar';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuArrow,
} from './ui/dropdown-menu';
import { cn } from './ui/utils';
import { ChevronRight, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React from 'react';
import { menuItems, natliMenuItems, workMenuItems, type MenuItem } from '../lib/menu-data';

export interface AppSidebarProps {
  activeItem: string;
  setActiveItem: (id: string) => void;
  openMenus: string[];
  sseConnected?: boolean;
  toggleMenu: (id: string) => void;
  isLoading?: boolean;
  platform: 'natli' | 'work' | 'template';
  setPlatform: (p: 'natli' | 'work' | 'template') => void;
  theme?: 'dark' | 'light';
}

export function AppSidebar({
  activeItem,
  setActiveItem,
  openMenus,
  toggleMenu,
  platform,
  setPlatform,
  sseConnected = false,
  theme = 'dark',
}: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === 'expanded';
  const isDark = theme === 'dark';

  // Active-state classes (shared) — cyan-tinted, works both themes
  const itemBase = cn(
    'relative text-sidebar-foreground transition-colors',
    isDark
      ? 'hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-secondary/[0.14] data-[active=true]:text-white'
      : 'hover:bg-secondary/[0.08] hover:text-slate-900 data-[active=true]:bg-secondary/15 data-[active=true]:text-[#023F59]',
    'data-[active=true]:font-semibold',
  );

  // Left accent bar shown on active item
  const ActiveRail = ({ active }: { active: boolean }) =>
    active ? (
      <span className="accent-rail absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2" />
    ) : null;

  function renderGroupedMenu(items: MenuItem[]) {
    const groups: { name: string | undefined; items: MenuItem[] }[] = [];
    for (const item of items) {
      const last = groups[groups.length - 1];
      if (last && last.name === item.group) last.items.push(item);
      else groups.push({ name: item.group, items: [item] });
    }

    return groups.map((grp, gi) => (
      <div key={grp.name ?? gi} className={gi > 0 ? 'mt-3' : ''}>
        {isExpanded && grp.name && (
          <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            {grp.name}
          </p>
        )}
        <SidebarMenu>
          {grp.items.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.label}
                  onClick={() => setActiveItem(item.id)}
                  className={itemBase}
                >
                  <ActiveRail active={isActive} />
                  <Icon className="h-4 w-4 shrink-0" />
                  {isExpanded && (
                    <>
                      <span className="truncate overflow-hidden">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto rounded-full bg-sidebar-foreground/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sidebar-foreground/50">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </div>
    ));
  }

  return (
    <Sidebar
      collapsible="icon"
      style={
        isDark
          ? ({
              '--sidebar': '#0F1923',
              '--sidebar-foreground': 'rgba(255,255,255,0.85)',
              '--sidebar-primary': 'var(--lepos-cyan)',
              '--sidebar-primary-foreground': '#0F1923',
              '--sidebar-accent': '#1A2D3D',
              '--sidebar-accent-foreground': '#ffffff',
              '--sidebar-border': 'rgba(255,255,255,0.08)',
              '--sidebar-ring': 'var(--lepos-cyan)',
            } as React.CSSProperties)
          : ({
              '--sidebar': '#F8FAFC',
              '--sidebar-foreground': '#334155',
              '--sidebar-primary': 'var(--lepos-cyan)',
              '--sidebar-primary-foreground': 'var(--lepos-dark)',
              '--sidebar-accent': '#F1F5F9',
              '--sidebar-accent-foreground': '#0F172A',
              '--sidebar-border': '#E2E8F0',
              '--sidebar-ring': 'var(--lepos-cyan)',
            } as React.CSSProperties)
      }
      className={cn(
        'z-20 border-none [&>[data-slot=sidebar-inner]]:rounded-r-2xl',
        !isDark && 'border-r border-slate-200',
      )}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={cn(
          'absolute top-[44px] z-[100] transition-all duration-200',
          'h-8 w-8 rounded-full',
          isDark ? 'bg-[#1A2D3D] hover:bg-[#244055] ring-1 ring-white/10' : 'bg-white border border-slate-200 hover:bg-slate-50',
          'flex items-center justify-center shadow-lg',
          'right-0 translate-x-1/2',
        )}
        aria-label="Toggle Sidebar"
      >
        {isExpanded ? (
          <PanelLeftClose className={cn('h-4 w-4', isDark ? 'text-white' : 'text-slate-600')} />
        ) : (
          <PanelLeftOpen className={cn('h-4 w-4', isDark ? 'text-white' : 'text-slate-600')} />
        )}
      </button>

      <SidebarHeader className="relative z-[10] flex flex-col overflow-hidden border-b border-sidebar-border transition-all duration-200">
        <div className="flex h-[56px] w-full shrink-0 items-center px-2">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex h-[31px] w-full items-center gap-2"
              >
                <img src="/assets/nat-lee-avatar.png" alt="Nat Lee" className="h-[31px] w-[31px] rounded-md object-cover ring-1 ring-secondary/40" />
                <span className={cn('whitespace-nowrap text-base font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Nat Lee</span>
                <div className="flex-1" />
                <div className="flex items-center gap-1.5 pr-1 text-xs">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${sseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className={`whitespace-nowrap ${sseConnected ? 'text-emerald-300' : 'text-gray-400'}`}>
                    {sseConnected ? 'online' : 'offline'}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative flex h-[31px] w-full items-center justify-center"
              >
                <img src="/assets/nat-lee-avatar.png" alt="Nat Lee" className="h-[31px] w-[31px] rounded-md object-cover ring-1 ring-secondary/40" />
                <div
                  className={cn(
                    'absolute bottom-0 right-2 h-2.5 w-2.5 rounded-full border-2 border-background',
                    platform === 'natli' ? 'bg-emerald-400' : platform === 'work' ? 'bg-amber-400' : 'bg-lepos-cyan',
                  )}
                  title={platform === 'natli' ? 'Agent' : platform === 'work' ? 'Work' : 'Template'}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarHeader>

      {/* Platform Switch: Agent | Work | * */}
      {isExpanded && (
        <div className="border-b border-sidebar-border px-3 py-2">
          <div className={cn('flex items-center gap-0.5 rounded-lg p-0.5', isDark ? 'bg-white/10' : 'bg-slate-100')}>
            {(
              [
                { id: 'natli', label: 'Agent' },
                { id: 'work', label: 'Work' },
                { id: 'template', label: '*' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPlatform(tab.id)}
                className={cn(
                  'flex-1 rounded-md py-1.5 text-xs font-semibold transition-all',
                  platform === tab.id
                    ? 'bg-lepos-cyan text-[#023F59] shadow-sm'
                    : isDark
                      ? 'text-white/60 hover:text-white'
                      : 'text-slate-500 hover:text-slate-900',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <SidebarContent className="scroll-slim">
        <SidebarGroup className="flex-1 overflow-y-auto pt-[9px] [&::-webkit-scrollbar]:hidden">
          {platform === 'work'
            ? renderGroupedMenu(workMenuItems)
            : platform === 'natli'
              ? renderGroupedMenu(natliMenuItems)
              : (
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isChildActive = item.subItems?.some((sub) => sub.id === activeItem) ?? false;
                    const isActive = activeItem === item.id || (isChildActive && !isExpanded);
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isOpen = openMenus.includes(item.id);

                    if (hasSubItems) {
                      if (!isExpanded) {
                        return (
                          <SidebarMenuItem key={item.id}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <SidebarMenuButton isActive={isActive} className={itemBase}>
                                  <ActiveRail active={isActive} />
                                  <Icon className="h-4 w-4 shrink-0" />
                                </SidebarMenuButton>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="right"
                                align="start"
                                sideOffset={8}
                                className={cn(isDark ? 'border-gray-500 bg-gray-700 text-white' : 'border-slate-200 bg-white text-slate-900')}
                              >
                                <DropdownMenuArrow className={isDark ? 'fill-gray-700' : 'fill-white'} />
                                <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                                <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-slate-100'} />
                                {item.subItems?.map((subItem) => (
                                  <DropdownMenuItem
                                    key={subItem.id}
                                    onClick={() => setActiveItem(subItem.id)}
                                    className={cn('cursor-pointer', isDark ? 'focus:bg-gray-600 focus:text-white' : 'focus:bg-slate-50 focus:text-slate-900')}
                                  >
                                    {subItem.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </SidebarMenuItem>
                        );
                      }

                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton isActive={isActive} onClick={() => toggleMenu(item.id)} className={itemBase}>
                            <ActiveRail active={isActive} />
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate overflow-hidden">{item.label}</span>
                            <div className="ml-auto">
                              <ChevronRight className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-90')} />
                            </div>
                          </SidebarMenuButton>
                          {isOpen && (
                            <SidebarMenuSub>
                              {item.subItems?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.id}>
                                  <SidebarMenuSubButton
                                    isActive={activeItem === subItem.id}
                                    onClick={() => setActiveItem(subItem.id)}
                                    className={cn(
                                      'text-sidebar-foreground/80',
                                      isDark
                                        ? 'hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-secondary/15 data-[active=true]:text-white'
                                        : 'hover:bg-secondary/[0.08] hover:text-slate-900 data-[active=true]:bg-secondary/15 data-[active=true]:text-[#023F59]',
                                    )}
                                  >
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
                        <SidebarMenuButton isActive={isActive} tooltip={item.label} onClick={() => setActiveItem(item.id)} className={itemBase}>
                          <ActiveRail active={isActive} />
                          <Icon className="h-4 w-4 shrink-0" />
                          {isExpanded && <span className="truncate overflow-hidden">{item.label}</span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          'mt-auto overflow-hidden border-t',
          isDark ? 'border-sidebar-border' : 'border-slate-200',
          isExpanded ? 'pb-4 pl-4 pr-2 pt-2' : 'flex flex-col items-center justify-center px-0 py-4',
        )}
      >
        <SidebarMenu className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                'text-sidebar-foreground group-data-[collapsible=icon]:justify-center',
                isDark ? 'hover:bg-white/[0.06] hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                <AvatarFallback className="bg-lepos-cyan text-xs text-lepos-dark">ML</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className={cn('truncate font-semibold', isDark ? 'text-white' : 'text-slate-900')}>Matthew Li</span>
                <span className="truncate text-xs text-sidebar-foreground/70">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Sign Out"
              className={cn(
                'text-sidebar-foreground group-data-[collapsible=icon]:justify-center',
                isDark ? 'hover:bg-white/[0.06] hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
