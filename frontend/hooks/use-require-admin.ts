"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

type UseRequireAdminOptions = {
  redirectTo?: string;
};

export function useRequireAdmin(options: UseRequireAdminOptions = {}) {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const { redirectTo = "/dashboard" } = options;

  useEffect(() => {
    if (!isAdmin) {
      router.push(redirectTo);
    }
  }, [isAdmin, router, redirectTo]);

  return isAdmin;
}
