import React, { PropsWithChildren } from 'react';
import { cn } from '../../../lib/utils';
import { Loader2Icon } from 'lucide-react';

interface Props extends PropsWithChildren {
  state: boolean;
  className?: string;
  color?: string;
}

const Loader = (props: Props) => {
  return props.state ? (
    <div className={cn(props.className)}>
      <Loader2Icon className="animate-spin" />
    </div>
  ) : (
    props.children
  );
};

export default Loader;
