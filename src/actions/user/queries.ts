import { client } from "@/lib/prisma.lib";

export const findUser = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      subscription: true,
      integrations: {
        select: {
          id: true,
          token: true,
          expiresAt: true,
          name: true,
          metadata: true,
        },
      },
    },
  });
};

export const createUser = async (data: {
  clerkId: string;
  firstname: string;
  lastname: string;
  email: string;
}) => {
  return await client.user.create({
    data: {
      ...data,
      subscription: {
        create: {},
      },
    },
    select: {
      firstname: true,
      lastname: true,
      clerkId: true,
    },
  });
};

export const updateSubscription = async (
  clerkId: string,
  props: { customerId?: string; plan?: "PRO" | "FREE" }
) => {
  return await client.user.update({
    where: {
      clerkId,
    },
    data: {
      subscription: {
        update: {
          data: {
            ...props,
          },
        },
      },
    },
  });
};
