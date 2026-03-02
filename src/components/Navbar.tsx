import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import {
  BarChart3,
  FolderOpen,
  Heart,
  Home,
  LogOut,
  Menu,
  Scale,
  ScrollText,
} from "lucide-react";
import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./theme-provider";

interface NavLinkProps {
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  to: string;
}

function NavLink({ to, label, icon, badge, onClick }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <RouterLink
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "block rounded-md px-3 py-2 font-medium text-base text-foreground transition-colors hover:bg-primary/10 hover:text-primary",
        isActive && "bg-primary/10 font-medium text-primary"
      )}
      onClick={onClick}
      to={to}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
        {badge && <span className="ml-auto">{badge}</span>}
      </span>
    </RouterLink>
  );
}

function AuthButtons() {
  return (
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
  );
}

function Navbar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const { count: favCount } = useFavorites();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const favoritesBadge = favCount > 0 && (
    <Badge
      className="h-5 min-w-5 rounded-full px-1.5 text-xs"
      variant="secondary"
    >
      {favCount}
    </Badge>
  );

  const handleSignOut = () => {
    closeMenu();
    signOut({ redirectUrl: "/sign-in" });
  };

  const initials = user
    ? [user.firstName, user.lastName]
        .filter(Boolean)
        .map((n) => n?.[0])
        .join("")
        .toUpperCase() || "U"
    : "U";

  return (
    <div className="sticky top-0 z-50 border-border border-b bg-background">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <RouterLink className="hover:no-underline" to="/">
            <img
              alt="McMillan Design"
              className="h-7"
              src={
                theme === "dark" ? "/MD-logo_white.png" : "/MD-logo_black.png"
              }
            />
          </RouterLink>

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isSignedIn ? (
              <Sheet onOpenChange={setIsOpen} open={isOpen}>
                <SheetTrigger asChild>
                  <button
                    className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                    type="button"
                  >
                    <span className="sr-only">Open menu</span>
                    <Menu aria-hidden="true" className="block h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent className="flex flex-col" side="right">
                  <SheetHeader className="px-2">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    {/* User info header */}
                    <RouterLink
                      className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-primary/10"
                      onClick={closeMenu}
                      to="/profile"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          alt={user?.fullName ?? "User"}
                          src={user?.imageUrl}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground text-sm">
                          {user?.fullName || "User"}
                        </p>
                        <p className="truncate text-muted-foreground text-xs">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </RouterLink>
                  </SheetHeader>

                  <Separator />

                  {/* General nav */}
                  <nav className="flex-1 space-y-1 px-2">
                    <NavLink
                      icon={<Home className="h-4 w-4" />}
                      label="Home"
                      onClick={closeMenu}
                      to="/"
                    />
                    <NavLink
                      badge={favoritesBadge}
                      icon={<Heart className="h-4 w-4" />}
                      label="Favorites"
                      onClick={closeMenu}
                      to="/favorites"
                    />
                    <NavLink
                      icon={<Scale className="h-4 w-4" />}
                      label="Compare"
                      onClick={closeMenu}
                      to="/compare"
                    />
                    {!isAdmin && (
                      <NavLink
                        icon={<FolderOpen className="h-4 w-4" />}
                        label="Collections"
                        onClick={closeMenu}
                        to="/collections"
                      />
                    )}

                    {/* Admin section */}
                    {isAdmin && (
                      <>
                        <Separator className="my-2" />
                        <p className="px-3 py-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                          Admin
                        </p>
                        <NavLink
                          icon={<ScrollText className="h-4 w-4" />}
                          label="Master"
                          onClick={closeMenu}
                          to="/master"
                        />
                        <NavLink
                          icon={<FolderOpen className="h-4 w-4" />}
                          label="Collections"
                          onClick={closeMenu}
                          to="/collections"
                        />
                        <NavLink
                          icon={<BarChart3 className="h-4 w-4" />}
                          label="Analytics"
                          onClick={closeMenu}
                          to="/analytics"
                        />
                      </>
                    )}
                  </nav>

                  {/* Sign out */}
                  <Separator />
                  <div className="px-2 pb-2">
                    <button
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-medium text-base text-destructive transition-colors hover:bg-destructive/10"
                      onClick={handleSignOut}
                      type="button"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
