import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Palette, Layout, Grid3x3, Book, Type, Image, Tag } from "lucide-react";
import { LeposLogo } from "../LeposLogo";
import { brandColors, semanticColors, typographyScale } from "../design-constants";
import { tagColors, tagColorsByGroupAndCategory, tagCategories } from "../design-constants-tags";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SectionIcon } from "../ui/section-icon";

export function FoundationsTab() {
  return (
    <div className="space-y-8">
      {/* Reusability Quick Info */}
      <Card className="border-lepos-dark-brand/30 bg-gradient-to-br from-lepos-dark-brand/5 to-lepos-cyan/5">
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <div className="flex gap-2">
            <SectionIcon icon={Book} color="text-lepos-dark-brand" className="mt-1" />
            <div className="space-y-1">
              <CardTitle>Using This Design System in Other Projects</CardTitle>
              <CardDescription>
                This design system is fully reusable across all your Figma Make projects
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-[21px]">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-lepos-cyan-text">3</div>
              <p className="text-sm font-medium">Files to Copy</p>
              <p className="text-xs text-muted-foreground">globals.css, /components/ui/, and design-constants.ts</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-lepos-cyan-text">45+</div>
              <p className="text-sm font-medium">Components Ready</p>
              <p className="text-xs text-muted-foreground">Pre-styled buttons, forms, navigation, and more</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-lepos-cyan-text">100%</div>
              <p className="text-sm font-medium">Brand Consistency</p>
              <p className="text-xs text-muted-foreground">Automatic Lepos branding across all projects</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-background rounded-lg border text-xs text-muted-foreground">
            <span className="font-semibold">💡 Tip:</span> Check the <span className="text-lepos-cyan-text font-medium">Resources</span> tab for the complete reusability guide with step-by-step instructions.
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-lepos-cyan/20">
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Palette} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Design Tokens</CardTitle>
                <CardDescription>
                  Color, spacing, typography, and visual tokens
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-[21px]">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Brand color palette with semantic variants</li>
              <li>• Responsive spacing scale (4px to 48px)</li>
              <li>• Typography system with fluid scaling</li>
              <li>• Border radius and shadow utilities</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-lepos-cyan/20">
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Layout} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Component Library</CardTitle>
                <CardDescription>
                  Reusable UI components with platform variants
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-[21px]">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 45+ production-ready components</li>
              <li>• Platform-specific adaptations</li>
              <li>• Accessibility built-in (WCAG AA)</li>
              <li>• Dark/light theme support</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-lepos-cyan/20">
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Grid3x3} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Design Patterns</CardTitle>
                <CardDescription>
                  Common UI patterns and layout solutions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-[21px]">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Navigation patterns for all screen sizes</li>
              <li>• Form layouts and input patterns</li>
              <li>• Data display and visualization</li>
              <li>• Modal and overlay patterns</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-lepos-cyan/20">
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Book} className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Documentation</CardTitle>
                <CardDescription>
                  Implementation guides and best practices
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-[21px]">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Platform-specific guidelines</li>
              <li>• Code examples and snippets</li>
              <li>• Accessibility requirements</li>
              <li>• Performance considerations</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Logo Usage Guidelines */}
      <Card>
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <div className="flex gap-2">
            <SectionIcon icon={Image} color="text-secondary" className="mt-1" />
            <div className="space-y-1">
              <CardTitle>Brand Identity & Logo Usage</CardTitle>
              <CardDescription>
                Guidelines for proper usage of the Lepos logo with updated cyan color
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-[21px]">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h6 className="font-medium">Logo Variants</h6>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <LeposLogo size="sm" variant="default" />
                    <div>
                      <p className="font-medium text-sm">Default Logo</p>
                      <p className="text-xs text-muted-foreground">Primary usage on light backgrounds</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Primary</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg bg-lepos-dark">
                  <div className="flex items-center gap-3">
                    <LeposLogo size="sm" variant="light" />
                    <div>
                      <p className="font-medium text-sm text-white">Light Logo</p>
                      <p className="text-xs text-white/70">For dark backgrounds and overlays</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">Dark BG</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <LeposLogo size="sm" variant="monochrome" />
                    <div>
                      <p className="font-medium text-sm">Monochrome Logo</p>
                      <p className="text-xs text-muted-foreground">Single color applications</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Utility</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h6 className="font-medium">Usage Guidelines</h6>
              <div className="space-y-3 text-sm">
                <div className="p-3 border rounded-lg bg-success/10 border-success/20">
                  <h6 className="font-medium text-success mb-2">✓ Do</h6>
                  <ul className="text-success/80 space-y-1">
                    <li>• Use the updated Lepos Cyan (#31D7DB) for accent elements</li>
                    <li>• Maintain minimum size of 16px for digital applications</li>
                    <li>• Ensure adequate clear space around the logo</li>
                    <li>• Use appropriate variant for background contrast</li>
                  </ul>
                </div>
                
                <div className="p-3 border rounded-lg bg-destructive/10 border-destructive/20">
                  <h6 className="font-medium text-destructive mb-2">✗ Don't</h6>
                  <ul className="text-destructive/80 space-y-1">
                    <li>• Modify the cyan color or use outdated versions</li>
                    <li>• Stretch or distort the logo proportions</li>
                    <li>• Place on low-contrast backgrounds</li>
                    <li>• Use below minimum size requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access to Foundations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Palette} color="text-secondary" className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>
                  Core brand colors that define the Lepos visual identity
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-[21px]">
            <div className="grid gap-4 sm:grid-cols-2">
              {brandColors.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div className={`w-full h-16 rounded-lg ${color.class} border relative`}>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm mix-blend-difference">
                      {color.value}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{color.name}</p>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">--{color.token}</code>
                    </div>
                    <p className="text-xs text-muted-foreground">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Color Usage Rules */}
            <div className="mt-6 pt-6 border-t space-y-3">
              <h6 className="font-medium text-sm">Color Usage Rules</h6>
              <div className="space-y-3 text-xs">
                <div className="p-3 border rounded-lg bg-lepos-cyan/5 border-lepos-cyan/20">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-lepos-cyan"></span>
                    Lepos Cyan (#31D7DB)
                  </p>
                  <ul className="text-muted-foreground space-y-1 ml-5">
                    <li>• Decorative elements (bullets, icons, dividers)</li>
                    <li>• Secondary buttons and backgrounds</li>
                    <li>• Visual accents and highlights</li>
                  </ul>
                </div>
                
                <div className="p-3 border rounded-lg bg-lepos-cyan-text/5 border-[#107DAC]/20">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#107DAC]"></span>
                    Lepos Cyan Text (#107DAC)
                  </p>
                  <ul className="text-muted-foreground space-y-1 ml-5">
                    <li>• Inline text within paragraphs</li>
                    <li>• Large stat numbers and metrics</li>
                    <li>• Readable text on dark backgrounds</li>
                  </ul>
                </div>
                
                <div className="p-3 border rounded-lg bg-lepos-dark-brand/5 border-lepos-dark-brand/20">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-lepos-dark-brand"></span>
                    Lepos Dark Brand (#023F59)
                  </p>
                  <ul className="text-muted-foreground space-y-1 ml-5">
                    <li>• Primary action buttons</li>
                    <li>• Hero sections and feature highlights</li>
                    <li>• Special brand badges and moments</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
            <div className="flex gap-2">
              <SectionIcon icon={Palette} color="text-secondary" className="mt-1" />
              <div className="space-y-1">
                <CardTitle>Semantic Colors</CardTitle>
                <CardDescription>
                  Contextual colors that adapt to light and dark themes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-[21px]">
            <div className="grid gap-3 sm:grid-cols-2">
              {semanticColors.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div className={`w-full h-12 rounded-lg ${color.class} border relative`}>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-xs mix-blend-difference">
                      {color.value}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{color.name}</p>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">--{color.token}</code>
                    </div>
                    <p className="text-xs text-muted-foreground">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Semantic Color Usage Rules */}
            <div className="mt-6 pt-6 border-t space-y-3">
              <h6 className="font-medium text-sm">Semantic Color Usage Guidelines</h6>
              <div className="space-y-3 text-xs">
                <div className="p-3 border rounded-lg bg-lepos-dark-brand/5 border-lepos-dark-brand/20">
                  <p className="font-medium mb-2">Primary (Lepos Dark Brand #023F59)</p>
                  <ul className="text-muted-foreground space-y-1 ml-5">
                    <li>• Main call-to-action buttons (Submit, Save, Create)</li>
                    <li>• Primary navigation highlights</li>
                    <li>• Key brand moments and hero sections</li>
                  </ul>
                </div>
                
                <div className="p-3 border rounded-lg bg-lepos-cyan/5 border-lepos-cyan/20">
                  <p className="font-medium mb-2">Secondary (Lepos Cyan #31D7DB)</p>
                  <ul className="text-muted-foreground space-y-1 ml-5">
                    <li>• Secondary actions (Cancel, Back, Optional)</li>
                    <li>• Decorative elements and accents</li>
                    <li>• Alternative buttons and links</li>
                  </ul>
                </div>
                
                <div className="p-3 border rounded-lg bg-accent/5 border-accent/20">
                  <p className="font-medium mb-2">Accent & Muted</p>
                  <ul className="text-muted-foreground space-y-1 ml-5">
                    <li>• <strong>Accent:</strong> Highlights, badges, notifications</li>
                    <li>• <strong>Muted:</strong> Subtle text, disabled states, placeholders</li>
                  </ul>
                </div>
                
                <div className="p-3 border rounded-lg bg-destructive/5 border-destructive/20">
                  <p className="font-medium mb-2">Destructive & Success</p>
                  <ul className="text-muted-foreground space-y-1 ml-5">
                    <li>• <strong>Destructive:</strong> Delete, remove, error states</li>
                    <li>• <strong>Success:</strong> Confirmations, completed actions</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Typography Scale */}
      <Card>
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <div className="flex gap-2">
            <SectionIcon icon={Type} color="text-secondary" className="mt-1" />
            <div className="space-y-1">
              <CardTitle>Typography Scale</CardTitle>
              <CardDescription>
                Responsive typography system with fluid scaling across all devices
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-[21px]">
          <div className="space-y-4">
            {typographyScale.slice(0, 4).map((type) => (
              <div key={type.element} className="border rounded-lg p-3">
                <div className="mb-3">
                  {type.element === "h1" && <div className="text-4xl font-bold">The quick brown fox jumps</div>}
                  {type.element === "h2" && <div className="text-3xl font-semibold">The quick brown fox jumps</div>}
                  {type.element === "h3" && <div className="text-2xl font-semibold">The quick brown fox jumps</div>}
                  {type.element === "h4" && <div className="text-xl font-medium">The quick brown fox jumps</div>}
                  {type.element === "p" && <p>The quick brown fox jumps over the lazy dog. This is body text.</p>}
                </div>
                <div className="grid gap-2 sm:grid-cols-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">{type.name}</span> - {type.size}
                  </div>
                  <div>{type.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tag Colors */}
      <Card>
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <div className="flex gap-2">
            <SectionIcon icon={Tag} color="text-secondary" className="mt-1" />
            <div className="space-y-1">
              <CardTitle>Tag Colors</CardTitle>
              <CardDescription>
                Comprehensive color palette for tags and badges with semantic meaning
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-[21px]">
          <div className="space-y-6">
            {/* Overview */}
            <div className="p-4 border rounded-lg bg-gradient-to-br from-lepos-dark-brand/5 to-lepos-cyan/5">
              <p className="text-sm text-muted-foreground">
                This color system provides semantic meaning through color while maintaining accessibility and brand consistency. Each color includes usage context and sample text to help you choose the right tag for your content.
              </p>
            </div>

            {/* Usage Guidelines */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 border rounded-lg bg-success/10 border-success/20">
                <h6 className="font-medium text-success mb-2 text-sm">✓ Lepos Brand Alignment</h6>
                <ul className="text-xs text-success/80 space-y-1">
                  <li>• <strong>Cyan (#31D7DB)</strong> - Perfect for brand highlights and tech features</li>
                  <li>• <strong>Teal/Aqua</strong> - Complements the cyan in professional contexts</li>
                  <li>• <strong>Blues/Navy</strong> - Works well with dark theme aesthetic</li>
                  <li>• <strong>Neutrals</strong> - Excellent for subtle categorization</li>
                </ul>
              </div>
              
              <div className="p-3 border rounded-lg bg-amber-500/10 border-amber-500/20">
                <h6 className="font-medium text-amber-600 dark:text-amber-400 mb-2 text-sm">⚠ Use with Care</h6>
                <ul className="text-xs text-amber-600/80 dark:text-amber-400/80 space-y-1">
                  <li>• <strong>Bright Neons</strong> - May be too vibrant for dark theme, use sparingly</li>
                  <li>• <strong>Multiple Colors</strong> - Limit to 3-4 colors per screen for clarity</li>
                  <li>• <strong>Context Matters</strong> - Ensure color choice matches content meaning</li>
                  <li>• <strong>Accessibility</strong> - Always check contrast ratios on dark backgrounds</li>
                </ul>
              </div>
            </div>

            {/* Tag Color Groups with Tabs */}
            <Tabs defaultValue="group1" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="group1">Soft Palette</TabsTrigger>
                <TabsTrigger value="group2">Bold Palette</TabsTrigger>
              </TabsList>

              {/* Soft Palette */}
              <TabsContent value="group1" className="mt-6">
                <div className="space-y-6 p-4 border rounded-lg bg-lepos-dark-brand/5 border-lepos-dark-brand/20">
                  {tagCategories.map((category) => (
                    <div key={`group1-${category}`} className="space-y-3">
                      <div className="flex items-center gap-2 pt-4 border-t first:pt-0 first:border-t-0">
                        <h6 className="font-medium text-sm">{category}</h6>
                        <div className="flex-1 border-t border-dashed"></div>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {tagColorsByGroupAndCategory.group1?.[category]?.map((tagColor) => (
                          <div key={tagColor.name} className="space-y-2">
                            {/* Color Name and Hex */}
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{tagColor.name}</p>
                              <code className="text-xs text-muted-foreground">{tagColor.hex}</code>
                            </div>
                            
                            {/* Color Block */}
                            <div className={`w-full h-16 rounded-lg ${tagColor.bgClass} flex items-center justify-center`}>
                              <span className={`font-medium text-sm ${tagColor.textClass}`}>{tagColor.hex}</span>
                            </div>
                            
                            {/* Sample Tag Badge */}
                            <div className="flex items-center justify-start">
                              <Badge 
                                className={`${tagColor.bgClass} text-gray-900 border-transparent`}
                              >
                                Sample Tag
                              </Badge>
                            </div>
                            
                            {/* Usage Description */}
                            <div className="space-y-1">
                              <p className="text-xs font-medium">{tagColor.usage}</p>
                              <p className="text-xs text-muted-foreground">{tagColor.context}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Bold Palette */}
              <TabsContent value="group2" className="mt-6">
                <div className="space-y-6 p-4 border rounded-lg bg-lepos-cyan/5 border-lepos-cyan/20">
                  {tagCategories.map((category) => (
                    <div key={`group2-${category}`} className="space-y-3">
                      <div className="flex items-center gap-2 pt-4 border-t first:pt-0 first:border-t-0">
                        <h6 className="font-medium text-sm">{category}</h6>
                        <div className="flex-1 border-t border-dashed"></div>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {tagColorsByGroupAndCategory.group2?.[category]?.map((tagColor) => (
                          <div key={tagColor.name} className="space-y-2">
                            {/* Color Name and Hex */}
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{tagColor.name}</p>
                              <code className="text-xs text-muted-foreground">{tagColor.hex}</code>
                            </div>
                            
                            {/* Color Block */}
                            <div className={`w-full h-16 rounded-lg ${tagColor.bgClass} flex items-center justify-center`}>
                              <span className={`font-medium text-sm ${tagColor.textClass}`}>{tagColor.hex}</span>
                            </div>
                            
                            {/* Sample Tag Badge */}
                            <div className="flex items-center justify-start">
                              <Badge 
                                className={`${tagColor.bgClass} ${tagColor.textClass} border-transparent`}
                              >
                                Sample Tag
                              </Badge>
                            </div>
                            
                            {/* Usage Description */}
                            <div className="space-y-1">
                              <p className="text-xs font-medium">{tagColor.usage}</p>
                              <p className="text-xs text-muted-foreground">{tagColor.context}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Lepos Brand Recommendation */}
            <div className="mt-6 p-4 border rounded-lg bg-lepos-dark-brand/5 border-lepos-dark-brand/20">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-lepos-cyan/20 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-lepos-cyan-text" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h6 className="font-medium text-sm">💡 Lepos Brand Color Recommendations</h6>
                  <p className="text-xs text-muted-foreground">
                    For optimal brand consistency with the Lepos dark theme aesthetic, we recommend primarily using:
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-[#31D7DB]/10 text-[#107DAC] border-[#31D7DB]/20">Cyan</Badge>
                      <span className="text-muted-foreground">Brand moments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-[#14B8A6]/10 text-[#14B8A6] border-[#14B8A6]/20">Teal</Badge>
                      <span className="text-muted-foreground">Action states</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
