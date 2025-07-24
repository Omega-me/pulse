import { SendHorizontal } from "lucide-react";
import React from "react";
import { FaInstagram } from "react-icons/fa";
interface Props {
  type: string;
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
        {props.type === "COMMENT" ? (
          <FaInstagram color="#3352cc" size={25} />
        ) : (
          <SendHorizontal color="#3352cc" />
        )}
        <p className="text-lg">
          {props.type === "COMMENT"
            ? "User comments on my post."
            : "User sends me a direct messsage."}
        </p>
      </div>
      <p className="text-muted-foreground">
        {props.type === "COMMENT"
          ? "If a user comments on a video that is setup to listen for keywords, this automation will fire"
          : "If the user sends you a meesage that contains a keyword, this automation will fire"}
      </p>
    </div>
  );
};

export default ActiveTrigger2;
