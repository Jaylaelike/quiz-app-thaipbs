import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const post = await db.question.create({
      data: {
        content: body.content,
        status: body.status,
        userId: body.userId
      },
    });
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 }
    );
  }
}
