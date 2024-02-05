
import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

interface contextProps {
  params: {
    rewardsId: string;
  };
}



export async function PATCH(req: Request, context: contextProps) {
  try {
    const body = await req.json();

    const post = await db.reward.update({
      where: {
      id: context.params.rewardsId
      },

      data: {
       points: body.points,
       userId: body.rewardsId
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
