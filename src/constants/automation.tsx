import { MessageCircle, SendHorizontal, Sparkles } from "lucide-react";
import { JSX } from "react";
import { v4 as uuid } from "uuid";

export interface AutomationListenerProps {
  id: string;
  label: string;
  icon: JSX.Element;
  description: string;
  type: "SMARTAI" | "MESSAGE";
}

export interface AutomationTriggerProps {
  id: string;
  label: string;
  icon: JSX.Element;
  description: string;
  type: "COMMENT" | "DM";
}

export const AUTOMATION_LISTENER: AutomationListenerProps[] = [
  {
    id: uuid(),
    label: "Send the user a message",
    icon: <SendHorizontal />,
    description: "Enter the message that you want to sent the user.",
    type: "MESSAGE",
  },
  {
    id: uuid(),
    label: "Let Smart AI take over",
    icon: <Sparkles />,
    description: "Tell AI about your project. (Upgrade to use this feature)",
    type: "SMARTAI",
  },
];

export const AUTOMATION_TRIGGERS: AutomationTriggerProps[] = [
  {
    id: uuid(),
    label: "User comments on my post",
    description: "Select if you want to automate comments in you post",
    icon: <MessageCircle />,
    type: "COMMENT",
  },
  {
    id: uuid(),
    label: "User sends me a dm with a keyword",
    description: "Select if you want to automate DMs in your profile",
    icon: <SendHorizontal />,
    type: "DM",
  },
];
