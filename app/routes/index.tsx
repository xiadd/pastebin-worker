import { createFileRoute } from "@tanstack/react-router";

import CreatePaste from "@/pages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PasteShare — Share temporary text and files" },
      {
        name: "description",
        content:
          "PasteShare lets you share temporary text and files in seconds with optional passwords and expirations.",
      },
      { property: "og:title", content: "PasteShare — Temporary text & files" },
      {
        property: "og:description",
        content:
          "Share temporary text and files fast, with optional passwords and expirations.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://as.al/" },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "PasteShare — Temporary text & files",
      },
      {
        name: "twitter:description",
        content:
          "Share temporary text and files fast, with optional passwords and expirations.",
      },
    ],
    links: [{ rel: "canonical", href: "https://as.al/" }],
  }),
  component: CreatePaste,
});
