import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({ email: z.email("Enter a valid email") });
export type PasswordResetValues = z.infer<typeof schema>;

export interface PasswordResetFormProps {
    onSubmit: (values: PasswordResetValues) => void;
    isSubmitting: boolean;
    successMessage: string | null;
    errorMessage: string | null;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
    onSubmit,
    isSubmitting,
    successMessage,
    errorMessage,
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<PasswordResetValues>({
        resolver: zodResolver(schema),
    });

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Reset your password</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" autoComplete="email" {...register("email")} />
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    {successMessage ? (
                        <p className="text-sm text-green-700">{successMessage}</p>
                    ) : null}
                    {errorMessage ? (
                        <p className="text-sm text-red-600" role="alert">{errorMessage}</p>
                    ) : null}

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Sending…" : "Send reset link"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
