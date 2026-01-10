"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { ShopifyAuthResponse } from "@/lib/types";
import { useRouter } from "next/navigation";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const statusParam = searchParams.get("status");
    const messageParam = searchParams.get("message");
    
    // If backend already processed and redirected with status
    if (statusParam === "success") {
      setStatus("success");
      setMessage(messageParam || "App Shopify instalado com sucesso");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      return;
    }
    
    if (statusParam === "error") {
      setStatus("error");
      setMessage(messageParam || "Falha ao completar o fluxo OAuth");
      return;
    }

    // If no status, this is a direct callback from Shopify (shouldn't happen, but handle it)
    const code = searchParams.get("code");
    const shop = searchParams.get("shop");
    const hmac = searchParams.get("hmac");

    if (!code || !shop) {
      setStatus("error");
      setMessage("Parâmetros OAuth obrigatórios ausentes");
      return;
    }

    // Redirect to backend callback (which will then redirect back with status)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const params = new URLSearchParams({ code, shop });
    if (hmac) params.append("hmac", hmac);
    
    if (globalThis.window !== undefined) {
      globalThis.window.location.href = `${apiUrl}/shopify/callback?${params.toString()}`;
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-lg font-medium">Completando OAuth...</p>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <p className="text-lg font-medium text-green-500">Sucesso!</p>
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                  Redirecionando para o painel...
                </p>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="h-8 w-8 text-destructive" />
                <p className="text-lg font-medium text-destructive">Erro</p>
                <Alert variant="destructive">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ShopifyCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
