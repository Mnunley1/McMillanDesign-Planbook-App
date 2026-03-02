import { useUser } from "@clerk/clerk-react";
import { Loader2, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Container className="max-w-2xl py-6">
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.publicMetadata?.role === "admin";
  const initials =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .map((n) => n?.[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <Container className="max-w-2xl py-6">
      <h1 className="mb-6 font-bold text-2xl">Profile</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={user.fullName ?? "User"} src={user.imageUrl} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                {user.fullName || "User"}
                {isAdmin && (
                  <Badge variant="secondary">
                    <Shield className="mr-1 h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <dl className="space-y-4">
            <div>
              <dt className="font-medium text-muted-foreground text-sm">
                First Name
              </dt>
              <dd className="mt-1">{user.firstName || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground text-sm">
                Last Name
              </dt>
              <dd className="mt-1">{user.lastName || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground text-sm">
                Email
              </dt>
              <dd className="mt-1">
                {user.primaryEmailAddress?.emailAddress || "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground text-sm">
                Member Since
              </dt>
              <dd className="mt-1">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </Container>
  );
}
