import cn from "classnames";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

import FileShare from "../components/file-share";
import TextShare from "../components/text-share";

export default memo(function CreatePaste() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");

  const handleToggleTab = (tab: "text" | "file") => {
    setActiveTab(tab);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-3 p-4 md:p-10">
      <div role="tablist" className="tabs-boxed tabs">
        <a
          role="tab"
          className={cn("tab", {
            "tab-active": activeTab === "text",
          })}
          onClick={() => handleToggleTab("text")}
        >
          {t("textShare")}
        </a>
        <a
          role="tab"
          className={cn("tab", {
            "tab-active": activeTab === "file",
          })}
          onClick={() => handleToggleTab("file")}
        >
          {t("fileShare")}
        </a>
      </div>
      {activeTab === "text" && <TextShare />}
      {activeTab === "file" && <FileShare />}
    </div>
  );
});
