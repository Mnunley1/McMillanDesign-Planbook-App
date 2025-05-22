import { useAuth } from "@clerk/clerk-react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import ModalPlan from "./components/ModalPlan";
import Home from "./pages/Home";
import Master from "./pages/Master";
import SignInPage from "./pages/SignIn";

// Auth guard component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Layout>{children}</Layout>;
}

// Root component
function Root() {
  return (
    <>
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    </>
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
        element: <Master />,
        children: [
          {
            path: "plan/:id",
            element: <ModalPlan />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
