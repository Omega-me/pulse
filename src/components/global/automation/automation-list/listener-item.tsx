import {
  Automations,
  Keyword,
  Listener,
  ListenerType,
  Trigger,
} from "@prisma/client";
import NodeTitle from "../node/node-title";
import {
  CircleAlert,
  Ellipsis,
  MessageCircleHeart,
  SendHorizontal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import AppTooltip from "../../app-tooltip";
import { Badge } from "@/components/ui/badge";
import AppDialog from "../../app-dialog";
import moment from "moment";
import { Button } from "@/components/ui/button";
import Loader from "../../loader";
import { cn } from "@/lib/utils";
import TriggerButton from "../trigger-button";

interface Props {
  listener: Listener;
  automation: Automations & { keywords: Keyword[]; triggers: Trigger[] };
  onDelete: () => void;
  showHandle: boolean;
}
const keywordColors = [
  "bg-green-500/15 border-green-800",
  "bg-purple-500/15 border-purple-800",
  "bg-yellow-500/15 border-yellow-800",
  "bg-red-500/15 border-red-800",
];
const ListenerItem = ({
  listener,
  automation,
  onDelete,
  showHandle,
}: Props) => {
  const keywords: Keyword[] = automation.keywords.filter(
    (k: Keyword) => k.listenerId === listener.id
  );
  const showKeywords: Keyword[] = keywords.slice(0, 3);

  return (
    <div
      className={cn(" space-y-3 sm:space-y-4 w-full", {
        "pt-3 pr-3 pb-3 pl-0": showHandle,
        "p-3 sm:p-4": !showHandle,
      })}
    >
      {/* Header with listener type and actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-shrink-0">
          {listener.listener === ListenerType.SMARTAI ? (
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md p-[1px]">
              <div className="flex gap-x-2 w-full bg-muted text-white hover:bg-muted items-center justify-center rounded-md px-3 py-1">
                <NodeTitle
                  icon={<Sparkles size={10} />}
                  title="Smart AI"
                  className="text-purple-500 text-[11px]"
                />
                <AppTooltip
                  side="top"
                  text={listener.isActive ? "Active" : "Disabled"}
                >
                  {listener.isActive ? (
                    <Badge
                      className="p-1 bg-green-500/30 border-green-500 hover:bg-green-500/30 cursor-pointer"
                      variant="default"
                    >
                      <span className="sr-only" />
                    </Badge>
                  ) : (
                    <Badge
                      className="p-1 bg-red-500/30 border-red-500 hover:bg-red-500/30 cursor-pointer"
                      variant="default"
                    >
                      <span className="sr-only" />
                    </Badge>
                  )}
                </AppTooltip>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-x-1">
              <div className="flex gap-x-2 items-center justify-center text-[10px] sm:text-[11px] rounded-md px-2 sm:px-3 py-1 border-[1px] bg-gray-500/15 border-gray-500">
                <NodeTitle
                  icon={<CircleAlert size={10} />}
                  title="Standard"
                  className="text-gray-400 text-[11px]"
                />
                <AppTooltip
                  side="top"
                  text={listener.isActive ? "Active" : "Disabled"}
                >
                  {listener.isActive ? (
                    <Badge
                      className="p-1 bg-green-500/30 border-green-500 hover:bg-green-500/30 cursor-pointer"
                      variant="default"
                    >
                      <span className="sr-only" />
                    </Badge>
                  ) : (
                    <Badge
                      className="p-1 bg-red-500/30 border-red-500 hover:bg-red-500/30 cursor-pointer"
                      variant="default"
                    >
                      <span className="sr-only" />
                    </Badge>
                  )}
                </AppTooltip>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-1 sm:gap-x-2 flex-shrink-0">
          <p className="text-muted-foreground whitespace-nowrap text-[9px] sm:text-[11px] font-light transition-all duration-300 opacity-0 group-hover/listener:opacity-100">
            {moment(listener.createdAt).fromNow()}
          </p>
          <AppDialog
            className="!w-[400px] rounded-md"
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="group/btnlistener opacity-0 transition-all group-hover/listener:opacity-100 rounded-md h-6 w-6 sm:h-7 sm:w-7 p-0 bg-gray-500/15 border-gray-500 hover:bg-red-500/15 hover:border-red-500 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <X
                  className="text-gray-400 transition-colors duration-300 group-hover/btnlistener:text-red-500"
                  size={12}
                />
              </Button>
            }
            onConfirm={onDelete}
            title="Remove"
            description="Do you want to remove this listener?"
            actionText={
              <span className="flex items-center gap-x-2">
                <Loader state={false}>
                  <Trash2 />
                </Loader>
                Remove
              </span>
            }
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="space-y-2">
        {/* DM Response */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#0f0f0f]/30 rounded-md border border-muted-foreground/10">
          <div className="flex-1 min-w-0">
            <NodeTitle
              title={
                listener.listener === ListenerType.SMARTAI
                  ? "AI Prompt"
                  : "DM Response"
              }
              icon={
                listener.listener === ListenerType.SMARTAI ? (
                  <Sparkles size={14} />
                ) : (
                  <SendHorizontal size={14} />
                )
              }
              className={cn("text-[10px] sm:text-[11px] font-medium mb-0.5", {
                "text-purple-500": listener.listener === ListenerType.SMARTAI,
                "text-blue-400": listener.listener === ListenerType.MESSAGE,
              })}
            />
            <p className="text-xs sm:text-sm text-gray-400 leading-snug line-clamp-3">
              {listener.prompt}
            </p>
          </div>
        </div>

        {/* Comment Reply */}
        {listener.commentReply && (
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#0f0f0f]/30 rounded-md border border-muted-foreground/10">
            <div className="flex-1 min-w-0">
              <NodeTitle
                title="Comment Reply"
                icon={<MessageCircleHeart size={14} />}
                className="text-[10px] sm:text-[11px] text-pink-400 font-medium mb-0.5"
              />
              <p className="text-xs sm:text-sm text-gray-400 leading-snug line-clamp-3">
                {listener.commentReply || "No comment reply set"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Keywords section */}
      <div className="space-y-2">
        <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
          Keywords {keywords.length > 0 && `(${keywords.length})`}
        </p>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {showKeywords.map((keyword, i) => (
            <div
              key={keyword.id}
              className={cn(
                "flex items-center justify-center text-[10px] sm:text-[11px] rounded-md px-2 sm:px-3 py-1 border-[1px] font-medium",
                keywordColors[i % keywordColors.length]
              )}
            >
              <p className="truncate max-w-[80px] sm:max-w-[120px]">
                {keyword.word}
              </p>
            </div>
          ))}

          <TriggerButton
            trigger={
              <div className="flex items-center justify-center rounded-md px-2 sm:px-3 py-1 border-[1px] bg-gray-500/15 border-gray-500 hover:bg-gray-500/30 cursor-pointer text-[10px] sm:text-[11px] font-medium">
                <span className="text-gray-300 ">
                  {keywords.length <= 3 ? (
                    <Ellipsis size={10} className="text-gray-300 sm:size-3" />
                  ) : (
                    <span className="flex items-center gap-x-1">
                      <span>+{keywords.length - 3}</span>
                      <Ellipsis size={10} className="text-gray-300 sm:size-3" />
                    </span>
                  )}
                </span>
              </div>
            }
            title="Keywords"
          >
            <div className="flex flex-wrap gap-2 mt-5 bg-[#191919] rounded-md p-3 w-full">
              {keywords.map((keyword, i) => (
                <div
                  key={keyword.id}
                  className={cn(
                    "flex items-center justify-center text-[11px] sm:text-[12px] rounded-md py-2 px-3 border-[1px] font-medium",
                    keywordColors[i % keywordColors.length]
                  )}
                >
                  <p>{keyword.word}</p>
                </div>
              ))}
            </div>
          </TriggerButton>

          {keywords.length === 0 && (
            <div className="flex items-center justify-center rounded-md border-[1px] bg-muted/50 border-dashed border-muted-foreground/40 py-1 px-2 sm:px-3">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium italic">
                No keywords configured
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListenerItem;
