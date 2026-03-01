import { SignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

export default function SignInPage() {
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get("redirect_url") || "/";
  // Only allow internal redirects (paths starting with /)
  const redirectUrl = rawRedirect.startsWith("/") ? rawRedirect : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <SignIn
        afterSignInUrl={redirectUrl}
        appearance={{
          elements: {
            footerAction: { display: "none" },
          },
        }}
        redirectUrl={redirectUrl}
      />
    </div>
  );
}
