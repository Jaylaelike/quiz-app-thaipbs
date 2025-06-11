"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import { QuestionManager, UserProgressManager, GameFlowManager } from "../lib/gameLogic";
import LoadingSkeleton from "./LoadingSkeleton";

interface User {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  role: string;
  Rewards: [{
    id: string;
    points: number;
    userId: string;
  }];
}

interface Question {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  rewardPoints?: number;
  user: {
    username: string;
  };
  answers?: Array<{
    id: string;
    content: string;
    isCorrect: boolean;
    userId: string;
    user: {
      id: string;
      role: string;
    };
  }>;
}

const RoleBasedHomePage = () => {
  const { user } = useUser();

  // Fetch current user data
  const { data: currentUserData, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["currentUser", user?.id],
    queryFn: async () => {
      const res = await axios.get(`/api/users/${user?.id}`);
      return res.data;
    },
    enabled: !!user?.id,
  });

  // Fetch questions
  const { data: questions, isLoading: isLoadingQuestions, error: questionsError } = useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: async () => {
      const res = await axios.get("/api/questions");
      return res.data;
    },
    retry: 3,
    retryDelay: 1000,
  });

  if (isLoadingUser || isLoadingQuestions) {
    return <LoadingSkeleton type={isLoadingUser ? "general" : "questions"} />;
  }

  if (questionsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="card-title justify-center">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600 mb-4">ไม่สามารถโหลดคำถามได้</p>
            <div className="card-actions justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                โหลดใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUserData?.role === "admin";
  const userPoints = currentUserData?.Rewards?.[0]?.points || 0;

  if (isAdmin) {
    return <AdminDashboardView questions={questions || []} />;
  }

  // Use simple view for better compatibility
  if (questions && user?.id) {
    return <SimpleUserView 
      questions={questions.filter(q => q.status === 'production')}
      userPoints={userPoints}
      userName={user?.firstName || user?.username || "ผู้เล่น"}
      userId={user.id}
    />;
  }

  return <div className="min-h-screen flex items-center justify-center">
    <div className="loading loading-spinner loading-lg"></div>
  </div>;
};

// Admin Dashboard View
const AdminDashboardView: React.FC<{ questions: Question[] }> = ({ questions }) => {
  const totalQuestions = questions.length;
  const activeQuestions = questions.filter(q => q.status === "production").length;
  const draftQuestions = questions.filter(q => q.status === "draft").length;
  
  const recentQuestions = questions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">แดชบอร์ดผู้ดูแลระบบ</h1>
          <p className="text-blue-100">จัดการคำถาม ตรวจสอบสถิติ และควบคุมระบบ</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-3xl mr-4">📊</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{totalQuestions}</h3>
                  <p className="text-gray-600">คำถามทั้งหมด</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-3xl mr-4">✅</div>
                <div>
                  <h3 className="text-2xl font-bold text-green-600">{activeQuestions}</h3>
                  <p className="text-gray-600">คำถามที่เปิดใช้งาน</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-3xl mr-4">📝</div>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-600">{draftQuestions}</h3>
                  <p className="text-gray-600">คำถามร่าง</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-3xl mr-4">👥</div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-600">0</h3>
                  <p className="text-gray-600">ผู้ใช้ออนไลน์</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/create" className="card bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-4xl mr-4">➕</div>
                <div>
                  <h3 className="text-xl font-bold">สร้างคำถามใหม่</h3>
                  <p className="text-green-100">เพิ่มคำถามและตัวเลือกคำตอบ</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-4xl mr-4">⚙️</div>
                <div>
                  <h3 className="text-xl font-bold">จัดการคำถาม</h3>
                  <p className="text-blue-100">แก้ไข ลบ และจัดการคำถาม</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/analytics" className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-4xl mr-4">📈</div>
                <div>
                  <h3 className="text-xl font-bold">รายงานและสถิติ</h3>
                  <p className="text-purple-100">ดูข้อมูลเชิงลึกและแนวโน้ม</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Questions */}
        <div className="card bg-white shadow-lg">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-6">คำถามล่าสุด</h2>
            <div className="space-y-4">
              {recentQuestions.map((question: Question) => (
                <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 truncate">{question.content}</h3>
                    <p className="text-sm text-gray-500">
                      สร้างเมื่อ {dayjs(question.createdAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${question.status === 'production' ? 'badge-success' : 'badge-warning'}`}>
                      {question.status}
                    </span>
                    <Link href={`/admin/questions/${question.id}/edit`} className="btn btn-sm btn-outline">
                      แก้ไข
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Game View
const UserGameView: React.FC<{
  gameSession: any;
  userPoints: number;
  userName: string;
}> = ({ gameSession, userPoints, userName }) => {
  const { availableQuestions, userProgress, recommendedQuestion, gameStats } = gameSession;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎮 Quiz Game
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            ยินดีต้อนรับ <span className="font-bold text-purple-600">{userName}</span>!
          </p>
          
          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center py-4">
                <div className="text-3xl font-bold text-yellow-500">{userPoints}</div>
                <div className="text-sm text-gray-600">คะแนนรวม</div>
              </div>
            </div>
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center py-4">
                <div className="text-3xl font-bold text-green-500">{userProgress.totalAnswered}</div>
                <div className="text-sm text-gray-600">ตอบแล้ว</div>
              </div>
            </div>
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center py-4">
                <div className="text-3xl font-bold text-blue-500">{availableQuestions.length}</div>
                <div className="text-sm text-gray-600">เหลือ</div>
              </div>
            </div>
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center py-4">
                <div className="text-3xl font-bold text-purple-500">{userProgress.accuracy.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">ความแม่นยำ</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>ความคืบหน้า</span>
              <span>{gameStats.completionRate}%</span>
            </div>
            <progress 
              className="progress progress-primary w-full h-3" 
              value={gameStats.completionRate} 
              max="100"
            ></progress>
          </div>
        </div>

        {/* Available Questions */}
        {availableQuestions.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              🎯 คำถามใหม่สำหรับคุณ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableQuestions.map((question: Question, index: number) => (
                <div key={question.id} className="card bg-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="badge badge-primary">คำถาม #{index + 1}</div>
                      <div className="badge badge-accent">
                        🏆 {question.rewardPoints || 5} คะแนน
                      </div>
                    </div>
                    <h3 className="card-title text-lg leading-relaxed mb-4">
                      {question.content}
                    </h3>
                    <div className="card-actions justify-center">
                      <Link 
                        href={`/usersendanswer/${question.id}`}
                        className="btn btn-primary btn-lg w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-none"
                      >
                        🎮 เริ่มเล่น!
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">ยินดีด้วย!</h2>
            <p className="text-xl text-gray-600 mb-6">คุณได้ตอบคำถามทั้งหมดแล้ว</p>
            <Link href="/components/ranking" className="btn btn-primary btn-lg">
              ดูอันดับของคุณ 🏆
            </Link>
          </div>
        )}

        {/* Recently Answered */}
        {userProgress.totalAnswered > 0 && (
          <>
            <h2 className="text-2xl font-bold text-center mt-12 mb-6 text-gray-700">
              📚 สถิติการเล่นของคุณ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="card bg-white shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <h3 className="text-xl font-bold text-gray-800">{userProgress.correctAnswers}</h3>
                  <p className="text-gray-600">คำตอบที่ถูกต้อง</p>
                </div>
              </div>
              <div className="card bg-white shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <h3 className="text-xl font-bold text-gray-800">{userProgress.accuracy.toFixed(1)}%</h3>
                  <p className="text-gray-600">อัตราความถูกต้อง</p>
                </div>
              </div>
              <div className="card bg-white shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="text-xl font-bold text-gray-800">{gameStats.averageDifficulty}</h3>
                  <p className="text-gray-600">ระดับความยาก</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Simple fallback user view
const SimpleUserView: React.FC<{
  questions: Question[];
  userPoints: number;
  userName: string;
  userId: string;
}> = ({ questions, userPoints, userName, userId }) => {
  // Simple filter for questions user hasn't answered
  const availableQuestions = questions.filter(question => {
    const hasAnswered = question.answers?.some(
      answer => answer.user.role !== 'admin' && answer.userId === userId
    ) || false;
    return !hasAnswered;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎮 Quiz Game
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            ยินดีต้อนรับ <span className="font-bold text-purple-600">{userName}</span>!
          </p>
          
          <div className="card bg-white shadow-lg inline-block">
            <div className="card-body text-center py-4">
              <div className="text-3xl font-bold text-yellow-500">{userPoints}</div>
              <div className="text-sm text-gray-600">คะแนนรวม</div>
            </div>
          </div>
        </div>

        {availableQuestions.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              🎯 คำถามสำหรับคุณ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableQuestions.map((question: Question, index: number) => (
                <div key={question.id} className="card bg-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="badge badge-primary">คำถาม #{index + 1}</div>
                      <div className="badge badge-accent">
                        🏆 {question.rewardPoints || 5} คะแนน
                      </div>
                    </div>
                    <h3 className="card-title text-lg leading-relaxed mb-4">
                      {question.content}
                    </h3>
                    <div className="card-actions justify-center">
                      <Link 
                        href={`/usersendanswer/${question.id}`}
                        className="btn btn-primary btn-lg w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-none"
                      >
                        🎮 เริ่มเล่น!
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">ยินดีด้วย!</h2>
            <p className="text-xl text-gray-600 mb-6">คุณได้ตอบคำถามทั้งหมดแล้ว</p>
            <Link href="/components/ranking" className="btn btn-primary btn-lg">
              ดูอันดับของคุณ 🏆
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleBasedHomePage;