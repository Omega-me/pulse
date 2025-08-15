import {
  DuotoneActivity,
  DuotoneBolt,
  DuotoneCart,
  DuotoneHouse,
  DuotoneRocket,
} from "@/components/global/icons";

export const PAGE_BREAD_CRUMBS: string[] = [
  "automations",
  "integrations",
  "settings",
  "products",
];

type PageIcon = {
  [page in string]: React.ReactNode;
};

export const PAGE_ICON: PageIcon = {
  AUTOMATIONS2: (
    <DuotoneActivity
      size={35}
      baseColor="#4F46E5"
      accentColor="#19164a"
      accentOpacity={0}
      baseOpacity={1}
    />
  ),
  INTEGRATIONS: (
    <DuotoneRocket
      size={35}
      baseColor="#4F46E5"
      accentColor="#19164a"
      accentOpacity={0.5}
      baseOpacity={1}
    />
  ),
  SETTINGS: (
    <DuotoneBolt
      size={35}
      baseColor="#4F46E5"
      accentColor="#19164a"
      accentOpacity={0.5}
      baseOpacity={1}
      borderOpacity={1}
    />
  ),
  PRODUCTS: (
    <DuotoneCart
      size={35}
      baseColor="#4F46E5"
      accentColor="#19164a"
      accentOpacity={0.5}
      baseOpacity={1}
    />
  ),
  HOME: (
    <DuotoneHouse
      size={35}
      baseColor="#4F46E5"
      accentColor="#19164a"
      accentOpacity={0.5}
      baseOpacity={1}
      borderOpacity={0}
    />
  ),
};
