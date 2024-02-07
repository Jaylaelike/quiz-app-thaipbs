"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isSignedIn, user } = useUser();
  // console.log(user?.imageUrl);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const res = await axios.get(`/api/rewards`);
      // console.log(res.data);

      return res.data;
    },
  });

  // console.log(data);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full ">
        <div className="card w-auto bg-base-96 shadow-xl">
          <div className="card-title justify-center">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img
                  src={
                    "https://res.cloudinary.com/satjay/image/upload/v1707118717/lqzvxmskwh3bme2wedkk.png"
                  }
                />
              </div>
            </div>
          </div>
          <div className="card-body items-center justify-center">
            <h2 className="card-title">อันดับผู้ท้าชิง</h2>

            <div className="rating">
              <input
                type="radio"
                name="rating-5"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-5"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-5"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-5"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-5"
                className="mask mask-star-2 bg-orange-400"
              />
            </div>

            <div className="form-control">
              <div className="card-actions justify-center p-3">
                <div className="overflow-x-auto">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr>
                        <th></th>
                        <th>อันดับที่</th>
                        <th>ชื่อผู้ท้าชิง</th>
                        <th>คะแนน</th>
                        <th>Bagde</th>

                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((reward: any) => (
                        <tr key={reward.id}>
                          <td>{data.indexOf(reward) + 1}</td>
                          <td>
                            <div className="avatar">
                              <div className="w-10 rounded-full">
                                <img
                                  src={
                                    reward.user.imageUrl ||
                                    "https://res.cloudinary.com/satjay/image/upload/v1707118717/lqzvxmskwh3bme2wedkk.png"
                                  }
                                />
                              </div>
                            </div>
                          </td>
                          <td>{reward.user.username}</td>
                          <td>{reward.points}</td>

                          <td>
                            {reward.points > 50 ? (
                              <img
                                src="https://res.cloudinary.com/satjay/image/upload/v1707128212/hhgy5vr8jaojbgghp4sr.png"
                                className="w-10 rounded-full"
                              />
                            ) : reward.points > 20 ? (
                              <img
                                src="https://res.cloudinary.com/satjay/image/upload/v1707128213/lusfl4n4ne79bfapmb8w.png"
                                className="w-10 rounded-full"
                              />
                            ) : (
                              <img
                                src="https://res.cloudinary.com/satjay/image/upload/v1707128212/emgqig9bntcvtlww0bf9.png"
                                className="w-10 rounded-full"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;

// https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
