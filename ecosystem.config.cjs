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
      user: process.env.DEPLOY_USER,
      host: [process.env.DEPLOY_HOST],
      ref: "origin/main",
      repo: "https://github.com/LouanBen/emoji-mashup-bsky.git",
      path: "/var/bots/emoji-mashup-bsky",
      "post-deploy":
        "npm install && npm run build && pm2 startOrRestart ecosystem.config.cjs --env production",
      key: process.env.DEPLOY_SSH_KEY_PATH,
    },
  },
};
