import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { useParams } from 'wouter';
import { getPaste } from '../service';

export default function Detail() {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('text');

  const { id } = useParams();

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    if (!id) return;
    getPaste(id, params.get('password')).then((data: any) => {
      if (data.error) {
        toast.error(data.error);
        return;
      }
      console.log(data);
      setContent(data.content);
      setLanguage(data.language);
    });
  }, [id]);
  return (
    <div className="p-4 mx-auto max-w-7xl md:pt-10">
      <Editor
        height="calc(100vh - 200px)"
        language={language}
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
