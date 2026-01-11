"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type StyledInputProps = React.ComponentProps<typeof Input>;

export function StyledInput({ className, ...props }: StyledInputProps) {
  return (
    <Input
      className={cn(
        "border-0 bg-input/30 focus-visible:ring-0 focus-visible:border-0",
        className
      )}
      {...props}
    />
  );
}
