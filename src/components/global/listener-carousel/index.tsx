import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Keyword, Listener, ListenerType } from "@prisma/client";
import {
  CircleAlert,
  MessageCircleHeart,
  Pencil,
  Plus,
  SendHorizontal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import TriggerButton2 from "../automation/trigger-button-2";
import AppDialog from "../app-dialog";
import Loader from "../loader";
import GlowCard from "../glow-card";
import { cn } from "@/lib/utils";
import NodeTitle from "../automation/node/node-title";
import useKeywords2 from "@/hooks/use-keywords2";
import Keywords2 from "../automation/trigger/keywords2";

interface Props {
  id: string;
  listeners: Listener[];
  keywords: Keyword[];
}

const keywordColors = [
  "bg-green-500/15 border-green-800",
  "bg-purple-500/15 border-purple-800",
  "bg-yellow-500/15 border-yellow-800",
  "bg-red-500/15 border-red-800",
];

export function ListenerCarousel(props: Props) {
  const { removeKeyword, isPendingDelete } = useKeywords2(props.id);

  return (
    <Carousel className="-mt-7 w-full md:w-11/12 lg:w-10/12 xl:w-6/12">
      <CarouselContent>
        {props?.listeners.map((listener) => (
          <CarouselItem key={listener?.id}>
            <GlowCard
              spread={50}
              glow={true}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
              containerClassName="rounded-xl m-1"
            >
              <div className="h-auto p-5 rounded-xl flex flex-col bg-[#1d1d1d] gap-y-3">
                {/* Header with listener type */}
                <div className="flex items-center justify-between">
                  <NodeTitle
                    title="Then..."
                    icon={<CircleAlert size={18} />}
                    className="text-purple-500 font-semibold"
                  />
                  <div>
                    {listener.listener === ListenerType.SMARTAI ? (
                      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full p-[1px]">
                        <div className="w-full bg-muted text-white hover:bg-muted flex items-center justify-center rounded-full px-3 py-1">
                          <Sparkles
                            size={10}
                            className="text-purple-500 mr-1"
                          />
                          <span className="text-purple-500 font-medium text-[12px]">
                            Smart AI
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-[10px] sm:text-[11px] rounded-full px-2 sm:px-3 py-1 border-[1px] bg-gray-500/15 border-gray-500">
                        <CircleAlert size={10} className="text-gray-400 mr-1" />
                        <span className="text-gray-400 font-medium">
                          Standard
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Keywords section */}
                <div className="space-y-2">
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                    Keywords{" "}
                    {props.keywords?.filter((k) => k.listenerId === listener.id)
                      .length > 0 &&
                      `(${
                        props.keywords?.filter(
                          (k) => k.listenerId === listener.id
                        ).length
                      })`}
                  </p>

                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {props.keywords
                      ?.filter((k) => k.listenerId === listener.id)
                      .map((keyword, i) => (
                        <div
                          key={keyword.id}
                          className={cn(
                            "relative group cursor-pointer flex items-center justify-center text-[11px] rounded-full p-1 px-2 border-[1px] font-medium  hover:pr-8 transition-all duration-300",
                            keywordColors[i % keywordColors.length]
                          )}
                        >
                          <p className="text-[12px] flex items-center justify-between gap-x-1">
                            {keyword.word}
                            <AppDialog
                              className="!w-[400px]"
                              trigger={
                                <X
                                  className="absolute top-[50%] left-[100%] translate-x-[-160%] translate-y-[-50%] opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300"
                                  size={16}
                                />
                              }
                              onConfirm={() =>
                                removeKeyword({
                                  id: keyword.id,
                                } as unknown as any)
                              }
                              actionText={
                                <span className="flex items-center gap-x-2">
                                  <Loader state={isPendingDelete}>
                                    <Trash2 />
                                  </Loader>
                                  Remove
                                </span>
                              }
                              title="Remove"
                              description="Do you want to remove this post?"
                            />
                          </p>
                        </div>
                      ))}

                    {props.keywords?.filter((k) => k.listenerId === listener.id)
                      .length === 0 && (
                      <div className="flex items-center justify-center rounded-full border-[1px] bg-muted/50 border-dashed border-muted-foreground/40 py-1 px-2 sm:px-3">
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium italic">
                          No keywords configured
                        </p>
                      </div>
                    )}

                    <TriggerButton2
                      trigger={
                        <div className="flex items-center justify-center rounded-full p-2 border-dashed border-[1px] bg-gray-500/15 border-gray-500 hover:bg-gray-500/30 cursor-pointer text-[10px] sm:text-[11px] font-medium">
                          <Plus size={10} className="text-gray-300 sm:size-3" />
                        </div>
                      }
                    >
                      <Keywords2 id={props.id} listenerId={listener.id} />
                    </TriggerButton2>
                  </div>
                </div>

                {/* message reply and prompt section */}
                <>
                  <div className="max-h-[250px] group bg-muted p-3 rounded-xl flex flex-col gap-y-2">
                    <div className="flex gap-x-2 items-center justify-between">
                      <div className="flex gap-x-2 items-center">
                        <NodeTitle
                          title={
                            listener.listener === ListenerType.MESSAGE
                              ? "Send the user a message"
                              : "Let Smart AI take over"
                          }
                          icon={
                            listener.listener === ListenerType.MESSAGE ? (
                              <SendHorizontal size={18} />
                            ) : (
                              <Sparkles size={18} />
                            )
                          }
                          className={cn(
                            "font-semibold",
                            listener.listener === ListenerType.MESSAGE
                              ? "text-blue-500"
                              : "text-purple-500"
                          )}
                        />
                      </div>
                      <div>
                        <TriggerButton2
                          trigger={
                            <Button
                              variant="ghost"
                              className="group-hover:scale-100 scale-0 transition-transform duration-300 hover:opacity-80"
                              size="icon"
                            >
                              <Pencil
                                size={10}
                                className={cn(
                                  "text-muted-foreground",
                                  listener.listener === ListenerType.MESSAGE
                                    ? "text-blue-500"
                                    : "text-purple-500"
                                )}
                              />
                            </Button>
                          }
                        >
                          {/* TODO: handle message or prompt reply edit*/}
                          <ScrollArea className="h-[60vh] w-full p-3">
                            <p className="text-sm font-light">
                              {listener.prompt}
                            </p>
                          </ScrollArea>
                        </TriggerButton2>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-snug line-clamp-[9]">
                      {listener.prompt}
                    </p>
                  </div>
                  {listener.commentReply && (
                    <div className="max-h-[150px] group bg-muted p-3 rounded-xl flex flex-col gap-y-2 mt-1">
                      <div className="flex gap-x-2 items-center justify-between">
                        <div className="flex items-center gap-x-2">
                          <MessageCircleHeart
                            size={18}
                            className="text-pink-500"
                          />
                          <p className="text-md text-pink-500">
                            Comment reply to the user
                          </p>
                        </div>
                        <TriggerButton2
                          trigger={
                            <Button
                              variant="ghost"
                              className="group-hover:scale-100 scale-0 transition-transform duration-300 hover:opacity-80"
                              size="icon"
                            >
                              <Pencil
                                size={10}
                                className="text-muted-foreground text-pink-500"
                              />
                            </Button>
                          }
                        >
                          {/* TODO: handle edit comment reply */}
                          <ScrollArea className="h-[50vh] w-full p-3">
                            <p className="text-sm font-light">
                              {listener.commentReply}
                            </p>
                          </ScrollArea>
                        </TriggerButton2>
                      </div>
                      <p className="text-sm text-gray-400 leading-snug line-clamp-[4]">
                        {listener.commentReply}
                      </p>
                    </div>
                  )}
                </>
              </div>
            </GlowCard>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
