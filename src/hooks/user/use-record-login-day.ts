import { useMutation } from "@tanstack/react-query";
import { recordLoginDay } from "@/api/user-login-day";

/**
 * Mutation hook to record today's login
 */
export const useRecordLoginDay = () =>
  useMutation({
    mutationFn: recordLoginDay,
  });
