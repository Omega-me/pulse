"use server";

import {
  IntegrationType,
  ListenerType,
  Post,
  TriggerType,
} from "@prisma/client";
import { onCurrentUser } from "../user";
import { findUser } from "../user/queries";
import {
  addKeyword,
  addListener,
  addListener2,
  addPosts,
  addTrigger,
  changeListenerPriority,
  createAutomation,
  deleteAutomation,
  deleteKeyword,
  findAutomation,
  getAllAutomations,
  getConflictingPosts,
  getKeywordsByAutomation,
  removePost,
  updateAutomation,
} from "./query";
import {
  deleteUploadedFiles,
  uploadInstagramImages,
} from "@/lib/uploadthing.lib";
import { findIntegration } from "@/lib/utils";
import { InstagrPostProps } from "@/types/posts.type";

// Utility wrapper for try/catch
const handleRequest = async <T>(
  fn: () => Promise<T>,
  successHandler: (res: T) => any,
  errorStatus = 500,
  errorMsg = "Oops! Something went wrong"
) => {
  try {
    const res = await fn();
    return successHandler(res);
  } catch {
    return { status: errorStatus, data: errorMsg };
  }
};

export const onCreateAutomation = async () => {
  const user = await onCurrentUser();
  const userInfo = await findUser(user.id);
  return handleRequest(
    () => createAutomation(userInfo.id),
    (create) =>
      create
        ? { status: 201, data: "Automation created", id: create.id }
        : { status: 404, data: "Oops! Something went wrong" }
  );
};

export const onGetAllAutomations = async () => {
  const user = await onCurrentUser();
  return handleRequest(
    () => getAllAutomations(user.id),
    (data) => ({
      status: 200,
      data: data?.automations || [],
    }),
    500
  );
};

export const onGetAutomationInfo = async (id: string) => {
  await onCurrentUser();
  return handleRequest(
    () => findAutomation(id),
    (automation) =>
      automation ? { status: 200, data: automation } : { status: 404 },
    500
  );
};

export const onUpdateAutomationName = async (
  id: string,
  data: { name?: string; active?: boolean; automation?: string }
) => {
  await onCurrentUser();
  return handleRequest(
    () => updateAutomation(id, data),
    (automation) =>
      automation
        ? { status: 200, data: "Automation successfully updated" }
        : { status: 404, data: "Oops! Could not find an automation" }
  );
};

export const onSaveListener = async (
  automationId: string,
  listener: "SMARTAI" | "MESSAGE",
  prompt: string,
  reply?: string
) => {
  await onCurrentUser();
  return handleRequest(
    () => addListener(automationId, listener, prompt, reply),
    (created) =>
      created
        ? { status: 200, data: "Listener created" }
        : { status: 404, data: "Cant save listener" }
  );
};

export const onSaveListener2 = async (
  automationId: string,
  listener: ListenerType,
  keywordIds: string[],
  prompt: string,
  reply?: string
) => {
  await onCurrentUser();
  return handleRequest(
    () => addListener2(automationId, listener, keywordIds, prompt, reply),
    (created) =>
      created
        ? { status: 200, data: "Listener created" }
        : { status: 404, data: "Cant save listener" }
  );
};

export const onChangeListenerPriority = async (
  automationId: string,
  activeListenerId: string,
  swapedListenerId: string
) => {
  await onCurrentUser();
  return handleRequest(
    () =>
      changeListenerPriority(automationId, activeListenerId, swapedListenerId),
    (created) =>
      created
        ? { status: 200, data: "Listener priority changed" }
        : { status: 404, data: "Cant change listener priority" }
  );
};

export const onSaveTrigger = async (
  automationId: string,
  trigger: TriggerType[]
) => {
  await onCurrentUser();
  return handleRequest(
    () => addTrigger(automationId, trigger),
    (created) =>
      created
        ? { status: 200, data: "Trigger created" }
        : { status: 404, data: "Cant save trigger" }
  );
};

export const onSaveKeyword = async (
  automationId: string,
  keyword: string,
  listenerId?: string
) => {
  const user = await onCurrentUser();
  return handleRequest(
    () => addKeyword(user.id, automationId, keyword, listenerId),
    (created) =>
      created
        ? { status: 200, data: "Keyword added successfully" }
        : { status: 404, data: "Cant add this keyword" }
  );
};

export const onDeleteKeyword = async (id: string) => {
  await onCurrentUser();
  return handleRequest(
    () => deleteKeyword(id),
    (deleted) =>
      deleted
        ? { status: 200, data: "Keyword deleted" }
        : { status: 404, data: "Keyword not found" }
  );
};

export const onGetProfilePosts = async () => {
  const user = await onCurrentUser();
  try {
    if (process.env.NODE_ENV === "development") {
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    }

    const profile = await findUser(user.id);
    const instagramIntegration = findIntegration(
      profile.integrations,
      IntegrationType.INSTAGRAM
    );
    const token = instagramIntegration?.token;

    if (!token) {
      console.log("No instagram token found");
      return { status: 401 };
    }

    const posts = await fetch(
      `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=id,caption,media_type,media_url,timestamp&limit=10&access_token=${token}`
    );

    const parsed = await posts.json();
    return parsed ? { status: 200, data: parsed.data } : { status: 404 };
  } catch (error) {
    console.log("Error fetching posts", error);
    return { status: 500 };
  }
};

export const onMarkUsedPosts = async (
  instagramPosts: InstagrPostProps[],
  currentAutomationId: string
) => {
  const currentKeywords = await getKeywordsByAutomation(currentAutomationId);
  const keywords = currentKeywords.map((k) => k.word.toLowerCase());
  const instagramPostIds = instagramPosts.map((p) => p.id);

  const conflictingPosts = await getConflictingPosts(
    currentAutomationId,
    instagramPostIds,
    keywords
  );

  const conflictMap = new Map<
    string,
    { automationId: string | null; postUrl: string; matchedKeywords: string[] }
  >();

  conflictingPosts.forEach((post) => {
    const matchedKeywords = post.Automation.keywords
      .map((k) => k.word.toLowerCase())
      .filter((k) => keywords.includes(k));

    conflictMap.set(post.postid, {
      automationId: post.automationId,
      postUrl: post.media,
      matchedKeywords,
    });
  });

  return instagramPosts.map((post) => {
    const conflict = conflictMap.get(post.id);
    return {
      ...post,
      extraInfo: {
        isUsed: !!conflict,
        automationId: conflict?.automationId || null,
        postUrl: conflict?.postUrl || null,
        matchedKeywords: conflict?.matchedKeywords || [],
        postid: conflict ? post.id : null,
      },
    };
  });
};

export const onSavePosts = async (automationId: string, posts: Post[]) => {
  await onCurrentUser();
  return handleRequest(
    async () => {
      const urls = posts.map((post) => post.media);
      const newUrls = await uploadInstagramImages(urls);
      const newPosts = posts.map((post, i) => ({ ...post, media: newUrls[i] }));
      return await addPosts(automationId, newPosts);
    },
    (created) =>
      created
        ? { status: 200, data: "Posts attached" }
        : { status: 404, data: "Automation not found" }
  );
};

export const onRemovePost = async (postId: string) => {
  await onCurrentUser();
  return handleRequest(
    async () => {
      const removed = await removePost(postId);
      await deleteUploadedFiles([removed.media]);
      return removed;
    },
    (removed) =>
      removed
        ? { status: 200, data: "Post removed" }
        : { status: 404, data: "Post not found" }
  );
};

export const onActivateAutomation = async (
  automationId: string,
  state: boolean
) => {
  await onCurrentUser();
  return handleRequest(
    () => updateAutomation(automationId, { active: state }),
    (activated) =>
      activated
        ? {
            status: 200,
            data: `Automation ${state ? "activated" : "disabled"}`,
          }
        : { status: 404, data: "Automation not found" }
  );
};

export const onDeleteAutomation = async (automationId: string) => {
  await onCurrentUser();
  return handleRequest(
    async () => {
      const automation = await findAutomation(automationId);
      if (!automation) return null;

      if (automation.posts.length > 0) {
        const urls = automation.posts.map((post) => post.media);
        await deleteUploadedFiles(urls);
      }

      return await deleteAutomation(automationId);
    },
    (removed) =>
      removed
        ? { status: 200, data: "Automation removed" }
        : { status: 404, data: "Automation not found" }
  );
};
