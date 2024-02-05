"use client";
import React from "react";
import AnswerFormPost from "../../components/AnswerFormPost";
import BackButton from "../../components/BackButton";
import { SubmitHandler } from "react-hook-form";
import { FormInputAnswer } from "../../types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

interface QuestionIdProps {
  params: {
    id: string;
  };
}

function CreateAnswerPage({ params }: QuestionIdProps) {
  const handleCreateAnswer: SubmitHandler<FormInputAnswer> = async (data) => {
    createAnswer(data);
  };

  const router = useRouter();

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
  return (
    <div>
      <BackButton />
      <h1 className="text-2xl my-4 font-bold text-center">เพิ่มคำตอบ</h1>
      <AnswerFormPost
        submit={handleCreateAnswer}
        isEditing={false}
        questionId= {params.id}
      />
    </div>
  );
}

export default CreateAnswerPage;
