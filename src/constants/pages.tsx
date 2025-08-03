import {
  DuotoneActivity,
  DuotoneBolt,
  DuotoneCart,
  DuotoneHouse,
  DuotoneRocket,
} from "@/components/global/icons";

export const PAGE_BREAD_CRUMBS: string[] = [
  "automations2",
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
      baseOpacity={1}
      accentOpacity={0}
      baseColor="#4F46E5"
      accentColor="#4F46E5"
    />
  ),
  INTEGRATIONS: (
    <DuotoneRocket size={35} baseColor="#4F46E5" accentColor="#4F46E5" />
  ),
  SETTINGS: <DuotoneBolt size={35} baseColor="#4F46E5" accentColor="#4F46E5" />,
  PRODUCTS: <DuotoneCart size={35} baseColor="#4F46E5" accentColor="#4F46E5" />,
  HOME: <DuotoneHouse size={35} baseColor="#4F46E5" accentColor="#4F46E5" />,
};
