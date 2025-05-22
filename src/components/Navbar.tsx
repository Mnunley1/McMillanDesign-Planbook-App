import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

function Navbar() {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <RouterLink to="/" className="hover:no-underline">
              <span className="text-xl font-bold text-foreground hover:text-primary">
                McMillan Design
              </span>
            </RouterLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {isAdmin && (
              <div className="flex space-x-4">
                <RouterLink
                  to="/"
                  className={cn(
                    "text-foreground hover:text-primary px-3 py-1.5 rounded-md transition-colors",
                    location.pathname === "/" &&
                      "text-primary font-medium bg-primary/10"
                  )}
                >
                  Public
                </RouterLink>
                <RouterLink
                  to="/master"
                  className={cn(
                    "text-foreground hover:text-primary px-3 py-1.5 rounded-md transition-colors",
                    location.pathname === "/master" &&
                      "text-primary font-medium bg-primary/10"
                  )}
                >
                  Master
                </RouterLink>
              </div>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            ) : (
              <>
                <RouterLink to="/sign-in">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Sign In
                  </Button>
                </RouterLink>
                <RouterLink to="/sign-up">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Sign Up
                  </Button>
                </RouterLink>
              </>
            )}
          </div>

          {/* Mobile Auth/Admin Menu */}
          <div className="flex md:hidden">
            {isSignedIn ? (
              isAdmin ? (
                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              ) : (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              )
            ) : (
              <div className="flex space-x-2">
                <RouterLink to="/sign-in">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Sign In
                  </Button>
                </RouterLink>
                <RouterLink to="/sign-up">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Sign Up
                  </Button>
                </RouterLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only shown for admin users */}
      {isAdmin && (
        <div
          className={cn(
            "md:hidden",
            isMobileMenuOpen ? "block" : "hidden",
            "border-t border-border bg-background"
          )}
        >
          <div className="space-y-1 px-2 pb-3 pt-2">
            <RouterLink
              to="/"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                "text-foreground hover:text-primary hover:bg-primary/10",
                location.pathname === "/" &&
                  "text-primary font-medium bg-primary/10"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Public
            </RouterLink>
            <RouterLink
              to="/master"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                "text-foreground hover:text-primary hover:bg-primary/10",
                location.pathname === "/master" &&
                  "text-primary font-medium bg-primary/10"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Master
            </RouterLink>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
