/* eslint-disable @next/next/no-img-element */
"use client";
import { Separator } from "@/components/ui/separator";
import useAutomationPosts from "@/hooks/use-automation-posts";
import { useQueryAutomation } from "@/hooks/use-queries";
import { CircleAlert, Trash2, X } from "lucide-react";
import React from "react";
import { FaAd, FaInstagram } from "react-icons/fa";
import AppDialog from "../../app-dialog";
import Loader from "../../loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostType } from "@prisma/client";
import AppTooltip from "../../app-tooltip";

interface Props {
  id: string;
}

const PostNode = (props: Props) => {
  const { data: automation } = useQueryAutomation(props.id);
  const { remove, isRemovePending } = useAutomationPosts(props.id);
  return (
    automation?.data &&
    automation?.data?.posts?.length > 0 && (
      <>
        <div className="flex flex-col justify-between items-center relative !-top-3 m-0">
          <span className="w-2 h-2 rounded-full bg-muted"></span>
          <Separator orientation="vertical" className="h-20 m-0" />
          <span className="w-2 h-2 rounded-full bg-muted"></span>
        </div>
        <div
          className="-mt-6 w-full p-5 rounded-xl flex flex-col bg-[#1d1d1d] gap-y-3    
         md:w-8/12 lg:w-8/12 xl:w-4/12   
        "
        >
          <div className="flex gap-x-2">
            <CircleAlert color="#3352cc" />
            If they comment on...
          </div>
          <div className="bg-muted p-3 rounded-xl flex flex-col gap-y-2">
            <div className="bg-muted p-3 rounded-xl flex flex-col gap-y-2">
              <div className="flex gap-x-2 items-center ">
                <FaInstagram color="#3352cc" size={25} />
                <p className="font-bold text-lg">These posts</p>
              </div>
              <ScrollArea className="h-[250px] w-full rounded-md border p-3">
                <div className="grid grid-cols-3 gap-3 mt-3 overflow-auto">
                  {automation?.data?.posts?.map((post) => (
                    <div
                      key={post?.id}
                      className="relative aspect-square rounded-lg cursor-pointer"
                    >
                      <AppDialog
                        trigger={
                          <X
                            size={12}
                            className="absolute right-0 m-1 cursor-pointer"
                          />
                        }
                        onConfirm={() =>
                          remove({ id: post?.id } as unknown as any)
                        }
                        actionText={
                          <span className="flex items-center gap-x-2">
                            <Loader state={isRemovePending}>
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
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default PostNode;
