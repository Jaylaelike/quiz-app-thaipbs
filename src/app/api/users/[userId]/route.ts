import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

interface contextProps {
  params: {
    userId: string;
  };
}

// export async function DELETE(req: Request, context: contextProps) {
//   try {
//     const { params } = context;

//     await db.post.delete({
//       where: {
//         id: params.userId,
//       },
//     });

//     return new Response(null, { status: 204 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "could not delete post" },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(req: Request, context: contextProps) {
//   try {
//     const { params } = context;

//     const body = await req.json();

//     await db.post.update({
//       where: {
//         id: params.userId,
//       },
//       data: {
//         title: body.title,
//         content: body.content,
//         tagId: body.tagId,
//       },
//     });

//     return NextResponse.json(
//       { message: `update id ${params.userId} success` },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "could not update post" },
//       { status: 500 }
//     );
//   }
// }


export async function GET(req: Request, context: contextProps){
    try{
      const { params } = context;
        const post = await db.user.findFirst({
            where: {
                id: params.userId
            },
            include: {
                Questions: true,
                Answers: true,
                Rewards: true

            }
    
        });
        return NextResponse.json(post, { status: 200 });
    }
    catch
    {
        return NextResponse.json({message: "could not get post"}, {status: 500});
    }
}