import { useQueryUser } from '@/hooks/use-queries';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  type: 'FREE' | 'PRO';
}
const SubscriptionPlan = (props: Props) => {
  const { data: user } = useQueryUser();
  return user?.data?.subscription?.plan === props.type && props.children;
};

export default SubscriptionPlan;
