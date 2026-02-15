import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { getCurrentUserId } from "./auth";
import { type UserStats } from "@/model/user-stats";
import { getLoginDaysCount } from "./user-login-day";

const client = generateClient<Schema>();

/**
 * Get user statistics including hours studied, modules completed, and days logged in
 */
export const getUserStats = async (): Promise<UserStats> => {
  await getCurrentUserId();

  const contentProgressResult = await client.models.UserContentProgress.list({
    filter: { isCompleted: { eq: true } },
    selectionSet: ["contentId"],
  });

  const completedContentIds = new Set(
    contentProgressResult.data?.map((p) => p.contentId) ?? []
  );

  let totalSeconds = 0;
  for (const contentId of completedContentIds) {
    const contentResult = await client.models.Content.get({ id: contentId });
    if (contentResult.data?.durationInSeconds) {
      totalSeconds += contentResult.data.durationInSeconds;
    }
  }

  const moduleProgressResult = await client.models.UserModuleProgress.list({
    selectionSet: ["completionDate"],
  });

  const completedModules =
    moduleProgressResult.data?.filter((p) => p.completionDate != null).length ??
    0;

  const totalDaysLoggedIn = await getLoginDaysCount();

  return {
    totalHoursStudied: Math.round((totalSeconds / 3600) * 10) / 10,
    totalModulesCompleted: completedModules,
    totalDaysLoggedIn,
  };
};
