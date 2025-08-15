"use client";
import { Input } from "@/components/ui/input";
import { useAutomationQuery } from "@/hooks/use-queries";
import { Send, X } from "lucide-react";
import React from "react";
import Loader from "../../loader";
import { Button } from "@/components/ui/button";
import AppTooltip from "../../app-tooltip";
import { Keyword } from "@prisma/client";
import useKeywords from "@/hooks/use-keywords";

interface Props {
  automationId: string;
  listenerId?: string;
}
const Keywords = (props: Props) => {
  const {
    removeKeyword,
    keyword,
    onKeyPress,
    onValueChange,
    variables,
    isPendingAdd,
    onClickAddKeyword,
  } = useKeywords(props.automationId);
  const latestVariables = variables as unknown as { keyword: string };
  const { data: automation } = useAutomationQuery(props.automationId);

  return (
    <div className="bg-muted flex flex-col gap-y-3 p-3 rounded-md w-full">
      <p className="text-sm text-muted-foreground">
        Add words that trigger automations
      </p>
      <div className="flex flex-wrap justify-start items-center gap-2">
        {automation?.data?.keywords &&
          automation?.data?.keywords.length > 0 &&
          automation?.data?.keywords
            .filter((k) => k.listenerId === null)
            .map((keyword: Keyword) => (
              <div
                key={keyword.id}
                className="bg-[#141414] flex items-center gap-2 capitalize text-sm text-muted-foreground px-2 py-1 rounded-md"
              >
                <p>{keyword.word}</p>
                <X
                  size={20}
                  className="cursor-pointer"
                  onClick={() => removeKeyword({ id: keyword.id } as any)}
                />
              </div>
            ))}

        {latestVariables &&
          latestVariables.keyword &&
          isPendingAdd &&
          !props.listenerId && (
            <div className="bg-[#141414] flex items-center gap-x-2 capitalize text-sm text-muted-foreground px-2 py-1 rounded-md">
              {latestVariables.keyword}
            </div>
          )}
      </div>
      <div className="flex justify-between items-center gap-x-2">
        <Input
          placeholder="Add keyword..."
          value={keyword}
          className="bg-transparent ring-0 border-none focus:outline-none focus:ring-0 !ring-[#4F46E5]"
          onChange={onValueChange}
          onKeyUp={(e) => onKeyPress(e, props.listenerId)}
        />
        <AppTooltip text="Add keyword">
          <Button
            className="bg-[#4F46E5] hover:bg-[#4F46E5] hover:opacity-80 text-white rounded-md"
            onClick={() => onClickAddKeyword(props.listenerId)}
          >
            <Loader state={isPendingAdd}>
              <Send size={20} />
            </Loader>
          </Button>
        </AppTooltip>
      </div>
    </div>
  );
};

export default Keywords;
