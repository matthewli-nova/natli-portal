import { ReactNode } from "react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between space-y-2 mb-6", className)}>
      <h2 className="text-3xl font-bold tracking-tight text-[#023F59]">{title}</h2>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
}
