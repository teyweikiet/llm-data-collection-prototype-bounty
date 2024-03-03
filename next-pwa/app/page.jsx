"use client";

import { Button, List, Stack, Tabs, Text, ThemeIcon, rem } from "@mantine/core";
import { AuthOnly } from "@/app/components/Auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IconLanguage } from "@tabler/icons-react";
import { useState } from "react";
import { useAuthContext } from "./hooks/auth";
import { usePrevious } from "@mantine/hooks";
import Link from "next/link";

export default function Page() {
  const { user, profile } = useAuthContext();
  const supabase = createClientComponentClient();
  const [owned, setOwned] = useState([]);
  const [others, setOthers] = useState([]);
  const previousUser = usePrevious(user);
  const previousProfile = usePrevious(profile);

  if (previousUser !== user && user?.id) {
    supabase
      .from("submission")
      .select(`id, title, language`)
      .match({ user_id: user.id })
      .then(({ data, error }) => {
        setOwned(data);
      });
  }

  if (profile !== previousProfile && profile?.languages_fluent?.length) {
    supabase
      .from("submission")
      .select(`id, title, language`)
      .neq("user_id", user.id)
      .in("language", profile.languages_fluent)
      .then(({ data, error }) => {
        setOthers(data);
      });
  }
  return (
    <AuthOnly>
      <Stack justify="start" align="start" mt="md">
        <Tabs defaultValue="owned" w={"100%"}>
          <Tabs.List>
            <Tabs.Tab value="owned">My submission</Tabs.Tab>
            <Tabs.Tab value="others">Others&apos; submission</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="owned" py="md">
            {owned.length ? (
              <List spacing="md" size="md" center>
                {owned.map((submission) => (
                  <Link
                    key={submission.id}
                    href={`/submission/${submission.id}`}
                  >
                    <List.Item
                      mb="md"
                      icon={
                        <ThemeIcon
                          color="teal"
                          size={24}
                          radius="xl"
                          title={submission?.language}
                        >
                          <IconLanguage
                            style={{ width: rem(16), height: rem(16) }}
                          />
                        </ThemeIcon>
                      }
                    >
                      {submission.title}
                    </List.Item>
                  </Link>
                ))}
              </List>
            ) : (
              <Text my="md">
                You haven&apos;t submitted anything. Start submitting and get
                feedback from people who are fluent in the language now!
              </Text>
            )}
            <Stack justify="center" align="center">
              <Link href="/submission/new">
                <Button>Add new</Button>
              </Link>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="others" py="md">
            {others.length ? (
              <List
                spacing="md"
                size="md"
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconLanguage style={{ width: rem(16), height: rem(16) }} />
                  </ThemeIcon>
                }
              >
                {others.map((submission) => (
                  <Link
                    key={submission.id}
                    href={`/submission/${submission.id}`}
                  >
                    <List.Item
                      mb="md"
                      icon={
                        <ThemeIcon
                          color="teal"
                          size={24}
                          radius="xl"
                          title={submission?.language}
                        >
                          <IconLanguage
                            style={{ width: rem(16), height: rem(16) }}
                          />
                        </ThemeIcon>
                      }
                    >
                      {submission.title}
                    </List.Item>
                  </Link>
                ))}
              </List>
            ) : profile?.languages_fluent?.length ? (
              <Text my="md">
                No new submissions in the languages you are fluent in yet
              </Text>
            ) : (
              <>
                <Text my="md">
                  Please complete your profile before proceeding.
                </Text>
                <Stack justify="center" align="center">
                  <Link href="/profile">
                    <Button>Complete profile</Button>
                  </Link>
                </Stack>
              </>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </AuthOnly>
  );
}
