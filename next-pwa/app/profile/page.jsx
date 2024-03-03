import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Form from "./form";
import { Stack } from "@mantine/core";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: { user: { id } = {} } = {} } = await supabase.auth.getUser();
  const {
    data: [profile],
  } = await supabase.from("profile").select().eq("id", id);

  return <Form profile={profile} />;
}
