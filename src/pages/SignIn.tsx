import { SignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

export default function SignInPage() {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <SignIn
        appearance={{
          elements: {
            footerAction: { display: "none" },
          },
        }}
        redirectUrl={redirectUrl}
        afterSignInUrl={redirectUrl}
      />
    </div>
  );
}
