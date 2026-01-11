"use client";

import { useState } from "react";
import { useRegisterWebhooks } from "@/hooks/use-webhooks";
import { useRequireAdmin } from "@/hooks/use-require-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StyledInput } from "@/components/styled-input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Webhook, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function WebhooksPage() {
  const isAdmin = useRequireAdmin();
  const [shop, setShop] = useState("");
  const registerWebhooks = useRegisterWebhooks();

  const handleRegister = () => {
    registerWebhooks.mutate(shop || undefined);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Webhooks</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Registrar Webhooks
          </CardTitle>
          <CardDescription>
            Registre webhooks para receber atualizações em tempo real do Shopify
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop">Domínio da Loja (Opcional)</Label>
            <StyledInput
              id="shop"
              type="text"
              placeholder="Deixe vazio para registrar em todas as lojas"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
            />
          </div>

          <Button
            onClick={handleRegister}
            disabled={registerWebhooks.isPending}
            className="w-full"
          >
            {registerWebhooks.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Registrar Webhooks"
            )}
          </Button>

          {registerWebhooks.isSuccess && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Registro de webhooks concluído
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <h3 className="font-semibold">Status dos Webhooks:</h3>
                {registerWebhooks.data?.webhooks.map((webhook, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      {webhook.status === "created" || webhook.status === "exists" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">{webhook.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          webhook.status === "error" ? "destructive" : "default"
                        }
                      >
                        {webhook.status}
                      </Badge>
                      {webhook.webhookId && (
                        <span className="text-sm text-muted-foreground">
                          ID: {webhook.webhookId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {registerWebhooks.data?.webhooks.some((w) => w.error) && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Alguns webhooks falharam ao registrar. Verifique o Painel do
                    Parceiro Shopify para configuração de Dados Protegidos do Cliente.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
