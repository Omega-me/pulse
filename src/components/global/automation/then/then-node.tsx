'use client';
import { Separator } from '@/components/ui/separator';
import { useQueryAutomation } from '@/hooks/use-queries';
import { BrainCircuit, CircleAlert, SendHorizontal } from 'lucide-react';
import React from 'react';
import PostButton from '../post';

interface Props {
  id: string;
}
const ThenNode = (props: Props) => {
  const { data: automation } = useQueryAutomation(props.id);
  const commentTrigger = automation?.data?.triggers.find(
    t => t.type === 'COMMENT',
  );

  const renderPosts = () => {
    if (automation.data.posts.length > 0) {
      return <></>;
    }
    if (commentTrigger) {
      return <PostButton id={props.id} />;
    }

    return <></>;
  };

  return !automation?.data?.listener ? (
    <></>
  ) : (
    <>
      <div className="flex flex-col justify-between items-center relative !-top-3 m-0">
        <span className="w-2 h-2 rounded-full bg-muted"></span>
        <Separator orientation="vertical" className="h-20 m-0" />
        <span className="w-2 h-2 rounded-full bg-muted"></span>
      </div>
      <div className="-mt-6 w-full lg:w-10/12 xl:w-6/12 p-5 rounded-xl flex flex-col bg-[#1d1d1d] gap-y-3">
        <div className="flex gap-x-2">
          <CircleAlert color="#3352cc" />
          Then...
        </div>
        <div className="bg-muted p-3 rounded-xl flex flex-col gap-y-2">
          <div className="flex gap-x-2 items-center">
            {automation?.data?.listener.listener === 'MESSAGE' ? (
              <SendHorizontal color="#3352cc" />
            ) : (
              <BrainCircuit color="#3352cc" />
            )}
            <p className="text-lg">
              {automation.data.listener.listener === 'MESSAGE'
                ? 'Send the user a message'
                : 'Let Smart AI take over'}
            </p>
          </div>
          <p className="text-sm font-light">
            {automation.data.listener.prompt}
          </p>
        </div>
        {renderPosts()}
      </div>
    </>
  );
};

export default ThenNode;
