// SkillEditor.tsx
// Markdown editor for modifying a skill's SKILL.md file
// In production: connects to backend API to read/write file content

import { useState, useEffect } from 'react';
import { Save, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { type Skill } from './skills-data';

interface SkillEditorProps {
  skill: Skill;
  onSave: () => void;
  onCancel: () => void;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function SkillEditor({ skill, onSave, onCancel }: SkillEditorProps) {
  const [content, setContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [isDirty, setIsDirty] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Load content on mount / skill change
  useEffect(() => {
    setLoading(true);
    setSaveState('idle');
    setIsDirty(false);

    fetch(`/api/skills/${skill.id}/content`)
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);
        return r.json() as Promise<{ content: string }>;
      })
      .then(data => {
        setContent(data.content);
        setOriginalContent(data.content);
        setLineCount(data.content.split('\n').length);
        setCharCount(data.content.length);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to template if file not readable
        const fallback = generateEditableContent(skill);
        setContent(fallback);
        setOriginalContent(fallback);
        setLineCount(fallback.split('\n').length);
        setCharCount(fallback.length);
        setLoading(false);
      });
  }, [skill.id]);

  const handleChange = (value: string) => {
    setContent(value);
    setIsDirty(value !== originalContent);
    setLineCount(value.split('\n').length);
    setCharCount(value.length);
    if (saveState === 'saved') setSaveState('idle');
  };

  const handleSave = async () => {
    setSaveState('saving');
    try {
      const r = await fetch(`/api/skills/${skill.id}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);
      setOriginalContent(content);
      setIsDirty(false);
      setSaveState('saved');
      setTimeout(() => onSave(), 600);
    } catch (err) {
      setSaveState('error');
    }
  };

  const handleDiscard = () => {
    if (isDirty && !confirm('Discard unsaved changes?')) return;
    onCancel();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Loading skill file...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Editor Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b gap-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <code className="bg-muted px-2 py-0.5 rounded text-xs">{skill.path}</code>
          <span>{lineCount} lines · {charCount} chars</span>
          {isDirty && (
            <span className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="w-3 h-3" />
              Unsaved changes
            </span>
          )}
          {saveState === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle className="w-3 h-3" />
              Saved
            </span>
          )}
          {saveState === 'error' && (
            <span className="text-red-600">Save failed — try again</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDiscard}
            className="flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            {isDirty ? 'Discard' : 'Cancel'}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || saveState === 'saving'}
            className="flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            {saveState === 'saving' ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* ── Editor Tips ─────────────────────────────────────────────── */}
      <div className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 border-b text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
        <span>✏️</span>
        <span>
          Editing <strong>{skill.name}</strong> SKILL.md — this is a custom skill.
          Changes write directly to the filesystem and take effect immediately.
        </span>
      </div>

      {/* ── Textarea Editor ─────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={e => handleChange(e.target.value)}
          spellCheck={false}
          className={`
            w-full h-full resize-none outline-none p-4 font-mono text-xs leading-relaxed
            bg-background text-foreground
            border-0 focus:ring-0
            ${saveState === 'error' ? 'border-l-2 border-red-500' : ''}
          `}
          style={{ minHeight: '500px', tabSize: 2 }}
          placeholder="# Skill Name&#10;&#10;## Overview&#10;..."
        />

        {/* Line numbers overlay — simple version */}
        <div
          className="absolute left-0 top-0 bottom-0 w-8 bg-muted/30 border-r
                     text-muted-foreground text-xs font-mono select-none
                     flex flex-col items-end pr-1.5 py-4 overflow-hidden pointer-events-none"
          style={{ lineHeight: '1.5rem' }}
        >
          {Array.from({ length: Math.min(lineCount, 80) }, (_, i) => (
            <span key={i} className="block leading-5 text-right w-full">
              {i + 1}
            </span>
          ))}
        </div>
      </div>

      {/* ── Status Bar ─────────────────────────────────────────────── */}
      <div className="px-4 py-1.5 border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
        <span>Markdown · UTF-8</span>
        <span>{isDirty ? '● Modified' : '○ Saved'}</span>
      </div>
    </div>
  );
}

// ── Mock content generator (replace with API) ─────────────────────────────────

function generateEditableContent(skill: Skill): string {
  return `# ${skill.emoji} ${skill.name}

**Version:** ${skill.version ?? '1.0'}
**Last Updated:** ${new Date().toISOString().split('T')[0]}
**Tags:** ${skill.tags.join(', ')}

---

## Overview

${skill.description}

---

## Contract

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| \`input\` | string | ✅ | — | Primary input for the skill |

### Output

Returns the result of the ${skill.name} operation.

### Errors

| Code | Condition | Recovery |
|------|-----------|---------|
| ERR_001 | Missing required parameter | Check parameter docs |
| ERR_002 | Service unavailable | Retry after 30s |

### Example

\`\`\`
Example usage of ${skill.name}
\`\`\`

---

## Instructions

1. Load this skill by referencing its SKILL.md
2. Follow the contract parameters exactly
3. Handle errors gracefully using the error table above

---

## Notes

- Category: ${skill.category}
- Type: ${skill.type}
- Contract: ${skill.hasContract ? '✅ Complete' : '⚠️ Incomplete'}

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | ${skill.addedDate ?? new Date().toISOString().split('T')[0]} | Initial creation |
`;
}
