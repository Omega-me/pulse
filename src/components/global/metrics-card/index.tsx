'use client';
import { useQueryAutomations } from '@/hooks/use-queries';
import React from 'react';

const MetricsCard = () => {
  const { data: automations } = useQueryAutomations();
  const comments = automations?.data.reduce((current, next) => {
    return current + next?.listener?.commentCount!;
  }, 0);
  const dms = automations?.data.reduce((current, next) => {
    return current + next?.listener?.dmCount!;
  }, 0);

  return (
    <div className="flex flex-col md:flex-row h-full gap-5">
      {[1, 2].map((i) => (
        <div key={i} className="p-5 border-[1px] flex flex-col justify-between gap-y-20 rounded-xl w-full lg:w-6/12">
          {i === 1 ? (
            <div>
              <h2 className="text-xl text-white font-bold">Comments</h2>
              <p className="text-sm text-muted-foreground">On your posts</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl text-white font-bold">Direct Message</h2>
              <p className="text-sm text-muted-foreground">On your account</p>
            </div>
          )}
          {i === 1 ? (
            <div>
              <h2 className="text-xl font-bold">100%</h2>
              <p className="text-sm text-muted-foreground">
                {comments} out of {comments} comments replied
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold">100%</h2>
              <p className="text-sm text-muted-foreground">
                {dms} out of {dms} DMs replied
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetricsCard;
