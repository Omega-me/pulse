import { v4 as uuid } from 'uuid';

export interface DashboardCardProps {
  id: string;
  label: string;
  subLabel: string;
  description: string;
}
export const DASHBOARD_CARDS: DashboardCardProps[] = [
  {
    id: uuid(),
    label: 'Set-up Auto Replies',
    subLabel: 'Deliver a product lineup throught Instagram DM',
    description: 'Get product in front of you followers in as many places',
  },
  {
    id: uuid(),
    label: 'Answer Questions with AI',
    subLabel: 'Identify and respond to queries with AI',
    description: 'The intention of message will automatically detecetd',
  },
];
