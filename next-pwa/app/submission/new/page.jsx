"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import {
  TextInput,
  Button,
  Group,
  Box,
  Textarea,
  Autocomplete,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import { AuthOnly } from "@/app/components/Auth";
import { languageOptions } from "@/app/constants";

const schema = z.object({
  title: z
    .string()
    .min(20, { message: "Context needs to be at least 20 characters" }),
  language: z.string().min(1, { message: "Language cannot be empty" }),
  content: z
    .string()
    .min(100, { message: "Content needs to be at least 100 characters" }),
});

export default function Page() {
  const form = useForm({
    initialValues: {
      title: "",
      content: "",
    },
    validate: zodResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleCreate = async ({ ...content }) => {
    setIsSubmitting(true);
    try {
      const {
        data: [{ id } = {}],
        error,
      } = await supabase.from("submission").insert(content).select();
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      router.push(`/submission/${id}`);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error submitting content, please try again",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthOnly>
      <Box w="100%" mx="auto" mt="25vh">
        <form onSubmit={form.onSubmit(handleCreate)}>
          <TextInput
            required
            label="Context"
            placeholder="Give some context about the content you are submitting"
            {...form.getInputProps("title")}
          />
          <Autocomplete
            required
            label="Language"
            placeholder="Language your content is in"
            data={languageOptions}
            {...form.getInputProps("language")}
          />
          <Textarea
            required
            label="Content"
            placeholder="Content to be evaluated by people fluent in the language"
            autosize
            minRows={4}
            {...form.getInputProps("content")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit" disabled={isSubmitting}>
              Add new
            </Button>
          </Group>
        </form>
      </Box>
    </AuthOnly>
  );
}
