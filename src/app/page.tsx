import RoleBasedHomePage from "./components/RoleBasedHomePage";
import WelcomeTransition from "./components/WelcomeTransition";
import db from "./lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Loader2, LogIn, LogOut, User, Trophy, Star, Users } from "lucide-react";
import { Suspense } from "react";

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

// Loading component for better UX
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-lg text-gray-600">กำลังโหลด...</p>
      </div>
    </div>
  );
}

// Enhanced Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎮 Quiz Game
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            เข้าสู่ระบบเพื่อเริ่มเล่นเกมตอบคำถาม
          </p>
          <p className="text-sm text-gray-500">
            สะสมคะแนนและแข่งขันกับเพื่อนๆ
          </p>
        </div>

        <div className="card w-full bg-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center mb-4">
              <User className="w-6 h-6 mr-2" />
              เข้าสู่ระบบ
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Trophy className="w-4 h-4" />
                <span>สะสมคะแนนและปลดล็อกความสำเร็จ</span>
              </div>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn btn-primary w-full">
                    <LogIn className="w-4 h-4 mr-2" />
                    เข้าสู่ระบบ
                  </button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <div className="space-y-3">
                  <p className="text-green-600 text-sm flex items-center justify-center">
                    <User className="w-4 h-4 mr-1" />
                    เข้าสู่ระบบแล้ว
                  </p>
                  <SignOutButton>
                    <button className="btn btn-outline btn-error w-full">
                      <LogOut className="w-4 h-4 mr-2" />
                      ออกจากระบบ
                    </button>
                  </SignOutButton>
                </div>
              </SignedIn>
            </div>
            
            <div className="divider text-xs">หรือ</div>
            <p className="text-xs text-gray-500 text-center">
              เล่นแบบไม่ต้องสมัครสมาชิก (คะแนนจะไม่ถูกบันทึก)
            </p>
          </div>
        </div>

        {/* Features showcase */}
        <div className="mt-8 grid grid-cols-1 gap-4 text-sm">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-blue-600 mb-2 flex items-center">
              <Trophy className="w-4 h-4 mr-1" />
              ระบบคะแนน
            </h3>
            <p className="text-gray-600">สะสมคะแนนและแข่งขันในลีดเดอร์บอร์ด</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-purple-600 mb-2 flex items-center">
              <Star className="w-4 h-4 mr-1" />
              หลายหมวดหมู่
            </h3>
            <p className="text-gray-600">คำถามจากหลากหลายหมวดหมู่ความรู้</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-green-600 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              ชุมชน
            </h3>
            <p className="text-gray-600">เล่นและแข่งขันกับผู้เล่นคนอื่นๆ</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
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

    return (
      <>
        <WelcomeTransition />
        <RoleBasedHomePage />
      </>
    );
  }

  // If user is not signed in, show enhanced landing page
  return <LandingPage />;
}
