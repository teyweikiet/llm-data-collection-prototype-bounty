"use client";

import { Group, Text } from "@mantine/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IconLogout } from "@tabler/icons-react";

import { useAuthContext } from "@/app/hooks/auth";

export function LogoutButton({ withLabel, onClick }) {
  const supabase = createClientComponentClient();
  const { user } = useAuthContext();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClick && onClick();
  };

  return (
    <Group
      align="flex-center"
      onClick={handleLogout}
      style={{ cursor: "pointer" }}
    >
      {user && (
        <>
          <IconLogout title="logout" />
          {withLabel && <Text>Logout</Text>}
        </>
      )}
    </Group>
  );
}
