import { nanoid } from "nanoid";
import { Router } from 'itty-router'

const router = Router()

router.get('/', () => new Response(JSON.stringify({ id: nanoid(5) }), {
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  }
}))

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
    return router.handle(request)
  }
}

