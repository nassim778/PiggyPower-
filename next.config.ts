import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Firebase Admin out of the Turbopack bundle (fixes missing @opentelemetry/api)
  serverExternalPackages: [
    "firebase-admin",
    "@google-cloud/firestore",
    "@google-cloud/storage",
    "@opentelemetry/api",
  ],
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
