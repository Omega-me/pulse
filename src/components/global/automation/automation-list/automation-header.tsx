import useTouch from "@/hooks/use-touch";
import { Automation, Keyword, Trigger, TriggerType } from "@prisma/client";
import moment from "moment";
import { FaInstagram } from "react-icons/fa";
import AppTooltip from "../../app-tooltip";
import NodeTitle from "../node/node-title";
import { Badge } from "@/components/ui/badge";
import { SendHorizontal } from "lucide-react";
import AutomationActionButtons from "./automation-action-buttons";

interface Props {
  automation: Automation & { keywords: Keyword[]; triggers: Trigger[] };
  onDelete: () => void;
  onNavigate: () => void;
}

const AutomationHeader = ({ automation, onDelete, onNavigate }: Props) => {
  const isTouchDevice = useTouch();
  return (
    <div className="relative p-4 w-full flex gap-x-2 justify-between">
      <div className="w-3 h-3">
        <AppTooltip side="top" text={automation.active ? "Active" : "Disabled"}>
          {automation.active ? (
            <Badge
              className="w-full h-full px-1 bg-green-500/30 border-green-500 hover:bg-green-500/30"
              variant="default"
            />
          ) : (
            <Badge
              className="w-full h-full px-1 bg-gray-500/30 border-gray-500 hover:bg-gray-500/30"
              variant="default"
            />
          )}
        </AppTooltip>
      </div>
      <div className="flex flex-col flex-1 items-start">
        <div className="flex items-center gap-x-2">
          <p className="text-sm md:text-md font-semibold">{automation.name}</p>
          <p className="text-muted-foreground whitespace-nowrap text-[9px] sm:text-[11px] font-light">
            {moment(automation.updatedAt).fromNow()}
          </p>
        </div>
        <div className="flex flex-col mt-3 gap-y-1">
          {automation.triggers.map((trigger: Trigger) => (
            <NodeTitle
              key={trigger.id}
              title={
                trigger.type === TriggerType.COMMENT
                  ? "User comments on my post"
                  : "User sends me a direct message"
              }
              icon={
                trigger.type === TriggerType.COMMENT ? (
                  <FaInstagram size={16} className="text-pink-400" />
                ) : (
                  <SendHorizontal size={16} className="text-blue-400" />
                )
              }
              className="text-muted-foreground text-sm font-light"
            />
          ))}
        </div>
      </div>
      <AutomationActionButtons
        onNavigate={onNavigate}
        onDelete={onDelete}
        isTouchDevice={isTouchDevice}
      />
    </div>
  );
};

export default AutomationHeader;
