import { v4 as uuid } from "uuid";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaShopify } from "react-icons/fa";
import { SiWoo } from "react-icons/si";
import { IntegrationType } from "@prisma/client";

export interface IntegrationCardProps {
  id: string;
  title: string;
  descriptions: string;
  icon: React.ReactNode;
  strategy: IntegrationType;
  collapsable: boolean;
  hasIntegrationBtn?: boolean;
}

export const INTEGRATIONS_CARDS: IntegrationCardProps[] = [
  {
    id: uuid(),
    title: "Connect Instagram",
    descriptions:
      "Connect your Instagram account to automate messages, track comments, and manage interactions directly from your dashboard.",
    icon: <FaInstagram color="#4F46E5" size={35} />,
    strategy: IntegrationType.INSTAGRAM,
    collapsable: false,
    hasIntegrationBtn: true,
  },
  {
    id: uuid(),
    title: "Connect Facebook",
    descriptions:
      "Connect your Facebook account to automate messages, track comments, and manage interactions directly from your dashboard.",
    icon: <FaFacebook color="#4F46E5" size={35} />,
    strategy: IntegrationType.FACEBOOK,
    collapsable: true,
    hasIntegrationBtn: true,
  },
  {
    id: uuid(),
    title: "Connect Shopify",
    descriptions:
      "Sync your Shopify store with Pulse to import products, manage messages, track post comments, and place orders — all from one smart dashboard.",
    icon: <FaShopify color="#4F46E5" size={35} />,
    strategy: IntegrationType.SHOPIFY,
    collapsable: true,
  },
  {
    id: uuid(),
    title: "Connect WooCommerce",
    descriptions:
      "Connect your WooCommerce store with Pulse to import products, manage messages, track post comments, and place orders — all from one smart dashboard.",
    icon: <SiWoo color="#4F46E5" size={35} />,
    strategy: IntegrationType.WOOCOMMERCE,
    collapsable: true,
  },
];
