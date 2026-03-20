import SplashScreen from "@/components/SplashScreen";
import { Toaster } from "@/components/ui/sonner";
import AdminPage from "@/pages/AdminPage";
import HomePage from "@/pages/HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useState } from "react";

const queryClient = new QueryClient();

const rootRoute = createRootRoute();
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([indexRoute, adminRoute]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {!splashDone ? (
          <SplashScreen key="splash" onDone={() => setSplashDone(true)} />
        ) : (
          <div key="app">
            <RouterProvider router={router} />
            <Toaster richColors position="top-center" />
          </div>
        )}
      </AnimatePresence>
    </QueryClientProvider>
  );
}
