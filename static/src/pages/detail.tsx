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
    return <MdRenderer content={content} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {language === "text"
                    ? "Text"
                    : language.charAt(0).toUpperCase() + language.slice(1)}{" "}
                  Snippet
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {new Date(
                    pasteData?.create_time || Date.now(),
                  ).toLocaleDateString()}{" "}
                  • {language} •
                  {pasteData?.share_password
                    ? " Password Protected"
                    : " Public"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-6">
              <CopyToClipboard
                text={`${window.location.origin}/detail/${id}`}
                onCopy={() => toast.success("Copied")}
              >
                <Button variant="outline" size="sm">
                  Copy URL {pasteData?.share_password && "(without password)"}
                </Button>
              </CopyToClipboard>

              {editPassword && (
                <CopyToClipboard
                  text={`${window.location.origin}/detail/${id}?edit_password=${editPassword}`}
                  onCopy={() => toast.success("Copied")}
                >
                  <Button variant="outline" size="sm">
                    Admin URL
                  </Button>
                </CopyToClipboard>
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

              <CopyToClipboard
                text={content}
                onCopy={() => toast.success("Copied")}
              >
                <Button variant="outline" size="sm">
                  Copy raw text
                </Button>
              </CopyToClipboard>

              {editPassword && (
                <Button size="sm" onClick={handleUpdatePaste}>
                  Update
                </Button>
              )}
            </div>
            <Editor
              height="calc(100vh - 280px)"
              language={language}
              value={content}
              readonly={!editPassword}
              onChange={(value) => setContent(value || "")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
