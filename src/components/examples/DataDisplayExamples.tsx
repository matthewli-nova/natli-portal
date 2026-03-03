import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Info, Check, X, AlertTriangle, Bell, ShoppingCart, Star, Zap, User, Users } from "lucide-react";

// Badge Component Examples
export function BadgeExamples() {
  return (
    <div className="space-y-8">
      {/* Badge Variants Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Badge Variants</h4>
          <p className="text-sm text-muted-foreground">Different visual styles for various contexts and semantic meanings</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Default Badge</Label>
              <Badge variant="secondary" className="text-xs">Default</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge>New</Badge>
              <Badge>Featured</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Standard badge for general labels and categories.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Secondary Badge</Label>
              <Badge variant="secondary" className="text-xs">variant="secondary"</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="secondary">Optional</Badge>
              <Badge variant="secondary">Info</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Uses Lepos Cyan for secondary information and complementary labels.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Brand Badge</Label>
              <Badge variant="secondary" className="text-xs">Custom variant</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-lepos-dark-brand text-white hover:bg-[#034A6C]">Premium</Badge>
              <Badge className="bg-lepos-dark-brand text-white hover:bg-[#034A6C]">Featured</Badge>
              <Badge className="bg-lepos-dark-brand text-white hover:bg-[#034A6C]">VIP</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Special brand moments using Lepos Dark Brand (#023F59) for high-value features.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Outline Badge</Label>
              <Badge variant="secondary" className="text-xs">variant="outline"</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Outline</Badge>
              <Badge variant="outline">Draft</Badge>
              <Badge variant="outline">Inactive</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Subtle outline style for less prominent labels and tags.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Destructive Badge</Label>
              <Badge variant="secondary" className="text-xs">variant="destructive"</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="destructive">Error</Badge>
              <Badge variant="destructive">Deleted</Badge>
              <Badge variant="destructive">Failed</Badge>
            </div>
            <p className="text-xs text-muted-foreground">For errors, warnings, and critical status indicators.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Success Badge</Label>
              <Badge variant="secondary" className="text-xs">Custom variant</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-success text-success-foreground hover:bg-success/80">Success</Badge>
              <Badge className="bg-success text-success-foreground hover:bg-success/80">Active</Badge>
              <Badge className="bg-success text-success-foreground hover:bg-success/80">Completed</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Positive status indicators and success states.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Warning Badge</Label>
              <Badge variant="secondary" className="text-xs">Custom variant</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">Warning</Badge>
              <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">Pending</Badge>
              <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">Review</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Caution states and items requiring attention.</p>
          </div>
        </div>
      </div>

      {/* Badge with Icons Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Badges with Icons</h4>
          <p className="text-sm text-muted-foreground">Combining icons with badges for enhanced visual communication</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status Indicators</Label>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-success text-success-foreground">
                <Check className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              <Badge variant="destructive">
                <X className="h-3 w-3 mr-1" />
                Rejected
              </Badge>
              <Badge className="bg-warning text-warning-foreground">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Alert
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Notification Badges</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Bell className="h-3 w-3 mr-1" />
                3 New
              </Badge>
              <Badge>
                <ShoppingCart className="h-3 w-3 mr-1" />
                5 Items
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Feature Badges</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                Premium
              </Badge>
              <Badge>
                <Zap className="h-3 w-3 mr-1" />
                Pro
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Interactive Badges</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary/10">
                <Info className="h-3 w-3 mr-1" />
                Details
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Click me
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Sizes Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Badge Sizes</h4>
          <p className="text-sm text-muted-foreground">Different sizes for various UI contexts and platform requirements</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Small (Mobile/Compact)</Label>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className="text-xs px-2 py-0.5">Small</Badge>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">Compact</Badge>
              <Badge variant="outline" className="text-xs px-2 py-0.5">Tiny</Badge>
            </div>
            <p className="text-xs text-muted-foreground">For dense interfaces and inline text.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Default (Standard)</Label>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge>Default</Badge>
              <Badge variant="secondary">Standard</Badge>
              <Badge variant="outline">Normal</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Standard size for most use cases.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Large (Touch)</Label>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className="text-base px-4 py-1.5">Large</Badge>
              <Badge variant="secondary" className="text-base px-4 py-1.5">Touch</Badge>
            </div>
            <p className="text-xs text-muted-foreground">For tablet and touch interfaces.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Extra Large (Kiosk)</Label>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className="text-lg px-5 py-2">Extra Large</Badge>
              <Badge variant="secondary" className="text-lg px-5 py-2">Kiosk</Badge>
            </div>
            <p className="text-xs text-muted-foreground">For 32" touch screens and kiosks.</p>
          </div>
        </div>
      </div>

      {/* Real-World Usage Examples */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Real-World Usage</h4>
          <p className="text-sm text-muted-foreground">Practical examples of badges in common UI patterns</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-sm font-medium">Product Card</Label>
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-medium">Premium Subscription</h5>
                  <p className="text-sm text-muted-foreground">$29.99/month</p>
                </div>
                <Badge variant="secondary">Popular</Badge>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-success text-success-foreground text-xs">In Stock</Badge>
                <Badge variant="outline" className="text-xs">Free Shipping</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-sm font-medium">Notification List</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">System Update Available</span>
                <Badge variant="secondary" className="text-xs">2h ago</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Message Received</span>
                <Badge className="text-xs">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Failed</span>
                <Badge variant="destructive" className="text-xs">Action Required</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-sm font-medium">User Profile</Label>
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">John Doe</span>
                  <Badge className="bg-success text-success-foreground text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">Pro</Badge>
                  <Badge variant="outline" className="text-xs">Admin</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-sm font-medium">Filter Tags</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Category: Electronics
                <X className="h-3 w-3 ml-1" />
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Price: $0-$100
                <X className="h-3 w-3 ml-1" />
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Rating: 4+ Stars
                <X className="h-3 w-3 ml-1" />
              </Badge>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Guidelines */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Platform Guidelines</h4>
          <p className="text-sm text-muted-foreground">Best practices for badge usage across different platforms</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-semibold">Mobile</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Use larger badges (14-16px text)</li>
              <li>Ensure adequate touch targets</li>
              <li>Limit badge count per row</li>
              <li>Consider color accessibility</li>
            </ul>
            <Badge className="text-sm">Mobile Badge</Badge>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-semibold">Tablet</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Standard badge sizes work well</li>
              <li>Support hover states</li>
              <li>Group related badges</li>
              <li>Use icons for clarity</li>
            </ul>
            <Badge>Tablet Badge</Badge>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-semibold">Desktop</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Compact sizing acceptable</li>
              <li>Rich hover interactions</li>
              <li>Tooltip support helpful</li>
              <li>Keyboard navigation</li>
            </ul>
            <Badge className="text-xs">Desktop</Badge>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-semibold">Kiosk (32")</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Extra-large badges (18-20px)</li>
              <li>High contrast colors</li>
              <li>Simple, clear labels</li>
              <li>Minimal badge count</li>
            </ul>
            <Badge className="text-lg px-5 py-2">Kiosk</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tooltip Component Examples
export function TooltipExamples() {
  return (
    <div className="space-y-8">
      {/* Basic Tooltip Examples */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Basic Tooltips</h4>
          <p className="text-sm text-muted-foreground">Simple tooltips for providing contextual information on hover</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Default Tooltip</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a tooltip</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground">Basic tooltip with default styling.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Icon with Tooltip</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Additional information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground">Icon buttons with helpful tooltips.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Rich Content</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary">Details</Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-1">Feature Details</p>
                  <p className="text-xs">This feature allows you to perform complex operations with enhanced functionality.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground">Tooltips with formatted content.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Disabled Element</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button disabled>Disabled</Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This action is currently unavailable</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground">Explaining disabled states.</p>
          </div>
        </div>
      </div>

      {/* Platform Guidelines */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Platform Considerations</h4>
          <p className="text-sm text-muted-foreground">Tooltip usage varies by platform and interaction method</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-semibold">Mobile</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Use sparingly (no hover)</li>
              <li>Consider tap-to-reveal</li>
              <li>Alternative: info icons</li>
              <li>Keep text concise</li>
            </ul>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-semibold">Tablet</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Support both hover and tap</li>
              <li>Medium delay timing</li>
              <li>Clear visual indicators</li>
              <li>Readable font sizes</li>
            </ul>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-semibold">Desktop</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Hover-activated tooltips</li>
              <li>Short delay (~300ms)</li>
              <li>Keyboard accessible</li>
              <li>Rich content supported</li>
            </ul>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-semibold">Kiosk (32")</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Avoid tooltips (touch only)</li>
              <li>Use persistent labels</li>
              <li>Large, clear text</li>
              <li>Alternative UI patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Avatar Component Examples
export function AvatarExamples() {
  return (
    <div className="space-y-8">
      {/* Avatar Sizes Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Avatar Sizes</h4>
          <p className="text-sm text-muted-foreground">Different sizes optimized for various platforms and use cases</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Small</Label>
              <Badge variant="secondary" className="text-xs">24px</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="size-6">
                <AvatarFallback className="text-xs">SM</AvatarFallback>
              </Avatar>
              <Avatar className="size-6">
                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">AB</AvatarFallback>
              </Avatar>
              <Avatar className="size-6">
                <AvatarFallback className="text-xs bg-lepos-dark-brand text-white">XS</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground">Compact avatars for dense lists, inline mentions, and compact UIs.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Default</Label>
              <Badge variant="secondary" className="text-xs">40px</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-secondary text-secondary-foreground">MK</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-lepos-dark-brand text-white">RP</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground">Standard size for most use cases, comments, and navigation menus.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Large</Label>
              <Badge variant="secondary" className="text-xs">56px</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarFallback className="text-lg">LG</AvatarFallback>
              </Avatar>
              <Avatar className="size-14">
                <AvatarFallback className="text-lg bg-secondary text-secondary-foreground">XL</AvatarFallback>
              </Avatar>
              <Avatar className="size-14">
                <AvatarFallback className="text-lg bg-lepos-dark-brand text-white">VL</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground">Larger avatars for profile headers, user cards, and tablet interfaces.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Extra Large</Label>
              <Badge variant="secondary" className="text-xs">80px</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="size-20">
                <AvatarFallback className="text-2xl">XL</AvatarFallback>
              </Avatar>
              <Avatar className="size-20">
                <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">2X</AvatarFallback>
              </Avatar>
              <Avatar className="size-20">
                <AvatarFallback className="text-2xl bg-lepos-dark-brand text-white">3X</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground">Extra large for profile pages and kiosk displays (32\" screens).</p>
          </div>
        </div>
      </div>

      {/* Avatar with Images Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Avatar with Images</h4>
          <p className="text-sm text-muted-foreground">Avatars displaying user profile images with fallback initials</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-3">
            <Label className="text-sm font-medium">User Profiles</Label>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User 1" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User 2" />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User 3" />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground">Profile images with automatic fallback to initials.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Fallback Examples</Label>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/invalid-image.jpg" alt="Fallback 1" />
                <AvatarFallback>FB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="/invalid-image.jpg" alt="Fallback 2" />
                <AvatarFallback className="bg-secondary text-secondary-foreground">TC</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="/invalid-image.jpg" alt="Fallback 3" />
                <AvatarFallback className="bg-lepos-dark-brand text-white">VIP</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground">When images fail to load, fallback text displays automatically.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Icon Fallbacks</Label>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  <Users className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-lepos-dark-brand text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground">Using icons instead of initials for generic or system avatars.</p>
          </div>
        </div>
      </div>

      {/* Avatar with Status Indicators */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Status Indicators</h4>
          <p className="text-sm text-muted-foreground">Avatars with online/offline status badges for presence indication</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Online Status</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Online user" />
                  <AvatarFallback>ON</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-success ring-2 ring-background"></span>
              </div>
              <div className="relative">
                <Avatar className="size-14">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Online user" />
                  <AvatarFallback>ON</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-success ring-2 ring-background"></span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Green indicator shows user is currently online.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Away Status</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar>
                  <AvatarFallback>AW</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-warning ring-2 ring-background"></span>
              </div>
              <div className="relative">
                <Avatar className="size-14">
                  <AvatarFallback>AW</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-warning ring-2 ring-background"></span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Yellow indicator shows user is away from keyboard.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Busy Status</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="bg-secondary text-secondary-foreground">BS</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-destructive ring-2 ring-background"></span>
              </div>
              <div className="relative">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">BS</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-destructive ring-2 ring-background"></span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Red indicator shows user is busy or in do-not-disturb mode.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Offline Status</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="bg-lepos-dark-brand text-white">OF</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-muted ring-2 ring-background"></span>
              </div>
              <div className="relative">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-lepos-dark-brand text-white">OF</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-muted ring-2 ring-background"></span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Gray indicator shows user is offline or inactive.</p>
          </div>
        </div>
      </div>

      {/* Avatar Groups */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Avatar Groups</h4>
          <p className="text-sm text-muted-foreground">Stacked avatars showing multiple users or team members</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Small Group</Label>
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Member 1" />
                <AvatarFallback>M1</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Member 2" />
                <AvatarFallback>M2</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Member 3" />
                <AvatarFallback>M3</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground">Three team members shown in compact stack.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">With Counter</Label>
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Member 1" />
                <AvatarFallback>M1</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Member 2" />
                <AvatarFallback>M2</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">+5</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground">Shows two members plus counter for additional 5 users.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Large Group Stack</Label>
            <div className="flex -space-x-3">
              <Avatar className="size-12 border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User 1" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar className="size-12 border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User 2" />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <Avatar className="size-12 border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User 3" />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
              <Avatar className="size-12 border-2 border-background">
                <AvatarFallback className="bg-secondary text-secondary-foreground">+12</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground">Larger avatars for better visibility on tablet/kiosk.</p>
          </div>
        </div>
      </div>

      {/* Real-World Usage Examples */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Real-World Usage</h4>
          <p className="text-sm text-muted-foreground">Practical examples of avatars in common UI patterns</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-sm font-medium">User Profile Card</Label>
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="size-16">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="John Doe" />
                  <AvatarFallback className="text-xl">JD</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-success ring-2 ring-background"></span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="font-semibold">John Doe</h5>
                  <Badge className="bg-success text-success-foreground text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Product Designer</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">Pro Member</Badge>
                  <Badge variant="outline" className="text-xs">Premium</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-sm font-medium">Comment Thread</Label>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="size-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Sarah" />
                  <AvatarFallback className="text-xs">SK</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-xs font-medium">Sarah Kim</p>
                  <p className="text-xs text-muted-foreground">Great work on this design!</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Avatar className="size-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Mike" />
                  <AvatarFallback className="text-xs">MJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-xs font-medium">Mike Johnson</p>
                  <p className="text-xs text-muted-foreground">Thanks for the feedback!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-sm font-medium">Team Members List</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="size-10">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Alex" />
                      <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-success ring-2 ring-background"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alex Taylor</p>
                    <p className="text-xs text-muted-foreground">Lead Developer</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">Admin</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="size-10">
                      <AvatarFallback>RM</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-warning ring-2 ring-background"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rachel Martinez</p>
                    <p className="text-xs text-muted-foreground">UX Designer</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">Member</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-sm font-medium">Project Collaborators</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Members</span>
                <div className="flex -space-x-2">
                  <Avatar className="size-8 border-2 border-background">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User 1" />
                    <AvatarFallback className="text-xs">U1</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-8 border-2 border-background">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User 2" />
                    <AvatarFallback className="text-xs">U2</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-8 border-2 border-background">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User 3" />
                    <AvatarFallback className="text-xs">U3</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-8 border-2 border-background">
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">+8</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                <Users className="h-4 w-4 mr-2" />
                View All Members
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Guidelines */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Platform Guidelines</h4>
          <p className="text-sm text-muted-foreground">Best practices for avatar usage across different platforms</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="p-4 border rounded-lg space-y-3">
            <h5 className="text-sm font-semibold">Mobile</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Minimum 32px size for touch</li>
              <li>Use clear, high-contrast initials</li>
              <li>Limit avatar groups to 3-4</li>
              <li>Ensure status indicators are visible</li>
            </ul>
            <div className="flex gap-2">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">MB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>MB</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <h5 className="text-sm font-semibold">Tablet</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Standard 40-48px sizes work well</li>
              <li>Support hover interactions</li>
              <li>Avatar groups up to 5 members</li>
              <li>Enhanced status indicators</li>
            </ul>
            <div className="flex gap-2">
              <Avatar>
                <AvatarFallback>TB</AvatarFallback>
              </Avatar>
              <Avatar className="size-12">
                <AvatarFallback>TB</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <h5 className="text-sm font-semibold">Desktop</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Compact 32-40px for lists</li>
              <li>Rich hover effects and tooltips</li>
              <li>Larger groups supported</li>
              <li>Multiple status indicators</li>
            </ul>
            <div className="flex gap-2">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">DK</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>DK</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <h5 className="text-sm font-semibold">Kiosk (32\")</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Minimum 64-80px for visibility</li>
              <li>High contrast colors required</li>
              <li>Large, clear initials/icons</li>
              <li>Simple, obvious status badges</li>
            </ul>
            <div className="flex gap-2">
              <Avatar className="size-14">
                <AvatarFallback className="text-lg">KK</AvatarFallback>
              </Avatar>
              <Avatar className="size-20">
                <AvatarFallback className="text-2xl">KK</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}