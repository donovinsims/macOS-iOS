import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black/50">
      <div className="w-full max-w-md space-y-8 px-4 sm:px-0">{children}</div>
    </div>
  );
}
