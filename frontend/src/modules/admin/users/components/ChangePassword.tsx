import { Button } from "@/common/components/Button";
import { Input } from "@/common/components/Input";
import React, { useState } from "react";

interface ChangePasswordProps {
  onSubmit: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password must match");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(form);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Change Password</h3>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Current Password"
          type="password"
          value={form.currentPassword}
          onChange={(e) =>
            handleChange("currentPassword", e.target.value)
          }
          required
        />

        <Input
          label="New Password"
          type="password"
          value={form.newPassword}
          onChange={(e) =>
            handleChange("newPassword", e.target.value)
          }
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) =>
            handleChange("confirmPassword", e.target.value)
          }
          required
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button type="submit" loading={loading}>
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;