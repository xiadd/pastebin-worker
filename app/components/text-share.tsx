import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import qs from "qs";
import { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

import { createPaste } from "../service";
import nanoid from "../utils/nanoid";
import { ShareStorage } from "../utils/share-storage";
import Editor from "./editor";

export default function TextShare() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState("text");
  const [sharePassword, setSharePassword] = useState<string>("");
  const [content, setContent] = useState("");
  const [expiration, setExpiration] = useState<number | undefined>(undefined);
  const [isPrivate, setIsPrivate] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const createPB = async () => {
    if (!content) return toast.error(t("pleaseEnterContent"));
    setPublishing(true);
    try {
      const data = await createPaste({
        content,
        expire: expiration,
        isPrivate,
        language,
        share_password: sharePassword,
      });

      // 保存到本地存储
      const title =
        content.split("\n")[0].slice(0, 50) || `${language} ${t("share")}`;
      ShareStorage.save({
        title,
        content,
        type: "text",
        language,
      });

      setPublishing(false);
      navigate(
        `/detail/${data.id}${qs.stringify(
          sharePassword ? { share_password: sharePassword } : {},
          { addQueryPrefix: true },
        )}`,
        {
          state: { edit_password: data.edit_password },
        },
      );
    } catch (error) {
      setPublishing(false);
      toast.error(t("createFailed"));
    }
  };

  const handleSetAsPrivate = (checked: boolean) => {
    setIsPrivate(checked);
    setSharePassword(checked ? nanoid(10) : "");
  };

  const handleChangeSharePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setSharePassword(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Editor Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-0 overflow-hidden">
        <Editor
          className="rounded-lg border-0"
          height="400px"
          language={language}
          onChange={(value) => setContent(value || "")}
          value={content}
          showFullscreenButton={true}
        />
      </div>

      {/* Settings Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 h-5">
              <Checkbox
                checked={isPrivate}
                onCheckedChange={handleSetAsPrivate}
              />
              <label className="text-sm font-medium text-foreground">
                {t("privateTip")}
              </label>
            </div>
            <Input
              value={sharePassword}
              placeholder="Share Password"
              onChange={handleChangeSharePassword}
              disabled={!isPrivate}
              className="bg-white/80 dark:bg-gray-900/80"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground h-5 flex items-center">
              {t("expiration")}
            </label>
            <Select
              value={expiration?.toString()}
              onValueChange={(value) => setExpiration(Number(value))}
            >
              <SelectTrigger className="bg-white/80 dark:bg-gray-900/80">
                <SelectValue placeholder={t("expiration")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">1 min</SelectItem>
                <SelectItem value="300">5 mins</SelectItem>
                <SelectItem value="3600">1 hour</SelectItem>
                <SelectItem value="86400">1 day</SelectItem>
                <SelectItem value="604800">1 week</SelectItem>
                <SelectItem value="2592000">1 month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground h-5 flex items-center">
              Language
            </label>
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value)}
            >
              <SelectTrigger className="bg-white/80 dark:bg-gray-900/80">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Plaintext</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
                <SelectItem value="c">C/CPP</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="golang">Golang</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="shell">Shell</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={createPB}
            disabled={publishing || !content}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            {publishing ? "Creating..." : "Create Paste"}
          </Button>
        </div>
      </div>
    </div>
  );
}
