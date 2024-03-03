"use client";

import { Avatar, Card, List, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";

import CircularProgress from "@/app/components/Loading/CircularProgress";
import { AuthOnly } from "@/app/components/Auth";
import { useAuthContext } from "@/app/hooks/auth";
import EvaluationCard from "./EvaluationCard";
import { IsHelpfulButtons } from "@/app/components/Button";

export default function Page() {
  const params = useParams();
  const { user } = useAuthContext();
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase
      .from("submission")
      .select(
        `
          user_id,
          language,
          title,
          content,
          evaluation (
            user_id,
            edit,
            feedback,
            score,
            is_helpful
          )
        `,
      )
      .eq("id", params.id)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          throw new Error(error.message);
        }
        setSubmission(data[0]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthOnly>
      <CircularProgress isLoading={isLoading}>
        <Title size="h3" fw={700} mt="md">
          Context
        </Title>
        <Text ta="justify">{submission?.title}</Text>
        <Title size="h3" fw={700} mt="md">
          Language
        </Title>
        <Text>{submission?.language}</Text>
        <Title size="h3" fw={700} mt="md">
          Content
        </Title>
        <Text ta="justify">{submission?.content}</Text>
        {user?.id === submission?.user_id ? (
          // show evaluations if user is owner
          <>
            <Title size="h3" fw={700} mt="md">
              Evaluations
            </Title>
            {submission?.evaluation?.length ? (
              <List w="100%" mt="md">
                {submission.evaluation.map((evaluation) => (
                  <Link
                    key={evaluation.user_id}
                    href={`/submission/${params.id}/evaluation/${evaluation.user_id}`}
                  >
                    <List.Item icon={<Avatar />} w="100%" mb="md">
                      <Card>
                        <Title size="h5" fw={700}>
                          Feedback
                        </Title>
                        <Text ta="justify">{submission?.title}</Text>
                        <Title size="h5" fw={700} mt="md">
                          Evaluator&apos;s version
                        </Title>
                        <Text ta="justify">{evaluation?.edit}</Text>
                        <IsHelpfulButtons
                          id={params.id}
                          user_id={evaluation.user_id}
                          initialState={evaluation.is_helpful}
                        />
                      </Card>
                    </List.Item>
                  </Link>
                ))}
              </List>
            ) : (
              <Text>No evaluation yet</Text>
            )}
          </>
        ) : (
          // add evaluation form
          <EvaluationCard
            evaluation={submission?.evaluation.find(
              (evaluation) => evaluation.user_id === user?.id,
            )}
            mt="md"
          />
        )}
      </CircularProgress>
    </AuthOnly>
  );
}
