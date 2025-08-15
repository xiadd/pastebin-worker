import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "wouter";

import CopyButton from "../components/copy-button";
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
  const [viewMode, setViewMode] = useState<"preview" | "source">("preview");

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Password Required
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This content is password protected. Please enter the password to
              view.
            </p>
            <div className="space-y-4">
              <Input
                type="password"
                value={sharePassword}
                onChange={(e) => setSharePassword(e.target.value)}
                placeholder="Enter password"
                className="w-full"
              />
              <Button onClick={handleSubmitPassword} className="w-full">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (language === "markdown") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4 py-12 space-y-6">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Markdown Document
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {new Date(
                    pasteData?.create_time || Date.now(),
                  ).toLocaleDateString()}{" "}
                  • markdown •
                  {pasteData?.share_password
                    ? " Password Protected"
                    : " Public"}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <CopyButton text={`${window.location.origin}/detail/${id}`}>
                  Copy URL {pasteData?.share_password && "(without password)"}
                </CopyButton>

                {editPassword && (
                  <CopyButton
                    text={`${window.location.origin}/detail/${id}?edit_password=${editPassword}`}
                  >
                    Admin URL
                  </CopyButton>
                )}

                <Button
                  variant="outline"
                  size="sm"
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
                  View raw Text
                </Button>

                <CopyButton text={content}>Copy raw text</CopyButton>

                {editPassword && (
                  <Button
                    size="sm"
                    onClick={handleUpdatePaste}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Update
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* View Mode Toggle Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Markdown Content
              </h3>
              <div className="flex bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === "preview"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode("source")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === "source"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <Code className="h-4 w-4" />
                  Source
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4">
              {viewMode === "preview" ? (
                <MdRenderer content={content} />
              ) : (
                <div className="-m-4">
                  <Editor
                    height="calc(100vh - 420px)"
                    language="markdown"
                    value={content}
                    readonly={!editPassword}
                    onChange={(value) => setContent(value || "")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl px-4 py-12 space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {language === "text"
                  ? "Text"
                  : language.charAt(0).toUpperCase() + language.slice(1)}{" "}
                Snippet
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {new Date(
                  pasteData?.create_time || Date.now(),
                ).toLocaleDateString()}{" "}
                • {language} •
                {pasteData?.share_password ? " Password Protected" : " Public"}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <CopyButton text={`${window.location.origin}/detail/${id}`}>
                Copy URL {pasteData?.share_password && "(without password)"}
              </CopyButton>

              {editPassword && (
                <CopyButton
                  text={`${window.location.origin}/detail/${id}?edit_password=${editPassword}`}
                >
                  Admin URL
                </CopyButton>
              )}
              <Button
                variant="outline"
                size="sm"
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
                View raw Text
              </Button>

              <CopyButton text={content}>Copy raw text</CopyButton>

              {editPassword && (
                <Button
                  size="sm"
                  onClick={handleUpdatePaste}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Update
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <Editor
            height="calc(100vh - 380px)"
            language={language}
            value={content}
            readonly={!editPassword}
            onChange={(value) => setContent(value || "")}
          />
        </div>
      </div>
    </div>
  );
}
