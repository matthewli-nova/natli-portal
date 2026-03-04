import { useState, useEffect } from 'react';
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
  ArrowRight,
  Save,
  ChevronDown,
  Loader2,
  Check,
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
import { toast } from 'sonner';

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

function SettingCard({ item, isExpanded, onToggle }: {
  item: SettingCardData;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;

  return (
    <Card
      className={`group relative flex flex-col p-5 hover:shadow-md transition-shadow cursor-pointer ${
        isExpanded ? 'border-[#31D7DB]/50 shadow-md ring-1 ring-[#31D7DB]/20' : 'border-[#023F59]/20'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#023F59]/10">
          <Icon className="h-5 w-5 text-[#31D7DB]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#21262A] mb-1">{item.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
        </div>
        {item.id === 'ai-model' && (
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        )}
      </div>
      {item.id !== 'ai-model' && (
        <div className="mt-4 pt-3 border-t border-[#023F59]/10">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#107DAC] group-hover:text-[#28BDC1] transition-colors">
            Configure
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      )}
    </Card>
  );
}

function AIModelConfigPanel() {
  const [config, setConfig] = useState<ModelConfig | null>(null);
  const [primary, setPrimary] = useState('');
  const [fallback0, setFallback0] = useState('');
  const [fallback1, setFallback1] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/config/model')
      .then(r => r.json())
      .then((data: ModelConfig) => {
        setConfig(data);
        setPrimary(data.primary);
        setFallback0(data.fallbacks[0] ?? '');
        setFallback1(data.fallbacks[1] ?? '');
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const fallbacks = [fallback0, fallback1].filter(Boolean);
      const res = await fetch('/api/config/model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primary, fallbacks }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Model configuration saved');
    } catch {
      toast.error('Failed to save model configuration');
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-[#31D7DB]" />
      </div>
    );
  }

  const models = config?.availableModels ?? [];
  const resolveLabel = (id: string) => models.find(m => m.id === id)?.label ?? id;

  return (
    <Card className="border-[#31D7DB]/30 bg-gradient-to-br from-[#023F59]/5 to-transparent" onClick={e => e.stopPropagation()}>
      <div className="p-5 space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#023F59]/10">
            <BrainCircuit className="h-5 w-5 text-[#31D7DB]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#21262A]">Model Configuration</h4>
            <p className="text-xs text-muted-foreground">
              Current: <span className="text-[#107DAC] font-medium">{resolveLabel(primary)}</span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#21262A]">Primary Model</label>
            <Select value={primary} onValueChange={setPrimary}>
              <SelectTrigger className="border-[#023F59]/20 focus:ring-[#31D7DB]/30">
                <SelectValue placeholder="Select primary model" />
              </SelectTrigger>
              <SelectContent>
                {models.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <span>{m.label}</span>
                      <span className="text-xs text-muted-foreground">({m.alias})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#21262A]">Failover Model 1</label>
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
                      <span className="text-xs text-muted-foreground">({m.alias})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#21262A]">Failover Model 2</label>
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
                      <span className="text-xs text-muted-foreground">({m.alias})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#023F59]/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="w-3 h-3 text-[#31D7DB]" />
            <span>Changes saved to openclaw.json</span>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#023F59] hover:bg-[#022F44] text-white"
            size="sm"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function NatliSettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const filteredCards = activeTab === 'all'
    ? settingsCards
    : settingsCards.filter(card => card.category.includes(activeTab as SettingCategory));

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
              <div key={item.id} className={item.id === 'ai-model' && expandedCard === 'ai-model' ? 'col-span-full' : ''}>
                <SettingCard
                  item={item}
                  isExpanded={expandedCard === item.id}
                  onToggle={() => {
                    if (item.id === 'ai-model') {
                      setExpandedCard(expandedCard === 'ai-model' ? null : 'ai-model');
                    }
                  }}
                />
                {item.id === 'ai-model' && expandedCard === 'ai-model' && (
                  <div className="mt-3">
                    <AIModelConfigPanel />
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
