import { type RegistrationFormValues, RegistrationForm } from "@/components/auth/form/registration-form";
import { useSignUpWithEmail } from "@/hooks/use-sign-up-email";
import React, { useState } from "react";

export const RegistrationPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const mutation = useSignUpWithEmail();

    const handleSubmit = async (values: RegistrationFormValues) => {
        setError(null);
        try {
            await mutation.mutateAsync({ email: values.email, password: values.password });
        } catch (e) {
            console.error(e)
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <RegistrationForm onSubmit={handleSubmit} isSubmitting={mutation.isPending} errorMessage={error} />
    );
};
