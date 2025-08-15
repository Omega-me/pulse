/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAutomationQuery } from "@/hooks/use-queries";
import React from "react";
import { Button } from "@/components/ui/button";
import { testAction } from "@/actions/webhook";

interface Props {
  automationId: string;
}
const TestMessageComment = (props: Props) => {
  const [selectedKeyword, setSelectedKeyword] = React.useState<string | null>(
    null
  );
  const [selectedPost, setSelectedPost] = React.useState<string | null>(null);

  const { data } = useAutomationQuery(props.automationId);

  return (
    <div>
      <p>Test automation trigger comment</p>
      automationId: {props.automationId}
      <br />
      <hr />
      <div className="flex justify-between items-center gap-y-2">
        <div>
          <div>
            <Select onValueChange={setSelectedPost}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a post" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Posts</SelectLabel>
                  {data?.data?.posts.map((post) => (
                    <SelectItem key={post.id} value={post.postid}>
                      <img
                        src={post.media}
                        alt={post.caption}
                        className="w-10 h-10 object-cover"
                      />
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <br />
            <Select onValueChange={setSelectedKeyword}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a keyword" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Keywords</SelectLabel>
                  {data?.data?.keywords.map((word) => (
                    <SelectItem key={word.id} value={word.word}>
                      {word.word}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <br />
          <Button
            onClick={async () =>
              await testAction(selectedKeyword, selectedPost)
            }
          >
            Trigger comment
          </Button>
        </div>
        <div>
          <div>
            <Select onValueChange={setSelectedKeyword}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a keyword" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Keywords</SelectLabel>
                  {data?.data?.keywords.map((word) => (
                    <SelectItem key={word.id} value={word.word}>
                      {word.word}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <br />
          <Button onClick={async () => await testAction(selectedKeyword)}>
            Trigger DM
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestMessageComment;
