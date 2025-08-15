import { useState } from "react";
import { useMutationData } from "./use-mutation-data";
import {
  onMarkUsedPosts,
  onRemovePost,
  onRemovePosts,
  onSavePosts,
} from "@/actions/automation";
import { Post } from "@prisma/client";
import { InstagrPostProps } from "@/types/posts.type";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const useAutomationPosts = (id: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagrPostProps[]>([]);

  const handleGoToAutomation = (automationId: string) => {
    const url = `/dashboard/automations/${automationId}`;
    window.open(url, "_blank");
  };

  const onSelectPost = (
    post: Post,
    extraInfo: InstagrPostProps["extraInfo"]
  ) => {
    if (extraInfo.isUsed) {
      const keywords = extraInfo.matchedKeywords?.join(", ");
      toast.info(
        `This post is already used in another automation with the same keywords: (${keywords})`,
        {
          action: (
            <Button
              onClick={() => handleGoToAutomation(extraInfo.automationId)}
              variant="ghost"
              size="sm"
            >
              <Eye />
            </Button>
          ),
        }
      );
      return;
    }
    setPosts((prev) => {
      if (prev.find((p) => p.postid === post.postid)) {
        return prev.filter((item) => item.postid !== post.postid);
      }
      return [...prev, post];
    });
  };

  const {
    mutate: savePosts,
    isPending: isSavingPosts,
    variables,
  } = useMutationData(
    ["attach-posts"],
    () => onSavePosts(id, posts),
    ["automation-info"],
    () => setPosts([])
  );

  const { mutate: remove, isPending: isRemovingPost } = useMutationData(
    ["remove-posts"],
    async (data) => {
      const { id } = data as unknown as { id: string };
      return await onRemovePost(id);
    },
    ["automation-info"]
  );

  const { mutate: removeAllPosts, isPending: isRemovingAllPosts } =
    useMutationData(
      ["remove-all-posts"],
      async (data) => {
        const { automationId } = data as unknown as { automationId: string };
        return await onRemovePosts(automationId);
      },
      ["automation-info"]
    );

  const handleInstagramPosts = async (instagramPosts?: {
    data?: InstagrPostProps[];
    status: number;
  }) => {
    if (instagramPosts?.status === 200 && instagramPosts?.data?.length > 0) {
      const markedPosts = await onMarkUsedPosts(instagramPosts.data, id);
      setInstagramPosts(markedPosts);
    }
  };

  return {
    onSelectPost,
    posts,
    savePosts,
    isSavingPosts,
    variables,
    remove,
    isRemovingPost,
    handleInstagramPosts,
    instagramPosts,
    removeAllPosts,
    isRemovingAllPosts,
  };
};

export default useAutomationPosts;
