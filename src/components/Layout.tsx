import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">{children}</div>
    </div>
  );
}

export default Layout;
