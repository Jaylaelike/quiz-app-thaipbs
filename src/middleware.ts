import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
// export default authMiddleware({});

export default authMiddleware({
  publicRoutes: [
    "/api/users/create",
    "/api/questions/",
    "/api/questions/create",
    "/api/answers/create",
    "/api/rewards/",
    "/api/rewards",
    "/api/questions/",
    "/api/users",
    "/api/answers/",
    "/api/answers",
    "/api/answers/[answerId]"
  ],

  
  
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
