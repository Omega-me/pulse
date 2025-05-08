'use client';
import { CircleCheck } from 'lucide-react';
import React from 'react';
import PaymentButton from '../../payment-button';
import CreateAutomation from '../create-automation';
import SideCard from './side-card';
import { useQueryUser } from '@/hooks/use-queries';

const Aside = () => {
  const { data: user } = useQueryUser();

  return (
    <>
      {user?.data?.subscription?.plan === 'FREE' && (
        <div className="mb-4">
          <SideCard
            title="Upgrade to Pro"
            description="Focus on content creation and let us take care of the rest!"
            actionBtn={<PaymentButton isOnSideCard={true} />}
          >
            <p className="text-5xl bg-gradient-to-r from-[#3352cc] via-[#cc3bd4] to-[#d064ac] font-bold bg-clip-text text-transparent">Smart AI</p>
            <p className="text-xl font-bold">
              $29.99<span className="text-sm font-normal">/month</span>
            </p>
          </SideCard>
        </div>
      )}
      <SideCard title="Automations" description="Your live automations will show here" actionBtn={<CreateAutomation />}>
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-start justify-between">
            <div className=" flex flex-col">
              <h3 className="font-medium">Direct traffcic towards website</h3>
              <p className="text-muted-foreground text-sm">October 5th 2024</p>
            </div>
            <CircleCheck className="text-indigo-500" />
          </div>
        ))}
      </SideCard>
    </>
  );
};

export default Aside;
