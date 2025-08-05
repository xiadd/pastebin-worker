import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import FileShare from "../components/file-share";
import TextShare from "../components/text-share";

export default memo(function CreatePaste() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="text">{t("textShare")}</TabsTrigger>
                <TabsTrigger value="file">{t("fileShare")}</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-0">
                <TextShare />
              </TabsContent>
              <TabsContent value="file" className="mt-0">
                <FileShare />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
});
