"use server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Dm } from "@prisma/client";
import { generateText, CoreMessage } from "ai";
import { onCurrentUser } from "../user";
import { createConversationSession, getConversationSession } from "./queries";
import { handleRequest } from "@/lib/utils";
import { m } from "motion/dist/react";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
});

// Function to fetch and format messages from DB
const formatMessagesForAI = (messages?: Dm[]) => {
  const coreMessages: CoreMessage[] = messages
    ? messages.map((msg) => ({
        content: msg.message,
        role: msg.system_dm ? "assistant" : "user",
      }))
    : [];

  return coreMessages;
};

export const onGenerateSmartAiMessage = async (
  messages: Dm[],
  prompt: string
) => {
  try {
    // Format the DB messages to include role based on the system_dm flag
    const formattedMessages: CoreMessage[] = formatMessagesForAI(messages);

    // Add the current prompt message from the assistant
    const promptMessage: CoreMessage = {
      content: `${prompt}`,
      role: "user",
    };

    // Send the formatted messages history along with the new prompt to the AI model
    const { text } = await generateText({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          content:
            // TODO: create a better prompt
            "Do not give answers longer than 2 sentences and you will speak in albanian language all the time",
          role: "system",
        },
        ...formattedMessages,
        promptMessage,
      ],
    });

    return text;
  } catch (error) {
    console.error("Error generating Smart AI message:", error);
    return null;
  }
};

export const onCreateConversationSession = async (
  senderId: string,
  recieverId: string,
  listenerId: string,
  keywordId: string
) => {
  const user = await onCurrentUser();
  return handleRequest(
    async () => {
      const conversationSession = await createConversationSession(
        user.id,
        senderId,
        recieverId,
        listenerId,
        keywordId
      );
      console.log("Logged in User:", user);
      console.log("Created conversation session:", conversationSession);
      return conversationSession;
    },
    (created) => created
    // created ? { status: 200, data: created } : { status: 400, data: null }
  );
};
