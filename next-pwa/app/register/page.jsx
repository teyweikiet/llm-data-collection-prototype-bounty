"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextInput, Button, Group, Box, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import { AnonOnly } from "@/app/components/Auth";
import { notifications } from "@mantine/notifications";

const schema = z
  .object({
    username: z
      .string()
      .min(6, { message: "Username must be at least 6 characters" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
  })
  .refine(
    ({ passwordConfirmation, password }) => passwordConfirmation !== password,
    {
      message: "Passwords don't match",
      path: ["passwordConfirmation"],
    },
  );

export default function Register() {
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validate: zodResolver(schema),
  });
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleRegister = async ({ email, username, password }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/profile`,
          data: {
            username,
          },
        },
      });
      if (error) {
        throw new Error(error.message);
      }
      router.refresh();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error registering, please try again",
        message: error.message,
      });
    }
  };

  return (
    <AnonOnly redirectUrl="/profile">
      <Box maw={340} mx="auto" mt="25vh">
        <form onSubmit={form.onSubmit(handleRegister)}>
          <TextInput
            required
            label="Username"
            {...form.getInputProps("username")}
            onChange={async (event) => {
              const { value } = event.target;
              const { onChange } = form.getInputProps("username");
              onChange(event);
              // only check if username meets min length requirement
              if (value.length >= 6) {
                if (form.errors.username === "Username already taken") {
                  form.setErrors({ username: null });
                }
                try {
                  const { data, error } = await supabase
                    .from("profile")
                    .select("username")
                    .eq("username", value);
                  if (error) {
                    throw new Error(error.message);
                  }
                  if (data.length) {
                    form.setErrors({ username: "Username already taken" });
                  }
                  return !data.length;
                } catch (err) {
                  console.error(err);
                  return null;
                }
              }
            }}
          />
          <TextInput
            required
            label="Email"
            type="email"
            {...form.getInputProps("email")}
          />
          <TextInput
            required
            type="password"
            label="Password"
            {...form.getInputProps("password")}
          />
          <TextInput
            required
            type="password"
            label="Confirm Password"
            {...form.getInputProps("passwordConfirmation")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Register</Button>
          </Group>
        </form>
        <Text ta="center" mt="md">
          Already have an account?{" "}
          <Link
            style={{
              textDecoration: "underline",
              color: "lightblue",
            }}
            href={"/login"}
          >
            Login here
          </Link>
        </Text>
      </Box>
    </AnonOnly>
  );
}
