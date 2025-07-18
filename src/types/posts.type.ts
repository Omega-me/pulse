export interface InstagrPostProps {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
  caption?: string;
  extraInfo: {
    isUsed: boolean;
    automationId?: string;
    postUrl?: string;
    matchedKeywords?: string[];
  };
}
