import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'wouter';
import { getPaste } from '../service';

export default function Detail() {
  const [content, setContent] = useState('');

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    getPaste(id).then((data) => {
      setContent(data.content);
    });
  }, [id]);
  return (
    <div className="p-4 mx-auto max-w-[960px]">
      <Editor
        height="200px"
        defaultLanguage="text"
        value={content}
        className="border rounded-sm"
        options={{
          contextmenu: false,
          readOnly: true,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
}
