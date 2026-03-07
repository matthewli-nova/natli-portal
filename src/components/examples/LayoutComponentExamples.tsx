import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { AspectRatio } from "../ui/aspect-ratio";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { PlatformGuideline } from "../PlatformGuideline";
import { Smartphone, Tablet, Monitor, RectangleVertical, ChevronDown, BarChart3, User, Settings, Star, Calendar } from "lucide-react";

// Card Component Examples
export function CardExamples() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      <PlatformGuideline
        platform="mobile"
        icon={Smartphone}
        title="Mobile Cards"
        description="Full-width cards with generous padding"
        guidelines={[
          "Full-width layout for maximum content area",
          "Generous padding for touch-friendly spacing",
          "Clear visual hierarchy with headers",
          "Touch-optimized action buttons",
          "Minimal shadow for subtle elevation"
        ]}
        example={
          <div className="space-y-3 max-w-[280px]">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Profile Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">Active 2 hours ago</p>
                  </div>
                  <Badge>Pro</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />

      <PlatformGuideline
        platform="tablet"
        icon={Tablet}
        title="Tablet Cards"
        description="Flexible cards with enhanced content presentation"
        guidelines={[
          "Balanced proportions for tablet screens",
          "Rich content with images and media",
          "Hover states for interactive elements",
          "Flexible grid arrangements",
          "Enhanced visual styling options"
        ]}
        example={
          <div className="space-y-4 max-w-[320px]">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-lepos-cyan to-lepos-cyan-dark rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Analytics</CardTitle>
                    <CardDescription>View your performance metrics</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Views</span>
                    <span className="font-semibold">12,345</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      View Report
                    </Button>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />

      <PlatformGuideline
        platform="desktop"
        icon={Monitor}
        title="Desktop Cards"
        description="Compact cards for dense desktop interfaces"
        guidelines={[
          "Compact sizing for dashboard layouts",
          "Dense information presentation",
          "Subtle hover interactions",
          "Keyboard navigation support",
          "Efficient use of space"
        ]}
        example={
          <div className="space-y-3 max-w-[320px]">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24</div>
                  <div className="text-xs text-muted-foreground">Active Users</div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">98%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </Card>
            </div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Add
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />

      <PlatformGuideline
        platform="kiosk"
        icon={RectangleVertical}
        title="Kiosk Cards"
        description="Large, accessible cards for public interfaces"
        guidelines={[
          "Extra-large sizing for visibility",
          "High contrast borders and backgrounds",
          "Bold typography and clear hierarchy",
          "Large touch-friendly action areas",
          "Simple, focused content structure"
        ]}
        example={
          <div className="max-w-[320px]">
            <Card className="border-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-lepos-cyan rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-lepos-dark" />
                </div>
                <CardTitle className="text-xl">Welcome!</CardTitle>
                <CardDescription className="text-base">
                  Touch to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-12">
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" className="h-12">
                    Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />
    </div>
  );
}

// Accordion & Collapsible Examples
export function AccordionCollapsibleExamples() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-medium mb-4">Accordion Component</h4>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Mobile FAQ</h6>
            <div className="max-w-[300px]">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="h-12">How do I get started?</AccordionTrigger>
                  <AccordionContent>
                    Follow our step-by-step getting started guide to set up your account and configure your first project.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="h-12">What are the pricing plans?</AccordionTrigger>
                  <AccordionContent>
                    We offer flexible pricing plans including free, professional, and enterprise tiers.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Desktop Settings</h6>
            <div className="max-w-[300px]">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="h-8 text-sm">Account Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p>Manage your account preferences and security settings.</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit Profile</Button>
                        <Button size="sm" variant="outline">Security</Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="h-8 text-sm">Notifications</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">Configure how you receive notifications and alerts.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-4">Collapsible Component</h4>
        <div className="max-w-[400px]">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center justify-between w-full">
                <span>Advanced Options</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-4 border rounded-lg bg-muted">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Debug Mode</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cache Size</span>
                  <span className="text-sm text-muted-foreground">256 MB</span>
                </div>
                <Separator />
                <Button size="sm" variant="outline" className="w-full">
                  Reset to Defaults
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

// Tabs Component Examples
export function TabsExamples() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-4">Tabs Component</h4>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Mobile Tabs</h6>
            <div className="max-w-[300px]">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Dashboard Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="font-semibold">24</div>
                          <div className="text-xs text-muted-foreground">Active</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">98%</div>
                          <div className="text-xs text-muted-foreground">Uptime</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="analytics">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Analytics data will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="settings">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <Button className="w-full">Account Settings</Button>
                        <Button variant="outline" className="w-full">Preferences</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Desktop Tabs</h6>
            <div className="max-w-[400px]">
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-3 text-center">
                      <div className="font-semibold">156</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </Card>
                    <Card className="p-3 text-center">
                      <div className="font-semibold">24</div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </Card>
                    <Card className="p-3 text-center">
                      <div className="font-semibold">8</div>
                      <div className="text-xs text-muted-foreground">Teams</div>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="projects">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Design System</span>
                          <Badge>Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Mobile App</span>
                          <Badge variant="secondary">Review</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="team">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary rounded-full"></div>
                          <span className="text-sm">John Doe</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-secondary rounded-full"></div>
                          <span className="text-sm">Jane Smith</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="reports">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground text-center">
                        Reports and analytics will be displayed here
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}