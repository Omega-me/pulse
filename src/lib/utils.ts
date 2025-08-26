import { $Enums, IntegrationType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Integration = {
  name: $Enums.IntegrationType;
  id: string;
  token: string;
  expiresAt: Date;
  metadata: JsonValue;
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
  const integration = integrations?.find((i) => i.name === type);
  return integration || null;
};

export const handleRequest = async <T, R>(
  fn: () => Promise<T>,
  successHandler: (res: T) => R,
  errorStatus = 500,
  errorMsg = "Oops! Something went wrong"
): Promise<R | { status: number; data?: null; message?: string }> => {
  try {
    const res = await fn();
    return successHandler(res);
  } catch {
    return {
      status: errorStatus,
      data: null,
      message: errorMsg,
    };
  }
};
