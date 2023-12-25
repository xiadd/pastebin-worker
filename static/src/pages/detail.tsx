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

  const { id } = useParams();

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    if (!id) return;
    getPaste(id, params.get("password")).then((data: any) => {
      if (data.error) {
        toast.error(data.error);
        return;
      }
      setPasteData(data);
      setContent(data.content);
      setLanguage(data.language);
    });
  }, [id]);

  if (language === "markdown") {
    return <MdRenderer content={content} />;
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:pt-10">
      <div className="mb-4 flex gap-4">
        <CopyToClipboard
          text={`${window.location.origin}/detail/${id}${
            pasteData?.share_password
              ? `?password=${pasteData?.share_password}`
              : ""
          }`}
          onCopy={() => toast.success("Copied")}
        >
          <button className="btn">
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
            Copy URL
          </button>
        </CopyToClipboard>
        <button
          className="btn"
          onClick={() =>
            window.open(
              `${window.location.origin}/raw/${id}${
                pasteData?.share_password
                  ? `?password=${pasteData?.share_password}`
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
        </button>
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
