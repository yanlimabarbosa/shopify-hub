import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/store/auth-store";
import type { LoginInput, RegisterInput, User, LoginResponse } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await apiClient.post<LoginResponse>("/auth/login", data);
      return response.data;
    },
    onSuccess: async (data) => {
      setAuth({} as User, data.token);
      const response = await apiClient.get<User>("/auth/me");
      setAuth(response.data, data.token);
      queryClient.setQueryData(["user"], response.data);
      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso",
      });
      // Redirect based on role: ADMIN -> /dashboard, USER -> /products
      router.push(response.data.role === "ADMIN" ? "/dashboard" : "/products");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao fazer login",
        variant: "destructive",
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await apiClient.post<{ user: User; token: string }>("/auth/register", data);
      return response.data;
    },
    onSuccess: async (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(["user"], data.user);
      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso",
      });
      // Redirect based on role: ADMIN -> /dashboard, USER -> /products
      router.push(data.user.role === "ADMIN" ? "/dashboard" : "/products");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao registrar",
        variant: "destructive",
      });
    },
  });
}

export function useUser() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);

  const hasToken = token || (typeof globalThis.window !== "undefined" ? globalThis.window.localStorage.getItem("token") : null);

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await apiClient.get<User>("/auth/me");
      if (hasToken) {
        setAuth(response.data, hasToken);
      }
      return response.data;
    },
    enabled: !!hasToken && !user,
    initialData: user || undefined,
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    clearAuth();
    queryClient.clear();
    router.push("/login");
  };
}
