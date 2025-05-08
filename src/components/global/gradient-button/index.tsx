import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  type: 'BUTTON' | 'LINK';
  href?: string;
  className?: string;
}

const GradientButton = (props: Props) => {
  const gradients = 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-[2px]';

  switch (props.type) {
    case 'BUTTON':
      return (
        <div className={gradients}>
          <Button className={cn(props.className, 'rounded-xl')}>{props.children}</Button>
        </div>
      );
    case 'LINK':
      return (
        <div className={gradients}>
          <Link href={props.href!} className={cn(props.className, 'rounded-xl')}>
            {props.children}
          </Link>
        </div>
      );
    default:
      return;
  }
};

export default GradientButton;
