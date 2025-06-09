"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  createdAt: string;
  answers: Array<{
    id: string;
    content: string;
    isCorrect: boolean;
    createdAt: string;
    user: {
      id: string;
      username: string;
      role: string;
    };
  }>;
}

const AnalyticsPage = () => {
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

  // Fetch all questions with answers
  const { data: questions, isLoading: isLoadingQuestions } = useQuery<Question[]>({
    queryKey: ["allQuestionsAnalytics"],
    queryFn: async () => {
      const res = await axios.get("/api/questions");
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
            <p>คุณไม่มีสิทธิ์ดูสถิติและรายงาน</p>
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

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Calculate analytics data
  const totalQuestions = questions?.length || 0;
  const activeQuestions = questions?.filter(q => q.status === "production").length || 0;
  
  // User answers only (exclude admin answers)
  const allUserAnswers = questions?.flatMap(q => 
    q.answers?.filter(a => a.user.role !== "admin")
  ) || [];
  
  const totalUserAnswers = allUserAnswers.length;
  const correctAnswers = allUserAnswers.filter(a => a.isCorrect).length;
  const incorrectAnswers = totalUserAnswers - correctAnswers;
  const overallAccuracy = totalUserAnswers > 0 ? (correctAnswers / totalUserAnswers) * 100 : 0;

  // Calculate question-wise accuracy
  const questionAccuracy = questions?.map(question => {
    const userAnswers = question.answers?.filter(a => a.user.role !== "admin");
    const correct = userAnswers.filter(a => a.isCorrect).length;
    const total = userAnswers.length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    
    return {
      id: question.id,
      content: question.content.substring(0, 50) + (question.content.length > 50 ? "..." : ""),
      totalAnswers: total,
      correctAnswers: correct,
      accuracy: accuracy,
    };
  }).filter(q => q.totalAnswers > 0) || [];

  // Get unique users who answered
  const uniqueUsers = new Set(allUserAnswers.map(a => a.user.id));
  const totalActiveUsers = uniqueUsers.size;

  // Top performing questions (by accuracy)
  const topQuestions = [...questionAccuracy]
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 5);

  // Worst performing questions (by accuracy)
  const worstQuestions = [...questionAccuracy]
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="btn btn-ghost mb-4"
          >
            ← ย้อนกลับ
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">สถิติและรายงาน</h1>
          <p className="text-gray-600">ข้อมูลภาพรวมของระบบคำถาม-คำตอบ</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-white">คำถามทั้งหมด</h2>
              <div className="text-4xl font-bold">{totalQuestions}</div>
              <div className="text-blue-100">เปิดใช้งาน: {activeQuestions}</div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-white">คำตอบทั้งหมด</h2>
              <div className="text-4xl font-bold">{totalUserAnswers}</div>
              <div className="text-green-100">จากผู้ใช้</div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-white">ผู้ใช้ที่เข้าร่วม</h2>
              <div className="text-4xl font-bold">{totalActiveUsers}</div>
              <div className="text-purple-100">ผู้ใช้งานที่ตอบคำถาม</div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-white">ความแม่นยำรวม</h2>
              <div className="text-4xl font-bold">{overallAccuracy.toFixed(1)}%</div>
              <div className="text-orange-100">
                {correctAnswers}/{totalUserAnswers} ถูกต้อง
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Answer Distribution */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">การกระจายคำตอบ</h2>
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{overallAccuracy.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">ความแม่นยำ</div>
                    </div>
                  </div>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${overallAccuracy * 2.51} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>ถูกต้อง ({correctAnswers})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>ผิด ({incorrectAnswers})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Questions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">คำถามที่ตอบถูกมากที่สุด</h2>
              <div className="space-y-4">
                {topQuestions.map((question, index) => (
                  <div key={question.id} className="flex items-center gap-4">
                    <div className="badge badge-primary badge-lg">{index + 1}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium truncate">{question.content}</div>
                      <div className="text-xs text-gray-500">
                        {question.correctAnswers}/{question.totalAnswers} คำตอบ
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {question.accuracy.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
                {topQuestions.length === 0 && (
                  <p className="text-gray-500 text-center">ยังไม่มีข้อมูลคำตอบ</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Question Performance Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">ประสิทธิภาพคำถาม</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>คำถาม</th>
                    <th>คำตอบทั้งหมด</th>
                    <th>คำตอบที่ถูก</th>
                    <th>ความแม่นยำ</th>
                    <th>ระดับความยาก</th>
                  </tr>
                </thead>
                <tbody>
                  {questionAccuracy
                    .sort((a, b) => b.totalAnswers - a.totalAnswers)
                    .map((question) => {
                      let difficultyLevel = "";
                      let difficultyColor = "";
                      if (question.accuracy >= 80) {
                        difficultyLevel = "ง่าย";
                        difficultyColor = "badge-success";
                      } else if (question.accuracy >= 50) {
                        difficultyLevel = "ปานกลาง";
                        difficultyColor = "badge-warning";
                      } else {
                        difficultyLevel = "ยาก";
                        difficultyColor = "badge-error";
                      }

                      return (
                        <tr key={question.id}>
                          <td>
                            <div className="max-w-xs truncate" title={question.content}>
                              {question.content}
                            </div>
                          </td>
                          <td>
                            <div className="badge badge-outline">{question.totalAnswers}</div>
                          </td>
                          <td>
                            <div className="badge badge-success">{question.correctAnswers}</div>
                          </td>
                          <td>
                            <div className="font-bold">
                              {question.accuracy.toFixed(1)}%
                            </div>
                          </td>
                          <td>
                            <div className={`badge ${difficultyColor}`}>
                              {difficultyLevel}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {questionAccuracy.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">ยังไม่มีข้อมูลคำตอบ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;