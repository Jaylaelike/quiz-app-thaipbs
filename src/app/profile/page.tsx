"use client";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isSignedIn, user } = useUser();

  if (!isLoaded || !userId) {
    return <div>Loading...</div>;
  }

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

            <p>รหัสเซสชั่น: {sessionId}</p>

            <p>ดาว: </p>
            <div className="rating">
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
                checked
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
            </div>

            <div className="form-control">
              <div className="card-actions justify-center p-3">
                <button className="btn btn-primary">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
