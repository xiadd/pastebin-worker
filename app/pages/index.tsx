import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";

import FileShare from "../components/file-share";
import TextShare from "../components/text-share";

export default memo(function CreatePaste() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Intro */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-400">
            Private sharing, without the noise
          </div>
          <h1 className="text-balance text-3xl font-semibold text-gray-900 dark:text-gray-50 sm:text-4xl md:text-5xl">
            Paste once, share anywhere, keep control.
          </h1>
          <p className="text-pretty text-base sm:text-lg text-gray-600 dark:text-gray-400">
            A calm workspace for text and files. Create a link in seconds, add
            optional protection, and move on with your day.
          </p>
        </div>

        {/* Main Content */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-500">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Create a new share
            </span>
            <span>Text or file</span>
          </div>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger
                value="text"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Share Text
              </TabsTrigger>
              <TabsTrigger
                value="file"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Share File
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-6">
              <TextShare />
            </TabsContent>
            <TabsContent value="file" className="mt-6">
              <FileShare />
            </TabsContent>
          </Tabs>
        </div>

        {/* Secondary Section */}
        <div className="mt-10 grid gap-4 border-t border-gray-200 pt-8 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400 md:grid-cols-3">
          <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-balance text-base font-semibold text-gray-900 dark:text-gray-50">
              Focused by default
            </h3>
            <p className="text-pretty">
              Minimal chrome keeps the paste area front and center.
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-balance text-base font-semibold text-gray-900 dark:text-gray-50">
              Share without friction
            </h3>
            <p className="text-pretty">
              Links are ready the moment you submit, with no extra steps.
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-balance text-base font-semibold text-gray-900 dark:text-gray-50">
              Made for teams
            </h3>
            <p className="text-pretty">
              Share drafts, logs, and quick notes without account noise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
