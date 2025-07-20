import { MediaType, PostType } from "@prisma/client";

export interface InstagrPostProps {
  id: string;
  media_type: MediaType;
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
  caption?: string;
  postType: PostType;
  extraInfo: {
    isUsed: boolean;
    automationId?: string;
    postUrl?: string;
    matchedKeywords?: string[];
  };
}
