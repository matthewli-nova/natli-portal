import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { useHeaderSlot } from "../lib/header-slot-context";

interface PortalHeaderProps {
  breadcrumbs: { label: string; href?: string; active?: boolean }[];
}

export function PortalHeader({ breadcrumbs }: PortalHeaderProps) {
  const { centerSlot, rightSlot } = useHeaderSlot();

  const items = [];
  breadcrumbs.forEach((item, index) => {
    items.push(
      <BreadcrumbItem key={`item-${index}`}>
        {item.active ? (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={item.href || "#"}>{item.label}</BreadcrumbLink>
        )}
      </BreadcrumbItem>
    );
    if (index < breadcrumbs.length - 1) {
      items.push(<BreadcrumbSeparator key={`sep-${index}`} />);
    }
  });

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b bg-background px-4 xl:px-8">
      {/* Left — breadcrumbs */}
      <div className="flex-1 min-w-0">
        <Breadcrumb>
          <BreadcrumbList>{items}</BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center — injected slot (e.g. GlobalSearch) */}
      {centerSlot && (
        <div className="absolute left-1/2 -translate-x-1/2">
          {centerSlot}
        </div>
      )}

      {/* Right — injected slot (e.g. Chat button) */}
      {rightSlot && (
        <div className="flex items-center gap-2 ml-auto">
          {rightSlot}
        </div>
      )}
    </header>
  );
}
