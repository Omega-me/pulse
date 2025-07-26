"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Loader from "../loader";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateAutomation } from "@/hooks/use-mutations";
import AppTooltip from "../app-tooltip";

interface Props {
  hideLabelOnSmallScreen?: boolean;
  isNav?: boolean;
  isAd?: boolean;
}

const CreateAutomation = (props: Props) => {
  const { isPending, mutate } = useCreateAutomation();

  return props.isNav ? (
    <AppTooltip
      text={props.isAd ? "Create ad automation" : "Create automation"}
    >
      <Button
        onClick={() => mutate()}
        className="lg:px-10 py-6 bg-gradient-to-br hover:bg-[#4F46E5] hover:opacity-[80%] text-white rounded-full bg-[#4F46E5] transition-opacity duration-300"
      >
        <Loader state={isPending}>
          <Activity />
        </Loader>
        <p
          className={cn("lg:inline", props.hideLabelOnSmallScreen && "hidden")}
        >
          {props.isAd ? "Create ad automation" : "Create automation"}
        </p>
      </Button>
    </AppTooltip>
  ) : (
    <Button
      variant="ghost"
      onClick={() => mutate()}
      className="lg:px-10 py-6 bg-gradient-to-br hover:bg-[#4F46E5] hover:opacity-[80%] text-white rounded-md bg-[#4F46E5] transition-opacity duration-300"
    >
      <Loader state={isPending}>
        <Activity />
      </Loader>
      <p className={cn("lg:inline", props.hideLabelOnSmallScreen && "hidden")}>
        {props.isAd ? "Create ad automation" : "Create automation"}
      </p>
    </Button>
  );
};

export default CreateAutomation;
