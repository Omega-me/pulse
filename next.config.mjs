/** @type {import('next').NextConfig} */

const origin = process.env.NEXT_PUBLIC_BASE_URL;
const nextConfig = {
  allowedDevOrigins: [origin],
};

export default nextConfig;
