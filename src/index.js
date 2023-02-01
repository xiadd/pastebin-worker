import { nanoid } from "nanoid";

addEventListener("fetch", (event) => {
  event.respondWith(new Response(`Hello Miniflare ${nanoid()}! ${KEY}`));
});
