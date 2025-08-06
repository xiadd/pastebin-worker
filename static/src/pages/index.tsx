import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import FileShare from "../components/file-share";
import TextShare from "../components/text-share";

export default memo(function CreatePaste() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create & Share
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share your code snippets and files instantly with the world. Simple,
            fast, and secure.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100/80 dark:bg-gray-700/50 backdrop-blur-sm">
              <TabsTrigger
                value="text"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                {t("textShare")}
              </TabsTrigger>
              <TabsTrigger
                value="file"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                {t("fileShare")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-0">
              <TextShare />
            </TabsContent>
            <TabsContent value="file" className="mt-0">
              <FileShare />
            </TabsContent>
          </Tabs>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Share your content in seconds with our optimized platform
            </p>
          </div>

          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Optional password protection and automatic expiration
            </p>
          </div>

          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Syntax Highlighting
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Support for 10+ programming languages with beautiful highlighting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
