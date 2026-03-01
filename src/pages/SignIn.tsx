import { useSignIn } from "@clerk/clerk-react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { cn } from "@/lib/utils";

function BrandPanel() {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-neutral-950 md:flex">
      {/* Gold radial glow -- top */}
      <div
        className="pointer-events-none absolute -top-1/4 -left-1/4 h-[80%] w-[80%] opacity-30"
        style={{
          background: "radial-gradient(circle, oklch(0.81 0.16 99.78) 0%, transparent 70%)",
        }}
      />
      {/* Gold radial glow -- bottom right */}
      <div
        className="pointer-events-none absolute -right-1/4 -bottom-1/4 h-[60%] w-[60%] opacity-20"
        style={{
          background: "radial-gradient(circle, oklch(0.81 0.16 99.78) 0%, transparent 70%)",
        }}
      />

      {/* Architectural grid pattern overlay in gold */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.81 0.16 99.78) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.81 0.16 99.78) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner accent lines -- top-left */}
      <div className="absolute top-8 left-8 h-16 w-16">
        <div className="absolute top-0 left-0 h-px w-full" style={{ backgroundColor: "oklch(0.81 0.16 99.78)", opacity: 0.4 }} />
        <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundColor: "oklch(0.81 0.16 99.78)", opacity: 0.4 }} />
      </div>
      {/* Corner accent lines -- bottom-right */}
      <div className="absolute right-8 bottom-8 h-16 w-16">
        <div className="absolute bottom-0 right-0 h-px w-full" style={{ backgroundColor: "oklch(0.81 0.16 99.78)", opacity: 0.4 }} />
        <div className="absolute right-0 bottom-0 h-full w-px" style={{ backgroundColor: "oklch(0.81 0.16 99.78)", opacity: 0.4 }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-10 lg:p-14">
        {/* Logo */}
        <div>
          <img
            alt="McMillan Design"
            className="h-10 w-auto lg:h-12"
            src="/MD-logo_white.png"
          />
        </div>

        {/* Center text */}
        <div className="flex flex-1 flex-col items-start justify-center">
          <h2 className="max-w-md font-sans text-3xl leading-tight text-primary lg:text-4xl">
            Your Dream Home Starts Here
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-neutral-400 lg:text-lg">
            Expertly crafted residential floor plans for every lifestyle
          </p>
        </div>

        {/* Minimal house outline */}
        <div className="flex items-end">
          <svg
            aria-hidden="true"
            className="h-12 w-16"
            style={{ color: "oklch(0.81 0.16 99.78 / 0.25)" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 64 48"
          >
            <path d="M4 28 L32 4 L60 28 L60 46 L4 46 Z" />
            <rect height="14" width="10" x="24" y="32" />
            <rect height="8" width="8" x="44" y="24" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawRedirect = searchParams.get("redirect_url") || "/";
  const redirectUrl = rawRedirect.startsWith("/") ? rawRedirect : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setIsSubmitting(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        navigate(redirectUrl, { replace: true });
      } else {
        // Handle any unexpected status
        setError("Sign in could not be completed. Please try again.");
      }
    } catch (err: unknown) {
      const clerkError = err as {
        errors?: Array<{ message?: string; longMessage?: string }>;
      };
      const message =
        clerkError.errors?.[0]?.longMessage ||
        clerkError.errors?.[0]?.message ||
        "An error occurred during sign in. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-background md:grid-cols-[45fr_55fr]">
      {/* Left brand panel -- desktop only */}
      <BrandPanel />

      {/* Right form panel */}
      <div className="flex flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-20">
        {/* Mobile logo */}
        <div className="mb-10 md:hidden">
          <img
            alt="McMillan Design"
            className="h-9 w-auto"
            src={isDark ? "/MD-logo_white.png" : "/MD-logo_black.png"}
          />
          <p className="mt-2 text-center font-sans text-sm text-muted-foreground">
            Your Dream Home Starts Here
          </p>
        </div>

        <div className="w-full max-w-sm">
          {/* Desktop logo -- shown above form on right side */}
          <div className="mb-8 hidden md:block">
            <img
              alt="McMillan Design"
              className="h-8 w-auto"
              src={isDark ? "/MD-logo_white.png" : "/MD-logo_black.png"}
            />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your McMillan Design account
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  autoComplete="email"
                  className="h-11 pl-10"
                  disabled={isSubmitting}
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  tabIndex={-1}
                  to="/reset-password"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  autoComplete="current-password"
                  className="h-11 pr-10 pl-10"
                  disabled={isSubmitting}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              className={cn("h-11 w-full text-sm font-semibold")}
              disabled={isSubmitting || !isLoaded}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-8 border-t border-border" />

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
