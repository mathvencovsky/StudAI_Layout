import { useAuth } from "@/hooks/use-auth";

export const HomePage = () => {
  const { user } = useAuth();
  return <div>Hello, {user?.displayName}</div>;
};
