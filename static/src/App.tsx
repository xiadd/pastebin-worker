import { Route } from 'wouter';
import { Toaster } from 'react-hot-toast';
import CreatePaste from './pages';
import Detail from './pages/detail';

function App() {
  return (
    <div>
      <Route path="/" component={CreatePaste}></Route>
      <Route path="/detail/:id" component={Detail} />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
