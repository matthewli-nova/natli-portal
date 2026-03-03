import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MousePointerClick, FormInput, MessageSquare, LayoutGrid, Navigation, Layers, BarChart3, LayoutDashboard } from "lucide-react";
import { componentNavigation } from "../design-constants";
import { ScopeSwitcher } from "../ScopeSwitcher";
import { SectionIcon } from "../ui/section-icon";

// Import all example components
import { ButtonExamples, IconButtonExamples, InputExamples, SwitchSliderExamples, PhoneInputExample } from "../examples/FormComponentExamples";
import { DashboardComponentExamples, FilterSelectExamples, ChangeIndicatorExamples, CardChartAlignmentExamples, CardHeaderActionExamples, PickerExamples } from "../examples/DashboardComponentExamples";
import { CardExamples, AccordionCollapsibleExamples, TabsExamples } from "../examples/LayoutComponentExamples";
import { BreadcrumbExamples, PaginationExamples, SimpleNavigationExamples, ScopeSwitcherExamples } from "../examples/NavigationComponentExamples";
import { SidebarExamples } from "../examples/SidebarComponentExamples";
import { DialogExamples, SheetExamples, PopoverTooltipExamples, AlertDialogDropdownExamples } from "../examples/OverlayComponentExamples";
import { RadioGroupExamples } from "../examples/RadioGroupExamples";
import { BadgeExamples, TooltipExamples, AvatarExamples } from "../examples/DataDisplayExamples";
import { CheckboxExamples } from "../examples/CheckboxExamples";

interface ComponentsTabProps {
  scrollToComponent: (componentId: string) => void;
}

export function ComponentsTab({ scrollToComponent }: ComponentsTabProps) {
  const [activeComponentTab, setActiveComponentTab] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setActiveComponentTab(categoryId);
  };

  const handleComponentClick = (componentId: string) => {
    const category = componentNavigation.find(cat => 
      cat.components.some(comp => comp.id === componentId)
    );
    if (category) {
      setActiveComponentTab(category.id);
      setTimeout(() => {
        scrollToComponent(componentId);
      }, 100);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      MousePointerClick,
      FormInput,
      MessageSquare,
      LayoutGrid,
      Navigation,
      Layers,
      BarChart3,
      LayoutDashboard
    };
    return icons[iconName] || Layers;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
          <div className="flex gap-2">
            <SectionIcon icon={Layers} className="mt-1" />
            <div className="space-y-1">
              <CardTitle>Component Library</CardTitle>
              <CardDescription>
                Comprehensive collection of UI components optimized for mobile, tablet, desktop, and kiosk platforms.
                Each component includes platform-specific examples and implementation guidelines.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-[21px]">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-6">
            {componentNavigation.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              
              return (
                                <div 
                  key={category.id} 
                  className="flex flex-col gap-3 p-4 border rounded-lg hover:border-secondary/30 hover:bg-secondary/5 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.count} components</p>
                    </div>
                  </div>
                  
                  <div className="ml-8 space-y-1.5">
                    {category.components.map((component) => (
                      <div 
                        key={component.id} 
                        className="flex items-center justify-between gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors group/item"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComponentClick(component.id);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-secondary/50 group-hover/item:bg-secondary transition-colors"></div>
                          <span>{component.label}</span>
                        </div>
                        {component.id === 'picker-component' && (
                          <span className="px-1.5 py-0.5 rounded-full bg-secondary/10 text-[9px] font-bold text-secondary tracking-tight">NEW</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Component Categories Tabbed Interface */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="h-px bg-border flex-1"></div>
            <span className="px-3 bg-background">Component Categories</span>
            <div className="h-px bg-border flex-1"></div>
          </div>
        </div>
        
        <Tabs value={activeComponentTab} onValueChange={setActiveComponentTab} className="space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex p-2 bg-gradient-to-r from-muted/40 to-muted/20 rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm overflow-x-auto">
              <TabsList className="grid grid-cols-8 bg-transparent gap-2 h-auto p-0">
                <TabsTrigger 
                  value="all" 
                  className="group relative flex items-center gap-2 px-4 py-3 rounded-xl bg-background/60 border border-border/30 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary/90 data-[state=active]:to-secondary/70 data-[state=active]:text-secondary-foreground data-[state=active]:border-secondary/30 data-[state=active]:shadow-sm hover:bg-secondary/8 hover:border-secondary/25 transition-all duration-300 font-medium text-sm min-w-[80px] justify-center transform hover:scale-[1.02]"
                >
                  <Layers className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">All</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="buttons-actions" 
                  className="group relative flex items-center gap-2 px-4 py-3 rounded-xl bg-background/60 border border-border/30 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary/90 data-[state=active]:to-secondary/70 data-[state=active]:text-secondary-foreground data-[state=active]:border-secondary/30 data-[state=active]:shadow-sm hover:bg-secondary/8 hover:border-secondary/25 transition-all duration-300 font-medium text-sm min-w-[80px] justify-center transform hover:scale-[1.02]"
                >
                  <MousePointerClick className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Actions</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="form-inputs" 
                  className="group relative flex items-center gap-2 px-4 py-3 rounded-xl bg-background/60 border border-border/30 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary/90 data-[state=active]:to-secondary/70 data-[state=active]:text-secondary-foreground data-[state=active]:border-secondary/30 data-[state=active]:shadow-sm hover:bg-secondary/8 hover:border-secondary/25 transition-all duration-300 font-medium text-sm min-w-[80px] justify-center transform hover:scale-[1.02]"
                >
                  <FormInput className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Inputs</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="data-display" 
                  className="group relative flex items-center gap-2 px-4 py-3 rounded-xl bg-background/60 border border-border/30 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary/90 data-[state=active]:to-secondary/70 data-[state=active]:text-secondary-foreground data-[state=active]:border-secondary/30 data-[state=active]:shadow-sm hover:bg-secondary/8 hover:border-secondary/25 transition-all duration-300 font-medium text-sm min-w-[80px] justify-center transform hover:scale-[1.02]"
                >
                  <BarChart3 className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Display</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="feedback" 
                  className="group relative flex items-center gap-2 px-4 py-3 rounded-xl bg-background/60 border border-border/30 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary/90 data-[state=active]:to-secondary/70 data-[state=active]:text-secondary-foreground data-[state=active]:border-secondary/30 data-[state=active]:shadow-sm hover:bg-secondary/8 hover:border-secondary/25 transition-all duration-300 font-medium text-sm min-w-[80px] justify-center transform hover:scale-[1.02]"
                >
                  <MessageSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Feedback</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="layout" 
                  className="group relative flex items-center gap-2 px-4 py-3 rounded-xl bg-background/60 border border-border/30 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary/90 data-[state=active]:to-secondary/70 data-[state=active]:text-secondary-foreground data-[state=active]:border-secondary/30 data-[state=active]:shadow-sm hover:bg-secondary/8 hover:border-secondary/25 transition-all duration-300 font-medium text-sm min-w-[80px] justify-center transform hover:scale-[1.02]"
                >
                  <LayoutGrid className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Layout</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="navigation" 
                  className="group relative flex items-center gap-2 px-4 py-3 rounded-xl bg-background/60 border border-border/30 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary/90 data-[state=active]:to-secondary/70 data-[state=active]:text-secondary-foreground data-[state=active]:border-secondary/30 data-[state=active]:shadow-sm hover:bg-secondary/8 hover:border-secondary/25 transition-all duration-300 font-medium text-sm min-w-[80px] justify-center transform hover:scale-[1.02]"
                >
                  <Navigation className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Nav</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="overlays" 
                  className="group relative flex items-center gap-2 px-4 py-3 rounded-xl bg-background/60 border border-border/30 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary/90 data-[state=active]:to-secondary/70 data-[state=active]:text-secondary-foreground data-[state=active]:border-secondary/30 data-[state=active]:shadow-sm hover:bg-secondary/8 hover:border-secondary/25 transition-all duration-300 font-medium text-sm min-w-[80px] justify-center transform hover:scale-[1.02]"
                >
                  <Layers className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Overlays</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="dashboard" 
                  className="group relative flex items-center gap-2 px-4 py-3 rounded-xl bg-background/60 border border-border/30 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary/90 data-[state=active]:to-secondary/70 data-[state=active]:text-secondary-foreground data-[state=active]:border-secondary/30 data-[state=active]:shadow-sm hover:bg-secondary/8 hover:border-secondary/25 transition-all duration-300 font-medium text-sm min-w-[80px] justify-center transform hover:scale-[1.02]"
                >
                  <LayoutDashboard className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* ALL COMPONENTS TAB */}
          <TabsContent value="all" className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">All Components</h3>
              <p className="text-muted-foreground">Complete component library across all categories</p>
            </div>

            {/* Buttons & Actions Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <MousePointerClick className="h-5 w-5 text-secondary" />
                <h4 className="text-xl font-semibold">Buttons & Actions</h4>
              </div>
              
              <Card id="button-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Button Component</CardTitle>
                  <CardDescription>
                    Interactive elements for user actions with platform-optimized sizing and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <ButtonExamples />
                </CardContent>
              </Card>

              <Card id="icon-button-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Icon Button Component</CardTitle>
                  <CardDescription>
                    Compact button variants for icon-only actions and toolbars
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <IconButtonExamples />
                </CardContent>
              </Card>
            </div>

            {/* Form Inputs Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <FormInput className="h-5 w-5 text-secondary" />
                <h4 className="text-xl font-semibold">Form Inputs</h4>
              </div>

              <Card id="input-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Input Component</CardTitle>
                  <CardDescription>
                    Text input fields with platform-specific optimizations and accessibility features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <InputExamples />
                </CardContent>
              </Card>

              <Card id="checkbox-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Checkbox Component</CardTitle>
                  <CardDescription>
                    Multi-selection controls with platform-optimized sizing and brand color accents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <CheckboxExamples />
                </CardContent>
              </Card>

              <Card id="radio-group-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Radio Group Component</CardTitle>
                  <CardDescription>
                    Single selection controls with platform-optimized sizing and enhanced hover effects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <RadioGroupExamples />
                </CardContent>
              </Card>

              <Card id="switch-slider-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Switch & Slider Components</CardTitle>
                  <CardDescription>
                    Toggle controls and range selectors for various input scenarios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <SwitchSliderExamples />
                </CardContent>
              </Card>
            </div>

            {/* Data Display Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <BarChart3 className="h-5 w-5 text-secondary" />
                <h4 className="text-xl font-semibold">Data Display</h4>
              </div>

              <Card id="badge-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Badge Component</CardTitle>
                  <CardDescription>
                    Status indicators, labels, and tags for categorizing and highlighting information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <BadgeExamples />
                </CardContent>
              </Card>

              <Card id="tooltip-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Tooltip Component</CardTitle>
                  <CardDescription>
                    Contextual information displays that appear on hover or focus
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <TooltipExamples />
                </CardContent>
              </Card>

              <Card id="avatar-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Avatar Component</CardTitle>
                  <CardDescription>
                    User profile images with platform-optimized sizing and brand color accents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <AvatarExamples />
                </CardContent>
              </Card>
            </div>

            {/* Layout Components Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <LayoutGrid className="h-5 w-5 text-secondary" />
                <h4 className="text-xl font-semibold">Layout Components</h4>
              </div>

              <Card id="card-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Card Component</CardTitle>
                  <CardDescription>
                    Flexible content containers with platform-specific styling and responsive behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <CardExamples />
                </CardContent>
              </Card>

              <Card id="accordion-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Accordion & Collapsible Components</CardTitle>
                  <CardDescription>
                    Expandable content sections for space-efficient information display
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <AccordionCollapsibleExamples />
                </CardContent>
              </Card>

              <Card id="tabs-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Tabs Component</CardTitle>
                  <CardDescription>
                    Tabbed interfaces for organizing related content sections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <TabsExamples />
                </CardContent>
              </Card>
            </div>

            {/* Navigation Components Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <Navigation className="h-5 w-5 text-secondary" />
                <h4 className="text-xl font-semibold">Navigation Components</h4>
              </div>

              <Card id="scope-switcher-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Scope Switcher Component</CardTitle>
                  <CardDescription>
                    Hierarchical navigation tool for switching between different data contexts (Group, Business Line, Store)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <ScopeSwitcherExamples />
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Align Left (Default)</h4>
                      <div className="p-8 border rounded-lg bg-background/50 flex justify-start">
                        <ScopeSwitcher align="start" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Align Right</h4>
                      <div className="p-8 border rounded-lg bg-background/50 flex justify-end">
                        <ScopeSwitcher align="end" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card id="breadcrumb-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Breadcrumb Component</CardTitle>
                  <CardDescription>
                    Hierarchical navigation showing the current page location within the site structure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <BreadcrumbExamples />
                </CardContent>
              </Card>

              <Card id="pagination-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Pagination Component</CardTitle>
                  <CardDescription>
                    Navigation controls for paginated content with direct page input functionality
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <PaginationExamples />
                </CardContent>
              </Card>

              <Card id="navigation-menu-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Navigation Patterns</CardTitle>
                  <CardDescription>
                    Common navigation patterns including mobile bottom nav and desktop top nav
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <SimpleNavigationExamples />
                </CardContent>
              </Card>

              <Card id="sidebar-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Sidebar Component</CardTitle>
                  <CardDescription>
                    Collapsible sidebar navigation with nested menus and responsive behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <SidebarExamples />
                </CardContent>
              </Card>
            </div>

            {/* Overlays Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <Layers className="h-5 w-5 text-secondary" />
                <h4 className="text-xl font-semibold">Overlays</h4>
              </div>

              <Card id="dialog-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Dialog Component</CardTitle>
                  <CardDescription>
                    Modal dialogs for important user interactions and content presentation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <DialogExamples />
                </CardContent>
              </Card>

              <Card id="sheet-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Sheet Component</CardTitle>
                  <CardDescription>
                    Slide-in panels for secondary content and actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <SheetExamples />
                </CardContent>
              </Card>

              <Card id="popover-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Popover & Tooltip Components</CardTitle>
                  <CardDescription>
                    Contextual overlays for additional information and quick actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <PopoverTooltipExamples />
                </CardContent>
              </Card>

              <Card id="alert-dialog-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Alert Dialog & Dropdown Components</CardTitle>
                  <CardDescription>
                    Confirmation dialogs and contextual menus for user actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <AlertDialogDropdownExamples />
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Components Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <LayoutDashboard className="h-5 w-5 text-secondary" />
                <h4 className="text-xl font-semibold">Dashboard Components</h4>
              </div>

              <Card id="filter-select-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Filter Select Component</CardTitle>
                  <CardDescription>
                    Multi-select dropdown with badge display optimized for dashboard filtering
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <FilterSelectExamples />
                </CardContent>
              </Card>

              <Card id="picker-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Pickers & Selectors</CardTitle>
                  <CardDescription>
                    Advanced selection components with standardized Action Bar footer for scalable interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <PickerExamples />
                </CardContent>
              </Card>

              <Card id="card-header-actions-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Card Header & Actions</CardTitle>
                  <CardDescription>
                    Standardized card header structure with integrated actions and specific padding rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <CardHeaderActionExamples />
                </CardContent>
              </Card>

              <Card id="change-indicator-component">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Change Indicator Component</CardTitle>
                  <CardDescription>
                    Visual indicators for trends and data changes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <ChangeIndicatorExamples />
                </CardContent>
              </Card>

              <Card id="card-chart-alignment">
                <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                  <CardTitle>Card & Chart Alignment</CardTitle>
                  <CardDescription>
                    Best practices for aligning cards and charts in dashboard layouts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-[21px]">
                  <CardChartAlignmentExamples />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* BUTTONS & ACTIONS TAB */}
          <TabsContent value="buttons-actions" className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">Buttons & Actions</h3>
              <p className="text-muted-foreground">Interactive elements for user actions and commands</p>
            </div>
            
            <Card id="button-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Button Component</CardTitle>
                <CardDescription>
                  Interactive elements for user actions with platform-optimized sizing and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <ButtonExamples />
              </CardContent>
            </Card>

            <Card id="icon-button-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Icon Button Component</CardTitle>
                <CardDescription>
                  Compact button variants for icon-only actions and toolbars
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <IconButtonExamples />
              </CardContent>
            </Card>
          </TabsContent>

          {/* FORM INPUTS TAB */}
          <TabsContent value="form-inputs" className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">Form Inputs</h3>
              <p className="text-muted-foreground">Input controls for collecting user data</p>
            </div>

            <Card id="input-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Input Component</CardTitle>
                <CardDescription>
                  Text input fields with platform-specific optimizations and accessibility features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                  <InputExamples />
                  <div className="pt-4 border-t">
                    <PhoneInputExample />
                  </div>
                </CardContent>
            </Card>

            <Card id="checkbox-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Checkbox Component</CardTitle>
                <CardDescription>
                  Multi-selection controls with platform-optimized sizing and brand color accents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <CheckboxExamples />
              </CardContent>
            </Card>

            <Card id="radio-group-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Radio Group Component</CardTitle>
                <CardDescription>
                  Single selection controls with platform-optimized sizing and enhanced hover effects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <RadioGroupExamples />
              </CardContent>
            </Card>

            <Card id="switch-slider-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Switch & Slider Components</CardTitle>
                <CardDescription>
                  Toggle controls and range selectors for various input scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <SwitchSliderExamples />
              </CardContent>
            </Card>
          </TabsContent>

          {/* DATA DISPLAY TAB */}
          <TabsContent value="data-display" className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">Data Display</h3>
              <p className="text-muted-foreground">Components for presenting and displaying data and information</p>
            </div>

            <Card id="badge-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Badge Component</CardTitle>
                <CardDescription>
                  Status indicators, labels, and tags for categorizing and highlighting information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <BadgeExamples />
              </CardContent>
            </Card>

            <Card id="tooltip-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Tooltip Component</CardTitle>
                <CardDescription>
                  Contextual information displays that appear on hover or focus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <TooltipExamples />
              </CardContent>
            </Card>

            <Card id="avatar-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Avatar Component</CardTitle>
                <CardDescription>
                  User profile images with platform-optimized sizing and brand color accents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <AvatarExamples />
              </CardContent>
            </Card>
          </TabsContent>

          {/* FEEDBACK TAB */}
          <TabsContent value="feedback" className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">Feedback Components</h3>
              <p className="text-muted-foreground">Components for providing user feedback and status updates</p>
            </div>
            
            <Card>
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  Feedback components including alerts, toasts, and progress indicators will be added in a future update
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          {/* LAYOUT TAB */}
          <TabsContent value="layout" className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">Layout Components</h3>
              <p className="text-muted-foreground">Structural components for organizing content and creating layouts</p>
            </div>

            <Card id="card-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Card Component</CardTitle>
                <CardDescription>
                  Flexible content containers with platform-specific styling and responsive behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <CardExamples />
              </CardContent>
            </Card>

            <Card id="accordion-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Accordion & Collapsible Components</CardTitle>
                <CardDescription>
                  Expandable content sections for space-efficient information display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <AccordionCollapsibleExamples />
              </CardContent>
            </Card>

            <Card id="tabs-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Tabs Component</CardTitle>
                <CardDescription>
                  Tabbed interfaces for organizing related content sections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <TabsExamples />
              </CardContent>
            </Card>
          </TabsContent>

          {/* NAVIGATION TAB */}
          <TabsContent value="navigation" className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">Navigation Components</h3>
              <p className="text-muted-foreground">Components for site navigation and wayfinding</p>
            </div>

            <Card id="scope-switcher-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Scope Switcher Component</CardTitle>
                <CardDescription>
                  Hierarchical navigation tool for switching between different data contexts (Group, Business Line, Store)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <ScopeSwitcherExamples />
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Align Left (Default)</h4>
                    <div className="p-8 border rounded-lg bg-background/50 flex justify-start">
                      <ScopeSwitcher align="start" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Align Right</h4>
                    <div className="p-8 border rounded-lg bg-background/50 flex justify-end">
                      <ScopeSwitcher align="end" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="breadcrumb-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Breadcrumb Component</CardTitle>
                <CardDescription>
                  Hierarchical navigation showing the current page location within the site structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <BreadcrumbExamples />
              </CardContent>
            </Card>

            <Card id="pagination-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Pagination Component</CardTitle>
                <CardDescription>
                  Navigation controls for paginated content with direct page input functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <PaginationExamples />
              </CardContent>
            </Card>

            <Card id="navigation-menu-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Navigation Patterns</CardTitle>
                <CardDescription>
                  Common navigation patterns including mobile bottom nav and desktop top nav
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <SimpleNavigationExamples />
              </CardContent>
            </Card>

            <Card id="sidebar-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Sidebar Component</CardTitle>
                <CardDescription>
                  Collapsible sidebar navigation with nested menus and responsive behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <SidebarExamples />
              </CardContent>
            </Card>
          </TabsContent>

          {/* OVERLAYS TAB */}
          <TabsContent value="overlays" className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">Overlays</h3>
              <p className="text-muted-foreground">Modal and contextual overlay components</p>
            </div>

            <Card id="dialog-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Dialog Component</CardTitle>
                <CardDescription>
                  Modal dialogs for important user interactions and content presentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <DialogExamples />
              </CardContent>
            </Card>

            <Card id="sheet-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Sheet Component</CardTitle>
                <CardDescription>
                  Slide-in panels for secondary content and actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <SheetExamples />
              </CardContent>
            </Card>

            <Card id="popover-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Popover & Tooltip Components</CardTitle>
                <CardDescription>
                  Contextual overlays for additional information and quick actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <PopoverTooltipExamples />
              </CardContent>
            </Card>

            <Card id="alert-dialog-component">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Alert Dialog & Dropdown Components</CardTitle>
                <CardDescription>
                  Confirmation dialogs and contextual menus for user actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <AlertDialogDropdownExamples />
              </CardContent>
            </Card>
          </TabsContent>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">Dashboard Components</h3>
              <p className="text-muted-foreground">Specialized components for data dashboards and analytics</p>
            </div>

            <Card id="filter-select-component-dash">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Filter Select Component</CardTitle>
                <CardDescription>
                  Multi-select dropdown with badge display optimized for dashboard filtering
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <FilterSelectExamples />
              </CardContent>
            </Card>

            <Card id="picker-component-dash">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Pickers & Selectors</CardTitle>
                <CardDescription>
                  Advanced selection components with standardized Action Bar footer for scalable interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <PickerExamples />
              </CardContent>
            </Card>

            <Card id="card-header-actions-component-dash">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Card Header & Actions</CardTitle>
                <CardDescription>
                  Standardized card header structure with integrated actions and specific padding rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <CardHeaderActionExamples />
              </CardContent>
            </Card>

            <Card id="change-indicator-component-dash">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Change Indicator Component</CardTitle>
                <CardDescription>
                  Visual indicators for trends and data changes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <ChangeIndicatorExamples />
              </CardContent>
            </Card>

            <Card id="card-chart-alignment-dash">
              <CardHeader className="p-[27px] px-[27px] pt-[27px] pb-[21px]">
                <CardTitle>Card & Chart Alignment</CardTitle>
                <CardDescription>
                  Best practices for aligning cards and charts in dashboard layouts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-[21px]">
                <CardChartAlignmentExamples />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}