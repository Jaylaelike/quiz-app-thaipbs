"use client";
import React, { FC } from "react";
// import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FormInputAnswer, FormInputReward } from "../types";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useRouter } from "next/navigation";
import JSConfetti from "js-confetti";
import { on } from "events";

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
  const { userId } = useAuth();
  // const { register, handleSubmit, control } = useForm<FormInputAnswer>({
  //   defaultValues: initalValue,
  // });

  const [isCorrect, setIsCorrect] = React.useState(null);

  const [content, setContent] = React.useState("");

  const [onsubmit, setOnsubmit] = React.useState(false);

 // const [isButtonClicked, setIsButtonClicked] = React.useState(false);

  // console.log(isCorrect);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(isCorrect);
    createAnswer({
      userId: userId || "",
      questionId: questionId || "",
      content: content,
      isCorrect: isCorrect,
    });

    if (isCorrect === true) {
      updateReward({
        points: dataReward?.Rewards[0].points + 10,
        userId: userId || "",
      });
    }
    if (isCorrect === false) {
      updateReward({
        points: dataReward?.Rewards[0].points + 5,
        userId: userId || "",
      });
    }

  };

  const router = useRouter();

  //create post data
  const { mutate: createAnswer, isPending: createAnswerLoading } = useMutation({
    mutationFn: (newPost: FormInputAnswer) => {
      return axios.post("/api/answers/create", newPost);
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
    //  console.log(data);
      router.push("/");
      router.refresh();
      setOnsubmit(true);
    },
  });

  //create update reward data by id
  const { mutate: updateReward } = useMutation({
    mutationFn: (newPost: FormInputReward) => {
      return axios.patch(`/api/rewards/${dataReward?.Rewards[0].id}`, newPost);
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
    //  console.log(data);
      router.push("/");
      router.refresh();
    },
  });

  //fetch rewardId by userId
  const { data: dataReward, isLoading: isLoadingReward } = useQuery({
    queryKey: ["Rewards", userId],
    queryFn: async () => {
      const res = await axios.get(`/api/users/${userId}`);
      return res.data;
    },
  });

  // console.log(dataReward?.Rewards[0].points);
  // console.log(dataReward?.Rewards[0].id);

  //fetch answer of question by questionId
  const { data: dataAnswers, isLoading: isLoadingAnswers } = useQuery({
    queryKey: ["Answers", questionId],
    queryFn: async () => {
      const res = await axios.get(`/api/questions/${questionId}`);
      return res.data;
    },
  });
  //console.log(dataAnswers);

  //filter answer by role  of user is "admin" this data
  // {
  //   id: "clsfl3vm90001rk06mq3nffub",
  //   content: "นายกคือใคร",
  //   userId: "user_2Y4Ookbfem91BKQT1RNiSdWA3Gc",
  //   status: "production",
  //   createdAt: "2024-02-10T04:36:36.945Z",
  //   user: {
  //   id: "user_2Y4Ookbfem91BKQT1RNiSdWA3Gc",
  //   username: "Sittichai",
  //   email: "smarkwisai@gmail.com",
  //   imageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWTRPb2hZUXpHNnVraFNhNlYxNmxXSndTVzkifQ",
  //   role: "admin"
  //   },
  //   Answers: [
  //   {
  //   id: "clsfl44hg0003rk06m0v0r50v",
  //   content: "พิธา",
  //   isCorrect: true,
  //   questionId: "clsfl3vm90001rk06mq3nffub",
  //   userId: "user_2Y4Ookbfem91BKQT1RNiSdWA3Gc",
  //   createdAt: "2024-02-10T04:36:48.436Z"
  //   },
  //   {
  //   id: "clsfl48xf0005rk064eb0zh9x",
  //   content: "ลุงตู่",
  //   isCorrect: false,
  //   questionId: "clsfl3vm90001rk06mq3nffub",
  //   userId: "user_2Y4Ookbfem91BKQT1RNiSdWA3Gc",
  //   createdAt: "2024-02-10T04:36:54.195Z"
  //   }
  //   ]
  //   }
  const answerIdbyUserId = dataAnswers?.Answers.filter(
    (answer) => answer.user.role === "admin"
  );

  // //create  loading of onsubmit wait for done
  // if (onsubmit === true) {
  //   <div>
  //     <>
  //       <span className="loading loading-lg"></span>
  //     </>
  //   </div>;
  // }

  // console.log(answerIdbyUserId);

  if (onsubmit) {
    const confetti = new JSConfetti();
    if (isCorrect === true) {
      confetti.addConfetti();
    }
    if (isCorrect === false) {
      // console.log("false");
      confetti.addConfetti({
        emojis: ["❌"],
      });
    }
  }

  //create useEffect for play audio on submit form url
  React.useEffect(() => {
    if (onsubmit === true) {
      if (isCorrect === true) {
        const audio = new Audio(
          "https://smongmtkwekplybenfjr.supabase.co/storage/v1/object/public/audio/True_answer.mp3"
        );
        audio.play();
      }
      if (isCorrect === false) {
        const audio = new Audio(
          "https://smongmtkwekplybenfjr.supabase.co/storage/v1/object/public/audio/Fail_answer.mp3"
        );
        audio.play();
      }
    }
  }, [onsubmit]);

  return (
    <>
      {onsubmit === true && isCorrect === true && (
        <div role="alert" className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>เย้! ยินดีด้วยคุณตอบถูก ได้รับ 10 คะแนน</span>
        </div>
      )}

      {onsubmit === true && isCorrect === false && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>เสียใจด้วยคุณตอบผิด ได้รับ 5 คะแนน</span>
        </div>
      )}

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

{createAnswerLoading ? ( <span className="loading loading-lg"></span>): (
  <>

  {onsubmit ? (null) :(<>
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
  </>)}
     
  </>
)}
     

        {createAnswerLoading ? (
          <span className="loading loading-lg"></span>
        ) : (
          <button
            type="submit"
            className="btn btn-warning w-full max-w-lg"
            disabled={
              isCorrect === null ||
              isLoadingAnswers ||
              isLoadingReward ||
              onsubmit ||
              createAnswerLoading
            }
            // onClick={() => 
            //   {
            //     setOnsubmit(true)
            //     setIsButtonClicked(true)
            //   }
            // }
            

            
          >
            ส่งคำตอบ
          </button>
        )}
      </form>
    </>
  );
};
export default UserSendForm;
