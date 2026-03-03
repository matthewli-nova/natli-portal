import { LeposLogo } from "./LeposLogo";
import { LeposIcon } from "./LeposIcon";
import { LeposSquareIcon } from "./LeposSquareIcon";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FoundationsTab } from "./tabs/FoundationsTab";
import { ComponentsTab } from "./tabs/ComponentsTab";
import { PatternsTab, PlatformsTab, GuidelinesTab } from "./tabs/OtherTabs";
import { ResourcesTab } from "./tabs/ResourcesTab";

export function StyleGuide() {
  const scrollToComponent = (componentId: string) => {
    const element = document.getElementById(componentId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <LeposLogo size="lg" />
              <p className="mt-4 text-muted-foreground max-w-2xl">
                Comprehensive design documentation system for multi-platform applications. 
                Complete with platform-specific guidelines, component examples, and implementation patterns 
                for mobile, tablet, desktop, and large touch display experiences.
              </p>
              
              {/* Logo variants showcase */}
              <div className="mt-6 flex items-center gap-6">
                <div className="text-xs text-muted-foreground">
                  Logo variants:
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <LeposLogo size="sm" variant="default" />
                    <span className="text-xs text-muted-foreground">Default</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 bg-lepos-dark rounded">
                    <LeposLogo size="sm" variant="light" />
                    <span className="text-xs text-white/70">Light</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <LeposLogo size="sm" variant="monochrome" />
                    <span className="text-xs text-muted-foreground">Mono</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <LeposIcon size="sm" />
                    <span className="text-xs text-muted-foreground">Header Use Only</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <LeposSquareIcon size="sm" />
                    <span className="text-xs text-muted-foreground">Icon</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">v2.0.0</Badge>
              <Badge variant="outline">Design System</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="foundations" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="foundations">Foundations</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="foundations">
            <FoundationsTab />
          </TabsContent>

          <TabsContent value="components">
            <ComponentsTab scrollToComponent={scrollToComponent} />
          </TabsContent>

          <TabsContent value="patterns">
            <PatternsTab />
          </TabsContent>

          <TabsContent value="platforms">
            <PlatformsTab />
          </TabsContent>

          <TabsContent value="guidelines">
            <GuidelinesTab />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}