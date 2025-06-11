"use client";
import { MessageCircleMore, User, LogOut, Settings, Trophy, Crown } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import RewardNavbar from "./RewardNavbar";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  role: string;
  Rewards: [
    {
      id: string;
      points: number;
      userId: string;
    }
  ];
}

function NavBar() {
  const { isSignedIn, user } = useUser();

  //get roll of user
  const { data: dataUser, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch(`/api/users/${user?.id}`);
      return res.json();
    },
    enabled: !!user?.id && isSignedIn, // Only run query when user is signed in
  });

  return (
    <div className="navbar bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto">
        {/* Logo */}
        <div className="flex-1">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <MessageCircleMore size={32} className="text-blue-600" />
            <span className="text-xl font-bold text-blue-600 hidden sm:block">Quiz Game</span>
          </Link>
        </div>

        {/* Only show user-related content when signed in */}
        {isSignedIn && user && (
          <>
            {/* Welcome Message */}
            <div className="flex-none hidden md:block">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  ยินดีต้อนรับ: {user?.fullName || user?.username}
                </span>
              </div>
            </div>

            {/* Admin Controls */}
            {dataUser?.role === "admin" && (
              <div className="flex-none gap-2 hidden lg:flex">
                <Link href="/admin" className="btn btn-ghost btn-sm">
                  <Crown className="w-4 h-4 mr-1" />
                  แดชบอร์ด
                </Link>
                <Link href="/create" className="btn btn-ghost btn-sm">
                  ➕ สร้างคำถาม
                </Link>
              </div>
            )}

            {/* Rewards */}
            <div className="flex-none">
              <RewardNavbar id={user?.id || ""} />
            </div>

            {/* User Dropdown */}
            <div className="dropdown dropdown-end z-20">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform"
              >
                <div className="w-10 rounded-full ring-2 ring-blue-200 hover:ring-blue-400 transition-colors">
                  <img
                    alt="Profile"
                    src={
                      user?.imageUrl ||
                      "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    }
                    className="rounded-full"
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border"
              >
                {/* Mobile Welcome */}
                <li className="md:hidden mb-2">
                  <div className="text-xs text-gray-500 pointer-events-none">
                    {user?.fullName || user?.username}
                  </div>
                </li>

                {/* Admin Links for Mobile */}
                {dataUser?.role === "admin" && (
                  <>
                    <li className="lg:hidden">
                      <Link href="/admin" className="flex items-center">
                        <Crown className="w-4 h-4 mr-2" />
                        แดชบอร์ด
                      </Link>
                    </li>
                    <li className="lg:hidden">
                      <Link href="/create" className="flex items-center">
                        ➕ สร้างคำถาม
                      </Link>
                    </li>
                    <div className="divider my-1 lg:hidden"></div>
                  </>
                )}

                <li>
                  <Link href="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    โปรไฟล์
                  </Link>
                </li>
                <li>
                  <Link href="/components/ranking" className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    อันดับ
                  </Link>
                </li>
                <li>
                  <Link href="/components/userguides" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    วิธีเล่นเกม
                  </Link>
                </li>
                
                <div className="divider my-1"></div>
                
                <li>
                  <SignOutButton>
                    <button className="flex items-center text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" />
                      ออกจากระบบ
                    </button>
                  </SignOutButton>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;