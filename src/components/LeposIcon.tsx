import svgPaths from "../imports/svg-3a9zpy0fpa";

interface LeposIconProps {
  className?: string;
}

/**
 * LeposIcon - Header Use Only
 * Fixed height: 31px to match LeposLogo in sidebar header
 */
export function LeposIcon({ 
  className = ""
}: LeposIconProps) {
  return (
    <div className={className} style={{ height: '31px' }}>
      <svg 
        className="block w-full h-full mx-[1px] my-[0px]" 
        fill="none" 
        preserveAspectRatio="xMidYMid meet" 
        viewBox="0 0 185 320"
        role="img"
        aria-label="Lepos Icon"
      >
        <g id="Lepos_Logo_black_no bg_png 1">
          <path d={svgPaths.p8edd400} fill="var(--fill-0, #31D7DB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}