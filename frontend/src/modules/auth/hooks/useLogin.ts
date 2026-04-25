"use client";

import { getSession, signIn } from "next-auth/react";
import { useState } from "react";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    const session = await getSession();
    
    setLoading(false);

    return {...res, role: session?.user?.role };
  };

  return { login, loading };
};