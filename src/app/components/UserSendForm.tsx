"use client";
import React, { FC } from "react";
// import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FormInputAnswer } from "../types";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import { useRouter } from "next/navigation";

interface FormAnswerProps {
  // submit: SubmitHandler<FormInputAnswer>;
  // isEditing: boolean;
  // initalValue?: FormInputAnswer;
  questionId?: string;
}
const UserSendForm: FC<FormAnswerProps> = ({
  // submit,
  // isEditing,
  // initalValue,
  questionId,
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  // const { register, handleSubmit, control } = useForm<FormInputAnswer>({
  //   defaultValues: initalValue,
  // });

  const [isCorrect, setIsCorrect] = React.useState(null);

  const [content, setContent] = React.useState("");

  // console.log(isCorrect);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(isCorrect);
    createAnswer({
      userId: userId || "",
      questionId: questionId || "",
      content: content,
      isCorrect: isCorrect,
    });
  };

  const router = useRouter();

  //create post data
  const { mutate: createAnswer } = useMutation({
    mutationFn: (newPost: FormInputAnswer) => {
      return axios.post("/api/answers/create", newPost);
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
      router.push("/");
      router.refresh();
    },
  });

  //fetch answer of question by questionId
  const { data: dataAnswers, isLoading: isLoadingAnswers } = useQuery({
    queryKey: ["Answers", questionId],
    queryFn: async () => {
      const res = await axios.get(`/api/questions/${questionId}`);
      return res.data;
    },
  });
  // console.log(dataAnswers?.Answers);

  //filter answer by userId and questionId
  const answerIdbyUserId = dataAnswers?.Answers.filter(
    (answer) => answer.userId === "user_2Y4Ookbfem91BKQT1RNiSdWA3Gc"
  );

  // console.log(answerIdbyUserId);

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center gap-5 mt-10"
    >
      <input
        type="hidden"
        placeholder="Post Title ..."
        className="input input-bordered w-full max-w-lg"
        value={userId || ""}
      />

      <input
        type="hidden"
        placeholder="questionId ..."
        className="input input-bordered w-full max-w-lg"
        value={questionId}
      />

      {answerIdbyUserId?.map((answer) => (
        <div key={answer.id}>
          <input
            type="radio"
            value={answer.content + " " + (answer.isCorrect ? true : false)}
            className="radio radio-primary"
            onChange={() => {
              setIsCorrect(answer.isCorrect ? true : false);

              setContent(answer.content);
            }}
            checked={isCorrect === (answer.isCorrect ? true : false)}
          />

          <span className="label-text">{answer.content}</span>
        </div>
      ))}

      <button type="submit" className="btn btn-warning w-full max-w-lg">
        ส่งคำตอบ
      </button>
    </form>
  );
};
export default UserSendForm;
