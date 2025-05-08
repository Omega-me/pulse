import axios from 'axios';

export const refreshToken = async (token: string) => {
  const refresh_token = await axios.get(
    `${process.env.INSTAGRAM_BASE_URL as string}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  );
  return refresh_token.data;
};

export const sendDM = async (userId: string, recieverId: string, prompt: string, token: string) => {
  if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  console.log('Sending DM to user');
  try {
    const response = await axios.post(
      `${process.env.INSTAGRAM_BASE_URL as string}/v22.0/${userId}/messages`,
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
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Failed to send DM:', error.response?.data || error.message);
    throw error;
  }
};

export const sendPrivateDM = async (userId: string, recieverId: string, prompt: string, token: string) => {
  if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  console.log('Sending private DM to user');
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
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Failed to send DM:', error.response?.data || error.message);
    throw error;
  }
};

export const generateToken = async (code: string) => {
  const shortToken = await getShortLivedToken(code);
  const longTokenData = await getLongLivedToken(shortToken);

  return longTokenData;
};

const getShortLivedToken = async (code: string) => {
  const formData = new URLSearchParams();
  formData.append('client_id', process.env.INSTAGRAM_CLIENT_ID!);
  formData.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET!);
  formData.append('grant_type', 'authorization_code');
  formData.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URI);
  formData.append('code', code);

  const res = await fetch(process.env.INSTAGRAM_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to get short token: ${data.error_message}`);
  }

  // TODO: check user permission to know if he has the correct permissions on his instagram account

  return data.access_token;
};

const getLongLivedToken = async (shortToken: string) => {
  const res = await fetch(
    `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortToken}`
  );

  const data = await res.json();

  if (!res.ok) {
    console.log(data.error.message);
    throw new Error(`Failed to get long token: ${data.error.message}`);
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
};

export const getInstagramId = async (access_token: string) => {
  const insta_id = await axios.get(`${process.env.INSTAGRAM_BASE_URL as string}/me?fields=user_id&access_token=${access_token}`);
  if (insta_id) {
    return insta_id.data;
  }
  return null;
};
