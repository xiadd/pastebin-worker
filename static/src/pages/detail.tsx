import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { useParams } from 'wouter';
import { getPaste } from '../service';

export default function Detail() {
  const [content, setContent] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    if (!id) return;
    getPaste(id, params.get('password')).then((data) => {
      if (data.error) {
        toast.error(data.error);
        return;
      }
      setContent(data.content);
    });
  }, [id]);
  return (
    <div className="p-4 mx-auto max-w-7xl md:pt-10">
      <Editor
        height="calc(100vh - 200px)"
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
