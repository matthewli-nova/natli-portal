import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { PlatformGuideline } from "../PlatformGuideline";
import { Smartphone, Tablet, Monitor, RectangleVertical, Plus, Download, Loader2, Eye, EyeOff, Settings, Search, Bell, Menu, X, Share2, Trash2 } from "lucide-react";
import { RadioGroupExamples } from "./RadioGroupExamples";

// Input Component Examples
export function InputExamples() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      <PlatformGuideline
        platform="mobile"
        icon={Smartphone}
        title="Mobile Input"
        description="Large, touch-friendly input fields"
        guidelines={[
          "Minimum 44px height for touch accessibility",
          "Clear visual focus states",
          "Large, readable placeholder text",
          "Touch-optimized keyboard types",
          "Full-width layout for mobile screens"
        ]}
        example={
          <div className="space-y-4 max-w-[280px]">
            <div className="space-y-2">
              <Label htmlFor="mobile-email">Email Address</Label>
              <Input 
                id="mobile-email" 
                type="email" 
                placeholder="Enter your email"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile-phone">Phone Number</Label>
              <Input 
                id="mobile-phone" 
                type="tel" 
                placeholder="(555) 123-4567"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile-search">Search</Label>
              <div className="relative">
                <Input 
                  id="mobile-search" 
                  type="search" 
                  placeholder="Search products..."
                  className="h-12 pl-10"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute left-0 top-0 h-12 w-10 p-0"
                >
                  🔍
                </Button>
              </div>
            </div>
          </div>
        }
      />

      <PlatformGuideline
        platform="tablet"
        icon={Tablet}
        title="Tablet Input"
        description="Balanced input design with enhanced features"
        guidelines={[
          "Standard height with hover states",
          "Enhanced validation feedback",
          "Rich input with icons and actions",
          "Support for both touch and keyboard",
          "Flexible layout arrangements"
        ]}
        example={
          <div className="space-y-4 max-w-[320px]">
            <div className="space-y-2">
              <Label htmlFor="tablet-password">Password</Label>
              <div className="relative">
                <Input 
                  id="tablet-password" 
                  type="password" 
                  placeholder="Enter password"
                  className="pr-10"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-0 top-0 h-10 w-10 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tablet-amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input 
                  id="tablet-amount" 
                  type="number" 
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="tablet-first">First Name</Label>
                <Input id="tablet-first" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tablet-last">Last Name</Label>
                <Input id="tablet-last" placeholder="Doe" />
              </div>
            </div>
          </div>
        }
      />

      <PlatformGuideline
        platform="desktop"
        icon={Monitor}
        title="Desktop Input"
        description="Compact inputs with advanced features"
        guidelines={[
          "Compact sizing for dense layouts",
          "Rich keyboard shortcuts support",
          "Advanced validation patterns",
          "Context menu integration",
          "Multiple input arrangements"
        ]}
        example={
          <div className="space-y-3 max-w-[320px]">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">First</Label>
                <Input placeholder="John" className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Last</Label>
                <Input placeholder="Doe" className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Age</Label>
                <Input type="number" placeholder="25" className="h-8 text-sm" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Quick Search</Label>
              <Input 
                placeholder="Type to search... (Ctrl+K)" 
                className="h-8 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Command input" 
                className="h-8 text-sm flex-1"
              />
              <Button size="sm" className="h-8 px-3">Run</Button>
            </div>
          </div>
        }
      />

      <PlatformGuideline
        platform="kiosk"
        icon={RectangleVertical}
        title="Kiosk Input"
        description="Large, accessible inputs for public use"
        guidelines={[
          "Extra-large size for visibility",
          "High contrast and bold styling",
          "Simple, clear labeling",
          "Touch-optimized interaction",
          "Error prevention design"
        ]}
        example={
          <div className="space-y-6 max-w-[320px]">
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Enter Your Information</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kiosk-name" className="text-base">Full Name</Label>
                  <Input 
                    id="kiosk-name" 
                    placeholder="Enter your full name"
                    className="h-16 text-lg border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kiosk-email" className="text-base">Email Address</Label>
                  <Input 
                    id="kiosk-email" 
                    type="email" 
                    placeholder="your@email.com"
                    className="h-16 text-lg border-2"
                  />
                </div>
              </div>
            </div>
            <Button className="w-full h-14 text-lg">
              Continue
            </Button>
          </div>
        }
      />
    </div>
  );
}

// Icon Button Component Examples
export function IconButtonExamples() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Icon Button Variants</h4>
          <p className="text-sm text-muted-foreground">Buttons with icon-only content for compact actions</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <Label className="text-sm font-medium">Standard Icon Button</Label>
               <Badge variant="secondary" className="text-xs">size="icon"</Badge>
             </div>
             <div className="flex gap-3">
               <Button size="icon">
                 <Plus className="h-4 w-4" />
               </Button>
               <Button size="icon" variant="secondary">
                 <Settings className="h-4 w-4" />
               </Button>
               <Button size="icon" variant="outline">
                 <Share2 className="h-4 w-4" />
               </Button>
               <Button size="icon" variant="ghost">
                 <Trash2 className="h-4 w-4" />
               </Button>
             </div>
             <p className="text-xs text-muted-foreground">Standard 36x36px size for desktop toolbars and actions.</p>
           </div>

           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <Label className="text-sm font-medium">Rounded</Label>
               <Badge variant="secondary" className="text-xs">rounded-full</Badge>
             </div>
             <div className="flex gap-3">
               <Button size="icon" className="rounded-full">
                 <Plus className="h-4 w-4" />
               </Button>
               <Button size="icon" variant="secondary" className="rounded-full">
                 <Bell className="h-4 w-4" />
               </Button>
               <Button size="icon" variant="outline" className="rounded-full">
                 <Search className="h-4 w-4" />
               </Button>
             </div>
             <p className="text-xs text-muted-foreground">Fully rounded corners for floating actions and circular buttons.</p>
           </div>

           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <Label className="text-sm font-medium">Small Icon</Label>
               <Badge variant="secondary" className="text-xs">size="sm"</Badge>
             </div>
             <div className="flex gap-3 items-center">
               <Button size="sm" className="h-8 w-8 p-0">
                 <Plus className="h-3 w-3" />
               </Button>
               <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full">
                 <X className="h-3 w-3" />
               </Button>
               <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                 <Menu className="h-4 w-4" />
               </Button>
             </div>
             <p className="text-xs text-muted-foreground">Compact 32x32px size for dense interfaces.</p>
           </div>

           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <Label className="text-sm font-medium">Large Icon</Label>
               <Badge variant="secondary" className="text-xs">size="lg"</Badge>
             </div>
             <div className="flex gap-3">
               <Button size="lg" className="h-12 w-12 p-0 rounded-full">
                 <Plus className="h-6 w-6" />
               </Button>
               <Button size="lg" variant="secondary" className="h-12 w-12 p-0">
                 <Download className="h-6 w-6" />
               </Button>
             </div>
             <p className="text-xs text-muted-foreground">Large 48x48px size for mobile and touch targets.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

// Region + Phone Input Example
export function PhoneInputExample() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold mb-1">Region & Phone Input</h4>
        <p className="text-sm text-muted-foreground">Combined region selector and phone number input field</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <PlatformGuideline
          platform="desktop"
          icon={Monitor}
          title="Standard Phone Input"
          description="Integrated region and phone input for desktop"
          guidelines={[
            "Consistent height across components",
            "Clear separation between region and number",
            "Standard validation states",
            "Compact layout for complex forms"
          ]}
          example={
            <div className="space-y-2 max-w-[320px]">
              <Label htmlFor="desktop-phone">Phone Number</Label>
              <div className="flex gap-2">
                <Select defaultValue="HK">
                  <SelectTrigger className="w-[100px] h-9">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HK">🇭🇰 +852</SelectItem>
                    <SelectItem value="US">🇺🇸 +1</SelectItem>
                    <SelectItem value="UK">🇬🇧 +44</SelectItem>
                    <SelectItem value="DE">🇩🇪 +49</SelectItem>
                    <SelectItem value="FR">🇫🇷 +33</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  id="desktop-phone" 
                  type="tel" 
                  placeholder="0000 0000"
                  className="flex-1 h-9"
                />
              </div>
            </div>
          }
        />

        <PlatformGuideline
          platform="mobile"
          icon={Smartphone}
          title="Mobile Phone Input"
          description="Touch-friendly phone input with large tap targets"
          guidelines={[
            "Minimum 44px height for touch areas",
            "Full-width layout for visibility",
            "Large, clear country indicators",
            "Numeric keyboard optimization"
          ]}
          example={
            <div className="space-y-3 max-w-[280px]">
              <Label htmlFor="mobile-phone-example">Mobile Phone Number</Label>
              <div className="flex flex-col gap-2">
                <Select defaultValue="HK">
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HK">🇭🇰 Hong Kong (+852)</SelectItem>
                    <SelectItem value="US">🇺🇸 United States (+1)</SelectItem>
                    <SelectItem value="UK">🇬🇧 United Kingdom (+44)</SelectItem>
                    <SelectItem value="DE">🇩🇪 Germany (+49)</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  id="mobile-phone-example" 
                  type="tel" 
                  placeholder="0000 0000"
                  className="h-12 w-full"
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

// Button Component Examples
export function ButtonExamples() {
  return (
    <div className="space-y-8">
      {/* Button Variants Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Button Variants</h4>
          <p className="text-sm text-muted-foreground">Different visual styles for various use cases and hierarchies</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Primary Button</Label>
              <Badge variant="secondary" className="text-xs">Default</Badge>
            </div>
            <Button className="w-full">Primary Action</Button>
            <p className="text-xs text-muted-foreground">Main call-to-action, highest visual priority. Uses Lepos Dark Brand (#023F59) for strong brand presence.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Secondary Button</Label>
              <Badge variant="secondary" className="text-xs">variant="secondary"</Badge>
            </div>
            <Button variant="secondary" className="w-full">Secondary Action</Button>
            <p className="text-xs text-muted-foreground">Secondary actions using Lepos Cyan (#31D7DB) for complementary tasks.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Outline Button</Label>
              <Badge variant="secondary" className="text-xs">variant="outline"</Badge>
            </div>
            <Button variant="outline" className="w-full">Outline Action</Button>
            <p className="text-xs text-muted-foreground">Tertiary actions with subtle borders, less visual weight.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Ghost Button</Label>
              <Badge variant="secondary" className="text-xs">variant="ghost"</Badge>
            </div>
            <Button variant="ghost" className="w-full">Ghost Action</Button>
            <p className="text-xs text-muted-foreground">Minimal styling for subtle actions, no background or border.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Destructive Button</Label>
              <Badge variant="secondary" className="text-xs">variant="destructive"</Badge>
            </div>
            <Button variant="destructive" className="w-full">Delete Item</Button>
            <p className="text-xs text-muted-foreground">Dangerous or irreversible actions requiring user attention.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Link Button</Label>
              <Badge variant="secondary" className="text-xs">variant="link"</Badge>
            </div>
            <Button variant="link" className="w-full text-lepos-cyan-text">Link Action</Button>
            <p className="text-xs text-muted-foreground">Styled as hyperlink, used for navigation or inline actions.</p>
          </div>
        </div>
      </div>

      {/* Button Sizes Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Button Sizes</h4>
          <p className="text-sm text-muted-foreground">Responsive sizing options for different contexts and platforms</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Small</Label>
              <Badge variant="secondary" className="text-xs">size="sm"</Badge>
            </div>
            <div className="space-y-2">
              <Button size="sm" className="w-full">Small Button</Button>
              <Button size="sm" variant="secondary" className="w-full">Small Secondary</Button>
              <Button size="sm" variant="outline" className="w-full">Small Outline</Button>
            </div>
            <p className="text-xs text-muted-foreground">Compact size for dense UIs, toolbars, and inline actions.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Default</Label>
              <Badge variant="secondary" className="text-xs">No size prop</Badge>
            </div>
            <div className="space-y-2">
              <Button className="w-full">Default Button</Button>
              <Button variant="secondary" className="w-full">Default Secondary</Button>
              <Button variant="outline" className="w-full">Default Outline</Button>
            </div>
            <p className="text-xs text-muted-foreground">Standard size for most use cases, balanced for all platforms.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Large</Label>
              <Badge variant="secondary" className="text-xs">size="lg"</Badge>
            </div>
            <div className="space-y-2">
              <Button size="lg" className="w-full">Large Button</Button>
              <Button size="lg" variant="secondary" className="w-full">Large Secondary</Button>
              <Button size="lg" variant="outline" className="w-full">Large Outline</Button>
            </div>
            <p className="text-xs text-muted-foreground">Larger size for prominent CTAs, mobile, and kiosk interfaces.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Icon Buttons</Label>
              <Badge variant="secondary" className="text-xs">With Icons</Badge>
            </div>
            <div className="space-y-2">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <Button variant="secondary" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  Settings
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Buttons with icons for enhanced clarity and visual interest.</p>
          </div>
        </div>
      </div>

      {/* Disabled States Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Disabled State</h4>
          <p className="text-sm text-muted-foreground">All button variants in disabled state with reduced opacity and no interaction</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Primary Disabled</Label>
            <Button disabled className="w-full">Primary Disabled</Button>
            <p className="text-xs text-muted-foreground">Disabled primary button with reduced opacity, non-interactive.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Secondary Disabled</Label>
            <Button variant="secondary" disabled className="w-full">Secondary Disabled</Button>
            <p className="text-xs text-muted-foreground">Disabled secondary button, maintains visual hierarchy.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Outline Disabled</Label>
            <Button variant="outline" disabled className="w-full">Outline Disabled</Button>
            <p className="text-xs text-muted-foreground">Disabled outline variant with muted border and text.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Ghost Disabled</Label>
            <Button variant="ghost" disabled className="w-full">Ghost Disabled</Button>
            <p className="text-xs text-muted-foreground">Disabled ghost button, minimal visual presence.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Destructive Disabled</Label>
            <Button variant="destructive" disabled className="w-full">Destructive Disabled</Button>
            <p className="text-xs text-muted-foreground">Disabled destructive action, prevents accidental triggers.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">With Icon</Label>
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
            <p className="text-xs text-muted-foreground">Loading state with animated icon, indicates processing.</p>
          </div>
        </div>
      </div>

      {/* Platform-Specific Guidelines */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Platform Guidelines</h4>
          <p className="text-sm text-muted-foreground">Recommended button sizing and behavior for each platform</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-secondary" />
                <CardTitle className="text-sm">Mobile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <p className="text-xs font-medium">Minimum Height: 44px</p>
                <p className="text-xs text-muted-foreground">Touch-optimized for accessibility</p>
              </div>
              <Button className="w-full h-11">Mobile Button</Button>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Full-width for primary actions</li>
                <li>Generous spacing between buttons</li>
                <li>Clear visual feedback on tap</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Tablet className="h-4 w-4 text-secondary" />
                <CardTitle className="text-sm">Tablet</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <p className="text-xs font-medium">Minimum Height: 40px</p>
                <p className="text-xs text-muted-foreground">Balanced for touch and precision</p>
              </div>
              <Button className="w-full">Tablet Button</Button>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Flexible width based on context</li>
                <li>Enhanced hover states</li>
                <li>Icon combinations supported</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-secondary" />
                <CardTitle className="text-sm">Desktop</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <p className="text-xs font-medium">Minimum Height: 36px</p>
                <p className="text-xs text-muted-foreground">Compact for dense interfaces</p>
              </div>
              <Button size="sm" className="w-full">Desktop Button</Button>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Keyboard shortcuts support</li>
                <li>Rich hover and focus states</li>
                <li>Tooltip integration</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <RectangleVertical className="h-4 w-4 text-secondary" />
                <CardTitle className="text-sm">Kiosk (32")</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <p className="text-xs font-medium">Minimum Height: 64px</p>
                <p className="text-xs text-muted-foreground">Large touch screens</p>
              </div>
              <Button size="lg" className="w-full h-14">Kiosk Button</Button>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Extra-large for visibility</li>
                <li>High contrast styling</li>
                <li>Simple, clear labels</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Switch and Slider Examples
export function SwitchSliderExamples() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-medium mb-4">Switch Component</h4>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Mobile & Tablet</h6>
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label htmlFor="mobile-notifications" className="text-sm">Push Notifications</Label>
                <Switch id="mobile-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="mobile-location" className="text-sm">Location Services</Label>
                <Switch id="mobile-location" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="mobile-analytics" className="text-sm">Analytics</Label>
                <Switch id="mobile-analytics" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Desktop & Kiosk</h6>
            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label htmlFor="desktop-dark" className="text-xs">Dark Mode</Label>
                <Switch id="desktop-dark" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="desktop-auto" className="text-xs">Auto-save</Label>
                <Switch id="desktop-auto" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-4">Slider Component</h4>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Volume Control</h6>
            <div className="space-y-3 p-4 border rounded-lg">
              <Label className="text-sm">Master Volume</Label>
              <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Range Selection</h6>
            <div className="space-y-3 p-4 border rounded-lg">
              <Label className="text-sm">Price Range</Label>
              <Slider defaultValue={[20, 80]} max={100} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
