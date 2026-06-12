import { AppSidebar } from './components/AppSidebar';

import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
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

const Dashboard = lazy(() => import('./components/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const CreateEventForm = lazy(() => import('./components/events/CreateEventForm').then(m => ({ default: m.CreateEventForm })));
const EventDetailPage = lazy(() => import('./components/events/EventDetailPage').then(m => ({ default: m.EventDetailPage })));
const EventsList = lazy(() => import('./components/events/EventsList').then(m => ({ default: m.EventsList })));
const InvitationManager = lazy(() => import('./components/invitations/InvitationManager').then(m => ({ default: m.InvitationManager })));
const RegistrationLinkManager = lazy(() => import('./components/registration-links/RegistrationLinkManager').then(m => ({ default: m.RegistrationLinkManager })));
const NatliDashboard = lazy(() => import('./components/natli-dashboard/NatliDashboard').then(m => ({ default: m.NatliDashboard })));
const NatliSettingsPage = lazy(() => import('./components/natli-settings/NatliSettingsPage').then(m => ({ default: m.NatliSettingsPage })));
const NatliSkillsPage = lazy(() => import('./components/natli-skills/NatliSkillsPage').then(m => ({ default: m.NatliSkillsPage })));
const NatliSchedulerPage = lazy(() => import('./components/natli-scheduler/NatliSchedulerPage').then(m => ({ default: m.NatliSchedulerPage })));
const ModelTab = lazy(() => import('./components/natli-dashboard/model/ModelTab').then(m => ({ default: m.ModelTab })));

function PageLoader() {
  return <div className="py-10 text-sm text-muted-foreground">Loading…</div>;
}

// ─── Theme Hook ──────────────────────────────────────────────
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark');
  });

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
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>
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