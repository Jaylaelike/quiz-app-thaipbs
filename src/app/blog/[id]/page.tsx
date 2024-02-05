import BackButton from "@/app/components/BackButton";
import ButtonAction from "@/app/components/ButtonAction";
import db from "@/app/lib/db";
import React, { FC } from "react";

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

async function getPost(id: string) {
  const res = await db.question.findFirst({
    where: {
      id: id,
    },
    select: {
      content: true,
      status: true,
      createdAt: true,
      user: true,
    },
  });
  return res;
}

const BlogDetailPage: FC<BlogDetailPageProps> = async ({ params }) => {
  const post = await getPost(params.id);

  return (
    <div>
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold my-4">{post?.content}</h2>
        <ButtonAction id={params.id} />
      </div>
      <span className="badge badge-accent">{post?.status}</span>
    </div>
  );
};

export default BlogDetailPage;
