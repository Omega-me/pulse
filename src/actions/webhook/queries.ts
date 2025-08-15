import { client } from "@/lib/prisma.lib";
import { TriggerType } from "@prisma/client";

export const matchKeywordFromDm = async (keyword: string) => {
  const keywordFilter = {
    word: { equals: keyword.trim(), mode: "insensitive" as const },
  };
  const automation = await client.automations.findFirst({
    where: {
      keywords: {
        some: keywordFilter,
      },
      triggers: {
        some: {
          type: TriggerType.DM,
        },
      },
    },
    include: {
      keywords: {
        where: keywordFilter,
      },
      listener: {
        where: {
          Keywords: {
            some: keywordFilter,
          },
        },
      },
    },
  });

  const results = {
    automation,
    keyword: automation?.keywords[0],
    listener: automation?.listener[0],
  };

  if (
    automation &&
    automation.keywords.length > 0 &&
    automation.listener.length > 0
  ) {
    return results;
  }

  return null;
};

export const matchKeywordFromComment = async (
  postid: string,
  keyword: string
) => {
  const keywordFilter = {
    word: { equals: keyword.trim(), mode: "insensitive" as const },
  };
  const automation = await client.automations.findFirst({
    where: {
      posts: {
        some: { postid },
      },
      keywords: {
        some: keywordFilter,
      },
    },
    include: {
      keywords: {
        where: keywordFilter,
      },
      listener: {
        where: {
          Keywords: {
            some: keywordFilter,
          },
        },
      },
    },
  });

  const results = {
    automation,
    keyword: automation?.keywords[0],
    listener: automation?.listener[0],
  };

  if (
    automation &&
    automation.keywords.length > 0 &&
    automation.listener.length > 0
  ) {
    return results;
  }

  return null;
};

export const getKeywordAutomation = async (listenerId: string) => {
  // Step 1: Fetch listener with its automationId
  const listener = await client.listener.findUnique({
    where: { id: listenerId },
    include: {
      Automation: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!listener) return null; // no listener found

  // Step 2: Fetch automation using automationId
  const automation = await client.automations.findUnique({
    where: { id: listener.automationId },
    include: {
      dms: true,
      triggers: true,
      User: {
        select: {
          subscription: { select: { plan: true } },
          integrations: true,
        },
      },
    },
  });

  return { ...automation, listener };
};

export const trackResponses = async (listenerId: string, type: TriggerType) => {
  if (type === TriggerType.COMMENT) {
    return await client.listener.update({
      where: {
        id: listenerId,
      },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });
  }

  if (type === TriggerType.DM) {
    return await client.listener.update({
      where: {
        id: listenerId,
      },
      data: {
        dmCount: {
          increment: 1,
        },
      },
    });
  }
};

export const createChatHistory = (opts: {
  automationId: string;
  senderId: string;
  reciever: string;
  message: string;
  systemDm: boolean;
  usedSmartAI: boolean;
  keywordId?: string;
}) => {
  return client.automations.update({
    where: {
      id: opts.automationId,
    },
    data: {
      dms: {
        create: {
          reciever: opts.reciever,
          senderId: opts.senderId,
          message: opts.message,
          system_dm: opts.systemDm,
          usedSmartAI: opts.usedSmartAI,
          keywordId: opts.keywordId,
        },
      },
    },
  });
};

export const getChatHistory = async (senderId: string, receiverId: string) => {
  // Fetch recent messages based on the condition
  const recentMessages = await client.dms.findMany({
    where: {
      senderId,
      reciever: receiverId,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Check if any of the recent messages used Smart AI
  const hasUsedSmartAI = recentMessages.some((msg) => msg.usedSmartAI);

  // If no Smart AI used, return null early
  if (!hasUsedSmartAI) return null;

  // Get the last keyword used in the messages
  const lastKeywordId = recentMessages.find((msg) => msg.keywordId)?.keywordId;

  // If no keyword is found, return null
  if (!lastKeywordId) return null;

  // Fetch the keyword details from the database
  const keyword = await client.keyword.findUnique({
    where: {
      id: lastKeywordId,
    },
  });

  // If no keyword found, return null
  if (!keyword) return null;

  // get listener
  const listener = await client.listener.findFirst({
    where: {
      Keywords: {
        some: {
          id: lastKeywordId,
        },
      },
    },
  });

  // Return the keyword, its automationId, and the recent chat history
  return {
    keyword,
    automationId: keyword?.automationId,
    listenerId: listener?.id,
    chatHistory: recentMessages,
  };
};

export const getKeywordPost = async (automationId: string, postId: string) => {
  return await client.post.findFirst({
    where: {
      AND: [{ postid: postId }, { automationId }],
    },
    include: {
      Automation: {
        include: {
          listener: {
            where: {
              automationId,
            },
          },
        },
      },
    },
  });
};
