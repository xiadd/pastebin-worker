import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TwoDimensionalCodeOne } from "@icon-park/react";
import QRcode from "qrcode";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useParams } from "wouter";

import Editor from "../components/editor";
import MdRenderer from "../components/md-renderer";
import { getPaste } from "../service";

export default function Detail() {
  const [content, setContent] = useState("");
  const [pasteData, setPasteData] = useState<any>();
  const [language, setLanguage] = useState("text");
  const [isAuth, setIsAuth] = useState(true);
  const [sharePassword, setSharePassword] = useState<string>("");
  const [qrcodeImg, setQrcodeImg] = useState<string>("");

  const { id } = useParams();
  const search = window.location.search;
  const params = new URLSearchParams(search);

  useEffect(() => {
    if (!id) return;
    getPaste(id, params.get("share_password")).then((data: any) => {
      if (data.error) {
        if (data.code === 403) {
          setIsAuth(false);
          return;
        }
        toast.error(data.error);
        return;
      }
      setPasteData(data);
      setContent(data.content);
      setLanguage(data.language);
    });
  }, [id]);

  const handleSubmitPassword = async () => {
    location.search = `?share_password=${sharePassword}`;
  };

  if (!isAuth) {
    return (
      <div className="mx-auto max-w-7xl p-4 md:pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold">403</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Input password to view this share
          </p>
          <div className="inline-flex gap-2 items-center mt-4">
            <input
              type="password"
              className="input input-sm input-bordered w-full md:max-w-xs"
              value={sharePassword}
              onChange={(e) => setSharePassword(e.target.value)}
            />
            <button className="btn btn-sm" onClick={handleSubmitPassword}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (language === "markdown") {
    return <MdRenderer content={content} />;
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:pt-10">
      <div className="mb-4 flex gap-4 flex-col md:flex-row">
        <CopyToClipboard
          text={`${window.location.origin}/detail/${id}`}
          onCopy={() => toast.success("Copied")}
        >
          <Button variant="secondary">
            {pasteData?.share_password && (
              <svg
                className="h-4 w-4 text-green-600 dark:text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 20"
              >
                <path d="M14 7h-1.5V4.5a4.5 4.5 0 1 0-9 0V7H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-5 8a1 1 0 1 1-2 0v-3a1 1 0 1 1 2 0v3Zm1.5-8h-5V4.5a2.5 2.5 0 1 1 5 0V7Z" />
              </svg>
            )}
            Copy URL {pasteData?.share_password && "(without password)"}
          </Button>
        </CopyToClipboard>
        <Button
          variant="secondary"
          onClick={() =>
            window.open(
              `${window.location.origin}/raw/${id}${
                pasteData?.share_password
                  ? `?share_password=${pasteData?.share_password}`
                  : ""
              }`,
            )
          }
        >
          {pasteData?.share_password && (
            <svg
              className="h-4 w-4 text-green-600 dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 20"
            >
              <path d="M14 7h-1.5V4.5a4.5 4.5 0 1 0-9 0V7H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-5 8a1 1 0 1 1-2 0v-3a1 1 0 1 1 2 0v3Zm1.5-8h-5V4.5a2.5 2.5 0 1 1 5 0V7Z" />
            </svg>
          )}
          View raw Text
        </Button>

        <CopyToClipboard text={content} onCopy={() => toast.success("Copied")}>
          <Button variant="secondary">Copy raw text</Button>
        </CopyToClipboard>
      </div>
      <Editor
        height="calc(100vh - 200px)"
        language={language}
        value={content}
        readonly={true}
      />
    </div>
  );
}
