import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  ShieldCheck,
  KeyRound,
  Copy,
  Check,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { toast } from 'sonner';

interface ProviderKey {
  provider: string;
  label: string;
  keyPreview: string;
  keyLength: number;
  hasKey: boolean;
  managed?: boolean;
  updatedAt?: string | null;
}

function KeyCard({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: ProviderKey;
  onUpdate: () => void;
  onRemove: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const res = await fetch(`/api/config/keys/${entry.provider}/value`);
      if (!res.ok) throw new Error('Failed to fetch key');
      const { apiKey } = await res.json() as { apiKey: string };
      // Use clipboard API if available (HTTPS/localhost), fallback for HTTP LAN access
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(apiKey);
      } else {
        const el = document.createElement('textarea');
        el.value = apiKey;
        el.setAttribute('readonly', '');
        el.style.cssText = 'position:absolute;left:-9999px;top:-9999px';
        document.body.appendChild(el);
        el.select();
        el.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      toast.success('API key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy key');
    }
  };

  const formatUpdatedAt = (iso: string | null | undefined) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString('en-HK', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/config/keys/${entry.provider}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: editValue.trim() }),
      });
      if (!res.ok) throw new Error('Failed to update key');
      toast.success(`${entry.label} key updated`);
      setEditing(false);
      setEditValue('');
      onUpdate();
    } catch {
      toast.error('Failed to update key');
    }
    setSaving(false);
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      const res = await fetch(`/api/config/keys/${entry.provider}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove key');
      toast.success(`${entry.label} key removed`);
      setConfirmOpen(false);
      onRemove();
    } catch {
      toast.error('Failed to remove key');
    }
    setRemoving(false);
  };

  const maskedDisplay = entry.hasKey ? '••••••••...••••' : '(no key set)';
  const revealedDisplay = entry.keyPreview || '(no key set)';

  return (
    <Card className="border-[#023F59]/25 shadow-sm p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#21262A]">{entry.label}</h3>
            {entry.managed && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                System Managed
              </Badge>
            )}
          </div>

          {entry.managed ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-[#31D7DB]" />
              Configured via OpenClaw auth system
            </div>
          ) : editing ? (
            <div className="flex items-center gap-2 mt-2">
              <div className="relative flex-1">
                <Input
                  type={showEditPassword ? 'text' : 'password'}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Enter new API key"
                  className="pr-9 border-[#023F59]/20 focus-visible:ring-[#31D7DB]/30 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#107DAC]"
                >
                  {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={saving || !editValue.trim()}
                className="bg-[#023F59] text-white hover:bg-[#022F44]"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  setEditValue('');
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-mono text-muted-foreground tracking-wider">
                {revealed ? revealedDisplay : maskedDisplay}
              </p>
              {entry.updatedAt && (
                <p className="text-[11px] text-muted-foreground">
                  Last updated: {formatUpdatedAt(entry.updatedAt)}
                </p>
              )}
            </div>
          )}
        </div>

        {!entry.managed && !editing && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRevealed(!revealed)}
              className="h-8 w-8 p-0"
              title={revealed ? 'Hide' : 'View'}
              disabled={!entry.hasKey}
            >
              {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
              title="Copy full key"
              disabled={!entry.hasKey}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setEditing(true);
                setRevealed(false);
              }}
              className="h-8 w-8 p-0 bg-[#023F59] text-white hover:bg-[#022F44]"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Popover open={confirmOpen} onOpenChange={setConfirmOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  title="Remove"
                  disabled={!entry.hasKey}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-3" align="end">
                <p className="text-sm font-medium mb-2">Remove key?</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleRemove}
                    disabled={removing}
                    className="flex-1"
                  >
                    {removing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </Card>
  );
}

export function ManageKeysPage({ onBack }: { onBack: () => void }) {
  const [keys, setKeys] = useState<ProviderKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newProvider, setNewProvider] = useState('');
  const [newKey, setNewKey] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [adding, setAdding] = useState(false);

  const loadKeys = useCallback(async () => {
    try {
      const res = await fetch('/api/config/keys');
      const data = await res.json();
      setKeys(data.keys ?? []);
    } catch {
      toast.error('Failed to load API keys');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  const handleAddKey = async () => {
    if (!newProvider.trim() || !newKey.trim()) return;
    setAdding(true);
    try {
      const provider = newProvider.trim().toLowerCase().replace(/\s+/g, '-');
      const res = await fetch(`/api/config/keys/${provider}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newKey.trim() }),
      });
      if (!res.ok) throw new Error('Failed to add key');
      toast.success(`${newProvider.trim()} key added`);
      setNewProvider('');
      setNewKey('');
      setShowAdd(false);
      loadKeys();
    } catch {
      toast.error('Failed to add key');
    }
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-[#107DAC] hover:text-[#023F59] hover:bg-[#023F59]/5 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to AI Model Config
      </Button>

      <Card className="border-[#31D7DB]/30 bg-gradient-to-br from-[#023F59]/5 to-transparent">
        <div className="p-6 space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#023F59]/10">
              <KeyRound className="h-6 w-6 text-[#31D7DB]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#21262A]">API Keys</h2>
              <p className="text-sm text-muted-foreground">
                Manage API keys for AI model providers. Keys are stored securely in your OpenClaw config.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#31D7DB]" />
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((entry) => (
            <KeyCard
              key={entry.provider}
              entry={entry}
              onUpdate={loadKeys}
              onRemove={loadKeys}
            />
          ))}

          {showAdd ? (
            <Card className="border-[#31D7DB]/30 border-dashed p-4 space-y-3">
              <h3 className="text-sm font-semibold text-[#21262A]">Add New Key</h3>
              <div className="space-y-2">
                <Input
                  placeholder="Provider name (e.g. openrouter)"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  className="border-[#023F59]/20 focus-visible:ring-[#31D7DB]/30"
                />
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="API key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="pr-9 border-[#023F59]/20 focus-visible:ring-[#31D7DB]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#107DAC]"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddKey}
                  disabled={adding || !newProvider.trim() || !newKey.trim()}
                  className="bg-[#023F59] text-white hover:bg-[#022F44]"
                >
                  {adding ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Plus className="w-3.5 h-3.5 mr-1.5" />}
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowAdd(false);
                    setNewProvider('');
                    setNewKey('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowAdd(true)}
              className="w-full border-dashed border-[#023F59]/20 text-[#107DAC] hover:bg-[#023F59]/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Key
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
