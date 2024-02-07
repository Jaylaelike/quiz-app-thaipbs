import { db } from "../../../lib/db";
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

    await db.question.update({
      where: {
        id: params.questId,
      },
      data: {
        content: body.content,
        status: body.status,
      },
    });

    return NextResponse.json(
      { message: `update id ${params.questId} success` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "could not update post" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request, context: contextProps){
    try{
      const { params } = context;
        const post = await db.question.findFirst({
            where: {
                id: params.questId,
            },
            include: {
              user: true,
              Answers: true,


            }
    
        });
        return NextResponse.json(post, { status: 200 });
    }
    catch
    {
        return NextResponse.json({message: "could not get questions"}, {status: 500});
    }
}