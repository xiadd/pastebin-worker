/// <reference types="@cloudflare/workers-types" />

// Type definitions for Cloudflare Workers bindings in Nitro
declare module 'nitro' {
  interface Env {
    // D1 Database binding
    DB: D1Database;
    // R2 Bucket binding
    BUCKET: R2Bucket;
    // Environment variables
    BASE_URL: string;
    ENVIRONMENT: string;
  }
}

declare module 'h3' {
  interface H3EventContext {
    cloudflare: {
      env: {
        DB: D1Database;
        BUCKET: R2Bucket;
        BASE_URL: string;
        ENVIRONMENT: string;
      };
      context: ExecutionContext;
      cf?: IncomingRequestCfProperties;
    };
  }
}

export {};
