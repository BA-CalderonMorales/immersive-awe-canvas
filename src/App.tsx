
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExperiencePage from "./pages/ExperiencePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// The basename for the router will now be dynamically set by Vite's config.
// This ensures it's correct for both dev (`/`) and gh-pages (`/repo-name/`).
const basename = import.meta.env.BASE_URL;

const App = () => (
  
  <QueryClientProvider client={queryClient}>
  
    <TooltipProvider>
    
      <Toaster />
      
      <Sonner />
      
      <BrowserRouter basename={basename}>
      
        <Routes>
        
          <Route path="/" element={<HomePage />} />
        
          <Route path="/experience" element={<ExperiencePage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        
        </Routes>
    
      </BrowserRouter>
    
    </TooltipProvider>

  </QueryClientProvider>

);

export default App;
