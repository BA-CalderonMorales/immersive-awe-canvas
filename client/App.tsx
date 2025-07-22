import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ExperienceContent from "@/components/experience/ExperienceContent";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ExperienceProvider } from "@/context/ExperienceContext";
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
                    {/* Redirect root to experience */}
                    <Route
                        path="/"
                        element={<Navigate to="/experience" replace />}
                    />

                    {/* Main experience route - simplified without world slug */}
                    <Route
                        path="/experience"
                        element={
                            <ExperienceProvider>
                                <ExperienceContent />
                            </ExperienceProvider>
                        }
                    />

                    {/* Legacy world slug route - redirect to main experience */}
                    <Route
                        path="/experience/:worldSlug"
                        element={<Navigate to="/experience" replace />}
                    />

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
