// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "emoji-mashup-bsky",
      script: "./dist/index.js",
      env_production: {
        NODE_ENV: "production",
        BSKY_PASSWORD: process.env.BSKY_PASSWORD,
        BSKY_HANDLE: process.env.BSKY_HANDLE,
      },
      env_development: {
        NODE_ENV: "development",
        BSKY_PASSWORD: process.env.BSKY_PASSWORD,
        BSKY_HANDLE: process.env.BSKY_HANDLE,
      },
    },
  ],
  deploy: {
    production: {
      user: "root",
      host: ["185.216.27.60"],
      ref: "origin/main",
      repo: "https://github.com/LouanBen/emoji-mashup-bsky.git",
      path: "/var/bots/emoji-mashup-bsky",
      "post-deploy": "npm install && npm run build",
      key: "/home/louan/priv-key",
    },
    // && pm2 startOrRestart
  },
};
