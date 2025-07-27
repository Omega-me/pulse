"use client";
import { Input } from "@/components/ui/input";
import useKeywords from "@/hooks/use-keywords";
import { useAutomationQuery } from "@/hooks/use-queries";
import { Send, X } from "lucide-react";
import React from "react";
import Loader from "../../loader";
import { Button } from "@/components/ui/button";
import AppTooltip from "../../app-tooltip";

interface Props {
  id: string;
}
const Keywords = (props: Props) => {
  const {
    deleteMuatation,
    keyword,
    onKeyPress,
    onValueChange,
    variables,
    isPendingAdd,
    onClickAddKeyword,
  } = useKeywords(props.id);
  const latestVariables = variables as unknown as { keyword: string };
  const { data: automation } = useAutomationQuery(props.id);

  return (
    <div className="bg-muted flex flex-col gap-y-3 p-3 rounded-xl">
      <p className="text-sm text-muted-foreground">
        Add words that trigger automations
      </p>
      <div className="flex flex-wrap justify-start items-center gap-2">
        {automation?.data?.keywords &&
          automation?.data?.keywords.length > 0 &&
          automation?.data?.keywords?.map((keyword) => (
            <div
              key={keyword.id}
              className="bg-[#141414] flex items-center gap-2 capitalize text-sm text-muted-foreground px-2 py-1 rounded-full"
            >
              <p>{keyword.word}</p>
              <X
                size={20}
                className="cursor-pointer"
                onClick={() => deleteMuatation({ id: keyword.id } as any)}
              />
            </div>
          ))}

        {latestVariables && latestVariables.keyword && isPendingAdd && (
          <div className="bg-[#141414] flex items-center gap-x-2 capitalize text-sm text-muted-foreground px-2 py-1 rounded-full">
            {latestVariables.keyword}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center gap-x-2">
        <Input
          placeholder="Add kewyword..."
          value={keyword}
          className="bg-transparent ring-0 border-none outline-none"
          onChange={onValueChange}
          onKeyUp={onKeyPress}
        />
        <AppTooltip text="Add keyword">
          <Button
            className="bg-gradient-to-br from-[#3352cc] to-[#1c2d70] text-white"
            onClick={onClickAddKeyword}
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
