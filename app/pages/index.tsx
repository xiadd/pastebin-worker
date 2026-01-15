import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";

import FileShare from "../components/file-share";
import TextShare from "../components/text-share";

export default memo(function CreatePaste() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Intro */}
        <div className="mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            Private sharing, without the noise
          </div>
          <h1 className="text-balance text-4xl font-semibold text-slate-900 dark:text-white sm:text-5xl">
            Paste once, share anywhere, keep control.
          </h1>
          <p className="text-pretty text-lg text-slate-600 dark:text-slate-300">
            A calm workspace for text and files. Create a link in seconds, add
            optional protection, and move on with your day.
          </p>
        </div>

        {/* Main Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              Create a new share
            </span>
            <span>Text or file</span>
          </div>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger
                value="text"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100"
              >
                Share Text
              </TabsTrigger>
              <TabsTrigger
                value="file"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100"
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
        <div className="mt-10 grid gap-4 border-t border-slate-200 pt-8 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 md:grid-cols-3">
          <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-balance text-base font-semibold text-slate-900 dark:text-white">
              Focused by default
            </h3>
            <p className="text-pretty">
              Minimal chrome keeps the paste area front and center.
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-balance text-base font-semibold text-slate-900 dark:text-white">
              Share without friction
            </h3>
            <p className="text-pretty">
              Links are ready the moment you submit, with no extra steps.
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-balance text-base font-semibold text-slate-900 dark:text-white">
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
