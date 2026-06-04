import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://backend:8000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: `${apiProxyTarget}/admin/:path*`,
      },
      {
        source: "/static/:path*",
        destination: `${apiProxyTarget}/static/:path*`,
      },
    ];
  },
};

export default nextConfig;
