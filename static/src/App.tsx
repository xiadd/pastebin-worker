import { Link, Route } from 'wouter';
import CreatePaste from './pages';
import Detail from './pages/detail';

function App() {
  return (
    <div>
      <Route path="/" component={CreatePaste}></Route>
      <Route path="/detail/:id" component={Detail} />
    </div>
  );
}

export default App;
