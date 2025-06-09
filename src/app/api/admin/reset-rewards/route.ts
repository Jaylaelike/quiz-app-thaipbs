import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { db } from "../../../lib/db"; // Using your specified import for Prisma client

// Define an interface for the expected structure of publicMetadata
interface UserPublicMetadata {
  role?: string; // Role can be optional or string
  // Add any other custom claims you store in publicMetadata
}

// No need to import User from @prisma/client for this specific route's logic with Clerk

export async function POST(request: NextRequest) { // Use NextRequest for Clerk
  const { userId, sessionClaims } = getAuth(request);

  // ---- ADDED FOR DEBUGGING ----
  console.log("Attempting reset by User ID (from Clerk):");
  console.log(userId);
  console.log("Full Session Claims from Clerk:");
  console.log(JSON.stringify(sessionClaims, null, 2));
  // -----------------------------

  // Check if user is signed in via Clerk
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized: Not logged in' }, { status: 401 });
  }

  // Admin role check has been removed as per user request.
  // WARNING: THIS IS A SECURITY RISK. Backend authorization is crucial.

  try {
    const deleteResult = await db.reward.deleteMany({}); // Use 'db' from your import
    return NextResponse.json({
      message: 'User rewards reset successfully.',
      count: deleteResult.count
    }, { status: 200 });
  } catch (error) {
    console.error('Error resetting rewards:', error);
    return NextResponse.json({ message: 'Internal Server Error: Could not reset rewards' }, { status: 500 });
  }
}

// You can add a GET handler if you want to prevent GET requests to this endpoint or provide info.
export async function GET(request: NextRequest) { // Use NextRequest for Clerk
  return NextResponse.json({ message: 'This endpoint resets rewards via POST request by an admin.' }, { status: 405 }); // Method Not Allowed
}
