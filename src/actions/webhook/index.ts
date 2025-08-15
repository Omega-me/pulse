"use server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Dms } from "@prisma/client";
import { generateText, CoreMessage } from "ai";
import { matchKeywordFromComment, matchKeywordFromDm } from "./queries";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
});

// Function to fetch and format messages from DB
const formatMessagesForAI = (messages?: Dms[]) => {
  const coreMessages: CoreMessage[] = messages
    ? messages.map((msg) => ({
        content: msg.message,
        role: msg.system_dm ? "assistant" : "user",
      }))
    : [];

  return coreMessages;
};

// TODO: try deepseek from routes ai
export const onGenerateSmartAiMessage = async (
  messages: Dms[],
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
