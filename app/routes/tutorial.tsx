import { createFileRoute } from "@tanstack/react-router";

import Tutorial from "@/pages/tutorial";

export const Route = createFileRoute("/tutorial")({
  head: () => ({
    meta: [
      { title: "Tutorial & API Guide — PasteShare" },
      {
        name: "description",
        content:
          "Learn how to share temporary text and files with PasteShare, including API usage and parameters.",
      },
      { property: "og:title", content: "Tutorial & API Guide — PasteShare" },
      {
        property: "og:description",
        content:
          "Learn how to share temporary text and files with PasteShare, including API usage and parameters.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://as.al/tutorial" },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "Tutorial & API Guide — PasteShare",
      },
      {
        name: "twitter:description",
        content:
          "Learn how to share temporary text and files with PasteShare, including API usage and parameters.",
      },
    ],
    links: [{ rel: "canonical", href: "https://as.al/tutorial" }],
  }),
  component: Tutorial,
});
