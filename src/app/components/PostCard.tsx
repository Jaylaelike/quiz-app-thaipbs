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
            <div className="card w-full bg-base-100 shadow-xl border">
              <div className="card-body">
                <h2 className="card-title">
                  วันที่ : {dayjs(createdAt).format("DD/MM/YYYY")}
                </h2>
                <p>{content}</p>
                <div className="card-actions justify-end">
                  <span className="badge badge-accent">{status}</span>
                  <Link href={`/blog/${id}`} className="hover:underline">
                    Read more...
                  </Link>
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
