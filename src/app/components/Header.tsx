"use client";

import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { LogOut, User, Trophy } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { user, isLoaded } = useUser();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              🎮 Quiz Game
            </h1>
          </Link>

          {/* Navigation & User Controls */}
          <div className="flex items-center space-x-4">
            {isLoaded && user ? (
              <>
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Trophy className="w-4 h-4" />
                    <span>คะแนน</span>
                  </div>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  {/* Clerk's UserButton provides a nice dropdown */}
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 hover:scale-105 transition-transform",
                        userButtonPopoverCard: "shadow-lg border",
                        userButtonPopoverActionButton: "hover:bg-gray-50"
                      }
                    }}
                  />
                  
                  {/* Alternative custom sign out button */}
                  <SignOutButton>
                    <button className="btn btn-ghost btn-sm hidden sm:flex">
                      <LogOut className="w-4 h-4 mr-2" />
                      ออกจากระบบ
                    </button>
                  </SignOutButton>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">ไม่ได้เข้าสู่ระบบ</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
