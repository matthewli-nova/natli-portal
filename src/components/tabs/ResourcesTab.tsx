import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { SectionIcon } from "../ui/section-icon";
import { Package, Code, Palette, HelpCircle, Users, Copy, Download, ExternalLink } from "lucide-react";
import { toast } from 'sonner';

export function ResourcesTab() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <div className="flex gap-2">
            <SectionIcon icon={Package} className="mt-1" />
            <div className="space-y-1">
              <CardTitle>Resources & Downloads</CardTitle>
              <CardDescription>
                Tools, templates, and resources to help implement the Lepos design system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Code} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Reusability Guide</CardTitle>
                <CardDescription>How to use this design system in other Figma Make projects</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="p-4 bg-lepos-dark-brand/10 rounded-lg space-y-3 border border-lepos-dark-brand/20">
              <h6 className="text-sm font-semibold text-lepos-dark-brand">📋 Quick Setup</h6>
              <p className="text-xs text-muted-foreground">
                Copy these files to your new project:
              </p>
              <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                <li><code className="bg-muted px-1 py-0.5 rounded">/styles/globals.css</code></li>
                <li><code className="bg-muted px-1 py-0.5 rounded">/components/ui/</code> (entire folder)</li>
                <li><code className="bg-muted px-1 py-0.5 rounded">/components/design-constants.ts</code> (optional)</li>
              </ul>
              <Button 
                size="sm" 
                className="w-full mt-2"
                onClick={() => {
                  window.open('/LEPOS_DESIGN_SYSTEM_REUSE_GUIDE.md', '_blank');
                  toast("Opening reusability guide...");
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Complete Guide
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Code} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Update Guide</CardTitle>
                <CardDescription>What to replace when you make changes to this master system</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="p-4 bg-lepos-dark-brand/10 rounded-lg space-y-3 border border-lepos-dark-brand/20">
              <h6 className="text-sm font-semibold text-lepos-dark-brand">🔄 Quick Reference</h6>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-lepos-dark-brand">Colors:</span>
                  <span className="text-muted-foreground">Replace <code className="bg-muted px-1 py-0.5 rounded">globals.css</code></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-lepos-dark-brand">Button:</span>
                  <span className="text-muted-foreground">Replace <code className="bg-muted px-1 py-0.5 rounded">button.tsx</code></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-lepos-dark-brand">Any component:</span>
                  <span className="text-muted-foreground">Replace that file</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-lepos-dark-brand">Everything:</span>
                  <span className="text-muted-foreground">Replace all 3 core files</span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="w-full mt-2 border-lepos-dark-brand/30 hover:bg-lepos-dark-brand/10"
                onClick={() => {
                  window.open('/DESIGN_SYSTEM_UPDATE_GUIDE.md', '_blank');
                  toast("Opening update guide...");
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Update Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Code} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>Ready-to-use code snippets and implementations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">CSS Variables</h6>
                  <p className="text-xs text-muted-foreground">Complete CSS custom properties</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(':root { --lepos-dark: #21262a; --lepos-dark-brand: #023F59; --lepos-cyan: #31D7DB; }')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">Tailwind Config</h6>
                  <p className="text-xs text-muted-foreground">Tailwind CSS configuration</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">React Components</h6>
                  <p className="text-xs text-muted-foreground">TypeScript component library</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Palette} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Design Assets</CardTitle>
                <CardDescription>Figma libraries, icons, and design resources</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">Figma Library</h6>
                  <p className="text-xs text-muted-foreground">Complete component library</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">Icon Set</h6>
                  <p className="text-xs text-muted-foreground">SVG icons and symbols</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">Brand Assets</h6>
                  <p className="text-xs text-muted-foreground">Logos, colors, and guidelines</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={HelpCircle} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Comprehensive guides and documentation</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">Getting Started Guide</h6>
                  <p className="text-xs text-muted-foreground">Quick setup and implementation</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">API Reference</h6>
                  <p className="text-xs text-muted-foreground">Complete component API docs</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">Migration Guide</h6>
                  <p className="text-xs text-muted-foreground">Upgrading from previous versions</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Users} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Community & Support</CardTitle>
                <CardDescription>Connect with the design system community</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">GitHub Repository</h6>
                  <p className="text-xs text-muted-foreground">Source code and issue tracking</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">Slack Community</h6>
                  <p className="text-xs text-muted-foreground">Join the discussion</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h6 className="text-sm font-medium">Support Portal</h6>
                  <p className="text-xs text-muted-foreground">Get help and submit requests</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <CardTitle>Quick Start Code</CardTitle>
          <CardDescription>
            Copy and paste these snippets to get started with the Lepos design system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-[21px]">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h6 className="text-sm font-medium">Install Dependencies</h6>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('npm install @lepos/design-system tailwindcss')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm">npm install @lepos/design-system tailwindcss</code>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h6 className="text-sm font-medium">Import Styles</h6>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('@import "@lepos/design-system/styles";')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm">@import "@lepos/design-system/styles";</code>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h6 className="text-sm font-medium">Basic Component Usage</h6>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('import { Button } from "@lepos/design-system";\n\nfunction App() {\n  return <Button>Click me</Button>;\n}')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm whitespace-pre-line">
                  {`import { Button } from "@lepos/design-system";

function App() {
  return <Button>Click me</Button>;
}`}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
