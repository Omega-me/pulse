"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Loader from "../loader";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateAutomationMutation } from "@/hooks/use-mutations";
import AppTooltip from "../app-tooltip";
import { Automations } from "@prisma/client";
import { v4 as uuid } from "uuid";

interface Props {
  hideLabelOnSmallScreen?: boolean;
  isNav?: boolean;
  isAd?: boolean;
}

const newAutomation = (): Automations & {
  triggers: any[];
  listener: any[];
  posts: any[];
  keywords: any[];
  dms: any[];
} => {
  return {
    id: uuid(),
    name: "Untitled",
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {},
    userId: "user-id",
    triggers: [],
    listener: [],
    posts: [],
    keywords: [],
    dms: [],
  };
};

const CreateAutomation = (props: Props) => {
  const { isPending, mutate: createAutomation } = useCreateAutomationMutation();

  return props.isNav ? (
    <AppTooltip
      text={props.isAd ? "Create ad automation" : "Create automation"}
    >
      <Button
        onClick={() => createAutomation(newAutomation())}
        className="lg:px-10 py-6 bg-gradient-to-br hover:bg-[#4F46E5] hover:opacity-[80%] text-white rounded-md bg-[#4F46E5] transition-opacity duration-300"
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
      onClick={() => createAutomation(newAutomation())}
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
