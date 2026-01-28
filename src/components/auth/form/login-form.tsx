import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof schema>;

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  onGoogle: (remember: boolean) => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onGoogle,
  onForgotPassword,
  onSignUp,
  isSubmitting,
  errorMessage,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { remember: false },
  });

  const remember = useWatch({ name: "remember", control }) ?? false;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox {...register("remember")} />
              Remember Me
            </label>
            <button
              type="button"
              className="text-sm underline"
              onClick={onForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {errorMessage ? (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onSignUp}
          >
            Sign Up
          </Button>
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
              onClick={() => onGoogle(remember)}
            >
              Continue with Google
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
