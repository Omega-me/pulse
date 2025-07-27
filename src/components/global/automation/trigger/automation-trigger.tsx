"use client";
import { useAutomationQuery } from "@/hooks/use-queries";
import React from "react";
import ActiveTrigger from "./active-trigger";
import { Separator } from "@/components/ui/separator";
import ThenAction from "../then/then-action";
import TriggerButton from "../trigger-button";
import { AUTOMATION_TRIGGERS } from "@/constants/automation";
import useTriggers from "@/hooks/use-triggers";
import { cn } from "@/lib/utils";
import Keywords from "./keywords";
import { Button } from "@/components/ui/button";
import Loader from "../../loader";

interface Props {
  id: string;
}

const AutomationTrigger = (props: Props) => {
  const { data: automation } = useAutomationQuery(props.id);
  const { onSetTrigger, onSaveTrigger, types, isPending } = useTriggers(
    props.id
  );

  if (automation?.data && automation?.data?.triggers.length > 0) {
    return (
      <div className="flex flex-col gap-y-6 items-center">
        <ActiveTrigger
          type={automation.data.triggers[0].type}
          keywords={automation.data.keywords}
        />
        {automation.data.triggers.length > 1 && (
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
              type={automation.data.triggers[1].type}
              keywords={automation.data.keywords}
            />
          </>
        )}
        {!automation.data.listener && <ThenAction id={props.id} />}
      </div>
    );
  }

  return (
    <TriggerButton label="Add Trigger">
      <div className="flex flex-col gap-y-2">
        {AUTOMATION_TRIGGERS.map((trigger) => (
          <div
            key={trigger.id}
            onClick={() => onSetTrigger(trigger.type)}
            className={cn(
              "hover:opacity-80 text-white rounded-xl flex cursor-pointer flex-col p-3 gap-y-2",
              !types?.find((t) => t === trigger.type)
                ? "bg-muted"
                : "bg-gradient-to-br from-[#3352cc] font-medium  to-[#1c2d70]"
            )}
          >
            <div className="flex gap-x-2 items-center">
              {trigger.icon}
              <p className="font-bold">{trigger.label}</p>
            </div>
            <p className="text-sm font-light">{trigger.description}</p>
          </div>
        ))}
        <Keywords id={props.id} />
        <Button
          onClick={onSaveTrigger}
          disabled={types?.length === 0}
          className="bg-gradient-to-br from-[#3352cc] font-medium text-white to-[#1c2d70]"
        >
          <Loader state={isPending}>Create Trigger</Loader>
        </Button>
      </div>
    </TriggerButton>
  );
};

export default AutomationTrigger;
