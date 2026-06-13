import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from "../ui/context-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { PlatformGuideline } from "../PlatformGuideline";
import { Smartphone, Tablet, Monitor, RectangleVertical, MoreVertical, User, Settings, LogOut, Info, AlertTriangle, Plus, Edit, Trash2, Copy } from "lucide-react";

// Dialog Component Examples
export function DialogExamples() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-4">Dialog Component</h4>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Mobile Dialog</h6>
            <div className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">Open Mobile Dialog</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new project below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input id="name" placeholder="My Awesome Project" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" placeholder="Brief description..." />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Create Project</Button>
                    <Button variant="outline" className="flex-1">Cancel</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Desktop Dialog</h6>
            <div className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Settings Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Application Settings</DialogTitle>
                    <DialogDescription>
                      Configure your application preferences and settings.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Input id="theme" defaultValue="Dark" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Input id="language" defaultValue="English" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sheet Component Examples
export function SheetExamples() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-4">Sheet Component</h4>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Mobile Sheet</h6>
            <div className="space-y-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="w-full">Open Mobile Sheet</Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Quick Actions</SheetTitle>
                    <SheetDescription>
                      Perform common actions from this panel.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <Button className="w-full h-12">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New
                    </Button>
                    <Button variant="outline" className="w-full h-12">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Selected
                    </Button>
                    <Button variant="outline" className="w-full h-12">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Desktop Sheet</h6>
            <div className="space-y-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Side Panel</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Properties Panel</SheetTitle>
                    <SheetDescription>
                      Edit properties and settings for the selected item.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width</Label>
                      <Input id="width" defaultValue="200px" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <Input id="height" defaultValue="100px" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="opacity">Opacity</Label>
                      <Input id="opacity" defaultValue="100%" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Popover and Tooltip Examples
export function PopoverTooltipExamples() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-4">Popover Component</h4>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Settings Popover</h6>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Settings</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Quick Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Adjust your preferences quickly.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications" className="text-sm">Notifications</Label>
                      <input type="checkbox" id="notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-save" className="text-sm">Auto-save</Label>
                      <input type="checkbox" id="auto-save" defaultChecked />
                    </div>
                  </div>
                  <Button className="w-full">Apply Settings</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-4">
            <h6 className="text-sm font-medium">User Profile Popover</h6>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-8 h-8 rounded-full p-0">
                  <User className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">john@example.com</p>
                    </div>
                  </div>
                  <div className="border-t pt-3 space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-4">Tooltip Component</h4>
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover for tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a helpful tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
        </div>
      </div>
    </div>
  );
}

// Alert Dialog and Dropdown Examples
export function AlertDialogDropdownExamples() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-4">Alert Dialog Component</h4>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Confirmation Dialog</h6>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Item</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the item and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="space-y-4">
            <h6 className="text-sm font-medium">Warning Dialog</h6>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Show Warning
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved changes that will be lost if you continue. Do you want to save before proceeding?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Save & Continue</AlertDialogAction>
                  <AlertDialogAction>Discard Changes</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-4">Dropdown Menu Component</h4>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions
                <MoreVertical className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ContextMenu>
            <ContextMenuTrigger className="border rounded-lg p-4 text-center text-sm text-muted-foreground">
              Right click me
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuLabel>Context Actions</ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </ContextMenuItem>
              <ContextMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
    </div>
  );
}