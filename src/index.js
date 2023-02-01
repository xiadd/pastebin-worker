import { nanoid } from "nanoid";
import { Router } from 'itty-router'

const router = Router()

router.get('/', () => new Response(JSON.stringify({ id: nanoid(5) }), {
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  }
}))

router.all('*', () => new Response('Not Found.', { status: 404 }))

export default {
  async fetch(request, env, ctx) {
    return router.handle(request)
  }
}

