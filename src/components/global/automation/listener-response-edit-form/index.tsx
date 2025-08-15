import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ListenerType } from "@prisma/client";
import React from "react";
import Loader from "../../loader";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import useListener from "@/hooks/use-listener";

interface Props {
  automationId: string;
  isMessage: boolean;
  listenerId: string;
  value: string;
}

const ListenerResponseEditForm = (props: Props) => {
  const {
    listener: Listener,
    onSavePrompt,
    registerPrompt,
    isChangingPrompt,
    onSaveCommentReply,
    registerCommentReply,
    isChangingCommentReply,
  } = useListener(props.automationId, props.listenerId, {
    prompt: props.value,
    reply: props.isMessage ? "" : props.value,
  } as any);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (props.isMessage) {
          onSavePrompt();
        } else {
          onSaveCommentReply();
        }
      }}
      className="flex flex-col gap-y-2 w-full p-2"
    >
      {props.isMessage ? (
        <Textarea
          placeholder={
            Listener === ListenerType.SMARTAI
              ? "Add a prompt that your Smart AI can use..."
              : "Add a message you want to sent to the customers"
          }
          {...registerPrompt("prompt")}
          className="bg-muted outline-none border-none ring-0 focus:ring-0 !ring-[#4F46E5] h-48"
        />
      ) : (
        <Input
          {...registerCommentReply("reply")}
          placeholder="Add reply for comments (Optional)"
          className="bg-muted outline-none border-none ring-0 focus:ring-0 !ring-[#4F46E5]"
        />
      )}

      <Button className="w-full bg-[#4F46E5] hover:bg-[#4F46E5] hover:opacity-80 rounded-md font-medium text-white">
        <Loader
          state={props.isMessage ? isChangingPrompt : isChangingCommentReply}
        >
          <Save />
        </Loader>
        Save
      </Button>
    </form>
  );
};

export default ListenerResponseEditForm;
