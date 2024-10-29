import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  if (user) {
    router.push("/");
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "black",
      }}
    >
      <SignIn
        appearance={{
          baseTheme: "dark",
          elements: {
            footerAction: { display: "none" },
          },
        }}
        showOptionalFields={false}
      />
    </div>
  );
}
