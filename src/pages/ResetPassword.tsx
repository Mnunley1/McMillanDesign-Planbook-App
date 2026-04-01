import { useSignIn } from "@clerk/clerk-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type ResetStep = "request" | "verify" | "success";

function BrandPanel() {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-neutral-950 md:flex">
      {/* Gold radial glow -- top */}
      <div
        className="pointer-events-none absolute -top-1/4 -left-1/4 h-[80%] w-[80%] opacity-30"
        style={{
          background:
            "radial-gradient(circle, oklch(0.81 0.16 99.78) 0%, transparent 70%)",
        }}
      />
      {/* Gold radial glow -- bottom right */}
      <div
        className="pointer-events-none absolute -right-1/4 -bottom-1/4 h-[60%] w-[60%] opacity-20"
        style={{
          background:
            "radial-gradient(circle, oklch(0.81 0.16 99.78) 0%, transparent 70%)",
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
        <div
          className="absolute top-0 left-0 h-px w-full"
          style={{ backgroundColor: "oklch(0.81 0.16 99.78)", opacity: 0.4 }}
        />
        <div
          className="absolute top-0 left-0 h-full w-px"
          style={{ backgroundColor: "oklch(0.81 0.16 99.78)", opacity: 0.4 }}
        />
      </div>
      {/* Corner accent lines -- bottom-right */}
      <div className="absolute right-8 bottom-8 h-16 w-16">
        <div
          className="absolute right-0 bottom-0 h-px w-full"
          style={{ backgroundColor: "oklch(0.81 0.16 99.78)", opacity: 0.4 }}
        />
        <div
          className="absolute right-0 bottom-0 h-full w-px"
          style={{ backgroundColor: "oklch(0.81 0.16 99.78)", opacity: 0.4 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-10 lg:p-14">
        <div>
          <img
            alt="McMillan Design"
            className="h-10 w-auto lg:h-12"
            src="/MD-logo_white.png"
          />
        </div>

        <div className="flex flex-1 flex-col items-start justify-center">
          <h2 className="max-w-md font-sans text-3xl text-primary leading-tight lg:text-4xl">
            Your Dream Home Starts Here
          </h2>
          <p className="mt-4 max-w-sm text-base text-neutral-400 leading-relaxed lg:text-lg">
            Expertly crafted residential floor plans for every lifestyle
          </p>
        </div>

        <div className="flex items-end">
          <svg
            aria-hidden="true"
            className="h-12 w-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            style={{ color: "oklch(0.81 0.16 99.78 / 0.25)" }}
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

export default function ResetPasswordPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [step, setStep] = useState<ResetStep>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(3);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Auto-redirect after success
  useEffect(() => {
    if (step !== "success") {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, navigate]);

  // Step 1: Request a reset code
  async function handleRequestCode(e: FormEvent) {
    e.preventDefault();
    if (!(isLoaded && signIn)) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setStep("verify");
    } catch (err: unknown) {
      const clerkError = err as {
        errors?: Array<{ message?: string; longMessage?: string }>;
      };
      const message =
        clerkError.errors?.[0]?.longMessage ||
        clerkError.errors?.[0]?.message ||
        "Could not send reset code. Please check your email and try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Step 2: Verify code and set new password
  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (!(isLoaded && signIn)) {
      return;
    }

    // Client-side password match validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // First, verify the code
      const attemptResult = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });

      if (attemptResult.status === "needs_new_password") {
        // Now reset the password
        const resetResult = await signIn.resetPassword({
          password: newPassword,
        });

        if (resetResult.status === "complete" && resetResult.createdSessionId) {
          await setActive({ session: resetResult.createdSessionId });
          setStep("success");
        } else {
          setError("Password reset could not be completed. Please try again.");
        }
      } else {
        setError("Verification failed. Please check your code and try again.");
      }
    } catch (err: unknown) {
      const clerkError = err as {
        errors?: Array<{ message?: string; longMessage?: string }>;
      };
      const message =
        clerkError.errors?.[0]?.longMessage ||
        clerkError.errors?.[0]?.message ||
        "An error occurred. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Mask email for display: "john@example.com" -> "j***@example.com"
  const atIndex = email.indexOf("@");
  const maskedEmail =
    atIndex > 0
      ? `${email[0]}${"*".repeat(Math.max(atIndex - 1, 1))}${email.slice(atIndex)}`
      : email;

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
        </div>

        <div className="w-full max-w-sm">
          {/* Desktop logo */}
          <div className="mb-8 hidden md:block">
            <img
              alt="McMillan Design"
              className="h-8 w-auto"
              src={isDark ? "/MD-logo_white.png" : "/MD-logo_black.png"}
            />
          </div>

          {/* ===================== STEP 1: Request Code ===================== */}
          {step === "request" && (
            <>
              <div className="mb-8">
                <h1 className="font-sans font-semibold text-2xl text-foreground tracking-tight lg:text-3xl">
                  Reset your password
                </h1>
                <p className="mt-2 text-muted-foreground text-sm">
                  Enter your email and we'll send you a reset code
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleRequestCode}>
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email address</Label>
                  <div className="relative">
                    <Mail
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      autoComplete="email"
                      autoFocus
                      className="h-11 pl-10"
                      disabled={isSubmitting}
                      id="reset-email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      type="email"
                      value={email}
                    />
                  </div>
                </div>

                <Button
                  className="h-11 w-full font-semibold text-sm"
                  disabled={isSubmitting || !isLoaded}
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </Button>
              </form>

              <div className="mt-8 border-border border-t" />

              <div className="mt-6 text-center">
                <Link
                  className="inline-flex items-center gap-1.5 font-medium text-primary text-sm transition-colors hover:text-primary/80"
                  to="/sign-in"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to sign in
                </Link>
              </div>
            </>
          )}

          {/* ===================== STEP 2: Verify + New Password ===================== */}
          {step === "verify" && (
            <>
              <div className="mb-8">
                <h1 className="font-sans font-semibold text-2xl text-foreground tracking-tight lg:text-3xl">
                  Check your email
                </h1>
                <p className="mt-2 text-muted-foreground text-sm">
                  Enter the code we sent to{" "}
                  <span className="font-medium text-foreground">
                    {maskedEmail}
                  </span>
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleResetPassword}>
                {/* Verification code */}
                <div className="space-y-2">
                  <Label htmlFor="reset-code">Verification code</Label>
                  <Input
                    autoComplete="one-time-code"
                    autoFocus
                    className="h-11 text-center font-mono text-lg tracking-[0.3em]"
                    disabled={isSubmitting}
                    id="reset-code"
                    inputMode="numeric"
                    maxLength={6}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    pattern="[0-9]*"
                    placeholder="000000"
                    required
                    type="text"
                    value={code}
                  />
                </div>

                {/* New password */}
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <div className="relative">
                    <Lock
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      autoComplete="new-password"
                      className="h-11 pr-10 pl-10"
                      disabled={isSubmitting}
                      id="new-password"
                      minLength={8}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                    />
                    <button
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      tabIndex={-1}
                      type="button"
                    >
                      {showNewPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <div className="relative">
                    <Lock
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      autoComplete="new-password"
                      className={cn(
                        "h-11 pr-10 pl-10",
                        confirmPassword &&
                          newPassword !== confirmPassword &&
                          "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                      )}
                      disabled={isSubmitting}
                      id="confirm-password"
                      minLength={8}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                    />
                    <button
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={-1}
                      type="button"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-destructive text-xs">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <Button
                  className="h-11 w-full font-semibold text-sm"
                  disabled={isSubmitting || !isLoaded}
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>

              <div className="mt-8 border-border border-t" />

              <div className="mt-6 text-center">
                <button
                  className="inline-flex items-center gap-1.5 font-medium text-primary text-sm transition-colors hover:text-primary/80"
                  onClick={() => {
                    setStep("request");
                    setError("");
                    setCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  type="button"
                >
                  <ArrowLeft className="size-3.5" />
                  Use a different email
                </button>
              </div>
            </>
          )}

          {/* ===================== SUCCESS ===================== */}
          {step === "success" && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="size-8 text-primary" />
              </div>

              <h1 className="font-sans font-semibold text-2xl text-foreground tracking-tight lg:text-3xl">
                Password reset complete
              </h1>
              <p className="mt-3 text-muted-foreground text-sm">
                Your password has been successfully updated. You are now signed
                in.
              </p>

              <p className="mt-6 text-muted-foreground text-xs">
                Redirecting in {countdown}s...
              </p>

              <Button
                className="mt-4 h-11 w-full font-semibold text-sm"
                onClick={() => navigate("/", { replace: true })}
              >
                Continue to app
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
