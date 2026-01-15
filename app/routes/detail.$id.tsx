import { createFileRoute } from "@tanstack/react-router";

import Detail from "@/pages/detail";

export const Route = createFileRoute("/detail/$id")({
  head: ({ params }) => ({
    meta: [
      { title: "Shared content — PasteShare" },
      {
        name: "description",
        content:
          "View a shared temporary text or file on PasteShare. Links may expire or require a password.",
      },
      { property: "og:title", content: "Shared content — PasteShare" },
      {
        property: "og:description",
        content:
          "View a shared temporary text or file on PasteShare. Links may expire or require a password.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `https://as.al/detail/${params.id}` },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "Shared content — PasteShare",
      },
      {
        name: "twitter:description",
        content:
          "View a shared temporary text or file on PasteShare. Links may expire or require a password.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "canonical", href: `https://as.al/detail/${params.id}` },
    ],
  }),
  component: Detail,
});
