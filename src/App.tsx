
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ExperienceProvider } from "@/context/ExperienceContext";
import ExperienceContent from "@/components/experience/ExperienceContent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const basename = import.meta.env.BASE_URL;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      <BrowserRouter basename={basename}>
        <Routes>
          {/* Redirect root to first world */}
          <Route path="/" element={<Navigate to="/experience/genesis-torus" replace />} />
          
          {/* Main experience route */}
          <Route 
            path="/experience/:worldSlug" 
            element={
              <ExperienceProvider>
                <ExperienceContent />
              </ExperienceProvider>
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
