"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useUser } from "@/hooks/use-auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { data: user, isLoading } = useUser();

  const hasToken = token || (typeof globalThis.window !== "undefined" ? globalThis.window.localStorage.getItem("token") : null);

  useEffect(() => {
    if (!isLoading && !hasToken) {
      router.push("/login");
      return;
    }

    if (!isLoading && requireAdmin && user?.role !== "ADMIN") {
      router.push("/products");
      return;
    }
  }, [hasToken, user, isLoading, router, requireAdmin]);

  if (isLoading || !hasToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (requireAdmin && user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
