"use client";

import { Card, CardContent } from "@/components/ui/card";

type ErrorStateProps = {
  message?: string;
  className?: string;
};

export function ErrorState({ message = "Falha ao carregar dados", className }: ErrorStateProps) {
  return (
    <Card className={`border shadow-sm ${className || ""}`}>
      <CardContent className="pt-6 px-4 sm:px-6">
        <p className="text-destructive">{message}</p>
      </CardContent>
    </Card>
  );
}
