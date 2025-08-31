import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { ShareItem, ShareStorage } from "../utils/share-storage";

interface ShareHistorySidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function ShareHistorySidebar({ open, onClose }: ShareHistorySidebarProps) {
  const { t } = useTranslation();
  const [shares, setShares] = useState<ShareItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShare, setSelectedShare] = useState<ShareItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      loadShares();
    }
  }, [open]);

  const loadShares = () => {
    const allShares = ShareStorage.getAll();
    setShares(allShares);
  };

  const filteredShares = shares.filter(
    (share) =>
      share.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      share.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    try {
      ShareStorage.delete(id);
      setShares((prev) => prev.filter((share) => share.id !== id));
      toast.success(t("shareDeleted"));
    } catch (error) {
      toast.error(t("deleteFailed"));
    }
  };

  const handleView = (share: ShareItem) => {
    setSelectedShare(share);
    setIsViewDialogOpen(true);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success(t("contentCopied"));
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const clearAll = () => {
    try {
      ShareStorage.clear();
      setShares([]);
      toast.success(t("allCleared"));
    } catch (error) {
      toast.error(t("clearFailed"));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              {t("shareHistory")}
            </DialogTitle>
            <DialogDescription>
              {t('totalShares', { count: shares.length }) || `共 ${shares.length} 个分享项目`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            <div className="flex gap-2">
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white/80 dark:bg-gray-900/80 focus:z-10"
              />
              {shares.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                >
                  {t("clearAll")}
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-auto">
              {filteredShares.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchQuery ? t("noResults") : t("noShares")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {searchQuery
                      ? t("tryDifferentKeywords")
                      : t("autoSaveNotice")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredShares.map((share) => (
                    <div
                      key={share.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              share.type === "text"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            }`}
                          >
                            {share.type === "text" ? "文本" : "文件"}
                          </span>
                          {share.language && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                              {share.language}
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {share.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>{formatDate(share.createdAt)}</span>
                          {share.fileSize && (
                            <span>大小: {formatFileSize(share.fileSize)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(share)}
                        >
                          {t("view")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(share.content)}
                        >
                          {t("copy")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(share.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                        >
                          {t("delete")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedShare?.title}
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  selectedShare?.type === "text"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {selectedShare?.type === "text" ? "文本" : "文件"}
              </span>
            </DialogTitle>
            <DialogDescription>
              创建时间: {selectedShare && formatDate(selectedShare.createdAt)}
              {selectedShare?.fileSize && (
                <span className="ml-4">
                  大小: {formatFileSize(selectedShare.fileSize)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {selectedShare?.content}
              </pre>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => selectedShare && handleCopy(selectedShare.content)}
              >
                {t("copyContent")}
              </Button>
              <Button onClick={() => setIsViewDialogOpen(false)}>
                {t("close")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}