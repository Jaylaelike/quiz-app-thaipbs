import { db } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const questions = await db.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        answers: {
          include: {
            user: true,
          },
        },
      },
    });
    
    return NextResponse.json(questions, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { message: "Could not fetch questions", error: error.message },
      { status: 500 }
    );
  }
}
