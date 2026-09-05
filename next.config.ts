import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN testing (phone / other devices on same Wi‑Fi)
  allowedDevOrigins: ["192.168.0.10", "127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
