import React from 'react';

interface CardHeaderActionsProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardHeaderActions - A flexible container for card header controls
 * 
 * Usage:
 * <CardHeaderActions>
 *   <ActionTextButton>Export Data</ActionTextButton>
 *   <Separator />
 *   <Select>...</Select>
 *   <SegmentedControl />
 *   <Separator />
 *   <ActionTextButton>View All →</ActionTextButton>
 * </CardHeaderActions>
 */
export function CardHeaderActions({ children, className = '' }: CardHeaderActionsProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {children}
    </div>
  );
}

interface ActionTextButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

/**
 * ActionTextButton - Styled text button for card header actions
 * Uses Lepos Cyan Text color (#107DAC) from design system
 */
export function ActionTextButton({ children, onClick, href, className = '' }: ActionTextButtonProps) {
  const baseClasses = "text-xs font-medium text-lepos-cyan-text hover:text-lepos-cyan-text/80 transition-colors";
  
  if (href) {
    return (
      <a href={href} className={`${baseClasses} underline-offset-2 hover:underline ${className}`}>
        {children}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={`${baseClasses} underline-offset-2 hover:underline ${className}`}>
      {children}
    </button>
  );
}

/**
 * Separator - Vertical divider for separating groups of controls
 */
export function Separator() {
  return <div className="h-4 w-px bg-border" />;
}
