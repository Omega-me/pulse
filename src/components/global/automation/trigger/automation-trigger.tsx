"use client";

import React from "react";
import { useAutomationQuery } from "@/hooks/use-queries";
import { Separator } from "@/components/ui/separator";
import { AUTOMATION_TRIGGERS } from "@/constants/automation";
import useTriggers from "@/hooks/use-triggers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Loader from "../../loader";
import PostButton from "../post";
import { TriggerType } from "@prisma/client";
import TriggerButton2 from "../trigger-button";
import { CirclePlus, Save } from "lucide-react";
import ActiveTrigger from "./active-trigger";
import ThenAction from "../then/then-action";

interface Props {
  id: string;
}

const AutomationTrigger = ({ id }: Props) => {
  const { data: automation } = useAutomationQuery(id);
  const { onSetTrigger, onSaveTrigger, types, isPending } = useTriggers(id);
  const hasDmTriggerOnly =
    automation.data.triggers.length === 1 &&
    automation.data.triggers[0].type === TriggerType.DM;

  const triggers = automation?.data?.triggers ?? [];

  const shouldShowPostButton = () => {
    if (triggers.length === 2) return true;
    if (triggers.length === 1 && triggers[0].type === TriggerType.COMMENT) {
      return true;
    }
    return false;
  };

  const renderActiveTriggers = () => {
    if (triggers.length === 0) return null;

    return (
      <>
        <ActiveTrigger
          type={triggers[0].type}
          keywords={automation!.data.keywords}
        />
        {triggers.length > 1 && (
          <>
            <div className="relative w-6/12">
              <p className="absolute transform bg-[#1d1d1d] px-2 -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2">
                or
              </p>
              <Separator
                orientation="horizontal"
                className="border-muted border-[1px]"
              />
            </div>
            <ActiveTrigger
              type={triggers[1].type}
              keywords={automation!.data.keywords}
            />
          </>
        )}
      </>
    );
  };

  if (automation?.data && triggers.length > 0) {
    return (
      <div className="flex flex-col gap-y-6 items-center">
        {renderActiveTriggers()}
        {shouldShowPostButton() ? (
          <PostButton automationId={id} />
        ) : (
          <ThenAction hasDmTriggerOnly={hasDmTriggerOnly} automationId={id} />
        )}
      </div>
    );
  }

  return (
    <TriggerButton2
      trigger={
        <div
          className="border-2 border-dashed w-full border-purple-500 
        hover:opacity-80 cursor-pointer 
        transition duration-100 rounded-xl 
        flex gap-x-2 justify-center items-center p-5"
        >
          <CirclePlus className="text-purple-500" />
          <p className="text-purple-500 font-bold">Add Trigger</p>
        </div>
      }
    >
      <div className="flex flex-col gap-y-2 w-full">
        {AUTOMATION_TRIGGERS.map((trigger) => (
          <div
            key={trigger.id}
            onClick={() => onSetTrigger(trigger.type)}
            className={cn(
              "hover:opacity-80 text-white rounded-xl flex cursor-pointer flex-col p-3 gap-y-2",
              !types?.includes(trigger.type)
                ? "bg-muted"
                : "bg-[#4F46E5] font-medium"
            )}
          >
            <div className="flex gap-x-2 items-center">
              {trigger.icon}
              <p className="font-bold">{trigger.label}</p>
            </div>
            <p className="text-sm font-light">{trigger.description}</p>
          </div>
        ))}
        <Button
          onClick={onSaveTrigger}
          disabled={types?.length === 0}
          className="bg-[#4F46E5] hover:opacity-80 hover:bg-[#4F46E5] font-medium text-white"
        >
          <Loader state={isPending}>
            <Save />
          </Loader>
          <p>Create trigger</p>
        </Button>
      </div>
    </TriggerButton2>
  );
};

export default AutomationTrigger;
