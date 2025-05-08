'use server';

import { redirect } from 'next/navigation';
import { onCurrentUser } from '../user';
import { createIntegration, getIntegration } from './query';
import { generateToken, getInstagramId } from '@/lib/fetch';

export const onOAuthInstagram = async (startegy: 'INSTAGRAM' | 'CRM') => {
  if (startegy === 'INSTAGRAM') {
    return redirect(process.env.INSTAGRAM_EMBED_OAUTH_URL as string);
  }
};

export const onIntegrate = async (code: string) => {
  const user = await onCurrentUser();
  try {
    const integration = await getIntegration(user.id);

    if (integration && integration.integrations.length === 0) {
      const token = await generateToken(code);

      if (token) {
        const insta_id = await getInstagramId(token.accessToken);
        if (insta_id) {
          const today = new Date();
          const expire_date = today.setDate(today.getDate() + 60);
          const create = await createIntegration(user.id, token.accessToken, new Date(expire_date), insta_id.user_id);
          return { status: 200, data: create };
        }
        console.log(401);
        return { status: 401 };
      }
      console.log(401);
      return { status: 401 };
    }
    console.log(404);
    return { status: 404 };
  } catch (error) {
    console.log(500, error);
    return { status: 500 };
  }
};
