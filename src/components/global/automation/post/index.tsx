/* eslint-disable @next/next/no-img-element */
import useAutomationPosts from "@/hooks/use-automation-posts";
import { useQueryAutomationPosts } from "@/hooks/use-queries";
import React from "react";
import TriggerButton from "../trigger-button";
import { InstagrPostProps } from "@/types/posts.type";
import { CircleCheck, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "../../loader";
import AppTooltip from "../../app-tooltip";

interface Props {
  id: string;
}
const PostButton = (props: Props) => {
  const { data: postsData } = useQueryAutomationPosts();
  const {
    onSelectPost,
    posts,
    mutate,
    isPending,
    instagramPosts,
    handleInstagramPosts,
  } = useAutomationPosts(props.id);
  return (
    <TriggerButton
      onClick={async () => handleInstagramPosts(postsData)}
      label="Attach a post"
    >
      {postsData?.status === 200 ? (
        <div className="flex flex-col gap-y-3 w-full">
          <div className="flex flex-wrap w-full gap-2 height-[400px] max-h-[400px] overflow-y-auto">
            {instagramPosts?.map((post: InstagrPostProps) => (
              <div
                key={post?.id}
                onClick={() => {
                  onSelectPost(
                    {
                      postid: post?.id,
                      media: post?.media_url,
                      mediaType: post?.media_type,
                      caption: post?.caption,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      automationId: props?.id,
                      id: post.id,
                    },
                    post.extraInfo
                  );
                }}
                className="relative w-[30%] aspect-square rounded-lg cursor-pointer overflow-hidden"
              >
                {post.extraInfo.isUsed && (
                  <AppTooltip text="Used in another automation">
                    <div className="absolute bg-gray-900 bg-opacity-50 flex  justify-center z-[90] w-full h-full">
                      <LockKeyhole
                        stroke="white"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                      />
                    </div>
                  </AppTooltip>
                )}
                {posts.find((p) => p.postid === post.id) && (
                  <CircleCheck
                    fill="white"
                    stroke="black"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                  />
                )}
                <img
                  src={post.media_url}
                  alt="Instagram post"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <Button
            onClick={() => mutate()}
            disabled={posts.length === 0}
            className="bg-gradient-to-br w-full from-[#3352cc] text-white to-[#1c2d70]"
          >
            <Loader state={isPending}>Attach Post</Loader>
          </Button>
        </div>
      ) : (
        <p className="text text-secondary text-center text-white">
          No posts found
        </p>
      )}
    </TriggerButton>
  );
};

export default PostButton;
