'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import Loader from '../loader';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateAutomation } from '@/hooks/use-mutations';
import AppTooltip from '../app-tooltip';

interface Props {
  hideLabelOnSmallScreen?: boolean;
}

const CreateAutomation = (props: Props) => {
  const { isPending, mutate } = useCreateAutomation();

  return (
    <AppTooltip text="Create automation">
      <Button
        onClick={() => mutate()}
        className="lg:px-10 py-6 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352cc] font-medium to-[#1c2d70]"
      >
        <Loader state={isPending}>
          <Activity />
        </Loader>
        <p className={cn('lg:inline', props.hideLabelOnSmallScreen && 'hidden')}>Create automation</p>
      </Button>
    </AppTooltip>
  );
};

export default CreateAutomation;
