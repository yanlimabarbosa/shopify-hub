"use client";

import { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
  className?: string;
};

export function PageHeader({ title, children, className }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className || ""}`}>
      <h1 className="text-3xl font-bold">{title}</h1>
      {children && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {children}
        </div>
      )}
    </div>
  );
}
