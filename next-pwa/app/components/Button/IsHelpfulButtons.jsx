"use client";

import { Button, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import { useState } from "react";

export function IsHelpfulButtons({ id, user_id, initialState }) {
  const supabase = createClientComponentClient();
  const [isHelpful, setIsHelpful] = useState(initialState);

  const handleClick = async (value) => {
    setIsHelpful(value);
    const { error } = await supabase
      .from("evaluation")
      .update({ is_helpful: value })
      .match({ id, user_id });
    if (error) {
      supabase
        .from("evaluation")
        .select("is_helpful")
        .match({ id, user_id })
        .then(({ data: [{ is_helpful } = {}], error }) => {
          if (!error) {
            setIsHelpful(is_helpful);
          } else {
            setIsHelpful(initialState);
          }
          notifications.show({
            color: "red",
            title: `Error marking${
              value === false ? " not " : " "
            }helpful, please try again`,
            message: error.message,
          });
        });
    }
  };

  return (
    <Group align="flex-end" mt="sm">
      <Button
        variant="outline"
        color="green"
        title="Is Helpful"
        onClick={(e) => {
          e.preventDefault();
          handleClick(isHelpful === true ? null : true);
        }}
      >
        {isHelpful === true ? <IconThumbUpFilled /> : <IconThumbUp />}
        <Text>Helpful</Text>
      </Button>
      <Button
        variant="outline"
        color="red"
        title="Is Helpful"
        onClick={(e) => {
          e.preventDefault();
          handleClick(isHelpful === false ? null : false);
        }}
      >
        {isHelpful === false ? <IconThumbDownFilled /> : <IconThumbDown />}
        <Text>Not Helpful</Text>
      </Button>
    </Group>
  );
}
