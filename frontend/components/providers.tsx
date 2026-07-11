"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

/** Signs the user out when the refresh token can no longer be renewed. */
function SessionErrorWatcher() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      signOut({ callbackUrl: "/login?expired=1" });
    }
  }, [session?.error]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <QueryClientProvider client={queryClient}>
        <SessionErrorWatcher />
        {children}
        <Toaster position="top-center" richColors closeButton />
      </QueryClientProvider>
    </SessionProvider>
  );
}
