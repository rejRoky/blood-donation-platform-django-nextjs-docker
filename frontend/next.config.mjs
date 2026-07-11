/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output: the production image ships only the compiled server.
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Profile pictures are served from the same origin via nginx (/media/).
    remotePatterns: [],
  },
};

export default nextConfig;
