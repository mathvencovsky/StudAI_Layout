import { PasswordResetForm, type PasswordResetValues } from "@/components/auth/form/password-reset-form";
import { usePasswordReset } from "@/hooks/use-password-reset";
import React, { useState } from "react";

export const PasswordResetPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const mutation = usePasswordReset();

    const handleSubmit = async (values: PasswordResetValues) => {
        setError(null);
        setSuccess(null);
        try {
            await mutation.mutateAsync({ email: values.email });
            setSuccess("If an account exists for that email, a reset link has been sent.");
        } catch (e) {
            console.error(e)
            setError("Could not send reset email. Please try again later.");
        }
    };

    return (
        <PasswordResetForm
            onSubmit={handleSubmit}
            isSubmitting={mutation.isPending}
            successMessage={success}
            errorMessage={error}
        />
    );
};