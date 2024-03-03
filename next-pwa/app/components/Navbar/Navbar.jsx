"use client";

import Link from "next/link";

import {
  Group,
  Burger,
  Title,
  Drawer,
  Center,
  Text,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMessageLanguage } from "@tabler/icons-react";

import classes from "./Navbar.module.css";
import { LogoutButton } from "./LogoutButton";
import { useAuthContext } from "@/app/hooks/auth";

export function Navbar() {
  const { user } = useAuthContext();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <>
      <header className={classes.header}>
        <Group justify="space-between" sx={{ height: "100%" }}>
          <Group>
            <Link href="/">
              <Group>
                <IconMessageLanguage size={30} />
                <Title display={{ base: "none", sm: "block" }} size="h3">
                  The Language Exchange App
                </Title>
              </Group>
            </Link>
          </Group>

          <Group display={{ base: "none", sm: "flex" }}>
            {user && (
              <Link href="/profile" title="profile">
                <Group>
                  <Avatar alt="user profile picture" />
                  <Text>{user.user_metadata?.username}</Text>
                </Group>
              </Link>
            )}
            <LogoutButton />
          </Group>

          {user && (
            <Group display={{ sm: "none" }}>
              <Burger opened={drawerOpened} onClick={toggleDrawer} />
            </Group>
          )}
        </Group>
      </header>

      {user && (
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          zIndex={1000000}
          position="right"
          display={{ sm: "none" }}
        >
          <Link href="/profile" title="profile" onClick={closeDrawer}>
            <Center m="sm">
              <Avatar alt="user profile picture" mr="md" />
              <Text>{user.user_metadata?.username}</Text>
            </Center>
          </Link>

          <Center m="sm">
            <LogoutButton withLabel onClick={closeDrawer} />
          </Center>
        </Drawer>
      )}
    </>
  );
}
