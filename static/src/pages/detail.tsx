import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useParams } from "wouter";

import Editor from "../components/editor";
import MdRenderer from "../components/md-renderer";
import { getPaste, updatePaste } from "../service";

export default function Detail() {
  const [content, setContent] = useState("");
  const [pasteData, setPasteData] = useState<any>();
  const [language, setLanguage] = useState("text");
  const [isAuth, setIsAuth] = useState(true);
  const [sharePassword, setSharePassword] = useState<string>("");
  const [editPassword, setEditPassword] = useState<string>("");

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
    if (history.state?.edit_password) {
      setEditPassword(history.state.edit_password);
    }
    if (params.get("edit_password")) {
      setEditPassword(params.get("edit_password") || "");
    }
  }, [id]);

  const handleSubmitPassword = async () => {
    location.search = `?share_password=${sharePassword}`;
  };

  const handleUpdatePaste = async () => {
    const data = await updatePaste({
      id,
      content,
      edit_password: editPassword,
    });
    if (data.error) {
      toast.error(data.error);
      return;
    }
    toast.success("Updated");
  };

  if (!isAuth) {
    return (
      <div className="mx-auto max-w-7xl p-4 md:pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold">403</h1>
          <p className="text-gray-500">Input password to view this share</p>
          <div className="inline-flex gap-2 items-center mt-4">
            <Input
              type="password"
              className="input input-sm input-bordered w-full md:max-w-xs"
              value={sharePassword}
              onChange={(e) => setSharePassword(e.target.value)}
              placeholder="Password"
            />
            <Button className="btn btn-sm" onClick={handleSubmitPassword}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (language === "markdown") {
    return <MdRenderer content={content} />;
  }

  return (
    <article className="mx-auto max-w-7xl p-4 md:pt-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Shared{" "}
          {language === "text"
            ? "Text"
            : language.charAt(0).toUpperCase() + language.slice(1)}{" "}
          Snippet
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Created on{" "}
          {new Date(pasteData?.create_time || Date.now()).toLocaleDateString()}{" "}
          • Language: {language} •
          {pasteData?.share_password ? "Password Protected" : "Public"}
        </p>
      </header>
      <div className="mb-4 flex gap-4 flex-col md:flex-row">
        <CopyToClipboard
          text={`${window.location.origin}/detail/${id}`}
          onCopy={() => toast.success("Copied")}
        >
          <Button variant="secondary">
            {pasteData?.share_password && (
              <svg
                className="h-4 w-4 text-green-600"
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

        {editPassword && (
          <CopyToClipboard
            text={`${window.location.origin}/detail/${id}?edit_password=${editPassword}`}
            onCopy={() => toast.success("Copied")}
          >
            <Button variant="secondary">Admin URL</Button>
          </CopyToClipboard>
        )}
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
              className="h-4 w-4 text-green-600"
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

        {editPassword && <Button onClick={handleUpdatePaste}>Update</Button>}
      </div>
      <Editor
        height="calc(100vh - 200px)"
        language={language}
        value={content}
        readonly={!editPassword}
        onChange={(value) => setContent(value || "")}
      />
    </article>
  );
}
