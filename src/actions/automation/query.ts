"use server";

import { client } from "@/lib/prisma.lib";
import { deleteUploadedFiles } from "@/lib/uploadthing.lib";
import { ListenerType, Post, TriggerType } from "@prisma/client";

// ─── Automations ─────────────────────────────────────────────

export const getAllAutomations = async (clerkId: string) => {
  const automations = await client.user.findUnique({
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

  return automations?.automations || [];
};

export const createAutomation = async (userId: string) => {
  return await client.automations.create({
    data: { userId },
  });
};

export const findAutomation = async (id: string) => {
  const found = await client.automations.findUnique({
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

  if (!found) return null;

  return found;
};

export const updateAutomation = async (
  id: string,
  data: { name?: string; active?: boolean }
) => {
  const automation = await findAutomation(id);
  if (!automation) return false;

  await client.automations.update({
    where: { id },
    data: {
      name: data.name,
      active: data.active,
    },
  });

  return true;
};

export const deleteAutomation = async (id: string) => {
  const automation = await findAutomation(id);
  if (!automation) return false;

  // remove all photos uploaded
  if (automation.posts.length > 0) {
    const urls = automation.posts.map((post) => post.media);
    await deleteUploadedFiles(urls);
  }

  await client.automations.delete({
    where: { id },
  });

  return true;
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
    return false;
  }

  const changed = await client.automations.update({
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

  return changed ? true : false;
};

export const removeListener = async (id: string): Promise<boolean> => {
  return client.$transaction(async (tx) => {
    const listener = await tx.listener.findUnique({
      where: { id },
    });

    if (!listener) return false;

    await tx.listener.delete({ where: { id } });
    return true;
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

  const saved = await client.automations.update({
    where: { id: automationId },
    data: {
      triggers: createData,
    },
  });

  return saved ? true : false;
};

export const getKeywordsByAutomation = async (automationId: string) => {
  const automation = await findAutomation(automationId);
  if (!automation) return [];
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
  const created = await client.automations.update({
    where: { id: automationId },
    data: {
      keywords: {
        create: { word: trimmedKeyword, userId: clerkId, listenerId },
      },
    },
  });

  return created ? true : false;
};

export const deleteKeyword = async (id: string): Promise<boolean> => {
  const keyword = await client.keyword.findUnique({ where: { id } });
  if (!keyword) return false;

  const deleted = await client.keyword.delete({ where: { id } });
  return deleted ? true : false;
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
  const automation = await findAutomation(automationId);
  if (!automation) return null;

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

export const removePost = async (id: string) => {
  const post = await client.post.findUnique({ where: { id } });
  if (!post) return null;

  if (post.media) {
    await deleteUploadedFiles([post.media]);
  }

  const removed = await client.post.delete({ where: { id } });
  return removed ? true : false;
};
