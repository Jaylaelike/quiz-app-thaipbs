"use client";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isSignedIn, user } = useUser();

  if (!isLoaded || !userId) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useQuery({
    queryKey: ["rewards", userId],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    queryFn: async () => {
      const res = await axios.get(`/api/users/${userId}`);
      // console.log(res.data?.Rewards[0].points);

      return res.data;
    },
  });

  // console.log(data?.Rewards[0].points);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full ">
        <div className="card w-96 bg-base-96 shadow-xl">
          <div className="card-title justify-center">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img
                  src={
                    user?.profileImageUrl
                      ? user?.profileImageUrl
                      : "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  }
                />
              </div>
            </div>
          </div>
          <div className="card-body items-center justify-center">
            <h2 className="card-title">{user?.fullName || user?.username}</h2>
            <p>ข้อมูล</p>
            <p>อีเมล์: {user?.emailAddresses[0].emailAddress}</p>

            <p>รหัสผู้ใช้: {userId}</p>

            {/* <p>รหัสเซสชั่น: {sessionId}</p> */}

            <div className="flex flex-rows space-x-4">
              <p className="text-[70px] text-nowrap">คะแนน: {data?.Rewards[0].points}</p>
              <div className="rating">
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                />
              </div>
            </div>

            <p>Badge</p>
            {data?.Rewards[0].points ? (
              data?.Rewards[0].points >= 1000 ? (
                <img
                  src="https://res.cloudinary.com/satjay/image/upload/v1707274298/wijtms2qtn1mlhmllz25.png"
                  className="w-30 rounded-full"
                />
              ) : data?.Rewards[0].points >= 500 ? (
                <img
                  src="https://res.cloudinary.com/satjay/image/upload/v1707274298/wnpivrdy57uvug6gon4z.png"
                  className="w-30 rounded-full"
                />
              ) : (
                <img
                  src="https://res.cloudinary.com/satjay/image/upload/v1707274297/hzis1ilev5vehxifuoxy.png"
                  className="w-30 rounded-full"
                />
              )
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
