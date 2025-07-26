"use server";

import { client } from "@/lib/prisma.lib";
import { ListenerType, Post, TriggerType } from "@prisma/client";

// ─── Automations ─────────────────────────────────────────────

export const getAllAutomations = async (clerkId: string) => {
  return await client.user.findUnique({
    where: { clerkId },
    select: {
      automations: {
        orderBy: { createdAt: "desc" },
        include: {
          keywords: true,
          listener: true,
          triggers: true,
        },
      },
    },
  });
};

export const createAutomation = async (userId: string) => {
  return await client.automations.create({
    data: { userId },
  });
};

export const findAutomation = async (id: string) => {
  return await client.automations.findUnique({
    where: { id },
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
  data: { name?: string; active?: boolean }
) => {
  return await client.automations.update({
    where: { id },
    data: {
      name: data.name,
      active: data.active,
    },
  });
};

export const deleteAutomation = async (id: string) => {
  return await client.automations.delete({
    where: { id },
  });
};

// ─── Listeners ────────────────────────────────────────────────

export const addListener = async (
  automationId: string,
  listener: "SMARTAI" | "MESSAGE",
  prompt: string,
  reply?: string
) => {
  return await client.automations.update({
    where: { id: automationId },
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

export const addListener2 = async (
  automationId: string,
  listener: ListenerType,
  keywordIds: string[],
  prompt: string,
  reply?: string
) => {
  return await client.$transaction(async (tx) => {
    // 1. Get the latest listener priority for the automation
    const latest = await tx.listener.findFirst({
      where: { automationId },
      orderBy: { priority: "desc" },
      select: { priority: true },
    });

    const nextPriority = (latest?.priority ?? -1) + 1;

    // 2. Create the new listener with connected keywords
    const updatedAutomation = await tx.automations.update({
      where: { id: automationId },
      data: {
        listener: {
          create: {
            listener,
            prompt,
            commentReply: reply,
            commentCount: 0,
            dmCount: 0,
            priority: nextPriority,
            Keywords: {
              connect: keywordIds.map((id) => ({ id })),
            },
          },
        },
      },
    });

    return updatedAutomation;
  });
};

export const changeListenerPriority = async (
  automationId: string,
  activeListenerId: string,
  swapedListenerId: string
) => {
  const [activeListener, swapedListener] = await Promise.all([
    client.listener.findUnique({ where: { id: activeListenerId } }),
    client.listener.findUnique({ where: { id: swapedListenerId } }),
  ]);
  if (!activeListener || !swapedListener) {
    throw new Error("One or both listeners not found");
  }
  return await client.automations.update({
    where: { id: automationId },
    data: {
      listener: {
        update: [
          {
            where: { id: activeListenerId },
            data: { priority: swapedListener.priority },
          },
          {
            where: { id: swapedListenerId },
            data: { priority: activeListener.priority },
          },
        ],
      },
    },
  });
};

// ─── Triggers ─────────────────────────────────────────────────

export const addTrigger = async (
  automationId: string,
  trigger: TriggerType[]
) => {
  const createData =
    trigger.length === 2
      ? {
          createMany: {
            data: [{ type: trigger[0] }, { type: trigger[1] }],
          },
        }
      : {
          create: { type: trigger[0] },
        };

  return await client.automations.update({
    where: { id: automationId },
    data: {
      triggers: createData,
    },
  });
};

// ─── Keywords ─────────────────────────────────────────────────

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
  keyword: string,
  listenerId?: string
) => {
  const trimmedKeyword = keyword.trim();
  return await client.automations.update({
    where: { id: automationId },
    data: {
      keywords: {
        create: { word: trimmedKeyword, userId: clerkId, listenerId },
      },
    },
  });
};

export const deleteKeyword = async (id: string) => {
  return await client.keyword.delete({
    where: { id },
  });
};

// ─── Posts ────────────────────────────────────────────────────

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
              mode: "insensitive",
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
            select: { word: true },
          },
        },
      },
    },
  });
};

export const addPosts = async (automationId: string, posts: Post[]) => {
  await client.post.createMany({
    data: posts.map((post) => ({
      postid: post.postid,
      media: post.media,
      mediaType: post.mediaType,
      caption: post.caption,
      automationId: post.automationId,
    })),
  });

  return await client.post.findMany({
    where: { automationId },
  });
};

export const removePost = async (postId: string) => {
  return await client.post.delete({
    where: { id: postId },
  });
};
