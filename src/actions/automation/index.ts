"use server";
import { IntegrationType, Post } from "@prisma/client";
import { onCurrentUser } from "../user";
import { findUser } from "../user/queries";
import {
  addKeyword,
  addListener,
  addPosts,
  addTrigger,
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

export const onCreateAutomation = async () => {
  const user = await onCurrentUser();
  const userInfo = await findUser(user.id);
  try {
    const create = await createAutomation(userInfo.id);
    if (create)
      return { status: 201, data: "Automation created", id: create.id };
    return { status: 404, data: "Oops! Something went wrong" };
  } catch (error) {
    return { status: 500, data: "Internal server error" };
  }
};

export const onGetAllAutomations = async () => {
  const user = await onCurrentUser();
  try {
    const data = await getAllAutomations(user.id);
    if (data) return { status: 200, data: data.automations || [] };
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 500, data: [] };
  }
};

export const onGetAutomationInfo = async (id: string) => {
  await onCurrentUser();
  try {
    const automation = await findAutomation(id);
    if (automation) return { status: 200, data: automation };
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const onUpdateAutomationName = async (
  id: string,
  data: {
    name?: string;
    active?: boolean;
    automation?: string;
  }
) => {
  await onCurrentUser();
  try {
    const automation = await updateAutomation(id, data);
    if (automation)
      return { status: 200, data: "Automation successfully updated" };
    return { status: 404, data: "Oops! Could not find an automation" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong" };
  }
};

export const onSaveListener = async (
  automationId: string,
  listener: "SMARTAI" | "MESSAGE",
  prompt: string,
  reply?: string
) => {
  await onCurrentUser();
  try {
    const created = await addListener(automationId, listener, prompt, reply);
    if (created) return { status: 200, data: "Listener created" };
    return { status: 404, data: "Cant save listener" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong" };
  }
};

export const onSaveTrigger = async (
  automationId: string,
  trigger: string[]
) => {
  await onCurrentUser();
  try {
    const created = await addTrigger(automationId, trigger);
    if (created) return { status: 200, data: "Trigger created" };
    return { status: 404, data: "Cant save trigger" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong" };
  }
};

export const onSaveKeyword = async (automationId: string, keyword: string) => {
  const user = await onCurrentUser();
  try {
    const created = await addKeyword(user.id, automationId, keyword);
    if (created) return { status: 200, data: "Keyword added successfully" };
    return { status: 404, data: "Cant add this keyword" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong" };
  }
};

export const onDeleteKeyword = async (id: string) => {
  await onCurrentUser();
  try {
    const deleted = await deleteKeyword(id);
    if (deleted) return { status: 200, data: "Keyword deleted" };
    return { status: 404, data: "Keyword not found" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong" };
  }
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

    if (token) {
      const posts = await fetch(
        `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=id,caption,media_type,media_url,timestamp&limit=10&access_token=${token}`
      );

      const parsed = await posts.json();
      if (parsed) return { status: 200, data: parsed.data };
      console.log("Error fetching posts", parsed);
      return { status: 404 };
    }
    console.log("No instagram token found");
    return { status: 401 };
  } catch (error) {
    console.log("Error fetching posts", error);
    return { status: 500 };
  }
};

export const onMarkUsedPosts = async (
  instagramPosts: InstagrPostProps[],
  currentAutomationId: string
) => {
  // 1. Get keywords of current automation
  const currentKeywords = await getKeywordsByAutomation(currentAutomationId);
  const keywords = currentKeywords.map((k) => k.word.toLowerCase());

  // 2. Get conflicting posts used in other automations that have at least one of the keywords
  const instagramPostIds = instagramPosts.map((p) => p.id);
  const conflictingPosts = await getConflictingPosts(
    currentAutomationId,
    instagramPostIds,
    keywords
  );

  // 3. Create a map for quick lookup with extra info
  const conflictMap = new Map<
    string,
    {
      automationId: string | null;
      postUrl: string;
      matchedKeywords: string[];
    }
  >();

  for (const post of conflictingPosts) {
    // Filter matched keywords by those in currentKeywords
    const matchedKeywords = post.Automation.keywords
      .map((k) => k.word.toLowerCase())
      .filter((k) => keywords.includes(k));

    conflictMap.set(post.postid, {
      automationId: post.automationId,
      postUrl: post.media,
      matchedKeywords,
    });
  }

  // 4. Return instagram posts enriched with isUsed + conflict details
  return instagramPosts.map((post) => {
    const conflict = conflictMap.get(post.id);
    if (conflict) {
      return {
        ...post,
        extraInfo: {
          isUsed: true,
          automationId: conflict.automationId,
          postUrl: conflict.postUrl,
          matchedKeywords: conflict.matchedKeywords,
          postid: post.id,
        },
      };
    }
    return {
      ...post,
      extraInfo: {
        isUsed: false,
        automationId: null,
        postUrl: null,
        matchedKeywords: [],
        postid: null,
      },
    };
  });
};

export const onSavePosts = async (automationId: string, posts: Post[]) => {
  await onCurrentUser();
  try {
    const urls = posts.map((post) => {
      return post.media;
    });
    const newUrls = await uploadInstagramImages(urls);
    const newPosts = posts.map((post, i) => {
      return {
        ...post,
        media: newUrls[i],
      };
    });

    const created = await addPosts(automationId, newPosts);
    if (created) return { status: 200, data: "Posts attached" };
    return { status: 404, data: "Automation not found" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong" };
  }
};

export const onRemovePost = async (postId: string) => {
  await onCurrentUser();
  try {
    const removed = await removePost(postId);
    await deleteUploadedFiles([removed.media]);
    if (removed) return { status: 200, data: "Post removed" };
    return { status: 404, data: "Post not found" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong" };
  }
};

export const onActivateAutomation = async (
  automationId: string,
  state: boolean
) => {
  await onCurrentUser();
  try {
    const activated = await updateAutomation(automationId, { active: state });
    if (activated)
      return {
        status: 200,
        data: `Automation ${state ? "activated" : "disabled"}`,
      };
    return { status: 404, data: "Automation not found" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong" };
  }
};

export const onDeleteAutomation = async (automationId: string) => {
  await onCurrentUser();
  try {
    const automation = await findAutomation(automationId);
    if (!automation) {
      return { status: 404, data: "Automation not found" };
    }
    if (automation.posts.length > 0) {
      const urls = automation.posts.map((post) => post.media);
      await deleteUploadedFiles(urls);
    }
    const removed = await deleteAutomation(automationId);
    if (removed)
      return {
        status: 200,
        data: "Automation removed",
      };
    return { status: 404, data: "Automation not found" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong" };
  }
};
