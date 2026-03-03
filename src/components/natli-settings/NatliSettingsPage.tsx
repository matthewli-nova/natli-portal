import { useState } from 'react';
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
} from 'lucide-react';
import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

type SettingCategory = 'all' | 'core' | 'integration' | 'security';

interface SettingCardData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: SettingCategory[];
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

function SettingCard({ item }: { item: SettingCardData }) {
  const Icon = item.icon;

  return (
    <Card className="group relative flex flex-col p-5 hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
          <Icon className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors">
          Configure
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Card>
  );
}

export function NatliSettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredCards = activeTab === 'all'
    ? settingsCards
    : settingsCards.filter(card => card.category.includes(activeTab as SettingCategory));

  return (
    <div className="flex-1 space-y-6 min-w-0 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="core">Core AI Setup</TabsTrigger>
          <TabsTrigger value="integration">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((item) => (
              <SettingCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
