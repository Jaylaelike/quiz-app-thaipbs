"use client";
import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import QuestionAnswerForm from "../../../../components/QuestionAnswerForm";
import { FormInputPost, FormInputAnswer } from "../../../../types";

interface EditQuestionPageProps {
  params: {
    id: string;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  role: string;
}

interface Question {
  id: string;
  content: string;
  status: string;
  rewardPoints?: number;
  userId: string;
  answers: Array<{
    id: string;
    content: string;
    isCorrect: boolean;
    userId: string;
    user: {
      role: string;
    };
  }>;
}

const EditQuestionPage: React.FC<EditQuestionPageProps> = ({ params }) => {
  const { user } = useUser();
  const router = useRouter();

  // Check if user is admin
  const { data: currentUserData, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["currentUser", user?.id],
    queryFn: async () => {
      const res = await axios.get(`/api/users/${user?.id}`);
      return res.data;
    },
    enabled: !!user?.id,
  });

  // Fetch question data
  const { data: questionData, isLoading: isLoadingQuestion } = useQuery<Question>({
    queryKey: ["question", params.id],
    queryFn: async () => {
      const res = await axios.get(`/api/questions/${params.id}`);
      return res.data;
    },
    enabled: currentUserData?.role === "admin",
  });

  // Update question mutation
  const { mutate: updateQuestion } = useMutation({
    mutationFn: async (data: { question: FormInputPost; answers: FormInputAnswer[] }) => {
      // Update question
      await axios.patch(`/api/questions/${params.id}`, {
        content: data.question.content,
        status: data.question.status,
        rewardPoints: data.question.rewardPoints,
      });

      // Delete existing admin answers
      const adminAnswers = questionData?.answers?.filter(a => a.user.role === "admin") || [];
      for (const answer of adminAnswers) {
        await axios.delete(`/api/answers/${answer.id}`);
      }

      // Create new admin answers
      for (const answer of data.answers) {
        await axios.post("/api/answers/create", {
          ...answer,
          questionId: params.id,
          userId: user?.id,
        });
      }
    },
    onSuccess: () => {
      router.push("/admin");
    },
    onError: (error) => {
      console.error("Error updating question:", error);
    },
  });

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (currentUserData?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title">ไม่มีสิทธิ์เข้าถึง</h2>
            <p>คุณไม่มีสิทธิ์แก้ไขคำถาม</p>
            <div className="card-actions justify-center">
              <button onClick={() => router.back()} className="btn btn-primary">
                ย้อนกลับ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title">ไม่พบคำถาม</h2>
            <p>ไม่พบคำถามที่ต้องการแก้ไข</p>
            <div className="card-actions justify-center">
              <button onClick={() => router.back()} className="btn btn-primary">
                ย้อนกลับ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const adminAnswers = questionData.answers?.filter(a => a.user.role === "admin") || [];

  const initialQuestion: FormInputPost = {
    content: questionData.content,
    status: questionData.status,
    userId: questionData.userId,
    rewardPoints: questionData.rewardPoints,
  };

  const initialAnswers: FormInputAnswer[] = adminAnswers.map(answer => ({
    content: answer.content,
    isCorrect: answer.isCorrect,
    questionId: params.id,
    userId: answer.userId,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="btn btn-ghost mb-4"
          >
            ← ย้อนกลับ
          </button>
          <h1 className="text-3xl font-bold text-gray-900">แก้ไขคำถาม</h1>
        </div>

        <QuestionAnswerForm
          submit={updateQuestion}
          isEditing={true}
          initialQuestion={initialQuestion}
          initialAnswers={initialAnswers}
        />
      </div>
    </div>
  );
};

export default EditQuestionPage;