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
import GradientButton from "../gradient-button";
import GlowCard from "../glow-card";

interface Props {
  listeners: Listener[];
  keywords: Keyword[];
}

export function ListenerCarousel(props: Props) {
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
                <div className="flex items-center justify-between">
                  <div className="flex gap-x-2">
                    <CircleAlert color="#3352cc" />
                    Then...
                  </div>
                  <div>
                    {listener.listener === ListenerType.SMARTAI ? (
                      <GradientButton
                        type="BUTTON"
                        className="w-full bg-muted text-white hover:bg-muted"
                      >
                        <Sparkles className="text-purple-500" />
                        <span className="text-purple-500">Smart AI</span>
                      </GradientButton>
                    ) : (
                      <Button className="bg-muted hover:bg-muted">
                        <CircleAlert className="text-white" />{" "}
                        <span className="text-white">Standard</span>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-5 flex-wrap items-center">
                  {props.keywords
                    ?.filter((k) => k.listenerId === listener.id)
                    .map((word) => (
                      <div
                        key={word.id}
                        className="relative group cursor-pointer bg-gradient-to-br from-[#3352cc] to-[#1c2d70] flex items-center gap-x-2 capitalize text-white font-light py-1 px-4 hover:pr-8 transition-all duration-300 rounded-full"
                      >
                        <p className="text-sm md:text-lg flex items-center justify-between gap-x-1 p-1">
                          {word.word}
                          {/* TODO: handle delete keyword */}
                          <AppDialog
                            trigger={
                              <X
                                className="absolute top-[50%] left-[100%] translate-x-[-160%] translate-y-[-50%] opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300"
                                size={16}
                              />
                            }
                            onConfirm={() =>
                              // remove({ id: post?.id } as unknown as any)
                              console.log(word)
                            }
                            actionText={
                              <span className="flex items-center gap-x-2">
                                <Loader state={false}>
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
                  <TriggerButton2
                    trigger={
                      <Button
                        variant="ghost"
                        className="border-[#3352cc] border-2 border-dashed hover:opacity-80 transition duration-100 rounded-full"
                        size="icon"
                      >
                        <Plus color="#7688dd" />
                      </Button>
                    }
                  >
                    {/* TODO: handle add new keywords */}
                    <div>Attach more keywords to this listener</div>
                  </TriggerButton2>
                </div>
                <div className="max-h-[250px] group bg-muted p-3 rounded-xl flex flex-col gap-y-2">
                  <div className="flex gap-x-2 items-center justify-between">
                    <div className="flex gap-x-2 items-center">
                      {listener.listener === "MESSAGE" ? (
                        <SendHorizontal color="#3352cc" />
                      ) : (
                        <Sparkles color="#3352cc" />
                      )}
                      <p className="text-sm md:text-lg">
                        {listener.listener === "MESSAGE"
                          ? "Send the user a message"
                          : "Let Smart AI take over"}
                      </p>
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
                              className="text-muted-foreground"
                            />
                          </Button>
                        }
                      >
                        {/* TODO: handle message or prompt reply */}
                        <ScrollArea className="h-[60vh] w-full p-3">
                          <p className="text-sm font-light">
                            {listener.prompt}
                          </p>
                        </ScrollArea>
                      </TriggerButton2>
                    </div>
                  </div>

                  <p className="line-clamp-[9] text-sm font-light">
                    {listener.prompt}
                  </p>
                </div>
                {listener.commentReply && (
                  <div className="max-h-[150px] group bg-muted p-3 rounded-xl flex flex-col gap-y-2 mt-1">
                    <div className="flex gap-x-2 items-center justify-between">
                      <div className="flex items-center gap-x-2">
                        <MessageCircleHeart color="#3352cc" />
                        <p className="text-sm md:text-lg">
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
                              className="text-muted-foreground"
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
                    <p className="line-clamp-4 text-sm font-light">
                      {listener.commentReply}
                    </p>
                  </div>
                )}
              </div>
            </GlowCard>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
