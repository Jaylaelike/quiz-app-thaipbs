import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const post = await db.user.create({
      data: {
        username: body.username,
        email: body.email,
      },
    });
    //create a new user Reward initally set to 0
    await db.reward.create({
      data: {
        points: 0,
        userId: post.id,
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
