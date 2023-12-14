import { Link, Route } from 'wouter';
import CreatePaste from './pages';

function App() {
  return (
    <div>
      <Route path="/" component={CreatePaste}></Route>
      <Route path="/about">Abount</Route>
    </div>
  );
}

export default App;
