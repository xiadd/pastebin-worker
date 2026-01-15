/// <reference types="vite/client" />
import {
  HeadContent,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import AppLayout from "@/App";
import { ThemeProvider } from "@/context/theme";
import appCss from "@/index.css?url";
import editorCss from "@/App.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: editorCss },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return <RootDocument />;
}

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="light" storageKey="pb-ui-theme">
          <AppLayout />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
