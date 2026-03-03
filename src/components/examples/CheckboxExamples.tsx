import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { PlatformGuideline } from "../PlatformGuideline";
import { Smartphone, Tablet, Monitor, RectangleVertical } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export function CheckboxExamples() {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <PlatformGuideline
          platform="mobile"
          icon={Smartphone}
          title="Mobile Checkbox"
          description="Large, touch-friendly checkbox controls"
          guidelines={[
            "Large touch targets for checkboxes (24px minimum)",
            "Generous spacing between checkbox options",
            "Clear visual hierarchy and labeling",
            "Full-width clickable areas for options",
            "Immediate visual feedback on selection"
          ]}
          example={
            <div className="space-y-4 max-w-[280px]">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Features</Label>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors">
                    <Checkbox id="mobile-notifications" className="mt-0.5 h-5 w-5" defaultChecked />
                    <div className="flex-1">
                      <Label htmlFor="mobile-notifications" className="text-sm font-medium cursor-pointer">
                        Push Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive alerts about updates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors">
                    <Checkbox id="mobile-location" className="mt-0.5 h-5 w-5" defaultChecked />
                    <div className="flex-1">
                      <Label htmlFor="mobile-location" className="text-sm font-medium cursor-pointer">
                        Location Services
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Enable location-based features
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors">
                    <Checkbox id="mobile-analytics" className="mt-0.5 h-5 w-5" />
                    <div className="flex-1">
                      <Label htmlFor="mobile-analytics" className="text-sm font-medium cursor-pointer">
                        Analytics
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Help improve the app
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium">Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-gray-50/50 transition-colors">
                    <Checkbox id="mobile-email-pref" className="h-5 w-5" defaultChecked />
                    <Label htmlFor="mobile-email-pref" className="text-sm cursor-pointer">Email updates</Label>
                  </div>
                  <div className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-gray-50/50 transition-colors">
                    <Checkbox id="mobile-sms-pref" className="h-5 w-5" />
                    <Label htmlFor="mobile-sms-pref" className="text-sm cursor-pointer">SMS updates</Label>
                  </div>
                  <div className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-gray-50/50 transition-colors">
                    <Checkbox id="mobile-newsletter" className="h-5 w-5" />
                    <Label htmlFor="mobile-newsletter" className="text-sm cursor-pointer">Newsletter</Label>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <PlatformGuideline
          platform="tablet"
          icon={Tablet}
          title="Tablet Checkbox"
          description="Enhanced checkbox selection with richer presentations"
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
                <Label className="text-base font-medium">Add-ons</Label>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-sm transition-all">
                    <Checkbox id="tablet-premium" className="mt-1 h-4 w-4" defaultChecked />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="tablet-premium" className="font-medium cursor-pointer">
                        Premium Support
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        24/7 priority support with dedicated account manager.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-lepos-cyan/10 text-lepos-cyan-dark px-2 py-1 rounded-full">+$19/mo</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-sm transition-all">
                    <Checkbox id="tablet-storage" className="mt-1 h-4 w-4" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="tablet-storage" className="font-medium cursor-pointer">
                        Extra Storage
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Additional 50GB cloud storage for your files.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-lepos-cyan/10 text-lepos-cyan-dark px-2 py-1 rounded-full">+$9/mo</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-sm transition-all">
                    <Checkbox id="tablet-backup" className="mt-1 h-4 w-4" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="tablet-backup" className="font-medium cursor-pointer">
                        Automated Backup
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Daily automatic backups to secure cloud storage.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Free</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <PlatformGuideline
          platform="desktop"
          icon={Monitor}
          title="Desktop Checkbox"
          description="Compact checkbox selection for dense interfaces"
          guidelines={[
            "Compact sizing for efficient screen usage",
            "Subtle hover effects for precise cursor control",
            "Keyboard navigation and focus management",
            "Support for indeterminate states",
            "Context-sensitive layouts and spacing"
          ]}
          example={
            <div className="space-y-4 max-w-[320px]">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Table Columns</Label>
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="desktop-name" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="desktop-name" className="text-sm cursor-pointer">Name</Label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="desktop-email" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="desktop-email" className="text-sm cursor-pointer">Email</Label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="desktop-date" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="desktop-date" className="text-sm cursor-pointer">Date Created</Label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="desktop-status" className="h-4 w-4" />
                      <Label htmlFor="desktop-status" className="text-sm cursor-pointer">Status</Label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="desktop-actions" className="h-4 w-4" />
                      <Label htmlFor="desktop-actions" className="text-sm cursor-pointer">Actions</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Export Options</Label>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2 px-3 py-2 border rounded hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors">
                    <Checkbox id="desktop-headers" className="h-4 w-4" defaultChecked />
                    <Label htmlFor="desktop-headers" className="text-sm cursor-pointer">Include Headers</Label>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 border rounded hover:bg-gray-50/50 hover:border-lepos-cyan/30 transition-colors">
                    <Checkbox id="desktop-metadata" className="h-4 w-4" />
                    <Label htmlFor="desktop-metadata" className="text-sm cursor-pointer">Metadata</Label>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <PlatformGuideline
          platform="kiosk"
          icon={RectangleVertical}
          title="Kiosk Checkbox"
          description="Large, accessible checkbox selection for public use"
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
                <Label className="text-lg font-semibold">Select Services</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 p-4 border-2 rounded-xl hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-md transition-all">
                    <Checkbox id="kiosk-consultation" className="h-6 w-6" defaultChecked />
                    <div className="flex-1">
                      <Label htmlFor="kiosk-consultation" className="text-base font-medium cursor-pointer">
                        General Consultation
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        30-minute session
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border-2 rounded-xl hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-md transition-all">
                    <Checkbox id="kiosk-screening" className="h-6 w-6" />
                    <div className="flex-1">
                      <Label htmlFor="kiosk-screening" className="text-base font-medium cursor-pointer">
                        Health Screening
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Basic health assessment
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border-2 rounded-xl hover:bg-gray-50/50 hover:border-lepos-cyan/40 hover:shadow-md transition-all">
                    <Checkbox id="kiosk-documents" className="h-6 w-6" />
                    <div className="flex-1">
                      <Label htmlFor="kiosk-documents" className="text-base font-medium cursor-pointer">
                        Get Documents
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Print or email records
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* Alignment Verification Section */}
      <div className="rounded-lg border-2 border-lepos-cyan/30 bg-lepos-dark-brand/5 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-lepos-cyan mb-2">
            ✓ Checkbox & Radio Button Alignment
          </h3>
          <p className="text-sm text-muted-foreground">
            Checkboxes and radio buttons share identical dimensions to prevent text shifting when used together in settings panels.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Desktop Example */}
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-medium mb-3">Desktop (16px)</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox id="align-desktop-check" className="h-4 w-4" defaultChecked />
                <Label htmlFor="align-desktop-check" className="text-sm cursor-pointer">Enable notifications</Label>
              </div>
              <RadioGroup defaultValue="auto">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="auto" id="align-desktop-radio1" className="h-4 w-4" />
                  <Label htmlFor="align-desktop-radio1" className="text-sm cursor-pointer">Auto sync</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="manual" id="align-desktop-radio2" className="h-4 w-4" />
                  <Label htmlFor="align-desktop-radio2" className="text-sm cursor-pointer">Manual sync</Label>
                </div>
              </RadioGroup>
              <div className="flex items-center gap-3">
                <Checkbox id="align-desktop-check2" className="h-4 w-4" />
                <Label htmlFor="align-desktop-check2" className="text-sm cursor-pointer">Dark mode</Label>
              </div>
            </div>
          </div>

          {/* Mobile Example */}
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-medium mb-3">Mobile/iPad (20px)</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox id="align-mobile-check" className="h-5 w-5" defaultChecked />
                <Label htmlFor="align-mobile-check" className="text-sm cursor-pointer">Enable notifications</Label>
              </div>
              <RadioGroup defaultValue="auto-mobile">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="auto-mobile" id="align-mobile-radio1" className="h-5 w-5" />
                  <Label htmlFor="align-mobile-radio1" className="text-sm cursor-pointer">Auto sync</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="manual-mobile" id="align-mobile-radio2" className="h-5 w-5" />
                  <Label htmlFor="align-mobile-radio2" className="text-sm cursor-pointer">Manual sync</Label>
                </div>
              </RadioGroup>
              <div className="flex items-center gap-3">
                <Checkbox id="align-mobile-check2" className="h-5 w-5" />
                <Label htmlFor="align-mobile-check2" className="text-sm cursor-pointer">Dark mode</Label>
              </div>
            </div>
          </div>

          {/* Kiosk Example */}
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-medium mb-3">Kiosk (24px)</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox id="align-kiosk-check" className="h-6 w-6" defaultChecked />
                <Label htmlFor="align-kiosk-check" className="text-sm cursor-pointer">Enable notifications</Label>
              </div>
              <RadioGroup defaultValue="auto-kiosk">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="auto-kiosk" id="align-kiosk-radio1" className="h-6 w-6" />
                  <Label htmlFor="align-kiosk-radio1" className="text-sm cursor-pointer">Auto sync</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="manual-kiosk" id="align-kiosk-radio2" className="h-6 w-6" />
                  <Label htmlFor="align-kiosk-radio2" className="text-sm cursor-pointer">Manual sync</Label>
                </div>
              </RadioGroup>
              <div className="flex items-center gap-3">
                <Checkbox id="align-kiosk-check2" className="h-6 w-6" />
                <Label htmlFor="align-kiosk-check2" className="text-sm cursor-pointer">Dark mode</Label>
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