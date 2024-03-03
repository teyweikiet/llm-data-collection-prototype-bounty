"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TextInput,
  Button,
  Group,
  Box,
  Text,
  Autocomplete,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import { AuthOnly } from "@/app/components/Auth";
import { notifications } from "@mantine/notifications";
import { useAuthContext } from "@/app/hooks/auth";
import { countryOptions, languageOptions } from "../constants";
import { SearchableMultiSelect } from "../components/Input/SearchableMultiSelect";
import { useState } from "react";

const schema = z.object({
  first_name: z.string().min(2, { message: "Invalid first name" }),
  last_name: z.string().min(2, { message: "Invalid last name" }),
});

const initialValues = (profile) => ({
  first_name: profile?.first_name ?? "",
  last_name: profile?.last_name ?? "",
  languages_fluent: profile?.languages_fluent ?? [],
  country: profile?.country ?? "",
});

export default function Form({ profile }) {
  const { user, setProfile } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    initialValues: initialValues(profile),
    validate: zodResolver(schema),
  });
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleUpdate = async (payload) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("profile")
        .update(payload)
        .match({ id: user.id })
        .select();
      if (error) {
        throw new Error(error.message);
      }
      setProfile(data[0]);
      router.push("/");
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error updating profile, please try again",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthOnly onboardedOnly={false}>
      <Box maw={340} mx="auto" mt="25vh">
        <form onSubmit={form.onSubmit(handleUpdate)}>
          <TextInput
            required
            label="First Name"
            placeholder="Your first name"
            {...form.getInputProps("first_name")}
          />
          <TextInput
            required
            label="Last Name"
            placeholder="Your last name"
            {...form.getInputProps("last_name")}
          />
          <SearchableMultiSelect
            required
            label="Languages (Fluent)"
            placeholder="Languages you know fluently"
            data={languageOptions}
            {...form.getInputProps("languages_fluent")}
          />
          <Autocomplete
            label="Country"
            placeholder="Country you are from"
            data={countryOptions}
            {...form.getInputProps("country")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </Group>
        </form>
      </Box>
    </AuthOnly>
  );
}
