import { Activity, Blocks, Bolt, House, Rocket } from 'lucide-react';
import { v4 as uuid } from 'uuid';

interface FieldProps {
  label: string;
  id: string;
}

export interface SidebarProps extends FieldProps {
  icon: React.ReactNode;
}
export const SIDEBAR_MENU: SidebarProps[] = [
  {
    id: uuid(),
    label: 'home',
    icon: <House />,
  },
  {
    id: uuid(),
    label: 'automations',
    icon: <Activity />,
  },
  {
    id: uuid(),
    label: 'integrations',
    icon: <Rocket />,
  },
  {
    id: uuid(),
    label: 'settings',
    icon: <Bolt />,
  },
];
