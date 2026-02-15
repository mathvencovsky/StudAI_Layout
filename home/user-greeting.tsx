import { useTranslation } from "react-i18next";

export interface UserGreetingProps {
  displayName?: string;
}

type GreetingKey = "greeting-morning" | "greeting-afternoon" | "greeting-evening";

/**
 * Returns time-based greeting key based on current hour
 */
const getGreetingKey = (): GreetingKey => {
  const hour = new Date().getHours();
  if (hour < 12) return "greeting-morning";
  if (hour < 18) return "greeting-afternoon";
  return "greeting-evening";
};

/**
 * Displays a time-based personalized greeting
 */
export const UserGreeting = ({ displayName }: UserGreetingProps) => {
  const { t } = useTranslation();
  const name = displayName ?? t("user");

  return (
    <h1 className="text-3xl font-bold">{t(getGreetingKey(), { name })}</h1>
  );
};
