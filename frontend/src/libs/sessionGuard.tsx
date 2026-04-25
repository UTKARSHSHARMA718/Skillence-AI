"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "AccessTokenExpired") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  return <>{children}</>;
}
