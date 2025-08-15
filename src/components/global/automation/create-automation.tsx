"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Loader from "../loader";
import { Activity } from "lucide-react";
import { cn, findIntegration } from "@/lib/utils";
import { useCreateAutomationMutation } from "@/hooks/use-mutations";
import AppTooltip from "../app-tooltip";
import { Automation, IntegrationType } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { useUserQuery } from "@/hooks/use-queries";
import usePaths from "@/hooks/use-navs";

interface Props {
  hideLabelOnSmallScreen?: boolean;
  isNav?: boolean;
  isAd?: boolean;
  className?: string;
}

const newAutomation = (): Automation & {
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
  const { handleGoToRoute } = usePaths();
  const { isPending, mutate: createAutomation } = useCreateAutomationMutation();
  const { data: user } = useUserQuery();
  const instagramIntegration = findIntegration(
    user?.data.integrations,
    IntegrationType.INSTAGRAM
  );
  const handleCreateAutomation = () => {
    if (instagramIntegration && instagramIntegration.token) {
      createAutomation(newAutomation());
    } else {
      handleGoToRoute("/dashboard/integrations");
    }
  };

  return props.isNav ? (
    <AppTooltip
      text={props.isAd ? "Create ad automation" : "Create automation"}
    >
      <Button
        onClick={handleCreateAutomation}
        className={cn(
          "lg:px-10 py-6 bg-gradient-to-br hover:bg-[#4F46E5] hover:opacity-[80%] text-white rounded-md bg-[#4F46E5] transition-opacity duration-300",
          props.className
        )}
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
      onClick={handleCreateAutomation}
      className={cn(
        "lg:px-10 py-6 bg-gradient-to-br hover:bg-[#4F46E5] hover:opacity-[80%] text-white rounded-md bg-[#4F46E5] transition-opacity duration-300",
        props.className
      )}
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
