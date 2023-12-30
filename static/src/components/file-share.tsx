import Upload from "rc-upload";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const MAX_SIZE = 25 * 1024 * 1024;

export default function ImageShare() {
  const { t } = useTranslation();
  const [uploadFile, setUploadFile] = useState<string>("");
  const [loadingToast, setLoadingToast] = useState<string>("");

  const props = {
    action: `${import.meta.env.VITE_API_URL}/api/upload`,
    type: "drag",
    accept: "*",

    beforeUpload(file: any) {
      if (file.size > MAX_SIZE) {
        toast.error(t("fileSizeError"));
        return false;
      }
      return true;
    },

    onStart(file: any) {
      const loading = toast.loading(t("uploading"));
      setLoadingToast(loading);
    },
    onSuccess(response: any) {
      setUploadFile(response.url);
      toast.dismiss(loadingToast);
    },
    onError(err: any, response: any) {
      console.log(response);
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
    formData.append("file", file);
    const loadingId = toast.loading(t("uploading"));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      toast.dismiss(loadingId);
      const data = await res.json();
      if (data.error) {
        toast.error(`${t("uploadError")} ${data.error}`);
        return;
      }
      setUploadFile(`${import.meta.env.VITE_API_URL}/file/${data.id}`);
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
    <div className="flex flex-col gap-3">
      <Upload {...props}>
        <div className="w-full">
          <label className="flex h-48 w-full cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-gray-300 bg-white px-4 transition hover:border-gray-400 focus:outline-none">
            <span className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
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
              <span className="font-medium text-gray-600">
                {t("fileShareTip")}
                <span className="ml-2 text-blue-600 underline">
                  {t("viewFiles")}
                </span>
              </span>
            </span>
          </label>
        </div>
      </Upload>

      {uploadFile && (
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{t("uploadSuccess")}</h2>
            <p>{t("uploadSuccessTip")}</p>
            <div className="card-actions justify-end">
              <CopyToClipboard
                text={uploadFile}
                onCopy={() => toast.success(t("copySuccess"))}
              >
                <button className="btn btn-primary">{t("copyLink")}</button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
