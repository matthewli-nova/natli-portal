import LeposIconSquarePng from "../imports/LeposIconBluePng1-6018-89";

interface LeposSquareIconProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LeposSquareIcon({ 
  size = "md", 
  className = ""
}: LeposSquareIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <LeposIconSquarePng />
    </div>
  );
}
