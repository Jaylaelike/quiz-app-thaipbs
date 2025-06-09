// import { Tag } from "@prisma/client";

"use client";
import Link from "next/link";
import React, { FC } from "react";
import dayjs from "dayjs";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

// interface PostCardProps {
//   post: {
//     id: string;
//     title: string;
//     content: string;
//     tag : Tag;
//   };
// }

interface PostCardProps {
  post: {
    id: string;
    content: string;
    userId: string;
    status: string;
    createdAt: Date;
    user: {
      username: string;
    };
  };
}

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



const PostCard: FC<PostCardProps> = ({ post }) => {
  const { user } = useUser();
  const {
    id,
    content,
    createdAt,
    status,
    user: { username },
  } = post;

  //get roll of user 
   const { data: dataUser, isLoading: isLoadingUser } = useQuery<User>({

    queryKey: ["user", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${user?.id}`);
      return res.json();
    },

  });


  //console.log(dataUser);
  
  return (
    <>

    {!user ? (  <div className="skeleton h-32 w-full"></div>) : 

   (<>
      {
        dataUser?.role === "admin" ? (
        <div className="card w-full bg-base-100 shadow-xl border">
          <div className="card-body">
            <h2 className="card-title">
              วันที่ : {dayjs(createdAt).format("DD/MM/YYYY")}
            </h2>
            <p>{content}</p>
            <div className="card-actions justify-end">
              {status === "production" ? (
                <span className="badge badge-accent">{status}</span>
              ) : (
                <span className="badge badge-error">{status}</span>
              )}
              <Link href={`/blog/${id}`} className="hover:underline">
                Read more...
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {status === "production" ? (
            <div className="card w-full bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-3">
                  <div className="badge badge-accent">🎯 คำถาม</div>
                  <div className="badge badge-outline">
                    {dayjs(createdAt).format("DD/MM/YYYY")}
                  </div>
                </div>
                <h2 className="card-title text-lg leading-relaxed mb-4">
                  {content}
                </h2>
                <div className="card-actions justify-between items-center">
                  <div className="flex gap-2">
                    <span className="badge badge-success">เปิดรับคำตอบ</span>
                    <span className="badge badge-primary">
                      🏆 คะแนน: 5
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/usersendanswer/${id}`} 
                      className="btn btn-primary btn-sm hover:btn-primary-focus"
                    >
                      🎮 เล่นเลย!
                    </Link>
                    <Link 
                      href={`/blog/${id}`} 
                      className="btn btn-ghost btn-sm"
                    >
                      ดูรายละเอียด
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
    )}
    </>
  );
}


export default PostCard;
