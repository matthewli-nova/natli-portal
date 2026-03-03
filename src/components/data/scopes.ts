export type Scope = {
  label: string;
  value: string;
  type: "company" | "business-line" | "store";
  children?: Scope[];
};

export const scopes: Scope[] = [
  {
    value: "all-company",
    label: "Eventure Innovations Group",
    type: "company",
    children: [
      {
        value: "sunset-fest-2026",
        label: "Sunset Festival 2026",
        type: "business-line",
        children: [
          {
            value: "sunset-vip-lounge",
            label: "Diamond VIP Lounge",
            type: "store",
          },
          {
            value: "sunset-food-court",
            label: "Global Food Court",
            type: "store",
          },
          {
            value: "sunset-main-bar",
            label: "Main Stage Bar",
            type: "store",
          },
          {
            value: "sunset-craft-market",
            label: "Indie Craft Market",
            type: "store",
          },
          {
            value: "sunset-merch-booth",
            label: "Official Merch Booth",
            type: "store",
          },
          {
            value: "sunset-street-food",
            label: "Street Food Alley",
            type: "store",
          }
        ],
      },
      {
        value: "electric-wave",
        label: "Electric Wave",
        type: "business-line",
        children: [
          {
            value: "electric-vip-deck",
            label: "Gold VIP Deck",
            type: "store",
          }
        ]
      },
      {
        value: "urban-beats-2026",
        label: "Urban Beats 2026",
        type: "business-line",
        children: [
          {
            value: "urban-rooftop-vip",
            label: "Rooftop VIP",
            type: "store",
          },
          {
            value: "urban-food-trucks",
            label: "Food Truck Park",
            type: "store",
          },
          {
            value: "urban-art-zone",
            label: "Urban Art Zone",
            type: "store",
          }
        ],
      }
    ],
  },
];
