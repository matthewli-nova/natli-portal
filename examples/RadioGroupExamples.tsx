import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Phone } from "lucide-react";
import { PlatformGuideline } from "../PlatformGuideline";
import { Smartphone, Tablet, Monitor, RectangleVertical } from "lucide-react";

export function RadioGroupExamples() {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <PlatformGuideline
          platform="mobile"
          icon={Smartphone}
          title="Mobile Radio Group"
          description="Large, touch-friendly radio button selection"
          guidelines={[
            "Large touch targets for radio buttons (24px minimum)",
            "Generous spacing between radio options",
            "Clear visual hierarchy and labeling",
            "Full-width clickable areas for options",
            "Immediate visual feedback on selection"
          ]}
          example={
            <div className="space-y-4 max-w-[280px]">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Delivery Method</Label>
                <RadioGroup defaultValue="standard" className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors cursor-pointer">
                    <RadioGroupItem value="standard" id="mobile-standard" className="h-5 w-5" />
                    <div className="flex-1">
                      <Label htmlFor="mobile-standard" className="text-sm font-medium cursor-pointer">
                        Standard Delivery
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        5-7 business days • Free
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors cursor-pointer">
                    <RadioGroupItem value="express" id="mobile-express" className="h-5 w-5" />
                    <div className="flex-1">
                      <Label htmlFor="mobile-express" className="text-sm font-medium cursor-pointer">
                        Express Delivery
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        2-3 business days • $9.99
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors cursor-pointer">
                    <RadioGroupItem value="overnight" id="mobile-overnight" className="h-5 w-5" />
                    <div className="flex-1">
                      <Label htmlFor="mobile-overnight" className="text-sm font-medium cursor-pointer">
                        Overnight Delivery
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Next business day • $19.99
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium">Notification Preference</Label>
                <RadioGroup defaultValue="email" className="space-y-2">
                  <div className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="email" id="mobile-email" className="h-5 w-5" />
                    <Label htmlFor="mobile-email" className="text-sm cursor-pointer">Email notifications</Label>
                  </div>
                  <div className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="sms" id="mobile-sms" className="h-5 w-5" />
                    <Label htmlFor="mobile-sms" className="text-sm cursor-pointer">SMS notifications</Label>
                  </div>
                  <div className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="none" id="mobile-none" className="h-5 w-5" />
                    <Label htmlFor="mobile-none" className="text-sm cursor-pointer">No notifications</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          }
        />

        <PlatformGuideline
          platform="tablet"
          icon={Tablet}
          title="Tablet Radio Group"
          description="Enhanced radio selection with richer presentations"
          guidelines={[
            "Medium-sized targets optimized for touch and mouse",
            "Enhanced hover states for better feedback",
            "Support for both touch and pointer devices",
            "Rich content layouts with descriptions",
            "Responsive spacing and typography"
          ]}
          example={
            <div className="space-y-4 max-w-[320px]">
              <div className="space-y-3">
                <Label className="text-base font-medium">Account Type</Label>
                <RadioGroup defaultValue="personal" className="space-y-2">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-sm transition-all cursor-pointer">
                    <RadioGroupItem value="personal" id="tablet-personal" className="h-4 w-4 mt-1" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="tablet-personal" className="font-medium cursor-pointer">
                        Personal Account
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Perfect for individual use with basic features and personal data storage.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Free</span>
                        <span className="text-xs text-muted-foreground">Up to 5GB storage</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-sm transition-all cursor-pointer">
                    <RadioGroupItem value="business" id="tablet-business" className="h-4 w-4 mt-1" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="tablet-business" className="font-medium cursor-pointer">
                        Business Account
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Advanced features for teams with collaboration tools and priority support.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-lepos-cyan/10 text-lepos-cyan-dark px-2 py-1 rounded-full">$29/mo</span>
                        <span className="text-xs text-muted-foreground">Unlimited storage</span>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          }
        />

        <PlatformGuideline
          platform="desktop"
          icon={Monitor}
          title="Desktop Radio Group"
          description="Compact radio selection for dense interfaces"
          guidelines={[
            "Compact sizing for efficient screen usage",
            "Subtle hover effects for precise cursor control",
            "Keyboard navigation and focus management",
            "Rich tooltips for additional information",
            "Context-sensitive layouts and spacing"
          ]}
          example={
            <div className="space-y-4 max-w-[320px]">
              <div className="space-y-3">
                <Label className="text-sm font-medium">View Mode</Label>
                <RadioGroup defaultValue="grid" className="flex gap-3">
                  <div className="flex items-center space-x-2 px-3 py-2 border rounded hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors cursor-pointer">
                    <RadioGroupItem value="grid" id="desktop-grid" className="h-4 w-4" />
                    <Label htmlFor="desktop-grid" className="text-sm cursor-pointer">Grid</Label>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 border rounded hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors cursor-pointer">
                    <RadioGroupItem value="list" id="desktop-list" className="h-4 w-4" />
                    <Label htmlFor="desktop-list" className="text-sm cursor-pointer">List</Label>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 border rounded hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors cursor-pointer">
                    <RadioGroupItem value="card" id="desktop-card" className="h-4 w-4" />
                    <Label htmlFor="desktop-card" className="text-sm cursor-pointer">Cards</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Data Export Format</Label>
                <RadioGroup defaultValue="csv" className="space-y-1">
                  <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="csv" id="desktop-csv" className="h-4 w-4" />
                      <Label htmlFor="desktop-csv" className="text-sm cursor-pointer">CSV File</Label>
                    </div>
                    <span className="text-xs text-muted-foreground">.csv</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="json" id="desktop-json" className="h-4 w-4" />
                      <Label htmlFor="desktop-json" className="text-sm cursor-pointer">JSON Data</Label>
                    </div>
                    <span className="text-xs text-muted-foreground">.json</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="desktop-pdf" className="h-4 w-4" />
                      <Label htmlFor="desktop-pdf" className="text-sm cursor-pointer">PDF Report</Label>
                    </div>
                    <span className="text-xs text-muted-foreground">.pdf</span>
                  </div>
                </RadioGroup>
              </div>
            </div>
          }
        />

        <PlatformGuideline
          platform="kiosk"
          icon={RectangleVertical}
          title="Kiosk Radio Group"
          description="Large, accessible radio selection for public use"
          guidelines={[
            "Extra-large touch targets (32px minimum)",
            "High contrast and bold visual styling",
            "Simple language and clear instructions",
            "Obvious selection states and feedback",
            "Error prevention and recovery design"
          ]}
          example={
            <div className="space-y-6 max-w-[320px]">
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Choose Your Service</Label>
                <RadioGroup defaultValue="checkin" className="space-y-3">
                  <div className="flex items-center space-x-4 p-4 border-2 rounded-xl hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-md transition-all cursor-pointer">
                    <RadioGroupItem value="checkin" id="kiosk-checkin" className="h-6 w-6" />
                    <div className="flex-1">
                      <Label htmlFor="kiosk-checkin" className="text-base font-medium cursor-pointer">
                        Check-In
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Register your arrival
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border-2 rounded-xl hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-md transition-all cursor-pointer">
                    <RadioGroupItem value="appointment" id="kiosk-appointment" className="h-6 w-6" />
                    <div className="flex-1">
                      <Label htmlFor="kiosk-appointment" className="text-base font-medium cursor-pointer">
                        Schedule Appointment
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Book a new appointment
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border-2 rounded-xl hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-md transition-all cursor-pointer">
                    <RadioGroupItem value="information" id="kiosk-information" className="h-6 w-6" />
                    <div className="flex-1">
                      <Label htmlFor="kiosk-information" className="text-base font-medium cursor-pointer">
                        Get Information
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        View services and hours
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          }
        />
      </div>

      {/* Alignment Verification Section */}
      <div className="rounded-lg border-2 border-lepos-cyan/30 bg-lepos-dark-brand/5 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-lepos-cyan mb-2">
            ✓ Radio Button & Checkbox Alignment
          </h3>
          <p className="text-sm text-muted-foreground">
            Radio buttons and checkboxes share identical dimensions to prevent text shifting when used together in settings panels.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Desktop Example */}
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-medium mb-3">Desktop (16px)</h4>
            <div className="space-y-3">
              <RadioGroup defaultValue="auto">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="auto" id="align2-desktop-radio1" className="h-4 w-4" />
                  <Label htmlFor="align2-desktop-radio1" className="text-sm cursor-pointer">Auto sync</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="manual" id="align2-desktop-radio2" className="h-4 w-4" />
                  <Label htmlFor="align2-desktop-radio2" className="text-sm cursor-pointer">Manual sync</Label>
                </div>
              </RadioGroup>
              <div className="flex items-center gap-3">
                <Checkbox id="align2-desktop-check" className="h-4 w-4" defaultChecked />
                <Label htmlFor="align2-desktop-check" className="text-sm cursor-pointer">Enable notifications</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="align2-desktop-check2" className="h-4 w-4" />
                <Label htmlFor="align2-desktop-check2" className="text-sm cursor-pointer">Dark mode</Label>
              </div>
            </div>
          </div>

          {/* Mobile Example */}
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-medium mb-3">Mobile/iPad (20px)</h4>
            <div className="space-y-3">
              <RadioGroup defaultValue="auto-mobile2">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="auto-mobile2" id="align2-mobile-radio1" className="h-5 w-5" />
                  <Label htmlFor="align2-mobile-radio1" className="text-sm cursor-pointer">Auto sync</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="manual-mobile2" id="align2-mobile-radio2" className="h-5 w-5" />
                  <Label htmlFor="align2-mobile-radio2" className="text-sm cursor-pointer">Manual sync</Label>
                </div>
              </RadioGroup>
              <div className="flex items-center gap-3">
                <Checkbox id="align2-mobile-check" className="h-5 w-5" defaultChecked />
                <Label htmlFor="align2-mobile-check" className="text-sm cursor-pointer">Enable notifications</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="align2-mobile-check2" className="h-5 w-5" />
                <Label htmlFor="align2-mobile-check2" className="text-sm cursor-pointer">Dark mode</Label>
              </div>
            </div>
          </div>

          {/* Kiosk Example */}
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-medium mb-3">Kiosk (24px)</h4>
            <div className="space-y-3">
              <RadioGroup defaultValue="auto-kiosk2">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="auto-kiosk2" id="align2-kiosk-radio1" className="h-6 w-6" />
                  <Label htmlFor="align2-kiosk-radio1" className="text-sm cursor-pointer">Auto sync</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="manual-kiosk2" id="align2-kiosk-radio2" className="h-6 w-6" />
                  <Label htmlFor="align2-kiosk-radio2" className="text-sm cursor-pointer">Manual sync</Label>
                </div>
              </RadioGroup>
              <div className="flex items-center gap-3">
                <Checkbox id="align2-kiosk-check" className="h-6 w-6" defaultChecked />
                <Label htmlFor="align2-kiosk-check" className="text-sm cursor-pointer">Enable notifications</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="align2-kiosk-check2" className="h-6 w-6" />
                <Label htmlFor="align2-kiosk-check2" className="text-sm cursor-pointer">Dark mode</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-md bg-background/50 border border-border">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Technical Details:</strong> Both components share <code className="text-foreground">aspect-square</code>, <code className="text-foreground">size-4</code> (default), <code className="text-foreground">border</code>, and <code className="text-foreground">shrink-0</code> classes, ensuring identical spacing across all platform sizes.
          </p>
        </div>
      </div>
    </div>
  );
}