import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface UserMetadata {
  role?: string;
}

export default authMiddleware({
  publicRoutes: ["/sign-in(.*)", "/sign-up(.*)"],
  afterAuth(auth, req) {
    // Handle unauthenticated users
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Handle admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const metadata = auth.sessionClaims?.metadata as UserMetadata;
      if (!auth.userId || metadata?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
});

// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/admin(.*)",
  ],
};
