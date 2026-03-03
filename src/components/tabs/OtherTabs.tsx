import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Grid3x3, Globe, Shield, Layout, FileText, BarChart3, Smartphone, Tablet, Monitor, RectangleVertical, Accessibility, Gauge, Lock, Lightbulb, CheckCircle, Info } from "lucide-react";
import { SectionIcon } from "../ui/section-icon";

export function PatternsTab() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <div className="flex gap-2">
            <SectionIcon icon={Grid3x3} className="mt-1" />
            <div className="space-y-1">
              <CardTitle>Design Patterns</CardTitle>
              <CardDescription>
                Common UI patterns and layout solutions for consistent user experiences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Layout} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Navigation Patterns</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Top Navigation</span>
                <Badge variant="outline">Desktop</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Bottom Navigation</span>
                <Badge variant="outline">Mobile</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Sidebar Navigation</span>
                <Badge variant="outline">Desktop/Tablet</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Hamburger Menu</span>
                <Badge variant="outline">Mobile/Tablet</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={FileText} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Form Patterns</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h6 className="text-sm font-medium mb-2">Single Column Form</h6>
                <p className="text-xs text-muted-foreground">Best for mobile and simple forms</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h6 className="text-sm font-medium mb-2">Multi-Column Form</h6>
                <p className="text-xs text-muted-foreground">Desktop layouts with related fields</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h6 className="text-sm font-medium mb-2">Wizard/Stepper</h6>
                <p className="text-xs text-muted-foreground">Complex multi-step processes</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h6 className="text-sm font-medium mb-2">Inline Editing</h6>
                <p className="text-xs text-muted-foreground">Quick edits in data tables</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={BarChart3} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Data Display</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h6 className="text-sm font-medium mb-2">Data Tables</h6>
                <p className="text-xs text-muted-foreground">Sortable, filterable data display</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h6 className="text-sm font-medium mb-2">Card Grids</h6>
                <p className="text-xs text-muted-foreground">Responsive content cards</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h6 className="text-sm font-medium mb-2">Lists</h6>
                <p className="text-xs text-muted-foreground">Simple and complex list layouts</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h6 className="text-sm font-medium mb-2">Dashboards</h6>
                <p className="text-xs text-muted-foreground">Analytics and metrics display</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <div className="space-y-1">
            <CardTitle>Responsive Layout Patterns</CardTitle>
            <CardDescription>
              How layouts adapt across different screen sizes and platforms
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-[21px]">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h6 className="font-medium">Mobile-First Approach</h6>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Smartphone className="h-5 w-5 text-[var(--lepos-cyan-dark)]" />
                  <div>
                    <p className="text-sm font-medium">320px - 640px</p>
                    <p className="text-xs text-muted-foreground">Single column, stacked layout</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Tablet className="h-5 w-5 text-[var(--lepos-cyan-dark)]" />
                  <div>
                    <p className="text-sm font-medium">641px - 1024px</p>
                    <p className="text-xs text-muted-foreground">Two column, adaptive sidebar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Monitor className="h-5 w-5 text-[var(--lepos-cyan-dark)]" />
                  <div>
                    <p className="text-sm font-medium">1025px+</p>
                    <p className="text-xs text-muted-foreground">Multi-column, dense layout</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h6 className="font-medium">Layout Best Practices</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Use consistent spacing and alignment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Maintain visual hierarchy across breakpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Optimize touch targets for mobile devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Use progressive disclosure for complex forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Ensure keyboard navigation support</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PlatformsTab() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <div className="flex gap-2">
            <SectionIcon icon={Globe} className="mt-1" />
            <div className="space-y-1">
              <CardTitle>Platform Guidelines</CardTitle>
              <CardDescription>
                Specific considerations and optimizations for each target platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Smartphone} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Mobile Applications</CardTitle>
                <CardDescription>iOS and Android native app considerations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Touch Interface</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Minimum 44px touch targets</li>
                <li>• Generous spacing between interactive elements</li>
                <li>• Swipe gestures for navigation</li>
                <li>• Pull-to-refresh patterns</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Performance</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Optimize for battery life</li>
                <li>• Lazy load images and content</li>
                <li>• Minimize memory usage</li>
                <li>• Fast startup times</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Platform Integration</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Follow platform design guidelines</li>
                <li>• Use native navigation patterns</li>
                <li>• Support system dark/light modes</li>
                <li>• Integrate with device features</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Tablet} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Tablet Applications</CardTitle>
                <CardDescription>iPad and Android tablet optimizations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Layout Flexibility</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multi-column layouts for landscape</li>
                <li>• Adaptive sidebar navigation</li>
                <li>• Master-detail view patterns</li>
                <li>• Split-screen compatibility</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Input Methods</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Support touch and pointer devices</li>
                <li>• Hover states for enhanced UX</li>
                <li>• Keyboard shortcuts and navigation</li>
                <li>• Apple Pencil/stylus support</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Content Density</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Higher information density</li>
                <li>• Rich content presentation</li>
                <li>• Multi-tasking considerations</li>
                <li>• Orientation-aware layouts</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Monitor} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Desktop Applications</CardTitle>
                <CardDescription>Web and native desktop applications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Mouse & Keyboard</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Precise cursor interactions</li>
                <li>• Rich hover and focus states</li>
                <li>• Comprehensive keyboard shortcuts</li>
                <li>• Context menus and right-click</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Screen Real Estate</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dense information layouts</li>
                <li>• Multiple panels and views</li>
                <li>• Resizable interface elements</li>
                <li>• Multi-monitor support</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Advanced Features</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Drag and drop interactions</li>
                <li>• File system integration</li>
                <li>• Copy/paste operations</li>
                <li>• Browser developer tools</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={RectangleVertical} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Kiosk Displays</CardTitle>
                <CardDescription>32" touch displays and public interfaces</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Large Screen Design</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Extra-large touch targets (64px+)</li>
                <li>• High contrast and bold typography</li>
                <li>• Simple, clear navigation</li>
                <li>• Minimal cognitive load</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Public Use</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Self-explanatory interfaces</li>
                <li>• Session timeout and reset</li>
                <li>• Accessibility compliance</li>
                <li>• Multi-language support</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Durability</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Resistant to heavy usage</li>
                <li>• Clean, wipeable surfaces</li>
                <li>• Vandal-resistant design</li>
                <li>• 24/7 operation capable</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function GuidelinesTab() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <div className="flex gap-2">
            <SectionIcon icon={Shield} className="mt-1" />
            <div className="space-y-1">
              <CardTitle>Usage Guidelines</CardTitle>
              <CardDescription>
                Best practices, accessibility standards, and implementation guidelines
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Accessibility} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Accessibility Standards</CardTitle>
                <CardDescription>WCAG 2.1 AA compliance guidelines</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Color & Contrast</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Minimum 4.5:1 contrast ratio for normal text</li>
                <li>• Minimum 3:1 contrast ratio for large text</li>
                <li>• Don't rely solely on color for information</li>
                <li>• Support high contrast mode</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Keyboard Navigation</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All interactive elements keyboard accessible</li>
                <li>• Logical tab order and focus management</li>
                <li>• Visible focus indicators</li>
                <li>• Skip links for main content</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Screen Readers</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Semantic HTML structure</li>
                <li>• Descriptive alt text for images</li>
                <li>• ARIA labels and roles</li>
                <li>• Live regions for dynamic content</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Gauge} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Performance Guidelines</CardTitle>
                <CardDescription>Optimization strategies for all platforms</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Loading Performance</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• First Contentful Paint under 1.5s</li>
                <li>• Largest Contentful Paint under 2.5s</li>
                <li>• Cumulative Layout Shift under 0.1</li>
                <li>• Time to Interactive under 3s</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Runtime Performance</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 60fps animations and transitions</li>
                <li>• Efficient memory usage</li>
                <li>• Minimal main thread blocking</li>
                <li>• Progressive enhancement</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Resource Optimization</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Optimized image formats and sizes</li>
                <li>• Efficient CSS and JavaScript</li>
                <li>• CDN and caching strategies</li>
                <li>• Lazy loading implementation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Lock} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Security Guidelines</CardTitle>
                <CardDescription>Protecting user data and system integrity</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Data Protection</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Input validation and sanitization</li>
                <li>• Secure transmission (HTTPS)</li>
                <li>• Encryption for sensitive data</li>
                <li>• Minimal data collection</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Authentication</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Strong password requirements</li>
                <li>• Multi-factor authentication support</li>
                <li>• Session management</li>
                <li>• Secure logout procedures</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Privacy</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Clear privacy policies</li>
                <li>• Cookie consent management</li>
                <li>• User data control options</li>
                <li>• GDPR compliance measures</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Lightbulb} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>UX Best Practices</CardTitle>
                <CardDescription>Creating intuitive and engaging user experiences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-[21px]">
            <div className="space-y-3">
              <h6 className="text-sm font-medium">User Interface</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Consistent visual language</li>
                <li>• Clear information hierarchy</li>
                <li>• Intuitive navigation patterns</li>
                <li>• Responsive feedback systems</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">Content Strategy</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Clear, concise messaging</li>
                <li>• Progressive disclosure</li>
                <li>• Error prevention and recovery</li>
                <li>• Help and documentation</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-3">
              <h6 className="text-sm font-medium">User Testing</h6>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Regular usability testing</li>
                <li>• A/B testing for improvements</li>
                <li>• Analytics and user feedback</li>
                <li>• Iterative design process</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          These guidelines should be considered minimum requirements. Always test with real users and assistive technologies to ensure the best possible experience for all users.
        </AlertDescription>
      </Alert>
    </div>
  );
}
