import { Input } from "@/components/ui/input";
import Upload from "rc-upload";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { ShareStorage } from "../utils/share-storage";
import CopyButton from "./copy-button";

interface UploadResponse {
  url?: string;
  error?: string;
}

const MAX_SIZE = 25 * 1024 * 1024;

export default function ImageShare() {
  const { t } = useTranslation();
  const [uploadFile, setUploadFile] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [loadingToast, setLoadingToast] = useState<string>("");

  const props = {
    action: `${window.location.origin}/api/upload`,
    type: "drag",
    accept: "*",

    beforeUpload(file: any) {
      if (file.size > MAX_SIZE) {
        toast.error(t("fileSizeError"));
        return false;
      }
      setUploadFile("");
      setFileType(file.type);
      setFileName(file.name);
      setFileSize(file.size);
      return true;
    },

    onStart(_file: any) {
      const loading = toast.loading(t("uploading"));
      setLoadingToast(loading);
    },
    onSuccess(response: any) {
      setUploadFile(response.url);
      toast.dismiss(loadingToast);

      // 保存到本地存储
      ShareStorage.save({
        title: fileName || t("uploadedFile"),
        content: response.url,
        type: "file",
        fileName: fileName,
        fileSize: fileSize,
      });
    },
    onError(_err: any, response: any) {
      toast.error(`${t("uploadError")} ${response.error}`);
      toast.dismiss(loadingToast);
    },
  };

  const handlePasteFile = async (e: any) => {
    const file = e.clipboardData.files[0];
    const formData = new FormData();
    if (!file) {
      return;
    }

    // 检查文件大小
    if (file.size > MAX_SIZE) {
      toast.error(t("fileSizeError"));
      return;
    }

    formData.append("file", file);
    const loadingId = toast.loading(t("uploading"));
    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type);

    try {
      const res = await fetch(`${window.location.origin}/api/upload`, {
        method: "POST",
        body: formData,
      });
      toast.dismiss(loadingId);
      const data = (await res.json()) as UploadResponse;
      if (data.error) {
        toast.error(`${t("uploadError")} ${data.error}`);
        return;
      }
      setUploadFile(data.url || "");

      // 保存到本地存储
      ShareStorage.save({
        title: file.name || t("pastedFile"),
        content: data.url || "",
        type: "file",
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (error) {
      toast.error(`${t("uploadError")} ${error}`);
      toast.dismiss(loadingId);
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePasteFile);
    return () => {
      document.removeEventListener("paste", handlePasteFile);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Expiration Notice */}
        <div className="mb-4 p-3 bg-amber-50/80 dark:bg-amber-900/20 rounded-lg border border-amber-200/50 dark:border-amber-700/30">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-sm text-amber-800 dark:text-amber-200 font-medium">
              {t("fileExpirationNotice")}
            </span>
          </div>
        </div>

        <Upload {...props}>
          <div className="w-full">
            <label className="flex h-48 w-full cursor-pointer appearance-none justify-center rounded-xl border-2 border-dashed border-blue-300/50 dark:border-blue-500/30 px-4 transition hover:border-blue-400/70 dark:hover:border-blue-400/50 focus:outline-none items-center bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100/60 hover:to-indigo-100/60 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30">
              <span className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="font-semibold text-gray-900 dark:text-white text-lg block">
                    {t("fileShareTip")}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    {t("viewFiles")}
                  </span>
                </div>
              </span>
            </label>
          </div>
        </Upload>
      </div>

      {/* Upload Result Section */}
      {uploadFile && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-700/30">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  {t("uploadSuccess")}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {t("fileExpiresIn")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50/80 dark:bg-gray-900/50 rounded-lg">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 block">
                  Direct Link
                </label>
                <div className="flex gap-2">
                  <Input
                    value={uploadFile}
                    disabled
                    className="bg-white/80 dark:bg-gray-800/80"
                  />
                  <CopyButton text={uploadFile} />
                </div>
              </div>

              {fileType.startsWith("image") && (
                <div className="p-4 bg-gray-50/80 dark:bg-gray-900/50 rounded-lg">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 block">
                    Markdown Format
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={`![image](${uploadFile})`}
                      disabled
                      className="bg-white/80 dark:bg-gray-800/80"
                    />
                    <CopyButton text={`![image](${uploadFile})`} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
