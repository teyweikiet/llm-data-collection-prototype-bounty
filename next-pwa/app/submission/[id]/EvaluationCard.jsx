"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import {
  Button,
  Group,
  Textarea,
  Card,
  Title,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";

const schema = z.object({
  feedback: z
    .string()
    .min(20, { message: "Context needs to be at least 20 characters" }),
  edit: z
    .string()
    .min(100, { message: "Content needs to be at least 100 characters" }),
  score: z
    .number()
    .min(1, { message: "Minimum score is 1" })
    .max(10, { message: "Maximum score is 10" }),
});

export default function EvaluationCard({
  evaluation: initialEvaluation,
  ...props
}) {
  const params = useParams();
  const [evaluation, setEvaluation] = useState(initialEvaluation);
  const form = useForm({
    initialValues: {
      feedback: evaluation?.feedback ?? "",
      edit: evaluation?.edit ?? "",
      score: evaluation?.score ?? null,
    },
    validate: zodResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient();

  const handleCreate = async (payload) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("evaluation")
        .insert({
          id: params.id,
          ...payload,
        })
        .select();
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      notifications.show({
        title: "Evaluation submitted",
        message: "Thank you for your evaluation!",
      });
      setEvaluation(payload);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error submitting evaluation, please try again",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder fullWidth {...props}>
      <Title>Your Thoughts</Title>
      <form onSubmit={form.onSubmit(handleCreate)}>
        <Textarea
          required
          label="Comment"
          placeholder="Give your comment on user's content e.g. whether it's understandable, any grammar mistakes, how can user improve it"
          autosize
          minRows={2}
          mt="sm"
          // TODO: allow edit feedback in the future
          disabled={evaluation}
          {...form.getInputProps("feedback")}
        />
        <Textarea
          required
          label="How would you have expressed what the author wanted to express?"
          placeholder="Basically your own version if you were to express what the author wanted to express, it shouldn't deviate too far from original meaning"
          autosize
          minRows={4}
          mt="sm"
          // TODO: allow edit feedback in the future
          disabled={evaluation}
          {...form.getInputProps("edit")}
        />
        <NumberInput
          required
          label="Score"
          placeholder="Score from 1 to 10"
          min={1}
          max={10}
          allowDecimal={false}
          mt="sm"
          // TODO: allow edit feedback in the future
          disabled={evaluation}
          {...form.getInputProps("score")}
        />
        {/* TODO: allow edit feedback in the future */}
        {!evaluation && (
          <Group justify="flex-end" mt="md">
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </Group>
        )}
      </form>
    </Card>
  );
}
