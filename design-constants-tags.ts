// Tag/Badge Color Palette for the Lepos Design System
// This comprehensive color system provides semantic meaning through color
// while maintaining accessibility and brand consistency

export interface TagColor {
  name: string;
  category: string;
  group: number; // 1 or 2
  hex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  usage: string;
  context: string;
}

export const tagColors: TagColor[] = [
  // ========== TAG COLOR GROUP 1 ==========
  // Neutrals & Grays - Professional, subtle, and universally applicable
  {
    name: "Gray",
    category: "Neutrals & Grays",
    group: 1,
    hex: "#E5E7EB",
    bgClass: "bg-[#E5E7EB]",
    textClass: "text-gray-900",
    borderClass: "border-[#E5E7EB]",
    usage: "Default tags, general categories, neutral states",
    context: "Balanced and mature, perfect for status labels and general content"
  },
  {
    name: "Slate",
    category: "Neutrals & Grays",
    group: 1,
    hex: "#CBD5E1",
    bgClass: "bg-[#CBD5E1]",
    textClass: "text-gray-900",
    borderClass: "border-[#CBD5E1]",
    usage: "Desktop tags, location stamps, neutral states",
    context: "Ideal for settings, filters and neutral system labels"
  },
  {
    name: "Zinc",
    category: "Neutrals & Grays",
    group: 1,
    hex: "#D4D4D8",
    bgClass: "bg-[#D4D4D8]",
    textClass: "text-gray-900",
    borderClass: "border-[#D4D4D8]",
    usage: "Archived content, historical tags, subtle categories",
    context: "Ideal for less-prominent labels"
  },
  {
    name: "Stone",
    category: "Neutrals & Grays",
    group: 1,
    hex: "#D6D3D1",
    bgClass: "bg-[#D6D3D1]",
    textClass: "text-gray-900",
    borderClass: "border-[#D6D3D1]",
    usage: "System tags, metadata, technical annotations",
    context: "Perfect for metadata labels"
  },

  // Warm Colors - Energy, urgency, and attention
  {
    name: "Red",
    category: "Warm Colors",
    group: 1,
    hex: "#FCA5A5",
    bgClass: "bg-[#FCA5A5]",
    textClass: "text-gray-900",
    borderClass: "border-[#FCA5A5]",
    usage: "Critical alerts, deletions, high priority",
    context: "Commands immediate attention for critical actions"
  },
  {
    name: "Crimson",
    category: "Warm Colors",
    group: 1,
    hex: "#F5A3A3",
    bgClass: "bg-[#F5A3A3]",
    textClass: "text-gray-900",
    borderClass: "border-[#F5A3A3]",
    usage: "Important notifications, urgent content",
    context: "Softer red tone for important but not critical alerts"
  },
  {
    name: "Rose",
    category: "Warm Colors",
    group: 1,
    hex: "#FDA4AF",
    bgClass: "bg-[#FDA4AF]",
    textClass: "text-gray-900",
    borderClass: "border-[#FDA4AF]",
    usage: "Important notifications, featured content",
    context: "Softer than red but still urgent, great for special alerts"
  },
  {
    name: "Orange",
    category: "Warm Colors",
    group: 1,
    hex: "#FDBA74",
    bgClass: "bg-[#FDBA74]",
    textClass: "text-gray-900",
    borderClass: "border-[#FDBA74]",
    usage: "Warnings, moderate priority, action required",
    context: "Indicates something needs attention without being critical"
  },
  {
    name: "Peach",
    category: "Warm Colors",
    group: 1,
    hex: "#FDBF8F",
    bgClass: "bg-[#FDBF8F]",
    textClass: "text-gray-900",
    borderClass: "border-[#FDBF8F]",
    usage: "Warm welcomes, friendly tones, approachable content",
    context: "Warm and inviting, creates friendly atmosphere"
  },
  {
    name: "Apricot",
    category: "Warm Colors",
    group: 1,
    hex: "#FBCB8D",
    bgClass: "bg-[#FBCB8D]",
    textClass: "text-gray-900",
    borderClass: "border-[#FBCB8D]",
    usage: "Gentle warmth, soft emphasis, inviting content",
    context: "Subtle warmth without overwhelming, approachable tone"
  },
  {
    name: "Amber",
    category: "Warm Colors",
    group: 1,
    hex: "#FCD34D",
    bgClass: "bg-[#FCD34D]",
    textClass: "text-gray-900",
    borderClass: "border-[#FCD34D]",
    usage: "Caution labels, pending items, awaiting review",
    context: "Communicates 'proceed with awareness'"
  },
  {
    name: "Yellow",
    category: "Warm Colors",
    group: 1,
    hex: "#FEF08A",
    bgClass: "bg-[#FEF08A]",
    textClass: "text-gray-900",
    borderClass: "border-[#FEF08A]",
    usage: "Highlights, important notices, featured content",
    context: "Draws attention positively, like a highlighter"
  },
  {
    name: "Lemon",
    category: "Warm Colors",
    group: 1,
    hex: "#FEF3A2",
    bgClass: "bg-[#FEF3A2]",
    textClass: "text-gray-900",
    borderClass: "border-[#FEF3A2]",
    usage: "Fresh content, new items, recently added",
    context: "Bright and energizing, signals freshness"
  },

  // Nature Colors - Growth, success, and organic content
  {
    name: "Lime",
    category: "Nature Colors",
    group: 1,
    hex: "#BEF264",
    bgClass: "bg-[#BEF264]",
    textClass: "text-gray-900",
    borderClass: "border-[#BEF264]",
    usage: "New items, draft status, growth indicators",
    context: "Vibrant and lively, suggests growth and activity"
  },
  {
    name: "Green",
    category: "Nature Colors",
    group: 1,
    hex: "#86EFAC",
    bgClass: "bg-[#86EFAC]",
    textClass: "text-gray-900",
    borderClass: "border-[#86EFAC]",
    usage: "Success states, approved content, go signals",
    context: "Universal positive signal, completion and approval"
  },
  {
    name: "Emerald",
    category: "Nature Colors",
    group: 1,
    hex: "#6EE7B7",
    bgClass: "bg-[#6EE7B7]",
    textClass: "text-gray-900",
    borderClass: "border-[#6EE7B7]",
    usage: "Premium features, sustainability, quality content",
    context: "Sophisticated green, suggests value and quality"
  },
  {
    name: "Forest",
    category: "Nature Colors",
    group: 1,
    hex: "#A3E635",
    bgClass: "bg-[#A3E635]",
    textClass: "text-gray-900",
    borderClass: "border-[#A3E635]",
    usage: "Eco-friendly, sustainable, organic categories",
    context: "Natural and fresh, perfect for environmental themes"
  },
  {
    name: "Mint",
    category: "Nature Colors",
    group: 1,
    hex: "#A7F3D0",
    bgClass: "bg-[#A7F3D0]",
    textClass: "text-gray-900",
    borderClass: "border-[#A7F3D0]",
    usage: "Fresh content, wellness tags, calming categories",
    context: "Refreshing and clean, suggests renewal"
  },
  {
    name: "Sage",
    category: "Nature Colors",
    group: 1,
    hex: "#B5C99A",
    bgClass: "bg-[#B5C99A]",
    textClass: "text-gray-900",
    borderClass: "border-[#B5C99A]",
    usage: "Natural content, wellness, calming states",
    context: "Earthy and grounded, suggests stability"
  },

  // Cool Colors (Water/Sky) - Trust, technology, and communication
  {
    name: "Teal",
    category: "Cool Colors",
    group: 1,
    hex: "#5EEAD4",
    bgClass: "bg-[#5EEAD4]",
    textClass: "text-gray-900",
    borderClass: "border-[#5EEAD4]",
    usage: "Medical, wellness, professional categories",
    context: "Balanced and trustworthy, great for healthcare"
  },
  {
    name: "Cyan",
    category: "Cool Colors",
    group: 1,
    hex: "#67E8F9",
    bgClass: "bg-[#67E8F9]",
    textClass: "text-gray-900",
    borderClass: "border-[#67E8F9]",
    usage: "Brand highlights, technology, modern categories",
    context: "Lepos signature color - use for brand moments and tech features"
  },
  {
    name: "Aqua",
    category: "Cool Colors",
    group: 1,
    hex: "#7FDBDA",
    bgClass: "bg-[#7FDBDA]",
    textClass: "text-gray-900",
    borderClass: "border-[#7FDBDA]",
    usage: "Information, communication, water-related content",
    context: "Clear and communicative, ideal for informational tags"
  },
  {
    name: "Turquoise",
    category: "Cool Colors",
    group: 1,
    hex: "#74D4D4",
    bgClass: "bg-[#74D4D4]",
    textClass: "text-gray-900",
    borderClass: "border-[#74D4D4]",
    usage: "Creative content, tropical themes, energy",
    context: "Vibrant and tropical, adds energy to designs"
  },
  {
    name: "Sky",
    category: "Cool Colors",
    group: 1,
    hex: "#7DD3FC",
    bgClass: "bg-[#7DD3FC]",
    textClass: "text-gray-900",
    borderClass: "border-[#7DD3FC]",
    usage: "General info, cloud services, weather",
    context: "Light and airy, perfect for cloud/sky themes"
  },
  {
    name: "Blue",
    category: "Cool Colors",
    group: 1,
    hex: "#93C5FD",
    bgClass: "bg-[#93C5FD]",
    textClass: "text-gray-900",
    borderClass: "border-[#93C5FD]",
    usage: "Primary information, links, default states",
    context: "Classic and reliable, the universal 'information' color"
  },
  {
    name: "Azure",
    category: "Cool Colors",
    group: 1,
    hex: "#A5D4FD",
    bgClass: "bg-[#A5D4FD]",
    textClass: "text-gray-900",
    borderClass: "border-[#A5D4FD]",
    usage: "Cloud platforms, digital services, tech content",
    context: "Modern and tech-focused, great for digital services"
  },
  {
    name: "Navy",
    category: "Cool Colors",
    group: 1,
    hex: "#9FBED8",
    bgClass: "bg-[#9FBED8]",
    textClass: "text-gray-900",
    borderClass: "border-[#9FBED8]",
    usage: "Professional content, corporate, formal categories",
    context: "Authoritative and professional, suggests expertise"
  },

  // Creative Colors - Imagination, creativity, and premium content
  {
    name: "Indigo",
    category: "Creative Colors",
    group: 1,
    hex: "#A5B4FC",
    bgClass: "bg-[#A5B4FC]",
    textClass: "text-gray-900",
    borderClass: "border-[#A5B4FC]",
    usage: "Premium features, creative content, special offers",
    context: "Rich and sophisticated, suggests premium value"
  },
  {
    name: "Violet",
    category: "Creative Colors",
    group: 1,
    hex: "#C4B5FD",
    bgClass: "bg-[#C4B5FD]",
    textClass: "text-gray-900",
    borderClass: "border-[#C4B5FD]",
    usage: "Creative projects, artistic content, innovation",
    context: "Imaginative and creative, perfect for artistic themes"
  },
  {
    name: "Purple",
    category: "Creative Colors",
    group: 1,
    hex: "#D8B4FE",
    bgClass: "bg-[#D8B4FE]",
    textClass: "text-gray-900",
    borderClass: "border-[#D8B4FE]",
    usage: "Premium content, luxury, special events",
    context: "Royal and premium, signals exclusivity"
  },
  {
    name: "Lavender",
    category: "Creative Colors",
    group: 1,
    hex: "#DDD6FE",
    bgClass: "bg-[#DDD6FE]",
    textClass: "text-gray-900",
    borderClass: "border-[#DDD6FE]",
    usage: "Calm creativity, wellness, gentle emphasis",
    context: "Soft and soothing, combines calm with creativity"
  },
  {
    name: "Plum",
    category: "Creative Colors",
    group: 1,
    hex: "#D1A8E1",
    bgClass: "bg-[#D1A8E1]",
    textClass: "text-gray-900",
    borderClass: "border-[#D1A8E1]",
    usage: "Rich content, premium services, luxury brands",
    context: "Deep and luxurious, suggests richness"
  },
  {
    name: "Fuchsia",
    category: "Creative Colors",
    group: 1,
    hex: "#E879F9",
    bgClass: "bg-[#E879F9]",
    textClass: "text-gray-900",
    borderClass: "border-[#E879F9]",
    usage: "Bold highlights, creative campaigns, attention",
    context: "Vibrant and bold, impossible to ignore"
  },
  {
    name: "Pink",
    category: "Creative Colors",
    group: 1,
    hex: "#F9A8D4",
    bgClass: "bg-[#F9A8D4]",
    textClass: "text-gray-900",
    borderClass: "border-[#F9A8D4]",
    usage: "Love, favorites, special moments, featured",
    context: "Playful and affectionate, great for favorites"
  },
  {
    name: "Magenta",
    category: "Creative Colors",
    group: 1,
    hex: "#F472B6",
    bgClass: "bg-[#F472B6]",
    textClass: "text-gray-900",
    borderClass: "border-[#F472B6]",
    usage: "Creative, trending, special campaigns",
    context: "Electric and modern, signals something special"
  },
  {
    name: "Blush",
    category: "Creative Colors",
    group: 1,
    hex: "#FBCFE8",
    bgClass: "bg-[#FBCFE8]",
    textClass: "text-gray-900",
    borderClass: "border-[#FBCFE8]",
    usage: "Gentle emphasis, soft announcements, delicate content",
    context: "Soft and approachable, gentle emphasis"
  },
  {
    name: "Mauve",
    category: "Creative Colors",
    group: 1,
    hex: "#D8A8D8",
    bgClass: "bg-[#D8A8D8]",
    textClass: "text-gray-900",
    borderClass: "border-[#D8A8D8]",
    usage: "Elegant content, vintage themes, sophisticated design",
    context: "Timeless and elegant, adds a touch of refinement"
  },

  // Specialty Colors - Unique use cases and special moments
  {
    name: "Coral",
    category: "Specialty Colors",
    group: 1,
    hex: "#FF9999",
    bgClass: "bg-[#FF9999]",
    textClass: "text-gray-900",
    borderClass: "border-[#FF9999]",
    usage: "Sunset alerts, friendly errors, warm categories",
    context: "Gentle but noticeable, great for friendly warnings"
  },
  {
    name: "Bronze",
    category: "Specialty Colors",
    group: 1,
    hex: "#D4A574",
    bgClass: "bg-[#D4A574]",
    textClass: "text-gray-900",
    borderClass: "border-[#D4A574]",
    usage: "Achievement levels, tier rankings, accomplishments",
    context: "Third-place achievements and bronze tier content"
  },

  // ========== TAG COLOR GROUP 2 ==========
  // Neutrals & Grays - Professional, subtle, and universally applicable
  {
    name: "Gray",
    category: "Neutrals & Grays",
    group: 2,
    hex: "#6B7280",
    bgClass: "bg-[#6B7280]",
    textClass: "text-white",
    borderClass: "border-[#6B7280]",
    usage: "Default tags, general categories, neutral states",
    context: "Balanced and mature, perfect for status labels and general content"
  },
  {
    name: "Slate",
    category: "Neutrals & Grays",
    group: 2,
    hex: "#64748B",
    bgClass: "bg-[#64748B]",
    textClass: "text-white",
    borderClass: "border-[#64748B]",
    usage: "Desktop tags, location stamps, neutral states",
    context: "Ideal for settings, filters and neutral system labels"
  },
  {
    name: "Zinc",
    category: "Neutrals & Grays",
    group: 2,
    hex: "#71717A",
    bgClass: "bg-[#71717A]",
    textClass: "text-white",
    borderClass: "border-[#71717A]",
    usage: "Archived content, historical tags, subtle categories",
    context: "Ideal for less-prominent labels"
  },
  {
    name: "Stone",
    category: "Neutrals & Grays",
    group: 2,
    hex: "#78716C",
    bgClass: "bg-[#78716C]",
    textClass: "text-white",
    borderClass: "border-[#78716C]",
    usage: "System tags, metadata, technical annotations",
    context: "Perfect for metadata labels"
  },

  // Warm Colors - Energy, urgency, and attention
  {
    name: "Red",
    category: "Warm Colors",
    group: 2,
    hex: "#EF4444",
    bgClass: "bg-[#EF4444]",
    textClass: "text-white",
    borderClass: "border-[#EF4444]",
    usage: "Critical alerts, deletions, high priority",
    context: "Commands immediate attention for critical actions"
  },
  {
    name: "Rose",
    category: "Warm Colors",
    group: 2,
    hex: "#F43F5E",
    bgClass: "bg-[#F43F5E]",
    textClass: "text-white",
    borderClass: "border-[#F43F5E]",
    usage: "Important notifications, featured content",
    context: "Softer than red but still urgent, great for special alerts"
  },
  {
    name: "Orange",
    category: "Warm Colors",
    group: 2,
    hex: "#F97316",
    bgClass: "bg-[#F97316]",
    textClass: "text-white",
    borderClass: "border-[#F97316]",
    usage: "Warnings, moderate priority, action required",
    context: "Indicates something needs attention without being critical"
  },
  {
    name: "Amber",
    category: "Warm Colors",
    group: 2,
    hex: "#F59E0B",
    bgClass: "bg-[#F59E0B]",
    textClass: "text-white",
    borderClass: "border-[#F59E0B]",
    usage: "Caution labels, pending items, awaiting review",
    context: "Communicates 'proceed with awareness'"
  },
  {
    name: "Yellow",
    category: "Warm Colors",
    group: 2,
    hex: "#EAB308",
    bgClass: "bg-[#EAB308]",
    textClass: "text-gray-900",
    borderClass: "border-[#EAB308]",
    usage: "Highlights, important notices, featured content",
    context: "Draws attention positively, like a highlighter"
  },
  {
    name: "Light Yellow",
    category: "Warm Colors",
    group: 2,
    hex: "#FDE047",
    bgClass: "bg-[#FDE047]",
    textClass: "text-gray-900",
    borderClass: "border-[#FDE047]",
    usage: "Subtle highlights, gentle emphasis, tips",
    context: "Softer emphasis without overwhelming"
  },

  // Nature Colors - Growth, success, and organic content
  {
    name: "Lime",
    category: "Nature Colors",
    group: 2,
    hex: "#84CC16",
    bgClass: "bg-[#84CC16]",
    textClass: "text-white",
    borderClass: "border-[#84CC16]",
    usage: "New items, draft status, growth indicators",
    context: "Vibrant and lively, suggests growth and activity"
  },
  {
    name: "Green",
    category: "Nature Colors",
    group: 2,
    hex: "#22C55E",
    bgClass: "bg-[#22C55E]",
    textClass: "text-white",
    borderClass: "border-[#22C55E]",
    usage: "Success states, approved content, go signals",
    context: "Universal positive signal, completion and approval"
  },
  {
    name: "Emerald",
    category: "Nature Colors",
    group: 2,
    hex: "#10B981",
    bgClass: "bg-[#10B981]",
    textClass: "text-white",
    borderClass: "border-[#10B981]",
    usage: "Premium features, sustainability, quality content",
    context: "Sophisticated green, suggests value and quality"
  },
  {
    name: "Pear",
    category: "Nature Colors",
    group: 2,
    hex: "#A3E635",
    bgClass: "bg-[#A3E635]",
    textClass: "text-gray-900",
    borderClass: "border-[#A3E635]",
    usage: "Eco-friendly, sustainable, organic categories",
    context: "Natural and fresh, perfect for environmental themes"
  },
  {
    name: "Mint",
    category: "Nature Colors",
    group: 2,
    hex: "#6EE7B7",
    bgClass: "bg-[#6EE7B7]",
    textClass: "text-gray-900",
    borderClass: "border-[#6EE7B7]",
    usage: "Fresh content, wellness tags, calming categories",
    context: "Refreshing and clean, suggests renewal"
  },
  {
    name: "Teal",
    category: "Nature Colors",
    group: 2,
    hex: "#14B8A6",
    bgClass: "bg-[#14B8A6]",
    textClass: "text-white",
    borderClass: "border-[#14B8A6]",
    usage: "Medical, wellness, professional categories",
    context: "Balanced and trustworthy, great for healthcare"
  },
  {
    name: "Sage",
    category: "Nature Colors",
    group: 2,
    hex: "#84A98C",
    bgClass: "bg-[#84A98C]",
    textClass: "text-white",
    borderClass: "border-[#84A98C]",
    usage: "Natural content, wellness, calming states",
    context: "Earthy and grounded, suggests stability"
  },

  // Cool Colors - Calm, productivity, and clarity
  {
    name: "Cool",
    category: "Cool Colors",
    group: 2,
    hex: "#A5F3FC",
    bgClass: "bg-[#A5F3FC]",
    textClass: "text-gray-900",
    borderClass: "border-[#A5F3FC]",
    usage: "Light info, subtle categories, soft emphasis",
    context: "Refreshing and calming, great for informational tags"
  },
  {
    name: "Lemon",
    category: "Cool Colors",
    group: 2,
    hex: "#BEF264",
    bgClass: "bg-[#BEF264]",
    textClass: "text-gray-900",
    borderClass: "border-[#BEF264]",
    usage: "Fresh content, new items, recently added",
    context: "Bright and energizing, signals freshness"
  },

  // Cool Colors (Water/Sky) - Trust, technology, and communication
  {
    name: "Cyan",
    category: "Cool Colors",
    group: 2,
    hex: "#31D7DB",
    bgClass: "bg-[#31D7DB]",
    textClass: "text-gray-900",
    borderClass: "border-[#31D7DB]",
    usage: "Brand highlights, technology, modern categories",
    context: "Lepos signature color - use for brand moments and tech features"
  },
  {
    name: "Aqua",
    category: "Cool Colors",
    group: 2,
    hex: "#06B6D4",
    bgClass: "bg-[#06B6D4]",
    textClass: "text-white",
    borderClass: "border-[#06B6D4]",
    usage: "Information, communication, water-related content",
    context: "Clear and communicative, ideal for informational tags"
  },
  {
    name: "Turquoise",
    category: "Cool Colors",
    group: 2,
    hex: "#2DD4BF",
    bgClass: "bg-[#2DD4BF]",
    textClass: "text-gray-900",
    borderClass: "border-[#2DD4BF]",
    usage: "Creative content, tropical themes, energy",
    context: "Vibrant and tropical, adds energy to designs"
  },
  {
    name: "Sky",
    category: "Cool Colors",
    group: 2,
    hex: "#38BDF8",
    bgClass: "bg-[#38BDF8]",
    textClass: "text-gray-900",
    borderClass: "border-[#38BDF8]",
    usage: "General info, cloud services, weather",
    context: "Light and airy, perfect for cloud/sky themes"
  },
  {
    name: "Blue",
    category: "Cool Colors",
    group: 2,
    hex: "#3B82F6",
    bgClass: "bg-[#3B82F6]",
    textClass: "text-white",
    borderClass: "border-[#3B82F6]",
    usage: "Primary information, links, default states",
    context: "Classic and reliable, the universal 'information' color"
  },
  {
    name: "Azure",
    category: "Cool Colors",
    group: 2,
    hex: "#60A5FA",
    bgClass: "bg-[#60A5FA]",
    textClass: "text-gray-900",
    borderClass: "border-[#60A5FA]",
    usage: "Cloud platforms, digital services, tech content",
    context: "Modern and tech-focused, great for digital services"
  },
  {
    name: "Navy",
    category: "Cool Colors",
    group: 2,
    hex: "#1E3A8A",
    bgClass: "bg-[#1E3A8A]",
    textClass: "text-white",
    borderClass: "border-[#1E3A8A]",
    usage: "Professional content, corporate, formal categories",
    context: "Authoritative and professional, suggests expertise"
  },

  // Creative Colors - Imagination, creativity, and premium content
  {
    name: "Indigo",
    category: "Creative Colors",
    group: 2,
    hex: "#6366F1",
    bgClass: "bg-[#6366F1]",
    textClass: "text-white",
    borderClass: "border-[#6366F1]",
    usage: "Premium features, creative content, special offers",
    context: "Rich and sophisticated, suggests premium value"
  },
  {
    name: "Violet",
    category: "Creative Colors",
    group: 2,
    hex: "#8B5CF6",
    bgClass: "bg-[#8B5CF6]",
    textClass: "text-white",
    borderClass: "border-[#8B5CF6]",
    usage: "Creative projects, artistic content, innovation",
    context: "Imaginative and creative, perfect for artistic themes"
  },
  {
    name: "Purple",
    category: "Creative Colors",
    group: 2,
    hex: "#A855F7",
    bgClass: "bg-[#A855F7]",
    textClass: "text-white",
    borderClass: "border-[#A855F7]",
    usage: "Premium content, luxury, special events",
    context: "Royal and premium, signals exclusivity"
  },
  {
    name: "Lavender",
    category: "Creative Colors",
    group: 2,
    hex: "#C4B5FD",
    bgClass: "bg-[#C4B5FD]",
    textClass: "text-gray-900",
    borderClass: "border-[#C4B5FD]",
    usage: "Calm creativity, wellness, gentle emphasis",
    context: "Soft and soothing, combines calm with creativity"
  },
  {
    name: "Plum",
    category: "Creative Colors",
    group: 2,
    hex: "#9333EA",
    bgClass: "bg-[#9333EA]",
    textClass: "text-white",
    borderClass: "border-[#9333EA]",
    usage: "Rich content, premium services, luxury brands",
    context: "Deep and luxurious, suggests richness"
  },
  {
    name: "Fuchsia",
    category: "Creative Colors",
    group: 2,
    hex: "#E879F9",
    bgClass: "bg-[#E879F9]",
    textClass: "text-gray-900",
    borderClass: "border-[#E879F9]",
    usage: "Bold highlights, creative campaigns, attention",
    context: "Vibrant and bold, impossible to ignore"
  },
  {
    name: "Pink",
    category: "Creative Colors",
    group: 2,
    hex: "#EC4899",
    bgClass: "bg-[#EC4899]",
    textClass: "text-white",
    borderClass: "border-[#EC4899]",
    usage: "Love, favorites, special moments, featured",
    context: "Playful and affectionate, great for favorites"
  },
  {
    name: "Magenta",
    category: "Creative Colors",
    group: 2,
    hex: "#D946EF",
    bgClass: "bg-[#D946EF]",
    textClass: "text-white",
    borderClass: "border-[#D946EF]",
    usage: "Creative, trending, special campaigns",
    context: "Electric and modern, signals something special"
  },
  {
    name: "Blush",
    category: "Creative Colors",
    group: 2,
    hex: "#FCA5A5",
    bgClass: "bg-[#FCA5A5]",
    textClass: "text-gray-900",
    borderClass: "border-[#FCA5A5]",
    usage: "Gentle emphasis, soft announcements, delicate content",
    context: "Soft and approachable, gentle emphasis"
  },
  {
    name: "Peach",
    category: "Creative Colors",
    group: 2,
    hex: "#FDBA74",
    bgClass: "bg-[#FDBA74]",
    textClass: "text-gray-900",
    borderClass: "border-[#FDBA74]",
    usage: "Warm welcomes, friendly tones, approachable content",
    context: "Warm and inviting, creates friendly atmosphere"
  },

  // Specialty Colors - Unique use cases and special moments
  {
    name: "Bronze",
    category: "Specialty Colors",
    group: 2,
    hex: "#D4A574",
    bgClass: "bg-[#D4A574]",
    textClass: "text-gray-900",
    borderClass: "border-[#D4A574]",
    usage: "Achievement levels, tier rankings, accomplishments",
    context: "Third-place achievements and bronze tier content"
  },
  {
    name: "Gold",
    category: "Specialty Colors",
    group: 2,
    hex: "#FFD700",
    bgClass: "bg-[#FFD700]",
    textClass: "text-gray-900",
    borderClass: "border-[#FFD700]",
    usage: "Top achievements, premium content, awards",
    context: "Premium excellence and first-place achievements"
  },
];

// Group colors by group and category for easier rendering
export const tagColorsByGroupAndCategory = tagColors.reduce((acc, color) => {
  const groupKey = `group${color.group}`;
  if (!acc[groupKey]) {
    acc[groupKey] = {};
  }
  if (!acc[groupKey][color.category]) {
    acc[groupKey][color.category] = [];
  }
  acc[groupKey][color.category].push(color);
  return acc;
}, {} as Record<string, Record<string, TagColor[]>>);

export const tagCategories = [
  "Neutrals & Grays",
  "Warm Colors",
  "Nature Colors",
  "Cool Colors",
  "Creative Colors",
  "Specialty Colors"
];