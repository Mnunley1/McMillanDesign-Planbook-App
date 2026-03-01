import { useAuth, useUser } from "@clerk/clerk-react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import ModalPlan from "./components/ModalPlan";
import Analytics from "./pages/Analytics";
import CollectionDetail from "./pages/CollectionDetail";
import Collections from "./pages/Collections";
import Compare from "./pages/Compare";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Master from "./pages/Master";
import PlanDetail from "./pages/PlanDetail";
import SignInPage from "./pages/SignIn";

// Auth guard component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate replace to="/sign-in" />;
  }

  return <Layout>{children}</Layout>;
}

// Admin guard component - requires admin role
function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (user?.publicMetadata?.role !== "admin") {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
}

// Root component
function Root() {
  return (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  );
}

// Create the router configuration
export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "plan/:id",
            element: <ModalPlan />,
          },
        ],
      },
      {
        path: "master",
        element: (
          <AdminGuard>
            <Master />
          </AdminGuard>
        ),
        children: [
          {
            path: "plan/:id",
            element: <ModalPlan />,
          },
        ],
      },
      {
        path: "plan/:id/detail",
        element: <PlanDetail />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "compare",
        element: <Compare />,
      },
      {
        path: "collections",
        element: (
          <AdminGuard>
            <Collections />
          </AdminGuard>
        ),
      },
      {
        path: "collections/:id",
        element: (
          <AdminGuard>
            <CollectionDetail />
          </AdminGuard>
        ),
      },
      {
        path: "analytics",
        element: (
          <AdminGuard>
            <Analytics />
          </AdminGuard>
        ),
      },
      {
        path: "*",
        element: <Navigate replace to="/" />,
      },
    ],
  },
]);
