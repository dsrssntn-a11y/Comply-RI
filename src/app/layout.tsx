import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
  );
}
