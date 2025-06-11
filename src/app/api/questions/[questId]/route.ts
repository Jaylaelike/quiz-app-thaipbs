import { db } from "../../../lib/db";
import { revalidateData } from "../../../lib/revalidation";
import { NextResponse } from "next/server";

interface contextProps {
  params: {
    questId: string;
  };
}

export async function DELETE(req: Request, context: contextProps) {
  try {
    const { params } = context;

    await db.question.delete({
      where: {
        id: params.questId,
      },
      include: {
        answers: true,
      },
    });

    // Revalidate cache after successful deletion
    await revalidateData('/', ['questions']);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { message: "Could not delete question", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: contextProps) {
  try {
    const { params } = context;
    const body = await req.json();

    await db.question.update({
      where: {
        id: params.questId,
      },
      data: {
        content: body.content,
        status: body.status,
        rewardPoints: body.rewardPoints,
      },
    });

    // Revalidate cache after successful update
    await revalidateData('/', ['questions']);

    return NextResponse.json(
      { message: `Updated question ${params.questId} successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { message: "Could not update question", error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req: Request, context: contextProps) {
  try {
    const { params } = context;
    const post = await db.question.findFirst({
      where: {
        id: params.questId,
      },
      include: {
        user: true,
        answers: {
          include: {
            user: true,
          }
        },
      }
    });
    
    return NextResponse.json(post, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { message: "Could not fetch question", error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}