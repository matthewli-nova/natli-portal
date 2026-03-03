import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { ScopeSwitcher } from "./ScopeSwitcher";

interface PortalHeaderProps {
  breadcrumbs: { label: string; href?: string; active?: boolean }[];
}

export function PortalHeader({ breadcrumbs }: PortalHeaderProps) {
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
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 xl:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          {items}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-4">
        <ScopeSwitcher align="end" />
      </div>
    </header>
  );
}