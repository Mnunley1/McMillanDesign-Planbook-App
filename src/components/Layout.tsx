import type React from "react";
import { ComparisonContext, useComparisonState } from "@/hooks/use-comparison";
import CompareBar from "./CompareBar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const comparison = useComparisonState();

  return (
    <ComparisonContext.Provider value={comparison}>
      <div className="min-h-screen bg-background">
        {/* Skip link for accessibility */}
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          href="#main-content"
        >
          Skip to main content
        </a>
        <Navbar />
        <div
          className="h-[calc(100vh-4rem)] overflow-y-auto"
          data-scroll-container
          id="main-content"
        >
          {children}
        </div>
        <CompareBar />
      </div>
    </ComparisonContext.Provider>
  );
}

export default Layout;
