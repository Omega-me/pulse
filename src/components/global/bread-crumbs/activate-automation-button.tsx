import { Button } from "@/components/ui/button";
import React from "react";
import Loader from "../loader";
import { Zap, ZapOff } from "lucide-react";
import AppTooltip from "../app-tooltip";
import { useAutomationQuery } from "@/hooks/use-queries";
import { useActivateAutomationMutation } from "@/hooks/use-mutations";

interface Props {
  id: string;
}

const ActivateAutomationButton = (props: Props) => {
  const { data: automation } = useAutomationQuery(props.id);
  const { mutate, isPending } = useActivateAutomationMutation(props.id);

  return (
    <AppTooltip
      text={
        automation?.data?.active ? "Disable Automation" : "Activate automation"
      }
    >
      <Button
        onClick={() =>
          mutate({
            state: !automation?.data?.active,
          } as unknown as any)
        }
        className="bg-gradient-to-br hover:bg-[#4F46E5] hover:opacity-80 text-white rounded-md font-medium bg-[#4F46E5]"
      >
        <Loader state={isPending}>
          {automation?.data?.active ? <Zap /> : <ZapOff />}
        </Loader>
        <p className="lg:inline hidden">
          {!automation?.data?.active ? "Disabled" : "Active"}
        </p>
      </Button>
    </AppTooltip>
  );
};

export default ActivateAutomationButton;
