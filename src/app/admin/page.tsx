"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";

interface Question {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  rewardPoints?: number;
  user: {
    id: string;
    username: string;
    role: string;
  };
  answers: Array<{
    id: string;
    content: string;
    isCorrect: boolean;
    userId: string;
    user: {
      id: string;
      username: string;
      role: string;
    };
  }>;
}

interface User {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  role: string;
}

const AdminDashboard = () => {
  const { user } = useUser();

  // Fetch current user data to check admin role
  const { data: currentUserData, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["currentUser", user?.id],
    queryFn: async () => {
      const res = await axios.get(`/api/users/${user?.id}`);
      return res.data;
    },
    enabled: !!user?.id,
  });

  // Fetch all questions
  const { data: questions, isLoading: isLoadingQuestions, refetch } = useQuery<Question[]>({
    queryKey: ["allQuestions"],
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
            <p>คุณไม่มีสิทธิ์เข้าถึงหน้าผู้ดูแลระบบ</p>
            <div className="card-actions justify-center">
              <Link href="/" className="btn btn-primary">
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (questionId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/questions/${questionId}`, {
        status: newStatus,
      });
      refetch();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบคำถามนี้?")) {
      try {
        await axios.delete(`/api/questions/${questionId}`);
        refetch();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            แดชบอร์ดผู้ดูแลระบบ
          </h1>
          <p className="text-gray-600">จัดการคำถาม คำตอบ และดูสถิติของผู้ใช้</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg">คำถามทั้งหมด</h2>
              <div className="text-3xl font-bold text-primary">
                {questions?.length || 0}
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg">คำถามที่เปิดใช้งาน</h2>
              <div className="text-3xl font-bold text-success">
                {questions?.filter(q => q.status === "production").length || 0}
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg">คำตอบทั้งหมด</h2>
              <div className="text-3xl font-bold text-info">
                {questions?.reduce((acc, q) => acc + (q.answers?.filter(a => a.user.role !== "admin").length || 0), 0) || 0}
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg">คำตอบที่ถูกต้อง</h2>
              <div className="text-3xl font-bold text-warning">
                {questions?.reduce((acc, q) => acc + (q.answers?.filter(a => a.user.role !== "admin" && a.isCorrect).length || 0), 0) || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Link href="/create" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            สร้างคำถามใหม่
          </Link>
          <Link href="/admin/analytics" className="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            ดูสถิติและรายงาน
          </Link>
        </div>

        {/* Questions Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">จัดการคำถาม</h2>
            
            {isLoadingQuestions ? (
              <div className="flex justify-center py-8">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>คำถาม</th>
                      <th>สถานะ</th>
                      <th>คะแนน</th>
                      <th>วันที่สร้าง</th>
                      <th>คำตอบผู้ใช้</th>
                      <th>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions?.map((question) => (
                      <tr key={question.id}>
                        <td>
                          <div className="max-w-xs truncate">
                            {question.content}
                          </div>
                        </td>
                        <td>
                          <select
                            className={`select select-sm ${
                              question.status === "production" 
                                ? "select-success" 
                                : "select-warning"
                            }`}
                            value={question.status}
                            onChange={(e) => handleStatusChange(question.id, e.target.value)}
                          >
                            <option value="draft">Draft</option>
                            <option value="production">Production</option>
                          </select>
                        </td>
                        <td>
                          <div className="badge badge-primary">
                            {question.rewardPoints || 5} คะแนน
                          </div>
                        </td>
                        <td>
                          {dayjs(question.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <div className="badge badge-info">
                              {question.answers?.filter(a => a.user.role !== "admin").length || 0} คำตอบ
                            </div>
                            <div className="badge badge-success">
                              {question.answers?.filter(a => a.user.role !== "admin" && a.isCorrect).length || 0} ถูก
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/questions/${question.id}/edit`}
                              className="btn btn-sm btn-outline btn-primary"
                            >
                              แก้ไข
                            </Link>
                            <Link
                              href={`/admin/questions/${question.id}/answers`}
                              className="btn btn-sm btn-outline btn-info"
                            >
                              ดูคำตอบ
                            </Link>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="btn btn-sm btn-outline btn-error"
                            >
                              ลบ
                            </button>
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

export default AdminDashboard;