// SkillViewer.tsx
// Renders SKILL.md content for a selected skill — shows metadata + markdown body

import { useState, useEffect } from 'react';
import { FileText, Tag, Calendar, Zap, ShieldCheck, ExternalLink } from 'lucide-react';
import { type Skill, CATEGORY_COLORS, STATUS_COLORS, STATUS_LABELS } from './skills-data';
import { Badge } from '../../ui/badge';

interface SkillViewerProps {
  skill: Skill;
}

export function SkillViewer({ skill }: SkillViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setContent(null);
    setError(null);
    setLoading(true);

    fetch(`/api/skills/${skill.id}/content`)
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);
        return r.json() as Promise<{ content: string }>;
      })
      .then(data => { setContent(data.content); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [skill.id]);

  return (
    <div className="flex flex-col h-full">

      {/* ── Metadata Bar ───────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b bg-muted/20 flex flex-wrap gap-3 text-xs text-muted-foreground">

        <div className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          <code className="text-xs bg-muted px-1 py-0.5 rounded">{skill.path}</code>
        </div>

        {skill.version && (
          <div className="flex items-center gap-1">
            v{skill.version}
          </div>
        )}

        {skill.addedDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Added {skill.addedDate}
          </div>
        )}

        {skill.lastUsed && (
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            Last used {skill.lastUsed}
            {skill.usageCount && <span>({skill.usageCount} total)</span>}
          </div>
        )}

        {skill.hasContract && (
          <div className="flex items-center gap-1 text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            Contract ✓
          </div>
        )}
      </div>

      {/* ── Tags ───────────────────────────────────────────────────── */}
      {skill.tags.length > 0 && (
        <div className="px-4 py-2 border-b flex items-center gap-1.5 flex-wrap">
          <Tag className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          {skill.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Loading skill file...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
            ⚠️ Could not load skill file: {error}
            <br />
            <code className="text-xs mt-1 block">{skill.path}</code>
          </div>
        )}

        {content && !loading && (
          <MarkdownRenderer content={content} />
        )}
      </div>
    </div>
  );
}

// ── Lightweight Markdown Renderer ─────────────────────────────────────────────
// Renders basic markdown — headers, bold, code, tables, lists
// Replace with react-markdown in production for full feature parity

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {lines.map((line, i) => {
        // H1
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
        }
        // H2
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-base font-semibold mt-5 mb-2 border-b pb-1">{line.slice(3)}</h2>;
        }
        // H3
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-sm font-semibold mt-3 mb-1">{line.slice(4)}</h3>;
        }
        // Horizontal rule
        if (line.startsWith('---')) {
          return <hr key={i} className="my-3 border-border" />;
        }
        // Table header separator — skip
        if (line.match(/^\|[-| ]+\|$/)) return null;
        // Table row
        if (line.startsWith('|')) {
          const cells = line.split('|').filter(Boolean).map(c => c.trim());
          return (
            <div key={i} className="flex gap-0 border-b text-xs">
              {cells.map((cell, j) => (
                <div key={j} className="flex-1 py-1.5 px-2 min-w-0">
                  <InlineMarkdown text={cell} />
                </div>
              ))}
            </div>
          );
        }
        // Code block (``` lines)
        if (line.startsWith('```')) {
          return null; // Handled as block below — simplified
        }
        // Bullet list
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 text-sm my-0.5">
              <span className="text-muted-foreground flex-shrink-0">•</span>
              <span><InlineMarkdown text={line.slice(2)} /></span>
            </div>
          );
        }
        // Numbered list
        if (line.match(/^\d+\. /)) {
          const num = line.match(/^(\d+)\. /)?.[1];
          return (
            <div key={i} className="flex gap-2 text-sm my-0.5">
              <span className="text-muted-foreground flex-shrink-0 w-4 text-right">{num}.</span>
              <span><InlineMarkdown text={line.replace(/^\d+\. /, '')} /></span>
            </div>
          );
        }
        // Bold metadata line (key: value)
        if (line.startsWith('**') && line.includes(':**')) {
          return (
            <p key={i} className="text-sm my-0.5">
              <InlineMarkdown text={line} />
            </p>
          );
        }
        // Empty line
        if (line.trim() === '') {
          return <div key={i} className="h-2" />;
        }
        // Default paragraph
        return (
          <p key={i} className="text-sm my-1 leading-relaxed">
            <InlineMarkdown text={line} />
          </p>
        );
      })}
    </div>
  );
}

// Handles **bold**, `code`, _italic_ inline
function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|_[^_]+_)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('_') && part.endsWith('_')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ── Mock Content (replace with API call in production) ────────────────────────

function MOCK_SKILL_CONTENT(skill: Skill): string {
  return `# ${skill.emoji} ${skill.name}

**Version:** ${skill.version ?? '1.0'}
**Type:** ${skill.type === 'custom' ? 'Custom Skill 🔧' : 'System Skill 🔒'}
**Status:** ${STATUS_LABELS[skill.status]}
**Category:** ${skill.category}
**Path:** \`${skill.path}\`
${skill.addedDate ? `**Added:** ${skill.addedDate}` : ''}
${skill.lastUsed ? `**Last Used:** ${skill.lastUsed} (${skill.usageCount ?? 0} total uses)` : ''}

---

## Overview

${skill.description}

---

## Tags

${skill.tags.map(t => `\`${t}\``).join(' · ')}

---

## Contract

${skill.hasContract
  ? `✅ This skill has a full contract specification with parameter tables, output specs, and examples.`
  : `⚠️ No contract defined yet. Run skill-creator to add one.`
}

---

## How to Trigger

This skill activates when Nat Lee detects requests related to:
${skill.tags.slice(0, 4).map(t => `- ${t}`).join('\n')}

---

> 💡 **Note:** This is a preview. Connect the backend API to load the live SKILL.md content from \`${skill.path}\`

`;
}
