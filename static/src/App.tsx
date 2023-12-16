import { Route } from 'wouter';
import { Toaster } from 'react-hot-toast';
import CreatePaste from './pages';
import Detail from './pages/detail';
import Header from './components/header';

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
