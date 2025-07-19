"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createUser, findUser, updateSubscription } from "./queries";
import {
  getFacebookAdAccounts,
  refreshFacebookToken,
  refreshInstagramToken,
} from "@/lib/fetch";
import { updateIntegration } from "../integrations/query";
import { stripe } from "@/lib/stripe.lib";
import { IntegrationType } from "@prisma/client";
import { findIntegration, Integration } from "@/lib/utils";

export const onCurrentUser = async () => {
  const user = await currentUser();
  if (!user) return redirect("sign-in");
  return user;
};

export const onBoardUser = async () => {
  const user = await onCurrentUser();
  try {
    const found = await findUser(user.id);
    if (found) {
      if (found.integrations.length > 0) {
        // handle instagram token refresh
        const instagramIntegration = findIntegration(
          found.integrations,
          IntegrationType.INSTAGRAM
        );
        if (instagramIntegration) {
          handleInstagramAndFacebookTokenRefresh(
            instagramIntegration,
            IntegrationType.INSTAGRAM
          );
        }

        // handle facebook token refresh
        const facebookIntegration = findIntegration(
          found.integrations,
          IntegrationType.FACEBOOK
        );
        if (facebookIntegration) {
          handleInstagramAndFacebookTokenRefresh(
            facebookIntegration,
            IntegrationType.FACEBOOK
          );
        }
      }
      // user exists
      return {
        status: 200,
        data: {
          clerkId: found.clerkId,
          firstname: found.firstname,
          lastname: found.lastname,
        },
      };
    }
    // new user is created on db
    const created = await createUser({
      clerkId: user.id,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.emailAddresses[0].emailAddress,
    });
    return {
      status: 201,
      data: created,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
    };
  }
};

const handleInstagramAndFacebookTokenRefresh = async (
  integration: Integration,
  type: IntegrationType
) => {
  const today = new Date();
  const time_left = integration.expiresAt?.getTime()! - today.getTime();
  const days = Math.round(time_left / (1000 * 3600 * 24));
  if (days > 5) {
    console.log("Refresh");
    let refresh: any;

    if (type === IntegrationType.INSTAGRAM) {
      refresh = await refreshInstagramToken(integration.token);
      const expire_date = today.setDate(today.getDate() + 60);
      const update_token = await updateIntegration(
        refresh.access_token,
        new Date(expire_date),
        integration.id
      );
      if (!update_token) {
        console.log("Update token failed!");
      }
    }

    if (type === IntegrationType.FACEBOOK) {
      refresh = await refreshFacebookToken(integration.token);
    }
  }
};

export const onUserInfo = async () => {
  const user = await onCurrentUser();
  try {
    const profile = await findUser(user.id);

    if (!user) return { status: 404 };
    return { status: 200, data: profile };
  } catch (error) {
    return { status: 500 };
  }
};

export const onSubscribe = async (session_id: string) => {
  const user = await onCurrentUser();
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session) {
      const subscribed = await updateSubscription(user.id, {
        customerId: session.customer as string,
        plan: "PRO",
      });

      if (subscribed) return { status: 200 };
      return { status: 401 };
    }
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};
