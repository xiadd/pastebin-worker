import { useState } from 'react';
import { createPaste } from '../service';

export default function CreatePaste() {
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);

  const createPB = async () => {
    if (!content) return alert('请输入内容');
    setPublishing(true);
    const data = await createPaste('test');
    console.log(data);
    setPublishing(false);
  };

  return (
    <div className="p-10 flex flex-col gap-3">
      <textarea
        className="border rounded resize-none outline-none p-2"
        onChange={(evt) => setContent(evt.target.value)}
        value={content}
      />
      <button
        className="border rounded bg-gray-100 px-3 py-1 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
        onClick={createPB}
        disabled={publishing || !content}
      >
        创建paste
      </button>
    </div>
  );
}
