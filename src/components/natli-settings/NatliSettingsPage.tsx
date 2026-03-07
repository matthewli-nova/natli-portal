import { useState, useEffect, useCallback } from 'react';
import {
  Bot,
  BrainCircuit,
  BookOpen,
  KeyRound,
  MessageSquareText,
  Workflow,
  DatabaseZap,
  ShieldCheck,
  Activity,
  Bell,
  Lock,
  Puzzle,
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  Check,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import { ManageKeysPage } from './ManageKeysPage';

type SettingCategory = 'all' | 'core' | 'integration' | 'security';

interface SettingCardData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: SettingCategory[];
}

interface AvailableModel {
  id: string;
  alias: string;
  label: string;
}

interface ModelConfig {
  primary: string;
  fallbacks: string[];
  availableModels: AvailableModel[];
}

const settingsCards: SettingCardData[] = [
  {
    id: 'ai-model',
    title: 'AI Model Configuration',
    description: 'Select and configure AI models, adjust temperature, token limits, and response parameters.',
    icon: BrainCircuit,
    category: ['core'],
  },
  {
    id: 'agent-behavior',
    title: 'Agent Personality & Behavior',
    description: 'Define agent tone, persona, instructions, and default behavioral guidelines.',
    icon: Bot,
    category: ['core'],
  },
  {
    id: 'knowledge-base',
    title: 'Knowledge Base',
    description: 'Upload documents, manage vector stores, and configure retrieval-augmented generation (RAG).',
    icon: BookOpen,
    category: ['core'],
  },
  {
    id: 'prompt-templates',
    title: 'Prompt Templates',
    description: 'Create and manage reusable prompt templates for common agent tasks and workflows.',
    icon: MessageSquareText,
    category: ['core'],
  },
  {
    id: 'api-keys',
    title: 'API Keys & Credentials',
    description: 'Manage API keys for OpenAI, Anthropic, and other LLM providers securely.',
    icon: KeyRound,
    category: ['integration'],
  },
  {
    id: 'integrations',
    title: 'Third-Party Integrations',
    description: 'Connect external tools like Slack, email, CRM, and other services to your agents.',
    icon: Puzzle,
    category: ['integration'],
  },
  {
    id: 'workflow-builder',
    title: 'Workflow & Automation',
    description: 'Build multi-step agent workflows, set triggers, and automate repetitive tasks.',
    icon: Workflow,
    category: ['integration'],
  },
  {
    id: 'context-memory',
    title: 'Context & Memory',
    description: 'Configure conversation memory, context windows, and long-term knowledge retention.',
    icon: DatabaseZap,
    category: ['core'],
  },
  {
    id: 'access-permissions',
    title: 'Access & Permissions',
    description: 'Control user roles, agent access levels, and team-based permission policies.',
    icon: ShieldCheck,
    category: ['security'],
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Analytics',
    description: 'Track agent performance, usage metrics, response quality, and cost analytics.',
    icon: Activity,
    category: ['integration'],
  },
  {
    id: 'notifications',
    title: 'Notification Settings',
    description: 'Configure alerts for agent errors, usage thresholds, and important system events.',
    icon: Bell,
    category: ['security'],
  },
  {
    id: 'data-privacy',
    title: 'Data Privacy & Compliance',
    description: 'Manage data retention policies, PII handling, audit logs, and compliance settings.',
    icon: Lock,
    category: ['security'],
  },
];

function SettingCard({ item, onClick }: {
  item: SettingCardData;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <Card
      className="group relative flex flex-col p-5 hover:shadow-md hover:border-[#31D7DB]/50 transition-all cursor-pointer border-[#023F59]/20"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#023F59]/10">
          <Icon className="h-5 w-5 text-[#31D7DB]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#21262A] mb-1">{item.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#023F59]/10">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#107DAC] group-hover:text-[#28BDC1] transition-colors">
          Configure
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Card>
  );
}

// ─── AI Model Configuration Detail Page ─────────────────────

function AIModelDetailPage({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'config' | 'keys'>('config');
  const [config, setConfig] = useState<ModelConfig | null>(null);
  const [primary, setPrimary] = useState('');
  const [fallback0, setFallback0] = useState('');
  const [fallback1, setFallback1] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [refreshingModels, setRefreshingModels] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [restartDone, setRestartDone] = useState(false);

  const loadModelConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/config/model');
      const data: ModelConfig = await res.json();
      setConfig(data);
      setPrimary(data.primary);
      setFallback0(data.fallbacks[0] ?? '');
      setFallback1(data.fallbacks[1] ?? '');
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => { loadModelConfig(); }, [loadModelConfig]);

  const handleRefreshModels = async () => {
    setRefreshingModels(true);
    await loadModelConfig();
    setRefreshingModels(false);
  };

  const handleSaveClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmSwitch = async () => {
    setShowConfirm(false);
    setSaving(true);
    try {
      const fallbacks = [fallback0, fallback1].filter(f => f && f !== 'none');
      const res = await fetch('/api/config/model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primary, fallbacks }),
      });
      if (!res.ok) throw new Error('Failed to save');

      // Fire restart
      await fetch('/api/config/restart', { method: 'POST' });
      toast.success('Model switched. Server restarting...');

      // Show restarting overlay
      setRestarting(true);
      setSaving(false);

      setTimeout(() => {
        setRestarting(false);
        setRestartDone(true);
        toast.success('Server restarted. New model active.');
        setTimeout(() => setRestartDone(false), 3000);
      }, 5000);
    } catch {
      toast.error('Failed to save model configuration');
      setSaving(false);
    }
  };

  if (view === 'keys') {
    return <ManageKeysPage onBack={() => setView('config')} />;
  }

  if (!loaded) {
    return (
      <div className="space-y-4">
        <BackButton onBack={onBack} />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#31D7DB]" />
        </div>
      </div>
    );
  }

  const models = config?.availableModels ?? [];
  const resolveLabel = (id: string) => models.find(m => m.id === id)?.label ?? id;

  return (
    <div className="space-y-4">
      <BackButton onBack={onBack} />

      {/* Restart overlay */}
      {restarting && (
        <Card className="border-[#31D7DB]/30 bg-gradient-to-r from-[#023F59]/5 to-[#31D7DB]/5">
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[#31D7DB]" />
            <span className="text-sm font-medium text-[#107DAC]">Server restarting...</span>
          </div>
        </Card>
      )}

      {restartDone && (
        <Card className="border-emerald-300 bg-emerald-50">
          <div className="flex items-center justify-center gap-3 py-4">
            <Check className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Server restarted. New model active.</span>
          </div>
        </Card>
      )}

      {/* Header */}
      <Card className="border-[#31D7DB]/30 bg-gradient-to-br from-[#023F59]/5 to-transparent">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#023F59]/10">
                <BrainCircuit className="h-6 w-6 text-[#31D7DB]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#21262A]">AI Model Configuration</h2>
                <p className="text-sm text-muted-foreground">
                  Select and configure AI models for your agents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshModels}
                disabled={refreshingModels}
                className="border-[#023F59]/20 text-[#107DAC] hover:bg-[#023F59]/5"
                title="Refresh model list from system"
              >
                <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshingModels ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView('keys')}
                className="border-[#023F59]/20 text-[#107DAC] hover:bg-[#023F59]/5"
              >
                <KeyRound className="w-4 h-4 mr-1.5" />
                Manage Keys
              </Button>
            </div>
          </div>

          {/* Model selectors */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#21262A]">Primary Model</label>
              </div>
              <Select value={primary} onValueChange={setPrimary}>
                <SelectTrigger className="border-[#023F59]/20 focus:ring-[#31D7DB]/30">
                  <SelectValue placeholder="Select primary model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <span>{m.label}</span>
                        {m.alias && <span className="text-xs text-muted-foreground">({m.alias})</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#21262A]">Failover Model 1</label>
              <Select value={fallback0} onValueChange={setFallback0}>
                <SelectTrigger className="border-[#023F59]/20 focus:ring-[#31D7DB]/30">
                  <SelectValue placeholder="Select failover model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {models.filter(m => m.id !== primary).map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <span>{m.label}</span>
                        {m.alias && <span className="text-xs text-muted-foreground">({m.alias})</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#21262A]">Failover Model 2</label>
              <Select value={fallback1} onValueChange={setFallback1}>
                <SelectTrigger className="border-[#023F59]/20 focus:ring-[#31D7DB]/30">
                  <SelectValue placeholder="Select failover model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {models.filter(m => m.id !== primary && m.id !== fallback0).map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <span>{m.label}</span>
                        {m.alias && <span className="text-xs text-muted-foreground">({m.alias})</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center justify-between pt-4 border-t border-[#023F59]/10">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="w-3 h-3 text-[#31D7DB]" />
              <span>Changes saved to openclaw.json</span>
            </div>
            <Button
              onClick={handleSaveClick}
              disabled={saving || restarting}
              className="bg-[#023F59] hover:bg-[#022F44] text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Configuration
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Switch AI Model?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>You are applying the following model configuration changes:</p>
                <ul className="space-y-1 pl-2 border-l-2 border-[#31D7DB]">
                  <li>
                    <span className="text-[#21262A] font-medium">Primary: </span>
                    <span className="font-semibold text-[#107DAC]">{resolveLabel(primary) || '—'}</span>
                  </li>
                  <li>
                    <span className="text-[#21262A] font-medium">Failover 1: </span>
                    <span className="font-semibold text-[#107DAC]">{fallback0 && fallback0 !== 'none' ? resolveLabel(fallback0) : '(none)'}</span>
                  </li>
                  <li>
                    <span className="text-[#21262A] font-medium">Failover 2: </span>
                    <span className="font-semibold text-[#107DAC]">{fallback1 && fallback1 !== 'none' ? resolveLabel(fallback1) : '(none)'}</span>
                  </li>
                </ul>
                <p className="text-amber-600 font-medium">⚠ The OpenClaw server will restart automatically. Active sessions may be interrupted.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSwitch}
              className="bg-[#023F59] text-white hover:bg-[#022F44]"
            >
              Switch & Restart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Coming Soon Detail Page ────────────────────────────────

function ComingSoonDetailPage({ card, onBack }: { card: SettingCardData; onBack: () => void }) {
  const Icon = card.icon;

  return (
    <div className="space-y-4">
      <BackButton onBack={onBack} />

      <Card className="border-[#023F59]/25 shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#023F59]/10">
            <Icon className="h-8 w-8 text-[#31D7DB]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-[#21262A]">{card.title}</h2>
            <p className="text-sm text-muted-foreground max-w-md">{card.description}</p>
          </div>
          <div className="rounded-full bg-[#023F59]/10 px-4 py-1.5">
            <span className="text-xs font-medium text-[#107DAC]">Coming Soon</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Back Button ────────────────────────────────────────────

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onBack}
      className="text-[#107DAC] hover:text-[#023F59] hover:bg-[#023F59]/5 -ml-2"
    >
      <ArrowLeft className="w-4 h-4 mr-1.5" />
      Back to Settings
    </Button>
  );
}

// ─── Main Settings Page ─────────────────────────────────────

export function NatliSettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activePage, setActivePage] = useState<string | null>(null);

  const filteredCards = activeTab === 'all'
    ? settingsCards
    : settingsCards.filter(card => card.category.includes(activeTab as SettingCategory));

  // Detail page view
  if (activePage) {
    if (activePage === 'ai-model') {
      return (
        <div className="flex-1 min-w-0 w-full">
          <AIModelDetailPage onBack={() => setActivePage(null)} />
        </div>
      );
    }

    const card = settingsCards.find(c => c.id === activePage);
    if (card) {
      return (
        <div className="flex-1 min-w-0 w-full">
          <ComingSoonDetailPage card={card} onBack={() => setActivePage(null)} />
        </div>
      );
    }
  }

  // Grid view
  return (
    <div className="flex-1 space-y-4 min-w-0 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-[#023F59]/5">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#023F59] data-[state=active]:text-white">All</TabsTrigger>
          <TabsTrigger value="core" className="data-[state=active]:bg-[#023F59] data-[state=active]:text-white">Core AI Setup</TabsTrigger>
          <TabsTrigger value="integration" className="data-[state=active]:bg-[#023F59] data-[state=active]:text-white">Integrations</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#023F59] data-[state=active]:text-white">Security & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 w-full min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((item) => (
              <SettingCard
                key={item.id}
                item={item}
                onClick={() => setActivePage(item.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
