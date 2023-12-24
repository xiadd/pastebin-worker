import { Route } from 'wouter';
import { Toaster } from 'react-hot-toast';
import CreatePaste from './pages';
import Detail from './pages/detail';
import Header from './components/header';
import Tutorial from './pages/tutorial';
import './App.css';

function App() {
  return (
    <div className="md:pt-14 pt-32">
      <Header />
      <Route path="/" component={CreatePaste}></Route>
      <Route path="/detail/:id" component={Detail} />
      <Route path="/tutorial" component={Tutorial} />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
