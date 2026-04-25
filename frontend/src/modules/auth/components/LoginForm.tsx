"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/common/components/Input";
import { Button } from "@/common/components/Button";
import { AuthCard } from "./AuthCard";
import { useLogin } from "../hooks/useLogin";
import Logo from "@/common/components/Logo";
import { toast } from "react-toastify";
import Link from "next/link";

export const LoginForm = () => {
  const router = useRouter();
  const { login, loading } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await login(email, password);

    if (res?.ok) {
      if (res.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/candidate/dashboard");
      }
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <AuthCard className="w-full max-w-125 min-w-112">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="bg-[#1E3A8A] px-3 py-1 rounded">
          <Logo />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Forgot password */}
        <div className="text-right -mt-2">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Button */}
        <Button
          type="submit"
          loading={loading}
          className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 rounded-lg py-2.5 font-medium"
        >
          Sign In
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        🔒 Secure Login <span className="text-gray-400">by HestaBit</span>
      </div>
    </AuthCard>
  );
};
