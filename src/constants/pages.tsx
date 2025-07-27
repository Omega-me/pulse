import {
  ContactRound,
  Bolt,
  House,
  Activity,
  Rocket,
  ShoppingCart,
} from "lucide-react";

export const PAGE_BREAD_CRUMBS: string[] = [
  "automations",
  "automations2",
  "integrations",
  "settings",
  "products",
];

type PageIcon = {
  [page in string]: React.ReactNode;
};

export const PAGE_ICON: PageIcon = {
  AUTOMATIONS: <Activity color="#4F46E5" size={30} />,
  AUTOMATIONS2: <Activity color="#4F46E5" size={30} />,
  CONTACTS: <ContactRound color="#4F46E5" size={30} />,
  INTEGRATIONS: <Rocket color="#4F46E5" size={30} />,
  SETTINGS: <Bolt color="#4F46E5" size={30} />,
  PRODUCTS: <ShoppingCart color="#4F46E5" size={30} />,
  HOME: <House color="#4F46E5" size={30} />,
};
