"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Sparkles, Trophy, Star } from "lucide-react";

export default function WelcomeTransition() {
  const { user } = useUser();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!showWelcome || !user) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-50 transition-all duration-1000">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Welcome Animation */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <Sparkles className="w-20 h-20 text-blue-400 mx-auto" />
          </div>
          <Sparkles className="w-20 h-20 text-blue-600 mx-auto relative z-10" />
        </div>

        {/* Welcome Message */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ยินดีต้อนรับ!
          </h1>
          <p className="text-xl text-gray-600">
            {user?.firstName || user?.username}
          </p>
          <p className="text-sm text-gray-500">
            เข้าสู่ระบบสำเร็จแล้ว
          </p>
        </div>

        {/* Feature Icons */}
        <div className="flex justify-center space-x-6 text-gray-400">
          <Trophy className="w-8 h-8 animate-bounce" style={{ animationDelay: '0.1s' }} />
          <Star className="w-8 h-8 animate-bounce" style={{ animationDelay: '0.3s' }} />
          <Sparkles className="w-8 h-8 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Loading indicator */}
        <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
