import { UTApi } from 'uploadthing/server';

export const uploadInstagramImages = async (urls: string[]) => {
  const utapi = new UTApi();

  const files = await Promise.all(
    urls.map(async (url, i) => {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch image from Instagram: ${url}`);
      }

      const arrayBuffer = await res.arrayBuffer();

      return new File([arrayBuffer], `insta_${Date.now()}_${i}.jpg`, {
        type: 'image/jpeg',
      });
    })
  );

  const result = await utapi.uploadFiles(files);

  return result.map((r) => {
    if (!r.data) throw new Error(`Upload failed for one of the files.`);
    return r.data.ufsUrl;
  });
};

export const deleteUploadedFiles = async (fileUrls: string[]) => {
  const utapi = new UTApi();
  const fileKeys = fileUrls.map((fileKey) => extractFileKey(fileKey));
  await utapi.deleteFiles(fileKeys);
};

const extractFileKey = (url: string) => {
  const match = url.match(/\/f\/([^/]+)$/);
  return match ? match[1] : null;
};
