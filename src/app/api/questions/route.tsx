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
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { message: "could not get questions" },
      { status: 500 }
    );
  }
}
