import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sample photos come from Lorem Picsum by ID. The custom loader turns
  // "/photo/<id>/<ratio>" into a sized picsum URL. Swap the loader when
  // real creator photos (from Instagram at verification) are stored.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/picsum-loader.ts",
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 96, 128, 192, 256, 384],
  },
};

export default nextConfig;
