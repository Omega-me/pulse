"use client";
import { Button } from "@/components/ui/button";
import { DashboardCardProps } from "@/constants/dashboard";
import { useCreateAutomationMutation } from "@/hooks/use-mutations";
import { ArrowRight } from "lucide-react";
import React from "react";
import Loader from "../loader";

interface Props extends DashboardCardProps {}

const DoubleGradientCard = (props: Props) => {
  const { isPending, mutate } = useCreateAutomationMutation();

  return (
    <div className="relative border-[1px] border-in-active/50 p-5 rounded-xl flex flex-col gap-y-20 overflow-hidden lg:w-[600px]">
      <div className="flex flex-col z-10">
        <h2 className="text-2xl font-medium">{props.label}</h2>
        <p className="text-muted-foreground text-sm">{props.subLabel}</p>
      </div>
      <div className="flex justify-between items-center z-10 gap-x-10">
        <p className="text-muted-foreground text-sm">{props.description}</p>
        <Button onClick={() => mutate()} className="rounded-full">
          <Loader state={isPending}>
            <ArrowRight color="white" />
          </Loader>
        </Button>
      </div>
      <div className="rounded-full absolute w-6/12 h-full top-[-50%] left-[-10%] z-1 bg-gradient-to-tl from-slate-900 to-blue-700 drop-shadow-xs blur-3xl"></div>
      <div className="rounded-full absolute w-6/12 h-full top-[80%] left-[80%] z-1 bg-gradient-to-tl from-slate-900 to-blue-700 drop-shadow-xs blur-3xl"></div>
    </div>
  );
};

export default DoubleGradientCard;
