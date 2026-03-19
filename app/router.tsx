import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    stringifySearch: (search) => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(search)) {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      }
      const str = params.toString();
      return str ? `?${str}` : "";
    },
    parseSearch: (searchStr) => {
      const params = new URLSearchParams(searchStr);
      const result: Record<string, string> = {};
      for (const [key, value] of params.entries()) {
        result[key] = value;
      }
      return result;
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
