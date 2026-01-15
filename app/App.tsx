import { Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

import Header from "./components/header";
import Footer from "./components/footer";

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main role="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default AppLayout;
