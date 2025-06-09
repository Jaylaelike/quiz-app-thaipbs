export type FormInputPost = {
  content: string;
  userId: string;
  status: string;
  rewardPoints?: number; // Optional, as it might not always be provided
};

export type FormInputAnswer = {
  content: string;
  isCorrect: boolean;
  questionId: string;
  userId: string;
};

export type FormInputReward = {
  points: number;
  userId: string;
};
