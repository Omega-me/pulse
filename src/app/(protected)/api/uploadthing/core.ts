import { createUploadthing } from 'uploadthing/next';

const f = createUploadthing();
export const uploadRouter = {};

f({}).middleware(({ req }) => {
  return {};
});
