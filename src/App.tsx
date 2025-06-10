import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import { LoadingScreen } from "./components/LoadingScreen";
import { PWAInstaller } from "./components/PWAInstaller";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { registerServiceWorker } from "./utils/pwaUtils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Simulate app initialization
    const initializeApp = async () => {
      try {
        // Perform any necessary initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsAppReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsAppReady(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <LoadingScreen 
        onComplete={handleLoadingComplete}
        duration={2500}
        showProgress={true}
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OfflineIndicator />
        <PWAInstaller />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/results" element={
              <AuthLayout>
                <Results />
              </AuthLayout>
            } />
            <Route path="/" element={
              <AuthLayout>
                <Index />
              </AuthLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;