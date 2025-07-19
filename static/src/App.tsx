import { Toaster } from "react-hot-toast";
import { Route } from "wouter";

import "./App.css";
import Footer from "./components/footer";
import Header from "./components/header";
import CreatePaste from "./pages";
import Detail from "./pages/detail";
import Tutorial from "./pages/tutorial";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main role="main" className="flex-1">
        <Route path="/" component={CreatePaste}></Route>
        <Route path="/detail/:id" component={Detail} />
        <Route path="/tutorial" component={Tutorial} />
      </main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
