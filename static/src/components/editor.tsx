import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { javascript } from '@codemirror/lang-javascript';
import { languages } from '@codemirror/language-data';

import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { python } from '@codemirror/legacy-modes/mode/python';
import { shell } from '@codemirror/legacy-modes/mode/shell';

interface EditorProps {
  language?: string;
  value: string;
  onChange?: (content: string) => void;
  readonly?: boolean;
  className?: string;
  height?: string;
}

export default function Editor({
  value,
  onChange,
  language = 'text',
  readonly = false,
  height = '300px',
}: EditorProps) {
  const [languageExtension, setLanguageExtension] = useState<any>([]);
  useEffect(() => {
    switch (language) {
      case 'markdown':
        setLanguageExtension([
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]);
        break;
      case 'go':
        setLanguageExtension([StreamLanguage.define(go)]);
        break;
      case 'javascript':
        setLanguageExtension([javascript()]);
        break;
      case 'python':
        setLanguageExtension([StreamLanguage.define(python)]);
        break;
      case 'shell':
        setLanguageExtension([StreamLanguage.define(shell)]);
        break;
      default:
        break;
    }
  }, [language]);

  return (
    <CodeMirror
      className="border border-gray-200 rounded-sm"
      height={height}
      width="100%"
      onChange={onChange}
      value={value}
      extensions={languageExtension}
      readOnly={readonly}
    />
  );
}
