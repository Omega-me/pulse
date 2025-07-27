"use client";

import React from "react";
import PaymentButton from "../../payment-button";
import CreateAutomation from "../create-automation";
import SideCard from "./side-card";
import { useUserQuery } from "@/hooks/use-queries";
import { useFacebookAds } from "@/hooks/use-facebook-ads";
import { findIntegration } from "@/lib/utils";
import { IntegrationType } from "@prisma/client";

const Aside = () => {
  const { data: user } = useUserQuery();
  const { adAccounts } = useFacebookAds();
  const facebookIntegration = findIntegration(
    user?.data?.integrations,
    IntegrationType.FACEBOOK
  );

  return (
    <>
      {user?.data?.subscription?.plan === "FREE" && (
        <div className="mb-4">
          <SideCard
            title="Upgrade to Pro"
            description="Focus on content creation and let us take care of the rest!"
            actionBtn={<PaymentButton isOnSideCard={true} />}
          >
            <p className="text-5xl bg-gradient-to-r from-[#3352cc] via-[#cc3bd4] to-[#d064ac] font-bold bg-clip-text text-transparent">
              Smart AI
            </p>
            <p className="text-xl font-bold">
              $29.99<span className="text-sm font-normal">/month</span>
            </p>
          </SideCard>
        </div>
      )}
      <SideCard
        title="Automations"
        description="Start by automating a post or an ad"
        actionBtn={
          <div className="flex flex-col gap-3">
            <CreateAutomation />
            {facebookIntegration && adAccounts.length > 0 && (
              <CreateAutomation isAd />
            )}
          </div>
        }
      ></SideCard>
    </>
  );
};

export default Aside;
