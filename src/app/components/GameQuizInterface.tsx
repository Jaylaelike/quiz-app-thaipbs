"use client";
import React, { useState, useEffect } from "react";
import { FormInputAnswer } from "../types";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import JSConfetti from "js-confetti";

interface GameQuizInterfaceProps {
  questionId: string;
}

const GameQuizInterface: React.FC<GameQuizInterfaceProps> = ({ questionId }) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [progress, setProgress] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted && !isTimeUp) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setProgress(((30 - timeLeft + 1) / 30) * 100);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsTimeUp(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 3000);
    }
  }, [timeLeft, isSubmitted, isTimeUp, router]);

  // Fetch question data
  const { data: question, isLoading: isLoadingQuestion, error } = useQuery({
    queryKey: ["question", questionId],
    queryFn: async () => {
      const res = await axios.get(`/api/questions/${questionId}`);
      return res.data;
    },
    enabled: !!questionId,
    refetchOnWindowFocus: false,
  });

  // Fetch user rewards
  const { data: dataReward } = useQuery({
    queryKey: ["Rewards", userId],
    queryFn: async () => {
      const res = await axios.get(`/api/users/${userId}`);
      return res.data;
    },
  });

  // Create answer mutation
  const { mutate: createAnswer, isPending: createAnswerLoading } = useMutation({
    mutationFn: (newAnswer: FormInputAnswer) => {
      return axios.post("/api/answers/create", newAnswer);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 3000);
    },
  });

  // Update reward mutation
  const { mutate: updateReward } = useMutation({
    mutationFn: (newReward: { points: number; userId: string }) => {
      return axios.patch(`/api/rewards/${dataReward?.Rewards[0].id}`, newReward);
    },
  });

  // Get admin answers (correct answers)
  const adminAnswers = question?.answers?.filter(
    (answer: any) => answer.user.role === "admin"
  ) || [];

  // Check if user has already answered
  const userAnswer = question?.answers?.find(
    (answer: any) => answer.userId === userId
  );

  const handleAnswerSelect = (answer: any) => {
    if (!isSubmitted && !isTimeUp) {
      setSelectedAnswer(answer.id);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer || isSubmitted || isTimeUp) return;

    const selectedAnswerData = adminAnswers.find(
      (answer: any) => answer.id === selectedAnswer
    );

    if (selectedAnswerData) {
      createAnswer({
        userId: userId || "",
        questionId: questionId,
        content: selectedAnswerData.content,
        isCorrect: selectedAnswerData.isCorrect,
      });

      // Play sound and show confetti
      const confetti = new JSConfetti();
      if (selectedAnswerData.isCorrect) {
        const audio = new Audio(
          "https://smongmtkwekplybenfjr.supabase.co/storage/v1/object/public/audio/True_answer.mp3"
        );
        audio.play();
        confetti.addConfetti();
        updateReward({
          points: (dataReward?.Rewards[0]?.points || 0) + (question?.rewardPoints || 5),
          userId: userId || "",
        });
      } else {
        const audio = new Audio(
          "https://smongmtkwekplybenfjr.supabase.co/storage/v1/object/public/audio/Fail_answer.mp3"
        );
        audio.play();
        confetti.addConfetti({
          emojis: ["❌"],
        });
      }
    }
  };

  // Show loading state
  if (isLoadingQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <h2 className="card-title mt-4">กำลังโหลดคำถาม...</h2>
            <p className="text-gray-600">กรุณารอสักครู่</p>
            <p className="text-sm text-gray-500">Question ID: {questionId}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl">❌</div>
            <h2 className="card-title mt-4">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600">ไม่สามารถโหลดคำถามได้</p>
            <p className="text-sm text-red-500">{error.message}</p>
            <div className="card-actions justify-center mt-4">
              <button 
                className="btn btn-primary"
                onClick={() => router.push("/")}
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show if question not found
  if (!question && !isLoadingQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl">🔍</div>
            <h2 className="card-title mt-4">ไม่พบคำถาม</h2>
            <p className="text-gray-600">คำถามที่คุณต้องการอาจถูกลบหรือไม่มีอยู่</p>
            <p className="text-sm text-gray-500">Question ID: {questionId}</p>
            <div className="card-actions justify-center mt-4">
              <button 
                className="btn btn-primary"
                onClick={() => router.push("/")}
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show if user already answered
  if (userAnswer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="mb-6">
              {userAnswer.isCorrect ? (
                <div className="text-6xl">🎉</div>
              ) : (
                <div className="text-6xl">😢</div>
              )}
            </div>
            <h2 className="card-title justify-center text-3xl mb-4">
              คุณได้ตอบคำถามนี้แล้ว!
            </h2>
            <div className={`alert ${userAnswer.isCorrect ? 'alert-success' : 'alert-error'} mb-4`}>
              <span className="text-lg">คำตอบของคุณ: {userAnswer.content}</span>
            </div>
            <div className={`badge badge-lg ${userAnswer.isCorrect ? 'badge-success' : 'badge-error'}`}>
              {userAnswer.isCorrect ? "ถูกต้อง ✅" : "ผิด ❌"}
            </div>
            <div className="card-actions justify-center mt-6">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => router.push("/")}
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getTimerColor = () => {
    if (timeLeft <= 10) return "text-error";
    if (timeLeft <= 20) return "text-warning";
    return "text-success";
  };

  const getProgressColor = () => {
    if (timeLeft <= 10) return "progress-error";
    if (timeLeft <= 20) return "progress-warning";
    return "progress-success";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-3xl bg-base-100 shadow-2xl">
        <div className="card-body p-8">
          {/* Header with timer */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="badge badge-primary badge-lg">
                คะแนน: {question?.rewardPoints || 5} 🏆
              </div>
              <div className={`text-5xl font-bold ${getTimerColor()}`}>
                {timeLeft}
              </div>
              <div className="text-2xl">⏰</div>
            </div>
            <progress 
              className={`progress ${getProgressColor()} w-full h-3`}
              value={progress} 
              max="100"
            ></progress>
            <p className="text-sm text-gray-600 mt-2">เวลาที่เหลือ</p>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 leading-relaxed">
              {question?.content}
            </h1>
          </div>

          {/* Answer Options */}
          <div className="grid gap-4 mb-8">
            {adminAnswers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">ยังไม่มีตัวเลือกคำตอบ</h3>
                <p className="text-gray-500">ผู้ดูแลระบบยังไม่ได้เพิ่มตัวเลือกคำตอบสำหรับคำถามนี้</p>
                <div className="mt-4">
                  <button 
                    className="btn btn-primary"
                    onClick={() => router.push("/")}
                  >
                    กลับหน้าหลัก
                  </button>
                </div>
              </div>
            ) : (
              adminAnswers.map((answer: any, index: number) => (
              <div
                key={answer.id}
                className={`card cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  selectedAnswer === answer.id
                    ? "bg-primary text-primary-content shadow-lg scale-[1.02] border-2 border-primary"
                    : "bg-base-200 hover:bg-base-300 border-2 border-transparent"
                } ${isSubmitted || isTimeUp ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => handleAnswerSelect(answer)}
              >
                <div className="card-body p-6">
                  <div className="flex items-center gap-4">
                    <div className={`badge badge-lg text-lg font-bold min-w-[3rem] ${
                      selectedAnswer === answer.id ? "badge-secondary" : "badge-outline"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-xl font-medium flex-1">
                      {answer.content}
                    </span>
                    {selectedAnswer === answer.id && (
                      <div className="text-2xl">✓</div>
                    )}
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {/* Submit Button */}
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary btn-lg w-full text-xl py-4"
              onClick={handleSubmit}
              disabled={!selectedAnswer || isSubmitted || isTimeUp || createAnswerLoading}
            >
              {createAnswerLoading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  กำลังส่ง...
                </>
              ) : isTimeUp ? (
                "หมดเวลาแล้ว!"
              ) : (
                <>
                  ส่งคำตอบ 🚀
                </>
              )}
            </button>
          </div>

          {/* Time up alert */}
          {isTimeUp && !isSubmitted && (
            <div className="alert alert-error mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 13.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-lg">หมดเวลาแล้ว! กลับไปหน้าหลักใน 3 วินาที...</span>
            </div>
          )}

          {/* Success/Error alerts */}
          {isSubmitted && (
            <div className={`alert ${
              adminAnswers.find((a: any) => a.id === selectedAnswer)?.isCorrect 
                ? "alert-success" 
                : "alert-error"
            } mt-6`}>
              <div className="text-4xl mr-4">
                {adminAnswers.find((a: any) => a.id === selectedAnswer)?.isCorrect ? "🎉" : "😢"}
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {adminAnswers.find((a: any) => a.id === selectedAnswer)?.isCorrect
                    ? "ยินดีด้วย!"
                    : "เสียใจด้วย"}
                </h3>
                <div className="text-base">
                  {adminAnswers.find((a: any) => a.id === selectedAnswer)?.isCorrect
                    ? `คุณตอบถูกต้อง! ได้รับ ${question?.rewardPoints || 5} คะแนน`
                    : "คุณตอบผิด ลองใหม่ในคำถามถัดไป"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameQuizInterface;