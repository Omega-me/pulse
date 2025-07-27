import { useUserQuery } from "@/hooks/use-queries";
import { PropsWithChildren } from "react";
import { SubscriptionPlan as SubscriptionType } from "@prisma/client";

interface Props extends PropsWithChildren {
  type: SubscriptionType;
}
const SubscriptionPlan = (props: Props) => {
  const { data: user } = useUserQuery();
  return user?.data?.subscription?.plan === props.type && props.children;
};

export default SubscriptionPlan;
