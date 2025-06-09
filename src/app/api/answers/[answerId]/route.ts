import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

interface contextProps {
  params: {
    answerId: string;
  };
}

export async function DELETE(req: Request, context: contextProps) {
  try {
    const { params } = context;

    await db.answer.delete({
      where: {
        id: params.answerId,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not delete post" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: contextProps) {
  try {
    const { params } = context;

    const body = await req.json();

    await db.answer.update({
      where: {
        id: params.answerId,
      },
      data: {
        content: body.content,
        isCorrect: body.isCorrect,
        questionId: body.questionId,
        userId: body.userId

      },
    });

    // If the answer is marked as correct, update the user's reward points
    if (body.isCorrect && body.userId) {
      const pointsToAward = 10; // Define points for a correct answer

      const existingReward = await db.reward.findFirst({
        where: { userId: body.userId },
      });

      if (existingReward) {
        await db.reward.update({
          where: { id: existingReward.id },
          data: { points: { increment: pointsToAward } },
        });
      } else {
        await db.reward.create({
          data: {
            userId: body.userId,
            points: pointsToAward,
          },
        });
      }
    }

    return NextResponse.json(
      { message: `update id ${params.answerId} success` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "could not update post" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, context: contextProps) {
  try {
    const { params } = context;
    const post = await db.answer.findFirst({
      where: {
        id: params.answerId,
      },
      include: {
        user: true,
        question: true,
      },
    });
    return NextResponse.json(post, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "could not get questions" },
      { status: 500 }
    );
  }
}
