import { db } from "../../../lib/db";
import { revalidateData } from "../../../lib/revalidation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const post = await db.question.create({
      data: {
        content: body.content,
        status: body.status,
        userId: body.userId,
        rewardPoints: body.rewardPoints || 5
      },
    });

    // Revalidate cache after successful creation
    await revalidateData('/', ['questions']);
    
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { message: "Could not create question", error: error.message },
      { status: 500 }
    );
  }
}
