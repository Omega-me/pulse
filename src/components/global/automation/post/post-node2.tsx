/* eslint-disable @next/next/no-img-element */
"use client";
import { Separator } from "@/components/ui/separator";
import useAutomationPosts from "@/hooks/use-automation-posts";
import { useAutomationQuery } from "@/hooks/use-queries";
import { CircleAlert, Trash2, X } from "lucide-react";
import React from "react";
import { FaAd, FaInstagram } from "react-icons/fa";
import AppDialog from "../../app-dialog";
import Loader from "../../loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostType } from "@prisma/client";
import AppTooltip from "../../app-tooltip";
import ThenAction2 from "../then/then-action2";
import PostButton from ".";
import GlowCard from "../../glow-card";
import NodeTitle from "../node/node-title";

interface Props {
  automationId: string;
}

const PostNode2 = (props: Props) => {
  const { data: automation } = useAutomationQuery(props.automationId);
  const { remove, isRemovingPost, removeAllPosts, isRemovingAllPosts } =
    useAutomationPosts(props.automationId);
  return (
    automation?.data &&
    automation?.data?.posts?.length > 0 && (
      <>
        <div className="flex flex-col justify-between items-center relative !-top-3 m-0">
          <span className="w-2 h-2 rounded-md bg-muted"></span>
          <Separator orientation="vertical" className="h-20 m-0" />
          <span className="w-2 h-2 rounded-md bg-muted z-50"></span>
        </div>
        <GlowCard
          spread={50}
          glow={true}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
          containerClassName="-mt-6 rounded-md w-[99%] md:w-11/12 lg:w-10/12 xl:w-6/12 group/posts"
        >
          <div className="w-full p-5 rounded-md flex flex-col bg-[#1d1d1d] gap-y-3">
            <div className="flex gap-x-2 items-center justify-between">
              <NodeTitle
                title="If they comment on..."
                icon={<CircleAlert className="text-purple-500" size={18} />}
                className="font-bold text-gray-400"
              />
              <AppDialog
                className="!w-[400px]"
                trigger={
                  <Trash2
                    size={18}
                    className="text-purple-500 group-hover/posts:scale-100 scale-0 transition-transform duration-300 cursor-pointer"
                  />
                }
                title={"Remove all posts"}
                onConfirm={() =>
                  removeAllPosts({
                    automationId: props.automationId,
                  } as unknown as any)
                }
                actionText={
                  <span className="flex items-center gap-x-2">
                    <Loader state={isRemovingAllPosts}>
                      <Trash2 />
                    </Loader>
                    Remove
                  </span>
                }
                description="Do you want to remove all the attached posts from the automation?"
              />
            </div>
            <div className="bg-muted p-3 rounded-md flex flex-col gap-y-2">
              <div className="bg-muted p-3 rounded-md flex flex-col gap-y-2">
                <NodeTitle
                  title="These posts"
                  icon={<FaInstagram className="text-blue-500" size={18} />}
                  className="text-gray-200 font-semibold"
                />
                <ScrollArea className="h-[250px] w-full rounded-md border p-3">
                  <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 mt-3 overflow-auto">
                    {/* TODO: handle posts loading and empty state better */}
                    {automation?.data?.posts?.map((post) => (
                      <div
                        key={post?.id}
                        className="group relative aspect-square rounded-md cursor-pointer"
                      >
                        <AppDialog
                          className="!w-[400px]"
                          trigger={
                            <X
                              size={12}
                              className="scale-0 transition-transform duration-300 group-hover:scale-100 absolute right-0 m-1 cursor-pointer"
                            />
                          }
                          onConfirm={() =>
                            remove({ id: post?.id } as unknown as any)
                          }
                          actionText={
                            <span className="flex items-center gap-x-2">
                              <Loader state={isRemovingPost}>
                                <Trash2 />
                              </Loader>
                              Remove
                            </span>
                          }
                          title="Remove"
                          description="Do you want to remove this post?"
                        />
                        {post.postType === PostType.AD && (
                          <AppTooltip text="This post is an Ad">
                            <FaAd className="absolute top-[75%] left-[75%] z-[90]" />
                          </AppTooltip>
                        )}
                        <img
                          src={post.media}
                          alt="Instagram post"
                          width={300}
                          height={300}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    ))}
                    <PostButton
                      isOnSelectedPosts={true}
                      automationId={props.automationId}
                    />
                  </div>
                </ScrollArea>
              </div>
            </div>
            <ThenAction2 automationId={props.automationId} />
          </div>
        </GlowCard>
      </>
    )
  );
};

export default PostNode2;
