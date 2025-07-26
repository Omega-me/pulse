"use server";

import { redirect } from "next/navigation";
import { onCurrentUser } from "../user";
import {
  createIntegration,
  getFacebookIntegration,
  getInstagramIntegration,
  removeIntegration,
  updateFacebookAdAccounts,
} from "./query";
import {
  generateFacebookToken,
  generateInstagramToken,
  getFacebookAdAccounts,
  getFacebookId,
  getInstagramId,
} from "@/lib/fetch";
import { IntegrationType } from "@prisma/client";
import { AdAccountProps } from "@/types/ads.types";
import { Integration } from "@/lib/utils";

export const onOAuthIntegration = async (strategy: IntegrationType) => {
  if (strategy === IntegrationType.INSTAGRAM) {
    return redirect(process.env.INSTAGRAM_EMBED_OAUTH_URL as string);
  }
  if (strategy === IntegrationType.FACEBOOK) {
    return redirect(process.env.FACEBOOK_EMBED_OAUTH_URL as string);
  }
};

export const onIntegrateInstagram = async (code: string) => {
  const user = await onCurrentUser();
  try {
    const integration = await getInstagramIntegration(user.id);

    if (integration && integration.integrations.length === 0) {
      const token = await generateInstagramToken(code);

      if (token) {
        const insta_id = await getInstagramId(token.accessToken);
        if (insta_id) {
          const today = new Date();
          const expire_date = today.setDate(today.getDate() + 60);
          const create = await createIntegration(
            user.id,
            token.accessToken,
            new Date(expire_date),
            IntegrationType.INSTAGRAM,
            insta_id.user_id
          );
          return { status: 200, data: create };
        }
        console.log(401);
        return { status: 401, data: "Instagram ID not found" };
      }
      console.log(401);
      return { status: 401, data: "Token not found" };
    }
    console.log(404);
    return { status: 404, data: "Integration not found" };
  } catch (error) {
    console.log(500, error);
    return { status: 500, data: "Internal server error" };
  }
};

export const onIntegrateFacebook = async (code: string) => {
  const user = await onCurrentUser();
  try {
    const integration = await getFacebookIntegration(user.id);

    if (integration && integration.integrations.length === 0) {
      const token = await generateFacebookToken(code);

      if (token) {
        const fb_id = await getFacebookId(token.accessToken);
        if (fb_id) {
          const today = new Date();
          const expire_date = today.setDate(today.getDate() + 60);
          const create = await createIntegration(
            user.id,
            token.accessToken,
            new Date(expire_date),
            IntegrationType.FACEBOOK,
            fb_id.id
          );
          return { status: 200, data: create };
        }
        console.log(401);
        return { status: 401, data: "Facebook ID not found" };
      }
      console.log(401);
      return { status: 401, data: "Token not found" };
    }
    console.log(404);
    return { status: 404, data: "Integration not found" };
  } catch (error) {
    console.log(500, error);
    return { status: 500, data: "Internal server error" };
  }
};

export const onDisconnectIntegration = async (strategy: IntegrationType) => {
  switch (strategy) {
    case IntegrationType.INSTAGRAM:
      return onDisconnectInstagram();
    case IntegrationType.FACEBOOK:
      return onDisconnectFacebook();
    default:
      console.log("Unsupported integration type");
  }
};

const onDisconnectInstagram = async () => {
  const user = await onCurrentUser();
  try {
    const userIntegration = await getInstagramIntegration(user.id);

    if (!userIntegration || userIntegration.integrations.length === 0) {
      return { status: 404, data: "Integration not found" };
    }

    await removeIntegration(userIntegration.integrations[0].id);
    return { status: 200, data: "Instagram disconnected successfully" };
  } catch (error) {
    console.log(500, error);
    return { status: 500, data: "Internal server error" };
  }
};

const onDisconnectFacebook = async () => {
  const user = await onCurrentUser();
  try {
    const userIntegration = await getFacebookIntegration(user.id);

    if (!userIntegration || userIntegration.integrations.length === 0) {
      return { status: 404, data: "Integration not found" };
    }

    await removeIntegration(userIntegration.integrations[0].id);
    return { status: 200, data: "Facebook disconnected successfully" };
  } catch (error) {
    console.log(500, error);
    return { status: 500, data: "Internal server error" };
  }
};

export const onGetFacebookAdAccounts = async () => {
  const user = await onCurrentUser();
  try {
    const integration = await getFacebookIntegration(user.id);

    if (!integration || integration.integrations.length === 0) {
      return { status: 404, data: "Integration not found" };
    }

    const adAccounts = await getFacebookAdAccounts(
      integration.integrations[0].token
    );

    if (!adAccounts) {
      return { status: 404, data: "No ad accounts found" };
    }

    return { status: 200, data: adAccounts };
  } catch (error) {
    console.log(500, error);
    return { status: 500, data: "Internal server error" };
  }
};

export const onUpdateFacebookAdAccounts = async (
  integration: Integration,
  adAccounts: AdAccountProps[]
) => {
  await onCurrentUser();
  try {
    const updatedIntegration = await updateFacebookAdAccounts(
      integration,
      adAccounts
    );

    if (!updatedIntegration) {
      return { status: 404, data: "Integration not found" };
    }

    return { status: 200, data: "Facebook ad accounts updated successfully" };
  } catch (error) {
    console.log(500, error);
    return { status: 500, data: "Internal server error" };
  }
};
