"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      // ignore if session has already expired
      if (!session || session.expires_at * 1000 > Date.now()) {
        setUser(session?.user ?? null);
        isLoading && setIsLoading(false);
        if (!session?.user) {
          isFetchingProfile && setIsFetchingProfile(false);
          profile && setProfile(null);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      !isFetchingProfile && setIsFetchingProfile(true);
      supabase
        .from("profile")
        .select(
          `
          first_name,
          last_name,
          languages_fluent,
          country
        `,
        )
        .eq("id", user.id)
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
          }
          setProfile(data[0]);
          isFetchingProfile && setIsFetchingProfile(false);
        });
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isFetchingProfile, profile, setProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
