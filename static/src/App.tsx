import { Toaster } from "react-hot-toast";
import { Route } from "wouter";

import "./App.css";
import Header from "./components/header";
import CreatePaste from "./pages";
import Detail from "./pages/detail";
import Tutorial from "./pages/tutorial";

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Route path="/" component={CreatePaste}></Route>
      <Route path="/detail/:id" component={Detail} />
      <Route path="/tutorial" component={Tutorial} />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
