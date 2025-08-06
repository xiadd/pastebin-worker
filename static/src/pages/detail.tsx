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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              403
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Input password to view this share
            </p>
            <div className="space-y-4">
              <Input
                type="password"
                value={sharePassword}
                onChange={(e) => setSharePassword(e.target.value)}
                placeholder="Password"
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
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4 py-12 space-y-6">
          {/* Header Section */}
          <div className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Markdown Document
              </h1>
              <p className="text-muted-foreground text-lg">
                {new Date(
                  pasteData?.create_time || Date.now(),
                ).toLocaleDateString()}{" "}
                • markdown •
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
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Update
                </Button>
              )}
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl px-4 py-12 space-y-6">
        {/* Header Section */}
        <div className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {language === "text"
                ? "Text"
                : language.charAt(0).toUpperCase() + language.slice(1)}{" "}
              Snippet
            </h1>
            <p className="text-muted-foreground text-lg">
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Update
              </Button>
            )}
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
