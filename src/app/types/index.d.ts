export type FormInputPost = {
  content: string;
  userId: string;
  status: string;
};

export type FormInputAnswer = {
  content: string;
  isCorrect: boolean;
  questionId: string;
  userId: string;
};
