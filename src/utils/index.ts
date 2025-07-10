import { $Enums, IntegrationType } from "@prisma/client";

export type Integration = {
  name: $Enums.IntegrationType;
  id: string;
  token: string;
  expiresAt: Date;
};

export const dublicateValidation = (arr: string[], el: string) => {
  if (!arr.find((t) => t === el)) {
    arr.push(el);
    return arr;
  } else {
    arr = arr.filter((t) => t !== el);
    return arr;
  }
};

export const findIntegration = (
  integrations: Integration[],
  type: IntegrationType
) => {
  const integration = integrations.find((i) => i.name === type);
  return integration || null;
};
