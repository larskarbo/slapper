import "dotenv/config";

export default {
  name: "sample-x",
  slug: "sample-x",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",

  extra: {
    STRIPE_PUB_KEY: process.env.STRIPE_PUB_KEY,
  },
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
};
