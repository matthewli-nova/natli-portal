import { useState } from "react";
import { ScopeSwitcher } from "../ScopeSwitcher";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { PlatformGuideline } from "../PlatformGuideline";
import { Smartphone, Tablet, Monitor, RectangleVertical, Home, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";

// Breadcrumb Component Examples
export function BreadcrumbExamples() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      <PlatformGuideline
        platform="mobile"
        icon={Smartphone}
        title="Mobile Breadcrumbs"
        description="Simplified navigation with essential path information"
        guidelines={[
          "Show only last 2-3 levels for space efficiency",
          "Use ellipsis for truncated paths",
          "Touch-friendly separator spacing",
          "Consider collapsible full path option",
          "Position at top of content area"
        ]}
        example={
          <div className="max-w-[280px]">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <span className="text-muted-foreground">...</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="text-sm">
                    Products
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm">Mobile Apps</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-3 text-xs text-muted-foreground">
              Tap "..." to see full path
            </div>
          </div>
        }
      />

      <PlatformGuideline
        platform="tablet"
        icon={Tablet}
        title="Tablet Breadcrumbs"
        description="Expanded navigation with enhanced interaction"
        guidelines={[
          "Show more levels with better spacing",
          "Include hover states for links",
          "Support both touch and mouse interactions",
          "Responsive truncation based on content width",
          "Enhanced visual hierarchy with icons"
        ]}
        example={
          <div className="max-w-[320px]">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Products</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Mobile Apps</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        }
      />

      <PlatformGuideline
        platform="desktop"
        icon={Monitor}
        title="Desktop Breadcrumbs"
        description="Full navigation path with rich interactions"
        guidelines={[
          "Display complete navigation hierarchy",
          "Rich hover and focus states",
          "Keyboard navigation support",
          "Contextual actions and dropdowns",
          "Compact spacing for dense layouts"
        ]}
        example={
          <div className="max-w-[320px]">
            <Breadcrumb>
              <BreadcrumbList className="text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Analytics</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Reports</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[80px] truncate">
                    User Engagement
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        }
      />

      <PlatformGuideline
        platform="kiosk"
        icon={RectangleVertical}
        title="Kiosk Breadcrumbs"
        description="Large, accessible navigation for public interfaces"
        guidelines={[
          "Extra-large touch targets and text",
          "High contrast for visibility",
          "Simple, clear navigation path",
          "Minimal levels to reduce complexity",
          "Bold visual separators"
        ]}
        example={
          <div className="max-w-[320px]">
            <Breadcrumb>
              <BreadcrumbList className="text-lg gap-4">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="flex items-center gap-2 p-2 rounded">
                    <Home className="h-5 w-5" />
                    Main Menu
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-2xl">
                  <ChevronRight className="h-6 w-6" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="p-2 rounded">
                    Services
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-2xl">
                  <ChevronRight className="h-6 w-6" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="p-2 font-semibold">
                    Account Help
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        }
      />
    </div>
  );
}

// Enhanced Pagination Component with Direct Page Input
function PaginationWithInput({ totalPages = 50, className = "" }: { totalPages?: number; className?: string }) {
  const [currentPage, setCurrentPage] = useState(2);
  const [inputValue, setInputValue] = useState("");

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputValue);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#" 
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                goToPrevious();
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {currentPage > 3 && (
            <>
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(1); }}>
                  1
                </PaginationLink>
              </PaginationItem>
              {currentPage > 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {renderPageNumbers()}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                goToNext();
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Direct Page Input */}
      <div className="flex items-center justify-center gap-2">
        <Label htmlFor="page-input" className="text-sm">Go to page:</Label>
        <div className="flex items-center gap-2">
          <Input
            id="page-input"
            type="number"
            min="1"
            max={totalPages}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`1-${totalPages}`}
            className="w-20 h-8 text-center text-sm"
          />
          <Button 
            size="sm" 
            onClick={handleGoToPage}
            disabled={!inputValue || parseInt(inputValue) < 1 || parseInt(inputValue) > totalPages}
            className="h-8 px-3"
          >
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}

// Mobile Pagination with Simplified Input
function MobilePaginationWithInput() {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const totalPages = 10;

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputValue);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  return (
    <div className="space-y-4 max-w-[300px]">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink 
              href="#" 
              isActive={currentPage === 1}
              onClick={(e) => { e.preventDefault(); setCurrentPage(1); }}
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink 
              href="#" 
              isActive={currentPage === 2}
              onClick={(e) => { e.preventDefault(); setCurrentPage(2); }}
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink 
              href="#" 
              isActive={currentPage === 3}
              onClick={(e) => { e.preventDefault(); setCurrentPage(3); }}
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Mobile-optimized page input */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2 p-2 border rounded-lg bg-card">
          <span className="text-sm">Page:</span>
          <Input
            type="number"
            min="1"
            max={totalPages}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`1-${totalPages}`}
            className="w-16 h-8 text-center text-sm border-0 bg-transparent p-1"
          />
          <Button 
            size="sm" 
            onClick={handleGoToPage}
            disabled={!inputValue || parseInt(inputValue) < 1 || parseInt(inputValue) > totalPages}
            className="h-6 w-6 p-0"
          >
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</p>
      </div>
    </div>
  );
}

// Pagination Component Examples
export function PaginationExamples() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-medium mb-4">Enhanced Pagination Component</h4>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Mobile Pagination with Page Input</h6>
            <MobilePaginationWithInput />
          </div>
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Desktop Pagination with Page Input</h6>
            <PaginationWithInput totalPages={50} className="max-w-[500px]" />
          </div>
        </div>
      </div>

      {/* Platform-specific examples */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h6 className="text-sm font-medium">Kiosk Large Screen Pagination</h6>
          <div className="max-w-[400px] p-4 border rounded-lg bg-card">
            <div className="space-y-4">
              <Pagination>
                <PaginationContent className="gap-3">
                  <PaginationItem>
                    <PaginationPrevious href="#" className="h-12 px-6 text-base" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" className="h-12 w-12 text-base">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive className="h-12 w-12 text-base">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" className="h-12 w-12 text-base">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" className="h-12 px-6 text-base" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <div className="flex items-center justify-center gap-3">
                <Label className="text-base">Jump to page:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Page"
                    className="w-24 h-12 text-center text-base border-2"
                  />
                  <Button className="h-12 px-6 text-base">
                    Go
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-base text-muted-foreground">Page 2 of 25</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h6 className="text-sm font-medium">Compact Desktop Pagination</h6>
          <div className="max-w-[400px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" className="h-8" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" className="h-8 w-8 text-sm">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive className="h-8 w-8 text-sm">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" className="h-8 w-8 text-sm">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis className="h-8 w-8" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" className="h-8 w-8 text-sm">50</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" className="h-8" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Page"
                    className="w-16 h-8 text-center text-sm"
                  />
                  <Button size="sm" className="h-8 px-2">
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Showing 11-20 of 1000 results</span>
                <span>Page 2 of 50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Navigation Examples
export function SimpleNavigationExamples() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-4">Navigation Patterns</h4>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Bottom Navigation (Mobile)</h6>
            <div className="max-w-[300px] border rounded-lg p-4 bg-card">
              <div className="flex justify-around">
                <Button variant="ghost" size="sm" className="flex-col h-12 gap-1">
                  <Home className="h-4 w-4" />
                  <span className="text-xs">Home</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-col h-12 gap-1">
                  <Monitor className="h-4 w-4" />
                  <span className="text-xs">Dashboard</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-col h-12 gap-1 text-primary">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-xs">Apps</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-col h-12 gap-1">
                  <RectangleVertical className="h-4 w-4" />
                  <span className="text-xs">Settings</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Top Navigation (Desktop)</h6>
            <div className="max-w-[400px] border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-6">
                <div className="font-semibold">Brand</div>
                <nav className="flex gap-4">
                  <Button variant="ghost" size="sm" className="text-primary">
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm">
                    Projects
                  </Button>
                  <Button variant="ghost" size="sm">
                    Team
                  </Button>
                  <Button variant="ghost" size="sm">
                    Settings
                  </Button>
                </nav>
                <div className="ml-auto">
                  <Button size="sm">Sign In</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Scope Switcher Component Example
export function ScopeSwitcherExamples() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-4">Scope Switcher</h4>
        <p className="text-sm text-muted-foreground mb-6">
          A specialized navigation component for switching between different data scopes (Company, Business Line, Store).
          Features a hierarchical tree view with enhanced visibility lines and clear metadata.
        </p>
        
        <div className="space-y-6">
          <div className="p-8 border rounded-lg bg-background/50 flex flex-col items-center gap-4">
             <h5 className="text-sm font-medium text-muted-foreground w-full text-center">Interactive Default State</h5>
             <ScopeSwitcher />
          </div>
          
          <div className="space-y-4">
             <h5 className="text-sm font-medium">Simulated Loading States</h5>
             <div className="grid gap-6 md:grid-cols-3">
               <div className="p-6 border rounded-lg bg-background/50 flex flex-col items-center gap-3">
                 <span className="text-xs text-muted-foreground">Company Loading</span>
                 <ScopeSwitcher isLoading={true} defaultValue="all-company" />
               </div>
               <div className="p-6 border rounded-lg bg-background/50 flex flex-col items-center gap-3">
                 <span className="text-xs text-muted-foreground">Business Line Loading</span>
                 <ScopeSwitcher isLoading={true} defaultValue="sunset-fest-2026" />
               </div>
               <div className="p-6 border rounded-lg bg-background/50 flex flex-col items-center gap-3">
                 <span className="text-xs text-muted-foreground">Store Loading</span>
                 <ScopeSwitcher isLoading={true} defaultValue="sunset-vip-lounge" />
               </div>
             </div>
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2 mt-6">
          <div className="space-y-2">
            <h6 className="text-sm font-medium">Features</h6>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Hierarchical tree visualization with connected lines</li>
              <li>Multi-level structure (Group &gt; Business Line &gt; Store)</li>
              <li>Inline metadata for item counts</li>
              <li>Search functionality with keyboard support</li>
              <li>Dark-theme optimized visuals</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h6 className="text-sm font-medium">Usage</h6>
            <p className="text-sm text-muted-foreground">
              Use in the header or sidebar to allow users to switch their data context globally.
              The component persists selection and provides visual feedback for the current scope.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
