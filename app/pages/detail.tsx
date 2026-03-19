import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams, useRouterState, useSearch } from "@tanstack/react-router";
import { Code, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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
  const [origin, setOrigin] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams({ from: "/detail/$id" });
  const searchParams = useSearch({ from: "/detail/$id" });
  const locationState = useRouterState({
    select: (state) =>
      state.location.state as { edit_password?: string } | undefined,
  });

  useEffect(() => {
    if (!id || typeof window === "undefined") return;
    const urlSharePassword = searchParams.share_password;
    setIsLoading(true);
    getPaste(id, urlSharePassword).then((data: any) => {
      if (data.error) {
        if (data.code === 403) {
          if (!urlSharePassword) {
            setIsAuth(false);
          } else {
            toast.error("Password incorrect or content not found");
          }
          setIsLoading(false);
          return;
        }
        toast.error(data.error);
        setIsLoading(false);
        return;
      }
      setPasteData(data);
      setContent(data.content);
      setLanguage(data.language);
      setIsLoading(false);
    });
    if (locationState?.edit_password) {
      setEditPassword(locationState.edit_password);
    }
    if (searchParams.edit_password) {
      setEditPassword(searchParams.edit_password);
    }
  }, [id, locationState, searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOrigin(window.location.origin);
  }, []);

  const handleSubmitPassword = async () => {
    if (!id) return;
    navigate({
      to: "/detail/$id",
      params: { id },
      search: { share_password: sharePassword },
      replace: true,
    });
  };

  const handleUpdatePaste = async () => {
    if (!id) return;
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-gray-800 rounded-full mb-6">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              Password Required
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This content is password protected. Please enter the password to
              view.
            </p>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitPassword();
              }}
            >
              <Input
                type="password"
                value={sharePassword}
                onChange={(e) => setSharePassword(e.target.value)}
                placeholder="Enter password"
                className="w-full"
                autoFocus
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (language === "markdown") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          {/* Compact Header */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-3 sm:mb-0">
                <div className="w-8 h-8 shrink-0 bg-blue-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50 truncate">
                    Markdown Document
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {new Date(
                        pasteData?.create_time || Date.now(),
                      ).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>
                      {pasteData?.share_password
                        ? "🔒 Protected"
                        : "🌐 Public"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
                <CopyButton
                  text={`${origin}/detail/${id}`}
                  size="sm"
                  variant="outline"
                >
                  <span className="sm:hidden">URL</span>
                  <span className="hidden sm:inline">
                    Copy URL{" "}
                    {pasteData?.share_password && "(without password)"}
                  </span>
                </CopyButton>
                {editPassword && (
                  <CopyButton
                    text={`${origin}/detail/${id}?edit_password=${editPassword}`}
                    size="sm"
                    variant="outline"
                  >
                    <span className="sm:hidden">Admin</span>
                    <span className="hidden sm:inline">Admin URL</span>
                  </CopyButton>
                )}
                <CopyButton text={content} size="sm" variant="outline">
                  <span className="sm:hidden">Copy</span>
                  <span className="hidden sm:inline">Copy raw text</span>
                </CopyButton>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() =>
                    window.open(
                      `${origin}/raw/${id}${
                        pasteData?.share_password
                          ? `?share_password=${pasteData?.share_password}`
                          : ""
                      }`,
                    )
                  }
                >
                  <span className="sm:hidden">Raw</span>
                  <span className="hidden sm:inline">View Raw</span>
                </Button>
                {editPassword && (
                  <Button
                    size="sm"
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleUpdatePaste}
                  >
                    Update
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Compact View Mode Toggle */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Content
              </span>
              <div className="flex bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`px-2 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${
                    viewMode === "preview"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode("source")}
                  className={`px-2 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${
                    viewMode === "source"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Code className="h-3 w-3" />
                  Source
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className={viewMode === "preview" ? "p-4" : ""}>
              {viewMode === "preview" ? (
                <MdRenderer content={content} />
              ) : (
                <Editor
                  height="calc(100vh - 200px)"
                  language="markdown"
                  value={content}
                  readonly={!editPassword}
                  onChange={(value) => setContent(value || "")}
                  showFullscreenButton={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {/* Compact Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <div className="w-8 h-8 shrink-0 bg-blue-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50 truncate">
                  {language === "text"
                    ? "Text"
                    : language.charAt(0).toUpperCase() +
                      language.slice(1)}{" "}
                  Snippet
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {new Date(
                      pasteData?.create_time || Date.now(),
                    ).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    {language}
                  </span>
                  <span>•</span>
                  <span>
                    {pasteData?.share_password ? "🔒 Protected" : "🌐 Public"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
              <CopyButton
                text={`${origin}/detail/${id}`}
                size="sm"
                variant="outline"
              >
                <span className="sm:hidden">URL</span>
                <span className="hidden sm:inline">
                  Copy URL {pasteData?.share_password && "(without password)"}
                </span>
              </CopyButton>
              {editPassword && (
                <CopyButton
                  text={`${origin}/detail/${id}?edit_password=${editPassword}`}
                  size="sm"
                  variant="outline"
                >
                  <span className="sm:hidden">Admin</span>
                  <span className="hidden sm:inline">Admin URL</span>
                </CopyButton>
              )}
              <CopyButton text={content} size="sm" variant="outline">
                <span className="sm:hidden">Copy</span>
                <span className="hidden sm:inline">Copy raw text</span>
              </CopyButton>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() =>
                  window.open(
                    `${origin}/raw/${id}${
                      pasteData?.share_password
                        ? `?share_password=${pasteData?.share_password}`
                        : ""
                    }`,
                  )
                }
              >
                <span className="sm:hidden">Raw</span>
                <span className="hidden sm:inline">View Raw</span>
              </Button>
              {editPassword && (
                <Button
                  size="sm"
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleUpdatePaste}
                >
                  Update
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <Editor
            height="calc(100vh - 200px)"
            language={language}
            value={content}
            readonly={!editPassword}
            onChange={(value) => setContent(value || "")}
            showFullscreenButton={true}
          />
        </div>
      </div>
    </div>
  );
}
