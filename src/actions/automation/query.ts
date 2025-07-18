"use server";

import { client } from "@/lib/prisma.lib";
import { Post } from "@prisma/client";

export const getAllAutomations = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      automations: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          keywords: true,
          listener: true,
        },
      },
    },
  });
};

export const createAutomation = async (userId: string) => {
  return await client.automations.create({
    data: {
      userId,
    },
  });
};

export const findAutomation = async (id: string) => {
  return await client.automations.findUnique({
    where: {
      id,
    },
    include: {
      keywords: true,
      triggers: true,
      listener: true,
      posts: true,
      User: {
        select: {
          subscription: true,
          integrations: true,
        },
      },
    },
  });
};

export const updateAutomation = async (
  id: string,
  data: {
    name?: string;
    active?: boolean;
  }
) => {
  return await client.automations.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      active: data.active,
    },
  });
};

export const deleteAutomation = async (id: string) => {
  return await client.automations.delete({
    where: {
      id,
    },
  });
};

export const addListener = async (
  automationId: string,
  listener: "SMARTAI" | "MESSAGE",
  prompt: string,
  reply?: string
) => {
  return await client.automations.update({
    where: {
      id: automationId,
    },
    data: {
      listener: {
        create: {
          listener,
          prompt,
          commentReply: reply,
          commentCount: 0,
          dmCount: 0,
        },
      },
    },
  });
};

export const addTrigger = async (automationId: string, trigger: string[]) => {
  if (trigger.length === 2) {
    return await client.automations.update({
      where: {
        id: automationId,
      },
      data: {
        triggers: {
          createMany: {
            data: [
              {
                type: trigger[0],
              },
              {
                type: trigger[1],
              },
            ],
          },
        },
      },
    });
  }

  return await client.automations.update({
    where: {
      id: automationId,
    },
    data: {
      triggers: {
        create: {
          type: trigger[0],
        },
      },
    },
  });
};

export const getKeywords = async (clerkId: string) => {
  return await client.keyword.findMany({
    where: { userId: clerkId },
  });
};

export const getKeywordsByAutomation = async (automationId: string) => {
  return await client.keyword.findMany({
    where: { automationId },
    select: { word: true },
  });
};

export const addKeyword = async (
  clerkId: string,
  automationId: string,
  keyword: string
) => {
  const trimmedKeyword = keyword.trim();

  return await client.automations.update({
    where: { id: automationId },
    data: {
      keywords: {
        create: { word: trimmedKeyword, userId: clerkId },
      },
    },
  });
};

export const deleteKeyword = async (id: string) => {
  return await client.keyword.delete({
    where: {
      id,
    },
  });
};

export const getConflictingPosts = async (
  automationId: string,
  instagramPostIds: string[],
  keywords: string[]
) => {
  return await client.post.findMany({
    where: {
      automationId: { not: automationId },
      postid: { in: instagramPostIds },
      Automation: {
        keywords: {
          some: {
            word: {
              in: keywords,
              mode: "insensitive", // case-insensitive match
            },
          },
        },
      },
    },
    select: {
      postid: true,
      automationId: true,
      media: true,
      Automation: {
        select: {
          keywords: {
            select: {
              word: true,
            },
          },
        },
      },
    },
  });
};

export const addPosts = async (automationId: string, posts: Post[]) => {
  await client.post.createMany({
    data: posts.map((post) => {
      return {
        postid: post.postid,
        media: post.media,
        mediaType: post.mediaType,
        caption: post.caption,
        automationId: post.automationId,
      };
    }),
  });

  return await client.post.findMany({
    where: {
      automationId,
    },
  });
};

export const removePost = async (postId: string) => {
  return await client.post.delete({
    where: {
      id: postId,
    },
  });
};
