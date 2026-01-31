import {
  type RegistrationFormValues,
  RegistrationForm,
} from "@/components/auth/form/registration-form";
import { useSignUpWithEmail } from "@/hooks/use-sign-up-email";
import { useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";

export const RegistrationPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const mutation = useSignUpWithEmail();
  const navigate = useNavigate();

  const handleSubmit = async (values: RegistrationFormValues) => {
    setError(null);
    try {
      await mutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      navigate({
        to: "/verify-email",
        search: { email: values.email },
      });
    } catch (e) {
      console.error(e);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <RegistrationForm
      onSubmit={handleSubmit}
      isSubmitting={mutation.isPending}
      errorMessage={error}
    />
  );
};
