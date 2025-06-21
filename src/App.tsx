
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRouteWithContext,
  Outlet,
  
} from "@tanstack/react-router";
import { fetchWorldBySlug } from "@/hooks/useWorlds";
import HomePage from "./pages/HomePage";
import WorldExperiencePage from "./pages/WorldExperiencePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const basename = import.meta.env.BASE_URL;

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => <Outlet />,
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const worldRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'experience/$worldSlug',
  component: WorldExperiencePage,
  loader: async ({ params }) => {
    await queryClient.ensureQueryData({
      queryKey: ['world', params.worldSlug],
      queryFn: () => fetchWorldBySlug(params.worldSlug),
    });
    return {};
  },
});

const routeTree = rootRoute.addChildren([indexRoute, worldRoute]);

const router = createRouter({
  routeTree,
  context: { queryClient },
  basepath: basename,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
