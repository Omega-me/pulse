"use client";
import { onOAuthIntegration } from "@/actions/integrations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IntegrationCardProps } from "@/constants/integrations";
import { useUserQuery } from "@/hooks/use-queries";
import { findIntegration } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bolt, Cable, Unplug } from "lucide-react";
import IntegrationConfigs from "./integration-configs";
import { useDisconnectIntegrationMutation } from "@/hooks/use-mutations";
import AppDialog from "../app-dialog";
import Loader from "../loader";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props extends IntegrationCardProps {
  message?: string;
}

const IntegrationCard = (props: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const hasRun = useRef(false);
  const onOAuth = () => onOAuthIntegration(props.strategy);
  const { mutate: disconnect, isPending } = useDisconnectIntegrationMutation(
    props.strategy
  );
  const { data: user } = useUserQuery();
  const integrated = findIntegration(user?.data?.integrations, props.strategy);

  useEffect(() => {
    if (props.message && !hasRun.current) {
      toast.message(props.message);
      hasRun.current = true;
    }

    const timeout = setTimeout(() => {
      router.push("/dashboard/integrations");
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTrigger = () => {
    return (
      <div className="gap-x-5 p-5 flex items-center">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2 mb-2">
              <p>{props.icon}</p>
              <h3 className="text-xl">{props.title}</h3>
            </div>
            <div>
              {props.hasIntegrationBtn &&
                (integrated ? (
                  <p>
                    <AppDialog
                      className="!w-[400px]"
                      trigger={
                        // WIP
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="cursor-pointer flex justify-between items-center gap-2 px-3 py-2 text-white rounded-md text-sm bg-[#4F46E5] hover:opacity-80 hover:bg-[#4F46E5]"
                        >
                          <Unplug size={18} />
                          {!isMobile && <span>Disconnect</span>}
                        </span>
                      }
                      onConfirm={() => disconnect({})}
                      actionText={
                        <span className="flex items-center gap-x-2">
                          <Loader state={isPending}>
                            <Unplug />
                          </Loader>
                          <span>Disconnect</span>
                        </span>
                      }
                      title="Disconnect"
                      description={`Do you want to disconnect ${props.strategy.toLowerCase()} ?`}
                    />
                  </p>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (integrated) {
                        return;
                      }
                      onOAuth();
                    }}
                    className="text-white rounded-md text-sm font-medium bg-[#4F46E5] hover:opacity-80 hover:bg-[#4F46E5]"
                  >
                    <Cable />
                    {!isMobile && <span>Connect</span>}
                  </Button>
                ))}
            </div>
          </div>
          <p className="text-[#9d9d9d] text-base w-full">
            {props.descriptions}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={
        integrated && props.collapsable ? props.strategy : undefined
      }
      className="border-2 border-[#4F46E5] rounded-2xl"
    >
      <AccordionItem className="border-none" value={props.strategy}>
        {props.collapsable ? (
          <AccordionTrigger className="hover:no-underline">
            {renderTrigger()}
          </AccordionTrigger>
        ) : (
          renderTrigger()
        )}

        <AccordionContent className="p-5">
          <ScrollArea className="h-72 w-full rounded-xl border">
            <div className="p-4">
              <h4 className="mb-4 text-sm leading-none font-medium flex items-center gap-x-2">
                <Bolt /> <span>Configurations</span>
              </h4>
              <Separator className="my-2" />
              <IntegrationConfigs
                integrated={integrated}
                strategy={props.strategy}
              />
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default IntegrationCard;
