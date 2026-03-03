import { CreateEventForm } from './components/events/CreateEventForm';
import { EventDetailPage } from './components/events/EventDetailPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { EventsList } from './components/events/EventsList';
import { InvitationManager } from './components/invitations/InvitationManager';
import { RegistrationLinkManager } from './components/registration-links/RegistrationLinkManager';
import { StyleGuide } from './components/StyleGuide';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  SidebarInset,
  useSidebar,
} from './components/ui/sidebar';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Button } from './components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from './components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuArrow,
} from './components/ui/dropdown-menu';
import { cn } from './components/ui/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './components/ui/tooltip';
import { Skeleton } from './components/ui/skeleton';
import { ChevronRight, LogOut, PanelLeftClose, PanelLeftOpen, Palette } from 'lucide-react';
import { LeposLogo } from './components/LeposLogo';
import { LeposIcon } from './components/LeposIcon';
import { PortalHeader } from './components/PortalHeader';
import { PageHeader } from './components/PageHeader';
import { PagePlaceholder } from './components/PagePlaceholder';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { type B2BEvent } from './components/data/b2b-events';
import { menuItems } from './lib/menu-data';

interface AppSidebarProps {
  activeItem: string;
  setActiveItem: (id: string) => void;
  openMenus: string[];
  toggleMenu: (id: string) => void;
  isLoading?: boolean;
  platform: 'natli' | 'template';
  setPlatform: (p: 'natli' | 'template') => void;
}

function AppSidebar({ activeItem, setActiveItem, openMenus, toggleMenu, isLoading = false, platform, setPlatform }: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar
      collapsible="icon"
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
      className="z-20 border-none [&>[data-slot=sidebar-inner]]:rounded-r-2xl"
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute top-[44px] z-[100] transition-all duration-200",
          "w-8 h-8 rounded-full",
          "bg-gray-600 hover:bg-gray-500",
          "flex items-center justify-center",
          "shadow-lg",
          "right-0 translate-x-1/2"
        )}
        aria-label="Toggle Sidebar"
      >
        {isExpanded ? (
          <PanelLeftClose className="w-4 h-4 text-white" />
        ) : (
          <PanelLeftOpen className="w-4 h-4 text-white" />
        )}
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
                className="w-full h-[31px] flex items-center"
              >
                <LeposLogo size="md" variant="light" className="w-auto h-full" />
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="w-full h-[31px] flex justify-center items-center"
              >
                <LeposIcon size="md" className="w-auto h-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarHeader>

      {/* Platform Switch: Nat Li | Template */}
      {isExpanded && (
        <div className="px-3 py-2 border-b border-sidebar-border">
          <div className="flex items-center bg-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setPlatform('natli')}
              className={cn(
                "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all",
                platform === 'natli'
                  ? "bg-lepos-cyan text-[#023F59] shadow-sm"
                  : "text-white/60 hover:text-white"
              )}
            >
              Nat Li
            </button>
            <button
              onClick={() => setPlatform('template')}
              className={cn(
                "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all",
                platform === 'template'
                  ? "bg-lepos-cyan text-[#023F59] shadow-sm"
                  : "text-white/60 hover:text-white"
              )}
            >
              Template
            </button>
          </div>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup className="pt-[9px] flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {platform === 'natli' ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <span className="text-white/40 text-xs">No menu items yet</span>
            </div>
          ) : (
          <SidebarMenu>
            {isLoading ? (
              // Loading Skeleton Loop for Top Level
              Array.from({ length: 6 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    className="pointer-events-none transition-none"
                    isActive={false}
                  >
                    {/* Icon Skeleton */}
                    <Skeleton className="w-4 h-4 shrink-0 rounded-sm bg-white/10" />
                    
                    {/* Text Skeleton (only if expanded) */}
                    {isExpanded && (
                      <Skeleton className="h-4 w-24 ml-2 rounded-sm bg-white/10" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              // Real Menu Items
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
                          toggleMenu(item.id);
                        }}
                        className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
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
                                className="text-sidebar-foreground/80 hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
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
                      className="text-sidebar-foreground hover:bg-[#034A6C] hover:text-white data-[active=true]:bg-[#023F59] data-[active=true]:text-white"
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

      <SidebarFooter className={cn("border-t border-sidebar-border mt-auto overflow-hidden", isExpanded ? "pt-2 pb-4 pl-4 pr-2" : "py-4 px-0 flex flex-col items-center justify-center")}>
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
    </Sidebar>
  );
}

// Loading Skeleton for Page Content
function PageContentSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4">
        <Skeleton className="h-[125px] rounded-xl" />
        <Skeleton className="h-[125px] rounded-xl" />
        <Skeleton className="h-[125px] rounded-xl" />
        <Skeleton className="h-[125px] rounded-xl" />
      </div>
      <div className="pt-4">
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [openMenus, setOpenMenus] = useState<string[]>(['products']);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<B2BEvent | null>(null);
  const [platform, setPlatform] = useState<'natli' | 'template'>('natli');

  // Initial Sidebar Load Simulation
  useEffect(() => {
    setIsSidebarLoading(true);
    const timer = setTimeout(() => {
      setIsSidebarLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handler for navigation - triggers page loading simulation
  const handleNavigate = (id: string) => {
    setActiveItem(id);
    setIsPageLoading(true);
    setShowEventForm(false); // Reset form state when navigating
    
    // Simulate API call for page data
    setTimeout(() => {
      setIsPageLoading(false);
    }, 800); // 0.8s loading delay
  };

  // Find the current page info based on activeItem
  const activePageInfo = useMemo(() => {
    // Check top level
    const topItem = menuItems.find(item => item.id === activeItem);
    if (topItem) {
      return { 
        title: topItem.label,
        breadcrumbs: [
          { label: topItem.label, active: true }
        ]
      };
    }

    // Check nested
    for (const item of menuItems) {
      if (item.subItems) {
        const subItem = item.subItems.find(sub => sub.id === activeItem);
        if (subItem) {
          return {
            title: subItem.label,
            breadcrumbs: [
              { label: item.label, href: '#' }, 
              { label: subItem.label, active: true }
            ]
          };
        }
      }
    }

    return { 
      title: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard', active: true }]
    };
  }, [activeItem]);

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar
        activeItem={activeItem}
        setActiveItem={handleNavigate}
        openMenus={openMenus}
        toggleMenu={toggleMenu}
        isLoading={isSidebarLoading}
        platform={platform}
        setPlatform={setPlatform}
      />
      <SidebarInset>
        <PortalHeader 
          breadcrumbs={activePageInfo.breadcrumbs} 
        />
        <main className="flex-1 p-6 relative min-w-0 w-full overflow-y-auto">
          {isPageLoading ? (
            <PageContentSkeleton />
          ) : (
            <div className="flex flex-col w-full min-w-0 max-w-[1136px] 2xl:max-w-[1400px] mx-auto">
              <PageHeader 
                title={activePageInfo.title} 
                actions={null}
              />
              <div className="grid grid-cols-1 w-full min-w-0">
                {platform === 'natli' ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to Nat Li Switch</h2>
                    <p className="text-gray-500">Select a menu item to get started.</p>
                  </div>
                ) : activeItem === 'dashboard' ? (
                  <Dashboard />
                ) : activeItem === 'invitations' ? (
                  <InvitationManager />
                ) : activeItem === 'registration-links' ? (
                  <RegistrationLinkManager />
                ) : activeItem === 'events' || activeItem === 'events-list' ? (
                  selectedEvent ? (
                    <EventDetailPage
                      event={selectedEvent}
                      onBack={() => setSelectedEvent(null)}
                      onUpdate={(updatedEvent) => {
                        setSelectedEvent(updatedEvent);
                        toast.success("Event updated successfully");
                      }}
                    />
                  ) : showEventForm ? (
                    <CreateEventForm 
                      onCancel={() => setShowEventForm(false)}
                      onSubmit={() => {
                        setShowEventForm(false);
                        setSelectedEvent(null);
                        toast.success("Event created successfully");
                      }}
                    />
                  ) : (
                    <EventsList 
                      onCreateEvent={() => {
                        setShowEventForm(true);
                        setSelectedEvent(null);
                      }}
                      onEventClick={(event) => {
                        setSelectedEvent(event);
                        setShowEventForm(false);
                      }}
                    />
                  )
                ) : (
                  <PagePlaceholder />
                )}
              </div>
            </div>
          )}
        </main>
        
        {/* DSL Button - Fixed to bottom left of the inset area, or viewport */}
        <div className="fixed bottom-[70px] left-4 z-50">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="fixed top-[-20px] left-[-20px] z-50 rounded-full shadow-lg h-12 w-12 p-0 opacity-0">
                <Palette className="h-6 w-6" />
                <span className="sr-only">Open Design System Library</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-full h-[90vh] overflow-hidden p-0">
               <div className="h-full overflow-y-auto">
                 <div className="sr-only">
                   <DialogTitle>Design System Library</DialogTitle>
                   <DialogDescription>Browse the component library and design guidelines.</DialogDescription>
                 </div>
                 <StyleGuide />
               </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}