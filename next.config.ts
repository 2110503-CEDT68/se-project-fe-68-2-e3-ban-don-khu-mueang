import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/9.x/lorelei/svg",
      },
      {
        protocol: "https",
        hostname: "img.rachatat.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "img.rachatat.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fe-storage.rachatat.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "fe-storage.rachatat.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
        pathname: "/**",
      }
    ],
  },
  experimental: {
    authInterrupts: true,
  }
};

export default nextConfig;