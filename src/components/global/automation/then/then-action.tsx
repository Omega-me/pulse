import React from "react";
import { AUTOMATION_LISTENER } from "@/constants/automation";
import SubscriptionPlan from "../../subscription-plan";
import { cn, findIntegration } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "../../loader";
import { CirclePlus, Save } from "lucide-react";
import { IntegrationType, ListenerType } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserQuery } from "@/hooks/use-queries";
import useListener from "@/hooks/use-listener";
import TriggerButton from "../trigger-button";
import Keywords from "../trigger/keywords";

interface Props {
  automationId: string;
  hasDmTriggerOnly: boolean;
}

const ThenAction = (props: Props) => {
  const { data: user } = useUserQuery();
  const facebookIntegration = findIntegration(
    user.data.integrations,
    IntegrationType.FACEBOOK
  );
  const isMobile = useIsMobile();
  const {
    isPending,
    listener: Listener,
    hasOnlyDmTrigger,
    onFormSubmit,
    onSetListener,
    register,
  } = useListener(props.automationId);

  return (
    <TriggerButton
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
      <ScrollArea
        className={cn("h-auto pr-3", {
          "md:h-[300px]": hasOnlyDmTrigger,
        })}
      >
        <div className="flex flex-col gap-y-2 w-full p-1">
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
          <Keywords automationId={props.automationId} />
          <form onSubmit={onFormSubmit} className="flex flex-col gap-y-2">
            <Textarea
              placeholder={
                Listener === ListenerType.SMARTAI
                  ? "Add a prompt that your Smart AI can use..."
                  : "Add a message you want to sent to the customers"
              }
              {...register("prompt")}
              className={cn(
                "bg-muted outline-none border-none ring-0 focus:ring-0 !ring-[#4F46E5]",
                { "h-32": isMobile }
              )}
            />
            {!props.hasDmTriggerOnly && (
              <Input
                disabled={!facebookIntegration}
                {...register("reply")}
                placeholder={
                  facebookIntegration
                    ? "Add comment reply (Optional)"
                    : "Add comment reply (Facebook integration)"
                }
                className="bg-muted outline-none border-none ring-0 focus:ring-0 !ring-[#4F46E5]"
              />
            )}
            <Button className="w-full bg-[#4F46E5] hover:bg-[#4F46E5] hover:opacity-80 rounded-md font-medium text-white">
              <Loader state={isPending}>
                <Save />
              </Loader>
              Add listener
            </Button>
          </form>
        </div>
      </ScrollArea>
    </TriggerButton>
  );
};

export default ThenAction;
