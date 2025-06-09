'use client';

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

// Define the User interface, similar to NavBar.tsx, to include role
interface UserProfile {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  role: string; // Crucial for admin check
  // Add other fields your /api/users/:id endpoint returns
}

// Define the Reward type for ranking data
interface Reward {
  id: string;
  points: number;
  user: {
    id: string;
    username: string;
    imageUrl?: string | null;
  };
  // Add other fields from your rewards data structure
}

// The main component, now a client component
export default function RankingPage() {
  const { isSignedIn, user: clerkUser } = useUser(); // Clerk user object
  const [rankingData, setRankingData] = useState<Reward[]>([]);
  const [isLoadingRankings, setIsLoadingRankings] = useState(true);
  const [adminMessage, setAdminMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Fetch user's detailed profile including role
  const { data: currentUserProfile, isLoading: isLoadingUserProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile', clerkUser?.id],
    queryFn: async () => {
      if (!clerkUser?.id) throw new Error('User ID not available');
      const res = await fetch(`/api/users/${clerkUser.id}`);
      if (!res.ok) throw new Error('Failed to fetch user profile');
      return res.json();
    },
    enabled: !!isSignedIn && !!clerkUser?.id, // Only run if signed in and clerkUser.id is available
  });

  // Fetch ranking data
  useEffect(() => {
    async function loadRankingData() {
      setIsLoadingRankings(true);
      try {
        // IMPORTANT: You need an API endpoint to serve this data.
        // Replace '/api/rewards' with your actual endpoint if different.
        const response = await fetch('/api/rewards'); 
        if (!response.ok) {
          throw new Error('Failed to fetch ranking data');
        }
        const data = await response.json();
        setRankingData(data);
      } catch (error) {
        console.error("Error loading ranking data:", error);
        setRankingData([]); // Set to empty or handle error state appropriately
      }
      setIsLoadingRankings(false);
    }
    loadRankingData();
  }, []);

  const handleResetRewards = async () => {
    if (!confirm('Are you sure you want to reset all user rewards? This action cannot be undone.')) {
      return;
    }
    setIsResetting(true);
    setAdminMessage('');
    try {
      const response = await fetch('/api/admin/reset-rewards', {
        method: 'POST',
        // Headers might be needed if your Clerk setup requires sending a token
      });
      const result = await response.json();
      if (response.ok) {
        setAdminMessage(`Success: ${result.message} (${result.count} records deleted). Rankings will update on next data load or refresh.`);
        // Optionally, re-fetch ranking data: loadRankingData();
      } else {
        setAdminMessage(`Error: ${result.message || 'Failed to reset rewards.'}`);
      }
    } catch (error) {
      console.error('Failed to reset rewards:', error);
      setAdminMessage('Error: An unexpected error occurred.');
    } finally {
      setIsResetting(false);
    }
  };

  // Original server-side getRewards function is no longer used directly here.
  // Data is fetched via useEffect.
  // The orphaned body of the old getRewards function has been removed.

//get answer createAt by user for first answer
// async function getAnswerTimeStamp() {
//   const res = await db.user.findMany({
//     include: {
//       Rewards: {
//         orderBy: {
//           points: "desc",
//         },
//       },

//       Answers: {
//         orderBy: {
//           createdAt: "asc",
//         },
//       },
//     },

//     where: {
//       role: "user",
//     },
//   });

//   //  console.log(res);
//   return res;
// }

//filter getRewards() role of user

// The `page` function is replaced by RankingPage client component.
  // const data = await getRewards(); // This line is removed.

  // const timeData = await getAnswerTimeStamp();

  // console.log(timeData);

  // //order result timeData by createdAt of first answer
  // const data = timeData.sort(
  //   (a: any, b: any) =>
  //     dayjs(a.Answers[0].createdAt).unix() -
  //     dayjs(b.Answers[0].createdAt).unix()
  // );

  // console.log(data);

  //filter role of user is "user"

  //   console.log(data);

  if (isLoadingRankings || (isSignedIn && isLoadingUserProfile && !currentUserProfile)) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <div>Loading rankings and user data...</div>
      </div>
    );
  }

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
                      {rankingData.map((reward: Reward) => (
                        <tr key={reward.id}>
                          <td>{rankingData.indexOf(reward) + 1}</td>
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
                            {reward.points >= 1000 ? (
                              <img
                                src="https://res.cloudinary.com/satjay/image/upload/v1707128212/hhgy5vr8jaojbgghp4sr.png"
                                className="w-10 rounded-full"
                              />
                            ) : reward.points >= 500 ? (
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

      {/* Admin Section: Reset Rewards - Visible only to admins */}
      {isSignedIn && currentUserProfile?.role === 'admin' && (
        <div className="flex flex-col items-center justify-center w-full mt-8 p-4 border-t-2 border-red-500">
          <div className="card w-auto bg-base-96 shadow-xl p-4">
            <h2 className="card-title text-red-600">Admin Controls</h2>
            <p className="text-sm mb-2">This action will delete all user scores and reset the leaderboard.</p>
            <button 
              onClick={handleResetRewards} 
              disabled={isResetting || isLoadingUserProfile}
              className="btn btn-error"
            >
              {isResetting ? 'Resetting...' : 'Reset All User Rewards'}
            </button>
            {adminMessage && <p className={`mt-2 ${adminMessage.startsWith('Success') ? 'text-green-500' : 'text-red-500'}`}>{adminMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
}

// The default export is now RankingPage, no longer the async function `page`.
