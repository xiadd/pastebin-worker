import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

import { useLocation } from 'wouter';
import { createPaste } from '../service';

loader.config({ monaco });

export default function TextShare() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState('text');
  const [content, setContent] = useState('');
  const [expiration, setExpiration] = useState<number | undefined>(undefined);
  const [isPrivate, setIsPrivate] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const createPB = async () => {
    if (!content) return toast.error('请输入内容');
    setPublishing(true);
    const data = await createPaste({
      content,
      expire: expiration,
      isPrivate,
      language,
    });
    setPublishing(false);
    navigate(
      `/detail/${data.id}${
        data.share_password ? `?password=${data.share_password}` : ''
      }`,
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Editor
        height="200px"
        language={language}
        onChange={(value) => setContent(value || '')}
        value={content}
        className="border rounded-sm"
        options={{ contextmenu: false, minimap: { enabled: false } }}
      />

      <div className="flex-col md:gap-2 md:items-center md:flex-row gap-4 flex">
        <div className="form-control">
          <label className="label cursor-pointer inline-flex gap-2">
            <span className="label-text">{t('privateTip')}</span>
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
            placeholder={t('expiration')}
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

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="input w-full md:max-w-xs  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option defaultValue="text">Choose a language</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="markdown">Markdown</option>
          <option value="python">Python</option>
          <option value="golang">Golang</option>
          <option value="css">CSS</option>
          <option value="shell">Shell</option>
        </select>
      </div>
      <button
        className="btn btn-neutral"
        onClick={createPB}
        disabled={publishing || !content}
      >
        Create Paste
      </button>
    </div>
  );
}
