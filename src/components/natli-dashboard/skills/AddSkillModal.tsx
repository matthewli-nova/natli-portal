// AddSkillModal.tsx
// Dialog for creating a new custom skill — generates SKILL.md from template

import { useState } from 'react';
import { X, Plus, Wand2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { type Skill, type SkillCategory, SKILL_CATEGORIES, generateSkillTemplate } from './skills-data';

interface AddSkillModalProps {
  onClose: () => void;
  onCreated: (skill: Skill) => void;
}

type CreateState = 'idle' | 'creating' | 'done' | 'error';

export function AddSkillModal({ onClose, onCreated }: AddSkillModalProps) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🛠️');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Business Operations');
  const [tags, setTags] = useState('');
  const [createState, setCreateState] = useState<CreateState>('idle');
  const [error, setError] = useState('');

  const isValid = name.trim().length >= 2 && description.trim().length >= 10;

  const skillId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const skillPath = `skills/skills/${skillId}/SKILL.md`;

  const handleCreate = async () => {
    if (!isValid) return;
    setCreateState('creating');
    setError('');

    try {
      const template = generateSkillTemplate(name.trim(), description.trim());
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

      const r = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: skillId, name: name.trim(), emoji,
          description: description.trim(), category,
          tags: tagList, content: template,
        }),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);

      const newSkill: Skill = {
        id: skillId,
        name: name.trim(),
        emoji,
        description: description.trim(),
        path: skillPath,
        type: 'custom',
        category,
        status: 'needs-setup',
        tags: tagList.length > 0 ? tagList : [skillId],
        hasContract: false,
        addedDate: new Date().toISOString().split('T')[0],
        version: '1.0',
      };

      setCreateState('done');
      setTimeout(() => onCreated(newSkill), 500);
    } catch (err) {
      setCreateState('error');
      setError('Failed to create skill. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border rounded-xl shadow-2xl w-full max-w-lg mx-4">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <h2 className="font-semibold text-sm">New Skill</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Form ───────────────────────────────────────────────── */}
        <div className="px-5 py-4 space-y-4">

          {/* Emoji + Name */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Skill Name *
            </label>
            <div className="flex gap-2">
              <Input
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                className="w-14 text-center text-lg"
                maxLength={2}
                placeholder="🛠️"
              />
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Salesforce, Notion, Custom Tool"
                className="flex-1"
              />
            </div>
            {name && (
              <p className="text-xs text-muted-foreground mt-1">
                ID: <code className="bg-muted px-1 rounded">{skillId}</code>
                {' · '}
                Path: <code className="bg-muted px-1 rounded text-xs">{skillPath}</code>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Description * <span className="text-muted-foreground font-normal">(what triggers this skill?)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Automate Salesforce CRM — create leads, update opportunities, generate reports"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-primary/30"
              rows={3}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Category *
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_CATEGORIES.filter(c => c !== 'System').map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs py-1 px-3 rounded-full font-medium transition-colors ${
                    category === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Tags <span className="font-normal">(comma separated)</span>
            </label>
            <Input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. crm, salesforce, leads, automation"
            />
          </div>

          {/* Template preview */}
          <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 mb-1 font-medium">
              <Wand2 className="w-3.5 h-3.5" />
              Auto-generated from template:
            </div>
            <ul className="space-y-0.5 ml-4 list-disc">
              <li>SKILL.md with Overview, Contract, Instructions sections</li>
              <li>Saved to <code className="bg-muted px-1 rounded">{skillPath || 'skills/skills/{id}/SKILL.md'}</code></li>
              <li>Added to SKILLS-REGISTRY.md</li>
              <li>Status: <span className="text-amber-600 font-medium">Needs Setup</span> (edit to complete)</li>
            </ul>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleCreate}
            disabled={!isValid || createState === 'creating' || createState === 'done'}
            className="flex items-center gap-1.5"
          >
            {createState === 'creating' && <span className="animate-spin">⏳</span>}
            {createState === 'done' && '✓'}
            {createState === 'idle' && <Plus className="w-3.5 h-3.5" />}
            {createState === 'creating' ? 'Creating...' : createState === 'done' ? 'Created!' : 'Create Skill'}
          </Button>
        </div>
      </div>
    </div>
  );
}
