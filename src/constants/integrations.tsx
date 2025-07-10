import { v4 as uuid } from "uuid";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { IntegrationType } from "@prisma/client";

export interface IntegrationCardProps {
  id: string;
  title: string;
  descriptions: string;
  icon: React.ReactNode;
  strategy: IntegrationType;
}

export const INTEGRATIONS_CARDS: IntegrationCardProps[] = [
  {
    id: uuid(),
    title: "Connect Instagram",
    descriptions:
      "Connect your Instagram account to automate messages, track comments, and manage interactions directly from your dashboard.",
    icon: <FaInstagram color="#3352cc" size={35} />,
    strategy: "INSTAGRAM",
  },
  {
    id: uuid(),
    title: "Connect Facebook",
    descriptions:
      "Connect your Facebook account to automate messages, track comments, and manage interactions directly from your dashboard.",
    icon: <FaFacebook color="#3352cc" size={35} />,
    strategy: "FACEBOOK",
  },
];
