import React from "react";
import { AppHeader } from "./AppHeader";
import { Toaster } from "@/components/ui/sonner";
type AppLayoutProps = {
  children: React.ReactNode;
  className?: string;
};
export function AppLayout({ children, className }: AppLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <AppHeader />
      <main className={`flex-1 ${className || ''}`}>
        {children}
      </main>
      <Toaster richColors closeButton />
    </div>
  );
}