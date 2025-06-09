"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";

interface AnswersPageProps {
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
  answers: Array<{
    id: string;
    content: string;
    isCorrect: boolean;
    createdAt: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  }>;
}

const ViewAnswersPage: React.FC<AnswersPageProps> = ({ params }) => {
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

  // Fetch question and answers data
  const { data: questionData, isLoading: isLoadingQuestion } = useQuery<Question>({
    queryKey: ["questionAnswers", params.id],
    queryFn: async () => {
      const res = await axios.get(`/api/questions/${params.id}`);
      return res.data;
    },
    enabled: currentUserData?.role === "admin",
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
            <p>คุณไม่มีสิทธิ์ดูคำตอบของผู้ใช้</p>
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

  // Filter user answers (non-admin answers)
  const userAnswers = questionData.answers?.filter(a => a.user.role !== "admin") || [];
  const adminAnswers = questionData.answers?.filter(a => a.user.role === "admin") || [];
  
  const totalAnswers = userAnswers.length;
  const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
  const incorrectAnswers = totalAnswers - correctAnswers;
  const accuracyRate = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="btn btn-ghost mb-4"
          >
            ← ย้อนกลับ
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">คำตอบของผู้ใช้</h1>
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl">คำถาม:</h2>
              <p className="text-lg text-gray-700">{questionData.content}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm">คำตอบทั้งหมด</h2>
              <div className="text-3xl font-bold text-primary">{totalAnswers}</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm">คำตอบที่ถูกต้อง</h2>
              <div className="text-3xl font-bold text-success">{correctAnswers}</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm">คำตอบที่ผิด</h2>
              <div className="text-3xl font-bold text-error">{incorrectAnswers}</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm">อัตราความถูกต้อง</h2>
              <div className="text-3xl font-bold text-info">{accuracyRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Admin Answers (Correct Answers) */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">เฉลย (คำตอบที่ถูกต้อง)</h2>
            <div className="grid gap-3">
              {adminAnswers.map((answer, index) => (
                <div 
                  key={answer.id} 
                  className={`alert ${answer.isCorrect ? 'alert-success' : 'alert-warning'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="badge badge-lg">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{answer.content}</span>
                    <span className="badge">
                      {answer.isCorrect ? 'ถูกต้อง ✓' : 'ผิด ✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Answers */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">คำตอบของผู้ใช้ ({totalAnswers} คำตอบ)</h2>
            
            {totalAnswers === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">ยังไม่มีผู้ใช้ตอบคำถามนี้</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>ผู้ใช้</th>
                      <th>คำตอบ</th>
                      <th>ผลลัพธ์</th>
                      <th>วันที่ตอบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userAnswers
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((answer) => (
                      <tr key={answer.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                <span className="text-xs">
                                  {answer.user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{answer.user.username}</div>
                              <div className="text-sm opacity-50">{answer.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="max-w-xs">
                            {answer.content}
                          </div>
                        </td>
                        <td>
                          <div className={`badge ${answer.isCorrect ? 'badge-success' : 'badge-error'}`}>
                            {answer.isCorrect ? '✓ ถูกต้อง' : '✗ ผิด'}
                          </div>
                        </td>
                        <td>
                          <div className="text-sm">
                            {dayjs(answer.createdAt).format("DD/MM/YYYY HH:mm")}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnswersPage;