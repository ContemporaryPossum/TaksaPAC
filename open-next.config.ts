import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every page is prerendered at build time, so the cache is served straight
// from Workers static assets. No R2 bucket or KV namespace is needed.
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});

// `npm run build` runs this OpenNext build, so OpenNext must call Next.js
// directly instead of `npm run build` (which would loop).
config.buildCommand = "npx next build";

export default config;
