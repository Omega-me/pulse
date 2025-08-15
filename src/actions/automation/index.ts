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
  changeListenerMessageResponses,
  changeListenerPriority,
  createAutomation,
  deleteAutomation,
  deleteKeyword,
  findAutomation,
  getAllAutomations,
  getConflictingPosts,
  getKeywordsByAutomation,
  removeAllPosts,
  removeListener,
  removePost,
  toggleActiveListener,
  updateAutomation,
} from "./query";
import { uploadInstagramImages } from "@/lib/uploadthing.lib";
import { findIntegration } from "@/lib/utils";
import { InstagrPostProps } from "@/types/posts.type";
import { z } from "zod";

// Utility wrapper for try/catch
export const handleRequest = async <T, R>(
  fn: () => Promise<T>,
  successHandler: (res: T) => R,
  errorStatus = 500,
  errorMsg = "Oops! Something went wrong"
): Promise<R | { status: number; data?: null; message?: string }> => {
  try {
    const res = await fn();
    return successHandler(res);
  } catch {
    return {
      status: errorStatus,
      data: null,
      message: errorMsg,
    };
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
        : { status: 400, data: "Oops! Could not create automation" }
  );
};

export const onGetAllAutomations = async (query?: string) => {
  const user = await onCurrentUser();
  return handleRequest(
    async () => getAllAutomations(user.id, query),
    (automations) => ({
      status: 200,
      data: automations || [],
    }),
    500
  );
};

export const onGetAutomationInfo = async (id: string) => {
  await onCurrentUser();
  return handleRequest(
    async () => await findAutomation(id),
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
    async () => {
      const schema = z.object({
        name: z
          .string()
          .min(3, "Name must be at least 3 characters long")
          .max(20, "Name must be at most 20 characters long"),
      });

      const result = schema.safeParse({ name: data.name });
      if (!result.success) {
        const errorMessage = result.error.errors[0]?.message || "Invalid input";
        return {
          status: 400,
          data: errorMessage,
        };
      }

      return updateAutomation(id, data);
    },
    (automation) => {
      if (typeof automation === "boolean") {
        return automation
          ? { status: 200, data: "Automation successfully updated" }
          : { status: 404, data: "Oops! Could not find an automation" };
      } else {
        return automation;
      }
    }
  );
};

export const onSaveListener = async (
  automationId: string,
  listener: ListenerType,
  prompt: string,
  reply?: string
) => {
  await onCurrentUser();
  return handleRequest(
    () => addListener(automationId, listener, prompt, reply),
    (created) =>
      created
        ? { status: 200, data: "Listener created" }
        : { status: 404, data: "Oops! Could not save listener" }
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
        : { status: 400, data: "Oops! Could not save listener" }
  );
};

export const onChangeListenerMessageResponses = async (
  id: string,
  data: { prompt?: string; reply?: string }
) => {
  await onCurrentUser();
  return handleRequest(
    () => changeListenerMessageResponses(id, data),
    (updated) =>
      updated
        ? { status: 200, data: "Value updated" }
        : { status: 400, data: "Oops! Could not save value" }
  );
};

export const onToggleActiveListener = async (id: string) => {
  await onCurrentUser();
  return handleRequest(
    () => toggleActiveListener(id),
    (updated) =>
      updated
        ? { status: 200, data: "Listener status changed" }
        : { status: 404, data: "Oops! Could not find listener" }
  );
};

export const onRemoveListener = async (id: string) => {
  await onCurrentUser();
  return handleRequest(
    () => removeListener(id),
    (removed) =>
      removed
        ? { status: 200, data: "Listener removed" }
        : { status: 404, data: "Listener not found" }
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
    (changed) =>
      changed
        ? { status: 200, data: "Listener priority changed" }
        : { status: 404, data: "Oops! Could not change listener priority" }
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
        : { status: 400, data: "Oops! Could not save trigger" }
  );
};

export const onSaveKeyword = async (
  automationId: string,
  keyword: string,
  listenerId?: string
) => {
  const user = await onCurrentUser();
  return handleRequest(
    async () => {
      // get all users automations
      const automations = await onGetAllAutomations();

      if (automations.data.filter((a) => a.id === automationId).length > 0) {
        const currentAutomation = automations.data.find(
          (a) => a.id === automationId
        );

        // 1. checks if keyword exists in current automation
        if (
          currentAutomation.keywords.some(
            (k) => k.word.toLowerCase() === keyword.toLowerCase().trim()
          )
        ) {
          return {
            status: 400,
            data: `Keyword already exists in this automation`,
          };
        }

        // 3. checks if keyword exists in other automations for DM triggers
        const dmtrigger = currentAutomation.triggers.find(
          (t) => t.type === TriggerType.DM
        );
        if (!!dmtrigger) {
          // get all user automations and check for keyword duplication
          const allDmAutomations = automations.data.filter((a) =>
            a.triggers.some((t) => t.type === TriggerType.DM)
          );
          const allKeywords = allDmAutomations.flatMap((a) => a.keywords);

          if (
            allKeywords.some(
              (k) => k.word.toLowerCase() === keyword.toLowerCase().trim()
            )
          ) {
            return {
              status: 400,
              data: "Keyword used in another direct message automation",
            };
          }
        }
      }
      return addKeyword(user.id, automationId, keyword, listenerId);
    },
    (created) => {
      if (typeof created === "boolean") {
        return created
          ? { status: 200, data: "Keyword added successfully" }
          : { status: 404, data: "Oops! Could not add this keyword" };
      } else {
        return created;
      }
    }
  );
};

export const onDeleteKeyword = async (id: string) => {
  await onCurrentUser();
  return handleRequest(
    () => deleteKeyword(id),
    (deleted) =>
      deleted
        ? { status: 200, data: "Keyword deleted" }
        : { status: 404, data: "Oops! Keyword not found" }
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
        : { status: 404, data: "Oops! Could not find automation" }
  );
};

export const onRemovePost = async (id: string) => {
  await onCurrentUser();
  return handleRequest(
    async () => removePost(id),
    (removed) =>
      removed
        ? { status: 200, data: "Post removed" }
        : { status: 404, data: "Post not found" }
  );
};

export const onRemovePosts = async (automationId: string) => {
  await onCurrentUser();
  return handleRequest(
    async () => removeAllPosts(automationId),
    (removed) =>
      removed
        ? { status: 200, data: "Posts removed" }
        : { status: 404, data: "No posts found for this" }
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
        : { status: 404, data: "Oops! Could not find automation" }
  );
};

export const onDeleteAutomation = async (automationId: string) => {
  await onCurrentUser();
  return handleRequest(
    async () => {
      return await deleteAutomation(automationId);
    },
    (removed) =>
      removed
        ? { status: 200, data: "Automation removed" }
        : { status: 404, data: "Oops! Could not find automation" }
  );
};
