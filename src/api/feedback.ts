// TODO: migrate to amplify - define proper feedback types
export interface Feedback {
  id: string;
  timestamp: Date;
}

export interface FeedbackStorage {
  // TODO: define feedback storage properties
}

/**
 * Creates a new feedback document in Firestore with URL, user ID, and timestamp.
 * Rating and comment are not stored in the database.
 */
export const createFeedback = async (
  feedback: FeedbackStorage,
): Promise<Feedback> => {
  // TODO: migrate to amplify
  return {} as Feedback;
};
