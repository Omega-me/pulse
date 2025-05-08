'use server';

import { client } from '@/lib/prisma.lib';

export const updateIntegration = async (token: string, expiresAt: Date, id: string) => {
  return await client.integrations.update({
    where: { id },
    data: {
      token,
      expiresAt,
    },
  });
};

export const getIntegration = async (clerkId: string) => {
  return await client.user.findUnique({
    where: { clerkId },
    select: {
      integrations: {
        where: {
          name: 'INSTAGRAM',
        },
      },
    },
  });
};

export const createIntegration = async (clerkId: string, token: string, expire: Date, igId?: string) => {
  return await client.user.update({
    where: { clerkId },
    data: {
      integrations: {
        create: {
          token,
          expiresAt: expire,
          integrationId: igId,
        },
      },
    },
    select: {
      firstname: true,
      lastname: true,
    },
  });
};
