import { v4 as uuid } from 'uuid';
import { FaInstagram } from 'react-icons/fa';

export interface IntegrationCardProps {
  id: string;
  title: string;
  descriptions: string;
  icon: React.ReactNode;
  strategy: 'INSTAGRAM' | 'CRM';
}

export const INTEGRATIONS_CARDS: IntegrationCardProps[] = [
  {
    id: uuid(),
    title: 'Connect Instagram',
    descriptions: 'Connect your Instagram account to automate messages, track comments, and manage interactions directly from your dashboard.',
    icon: <FaInstagram color="#3352cc" size={35} />,
    strategy: 'INSTAGRAM',
  },
];
