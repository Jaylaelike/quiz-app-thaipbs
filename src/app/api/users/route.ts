import { db } from "../../lib/db";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const tags = await db.user.findMany({
      include: {
       Rewards: true,
      },
      orderBy: {
        id: "desc",
      },
    });
    return NextResponse.json(tags, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "could not get tags" },
      { status: 500 }
    );
  }
}
