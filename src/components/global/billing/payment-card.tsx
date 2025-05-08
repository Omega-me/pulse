import { Button } from '@/components/ui/button';
import { FREE_FEATURES, PRO_FEATURES } from '@/constants/features';
import { cn } from '@/lib/utils';
import React from 'react';
import PlanFeatures from './plan-features';
import useSubscription from '@/hooks/use-subscription';
import Loader from '../loader';

interface Props {
  label: string;
  current: 'PRO' | 'FREE';
  landing?: boolean;
}

const PaymentCard = (props: Props) => {
  const { isProcessing, onSubscribe } = useSubscription();

  return (
    <div
      className={cn(
        props.label !== props.current
          ? 'bg-in-active'
          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
        'p-[2px] rounded-xl overflow-hidden lg:w-[600px] md:w-[400px] w-full',
      )}>
      <div
        className={cn(
          props.landing && 'radial--gradient--pink',
          'flex flex-col justify-between rounded-xl pl-5 py-5 pr-10 h-full bg-[#1f1f1f]',
        )}>
        <div>
          {props.landing ? (
            <h2 className="text-2xl">
              {props.label === 'PRO' && 'Premium Plan'}
              {props.label === 'FREE' && 'Standard'}
            </h2>
          ) : (
            <h2 className="text-2xl">
              {props.label === props.current
                ? 'Your Current Plan'
                : props.current === 'PRO'
                ? 'Downgrade'
                : 'Upgrade'}
            </h2>
          )}
          <p className="text-muted-foreground text-sm mb-2">
            This is what you plan covers
          </p>
          {props.label === 'PRO' ? (
            <span className="bg-gradient-to-r text-3xl from-indigo-500 via-purple-500 to-pink-500 font-bold bg-clip-text text-transparent">
              Smart AI
            </span>
          ) : (
            <p className="font-bold mt-2 text-xl text-muted-foreground">
              Standard
            </p>
          )}
          {props.label === 'PRO' ? (
            <p className="mb-2">
              <b className="text-xl">$29.99</b>/month
            </p>
          ) : (
            <p className="text-xl mb-2">Free</p>
          )}
          {props.label === 'FREE' ? (
            <PlanFeatures featureData={FREE_FEATURES} />
          ) : (
            <PlanFeatures featureData={PRO_FEATURES} />
          )}
        </div>
        {props.landing ? (
          <Button
            className={cn(
              'rounded-md mt-5',
              props.label === 'PRO'
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:bg-gradient-to-br'
                : 'bg-[#0e0e0e] text-white hover:bg-[#141414]',
            )}>
            {props.label === props.current
              ? 'Get Started'
              : props.current === 'PRO'
              ? 'Free'
              : 'Get Started'}
          </Button>
        ) : (
          <Button
            onClick={() => props.label === 'PRO' && onSubscribe()}
            className="rounded-md mt-5 bg-[#0e0e0e] hover:bg-[#141414] text-white"
            disabled={props.label === props.current}>
            <Loader state={isProcessing}>
              {props.label === props.current
                ? 'Active'
                : props.current === 'PRO'
                ? 'Downgrade'
                : 'Upgrade'}
            </Loader>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentCard;
