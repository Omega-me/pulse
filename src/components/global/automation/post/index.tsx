/* eslint-disable @next/next/no-img-element */
import useAutomationPosts from '@/hooks/use-automation-posts';
import { useQueryAutomationPosts } from '@/hooks/use-queries';
import React from 'react';
import TriggerButton from '../trigger-button';
import { InstagrPostProps } from '@/types/posts.type';
import { CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loader from '../../loader';

interface Props {
  id: string;
}
const PostButton = (props: Props) => {
  const { data: postsData } = useQueryAutomationPosts();
  const { onSelectPost, posts, mutate, isPending } = useAutomationPosts(props.id);
  return (
    <TriggerButton label="Attach a post">
      {postsData?.status === 200 ? (
        <div className="flex flex-col gap-y-3 w-full">
          <div className="flex flex-wrap w-full gap-3">
            {postsData?.data?.map((post: InstagrPostProps) => (
              <div
                key={post?.id}
                onClick={() => {
                  onSelectPost({
                    postid: post?.id,
                    media: post?.media_url,
                    mediaType: post?.media_type,
                    caption: post?.caption,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    automationId: props?.id,
                    id: post.id,
                  });
                }}
                className="relative w-4/12 aspect-square rounded-lg cursor-pointer overflow-hidden"
              >
                {posts.find((p) => p.postid === post.id) && (
                  <CircleCheck fill="white" stroke="black" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" />
                )}
                <img src={post.media_url} alt="Instagram post" width={300} height={300} />
              </div>
            ))}
          </div>
          <Button onClick={() => mutate()} disabled={posts.length === 0} className="bg-gradient-to-br w-full from-[#3352cc] text-white to-[#1c2d70]">
            <Loader state={isPending}>Attach Post</Loader>
          </Button>
        </div>
      ) : (
        <p className="text text-secondary text-center text-white">No posts found</p>
      )}
    </TriggerButton>
  );
};

export default PostButton;
