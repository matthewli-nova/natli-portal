import { CreateEventForm } from './components/events/CreateEventForm';
import { EventDetailPage } from './components/events/EventDetailPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { EventsList } from './components/events/EventsList';
import { InvitationManager } from './components/invitations/InvitationManager';
import { RegistrationLinkManager } from './components/registration-links/RegistrationLinkManager';
import { NatliSettingsPage } from './components/natli-settings/NatliSettingsPage';
import { NatliDashboard } from './components/natli-dashboard/NatliDashboard';
import { NatliSkillsPage } from './components/natli-skills/NatliSkillsPage';
import { NatliSchedulerPage } from './components/natli-scheduler/NatliSchedulerPage';
import { ModelTab } from './components/natli-dashboard/model/ModelTab';
import { AppSidebar } from './components/AppSidebar';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from './components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './components/ui/tooltip';
import { Moon, Sun } from 'lucide-react';
import { PortalHeader } from './components/PortalHeader';
import { HeaderSlotProvider } from './lib/header-slot-context';
import { SSEProvider, useSSEContext } from './lib/sse-context';
import { PageHeader } from './components/PageHeader';
import { PagePlaceholder } from './components/PagePlaceholder';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { type B2BEvent } from './components/data/b2b-events';
import { menuItems, natliMenuItems, workMenuItems } from './lib/menu-data';

// ─── Theme Hook ──────────────────────────────────────────────
function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Initialise from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setIsDark(true);
    else if (saved === 'light') setIsDark(false);
  }, []);

  return { isDark, toggle: () => setIsDark(d => !d) };
}

// ─── App Shell (needs to be inside SSEProvider) ───────────────
function AppShell() {
  const [activeItem, setActiveItem] = useState('natli-dashboard');
  const [openMenus, setOpenMenus] = useState<string[]>(['products']);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<B2BEvent | null>(null);
  const [platform, setPlatform] = useState<'natli' | 'work' | 'template'>('natli');
  const { connected: sseConnected } = useSSEContext();
  const { isDark, toggle: toggleTheme } = useTheme();

  const handlePlatformSwitch = useCallback((p: 'natli' | 'work' | 'template') => {
    setPlatform(p);
    const defaultItem = p === 'natli' ? 'natli-dashboard' : p === 'work' ? 'work-dashboard' : 'dashboard';
    setActiveItem(defaultItem);
  }, []);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNavigate = (id: string) => {
    setActiveItem(id);
    setShowEventForm(false);
  };

  // Find the current page info based on activeItem
  const activePageInfo = useMemo(() => {
    // Check Nat Li menu items
    const natliItem = natliMenuItems.find(item => item.id === activeItem);
    if (natliItem) {
      return {
        title: natliItem.label,
        breadcrumbs: [{ label: natliItem.label, active: true }]
      };
    }

    // Check Work menu items
    const workItem = workMenuItems.find(item => item.id === activeItem);
    if (workItem) {
      return {
        title: workItem.label,
        breadcrumbs: [{ label: 'Work', href: '#' }, { label: workItem.label, active: true }]
      };
    }

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
        isLoading={false}
        platform={platform}
        setPlatform={handlePlatformSwitch}
        sseConnected={sseConnected}
        theme={isDark ? 'dark' : 'light'}
      />
      <SidebarInset>
        <HeaderSlotProvider>
        <PortalHeader
          breadcrumbs={activePageInfo.breadcrumbs}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
        <main className="flex-1 p-6 relative min-w-0 w-full overflow-y-auto">
            <div className="flex flex-col w-full min-w-0 max-w-[1136px] 2xl:max-w-[1400px] mx-auto">
              <PageHeader
                title={activePageInfo.title}
                actions={null}
              />
              <div className="grid grid-cols-1 w-full min-w-0">
                {platform === 'natli' && activeItem === 'natli-dashboard' ? (
                  <NatliDashboard />
                ) : platform === 'natli' && activeItem === 'natli-settings' ? (
                  <NatliSettingsPage />
                ) : platform === 'natli' && activeItem === 'natli-skills' ? (
                  <NatliSkillsPage />
                ) : platform === 'natli' && activeItem === 'natli-scheduler' ? (
                  <NatliSchedulerPage />
                ) : platform === 'natli' && activeItem === 'natli-model' ? (
                  <ModelTab />
                ) : platform === 'natli' ? (
                  <PagePlaceholder />
                ) : platform === 'work' ? (
                  <PagePlaceholder message="Work platform — coming soon" />
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
        </main>
        </HeaderSlotProvider>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

// ─── App Root (provides SSEProvider) ─────────────────────────
export default function App() {
  return (
    <SSEProvider>
      <AppShell />
    </SSEProvider>
  );
}