import { nanoid } from "nanoid";

export default {
  async fetch(request, env, ctx) {
    await env.pastes.put('hello', 'hello')
    return new Response(`Hello Miniflare ${nanoid()}, ${env.KEY}`)
  }
}

