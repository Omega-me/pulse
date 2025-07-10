"use server";

import { client } from "@/lib/prisma.lib";
import { IntegrationType } from "@prisma/client";

export const updateIntegration = async (
  token: string,
  expiresAt: Date,
  id: string
) => {
  return await client.integrations.update({
    where: { id },
    data: {
      token,
      expiresAt,
    },
  });
};

export const getInstagramIntegration = async (clerkId: string) => {
  return await client.user.findUnique({
    where: { clerkId },
    select: {
      integrations: {
        where: {
          name: IntegrationType.INSTAGRAM,
        },
      },
    },
  });
};

export const getFacebookIntegration = async (clerkId: string) => {
  return await client.user.findUnique({
    where: { clerkId },
    select: {
      integrations: {
        where: {
          name: IntegrationType.FACEBOOK,
        },
      },
    },
  });
};

export const createIntegration = async (
  clerkId: string,
  token: string,
  expire: Date,
  name: IntegrationType,
  integrationId?: string
) => {
  return await client.user.update({
    where: { clerkId },
    data: {
      integrations: {
        create: {
          token,
          expiresAt: expire,
          integrationId,
          name,
        },
      },
    },
    select: {
      firstname: true,
      lastname: true,
    },
  });
};
