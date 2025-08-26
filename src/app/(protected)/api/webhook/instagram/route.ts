import { onGenerateSmartAiMessage } from "@/actions/webhook";
import {
  createChatHistory,
  createConversationSession,
  getChatHistory,
  getConversationSession,
  getKeywordAutomation,
  getKeywordPost,
  matchKeywordFromComment,
  matchKeywordFromDm,
  trackResponses,
} from "@/actions/webhook/queries";
import { replyToInstagramComment, sendDM, sendPrivateDM } from "@/lib/fetch";
import { NextRequest, NextResponse } from "next/server";
import {
  IntegrationType,
  Keyword,
  Listener,
  ListenerType,
  SubscriptionPlan,
  TriggerType,
} from "@prisma/client";
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
  if (messaging?.message?.is_echo) return jsonResponse("Skipping echo message");
  // Configure different keywords to handle different behaviour direct form chat for the echo messages

  try {
    const source = messaging ? TriggerType.DM : TriggerType.COMMENT;
    const matchedResult =
      source === TriggerType.COMMENT
        ? await matchKeywordFromComment(comment?.value?.media?.id, text)
        : await matchKeywordFromDm(text);
    const senderId = entry.id;
    const receiverId = messaging?.sender.id ?? comment?.value.from.id;
    if (senderId === receiverId) {
      return jsonResponse("You are trying to send e message to yourself");
    }

    if (matchedResult) {
      return await handleKeywordMatched(
        matchedResult,
        text,
        source,
        senderId,
        receiverId,
        comment
      );
    }
    return await handleFallback(entry, text, messaging);
  } catch (error) {
    console.error("Webhook Error ==>>:", error);
    return jsonResponse("Server error");
  }
}

function jsonResponse(message: string) {
  console.log(message);
  return NextResponse.json({ message }, { status: 200 });
}

async function handleKeywordMatched(
  matchedResult: {
    automation: {
      id: string;
    };
    keyword: Keyword;
    listener: Listener;
  },
  text: string,
  source: TriggerType,
  senderId: string,
  receiverId: string,
  comment?: Changes
) {
  console.log(matchedResult, "matchedResult");
  const { keyword, listener: matchedListener } = matchedResult;

  if (!matchedListener.isActive) return jsonResponse("Listener is not active");

  let conversationId: string | null = null;
  if (
    matchedListener.listener === ListenerType.SMARTAI &&
    matchedListener.continuousConversation
  ) {
    const conversationSession = await createConversationSession(
      senderId,
      receiverId,
      matchedListener.id,
      keyword.id
    );
    if (conversationSession) {
      conversationId = conversationSession.id;
    }
  }

  const automation = await getKeywordAutomation(matchedResult.listener.id);
  if (
    !automation ||
    !automation.active ||
    !automation.listener ||
    !automation.triggers?.length
  )
    return jsonResponse("Invalid or inactive automation");
  if (!automation.listener)
    return jsonResponse("No listener attached to this automation");

  const instagramToken = findIntegration(
    automation.user?.integrations,
    IntegrationType.INSTAGRAM
  )?.token;
  const facebookToken = findIntegration(
    automation.user?.integrations,
    IntegrationType.FACEBOOK
  )?.token;

  if (!instagramToken) return jsonResponse("Missing Instagram token");

  const listener = automation?.listener;
  const listenerType = listener?.listener;
  const prompt = listener?.prompt;
  const triggers = automation.triggers.map((t) => t.type);
  const commentReply = listener?.commentReply;
  const isPro = automation.user.subscription?.plan === SubscriptionPlan.PRO;

  if (source === TriggerType.COMMENT) {
    const postCheck = await getKeywordPost(
      automation.id,
      comment?.value?.media?.id
    );
    if (!postCheck) return jsonResponse("Post not automated");
  }

  if (!triggers.includes(source)) return jsonResponse("Trigger type mismatch");

  if (listenerType === ListenerType.MESSAGE) {
    const message = await (source === TriggerType.COMMENT
      ? sendPrivateDM(senderId, comment!.value.id, prompt, instagramToken)
      : sendDM(senderId, receiverId, prompt, instagramToken));

    if (facebookToken && source === TriggerType.COMMENT && commentReply) {
      await replyToInstagramComment(
        comment!.value.id,
        commentReply,
        facebookToken
      );
    }

    if (message.status === 200)
      await trackResponses(matchedListener.id, source);
  }

  if (listenerType === ListenerType.SMARTAI && isPro) {
    const history = await getChatHistory(senderId, receiverId);
    let promptMessage: string;
    if (source === TriggerType.COMMENT) {
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
      conversationSessionId: conversationId,
    });

    const status = await (source === TriggerType.COMMENT
      ? sendPrivateDM(senderId, comment!.value.id, aiMessage, instagramToken)
      : sendDM(senderId, receiverId, aiMessage, instagramToken));

    if (facebookToken && source === TriggerType.COMMENT && commentReply) {
      await replyToInstagramComment(
        comment!.value.id,
        commentReply,
        facebookToken
      );
    }

    if (status.status === 200) await trackResponses(matchedListener.id, source);
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
  const conversationSession = await getConversationSession(
    senderId,
    receiverId
  );

  if (!conversationSession)
    return jsonResponse("No active conversation session found");
  if (!conversationSession.listener.continuousConversation)
    return jsonResponse("Continuous conversation is disabled");
  if (!conversationSession.listener.isActive)
    return jsonResponse("Listener is not active");

  const automation = await getKeywordAutomation(conversationSession.listenerId);
  if (
    !automation ||
    !automation.active ||
    !automation.listener ||
    !automation.triggers?.length
  )
    return jsonResponse("Invalid or inactive automation");

  const instagramIntegration = findIntegration(
    automation.user?.integrations,
    IntegrationType.INSTAGRAM
  );
  if (!instagramIntegration) {
    return jsonResponse("Missing Instagram integration");
  }
  const { token } = instagramIntegration;
  if (!token) return jsonResponse("Missing Instagram token");

  const isPro = automation.user.subscription?.plan === SubscriptionPlan.PRO;
  if (!isPro) return jsonResponse("User is not a pro member");

  const aiMessage = await onGenerateSmartAiMessage(
    conversationSession.dms,
    text
  );
  if (!aiMessage?.trim()) return jsonResponse("AI failed");
  await handleCreateChatHistory({
    automationId: automation.id,
    senderId,
    reciever: receiverId,
    message: text,
    aiMessage,
    keywordId: conversationSession.keywordId,
    conversationSessionId: conversationSession.id,
  });

  const status = await sendDM(senderId, receiverId!, aiMessage, token);
  if (status.status === 200)
    await trackResponses(conversationSession.listenerId, TriggerType.DM);

  return jsonResponse("Message sent via fallback");
}

async function handleCreateChatHistory(opts: {
  automationId: string;
  senderId: string;
  reciever: string;
  message: string;
  aiMessage: string;
  keywordId: string;
  conversationSessionId: string;
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
      conversationSessionId: opts.conversationSessionId,
    }),
    createChatHistory({
      automationId: opts.automationId,
      senderId: opts.senderId,
      reciever: opts.reciever,
      message: opts.aiMessage,
      systemDm: true,
      usedSmartAI: true,
      keywordId: opts.keywordId,
      conversationSessionId: opts.conversationSessionId,
    }),
  ];
  await client.$transaction([recvChat, sendChat]);
}
