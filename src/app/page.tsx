import RoleBasedHomePage from "./components/RoleBasedHomePage";
import db from "./lib/db";
import { auth, currentUser } from "@clerk/nextjs";

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

export default async function Home() {
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

    return <RoleBasedHomePage />;
  }

  // If user is not signed in, show landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          🎮 Quiz Game
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          เข้าสู่ระบบเพื่อเริ่มเล่นเกมตอบคำถาม
        </p>
        <div className="card w-96 bg-white shadow-xl mx-auto">
          <div className="card-body">
            <h2 className="card-title justify-center">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-gray-600">เข้าสู่ระบบเพื่อเริ่มตอบคำถามและสะสมคะแนน</p>
          </div>
        </div>
      </div>
    </div>
  );
}
