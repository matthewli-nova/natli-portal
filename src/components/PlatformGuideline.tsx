interface PlatformGuidelineProps {
  platform: 'mobile' | 'tablet' | 'desktop' | 'kiosk';
  icon: any;
  title: string;
  description: string;
  guidelines: string[];
  example: React.ReactNode;
  className?: string;
}

export function PlatformGuideline({ platform, icon: Icon, title, description, guidelines, example, className }: PlatformGuidelineProps) {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[var(--lepos-cyan-dark)]" />
        <div>
          <h5 className="font-medium">{title}</h5>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="border rounded-lg p-4 bg-white">
        {example}
      </div>
      <div className="space-y-2">
        <h6 className="text-sm font-medium">Platform Guidelines:</h6>
        <ul className="text-sm text-muted-foreground space-y-1">
          {guidelines.map((guideline, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-lepos-cyan">•</span>
              <span>{guideline}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}