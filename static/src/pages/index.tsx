import { useState, memo } from 'react';
import { createPaste } from '../service';
import Editor from '@monaco-editor/react';

export default memo(function CreatePaste() {
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [pasteId, setPasteId] = useState('');

  const createPB = async () => {
    if (!content) return alert('请输入内容');
    setPublishing(true);
    const data = await createPaste(content);
    setPasteId(data.id);
    setPublishing(false);
  };

  return (
    <div className="p-4 md:p-10 flex flex-col gap-3">
      <Editor
        height="200px"
        defaultLanguage="text"
        onChange={(value) => setContent(value || '')}
        value={content}
        className="border rounded-sm"
        options={{ contextmenu: false, minimap: { enabled: false } }}
      />
      <button
        className="btn btn-neutral"
        onClick={createPB}
        disabled={publishing || !content}
      >
        Create Paste
      </button>
      {pasteId && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            URL:{' '}
            <kbd className="kbd kbd-sm">
              {window.location.origin}/detail/{pasteId}
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            Raw URL:{' '}
            <kbd className="kbd kbd-sm">
              {window.location.origin}/raw/{pasteId}
            </kbd>
          </div>
        </div>
      )}
    </div>
  );
});
