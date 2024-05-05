import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import FileShare from "../components/file-share";
import TextShare from "../components/text-share";

export default memo(function CreatePaste() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto flex max-w-7xl flex-col gap-3 p-4 md:p-10">
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
    </div>
  );
});
