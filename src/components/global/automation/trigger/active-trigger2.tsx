import { TriggerType } from "@prisma/client";
import { SendHorizontal } from "lucide-react";
import React from "react";
import { FaInstagram } from "react-icons/fa";
import NodeTitle from "../node/node-title";
interface Props {
  type: TriggerType;
  keywords: {
    id: string;
    word: string;
    automationId: string | null;
  }[];
}
const ActiveTrigger2 = (props: Props) => {
  return (
    <div className="bg-muted p-3 rounded-xl w-full">
      <div className="flex gap-x-2 items-center">
        <NodeTitle
          title={
            props.type === TriggerType.COMMENT
              ? "User comments on my post"
              : "User sends me a direct message."
          }
          icon={
            props.type === TriggerType.COMMENT ? (
              <FaInstagram className="text-pink-500" size={18} />
            ) : (
              <SendHorizontal className="text-blue-500" size={18} />
            )
          }
          className="text-gray-200 font-semibold"
        />
      </div>
      <p className="text-muted-foreground">
        {props.type === "COMMENT"
          ? "If a user comments on a post that is setup to listen for keywords, this automation will fire"
          : "If the user sends you a message that contains a keyword, this automation will fire"}
      </p>
    </div>
  );
};

export default ActiveTrigger2;
