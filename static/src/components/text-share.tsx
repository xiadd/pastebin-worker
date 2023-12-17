import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { createPaste } from '../service';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function TextShare() {
  const [content, setContent] = useState('');
  const [expiration, setExpiration] = useState<number | undefined>(undefined);
  const [isPrivate, setIsPrivate] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [createdPasteData, setCreatedPasteData] = useState<any>();

  const createPB = async () => {
    if (!content) return alert('请输入内容');
    setPublishing(true);
    const data = await createPaste({ content, expire: expiration, isPrivate });
    setCreatedPasteData(data);
    setPublishing(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Editor
        height="200px"
        defaultLanguage="text"
        onChange={(value) => setContent(value || '')}
        value={content}
        className="border rounded-sm"
        options={{ contextmenu: false, minimap: { enabled: false } }}
      />

      <div className="flex-col md:gap-2 md:items-center md:flex-row gap-4 flex">
        <div className="form-control">
          <label className="label cursor-pointer inline-flex gap-2">
            <span className="label-text">是否私有（随机密码）</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </label>
        </div>
        <div>
          <input
            list="expriation-times"
            type="number"
            step={1}
            min={60}
            value={expiration}
            onChange={(e) =>
              setExpiration(e.target.value ? Number(e.target.value) : undefined)
            }
            className="input input-bordered w-full md:max-w-xs"
            placeholder="过期时间（秒）"
          />

          <datalist id="expriation-times">
            <option value="60">1 min</option>
            <option value="300">5 mins</option>
            <option value="3600">1 hour</option>
            <option value="86400">1 day</option>
            <option value="604800">1 week</option>
            <option value="2592000">1 month</option>
          </datalist>
        </div>
      </div>
      <button
        className="btn btn-neutral"
        onClick={createPB}
        disabled={publishing || !content}
      >
        Create Paste
      </button>
      {createdPasteData && (
        <div className="flex flex-col gap-2">
          <ol className="max-w-lg space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400">
            <li className="flex gap-2 items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                URL
              </span>{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                <a
                  target="_blank"
                  href={`${window.location.origin}/detail/${
                    createdPasteData.id
                  }${
                    createdPasteData.share_password
                      ? `?password=${createdPasteData.share_password}`
                      : ''
                  }`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  title="Click to open"
                >
                  <svg
                    className="w-3 h-4 text-blue-600 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                    />
                  </svg>
                </a>
              </span>
              <CopyToClipboard
                text={`${window.location.origin}/detail/${createdPasteData.id}${
                  createdPasteData.share_password
                    ? `?password=${createdPasteData.share_password}`
                    : ''
                }`}
                onCopy={() => toast.success('Copied')}
              >
                <span className="cursor-pointer">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m7.708 2.292.706-.706A2 2 0 0 1 9.828 1h6.239A.97.97 0 0 1 17 2v12a.97.97 0 0 1-.933 1H15M6 5v4a1 1 0 0 1-1 1H1m11-4v12a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V9.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 5h5.239A.97.97 0 0 1 12 6Z"
                    />
                  </svg>
                </span>
              </CopyToClipboard>
            </li>

            <li className="flex gap-2 items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Raw URL
              </span>{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                <a
                  target="_blank"
                  href={`${window.location.origin}/raw/${createdPasteData.id}${
                    createdPasteData.share_password
                      ? `?password=${createdPasteData.share_password}`
                      : ''
                  }`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  title="Click to open"
                >
                  <svg
                    className="w-3 h-4 text-blue-600 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                    />
                  </svg>
                </a>
              </span>
              <CopyToClipboard
                text={`${window.location.origin}/raw/${createdPasteData.id}${
                  createdPasteData.share_password
                    ? `?password=${createdPasteData.share_password}`
                    : ''
                }`}
                onCopy={() => toast.success('Copied')}
              >
                <span className="cursor-pointer">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m7.708 2.292.706-.706A2 2 0 0 1 9.828 1h6.239A.97.97 0 0 1 17 2v12a.97.97 0 0 1-.933 1H15M6 5v4a1 1 0 0 1-1 1H1m11-4v12a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V9.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 5h5.239A.97.97 0 0 1 12 6Z"
                    />
                  </svg>
                </span>
              </CopyToClipboard>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
