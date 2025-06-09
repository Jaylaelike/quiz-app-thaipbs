"use client";
import { MessageCircleMore } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
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
      const res = await fetch(`/api/users/${user?.id}`);
      return res.json();
    },
  });

  // console.log(dataUser);

  // console.log(user?.id);

  return (
    <div className="navbar bg-neutral">
      <div className="container">
        <div className="flex-1">
          <Link href="/">
            <MessageCircleMore size={32} />
          </Link>
        </div>
        <div className="flex-1">
          <h4 className="text-base ">
            ยินดีต้อนรับคุณ: {user?.fullName || user?.username}
          </h4>
        </div>
        {dataUser?.role === "admin" ? (
          <div className="flex-none gap-2">
            <Link href="/admin" className="btn btn-ghost">
              📊 แดชบอร์ด
            </Link>
            <Link href="/create" className="btn btn-ghost">
              ➕ สร้างคำถาม
            </Link>
          </div>
        ) : null}

        <RewardNavbar id={user?.id || ""} />
      </div>

      <div className="dropdown dropdown-end z-20">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="imageUrl"
              src={
                user?.profileImageUrl
                  ? user?.profileImageUrl
                  : "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              }
            />
          </div>
        </div>

        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <Link href={"/profile"} className="justify-between">
              Profile
            </Link>
          </li>
          <li>
            <Link href={"/components/ranking"} className="justify-between">
              อันดับ
            </Link>
          </li>
          
          <Link href={"/components/userguides"} className="justify-between">
            วิธีเล่นเกม
          </Link>
          <li>
      
            <SignOutButton />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
