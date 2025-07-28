import React from "react";
import { AUTOMATION_LISTENER } from "@/constants/automation";
import SubscriptionPlan from "../../subscription-plan";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "../../loader";
import Keywords2 from "../trigger/keywords2";
import useListener2 from "@/hooks/use-listener2";
import TriggerButton2 from "../trigger-button-2";
import { CirclePlus, List, Save } from "lucide-react";
import { ListenerType } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  id: string;
}

const ThenAction2 = (props: Props) => {
  const {
    isPending,
    listener: Listener,
    onFormSubmit,
    onSetListener,
    register,
  } = useListener2(props.id);
  return (
    <TriggerButton2
      trigger={
        <div
          className="border-2 border-dashed w-full border-purple-500
        hover:opacity-80 cursor-pointer
        transition duration-100 rounded-md
        flex gap-x-2 justify-center items-center p-5"
        >
          <CirclePlus className="text-purple-500" />
          <p
            className="text-purple-500
            font-semibold"
          >
            Then
          </p>
        </div>
      }
    >
      <ScrollArea className="h-auto md:h-[400px] pr-3">
        <div className="flex flex-col gap-y-2 w-full">
          {AUTOMATION_LISTENER.map((listener) =>
            listener.type === "SMARTAI" ? (
              <SubscriptionPlan key={listener.id} type="PRO">
                <div
                  onClick={() => onSetListener(listener.type)}
                  key={listener.id}
                  className={cn(
                    Listener === listener.type
                      ? "bg-gradient-to-br bg-[#4F46E5]"
                      : "bg-muted",
                    "p-3 rounded-md flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100"
                  )}
                >
                  <div className="flex gap-x-2 items-center">
                    {listener.icon}

                    <p>{listener.label}</p>
                  </div>
                  <p>{listener.description}</p>
                </div>
              </SubscriptionPlan>
            ) : (
              <div
                onClick={() => onSetListener(listener.type)}
                key={listener.id}
                className={cn(
                  Listener === listener.type
                    ? "bg-gradient-to-br bg-[#4F46E5]"
                    : "bg-muted",
                  "p-3 rounded-md flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100"
                )}
              >
                <div className="flex gap-x-2 items-center">
                  {listener.icon}
                  <p>{listener.label}</p>
                </div>
                <p>{listener.description}</p>
              </div>
            )
          )}
          <Keywords2 id={props.id} />
          <form onSubmit={onFormSubmit} className="flex flex-col gap-y-2">
            <Textarea
              placeholder={
                Listener === ListenerType.SMARTAI
                  ? "Add a prompt that your Smart AI can use..."
                  : "Add a message you want to sent to the customers"
              }
              {...register("prompt")}
              className="bg-muted outline-none border-none ring-0 focus:ring-0 !ring-[#4F46E5]"
            />
            <Input
              {...register("reply")}
              placeholder="Add reply for comments (Optional)"
              className="bg-muted outline-none border-none ring-0 focus:ring-0 !ring-[#4F46E5]"
            />
            <Button className="w-full bg-[#4F46E5] hover:bg-[#4F46E5] hover:opacity-80 rounded-md font-medium text-white">
              <Loader state={isPending}>
                <Save />
              </Loader>
              Add listener
            </Button>
          </form>
        </div>
      </ScrollArea>
    </TriggerButton2>
  );
};

export default ThenAction2;
