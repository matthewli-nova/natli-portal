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
import { Skeleton } from './ui/skeleton';
import { ChevronRight, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React from 'react';
import { menuItems, natliMenuItems, workMenuItems } from '../lib/menu-data';

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
  isLoading = false,
  platform,
  setPlatform,
  sseConnected = false,
  theme = 'dark',
}: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === "expanded";
  const isDark = theme === 'dark';

  return (
    <Sidebar
      collapsible="icon"
      style={
        isDark ? {
          "--sidebar": "#0F1923",
          "--sidebar-foreground": "rgba(255,255,255,0.85)",
          "--sidebar-primary": "var(--lepos-cyan)",
          "--sidebar-primary-foreground": "#0F1923",
          "--sidebar-accent": "#1A2D3D",
          "--sidebar-accent-foreground": "#ffffff",
          "--sidebar-border": "rgba(255,255,255,0.08)",
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
      {/* Collapse/Expand Toggle Button */}
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
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full h-[31px] flex items-center gap-2"
              >
                <img
                  src="https://avatars.slack-edge.com/2026-02-01/10412965046197_5784d6adc887705ae15e_512.png"
                  alt="Nat Lee"
                  className="h-[31px] w-[31px] rounded-md object-cover"
                />
                <span className={cn("font-semibold text-base whitespace-nowrap", isDark ? "text-white" : "text-slate-900")}>Nat Lee</span>
                <div className="flex-1" />
                <div className="flex items-center gap-1.5 text-xs pr-1">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${sseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
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
                className="w-full h-[31px] flex justify-center items-center relative"
              >
                <img
                  src="https://avatars.slack-edge.com/2026-02-01/10412965046197_5784d6adc887705ae15e_512.png"
                  alt="Nat Lee"
                  className="h-[31px] w-[31px] rounded-md object-cover"
                />
                {/* Platform indicator dot when collapsed */}
                <div
                  className={cn(
                    "absolute bottom-0 right-2 w-2.5 h-2.5 rounded-full border-2 border-background",
                    platform === 'natli' ? "bg-emerald-400" :
                    platform === 'work' ? "bg-amber-400" :
                    "bg-lepos-cyan"
                  )}
                  title={platform === 'natli' ? 'Agent' : platform === 'work' ? 'Work' : 'Template'}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarHeader>

      {/* Platform Switch: Nat Lee | Work | Template */}
      {isExpanded && (
        <div className="px-3 py-2 border-b border-sidebar-border">
          <div className={cn("flex items-center rounded-lg p-0.5 gap-0.5", isDark ? "bg-white/10" : "bg-slate-100")}>
            {([ 
              { id: 'natli', label: 'Agent' },
              { id: 'work', label: 'Work' },
              { id: 'template', label: '*' },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setPlatform(tab.id)}
                className={cn(
                  "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all",
                  platform === tab.id
                    ? "bg-lepos-cyan text-[#023F59] shadow-sm"
                    : isDark
                      ? "text-white/60 hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup className="pt-[9px] flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {platform === 'work' ? (
            <SidebarMenu>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      className="pointer-events-none transition-none"
                      isActive={false}
                    >
                      <Skeleton className={cn("w-4 h-4 shrink-0 rounded-sm", isDark ? "bg-white/10" : "bg-slate-200")} />
                      {isExpanded && (
                        <Skeleton className={cn("h-4 w-24 ml-2 rounded-sm", isDark ? "bg-white/10" : "bg-slate-200")} />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                workMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setActiveItem(item.id)}
                        className={cn(
                          "text-sidebar-foreground",
                          isDark
                            ? "hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
                            : "hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-lepos-cyan data-[active=true]:text-lepos-dark"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {isExpanded && (
                          <span className="truncate overflow-hidden">{item.label}</span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          ) : platform === 'natli' ? (
            <SidebarMenu>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      className="pointer-events-none transition-none"
                      isActive={false}
                    >
                      <Skeleton className={cn("w-4 h-4 shrink-0 rounded-sm", isDark ? "bg-white/10" : "bg-slate-200")} />
                      {isExpanded && (
                        <Skeleton className={cn("h-4 w-24 ml-2 rounded-sm", isDark ? "bg-white/10" : "bg-slate-200")} />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                natliMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setActiveItem(item.id)}
                        className={cn(
                          "text-sidebar-foreground",
                          isDark
                            ? "hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
                            : "hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-lepos-cyan data-[active=true]:text-lepos-dark"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {isExpanded && (
                          <span className="truncate overflow-hidden">
                            {item.label}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          ) : (
            <SidebarMenu>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      className="pointer-events-none transition-none"
                      isActive={false}
                    >
                      <Skeleton className={cn("w-4 h-4 shrink-0 rounded-sm", isDark ? "bg-white/10" : "bg-slate-200")} />
                      {isExpanded && (
                        <Skeleton className={cn("h-4 w-24 ml-2 rounded-sm", isDark ? "bg-white/10" : "bg-slate-200")} />
                      )}
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

                  if (hasSubItems) {
                    if (!isExpanded) {
                      return (
                        <SidebarMenuItem key={item.id}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <SidebarMenuButton
                                isActive={isActive}
                                className={cn(
                                  "text-sidebar-foreground",
                                  isDark
                                    ? "hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
                                    : "hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-lepos-cyan data-[active=true]:text-lepos-dark"
                                )}
                              >
                                <Icon className="w-4 h-4 shrink-0" />
                              </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              side="right"
                              align="start"
                              sideOffset={8}
                              className={cn(
                                isDark ? "bg-gray-600 text-white border-gray-500" : "bg-white text-slate-900 border-slate-200"
                              )}
                            >
                              <DropdownMenuArrow className={isDark ? "fill-gray-600" : "fill-white"} />
                              <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                              <DropdownMenuSeparator className={isDark ? "bg-white/10" : "bg-slate-100"} />
                              {item.subItems?.map((subItem) => (
                                <DropdownMenuItem
                                  key={subItem.id}
                                  onClick={() => setActiveItem(subItem.id)}
                                  className={cn(
                                    "cursor-pointer",
                                    isDark ? "focus:bg-gray-500 focus:text-white" : "focus:bg-slate-50 focus:text-slate-900"
                                  )}
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
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => toggleMenu(item.id)}
                          className={cn(
                            "text-sidebar-foreground",
                            isDark
                              ? "hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
                              : "hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-lepos-cyan data-[active=true]:text-lepos-dark"
                          )}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {isExpanded && (
                            <span className="truncate overflow-hidden">
                              {item.label}
                            </span>
                          )}
                          {isExpanded && (
                            <div className="ml-auto">
                              <ChevronRight
                                className={cn(
                                  'w-4 h-4 transition-transform duration-200',
                                  isOpen && 'rotate-90'
                                )}
                              />
                            </div>
                          )}
                        </SidebarMenuButton>
                        {isOpen && (
                          <SidebarMenuSub>
                            {item.subItems?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.id}>
                                <SidebarMenuSubButton
                                  isActive={activeItem === subItem.id}
                                  onClick={() => setActiveItem(subItem.id)}
                                  className={cn(
                                    "text-sidebar-foreground/80",
                                    isDark
                                      ? "hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
                                      : "hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-lepos-cyan data-[active=true]:text-lepos-dark"
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
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setActiveItem(item.id)}
                        className={cn(
                          "text-sidebar-foreground",
                          isDark
                            ? "hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
                            : "hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-lepos-cyan data-[active=true]:text-lepos-dark"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {isExpanded && (
                          <span className="truncate overflow-hidden">
                            {item.label}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn(
        "border-t mt-auto overflow-hidden",
        isDark ? "border-sidebar-border" : "border-slate-200",
        isExpanded ? "pt-2 pb-4 pl-4 pr-2" : "py-4 px-0 flex flex-col items-center justify-center"
      )}>
        <SidebarMenu className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "text-sidebar-foreground group-data-[collapsible=icon]:justify-center",
                isDark
                  ? "hover:bg-[#034A6C] hover:text-white"
                  : "hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarFallback className="bg-lepos-cyan text-lepos-dark text-xs">ML</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className={cn("truncate font-semibold", isDark ? "text-white" : "text-slate-900")}>Matthew Li</span>
                <span className="truncate text-xs text-sidebar-foreground/70">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Sign Out"
              className={cn(
                "text-sidebar-foreground group-data-[collapsible=icon]:justify-center",
                isDark
                  ? "hover:bg-[#034A6C] hover:text-white"
                  : "hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}