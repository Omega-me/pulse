import useListener from '@/hooks/use-listener';
import React from 'react';
import TriggerButton from '../trigger-button';
import { AUTOMATION_LISTENER } from '@/constants/automation';
import SubscriptionPlan from '../../subscription-plan';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '../../loader';

interface Props {
  id: string;
}

const ThenAction = (props: Props) => {
  const { isPending, listener: Listener, onFormSubmit, onSetListener, register } = useListener(props.id);
  return (
    <TriggerButton label="Then">
      <div className="flex flex-col gap-y-2">
        {AUTOMATION_LISTENER.map((listener) =>
          listener.type === 'SMARTAI' ? (
            <SubscriptionPlan key={listener.id} type="PRO">
              <div
                onClick={() => onSetListener(listener.type)}
                key={listener.id}
                className={cn(
                  Listener === listener.type ? 'bg-gradient-to-br from-[#3352cc] to-[#1c2d70] ' : 'bg-muted',
                  'p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100'
                )}
              >
                <div className="flex gap-x-2 items-center">
                  {listener.icon}

                  <p>{listener.label}</p>
                </div>
                <p>{listener.description}</p>
              </div>
            </SubscriptionPlan>
          ) : (
            <div
              onClick={() => onSetListener(listener.type)}
              key={listener.id}
              className={cn(
                Listener === listener.type ? 'bg-gradient-to-br from-[#3352cc] to-[#1c2d70] ' : 'bg-muted',
                'p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100'
              )}
            >
              <div className="flex gap-x-2 items-center">
                {listener.icon}
                <p>{listener.label}</p>
              </div>
              <p>{listener.description}</p>
            </div>
          )
        )}
        <form onSubmit={onFormSubmit} className="flex flex-col gap-y-2">
          <Textarea
            placeholder={Listener === 'SMARTAI' ? 'Add a prompt that your Smart AI can use...' : 'Add a message you want to sent to the customers'}
            {...register('prompt')}
            className="bg-muted outline-none border-none ring-0 focus:ring-0"
          />
          <Input
            {...register('reply')}
            placeholder="Add reply for comments (Optional)"
            className="bg-muted outline-none border-none ring-0 focus:ring-0"
          />
          <Button className="bg-gradient-to-br w-full from-[#3352cc] font-medium text-white to-[#1c2d70]">
            <Loader state={isPending}>Add listener</Loader>
          </Button>
        </form>
      </div>
    </TriggerButton>
  );
};

export default ThenAction;
