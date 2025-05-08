import AppTooltip from '@/components/global/app-tooltip';
import { House } from 'lucide-react';

export const PUBLIC_ROUTES: { id: number; href: string; title?: string; icon?: React.ReactNode }[] = [
  {
    id: 1,
    icon: (
      <AppTooltip text="Dashboard">
        <House />
      </AppTooltip>
    ),
    href: '/dashboard',
  },
  {
    id: 2,
    title: 'Privacy Policy',
    href: '/privacy-policy',
  },
  {
    id: 3,
    title: 'Terms of Service',
    href: '/terms-of-service',
  },
];
