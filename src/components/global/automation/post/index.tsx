/* eslint-disable @next/next/no-img-element */
import useAutomationPosts from "@/hooks/use-automation-posts";
import {
  useAutomationQuery,
  useAutomationPostsQuery,
} from "@/hooks/use-queries";
import React from "react";
import { InstagrPostProps } from "@/types/posts.type";
import { CircleCheck, CirclePlus, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "../../loader";
import AppTooltip from "../../app-tooltip";
import { PostType } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFacebookAds } from "@/hooks/use-facebook-ads";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FaAd } from "react-icons/fa";
import NodeTitle from "../node/node-title";
import Link from "next/link";
import TriggerButton from "../trigger-button";

interface Props {
  automationId: string;
  isOnSelectedPosts?: boolean;
}
const PostButton = (props: Props) => {
  const [tabsValue, setTabsValue] = React.useState("posts");
  const { data: postsData, isPending } = useAutomationPostsQuery();
  const {
    onSelectPost,
    posts,
    savePosts,
    isSavingPosts,
    instagramPosts,
    handleInstagramPosts,
  } = useAutomationPosts(props.automationId);
  const { data: automation } = useAutomationQuery(props.automationId);
  const { adAccounts, getDefaultAdAccount, hasFacebookIntegration } =
    useFacebookAds();
  const defaultAdAccount = getDefaultAdAccount();
  const hasSavedPosts =
    automation?.status === 200 && automation?.data?.posts?.length > 0;

  return (
    <>
      {!props.isOnSelectedPosts && hasSavedPosts ? (
        ""
      ) : (
        <TriggerButton
          onOpenChange={(open) => {
            if (!open) {
              setTabsValue("posts");
            }
          }}
          trigger={
            <div
              onClick={async () => handleInstagramPosts(postsData)}
              className={cn(
                "border-2 border-dashed w-full  border-purple-500 cursor-pointer transition duration-100 rounded-md flex gap-x-2 justify-center items-center p-5",
                {
                  "bg-gray-500/15 border-gray-500 hover:bg-gray-500/30":
                    props.isOnSelectedPosts,
                }
              )}
            >
              <CirclePlus
                className={cn("text-purple-500", {
                  "text-gray-500": props.isOnSelectedPosts,
                })}
              />
              {props.isOnSelectedPosts ? null : (
                <p className="text-purple-500 font-bold">Attach posts</p>
              )}
            </div>
          }
        >
          {postsData?.status === 200 ? (
            <div className="flex flex-col gap-y-3 w-full">
              <Tabs
                onValueChange={(value) => setTabsValue(value)}
                defaultValue="posts"
              >
                <div className="flex items-center justify-between gap-4">
                  <TabsList>
                    <TabsTrigger
                      className="data-[state=active]:bg-[#1D1D1D]"
                      value="posts"
                    >
                      Posts
                    </TabsTrigger>
                    {hasFacebookIntegration && (
                      <TabsTrigger
                        className="data-[state=active]:bg-[#1D1D1D]"
                        value="ads"
                      >
                        Ads
                      </TabsTrigger>
                    )}
                  </TabsList>
                  {tabsValue === "ads" && adAccounts.length > 0 && (
                    <Select
                      onValueChange={(value) => console.log(value)}
                      defaultValue={defaultAdAccount?.id ?? ""}
                    >
                      <SelectTrigger className="w-full !ring-0">
                        <SelectValue placeholder="Select an ad account" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1D1D1D]">
                        <SelectGroup>
                          <SelectLabel>Connected ad accounts</SelectLabel>
                          {adAccounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <TabsContent value="posts">
                  <ScrollArea className="h-[300px] w-full rounded-md border">
                    <div className="flex flex-wrap gap-2 p-2">
                      <Loader
                        className="w-full h-[280px] flex justify-center items-center"
                        state={isPending || instagramPosts.length === 0}
                      >
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
                                  automationId: props?.automationId,
                                  id: post.id,
                                  metadata: null,
                                  postType: PostType.POST,
                                },
                                post.extraInfo
                              );
                            }}
                            className="relative w-[30%] aspect-square rounded-md cursor-pointer overflow-hidden"
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
                      </Loader>
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="ads">
                  <ScrollArea className="h-[300px] w-full rounded-md border">
                    {adAccounts.length === 0 ? (
                      <div className="w-full h-[295px] flex flex-col justify-center items-center">
                        <Link href="/dashboard/integrations/">
                          <NodeTitle
                            title={"Link an ad account"}
                            icon={<FaAd />}
                          />
                        </Link>
                      </div>
                    ) : (
                      <div>{/* TODO: render ads here */}</div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
              <Button
                onClick={() => savePosts({})}
                disabled={posts.length === 0}
                className="bgw-full bg-[#4F46E5] hover:bg-[#4F46E5] hover:opacity-80 text-white"
              >
                <Loader state={isSavingPosts}>Attach Post</Loader>
              </Button>
            </div>
          ) : (
            <p className="text text-secondary text-center text-white">
              No posts found
            </p>
          )}
        </TriggerButton>
      )}
    </>
  );
};

export default PostButton;
