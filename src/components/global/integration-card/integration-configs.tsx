import { IntegrationType } from "@prisma/client";
import React from "react";
import FacebookConfig from "./strategies/facebook-config";
import ShopifyConfig from "./strategies/shopify-config";
import WooCommerceConfig from "./strategies/woocommerce-config";

interface Props {
  strategy: IntegrationType;
}

const getConfigComponent = ({ strategy }: Props): React.ReactNode => {
  switch (strategy) {
    case IntegrationType.FACEBOOK:
      return <FacebookConfig />;
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
