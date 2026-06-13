import { AppSidebar } from './components/AppSidebar';

import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { SidebarProvider, SidebarInset } from './components/ui/sidebar';
import { Sparkles, Clock } from 'lucide-react';
import { PortalHeader } from './components/PortalHeader';
import { PortalPage } from './lib/portal-ui';
import { HeaderSlotProvider } from './lib/header-slot-context';
import { SSEProvider, useSSEContext } from './lib/sse-context';
import { PagePlaceholder } from './components/PagePlaceholder';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { type B2BEvent } from './components/data/b2b-events';
import { menuItems, natliMenuItems, workMenuItems } from './lib/menu-data';

// ─── Commerce / template platform (legacy Lepōs POS) ─────────
const Dashboard = lazy(() => import('./components/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const CreateEventForm = lazy(() => import('./components/events/CreateEventForm').then(m => ({ default: m.CreateEventForm })));
const EventDetailPage = lazy(() => import('./components/events/EventDetailPage').then(m => ({ default: m.EventDetailPage })));
const EventsList = lazy(() => import('./components/events/EventsList').then(m => ({ default: m.EventsList })));
const InvitationManager = lazy(() => import('./components/invitations/InvitationManager').then(m => ({ default: m.InvitationManager })));
const RegistrationLinkManager = lazy(() => import('./components/registration-links/RegistrationLinkManager').then(m => ({ default: m.RegistrationLinkManager })));

// ─── Hermes Claw (Agent) portal pages ────────────────────────
const NatliDashboard = lazy(() => import('./components/natli-dashboard/NatliDashboard').then(m => ({ default: m.NatliDashboard })));
const SessionsPage = lazy(() => import('./components/natli-dashboard/pages/PortalPages').then(m => ({ default: m.SessionsPage })));
const ModelsTokensPage = lazy(() => import('./components/natli-dashboard/pages/PortalPages').then(m => ({ default: m.ModelsTokensPage })));
const SkillsPortalPage = lazy(() => import('./components/natli-dashboard/pages/PortalPages').then(m => ({ default: m.SkillsPortalPage })));
const MemoryWikiPage = lazy(() => import('./components/natli-dashboard/pages/MemoryWikiPage').then(m => ({ default: m.MemoryWikiPage })));
const DocumentsPage = lazy(() => import('./components/natli-dashboard/pages/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const NatliSchedulerPage = lazy(() => import('./components/natli-scheduler/NatliSchedulerPage').then(m => ({ default: m.NatliSchedulerPage })));
const NatliSettingsPage = lazy(() => import('./components/natli-settings/NatliSettingsPage').then(m => ({ default: m.NatliSettingsPage })));
const ManageKeysPage = lazy(() => import('./components/natli-settings/ManageKeysPage').then(m => ({ default: m.ManageKeysPage })));

// ─── Work platform pages ─────────────────────────────────────
const WorkTasksPage = lazy(() => import('./components/natli-work/WorkTasksPage').then(m => ({ default: m.WorkTasksPage })));

// ─── Floating chat assistant (global on Agent platform) ──────
const QuickChatPanel = lazy(() => import('./components/natli-dashboard/chat/QuickChatPanel').then(m => ({ default: m.QuickChatPanel })));

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

  return { isDark, toggle: () => setIsDark(d => !d) };
}

// ─── App Shell (needs to be inside SSEProvider) ───────────────
function AppShell() {
  const [activeItem, setActiveItem] = useState('natli-dashboard');
  const [openMenus, setOpenMenus] = useState<string[]>(['products']);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<B2BEvent | null>(null);
  const [platform, setPlatform] = useState<'natli' | 'work' | 'template'>('natli');
  const [chatOpen, setChatOpen] = useState(false);
  const { connected: sseConnected } = useSSEContext();
  const { isDark, toggle: toggleTheme } = useTheme();

  const handlePlatformSwitch = useCallback((p: 'natli' | 'work' | 'template') => {
    setPlatform(p);
    const defaultItem = p === 'natli' ? 'natli-dashboard' : p === 'work' ? 'work-tasks' : 'dashboard';
    setActiveItem(defaultItem);
  }, []);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleNavigate = useCallback((id: string) => {
    setActiveItem(id);
    setShowEventForm(false);
  }, []);

  // Find the current page info based on activeItem (breadcrumbs)
  const activePageInfo = useMemo(() => {
    const natliItem = natliMenuItems.find(item => item.id === activeItem);
    if (natliItem) {
      return { title: natliItem.label, breadcrumbs: [{ label: 'Hermes Claw', href: '#' }, { label: natliItem.label, active: true }] };
    }
    const workItem = workMenuItems.find(item => item.id === activeItem);
    if (workItem) {
      return { title: workItem.label, breadcrumbs: [{ label: 'Work', href: '#' }, { label: workItem.label, active: true }] };
    }
    const topItem = menuItems.find(item => item.id === activeItem);
    if (topItem) {
      return { title: topItem.label, breadcrumbs: [{ label: topItem.label, active: true }] };
    }
    for (const item of menuItems) {
      if (item.subItems) {
        const subItem = item.subItems.find(sub => sub.id === activeItem);
        if (subItem) {
          return { title: subItem.label, breadcrumbs: [{ label: item.label, href: '#' }, { label: subItem.label, active: true }] };
        }
      }
    }
    return { title: 'Dashboard', breadcrumbs: [{ label: 'Dashboard', active: true }] };
  }, [activeItem]);

  // ─── Page router ───────────────────────────────────────────
  const page = (() => {
    if (platform === 'natli') {
      switch (activeItem) {
        case 'natli-dashboard': return <NatliDashboard onNavigate={handleNavigate} />;
        case 'natli-sessions': return <SessionsPage />;
        case 'natli-model': return <ModelsTokensPage />;
        case 'natli-scheduler': return (
          <PortalPage icon={Clock} title="Scheduler" subtitle="Cron jobs, run history, and token spend per job">
            <NatliSchedulerPage />
          </PortalPage>
        );
        case 'natli-skills': return <SkillsPortalPage />;
        case 'natli-memory': return <MemoryWikiPage />;
        case 'natli-documents': return <DocumentsPage />;
        case 'natli-api': return <ManageKeysPage />;
        case 'natli-settings': return <NatliSettingsPage />;
        default: return <PagePlaceholder />;
      }
    }
    if (platform === 'work') {
      if (activeItem === 'work-tasks') return <WorkTasksPage />;
      return <PagePlaceholder message="Work platform — coming soon" />;
    }
    // template / commerce
    switch (activeItem) {
      case 'dashboard': return <Dashboard />;
      case 'invitations': return <InvitationManager />;
      case 'registration-links': return <RegistrationLinkManager />;
      case 'events':
      case 'events-list':
        return selectedEvent ? (
          <EventDetailPage
            event={selectedEvent}
            onBack={() => setSelectedEvent(null)}
            onUpdate={(updatedEvent) => { setSelectedEvent(updatedEvent); toast.success('Event updated successfully'); }}
          />
        ) : showEventForm ? (
          <CreateEventForm
            onCancel={() => setShowEventForm(false)}
            onSubmit={() => { setShowEventForm(false); setSelectedEvent(null); toast.success('Event created successfully'); }}
          />
        ) : (
          <EventsList
            onCreateEvent={() => { setShowEventForm(true); setSelectedEvent(null); }}
            onEventClick={(event) => { setSelectedEvent(event); setShowEventForm(false); }}
          />
        );
      default: return <PagePlaceholder />;
    }
  })();

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
          <PortalHeader breadcrumbs={activePageInfo.breadcrumbs} isDark={isDark} onToggleTheme={toggleTheme} />
          <main className="app-bg relative min-w-0 w-full flex-1 overflow-y-auto scroll-slim p-5 xl:p-8">
            <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col 2xl:max-w-[1440px]">
              <Suspense fallback={<PageLoader />}>{page}</Suspense>
            </div>

            {/* Floating chat assistant — Agent platform only */}
            {platform === 'natli' && (
              <>
                <button
                  onClick={() => setChatOpen(true)}
                  className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-lepos-cyan-dark text-[#04222f] shadow-lg shadow-secondary/30 ring-1 ring-secondary/40 transition-transform hover:scale-105"
                  title="Chat with Nat Lee"
                  aria-label="Chat with Nat Lee"
                >
                  <Sparkles className="h-5 w-5" />
                </button>
                <Suspense fallback={null}>
                  <QuickChatPanel open={chatOpen} onClose={() => setChatOpen(false)} activeTab={activeItem} />
                </Suspense>
              </>
            )}
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
