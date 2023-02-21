import { nanoid } from "nanoid";
import { Router } from 'itty-router'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

const router = Router()

router.get('/', async (request, env, ctx) => {
  try {
    // Add logic to decide whether to serve an asset or run your original Worker code
    return await getAssetFromKV(
      {
        request,
        waitUntil: ctx.waitUntil.bind(ctx),
      },
      {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: assetManifest,
      }
    );
  } catch (e) {
    let pathname = new URL(request.url).pathname;
    return new Response(`"${pathname}" ${e.message}`, {
      status: 404,
      statusText: 'not found',
    });
  }
})

router.get('/ws', (request) => {
  const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();
    server.addEventListener("message", (event) => {
      server.send('hello world')
      console.log(event.data);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
})

router.all('*', () => new Response('Not Found.', { status: 404 }))

export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx)
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(() => {
      console.log(111)
    });
  },
}

