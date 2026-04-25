"use client";

import { Button } from "@/common/components/Button";
import { Input } from "@/common/components/Input";
import Logo from "@/common/components/Logo";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import React, { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { toast } from "react-toastify";
import Link from "next/link";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const { mutate, isPending, isSuccess, isError, error, data } =
    useForgotPassword({
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message);
      },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    mutate({ email });
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
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Enter your email and we’ll send you a reset link
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />

        <Button
          type="submit"
          loading={isPending}
          className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 rounded-lg py-2.5 font-medium"
        >
          Send Reset Link
        </Button>
      </form>

      {/* Back to login */}
      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>

      {/* States */}
      {isError && (
        <p className="mt-4 text-sm text-red-600 text-center">
          {error?.message}
        </p>
      )}

      {isSuccess && (
        <p className="mt-4 text-sm text-green-600 text-center">
          {data?.message}
        </p>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        🔒 Secure Reset <span className="text-gray-400">by HestaBit</span>
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;
