"use client";
import React from "react";
import AnswerFormPost from "../../components/AnswerFormPost";
import BackButton from "../../components/BackButton";
import { SubmitHandler } from "react-hook-form";
import { FormInputAnswer } from "../../types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserSendForm from "@/app/components/UserSendForm";
import { useQuery } from "@tanstack/react-query";

interface QuestionIdProps {
  params: {
    id: string;
  };
}

function UserCreateAnswerPage({ params }: QuestionIdProps) {
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


  //fetch content question 
  const { data: question, isLoading: isLoadingQuestion } = useQuery({
    queryKey: ["question", params.id],
    queryFn: async () => {
      const res = await axios.get(`/api/questions/${params.id}`);
      return res.data;
    },
  });

  console.log(question?.content);



  return (
    <div>
      <BackButton />
      <h1 className="text-2xl my-4 font-bold text-center"> 
      คำถาม:  {question?.content}  ?
       </h1>
      <UserSendForm
        // submit={handleCreateAnswer}
        // isEditing={false}
        questionId= {params.id}
      />
    </div>
  );
}

export default UserCreateAnswerPage;
