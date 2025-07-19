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
import { useQueryUser } from "@/hooks/use-queries";
import { findIntegration } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bolt, Cable, Unplug } from "lucide-react";
import IntegrationConfigs from "./integration-configs";
import { useDisconnectIntegration } from "@/hooks/use-mutations";
import AppDialog from "../app-dialog";
import Loader from "../loader";
import { useRouter } from "next/navigation";

interface Props extends IntegrationCardProps {
  message?: string;
}

const IntegrationCard = (props: Props) => {
  const router = useRouter();
  const hasRun = useRef(false);
  const onOAuth = () => onOAuthIntegration(props.strategy);
  const { mutate: disconnect, isPending } = useDisconnectIntegration(
    props.strategy
  );
  const { data: user } = useQueryUser();
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
        {props.icon}
        <div className="flex flex-col flex-1">
          <h3 className="text-xl">{props.title}</h3>
          <p className="text-[#9d9d9d] text-base w-full">
            {props.descriptions}
          </p>
        </div>

        {props.hasIntegrationBtn &&
          (integrated ? (
            <p>
              <AppDialog
                trigger={
                  <span
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-pointer flex justify-between items-center gap-2 px-4 py-2 bg-gradient-to-br text-white rounded-full text-sm from-[#3352cc] font-medium to-[#1c2d70] hover:opacity-70 transition-all duration-100"
                  >
                    <Unplug size={18} />
                    <span>Disconnect</span>
                  </span>
                }
                onConfirm={() => disconnect()}
                actionText={
                  <span className="flex items-center gap-x-2">
                    <Loader state={isPending}>
                      <Unplug />
                    </Loader>
                    Disconnect
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
              className="bg-gradient-to-br text-white rounded-full text-sm from-[#3352cc] font-medium to-[#1c2d70] hover:opacity-70 transition-all duration-100"
            >
              <Cable />
              <span>Connect</span>
            </Button>
          ))}
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
      className="border-2 border-[#3352cc] rounded-2xl"
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
              <IntegrationConfigs strategy={props.strategy} />
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default IntegrationCard;
