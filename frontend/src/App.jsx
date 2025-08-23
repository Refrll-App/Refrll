import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";

import "./App.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
          <Navbar />

          <main className="flex-1  ">
            <AppRoutes />
          </main>
          {/* <Footer /> */}
        </div>

        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export { queryClient };
