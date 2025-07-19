import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import FileShare from "../components/file-share";
import TextShare from "../components/text-share";

export default memo(function CreatePaste() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-10">
      {/* SEO Content Section */}
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Free Online Pastebin - Share Code & Text Instantly
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
          PasteShare is a powerful, free pastebin service that allows you to
          share code snippets, text documents, and files online with ease.
          Perfect for developers, students, and teams who need to quickly share
          and collaborate on code or text content.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Syntax highlighting for 10+ languages
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Password protection & expiration
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            File uploads up to 25MB
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Create Your Paste
        </h2>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">{t("textShare")}</TabsTrigger>
            <TabsTrigger value="file">{t("fileShare")}</TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <TextShare />
          </TabsContent>
          <TabsContent value="file">
            <FileShare />
          </TabsContent>
        </Tabs>
      </section>

      {/* Features Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Why Choose PasteShare?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <article className="text-center p-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Fast & Secure
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Built on Cloudflare Workers for lightning-fast performance and
              enterprise-grade security.
            </p>
          </article>
          <article className="text-center p-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Developer Friendly
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Syntax highlighting for JavaScript, Python, Go, C++, and many more
              programming languages.
            </p>
          </article>
          <article className="text-center p-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Privacy First
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Optional password protection and automatic expiration ensure your
              sensitive data stays private.
            </p>
          </article>
          <article className="text-center p-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Mobile Ready
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Fully responsive design works perfectly on desktop, tablet, and
              mobile devices.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
});
