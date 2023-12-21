import { Route } from 'wouter';
import { Toaster } from 'react-hot-toast';
import CreatePaste from './pages';
import Detail from './pages/detail';
import Header from './components/header';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

function App() {
  return (
    <div className="md:pt-14 pt-32">
      <Header />
      <Route path="/" component={CreatePaste}></Route>
      <Route path="/detail/:id" component={Detail} />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
