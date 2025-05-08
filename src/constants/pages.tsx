import { ContactRound, Bolt, House, Activity, Rocket } from 'lucide-react';

export const PAGE_BREAD_CRUMBS: string[] = ['automations', 'integrations', 'settings'];

type PageIcon = {
  [page in string]: React.ReactNode;
};

export const PAGE_ICON: PageIcon = {
  AUTOMATIONS: <Activity color="#3352cc" size={30} />,
  CONTACTS: <ContactRound color="#3352cc" size={30} />,
  INTEGRATIONS: <Rocket color="#3352cc" size={30} />,
  SETTINGS: <Bolt color="#3352cc" size={30} />,
  HOME: <House color="#3352cc" size={30} />,
};
