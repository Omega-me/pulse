'use client';
import { Button } from '@/components/ui/button';
import useSubscription from '@/hooks/use-subscription';
import Loader from '../loader';
import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOnSideCard?: boolean;
}

const PaymentButton = (props: Props) => {
  const { isProcessing, onSubscribe } = useSubscription();

  return (
    <Button
      onClick={onSubscribe}
      disabled={isProcessing}
      className={cn(
        'bg-gradient-to-br text-white rounded-md from-[#9685db] via-[#9434e6] to-[#cc3bd4]  hover:bg-gradient-to-bl font-bold',
        props.isOnSideCard && 'lg:px-10 py-6 rounded-full'
      )}
    >
      <Loader state={isProcessing}>
        <CreditCard />
      </Loader>
      <span>Upgrade</span>
    </Button>
  );
};

export default PaymentButton;
