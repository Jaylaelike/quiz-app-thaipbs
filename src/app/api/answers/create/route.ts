import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const post = await db.answer.create({
      data: {
        content: body.content,
        isCorrect: body.isCorrect,
        questionId: body.questionId,
        userId: body.userId,
        createdAt : new Date()
      },
    });

    // If the answer is created as correct, potentially update the user's reward points
    if (body.isCorrect && body.userId) {
      // Fetch the user to check their role
      const user = await db.user.findUnique({
        where: { id: body.userId },
        select: { role: true },
      });

      // Only award points if the user is not an admin
      if (user && user.role !== 'admin') {
        // Fetch the question to get its point value
        const question = await db.question.findUnique({
          where: { id: body.questionId },
          select: { rewardPoints: true }, // Changed 'points' to 'rewardPoints'
        });

        if (!question) {
          console.error(`Question with ID ${body.questionId} not found. Cannot award points.`);
          // Decide if you want to return an error or just log and continue
        } else {
          const pointsToAward = question.rewardPoints ?? 0; // Use rewardPoints from the Question model, default to 0 if null/undefined

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
      } else if (user && user.role === 'admin') {
        console.log(`Admin user ${body.userId} created a correct answer. No points awarded.`);
      }
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 }
    );
  }
}
