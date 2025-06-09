"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import GameQuizInterface from "../../components/GameQuizInterface";
import UserSendForm from "../../components/UserSendForm";
import BackButton from "../../components/BackButton";

interface QuestionIdProps {
  params: {
    id: string;
  };
}

function UserCreateAnswerPage({ params }: QuestionIdProps) {
  // Fetch question to check if it has admin answers
  const { data: question, isLoading } = useQuery({
    queryKey: ["question", params.id],
    queryFn: async () => {
      const res = await axios.get(`/api/questions/${params.id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Check if question has admin answers (multiple choice options)
  const adminAnswers = question?.answers?.filter(
    (answer: any) => answer.user.role === "admin"
  ) || [];

  // If there are admin answers, use the new game interface
  // Otherwise, fall back to the old form
  if (adminAnswers.length > 0) {
    return <GameQuizInterface questionId={params.id} />;
  }

  // Fallback to old interface
  return (
    <div>
      <BackButton />
      <h1 className="text-2xl my-4 font-bold text-center"> 
        คำถาม: {question?.content}?
      </h1>
      {isLoading ? (
        <p className="text-center">Loading points...</p>
      ) : (
        <p className="text-md my-2 text-center text-gray-600">
          Points for correct answer: {question?.rewardPoints ?? 5} 🥳
        </p>
      )}
      <UserSendForm questionId={params.id} />
    </div>
  );
  
}

export default UserCreateAnswerPage;
