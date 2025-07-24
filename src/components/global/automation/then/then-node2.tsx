"use client";
import { Separator } from "@/components/ui/separator";
import { useQueryAutomation } from "@/hooks/use-queries";
import React from "react";
import { ListenerCarousel } from "../../listener-carousel";
import { ArrowDown } from "lucide-react";

interface Props {
  id: string;
}
const ThenNode2 = (props: Props) => {
  const { data: automation } = useQueryAutomation(props.id);

  return automation?.data?.listener.length === 0 ? (
    <></>
  ) : (
    <div className="w-full flex flex-col items-center gap-y-2">
      <div className="flex flex-col justify-between items-center relative !-top-3 m-0">
        <span className="w-2 h-2 rounded-full bg-muted"></span>
        <Separator orientation="vertical" className="h-20 m-0" />
        <ArrowDown color="#27272A" className="-mt-2" />
      </div>
      <ListenerCarousel
        listeners={automation?.data?.listener}
        keywords={automation?.data?.keywords}
      />
    </div>
  );
};

export default ThenNode2;
