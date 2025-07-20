import { IntegrationType } from "@prisma/client";
import React from "react";
import FacebookConfig from "./strategies/facebook-config";
import ShopifyConfig from "./strategies/shopify-config";
import WooCommerceConfig from "./strategies/woocommerce-config";
import { Integration } from "@/lib/utils";

interface Props {
  integrated: Integration;
  strategy: IntegrationType;
}

const getConfigComponent = ({
  strategy,
  integrated,
}: Props): React.ReactNode => {
  switch (strategy) {
    case IntegrationType.FACEBOOK:
      return <FacebookConfig integrated={integrated} />;
    case IntegrationType.SHOPIFY:
      return <ShopifyConfig />;
    case IntegrationType.WOOCOMMERCE:
      return <WooCommerceConfig />;
    default:
      return null;
  }
};

const IntegrationConfigs = (props: Props) => {
  return <div>{getConfigComponent(props)}</div>;
};

export default IntegrationConfigs;
