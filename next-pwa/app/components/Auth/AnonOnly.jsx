"use client";

import { useEffect } from "react";
import { Stack, Loader } from "@mantine/core";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/app/hooks/auth";

/**
 * HOC for page that should only be accessible by anonymous/logged-out user only
 */
export function AnonOnly({ children, redirectUrl = "/" }) {
  const { isLoading, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, router]);

  /**
   * show loading indicator when
   * (1) data is still pending
   * (2) redirect conditions are met
   */
  if (isLoading || user)
    return (
      <Stack align="center" justify="center" h="100%">
        <Loader size={50} />
      </Stack>
    );

  return children;
}
