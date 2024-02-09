// import { Tag } from "@prisma/client";

"use client";
import Link from "next/link";
import React, { FC } from "react";
import dayjs from "dayjs";
import { useUser } from "@clerk/nextjs";

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

const PostCard: FC<PostCardProps> = ({ post }) => {
  const { user } = useUser();
  const {
    id,
    content,
    createdAt,
    status,
    user: { username },
  } = post;

  return (
    <>

    {!user ? (  <div className="skeleton h-32 w-full"></div>) : 

   (<>
      {user?.emailAddresses[0].emailAddress === "smarkwisai@gmail.com" || "whea_k@hotmail.com" ? (
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
