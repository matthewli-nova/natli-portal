import svgPaths from "../imports/svg-jsf8tnemyi";

interface LeposLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "default" | "light" | "dark" | "monochrome";
}

export function LeposLogo({ 
  size = "md", 
  className = "",
  variant = "default"
}: LeposLogoProps) {
  const sizeClasses = {
    sm: "w-16 h-auto",
    md: "w-24 h-auto", 
    lg: "w-32 h-auto",
    xl: "w-48 h-auto"
  };

  // Color variants for different use cases
  const colorVariants = {
    default: {
      primary: 'var(--lepos-dark)',
      accent: 'var(--lepos-cyan)' // Updated to use new Lepos Cyan (#31D7DB)
    },
    light: {
      primary: '#ffffff',
      accent: 'var(--lepos-cyan)'
    },
    dark: {
      primary: 'var(--lepos-dark)',
      accent: 'var(--lepos-cyan-light)' // Lighter cyan for dark backgrounds
    },
    monochrome: {
      primary: 'var(--foreground)',
      accent: 'var(--foreground)'
    }
  };

  const colors = colorVariants[variant];

  return (
    <div className={className || sizeClasses[size]}>
      <svg
        className="block w-full h-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 1440 581"
        role="img"
        aria-label="Lepos Logo"
      >
        <g>
          <g>
            {/* Main logo text elements using primary color (Lepos Dark) */}
            <path d={svgPaths.pb300af0} fill={colors.primary} />
            <path d={svgPaths.p82a9800} fill={colors.primary} />
            <path d={svgPaths.p13514f00} fill={colors.primary} />
            <path d={svgPaths.p3fe4200} fill={colors.primary} />
          </g>
          {/* Additional primary elements */}
          <path d={svgPaths.p1b0c0580} fill={colors.primary} />
          {/* Accent elements using updated Lepos Cyan (#31D7DB) */}
          <path d={svgPaths.p21f52380} fill={colors.accent} />
          <path d={svgPaths.p19f2f980} fill={colors.accent} />
        </g>
      </svg>
    </div>
  );
}