'use client';
import LogoSmall from '@/svgs/logo-small';
import React from 'react';
import Items from './items';
import { Separator } from '@/components/ui/separator';
import ClerkAuthState from '../clerk-auth-state';
import { Handshake, ShieldCheck } from 'lucide-react';
import SubscriptionPlan from '../subscription-plan';
import UpgardeCard from './upgarde-card';
import usePaths from '@/hooks/use-navs';

const SidebarContent = () => {
  const { handleGoToRoute } = usePaths();
  return (
    <>
      <div className="flex flex-col gap-y-5 w-full h-full p-3 bg-[#0e0e0e] bg-opacity-90 bg-clip-padding backdrop-filter backdrop-blur-3xl overflow-y-auto max-h-screen scrollbar-hide lg:rounded-[1.4em]">
        <div className="flex gap-x-2 items-center justify-center">
          <LogoSmall />
        </div>

        <div className="flex flex-col py-3">
          <Items />
        </div>
        <div className="px-16 flex justify-center">
          <Separator orientation="horizontal" className="bg-[#333336] w-40" />
        </div>
        <div className="px-3 flex flex-col gap-y-5">
          <div className="flex items-center gap-x-2">
            <ClerkAuthState />
            <p className="text-[#9b9ca0]">Profile</p>
          </div>
          <div onClick={() => handleGoToRoute('/privacy-policy')} className="flex gap-x-3 cursor-pointer">
            <ShieldCheck className="text-[#9b9ca0]" />
            <p className="text-[#9b9ca0]">Privacy/Policy</p>
          </div>
          <div onClick={() => handleGoToRoute('/terms-of-service')} className="flex gap-x-3 cursor-pointer">
            <Handshake className="text-[#9b9ca0]" />
            <p className="text-[#9b9ca0]">Terms of service</p>
          </div>
        </div>
        <SubscriptionPlan type="FREE">
          <div className="flex flex-1 flex-col justify-end">
            <UpgardeCard />
          </div>
        </SubscriptionPlan>
      </div>
    </>
  );
};

export default SidebarContent;
