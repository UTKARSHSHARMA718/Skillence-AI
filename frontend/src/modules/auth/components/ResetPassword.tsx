"use client";

import { useEffect, useState } from "react";
import Logo from "@/common/components/Logo";
import { Button } from "@/common/components/Button";
import { Input } from "@/common/components/Input";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { useResetPassword } from "../hooks/useResetPassword";
import Link from "next/link";

const ResetPassword = () => {
  const [verificationToken, setVerificationToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending, isSuccess, data } = useResetPassword({
    onSuccess: () => {
      setError("");
    },
    onError: (error) => {
      // Try to get the message from error.response.data.message, fallback to error.message
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred.";
      setError(message);
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (token) {
      setVerificationToken(token);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    mutate({
      token: verificationToken,
      newPassword: newPassword,
    });
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
        <h1 className="text-2xl font-semibold text-gray-900">Reset Password</h1>

        <p className="text-sm text-gray-500 mt-1">
          Enter a new password for your account
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          loading={isPending}
          className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 rounded-lg py-2.5 font-medium"
        >
          Reset Password
        </Button>
      </form>

      {/* Back to login */}
      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>

      {/* States */}
      {error && (
        <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
      )}

      {isSuccess && (
        <p className="mt-4 text-sm text-green-600 text-center">
          {data?.message || "Your password has been reset successfully."}
        </p>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        🔒 Secure Reset <span className="text-gray-400">by HestaBit</span>
      </div>
    </AuthCard>
  );
};

export default ResetPassword;
