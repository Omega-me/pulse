import { client } from "@/lib/prisma.lib";

export const matchKeyword = async (keyword: string, postid?: string) => {
  const test = await client.post.findFirst({
    where: {
      postid,
    },
    include: {
      Automation: {
        where: {
          keywords: {
            some: {
              word: {
                equals: keyword.trim(),
                mode: "insensitive",
              },
            },
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  console.log(postid);
  console.log(test);

  return await client.keyword.findFirst({
    where: {
      word: {
        equals: keyword.trim(),
        mode: "insensitive",
      },
    },
  });
};

export const getKeywordAutomation = async (automationId: string) => {
  const automation = await client.automations.findUnique({
    where: {
      id: automationId,
    },
    include: {
      dms: true,
      triggers: true,
      listener: true,
      User: {
        select: {
          subscription: {
            select: {
              plan: true,
            },
          },
          integrations: true,
        },
      },
    },
  });

  return automation;
};

export const trackResponses = async (
  automationId: string,
  type: "COMMENT" | "DM"
) => {
  if (type === "COMMENT") {
    return await client.listener.update({
      where: {
        automationId,
      },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });
  }

  if (type === "DM") {
    return await client.listener.update({
      where: {
        automationId,
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

  // Return the keyword, its automationId, and the recent chat history
  return {
    keyword,
    automationId: keyword.automationId,
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
