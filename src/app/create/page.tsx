"use client";
import React from "react";
import FormPost from "../components/FormPost";

import { SubmitHandler } from "react-hook-form";
import { FormInputAnswer, FormInputPost } from "../types";
import BackButton from "../components/BackButton";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import AnswerFormPost from "../components/AnswerFormPost";

function CreatePage() {
  const handleCreatePost: SubmitHandler<FormInputPost> = async (data) => {
    createPost(data);
  };

  

  const router = useRouter();

  const { mutate: createPost } = useMutation({
    mutationFn: (newPost: FormInputPost) => {
      return axios.post("/api/questions/create", newPost);
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
      <h1 className="text-2xl my-4 font-bold text-center">เพิ่มคำถาม</h1>
      <FormPost submit={handleCreatePost} isEditing={false} />
    </div>
  );
}

export default CreatePage;
