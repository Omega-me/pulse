"use client";
import { Separator } from "@/components/ui/separator";
import { useAutomationQuery } from "@/hooks/use-queries";
import React from "react";
import { ListenerCarousel } from "../../listener-carousel";
import { ArrowDown } from "lucide-react";

interface Props {
  automationId: string;
}
const ThenNode = (props: Props) => {
  const { data: automation } = useAutomationQuery(props.automationId);

  return automation?.data?.listener.length === 0 ? (
    <></>
  ) : (
    <div className="w-full flex flex-col items-center gap-y-2">
      <div className="flex flex-col justify-between items-center relative !-top-3 m-0">
        <span className="w-2 h-2 rounded-md bg-muted"></span>
        <Separator orientation="vertical" className="h-20 m-0" />
        <ArrowDown color="#27272A" className="-mt-2" strokeWidth={1.2} />
      </div>
      <ListenerCarousel
        automationId={props.automationId}
        listeners={automation?.data?.listener.sort(
          (a, b) => b.priority - a.priority
        )}
        keywords={automation?.data?.keywords}
      />
    </div>
  );
};

export default ThenNode;
