import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { FavoritesProvider } from "@/hooks/useFavorites";
import { EvaluationsProvider } from "@/hooks/useEvaluations";
import { MediaProvider } from "@/hooks/useMedia";
import { useTheme } from "@/hooks/useTheme"; // ← ajout du hook personnalisé

// Pages
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import TvShowsPage from "./pages/TvShowsPage";
import EvaluationsPage from "./pages/EvaluationsPage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import MediaDetailPage from "./pages/MediaDetailPage";
import NotFound from "./pages/NotFound";
import BottomNavigation from "./components/BottomNavigation";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useTheme();

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", isDark ? "#0f172a" : "#ffffff");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="container px-4 max-w-md mx-auto">{children}</main>
      <BottomNavigation />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MediaProvider>
          <EvaluationsProvider>
            <FavoritesProvider>
              <AppProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movies" element={<MoviesPage />} />
                    <Route path="/tv" element={<TvShowsPage />} />
                    <Route path="/evaluations" element={<EvaluationsPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/:type/:id" element={<MediaDetailPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </AppProvider>
            </FavoritesProvider>
          </EvaluationsProvider>
        </MediaProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
