import axios from "axios";

interface InstagramShortToken {
  access_token: string;
  user_id: string;
  permissions: Array<
    | "instagram_business_basic"
    | "instagram_business_manage_messages"
    | "instagram_business_content_publish"
    | "instagram_business_manage_insights"
    | "instagram_business_manage_comments"
  >;
}

export const sendDM = async (
  userId: string,
  recieverId: string,
  prompt: string,
  token: string
) => {
  if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  console.log("Sending DM to user");
  try {
    const response = await axios.post(
      `${process.env.INSTAGRAM_BASE_URL as string}/v23.0/${userId}/messages`,
      {
        recipient: {
          id: recieverId,
        },
        message: {
          text: prompt,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to send DM:", error.response?.data || error.message);
    throw error;
  }
};

export const sendPrivateDM = async (
  userId: string,
  recieverId: string,
  prompt: string,
  token: string
) => {
  if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  console.log("Sending private DM to user");
  try {
    const response = await axios.post(
      `${process.env.INSTAGRAM_BASE_URL as string}/${userId}/messages`,
      {
        recipient: {
          comment_id: recieverId,
        },
        message: {
          text: prompt,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to send DM:", error.response?.data || error.message);
    throw error;
  }
};

export const replyToInstagramComment = async (
  commentId: string,
  message: string,
  accessToken: string
) => {
  console.log("Leaving reply to Instagram comment");
  try {
    const response = await axios.post(
      `${process.env.FACEBOOK_BASE_URL}/v23.0/${commentId}/replies`,
      {
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error: any) {
    console.error(
      "Failed to reply to comment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Instagram integration functions
export const refreshInstagramToken = async (token: string) => {
  const refresh_token = await axios.get(
    `${
      process.env.INSTAGRAM_BASE_URL as string
    }/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  );
  return refresh_token.data;
};

export const generateInstagramToken = async (code: string) => {
  const shortToken = await getInstagramShortLivedToken(code);
  const longTokenData = await getInstagramLongLivedToken(shortToken);

  return longTokenData;
};

const getInstagramShortLivedToken = async (code: string) => {
  const formData = new URLSearchParams();
  formData.append("client_id", process.env.INSTAGRAM_CLIENT_ID!);
  formData.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET!);
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", process.env.INSTAGRAM_REDIRECT_URI);
  formData.append("code", code);

  if (process.env.NODE_ENV === "development")
    // This is needed to bypass SSL verification in development
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const res = await fetch(process.env.INSTAGRAM_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to get short token: ${data.error_message}`);
  }

  const REQUIRED_PERMISSIONS = [
    "instagram_business_basic",
    "instagram_business_manage_messages",
  ] as const;

  const hasPermissions = REQUIRED_PERMISSIONS.every((p) =>
    data.permissions.includes(p)
  );

  if (!hasPermissions) {
    throw new Error(
      `Missing instagram permissions, [instagram_business_basic, instagram_business_manage_messages] are required permissions: ${
        (data as InstagramShortToken).permissions
      }`
    );
  }

  return data.access_token;
};

const getInstagramLongLivedToken = async (shortToken: string) => {
  const res = await fetch(
    `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortToken}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to get long token: ${data.error.message}`);
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
};

export const getInstagramId = async (access_token: string) => {
  const insta_id = await axios.get(
    `${
      process.env.INSTAGRAM_BASE_URL as string
    }/me?fields=user_id&access_token=${access_token}`
  );
  if (insta_id) {
    return insta_id.data;
  }
  return null;
};

// Facebook integration functions
export const refreshFacebookToken = async (token: string) => {
  // Facebook does not support token refresh like Instagram.
  // Instead, to refresh token user need to re-authenticate.
};

export const generateFacebookToken = async (code: string) => {
  const shortToken = await getFacebookShortLivedToken(code);
  const longTokenData = await getFacebookLongLivedToken(shortToken);

  return longTokenData;
};

const getFacebookShortLivedToken = async (code: string) => {
  const formData = new URLSearchParams();
  formData.append("client_id", process.env.FACEBOOK_CLIENT_ID!);
  formData.append("client_secret", process.env.FACEBOOK_CLIENT_SECRET!);
  formData.append("redirect_uri", process.env.FACEBOOK_REDIRECT_URI!);
  formData.append("code", code);

  if (process.env.NODE_ENV === "development")
    // This is needed to bypass SSL verification in development
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const response = await fetch(process.env.FACEBOOK_TOKEN_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  const data = await response.json();

  await checkPermissions(data.access_token);

  return data.access_token;
};

const checkPermissions = async (accessToken: string) => {
  const res = await fetch(
    `${process.env
      .FACEBOOK_BASE_URL!}/v23.0/me/permissions?access_token=${accessToken}`
  );
  const data = await res.json();

  const REQUIRED_PERMISSIONS = [
    "pages_show_list",
    "ads_management",
    "instagram_basic",
    "instagram_manage_comments",
    "instagram_content_publish",
    "instagram_manage_messages",
  ];

  const grantedPermissions = data.data
    .filter((p: any) => p.status === "granted")
    .map((p: any) => p.permission);

  const hasAll = REQUIRED_PERMISSIONS.every((p) =>
    grantedPermissions.includes(p)
  );

  if (!grantedPermissions.length || !hasAll) {
    throw new Error(
      `No permissions granted. Required permissions: ${REQUIRED_PERMISSIONS.join(
        ", "
      )}`
    );
  }
};

const getFacebookLongLivedToken = async (shortToken: string) => {
  const res = await fetch(
    process.env.FACEBOOK_TOKEN_URL! +
      `?grant_type=fb_exchange_token` +
      `&client_id=${process.env.FACEBOOK_CLIENT_ID}` +
      `&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}` +
      `&fb_exchange_token=${shortToken}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `Failed to get long token: ${data.error?.message || "Unknown error"}`
    );
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
};

export const getFacebookId = async (access_token: string) => {
  try {
    const response = await axios.get(
      `${process.env.FACEBOOK_BASE_URL}/v23.0/me`,
      {
        params: {
          fields: "id",
          access_token,
        },
      }
    );

    return response.data; // { id: '...' }
  } catch (error: any) {
    console.error(
      "Error getting Facebook ID:",
      error?.response?.data || error.message
    );
    return null;
  }
};
