import { useState } from "react";
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
  SidebarProvider,
} from "../ui/sidebar";
import {
  Gauge,
  Box,
  ShoppingBag,
  Warehouse,
  PackageOpen,
  Package,
  CalendarFold,
  Calendar,
  Calculator,
  CreditCard,
  DollarSign,
  ChartNoAxesCombined,
  BarChart3,
  Settings,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LeposLogo } from "../LeposLogo";
import { LeposIcon } from "../LeposIcon";
import { cn } from "../ui/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuArrow,
} from "../ui/dropdown-menu";

// Menu data structure matching App.tsx
const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Gauge,
  },
  {
    id: 'products',
    label: 'Products',
    icon: Box,
    subItems: [
      { id: 'products-list', label: 'Products' },
      { id: 'packages', label: 'Packages' },
      { id: 'tickets', label: 'Tickets' },
      { id: 'wallets', label: 'Wallets' },
      { id: 'brands', label: 'Brands' },
      { id: 'categories', label: 'Categories' },
      { id: 'menus', label: 'Menus' },
      { id: 'attributes', label: 'Attributes' },
      { id: 'modifiers', label: 'Modifiers' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Warehouse,
    subItems: [
      { id: 'inventory-stock', label: 'Inventory Stock' },
      { id: 'inventory-transfer', label: 'Inventory Transfer' },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    icon: CalendarFold,
    subItems: [
      { id: 'events-list', label: 'Events' },
      { id: 'event-sessions', label: 'Event Sessions' },
      { id: 'event-distribution-channels', label: 'Event Distribution Channels' },
      { id: 'event-ticket-templates', label: 'Event Ticket Templates' },
      { id: 'wallet-generation', label: 'Wallet Generation' },
    ],
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: DollarSign,
  },
  {
    id: 'register',
    label: 'Register',
    icon: Calculator,
    subItems: [
      { id: 'device-sessions', label: 'Device Sessions' },
      { id: 'registers', label: 'Registers' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: ChartNoAxesCombined,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    subItems: [
      { id: 'group-settings', label: 'Group Settings' },
      { id: 'inventory-settings', label: 'Inventory Settings' },
      { id: 'business-line-store', label: 'Business Line & Store' },
      { id: 'devices-navigation-settings', label: 'Devices Navigation Settings' },
      { id: 'device-settings', label: 'Device Settings' },
      { id: 'payments-settings', label: 'Payments Settings' },
      { id: 'payment-methods', label: 'Payment Methods' },
      { id: 'price-book-setup', label: 'Price Book Setup' },
    ],
  },
];

export function SidebarExamples() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [openMenus, setOpenMenus] = useState<string[]>(['products']);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderSidebarContent = (isExpandedState: boolean) => (
    <>
      <SidebarContent>
        <SidebarGroup className="pt-[9px]">
          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isOpen = openMenus.includes(item.id);

              if (hasSubItems) {
                if (!isExpandedState) {
                  return (
                    <SidebarMenuItem key={item.id}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton
                            isActive={isActive}
                            className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" sideOffset={8} className="bg-gray-600 text-white border-gray-500">
                          <DropdownMenuArrow className="fill-gray-600" />
                          <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          {item.subItems?.map((subItem) => (
                            <DropdownMenuItem
                              key={subItem.id}
                              onClick={() => setActiveItem(subItem.id)}
                              className="focus:bg-gray-500 focus:text-white cursor-pointer"
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
                      onClick={() => {
                        setActiveItem(item.id);
                        toggleMenu(item.id);
                      }}
                      className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
                      tooltip={!isExpandedState ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className={cn("truncate overflow-hidden", !isExpandedState && "group-data-[collapsible=icon]:hidden")}>
                        {item.label}
                      </span>
                      {isExpandedState && (
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
                    {isOpen && isExpandedState && (
                      <SidebarMenuSub>
                        {item.subItems?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.id}>
                            <SidebarMenuSubButton
                              isActive={activeItem === subItem.id}
                              onClick={() => setActiveItem(subItem.id)}
                              className="text-sidebar-foreground/80 hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
                            >
                              <span className="ml-1">{subItem.label}</span>
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
                    className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
                    tooltip={!isExpandedState ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className={cn("truncate overflow-hidden", !isExpandedState && "group-data-[collapsible=icon]:hidden")}>
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("border-t border-sidebar-border mt-auto overflow-hidden", isExpandedState ? "pt-2 pb-4 pl-4 pr-2" : "py-4 px-0 flex flex-col items-center justify-center")}>
        <SidebarMenu className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarFallback className="bg-lepos-cyan text-lepos-dark text-xs">JD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-white">John Doe</span>
                <span className="truncate text-xs text-sidebar-foreground/70">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Sign Out"
              className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white group-data-[collapsible=icon]:justify-center"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
           <h4 className="text-lg font-semibold mb-1">Sidebar Menu & Submenu</h4>
           <p className="text-sm text-muted-foreground">Hierarchical navigation structure with collapsible groups and nested items.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Expanded State */}
            <div className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground">Expanded State</h5>
                <div className="w-[280px] border bg-[var(--lepos-dark)] shadow-sm h-[600px] flex flex-col relative rounded-r-2xl">
                    <SidebarProvider className="min-h-0 w-full h-full">
                        <Sidebar 
                          collapsible="none" 
                          className="w-full bg-transparent h-full border-none relative [&_[data-slot=sidebar-footer]]:p-4"
                          style={
                            {
                              "--sidebar": "var(--lepos-dark)",
                              "--sidebar-foreground": "#ffffff",
                              "--sidebar-primary": "var(--lepos-cyan)",
                              "--sidebar-primary-foreground": "var(--lepos-dark)",
                              "--sidebar-accent": "#023F59",
                              "--sidebar-accent-foreground": "#ffffff",
                              "--sidebar-border": "rgba(255,255,255,0.1)",
                              "--sidebar-ring": "var(--lepos-cyan)",
                            } as React.CSSProperties
                          }
                        >
                            {/* Fake Toggle Button for visual representation */}
                            <div
                                className={cn(
                                  "absolute top-[44px] z-[100]",
                                  "w-8 h-8 rounded-full",
                                  "bg-gray-600",
                                  "flex items-center justify-center",
                                  "shadow-lg",
                                  "right-0 translate-x-1/2 cursor-default"
                                )}
                            >
                                <PanelLeftClose className="w-4 h-4 text-white" />
                            </div>

                            <SidebarHeader className="border-b border-sidebar-border h-[56px] pb-[9px] px-4 pt-4">
                                <div className="w-full h-[31px] flex items-center px-[7px]">
                                    <LeposLogo size="md" variant="light" className="w-auto h-full" />
                                </div>
                            </SidebarHeader>

                            {renderSidebarContent(true)}
                        </Sidebar>
                    </SidebarProvider>
                </div>
            </div>

            {/* Collapsed State */}
            <div className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground">Collapsed State</h5>
                <div className="w-[4rem] border bg-[var(--lepos-dark)] shadow-sm h-[600px] flex flex-col relative rounded-r-2xl">
                    <SidebarProvider className="min-h-0 w-full h-full" defaultOpen={false}>
                        <Sidebar 
                          collapsible="icon" 
                          className="w-full bg-transparent h-full border-none relative [&_[data-slot=sidebar-footer]]:p-4 [&>[data-slot=sidebar-inner]]:rounded-r-2xl"
                          style={
                            {
                              "--sidebar": "var(--lepos-dark)",
                              "--sidebar-foreground": "#ffffff",
                              "--sidebar-primary": "var(--lepos-cyan)",
                              "--sidebar-primary-foreground": "var(--lepos-dark)",
                              "--sidebar-accent": "#023F59",
                              "--sidebar-accent-foreground": "#ffffff",
                              "--sidebar-border": "rgba(255,255,255,0.1)",
                              "--sidebar-ring": "var(--lepos-cyan)",
                            } as React.CSSProperties
                          }
                        >
                            {/* Fake Toggle Button for visual representation */}
                            <div
                                className={cn(
                                  "absolute top-[44px] z-[100]",
                                  "w-8 h-8 rounded-full",
                                  "bg-gray-600",
                                  "flex items-center justify-center",
                                  "shadow-lg",
                                  "right-0 translate-x-1/2 cursor-default"
                                )}
                            >
                                <PanelLeftOpen className="w-4 h-4 text-white" />
                            </div>

                            <SidebarHeader className="border-b border-sidebar-border h-[56px] pb-[9px] px-4 pt-4 overflow-hidden">
                                <div className="w-full h-[31px] flex justify-center items-center">
                                    <LeposIcon size="md" className="w-auto h-full" />
                                </div>
                            </SidebarHeader>

                            {renderSidebarContent(false)}
                        </Sidebar>
                    </SidebarProvider>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t">
        <div>
           <h4 className="text-lg font-semibold mb-1">Individual Components</h4>
           <p className="text-sm text-muted-foreground">Isolated view of sidebar menu components.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Standard Item */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">Menu Item</h5>
                <div className="w-full max-w-[280px] p-2 rounded-lg bg-[var(--lepos-dark)] border shadow-sm">
                    <SidebarProvider className="min-h-0 w-full" defaultOpen={true}>
                        <div className="w-full" style={
                            {
                            "--sidebar": "var(--lepos-dark)",
                            "--sidebar-foreground": "#ffffff",
                            "--sidebar-primary": "var(--lepos-cyan)",
                            "--sidebar-primary-foreground": "var(--lepos-dark)",
                            "--sidebar-accent": "#023F59",
                            "--sidebar-accent-foreground": "#ffffff",
                            "--sidebar-border": "rgba(255,255,255,0.1)",
                            "--sidebar-ring": "var(--lepos-cyan)",
                            } as React.CSSProperties
                        }>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white">
                                        <Gauge className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </div>
                    </SidebarProvider>
                </div>
            </div>

            {/* Active Item */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">Active Item</h5>
                <div className="w-full max-w-[280px] p-2 rounded-lg bg-[var(--lepos-dark)] border shadow-sm">
                    <SidebarProvider className="min-h-0 w-full" defaultOpen={true}>
                        <div className="w-full" style={
                            {
                            "--sidebar": "var(--lepos-dark)",
                            "--sidebar-foreground": "#ffffff",
                            "--sidebar-primary": "var(--lepos-cyan)",
                            "--sidebar-primary-foreground": "var(--lepos-dark)",
                            "--sidebar-accent": "#023F59",
                            "--sidebar-accent-foreground": "#ffffff",
                            "--sidebar-border": "rgba(255,255,255,0.1)",
                            "--sidebar-ring": "var(--lepos-cyan)",
                            } as React.CSSProperties
                        }>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white">
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                        <ChevronRight className="ml-auto w-4 h-4 rotate-90" />
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton isActive className="text-sidebar-foreground/80 hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white">
                                                <span className="ml-1">Devices Navigation Settings</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </div>
                    </SidebarProvider>
                </div>
            </div>
            
            {/* Submenu Item */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">Submenu Item</h5>
                <div className="w-full max-w-[280px] p-2 rounded-lg bg-[var(--lepos-dark)] border shadow-sm">
                    <SidebarProvider className="min-h-0 w-full" defaultOpen={true}>
                        <div className="w-full" style={
                            {
                            "--sidebar": "var(--lepos-dark)",
                            "--sidebar-foreground": "#ffffff",
                            "--sidebar-primary": "var(--lepos-cyan)",
                            "--sidebar-primary-foreground": "var(--lepos-dark)",
                            "--sidebar-accent": "#023F59",
                            "--sidebar-accent-foreground": "#ffffff",
                            "--sidebar-border": "rgba(255,255,255,0.1)",
                            "--sidebar-ring": "var(--lepos-cyan)",
                            } as React.CSSProperties
                        }>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white">
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                        <ChevronRight className="ml-auto w-4 h-4 rotate-90" />
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton className="text-sidebar-foreground/80 hover:bg-[#034A6C] hover:text-white">
                                                <span>General</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                            <SidebarMenuSubButton isActive className="text-sidebar-foreground/80 hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white">
                                                <span>Security</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </div>
                    </SidebarProvider>
                </div>
            </div>

             {/* User Profile */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">User Profile</h5>
                <div className="w-full max-w-[280px] p-2 rounded-lg bg-[var(--lepos-dark)] border shadow-sm">
                    <SidebarProvider className="min-h-0 w-full" defaultOpen={true}>
                        <div className="w-full" style={
                            {
                            "--sidebar": "var(--lepos-dark)",
                            "--sidebar-foreground": "#ffffff",
                            "--sidebar-primary": "var(--lepos-cyan)",
                            "--sidebar-primary-foreground": "var(--lepos-dark)",
                            "--sidebar-accent": "#023F59",
                            "--sidebar-accent-foreground": "#ffffff",
                            "--sidebar-border": "rgba(255,255,255,0.1)",
                            "--sidebar-ring": "var(--lepos-cyan)",
                            } as React.CSSProperties
                        }>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton size="lg" className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white">
                                        <Avatar className="h-8 w-8 rounded-lg shrink-0">
                                            <AvatarFallback className="bg-lepos-cyan text-lepos-dark text-xs">JD</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold text-white">John Doe</span>
                                            <span className="truncate text-xs text-sidebar-foreground/70">Admin</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </div>
                    </SidebarProvider>
                </div>
            </div>

            {/* Sidebar Header */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">Sidebar Header</h5>
                <div className="w-full max-w-[280px] rounded-lg bg-[var(--lepos-dark)] border shadow-sm overflow-hidden">
                    <SidebarProvider className="min-h-0 w-full" defaultOpen={true}>
                        <div className="w-full" style={
                            {
                            "--sidebar": "var(--lepos-dark)",
                            "--sidebar-foreground": "#ffffff",
                            "--sidebar-primary": "var(--lepos-cyan)",
                            "--sidebar-primary-foreground": "var(--lepos-dark)",
                            "--sidebar-accent": "#023F59",
                            "--sidebar-accent-foreground": "#ffffff",
                            "--sidebar-border": "rgba(255,255,255,0.1)",
                            "--sidebar-ring": "var(--lepos-cyan)",
                            } as React.CSSProperties
                        }>
                            <SidebarHeader className="border-b border-sidebar-border h-[56px] pb-[9px] px-4 pt-4">
                                <div className="w-full h-[31px] flex items-center px-[7px] py-[0px]">
                                    <LeposLogo size="md" variant="light" className="w-auto h-full" />
                                </div>
                            </SidebarHeader>
                        </div>
                    </SidebarProvider>
                </div>
            </div>

            {/* Sidebar Footer */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">Sidebar Footer</h5>
                <div className="w-full max-w-[280px] rounded-lg bg-[var(--lepos-dark)] border shadow-sm overflow-hidden">
                    <SidebarProvider className="min-h-0 w-full" defaultOpen={true}>
                        <div className="w-full" style={
                            {
                            "--sidebar": "var(--lepos-dark)",
                            "--sidebar-foreground": "#ffffff",
                            "--sidebar-primary": "var(--lepos-cyan)",
                            "--sidebar-primary-foreground": "var(--lepos-dark)",
                            "--sidebar-accent": "#023F59",
                            "--sidebar-accent-foreground": "#ffffff",
                            "--sidebar-border": "rgba(255,255,255,0.1)",
                            "--sidebar-ring": "var(--lepos-cyan)",
                            } as React.CSSProperties
                        }>
                            <SidebarFooter className="border-t border-sidebar-border pt-2 pb-4 pl-4 pr-2">
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            tooltip="Sign Out"
                                            className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white"
                                        >
                                            <LogOut className="w-4 h-4 shrink-0" />
                                            <span>Sign Out</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarFooter>
                        </div>
                    </SidebarProvider>
                </div>
            </div>

            {/* Collapse Trigger */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">Collapse Trigger</h5>
                <div className="w-full max-w-[280px] p-6 rounded-lg bg-[var(--lepos-dark)] border shadow-sm flex items-center justify-center">
                    <SidebarProvider className="min-h-0 w-auto" defaultOpen={true}>
                        <div style={
                            {
                            "--sidebar": "var(--lepos-dark)",
                            "--sidebar-foreground": "#ffffff",
                            "--sidebar-primary": "var(--lepos-cyan)",
                            "--sidebar-primary-foreground": "var(--lepos-dark)",
                            "--sidebar-accent": "#023F59",
                            "--sidebar-accent-foreground": "#ffffff",
                            "--sidebar-border": "rgba(255,255,255,0.1)",
                            "--sidebar-ring": "var(--lepos-cyan)",
                            } as React.CSSProperties
                        }>
                            <button
                                className={cn(
                                "w-8 h-8 rounded-full",
                                "bg-gray-600 hover:bg-gray-500",
                                "flex items-center justify-center",
                                "shadow-lg text-white transition-all duration-200"
                                )}
                                aria-label="Toggle Sidebar"
                            >
                                <PanelLeftClose className="w-4 h-4" />
                            </button>
                        </div>
                    </SidebarProvider>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}