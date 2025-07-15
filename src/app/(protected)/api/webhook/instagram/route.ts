import { onGenerateSmartAiMessage } from "@/actions/webhook";
import {
  createChatHistory,
  getChatHistory,
  getKeywordAutomation,
  getKeywordPost,
  matchKeyword,
  trackResponses,
} from "@/actions/webhook/queries";
import { replyToInstagramComment, sendDM, sendPrivateDM } from "@/lib/fetch";
import { NextRequest, NextResponse } from "next/server";
import { IntegrationType, Keyword } from "@prisma/client";
import { client } from "@/lib/prisma.lib";
import { findIntegration } from "@/lib/utils";

interface Changes {
  field: "comments" | "messages";
  value: {
    from: { id: string; username: string };
    media: { id: string; media_product_type: string };
    id: string;
    parent_id: string;
    text: string;
  };
}

interface Messaging {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message: { mid: string; text: string; is_echo: boolean };
}

interface Entry {
  id: string;
  time: number;
  changes?: Changes[];
  messaging?: Messaging[];
}

export async function GET(req: NextRequest) {
  const hub = req.nextUrl.searchParams.get("hub.challenge");
  return new NextResponse(hub);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const entry: Entry = payload.entry?.[0];

  if (!entry) return jsonResponse("Invalid payload");

  const messaging = entry.messaging?.[0];
  const comment = entry.changes?.[0];
  const text = messaging?.message?.text ?? comment?.value?.text;

  if (!text) return jsonResponse("No message text found");
  // if (messaging?.message?.is_echo) return jsonResponse('Skipping echo message');

  try {
    const keyword = await matchKeyword(text, entry.id);
    const source = messaging ? "DM" : "COMMENT";
    const senderId = entry.id;
    const receiverId = messaging?.sender.id ?? comment?.value.from.id;
    if (senderId === receiverId) {
      return jsonResponse("You are trying to send e message to yourself");
    }

    if (keyword)
      return await handleKeywordMatch(
        keyword,
        text,
        source,
        senderId,
        receiverId,
        comment
      );
    return await handleFallback(entry, text, messaging);
  } catch (error) {
    console.error("Webhook Error:", error);
    return jsonResponse("Server error");
  }
}

function jsonResponse(message: string) {
  console.log(message);
  return NextResponse.json({ message }, { status: 200 });
}

async function handleKeywordMatch(
  keyword: Keyword,
  text: string,
  source: "DM" | "COMMENT",
  senderId: string,
  receiverId: string,
  comment?: Changes
) {
  const automation = await getKeywordAutomation(keyword.automationId);
  if (
    !automation ||
    !automation.active ||
    !automation.listener ||
    !automation.triggers?.length
  )
    return jsonResponse("Invalid or inactive automation");

  const instagramToken = findIntegration(
    automation.User?.integrations,
    IntegrationType.INSTAGRAM
  )?.token;
  const facebookToken = findIntegration(
    automation.User?.integrations,
    IntegrationType.FACEBOOK
  )?.token;

  if (!instagramToken) return jsonResponse("Missing Instagram token");

  const isPro = automation.User.subscription?.plan === "PRO";
  const listenerType = automation.listener?.listener;
  const prompt = automation.listener?.prompt;
  const triggers = automation.triggers.map((t) => t.type);
  const commentReply = automation.listener?.commentReply;

  if (source === "COMMENT") {
    const postCheck = await getKeywordPost(
      automation.id,
      comment!.value.media.id
    );
    if (!postCheck) return jsonResponse("Post not automated");
  }

  if (!triggers.includes(source)) return jsonResponse("Trigger type mismatch");

  if (listenerType === "MESSAGE") {
    const message = await (source === "COMMENT"
      ? sendPrivateDM(senderId, comment!.value.id, prompt, instagramToken)
      : sendDM(senderId, receiverId, prompt, instagramToken));

    if (facebookToken && source === "COMMENT" && commentReply) {
      await replyToInstagramComment(
        comment!.value.id,
        commentReply,
        facebookToken
      );
    }

    if (message.status === 200) await trackResponses(automation.id, source);
  }

  if (listenerType === "SMARTAI" && isPro) {
    const history = await getChatHistory(senderId, receiverId);
    let promptMessage: string;
    if (source === "COMMENT") {
      promptMessage = prompt;
    } else {
      if (!history) {
        promptMessage = prompt;
      }
      if (history && history.chatHistory.length === 0) {
        promptMessage = prompt;
      }
      if (history && history.chatHistory.length > 0) {
        promptMessage = text;
      }
    }
    const aiMessage = await onGenerateSmartAiMessage(
      history?.chatHistory,
      promptMessage
    );
    if (!aiMessage?.trim()) return jsonResponse("AI failed");
    await handleCreateChatHistory({
      automationId: automation.id,
      senderId,
      reciever: receiverId,
      message: promptMessage,
      aiMessage,
      keywordId: keyword.id,
    });

    const status = await (source === "COMMENT"
      ? sendPrivateDM(senderId, comment!.value.id, aiMessage, instagramToken)
      : sendDM(senderId, receiverId, aiMessage, instagramToken));

    if (facebookToken && source === "COMMENT" && commentReply) {
      await replyToInstagramComment(
        comment!.value.id,
        commentReply,
        facebookToken
      );
    }

    if (status.status === 200) await trackResponses(automation.id, source);
  }

  return jsonResponse("DM sent");
}

async function handleFallback(
  entry: Entry,
  text: string,
  messaging?: Messaging
) {
  if (!messaging) {
    return jsonResponse(
      "Fallback not available if comment different from a keword"
    );
  }
  const senderId = entry.id;
  const receiverId = messaging?.sender.id;
  if (senderId === receiverId) {
    return jsonResponse("You are trying to send e message to yourself");
  }
  const history = await getChatHistory(senderId, receiverId);
  if (!history) return jsonResponse("No Ai chat history found with this user");

  const automation = await getKeywordAutomation(history.automationId);
  if (
    !automation ||
    !automation.active ||
    !automation.listener ||
    !automation.triggers?.length
  )
    return jsonResponse("Invalid or inactive automation");

  const token = automation.User?.integrations?.find(
    (int) => int.name === "INSTAGRAM"
  )?.token;
  if (!token) return jsonResponse("Missing Instagram token");

  const isPro = automation.User.subscription?.plan === "PRO";
  if (!isPro) return jsonResponse("User is not a pro member");

  const aiMessage = await onGenerateSmartAiMessage(history.chatHistory, text);
  if (!aiMessage?.trim()) return jsonResponse("AI failed");
  await handleCreateChatHistory({
    automationId: automation.id,
    senderId,
    reciever: receiverId,
    message: text,
    aiMessage,
    keywordId: history.keyword.id,
  });

  const status = await sendDM(senderId, receiverId!, aiMessage, token);
  if (status.status === 200) await trackResponses(automation.id, "DM");

  return jsonResponse("Message sent via fallback");
}

async function handleCreateChatHistory(opts: {
  automationId: string;
  senderId: string;
  reciever: string;
  message: string;
  aiMessage: string;
  keywordId: string;
}) {
  const [recvChat, sendChat] = [
    createChatHistory({
      automationId: opts.automationId,
      senderId: opts.senderId,
      reciever: opts.reciever,
      message: opts.message,
      systemDm: false,
      usedSmartAI: true,
      keywordId: opts.keywordId,
    }),
    createChatHistory({
      automationId: opts.automationId,
      senderId: opts.senderId,
      reciever: opts.reciever,
      message: opts.aiMessage,
      systemDm: true,
      usedSmartAI: true,
      keywordId: opts.keywordId,
    }),
  ];
  await client.$transaction([recvChat, sendChat]);
}
