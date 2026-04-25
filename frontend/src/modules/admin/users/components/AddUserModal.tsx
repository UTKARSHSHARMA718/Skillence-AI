"use client";

import CommonModal from "@/common/components/CommonModal";
import { Button } from "@/common/components/Button";
import { Input } from "@/common/components/Input";
import useGetUserProfiles from "../hooks/useGetUserProfiles";
import useAddUser from "../hooks/useAddUser";
import { Select } from "@/common/components/Select";
import { UserProfile } from "../users.type";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "../schema/auth.schema";

export default function AddUserModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate: addUser, isPending } = useAddUser({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      onClose();
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: userProfiles } = useGetUserProfiles();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
      profile: "HR",
    },
  });

  const profileOptions =
    userProfiles?.data?.profiles?.map((p: UserProfile) => ({
      label: p.name,
      value: p.slug,
    })) ?? [];

  const onAddUser = (data: LoginFormValues) => {
    addUser({
      name: data.name,
      email: data.email,
      profile: data.profile,
    });
  };

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title="Add User">
      <form onSubmit={handleSubmit(onAddUser)} className="space-y-4">
        <Input
          label="Name"
          placeholder="Name"
          {...register("name")}
          error={errors.name}
        />

        <Input
          label="Email"
          placeholder="Email"
          {...register("email")}
          error={errors.email}
        />

        {profileOptions.length > 0 && (
          <Select
            label="Profile"
            options={profileOptions}
            value={watch("profile")}
            onChange={(value) => setValue("profile", value)}
            error={errors.profile}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button variant="secondary"  type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add"}
          </Button>
        </div>
      </form>
    </CommonModal>
  );
}
