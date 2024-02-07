// import { db } from "../../../lib/db";
// import { NextResponse } from "next/server";
// export async function POST(req: Request){
//     try{
//         const body = await req.json();

//         const post = await db.post.create({
//             data: {
//                 title: body.title,
//                 content: body.content,
//                 tagId: body.tagId
//             },
//         });
//         return NextResponse.json(post, { status: 200 });
//     }
//     catch(error)
//     {
//         return NextResponse.json({message: "could not get post"}, {status: 500});
//     }
// }