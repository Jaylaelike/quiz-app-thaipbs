
import PostCard from "./components/PostCard";
import db from "./lib/db";

import { auth, currentUser } from "@clerk/nextjs";

async function getPosts() {
  const res = await db.question.findMany({
    select: {
      id: true,
      content: true,
      userId: true,
      createdAt: true,
      status: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  
  return res;
}

//create newUser function for create new user
async function newUser() {
  const { userId } = auth();
  const user = await currentUser();

  const res = await db.user.create({
    data: {
      id: userId || "",
      username: user?.firstName || user?.username || "",
      email: user?.emailAddresses[0].emailAddress || "",
      imageUrl: user?.imageUrl || "",
    },
  });
  //create a new user Reward initally set to 0
  await db.reward.create({
    data: {
      points: 0,
      userId: res.id,
    },
  });
  return res;
}

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {


  const post = await getPosts();
  //check if user is not exist in database then create new user
  if (auth().userId) {
    const user = await db.user.findUnique({
      where: {
        id: auth().userId || "",
      },
    });
    if (!user) {
      await newUser();
    }
  }

  return (
    <main className="grid items-center justify-center md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      {post.map((post) => (
        <PostCard key={post.id} post={post}  />
      ))}
    </main>
  );
}
