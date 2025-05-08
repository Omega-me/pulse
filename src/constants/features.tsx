export interface Features {
  id: number;
  feature: string;
  description: string;
}

export const FREE_FEATURES: Features[] = [
  {
    id: 0,
    feature: 'Connect 1 Instagram Account',
    description: 'Users can integrate one account.',
  },
  {
    id: 1,
    feature: 'Comment Monitoring',
    description: 'Get notified when users comment on posts.',
  },
  {
    id: 2,
    feature: 'Basic Analytics',
    description: 'See engagement stats (messages/comments).',
  },
];

export const PRO_FEATURES: Features[] = [
  {
    id: 0,
    feature: 'Unlimited Auto-Replies',
    description: 'Full DM automation for customer queries or orders.',
  },
  {
    id: 1,
    feature: 'Full Analytics Dashboard',
    description: 'Track growth, engagement, post performance, follower insights.',
  },
  {
    id: 2,
    feature: 'AI Sales Assistant (Unlimited)',
    description: 'Unlimited product recommendations, inquiry handling, and order collection.',
  },
  {
    id: 3,
    feature: 'Priority Support',
    description: 'Fast response and help with integration or bugs.',
  },
];
