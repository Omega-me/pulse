"use client";
import { onOAuthIntegration } from "@/actions/integrations";
import { Button } from "@/components/ui/button";
import { IntegrationCardProps } from "@/constants/integrations";
import { useQueryUser } from "@/hooks/use-queries";
import { findIntegration } from "@/utils";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

interface Props extends IntegrationCardProps {
  message?: string;
}

const IntegrationCard = (props: Props) => {
  const hasRun = useRef(false);
  const onOAuth = () => onOAuthIntegration(props.strategy);

  const { data: user } = useQueryUser();

  const integrated = findIntegration(user?.data?.integrations, props.strategy);

  useEffect(() => {
    if (props.message && !hasRun.current) {
      toast.message(props.message);
      hasRun.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border-2 border-[#3352cc] rounded-2xl gap-x-5 p-5 flex items-center">
      {props.icon}
      <div className="flex flex-col flex-1">
        <h3 className="text-xl">{props.title}</h3>
        <p className="text-[#9d9d9d] text-base w-full">{props.descriptions}</p>
      </div>
      <Button
        onClick={onOAuth}
        disabled={integrated?.name === props.strategy}
        className="bg-gradient-to-br text-white rounded-full text-sm from-[#3352cc] font-medium to-[#1c2d70] hover:opacity-70 transition-all duration-100"
      >
        {integrated ? "Connected" : "Connect"}
      </Button>
    </div>
  );
};

export default IntegrationCard;
