"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import QuestionAnswerForm from "../components/QuestionAnswerForm";
import BackButton from "../components/BackButton";
import { FormInputAnswer, FormInputPost } from "../types";

interface User {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  role: string;
}

function CreatePage() {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is admin
  const { data: currentUserData, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["currentUser", user?.id],
    queryFn: async () => {
      const res = await axios.get(`/api/users/${user?.id}`);
      return res.data;
    },
    enabled: !!user?.id,
  });

  const createQuestionWithAnswers = async (data: { 
    question: Omit<FormInputPost, 'id'> & { id?: string }; 
    answers: Omit<FormInputAnswer, 'questionId' | 'userId'>[] 
  }): Promise<string> => {
    setIsSubmitting(true);
    try {
      // First, create the question
      const questionResponse = await axios.post("/api/questions/create", data.question);
      const questionId = questionResponse.data.id;

      // Then, create answers for the question
      const answersPromises = data.answers.map(answer => 
        axios.post("/api/answers/create", {
          ...answer,
          questionId,
          userId: data.question.userId
        })
      );

      await Promise.all(answersPromises);
      
      return questionId;
    } catch (error) {
      console.error("Error creating question with answers:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const { mutate: createQuestion } = useMutation({
    mutationFn: createQuestionWithAnswers,
    onSuccess: (questionId) => {
      router.push(`/`);
      router.refresh();
    },
    onError: (error) => {
      console.error("Error:", error);
      alert("Failed to create question. Please try again.");
    }
  });

  const handleSubmit = async (data: { 
    question: Omit<FormInputPost, 'id'> & { id?: string }; 
    answers: FormInputAnswer[] 
  }) => {
    return createQuestion(data);
  };

  // Show loading state
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Check if user is admin
  if (currentUserData?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="card-title justify-center">ไม่มีสิทธิ์เข้าถึง</h2>
            <p className="text-gray-600 mb-4">
              เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถสร้างคำถามได้
            </p>
            <div className="card-actions justify-center">
              <button 
                onClick={() => router.push("/")}
                className="btn btn-primary"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-2xl my-4 font-bold text-center">เพิ่มคำถามและคำตอบ</h1>
      <QuestionAnswerForm 
        submit={handleSubmit} 
        isEditing={false} 
      />
    </div>
  );
}

export default CreatePage;
