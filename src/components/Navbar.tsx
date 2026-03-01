import { UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { Heart, Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";


function Navbar() {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const { count: favCount } = useFavorites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <div className="sticky top-0 z-50 border-border border-b bg-background">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <RouterLink className="hover:no-underline" to="/">
              <span className="font-bold text-foreground text-xl hover:text-primary">
                McMillan Design
              </span>
            </RouterLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <div className="flex space-x-4">
              {isAdmin && (
                <>
                  <RouterLink
                    aria-current={
                      location.pathname === "/" ? "page" : undefined
                    }
                    className={cn(
                      "rounded-md px-3 py-1.5 text-foreground transition-colors hover:text-primary",
                      location.pathname === "/" &&
                        "bg-primary/10 font-medium text-primary"
                    )}
                    to="/"
                  >
                    Public
                  </RouterLink>
                  <RouterLink
                    aria-current={
                      location.pathname === "/master" ? "page" : undefined
                    }
                    className={cn(
                      "rounded-md px-3 py-1.5 text-foreground transition-colors hover:text-primary",
                      location.pathname === "/master" &&
                        "bg-primary/10 font-medium text-primary"
                    )}
                    to="/master"
                  >
                    Master
                  </RouterLink>
                  <RouterLink
                    aria-current={
                      location.pathname === "/collections" ? "page" : undefined
                    }
                    className={cn(
                      "rounded-md px-3 py-1.5 text-foreground transition-colors hover:text-primary",
                      location.pathname === "/collections" &&
                        "bg-primary/10 font-medium text-primary"
                    )}
                    to="/collections"
                  >
                    Collections
                  </RouterLink>
                  <RouterLink
                    aria-current={
                      location.pathname === "/analytics" ? "page" : undefined
                    }
                    className={cn(
                      "rounded-md px-3 py-1.5 text-foreground transition-colors hover:text-primary",
                      location.pathname === "/analytics" &&
                        "bg-primary/10 font-medium text-primary"
                    )}
                    to="/analytics"
                  >
                    Analytics
                  </RouterLink>
                </>
              )}
              <RouterLink
                aria-current={
                  location.pathname === "/favorites" ? "page" : undefined
                }
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-foreground transition-colors hover:text-primary",
                  location.pathname === "/favorites" &&
                    "bg-primary/10 font-medium text-primary"
                )}
                to="/favorites"
              >
                <Heart className="h-4 w-4" />
                Favorites
                {favCount > 0 && (
                  <Badge
                    className="h-5 min-w-5 rounded-full px-1.5 text-xs"
                    variant="secondary"
                  >
                    {favCount}
                  </Badge>
                )}
              </RouterLink>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <ThemeToggle />
            {isSignedIn ? (
              <UserButton
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
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    size="sm"
                    variant="outline"
                  >
                    Sign In
                  </Button>
                </RouterLink>
                <RouterLink to="/sign-up">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    size="sm"
                    variant="default"
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
                  className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  onClick={toggleMobileMenu}
                  type="button"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <X aria-hidden="true" className="block h-6 w-6" />
                  ) : (
                    <Menu aria-hidden="true" className="block h-6 w-6" />
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
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    size="sm"
                    variant="outline"
                  >
                    Sign In
                  </Button>
                </RouterLink>
                <RouterLink to="/sign-up">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    size="sm"
                    variant="default"
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
            "border-border border-t bg-background"
          )}
        >
          <div className="space-y-1 px-2 pt-2 pb-3">
            <RouterLink
              className={cn(
                "block rounded-md px-3 py-2 font-medium text-base",
                "text-foreground hover:bg-primary/10 hover:text-primary",
                location.pathname === "/" &&
                  "bg-primary/10 font-medium text-primary"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
              to="/"
            >
              Public
            </RouterLink>
            <RouterLink
              className={cn(
                "block rounded-md px-3 py-2 font-medium text-base",
                "text-foreground hover:bg-primary/10 hover:text-primary",
                location.pathname === "/master" &&
                  "bg-primary/10 font-medium text-primary"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
              to="/master"
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
